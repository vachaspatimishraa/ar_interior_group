import Link from "next/link";
import { HomepagePortfolioImage } from "@/components/homepage-portfolio-image";
import { CinematicPlaceholder } from "@/components/cinematic-placeholder";
import { ClientLogoWall } from "@/components/client-logo-wall";
import { HomepageCqet } from "@/components/homepage-cqet";
import { HomepageContactCta } from "@/components/homepage-contact-cta";
import { ScrollReveal } from "@/components/scroll-reveal";
import { HomepageProjectGallery } from "@/components/homepage-project-gallery";
import { HomepageServiceShowcase } from "@/components/homepage-service-showcase";
import { ProjectTransformations } from "@/components/project-transformations";
import { ImageReveal, RevealItem, SectionReveal, StaggerGroup } from "@/lib/motion/reveal-attributes";
import { projects } from "@/data/company-profile";
import { homepage } from "@/data/homepage";
import { homepageAboutImage, homepagePrinciplesImage, homepageServices } from "@/data/homepage-projects";
import "./homepage.css";

export default function Home() {
  return (
    <main id="main-content" className="homepage">
      <ScrollReveal scope="homepage" />
      <CinematicPlaceholder />

      <section id="homepage-content" className="home-section home-about" aria-labelledby="home-about-title" {...SectionReveal()}>
        <div className="home-shell home-about-grid">
          <figure className="home-about-figure" {...ImageReveal()}>
            <div className="home-about-image"><HomepagePortfolioImage image={homepageAboutImage} sizes="(max-width: 767px) 92vw, 54vw" /></div>
            <figcaption>{homepageAboutImage.caption}</figcaption>
          </figure>
          <div className="home-about-copy" {...StaggerGroup()}>
            <p className="eyebrow text-gold-ink" {...RevealItem({ kind: "eyebrow" })}>{homepage.about.eyebrow}</p>
            <h2 className="home-title" id="home-about-title" {...RevealItem({ kind: "heading" })}>{homepage.about.title}</h2>
            <p className="home-description home-about-description" {...RevealItem({ kind: "copy" })}>{homepage.about.description}</p>
            <Link className="link-arrow" href={homepage.about.action.href} {...RevealItem({ kind: "control" })}>{homepage.about.action.label} <span aria-hidden="true">↗</span></Link>
          </div>
        </div>
      </section>

      <section className="home-section home-services" aria-labelledby="home-services-title" {...SectionReveal()}>
        <div className="home-shell">
          <div className="home-section-heading">
            <div {...StaggerGroup()}><p className="eyebrow text-gold-ink" {...RevealItem({ kind: "eyebrow" })}>{homepage.services.eyebrow}</p><h2 className="home-title" id="home-services-title" {...RevealItem({ kind: "heading" })}>{homepage.services.title}</h2></div>
            <p className="home-description" {...RevealItem({ kind: "copy" })}>{homepage.services.description}</p>
          </div>
          <HomepageServiceShowcase items={homepageServices} />
        </div>
      </section>

      <section className="home-section home-projects" aria-labelledby="home-projects-title" {...SectionReveal()}>
        <div className="home-shell">
          <div className="home-section-heading">
            <div {...StaggerGroup()}><p className="eyebrow text-gold-ink" {...RevealItem({ kind: "eyebrow" })}>{homepage.projects.eyebrow}</p><h2 className="home-title" id="home-projects-title" {...RevealItem({ kind: "heading" })}>{homepage.projects.title}</h2></div>
            {homepage.projects.description && <p className="home-description" {...RevealItem({ kind: "copy" })}>{homepage.projects.description}</p>}
          </div>
          <HomepageProjectGallery />
        </div>
      </section>

      <section className="home-section home-transformations" aria-labelledby="home-transformations-title" {...SectionReveal()}>
        <div className="home-shell"><ProjectTransformations items={projects} /></div>
      </section>

      <section className="home-section home-principles" aria-labelledby="home-principles-title" {...SectionReveal()}>
        <div className="home-shell"><HomepageCqet image={homepagePrinciplesImage} /></div>
      </section>

      <section className="home-section home-clients client-proof-section" aria-labelledby="home-clients-title" {...SectionReveal()}>
        <div className="home-shell">
          <div className="home-section-heading">
            <div {...StaggerGroup()}>{homepage.clients.eyebrow && <p className="eyebrow text-gold-ink" {...RevealItem({ kind: "eyebrow" })}>{homepage.clients.eyebrow}</p>}<h2 className="home-title" id="home-clients-title" {...RevealItem({ kind: "heading" })}>{homepage.clients.title}</h2></div>
            <div className="home-heading-side" {...StaggerGroup()}>{homepage.clients.description && <p className="home-description" {...RevealItem({ kind: "copy" })}>{homepage.clients.description}</p>}<Link className="link-arrow" href={homepage.clients.action.href} {...RevealItem({ kind: "control" })}>{homepage.clients.action.label} <span aria-hidden="true">↗</span></Link></div>
          </div>
          <ClientLogoWall compact reveal />
          {homepage.clients.note && <p className="home-clients-note" {...RevealItem({ kind: "copy" })}>{homepage.clients.note}</p>}
        </div>
      </section>

      <HomepageContactCta />
    </main>
  );
}
