# Phase 07.4 — Image quality audit and placeholder cleanup

## Scope

Reviewed the image assets published by the current website: project photographs and thumbnails, the selected architectural concept gallery, client logos, the AR Interior Group logo, and representative desktop/mobile cinematic frames and posters. The authoritative company profile PDF remains unchanged at `reference/AR INTERIOR GROUP WORK PROFILE.pdf` (10,112,935 bytes).

## Image review and actions

- Audited 51 full-size project photographs before cleanup using contact sheets; the published project library now contains 50 full-size photographs and 48 thumbnails. Existing project associations and documented before/after pairs remain intact.
- Confirmed the specifically flagged photograph on PDF page 32, image xref 527: a worker in an orange high-visibility vest and yellow hard hat. Removed its full-size copy (28,214 bytes) and thumbnail (19,130 bytes) from `public/projects/airtel-pune/`. A cross-library perceptual comparison found no other matching public copy.
- The Airtel gallery no longer includes that photo. The Airtel project remains listed with its other profile-associated assets; no project detail or achievement was invented.
- Replaced the Contact page and shared contact feature's use of the flagged image with a correctly identified Technip Energies, Noida workplace photograph. Replaced the furniture service's Airtel image with the documented furniture-assembly image at `public/projects/furniture-assembly/p18-img381-thumb.webp`.
- Removed visible PDF page/source captions and extraction-style labels from homepage, About, Services, project cards/details, transformation captions, process feature, client wall, and contact image captions. Project/location labels, “Before”/“After” labels, consent notices, and accessible image descriptions remain. Source page numbers and asset IDs are retained in internal manifests and alt text.
- Added an `excluded_publication` record to `src/data/project-image-manifest.json` with the removed asset paths, page, xref, classification, reason, and exclusion status. The profile PDF remains the recoverable source.
- Reviewed 35 supplied client logos and 16 concept-render source images. The public concept gallery remains curated to nine assets; its existing selection excludes the images containing placeholder landscape panels. Logo, concept, and cinematic assets were not replaced with stock imagery.

## Integrity and performance

- Conceptual imagery remains identified as conceptual; it is not presented as a completed AR Interior Group client project. Authentic project photography remains separately associated with its documented project.
- No company achievements, project details, or credentials were added. The existing charcoal, champagne-gold, and ivory visual system and homepage/cinematic component were preserved.
- Existing Next.js image sizing, thumbnail use, and lazy-loading patterns remain in place. Current on-disk image totals: project assets 5.71 MB; concept source/thumbnail assets 1.90 MB; client logos 0.69 MB; cinematic assets 8.68 MB. Cinematic frames were not regenerated or re-encoded in this image-cleanup phase.

## Validation

- `npm run lint` — passed.
- `npm run typecheck` — passed.
- `npm run test:enquiries` — passed, 19/19 tests, including new removal/provenance and visitor-caption checks. Node emitted its existing non-blocking module-type detection warning.
- `npm run build` — passed; all App Router pages generated successfully.
- Local rendered-route smoke checks returned HTTP 200 for `/projects/airtel-pune`, `/contact`, and `/projects`; response HTML contained neither the excluded asset name nor visible page-source captions.
- Reviewed the open desktop About page in the browser accessibility tree. Automated viewport emulation was unavailable in this pass; mobile behavior was not separately browser-driven.

## Remaining review items

- Obtain client/individual publication approvals before public launch; logo permissions in the existing manifest are unconfirmed.
- Supply alternate authentic project images if the client wants the Airtel project page reduced to a smaller, more interior-focused selection.
- A dedicated desktop/mobile screenshot regression suite is not configured in this project.
