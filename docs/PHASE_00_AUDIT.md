# AR Interior Group — Phase 00 Repository Audit

**Audit date:** 2026-10-19
**Scope:** repository, configuration, source structure, supplied assets, existing rules, documentation, and non-destructive checks.
**Implementation status:** Phase 00 documentation only. No application source, dependency, asset, or configuration changes were made by this audit.

## 1. Audit conditions and repository state

The repository was re-read after a retry because the working tree changed during the first validation attempt. The authoritative snapshot for this audit is the current tree, not the earlier starter-app observation.

- Branch: `feature/single-page-redesign`
- HEAD: `544f09e` — `feat: complete single-page portfolio with responsive client grid and hero layout fixes`
- Remote tracking branch: `origin/feature/single-page-redesign`
- Working tree: not clean
- Existing uncommitted changes: `src/app/globals.css`, `src/app/page.tsx`, `src/components/cinematic-placeholder.module.css`, `src/components/cinematic-placeholder.tsx`, `src/components/site-header.tsx`, and new `src/components/scroll-progress.tsx`
- No commit, push, reset, checkout, or deployment was performed

The uncommitted application work predates this audit and is intentionally preserved. Any later implementation phase must reconcile it before making overlapping edits.

## 2. Technology and dependency inventory

| Area | Finding |
| --- | --- |
| Framework | Next.js `16.3.8`, App Router, Turbopack used by the production build |
| React | React and React DOM `19.2.8` |
| TypeScript | `5.9.3`, strict mode, no emit, bundler module resolution, `@/*` → `src/*` |
| CSS | Tailwind CSS `4.3.3` through `@tailwindcss/postcss` |
| Linting | ESLint `9.39.5`, `eslint-config-next` `16.3.8`, flat config |
| Runtime observed | Node `v24.19.0`, npm `11.17.0` |
| Package manager | npm with checked-in `package-lock.json` |
| Test runner | Node test runner using `--experimental-strip-types`; no browser test framework |
| Build scripts | `dev`, `build`, `start`, `lint`, `typecheck`, `test:enquiries` |
| Production dependencies | Next, React, and React DOM only; no GSAP, Three.js, or other animation package is installed |

Next.js requires a supported Node 20.9+ runtime. The package does not declare an `engines` field; this should be decided before deployment so local and CI environments agree.

## 3. Configuration findings

- `src/app/layout.tsx` owns the shared header, footer, skip link, enquiry anchor focus, and reveal observer.
- `src/app/globals.css`, `src/styles/theme.css`, and route/component CSS define the current visual system.
- `next.config.ts` is intentionally minimal and does not configure remote image hosts, redirects, headers, or experimental options.
- `postcss.config.mjs` uses the Tailwind v4 PostCSS plugin.
- `.env.example` documents server-only enquiry configuration. Secrets and local environment files are ignored.
- `README.md` documents the current architecture, asset provenance, enquiry security model, and review checks.
- `AGENTS.md` requires reading the installed Next.js documentation before future code changes and requires natural browser scrolling, content-driven sections, reduced-motion fallbacks, and no scroll hijacking.
- `CLAUDE.md` delegates to `AGENTS.md`.

The current source uses local Poppins font files and a system serif display stack. The requested identity names Playfair Display, Manrope, and Inter. The color tokens are already aligned with the requested charcoal, champagne gold, and warm ivory values. Typography alignment is therefore an open design decision, not a Phase 00 source change.

## 4. Current App Router and application architecture

The repository is no longer a Create Next App starter. Existing routes and handlers include:

```text
src/app/
├── page.tsx                         Home / continuous portfolio page
├── about/page.tsx                   About Us
├── services/page.tsx                Services index
├── services/[slug]/page.tsx         Service detail template
├── projects/page.tsx                Projects gallery
├── projects/[slug]/page.tsx         Project detail template
├── clients/page.tsx                 Clients page
├── contact/page.tsx                 Contact page
├── api/enquiries/route.ts           Server-side enquiry endpoint
├── not-found.tsx
├── robots.ts
└── sitemap.ts
```

Existing reusable areas include shared navigation/footer and brand components, content-page/page-intro primitives, project galleries and documented transformations, client-logo wall, service showcases, scroll reveal utilities, preview-selection logic, the Canvas-based cinematic player, enquiry form and validation helpers, SEO metadata, and site-origin handling.

Authoritative data is centralized primarily in `src/data/company-profile.ts`, with separate homepage, About, service-image, project-image, client-logo, transformation, and office manifests. The test suite asserts many of the relationships between content and local assets.

## 5. Supplied reference and media audit

