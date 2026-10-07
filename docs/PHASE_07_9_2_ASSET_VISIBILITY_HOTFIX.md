# Phase 07.9.2 — Home/About Asset Visibility Hotfix

## Root cause

Phase 07.9.1 made reveal state a prerequisite for showing image targets and delayed that state until all descendant images had loaded and decoded. The same image wrapper was clipped/transparent while it waited. For lazy images this coupled two independent browser processes—IntersectionObserver and image fetching—so a missed/deferred load or observer transition could leave the photograph or logo hidden indefinitely. This was a CSS/observer coordination defect, not evidence of missing project assets.

## Changes

- `src/components/scroll-reveal.tsx`: removed image-load and `decode()` gating from reveal activation. Normal `<Image>` eager/lazy fetching is unchanged. Scroll reveals now animate independently of asset requests. Added scoped capture handling for failed Next Image requests: only the failed image is visually suppressed and its containing frame presents an accessible-text-derived fallback label. Already-failed images are detected when the observer initializes.
- `src/styles/scroll-motion.css`: image reveal targets are visible in their default state and excluded from generic opacity hiding. The clip/scale reveal is only applied while an actual reveal animation is running, with zero image animation delay. When animation state is absent, reduced, cleaned up or never initialized, original image visibility is deterministic. Added a contained failed-image fallback, while preserving crop and rounded corners. Existing reduced-motion, print, focus and section-only reveal rules remain.
- `src/components/homepage-portfolio-image.tsx`: a failed primary and fallback photo now produces a neutral, labeled frame instead of removing the image node and leaving a blank space.
- `src/lib/motion/reveal-attributes.ts`, `src/components/client-logo-wall.tsx`: removed the obsolete image-wait option/attribute.
- `tests/scroll-reveals.test.mjs`: updated reveal attribute checks and added regression assertions that reveal initialization does not decode/gate image loading, image targets fail open, and error/reduced-motion/print handling remains present.

No Home/About photography, logo, poster, frame, or cinematic Canvas assets were replaced. Other routes and the enquiry backend were not edited for this hotfix.

## Asset and browser verification

- Existing project tests verify referenced portfolio photographs, all 35 client logo files, concept imagery, and all 96 desktop plus 60 mobile cinematic frames exist locally.
- Local HTTP `HEAD` checks returned **200** for Home and About, the brand logo, desktop and mobile posters, representative frames from both frame sequences, a portfolio photograph, a client logo, and its Next.js optimized-image URL. Content types were HTML, WebP, and optimized JPEG as expected.
- Rendered local browser review: Home hero poster/canvas and frame progression remained visible; the Home About image, service photograph and About hero/story imagery loaded. Fast scroll, reverse scroll, and direct `#homepage-content` entry were sampled without images remaining clipped or blank.
- Browser developer-tools request/console logs were not exposed by the available UI automation, so an exhaustive in-browser failed-request count cannot be claimed. Repository tests cover all expected on-disk frame and portfolio/logo assets; network checks above are representative, not a 326-file HTTP sweep.
- The available browser surface did not allow device viewport emulation or toggling the operating-system reduced-motion preference. Mobile/reduced-motion device-level visual QA remains recommended. The markup/CSS fallback is fail-open without JavaScript, without IntersectionObserver, under reduced motion and in print.

## Validation

- `npm run lint` — passed.
- `npm run typecheck` — passed.
- `npm run build` — passed; 40 routes generated.
- `npm run test:enquiries` — 20 passed.
- `node --experimental-strip-types --test tests/scroll-reveals.test.mjs` — 5 passed.

## Remaining issues

- If both a selected Home image and its optional fallback asset fail, a neutral “Image unavailable” frame is shown; no unrelated stock image is substituted.
- CSS generated fallback labels are visual safety cues; the original image alt text is retained on ordinary Next Image nodes. Verify assistive-technology announcements during full accessibility QA.
- No deployment or commit was performed.
