# Phase 07.7 — Homepage polish and image audit

## Scope

Homepage-only image, typography, layout and interaction refinements; shared font and radius tokens; no internal-page redesign or backend changes.

## Image audit and corrections

- The second homepage service, Space Planning, Design & Build, had no photo mapping and rendered the typographic fallback. It now uses the manifest-mapped MV Seals, Gurgaon image `p40-img609.webp`.
- The fourth homepage service, Turnkey Fit-outs, had no photo mapping and rendered the typographic fallback. It now uses the manifest-mapped Sequel Logistics image `p22-img437.webp`.
- The About image previously reused the same MV Seals photograph as Space Planning. It now uses a distinct, locally verified Medanta, Lucknow photograph (`p09-img277.webp`). Its caption remains the project/location, with no claim that the image depicts the company generally.
- The third selected project uses the manifest-mapped HighRadius, Hyderabad photograph `p17-img365.webp`. Its source is present; the observed empty `currentSrc` was consistent with native lazy-loading while the card was outside the viewport. A same-project alternate (`p17-img369.webp`) is now available as its load-error fallback.
- Homepage portfolio images load lazily and asynchronously. On an image error the component tries another image from that same project, then omits the broken image if no alternative works. The image container reserves its geometry to limit layout shifts.
- The existing “Principles behind the practice” section was refined in place and not duplicated. It retains its verified Sequel Logistics visual and includes a disclosure that the listed statements are company principles, not measured performance guarantees.

The mapped original and fallback photo URLs returned HTTP 200 in a local asset smoke check. No photographs were substituted from unrelated stock sources.

## Typography and visual system

- The homepage and shared theme now resolve typography through self-hosted Poppins in regular, medium, semibold and bold weights, loaded with Next's local-font integration. This avoids runtime dependence on Google Fonts access.
- The included font files are Latin WOFF2 subsets from the Poppins project and are accompanied by the SIL Open Font License at `public/fonts/OFL.txt`.
- Shared CSS radius tokens now cover cards, panels, images and controls. Homepage image frames, cards, principles tiles and pill-style links use those tokens, preserving the charcoal, champagne-gold and ivory palette.
- Principles tiles have keyboard-operable button semantics, selected-state styling and a single linked description. Motion remains gated by reduced-motion preferences.

## Validation

- `npm.cmd run lint` — passed.
- `npm.cmd run typecheck` — passed.
- `npm.cmd run test:enquiries` — passed, 20/20.
- `npm.cmd run build` — passed; static pages generated successfully.
- `git diff --check` — passed (Git printed existing line-ending normalization notices).
- Local HTTP asset smoke check — all seven selected original/fallback assets returned 200.
- Browser viewport verification at 360, 390, 768, 1024, 1440 and 1920 pixels could not be completed: the available desktop browser session could not connect to the local development server, and this repository does not include Playwright or another browser test runner. The successful production build and image URL checks do not substitute for visual browser QA.

## Remaining review items

- Visually verify mobile and desktop layouts in a browser after the local preview is reachable; especially inspect the service selector/image relationship, principles cards and lower-page transitions at the requested widths.
- Confirm image crop preferences for the new Medanta About photograph. It is authentic and distinct but includes people/event decorations, rather than being a clean architectural-only frame.
- No backend, internal page redesign, deployment, or production cinematic sequence work was done as part of this homepage polish.
