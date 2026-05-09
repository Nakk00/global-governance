# Story 4.1: Close with Thesis and References

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a learner,
I want the closing section to summarize the thesis and show references,
so that I leave the experience with a clear takeaway and visible source support.

## Acceptance Criteria

1. Given I reach the end of the learning flow, when the conclusion renders, then it restates the project's main thesis in a concise, readable form and connects the full experience back to the central argument.
2. Given the references section is visible, when I inspect it, then I can see at least three approved source entries with stable source ids, readable source titles, compact provenance metadata, short source summaries, and why-it-matters notes that support the educational content, and the references are presented in a readable, inspectable format instead of a document dump.
3. Given I use desktop or mobile, when the references surface opens, then it uses one explicit inline disclosure model attached to the conclusion section, remains legible at 360 px, 768 px, 1024 px, and 1440 px, and introduces no horizontal scrolling or overlap that obscures the main content.
4. Given I navigate with keyboard only, when I open and close the references surface, then every control is reachable, visible focus states remain present, the trigger is a single explicit secondary action inside the conclusion section, `Escape` closes the open references surface, and focus returns to the trigger that opened it when it closes.
5. Given reduced motion is enabled, when the conclusion and references render, then the experience remains calm and readable, the references surface does not rely on animated motion to communicate meaning, and open or close behavior remains usable with transitions removed.
6. Given I inspect the conclusion and sources together, when I finish the chapter, then I can see how the thesis and references support each other, the end of the journey feels complete, and the `journey-start` return path stays intact.
7. Given approved source data is incomplete or temporarily unavailable, when the references surface renders, then it shows a calm unavailable state that explains the gap, keeps the conclusion readable, and does not break the chapter handoff.

## Tasks / Subtasks

- [x] Replace the placeholder closing copy with a real references surface in `src/data/sections/conclusion-content.ts` (AC: 1, 2, 6, 7)
  - [x] Keep the thesis concise and readable.
  - [x] Replace the placeholder note about the reference space with actual source-visible content.
  - [x] Keep the closing chapter framed as a continuation of the same academic journey, not a bibliography dump.
  - [x] Keep the source entries repo-managed and local to the frontend story scope rather than coupling this story to chatbot ingestion or backend retrieval work.
  - [x] Model references with stable source ids, compact provenance metadata, source summaries, and why-it-matters notes so the visible content stays traceable to approved materials.

- [x] Preserve the current conclusion rendering contract while wiring the references surface (AC: 2, 3, 4, 5, 6, 7)
  - [x] Reuse the existing `NarrativeSection` disclosure stack, `Collapsible`, and `Button` primitives before inventing a new surface.
  - [x] Use one explicit inline disclosure pattern inside the conclusion section rather than introducing a modal, drawer, or route-level references experience.
  - [x] Keep the references in the conclusion reading order after supporting detail and before the recap so the page still reads as one continuous flow.
  - [x] Use one clear secondary action to open the references surface and keep the surface treatment aligned with the calmer Institutional Ledger direction already established for source-adjacent content.
  - [x] Avoid adding a route, global store, or separate maintainer flow.
  - [x] Defer any shared `src/components/references/` abstraction unless a real second consumer is created in the same change.
  - [x] Keep keyboard behavior explicit: reachable trigger, visible focus, `Escape` to close, and focus return to the opening trigger.
  - [x] Provide a calm unavailable state when source entries are missing or incomplete instead of leaving a blank or broken disclosure.

- [x] Add regression coverage for the conclusion reference shape and handoff (AC: 1-7)
  - [x] Add or extend a co-located data/unit test such as `src/data/sections/conclusion-content.test.ts` for the reference entries, reading-order contract, unavailable-state copy, and non-placeholder source metadata.
  - [x] Extend `tests/e2e/home.spec.ts` to verify visible references, keyboard open or close behavior, `Escape` close behavior, focus return, responsive containment at 360 px, 768 px, 1024 px, and 1440 px, reduced motion, unavailable-state rendering, and the recap return to `journey-start`.
  - [x] Prefer role-based locators and media emulation over brittle selectors or sleeps.

### Review Findings

