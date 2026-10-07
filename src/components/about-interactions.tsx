"use client";

import Image from "next/image";
import Link from "next/link";
import type { aboutPage } from "@/data/about-page";
import { ImageReveal, RevealItem, StaggerGroup } from "@/lib/motion/reveal-attributes";
import { usePreviewSelection } from "@/lib/motion/use-preview-selection";

type AboutModel = typeof aboutPage;
type CapabilityGroup = AboutModel["capabilityGroups"][number];
type Principle = { title: string; description: string };

function FocusableImage({
  src,
  alt,
  sizes,
  className,
  loading = "lazy",
  revealDelay,
}: {
  src: string;
  alt: string;
  sizes: string;
  className?: string;
  loading?: "lazy" | "eager";
  revealDelay?: number;
}) {
  return <Image src={src} alt={alt} fill loading={loading} sizes={sizes} decoding="async" className={className} {...(revealDelay === undefined ? {} : ImageReveal({ delayMs: revealDelay }))} />;
}

export function AboutCapabilityShowcase({ groups }: { groups: readonly CapabilityGroup[] }) {
  const { selectedIndex, previewIndex, handlers } = usePreviewSelection();
  const active = groups[previewIndex];
  const detailId = "about-capability-detail";
  const sizes = "(max-width: 899px) 92vw, 53vw";

  return (
    <div className="about-capability-layout">
      <figure className="about-capability-visual" aria-labelledby="about-capability-caption">
        <div className="about-capability-frame">
          {groups.map((group, index) => <div className="about-capability-image-layer" data-active={previewIndex === index} key={group.title} aria-hidden={previewIndex !== index}><FocusableImage src={group.image.src} alt={group.image.alt} sizes={sizes} className="about-capability-image" revealDelay={index === 0 ? 100 : 250} /></div>)}
          <span className="about-capability-index" aria-hidden="true">{String(previewIndex + 1).padStart(2, "0")} / {String(groups.length).padStart(2, "0")}</span>
        </div>
        <figcaption id="about-capability-caption" {...RevealItem({ kind: "copy", delayMs: 250 })}>{active.image.caption}</figcaption>
      </figure>

      <div className="about-capability-copy">
        <div className="about-capability-tabs" role="group" aria-label="Commercial interior capabilities" {...StaggerGroup()}>
          {groups.map((group, index) => (
            <button
              key={group.title}
              className="about-capability-tab"
              id={`about-capability-tab-${index}`}
              type="button"
              aria-pressed={selectedIndex === index}
              data-previewed={previewIndex === index && selectedIndex !== index}
              {...RevealItem({ kind: "control", delayMs: 950 })}
              {...handlers(index)}
            >
              <span className="about-capability-number" aria-hidden="true">0{index + 1}</span>
              <span>{group.title}</span>
              <span className="about-capability-arrow" aria-hidden="true">↗</span>
            </button>
          ))}
        </div>
        <div className="about-capability-detail" id={detailId} aria-live="polite">
          <p className="about-interactive-copy" key={active.title} {...RevealItem({ kind: "copy", delayMs: 650 })}>{active.description}</p>
          <ul className="about-service-links" aria-label={`Related ${active.title} services`}>
            {active.services.map((service) => (
              <li key={service.slug}><Link href={`/services/${service.slug}`}>{service.title}<span aria-hidden="true">↗</span></Link></li>
            ))}
          </ul>
          <Link className="about-text-link" href="/services" {...RevealItem({ kind: "control", delayMs: 950 })}>View our services <span aria-hidden="true">↗</span></Link>
        </div>
      </div>
    </div>
  );
}

export function AboutTeamShowcase({ roles, image }: { roles: readonly string[]; image: AboutModel["processImage"] }) {
  const { selectedIndex, previewIndex, handlers } = usePreviewSelection();
  const role = roles[previewIndex];
  return <div className="about-team-layout">
    <figure className="about-team-visual">
      <div className="about-team-frame"><FocusableImage src={image.src} alt={image.alt} sizes="(max-width: 899px) 92vw, 52vw" className="about-team-image" revealDelay={100} />
        <div className="about-team-label" aria-live="polite"><span>Team role</span><strong key={role} className="about-interactive-copy" {...RevealItem({ kind: "copy", delayMs: 800 })}>{role}</strong></div>
      </div><figcaption {...RevealItem({ kind: "copy", delayMs: 250 })}>{image.caption}</figcaption>
    </figure>
    <div className="about-team-list" role="group" aria-label="Documented team roles" {...StaggerGroup({ intervalMs: 55 })}>
      {roles.map((item, index) => <button type="button" key={item} className="about-team-role" aria-pressed={selectedIndex === index} data-previewed={previewIndex === index && selectedIndex !== index} {...RevealItem({ kind: "card", delayMs: 800 })} {...handlers(index)}>
        <span className="about-capability-number">0{index + 1}</span><span>{item}</span><span aria-hidden="true">↗</span>
      </button>)}
    </div>
  </div>;
}

export function AboutPrinciples({
  items,
  note,
  images,
}: {
  items: readonly Principle[];
  note: string;
  images: readonly AboutModel["principles"]["images"][number][];
}) {
  const { selectedIndex, previewIndex, handlers } = usePreviewSelection();
  const active = items[previewIndex];
  const detailId = "about-principle-detail";

  return (
    <div className="about-principles-layout">
      <figure className="about-principles-visual">
        <div className="about-principles-frame">{images.map((visual, index) => <div className="about-principle-image-layer" data-active={previewIndex === index} aria-hidden={previewIndex !== index} key={visual.src}><FocusableImage src={visual.src} alt={visual.alt} sizes="(max-width: 899px) 92vw, 48vw" className="about-principles-image" loading="lazy" revealDelay={index === 0 ? 100 : 250} /></div>)}</div>
        <figcaption {...RevealItem({ kind: "copy", delayMs: 250 })}>{images[previewIndex].caption}</figcaption>
      </figure>
      <div className="about-principles-copy">
        <div className="about-principle-tabs" role="group" aria-label="AR Interior Group principles" {...StaggerGroup({ intervalMs: 55 })}>
          {items.map((item, index) => (
            <button
              key={item.title}
              className="about-principle-tab"
              id={`about-principle-tab-${index}`}
              type="button"
              aria-pressed={selectedIndex === index}
              data-previewed={previewIndex === index && selectedIndex !== index}
              {...RevealItem({ kind: "control", delayMs: 950 })}
              {...handlers(index)}
            >
              <span className="about-principle-number">0{index + 1}</span>
              <span className="about-principle-title">{item.title}</span>
              <span className="about-principle-marker" aria-hidden="true">{selectedIndex === index ? "−" : "+"}</span>
            </button>
          ))}
        </div>
        <div className="about-principle-detail" id={detailId} aria-live="polite" aria-atomic="true">
          <p key={active.title} className="about-interactive-copy" {...RevealItem({ kind: "copy", delayMs: 650 })}>{active.description}</p>
        </div>
        <p className="about-disclosure" {...RevealItem({ kind: "copy", delayMs: 800 })}>{note}</p>
      </div>
    </div>
  );
}
