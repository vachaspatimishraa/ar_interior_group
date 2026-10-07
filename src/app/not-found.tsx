import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page not found",
  description: "The page you are looking for could not be found.",
};

export default function NotFound() {
  return (
    <main id="main-content" className="bg-ivory px-6 pb-24 pt-40 text-ink sm:px-8 sm:pb-32 sm:pt-48 lg:px-12">
      <div className="mx-auto w-full max-w-[1440px]">
        <p className="eyebrow text-gold-ink">AR Interior Group · 404</p>
        <h1 className="mt-5 max-w-4xl font-display text-5xl leading-[0.98] tracking-[-0.065em] sm:text-7xl lg:text-8xl">We can’t find<br /><em className="not-italic text-gold-ink">that page.</em></h1>
        <p className="mt-6 max-w-lg text-sm leading-7 text-ink/65">The address may have changed or the page may no longer be available.</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/" className="button button-dark">Return home <span aria-hidden="true">↗</span></Link>
          <Link href="/projects" className="button button-outline">View projects <span aria-hidden="true">↗</span></Link>
        </div>
      </div>
    </main>
  );
}
