import Image from "next/image";
import { ContactEnquiryLink } from "@/components/contact-enquiry-link";
import { contact } from "@/data/company-profile";

export function EditorialContactCta({ compact = false }: { compact?: boolean }) {
  return (
    <section className={`editorial-contact-cta bg-surface-muted text-ink ${compact ? "editorial-contact-cta-compact" : ""}`} aria-labelledby="editorial-contact-title">
      <div className="editorial-contact-inner mx-auto grid max-w-[1440px] items-center gap-9 px-6 py-16 sm:px-8 sm:py-20 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 lg:px-12 lg:py-24">
        <figure className="editorial-contact-photo">
          <div className="editorial-contact-frame relative aspect-[1.48] overflow-hidden bg-image-surface">
            <Image src="/projects/technip-energies-noida/p30-img504-thumb.webp" alt="Technip Energies workplace interior in Noida" fill sizes="(max-width: 1023px) 92vw, 48vw" className="object-cover" />
            <span className="editorial-contact-line" aria-hidden="true" />
          </div>
          <figcaption className="mt-3 text-[10px] uppercase tracking-[0.13em] text-ink-muted">Technip Energies · Noida</figcaption>
        </figure>
        <div className="editorial-contact-copy lg:pl-5">
          <p className="eyebrow text-gold-ink">A considered beginning</p>
          <h2 id="editorial-contact-title" className="mt-5 max-w-[12ch] font-display text-5xl leading-[0.98] tracking-[-0.055em] sm:text-7xl">Have a commercial space in mind?</h2>
          <p className="mt-6 max-w-lg text-sm leading-7 text-ink-muted sm:text-base">Tell us what you’re planning. We’d be glad to begin with a conversation.</p>
          <div className="mt-7 flex flex-col items-start gap-2 text-sm"><a className="contact-link" href={contact.phoneHref}>{contact.phone}</a><a className="contact-link break-all" href={`mailto:${contact.email}`}>{contact.email}</a><a className="contact-link break-all text-xs" href={`mailto:${contact.secondaryEmail}`}>{contact.secondaryEmail}</a></div>
          <ContactEnquiryLink className="button button-dark mt-8">Discuss Your Space <span aria-hidden="true">↗</span></ContactEnquiryLink>
        </div>
      </div>
    </section>
  );
}
