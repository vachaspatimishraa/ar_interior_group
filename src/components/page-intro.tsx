import Link from "next/link";
import Image from "next/image";
import type { ReactNode } from "react";
import { ImageReveal, RevealItem, SectionReveal } from "@/lib/motion/reveal-attributes";

type PageIntroProps = {
  eyebrow: string;
  title: ReactNode;
  description: string;
  current: string;
  parent?: { href: string; label: string };
  image?: { src: string; alt: string; caption: string; secondary?: { src: string; alt: string } };
  staged?: boolean;
};

export function PageIntro({ eyebrow, title, description, current, parent, image, staged = false }: PageIntroProps) {
  return (
    <section className={["bg-ivory", image?.secondary ? "page-intro-composed" : "pt-36 sm:pt-44"].join(" ")} {...(staged ? SectionReveal() : {})}>
      <div className={["mx-auto max-w-[1440px] px-6 sm:px-8 lg:px-12", image?.secondary ? "page-intro-composed-shell" : "pb-20 lg:pb-28"].join(" ")}>
        <div className={`grid gap-10 lg:items-end ${image ? "lg:grid-cols-[1fr_0.76fr]" : "lg:grid-cols-[1.15fr_0.85fr]"}`}>
          <div>
            <p className="eyebrow text-gold-ink" {...(staged ? RevealItem({ kind: "eyebrow", delayMs: 400 }) : {})}>{eyebrow}</p>
            <h1 className={`mt-6 max-w-4xl font-display leading-[0.92] tracking-[-0.055em] text-ink ${image ? "text-6xl sm:text-7xl lg:text-[clamp(3.5rem,6.6vw,7.25rem)]" : "text-6xl sm:text-8xl lg:text-[9.5rem]"}`} {...(staged ? RevealItem({ kind: "heading", delayMs: 500 }) : {})}>
              {title}
            </h1>
          </div>
          {image && <figure className={["page-intro-image", image.secondary ? "page-intro-image-composed" : ""].filter(Boolean).join(" ")} {...(staged ? ImageReveal({ direction: "right", delayMs: 100 }) : {})}><div className={["relative aspect-[1.36] overflow-hidden bg-image-surface", image.secondary ? "rounded-image" : ""].filter(Boolean).join(" ")}><Image src={image.src} alt={image.alt} fill preload sizes="(max-width: 1023px) 92vw, 42vw" className="object-cover" /></div>{image.secondary && <div className="page-intro-secondary-image" {...(staged ? RevealItem({ kind: "image", direction: "up", delayMs: 220 }) : {})}><Image src={image.secondary.src} alt={image.secondary.alt} fill loading="lazy" sizes="(max-width: 639px) 34vw, (max-width: 1023px) 24vw, 15vw" className="object-cover" /></div>}<figcaption className={["flex justify-between gap-3 text-[10px] uppercase tracking-[0.13em] text-ink-muted", image.secondary ? "mt-5" : "mt-3"].join(" ")}><span>{image.caption}</span><span aria-hidden="true">AR / IG</span></figcaption></figure>}
          <div className="max-w-sm lg:justify-self-end">
            <p className="text-base leading-7 text-ink/65" {...(staged ? RevealItem({ kind: "copy", delayMs: 650 }) : {})}>{description}</p>
            <nav className="mt-8" aria-label="Breadcrumb">
              <ol className="flex flex-wrap items-center gap-3 text-[10px] uppercase tracking-[0.16em] text-ink-muted" {...(staged ? RevealItem({ kind: "control", delayMs: 950 }) : {})}>
                <li><Link className="transition-colors hover:text-ink" href="/">Home</Link></li>
                {parent && <><li aria-hidden="true" className="text-gold-ink">/</li><li><Link className="transition-colors hover:text-ink" href={parent.href}>{parent.label}</Link></li></>}
                <li aria-hidden="true" className="text-gold-ink">/</li>
                <li aria-current="page">{current}</li>
              </ol>
            </nav>
          </div>
        </div>
      </div>
    </section>
  );
}
