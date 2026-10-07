export function getSiteOrigin(siteUrl: string | undefined = process.env.SITE_URL): string | null {
  if (!siteUrl) return null;
  try {
    const parsed = new URL(siteUrl);
    const normalized = siteUrl.endsWith("/") ? siteUrl.slice(0, -1) : siteUrl;
    if (parsed.origin !== normalized || parsed.username || parsed.password || parsed.search || parsed.hash) return null;
    if (parsed.protocol !== "https:" && !(parsed.protocol === "http:" && ["localhost", "127.0.0.1"].includes(parsed.hostname))) return null;
    return parsed.origin;
  } catch {
    return null;
  }
}
