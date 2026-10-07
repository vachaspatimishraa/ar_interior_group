<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Continuous Page Layout and Scroll Behavior

These are permanent requirements for Home, About, Services, Projects, Clients, Contact, and every future content page:

1. Use natural browser scrolling for all content pages.
2. Do not structure pages as slides or PowerPoint-style sections.
3. Do not add scroll snapping unless specifically requested.
4. Do not hijack or lock scrolling.
5. Avoid arbitrary viewport-height sections; ordinary sections are content-driven.
6. Keep ordinary sections at natural height based on their content.
7. Animation enhances content; it never controls whether users can read or access it.
8. Important content must not disappear because an animation or observer failed.
9. Image fetching/decoding is independent of reveal effects; preserve native/Next.js lazy loading.
10. Preserve the information and section sequence when refactoring. Do not omit substantive content.
11. Use consistent gutters, content widths, spacing and existing design tokens.
12. Support reduced motion and visible no-JavaScript fallbacks.
13. Test rapid and reverse scrolling as well as direct navigation/restoration.
14. Do not add repeated content or decorative empty sections.
15. Apply these requirements consistently to every current and future page.

## Interactive Preview Selection

Whenever a desktop interface contains a list of options controlling a shared preview:

1. Hover previews immediately without overwriting the permanent selection.
2. Mouse leave returns to the most recently selected item.
3. Click permanently selects the item.
4. Keyboard focus previews; Enter/Space permanently selects where the control is a button.
5. Touch tap selects immediately without requiring hover or a second tap.
6. Preview imagery should be warmed after the page becomes interactive, using the existing Next.js image pipeline where practical.
7. Preview changes should transition smoothly without removing the stable frame or introducing layout shifts.
8. Use the shared `usePreviewSelection` hook rather than duplicating state logic.
9. Keep ordinary scrolling natural and unaffected by preview interactions.
