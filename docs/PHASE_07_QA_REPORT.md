# Phase 07 QA Report

## Audit scope and baseline (before Phase 07 code changes)

Audit date: 2026-10-03. Scope: repository/application review, supplied work-profile PDF and asset-manifest verification, route/navigation/content/security review, automated tests, browser checks, and locally measurable performance indicators. No deployment, commit, live email, or external service write is in scope.

The working tree was already dirty before this phase, with Phase 00–06 website files and supplied assets uncommitted. Those changes are being preserved; this report does not attribute the pre-existing changes to Phase 07.

The project uses Next.js 16.3.8 App Router, React 19.2.8, TypeScript 5.9.3, and Tailwind CSS 4.3.3. It contains the eight requested page routes, generated service/project detail routes, and the Phase 06 enquiry API. No Playwright, Cypress, Lighthouse, or axe test framework is installed. The existing automated test suite at baseline contained 11 mocked enquiry tests. The supplied company profile PDF exists at `reference/AR INTERIOR GROUP WORK PROFILE.pdf` and had previously been inspected; the JSON asset manifest references 49 portfolio photographs and 16 concept-image placements. All those paths exist. The public cinematic directory contains 96 desktop and 60 mobile WebP frames; no sequence frame is missing.

### Initial findings requiring verification or correction

- Homepage featured-project cards used `/projects#<slug>` anchors, while the current Projects index no longer defines matching IDs. These links do not reach the selected project's detail page.
- The homepage advertised “MEP Coordination”; the supplied company profile only documents MEP technicians in the team roster, so the service wording exceeded its evidence.
- Header active state matched only exact top-level URLs, leaving nested service and project routes without an active section indicator.
- Detail pages showed only Home/current breadcrumbs, without linking to their Services or Projects parent.
- There was no site-wide skip-to-main-content link. The global stylesheet already disables smooth scrolling for reduced-motion users; this was confirmed during the audit and does not require a fix.
- Project/service data integrity and cinematic frame-selection logic were not independently tested.
- The cinematic canvas bounds its decoded-frame cache and limits concurrent loads to three; image requests were not explicitly cancelled during effect cleanup. Runtime animation behavior and viewport-specific layout still needed browser/runtime verification.
- A profile source image exists under `public/cinematic/source/`; whether it is referenced or needs to remain publicly addressable required confirmation before any asset action.
- The production email/rate-limit environment is unconfigured. Phase 06 already fails closed; no live provider delivery or trusted-proxy behavior can be validated locally without credentials and hosting configuration.
- No production domain is configured, so canonical URLs and sitemap hostnames must not be invented.

## Results

### Implemented corrections

- Corrected homepage portfolio card targets to the matching project detail routes; removed the unsupported “MEP Coordination” service label in favor of the profile-backed “MEP team capability” page.
- Made navigation active state work on nested project/service routes, closed the mobile menu on Escape, and returned focus to its toggle.
- Added parent breadcrumbs to detail pages and a global skip-to-main-content link.
- Added accessible text tones for small text on ivory/charcoal surfaces while preserving the approved charcoal, champagne, and ivory brand palette.
- Extracted project-filter and cinematic frame-selection helpers for direct regression tests. The project-filter client receives only cover-image metadata rather than every gallery asset.
- Cancelled in-flight frame image requests when the cinematic component unmounts; retained its bounded decoded-frame cache, three-load concurrency cap, poster fallback, and reduced-motion/save-data static experience.
- Added canonical/Open Graph metadata only when a valid `SITE_URL` is configured; added dynamic `robots.txt` and `sitemap.xml` routes without inventing a public domain.

### Automated and runtime checks

- `npm run lint`: passed.
- `npm run typecheck`: passed.
- `npm run build`: passed on Next.js 16.3.8. Main routes prerender; service and project detail pages are generated from their known slugs; robots and sitemap are dynamic.
- `npm run test:enquiries`: 16 tests passed, 0 failed. Coverage includes enquiry validation/security behavior, provider-failure handling, concurrent duplicate protection, all 15 project and 10 service records, manifest/source asset existence, concept thumbnails, all 156 cinematic frames and both posters, project filters, frame-boundary logic, and canonical URL validation. Node prints a non-fatal module-type warning when running the existing TypeScript tests with its strip-types flag.
- `npm audit --offline --omit=dev`: 0 advisories in the locally available audit data. This offline check does not establish current registry advisories.
- Production server smoke checks: HTTP 200 for `/`, `/about`, `/services`, a service detail, `/projects`, a project detail, `/clients`, `/contact`, `/robots.txt`, and `/sitemap.xml`; unknown service/project slugs return 404; `GET /api/enquiries` returns 405 as expected for the POST-only endpoint.
- Manual in-app browser review of homepage and Contact route confirmed visible navigation/footer, source/concept disclosure, homepage service and project links, verified company contact links, and form labels/controls. No enquiry was submitted.
- No Playwright, Cypress, Lighthouse, axe, or other browser audit runner is installed. The production bundle was measured from emitted build chunks: 11 JavaScript chunks, 608,502 raw bytes total (largest 228,922 bytes); 2 CSS chunks, 37,385 raw bytes total (largest 33,227 bytes). These are uncompressed chunk totals, not route-level transfer or browser performance metrics. LCP/INP/CLS and automated accessibility scoring were not measured.

### Asset and accessibility findings

- All 49 project-photo manifest entries and their thumbnails, all 16 concept placements (14 unique source references) and thumbnails, and all 96 desktop plus 60 mobile sequence frames are present. Desktop frames total 5,909,996 bytes (1280×720); mobile frames total 2,295,806 bytes (720×1280). Both posters are present. No new render was produced during QA.
- Manual production browser output exposes the main navigation, skip link, h1 hierarchy, project/service links, project image descriptions, and labeled contact inputs. Reduced-motion behavior already existed and was preserved. Exact 360/390/768/1024/1440/1920 viewport screenshots and keyboard/screen-reader conformance were not available in this browser session and should be checked in Phase 08 or a device/browser test environment.
- Gold `#C49A52` is retained for brand accents and dark surfaces. Small text on ivory now uses a darker derived gold; muted text tokens were adjusted for readable contrast. This was a targeted CSS token review, not a full WCAG audit.
- `public/cinematic/source/design-desktop.webp` and `design-mobile.webp` are not referenced by application code, but were left untouched because they were supplied assets. As files in `public`, they are addressable by URL. Confirm whether these originals should remain public before release.

### Remaining launch blockers / recommendations

1. Set `SITE_URL` to the approved production origin. Until then, the no-hostname sitemap response is an empty `<urlset>`, canonical tags are omitted, and robots omits its sitemap reference. After configuration, verify sitemap URL coverage against all 10 services and 15 projects.
2. Configure and verify the Phase 06 email/rate-limit secrets and the hosting proxy's trusted client-IP behavior in a non-production environment. The local browser smoke test did not submit the form or invoke real providers; the mocked endpoint suite passes. Confirm a real test enquiry only after explicit operational approval.
3. Obtain and document consent/publication approvals for the company PDF's client names and project photographs, as the existing in-page notices state. Confirm if direct source images in `public/cinematic/source` are intended to be public.
4. Run visual regression tests at agreed desktop/mobile widths and a Lighthouse/accessibility scan in the actual target browser environment. Avoid treating the raw JS chunk sum as a page-load metric.
5. No Phase 08 work, deployment, or commit was performed. The repository still includes pre-existing uncommitted Phase 00–06 changes and supplied assets; Phase 07 changes are not isolated by a commit.
