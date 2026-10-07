import type { MetadataRoute } from "next";
import { projects, services } from "@/data/company-profile";
import { getSiteOrigin } from "@/lib/site-origin";

export const dynamic = "force-dynamic";

export default function sitemap(): MetadataRoute.Sitemap {
  const origin = getSiteOrigin();
  if (!origin) return [];

  const paths = [
    "/", "/about", "/services", "/projects", "/clients", "/contact",
    ...services.map((service) => `/services/${service.slug}`),
    ...projects.map((project) => `/projects/${project.slug}`),
  ];
  return paths.map((path) => ({ url: new URL(path, origin).toString() }));
}
