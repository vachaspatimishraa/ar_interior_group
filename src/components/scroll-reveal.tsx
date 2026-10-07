"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { shouldUseStaticReveals } from "@/lib/motion/reveal-attributes";

type ScrollRevealProps = { scope: "homepage" | "about-page" | "services-page" | "clients-page" | "projects-page" | "contact-page" };

/** One lightweight observer for the marked sections and content on a page. */
export function ScrollReveal({ scope }: ScrollRevealProps) {
  const pathname = usePathname();

  useEffect(() => {
    const root = document.querySelector<HTMLElement>(`main.${scope}`);
    if (!root) return;

    const items = [...root.querySelectorAll<HTMLElement>("[data-scroll-reveal]")];
    const targets = items;
    const sections = scope === "about-page" || scope === "services-page" || scope === "clients-page" || scope === "projects-page" || scope === "contact-page"
      ? [...root.querySelectorAll<HTMLElement>("[data-scroll-section]")]
      : [];
    const observationTargets = sections.length > 0 ? sections : targets;
    const staggerTargets: HTMLElement[] = [];
    const animationHandlers = new Map<HTMLElement, (event: AnimationEvent) => void>();
    const animationTimeouts = new Map<HTMLElement, number>();
    const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let observer: IntersectionObserver | undefined;
    let staticMode = false;
    let active = true;

    const markImageFailure = (image: HTMLImageElement) => {
      const frame = image.parentElement;
      if (!frame) return;
      frame.dataset.assetFallback = image.alt || "Image unavailable";
      if (getComputedStyle(frame).position === "static") frame.style.position = "relative";
      image.dataset.assetFailed = "true";
    };
    const onImageError = (event: Event) => {
      if (event.target instanceof HTMLImageElement) markImageFailure(event.target);
    };

    const completeTarget = (target: HTMLElement) => {
      target.dataset.scrollState = "complete";
      const handler = animationHandlers.get(target);
      if (handler) target.removeEventListener("animationend", handler);
      animationHandlers.delete(target);
      const timeout = animationTimeouts.get(target);
      if (timeout !== undefined) window.clearTimeout(timeout);
      animationTimeouts.delete(target);
    };

    const revealTarget = (target: HTMLElement) => {
      if (!active || target.dataset.scrollState) return;
      target.dataset.scrollState = "visible";
      const onAnimationDone = (event: AnimationEvent) => {
        if (event.target === target) completeTarget(target);
      };
      animationHandlers.set(target, onAnimationDone);
      target.addEventListener("animationend", onAnimationDone);

      const animatedElement = getComputedStyle(target);
      const toMilliseconds = (duration: string) => {
        const value = Number.parseFloat(duration) || 0;
        return duration.trim().endsWith("ms") ? value : value * 1000;
      };
      const finishAfter = Math.max(
        2500,
        toMilliseconds(animatedElement.animationDuration) + toMilliseconds(animatedElement.animationDelay) + 150,
      );
      animationTimeouts.set(target, window.setTimeout(() => completeTarget(target), finishAfter));
    };

    const revealSection = (section: HTMLElement) => {
      const sectionItems = targets.filter((target) => section.contains(target));
      if (sectionItems.length === 0) revealTarget(section);
      else sectionItems.forEach(revealTarget);
    };

    const revealObservationTarget = (target: HTMLElement) => {
      if (sections.length > 0 && sections.includes(target)) revealSection(target);
      else revealTarget(target);
    };

    const revealAll = () => {
      targets.forEach((target) => completeTarget(target));
      animationHandlers.clear();
    };

    const applyStaggerDelays = () => {
      for (const group of root.querySelectorAll<HTMLElement>("[data-scroll-stagger]")) {
        const interval = Number(group.dataset.staggerInterval) || 90;
        const children = [...group.children].filter((child): child is HTMLElement => child instanceof HTMLElement);
        children.forEach((child, index) => {
          const inheritedDelay = Number.parseFloat(getComputedStyle(child).getPropertyValue("--scroll-stagger-delay")) || 0;
          child.style.setProperty("--scroll-stagger-delay", `${inheritedDelay + index * interval}ms`);
          staggerTargets.push(child);
        });
      }

      for (const target of targets) {
        if (target.dataset.revealDelay !== undefined) {
          target.style.setProperty("--scroll-custom-delay", `${Number(target.dataset.revealDelay)}ms`);
        }
      }
    };

    const activate = () => {
      observer?.disconnect();
      if (shouldUseStaticReveals(motionPreference.matches, "IntersectionObserver" in window)) {
        staticMode = true;
        root.dataset.scrollMotion = "static";
        revealAll();
        return;
      }

      if (staticMode) return;
      root.dataset.scrollMotion = "active";
      const observerMargin = window.innerHeight * 0.08;
      try {
        observer = new IntersectionObserver((entries) => {
          for (const entry of entries) {
            if (!entry.isIntersecting) continue;
            revealObservationTarget(entry.target as HTMLElement);
            observer?.unobserve(entry.target);
          }
        }, { threshold: 0.08, rootMargin: "0px 0px -8% 0px" });
      } catch {
        staticMode = true;
        root.dataset.scrollMotion = "static";
        revealAll();
        return;
      }

      observationTargets.forEach((target) => {
        const bounds = target.getBoundingClientRect();
        // Hash navigation, browser scroll restoration, and a tall target can put
        // the target's top above the viewport without ever producing a fresh
        // observer crossing. Reveal any target already occupying the viewport.
        if (bounds.bottom <= 0) {
          if (sections.includes(target)) targets.filter((item) => target.contains(item)).forEach(completeTarget);
          else completeTarget(target);
        } else if (bounds.top < window.innerHeight - observerMargin && bounds.bottom > observerMargin) revealObservationTarget(target);
        else observer?.observe(target);
      });
    };

    let scrollFrame = 0;
    const revealAtCurrentScroll = () => {
      scrollFrame = 0;
      if (!active || staticMode) return;
      for (const target of observationTargets) {
        if (sections.length === 0 && target.dataset.scrollState) continue;
        const bounds = target.getBoundingClientRect();
        if (bounds.bottom <= 0) {
          if (sections.includes(target)) targets.filter((item) => target.contains(item)).forEach(completeTarget);
          else completeTarget(target);
        }
        else if (bounds.top < window.innerHeight && bounds.bottom > 0) {
          revealObservationTarget(target);
          observer?.unobserve(target);
        }
      }
    };
    const scheduleScrollCheck = () => {
      if (!scrollFrame) scrollFrame = window.requestAnimationFrame(revealAtCurrentScroll);
    };

    applyStaggerDelays();
    root.addEventListener("error", onImageError, true);
    root.querySelectorAll<HTMLImageElement>("img").forEach((image) => {
      if (image.complete && image.naturalWidth === 0) markImageFailure(image);
    });
    activate();
    window.addEventListener("scroll", scheduleScrollCheck, { passive: true });
    window.addEventListener("resize", scheduleScrollCheck);
    scheduleScrollCheck();
    motionPreference.addEventListener("change", activate);

    return () => {
      active = false;
      window.cancelAnimationFrame(scrollFrame);
      observer?.disconnect();
      window.removeEventListener("scroll", scheduleScrollCheck);
      window.removeEventListener("resize", scheduleScrollCheck);
      root.removeEventListener("error", onImageError, true);
      motionPreference.removeEventListener("change", activate);
      animationHandlers.forEach((handler, target) => target.removeEventListener("animationend", handler));
      animationHandlers.clear();
      animationTimeouts.forEach((timeout) => window.clearTimeout(timeout));
      animationTimeouts.clear();
      delete root.dataset.scrollMotion;
      targets.forEach((target) => {
        delete target.dataset.scrollState;
        target.style.removeProperty("--scroll-custom-delay");
      });
      staggerTargets.forEach((target) => target.style.removeProperty("--scroll-stagger-delay"));
    };
  }, [pathname, scope]);

  return null;
}
