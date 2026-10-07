# Phase 09 — Services Overview Implementation

## Scope

Implemented the `/services` overview only. The approved homepage, About layout, global header/footer, other page layouts, and enquiry backend were not redesigned. The existing `/services/[slug]` route structure and slugs remain available; service copy is now sourced from the same canonical profile records used by those routes.

## Files changed

- `src/app/services/page.tsx` — continuous service overview, seven editorial details, documented micro-market references, and contact close.
- `src/app/services/services.css` — route-scoped typography, layout details, text-led image treatment, hover states, and reveal presentation.
- `src/components/services-showcase.tsx` — accessible master/detail preview using the shared preview selection hook, image preloading, crossfades, source captions, and unavailable-image fallback.
- `src/components/content-page.tsx` and `src/components/page-intro.tsx` — optional staged hero reveal enabled only when the current page is Services.
- `src/components/scroll-reveal.tsx` — section-group observation enabled for the Services scope; existing Home/About scopes are unchanged.
- `src/data/company-profile.ts` — corrected the seven overview service descriptions and terms against their cited PDF pages while preserving the service slugs and older records.
- `src/data/services.ts` — projects the seven canonical service records, including the second source paragraph and profile page number.
- `src/data/service-imagery.ts` — existing verified service-to-image mappings retained; no new speculative image associations added.
- `docs/PHASE_09_SERVICES_OVERVIEW_IMPLEMENTATION.md` — this implementation record.

## Source content and images

The authoritative source was `reference/AR INTERIOR GROUP WORK PROFILE.pdf`:

- Micro Markets Setup — page 7; work references and kiosk image — page 8.
- Civil Services — page 55.
- Furniture & Working Desk — page 56.
- Alloy & Wooden partition — page 57.
- Flooring & ceiling solution — page 58.
- Plumbing & Sanitary work — page 59.
- Railing Structure — page 60.

Service titles, source copy, named materials, listed work items, and the core civil competencies are taken from these sections. The profile's original wording is retained, including its source spelling and grammar, rather than rewritten as new claims.

The interactive preview uses the existing mapped portfolio images for Micro Markets, Furniture, Alloy & Wooden partition, and Flooring & ceiling solution. Each image is captioned with its profile page. Civil Services, Plumbing & Sanitary work, and Railing Structure use an intentional branded text-led panel because no service-specific image is mapped for them in the supplied site assets. No unrelated photograph was substituted.

The micro-market area displays the nine references already listed in the canonical company profile: Medanta (Lucknow), HCG Aastha (Ahmedabad), Narayana (Bommasandra), Shell India Markets (Bengaluru), L&T Tech Park (Hebbal, Bengaluru), LTIMindtree (Hyderabad), Accenture (Mumbai), Wells Fargo (Hyderabad and Bengaluru), and Tata Electronics (Hosur, Tamil Nadu). Supplied photographs are shown only for references that have mapped portfolio imagery. The section explicitly limits the association to Micro Market/Kiosk work and does not claim full hospital or office fit-outs.

## Interaction, motion, and loading

- The seven service controls reuse `usePreviewSelection`: hover/focus previews are temporary; leaving returns to the permanent selection; click/native keyboard activation selects it.
- Preview images are warmed by the existing preloader and crossfade in a stable 1.45:1 frame. Image changes do not restart the section reveal.
- The hero uses a priority image. Lower-page project-reference images use native lazy loading and fixed aspect ratios. Image source failures switch to the text-led panel.
- Sections reveal as they enter view, with image, eyebrow, heading, copy, list/control delays. The base surfaces remain visible; content is server-rendered and visible until the observer activates. Reduced-motion/static observer fallback makes all content visible immediately. Reveals complete once and stay visible on reverse scroll.
- The page uses normal browser scrolling, natural content height, and responsive one-/two-/three-column layouts; it adds no scroll lock or snap behavior.

## Validation

- `npm.cmd run lint` — passed.
- `npm.cmd run typecheck` — passed.
- `npm.cmd run test:enquiries` — passed (24 tests, including shared preview selection and local asset/data integrity).
- `npm.cmd run build` — passed; `/services` prerendered and existing service detail paths generated.
- `git diff --check` — passed; Git emitted only existing line-ending warnings for unrelated pre-existing files.
- Shared selection logic — exercised the full 1→2→3→4→5→6→7 sequence, hover-to-selection return, focus/blur, reverse selection, and rapid switching; passed.
- Browser inspection — opened `http://localhost:3000/services`; the rendered accessibility tree contained all seven selectable services, the first preview and its source content, all nine micro-market references, the contact link, and the shared footer. The existing preview-selection test covers temporary hover/focus and permanent click state. Automated pointer/keyboard switching and mobile viewport screenshots were not available through the browser surface in this run.
- Local image requests — all nine checked hero, selector, and micro-market image paths returned HTTP 200.

## Remaining limitations

- No service-specific image is mapped for Civil Services, Plumbing & Sanitary work, or Railing Structure, so those remain text-led by design.
- Browser inspection verified the rendered route and its structure, but did not provide a reliable viewport-resize or per-click UI automation interface. Responsive behavior is implemented with the project's existing breakpoints and should receive final visual review in desktop and mobile browsers.
- Existing project records use normalized city spelling/formatting in some micro-market locations; the references remain tied to the canonical project records to avoid creating duplicate project data.
