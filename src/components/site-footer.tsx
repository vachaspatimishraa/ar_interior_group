import Link from "next/link";
import type { CSSProperties } from "react";
import { ContactEnquiryLink } from "@/components/contact-enquiry-link";
import { SiteBrand } from "@/components/site-brand";
import { companyAboutProfile, contact } from "@/data/company-profile";

const footerNavigation = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/projects", label: "Projects" },
  { href: "/clients", label: "Clients" },
  { href: "/contact", label: "Contact" },
] as const;

const footerSocials = [
  { href: contact.linkedin, label: "LinkedIn" },
  { href: contact.instagram, label: "Instagram" },
  { href: contact.googleBusiness, label: "Google Business" },
] as const;

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer" aria-label="AR Interior Group site footer" data-site-footer>
      <div className="site-footer-shell">
        <div className="site-footer-layout">
          <div className="site-footer-identity">
            <div className="site-footer-brand" data-footer-reveal style={{ "--footer-reveal-delay": "0ms" } as CSSProperties}>
              <SiteBrand variant="footer" />
            </div>
            <p className="site-footer-positioning" data-footer-reveal style={{ "--footer-reveal-delay": "120ms" } as CSSProperties}>
              {companyAboutProfile.positioning}
            </p>
            <p className="site-footer-tagline" data-footer-reveal style={{ "--footer-reveal-delay": "220ms" } as CSSProperties}>
              {companyAboutProfile.tagline}
            </p>
          </div>

          <nav className="site-footer-navigation" aria-label="Footer navigation">
            <p className="site-footer-label" data-footer-reveal style={{ "--footer-reveal-delay": "300ms" } as CSSProperties}>Explore</p>
            <ul>
              {footerNavigation.map(({ href, label }, index) => (
                <li key={href} data-footer-reveal style={{ "--footer-reveal-delay": `${360 + index * 55}ms` } as CSSProperties}>
                  <Link href={href} className="site-footer-link">{label}<span aria-hidden="true">↗</span></Link>
                </li>
              ))}
            </ul>
          </nav>

          <address className="site-footer-contact">
            <p className="site-footer-label" data-footer-reveal style={{ "--footer-reveal-delay": "560ms" } as CSSProperties}>Contact</p>
            <a className="site-footer-contact-link" href={contact.phoneHref} data-footer-reveal style={{ "--footer-reveal-delay": "620ms" } as CSSProperties}>{contact.phone}</a>
            <a className="site-footer-contact-link site-footer-email" href={`mailto:${contact.email}`} data-footer-reveal style={{ "--footer-reveal-delay": "680ms" } as CSSProperties}>{contact.email}</a>
            <nav className="site-footer-socials" aria-label="AR Interior Group external links">
              {footerSocials.map(({ href, label }, index) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`AR Interior Group on ${label} (opens in a new tab)`}
                  className="site-footer-social"
                  data-footer-reveal
                  style={{ "--footer-reveal-delay": `${740 + index * 55}ms` } as CSSProperties}
                >
                  {label}<span aria-hidden="true">↗</span>
                </a>
              ))}
            </nav>
          </address>

          <div className="site-footer-cta">
            <p data-footer-reveal style={{ "--footer-reveal-delay": "850ms" } as CSSProperties}>Have a space in mind?</p>
            <ContactEnquiryLink className="site-footer-cta-link" data-footer-reveal style={{ "--footer-reveal-delay": "920ms" } as CSSProperties}>
              Discuss Your Space <span aria-hidden="true">→</span>
            </ContactEnquiryLink>
          </div>

          <div className="site-footer-meta" data-footer-reveal style={{ "--footer-reveal-delay": "1050ms" } as CSSProperties}>
            <span>© {year} AR Interior Group</span>
            <a href="#" className="site-footer-top">Back to top <span aria-hidden="true">↑</span></a>
          </div>
        </div>
      </div>
    </footer>
  );
}
