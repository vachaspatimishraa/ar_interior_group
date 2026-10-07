"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

export function RevealObserver() {
  const pathname = usePathname();

  useEffect(() => {
    const root = document.documentElement;
    root.removeAttribute("data-reveal-ready");
    const sections = [...document.querySelectorAll<HTMLElement>("main:not(.homepage, .about-page, .services-page, .clients-page, .projects-page, .contact-page) > section:not([aria-label])")];
    const footer = document.querySelector<HTMLElement>("footer[data-site-footer]");
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion || !("IntersectionObserver" in window) || (sections.length === 0 && !footer)) return;

    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const target = entry.target as HTMLElement;
        if (target === footer) target.dataset.footerRevealState = "visible";
        else target.dataset.revealState = "visible";
        observer.unobserve(entry.target);
      }
    }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });

    for (const section of sections) {
      const { top } = section.getBoundingClientRect();
      section.dataset.revealState = top < window.innerHeight * 0.86 ? "visible" : "hidden";
      observer.observe(section);
    }
    if (footer) {
      const { top } = footer.getBoundingClientRect();
      footer.dataset.footerRevealState = top < window.innerHeight * 0.86 ? "visible" : "hidden";
      observer.observe(footer);
    }
    root.dataset.revealReady = "true";

    return () => {
      observer.disconnect();
      root.removeAttribute("data-reveal-ready");
      footer?.removeAttribute("data-footer-reveal-state");
    };
  }, [pathname]);

  return null;
}
