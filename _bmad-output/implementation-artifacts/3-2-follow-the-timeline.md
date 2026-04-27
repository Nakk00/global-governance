# Story 3.2: Follow the Timeline

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a learner,
I want the case study to present the events in chronological order,
so that I can understand how the dispute developed over time.

## Acceptance Criteria

1. Given the timeline first renders, when the dossier opens after the case-opening shell, then the first chronological event is selected by default and the detail region immediately shows that event's context, legal context, and significance without requiring an initial click.
2. Given the timeline is visible, when I select an event, then the detail view updates to the matching event and the active selection is explicit through both a semantic selected-state contract and a visible styling change that does not rely on color alone.
3. Given I move through the key events, when I progress through the sequence, then the module includes the major milestones of the case in chronological order: the 2012 Scarborough Shoal incident, the 2013 arbitration filing, the 2016 ruling, and a post-ruling enforcement-limits milestone that explains the gap between legal clarity and real-world enforcement, and the chronology remains clear in both the DOM order and the visual layout.
4. Given I review the event cards, when the timeline renders, then the event rail remains scan-friendly and compact, each event exposes a short label plus concise supporting copy, and the module avoids turning the chapter into a long unstructured article.
5. Given I use keyboard navigation, when I move between timeline events, then each event is reachable as a real button, the intended keyboard model is preserved consistently, focus visibility is maintained, and selecting an event does not move focus unexpectedly away from the trigger unless the interaction explicitly announces and controls that behavior.
6. Given I use assistive technology, when I move between events, then the selected control and the stable detail region remain programmatically linked so the relationship between the current event and its detail content is clear.
7. Given I view the dossier on tablet or mobile, when the timeline adapts, then it collapses into a stacked or hybrid layout that still preserves the chronological flow, keeps the DOM order chronological, and requires no horizontal scrolling at 360 px, 768 px, 1024 px, or 1440 px.
8. Given reduced motion is enabled, when the timeline selection changes, then nonessential animation is removed or minimized and the meaning of the active event remains clear without depending on animation timing, movement, or transition effects.

## Tasks / Subtasks

- [x] Build the timeline interaction and keep the dossier shell intact. (AC: 1, 2, 3, 5, 6)
  - [x] Add a typed, ordered timeline data structure in `src/data/sections/west-philippine-sea-dossier.ts` with the 2012, 2013, 2016, and post-ruling milestones, plus short label, context, legal-context, and significance copy for each event.
  - [x] Make the timeline data order the source of truth for both rendering and verification so the exact milestone sequence cannot drift between the UI and tests.
  - [x] Extend `src/components/modules/WpsDossier/WpsDossier.tsx` to render the timeline rail/cards and a stable detail region driven by local `useState`, defaulting to the first event and preserving the existing shell, disclosure, synthesis, and recap flow.
  - [x] Keep the timeline as the first interactive layer after the case-opening shell so chronology appears before any later comparison or evidence work.
- [x] Preserve accessibility and responsive behavior. (AC: 1-8)
  - [x] Use real button semantics for event selection, a stable detail region, and an explicit selected-state pattern that is appropriate for a one-of-many selector and works with role-based Playwright locators.
  - [x] Keep the selected-state treatment visible through more than color alone, and preserve the intended focus behavior when the selection changes.
  - [x] Link each event trigger to the detail region with a clear accessible relationship such as `aria-controls`, `aria-labelledby`, or an equivalent pattern that makes the current selection understandable to assistive technologies.
  - [x] Keep the desktop layout compact and use a stacked or hybrid layout on tablet and mobile, especially at 360 px, 768 px, 1024 px, and 1440 px, with no horizontal overflow, readable text, and chronological DOM order.
  - [x] Remove dependence on animation for understanding and ensure reduced-motion mode does not hide, delay, or redefine the meaning of the active event.
- [x] Extend verification for chronology and selection behavior. (AC: 1-8)
  - [x] Add a focused Vitest check for the exact timeline data order, required milestone coverage, and the presence of the expected context, legal-context, and significance fields.
  - [x] Extend `tests/e2e/home.spec.ts` to verify the first event is selected on initial render, selecting timeline events updates the detail panel, keyboard traversal follows the intended interaction model, the selected state is both visible and semantic, the responsive layout stays contained, and the dossier still preserves its canonical anchor and recap handoff.
  - [x] Verify exact milestone order and text in the rendered timeline so a scrambled or renamed chronology does not pass smoke coverage.
  - [x] Reuse role-based locators and geometry assertions instead of snapshots or sleeps.

