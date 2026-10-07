# Phase 07.9.3 — Continuous Home and About Scrolling

## Findings

The intended Home sequence in `docs/PHASE_07_6_HOMEPAGE_POLISH.md` was already present: cinematic introduction, company introduction, Services (“One space. Many disciplines.”), selected Projects (“Spaces with a story to tell.”), documented transformations (“From site to finished space”), CQET principles, client logos, and contact. The About page also retained its introduction/hero, company story, capabilities, process, principles, selected work, and contact invitation as documented in `docs/PHASE_07_8_ABOUT_PAGE.md`. No substantive section was missing from the current route source, so none was duplicated or reconstructed from uncertain facts.

The slide-like feel came from the reveal system animating a full-section pseudo-element over each section, long per-kind entrance delays combined with stagger groups, and large Home/About section padding. Individual content also started in hidden CSS states until observer initialization. Finally, relying on IntersectionObserver alone could leave an item waiting if a rapid scroll skipped its intersection callback.

## Changes made

- Removed full-section cover wipes, section-level observer state, and the direction metadata that only served those covers. Section backgrounds are now simply part of normal document flow.
- Made reveal targets visible by default. Motion is applied only when an individual target enters; observer setup errors fall back to static visible content. There is no opacity-zero pre-reveal state for Home/About content.
- Added a passive, animation-frame-throttled scroll/resize check alongside IntersectionObserver. Elements passed entirely during a fast scroll are marked complete; intersecting elements reveal once. Reverse scrolling does not restart animations.
- Reduced stagger defaults to 90ms and the motion delays to at most 180ms; reveal durations remain within the requested restrained range. Images continue normal Next.js loading independently from the reveal effect.
- Reduced Home section spacing to a content-led 3.5–5.5rem range on desktop and 3.1–4.3rem on small screens. Reduced About section spacing similarly and removed viewport-based minimum heights from the About hero, letting its content and image define its height.
- Preserved the existing intentional 350vh sticky Canvas sequence and its skip link. No other Home/About section uses snap, lock, sticky, or viewport-height behavior.
- Added the permanent “Continuous Page Layout and Scroll Behavior” requirements to `AGENTS.md` for all current and future pages.
- Added regression tests for exact Home/About section order/content, the absence of slide-locking styles and section overlays, fast-scroll fallback, reveal fail-open, reduced motion, and image loading independence.

## Files changed

- `src/components/scroll-reveal.tsx`
- `src/lib/motion/reveal-attributes.ts`
- `src/styles/scroll-motion.css`
- `src/styles/theme.css`
- `src/app/homepage.css`
- `src/app/about/about.css`
- `AGENTS.md`
- `tests/scroll-reveals.test.mjs`
- `docs/PHASE_07_9_3_CONTINUOUS_SCROLL_FIX.md`

Home/About page markup, verified project/service mappings, authentic images, client logos, interactive selections, the enquiry backend, and the Canvas engine were not rewritten.

## Validation

- `npm run lint` — passed with no findings.
- `npm run typecheck` — passed.
- `npm run build` — passed; 40 routes generated.
- `npm run test:enquiries` — 20 passed.
- `node --experimental-strip-types --test tests/scroll-reveals.test.mjs` — 6 passed, including section order, no slide locking, reveal fail-open, and image-loading independence.
- Local browser review at the available 1243 × 530 viewport: opened Home and About, used the homepage content anchor, scrolled forward quickly and in smaller increments, and scrolled back upward. Home About, Services and Projects images/headings remained visible; About capability and selected-project content/images remained visible. The Home cinematic sequence still advances and yields to ordinary document scrolling after its existing hero region. Visual review showed content-led sections with reduced whitespace and no snap/lock behavior.
- Existing tests verify the local manifests and files for portfolio/service imagery, all client logos, all desktop/mobile cinematic frames and posters. Previous phase HTTP checks for representative image and page URLs passed; no external asset substitution was introduced.
- This browser connection does not expose viewport emulation, browser console/network panels, or an OS reduced-motion toggle. Therefore 390px, 768px, and 1440px visual checks, a full in-browser failed-request inventory, and a live reduced-motion pass are not claimed. Responsive CSS, static observer fallback, reduced-motion CSS and print visibility remain in place and are covered by source-level regression checks.

## Limitations

Mobile viewport emulation and OS reduced-motion toggling were unavailable in the connected browser tooling. Node's strip-types test runner emits the existing `MODULE_TYPELESS_PACKAGE_JSON` warning for imported TypeScript modules; all tests pass. No commit, push, or deployment was performed.
