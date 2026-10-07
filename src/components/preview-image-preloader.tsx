"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

export type PreviewImageSource = { src: string; width?: number; height?: number };

export function PreviewImagePreloader({
  images,
  sizes,
}: {
  images: readonly PreviewImageSource[];
  sizes: string;
}) {
  const sentinelRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const section = sentinelRef.current?.parentElement;
    if (!section || !("IntersectionObserver" in window)) return;

    const observer = new IntersectionObserver((entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;
      setReady(true);
      observer.disconnect();
    }, { rootMargin: "320px 0px" });
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  if (images.length === 0) return null;

  const uniqueImages = [...new Map(images.map((image) => [image.src, image])).values()];

  return (
    <div
      ref={sentinelRef}
      aria-hidden="true"
      style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clipPath: "inset(50%)", whiteSpace: "nowrap" }}
    >
      {ready && uniqueImages.map((image) => (
        <Image
          key={image.src}
          src={image.src}
          alt=""
          width={image.width ?? 1600}
          height={image.height ?? 900}
          sizes={sizes}
          loading="eager"
        />
      ))}
    </div>
  );
}
