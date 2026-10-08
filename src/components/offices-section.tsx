import { verifiedOffices, presenceCities } from "@/data/offices";
import { RevealItem, SectionReveal, StaggerGroup } from "@/lib/motion/reveal-attributes";

export function OfficesSection() {
  return (
    <section id="offices" className="home-section home-offices py-20 sm:py-28 lg:py-36 border-t border-ink/10" aria-labelledby="offices-heading" {...SectionReveal()}>
      <div className="home-shell mx-auto max-w-[1440px] px-6 sm:px-8 lg:px-12">
        {/* Section Header */}
        <div className="mb-14 grid gap-6 border-b border-ink/15 pb-8 lg:grid-cols-[0.8fr_1fr] lg:gap-16">
          <div {...StaggerGroup()}>
            <p className="eyebrow text-gold-ink" {...RevealItem({ kind: "eyebrow", delayMs: 350 })}>
              Both Offices · Presence
            </p>
            <h2 id="offices-heading" className="mt-3 font-display text-4xl sm:text-5xl lg:text-6xl tracking-[-0.04em] text-ink" {...RevealItem({ kind: "heading", delayMs: 460 })}>
              Nationwide presence, local execution.
            </h2>
          </div>
          <div className="flex flex-col justify-end" {...RevealItem({ kind: "copy", delayMs: 580 })}>
            <p className="text-sm sm:text-base leading-relaxed text-ink/75 max-w-xl">
              From design planning to turnkey fit-out delivery, AR Interior Group operates across major commercial hubs. Contact our primary operations or regional team.
            </p>
          </div>
        </div>

        {/* Dual Office Cards */}
        <div className="grid gap-8 md:grid-cols-2 mb-16" {...StaggerGroup({ intervalMs: 120 })}>
          {verifiedOffices.map((office, index) => (
            <article
              key={office.id}
              className="rounded-2xl border border-ink/12 bg-white/70 backdrop-blur-sm p-7 sm:p-9 shadow-sm hover:border-gold/60 transition-all flex flex-col justify-between"
              {...RevealItem({ kind: "card", delayMs: 600 + index * 100 })}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="inline-block rounded-full bg-gold/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-gold-ink">
                    {office.badge}
                  </span>
                  <span className="text-xs uppercase tracking-widest text-ink/40 font-mono">
                    0{index + 1}
                  </span>
                </div>
                <h3 className="font-display text-2xl sm:text-3xl tracking-tight text-ink mb-2">
                  {office.name}
                </h3>
                <p className="text-xs uppercase tracking-wider text-gold-ink font-semibold mb-6">
                  {office.city} · {office.state}
                </p>

                <div className="space-y-4 pt-4 border-t border-ink/10 text-sm">
                  <div>
                    <span className="block text-[11px] uppercase tracking-wider text-ink/50 font-medium">Physical Address</span>
                    <p className="text-xs text-ink/65 italic mt-0.5">{office.addressNotice}</p>
                  </div>
                  <div>
                    <span className="block text-[11px] uppercase tracking-wider text-ink/50 font-medium">Telephone</span>
                    <a href={office.phoneHref} className="text-ink font-medium hover:text-gold-ink transition-colors">
                      {office.phone} <span aria-hidden="true">↗</span>
                    </a>
                  </div>
                  <div>
                    <span className="block text-[11px] uppercase tracking-wider text-ink/50 font-medium">Email</span>
                    <a href={`mailto:${office.email}`} className="text-ink font-medium hover:text-gold-ink transition-colors">
                      {office.email} <span aria-hidden="true">↗</span>
                    </a>
                  </div>
                  <div>
                    <span className="block text-[11px] uppercase tracking-wider text-ink/50 font-medium">Opening Hours</span>
                    <p className="text-xs text-ink/65 italic mt-0.5">{office.hoursNotice}</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-5 border-t border-ink/10 flex items-center justify-between">
                <a
                  href={office.directionsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-semibold uppercase tracking-wider text-gold-ink hover:text-ink transition-colors inline-flex items-center gap-1.5"
                >
                  Get Directions (Google Business) <span aria-hidden="true">↗</span>
                </a>
              </div>
            </article>
          ))}
        </div>

        {/* Operational Presence Cities Strip */}
        <div className="rounded-2xl bg-surface-muted/60 border border-ink/10 p-6 sm:p-8" {...SectionReveal()}>
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-ink/10 pb-4">
            <div>
              <p className="text-[11px] uppercase tracking-[0.16em] text-gold-ink font-semibold">Documented Presence Footprint</p>
              <h4 className="font-display text-xl text-ink">Commercial Centers with Completed Projects</h4>
            </div>
            <span className="text-xs text-ink/60">Operational Footprint</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4" {...StaggerGroup({ intervalMs: 60 })}>
            {presenceCities.map((city, idx) => (
              <div
                key={city.name}
                className="bg-white/80 rounded-xl p-4 border border-ink/8 shadow-2xs"
                {...RevealItem({ kind: "card", delayMs: 700 + idx * 50 })}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-display text-lg font-medium text-ink">{city.name}</span>
                  <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-ink/5 text-ink/60">{city.region}</span>
                </div>
                <p className="text-[11px] text-ink/60 leading-snug">{city.highlight}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
