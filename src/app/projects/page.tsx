import Image from "next/image";
import Link from "next/link";
import { ProjectsFeaturedShowcase } from "@/components/projects-featured-showcase";
import { ProjectsTransformations } from "@/components/projects-transformations";
import { ScrollReveal } from "@/components/scroll-reveal";
import { directoryProjects, projects } from "@/data/company-profile";
import manifest from "@/data/project-image-manifest.json";
import { createPageMetadata } from "@/lib/page-metadata";
import { getConceptGalleryAssets } from "@/lib/concept-gallery";
import { ImageReveal, RevealItem, SectionReveal, StaggerGroup } from "@/lib/motion/reveal-attributes";
import "./projects.css";

export const metadata = createPageMetadata("Projects", "Explore documented AR Interior Group project photographs, locations and design renders.", "/projects");

const featuredOrder = [
  "microsoft-bengaluru",
  "tata-electronics-tamil-nadu",
  "ltimindtree-whitefield",
  "jcb-jaipur",
  "pb-health-gurgaon",
  "mv-seals-gurgaon",
];
const featuredSlugs = new Set(featuredOrder);
const galleryProjects = directoryProjects.filter((project) => project.entryKind === "photographed-case-study" && project.images.length > 0 && !featuredSlugs.has(project.slug));
const textReferences = directoryProjects.filter((project) => project.entryKind === "short-reference");
const transformations = directoryProjects.filter((project) => project.comparison);
const conceptDesigns = getConceptGalleryAssets(manifest.concept_designs);

function projectImagePath(path: string, thumbnail = false) {
  return `/${path.replace(/^public\//, "").replace(/\.webp$/, thumbnail ? "-thumb.webp" : ".webp")}`;
}

