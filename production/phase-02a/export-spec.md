# Phase 02A — Export specification

These are future production specifications. The full production sequence is intentionally not exported in Phase 02A.

## Frame sequence

| Variant | Canvas | Format | Target range | Naming |
| --- | ---: | --- | ---: | --- |
| Desktop | 1600 × 900 | WebP, quality 82–88 | 180–240 frames | `desktop/frame-0001.webp` |
| Mobile | 900 × 1600 | WebP, quality 82–88 | 180–240 frames | `mobile/frame-0001.webp` |
| Poster | 1600 × 900 and 900 × 1600 | WebP or AVIF | 1 per variant | `poster-desktop.webp`, `poster-mobile.webp` |

The Phase 02A generator uses a smaller representative set and low-resolution canvases only. It is a proof-of-pipeline tool, not the production exporter.

## Manifest

Each sequence should ship with a JSON manifest similar to:

```json
{
  "sequence": "commercial-interior-transformation",
  "variant": "desktop",
  "frameCount": 216,
  "width": 1600,
  "height": 900,
  "format": "webp",
  "quality": 86,
  "files": [
    { "frame": 1, "file": "desktop/frame-0001.webp" }
  ]
}
```

## Delivery and loading plan

1. Keep desktop and mobile sequences in separate directories with identical frame numbers.
2. Load the poster first, then preload a small first window around the current scroll position.
3. Decode frames progressively and keep a bounded in-memory cache; do not request the entire sequence on first paint.
4. Respect `prefers-reduced-motion` by holding the poster or offering a short crossfade.
5. Validate frame dimensions, file ordering, color profile, and alpha behavior before website integration.
6. Integrate through the existing placeholder only after Phase 02B approval; do not introduce browser-side Three.js.
