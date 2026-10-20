# AR Interior Group — Project Architecture Proposal

**Status:** Phase 00 proposal for the existing Next.js 16.3.8 App Router repository.
**Constraint:** This document proposes boundaries and next steps; it does not create implementation folders or rewrite existing code.

## 1. Architectural goals

- Deliver a premium architectural portfolio while keeping business claims source-backed.
- Use server-rendered content by default and isolate browser-only behavior.
- Keep the page sequence natural and content-driven; the cinematic section is an enhancement, not the only way to access content.
- Keep authentic project media, conceptual visualization, client marks, and source provenance distinct.
- Make the application portable across a local Node runtime, CI, and the eventual hosting platform.
- Keep the enquiry path secure, observable without logging private content, and fail-closed when infrastructure is not configured.

## 2. Existing structure to preserve

The repository already has the following useful boundaries:

```text
src/
├── app/                 routes, layouts, metadata, sitemap/robots, API route
├── components/          shared and page-level React UI
├── data/                typed profile, project, service, client, office, and image manifests
├── lib/                 domain helpers, validation, enquiry adapters, metadata, motion utilities
└── styles/              shared theme, reveal, footer, and route-support CSS
public/
├── brand/               supplied AR Interior Group brand media
├── client-logos/        source-mapped client logo WebPs
├── projects/            authentic project photographs and thumbnails
├── service-profile/     source-backed service context images
├── concept-designs/     conceptual design renders
└── cinematic/           desktop/mobile prerendered frame sequences and posters
```

Do not create parallel `pages/`, `models/`, `cms/`, or duplicate content trees. Extend the existing structure only when a new boundary is justified.

## 3. Route map

| Route | Responsibility | Rendering/data direction |
| --- | --- | --- |
| `/` | Cinematic introduction plus approved portfolio sections | Server composition with a narrowly scoped client Canvas enhancement |
| `/about` | Company story, mission, capabilities, process, principles, selected work | Server-rendered typed content and local media |
| `/services` | Seven documented overview categories and related references | Server-rendered data-driven index with client preview selector where needed |
| `/services/[slug]` | Reusable service detail template | `generateStaticParams`, typed service lookup, source-backed related work |
| `/projects` | Filterable project directory and conceptual gallery separation | Server-rendered cards with client filtering/selection only where necessary |
| `/projects/[slug]` | Reusable project detail template, gallery, documented comparisons | `generateStaticParams`, `notFound`, typed project lookup |
| `/clients` | Client/logo presentation with permission-aware internal manifest | Server-rendered marks; motion must have static/reduced-motion alternative |
| `/contact` | Contact information and enquiry form | Server-rendered contact copy, client form state, server API submission |
| `/api/enquiries` | Validate, rate-limit, reserve idempotency key, send notification | Node runtime; server-only providers and secrets |
| `/sitemap.xml`, `/robots.txt` | Crawl policy and canonical URL support | Generated from the route/data model and approved site origin |

## 4. Shared layout and component boundaries

### Root layout

`src/app/layout.tsx` should remain the single composition point for:

- metadata defaults and Open Graph defaults;
- the skip link and document language;
- `SiteHeader` and `SiteFooter`;
- global enquiry-anchor focus behavior;
- global reveal initialization that does not hide content when JavaScript fails;
- global theme and font variables.

### Shared presentation primitives

- `ContentPage`: page shell, intro, optional hero media, breadcrumb/context, and content slot.
- `PageIntro`: consistent eyebrow, heading, description, and context links.
- `SiteBrand`, `SiteHeader`, `SiteFooter`: navigation, logo, contact links, and accessible focus behavior.
- `EditorialContactCta`: reusable close for pages that invite a brief.
- `ProjectGallery`, `BeforeAfter`, and project card components: presentation only; source records remain in data modules.
- `PreviewImagePreloader` and shared preview-selection hook: keep temporary preview and permanent selection semantics consistent.
- `ScrollReveal`/observer utilities: optional enhancement; content must remain visible without them.

### Client-only boundaries

Client components should be limited to:

- Canvas frame selection and image loading;
- touch/hover/keyboard preview selection;
- enquiry field state, submission state, and inline validation display;
- intersection/scroll observers and non-essential reveal state;
- copy-to-clipboard or other direct browser affordances.

