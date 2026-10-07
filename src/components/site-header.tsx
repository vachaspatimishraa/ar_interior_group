"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef, useState } from "react";
import { ContactEnquiryLink } from "@/components/contact-enquiry-link";
import { SiteBrand } from "@/components/site-brand";

const navigation = [
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/projects", label: "Projects" },
  { href: "/clients", label: "Clients" },
];

export function SiteHeader() {
  const [isOpen, setIsOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();
  const isHome = pathname === "/";
  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header className="site-header absolute inset-x-0 top-0 z-50" data-home={isHome ? "true" : undefined} onKeyDown={(event) => {
      if (event.key === "Escape" && isOpen) {
        setIsOpen(false);
        menuButtonRef.current?.focus();
      }
    }}>
      <div className="mx-auto flex max-w-[1440px] items-center justify-between px-6 py-6 sm:px-8 lg:px-12 lg:py-8">
        <SiteBrand variant="header" />

        <nav className="hidden items-center gap-8 md:flex" aria-label="Primary navigation">
          {navigation.map((item) => (
            <Link key={item.href} className="nav-link" href={item.href} aria-current={isActive(item.href) ? "page" : undefined}>
              {item.label}
            </Link>
          ))}
          <ContactEnquiryLink className="button button-small button-dark" aria-current={pathname === "/contact" ? "page" : undefined}>
            Start a conversation
          </ContactEnquiryLink>
        </nav>

        <button
          ref={menuButtonRef}
          className="menu-toggle relative z-10 flex h-11 w-11 items-center justify-center border md:hidden"
          type="button"
          aria-expanded={isOpen}
          aria-controls="mobile-navigation"
          aria-label={isOpen ? "Close menu" : "Open menu"}
          onClick={() => setIsOpen((open) => !open)}
        >
          <span className="flex w-4 flex-col gap-1.5">
            <span className={`block h-px bg-current transition-transform ${isOpen ? "translate-y-[3px] rotate-45" : ""}`} />
            <span className={`block h-px bg-current transition-opacity ${isOpen ? "opacity-0" : ""}`} />
            <span className={`block h-px bg-current transition-transform ${isOpen ? "-translate-y-[3px] -rotate-45" : ""}`} />
          </span>
        </button>
      </div>

      <div
        id="mobile-navigation"
        className={`border-b border-ink/10 bg-ivory px-6 transition-[max-height,opacity] duration-300 md:hidden ${isOpen ? "max-h-96 opacity-100" : "max-h-0 overflow-hidden opacity-0"}`}
        inert={!isOpen}
      >
        <nav className="flex flex-col pb-7 pt-2" aria-label="Mobile navigation">
          {navigation.map((item) => (
            <Link
              key={item.href}
              className="border-t border-ink/10 py-4 text-sm uppercase tracking-[0.16em] text-ink"
              href={item.href}
              aria-current={isActive(item.href) ? "page" : undefined}
              onClick={() => setIsOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          <ContactEnquiryLink className="button button-dark mt-3 w-full" aria-current={isActive("/contact") ? "page" : undefined} onClick={() => setIsOpen(false)}>
            Start a conversation
          </ContactEnquiryLink>
        </nav>
      </div>
    </header>
  );
}
