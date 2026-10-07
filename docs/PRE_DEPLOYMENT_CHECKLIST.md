# AR Interior Group — Pre-Deployment Checklist

Do not deploy until the **Required before deployment** items have been completed and the final production-origin build has passed. No production domain is assumed in this document.

## Environment variables

Copy `.env.example` to the appropriate private environment store. Replace every placeholder; never commit real credentials. Do not prefix server credentials with `NEXT_PUBLIC_`.

| Variable | Required status | Scope / when read | Purpose |
|---|---|---|---|
| `SITE_URL` | Required before production build and runtime | Public origin; build-time metadata and runtime routes/API | Exact approved HTTPS origin (scheme + host, no path). Drives canonical URLs, Open Graph URLs, sitemap, robots sitemap link, and enquiry `Origin` validation. |
| `RESEND_API_KEY` | Required to enable online enquiries | Server-only runtime secret | Resend API authentication. |
| `ENQUIRY_FROM_EMAIL` | Required to enable online enquiries | Server-only runtime setting | Sender address verified with the configured Resend account. |
| `ENQUIRY_TO_EMAIL` | Required to enable online enquiries | Server-only runtime setting | Approved company enquiry recipient. |
| `UPSTASH_REDIS_REST_URL` | Required to enable online enquiries | Server-only runtime setting | Upstash REST endpoint used for rate limiting and idempotency. |
| `UPSTASH_REDIS_REST_TOKEN` | Required to enable online enquiries | Server-only runtime secret | Upstash REST authentication. |
| `ENQUIRY_TRUSTED_IP_HEADER` | Required to enable online enquiries | Server-side deployment policy | Exactly `x-real-ip` or `cf-connecting-ip`; select only the header the trusted edge overwrites with one client IP. |

No application-specific optional, `NEXT_PUBLIC_*`, analytics, or tracking variables were found. For local work, `SITE_URL` may be omitted; the site then omits canonical/absolute social metadata, the sitemap is empty, and the enquiry API fails closed. The `.env.example` values are examples, not production configuration.

## Required before deployment

- [ ] Approve the final production domain and serve it only over HTTPS.
- [ ] Set the exact `SITE_URL` to that origin in both the production build environment and runtime environment; rebuild after changing it.
- [ ] Configure the production email provider and verify the sender domain/address. Set `RESEND_API_KEY`, `ENQUIRY_FROM_EMAIL`, and `ENQUIRY_TO_EMAIL` in a server-only secret store.
- [ ] Configure Upstash REST credentials for both rate limits and idempotency. Confirm the production service can reach it.
- [ ] Configure the trusted proxy so it strips client-supplied copies and overwrites the selected IP header with one valid client address. Prevent direct-origin access that bypasses the trusted edge. Set `ENQUIRY_TRUSTED_IP_HEADER` accordingly.
- [ ] **REQUIRED HUMAN APPROVAL:** obtain explicit approval to publish the client logos. The internal manifest intentionally remains `unconfirmed`; this status is not displayed to visitors.
- [ ] Complete a visual/touch check at 360, 390, 768, 1024, 1440, and 1920 CSS pixels, including menu close/scroll recovery and preview selection.
- [ ] Complete a real form submission in a production-like environment using test recipient/provider accounts; verify accepted, validation, throttling, duplicate, provider-failure, and unavailable-provider behavior without using real customer data.
- [ ] Verify DNS, TLS certificate, host forwarding, selected client-IP header, and the exact browser `Origin` against `SITE_URL`.
- [ ] Inspect final metadata and image delivery from the production-origin build. The Open Graph image is the existing conceptual poster, explicitly labeled as a visualization—not a completed client project.
- [ ] Re-run lint, typecheck, all tests, production build, and diff check after final environment/configuration changes.

## Security and failure behavior

