# Phase 07.9 — Home and About Scroll Reveals

## Scope

Adds the reusable, one-time scroll reveal system only to `/` and `/about`. The cinematic canvas remains outside the reveal sections and its scroll/frame-loading behavior is unchanged. Other routes continue to use the existing site-wide observer and have not been opted into this system.

## Architecture

- `src/lib/motion/reveal-attributes.ts` exports the `SectionReveal`, `RevealItem`, `ImageReveal`, and `StaggerGroup` attribute helpers. They produce declarative data attributes; no rendering wrapper or extra dependency is added.
- `src/components/scroll-reveal.tsx` installs one page-scoped `IntersectionObserver`, with a 150px forward prefetch margin. Each section/content target is observed once and then unobserved. Animation completion changes its state to `complete`, removing the filled animation so hover/focus transforms work normally again.
- `src/styles/scroll-motion.css` defines the section surface, content, image-mask, and About accent effects. Motion timings/easing/distance are centralized in `src/styles/theme.css`.
- `src/app/globals.css` imports the shared styles. The observer is mounted only on the Home and About pages and scoped by their `main` class.

## Timing and fallback

Background surface reveal: 320ms. Image reveal: 420ms. Heading: 440ms after 420ms, then copy: 360ms after 650ms and controls: 420ms after 850ms. Default group interval: 80ms (individual groups can override it). The order gives the media its first beat before the copy begins; the effects use opacity, transform and clip-path, with short 14px directional offsets.

Without JavaScript, reveal CSS never activates and content remains in normal visible document flow. If `IntersectionObserver` is unavailable, the page switches to static visible content. `prefers-reduced-motion` disables the reveal and clears pending animation listeners; print styles likewise force visible content. Image loading errors do not gate or hide any text. Native Next Image lazy loading and existing intrinsic/aspect-ratio sizing remain in place; the Home and About hero images retain priority loading.

## Applied areas

Home: the existing cinematic hero is intentionally not observed; staged reveals cover About, Services, Projects, documented Before/After transformations, C.Q.E.T. principles, client logos, and the contact close. Interactive service/transformation content stays in its existing component and its selector behavior is unchanged.

About: the hero image, breadcrumb, title, accent, introduction and action reveal in sequence. Story, capability, process, principles, documented project cards and contact sections use the same shared system. Existing tabs, stage selectors, links and project navigation remain functional.

## Asset and content integrity

The system changes no imagery or company/project copy. Existing authenticated portfolio assets remain associated with their current content; the hero/canvas remain identified as conceptual visualization. No stock images or achievement claims are introduced.

## Validation record

- `npm run lint` — passed.
- `npm run typecheck` — passed.
- `npm run test:enquiries` — passed (20 tests).
- `npm run build` — passed; Next.js 16.3.8 compiled and generated routes.
- Browser — homepage and About DOM/content and desktop About hero visually inspected at the currently available browser size. An explicit tablet/mobile viewport override and reduced-motion preference could not be set with the connected browser controls in this session; responsive layout rules remain in the existing stylesheet and have not been represented as browser-verified here.

## Extending later

To adopt this motion system on another route, add the shared `ScrollReveal` with a new explicit route scope, mark intended section boundaries, and add reveal/stagger attributes only to selected visual/content targets. Do not observe an animated canvas or duplicate an existing route observer. Check responsive reading order, reduced-motion behavior, image fallback, and keyboard interactions on that route before enabling it.