### Review Findings

- [x] [Review][Patch] Define the initial selected event and first-render detail copy so AC 1 has a concrete baseline, not just a post-click state.
- [x] [Review][Patch] Replace "selected state is obvious" with an explicit visual and semantic contract for the active event so the implementation cannot hide selection in an ambiguous way.
- [x] [Review][Patch] Add the legal-context layer to the timeline brief because a date rail alone does not satisfy the dossier's evidence-led learning goal.
- [x] [Review][Patch] Clarify what "post-ruling enforcement limitations" must cover so the copy does not drift into generic commentary or omit the governance lesson.
- [x] [Review][Patch] Make the readability and compactness requirement measurable; "compact" and "at a glance" are too subjective to verify consistently.
- [x] [Review][Patch] Specify the keyboard interaction model for moving between events, including whether arrow keys or tab order drive the sequence, so AC 4 can be tested unambiguously.
- [x] [Review][Patch] Define the focus behavior when an event is selected; visible focus alone does not say whether focus stays on the trigger or moves to the detail region.
- [x] [Review][Patch] Add an accessible linkage between the selector and the detail region, such as `aria-controls` or `aria-labelledby`, so screen readers can follow state changes.
- [x] [Review][Patch] Tighten the reduced-motion contract so meaning never depends on animation timing or motion cues, not just "subtle" transitions.
- [x] [Review][Patch] Require the DOM order to remain chronological across stacked and hybrid layouts; visual reflow alone is not enough for keyboard and assistive-tech users.
- [x] [Review][Patch] Require the timeline to remain the first interactive layer after the case-opening shell so later comparison or evidence work cannot leapfrog chronology.
- [x] [Review][Patch] Rework the `aria-pressed` guidance or name the intended pattern explicitly, because a one-of-many timeline selector is not obviously a toggle-button group.
- [x] [Review][Patch] Add a verification step for exact milestone order and text, not just generic selection behavior, so a scrambled timeline does not pass.
- [x] [Review][Patch] Preserve and explicitly test the dossier anchor, focus, and recap handoff contract so timeline work cannot regress Story 3.1.
- [x] [Review][Patch] Add motion-reduce overrides to the timeline selector buttons so the selected state does not still animate through the shared Button transition contract. [src/components/modules/WpsDossier/WpsDossier.tsx:123]
- [x] [Review][Patch] Use a true selected-state pattern for the timeline controls instead of `aria-current` so assistive tech exposes the active milestone as selection. [src/components/modules/WpsDossier/WpsDossier.tsx:128]

## Dev Notes

### Current State

- `App.tsx` already routes `west-philippine-sea-dossier` through `WpsDossier`; no navigation or router change is expected for this story.
- `WpsDossier.tsx` currently renders the shell, two entry buttons, the authored summary/thesis/supporting details/disclosure/synthesis, and the recap card. There is no timeline state yet.
- `west-philippine-sea-dossier.ts` currently exports the narrative content and shell copy only. Add the ordered event data there so chronology stays reviewable and testable.
- `tests/e2e/home.spec.ts` currently verifies the shell, focus restoration, and recap handoff. Extend it rather than replacing it.
- `UNCommandCenter.tsx` is the closest local precedent for button-driven selection, detail regions, and visible selected-state targeting, but the dossier timeline should choose the selector semantics that best fit a one-of-many chronology control instead of copying `aria-pressed` blindly.
- `NarrativeSection.tsx` and `InsightRecapCard.tsx` show the shared disclosure and recap patterns that must stay intact.
- `src/index.css` already has dossier-specific shell classes; only add new global styling if the timeline needs a shared layout treatment.

### Carry-Forward from Story 3.1

