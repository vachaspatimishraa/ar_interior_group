import Image from "next/image";
import { companyAboutProfile, cqetPrinciples } from "@/data/company-profile";
import { aboutVisual } from "@/data/about-page";
import { ImageReveal, RevealItem, SectionReveal, StaggerGroup } from "@/lib/motion/reveal-attributes";

const aboutHeroImage = aboutVisual("medanta-lucknow", 0, "Medanta Super Speciality Hospital, Lucknow");
const teamVisual = aboutVisual("technip-energies-noida", 0, "Technip Energies workplace interior in Noida");

export function AboutSection() {
  return (
    <section id="about" className="home-section home-about py-20 sm:py-28 lg:py-36" aria-labelledby="about-heading" {...SectionReveal()}>
      <div className="home-shell mx-auto max-w-[1440px] px-6 sm:px-8 lg:px-12">
        {/* Section Header */}
        <div className="mb-14 grid gap-6 border-b border-ink/15 pb-8 lg:grid-cols-[0.8fr_1fr] lg:gap-16">
          <div {...StaggerGroup()}>
            <p className="eyebrow text-gold-ink" {...RevealItem({ kind: "eyebrow", delayMs: 350 })}>
              Section 2 · About AR Interior Group
            </p>
            <h2 id="about-heading" className="mt-3 font-display text-4xl sm:text-5xl lg:text-6xl tracking-[-0.04em] text-ink" {...RevealItem({ kind: "heading", delayMs: 460 })}>
              {companyAboutProfile.positioning}
            </h2>
          </div>
          <div className="flex flex-col justify-end" {...RevealItem({ kind: "copy", delayMs: 580 })}>
            <p className="text-base sm:text-lg font-medium text-gold-ink mb-2">
              {companyAboutProfile.tagline}
            </p>
            <p className="text-sm sm:text-base leading-relaxed text-ink/75 max-w-xl">
              {companyAboutProfile.story[0]} {companyAboutProfile.story[1]}
            </p>
          </div>
        </div>

        {/* Narrative & Photo Split */}
        <div className="grid gap-12 lg:grid-cols-2 items-center mb-20">
          <figure className="relative aspect-[16/11] overflow-hidden rounded-2xl bg-image-surface shadow-sm" {...ImageReveal({ direction: "left" })}>
            <Image
              src={aboutHeroImage.src}
              alt={aboutHeroImage.alt}
              fill
              sizes="(max-width: 1023px) 92vw, 48vw"
              className="object-cover"
              loading="lazy"
            />
            <figcaption className="absolute bottom-3 left-3 bg-ink/75 backdrop-blur-md px-3 py-1 rounded-md text-[10px] uppercase tracking-wider text-page font-medium">
              {aboutHeroImage.caption}
            </figcaption>
          </figure>

          <div className="space-y-6" {...StaggerGroup()}>
            <div className="inline-flex items-center gap-3 bg-gold/15 px-3.5 py-1 rounded-full text-gold-ink text-xs uppercase tracking-widest font-semibold" {...RevealItem({ kind: "eyebrow" })}>
              <span>Founded in 2019</span>
              <span aria-hidden="true">·</span>
              <span>Turnkey Fit-Outs</span>
            </div>
            <h3 className="font-display text-3xl sm:text-4xl text-ink leading-tight" {...RevealItem({ kind: "heading" })}>
              Full project control from planning to handover.
            </h3>
            <p className="text-sm sm:text-base leading-relaxed text-ink/75" {...RevealItem({ kind: "copy" })}>
              {companyAboutProfile.story[2]}
            </p>
            <blockquote className="border-l-2 border-gold pl-5 py-1 text-sm italic text-ink/80 bg-surface-muted/40 rounded-r-xl" {...RevealItem({ kind: "copy" })}>
              &ldquo;{companyAboutProfile.storyMission}&rdquo;
            </blockquote>
          </div>
        </div>

        {/* Core Principles: Mission, Vision, Purpose, Values */}
        <div className="mb-20 rounded-2xl bg-surface-muted/60 border border-ink/10 p-8 sm:p-12" {...SectionReveal()}>
          <div className="mb-8 border-b border-ink/10 pb-5">
            <p className="eyebrow text-gold-ink">Guiding Framework</p>
            <h3 className="font-display text-2xl sm:text-3xl text-ink">Purpose, Vision & Core Values</h3>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4" {...StaggerGroup({ intervalMs: 80 })}>
            <div className="bg-white/80 rounded-xl p-5 border border-ink/8 shadow-2xs" {...RevealItem({ kind: "card", delayMs: 400 })}>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-gold-ink">Purpose</span>
              <h4 className="font-display text-lg text-ink mt-1">Accountability</h4>
              <p className="text-xs text-ink/70 mt-2 leading-relaxed">{companyAboutProfile.statements[0].description}</p>
            </div>

            <div className="bg-white/80 rounded-xl p-5 border border-ink/8 shadow-2xs" {...RevealItem({ kind: "card", delayMs: 480 })}>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-gold-ink">Vision</span>
              <h4 className="font-display text-lg text-ink mt-1">Client Choice</h4>
              <p className="text-xs text-ink/70 mt-2 leading-relaxed">{companyAboutProfile.statements[1].description}</p>
            </div>

            <div className="bg-white/80 rounded-xl p-5 border border-ink/8 shadow-2xs" {...RevealItem({ kind: "card", delayMs: 560 })}>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-gold-ink">Mission</span>
              <h4 className="font-display text-lg text-ink mt-1">Complete Delivery</h4>
              <p className="text-xs text-ink/70 mt-2 leading-relaxed">{companyAboutProfile.statements[3].description}</p>
            </div>

            <div className="bg-white/80 rounded-xl p-5 border border-ink/8 shadow-2xs" {...RevealItem({ kind: "card", delayMs: 640 })}>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-gold-ink">Core Values</span>
              <h4 className="font-display text-lg text-ink mt-1">Integrity & Growth</h4>
              <ul className="text-xs text-ink/70 mt-2 space-y-1">
                {companyAboutProfile.statements[2].values.slice(0, 4).map((v) => (
                  <li key={v}>• {v}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Success Mantra C.Q.E.T. */}
        <div className="mb-20" {...SectionReveal()}>
          <div className="mb-8">
            <p className="eyebrow text-gold-ink">Success Mantra</p>
            <h3 className="font-display text-3xl sm:text-4xl text-ink">C.Q.E.T Principles</h3>
            <p className="text-xs sm:text-sm text-ink/65 mt-1">Four cornerstones that govern every interior fit-out project.</p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4" {...StaggerGroup({ intervalMs: 70 })}>
            {cqetPrinciples.map((item, idx) => (
              <div key={item.title} className="rounded-xl border border-ink/12 bg-white/70 p-6 shadow-sm hover:border-gold/60 transition-colors" {...RevealItem({ kind: "card", delayMs: 500 + idx * 70 })}>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-display text-3xl text-gold-ink font-semibold">0{idx + 1}</span>
                  <span className="text-[10px] uppercase font-mono tracking-widest text-ink/40">CQET</span>
                </div>
                <h4 className="font-display text-xl text-ink font-medium mb-2">{item.title}</h4>
                <p className="text-xs text-ink/70 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Team Capabilities */}
        <div className="rounded-2xl border border-ink/12 bg-white/80 p-8 sm:p-12 shadow-sm" {...SectionReveal()}>
          <div className="mb-8 border-b border-ink/10 pb-5 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <p className="eyebrow text-gold-ink">Our Team · Our Strength</p>
              <h3 className="font-display text-3xl sm:text-4xl text-ink">People & Technical Capabilities</h3>
            </div>
            <p className="text-xs font-mono text-gold-ink uppercase font-semibold">100–200+ Skilled Execution Workforce</p>
          </div>

          <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] items-center">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3" {...StaggerGroup({ intervalMs: 40 })}>
              {companyAboutProfile.teamRoles.map((role, idx) => (
                <div key={role} className="flex items-center gap-3 p-3 rounded-lg bg-surface-muted/40 border border-ink/5" {...RevealItem({ kind: "card", delayMs: 550 + idx * 40 })}>
                  <span className="flex h-2 w-2 rounded-full bg-gold shrink-0" aria-hidden="true" />
                  <span className="text-xs font-medium text-ink">{role}</span>
                </div>
              ))}
            </div>

            <figure className="relative aspect-[4/3] overflow-hidden rounded-xl bg-image-surface shadow-2xs" {...ImageReveal({ direction: "right" })}>
              <Image
                src={teamVisual.src}
                alt={teamVisual.alt}
                fill
                sizes="(max-width: 1023px) 92vw, 36vw"
                className="object-cover"
                loading="lazy"
              />
              <figcaption className="absolute bottom-2 left-2 bg-ink/75 backdrop-blur-md px-2.5 py-0.5 rounded text-[9px] uppercase tracking-wider text-page font-medium">
                {teamVisual.caption}
              </figcaption>
            </figure>
          </div>
        </div>
      </div>
    </section>
  );
}
