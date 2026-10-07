import Image from "next/image";
import Link from "next/link";
import { AboutCapabilityShowcase, AboutPrinciples, AboutTeamShowcase } from "@/components/about-interactions";
import { ScrollReveal } from "@/components/scroll-reveal";
import { aboutPage } from "@/data/about-page";
import { createPageMetadata } from "@/lib/page-metadata";
import { ImageReveal, RevealItem, SectionReveal, StaggerGroup } from "@/lib/motion/reveal-attributes";
import "./about.css";

export const metadata = createPageMetadata(
  "About",
  "Learn about AR Interior Group, founded in 2019, and its work in commercial space planning, design-build, fit-outs and project execution.",
  "/about",
);

export default function AboutPage() {
  const heroImage = aboutPage.heroVisual;

  return (
    <main id="main-content" className="about-page">
      <ScrollReveal scope="about-page" />
      <section className="about-hero" aria-labelledby="about-hero-title" {...SectionReveal()}>
        <div className="about-hero-image-wrap">
          <Image
            src={heroImage.src}
            alt={heroImage.alt}
            fill
            preload
            sizes="(max-width: 767px) 92vw, 47vw"
            className="about-hero-image"
            {...ImageReveal({ direction: "left", rounded: false, delayMs: 100 })}
          />
          <span className="about-hero-scrim" />
        </div>
        <div className="about-hero-content">
          <nav className="about-hero-breadcrumb" aria-label="Breadcrumb" {...RevealItem({ kind: "heading", delayMs: 250 })}>
            <Link href="/">Home</Link><span aria-hidden="true">/</span><span aria-current="page">About</span>
          </nav>
          <p className="about-eyebrow about-hero-eyebrow" {...RevealItem({ kind: "eyebrow", delayMs: 400 })}>About AR Interior Group</p>
          <h1 className="about-hero-title" id="about-hero-title" {...StaggerGroup()}><span {...RevealItem({ kind: "heading", delayMs: 500 })}>Transforming</span><span {...RevealItem({ kind: "heading", delayMs: 560 })}><em>commercial spaces.</em></span></h1>
          <span className="about-hero-rule" aria-hidden="true" {...RevealItem({ kind: "accent", direction: "none", delayMs: 600 })} />
          <p className="about-hero-intro" {...RevealItem({ kind: "copy", delayMs: 650 })}>{aboutPage.introduction}</p>
          <p className="about-hero-tagline" {...RevealItem({ kind: "copy", delayMs: 740 })}>{aboutPage.tagline}</p>
          <div className="about-hero-actions" {...StaggerGroup({ intervalMs: 100 })}>
            <Link className="about-hero-link" href="/projects" {...RevealItem({ kind: "control", delayMs: 950 })}>Explore our work <span aria-hidden="true">↗</span></Link>
          </div>
        </div>
        <p className="about-hero-caption" {...RevealItem({ kind: "copy", delayMs: 250 })}>{heroImage.caption}</p>
      </section>

      <section className="about-section about-section-muted" aria-labelledby="about-story-title" {...SectionReveal()}>
        <div className="about-shell about-story-layout">
          <div className="about-story-visuals" {...StaggerGroup()}>
            {aboutPage.storyVisuals.map((visual, index) => (
              <figure className="about-figure about-story-figure" key={visual.src}>
                <div className="about-photo-frame"><Image src={visual.src} alt={visual.alt} fill loading="lazy" sizes="(max-width: 899px) 46vw, 26vw" decoding="async" {...ImageReveal({ delayMs: index === 0 ? 100 : 250 })} /></div>
                <figcaption {...RevealItem({ kind: "copy", delayMs: 250 })}>{visual.caption}</figcaption>
              </figure>
            ))}
          </div>
          <div className="about-story-copy" {...StaggerGroup()}>
            <p className="about-eyebrow" {...RevealItem({ kind: "eyebrow", delayMs: 400 })}>Our story</p>
           <h2 className="about-story-title" id="about-story-title" {...RevealItem({ kind: "heading", delayMs: 500 })}>Founded in 2019.</h2>
            {aboutPage.story.map((paragraph) => <p key={paragraph} {...RevealItem({ kind: "copy", delayMs: 650 })}>{paragraph}</p>)}
            <blockquote className="about-story-mission" {...RevealItem({ kind: "copy", delayMs: 800 })}>{aboutPage.storyMission}</blockquote>
            <div className="about-founded" {...RevealItem({ kind: "card", delayMs: 800 })}><strong>{aboutPage.foundingYear}</strong><span>Founded</span></div>
          </div>
        </div>
      </section>

      <section className="about-section" aria-labelledby="about-capabilities-title" {...SectionReveal()}>
        <div className="about-shell">
          <div className="about-section-heading">
             <div><p className="about-eyebrow" {...RevealItem({ kind: "eyebrow", delayMs: 400 })}>Our capabilities</p><h2 className="about-title" id="about-capabilities-title" {...RevealItem({ kind: "heading", delayMs: 500 })}>Space planning and design-build.</h2></div>
             <p className="about-lede" {...RevealItem({ kind: "copy", delayMs: 650 })}>Experts in Space Planning and Design &amp; Build Projects.</p>
          </div>
          <AboutCapabilityShowcase groups={aboutPage.capabilityGroups} />
        </div>
      </section>

      <section className="about-section about-section-muted" aria-labelledby="about-process-title" {...SectionReveal()}>
        <div className="about-shell">
          <div className="about-section-heading">
             <div><p className="about-eyebrow" {...RevealItem({ kind: "eyebrow", delayMs: 400 })}>Our team</p><h2 className="about-title" id="about-process-title" {...RevealItem({ kind: "heading", delayMs: 500 })}>People and expertise behind every space.</h2></div>
             <p className="about-lede" {...RevealItem({ kind: "copy", delayMs: 650 })}>Team roles span design, project management, planning, supervision, safety, quality and MEP.</p>
          </div>
          <AboutTeamShowcase roles={aboutPage.strength.roles} image={aboutPage.processImage} />
        </div>
      </section>

      <section className="about-section" aria-labelledby="about-purpose-title" {...SectionReveal()}>
        <div className="about-shell">
          <div className="about-section-heading"><div><p className="about-eyebrow" {...RevealItem({ kind: "eyebrow", delayMs: 400 })}>Purpose, vision & values</p><h2 className="about-title" id="about-purpose-title" {...RevealItem({ kind: "heading", delayMs: 500 })}>The principles we work toward.</h2></div><p className="about-lede" {...RevealItem({ kind: "copy", delayMs: 650 })}>Accountability, client commitment, honesty, integrity, innovation and continual improvement.</p></div>
          <AboutPrinciples items={aboutPage.statements} note="Portfolio photographs shown here are project references and are not illustrations of these statements." images={aboutPage.statements.map((statement) => statement.image)} />
        </div>
      </section>

      <section className="about-section" aria-labelledby="about-principles-title" {...SectionReveal()}>
        <div className="about-shell">
          <div className="about-section-heading">
             <div><p className="about-eyebrow" {...RevealItem({ kind: "eyebrow", delayMs: 400 })}>Success Mantra</p><h2 className="about-title" id="about-principles-title" {...RevealItem({ kind: "heading", delayMs: 500 })}>C.Q.E.T</h2></div>
             <p className="about-lede" {...RevealItem({ kind: "copy", delayMs: 650 })}>Consistency, Quality, Economical, Time Efficiency.</p>
          </div>
          <AboutPrinciples items={aboutPage.principles.items} note={aboutPage.principles.note} images={aboutPage.principles.images} />
        </div>
      </section>

      <section className="about-section about-section-muted" aria-labelledby="about-projects-title" {...SectionReveal()}>
        <div className="about-shell">
          <div className="about-section-heading">
             <div><p className="about-eyebrow" {...RevealItem({ kind: "eyebrow", delayMs: 400 })}>Our projects</p><h2 className="about-title" id="about-projects-title" {...RevealItem({ kind: "heading", delayMs: 500 })}>Selected project references.</h2></div>
             <p className="about-lede" {...RevealItem({ kind: "copy", delayMs: 650 })}>A selection of named projects and locations.</p>
          </div>
          <div className="about-project-grid" {...StaggerGroup()}>
            {aboutPage.selectedProjects.map(({ project, image, scope }, index) => (
              <Link className="about-project-card" href={`/projects/${project.slug}`} key={project.slug}>
                <div className="about-project-frame">
                  <Image src={image.src} alt={image.alt} fill loading="lazy" sizes={index === 0 ? "(max-width: 639px) 92vw, 57vw" : "(max-width: 639px) 92vw, 39vw"} decoding="async" {...ImageReveal({ delayMs: index === 0 ? 100 : 250 })} />
                  <span className="about-capability-index" aria-hidden="true">0{index + 1} / 0{aboutPage.selectedProjects.length}</span>
                </div>
                <div className="about-project-meta" {...RevealItem({ kind: "card", delayMs: 800 })}>
                  <div>
                    <h3>{project.title}</h3>
                  {project.location && <p className="about-project-location">{project.location}</p>}
                    {scope && <p className="about-project-scope">{scope}</p>}
                  </div>
                  <span className="about-project-arrow" aria-hidden="true">↗</span>
                </div>
              </Link>
            ))}
          </div>
          <div className="about-work-footer"><Link className="button button-outline about-work-link" href="/projects" {...RevealItem({ kind: "control", delayMs: 950 })}>View all projects <span aria-hidden="true">↗</span></Link></div>
        </div>
      </section>

      <section className="about-section" aria-labelledby="about-contact-title" {...SectionReveal()}>
        <div className="about-shell about-contact-layout">
          <figure className="about-figure about-contact-figure">
            <div className="about-contact-photo-frame"><Image src={aboutPage.contactVisual.src} alt={aboutPage.contactVisual.alt} fill loading="lazy" sizes="(max-width: 899px) 92vw, 48vw" decoding="async" {...ImageReveal({ direction: "left", delayMs: 100 })} /></div>
            <figcaption className="about-contact-photo-caption" {...RevealItem({ kind: "copy", delayMs: 250 })}>{aboutPage.contactVisual.caption}</figcaption>
          </figure>
          <div className="about-contact-copy" {...StaggerGroup()}>
             <p className="about-eyebrow" {...RevealItem({ kind: "eyebrow", delayMs: 400 })}>Contact AR Interior Group</p>
             <h2 className="about-contact-title" id="about-contact-title" {...RevealItem({ kind: "heading", delayMs: 500 })}>{aboutPage.tagline}</h2>
             <p {...RevealItem({ kind: "copy", delayMs: 650 })}>{aboutPage.closingExcerpt}</p>
             <p {...RevealItem({ kind: "copy", delayMs: 800 })}>facilities@arinteriorgroup.com</p>
            <Link className="button button-dark about-contact-link" href="/contact#enquiry-form" {...RevealItem({ kind: "control", delayMs: 950 })}>Discuss Your Space <span aria-hidden="true">→</span></Link>
          </div>
        </div>
      </section>
    </main>
  );
}
