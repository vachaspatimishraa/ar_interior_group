"use client";

import Image from "next/image";
import Link from "next/link";
import { PreviewImagePreloader } from "@/components/preview-image-preloader";
import { usePreviewSelection } from "@/lib/motion/use-preview-selection";

const stages = [
  { id: "01", title: "Planning & preparation", body: "Space planning and design-build are among AR Interior Group's stated service areas.", name: "Tata Electronics", path: "/projects/tata-electronics-tamil-nadu", image: "/projects/tata-electronics-tamil-nadu/p14-img323-thumb.webp", alt: "Tata Electronics Tamil Nadu project, documented before view" },
  { id: "02", title: "Interior execution", body: "Project management and execution are among AR Interior Group's stated service areas.", name: "JCB Jaipur", path: "/projects/jcb-jaipur", image: "/projects/jcb-jaipur/p36-img571-thumb.webp", alt: "JCB Jaipur project, documented before view" },
  { id: "03", title: "Finishing & delivery", body: "A completed workplace amenity illustrates the range of spaces in the portfolio.", name: "Microsoft · Brews & Bakes", path: "/projects/microsoft-bengaluru", image: "/projects/microsoft-bengaluru/p16-img353-thumb.webp", alt: "Microsoft Bengaluru Brews and Bakes workplace amenity counter" },
];

export function ProcessShowcase() {
  const { selectedIndex, previewIndex, handlers } = usePreviewSelection();
  const stage = stages[previewIndex];
  return (
    <div className="process-feature">
      <div className="process-heading"><div><p className="eyebrow text-gold-ink">Services · expressed through a project sequence</p><h2 className="section-title mt-5">From first lines to final details.</h2></div><Link className="link-arrow" href="/services">Explore all services <span aria-hidden="true">↗</span></Link></div>
      <div className="process-layout">
        <figure className="process-visual">
          <PreviewImagePreloader images={stages.map((item) => ({ src: item.image }))} sizes="(max-width: 1023px) 100vw, 57vw" />
          <div className="process-image-frame">{stages.map((item, index) => <Image key={item.id} src={item.image} alt={item.alt} fill sizes="(max-width: 1023px) 100vw, 57vw" loading={previewIndex === index ? "eager" : "lazy"} className="process-image process-image-layer" data-active={previewIndex === index} />)}</div>
          <figcaption><span>{stage.name}</span></figcaption>
        </figure>
        <div className="process-copy">
            <div className="process-line" aria-hidden="true"><span style={{ transform: `scaleY(${(selectedIndex + 1) / stages.length})` }} /></div>
          <div className="process-stages" role="group" aria-label="Editorial stages in a commercial interior project">
            {stages.map((item, index) => <button type="button" key={item.id} aria-pressed={selectedIndex === index} data-previewed={previewIndex === index && selectedIndex !== index} className={`process-stage${selectedIndex === index ? " is-active" : ""}`} {...handlers(index)}>
              <span className="process-stage-number">{item.id}</span><span className="process-stage-title">{item.title}</span>
            </button>)}
          </div>
          <div className="process-stage-detail" aria-live="polite" aria-atomic="true"><p key={stage.id}>{stage.body}</p><Link href={stage.path}>See project <span aria-hidden="true">↗</span></Link></div>
          <p className="process-disclosure">An editorial description of service areas—not a claim of a formal method or a single project timeline. Photographs may show different views.</p>
        </div>
      </div>
    </div>
  );
}
