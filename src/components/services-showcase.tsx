"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { PreviewImagePreloader } from "@/components/preview-image-preloader";
import type { ServiceOverviewItem } from "@/data/services";
import { ImageReveal, RevealItem, StaggerGroup } from "@/lib/motion/reveal-attributes";
import { usePreviewSelection } from "@/lib/motion/use-preview-selection";

export function ServicesShowcase({ items }: { items: ServiceOverviewItem[] }) {
  const { selectedIndex, previewIndex, handlers } = usePreviewSelection();
  const [failedImageSources, setFailedImageSources] = useState<Set<string>>(() => new Set());
  const service = items[previewIndex];
  const hasPreviewImage = service.image !== undefined && !failedImageSources.has(service.image.src);
  const previewImages = items.flatMap((item) => item.image ? [{ src: item.image.src }] : []);
  return (
    <div className="grid gap-8 lg:grid-cols-[0.72fr_1.28fr] lg:gap-16">
      <PreviewImagePreloader images={previewImages} sizes="(max-width: 1023px) 92vw, 62vw" />
      <nav aria-label="Choose a service to preview" className="services-selector border-t border-ink/15" {...StaggerGroup()}>
        {items.map((item, index) => <button key={item.slug} type="button" aria-pressed={selectedIndex === index} data-previewed={previewIndex === index && selectedIndex !== index} className={`services-selector-item group flex w-full items-center gap-4 border-b border-ink/15 py-5 text-left transition-colors ${selectedIndex === index ? "text-ink" : previewIndex === index ? "bg-surface-muted text-ink" : "text-ink/45 hover:text-ink"}`} {...handlers(index)} {...RevealItem({ kind: "control" })}>
          <span className={`text-xs tracking-[0.16em] ${selectedIndex === index ? "text-gold-ink" : "text-ink/35"}`}>{String(index + 1).padStart(2, "0")}</span><span className="flex-1 text-sm tracking-[0.04em] sm:text-base">{item.title}</span><span className={`text-xl transition-transform ${selectedIndex === index ? "translate-x-1 text-gold-ink" : ""}`} aria-hidden="true">↗</span>
        </button>)}
      </nav>
      <article className="services-preview overflow-hidden rounded-[var(--theme-radius-panel)] bg-surface-muted" aria-label={`${service.title} preview`}>
        <div className="services-preview-frame relative aspect-[1.08] overflow-hidden sm:aspect-[1.18] lg:aspect-[1.12]" {...ImageReveal({ direction: "right" })}>
          {hasPreviewImage ? items.map((item, index) => item.image && <div key={item.slug} className="services-preview-layer absolute inset-0 transition-[opacity,transform] duration-300" data-active={previewIndex === index} aria-hidden={previewIndex !== index} style={{ opacity: previewIndex === index ? 1 : 0 }}><Image src={item.image.src} alt={item.image.alt} fill sizes="(max-width: 1023px) 92vw, 62vw" loading={previewIndex === index ? "eager" : "lazy"} onError={() => setFailedImageSources((current) => new Set(current).add(item.image!.src))} className="object-cover" /></div>) : <div className="services-text-led flex h-full flex-col justify-between p-7 text-ivory sm:p-12" role="img" aria-label={`Text-led preview for ${service.title}; no usable service photograph is available`}><span className="eyebrow text-gold">AR / IG</span><span className="max-w-2xl font-display text-5xl leading-[0.95] tracking-[-0.05em] sm:text-7xl">{service.title}</span><span className="services-linework" aria-hidden="true" /></div>}
        </div>
        <div className="p-7 sm:p-10" aria-live="polite" aria-atomic="true"><div className="flex items-start justify-between gap-5"><div><p className="eyebrow text-gold-ink">{String(previewIndex + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}</p><h3 className="mt-4 max-w-xl font-display text-4xl leading-none tracking-[-0.045em] text-ink sm:text-5xl">{service.title}</h3></div><Link href={`/services/${service.slug}`} className="link-arrow shrink-0" aria-label={`View ${service.title}`}>View service <span aria-hidden="true">↗</span></Link></div><p className="mt-6 max-w-2xl text-base leading-7 text-ink/70">{service.description}</p></div>
      </article>
    </div>
  );
}