- [x] [Review][Patch] Required stable source ids, compact provenance metadata, summaries, and why-it-matters notes so the visible support stays traceable to approved material.
- [x] [Review][Patch] Defined one explicit inline disclosure model inside the conclusion section to prevent drift into modal, drawer, or route-level behavior.
- [x] [Review][Patch] Clarified the keyboard contract around one explicit secondary trigger, `Escape` close behavior, and focus return to the opening trigger.
- [x] [Review][Patch] Replaced the vague responsive wording with a concrete inline layout contract at 360 px, 768 px, 1024 px, and 1440 px.
- [x] [Review][Patch] Tightened the reduced-motion requirement so the references surface remains usable with transitions removed.
- [x] [Review][Patch] Locked the reading order to summary, supporting detail, references, then recap so the chapter closes in the intended sequence.
- [x] [Review][Patch] Kept the source entries repo-managed and frontend-local so this story does not sprawl into chatbot retrieval or ingestion work.
- [x] [Review][Patch] Added an explicit data-shape expectation through the local test requirement and narrative-type note so the references model is less ad hoc.
- [x] [Review][Patch] Made the co-located conclusion reference test expected rather than optional in practice by naming the exact data concerns it must cover.
- [x] [Review][Patch] Set a minimum visible-source expectation by requiring at least three approved source entries.
- [x] [Review][Patch] Required inspectable source details beyond titles so the surface cannot collapse into a decorative bibliography list.
- [x] [Review][Patch] Added a calm unavailable state for incomplete source data so the final chapter stays usable when support is missing.
- [x] [Review][Patch] Specified that the source treatment should align with the calmer Institutional Ledger direction already established for source-adjacent content.
- [x] [Review][Patch] Non-conclusion disclosures now pick up the conclusion-only unavailable banner [src/components/sections/NarrativeSection.tsx:133]
- [x] [Review][Patch] Whitespace-only `unavailableMessage` values render a blank status block instead of the fallback copy [src/components/sections/NarrativeSection.tsx:138]

## Dev Notes

### Current State

- `src/data/sections/conclusion-content.ts` already defines the final chapter with a thesis, two supporting details, synthesis text, and a recap that returns to `journey-start`.
- The current closing copy still contains a placeholder note about the reference space; that should be replaced with actual source-visible content.
- `src/components/sections/NarrativeSection.tsx` already treats `conclusion-references` as the source-landing surface and already renders generic disclosures inline, so the conclusion can stay local to the existing section shell.
- `src/data/navigation.ts` and `src/data/sections/core-narrative.ts` already place the conclusion last in the canonical chapter order.
- `tests/e2e/home.spec.ts` already has summary-first and source-landing assertions for the conclusion region, so the new work should extend those checks rather than replace them.
- `src/data/sections/narrative-types.ts` does not currently define a dedicated references shape, so this story must either extend the local section contract cleanly or add a narrow conclusion-local helper instead of inventing an ad hoc structure.

### Scope Boundaries

- Close the chapter with thesis and references only.
- Do not add chatbot logic, ingestion logic, a router, a global store, or a public maintainer dashboard.
- Do not change the canonical section ids, chapter order, or `journey-start` recap target.
- Do not turn the final section into a document dump or a separate references page.
- Keep the visible reference treatment chapter-level and readable, using source summaries and why-it-matters notes rather than raw citation clutter.
- Keep the source content repo-managed in the frontend layer for this story; do not pull chatbot retrieval, ingestion, or maintainer workflows into the final chapter.

### Architecture Guardrails

- Keep the conclusion aligned with the existing SPA-first, anchor-navigation flow.
- Preserve the `editorial-source` treatment on the conclusion summary and the `editorial-recap` treatment on the return card.
- Use the existing UI primitives and local disclosure pattern before introducing any broader references abstraction.
- Keep the surface keyboard-reachable, focus-safe, reduced-motion-friendly, and readable at 360 px, 768 px, 1024 px, and desktop widths.
- If a local wrapper becomes necessary, keep it inside the conclusion feature boundary instead of starting a shared references layer too early.
- Keep the references disclosure inline within the conclusion section rather than branching into a modal or side-drawer interaction model.

### Testing Standards Summary

- Add a co-located data test for the conclusion references shape, source metadata, unavailable-state copy, and non-placeholder content.
- Extend Playwright coverage for open or close behavior, `Escape` close behavior, focus return, responsive containment, reduced-motion mode, unavailable-state rendering, and the canonical recap handoff.
- Verify the conclusion still reads as summary-first, then supporting detail, then references, then recap.
- Use `getByRole()` and `page.emulateMedia()` for the new assertions.

### Latest Tech Notes

- React 19.2 is the current official release line; the 19.2 release adds `useEffectEvent` and Activity, but this story should stay in standard function components and hooks.
- Vite 8 is the current stable line in the official docs, but this repository intentionally remains on `vite@^7.3.1`; do not upgrade the toolchain as part of this story.
- Playwright best practices continue to favor role-based locators and media emulation for accessible, motion-aware coverage.

