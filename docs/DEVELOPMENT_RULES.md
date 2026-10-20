# AR Interior Group — Development Rules

**Status:** Phase 00 baseline. These rules extend the existing root `DEVELOPMENT_RULES.md`; they do not override it.
**Primary content source:** `reference/AR INTERIOR GROUP WORK PROFILE.pdf` and source-mapped manifests.

## 1. Source authority and business integrity

1. The supplied company profile is the primary source for company facts, service descriptions, client references, project names, locations, mission, vision, values, and CQET wording.
2. Never invent project areas, dates, costs, awards, certifications, testimonials, outcomes, delivery metrics, or technical measurements.
3. If the source does not support a claim, omit it or label it as an unverified item requiring approval.
4. Keep project names and locations tied to typed data. Do not duplicate factual copy in route components.
5. A micro-market or kiosk reference must not be described as a complete hospital, office, or facility interior unless the source explicitly supports that scope.
6. Authentic portfolio photographs and conceptual renders must remain visibly and semantically separate.
7. Preserve internal source provenance and permission status in manifests, but do not expose developer-only page numbers or extraction metadata in visitor-facing copy.
8. Do not publish client marks, project photographs, or identifiable media until the required publication permissions are confirmed.
9. Treat before/after language literally. If views are not aligned or the source does not establish a transformation, do not imply a measured before/after result.

## 2. Code quality and architecture

1. Use TypeScript in strict mode. Avoid `any`; define narrow types for content, asset manifests, API payloads, and component props.
2. Keep the App Router server-first. Add a client component only for browser interaction, Canvas drawing, form state, observers, or media preferences that require it.
3. Keep UI, content/data, validation, integration code, and presentation styles in separate modules.
4. Prefer small, reusable components with one clear responsibility. Shared header, footer, page shell, metadata, gallery, selector, form, and animation primitives must not be duplicated per page.
5. Use descriptive names for routes, components, data fields, CSS tokens, and state transitions. Do not encode business meaning in unexplained numeric constants.
6. Keep authoritative project/service/client data centralized and typed. A route may compose data but must not silently redefine it.
7. Preserve existing configuration and working behavior unless a change is necessary and documented.
8. Keep dependencies minimal. Do not add GSAP, Three.js, a CMS, or another animation dependency without a specific approved requirement and a documented trade-off. Browser-side live Three.js rendering is prohibited.
9. Handle missing data, missing media, invalid routes, failed network calls, and provider errors explicitly. Do not render broken links or pretend that an unavailable asset exists.
10. Keep public code portable and reproducible. Do not rely on local machine paths, private memory, untracked credentials, or manual editor state.

## 3. Design system and UI/UX

1. Preserve the approved identity: charcoal `#1C1C1C`, champagne gold `#C49A52`, warm ivory `#F7F5F0`.
2. The target type system is Playfair Display for headings, Manrope for body copy, and Inter for UI labels. Confirm the supplied font files or approved self-hosted alternatives before changing the current local Poppins/system stack.
3. Use shared design tokens for colors, typography, spacing, radii, borders, shadows, transitions, and motion distances.
4. Use natural browser scrolling for every content page. Do not add scroll snapping, scroll locking, slide-based page structure, or arbitrary viewport-height sections.
5. Preserve the information sequence and substantive content when refactoring. Animation may enhance content but must never be required to reveal it.
6. Build responsive layouts for mobile, tablet, and desktop with content-driven heights, stable image aspect ratios, and consistent gutters.
7. Provide visible keyboard focus, semantic controls, accessible names, usable contrast, skip navigation, and clear hover/focus/active states.
8. Interactive preview selectors must use shared preview-selection behavior: hover/focus previews temporarily, mouse leave restores the selected item, click or touch selects permanently, and Enter/Space selects buttons.
9. Keep motion restrained and purposeful. Honor `prefers-reduced-motion` and data-saver choices with a complete static experience.
10. Provide loading, empty, unavailable-media, validation, service-unavailable, and not-found states. Never show a fake enquiry success message.

## 4. Security and privacy

1. Keep API keys, provider tokens, credentials, and private source documents out of client bundles, logs, Git, and public assets.
2. Read secrets only on the server through environment variables or a hosting secret manager. `.env.example` may contain placeholders only.
3. Validate and normalize enquiry input on the server. Reject unexpected fields, oversized bodies, malformed JSON, invalid origins, invalid email addresses, and honeypot submissions.
4. Use an explicit server endpoint or approved server action for enquiry delivery. Do not send email directly from browser code.
5. Apply rate limiting, idempotency protection, and a trusted proxy/IP strategy before provider calls. Never trust a client-controlled forwarding header without a trusted edge configuration.
6. Escape user content in generated email HTML and return controlled error responses without provider details or secrets.
7. Report success only after the provider accepts the message. Provider acceptance is not a guarantee of inbox delivery; communicate that boundary accurately.
8. Do not persist enquiry content unless a separately approved data-retention design exists. Add and review a privacy notice before production launch.

## 5. Performance and media

1. Use `next/image` or an equivalent controlled image pipeline for editorial photographs and responsive sizes. Keep intrinsic dimensions and meaningful alt text in manifests.
2. Use local, optimized WebP or AVIF assets where appropriate. Keep desktop and mobile cinematic sequences separate; do not ship the full sequence on first paint.
3. Load the cinematic poster first, then progressively load a bounded neighborhood around the scroll-selected frame. Bound concurrency and in-memory cache size; release listeners, images, and observers on unmount.
4. A missing frame must fall back to the nearest loaded frame or poster without blanking the hero. A failed image must not prevent surrounding content from becoming visible.
5. Keep critical rendering and above-the-fold content light. Avoid unnecessary client JavaScript, long synchronous work, layout shifts, and unbounded image preloading.
6. Measure Core Web Vitals and real-device behavior before launch. Check desktop, mobile, slow network, data saver, reduced motion, rapid scroll, reverse scroll, direct navigation, and restoration.
7. Do not introduce a live browser 3D renderer. Blender rendering is an offline production task; the browser receives prerendered images.

## 6. Testing and review

1. Run the smallest meaningful checks for every change and report the exact command and result.
2. The baseline checks are `npm run lint`, `npm run typecheck`, `npm run build`, and `npm run test:enquiries`.
3. Add tests for business-data invariants, asset-manifest paths, frame mapping, reduced motion, preview selection, validation boundaries, rate limiting, idempotency, and security failure modes.
4. Manually verify keyboard navigation, focus visibility, screen-reader semantics, natural scroll, touch controls, reduced motion, error states, and mobile layout.
5. Do not claim a browser, device, provider, or deployment check passed if it was not actually run.
6. Record known gaps, warnings, and permission blockers in the relevant phase document.

## 7. Workflow and scope control

1. Inspect the current tree, Git status, route structure, manifests, and existing documentation before modifying files.
2. Work only on the approved phase. Stop at each checkpoint and wait for authorization before starting the next phase.
3. Preserve unrelated user changes. Do not reset, clean, overwrite, or reformat files outside the approved scope.
4. Prefer focused changes over rewrites. Keep architecture decisions and migration risks documented.
5. Do not install packages, generate 3D assets, change visual identity, deploy, commit, or push without explicit authorization.
6. Use the repository's existing scripts and conventions. Keep phase reports factual, dated, and tied to actual files and checks.
7. Before release, obtain approval for client logos, photographs, fonts, brand usage, domain, privacy wording, email provider, rate limits, and production environment configuration.
