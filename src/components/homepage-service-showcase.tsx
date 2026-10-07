"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { HomepagePortfolioImage } from "@/components/homepage-portfolio-image";
import { PreviewImagePreloader } from "@/components/preview-image-preloader";
import { homepage } from "@/data/homepage";
import type { homepageServices } from "@/data/homepage-projects";
import { ImageReveal, RevealItem, StaggerGroup } from "@/lib/motion/reveal-attributes";
import { usePreviewSelection } from "@/lib/motion/use-preview-selection";

type ServiceItem = (typeof homepageServices)[number];

export function HomepageServiceShowcase({ items }: { items: ServiceItem[] }) {
  const { selectedIndex, previewIndex, handlers } = usePreviewSelection();
  const [loadedImages, setLoadedImages] = useState<Set<string>>(() => new Set());
  const [settledImage, setSettledImage] = useState<string>();
  const previewed = items[previewIndex];
  const activeSlug = useRef(previewed?.slug);
  useEffect(() => {
    activeSlug.current = previewed?.slug;
  }, [previewed?.slug]);
  const imageItems = items.filter((service): service is ServiceItem & { image: NonNullable<ServiceItem["image"]> } => Boolean(service.image));
  const selectedImageLoaded = previewed.image ? loadedImages.has(previewed.image.src) : false;
  const visibleImageSrc = selectedImageLoaded ? previewed.image?.src : settledImage;
  const visibleImage = imageItems.find((service) => service.image.src === visibleImageSrc);

  const markImageLoaded = (service: ServiceItem) => {
    const image = service.image;
    if (!image) return;
    setLoadedImages((current) => new Set(current).add(image.src));
    if (activeSlug.current === service.slug) setSettledImage(image.src);
  };

  return (
    <div className="home-services-layout">
      <PreviewImagePreloader images={imageItems.map(({ image }) => image)} sizes="(max-width: 767px) 92vw, (max-width: 1199px) 48vw, 52vw" />
      <div className="home-services-list" role="group" aria-label="Select a service area" {...StaggerGroup()}>
        {items.map((service, index) => (
          <button
            className="home-service-choice"
            key={service.slug}
            type="button"
            aria-pressed={selectedIndex === index}
            data-previewed={previewIndex === index && selectedIndex !== index}
            {...RevealItem({ kind: "control" })}
            {...handlers(index)}
          >
            <span className="home-service-number">{String(index + 1).padStart(2, "0")}</span>
            <span>{service.title}</span>
            <span className="home-service-choice-arrow" aria-hidden="true">↗</span>
          </button>
        ))}
      </div>

      <div className="home-service-stage">
        <div className="home-service-visual" {...ImageReveal({ direction: "right" })}>
          <div className="home-service-media">
            <figure className="home-service-photo" data-visible={Boolean(previewed.image)} aria-hidden={!previewed.image}>
              {imageItems.map((service) => (
                <div
                  className="home-service-image-layer"
                  data-active={visibleImage?.slug === service.slug || (!visibleImage && previewed.slug === service.slug)}
                  key={service.slug}
                  aria-hidden={visibleImage?.slug !== service.slug}
                >
                  <HomepagePortfolioImage
                    image={service.image}
                    sizes="(max-width: 767px) 92vw, (max-width: 1199px) 48vw, 52vw"
                    className="home-service-stage-image"
                    loading={previewed.slug === service.slug ? "eager" : "lazy"}
                    onLoad={() => markImageLoaded(service)}
                  />
                </div>
              ))}
              {visibleImage && <figcaption>{visibleImage.image.caption}</figcaption>}
            </figure>
            {!previewed.image && (
              <div className="home-service-typographic" key={previewed.slug} data-service={previewed.slug} role="img" aria-label={`${previewed.title}: ${previewed.description}`}>
                <span className="home-service-drawing" aria-hidden="true" />
                <span className="home-service-typographic-label">AR Interior Group</span>
                <span className="home-service-typographic-title">{previewed.title}</span>
              </div>
            )}
          </div>
        </div>
        <div className="home-service-detail" aria-live="polite" aria-atomic="true">
          <p key={previewed.slug}>{previewed.description}</p>
          <Link href={`/services/${previewed.slug}`} className="link-arrow">Explore this service <span aria-hidden="true">↗</span></Link>
        </div>
      </div>
      <Link href={homepage.services.action.href} className="link-arrow home-services-all" {...RevealItem({ kind: "control" })}>{homepage.services.action.label} <span aria-hidden="true">→</span></Link>
    </div>
  );
}
