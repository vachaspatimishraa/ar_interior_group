import { ContactForm } from "@/components/contact-form";
import { CopyEmailButton } from "@/components/copy-email-button";
import { contact } from "@/data/company-profile";
import { RevealItem, SectionReveal, StaggerGroup } from "@/lib/motion/reveal-attributes";

const socials = [
  ["LinkedIn", contact.linkedin],
  ["Instagram", contact.instagram],
  ["Google Business", contact.googleBusiness],
] as const;

export function ContactSection({ onlineEnquiryAvailable }: { onlineEnquiryAvailable: boolean }) {
  return (
    <section id="contact" className="home-section home-contact py-20 sm:py-28 lg:py-36 border-t border-ink/10" aria-labelledby="contact-heading" {...SectionReveal()}>
      <div className="home-shell mx-auto max-w-[1440px] px-6 sm:px-8 lg:px-12">
        {/* Availability Strip */}
        <div className="mb-14 rounded-2xl bg-white/80 border border-gold/30 p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6" {...RevealItem({ kind: "card", delayMs: 300 })}>
          <div className="flex items-start sm:items-center gap-4">
            <span className="flex h-3.5 w-3.5 rounded-full bg-emerald-500 ring-4 ring-emerald-500/20 shrink-0 mt-1 sm:mt-0" aria-hidden="true" />
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-gold-ink">Project Availability Status</p>
              <h3 className="font-display text-lg sm:text-xl text-ink font-medium mt-0.5">
                Accepting Commercial Interior & Turnkey Fit-Out Enquiries
              </h3>
            </div>
          </div>
          <div className="text-xs text-ink/70 md:text-right max-w-sm">
            <p>Timelines and execution schedules are confirmed following initial scope review and space assessment.</p>
          </div>
        </div>

        {/* Main Grid: Info/Channels on Left, Form on Right */}
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16 items-start">
          {/* Left: Contact Info & Channels */}
          <div {...StaggerGroup()}>
            <p className="eyebrow text-gold-ink" {...RevealItem({ kind: "eyebrow", delayMs: 350 })}>
              Section 8 · Contact Us
            </p>
            <h2 id="contact-heading" className="mt-3 font-display text-4xl sm:text-5xl lg:text-6xl tracking-[-0.04em] text-ink" {...RevealItem({ kind: "heading", delayMs: 460 })}>
              Let’s talk about your space.
            </h2>
            <p className="mt-5 text-sm sm:text-base leading-relaxed text-ink/75 max-w-md" {...RevealItem({ kind: "copy", delayMs: 570 })}>
              Whether planning a micro-market installation, a commercial workplace fit-out, or an infrastructure overhaul, our project management team is ready to assist.
            </p>

            <div className="mt-10 space-y-6 border-t border-ink/10 pt-8" {...StaggerGroup({ intervalMs: 80 })}>
              <div {...RevealItem({ kind: "card", delayMs: 650 })}>
                <span className="text-[11px] font-medium uppercase tracking-wider text-ink/50">Direct Telephone</span>
                <p className="mt-1">
                  <a href={contact.phoneHref} className="text-base sm:text-lg font-medium text-ink hover:text-gold-ink transition-colors">
                    {contact.phone} <span aria-hidden="true">↗</span>
                  </a>
                </p>
              </div>

              <div {...RevealItem({ kind: "card", delayMs: 730 })}>
                <span className="text-[11px] font-medium uppercase tracking-wider text-ink/50">Project Inquiries (Primary)</span>
                <div className="mt-1 flex items-center gap-3 flex-wrap">
                  <a href={`mailto:${contact.email}`} className="text-base sm:text-lg font-medium text-ink hover:text-gold-ink transition-colors">
                    {contact.email} <span aria-hidden="true">↗</span>
                  </a>
                  <CopyEmailButton email={contact.email} />
                </div>
              </div>

              <div {...RevealItem({ kind: "card", delayMs: 810 })}>
                <span className="text-[11px] font-medium uppercase tracking-wider text-ink/50">Secondary Email</span>
                <p className="mt-1">
                  <a href={`mailto:${contact.secondaryEmail}`} className="text-sm sm:text-base text-ink/80 hover:text-gold-ink transition-colors">
                    {contact.secondaryEmail} <span aria-hidden="true">↗</span>
                  </a>
                </p>
              </div>

              <div className="pt-4 border-t border-ink/10" {...RevealItem({ kind: "card", delayMs: 890 })}>
                <span className="text-[11px] font-medium uppercase tracking-wider text-ink/50">Online Profiles</span>
                <div className="mt-2 flex flex-wrap gap-4">
                  {socials.map(([name, url]) => (
                    <a
                      key={name}
                      href={url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs uppercase tracking-wider font-semibold text-gold-ink hover:text-ink transition-colors inline-flex items-center gap-1"
                    >
                      {name} <span aria-hidden="true">↗</span>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right: Interactive Secure Form */}
          <div id="enquiry-form" tabIndex={-1} className="rounded-2xl border border-ink/12 bg-white/90 p-7 sm:p-10 shadow-sm" {...RevealItem({ kind: "card", delayMs: 450 })}>
            <div className="mb-8 border-b border-ink/10 pb-5">
              <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-gold-ink">Project Enquiry</span>
              <h3 id="enquiry-form-title" tabIndex={-1} className="font-display text-2xl sm:text-3xl text-ink mt-1">
                Tell us about your project requirements
              </h3>
              <p className="text-xs text-ink/65 mt-2 leading-relaxed">
                Submissions are sent directly to our executive team. Protected with rate limiting and secure email notification.
              </p>
            </div>

            {onlineEnquiryAvailable ? (
              <ContactForm />
            ) : (
              <div className="contact-unavailable py-6" role="status">
                <p className="eyebrow text-gold-ink">Online submission unavailable in this environment</p>
                <p className="text-sm text-ink/75 mt-2">
                  This environment is not configured for secure email and rate-limited submissions. Please reach AR Interior Group directly via email or telephone above.
                </p>
                <div className="mt-5 flex gap-4">
                  <a className="button button-dark button-small" href={`mailto:${contact.email}?subject=${encodeURIComponent("Commercial interior enquiry")}`}>
                    Email your enquiry <span aria-hidden="true">↗</span>
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
