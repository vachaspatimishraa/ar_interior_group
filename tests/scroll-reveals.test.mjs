import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { ImageReveal, RevealItem, SectionReveal, shouldUseStaticReveals, StaggerGroup } from "../src/lib/motion/reveal-attributes.ts";

test("section markers remain structural and do not carry full-section motion", () => {
  assert.deepEqual(SectionReveal(), { "data-scroll-section": "" });
});

test("photo reveal attributes control direction and preserve rounded or square masks", () => {
  assert.deepEqual(ImageReveal({ direction: "right" }), {
    "data-scroll-reveal": "image",
    "data-reveal-direction": "right",
    "data-reveal-shape": "rounded",
  });
  assert.equal(ImageReveal({ rounded: false })["data-reveal-shape"], "square");
});

test("reveal attributes carry custom timing and stagger intervals", () => {
  assert.deepEqual(RevealItem({ kind: "heading", direction: "up", delayMs: 480 }), {
    "data-scroll-reveal": "heading",
    "data-reveal-direction": "up",
    "data-reveal-delay": 480,
  });
  assert.deepEqual(StaggerGroup({ intervalMs: 120 }), {
    "data-scroll-stagger": "",
    "data-stagger-interval": 120,
  });
});

test("reduced motion and missing IntersectionObserver select visible static behavior", () => {
  assert.equal(shouldUseStaticReveals(true, true), true);
  assert.equal(shouldUseStaticReveals(false, false), true);
  assert.equal(shouldUseStaticReveals(false, true), false);
});