### Project Structure Notes

- Likely update: `src/data/sections/conclusion-content.ts`
- Likely update: `tests/e2e/home.spec.ts`
- Likely update: `src/data/sections/conclusion-content.test.ts`
- Possible new file: `src/data/references.ts` only if splitting the reference list out of the section copy removes duplication for later chat work
- Possible new file: `src/components/sections/ConclusionReferences.tsx` only if the references logic becomes too dense for the generic section shell
- Defer `src/components/references/` until a second consumer genuinely exists in the same change

### References

- [Source: `_bmad-output/planning-artifacts/epics.md`, Epic 4 and Story 4.1: Close with Thesis and References]
- [Source: `_bmad-output/planning-artifacts/prd.md`, FR6, FR30-FR34, NFR13-NFR21, NFR25]
- [Source: `_bmad-output/planning-artifacts/architecture.md`, source credibility, component boundaries, file organization, UX coverage map]
- [Source: `_bmad-output/planning-artifacts/ux-design-specification.md`, Institutional Ledger, Reference Evidence Drawer, Button Hierarchy, Navigation Patterns, Responsive Design & Accessibility]
- [Source: `_bmad-output/project-context.md`, critical implementation rules for source discipline, accessibility, and SPA-first structure]
- [Source: `src/data/sections/conclusion-content.ts`, current closing section copy and recap target]
- [Source: `src/components/sections/NarrativeSection.tsx`, source-landing summary treatment and disclosure rendering]
- [Source: `src/data/navigation.ts`, canonical `conclusion-references` label and summary]
- [Source: `src/data/sections/core-narrative.ts`, final chapter ordering and recap target resolution]
- [Source: `tests/e2e/home.spec.ts`, existing summary-first and source-landing assertions]
- [Source: https://react.dev/versions, official React version line]
- [Source: https://react.dev/blog/2025/10/01/react-19-2, React 19.2 release notes]
- [Source: https://vite.dev/blog/announcing-vite8, Vite 8 stable release notes]
- [Source: https://playwright.dev/docs/locators, role-based locator guidance]
- [Source: https://playwright.dev/docs/emulation, media and reduced-motion emulation guidance]

## Story Completion Status

- review
- Ultimate context engine analysis completed - comprehensive developer guide created

## Dev Agent Record

### Agent Model Used

GPT-5 Codex

### Debug Log References

- GitNexus impact: `NarrativeSection` LOW risk, 0 direct callers/importers, 0 affected flows; `conclusionContent` and `NarrativeSectionContent` were not indexed as symbols.
- Verification: `pnpm exec vitest run` passed 3 files / 16 tests.
- Verification: `pnpm typecheck` passed.
- Verification: `pnpm lint` passed.
- Verification: `pnpm format` completed for TS/TSX files.
- Verification: `pnpm build` passed.
- Verification: `npx playwright install --dry-run` checked browser install locations without installing browsers.
- Verification: focused Playwright conclusion references test passed.
- Verification: full `pnpm exec playwright test` passed 25/25 after rerunning one transient pre-existing WPS focus timeout that passed in isolation.

### Completion Notes List

- Replaced the placeholder conclusion support copy with a concise thesis handoff and a single inline "Inspect the sources" disclosure.
- Added three repo-managed approved reference entries with stable source ids, provenance metadata, short summaries, and why-it-matters notes.
- Extended the narrative disclosure renderer to display structured source cards, preserve the existing Collapsible/Button contract, close on `Escape`, and return focus to the opening trigger.
- Added a calm incomplete-source fallback path and data helper so incomplete reference metadata does not render a blank or broken surface.
- Added co-located Vitest coverage for the conclusion reference shape, non-placeholder copy, unavailable-state copy, and recap handoff.
- Extended Playwright coverage for visible references, keyboard open/close, Escape focus return, reduced motion, responsive containment at 360/768/1024/1440 px, reading order before recap, and the `journey-start` return path.

### File List

- `src/components/sections/NarrativeSection.tsx`
- `src/data/sections/conclusion-content.ts`
- `src/data/sections/conclusion-content.test.ts`
- `src/data/sections/narrative-types.ts`
- `tests/e2e/home.spec.ts`
- `_bmad-output/implementation-artifacts/4-1-close-with-thesis-and-references.md`
- `_bmad-output/implementation-artifacts/sprint-status.yaml`

### Change Log

- 2026-04-28: Implemented Story 4.1 conclusion thesis and references surface; added unit and E2E regression coverage; marked story ready for review.
