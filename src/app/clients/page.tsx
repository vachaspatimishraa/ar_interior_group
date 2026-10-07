import Link from "next/link";
import { ClientLogoCollection } from "@/components/client-logo-collection";
import { ClientsShowcase } from "@/components/clients-showcase";
import { PageIntro } from "@/components/page-intro";
import { ScrollReveal } from "@/components/scroll-reveal";
import { clientNames, projectBySlug } from "@/data/company-profile";
import { createPageMetadata } from "@/lib/page-metadata";
import { RevealItem, SectionReveal, StaggerGroup } from "@/lib/motion/reveal-attributes";
import "./clients.css";

export const metadata = createPageMetadata(
  "Clients",
  "Organizations and selected project settings associated with AR Interior Group’s commercial interior work.",
  "/clients",
);

const featuredSlugs = [
  "medanta-lucknow",
  "hcg-aastha-ahmedabad",
  "microsoft-bengaluru",
  "technip-energies-noida",
  "pb-health-gurgaon",
  "mv-seals-gurgaon",
];
const featuredProjects = featuredSlugs
  .map(projectBySlug)
  .flatMap((project) => project?.entryKind === "photographed-case-study" && project.images.length > 0 ? [project] : []);
const heroProject = projectBySlug("microsoft-bengaluru");
const microMarketReferences = [
  "narayana-institute-cardiac-sciences",
  "shell-india-markets-bengaluru",
  "lt-tech-park-hebbal",
  "ltimindtree-hyderabad",
  "accenture-services-mumbai",
  "wells-fargo-india",
].map(projectBySlug).filter((project) => project !== undefined);

export default function ClientsPage() {
  return (
    <main id="main-content" className="clients-page">
      <ScrollReveal scope="clients-page" />
      <PageIntro
        eyebrow="Clients · Portfolio references"
        title={<>Our clients<br /><em>in context.</em></>}
        description="Explore organisations and project settings associated with AR Interior Group’s commercial interior work."
        current="Clients"
        staged
        image={heroProject?.images[0] ? {
          src: "/" + heroProject.images[0].path.replace(/^public\//, ""),
          alt: "Brews & Bakes workplace amenity counter documented in the Microsoft Bengaluru portfolio",
          caption: "Microsoft · Bengaluru · Café and service-counter setting",
          secondary: heroProject.images[1] ? {
            src: "/" + heroProject.images[1].path.replace(/^public\//, ""),
            alt: "A second view of the documented Microsoft Bengaluru café and service counter",
          } : undefined,
        } : undefined}
      />

      <section className="clients-featured-section" aria-labelledby="clients-featured-heading" {...SectionReveal()}>
        <div className="clients-container">
          <div className="clients-section-header">
            <div>
              <p className="eyebrow text-gold-ink" {...RevealItem({ kind: "eyebrow", delayMs: 400 })}>Selected organisations</p>
              <h2 id="clients-featured-heading" className="clients-section-heading" {...RevealItem({ kind: "heading", delayMs: 500 })}>Selected organisations and projects.</h2>
            </div>
            <p {...RevealItem({ kind: "copy", delayMs: 650 })}>Select an organisation to preview its portfolio entry. On touch screens, tap to select; keyboard focus also previews.</p>
          </div>
          <ClientsShowcase projects={featuredProjects} />
          <p className="clients-disclosure" {...RevealItem({ kind: "copy", delayMs: 800 })}>These selections reflect portfolio context and do not imply a current contract or endorsement.</p>
          <aside className="clients-context-strip" aria-labelledby="clients-context-heading">
            <div className="clients-context-heading-wrap">
              <p className="eyebrow text-gold-ink" {...RevealItem({ kind: "eyebrow", delayMs: 400 })}>Supporting context</p>
              <h3 id="clients-context-heading" {...RevealItem({ kind: "heading", delayMs: 500 })}>Also named under Micro Markets Setup.</h3>
            </div>
            <ul className="clients-context-list" {...StaggerGroup({ intervalMs: 45 })}>
              {microMarketReferences.map((project, index) => (
                <li key={project.slug} {...RevealItem({ kind: "card", delayMs: 650 })}>
                  <span>{project.title}</span>
                  <small>{project.location ?? "Location not specified"}</small>
                  <span className="clients-context-index" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
                </li>
              ))}
            </ul>
            <p className="clients-context-note" {...RevealItem({ kind: "copy", delayMs: 850 })}>These organisations are associated with the micro-market and kiosk service area; no broader project scope is implied.</p>
          </aside>
        </div>
      </section>

      <section className="clients-collection-section" aria-labelledby="clients-collection-heading" {...SectionReveal()}>
        <div className="clients-container">
          <div className="clients-collection-heading-row">
            <div>
              <p className="eyebrow text-gold-ink" {...RevealItem({ kind: "eyebrow", delayMs: 400 })}>Organisations</p>
              <h2 id="clients-collection-heading" className="clients-section-heading" {...RevealItem({ kind: "heading", delayMs: 500 })}>The wider client landscape.</h2>
            </div>
            <p {...RevealItem({ kind: "copy", delayMs: 650 })}>Original logo artwork is kept in its supplied colors and proportions. Where a suitable mark was not supplied, the organization is named in text.</p>
          </div>
          <ClientLogoCollection names={clientNames} />
          <p className="clients-disclosure clients-logo-disclosure" {...RevealItem({ kind: "copy", delayMs: 800 })}>Names and marks are shown for portfolio context; inclusion does not imply a current contract or endorsement.</p>
        </div>
      </section>

      <section className="clients-closing" aria-labelledby="clients-closing-heading" {...SectionReveal()}>
        <div className="clients-container clients-closing-layout">
          <div>
            <p className="eyebrow text-gold-ink" {...RevealItem({ kind: "eyebrow", delayMs: 400 })}>Start a conversation</p>
            <h2 id="clients-closing-heading" className="clients-closing-heading" {...RevealItem({ kind: "heading", delayMs: 500 })}>Planning a space?</h2>
            <span className="clients-closing-divider" aria-hidden="true" {...RevealItem({ kind: "accent", delayMs: 700 })} />
          </div>
          <Link className="button button-dark clients-closing-cta" href="/contact#enquiry-form" {...RevealItem({ kind: "control", delayMs: 950 })}>Discuss Your Space <span aria-hidden="true">→</span></Link>
        </div>
      </section>
    </main>
  );
}
