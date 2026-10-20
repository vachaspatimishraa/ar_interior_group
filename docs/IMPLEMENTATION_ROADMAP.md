# AR Interior Group — Implementation Roadmap

**Status:** Proposed after Phase 00. No later phase is authorized by this document.
**Principle:** Build on the current feature branch and existing routes; do not restart from a starter template.

## Phase 00 — Audit, architecture, and rules

**Status: complete for this checkpoint.**

- Inspect current repository, Git state, configuration, scripts, routes, source data, and media.
- Record missing Stitch/MØBEL references, Blender availability, permission gaps, and current implementation risks.
- Add `docs/PHASE_00_AUDIT.md`, `docs/PROJECT_ARCHITECTURE.md`, `docs/DEVELOPMENT_RULES.md`, this roadmap, and `docs/ANIMATION_STORYBOARD.md`.
- Run non-destructive lint, typecheck, build, and existing Node tests.
- Stop and wait for authorization.

## Phase 01 — Foundation and visual contract

**Entry gate:** user approves Phase 00 documents, supplies/approves Stitch references, and resolves the typography decision.

- Reconcile the dirty `feature/single-page-redesign` tree before editing overlapping files.
- Compare current routes against the approved desktop/mobile Stitch direction.
- Confirm the color, typography, grid, spacing, image treatment, header/footer, focus, and responsive tokens.
- Decide whether local font files need to be added or the current stack is approved as an intentional adaptation.
- Confirm content-source and publication-permission workflow with the profile owner.
- Add/adjust only shared foundation code required by the approved visual contract.

**Exit evidence:** approved reference checklist, cleanly scoped diff, updated screenshots/notes, and all baseline checks passing.

## Phase 02 — Cinematic proof and asset pipeline

**Entry gate:** storyboard and technical requirements approved; Blender/rendering environment or an approved external render pipeline available.

- Review the existing 96 desktop/60 mobile supplied sequence and decide whether it is the approved production asset or a proof.
- If rendering is required, run the low-resolution Blender proof first; do not invent a `.blend` or claim a render without executing it.
- Validate stage continuity, camera composition, frame naming, dimensions, WebP/AVIF quality, posters, and manifest data.
- Test poster-first behavior, progressive loading, bounded cache, nearest-frame fallback, reduced motion, data saver, skip animation, and mobile mode.
- Keep the conceptual disclosure prominent: this is a visualization, not a client project or construction record.

**Exit evidence:** approved proof frames or approved existing sequence, manifest validation, device review, and performance notes.

## Phase 03 — Shared site shell and page foundation

**Entry gate:** Phase 01 complete.

- Stabilize root layout, header, footer, navigation, skip link, page intro, metadata, not-found, loading, and error states.
- Verify natural scroll and direct navigation/restoration behavior.
- Ensure content remains available with JavaScript disabled or reveal observers unavailable.
- Keep the design tokens centralized and remove only demonstrably obsolete starter styles.

**Exit evidence:** route smoke review for Home, About, Services, Projects, Clients, and Contact; keyboard and responsive checks.

## Phase 04 — Homepage composition

**Entry gate:** shell and cinematic proof approved.

- Integrate the approved cinematic experience without changing it into a slide deck or locked scroll scene.
- Keep the existing source-backed portfolio sequence and approved Stitch section order.
- Verify project/service/CQET/client selectors against the shared preview behavior.
- Verify image loading is independent from reveal animation and that conceptual assets never masquerade as project work.

**Exit evidence:** desktop/mobile review, reduced-motion review, rapid/reverse scroll check, and homepage data/asset tests.

## Phase 05 — Services and projects

**Entry gate:** authoritative profile and asset permissions confirmed for content being exposed.

- Refine the services index and reusable service detail template.
- Refine the projects gallery, filters, before/after presentation, and project detail template.
- Keep short references text-only when photographs or scope are not documented.
- Maintain the micro-market/kiosk scope boundary and explicit non-aligned comparison language.

**Exit evidence:** all static params resolve, missing slugs use not-found, local media paths validate, and source-copy review is signed off.

## Phase 06 — About, clients, and contact

**Entry gate:** content owner approves the source-backed copy and publication permissions.

- Refine About story, capabilities, process, principles, and selected work.
- Publish client marks only after permission status changes from unconfirmed to approved; otherwise retain an appropriate internal/release block.
- Verify Contact details, form validation, unavailable-service state, privacy wording, and direct phone/email alternatives.
- Test API behavior with mocked providers and a non-production configured environment.

**Exit evidence:** accessibility review, no fake success state, security tests, provider configuration checklist, and permission record.

## Phase 07 — QA, performance, and hardening

- Run lint, typecheck, build, Node tests, route smoke tests, and asset-manifest checks.
- Test natural scrolling, rapid/reverse scroll, direct navigation/hash restoration, touch, keyboard, reduced motion, data saver, slow network, and failed frames/images.
- Check Core Web Vitals and image payloads on representative desktop/mobile devices.
- Review security headers, origin checks, rate limits, idempotency, trusted proxy assumptions, logs, and secret handling.
- Add a browser/visual test layer only if approved and supported by the project environment.

**Exit evidence:** dated QA report with actual results and a list of remaining accepted risks.

## Phase 08 — Launch readiness

- Confirm production domain, `SITE_URL`, canonical URLs, sitemap, robots policy, HTTPS, redirects, and metadata.
- Verify Resend sender domain, authorized recipient, Upstash database, trusted IP header, rate limit, and monitoring.
- Confirm all logo/photo/brand permissions and publish the reviewed privacy notice.
- Perform a production-like enquiry test and verify provider event logs without exposing customer data.
- Review rollback plan, hosting secrets, Node version, caching/CDN behavior, and deployment approval.

**Exit evidence:** explicit user approval to deploy. Deployment remains outside Phase 00.

## Cross-phase stop conditions

Pause work and ask for a decision if:

- a requested visual reference conflicts with the approved Stitch direction;
- business content is unsupported by the profile or permission is unclear;
- a source asset is missing or a generated replacement would be required;
- animation degrades content access, natural scrolling, or reduced-motion behavior;
- an API provider, secret, trusted proxy, or privacy requirement is missing;
- the current dirty working tree overlaps the proposed change;
- a check fails and the fix would require unrelated application rewrites.

## Recommended Phase 01 scope

After approval, Phase 01 should be limited to visual-contract reconciliation and repository hygiene: review the current feature-branch diff, compare the existing implemented shell with supplied Stitch desktop/mobile references, decide typography, confirm asset permissions, and document the approved foundation. It should not add new business content, generate 3D assets, or start a new homepage implementation.
