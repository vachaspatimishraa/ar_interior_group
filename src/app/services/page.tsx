import Image from "next/image";
import Link from "next/link";
import { ContentPage } from "@/components/content-page";
import { ScrollReveal } from "@/components/scroll-reveal";
import { ServicesShowcase } from "@/components/services-showcase";
import { projectBySlug, serviceBySlug } from "@/data/company-profile";
import { serviceOverview } from "@/data/services";
import { createPageMetadata } from "@/lib/page-metadata";
import { ImageReveal, RevealItem, SectionReveal, StaggerGroup } from "@/lib/motion/reveal-attributes";
import "./services.css";

export const metadata = createPageMetadata("Services", "Experts in Space Planning and Design & Build Projects.", "/services");

const microMarketService = serviceBySlug("micro-markets-kiosks");
const microMarketReferences = microMarketService?.relatedProjectSlugs?.map(projectBySlug).filter((project) => project !== undefined) ?? [];
const microMarketFeaturedProject = microMarketReferences.find((project) => project.slug === "tata-electronics-tamil-nadu");

export default function ServicesPage() {
  return <ContentPage eyebrow="Services" title={<>Space planning<br /><em>&amp; design-build.</em></>} description="Experts in Space Planning and Design & Build Projects." current="Services" image={{ src: "/projects/technip-energies-noida/p26-img478-thumb.webp", alt: "Technip Energies interior in Noida", caption: "Technip Energies · Noida" }}>
    <ScrollReveal scope="services-page" />

    <section className="services-opening bg-ivory" {...SectionReveal()}>
      <div className="mx-auto max-w-[1440px] px-6 pb-24 pt-8 sm:px-8 lg:px-12 lg:pb-32">
        <div className="mb-12 grid gap-8 border-t border-ink/15 pt-6 md:grid-cols-[0.7fr_1fr] md:gap-16">
          <p className="eyebrow text-gold-ink" {...RevealItem({ kind: "eyebrow", delayMs: 400 })}>Our services</p>
          <div {...RevealItem({ kind: "copy", delayMs: 650 })}>
            <p className="max-w-2xl font-display text-3xl leading-tight tracking-[-0.035em] text-ink sm:text-4xl">Where Visionary Designs Meet Practical Solutions.</p>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-ink/65">Explore seven ways AR Interior Group works across commercial interior spaces.</p>
          </div>
        </div>
        <ServicesShowcase items={serviceOverview} />
      </div>
    </section>

    <section className="services-details bg-surface-muted" aria-labelledby="service-details-heading">
      <div className="mx-auto max-w-[1440px] px-6 py-20 sm:px-8 sm:py-28 lg:px-12 lg:py-36">
        <section className="services-detail-intro border-t border-ink/15 pt-6" {...SectionReveal()}>
          <p className="eyebrow text-gold-ink" {...RevealItem({ kind: "eyebrow", delayMs: 400 })}>Service details</p>
          <h2 id="service-details-heading" className="mt-5 max-w-4xl font-display text-5xl leading-[0.97] tracking-[-0.055em] text-ink sm:text-7xl" {...RevealItem({ kind: "heading", delayMs: 500 })}>One considered scope at a time.</h2>
          <p className="mt-6 max-w-xl text-sm leading-7 text-ink/65" {...RevealItem({ kind: "copy", delayMs: 650 })}>Explore the work and materials associated with each service area.</p>
        </section>

        <div className="services-editorials mt-16">
          {serviceOverview.map((service, index) => {
            const layouts = ["micro", "civil", "furniture", "partition", "flooring", "plumbing", "railing"];
            return <article key={service.slug} id={`${service.slug}-details`} className="service-editorial" data-layout={layouts[index]} aria-labelledby={`${service.slug}-heading`} {...SectionReveal()}>
              <figure className="service-editorial-figure" {...ImageReveal({ direction: index % 2 ? "right" : "up", delayMs: 120 })}>
                {service.image ? <Image src={service.image.src} alt={service.image.alt} width={service.image.width} height={service.image.height} sizes="(max-width: 767px) 92vw, (max-width: 1023px) 80vw, 52vw" loading="lazy" className="service-editorial-image" /> : <div className="service-editorial-fallback" role="img" aria-label={`Illustrated text treatment for ${service.title}`}><span className="eyebrow">AR / IG · SERVICE {String(index + 1).padStart(2, "0")}</span><span className="font-display">{service.title}</span></div>}
                {service.image && <figcaption>Service illustration · {service.title}</figcaption>}
              </figure>
              <div className="service-editorial-copy">
                <p className="eyebrow text-gold-ink" {...RevealItem({ kind: "eyebrow", delayMs: 400 })}>Service detail</p>
                <h3 id={`${service.slug}-heading`} className="mt-5 font-display text-4xl leading-[0.98] tracking-[-0.05em] text-ink sm:text-5xl" {...RevealItem({ kind: "heading", delayMs: 500 })}>{service.title}</h3>
                {service.detail && <p className="mt-5 max-w-2xl text-sm leading-7 text-ink/70" {...RevealItem({ kind: "copy", delayMs: 650 })}>{service.detail}</p>}
                <ul className="service-editorial-points mt-7" {...StaggerGroup({ intervalMs: 75 })}>
                  {service.bullets.map((point) => <li key={point} {...RevealItem({ kind: "card", delayMs: 780 })}><span aria-hidden="true">↗</span>{point}</li>)}
                </ul>
              </div>
            </article>;
          })}
        </div>
      </div>
    </section>

    <section className="micro-market-work bg-ivory" aria-labelledby="micro-market-heading" {...SectionReveal()}>
      <div className="mx-auto max-w-[1440px] px-6 py-20 sm:px-8 sm:py-28 lg:px-12 lg:py-36">
        <div className="grid gap-8 border-t border-ink/15 pt-6 lg:grid-cols-[0.76fr_1fr] lg:gap-16">
          <div>
            <p className="eyebrow text-gold-ink" {...RevealItem({ kind: "eyebrow", delayMs: 400 })}>Micro market / kiosk references</p>
            <h2 id="micro-market-heading" className="mt-5 max-w-2xl font-display text-4xl leading-[1.02] tracking-[-0.05em] text-ink sm:text-6xl" {...RevealItem({ kind: "heading", delayMs: 500 })}>Micro-market settings.</h2>
          </div>
          <p className="max-w-2xl text-sm leading-7 text-ink/65" {...RevealItem({ kind: "copy", delayMs: 650 })}>These organisations and locations are shown in the context of micro-market and kiosk work, not as claims about the complete scope of their interiors.</p>
        </div>
        <div className="micro-reference-layout mt-12">
          {microMarketFeaturedProject?.comparison?.after && <figure className="micro-reference-feature" {...ImageReveal({ direction: "up", delayMs: 250 })}>
            <Image src={`/${microMarketFeaturedProject.comparison.after.path.replace(/^public\//, "")}`} alt={`${microMarketFeaturedProject.title} micro-market counter in ${microMarketFeaturedProject.location}`} width={microMarketFeaturedProject.comparison.after.width} height={microMarketFeaturedProject.comparison.after.height} sizes="(max-width: 767px) 92vw, 46vw" loading="lazy" />
            <figcaption>Portfolio photograph · {microMarketFeaturedProject.title} · {microMarketFeaturedProject.location}</figcaption>
          </figure>}
          <ul className="micro-reference-list" {...StaggerGroup({ intervalMs: 55 })}>
            {microMarketReferences.map((project, index) => <li key={project.slug} {...RevealItem({ kind: "card", delayMs: 750 })}>
              <span className="eyebrow text-gold-ink">{String(index + 1).padStart(2, "0")}</span>
              <span className="font-display text-xl leading-snug tracking-[-0.025em] text-ink sm:text-2xl">{project.title}</span>
              <span className="text-xs text-ink/60">{project.location ?? "Location not specified"}</span>
            </li>)}
          </ul>
        </div>
      </div>
    </section>

    <section className="services-contact bg-surface-muted" aria-labelledby="services-contact-heading" {...SectionReveal()}>
      <div className="mx-auto grid max-w-[1440px] gap-8 px-6 py-16 sm:px-8 sm:py-20 lg:grid-cols-[1fr_auto] lg:items-end lg:px-12 lg:py-24">
        <div><p className="eyebrow text-gold-ink" {...RevealItem({ kind: "eyebrow", delayMs: 400 })}>Start a conversation</p><h2 id="services-contact-heading" className="mt-4 max-w-3xl font-display text-4xl leading-tight tracking-[-0.05em] text-ink sm:text-6xl" {...RevealItem({ kind: "heading", delayMs: 500 })}>Discuss your space.</h2><p className="mt-4 text-sm text-ink/65" {...RevealItem({ kind: "copy", delayMs: 650 })}>facilities@arinteriorgroup.com</p></div>
        <Link href="/contact#enquiry-form" className="button button-dark w-fit" {...RevealItem({ kind: "control", delayMs: 950 })}>Discuss Your Space <span aria-hidden="true">→</span></Link>
      </div>
    </section>
  </ContentPage>;
}