They must not own authoritative business data or secrets.

## 5. Design system

Keep tokens in the existing theme layer and map them into Tailwind v4 where useful:

- colors: charcoal `#1C1C1C`, champagne gold `#C49A52`, warm ivory `#F7F5F0`, plus accessible muted/error variants;
- typography: approved Playfair Display / Manrope / Inter direction, pending font asset approval against the current Poppins/system implementation;
- spacing: shared page gutters, content widths, section rhythm, and header offset;
- media: intrinsic dimensions, stable aspect-ratio wrappers, rounded/square mask variants;
- motion: restrained easing, named durations/delays, reduced-motion overrides, and no scroll lock.

Visual changes should be implemented through tokens and shared primitives rather than per-page magic values.

## 6. Data and asset management

`src/data/company-profile.ts` is the current typed domain source for services, projects, client names, contact details, company statements, and CQET principles. Related manifests provide the physical asset mapping and provenance.

Recommended rules:

1. Keep facts in typed data modules, not JSX strings repeated across routes.
2. Keep `public/` paths relative and validate them in tests.
3. Retain source page/permission metadata internally while filtering it from visitor-facing copy.
4. Represent absent imagery as an explicit optional field and provide a designed text/empty state.
5. Keep conceptual assets in their own collection and never use them as a project photograph.
6. Add content changes only from an approved source update; record the source and review date.

## 7. Cinematic animation boundary

The browser receives prerendered desktop and mobile images. `CinematicPlaceholder` is the integration boundary and should own only:

- mode selection from viewport width;
- reduced-motion/data-saver static decision;
- poster-first rendering;
- scroll-to-progress and progress-to-frame calculation;
- bounded neighborhood loading/cache;
- Canvas drawing and nearest-loaded-frame fallback;
- skip-animation action and disclosure copy.

Blender scene creation, offline rendering, frame validation, and encoding belong under `production/`, not in the runtime bundle. No live Three.js renderer is allowed.

## 8. Enquiry integration

The form posts to `/api/enquiries`. The server handler owns schema validation, body size limits, origin checks, honeypot handling, rate limiting, idempotency, provider delivery, and controlled error responses. Resend and Upstash remain adapters behind `src/lib/enquiries/`; no provider SDK or credential may be imported by a client component.

The API does not persist submissions. A production privacy notice, sender-domain verification, trusted proxy/IP configuration, and provider monitoring are release prerequisites.

## 9. SEO, errors, and loading

- Use route-level `generateMetadata` from typed page data and a safe site origin.
- Keep canonical URLs, Open Graph image dimensions, `robots.txt`, and `sitemap.xml` consistent with deployment configuration.
- Use `notFound()` for unknown project/service slugs and provide a branded not-found route.
- Add loading states only where a route or client interaction can genuinely wait; never hide static content while reveal code initializes.
- Use controlled fallback copy for missing project imagery, unavailable enquiry delivery, and failed asset requests.

## 10. Testing strategy

### Automated

- Node tests for validation, security boundaries, idempotency, rate limits, content invariants, manifest paths, frame mapping, reduced motion, and preview selection.
- TypeScript and ESLint on every change.
- Production build before each checkpoint.
- Optional future visual/smoke tests for every route once a browser test tool is approved.

### Manual

- Desktop and mobile viewport review at representative widths.
- Keyboard-only navigation, focus visibility, skip link, form errors, and screen-reader labels.
- Rapid/reverse scroll, direct hash navigation, restoration, poster fallback, frame failure, reduced motion, and data saver.
- Real-device touch selection for service/project previews.
- Production-like enquiry configuration in a non-production environment; never use live credentials in automated tests.

## 11. Open architecture decisions

1. Approve the Stitch desktop/mobile reference package and the exact MØBEL benchmark.
2. Approve whether to migrate current Poppins/system typography to Playfair/Manrope/Inter.
3. Confirm the hosting platform, Node version policy, site origin, trusted proxy behavior, and provider observability.
4. Confirm publication rights for client logos, photographs, and brand assets.
5. Decide whether a browser smoke/visual test tool is required before launch.
