"use client";

import Image from "next/image";
import Link from "next/link";
import { PreviewImagePreloader } from "@/components/preview-image-preloader";
import type { Project } from "@/data/company-profile";
import { usePreviewSelection } from "@/lib/motion/use-preview-selection";
import { ImageReveal, RevealItem, StaggerGroup } from "@/lib/motion/reveal-attributes";

function imagePath(path: string) {
  return `/${path.replace(/^public\//, "")}`;
}

function featuredImage(project: Project) {
  return project.comparison?.after ?? project.images[0];
}

export function ProjectsFeaturedShowcase({ items }: { items: Project[] }) {
  const { selectedIndex, previewIndex, handlers } = usePreviewSelection();
  const selected = items[previewIndex];
  if (!selected) return null;

  return (
    <div className="projects-featured-layout">
      <div className="projects-featured-selector" role="group" aria-label="Choose a featured project" {...StaggerGroup({ intervalMs: 55 })}>
        {items.map((project, index) => {
          const image = featuredImage(project);
          if (!image) return null;
          return (
            <button key={project.slug} type="button" className="projects-selector-button" aria-pressed={selectedIndex === index} data-previewed={previewIndex === index && selectedIndex !== index} {...handlers(index)} {...RevealItem({ kind: "control", delayMs: 720 })}>
              <span className="projects-selector-number">{String(index + 1).padStart(2, "0")}</span>
              <span className="projects-selector-copy"><span>{project.title}</span><small>{project.location ?? "Location not specified"}</small></span>
              <span className="projects-card-arrow" aria-hidden="true">↗</span>
            </button>
          );
        })}
      </div>

      <div className="projects-featured-detail" aria-live="polite" aria-atomic="true">
        <div className="projects-featured-image" aria-label={`${selected.title}${selected.location ? `, ${selected.location}` : ""} project photograph`} {...ImageReveal({ direction: "right", rounded: false, delayMs: 100 })}>
          {items.map((project, index) => {
            const image = featuredImage(project);
            if (!image) return null;
            const src = imagePath(image.path);
            return <div key={project.slug} className="projects-featured-image-layer" data-active={previewIndex === index} aria-hidden={previewIndex !== index}><Image src={src} alt={`${project.title}${project.location ? `, ${project.location}` : ""} portfolio photograph`} fill sizes="(max-width: 767px) 92vw, (max-width: 1199px) 56vw, 60vw" loading={index === 0 ? "eager" : "lazy"} quality={75} className="projects-cover-image" /></div>;
          })}
          <span className="projects-image-index">{String(previewIndex + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}</span>
        </div>
        <div className="projects-featured-caption" {...RevealItem({ kind: "copy", delayMs: 600 })}>
          <div><p className="eyebrow text-gold-ink">{selected.location ?? "Selected work"}</p><h3>{selected.title}</h3><p className="projects-featured-context">{selected.scope ?? selected.summary}</p></div>
          <Link href={`/projects/${selected.slug}`} className="projects-view-link">View project <span aria-hidden="true">↗</span></Link>
        </div>
      </div>
      <PreviewImagePreloader images={items.flatMap((project) => { const image = featuredImage(project); return image ? [{ src: imagePath(image.path), width: image.width, height: image.height }] : []; })} sizes="(max-width: 767px) 92vw, 58vw" />
    </div>
  );
}
