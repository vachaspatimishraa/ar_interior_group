# Phase 07.6 — Homepage polish

## Scope and source integrity

The homepage alone was redesigned. The existing App Router pages, enquiry backend, Canvas frame-sequence architecture, frame cache, project assets, and client-logo manifest were preserved. The company profile PDF and existing source-mapped project manifest supplied the facts and photographs. The cinematic opening remains explicitly labelled a concept, not a completed client project. The earlier screen recording was not available in this task context; the existing cinematic hero served as the motion benchmark.

## Findings and changes

- The previous homepage repeated introductory and service/process messages, used similar layouts in sequence, and left an oversized gap around the transformation showcase. It now has one deliberate sequence: cinematic introduction, About, services, selected projects, transformations, CQET, clients, and contact.
- Tall mobile sections could remain hidden because the older reveal threshold was difficult to reach. Homepage reveals now use a lightweight IntersectionObserver with visible-by-default content, so failed or disabled JavaScript cannot hide essential content.
- Section shells, gutters, heading scale, image proportions, spacing, timing, and responsive breakpoints are unified in `src/app/homepage.css`, using the existing theme tokens. A 768px service-image overflow found in browser review was corrected by stacking the layout at tablet widths.
- Homepage labels, descriptions, CTA destinations, selected service and project slugs, CQET copy, and cinematic stage labels now live in `src/data/homepage.ts`. `src/data/homepage-projects.ts` resolves genuine image and service records from the authoritative company data and rejects missing references.
- The original Canvas animation, forward/reverse scrolling, and bounded frame loading were retained. The mobile/desktop poster now remains underneath the Canvas until its first decoded frame is ready. Text contrast and alignment were refined; the skip action still reaches the following section.
- About uses the verified MV Seals photograph with an asymmetric editorial composition. Services provide selectable mouse, touch, focus, and keyboard-accessible rows. Where no image is suitably associated with a service, the display is intentionally typographic instead of using unrelated photography.
- The selected-project gallery uses verified Microsoft, LTIMindtree, and HighRadius imagery with project links. The previously rejected Airtel worker photograph is absent. The transformation selector uses existing same-project Before/After pairs, larger side-by-side frames, clear labels, and a `/projects` CTA.
- Homepage CQET is interactive and sourced from the PDF's stated principles, without changing the About-page CQET implementation. Existing genuine client logos retain their colors and source associations, with a reduced-motion static treatment. The ivory closing uses a verified Medanta portfolio image and the authoritative contact address.
- Motion consists of consistent section/image reveals, image-mask and line details, service/CQET/transform selection, project hover treatment, and the client-logo movement. Reduced-motion CSS disables decorative movement, while the existing cinematic logic supplies its static experience.

## Files changed for this phase

`src/app/page.tsx`, `src/app/homepage.css`, `src/data/homepage.ts`, `src/data/homepage-projects.ts`, `src/components/homepage-motion.tsx`, `src/components/homepage-service-showcase.tsx`, `src/components/homepage-project-gallery.tsx`, `src/components/homepage-cqet.tsx`, `src/components/homepage-contact-cta.tsx`, `src/components/project-transformations.tsx`, `src/components/cinematic-placeholder.tsx`, `src/components/cinematic-placeholder.module.css`, and `tests/enquiries.test.mjs`.

## Validation

- `npm.cmd run lint` — passed.
- `npm.cmd run typecheck` — passed.
- `npm.cmd run test:enquiries` — 20 passed, 0 failed. The test suite also covers data/asset integrity and cinematic frame selection.
- `npm.cmd run build` — passed; homepage statically rendered with Next.js 16.3.8.
- Browser review: eight sections; no horizontal document overflow at 360, 390, 768, 1024, 1440, or 1920px. Inspected mobile, tablet, and desktop section compositions. Verified service and CQET switching, transformation project switching, animation skip, and contact navigation to `/contact#enquiry-form`.
- The contact page correctly displays its existing direct-email/call fallback because secure email and rate-limit providers are not configured in this local environment. No backend change was made.
- The development-console history contains temporary module-not-found entries recorded while new source files were being created; the final production compile and browser page load succeeded. No new runtime failure was observed after completion.
- Reduced-motion behavior was checked in code and existing tests, but browser preference emulation was unavailable in the connected browser tooling. Screenshots were reviewed in the browser; the connected tool did not expose a persistent screenshot export for this report.

## Remaining limitations

The source PDF's portfolio photographs vary in lighting, crop, and resolution. They have been kept authentic and project-matched rather than artificially replaced. Permission status for client logos and project photographs remains governed by the existing asset manifest and requires owner confirmation before public publication. Online enquiry submission still requires the separately scoped production providers. No deployment, Git commit, or push was performed.
