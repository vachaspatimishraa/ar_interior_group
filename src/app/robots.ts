import type { MetadataRoute } from "next";
import { getSiteOrigin } from "@/lib/site-origin";

export const dynamic = "force-dynamic";

export default function robots(): MetadataRoute.Robots {
  const origin = getSiteOrigin();
  return {
    rules: { userAgent: "*", allow: "/", disallow: "/api/" },
    ...(origin ? { sitemap: `${origin}/sitemap.xml` } : {}),
  };
}