- The API requires an exact `Origin` match with `SITE_URL`; absent or mismatched origin is rejected. It does not trust forwarded host/protocol values to establish the site origin.
- The client IP comes only from the configured trusted header and must parse as a single IP address. If the edge strips it, sends a list, or is misconfigured, the request fails with a safe 503. Never switch to an untrusted pass-through header to make requests succeed.
- Missing or partial Resend/Upstash/origin/proxy configuration disables online enquiries (503); abuse controls are not silently bypassed. Redis protection failures fail closed. Provider errors return a safe message and do not expose provider tokens or stack traces.
- Rate limiting and idempotency remain server-side. The request body is bounded, fields validated, honeypot checked, and same-key duplicate submissions are reserved to prevent duplicate sends.
- Baseline response headers are configured: `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `X-Frame-Options: DENY`, and a restrictive `Permissions-Policy` for camera, microphone, and geolocation. No CSP was introduced.
- No analytics or non-essential tracking is installed; no cookie banner or PWA was added.

## SEO, robots, and branding

- `SITE_URL` is the sole canonical-origin source. It is used for canonical tags and Open Graph URLs, and dynamically for absolute sitemap/robots URLs and enquiry-origin validation.
- The sitemap contains the six main pages, all service details, and all project details (currently 36 public URLs); it excludes the API. `/robots.txt` allows public routes, disallows `/api/`, and points to the sitemap when the origin is configured.
- The existing conceptual desktop poster at `/cinematic/poster-desktop.webp` is used for Open Graph previews with descriptive conceptual-image alt text. Local project/brand imagery remains on the local Next image optimizer; no external image host is required.
- The default Next.js triangle favicon was removed. The app icon references the existing AR Interior Group brand image. No separate PWA manifest or Apple home-screen icon exists or is required in this scope.

## Already verified in the local QA pass

- [x] Lint and TypeScript checks pass.
- [x] Enquiry tests and the complete Node test set pass.
- [x] Production build generates all public main, service-detail, and project-detail routes.
- [x] Local image-path audit found no missing or case-mismatched references.
- [x] Branded 404 and main browser routes were smoke-tested.
- [x] `/robots.txt` returns 200 and permits public pages.
- [x] Contact page fails closed with a useful direct-contact fallback when providers are not configured.
- [x] Home service preview and all five documented Before/After pairs were browser-tested at the available desktop viewport.

The current workstation has no `.env.local` and no approved production `SITE_URL`; its local sitemap is therefore empty by design. An exact mobile viewport matrix and a real provider-backed form submission remain outstanding.

## Post-deployment smoke test

After DNS/TLS and production configuration are live, verify:

- [ ] `/`
- [ ] `/about`
- [ ] `/services`
- [ ] `/clients`
- [ ] `/projects`
- [ ] `/contact`
- [ ] `/contact#enquiry-form`
- [ ] One valid `/services/[slug]` page
- [ ] One valid `/projects/[slug]` page
- [ ] An invalid URL renders the branded not-found page
- [ ] Submit one controlled real enquiry and verify delivery, safe confirmation, and no duplicate on retry
- [ ] Images load and optimize; header/footer and mobile menu work at narrow and desktop widths
- [ ] Service/project preview selectors and Before/After work by touch and keyboard as well as pointer
- [ ] `/sitemap.xml` contains 36 absolute URLs on the approved domain, with no API/test/temp routes
- [ ] `/robots.txt` allows the site, disallows the intended API path, and references the absolute sitemap URL
- [ ] Canonical and Open Graph URLs use the approved HTTPS origin; the social image loads and is identified as conceptual
- [ ] Security headers are present on HTML/API responses; malformed origin and unavailable protection fail safely

## QA results for this readiness pass

- `npm.cmd run lint` — passed.
- `npm.cmd run typecheck` — passed.
- `npm.cmd run test:enquiries` — passed, 26 tests.
- `node --test tests/*.test.mjs` — passed, 36 tests.
- `npm.cmd run build` — passed; all 10 service-detail and 20 project-detail pages were generated.
- `git diff --check` — passed; only pre-existing LF/CRLF warnings were emitted.
- A production-server smoke check using the reserved `www.example.com` placeholder (not a real domain) returned 200 for home, robots, sitemap, brand icon, and optimized image; canonical and Open Graph URLs were absolute, the sitemap contained exactly 36 same-origin public URLs, and the expected security headers were present.
- A synthetic local API POST returned 503 with a generic safe response while provider credentials were absent, confirming fail-closed behavior.
- `npm ls --depth=0` — passed; runtime dependencies are Next/React, with lint/type/CSS toolchain in dev dependencies. The lockfile contains standard optional per-platform Next/Tailwind native packages; no extra animation/browser framework is installed.
- `npm audit --omit=dev` could not reach the npm advisory endpoint in this environment. No dependency changes were made; obtain a current advisory scan in a network-enabled release environment.

The real production origin and provider settings are still unset. The final local build was rerun without `SITE_URL`, so it does not bake in the smoke-test placeholder; it consequently has no production canonical/social URLs and its sitemap is empty. Build again with the approved `SITE_URL` after production configuration is finalized.
