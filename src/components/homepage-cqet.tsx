"use client";

import { HomepagePortfolioImage } from "@/components/homepage-portfolio-image";
import { homepage, homepagePrinciples } from "@/data/homepage";
import type { HomepageImage } from "@/data/homepage-projects";
import { ImageReveal, RevealItem, StaggerGroup } from "@/lib/motion/reveal-attributes";
import { usePreviewSelection } from "@/lib/motion/use-preview-selection";

export function HomepageCqet({ image }: { image: HomepageImage }) {
  const { selectedIndex, previewIndex, handlers } = usePreviewSelection();
  return (
    <div className="cqet-feature">
      <figure className="cqet-visual" {...ImageReveal()}><div><HomepagePortfolioImage image={image} sizes="(max-width: 1023px) 92vw, 50vw" /></div><figcaption>{image.caption}</figcaption></figure>
      <div className="cqet-copy">{homepage.principles.eyebrow && <p className="eyebrow text-gold-ink" {...RevealItem({ kind: "eyebrow" })}>{homepage.principles.eyebrow}</p>}<h2 className="home-title" id="home-principles-title" {...RevealItem({ kind: "heading" })}>{homepage.principles.title}</h2>
        <div className="cqet-list" role="group" aria-label="Company principles" {...StaggerGroup()}>
          {homepagePrinciples.map((item, index) => <button key={item.title} type="button" aria-pressed={selectedIndex === index} data-previewed={previewIndex === index && selectedIndex !== index} aria-controls="homepage-principle-description" className={`cqet-item${selectedIndex === index ? " is-active" : ""}`} {...handlers(index)} {...RevealItem({ kind: "control" })}><span className="eyebrow">0{index + 1}</span><span className="cqet-item-title">{item.title}</span><span className="cqet-item-mark" aria-hidden="true">{selectedIndex === index ? "−" : "+"}</span></button>)}
        </div>
        <p id="homepage-principle-description" key={previewIndex} className="cqet-description" aria-live="polite" {...RevealItem({ kind: "copy" })}>{homepagePrinciples[previewIndex].description}</p>
      </div>
    </div>
  );
}
