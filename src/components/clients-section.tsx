import { ClientLogoCollection } from "@/components/client-logo-collection";
import { clientNames, projectBySlug } from "@/data/company-profile";
import { RevealItem, SectionReveal, StaggerGroup } from "@/lib/motion/reveal-attributes";

const microMarketReferences = [
  "narayana-institute-cardiac-sciences",
  "shell-india-markets-bengaluru",
  "lt-tech-park-hebbal",
  "ltimindtree-hyderabad",
  "accenture-services-mumbai",
  "wells-fargo-india",
].map(projectBySlug).filter((project) => project !== undefined);

export function ClientsSection() {
  return (
    <section id="clients" className="home-section home-clients py-20 sm:py-28 lg:py-36 border-t border-ink/10" aria-labelledby="clients-heading" {...SectionReveal()}>
      <div className="home-shell mx-auto max-w-[1440px] px-6 sm:px-8 lg:px-12">
        {/* Section Header */}
        <div className="mb-14 grid gap-6 border-b border-ink/15 pb-8 lg:grid-cols-[0.8fr_1fr] lg:gap-16">
          <div {...StaggerGroup()}>
            <p className="eyebrow text-gold-ink" {...RevealItem({ kind: "eyebrow", delayMs: 350 })}>
              Section 4 · Client Directory
            </p>
            <h2 id="clients-heading" className="mt-3 font-display text-4xl sm:text-5xl lg:text-6xl tracking-[-0.04em] text-ink" {...RevealItem({ kind: "heading", delayMs: 460 })}>
              Trusted by industry leaders.
            </h2>
          </div>
          <div className="flex flex-col justify-end" {...RevealItem({ kind: "copy", delayMs: 580 })}>
            <p className="text-sm sm:text-base leading-relaxed text-ink/75 max-w-xl">
              From global technology enterprises to premier healthcare facilities and financial institutions, our portfolio represents verified execution for esteemed organizations across India.
            </p>
          </div>
        </div>

        {/* Client Logos Grid */}
        <div className="mb-16">
          <ClientLogoCollection names={clientNames} />
        </div>

        {/* Micro Market Context & Integrity Note */}
        <div className="rounded-2xl bg-surface-muted/60 border border-ink/10 p-6 sm:p-8" {...SectionReveal()}>
          <div className="mb-4">
            <span className="text-[11px] uppercase tracking-wider text-gold-ink font-semibold">Supporting Micro-Market References</span>
            <p className="text-xs text-ink/65 mt-1">Organizations documented within the Micro Markets &amp; Kiosks project context across India.</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3" {...StaggerGroup({ intervalMs: 35 })}>
            {microMarketReferences.map((ref, idx) => (
              <div key={ref.slug} className="bg-white/80 rounded-lg p-3 border border-ink/8 text-center" {...RevealItem({ kind: "card", delayMs: 600 + idx * 35 })}>
                <span className="block text-xs font-medium text-ink truncate">{ref.title}</span>
                <span className="block text-[10px] text-ink/50 truncate mt-0.5">{ref.location ?? "Pan-India"}</span>
              </div>
            ))}
          </div>

          <p className="text-[11px] text-ink/50 mt-5 pt-4 border-t border-ink/10 leading-relaxed">
            Names and marks are shown for portfolio context; inclusion reflects documented project settings and does not imply an exclusive corporate endorsement.
          </p>
        </div>
      </div>
    </section>
  );
}
