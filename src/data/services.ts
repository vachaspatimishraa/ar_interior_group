import { serviceBySlug } from "@/data/company-profile";
import { serviceImagery, serviceImageSource } from "@/data/service-imagery";

export type ServiceOverviewItem = {
  slug: string;
  title: string;
  description: string;
  detail: string;
  bullets: string[];
  image?: { src: string; alt: string; sourcePage: number; width: number; height: number };
  sourcePage: number;
  sourceSection: string;
};

const imageFor = (slug: string) => {
  const image = serviceImagery[slug];
  return image ? { src: serviceImageSource(image.path), alt: image.label, sourcePage: image.page, width: image.width, height: image.height } : undefined;
};

const overviewSlugs = ["micro-markets-kiosks", "civil-services", "furniture-working-desks", "alloy-wooden-partitions", "flooring-ceiling-solutions", "plumbing-sanitary", "railing-structures"] as const;

export const serviceOverview: ServiceOverviewItem[] = overviewSlugs.map((slug) => {
  const service = serviceBySlug(slug);
  if (!service || !service.sourceSection) throw new Error(`Missing authoritative service overview: ${slug}`);
  return { slug: service.slug, title: service.title, description: service.intro, detail: service.detail, bullets: service.points, image: imageFor(slug), sourcePage: service.sourcePage, sourceSection: service.sourceSection };
});
