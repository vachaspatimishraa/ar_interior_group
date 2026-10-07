import Image from "next/image";
import type { PortfolioImage, Project } from "@/data/company-profile";

function imageSource(image: PortfolioImage) {
  return `/${image.path.replace(/^public\//, "").replace(/\.webp$/, "-thumb.webp")}`;
}

export function ProjectGallery({ project, excludePaths = [] }: { project: Project; excludePaths?: string[] }) {
  const visibleImages = project.images.filter((image) => !excludePaths.includes(image.path));
  if (visibleImages.length === 0) return null;
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-5">
      {visibleImages.map((image, index) => (
        <figure key={image.pdf_xref} className={`min-w-0 ${index === 0 && visibleImages.length % 2 === 1 ? "col-span-2" : ""}`}>
          <div className="relative aspect-[1.45] overflow-hidden bg-image-surface">
            <Image src={imageSource(image)} alt={`${project.title}${project.location ? `, ${project.location}` : ""} portfolio photograph`} width={image.width} height={image.height} sizes="(max-width: 639px) 92vw, 46vw" loading="lazy" className="h-full w-full object-cover" />
          </div>
          <figcaption className="mt-2 text-[10px] uppercase tracking-[0.13em] text-ink-muted">{project.title}{project.location ? ` · ${project.location}` : ""}</figcaption>
        </figure>
      ))}
    </div>
  );
}

export function BeforeAfter({ comparison }: { comparison: NonNullable<Project["comparison"]> }) {
  const items = [["Before", comparison.before], ["After", comparison.after]] as const;
  return (
    <section aria-labelledby="comparison-title" className="mt-16 border-t border-ink/15 pt-7">
      <p className="eyebrow text-gold-ink">Documented project comparison</p>
      <h2 id="comparison-title" className="mt-3 font-display text-3xl tracking-[-0.04em] text-ink">Before & after</h2>
      <div className="mt-7 grid gap-5 md:grid-cols-2">
        {items.map(([label, image]) => (
          <figure key={label}>
            <div className="relative aspect-[1.35] overflow-hidden bg-image-surface">
              <Image src={`/${image.path.replace(/^public\//, "")}`} alt={`${label} photograph of the documented interior transformation`} width={image.width} height={image.height} sizes="(max-width: 767px) 92vw, 46vw" loading="lazy" className="h-full w-full object-cover" />
            </div>
            <figcaption className="mt-2 text-[10px] uppercase tracking-[0.14em] text-ink-muted">{label}</figcaption>
          </figure>
        ))}
      </div>
      <p className="mt-4 max-w-2xl text-xs leading-6 text-ink-muted">{comparison.note}</p>
    </section>
  );
}
