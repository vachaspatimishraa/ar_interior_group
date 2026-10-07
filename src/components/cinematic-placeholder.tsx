"use client";

import Image from "next/image";
import Link from "next/link";
import { ContactEnquiryLink } from "@/components/contact-enquiry-link";
import { useEffect, useRef, useState } from "react";
import { homepage, homepageHeroStages } from "@/data/homepage";
import { getFrameIndex, getFrameNeighborhood, getSequenceMode, shouldUseStaticExperience, type SequenceMode } from "@/lib/cinematic/frame-utils";
import styles from "./cinematic-placeholder.module.css";

const sequences: Record<SequenceMode, { count: number; poster: string; folder: string }> = {
  desktop: {
    count: 96,
    poster: "/cinematic/poster-desktop.webp",
    folder: "/cinematic/desktop/",
  },
  mobile: {
    count: 60,
    poster: "/cinematic/poster-mobile.webp",
    folder: "/cinematic/mobile/",
  },
};

type NavigatorWithConnection = Navigator & {
  connection?: EventTarget & { saveData?: boolean };
};

export function CinematicPlaceholder() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mode, setMode] = useState<SequenceMode>("desktop");
  const [staticMode, setStaticMode] = useState(true);
  const [stage, setStage] = useState<string>(homepageHeroStages[0].label);
  const [readyMode, setReadyMode] = useState<SequenceMode | null>(null);

  useEffect(() => {
    const viewport = window.matchMedia("(max-width: 767px)");
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const connection = (navigator as NavigatorWithConnection).connection;

    const updatePreferences = () => {
      setMode(getSequenceMode(window.innerWidth));
      setStaticMode(shouldUseStaticExperience(motion.matches, Boolean(connection?.saveData)));
    };

    updatePreferences();
    viewport.addEventListener("change", updatePreferences);
    motion.addEventListener("change", updatePreferences);
    connection?.addEventListener("change", updatePreferences);

    return () => {
      viewport.removeEventListener("change", updatePreferences);
      motion.removeEventListener("change", updatePreferences);
      connection?.removeEventListener("change", updatePreferences);
    };
  }, []);

  useEffect(() => {
    if (staticMode) return;

    const section = sectionRef.current;
    const canvas = canvasRef.current;
    const sequence = sequences[mode];
    const context = canvas?.getContext("2d", { alpha: false });
    if (!section || !canvas || !context) return;

    const maxCacheSize = mode === "mobile" ? 8 : 12;
    const maxConcurrentLoads = 3;
    const cache = new Map<number, HTMLImageElement>();
    const queued = new Set<number>();
    const inFlight = new Map<number, HTMLImageElement>();
    const failed = new Set<number>();
    let active = true;
    let currentFrame = 0;
    let progress = 0;
    let animationFrame = 0;
    let poster: HTMLImageElement | null = null;
    let frameShown = false;

    const drawCover = (image: HTMLImageElement) => {
      if (!active || !image.naturalWidth || !image.naturalHeight) return;
      const bounds = canvas.getBoundingClientRect();
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      const width = Math.max(1, Math.round(bounds.width * ratio));
      const height = Math.max(1, Math.round(bounds.height * ratio));

      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }

      const scale = Math.max(width / image.naturalWidth, height / image.naturalHeight);
      const drawnWidth = image.naturalWidth * scale;
      const drawnHeight = image.naturalHeight * scale;
      context.drawImage(image, (width - drawnWidth) / 2, (height - drawnHeight) / 2, drawnWidth, drawnHeight);
    };

    const drawCurrent = () => {
      const frame = cache.get(currentFrame) ?? [...cache.entries()]
        .sort(([left], [right]) => Math.abs(left - currentFrame) - Math.abs(right - currentFrame))[0]?.[1];
      if (frame) {
        const exactFrame = cache.get(currentFrame);
        if (exactFrame) {
          cache.delete(currentFrame);
          cache.set(currentFrame, exactFrame);
        }
        drawCover(frame);
        if (!frameShown) {
          frameShown = true;
          setReadyMode(mode);
        }
      } else if (poster?.complete && poster.naturalWidth) {
        drawCover(poster);
      }
    };

    const framePath = (index: number) => `${sequence.folder}frame-${String(index + 1).padStart(4, "0")}.webp`;

    const pumpQueue = () => {
      if (!active) return;

      while (inFlight.size < maxConcurrentLoads && queued.size > 0) {
        const next = [...queued].sort((a, b) => Math.abs(a - currentFrame) - Math.abs(b - currentFrame))[0];
        queued.delete(next);
        if (cache.has(next) || inFlight.has(next)) continue;

        const image = new window.Image();
        inFlight.set(next, image);
        image.decoding = "async";
        image.onload = () => {
          inFlight.delete(next);
          if (!active) return;

          cache.delete(next);
          cache.set(next, image);
          while (cache.size > maxCacheSize) {
            const oldest = [...cache.keys()].find((key) => key !== currentFrame);
            if (oldest === undefined) break;
            cache.delete(oldest);
          }

          if (next === currentFrame) drawCurrent();
          pumpQueue();
        };
        image.onerror = () => {
          inFlight.delete(next);
          if (!active) return;
          failed.add(next);
          pumpQueue();
        };
        image.src = framePath(next);
      }
    };

    const requestNeighborhood = (center: number) => {
      queued.clear();
      for (const candidate of getFrameNeighborhood(center, sequence.count)) {
        if (!cache.has(candidate) && !inFlight.has(candidate) && !failed.has(candidate)) queued.add(candidate);
      }
      pumpQueue();
    };

    const updateScrollFrame = () => {
      if (!active) return;
      const bounds = section.getBoundingClientRect();
      const travel = Math.max(1, bounds.height - window.innerHeight);
      progress = Math.max(0, Math.min(1, -bounds.top / travel));
      currentFrame = getFrameIndex(progress, sequence.count);
      drawCurrent();
      requestNeighborhood(currentFrame);

      const nextStage = homepageHeroStages.find((item) => progress < item.limit)?.label ?? homepageHeroStages[homepageHeroStages.length - 1].label;
      setStage((previous) => (previous === nextStage ? previous : nextStage));
    };

    const scheduleUpdate = () => {
      window.cancelAnimationFrame(animationFrame);
      animationFrame = window.requestAnimationFrame(updateScrollFrame);
    };

    poster = new window.Image();
    poster.decoding = "async";
    poster.onload = () => {
      drawCurrent();
      scheduleUpdate();
    };
    poster.src = sequence.poster;

    const resizeObserver = new ResizeObserver(scheduleUpdate);
    resizeObserver.observe(section);
    resizeObserver.observe(canvas);
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);
    scheduleUpdate();

    return () => {
      active = false;
      window.cancelAnimationFrame(animationFrame);
      resizeObserver.disconnect();
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
      queued.clear();
      for (const image of inFlight.values()) {
        image.onload = null;
        image.onerror = null;
        image.removeAttribute("src");
      }
      inFlight.clear();
      if (poster) {
        poster.onload = null;
        poster.onerror = null;
        poster.removeAttribute("src");
      }
      cache.clear();
      failed.clear();
    };
  }, [mode, staticMode]);

  return (
    <section
      ref={sectionRef}
      className={`${styles.sequence} ${staticMode ? styles.reduced : ""}`}
      aria-label="Conceptual architectural design visualization"
      aria-describedby="cinematic-disclosure"
    >
      <div className={styles.sticky}>
        <picture>
          <source media="(max-width: 767px)" srcSet={sequences.mobile.poster} type="image/webp" />
          <Image src={sequences.desktop.poster} alt="Conceptual visualization of a commercial interior design" fill loading="eager" sizes="100vw" className={styles.poster} />
        </picture>
        {!staticMode && <canvas ref={canvasRef} className={`${styles.canvas} ${readyMode === mode ? styles.canvasReady : ""}`} aria-hidden="true" />}
        <div className={styles.scrim} />
        <div className={styles.text}>
          <span className={styles.eyebrow}>{homepage.hero.eyebrow}</span>
          <h1>
            {homepage.hero.heading}
            <br />
            <em>{homepage.hero.emphasis}</em>
          </h1>
          <p className={styles.stage} aria-live="off">{staticMode ? "Conceptual design visualization" : stage}</p>
          <div className={styles.actions}>
            <Link className={styles.primaryAction} href={homepage.hero.projects.href}>{homepage.hero.projects.label} <span aria-hidden="true">↗</span></Link>
            <ContactEnquiryLink className={styles.secondaryAction}>{homepage.hero.contact.label} <span aria-hidden="true">↗</span></ContactEnquiryLink>
          </div>
          <a href="#homepage-content" className={styles.skip}>Skip animation ↓</a>
          <p className={styles.disclosure} id="cinematic-disclosure">
            {homepage.hero.disclosure}
          </p>
        </div>
      </div>
    </section>
  );
}
