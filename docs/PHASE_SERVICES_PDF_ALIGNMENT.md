# Services Page PDF Alignment

## Scope

The `/services` overview now uses the seven verified service categories from the AR Interior Group Work Profile PDF. The page remains a continuous, content-driven editorial layout and does not alter service-detail routes.

## Content changes

- Removed the previous mixed overview of unsupported space-planning, turnkey, MEP, and generic service summaries.
- Added the verified service inventory: MICRO MARKETS SETUP; Civil Services; Furniture & Working Desk; Alloy & Wooden partition; Flooring & ceiling solution; Plumbing & Sanitary work; Railing Structure.
- Used PDF-grounded descriptions and listed terms including Modular Furniture & Related Fixtures, Granite Stone, Marble Stone, Vitrified Tiles, Glossy Tiles, Washroom Solutions, Fire Line Solutions, Extraction Work, Submersible Work, and Drain Chamber.
- Used the supported positioning “Experts in Space Planning and Design & Build Projects.”

## Data architecture

`src/data/services.ts` is the authoritative overview data module. It contains typed service records, developer-only source metadata, verified image references, descriptions, and bullets. The overview JSX consumes this data through `ServicesShowcase`.

## Images and interactions

Authentic local project photographs are used where the service imagery manifest provides a suitable source. Plumbing and railing use text-led treatment because no dedicated overview image is mapped. The service navigation is keyboard-accessible button controls with an active image/content panel; below-fold images use lazy loading and reserved aspect ratios.

## Animation and accessibility

The page uses normal document flow, rounded existing theme treatment, semantic headings, native links/buttons, meaningful alt text, and no scroll locking, snapping, or slideshow mechanics.

## OCR and exclusions

No new OCR correction was made in this pass. PDF page numbers, provenance labels, developer notes, and document-editing artifacts are not rendered.

## Validation

- `npm run lint` — passed
- `npm run typecheck` — passed
- `npm run test:enquiries` — passed (20 tests)
- `npm run build` — blocked by the environment’s missing `lightningcss.linux-x64-gnu.node` optional native module

## Client clarification

Dedicated PDF-supported imagery for Plumbing & Sanitary work and Railing Structure was not mapped in the existing local service imagery manifest, so the overview intentionally uses text-led presentation for those records.