| Requested material | Current finding | Handling / gap |
| --- | --- | --- |
| Original AR Interior Group logo | Present at `public/brand/ar-interior-group-original.webp` | Existing raster mark is reused; it has not been redrawn. Confirm final usage/permissions before launch. |
| Company profile | Present as `reference/AR INTERIOR GROUP WORK PROFILE.pdf` | Treat as authoritative business-content source. It is intentionally excluded from Git. |
| Completed-project photographs | Present under `public/projects/` and mapped by `src/data/project-image-manifest.json` | Existing records distinguish photographed case studies, short references, and a service example. Do not infer unsupported scope. |
| Before/after pairs | Present for documented pairs, including Tata Electronics, LTIMindtree Whitefield, JCB, PB Health, and MV Seals | UI explicitly states that different viewpoints are not aligned comparisons. Verify publication consent and captions. |
| Client logos | 35 local WebP assets under `public/client-logos/`, mapped by `src/data/client-logo-manifest.json` | Source-mapped, but `publicationApproval` is `unconfirmed`; obtain permission before public release. |
| Service imagery | 7 local WebP assets under `public/service-profile/` | Used as source-backed context only; imagery does not prove the exact scope of a pictured project. |
| Conceptual design renders | 32 WebP files under `public/concept-designs/`, with 14 source manifest entries and a curated gallery | Must remain separate from authentic project photography. |
| Cinematic desktop/mobile assets | 96 desktop frames and 60 mobile frames, plus desktop/mobile posters and source design images | Existing supplied prerendered 2.5D sequence is integrated; it is not a physical construction record or a client project. |
| Stitch desktop designs | Not found in the repository audit | User must provide the approved Stitch exports or a reviewable link/file set. |
| Stitch mobile designs | Not found in the repository audit | User must provide the approved mobile references. |
| MØBEL reference documentation | No named MØBEL reference file or source package found | User must provide the reference or approve a written visual interpretation. |
| Blender scene/render source | No `.blend`, `.fbx`, `.obj`, `.glb`, or `.gltf` source found | `production/phase-02a` contains a proof script/specification only. Blender is not installed locally. |

The repository contains authentic source-derived media, but missing design references mean that visual fidelity to the previously approved Stitch direction cannot be independently verified from the workspace alone.

## 6. Business-content integrity observations

- The profile data states that AR Interior Group was founded in 2019 and describes space planning/design-build, turnkey fit-outs, micro-market/kiosk work, civil services, MEP team capability, furniture/working desks, partitions, flooring/ceiling, plumbing/sanitary, and railing structure.
- Project records preserve source pages and classify entries rather than filling unsupported metrics.
- The micro-market references are limited in copy to the micro-market/kiosk association. A kiosk installation is not presented as a complete hospital interior execution.
- No project floor areas, completion dates, financial results, awards, certifications, testimonials, or performance measurements were found as verified content in the current source data.
- One worker photograph is intentionally excluded from public assets while provenance remains in the internal manifest.

## 7. Existing rules and documentation

Existing guidance that must be preserved:

- Root `DEVELOPMENT_RULES.md` contains ten client-PDF fidelity rules, including source authority, no invention, provenance privacy, authentic photography, concept separation, and centralized data.
- `AGENTS.md` contains permanent natural-scroll, accessibility, animation, asset-loading, and interactive preview requirements.
- `README.md` documents the current architecture, asset rules, enquiry security model, and deployment prerequisites.
- Existing `docs/` contains implementation, QA, rollback, and pre-deployment reports through the current feature work.
- `production/phase-02a/` contains a conceptual storyboard, export specification, Blender proof script, and report.

This audit adds the requested `docs/DEVELOPMENT_RULES.md` as the expanded working document. It does not replace or delete the root rules.

## 8. Risks and unresolved decisions

1. The working tree is dirty on the active feature branch. Phase 01 must establish whether the current changes are approved, complete, and safe to build on.
2. The repository already contains substantial implementation beyond the requested Phase 00 boundary. A future phase plan must avoid reimplementing existing routes and handlers.
3. Approved Stitch references and the MØBEL reference are absent, so visual comparison is incomplete.
4. Client-logo and project-publication permissions are not confirmed.
5. Blender, ffmpeg, and ImageMagick were not found locally; the current animation cannot be re-rendered from source in this environment.
6. The shipped frame sequence is present, but the older Phase 02A report says no frame sequence existed at its earlier checkpoint. That report is historical and must not be treated as the current asset inventory.
7. Typography differs from the requested Playfair/Manrope/Inter specification and needs explicit approval before alignment.
8. Enquiry delivery is fail-closed until Resend, Upstash, site-origin, sender, recipient, and trusted proxy configuration is provided. No production credentials are present or requested in this phase.
9. There is no automated browser/device matrix or visual regression suite.
10. Node emits a module-type warning during the Node test runner because the package does not declare a module type; changing that is outside this audit and requires compatibility review.

## 9. Phase 00 outcome

Repository inspection, asset audit, architecture proposal, animation plan, development rules, and roadmap are documented. No homepage, UI component, animation library, 3D asset, business placeholder, deployment, commit, or push was performed as part of Phase 00.
