# Story 3.3: Compare Ruling and Reality

Status: done

## Story

As a learner,
I want the dossier to show the legal ruling beside the geopolitical reality,
so that I can understand why the case demonstrates weak enforcement.

## Acceptance Criteria

1. Given I open the ruling-versus-reality view
   When the comparison panel renders
   Then I can see the legal or institutional ruling side alongside the real-world enforcement or geopolitical outcome in a paired comparison surface
   And the distinction between the two is easy to understand

2. Given I switch between the comparison states
   When the state changes
   Then the local comparison control updates the active explanatory state without breaking the narrative flow
   And the comparison remains tied to the case thesis

3. Given I read the comparison details
   When I reach the explanatory text
   Then it clearly connects the legal outcome to the enforcement gap and political reality
   And it avoids turning into a generic conflict summary

4. Given reduced motion is enabled
   When I move through the comparison
   Then motion stays subtle and does not obscure the comparison or the text
   And the state change remains understandable

5. Given I use the module on any target breakpoint
   When the comparison view appears
   Then it remains legible and does not depend on hover-only disclosure
   And the section still feels like a single coherent case narrative

## Tasks / Subtasks

- [x] Add typed comparison copy to `src/data/sections/west-philippine-sea-dossier.ts` (AC: 1, 2, 3)
  - [x] Model the comparison as explicit typed data with a stable `defaultStateId`, paired `ruling` and `reality` summaries, and a stateful explanatory layer so the copy stays reviewable and testable.
  - [x] Keep the text specific to the governance lesson: legal outcome, enforcement gap, and political reality.
  - [x] Keep the comparison tied to the existing timeline by defining whether the panel is driven by a fixed dossier-level thesis or by the currently selected milestone.
  - [x] Preserve the existing timeline data and shell copy without renaming the canonical section ids.

- [x] Extend `src/components/modules/WpsDossier/WpsDossier.tsx` with the comparison surface (AC: 1, 2, 3, 4, 5)
  - [x] Present the comparison as a local dossier subsection that always shows both the ruling and reality sides in a paired surface, with a small local state control that swaps or focuses the explanatory emphasis only.
  - [x] Use one explicit one-of-many selection pattern for the explanatory state, such as tabs, a radio group, or an equivalent button pattern with matching semantics, and keep the keyboard model consistent with that choice.
  - [x] Define the first-render state explicitly so the panel opens in a stable default emphasis rather than an implied or empty state.
  - [x] Keep the comparison state local to the module; do not introduce a route, global store, or cross-cutting context.
  - [x] Keep the comparison directly after the chronology layer and before the supporting detail/disclosure stack so the reading order stays coherent.
  - [x] Preserve the current shell, entry controls, chronology timeline, supporting detail, disclosures, synthesis, and recap handoff.
  - [x] If the comparison logic gets too dense for one file, extract a local `RulingRealityPanel.tsx` inside `src/components/modules/WpsDossier/` rather than moving the logic into shared UI.

- [x] Preserve accessibility, responsive behavior, and reduced-motion safety (AC: 1-5)
  - [x] Make the comparison interaction fully keyboard reachable and clearly labeled.
  - [x] Expose a visible selected state that does not rely on color alone.
  - [x] Keep focus on the active comparison control when the explanatory state changes unless a deliberate announcement pattern is used instead, and do not move focus unexpectedly into the panel body.
  - [x] Keep the comparison readable on mobile and tablet with a stacked mobile sequence at 360 px and 768 px and a split-panel layout at 1024 px and 1440 px, with no horizontal scrolling.
  - [x] Ensure hover is optional, not required for meaning, and the comparison text remains understandable when reduced motion removes or effectively eliminates nonessential transitions.
  - [x] Keep the state change announcement calm and readable so assistive tech users can follow the transition once, not twice.

- [x] Extend verification for the comparison behavior (AC: 1-5)
  - [x] Extend `src/data/sections/west-philippine-sea-dossier.test.ts` with comparison state-shape assertions for the default state, paired ruling/reality copy, and governance-specific explanatory text.
  - [x] Extend `tests/e2e/home.spec.ts` to verify the paired comparison view, first-render default state, state switching semantics, keyboard access, focus stability, responsive containment, reduced-motion behavior, and continued recap handoff.
  - [x] Prefer role-based locators and geometry assertions over snapshots or sleeps.

### Review Findings

