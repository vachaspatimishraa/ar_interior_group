import Image from "next/image";
import { connection } from "next/server";
import { ContactEnquiryLink } from "@/components/contact-enquiry-link";
import { ContactForm } from "@/components/contact-form";
import { CopyEmailButton } from "@/components/copy-email-button";
import { ScrollReveal } from "@/components/scroll-reveal";
import { contact } from "@/data/company-profile";
import { getEnquiryConfig } from "@/lib/enquiries/config";
import { ImageReveal, RevealItem, SectionReveal, StaggerGroup } from "@/lib/motion/reveal-attributes";
import { createPageMetadata } from "@/lib/page-metadata";
import "./contact.css";

export const metadata = createPageMetadata("Contact", "Contact AR Interior Group by email, phone, LinkedIn, Instagram, or Google Business for enquiries about interiors and fit-outs.", "/contact");

const socials = [
  ["LinkedIn", contact.linkedin],
  ["Instagram", contact.instagram],
  ["Google Business", contact.googleBusiness],
] as const;

export default async function ContactPage() {
  await connection();
  const onlineEnquiryAvailable = getEnquiryConfig() !== null;

  return (
    <main id="main-content" className="contact-page">
      <ScrollReveal scope="contact-page" />

      <section className="contact-hero" aria-labelledby="contact-page-title" {...SectionReveal()}>
        <div className="contact-shell contact-hero-grid">
          <div className="contact-hero-copy">
            <p className="eyebrow text-gold-ink" {...RevealItem({ kind: "eyebrow", delayMs: 350 })}>Contact · AR Interior Group</p>
            <h1 id="contact-page-title" className="contact-display" {...RevealItem({ kind: "heading", delayMs: 470 })}>Let’s talk<br />about your<br /><em>space.</em></h1>
            <p className="contact-hero-description" {...RevealItem({ kind: "copy", delayMs: 620 })}>For a commercial interior or fit-out enquiry, share a little about your space and what you have in mind. You can also reach us directly.</p>
            <ContactEnquiryLink className="contact-hero-action" {...RevealItem({ kind: "control", delayMs: 790 })}>Share an enquiry <span aria-hidden="true">↓</span></ContactEnquiryLink>
          </div>

          <figure className="contact-hero-figure" {...ImageReveal({ direction: "right", rounded: false, delayMs: 90 })}>
            <div className="contact-hero-frame">
              <Image src="/projects/technip-energies-noida/p30-img504-thumb.webp" alt="Workplace interior at Technip Energies, Noida" fill preload sizes="(max-width: 899px) 92vw, (max-width: 1199px) 56vw, 58vw" className="contact-cover-image" />
              <span className="contact-hero-line" aria-hidden="true" />
            </div>
            <figcaption><span>Technip Energies</span><span>Noida</span></figcaption>
          </figure>
        </div>
      </section>

      <section className="contact-channels" aria-labelledby="contact-channels-title" {...SectionReveal()}>
        <div className="contact-shell">
          <header className="contact-section-heading">
            <div {...StaggerGroup({ intervalMs: 100 })}>
              <p className="eyebrow text-gold-ink" {...RevealItem({ kind: "eyebrow", delayMs: 320 })}>Direct contact</p>
              <h2 id="contact-channels-title" className="contact-section-title" {...RevealItem({ kind: "heading", delayMs: 430 })}>Reach the team.</h2>
            </div>
            <p className="contact-section-note" {...RevealItem({ kind: "copy", delayMs: 560 })}>Choose the channel that works best for you.</p>
          </header>

          <div className="contact-channel-grid">
            <div className="contact-channel" {...RevealItem({ kind: "control", delayMs: 650 })}>
              <p className="eyebrow">Phone</p>
              <a className="contact-channel-link" href={contact.phoneHref}>{contact.phone}<span aria-hidden="true">↗</span></a>
            </div>
            <div className="contact-channel" {...RevealItem({ kind: "control", delayMs: 740 })}>
              <p className="eyebrow">Email</p>
              <a className="contact-channel-link contact-email-link" href={`mailto:${contact.email}`}>{contact.email}<span aria-hidden="true">↗</span></a>
            </div>
            <div className="contact-channel" {...RevealItem({ kind: "control", delayMs: 830 })}>
              <p className="eyebrow">Additional email</p>
              <a className="contact-channel-link contact-email-link" href={`mailto:${contact.secondaryEmail}`}>{contact.secondaryEmail}<span aria-hidden="true">↗</span></a>
            </div>
          </div>

          <div className="contact-social-row">
            <p className="eyebrow text-ink-muted" {...RevealItem({ kind: "copy", delayMs: 900 })}>Find us online</p>
            <nav aria-label="AR Interior Group social and business profiles" className="contact-social-links" {...StaggerGroup({ intervalMs: 70 })}>
              {socials.map(([name, url], index) => <a key={name} href={url} target="_blank" rel="noreferrer" {...RevealItem({ kind: "control", delayMs: 930 + index * 55 })}>{name}<span aria-hidden="true">↗</span></a>)}
            </nav>
          </div>
        </div>
      </section>

      <section id="enquiry-form" tabIndex={-1} className="contact-enquiry" aria-labelledby="enquiry-form-title" {...SectionReveal()}>
        <div className="contact-shell contact-enquiry-grid">
          <div className="contact-enquiry-intro">
            <p className="eyebrow text-gold-ink" {...RevealItem({ kind: "eyebrow", delayMs: 320 })}>Online enquiry</p>
            <h2 id="enquiry-form-title" tabIndex={-1} className="contact-section-title contact-form-title" {...RevealItem({ kind: "heading", delayMs: 430 })}>Tell us about your space.</h2>
            <p className="contact-section-note" {...RevealItem({ kind: "copy", delayMs: 570 })}>A few details will help us understand what you are planning. Required fields are marked; you can share the rest as it becomes clear.</p>
            <p className="contact-privacy-note" {...RevealItem({ kind: "copy", delayMs: 700 })}>The site does not store submissions. When configured, the secure email service processes the enquiry notification.</p>
          </div>

          <div className="contact-form-panel">
            {onlineEnquiryAvailable ? <ContactForm /> : (
              <div className="contact-unavailable" role="status">
                <p className="eyebrow text-gold-ink">Online submission unavailable</p>
                <p>This environment is not configured for secure email and rate-limited submissions. No message has been sent. Please contact AR Interior Group directly instead.</p>
                <a className="contact-fallback-link" href={`mailto:${contact.email}?subject=${encodeURIComponent("Commercial interior enquiry")}`}>Email your enquiry <span aria-hidden="true">↗</span></a>
                <CopyEmailButton email={contact.email} />
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
