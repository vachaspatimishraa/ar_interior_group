# Phase 07.9.1 — Cinematic Reveals on Home and About

## Why the previous motion read as subtle

- The photo keyframe clipped only a 7% strip, moved 14px and scaled by about 0.8%, which is difficult to notice during ordinary scrolling.
- The section overlay used the same ivory as its surroundings and sat behind each section's painted background, so it produced little or no visible surface change.
- IntersectionObserver used a 1% threshold with a positive 150px bottom margin, beginning well before sections felt present.
- Text and media targets could animate while their images were still loading. Nested About hero title effects also ran in addition to the shared heading animation.
- The old page-specific `data-reveal-state` overrides were inert on Home/About because the shared site observer deliberately excludes those routes.

## What changed

- Replaced the invisible section layer with an approximately 900ms contrasting neutral surface mask. Each section has a directional wipe; Home alternates left/right/vertical and About uses a different sequence. Actual backgrounds and the ivory-first theme remain unchanged after the brief reveal.
- Enlarged the photo mask to a full directional wipe, added a 6% starting scale and a 24px lateral offset, and kept per-image corner radii. Photo targets wait for their own descendant images to load and decode (a failed image counts as settled); the logo wall opts out because it contains many independently lazy-loaded logos.
- Added an upward clipped heading entrance (48px), separate eyebrow timing, restrained paragraph motion, and scale/translate entrances for project metadata cards. About's two-line hero title is staggered by line without altering its single H1 semantics.
- Removed the competing old About hero title animation and stale Home/About overrides from the prior observer. The generic site observer remains unchanged for other routes.
- Paused the Home client-logo marquee until its reveal finishes; reduced-motion mode presents static, accessible logos.
- Adjusted observer activation to an 8% threshold with an 8% negative bottom margin. Targets restored above the viewport are marked complete, targets already occupying the viewport are revealed immediately (including hash navigation), and each target remains one-shot through reverse scrolling.
- Added a completion timeout as a safety net for animation events. A missing image, route cleanup, reduced motion, and observer fallback cannot leave a mask in its waiting state.

## Motion schedule

| Element | Delay | Duration | Motion |
| --- | ---: | ---: | --- |
| Section surface | 0ms | 900ms | Directional clipped neutral cover |
| Main photograph | 180ms | 950ms | Full image mask, 24px shift, scale 1.06 to 1 |
| Eyebrow | 350ms | 520ms | 26px lift and fade |
| Heading | 480ms | 640ms | 48px lift and vertical clipping |
| Description | 700ms | 480ms | 26px lift and fade |
| Project metadata/card | 850ms | 620ms | Lift, subtle scale and fade |
| Controls/CTA | 1050ms | 460ms | 26px lift and fade |

Stagger groups default to 120ms; the few short groups use 100–110ms. Stages overlap, so a typical final CTA arrives in about 1.5–1.9 seconds rather than waiting for every prior animation to finish.

## Integrated sections

Home: About preview, Services, Featured Projects, Before/After transformations, C.Q.E.T. principles, clients, and the contact CTA. Service, project, transformation and principle controls preserve their existing behavior. The canvas hero is not observed or modified.

About: hero, story, capabilities, process, principles, selected documented projects, and closing contact CTA. The shared observer handles all motion; the title no longer has a second independent keyframe system.

## Accessibility, loading and performance

- Reveal CSS is scoped to `.homepage` and `.about-page` only and is enabled only after the client observer attaches. Without JavaScript, with reduced motion, or without IntersectionObserver, all content is visible in normal flow.
- Focused controls and focused links bypass the hidden pre-reveal state. Existing Next Image intrinsic/aspect sizing, eager hero assets, and native lazy loading remain in place. No artificial request delay or animation library was introduced.
- Images wait only after entering the observer region. Failed image decodes settle into the existing neutral frame. Targets above a browser-restored scroll position are completed immediately.
- Animation uses transform, opacity and bounded clip-path keyframes; no continuous animation frame loop or layout polling was added. Marquee motion is paused until its reveal and disabled for reduced-motion users.

## Validation

Completed checks:

- `npm run lint` — passed.
- `npm run typecheck` — passed.
- `npm run build` — passed on Next.js 16.3.8; 40 routes generated.
- `npm run test:enquiries` — 20 passed.
- `node --experimental-strip-types --test tests/scroll-reveals.test.mjs` — 4 passed.
- Rendered browser review on the local development server at 1243 × 530 CSS pixels: Home hero and canvas progression remained intact; About hero and story/capabilities reveals appeared while scrolling; reverse scrolling did not blank the content; homepage skip-anchor and first content sections were inspected. Browser tooling did not expose viewport emulation or a reduced-motion preference toggle, so a narrow-device visual pass and OS-level reduced-motion browser pass remain outstanding. Responsive behavior and reduced-motion fallback are covered by responsive CSS and focused logic tests, not claimed as device-level visual verification.

The existing test commands emit Node's `MODULE_TYPELESS_PACKAGE_JSON` warning for TypeScript modules imported by Node's strip-types runner; tests pass and the package module mode was left unchanged to avoid an unrelated project-wide change.