- The dossier shell is already anchored, focus-restored, and visually framed as a case file, so this story should deepen that surface rather than reframe it.
- Preserve the existing summary, thesis, supporting details, disclosure, synthesis, and recap flow from `src/data/sections/west-philippine-sea-dossier.ts`.
- Keep the canonical hash and recap chain intact: `governance-limits` -> `west-philippine-sea-dossier` -> `conclusion-references`.
- The prior shell story already established the evidence-led tone; timeline work should make the chronology clearer without turning the chapter into a long article.
- Use the same accessibility stance as the UN module: real buttons, visible focus, readable state changes, and no hover-only meaning.

### Story Scope Boundaries

- This story should add the chronological timeline and event detail behavior only.
- Do not implement the ruling-versus-reality comparison or source drawer yet; those belong to later Epic 3 stories.
- Do not add a new route or separate page.
- Keep the existing recap target and chapter order unchanged.
- The timeline should be compact, readable, and evidence-led, not a second intro block or an unstructured essay.
- The first-render state must already communicate the chronology by selecting the opening milestone and showing its detail content without requiring an initial interaction.
- If the implementation needs a local subcomponent, keep it inside `src/components/modules/WpsDossier/` rather than moving logic into shared UI or section folders.

### Architecture Guardrails

- Follow the SPA-first React + Vite + TypeScript structure already used in the repo.
- Keep the dossier module in `src/components/modules/WpsDossier/` and the ordered event data in `src/data/sections/west-philippine-sea-dossier.ts`.
- Keep shadcn/ui primitives in `src/components/ui` and use them instead of inventing custom controls.
- Use local component state for the selected event; do not introduce a store, router, or cross-cutting navigation changes.
- Preserve keyboard access, visible focus states, reduced-motion behavior, and no-horizontal-scroll behavior at 360 px, 768 px, 1024 px, and 1440 px.
- Keep the timeline readable as a selection surface with a stable detail panel; avoid a long, monolithic narrative block.
- Preserve the dossier recap handoff and the canonical anchor restoration contract already handled by the navigation layer.

### Testing Standards Summary

- Use `tests/e2e/home.spec.ts` as the main smoke harness for the dossier.
- Verify initial selected-event behavior, selected-state semantics, keyboard traversal, responsive containment, visible focus, and reduced-motion safety if any transitions animate.
- Add a focused unit test for the ordered timeline data, exact milestone sequence, and required milestone fields.
- Prefer role-based locators, bounding-box checks, and keyboard flow assertions over snapshots or sleeps.
- Re-check the dossier’s hash-entry and recap handoff so this story does not regress the shell story.

### Latest Tech Notes

- The repo currently pins `react` and `react-dom` at `^19.2.4`, `vite` at `^7.3.1`, and `@playwright/test` at `^1.59.1` in `package.json`.
- Official Playwright docs continue to recommend user-facing locators such as `getByRole()` and media emulation via `page.emulateMedia()`, which matches the existing smoke-test style and the new timeline interaction pattern.
- Playwright locator guidance also favors chaining role locators and filtering by text or descendants instead of brittle CSS selectors, which fits the timeline-card selection model.
- Official Vite releases say Vite 8 is the current stable line, while 7.3 remains supported with fixes. Do not treat a toolchain upgrade as part of this story.

### Project Structure Notes

- Likely new module home: `src/components/modules/WpsDossier/`
- Likely update: `src/components/modules/WpsDossier/WpsDossier.tsx`
- Likely update: `src/data/sections/west-philippine-sea-dossier.ts`
- Likely update: `tests/e2e/home.spec.ts`
- Likely add: `src/data/sections/west-philippine-sea-dossier.test.ts`
- Possibly update: `src/index.css` if the timeline needs a shared dossier-specific surface
- Usually no need to touch: `src/App.tsx`, `src/data/navigation.ts`, `src/data/sections/core-narrative.ts`, `src/contexts/NavigationContext.tsx`

### References