- [x] [Review][Patch] Resolved the interaction-model mismatch by requiring a paired comparison surface that always shows ruling and reality side by side, with local state affecting explanatory emphasis only.
- [x] [Review][Patch] Defined a stable first-render default state so the comparison cannot open in an empty or implied mode.
- [x] [Review][Patch] Named the selection-pattern requirement explicitly so keyboard behavior and assistive-tech semantics must follow a real one-of-many control model.
- [x] [Review][Patch] Added a visible selected-state requirement so the active comparison state cannot rely on color alone.
- [x] [Review][Patch] Specified the focus contract for state changes by keeping focus on the active control unless a deliberate announcement pattern is used.
- [x] [Review][Patch] Tightened the reduced-motion contract so meaning remains intact when nonessential transitions are removed or effectively eliminated.
- [x] [Review][Patch] Preserved the calm, single-announcement requirement for assistive technology state changes.
- [x] [Review][Patch] Replaced the vague typed-copy task with a concrete typed-data shape requirement for default state plus paired ruling and reality content.
- [x] [Review][Patch] Made the governance-content boundaries more concrete by requiring legal outcome, enforcement gap, and political reality framing in the comparison data and tests.
- [x] [Review][Patch] Declared explicit stacked-versus-split responsive expectations for 360 px, 768 px, 1024 px, and 1440 px.
- [x] [Review][Patch] Pinned the comparison directly after the chronology layer so the dossier reading order stays coherent.
- [x] [Review][Patch] Required the story to define whether the comparison is dossier-level or timeline-driven so chronology and comparison copy cannot drift apart.
- [x] [Review][Patch] Converted the verification task to assert the first-render state and focus stability so the local-state reset behavior is testable even without URL persistence.
- [x] [Review][Patch] Tablet layout stops being stacked too early at the 768 px breakpoint [src/components/modules/WpsDossier/WpsDossier.tsx:308] - `sm:grid-cols-3` switches the comparison controls into a horizontal row before the story's stacked 360 px / 768 px sequence is complete.
- [x] [Review][Patch] The comparison radios are not a true one-tab-stop control and the Arrow-key focus handoff is timing-sensitive [src/components/modules/WpsDossier/WpsDossier.tsx:304] - the `radiogroup` wrapper leaves all three buttons in the normal tab order, and `requestAnimationFrame` defers the focus move after selection.
- [x] [Review][Patch] The live comparison details can be announced twice by assistive tech [src/components/modules/WpsDossier/WpsDossier.tsx:366] - the details panel is `aria-live="polite"` while the radiogroup also points to it with `aria-describedby`, so selection changes can be spoken as both a control update and a live-region update.
- [x] [Review][Patch] A missing or mismatched comparison state blanks the whole dossier shell instead of only the comparison block [src/components/modules/WpsDossier/WpsDossier.tsx:85] - `if (!selectedEvent || !selectedComparisonState) return null` makes the new comparison data path a hard failure for the full section.

## Dev Notes

### Current State

- `src/components/modules/WpsDossier/WpsDossier.tsx` already renders the case shell, entry controls, chronology timeline, supporting detail, disclosures, synthesis, and recap. It already uses local state for `openEntry` and `selectedEventId`, so the comparison work should layer onto that module rather than reframe it.
- The timeline is already the first interactive layer after the shell and should stay first. The new comparison surface should deepen the case interpretation, not replace the chronology or entry controls.
- `src/data/sections/west-philippine-sea-dossier.ts` currently holds the narrative copy and the ordered timeline events. It has no ruling-versus-reality comparison copy yet.
- `tests/e2e/home.spec.ts` already verifies the dossier shell, timeline, responsive containment, reduced motion, and canonical recap handoff. Extend it rather than replacing it.
- `src/index.css` already includes `wps-dossier-shell`, `wps-dossier-summary`, and `wps-dossier-ledger` treatments. Only add new shared CSS if the comparison needs a reusable dossier surface that cannot be composed from existing editorial primitives.
- The existing selector pattern in this module uses buttons, `aria-pressed`, `aria-controls`, `aria-live="polite"` detail, and motion-reduce-safe transitions. Mirror those patterns if the comparison introduces its own toggle.

### Carry-Forward from Story 3.2

