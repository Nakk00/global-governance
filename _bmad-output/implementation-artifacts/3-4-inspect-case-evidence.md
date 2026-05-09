# Story 3.4: Inspect Case Evidence

Status: done

## Story

As a learner,
I want to open source and evidence details inside the dossier,
so that I can verify the case study without leaving the section.

## Acceptance Criteria

1. Given I inspect a timeline event or the comparison panel, when I open supporting evidence from an explicit local trigger attached to that selected context, then I see a clearly labeled evidence surface with the relevant source title(s), stable source id(s), metadata, and short explanation(s) of why the source matters, and the evidence stays tied to the selected context.
2. Given I switch to a different event or comparison state, when evidence is opened again or remains open during the state change, then the evidence content updates to that context without leaving the dossier, resetting the chapter shell, or showing stale details from the prior selection.
3. Given I use desktop or mobile, when the evidence surface appears, then it uses a readable inline or adjacent disclosure layout inside the dossier flow rather than an overlaying modal or blocking drawer, remains readable at 360 px, 768 px, 1024 px, and 1440 px, and introduces no horizontal scrolling or overlap that obscures the main dossier content.
4. Given I navigate with keyboard only, when I open and close the evidence surface, then every control is reachable, visible focus states are preserved, and focus returns to the trigger that opened the evidence surface when it closes.
5. Given reduced motion is enabled, when the evidence surface opens or closes, then the experience remains calm and readable and the meaning of the evidence is not dependent on animation.
6. Given the selected context has no evidence items, when the module opens the evidence surface, then it shows a calm unavailable state that keeps the current context label visible, explains that evidence is unavailable for this selection, and leaves the dossier usable instead of breaking.
7. Given I compare the evidence to the case explanation, when I read the source details, then the treatment reinforces trust and does not feel like a decorative bibliography dump, and the evidence copy supports the claim without repeating the timeline or comparison prose verbatim.

## Tasks / Subtasks

- [x] Add a typed evidence data model to `src/data/sections/west-philippine-sea-dossier.ts` (AC: 1, 2, 6, 7)
  - [x] Model evidence items as a stable typed map keyed by timeline event id and comparison state id.
  - [x] Include a stable source id, source label, brief summary, compact metadata, and a short why-it-matters note for each item.
  - [x] Keep the current narrative, timeline, comparison, and shell copy stable; do not duplicate them inside the evidence copy.

- [x] Build the evidence surface inside the dossier feature (AC: 1-7)
  - [x] Render the current selected event or comparison sources from an explicit local trigger with accessible disclosure semantics.
  - [x] Keep the surface local to the dossier and context-linked to the selected item.
  - [x] If the selected context changes while evidence is open, update the evidence surface to the new context instead of leaving stale content visible.
  - [x] Keep the evidence surface inline or adjacent to the active dossier context so it preserves the reading flow and does not obscure the timeline, comparison, or recap surfaces.
  - [x] Prefer the existing `Button` and `Collapsible` primitives first; if the logic gets too dense, extract a small local dossier component rather than assuming a drawer or sheet primitive already exists.
  - [x] If a reusable reference surface becomes clearly useful later, keep that as a separate step; do not start with a shared abstraction unless the reuse case is obvious.

- [x] Preserve the dossier shell, chronology, comparison, and recap flow (AC: 1-7)
  - [x] Keep evidence adjacent to the current case context so it reinforces trust instead of becoming a document dump.
  - [x] Keep the evidence trigger and surface in the chronology/comparison reading order without burying the recap handoff or turning the dossier into a detached references panel.
  - [x] Preserve the canonical anchor behavior, the recap handoff, and the existing shell and chapter order.
  - [x] Do not add a route, global store, or maintainer workflow.
  - [x] Do not introduce a shared `src/components/references/` abstraction in this story unless a concrete second consumer is implemented in the same change.

- [x] Extend verification for the evidence behavior (AC: 1-7)
  - [x] Add Vitest assertions for evidence metadata, stable ids/labels, context linkage, empty-state shape, and non-duplication boundaries in `src/data/sections/west-philippine-sea-dossier.test.ts`.
  - [x] Extend `tests/e2e/home.spec.ts` to verify open/close behavior, keyboard access, focus return after close, context switching while open, responsive layout at 360 px, 768 px, 1024 px, and 1440 px, reduced motion, no horizontal overflow, calm empty-state rendering, and the continued recap handoff.
  - [x] Prefer role-based locators and bounding-box assertions over snapshots or sleeps.

