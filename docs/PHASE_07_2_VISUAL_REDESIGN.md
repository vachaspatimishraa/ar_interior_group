# Phase 07.2 — Portfolio-Led Visual Redesign

## Summary

Completed the homepage and internal-page visual refinement using only the existing Next.js, React, TypeScript, Tailwind, CSS, and HTML image stack. The cinematic canvas, verified company content, enquiry API, and central ivory/charcoal/champagne theme remain in place. No browser-side Three.js, new package, deployment, or commit was added.

## Source review and extracted client marks

The 63-page company profile was checked visually at PDF pages 3–5 for client marks and pages 14–15, 36–40 for source-labeled transformations. Logo art was extracted from the embedded PDF page artwork, cropped, and saved as lossless WebP. The reproducible extraction script is `production/phase-07-2/extract_pdf_assets.py`.

The manifest contains 35 marks: 9 from page 3, 8 from page 4, and 18 from page 5. Organizations represented are Google, Compass Group, Myntra, Nxtra by Airtel, HighRadius, Sequel, iQor, ST Telemedia Global Data Centres, TechnipFMC, Maier Vidorno, Maersk, IILM, UFlex, Medtronic, Vodafone, Tata Steel, Siemens Healthineers, SmartQ, Pronto, ICS Foods, EXL, OCS, Shadowfax, Technip Energies, Coforge, NSL, Rivigo, Defsys Integrated Systems, Sahyog, PB Health, HCG Aastha Oncology, Narayana Health, Medanta, Fortis, and Niwas Housing Finance.

The GBU image on page 4 is a building photograph rather than a logo, so it is not displayed as a mark; the existing text reference remains in the client list. IILM is represented once rather than repeated across its two profile spreads. Publication permission for every displayed mark is explicitly `unconfirmed` in `src/data/client-logo-manifest.json` and must be obtained before public release.

## Verified transformation pairs

The source-mapped `src/data/transformation-manifest.json` records project, location, original labels, source pages, paths, alignment status, and unconfirmed publication permission:

| Project | Before | After | Source |
| --- | --- | --- | --- |
| Tata Electronics Private Limited · Hosur, Tamil Nadu | page 14 | page 14 | PDF page 14 |
| LTIMindtree · Whitefield, Bengaluru | page 15 | page 15 | PDF page 15 |
| JCB · Jaipur | page 36 | page 36 | PDF page 36 |
| PB Health · Gurgaon | page 37 | page 38 | PDF pages 37–38 |
| MV Seals · Gurgaon | page 39 | page 40 | PDF pages 39–40 |

The LTIMindtree page embeds both views in one composite image. The extraction script crops its left and right photo panels into `public/projects/ltimindtree-whitefield/p15-before.webp` and `p15-after.webp`; the original source page shows the corresponding Before/After labels. The remaining pairs reuse existing source-photo files. All viewpoints are treated as unaligned and displayed side by side—no slider implies geometric alignment. Each pair links to its project detail page.

## Homepage and internal pages

The homepage retains eight sections and the original canvas hero: About preview; photo-led services plus the interactive editorial process; selected portfolio; documented transformations; interactive CQET values; client-logo wall; and photographic contact CTA. The replacement process sequence has three user-selectable stages, with image/source captions and explicit copy clarifying that it is editorial, not a formal methodology or a single-project timeline. The CQET feature uses one fixed, source-captioned project photograph and four tap/keyboard-selectable stated principles; it makes no performance guarantees.

The client wall has three CSS-marquee rows with alternating directions, varied natural image proportions, `sizes`/intrinsic dimensions, lazy loading, keyboard-focus and hover pause, screen-reader-hidden loop copies, and a reduced-motion static grid. The logo artwork is served locally; there are no third-party image hosts.

Services index and six relevant service-detail pages now use source-captioned portfolio imagery for context, explicitly not as proof of a pictured service scope. Other services remain editorial where a suitable source image is not supported. About and Projects retain their authentic project photographs and source attribution; the LTIMindtree detail page now has its verified pair. Clients uses the same logo wall. Contact and enquiry routing remain intact. No conceptual render is presented as a completed project photograph, and no project scope, credentials, endorsement, or achievement was added.

## Files added or changed

- Added `production/phase-07-2/extract_pdf_assets.py` and `src/data/transformation-manifest.json`.
- Added generated `src/data/client-logo-manifest.json`, `src/data/ltimindtree-whitefield-pair.json`, and `src/data/service-imagery.ts`.
- Added `src/components/client-logo-wall.tsx`, `process-showcase.tsx`, `project-transformations.tsx`, and `cqet-feature.tsx`.
- Added 35 local logo WebPs under `public/client-logos/` and two cropped LTIMindtree source-photo WebPs under `public/projects/ltimindtree-whitefield/`.
- Updated homepage, Clients, Services and service details, project comparison data/rendering, shared theme/CSS, and `tests/enquiries.test.mjs`.
- Existing portfolio, concept, brand, and cinematic assets were preserved. No source PDF pages or existing project images were overwritten.

## Quality checks

- `npm.cmd run lint` — passed.
- `npm.cmd run typecheck` — passed after the production build.
- `npm.cmd run build` — passed; Next.js 16.3.8 generated all existing routes.
- `npm.cmd run test:enquiries` — 18 passed, 0 failed. Node prints the existing non-fatal module-type warning for the enquiry handler.
- Production browser preview: all eight home sections rendered; no broken loaded images; selectors changed project photographs, captions, active state, supporting process image/link, and CQET description; the source-labelled project page and logo wall rendered; focusing a marquee row changed its animation state to paused. Contact CTA links retained `/contact#enquiry-form`.
- Responsive viewport checks at 360, 390, 768, 1024, 1440, and 1920 px: no horizontal overflow at any size; all eight homepage sections present; zero broken loaded images. A 768 px overflow found in the first pass was fixed and all six widths were rerun.
- Browser system preference reported `prefers-reduced-motion: false`; the static reduced-motion behavior is implemented and source/CSS inspected, but browser emulation of that preference was not available in this session. No enquiry was submitted and no external email was sent.

## Performance, accessibility, and remaining approvals

The 35 unique lossless logo assets total 689,334 bytes; the two LTIMindtree crops total 197,700 bytes. Local image assets use intrinsic dimensions and responsive `sizes`; logo loading is lazy, and the wall uses CSS rather than a continuous JavaScript render loop. The motion controls use native buttons, active-state semantics, visible focus, live announcement for changed copy, reduced-motion CSS, and source/alt descriptions. Duplicate loop copies are hidden from assistive technology.

Obtain publication approval for the client marks and project photographs before public release; keep the current disclosure until then. Exact browser-side reduced-motion emulation was unavailable. No deployment, push, or commit was performed.
