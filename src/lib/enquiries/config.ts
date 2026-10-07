import { isValidEmail } from "./validation.ts";

export type EnquiryConfig = {
  resendApiKey: string;
  fromEmail: string;
  toEmail: string;
  siteOrigin: string;
  upstashUrl: string;
  upstashToken: string;
  trustedIpHeader: "x-real-ip" | "cf-connecting-ip";
};

export function getEnquiryConfig(env: NodeJS.ProcessEnv = process.env): EnquiryConfig | null {
  const resendApiKey = env.RESEND_API_KEY?.trim();
  const fromEmail = env.ENQUIRY_FROM_EMAIL?.trim();
  const toEmail = env.ENQUIRY_TO_EMAIL?.trim();
  const siteUrl = env.SITE_URL?.trim();
  const upstashUrl = env.UPSTASH_REDIS_REST_URL?.trim().replace(/\/$/, "");
  const upstashToken = env.UPSTASH_REDIS_REST_TOKEN?.trim();
  const trustedIpHeader = env.ENQUIRY_TRUSTED_IP_HEADER?.trim().toLowerCase();

  if (!resendApiKey || !fromEmail || !toEmail || !siteUrl || !upstashUrl || !upstashToken) return null;
  const senderAddress = fromEmail.replace(/^.*<|>$/g, "");
  if (!isValidEmail(toEmail) || /[\r\n]/.test(fromEmail) || !/^.+<[^<>]+>$|^[^<>]+$/.test(fromEmail) || !isValidEmail(senderAddress)) return null;
  if (trustedIpHeader !== "x-real-ip" && trustedIpHeader !== "cf-connecting-ip") return null;

  let parsedSite: URL;
  let parsedUpstash: URL;
  try {
    parsedSite = new URL(siteUrl);
    parsedUpstash = new URL(upstashUrl);
  } catch {
    return null;
  }
  if (parsedSite.origin !== siteUrl.replace(/\/$/, "") || !["https:", "http:"].includes(parsedSite.protocol)) return null;
  if (parsedSite.protocol !== "https:" && !["localhost", "127.0.0.1"].includes(parsedSite.hostname)) return null;
  if (parsedUpstash.protocol !== "https:") return null;

  return { resendApiKey, fromEmail, toEmail, siteOrigin: parsedSite.origin, upstashUrl, upstashToken, trustedIpHeader };
}
