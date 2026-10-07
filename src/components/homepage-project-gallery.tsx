import Link from "next/link";
import { HomepagePortfolioImage } from "@/components/homepage-portfolio-image";
import { homepage } from "@/data/homepage";
import { homepageProjects } from "@/data/homepage-projects";
import { ImageReveal, RevealItem, StaggerGroup } from "@/lib/motion/reveal-attributes";

export function HomepageProjectGallery() {
  return (
    <div className="home-project-gallery" {...StaggerGroup()}>
      {homepageProjects.map(({ project, image }, index) => (
        <Link className={`home-project-card home-project-card-${index + 1}`} href={`/projects/${project.slug}`} key={project.slug}>
          <div className="home-project-image" {...ImageReveal()}>
            <HomepagePortfolioImage image={image} sizes={index === 0 ? "(max-width: 767px) 92vw, 60vw" : "(max-width: 767px) 92vw, 37vw"} className="home-project-photo" />
            <span className="home-project-index">{String(index + 1).padStart(2, "0")} / {String(homepageProjects.length).padStart(2, "0")}</span>
          </div>
          <div className="home-project-meta" {...RevealItem({ kind: "card" })}><div><h3>{project.title}</h3>{project.location && <p>{project.location}</p>}</div><span aria-hidden="true">↗</span></div>
        </Link>
      ))}
      <Link className="link-arrow home-projects-all" href={homepage.projects.action.href} {...RevealItem({ kind: "control" })}>{homepage.projects.action.label} <span aria-hidden="true">→</span></Link>
    </div>
  );
}
