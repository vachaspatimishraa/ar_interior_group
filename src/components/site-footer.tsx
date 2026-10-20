import type { CSSProperties } from "react";
import { ContactEnquiryLink } from "@/components/contact-enquiry-link";
import { companyAboutProfile, contact } from "@/data/company-profile";

const footerContactCards = [
  { label: "Email", value: contact.email, action: "Send Email", href: `mailto:${contact.email}`, icon: "✉", external: false },
  { label: "Phone", value: contact.phone, action: "Call Now", href: contact.phoneHref, icon: "⌕", external: false },
  { label: "LinkedIn", value: "AR Interior Group", action: "View Profile", href: contact.linkedin, icon: "in", external: true },
  { label: "Instagram", value: "A R Interior Group", action: "Connect", href: contact.instagram, icon: "◎", external: true },
  { label: "Google Business", value: "AR Interior Group", action: "View Profile", href: contact.googleBusiness, icon: "G", external: true },
] as const;

export function SiteFooter() {
  return (
    <footer className="site-footer" aria-label="AR Interior Group site footer" data-site-footer>
      <div className="site-footer-shell">
        <section id="footer-connect" className="site-footer-connect" aria-labelledby="footer-connect-title">
          <ContactEnquiryLink className="site-footer-kicker" data-footer-reveal style={{ "--footer-reveal-delay": "0ms" } as CSSProperties}>Get in touch</ContactEnquiryLink>
          <h2 id="footer-connect-title" data-footer-reveal style={{ "--footer-reveal-delay": "100ms" } as CSSProperties}>Let&apos;s plan &amp; build your next space.</h2>
          <p className="site-footer-intro" data-footer-reveal style={{ "--footer-reveal-delay": "180ms" } as CSSProperties}>{companyAboutProfile.positioning} Share the location, intended use and priorities to start a conversation about your brief.</p>
          <div className="site-footer-contact-grid">
            {footerContactCards.map((card, index) => (
              <article className="site-footer-contact-card" key={card.label} data-footer-reveal style={{ "--footer-reveal-delay": `${280 + index * 80}ms` } as CSSProperties}>
                <span className="site-footer-card-icon" aria-hidden="true">{card.icon}</span>
                <div className="site-footer-card-content"><span className="site-footer-card-label">{card.label}</span><strong>{card.value}</strong></div>
                <a className="site-footer-card-action" href={card.href} target={card.external ? "_blank" : undefined} rel={card.external ? "noreferrer" : undefined}>{card.action} <span aria-hidden="true">↗</span></a>
              </article>
            ))}
          </div>
        </section>

      </div>
    </footer>
  );
}
