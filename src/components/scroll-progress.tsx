"use client";

import { useEffect, useRef } from "react";

/** Keeps the small header progress cue in sync without re-rendering the site shell on every scroll. */
export function ScrollProgress() {
  const progressRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const progress = progressRef.current;
    if (!progress) return;

    let frame = 0;

    const update = () => {
      frame = 0;
      const scrollableDistance = document.documentElement.scrollHeight - window.innerHeight;
      const ratio = scrollableDistance > 0 ? Math.min(1, Math.max(0, window.scrollY / scrollableDistance)) : 0;
      progress.style.transform = `scaleX(${ratio})`;
    };

    const scheduleUpdate = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);
    const resizeObserver = new ResizeObserver(scheduleUpdate);
    resizeObserver.observe(document.documentElement);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <div className="site-scroll-progress" aria-hidden="true">
      <span ref={progressRef} />
    </div>
  );
}
