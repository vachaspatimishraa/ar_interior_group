"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ContactEnquiryLink } from "@/components/contact-enquiry-link";
import { ScrollProgress } from "@/components/scroll-progress";
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
  { id: "projects", label: "Projects" },
  { id: "clients", label: "Clients" },
  ...(verifiedOngoingProjects.length > 0
    ? [{ id: "ongoing-projects", label: "Ongoing Projects" }]
    : []),
  { id: "presence", label: "Presence" },
  { id: "contact", label: "Contact" },
];

export function SiteHeader() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("home");
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    if (typeof window === "undefined") return "light";
    return window.localStorage.getItem("ar-theme") === "dark" ? "dark" : "light";
  });
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();
  const isHome = pathname === "/";

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  useEffect(() => {
    document.body.classList.toggle("mobile-menu-open", isOpen);
    return () => document.body.classList.remove("mobile-menu-open");
  }, [isOpen]);

  useEffect(() => {
    const landscapeQuery = window.matchMedia("(orientation: landscape)");
    const closeMenuForLandscape = () => {
      if (landscapeQuery.matches) setIsOpen(false);
    };

    closeMenuForLandscape();
    landscapeQuery.addEventListener("change", closeMenuForLandscape);
    return () => landscapeQuery.removeEventListener("change", closeMenuForLandscape);
  }, []);

  function toggleTheme() {
    setTheme((current) => {
      const nextTheme = current === "dark" ? "light" : "dark";
      document.documentElement.dataset.theme = nextTheme;
      window.localStorage.setItem("ar-theme", nextTheme);
      return nextTheme;
    });
  }

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

  function isActiveItem(id: string) {
    if (isHome) return activeSection === id;
    return pathname === `/${id}` || pathname.startsWith(`/${id}/`);
  }

  function restoreMenuFocus() {
    if (!isOpen) return;
    window.requestAnimationFrame(() => menuButtonRef.current?.focus());
  }

  function handleAnchorClick(event: React.MouseEvent<HTMLAnchorElement>, id: string) {
    if (isHome) {
      const target = document.getElementById(id);
      if (target) {
        event.preventDefault();
        setIsOpen(false);
        restoreMenuFocus();
        const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
        if (window.location.hash !== `#${id}`) {
          window.history.pushState(null, "", `#${id}`);
        }
        setActiveSection(id);
      }
    } else {
      setIsOpen(false);
      restoreMenuFocus();
    }
  }

  // The current homepage hero is light, so its header uses the same readable
  // surface as the rest of the site rather than a dark cinematic overlay.
  const isTransparentHero = false;

  return (
    <header
      className={`site-header sticky top-0 inset-x-0 z-50 transition-all duration-300 ${
        isTransparentHero
          ? "bg-gradient-to-b from-ink/75 via-ink/30 to-transparent text-page"
          : "bg-ivory/95 border-b border-ink/10 text-ink shadow-[0_2px_12px_rgba(28,28,28,0.04)]"
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
      <div className="site-header-shell mx-auto flex max-w-[1440px] items-center justify-between px-6 py-4 sm:px-8 lg:px-12 lg:py-5">
        <SiteBrand variant="header" />

        <nav className="site-header-navigation hidden items-center gap-7 lg:gap-8 xl:flex" aria-label="Primary navigation">
          {navigation.map((item) => {
            const isActive = isActiveItem(item.id);
            return (
              <a
                key={item.id}
                href={getHref(item.id)}
                className={`nav-link text-xs uppercase tracking-[0.14em] font-medium transition-colors relative py-1 ${
                  isActive
                    ? isTransparentHero ? "text-gold font-semibold" : "text-gold-ink font-semibold"
                    : isTransparentHero ? "text-page/80 hover:text-page" : "text-ink/80 hover:text-ink"
                }`}
                aria-current={isActive ? (isHome ? "location" : "page") : undefined}
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
          <button className="theme-toggle" type="button" aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"} aria-pressed={theme === "dark"} onClick={toggleTheme}>
            <span aria-hidden="true">{theme === "dark" ? "☼" : "☾"}</span>
          </button>
          <ContactEnquiryLink
            className="site-header-cta"
            onClick={(e) => handleAnchorClick(e as unknown as React.MouseEvent<HTMLAnchorElement>, "footer-connect")}
          >
            Get in Touch <span aria-hidden="true">→</span>
          </ContactEnquiryLink>
        </nav>

        <div className="site-mobile-actions xl:hidden">
          <button className="theme-toggle" type="button" aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"} aria-pressed={theme === "dark"} onClick={toggleTheme}>
            <span aria-hidden="true">{theme === "dark" ? "☼" : "☾"}</span>
          </button>
          <button
            ref={menuButtonRef}
            className={`menu-toggle relative z-10 flex h-11 w-11 items-center justify-center border rounded-full transition-colors ${
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
      </div>

      {isOpen && <button className="site-mobile-backdrop xl:hidden" type="button" aria-label="Close menu" onClick={() => setIsOpen(false)} />}
      <div
        id="mobile-navigation"
        className={`site-mobile-panel xl:hidden ${
          isOpen ? "site-mobile-panel-open" : "site-mobile-panel-closed"
        }`}
        inert={!isOpen}
      >
        <nav className="flex flex-col pb-7 pt-2" aria-label="Mobile navigation">
          {navigation.map((item) => {
            const isActive = isActiveItem(item.id);
            return (
              <a
                key={item.id}
                className={`border-t border-ink/10 py-3.5 text-xs uppercase tracking-[0.16em] transition-colors flex items-center justify-between ${
                  isActive ? "text-gold-ink font-semibold" : "text-ink/80 hover:text-ink"
                }`}
                href={getHref(item.id)}
                aria-current={isActive ? (isHome ? "location" : "page") : undefined}
                onClick={(e) => handleAnchorClick(e, item.id)}
              >
                <span>{item.label}</span>
                {isActive && <span className="h-1.5 w-1.5 rounded-full bg-gold-ink" aria-hidden="true" />}
              </a>
            );
          })}
          <ContactEnquiryLink
            className="site-header-cta site-header-cta-mobile mt-4 w-full"
            onClick={(e) => handleAnchorClick(e as unknown as React.MouseEvent<HTMLAnchorElement>, "footer-connect")}
          >
            Get in Touch <span aria-hidden="true">→</span>
          </ContactEnquiryLink>
        </nav>
      </div>
      <ScrollProgress />
    </header>
  );
}
