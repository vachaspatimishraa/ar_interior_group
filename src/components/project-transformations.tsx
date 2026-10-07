"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { PreviewImagePreloader } from "@/components/preview-image-preloader";
import type { Project } from "@/data/company-profile";
import { homepage, homepageTransformationSlugs } from "@/data/homepage";
import { ImageReveal, RevealItem, StaggerGroup } from "@/lib/motion/reveal-attributes";
import { usePreviewSelection } from "@/lib/motion/use-preview-selection";

function sourcePath(path: string) {
  return `/${path.replace(/^public\//, "")}`;
}

export function ProjectTransformations({ items }: { items: Project[] }) {
  const transformations = homepageTransformationSlugs.map((slug) => items.find((item) => item.slug === slug)).filter((item): item is Project => Boolean(item?.comparison));
  const { selectedIndex, previewIndex, handlers } = usePreviewSelection();
  const [failedImages, setFailedImages] = useState<Set<string>>(() => new Set());
  const project = transformations[previewIndex];
  if (!project?.comparison) return null;
  const sides = [
    { label: "Before" as const, imageFor: (item: Project) => item.comparison?.before },
    { label: "After" as const, imageFor: (item: Project) => item.comparison?.after },
  ];

  return (
    <div className="transform-feature">
      <div className="transform-intro">
        <p className="eyebrow text-gold-ink" {...RevealItem({ kind: "eyebrow" })}>{homepage.transformations.eyebrow}</p>
        <h2 className="home-title" id="home-transformations-title" {...RevealItem({ kind: "heading" })}>{homepage.transformations.title}</h2>
        {homepage.transformations.description && <p className="home-description" {...RevealItem({ kind: "copy" })}>{homepage.transformations.description}</p>}
        <PreviewImagePreloader
          images={transformations.flatMap((item) => item.comparison ? [item.comparison.before, item.comparison.after].map((image) => ({ src: sourcePath(image.path), width: image.width, height: image.height })) : [])}
          sizes="(max-width: 639px) 92vw, (max-width: 1023px) 45vw, 32vw"
        />
        <div className="transform-selectors mt-8" role="group" aria-label="Choose a documented project transformation" {...StaggerGroup()}>
          {transformations.map((item, index) => (
            <button key={item.slug} type="button" aria-pressed={selectedIndex === index} data-previewed={previewIndex === index && selectedIndex !== index} className="transform-selector" {...handlers(index)} {...RevealItem({ kind: "control" })}>
              <span className="eyebrow">0{index + 1}</span><span>{item.title}{item.location ? ` · ${item.location}` : ""}</span><span aria-hidden="true">↗</span>
            </button>
          ))}
        </div>
        <Link className="link-arrow mt-7" href={homepage.transformations.action.href} {...RevealItem({ kind: "control" })}>{homepage.transformations.action.label} <span aria-hidden="true">→</span></Link>
      </div>

      <div className="transform-pair" aria-live="polite" aria-atomic="true" {...ImageReveal({ direction: "right", rounded: false })}>
        {sides.map(({ label, imageFor }) => (
          <figure className="transform-panel" key={label}>
            <div className="transform-image-frame">
              {transformations.map((item, index) => {
                const image = imageFor(item);
                if (!image) return null;
                const src = sourcePath(image.path);
                const imageAlt = `${item.title}${item.location ? `, ${item.location}` : ""} — ${label}`;
                const failed = failedImages.has(src);
                return (
                  <div className="transform-image-layer" key={item.slug} data-active={previewIndex === index} aria-hidden={previewIndex !== index}>
                    <Image src={src} alt={failed ? "" : imageAlt} fill loading={previewIndex === index ? "eager" : "lazy"} sizes="(max-width: 639px) 92vw, (max-width: 1023px) 45vw, 32vw" className="transform-image" onError={() => setFailedImages((current) => new Set(current).add(src))} />
                    {failed && <div className="transform-image-unavailable" role="img" aria-label={`${imageAlt} photograph unavailable`}><span className="eyebrow text-gold-ink">{label}</span><span className="font-display text-2xl">{item.title}</span><span className="text-xs text-ink-muted">This photograph is currently unavailable.</span></div>}
                  </div>
                );
              })}
              <span className="transform-label">{label}</span>
            </div>
          </figure>
        ))}
        <div className="transform-project-caption"><span className="font-display text-3xl sm:text-4xl">{project.title}</span><span className="text-xs uppercase tracking-[0.14em] text-ink-muted">{project.location}</span></div>
      </div>
    </div>
  );
}