### Review Findings

- [x] [Review][Patch] AC3 is contradictory: "drawer-like layout" implies an overlay pattern, but "no overlap with the main dossier content" forbids the normal drawer behavior. The story needs one explicit spatial model.
- [x] [Review][Patch] AC1 and AC2 say the evidence is context-linked, but they never define the trigger placement or disclosure affordance, so the same requirement could be implemented as an inline expander, drawer button, or modal.
- [x] [Review][Patch] The story does not say what happens when the selected timeline event or comparison state changes while the evidence surface is already open, which leaves stale-context behavior undefined.
- [x] [Review][Patch] AC4 leaves focus behavior optional by allowing it to return to the trigger or stay on the active control; that makes the keyboard contract impossible to test against a single expected pattern.
- [x] [Review][Patch] AC6 needs more than a calm unavailable state. It should preserve the current context label and give a clear path back to the selected event or comparison state so the panel does not become a dead end.
- [x] [Review][Patch] AC7 is too vague to prevent a bibliography dump. Add an explicit non-duplication rule so the evidence surface cannot repeat the timeline or comparison prose as pseudo-citations.
- [x] [Review][Patch] The evidence data task names source title(s) and metadata, but it never defines stable source ids or provenance rules, so later tests will have nothing concrete to anchor on.
- [x] [Review][Patch] The story does not pin the responsive layout to the module's established breakpoints, so "desktop or mobile" is too loose for a surface that must behave differently at 360, 768, 1024, and 1440 px.
- [x] [Review][Patch] The verification task should explicitly cover context switching while open, empty-state rendering, and focus return after close; otherwise the highest-risk regressions remain untested.
- [x] [Review][Patch] The story never states where the evidence surface belongs in the dossier reading order relative to chronology, comparison, disclosures, synthesis, and recap, so implementation could bury the recap handoff or pull attention away from the case flow.
- [x] [Review][Patch] The optional `src/components/references/ReferenceEvidenceDrawer.tsx` path should be either explicitly out of scope or explicitly reserved for reuse; right now the local-vs-shared boundary is too soft for a story that is supposed to stay narrow.
- [x] [Review][Patch] Keep the empty comparison fallback tied to the selected context label [src/components/modules/WpsDossier/WpsDossier.tsx:424]

## Dev Notes

### Current State

- `src/components/modules/WpsDossier/WpsDossier.tsx` already renders the dossier shell, the chronology timeline, the ruling-versus-reality comparison, the entry controls, the disclosure stack, the synthesis block, and the recap card.
- That module already uses local state for selection and disclosure behavior. The new evidence surface should piggyback on that pattern instead of introducing cross-cutting state.
- `src/data/sections/west-philippine-sea-dossier.ts` currently contains the authored case narrative, the timeline events, the comparison data, and the dossier shell copy. It does not yet contain evidence/source metadata.
- `tests/e2e/home.spec.ts` already covers the dossier shell, timeline, comparison, responsive containment, reduced motion, and recap handoff. Extend it rather than replacing it.
- The current repo snapshot only exposes `button.tsx` and `collapsible.tsx` under `src/components/ui`; there is no drawer or sheet primitive on disk today.
- There is no `src/components/references/` implementation yet, so do not assume a shared reference surface is already available.
- `src/index.css` already has editorial and dossier shell treatments. Reuse those first before adding new CSS for the evidence surface.

### Carry-Forward from Stories 3.2 and 3.3

- Chronology stays first, comparison stays paired and local, and evidence should be attached to the currently selected context rather than replacing either surface.
- Keep the dossier shell and canonical anchor / recap handoff intact.
- Preserve the same accessible selection pattern, visible selected state, and reduced-motion safety that the timeline and comparison stories established.
- The evidence layer should reinforce the governance lesson: law clarifies claims, but politics still governs compliance.
- Do not duplicate the narrative text in evidence cards. The evidence surface should support the claim, not repeat the chapter.

### Story Scope Boundaries

- Add evidence inspection only.
- Do not implement the conclusion references page, the chatbot source drawer, or the maintainer ingestion workflow.
- Do not add React Router, a global store, or a new top-level section.
- Do not move the case data out of `src/data/sections/west-philippine-sea-dossier.ts` unless reuse becomes obviously necessary.
- Do not let the evidence UI replace or obscure the timeline or comparison surfaces.

### Architecture Guardrails

