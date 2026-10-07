"use client";

import Image from "next/image";
import { useState } from "react";
import type { HomepageImage } from "@/data/homepage-projects";

export function HomepagePortfolioImage({
  image,
  sizes,
  className,
  loading = "lazy",
  onLoad,
}: {
  image: HomepageImage;
  sizes: string;
  className?: string;
  loading?: "eager" | "lazy";
  onLoad?: () => void;
}) {
  const [usingFallback, setUsingFallback] = useState(false);
  const [unavailable, setUnavailable] = useState(false);

  if (unavailable) {
    return (
      <div className={`home-image-fallback ${className ?? ""}`} role="img" aria-label={`${image.alt} — image unavailable`}>
        <span>Image unavailable</span>
      </div>
    );
  }

  return (
    <Image
      src={usingFallback && image.fallbackSrc ? image.fallbackSrc : image.src}
      alt={image.alt}
      fill
      sizes={sizes}
      className={className}
      loading={loading}
      decoding="async"
      onLoad={onLoad}
      onError={() => {
        if (!usingFallback && image.fallbackSrc) setUsingFallback(true);
        else setUnavailable(true);
      }}
    />
  );
}
