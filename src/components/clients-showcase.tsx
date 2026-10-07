"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { PreviewImagePreloader } from "@/components/preview-image-preloader";
import type { Project } from "@/data/company-profile";
import { ImageReveal, RevealItem, StaggerGroup } from "@/lib/motion/reveal-attributes";
import { usePreviewSelection } from "@/lib/motion/use-preview-selection";

function publicImagePath(path: string) {
  return "/" + path.replace(/^public\//, "");
}

export function ClientsShowcase({ projects }: { projects: Project[] }) {
  const { selectedIndex, previewIndex, handlers } = usePreviewSelection();
  const [failedImages, setFailedImages] = useState<Set<string>>(() => new Set());
  const project = projects[previewIndex];
  const image = project.images[0];
  const imageSrc = image ? publicImagePath(image.path) : undefined;
  const imageAvailable = imageSrc !== undefined && !failedImages.has(imageSrc);

  return (
    <div className="clients-showcase">
      <PreviewImagePreloader
        images={projects.flatMap((item) => item.images[0] ? [{ src: publicImagePath(item.images[0].path), width: item.images[0].width, height: item.images[0].height }] : [])}
        sizes="(max-width: 1023px) 92vw, 54vw"
      />
      <div className="clients-showcase-selector" role="group" aria-label="Select a documented portfolio association" {...StaggerGroup({ intervalMs: 45 })}>
        {projects.map((item, index) => (
          <button
            key={item.slug}
            type="button"
            className="clients-showcase-option"
            aria-pressed={selectedIndex === index}
            data-previewed={previewIndex === index && selectedIndex !== index}
            {...handlers(index)}
            {...RevealItem({ kind: "control", delayMs: 700 })}
          >
            <span className="clients-showcase-number">{String(index + 1).padStart(2, "0")}</span>
            <span className="clients-showcase-option-name">{item.title}</span>
            <span className="clients-showcase-option-location">{item.location ?? "Location not specified"}</span>
            <span className="clients-showcase-arrow" aria-hidden="true">↗</span>
          </button>
        ))}
      </div>

      <article className="clients-showcase-detail" aria-live="polite" aria-atomic="true">
        <figure className="clients-showcase-figure" {...ImageReveal({ direction: "right", delayMs: 100 })}>
          {projects.map((item, index) => {
            const featuredImage = item.images[0];
            const src = featuredImage ? publicImagePath(featuredImage.path) : undefined;
            if (!src || failedImages.has(src)) return null;
            return (
              <div className="clients-showcase-image-layer" key={item.slug} data-active={previewIndex === index} aria-hidden={previewIndex !== index}>
                <Image
                  src={src}
                  alt={"Portfolio photograph associated with " + item.title + (item.location ? " in " + item.location : "")}
                  fill
                  sizes="(max-width: 1023px) 92vw, 54vw"
                  loading={previewIndex === index ? "eager" : "lazy"}
                  onError={() => setFailedImages((current) => new Set(current).add(src))}
                  className="clients-showcase-photo"
                />
              </div>
            );
          })}
          {!imageAvailable && (
            <div className="clients-showcase-text-fallback" role="img" aria-label={"Photograph unavailable for " + project.title + "; showing the verified project reference instead"}>
              <span className="eyebrow">Portfolio entry</span>
              <span className="clients-showcase-fallback-title">{project.title}</span>
              <span>{project.location ?? project.category}</span>
            </div>
          )}
          <figcaption className="clients-showcase-image-caption" {...RevealItem({ kind: "copy", delayMs: 220 })}>Portfolio photograph · {project.title}{project.location ? ` · ${project.location}` : ""}</figcaption>
        </figure>

        <div className="clients-showcase-copy">
          <div>
            <p className="eyebrow text-gold-ink" {...RevealItem({ kind: "eyebrow", delayMs: 350 })}>Selected organisation · {String(previewIndex + 1).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}</p>
            <h3 className="clients-showcase-title" {...RevealItem({ kind: "heading", delayMs: 450 })}>{project.title}</h3>
            <p className="clients-showcase-location" {...RevealItem({ kind: "copy", delayMs: 580 })}>{project.location ?? "Location not specified"}</p>
            <p className="clients-showcase-context" {...RevealItem({ kind: "copy", delayMs: 650 })}><span>Project context</span>{project.scope ?? project.category}</p>
            <p className="clients-showcase-summary" {...RevealItem({ kind: "copy", delayMs: 700 })}>{project.summary}</p>
          </div>
          <Link className="link-arrow clients-showcase-link" href={"/projects/" + project.slug} {...RevealItem({ kind: "control", delayMs: 850 })}>
            View project <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </article>
    </div>
  );
}
