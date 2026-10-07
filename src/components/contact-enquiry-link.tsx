"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentProps, MouseEvent, ReactNode } from "react";

type ContactEnquiryLinkProps = Omit<ComponentProps<typeof Link>, "href" | "children"> & { children: ReactNode };

function focusEnquiry() {
  const target = document.getElementById("enquiry-form");
  const heading = document.getElementById("enquiry-form-title");
  if (!target || !heading) return;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
  heading.focus({ preventScroll: true });
}

export function ContactEnquiryLink({ children, onClick, ...props }: ContactEnquiryLinkProps) {
  const pathname = usePathname();
  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    onClick?.(event);
    if (event.defaultPrevented || pathname !== "/contact") return;
    event.preventDefault();
    if (window.location.hash !== "#enquiry-form") window.location.hash = "#enquiry-form";
    requestAnimationFrame(focusEnquiry);
  }

  return <Link href="/contact#enquiry-form" {...props} onClick={handleClick}>{children}</Link>;
}