- Follow the SPA-first React + Vite + TypeScript structure already used in the repo.
- Keep browser-facing code in `src/`.
- Keep shared primitives in `src/components/ui`.
- Build drawer-like behavior from the primitives that actually exist in this repo, or from a small local component, rather than assuming a missing drawer or sheet file.
- If a reusable reference surface becomes truly useful, place it in `src/components/references/` as a later step, but only if the reuse case is real.
- Preserve keyboard access, visible focus states, reduced motion, and no horizontal scrolling at 360 px, 768 px, 1024 px, and 1440 px.
- Use one explicit focus contract for the disclosure pattern: closing the evidence surface returns focus to the trigger that opened it.
- Treat missing evidence as a calm fallback state, not a hard failure.

### Testing Standards Summary

- Use `src/data/sections/west-philippine-sea-dossier.test.ts` for evidence data shape, source metadata, and context-link assertions.
- Use `tests/e2e/home.spec.ts` for open/close behavior, keyboard traversal, responsive layout, reduced motion, no overflow, and recap handoff.
- Prefer `getByRole()` and `page.emulateMedia({ reducedMotion })` over brittle selectors or sleeps.
- Verify that the evidence surface stays tied to the selected event or comparison state, updates cleanly if that context changes, and does not drift into a generic bibliography panel.

### Latest Tech Notes

- The repo pins `react` and `react-dom` at `^19.2.4`, `vite` at `^7.3.1`, and `@playwright/test` at `^1.59.1`.
- React 19.2 adds features like Activity and `useEffectEvent`, but this story should stay in standard function components and hooks.
- Vite 8 is now the stable line, but this repository is intentionally still on Vite 7.3.1; do not upgrade as part of this story.
- Playwright docs continue to recommend `getByRole()` and `page.emulateMedia()` for accessible, responsive smoke coverage.

### Project Structure Notes

- Likely update: `src/components/modules/WpsDossier/WpsDossier.tsx`
- Likely update: `src/data/sections/west-philippine-sea-dossier.ts`
- Likely update: `src/data/sections/west-philippine-sea-dossier.test.ts`
- Likely update: `tests/e2e/home.spec.ts`
- Possible new file: `src/components/modules/WpsDossier/WpsEvidencePanel.tsx`
- Possible new file: `src/components/modules/WpsDossier/WpsEvidenceSurface.tsx`
- Defer `src/components/references/ReferenceEvidenceDrawer.tsx` unless this story introduces a real second consumer in the same change
- Possible update: `src/index.css` only if the evidence surface needs a reusable treatment beyond the existing editorial surfaces
- Current repo gap: there is no drawer or sheet primitive on disk today, so do not rely on one existing already

### References

