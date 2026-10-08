"use client";

import Image from "next/image";
import { useState } from "react";
import { ProjectTransformations } from "@/components/project-transformations";
import { directoryProjects, projects } from "@/data/company-profile";
import manifest from "@/data/project-image-manifest.json";
import { getConceptGalleryAssets } from "@/lib/concept-gallery";
import { RevealItem, SectionReveal, StaggerGroup } from "@/lib/motion/reveal-attributes";

type FilterTab = "all" | "workplace" | "micromarkets" | "before-after" | "concepts";

function imagePath(path: string, thumb = true) {
  return `/${path.replace(/^public\//, "").replace(/\.webp$/, thumb ? "-thumb.webp" : ".webp")}`;
}

const conceptDesigns = getConceptGalleryAssets(manifest.concept_designs);

export function ProjectsSection() {
  const [activeTab, setActiveTab] = useState<FilterTab>("all");
  const [expandedSlug, setExpandedSlug] = useState<string | null>(null);

  const filteredProjects = directoryProjects.filter((p) => {
    if (activeTab === "all") return true;
    if (activeTab === "workplace") return p.category === "Workplace & fit-outs";
    if (activeTab === "micromarkets") return p.category === "Micro-markets & kiosks";
    if (activeTab === "before-after") return Boolean(p.comparison);
    return false;
  });

  return (
    <section id="projects" className="home-section home-projects py-20 sm:py-28 lg:py-36 border-t border-ink/10" aria-labelledby="projects-heading" {...SectionReveal()}>
      <div className="home-shell mx-auto max-w-[1440px] px-6 sm:px-8 lg:px-12">
        {/* Section Header */}
        <div className="mb-12 grid gap-6 border-b border-ink/15 pb-8 lg:grid-cols-[0.8fr_1fr] lg:gap-16">
          <div {...StaggerGroup()}>
            <p className="eyebrow text-gold-ink" {...RevealItem({ kind: "eyebrow", delayMs: 350 })}>
              Section 5 · Documented Portfolio
            </p>
            <h2 id="projects-heading" className="mt-3 font-display text-4xl sm:text-5xl lg:text-6xl tracking-[-0.04em] text-ink" {...RevealItem({ kind: "heading", delayMs: 460 })}>
              Spaces made real.
            </h2>
          </div>
          <div className="flex flex-col justify-end" {...RevealItem({ kind: "copy", delayMs: 580 })}>
            <p className="text-sm sm:text-base leading-relaxed text-ink/75 max-w-xl">
              Every documented project from the verified AR Interior Group portfolio. Explore workplace fit-outs, specialized hospital micro-markets, and documented before-and-after transformations.
            </p>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2.5 mb-12" role="tablist" aria-label="Filter projects by category" {...StaggerGroup({ intervalMs: 30 })}>
          {[
            { id: "all" as const, label: "All Projects" },
            { id: "workplace" as const, label: "Workplace & Fit-Outs" },
            { id: "micromarkets" as const, label: "Micro-Markets & Kiosks" },
            { id: "before-after" as const, label: "Before & After (Transformations)" },
            { id: "concepts" as const, label: "3D Design Concepts" },
          ].map((tab) => (
            <button
              key={tab.id}
              role="tab"
              aria-selected={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`rounded-full px-4 py-2 text-xs uppercase tracking-wider font-medium transition-all ${
                activeTab === tab.id
                  ? "bg-ink text-page shadow-sm"
                  : "bg-white/60 text-ink/70 hover:bg-white hover:text-ink border border-ink/10"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Documented Before/After Spotlight (Always shown if before-after is selected or on all) */}
        {(activeTab === "all" || activeTab === "before-after") && (
          <div className="mb-20 rounded-2xl border border-ink/12 bg-white/80 p-6 sm:p-10 shadow-sm" {...SectionReveal()}>
            <ProjectTransformations items={projects} />
          </div>
        )}

        {/* Project Cards Grid (shown for all, workplace, micromarkets, before-after) */}
        {activeTab !== "concepts" && (
          <div className="mb-20">
            <div className="mb-6 flex items-center justify-between border-b border-ink/10 pb-3">
              <h3 className="font-display text-2xl text-ink">
                {activeTab === "all" ? "Documented Case Studies & References" : `Filtered: ${activeTab}`}
              </h3>
              <span className="text-xs uppercase font-mono text-ink/50">
                {filteredProjects.length} Entries
              </span>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" {...StaggerGroup({ intervalMs: 40 })}>
              {filteredProjects.map((project, idx) => {
                const hasImages = project.images.length > 0;
                const isExpanded = expandedSlug === project.slug;
                const primaryImage = project.images[0];

                return (
                  <article
                    key={project.slug}
                    className="rounded-xl border border-ink/10 bg-white/70 backdrop-blur-xs overflow-hidden shadow-2xs hover:border-gold/50 transition-all flex flex-col justify-between"
                    {...RevealItem({ kind: "card", delayMs: 400 + (idx % 6) * 40 })}
                  >
                    <div>
                      {/* Photo Thumbnail */}
                      {hasImages && primaryImage ? (
                        <div className="relative aspect-[16/10] bg-image-surface overflow-hidden">
                          <Image
                            src={imagePath(primaryImage.path, true)}
                            alt={`${project.title} portfolio photograph`}
                            fill
                            sizes="(max-width: 639px) 92vw, (max-width: 1023px) 45vw, 30vw"
                            className="object-cover transition-transform duration-500 hover:scale-105"
                            loading="lazy"
                          />
                          <span className="absolute bottom-2 left-2 bg-ink/75 px-2 py-0.5 rounded text-[9px] uppercase tracking-wider text-page font-mono">
                            {project.images.length} {project.images.length === 1 ? "Photo" : "Photos"}
                          </span>
                        </div>
                      ) : (
                        <div className="aspect-[16/8] bg-surface-muted/80 p-4 flex flex-col justify-center border-b border-ink/8">
                          <span className="text-[10px] uppercase font-mono text-gold-ink font-semibold">Micro-Market Location Reference</span>
                          <span className="text-xs text-ink/60 mt-1">Listed under micro-market execution coverage.</span>
                        </div>
                      )}

                      {/* Card Content */}
                      <div className="p-5">
                        <div className="flex items-center justify-between gap-2 mb-1.5">
                          <span className="text-[10px] font-semibold uppercase tracking-wider text-gold-ink">
                            {project.category}
                          </span>
                          {project.location && (
                            <span className="text-[11px] text-ink/50 uppercase font-mono">
                              {project.location}
                            </span>
                          )}
                        </div>
                        <h4 className="font-display text-xl text-ink font-medium leading-snug">
                          {project.title}
                        </h4>
                        <p className="text-xs text-ink/70 mt-2 line-clamp-2 leading-relaxed">
                          {project.scope ?? project.summary}
                        </p>
                      </div>
                    </div>

                    {/* Card Actions & Expandable Photo Gallery */}
                    <div className="p-5 pt-0 border-t border-ink/8 mt-3">
                      {hasImages && (
                        <button
                          type="button"
                          onClick={() => setExpandedSlug(isExpanded ? null : project.slug)}
                          className="w-full mt-3 py-2 text-xs font-semibold uppercase tracking-wider text-gold-ink hover:text-ink transition-colors flex items-center justify-between border-b border-gold/20"
                          aria-expanded={isExpanded}
                        >
                          <span>{isExpanded ? "Close Gallery" : "View All Photos"}</span>
                          <span className="font-mono text-sm">{isExpanded ? "−" : "+"}</span>
                        </button>
                      )}

                      {/* Inline Expanded Photo Gallery */}
                      {isExpanded && hasImages && (
                        <div className="mt-4 pt-3 space-y-3 animate-fadeIn">
                          <p className="text-[11px] text-ink/50 uppercase font-mono">All Documented Photographs</p>
                          <div className="grid grid-cols-2 gap-2">
                            {project.images.map((img) => (
                              <div key={img.pdf_xref} className="relative aspect-[4/3] rounded bg-image-surface overflow-hidden">
                                <Image
                                  src={imagePath(img.path, true)}
                                  alt={`${project.title} interior detail`}
                                  fill
                                  sizes="20vw"
                                  className="object-cover"
                                  loading="lazy"
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        )}

        {/* 3D Architectural Concepts (Shown for all or concepts tab) */}
        {(activeTab === "all" || activeTab === "concepts") && (
          <div className="rounded-2xl border border-ink/10 bg-surface-muted/50 p-8 sm:p-12" {...SectionReveal()}>
            <div className="mb-8 border-b border-ink/10 pb-5">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-gold-ink">Separate Concept Collection</span>
              <h3 className="font-display text-3xl text-ink mt-1">3D Architectural Design Renders</h3>
              <p className="text-xs sm:text-sm text-ink/65 mt-2 max-w-xl">
                The renders below represent 3D design visualizations and conceptual studies. They are strictly labeled as design concepts and do not depict completed client construction records.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4" {...StaggerGroup({ intervalMs: 30 })}>
              {conceptDesigns.map((concept, idx) => (
                <figure key={concept.path} className="rounded-xl overflow-hidden bg-white/70 border border-ink/8 shadow-2xs" {...RevealItem({ kind: "card", delayMs: 400 + idx * 30 })}>
                  <div className="relative aspect-[4/3] bg-image-surface">
                    <Image
                      src={imagePath(concept.path, true)}
                      alt="3D Conceptual architectural rendering"
                      fill
                      sizes="(max-width: 639px) 45vw, (max-width: 1023px) 30vw, 22vw"
                      className="object-cover"
                      loading="lazy"
                    />
                  </div>
                  <figcaption className="p-2.5 text-[10px] uppercase font-mono tracking-wider text-ink/50 text-center">
                    Concept Visualization {String(idx + 1).padStart(2, "0")}
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