export default function ProjectsPage() {
  const heroProject = projects.find((project) => project.slug === "technip-energies-noida")!;
  const heroImage = heroProject.images.find((image) => image.path.endsWith("p29-img499.webp")) ?? heroProject.images[0];

  return (
    <main id="main-content" className="projects-page">
      <ScrollReveal scope="projects-page" />

      <section className="projects-hero" aria-labelledby="projects-page-title" {...SectionReveal()}>
        <div className="projects-shell projects-hero-grid">
          <div className="projects-hero-copy">
            <p className="eyebrow text-gold-ink" {...RevealItem({ kind: "eyebrow", delayMs: 420 })}>PROJECTS · SELECTED WORK</p>
            <h1 id="projects-page-title" className="projects-display" {...RevealItem({ kind: "heading", delayMs: 540 })}>Spaces made <em>real.</em></h1>
            <p className="projects-lede" {...RevealItem({ kind: "copy", delayMs: 690 })}>A considered selection of workplace interiors, fit-outs and micro-market settings.</p>
            <a href="#selected-work" className="projects-text-link" {...RevealItem({ kind: "control", delayMs: 850 })}>Explore selected work <span aria-hidden="true">↓</span></a>
          </div>
          <figure className="projects-hero-figure" {...ImageReveal({ direction: "right", rounded: false, delayMs: 90 })}>
            <div className="projects-hero-frame">
              <Image src={projectImagePath(heroImage.path)} alt="Workplace interior at Technip Energies, Noida" fill preload sizes="(max-width: 767px) 100vw, (max-width: 1199px) 58vw, 62vw" className="projects-cover-image" />
              <span className="projects-hero-rule" aria-hidden="true" />
            </div>
            <figcaption><span>Technip Energies</span><span>Noida</span></figcaption>
          </figure>
          <span className="projects-hero-index" aria-hidden="true">01 / 06</span>
        </div>
      </section>

      <section id="selected-work" className="projects-featured-section" aria-labelledby="projects-featured-title" {...SectionReveal()}>
        <div className="projects-shell">
          <div className="projects-section-heading">
            <div {...StaggerGroup()}>
              <p className="eyebrow text-gold-ink" {...RevealItem({ kind: "eyebrow", delayMs: 380 })}>A closer look</p>
              <h2 id="projects-featured-title" className="projects-section-title" {...RevealItem({ kind: "heading", delayMs: 500 })}>Selected project stories</h2>
            </div>
            <p className="projects-section-note" {...RevealItem({ kind: "copy", delayMs: 640 })}>Explore selected commercial interiors and the locations associated with them.</p>
          </div>
          <ProjectsFeaturedShowcase items={featuredOrder.map((slug) => projects.find((project) => project.slug === slug)).filter((project): project is (typeof projects)[number] => Boolean(project))} />
        </div>
      </section>

      <section className="projects-gallery-section" aria-labelledby="projects-gallery-title" {...SectionReveal()}>
        <div className="projects-shell">
          <div className="projects-section-heading projects-gallery-heading">
            <div {...StaggerGroup()}>
              <p className="eyebrow text-gold-ink" {...RevealItem({ kind: "eyebrow", delayMs: 380 })}>Portfolio photographs</p>
              <h2 id="projects-gallery-title" className="projects-section-title" {...RevealItem({ kind: "heading", delayMs: 500 })}>Different spaces. Distinct settings.</h2>
            </div>
            <p className="projects-section-note" {...RevealItem({ kind: "copy", delayMs: 640 })}>Each photograph is shown with its corresponding project.</p>
          </div>
          <div className="projects-editorial-grid">
            {galleryProjects.map((project, index) => {
              const image = project.images[0];
              const thumb = projectImagePath(image.path, true);
              const shape = index % 4 === 1 ? "portrait" : index % 4 === 3 ? "wide" : "landscape";
              return (
                <article key={project.slug} className={`projects-editorial-card projects-editorial-card-${shape}`}>
                  <Link href={`/projects/${project.slug}`} className="projects-card-link">
                    <div className="projects-card-image" {...ImageReveal({ direction: index % 2 === 0 ? "up" : "left", delayMs: 100 + index * 55 })}>
                      <Image src={thumb} alt={`${project.title}${project.location ? `, ${project.location}` : ""} portfolio photograph`} width={image.width} height={image.height} sizes="(max-width: 639px) 92vw, (max-width: 1023px) 45vw, 31vw" loading="lazy" className="projects-cover-image" />
                      <span className="projects-card-index">{String(index + 1).padStart(2, "0")}</span>
                    </div>
                    <div className="projects-card-caption" {...RevealItem({ kind: "copy", delayMs: 480 + index * 50 })}>
                      <div><h3>{project.title}</h3>{project.location && <p>{project.location}</p>}</div>
                      <span className="projects-card-arrow" aria-hidden="true">↗</span>
                    </div>
                  </Link>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="projects-transform-section" aria-labelledby="projects-transform-title" {...SectionReveal()}>
        <div className="projects-shell">
          <div className="projects-section-heading">
            <div {...StaggerGroup()}>
              <p className="eyebrow text-gold-ink" {...RevealItem({ kind: "eyebrow", delayMs: 380 })}>Before & after</p>
              <h2 id="projects-transform-title" className="projects-section-title" {...RevealItem({ kind: "heading", delayMs: 500 })}>Before, and after.</h2>
            </div>
            <p className="projects-section-note" {...RevealItem({ kind: "copy", delayMs: 640 })}>Before-and-after photographs are presented separately; their viewpoints are not represented as aligned comparisons.</p>
          </div>
          <ProjectsTransformations items={transformations} />
        </div>
      </section>

      <section className="projects-references-section" aria-labelledby="projects-references-title" {...SectionReveal()}>
        <div className="projects-shell">
          <div className="projects-reference-layout">
            <div {...StaggerGroup()}>
              <p className="eyebrow text-gold-ink" {...RevealItem({ kind: "eyebrow", delayMs: 350 })}>More projects</p>
              <h2 id="projects-references-title" className="projects-section-title" {...RevealItem({ kind: "heading", delayMs: 470 })}>More micro-market settings.</h2>
              <p className="projects-section-note" {...RevealItem({ kind: "copy", delayMs: 620 })}>These organisations appear in the micro-market and kiosk context; additional project photography and scope are not available here.</p>
            </div>
            <ul className="projects-reference-list" {...StaggerGroup({ intervalMs: 50 })}>
              {textReferences.map((project, index) => (
                <li key={project.slug} {...RevealItem({ kind: "control", delayMs: 760 + index * 50 })}>
                  <Link href={`/projects/${project.slug}`}><span className="projects-reference-number">{String(index + 1).padStart(2, "0")}</span><span className="projects-reference-name">{project.title}</span><span className="projects-reference-location">{project.location}</span><span className="projects-card-arrow" aria-hidden="true">↗</span></Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="projects-concepts-section" aria-labelledby="projects-concepts-title" {...SectionReveal()}>
        <div className="projects-shell">
          <div className="projects-section-heading">
            <div {...StaggerGroup()}>
              <p className="eyebrow text-gold-ink" {...RevealItem({ kind: "eyebrow", delayMs: 380 })}>Separate concept collection</p>
              <h2 id="projects-concepts-title" className="projects-section-title" {...RevealItem({ kind: "heading", delayMs: 500 })}>Architectural design renders</h2>
            </div>
            <p className="projects-section-note" {...RevealItem({ kind: "copy", delayMs: 640 })}>Concept visuals are not on-site project photographs and do not imply client or completed-project attribution.</p>
          </div>
          <div className="projects-concept-grid">
            {conceptDesigns.map((asset, index) => {
              const src = `/${asset.path.replace(/^public\//, "").replace(/\.webp$/, "-thumb.webp")}`;
              return <figure key={asset.path} className="projects-concept-item"><div className="projects-concept-image" {...ImageReveal({ direction: "up", delayMs: 100 + index * 55 })}><Image src={src} alt="Conceptual architectural design rendering" width={asset.width} height={asset.height} sizes="(max-width: 639px) 45vw, (max-width: 1023px) 29vw, 22vw" loading="lazy" className="projects-cover-image" /></div><figcaption {...RevealItem({ kind: "copy", delayMs: 500 + index * 45 })}>Conceptual design visualisation</figcaption></figure>;
            })}
          </div>
        </div>
      </section>

      <section className="projects-cta-section" aria-labelledby="projects-cta-title" {...SectionReveal()}>
        <div className="projects-shell projects-cta-inner" {...StaggerGroup()}>
          <div><p className="eyebrow text-gold-ink" {...RevealItem({ kind: "eyebrow", delayMs: 350 })}>Have a space in mind?</p><h2 id="projects-cta-title" className="projects-section-title" {...RevealItem({ kind: "heading", delayMs: 470 })}>Let’s discuss what it needs.</h2></div>
          <Link className="projects-cta-link" href="/contact#enquiry-form" {...RevealItem({ kind: "control", delayMs: 760 })}>Discuss your space <span aria-hidden="true">↗</span></Link>
        </div>
        <p className="projects-shell projects-publication-note" {...RevealItem({ kind: "copy", delayMs: 850 })}>Conceptual visuals are shown separately from photographs of completed project work.</p>
      </section>
    </main>
  );
}