- [Source: `_bmad-output/planning-artifacts/epics.md`, Epic 3 overview and Story 3.4 Inspect Case Evidence]
- [Source: `_bmad-output/planning-artifacts/prd.md`, FR5, FR15-FR18, FR21, FR30-FR34, NFR17-NFR21]
- [Source: `_bmad-output/planning-artifacts/ux-design-specification.md`, West Philippine Sea Interactive Dossier, Reference Evidence Drawer, Responsive Design & Accessibility, Testing Strategy]
- [Source: `_bmad-output/planning-artifacts/architecture.md`, West Philippine Sea dossier mapping, references and citation visibility, component boundaries, file organization]
- [Source: `_bmad-output/implementation-artifacts/3-2-follow-the-timeline.md`, chronology and selection patterns]
- [Source: `_bmad-output/implementation-artifacts/3-3-compare-ruling-and-reality.md`, carry-forward from the comparison story]
- [Source: `src/components/modules/WpsDossier/WpsDossier.tsx`, current shell, timeline, comparison, and entry controls]
- [Source: `src/data/sections/west-philippine-sea-dossier.ts`, current narrative, timeline, comparison, and shell data]
- [Source: `src/data/sections/west-philippine-sea-dossier.test.ts`, current unit coverage]
- [Source: `tests/e2e/home.spec.ts`, current dossier smoke coverage]
- [Source: `src/components/ui/button.tsx`, current accessible control primitive]
- [Source: `src/components/ui/collapsible.tsx`, current disclosure primitive]
- [Source: https://react.dev/blog/2025/10/01/react-19-2, React 19.2 release notes]
- [Source: https://react.dev/versions, React versions page]
- [Source: https://vite.dev/blog/announcing-vite8, Vite 8 announcement]
- [Source: https://playwright.dev/docs/locators, locator best practices]
- [Source: https://playwright.dev/docs/emulation, media emulation]

## Story Completion Status

- review
- Ultimate context engine analysis completed - comprehensive developer guide created

## Dev Agent Record

### Agent Model Used

GPT-5 Codex

### Debug Log References

- Started Story 3.4 implementation on `codex/story-3-4-inspect-case-evidence`.
- Ran GitNexus impact checks before editing: `WpsDossier` returned LOW risk with no upstream callers; `west-philippine-sea-dossier.ts` returned LOW risk with direct importers in `src/App.tsx`, `src/data/sections/core-narrative.ts`, and `src/components/modules/WpsDossier/WpsDossier.tsx`. The exported data constants and E2E helper symbols were not individually indexed, so file-level impact governs those edits.
- Validation passed: `pnpm lint`, `pnpm typecheck`, `pnpm build`, `pnpm exec vitest run src`, and `pnpm exec playwright test tests/e2e/home.spec.ts`.
- Note: bare `pnpm exec vitest run` is not a valid full-suite command in the current repo because it attempts to load Playwright specs as Vitest tests; the repo split was verified with Vitest over `src` and Playwright over `tests/e2e`.
- Ran GitNexus `detect_changes(scope: all)` after implementation. It reported medium risk due to the full dirty worktree, with expected Story 3.4 changes affecting the two WpsDossier execution flows; unrelated pre-existing dirty files remain outside this story's implementation scope.
- Loaded `sprint-status.yaml`, `project-context.md`, `epics.md`, `prd.md`, `architecture.md`, `ux-design-specification.md`, `implementation-readiness-report-2026-04-24.md`, the Epic 3 story files, `src/components/modules/WpsDossier/WpsDossier.tsx`, `src/data/sections/west-philippine-sea-dossier.ts`, `src/data/sections/west-philippine-sea-dossier.test.ts`, `tests/e2e/home.spec.ts`, `src/components/sections/InsightRecapCard.tsx`, `src/components/sections/NarrativeSection.tsx`, `src/components/ui/button.tsx`, `src/components/ui/collapsible.tsx`, `src/contexts/NavigationContext.tsx`, `src/App.tsx`, `src/components/layout/AppShell.tsx`, and `src/data/sections/core-narrative.ts`.
- Confirmed the current repo snapshot does not contain a drawer or sheet primitive and does not yet include a `src/components/references/` implementation.
- Reviewed official React 19.2, Vite 8, and Playwright locator/emulation docs to keep the story aligned with current tool guidance.
- Recent commit history shows the dossier implementation pattern is already established through `open the case dossier`, `follow the timeline`, and `compare ruling and reality`, so this story should extend the same local dossier module instead of introducing a new interaction model.
- The story is intentionally narrow: evidence inspection only, after chronology and comparison, with no routing changes or chatbot/source-ingestion work.

### Completion Notes List

- Evidence should be context-linked, not a generic bibliography panel.
- Keep the dossier shell, timeline, comparison, and recap flow intact.
- Prefer the smallest accessible local disclosure pattern that the current repo can support.
- Keep fallbacks calm and readable if evidence metadata is missing.
- Do not assume a drawer or sheet primitive exists in the shared UI layer.
- Added a typed evidence registry keyed by timeline event id and comparison state id, with stable source ids, labels, metadata, summaries, and why-it-matters notes.
- Added a local `WpsEvidenceSurface` disclosure that uses existing `Button` and `Collapsible` primitives, updates when the selected timeline/comparison context changes, and returns focus to the evidence trigger when closed.
- Preserved the dossier shell, chronology, comparison, disclosure stack, synthesis, and recap handoff without routes, global state, or shared references abstraction.
- Added Vitest coverage for evidence shape, source identity, context linkage, empty-state support, and non-duplication boundaries.
- Extended Playwright coverage for evidence open/close behavior, keyboard focus, context switching while open, responsive containment at 360/768/1024/1440 px, reduced motion, no horizontal overflow, empty-state rendering, and recap continuity.

### File List

- `_bmad-output/implementation-artifacts/3-4-inspect-case-evidence.md`
- `_bmad-output/implementation-artifacts/sprint-status.yaml`
- `src/components/modules/WpsDossier/WpsDossier.tsx`
- `src/components/modules/WpsDossier/WpsEvidenceSurface.tsx`
- `src/data/sections/west-philippine-sea-dossier.ts`
- `src/data/sections/west-philippine-sea-dossier.test.ts`
- `tests/e2e/home.spec.ts`

### Change Log

- 2026-04-27: Implemented Story 3.4 evidence inspection, added data/model/UI/test coverage, and moved story to review.
