# Home + About PDF Content Alignment

## Scope

Home and About business-facing copy was aligned to `reference/AR INTERIOR GROUP WORK PROFILE.pdf`. PDF-derived content remains centralized in `src/data/company-profile.ts`, `src/data/homepage.ts`, and `src/data/about-page.ts`; provenance is kept in data records and is not rendered.

## Unsupported copy removed or replaced

- Replaced invented hero language (“Transforming spaces”, “Imagining possibilities”) with the profile wording “Experts in Space Planning and Design & Build Projects.”
- Removed generic practice/process claims and performance disclaimers from visible Home/About copy.
- Replaced “Economical Solutions” with the profile’s exact CQET term “Economical”.
- Removed unsupported project scope descriptions where they were not needed for the visual card.

## PDF text adopted

- “Where Visionary Designs Meet Practical Solutions.”
- “Rapid growing space planning organization”.
- Founded in 2019; turnkey fit-out solutions; project management; execution; timelines; workmanship.
- Micro Markets Setup, Civil Services, Furniture & Working Desk, Alloy & Wooden partition, Flooring & ceiling solution, Plumbing & Sanitary work, and Railing Structure.
- Success Mantra “C.Q.E.T”: Consistency, Quality, Economical, Time Efficiency.
- Portfolio project names and locations already represented in the centralized project manifest.

## Pages used

The existing centralized profile records cite the source pages for projects and services (including pages 1, 7–40 and 50–60). The About founding and company overview use the profile’s About/company overview pages. No PDF page references are shown to visitors.

## OCR corrections and exclusions

No new OCR correction was introduced in this pass. Obvious document-editing conversation artifacts such as “Let me know if you need further adjustments!” remain excluded from visitor-facing content.

## Validation

- `npm run lint` — passed
- `npm run typecheck` — passed
- `npm run build` — blocked by the existing environment’s missing `lightningcss.linux-x64-gnu.node` optional native module
- `npm.cmd` validation — unavailable in this Linux shell because the Windows wrapper has a quoting error
- `npm run test:enquiries` — passed (20 tests)

## Remaining client clarification

The PDF contains longer Purpose, Vision, Core Values, Mission, team, and client-reference material. These should be reviewed against the printed pages before expanding the current visual composition beyond the selected excerpts.
