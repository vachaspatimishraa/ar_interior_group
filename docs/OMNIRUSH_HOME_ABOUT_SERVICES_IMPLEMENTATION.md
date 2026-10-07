# OmniRush Home + About + Services Implementation

## Files changed

- `src/data/company-profile.ts`
- `src/data/homepage.ts`
- `src/data/about-page.ts`
- `src/data/services.ts`
- `src/app/about/page.tsx`
- `src/app/services/page.tsx`
- `src/components/content-page.tsx`
- `src/components/services-showcase.tsx`
- `src/components/scroll-reveal.tsx`
- `src/styles/scroll-motion.css`
- `docs/OMNIRUSH_HOME_ABOUT_SERVICES_IMPLEMENTATION.md`

## Components and architecture

The Services overview now uses `ServicesShowcase` with typed records from `src/data/services.ts`. The overview records are derived from the authoritative service records in `company-profile.ts`, avoiding a second conflicting service-description array. Service-specific imagery is resolved through the existing verified imagery manifest.

About now includes the PDF-supported strength roles and values. The existing Home and About layouts, cinematic canvas sequence, project records, logo wall, enquiry backend, and natural-scroll architecture were preserved.

## Duplicate data and PDF fidelity

- The seven Services overview records now derive title, description, bullets, source page, and source section from `company-profile.ts`.
- The authoritative seven service names are: MICRO MARKETS SETUP, Civil Services, Furniture & Working Desk, Alloy & Wooden partition, Flooring & ceiling solution, Plumbing & Sanitary work, and Railing Structure.
- CQET terminology remains Consistency, Quality, Economical, and Time Efficiency.
- About strength roles use only the roles listed in the implementation brief: Design / Visualization, Project Management, Planning / Commercial, Supervision, Safety, Quality, and MEP.
- About values use only the supported concepts: Integrity, Commitment to clients, Honesty, Innovation, Constant Improvement, and Delivering on commitments.
- No new OCR correction was made. No page numbers, source labels, asset paths, or editing artifacts are rendered.

## Unsupported copy and images

The Services overview’s former generic service matrix was replaced with the seven verified PDF service records. Missing dedicated imagery for Civil Services, Plumbing & Sanitary work, and Railing Structure remains intentionally text-led rather than using placeholder art. Existing rejected Airtel worker imagery remains excluded.

## Theme and motion

The existing central theme in `src/styles/theme.css` continues to provide Poppins, warm ivory, charcoal, champagne gold, radii, spacing, easing, and motion values. Services is now connected to the shared `ScrollReveal` system with non-blocking fallback behavior and reduced-motion support. Service controls remain native keyboard-accessible buttons with touch-sized rows.

## Home/About/Services behavior

- Home retains the cinematic Canvas sequence and continuous sections. Homepage service selections now cover all seven verified service categories; services without mapped photography use the existing text-led treatment.
- About remains a continuous editorial page and now includes the supported team/strength roles and values.
- Services uses normal document flow, a numbered selectable service list, active image/content switching, lazy-loaded below-fold imagery, and a light-theme contact CTA.

## Validation

- `npm run lint` — passed
- `npm run typecheck` — passed
- `npm run test:enquiries` — passed, 20 tests
- `npm run build` — passed; all 40 generated pages completed
- `git diff --check` — passed

## Browser review

No browser automation or viewport-emulation tool was available in this environment, so live rendering at 360px, 390px, 768px, 1024px, 1440px, and 1920px was not performed. Static build output, route generation, image manifest tests, typecheck, lint, and automated tests passed.

## Remaining limitations

The source PDF’s full printed pages were not machine-renderable in this shell because no PDF raster/text utility was installed. The implementation used the verified source-backed content already present in the repository and the explicit source wording in the implementation brief. No deployment, commit, or push was performed.