- [Source: `_bmad-output/planning-artifacts/epics.md`, Epic 3 overview and Story 3.2]
- [Source: `_bmad-output/planning-artifacts/prd.md`, FR5, FR15-FR21, NFR17-NFR21]
- [Source: `_bmad-output/planning-artifacts/ux-design-specification.md`, West Philippine Sea Interactive Dossier, Breakpoint Strategy, Accessibility Strategy, Testing Strategy]
- [Source: `_bmad-output/planning-artifacts/ux-design-directions.html`, Direction 5 Casefile Immersion]
- [Source: `_bmad-output/planning-artifacts/ux-color-themes.html`, dossier theme notes]
- [Source: `_bmad-output/planning-artifacts/implementation-readiness-report-2026-04-24.md`, PRD Analysis, Epic Coverage Validation, UX Alignment Assessment]
- [Source: `src/App.tsx`, current section rendering flow]
- [Source: `src/components/modules/WpsDossier/WpsDossier.tsx`, current case-file shell and entry controls]
- [Source: `src/data/sections/west-philippine-sea-dossier.ts`, current narrative content and shell copy]
- [Source: `src/components/modules/UNCommandCenter/UNCommandCenter.tsx`, local precedent for selection state and responsive comparison]
- [Source: `src/components/sections/NarrativeSection.tsx`, shared disclosure pattern]
- [Source: `src/components/sections/InsightRecapCard.tsx`, canonical recap handoff]
- [Source: `tests/e2e/home.spec.ts`, current smoke harness]
- [Source: `src/index.css`, dossier shell styles and existing editorial classes]
- [Source: `src/data/navigation.ts`, canonical section ids and hash targets]
- [Source: `src/contexts/NavigationContext.tsx`, anchor/focus restoration contract]
- [Source: https://playwright.dev/docs/locators, locator best practices]
- [Source: https://playwright.dev/docs/emulation, media emulation]
- [Source: https://vite.dev/releases, supported Vite version guidance]

## Story Completion Status

- done
- Timeline context analysis completed - comprehensive developer guide created

## Dev Agent Record

### Agent Model Used

GPT-5 Codex

### Debug Log References

- Context gathered from sprint status, epics, PRD, architecture, UX specification, UX directions, color themes, implementation-readiness report, the current dossier shell implementation, the UN module precedent, navigation/focus code, and the existing smoke harness.
- Repository versions checked in `package.json`: React 19.2.4, Vite 7.3.1, Playwright 1.59.1.
- Official Playwright guidance reviewed for role-based locators and media emulation. Vite release guidance reviewed to confirm Vite 8 exists but is not required for this story.
- The story is intentionally narrow: add the chronology layer only; later Epic 3 stories own the comparison panel and evidence drawer.
- GitNexus impact run before editing `WpsDossier`: LOW risk, no direct upstream callers or modules; data constants were not indexed as symbols.
- Verification run: `pnpm exec vitest run src`, `pnpm typecheck`, `pnpm lint`, `pnpm build`, and `pnpm exec playwright test` all passed. Plain `pnpm exec vitest run` also attempted to load Playwright specs and failed as an expected runner-scope mismatch, so Vitest was scoped to `src`.
- GitNexus detect_changes run after implementation: MEDIUM scope due to existing dirty docs/skill files plus story work; affected code flows were the expected `WpsDossier` processes.

### Completion Notes List

- The timeline should stay compact, selectable, and evidence-led.
- Keep the dossier shell, recap handoff, and canonical anchor behavior intact.
- Prefer the UN module’s accessible selection pattern over inventing a new interaction model.
- Preserve the authored case narrative and do not duplicate it in the timeline UI.
- Added the ordered West Philippine Sea case timeline with 2012, 2013, 2016, and post-2016 enforcement-limits milestones.
- Added a compact selector/detail interaction that defaults to the first event, uses real buttons, `aria-current="step"`, `aria-controls`, detail `aria-labelledby`, visible selected labeling, and local state without moving focus on selection.
- Extended E2E coverage for first-render selection, chronology order, detail updates, keyboard traversal, responsive containment, reduced-motion safety, canonical anchor behavior, and recap handoff.
- Added a focused Vitest data test for timeline order, milestone coverage, compact summaries, and required context/legal-context/significance fields.

### File List

- _bmad-output/implementation-artifacts/3-2-follow-the-timeline.md
- _bmad-output/implementation-artifacts/sprint-status.yaml
- src/components/modules/WpsDossier/WpsDossier.tsx
- src/data/sections/west-philippine-sea-dossier.ts
- src/data/sections/west-philippine-sea-dossier.test.ts
- tests/e2e/home.spec.ts

### Change Log

- 2026-04-27: Implemented Story 3.2 timeline interaction, data, accessibility/responsive behavior, and verification coverage.
