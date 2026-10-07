"use client";

import Image from "next/image";
import Link from "next/link";
import { PreviewImagePreloader } from "@/components/preview-image-preloader";
import type { Project, PortfolioImage } from "@/data/company-profile";
import { usePreviewSelection } from "@/lib/motion/use-preview-selection";
import { ImageReveal, RevealItem, StaggerGroup } from "@/lib/motion/reveal-attributes";

function imagePath(image: PortfolioImage) {
  return `/${image.path.replace(/^public\//, "")}`;
}

export function ProjectsTransformations({ items }: { items: Project[] }) {
  const { selectedIndex, previewIndex, handlers } = usePreviewSelection();
  const active = items[previewIndex];
  if (!active?.comparison) return null;
  const pair = [{ label: "Before", image: "before" as const }, { label: "After", image: "after" as const }];

  return (
    <div className="projects-transform-layout">
      <div className="projects-transform-pair" aria-live="polite" aria-atomic="true">
        {pair.map(({ label, image: side }) => (
          <figure key={side} className="projects-transform-panel">
            <div className="projects-transform-image-frame" {...ImageReveal({ direction: side === "before" ? "left" : "right", rounded: false, delayMs: side === "before" ? 110 : 230 })}>
              {items.map((project, index) => {
                const source = project.comparison?.[side];
                if (!source) return null;
                const src = imagePath(source);
                return <div key={project.slug} className="projects-transform-image-layer" data-active={previewIndex === index} aria-hidden={previewIndex !== index}><Image src={src} alt={`${project.title}${project.location ? `, ${project.location}` : ""}, ${label.toLowerCase()} photograph`} fill sizes="(max-width: 767px) 92vw, (max-width: 1199px) 45vw, 47vw" loading={index === 0 ? "eager" : "lazy"} quality={75} className="projects-cover-image" /></div>;
              })}
              <span className="projects-transform-label">{label}</span>
            </div>
            <figcaption>{active.title}{active.location ? ` · ${active.location}` : ""}</figcaption>
          </figure>
        ))}
      </div>

      <div className="projects-transform-footer">
        <div className="projects-transform-selectors" role="group" aria-label="Choose a documented before and after project" {...StaggerGroup({ intervalMs: 45 })}>
          {items.map((project, index) => (
            <button key={project.slug} type="button" className="projects-transform-selector" aria-pressed={selectedIndex === index} data-previewed={previewIndex === index && selectedIndex !== index} {...handlers(index)} {...RevealItem({ kind: "control", delayMs: 720 })}>
              <span>{String(index + 1).padStart(2, "0")}</span><span>{project.title}</span><span>{project.location}</span>
            </button>
          ))}
        </div>
        <div className="projects-transform-note"><p {...RevealItem({ kind: "copy", delayMs: 950 })}>{active.comparison.note}</p><Link href={`/projects/${active.slug}`} className="projects-view-link" {...RevealItem({ kind: "control", delayMs: 1050 })}>Project details <span aria-hidden="true">↗</span></Link></div>
      </div>
      <PreviewImagePreloader images={items.flatMap((project) => project.comparison ? [project.comparison.before, project.comparison.after].map((image) => ({ src: imagePath(image), width: image.width, height: image.height })) : [])} sizes="(max-width: 767px) 92vw, 47vw" />
    </div>
  );
}
