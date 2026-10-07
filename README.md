# AR Interior Group

The AR Interior Group portfolio site is a Next.js App Router project for a premium architectural interiors practice.

## App architecture

- Next.js 16 App Router with TypeScript and Tailwind CSS v4.
- Shared navigation and footer live in `src/components/` and are composed by the root layout.
- Route-level pages live in `src/app/` for `/`, `/about`, `/services`, `/projects`, `/clients`, and `/contact`.
- Reusable editorial primitives include `ContentPage`, `PageIntro`, and the canvas-based `CinematicPlaceholder`.
- The visual system is defined in `src/app/globals.css`: charcoal `#1C1C1C`, champagne gold `#C49A52`, and ivory `#F7F5F0`.
- Typography uses a local system sans stack for dependable builds and a serif display stack for editorial headings. No remote font request is required.

## Supplied media and content rules

`src/data/project-image-manifest.json` is the source of truth for the portfolio photographs and their source pages. The Projects page groups those photos by manifest project and displays the 14 unique conceptual design renders in a separate collection. Publication permission and any person/image consent noted in the kit should be confirmed before public release.

The homepage sequence uses the supplied prerendered 2.5D concept reveal: 96 desktop frames, 60 mobile frames, and matching static posters. It is labeled as conceptual visualization, not a construction record or completed client project. The player selects frames with scroll progress, loads nearby frames progressively, keeps a bounded cache, and uses the poster for reduced motion or data saver.

Keep conceptual renders visually separate from authentic portfolio photography. Do not infer awards, project outcomes, metrics, or verified before/after comparisons from the images. The sequence is not a physically modeled Blender animation.

## Local development

```bash
npm run dev
```

Useful checks before review:

```bash
npm run lint
npm run typecheck
npm run build
npm run test:enquiries
```

## Project structure

```text
src/app/                 App Router pages, metadata, sitemap/robots, enquiry API
src/components/          Shared navigation, page, project, cinematic and form UI
src/data/                Verified company profile and project-image manifest
src/lib/                  Enquiry, cinematic, metadata, origin and filtering helpers
public/brand/             Supplied logo assets
public/projects/          Portfolio photographs and generated thumbnails
public/concept-designs/   Concept renders, separate from portfolio photography
public/cinematic/         Desktop/mobile frame sequences and poster fallbacks
production/phase-02a/     Reproducible storyboard, Blender proof script and export notes
tests/                    Mocked enquiry and data/utility regression tests
docs/                     Phase QA and implementation reports
```

The company work-profile PDF under `reference/` is intentionally excluded from Git. Keep secrets and private source documents out of commits.

## Website enquiries

`POST /api/enquiries` validates submissions on the server, applies a distributed Upstash Redis rate limit and idempotency check, then sends a notification through Resend. No enquiry database is used. The browser reports success only when Resend accepts the send request; that is not confirmation that the message reached an inbox.

The runtime reads `SITE_URL`, `RESEND_API_KEY`, `ENQUIRY_FROM_EMAIL`, `ENQUIRY_TO_EMAIL`, `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`, and `ENQUIRY_TRUSTED_IP_HEADER`. `.env.example` contains non-secret placeholders only. Environment files other than that example are ignored by Git.

The API intentionally returns a controlled `503` when its email, Redis, site-origin, or trusted client-IP configuration is missing. It does not fall back to a simulated success or a browser-side mail draft. Direct email and telephone links remain available on the Contact page.

### Configure delivery

1. Create a Resend account and an API key limited to the permissions needed to send email.
2. Add a domain you control in Resend and complete its requested DNS verification. Do not use the customer's address as the sender.
3. Set `ENQUIRY_FROM_EMAIL` to an address on that verified sending domain. The example sender is a placeholder, not an approved or verified address.
4. Set `ENQUIRY_TO_EMAIL` to the authorized notification inbox; the supplied company profile lists `facilities@arinteriorgroup.com`.
5. Create an Upstash Redis database and set its REST URL and token. The endpoint uses a five-request, fifteen-minute per-IP window and 24-hour idempotency reservations.
6. Copy `.env.example` to `.env.local` for local development. Set `SITE_URL` to the exact site origin (for example, `http://localhost:3000` locally and your actual HTTPS origin in production); do not add a path.
7. Set `ENQUIRY_TRUSTED_IP_HEADER` to a supported header that your production edge proxy overwrites with the visitor's actual IP. The application accepts one canonical IP from `x-real-ip` or `cf-connecting-ip`, validates it, and hashes it before using it in Redis. Never expose the app directly to untrusted traffic while treating a client-controlled header as authoritative. If the hosting platform cannot guarantee this behavior, configure a trusted proxy or do not enable enquiry sending.
8. Restart the app after changing environment variables. Submit a genuine test only after confirming the sender domain, recipient authorization, privacy notice, and rate-limit/proxy behavior. Check the Resend event log for provider acceptance and downstream delivery/bounce events.

Local automated tests use mocked email and rate-limit adapters; they never contact Resend or Upstash. To diagnose a failed enquiry, check the server's event-only `[enquiry]` logs, Resend's dashboard, Upstash availability/configuration, `SITE_URL`/Origin match, and the trusted IP header. Logs intentionally omit customer messages, phone numbers, email addresses, tokens, and provider error bodies. Do not paste secrets into issue reports.

The contact form sends the submitted fields to the configured email provider for response handling; this site does not persist submissions. The configured email and infrastructure providers may process the data under their own terms. This implementation is not a legal compliance assessment; publish an appropriately reviewed privacy notice before production use.

## Deployment prerequisites

- Choose a hosting provider and configure the approved production HTTPS domain and exact `SITE_URL` origin.
- Add the production environment variables in the hosting secret manager; never commit credentials. Verify the Resend sender domain and authorized recipient.
- Configure Upstash Redis and confirm the hosting edge overwrites the selected trusted-IP header. Verify limits and idempotency in a non-production environment.
- Confirm permission to publish all client names, portfolio photographs, supplied brand assets, and cinematic assets. The source work-profile PDF is not part of the public site or Git.
- Verify generated sitemap/canonical URLs after setting `SITE_URL`; confirm `robots.txt`, HTTPS redirects, and the production enquiry flow.
- Complete device-width, keyboard/screen-reader, accessibility, and production enquiry tests before launch. No deployment is performed by the repository checks.
