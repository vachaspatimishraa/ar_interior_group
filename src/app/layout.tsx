import type { Metadata } from "next";
import type { ReactNode } from "react";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { EnquiryAnchorFocus } from "@/components/enquiry-anchor-focus";
import { RevealObserver } from "@/components/reveal-observer";
import { getSiteOrigin } from "@/lib/site-origin";
import localFont from "next/font/local";
import "./globals.css";
import "../styles/site-footer.css";

const poppins = localFont({
  src: [
    { path: "../../public/fonts/poppins-400-latin.woff2", weight: "400", style: "normal" },
    { path: "../../public/fonts/poppins-500-latin.woff2", weight: "500", style: "normal" },
    { path: "../../public/fonts/poppins-600-latin.woff2", weight: "600", style: "normal" },
    { path: "../../public/fonts/poppins-700-latin.woff2", weight: "700", style: "normal" },
  ],
  display: "swap",
  variable: "--font-poppins",
});

const siteOrigin = getSiteOrigin();
const socialPreview = siteOrigin ? [{
  url: new URL("/cinematic/poster-desktop.webp", siteOrigin).toString(),
  width: 1920,
  height: 1080,
  alt: "Conceptual architectural visualization of a commercial interior",
}] : undefined;

export const metadata: Metadata = {
  ...(siteOrigin ? { metadataBase: new URL(siteOrigin), alternates: { canonical: siteOrigin } } : {}),
  icons: { icon: "/brand/ar-interior-group-original.webp" },
  title: {
    default: "AR Interior Group — Architecture, interiors, atmosphere",
    template: "%s — AR Interior Group",
  },
  description: "AR Interior Group shapes considered architectural interiors and atmospheres.",
  openGraph: {
    title: "AR Interior Group — Architecture, interiors, atmosphere",
    description: "AR Interior Group shapes considered architectural interiors and atmospheres.",
    type: "website",
    siteName: "AR Interior Group",
    ...(siteOrigin ? { url: siteOrigin } : {}),
    ...(socialPreview ? { images: socialPreview } : {}),
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${poppins.variable} h-full antialiased`}
    >
      <body className="min-h-screen bg-ivory font-sans text-ink antialiased">
        <a href="#main-content" className="skip-to-main">Skip to main content</a>
        <EnquiryAnchorFocus />
        <RevealObserver />
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
