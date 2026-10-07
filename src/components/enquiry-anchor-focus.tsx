"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

export function EnquiryAnchorFocus() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname !== "/contact" || window.location.hash !== "#enquiry-form") return;
    const focusTarget = () => {
      const target = document.getElementById("enquiry-form");
      const heading = document.getElementById("enquiry-form-title");
      if (!target || !heading) return;
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      target.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
      heading.focus({ preventScroll: true });
    };
    let second = 0;
    const first = window.requestAnimationFrame(() => { second = window.requestAnimationFrame(focusTarget); });
    return () => {
      window.cancelAnimationFrame(first);
      window.cancelAnimationFrame(second);
    };
  }, [pathname]);

  return null;
}
