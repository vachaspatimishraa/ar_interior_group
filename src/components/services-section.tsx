"use client";

import Image from "next/image";
import { useState } from "react";
import { serviceOverview } from "@/data/services";
import { ImageReveal, RevealItem, SectionReveal, StaggerGroup } from "@/lib/motion/reveal-attributes";
import { usePreviewSelection } from "@/lib/motion/use-preview-selection";
import { PreviewImagePreloader } from "@/components/preview-image-preloader";

export function ServicesSection() {
  const { selectedIndex, previewIndex, handlers } = usePreviewSelection();
  const [expandedDetails, setExpandedDetails] = useState(false);
  const currentService = serviceOverview[previewIndex] ?? serviceOverview[0];

  const preloaderImages = serviceOverview
    .map((s) => s.image)
    .filter((img): img is NonNullable<typeof img> => Boolean(img));

  return (
    <section id="services" className="home-section home-services py-20 sm:py-28 lg:py-36 border-t border-ink/10" aria-labelledby="services-heading" {...SectionReveal()}>
      <div className="home-shell mx-auto max-w-[1440px] px-6 sm:px-8 lg:px-12">
        <PreviewImagePreloader
          images={preloaderImages}
          sizes="(max-width: 767px) 92vw, (max-width: 1199px) 48vw, 52vw"
        />

        {/* Section Header */}
        <div className="mb-14 grid gap-6 border-b border-ink/15 pb-8 lg:grid-cols-[0.8fr_1fr] lg:gap-16">
          <div {...StaggerGroup()}>
            <p className="eyebrow text-gold-ink" {...RevealItem({ kind: "eyebrow", delayMs: 350 })}>
              Section 3 · Services & Disciplines
            </p>
            <h2 id="services-heading" className="mt-3 font-display text-4xl sm:text-5xl lg:text-6xl tracking-[-0.04em] text-ink" {...RevealItem({ kind: "heading", delayMs: 460 })}>
              One space. Many disciplines.
            </h2>
          </div>
          <div className="flex flex-col justify-end" {...RevealItem({ kind: "copy", delayMs: 580 })}>
            <p className="text-sm sm:text-base leading-relaxed text-ink/75 max-w-xl">
              From modular micro-markets and civil structures to bespoke partitions, flooring, and MEP works, AR Interior Group provides turnkey execution across seven specialized domains.
            </p>
          </div>
        </div>

        {/* Interactive Layout: Left is 7 Selectors, Right is Visual Stage + Details */}
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16 items-start">
          {/* Service Selector List */}
          <div className="space-y-2.5" role="group" aria-label="Select a service category" {...StaggerGroup({ intervalMs: 40 })}>
            {serviceOverview.map((service, index) => {
              const isSelected = selectedIndex === index;
              const isPreviewed = previewIndex === index && !isSelected;
              return (
                <button
                  key={service.slug}
                  type="button"
                  aria-pressed={isSelected}
                  data-previewed={isPreviewed}
                  className={`w-full text-left p-4 sm:p-5 rounded-xl border transition-all flex items-center justify-between group ${
                    isSelected
                      ? "bg-white border-gold/80 shadow-sm ring-1 ring-gold/20"
                      : "bg-white/40 border-ink/10 hover:bg-white/80 hover:border-ink/25"
                  }`}
                  {...handlers(index)}
                  {...RevealItem({ kind: "control", delayMs: 500 + index * 40 })}
                >
                  <div className="flex items-center gap-4">
                    <span className="font-mono text-xs uppercase tracking-wider text-gold-ink font-semibold">
                      0{index + 1}
                    </span>
                    <span className="font-display text-lg sm:text-xl text-ink font-medium">
                      {service.title}
                    </span>
                  </div>
                  <span
                    className={`text-xs uppercase tracking-wider font-semibold transition-transform ${
                      isSelected ? "text-gold-ink translate-x-1" : "text-ink/40 group-hover:text-ink/80"
                    }`}
                    aria-hidden="true"
                  >
                    →
                  </span>
                </button>
              );
            })}
          </div>

          {/* Visual Showcase Stage */}
          <div className="rounded-2xl border border-ink/12 bg-white/80 p-6 sm:p-8 shadow-sm flex flex-col justify-between" {...ImageReveal({ direction: "right", rounded: false })}>
            <div>
              <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-image-surface mb-6">
                {currentService.image ? (
                  <Image
                    src={currentService.image.src}
                    alt={currentService.image.alt}
                    fill
                    sizes="(max-width: 767px) 92vw, (max-width: 1199px) 50vw, 45vw"
                    className="object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="h-full w-full flex flex-col items-center justify-center p-8 text-center bg-surface-muted">
                    <span className="eyebrow text-gold-ink mb-2">Bespoke Fabrication</span>
                    <h3 className="font-display text-2xl text-ink max-w-xs">{currentService.title}</h3>
                    <p className="text-xs text-ink/65 mt-2 max-w-xs">Custom metal and structural railing fabrication executed as per client specification and architectural drawings.</p>
                  </div>
                )}
                <span className="absolute bottom-3 left-3 bg-ink/75 backdrop-blur-md px-3 py-1 rounded-md text-[10px] uppercase tracking-wider text-page font-medium">
                  {currentService.sourceSection}
                </span>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-ink/10 pb-3">
                  <h3 className="font-display text-2xl sm:text-3xl text-ink">{currentService.title}</h3>
                  <span className="text-xs text-ink/50 uppercase font-mono">Turnkey Fit-Out</span>
                </div>
                <p className="text-sm leading-relaxed text-ink/75">{currentService.description}</p>
                {currentService.detail && (
                  <p className="text-xs sm:text-sm text-ink/65 italic">{currentService.detail}</p>
                )}
              </div>
            </div>

            {/* Expandable Specifications / Bullets */}
            <div className="mt-6 pt-4 border-t border-ink/10">
              <button
                type="button"
                onClick={() => setExpandedDetails((prev) => !prev)}
                className="text-xs font-semibold uppercase tracking-wider text-gold-ink hover:text-ink transition-colors flex items-center justify-between w-full py-1"
                aria-expanded={expandedDetails}
              >
                <span>{expandedDetails ? "Hide Scope Details" : "View Scope & Material Details"}</span>
                <span className="font-mono text-sm">{expandedDetails ? "−" : "+"}</span>
              </button>

              {expandedDetails && (
                <ul className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 animate-fadeIn">
                  {currentService.bullets.map((bullet) => (
                    <li key={bullet} className="text-xs text-ink/80 flex items-start gap-2 bg-ivory/60 p-2 rounded-lg border border-ink/5">
                      <span className="text-gold-ink font-bold" aria-hidden="true">✓</span>
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
