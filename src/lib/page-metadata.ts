import type { Metadata } from "next";
import { getSiteOrigin } from "./site-origin.ts";

export function createPageMetadata(title: string, description: string, path: string, siteOrigin = getSiteOrigin()): Metadata {
  const canonical = siteOrigin ? new URL(path, siteOrigin).toString() : undefined;
  const socialPreview = siteOrigin ? [{
    url: new URL("/cinematic/poster-desktop.webp", siteOrigin).toString(),
    width: 1920,
    height: 1080,
    alt: "Conceptual architectural visualization of a commercial interior",
  }] : undefined;
  return {
    title,
    description,
    ...(canonical ? { alternates: { canonical } } : {}),
    openGraph: {
      title: `${title} — AR Interior Group`,
      description,
      type: "website",
      siteName: "AR Interior Group",
      ...(canonical ? { url: canonical } : {}),
      ...(socialPreview ? { images: socialPreview } : {}),
    },
  };
}