- Preserve the canonical case path and recap chain: `governance-limits` -> `west-philippine-sea-dossier` -> `conclusion-references`.
- Keep the timeline compact, evidence-led, and chronology-first. Do not let the comparison surface turn the chapter into a long article or hide the timeline.
- Preserve the shell's anchored focus behavior and the current no-route SPA flow.
- The comparison should reinforce the same thesis as the timeline: legal clarity exists, but enforcement depends on political will and power.

### Story Scope Boundaries

- Add the compare view only. Do not implement the source drawer or evidence inspection surface; that belongs to Story 3.4.
- Do not add a new route, page, or external state store.
- Do not change the UN module or other sections.
- Do not disturb the chapter order or recap target.

### Architecture Guardrails

- Follow the SPA-first React + Vite + TypeScript structure already used in the repo.
- Keep feature code in `src/components/modules/WpsDossier/`.
- Keep authored data in `src/data/sections/west-philippine-sea-dossier.ts`.
- Keep shadcn/ui primitives in `src/components/ui`.
- Keep the comparison local, accessible, and responsive; no global store, router, or server coupling.
- Preserve reduced motion, keyboard reachability, and no horizontal overflow at 360 px, 768 px, 1024 px, and 1440 px.
- Keep comparisons and citations separate: this story is presentation only, not source packaging.

### Testing Standards Summary

- Use `src/data/sections/west-philippine-sea-dossier.test.ts` for data invariants and copy boundaries.
- Use `tests/e2e/home.spec.ts` for view state, keyboard traversal, reduced motion, and responsive layout.
- Prefer `getByRole()` and `page.emulateMedia({ reducedMotion })` per Playwright docs.
- Verify comparison text and layout with role locators and bounding boxes, not snapshots.
- Keep the current shell and recap tests passing while adding comparison coverage.

### Latest Tech Notes

- The repo pins `react` / `react-dom` at `^19.2.4`, `vite` at `^7.3.1`, and `@playwright/test` at `^1.59.1` in `package.json`.
- React 19.2 is the current release line and adds Activity, `useEffectEvent`, `cacheSignal`, and partial pre-rendering. This story does not need a React upgrade or a new rendering model; keep the module in standard function components and hooks.
- Vite 8 is the current stable line, but the repo is still on Vite 7.3.x. Do not mix a toolchain upgrade into this story.
- Playwright locators and emulation docs continue to recommend `getByRole()` and `page.emulateMedia({ reducedMotion })`; use those for the comparison checks and mobile emulation.
- Official references used for the latest tech pass:
  - https://react.dev/blog/2025/10/01/react-19-2
  - https://react.dev/versions
  - https://vite.dev/blog/announcing-vite8
  - https://vite.dev/releases
  - https://playwright.dev/docs/locators
  - https://playwright.dev/docs/emulation

### Project Structure Notes

- Likely update: `src/components/modules/WpsDossier/WpsDossier.tsx`
- Likely update: `src/data/sections/west-philippine-sea-dossier.ts`
- Likely update: `tests/e2e/home.spec.ts`
- Likely update: `src/data/sections/west-philippine-sea-dossier.test.ts`
- Possible update: `src/index.css` only if the comparison needs a shared dossier surface treatment.
- Variance to watch: the architecture shows a potential `RulingRealityPanel.tsx` extraction, but the current repo keeps the dossier consolidated. Prefer the smallest local change that preserves the existing structure; extract a local panel only if the comparison logic gets too dense for `WpsDossier.tsx`.

### References

- [Source: `_bmad-output/planning-artifacts/epics.md`, Epic 3, Story 3.3 Compare Ruling and Reality, and Story 3.4 Inspect Case Evidence]
- [Source: `_bmad-output/planning-artifacts/prd.md`, FR5, FR15-FR18, FR21, NFR17-NFR21]
- [Source: `_bmad-output/planning-artifacts/ux-design-specification.md`, West Philippine Sea Interactive Dossier, Component Strategy, Responsive Design & Accessibility]
- [Source: `_bmad-output/planning-artifacts/architecture.md`, West Philippine Sea Interactive Dossier, Requirements to Structure Mapping, File Organization Patterns]
- [Source: `_bmad-output/implementation-artifacts/3-2-follow-the-timeline.md`, Carry-Forward from Story 3.2, Story Scope Boundaries, Architecture Guardrails]
- [Source: `src/components/modules/WpsDossier/WpsDossier.tsx`, current shell, timeline, entry controls, and recap structure]
- [Source: `src/data/sections/west-philippine-sea-dossier.ts`, current narrative and timeline data]
- [Source: `src/data/sections/west-philippine-sea-dossier.test.ts`, current timeline invariants]
- [Source: `tests/e2e/home.spec.ts`, current dossier smoke coverage]
- [Source: `src/index.css`, dossier surfaces and motion-safe defaults]
- [Source: `https://react.dev/blog/2025/10/01/react-19-2`, React 19.2 release notes]
- [Source: `https://vite.dev/blog/announcing-vite8`, Vite 8 announcement]
- [Source: `https://playwright.dev/docs/locators`, Playwright locator best practices]
- [Source: `https://playwright.dev/docs/emulation`, Playwright media emulation guidance]

