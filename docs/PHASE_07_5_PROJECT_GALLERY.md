# Phase 07.5 — Project Gallery Update

## Scope

Refresh the homepage before/after showcase and complete the project directory from the authoritative AR Interior Group work profile. Existing enquiry/backend behavior and the broader homepage remain unchanged.

## Homepage transformation showcase

- Retains the five existing documented before/after pairs and their project selector.
- Selecting a project updates both labeled photographs together.
- Uses responsive, equal-height image frames with `object-fit: contain`; source images are not distorted or cropped to fill the frame.
- Adds a restrained image transition, with reduced-motion behavior honored by the existing global motion rules.
- The CTA now opens `/projects` and reads “View All Projects”.

## Directory and content integrity

The project directory contains 19 entries: 14 photographed case studies and five text-led references. The five names listed on profile page 8 are Narayana Institute of Cardiac Sciences (Bommasandra), Shell India Markets Private Limited (Bengaluru), L&T Tech Park (Hebbal, Bengaluru), Accenture Services Pvt Ltd (Mumbai), and Wells Fargo India Private Limited (Hyderabad and Bengaluru). The source uses inconsistent spellings of Bengaluru; these are normalized for display.

Those five references have no dedicated photographs or project-specific scope in the profile. They are clearly marked as short references and are not assigned unrelated images. The sofa delivery/assembly material on profile page 18 is retained at its existing route as a service example, but excluded from the project directory and labeled so it cannot be mistaken for a named client case study.

The concept-render collection remains separate from photographed case studies. Existing project slugs are preserved.

## Routes and navigation

- All 19 directory entries use the existing `/projects/[slug]` detail route; text references receive a text-only detail presentation.
- The existing `/projects/furniture-assembly` route remains available for continuity and is explicitly identified as a service example.
- The micro-markets/kiosks service page links to the five additional text references. Its related-work cards use a typographic reference panel where there is no authentic project photograph.
- Previous/next project links traverse the 19-entry directory and do not treat the sofa service example as a client project.

## Responsive and performance notes

- The transformation showcase pairs images on wider screens and stacks them on narrow screens. Frame sizing responds to viewport height and has minimum/maximum bounds.
- Image dimensions are retained from the supplied manifest; `contain` preserves the full supplied image within its frame.
- The project directory uses a responsive CSS grid, not multi-column masonry, so entries remain in a predictable reading order.
- Existing optimized thumbnails remain in use for the project-card grid. Transformation images continue to use their supplied full-resolution WebP assets.
- No new dependencies, browser-side 3D, backend changes, or new photography were introduced.

## Verification

Automated assertions cover the 19-entry inventory, exact text-reference names and locations, absence of image assets for those five entries, service-example exclusion, manifest-backed image integrity, service links, filtering, and the homepage directory CTA. Lint, TypeScript, test, and production-build results are recorded in the Phase 07.5 handoff.

## Publication note

The existing site disclosure remains in place: confirm image publication permission and any necessary client/location consent before public release. This implementation makes no new claims about project outcomes, dates, metrics, or scope.