test("image fetching and visibility do not wait for observer animation or decoding", () => {
  const observer = readFileSync(resolve("src/components/scroll-reveal.tsx"), "utf8");
  const styles = readFileSync(resolve("src/styles/scroll-motion.css"), "utf8");
  assert.doesNotMatch(observer, /image\.decode\(|scrollWaiting/);
  assert.match(styles, /\[data-scroll-reveal="image"\][\s\S]*?opacity:\s*1;/);
  assert.doesNotMatch(styles, /\.homepage\[data-scroll-motion="active"\][^{]+\{\s*opacity:\s*0;/);
  assert.doesNotMatch(styles, /\.about-page\[data-scroll-motion="active"\][^{]+\{\s*opacity:\s*0;/);
  assert.match(styles, /img\[data-asset-failed\][\s\S]*?opacity:\s*0;/);
  assert.match(styles, /\[data-asset-fallback\]::after/);
  assert.match(styles, /prefers-reduced-motion:\s*reduce/);
  assert.match(styles, /@media print/);
});

test("preview image warm-up waits until its selector approaches the viewport", () => {
  const preloader = readFileSync(resolve("src/components/preview-image-preloader.tsx"), "utf8");
  assert.match(preloader, /new IntersectionObserver/);
  assert.match(preloader, /rootMargin: "320px 0px"/);
  assert.match(preloader, /observer\.observe\(section\)/);
  assert.match(preloader, /ready && uniqueImages\.map/);
  assert.doesNotMatch(preloader, /setTimeout\(/);
});

test("custom page reveal scopes do not run through the generic section observer", () => {
  const observer = readFileSync(resolve("src/components/reveal-observer.tsx"), "utf8");
  assert.match(observer, /main:not\(\.homepage, \.about-page, \.services-page, \.clients-page, \.projects-page, \.contact-page\)/);
});

test("Home and About preserve their editorial section order without slide locking", () => {
  const home = readFileSync(resolve("src/app/page.tsx"), "utf8");
  const about = readFileSync(resolve("src/app/about/page.tsx"), "utf8");
  const homeCopy = readFileSync(resolve("src/data/homepage.ts"), "utf8");
  const homeStyles = readFileSync(resolve("src/app/homepage.css"), "utf8");
  const aboutStyles = readFileSync(resolve("src/app/about/about.css"), "utf8");
  const revealStyles = readFileSync(resolve("src/styles/scroll-motion.css"), "utf8");
  const homeSequence = [
    "<CinematicPlaceholder",
    "<AboutSection",
    "<ServicesSection",
    "<ClientsSection",
    "<ProjectsSection",
    "<OfficesSection",
    "<ContactSection",
  ];
  let previousHomeIndex = -1;
  for (const marker of homeSequence) {
    const currentIndex = home.indexOf(marker);
    assert.ok(currentIndex > previousHomeIndex, `homepage order contains ${marker}`);
    previousHomeIndex = currentIndex;
  }
  for (const heading of ["One space. Many disciplines.", "Spaces with a story to tell.", "From site to finished space", "Success Mantra “C.Q.E.T”"]) {
    assert.ok(homeCopy.includes(heading), `homepage content includes ${heading}`);
  }
  const aboutSequence = ["about-hero-title", "about-story-title", "about-capabilities-title", "about-process-title", "about-principles-title", "about-projects-title", "about-contact-title"];
  let previousAboutIndex = -1;
  for (const headingId of aboutSequence) {
    const currentIndex = about.indexOf(`id=\"${headingId}\"`);
    assert.ok(currentIndex > previousAboutIndex, `About order contains ${headingId}`);
    previousAboutIndex = currentIndex;
  }
  assert.doesNotMatch(`${homeStyles}\n${aboutStyles}`, /scroll-snap|height:\s*100vh|min-height:\s*100vh/);
  assert.doesNotMatch(revealStyles, /data-scroll-section[^\n]*::before|::before[^\n]*data-scroll-section/);
  assert.doesNotMatch(revealStyles, /data-scroll-section\]\[data-scroll-state/);
  assert.doesNotMatch(homeStyles, /min-height:\s*74svh/);
  assert.match(readFileSync(resolve("src/components/scroll-reveal.tsx"), "utf8"), /addEventListener\("scroll", scheduleScrollCheck/);
});

test("About sections reveal as coordinated image-to-copy-to-control stages", () => {
  const observer = readFileSync(resolve("src/components/scroll-reveal.tsx"), "utf8");
  const page = readFileSync(resolve("src/app/about/page.tsx"), "utf8");
  const interactions = readFileSync(resolve("src/components/about-interactions.tsx"), "utf8");
  const styles = readFileSync(resolve("src/app/about/about.css"), "utf8");
  assert.match(observer, /scope === "about-page"[\s\S]*?querySelectorAll<HTMLElement>\("\[data-scroll-section\]"\)/);
  assert.match(observer, /const revealSection = \(section: HTMLElement\)[\s\S]*?section\.contains\(target\)/);
  assert.match(observer, /revealObservationTarget\(entry\.target as HTMLElement\)/);
  assert.match(styles, /\.about-page\[data-scroll-motion="active"\] \[data-scroll-reveal\]:not\(\[data-scroll-state="visible"\]\)/);
  assert.match(styles, /\[data-scroll-reveal="image"\]\[data-scroll-state="visible"\][\s\S]*?animation-name: scroll-image-reveal/);
  for (const delay of [100, 250, 400, 500, 650, 800, 950]) {
    assert.ok(`${page}\n${interactions}`.includes(`delayMs: ${delay}`), `About reveal sequence includes ${delay}ms`);
  }
  assert.match(page, /loading="lazy"/);
  assert.match(interactions, /loading="lazy"/);
  assert.doesNotMatch(interactions, /loading="eager"|PreviewImagePreloader/);
  assert.match(styles, /prefers-reduced-motion:\s*reduce/);
});

test("one canonical footer uses verified profile data and is staged through the root layout", () => {
  const layout = readFileSync(resolve("src/app/layout.tsx"), "utf8");
  const footer = readFileSync(resolve("src/components/site-footer.tsx"), "utf8");
  const observer = readFileSync(resolve("src/components/reveal-observer.tsx"), "utf8");
  const styles = readFileSync(resolve("src/styles/site-footer.css"), "utf8");
  assert.equal((layout.match(/<SiteFooter\s*\/>/g) ?? []).length, 1);
  assert.match(footer, /companyAboutProfile, contact/);
  assert.match(footer, /href=\{contact\.phoneHref\}/);
  assert.match(footer, /mailto:\$\{contact\.email\}/);
  assert.match(footer, /\/contact/);
  assert.match(footer, /target="_blank"\s+rel="noreferrer"/);
  assert.match(footer, /Back to top/);
  assert.doesNotMatch(footer, /facilities@arinteriorgroup\.com|\+91 7678495036|Spaces that stay with you/);
  assert.match(observer, /footer\[data-site-footer\]/);
  assert.match(observer, /footerRevealState = "visible"/);
  assert.match(styles, /data-footer-reveal-state="hidden"/);
  assert.match(styles, /prefers-reduced-motion:\s*reduce/);
});
