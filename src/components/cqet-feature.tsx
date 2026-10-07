"use client";

import Image from "next/image";
import { usePreviewSelection } from "@/lib/motion/use-preview-selection";

const principles = [
  { title: "Consistency", description: "Consistency is one of AR Interior Group's working principles." },
  { title: "Quality", description: "Quality is a stated principle, not a measured performance claim." },
  { title: "Economical Solutions", description: "Economical solutions are a guiding principle." },
  { title: "Time Efficiency", description: "Time efficiency is a working principle, not a delivery guarantee." },
];

export function CqetFeature() {
  const { selectedIndex, previewIndex, handlers } = usePreviewSelection();
  return (
    <div className="cqet-feature">
      <figure className="cqet-visual"><div><Image src="/projects/technip-energies-noida/p26-img478.webp" alt="Technip Energies interior in Noida" fill sizes="(max-width: 1023px) 100vw, 50vw" /></div><figcaption>Technip Energies · Noida</figcaption></figure>
      <div className="cqet-copy"><p className="eyebrow text-gold-ink">Why AR Interior Group · C.Q.E.T.</p><h2 className="section-title mt-5">Principles behind the practice.</h2><p className="mt-5 max-w-lg text-sm leading-7 text-ink-muted">Four principles stated by the company. They are values, not externally verified performance guarantees.</p>
        <div className="cqet-list" role="group" aria-label="Company principles">
          {principles.map((item, index) => <button key={item.title} type="button" aria-pressed={selectedIndex === index} data-previewed={previewIndex === index && selectedIndex !== index} className={`cqet-item${selectedIndex === index ? " is-active" : ""}`} {...handlers(index)}><span className="eyebrow">0{index + 1}</span><span className="cqet-item-title">{item.title}</span><span className="cqet-item-mark" aria-hidden="true">{selectedIndex === index ? "−" : "+"}</span></button>)}
        </div>
        <p key={previewIndex} className="cqet-description" aria-live="polite">{principles[previewIndex].description}</p>
      </div>
    </div>
  );
}