## Story Completion Status

- review
- Ultimate context engine analysis completed - comprehensive developer guide created

## Dev Agent Record

### Agent Model Used

GPT-5 Codex

### Debug Log References

- Loaded `sprint-status.yaml`, `project-context.md`, `epics.md`, `prd.md`, `architecture.md`, `ux-design-specification.md`, `implementation-readiness-report-2026-04-24.md`, `product-brief-Global-Governance.md`, the previous story `3-2-follow-the-timeline.md`, the current `WpsDossier.tsx`, the current dossier data file, the current dossier data test, the current smoke test, the UN module precedent, and `src/index.css`.
- GitNexus query/context/impact confirmed `WpsDossier` is the relevant symbol and its upstream blast radius is LOW.
- Official React, Vite, and Playwright docs were checked for current release-line and locator/emulation guidance.
- The story is intentionally narrow: compare ruling versus reality only; timeline, recap, and shell behavior stay intact; the evidence drawer stays for Story 3.4.
- GitNexus impact for `WpsDossier` reported LOW risk with 0 direct callers and 0 affected processes before implementation. Data exports and test helpers were not individually indexed.
- Implemented typed `wpsRulingRealityComparison` data with a fixed dossier-level thesis, stable default state, paired ruling/reality copy, and three explanatory states.
- Added the comparison subsection after the chronology layer and before the dossier entry controls, using local component state and radio semantics with Arrow/Home/End keyboard support.
- GitNexus `detect_changes(scope: all)` reported medium overall workspace risk because of pre-existing local documentation/skill edits, with expected affected WPS dossier and recap-target flows from this implementation.
- Verification run: `pnpm exec vitest run src/data/sections/west-philippine-sea-dossier.test.ts`, `pnpm format`, `pnpm lint`, `pnpm typecheck`, `pnpm build`, `pnpm exec playwright test tests/e2e/home.spec.ts --grep "West Philippine Sea dossier"`, `pnpm test:e2e`, and `pnpm exec vitest run src/data/sections`.
- Note: a plain `pnpm exec vitest run` currently picks up `tests/e2e/home.spec.ts` and fails because that file uses Playwright's `test()` API; the co-located unit suite passes when scoped to `src/data/sections`.

### Completion Notes List

- Comparison must deepen the dossier thesis, not add a separate side quest.
- Chronology stays first; comparison stays secondary and local to the dossier module.
- Preserve keyboard access, reduced-motion safety, and responsive readability.
- Use role-based Playwright coverage and data-shape tests to keep the comparison trustworthy.
- Keep the existing shell, recap handoff, and canonical anchor behavior intact.
- Added a paired ruling-versus-reality comparison surface that always shows both sides and changes only the explanatory emphasis.
- Added visible active state, role-based radio controls, keyboard state switching, focus stability, and reduced-motion-safe rendering.
- Added data-shape tests for default state, paired copy, and governance-specific enforcement-gap framing.
- Added E2E coverage for first render, state switching, keyboard/focus behavior, responsive containment at 360/768/1024/1440 px, reduced motion, and recap handoff.

### File List

- `src/components/modules/WpsDossier/WpsDossier.tsx`
- `src/data/sections/west-philippine-sea-dossier.ts`
- `src/data/sections/west-philippine-sea-dossier.test.ts`
- `tests/e2e/home.spec.ts`
- `_bmad-output/implementation-artifacts/3-3-compare-ruling-and-reality.md`
- `_bmad-output/implementation-artifacts/sprint-status.yaml`

### Change Log

- 2026-04-27: Implemented Story 3.3 comparison data, local WPS dossier comparison surface, accessibility/responsive behavior, and data/E2E verification; moved story to review.
