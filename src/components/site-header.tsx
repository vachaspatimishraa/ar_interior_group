"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ContactEnquiryLink } from "@/components/contact-enquiry-link";
import { SiteBrand } from "@/components/site-brand";

import { verifiedOngoingProjects } from "@/components/ongoing-projects-section";

export type NavItem = {
  id: string;
  label: string;
};

const navigation: NavItem[] = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "services", label: "Services" },
  { id: "clients", label: "Clients" },
  { id: "projects", label: "Projects" },
  ...(verifiedOngoingProjects.length > 0
    ? [{ id: "ongoing-projects", label: "Ongoing Projects" }]
    : []),
  { id: "offices", label: "Offices" },
  { id: "contact", label: "Contact" },
];

export function SiteHeader() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("home");
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();
  const isHome = pathname === "/";

  // Track scroll position to adapt header background from cinematic hero to ivory sticky header
  useEffect(() => {
    function handleScroll() {
      setIsScrolled(window.scrollY > 60);
    }
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Track active section on the single-page experience
  useEffect(() => {
    if (!isHome) return;

    const sectionElements = navigation
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => el !== null);

    if (sectionElements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        }
      },
      { rootMargin: "-25% 0px -55% 0px", threshold: 0 }
    );

    for (const el of sectionElements) {
      observer.observe(el);
    }

    return () => observer.disconnect();
  }, [isHome]);

  function getHref(id: string) {
    return isHome ? `#${id}` : `/#${id}`;
  }

  function handleAnchorClick(event: React.MouseEvent<HTMLAnchorElement>, id: string) {
    if (isHome) {
      const target = document.getElementById(id);
      if (target) {
        event.preventDefault();
        setIsOpen(false);
        const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
        if (window.location.hash !== `#${id}`) {
          window.history.pushState(null, "", `#${id}`);
        }
        setActiveSection(id);
      }
    } else {
      setIsOpen(false);
    }
  }

  // Visual header theme: when at the top of home over the cinematic video hero, use transparent gradient.
  // When scrolled down into ivory content or on secondary pages, use ivory with charcoal text.
  const isTransparentHero = isHome && !isScrolled;

  return (
    <header
      className={`site-header sticky top-0 inset-x-0 z-50 transition-all duration-300 ${
        isTransparentHero
          ? "bg-gradient-to-b from-ink/75 via-ink/30 to-transparent text-page"
          : "bg-ivory/95 backdrop-blur-md border-b border-ink/10 text-ink shadow-[0_2px_12px_rgba(28,28,28,0.04)]"
      }`}
      data-home={isTransparentHero ? "true" : undefined}
      data-scrolled={isScrolled ? "true" : undefined}
      onKeyDown={(event) => {
        if (event.key === "Escape" && isOpen) {
          setIsOpen(false);
          menuButtonRef.current?.focus();
        }
      }}
    >
      <div className="mx-auto flex max-w-[1440px] items-center justify-between px-6 py-4 sm:px-8 lg:px-12 lg:py-5">
        <SiteBrand variant="header" />

        <nav className="hidden items-center gap-7 lg:gap-8 md:flex" aria-label="Primary navigation">
          {navigation.map((item) => {
            const isActive = isHome ? activeSection === item.id : false;
            return (
              <a
                key={item.id}
                href={getHref(item.id)}
                className={`nav-link text-xs uppercase tracking-[0.14em] font-medium transition-colors relative py-1 ${
                  isActive
                    ? isTransparentHero ? "text-gold font-semibold" : "text-gold-ink font-semibold"
                    : isTransparentHero ? "text-page/80 hover:text-page" : "text-ink/80 hover:text-ink"
                }`}
                aria-current={isActive ? "true" : undefined}
                onClick={(e) => handleAnchorClick(e, item.id)}
              >
                {item.label}
                {isActive && (
                  <span
                    className={`absolute bottom-0 left-0 right-0 h-0.5 rounded-full ${
                      isTransparentHero ? "bg-gold" : "bg-gold-ink"
                    }`}
                    aria-hidden="true"
                  />
                )}
              </a>
            );
          })}
          <ContactEnquiryLink
            className="button button-small button-dark"
            onClick={(e) => handleAnchorClick(e as unknown as React.MouseEvent<HTMLAnchorElement>, "contact")}
          >
            Start a conversation
          </ContactEnquiryLink>
        </nav>

        <button
          ref={menuButtonRef}
          className={`menu-toggle relative z-10 flex h-11 w-11 items-center justify-center border rounded-full md:hidden transition-colors ${
            isTransparentHero ? "border-page/40 text-page" : "border-ink/20 text-ink"
          }`}
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
        className={`border-b border-ink/10 bg-ivory px-6 transition-[max-height,opacity] duration-300 md:hidden ${
          isOpen ? "max-h-[32rem] opacity-100 shadow-xl" : "max-h-0 overflow-hidden opacity-0"
        }`}
        inert={!isOpen}
      >
        <nav className="flex flex-col pb-7 pt-2" aria-label="Mobile navigation">
          {navigation.map((item) => {
            const isActive = isHome ? activeSection === item.id : false;
            return (
              <a
                key={item.id}
                className={`border-t border-ink/10 py-3.5 text-xs uppercase tracking-[0.16em] transition-colors flex items-center justify-between ${
                  isActive ? "text-gold-ink font-semibold" : "text-ink/80 hover:text-ink"
                }`}
                href={getHref(item.id)}
                aria-current={isActive ? "true" : undefined}
                onClick={(e) => handleAnchorClick(e, item.id)}
              >
                <span>{item.label}</span>
                {isActive && <span className="h-1.5 w-1.5 rounded-full bg-gold-ink" aria-hidden="true" />}
              </a>
            );
          })}
          <ContactEnquiryLink
            className="button button-dark mt-4 w-full"
            onClick={(e) => handleAnchorClick(e as unknown as React.MouseEvent<HTMLAnchorElement>, "contact")}
          >
            Start a conversation
          </ContactEnquiryLink>
        </nav>
      </div>
    </header>
  );
}
