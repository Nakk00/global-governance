# Story 2.1: Introduce the UN Command Center

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a learner,
I want the UN section to explain what the Command Center is for,
so that I understand the institutional context before I start exploring the organs.

## Scope Clarification

- This story creates the UN Command Center shell and introduction state. It does not implement the full organ selector or comparison behavior yet.
- Keep the single-page anchor-navigation model intact. Do not add React Router, a global store, or any new page flow.
- Preserve the existing `un-command-center` anchor, section label, recap chain, and focus-restoration contract.
- Reuse the authored chapter copy in `src/data/sections/un-command-center.ts`; do not move the chapter voice into JSX literals.
- The shell should feel like an invitation to explore, not a long article. Visible entry controls and a summary area are required.
- Keep the initial entry controls scoped to shell-level affordances such as `Explore the Command Center`, `Why the UN matters`, or a summary/disclosure cue. Do not introduce per-organ selection UI in this story.
- Keep keyboard, touch, responsive, and reduced-motion behavior aligned with the hardening already established in Story 1.7.

## Acceptance Criteria

1. Given I open the UN section, when the module renders, then it introduces the United Nations as an institutional system within global governance and makes clear that the section is meant for exploration, not just reading.
2. Given I arrive from the main learning journey, when the UN section loads, then it feels like a continuation of the same page, preserves the broader narrative context, and keeps the `UN Command Center` chapter identity and `un-command-center` anchor intact.
3. Given the module is visible on desktop or mobile, when I inspect the layout, then I can see the module's main entry controls and summary area without needing to hunt for them, and those controls are readable and labeled.
4. Given I use keyboard only, when I enter the section, then the module's primary controls are reachable, show visible focus states, and I can begin exploring without a pointer device.
5. Given I view the module at 360 px, 768 px, and desktop widths with reduced motion enabled, when I interact with the page, then the shell remains readable, does not require horizontal scrolling, and keeps the rest of the learning flow usable.
6. Given I jump directly to `#un-command-center` or move through the page with the navigation controls, when focus is restored, then the section container remains focusable and the active chapter state still reports the UN section correctly.

## Tasks / Subtasks

- [x] Introduce a dedicated UN Command Center shell component and wire it into the chapter composition. (AC: 1, 2, 6)
  - [x] Add a dedicated `src/components/modules/UNCommandCenter/` component that renders the intro, summary, and visible exploration entry area.
  - [x] Route the `un-command-center` chapter through the new module from `src/App.tsx` or a small section registry, while leaving the other chapters on `NarrativeSection`.
  - [x] Preserve the section id, chapter label, recap target, and hash/focus behavior already used by the rest of the journey.
- [x] Add the visible summary and exploration entry area. (AC: 1, 3, 4)
  - [x] Present the Command Center summary in a clearly labeled surface with action-oriented shell controls, not organ-selection controls.
  - [x] Use shared shadcn primitives such as `Button` and the existing editorial surface classes instead of ad hoc clickable containers.
  - [x] Make the shell feel like a doorway into the module, not a wall of copy.
- [x] Keep the shell responsive, accessible, and motion-safe. (AC: 2, 4, 5, 6)
  - [x] Respect reduced-motion preferences and no-horizontal-scroll constraints at 360 px, 768 px, and desktop widths.
  - [x] Keep focus states visible and touch targets at least 44x44 px.
  - [x] Preserve the current anchor-navigation and current-chapter behavior from Story 1.7.
- [x] Extend smoke coverage for the new UN shell. (AC: 1-6)
  - [x] Update `tests/e2e/home.spec.ts` to assert the UN shell intro, visible entry controls, keyboard path, responsive visibility, and direct hash-entry continuity.
  - [x] Add a co-located unit or component test only if a reusable helper or data-shaping utility is extracted; otherwise keep the change covered by Playwright.

## Dev Notes

- The current app renders narrative chapters by mapping `coreNarrativeSections` from `src/data/sections/core-narrative.ts` inside `src/App.tsx`, and `src/data/sections/un-command-center.ts` already contains the chapter copy and recap target. Treat this story as a dedicated shell for that chapter, not as a new navigation system.
- `src/contexts/NavigationContext.tsx`, `src/components/layout/Navbar.tsx`, `src/components/layout/MobileMenu.tsx`, and `src/components/layout/SectionProgressRail.tsx` already handle anchor navigation, focus restoration, and active chapter state. Reuse that contract.
- Keep the accessible section name `UN Command Center` unchanged. The current navigation, hash handling, and smoke tests depend on it.
- Reuse the editorial token system and button hierarchy established in Stories 1.6 and 1.7. The new shell should inherit the existing `editorial-*` surfaces and the shared `Button` hit-area/focus behavior.
- Do not add organ-selection state, comparison logic, or a new route. Story 2.1 is the shell and entry experience only; Story 2.2 owns the organ interaction and Story 2.3 owns the cross-device comparison treatment.
- If the shell needs extra metadata, keep it in `src/data/sections/un-command-center.ts` or a narrow UN module type under `src/data/sections`. Avoid hardcoding chapter copy in the component body.
- Keep the section focusable and recoverable with the same SPA anchor behavior used everywhere else. If the shell changes the layout structure, make sure the region still behaves like a chapter target on hash entry and scroll jumps.
- Preserve the reduced-motion and no-overflow guarantees already hardened in the core journey. The UN shell should not introduce hover-only affordances, hidden controls, or new motion dependencies.

### Previous Story Intelligence

- Story 1.7 already hardened responsive, keyboard, touch, and reduced-motion behavior across the shell. The UN module should follow those same layout and focus contracts rather than inventing a new interaction style.
- Story 1.6 established the shared editorial token language and action hierarchy. Keep the UN shell visually aligned with the rest of the site instead of creating a separate visual system.
- Story 1.5 established recap re-entry cues and the `journey-start` return path. Keep that path stable so the UN chapter remains part of the same narrative chain.
- Story 1.3 stabilized hash navigation and focus recovery. Preserve that behavior when the UN shell is introduced.

### Testing Standards Summary

- Use `tests/e2e/home.spec.ts` as the primary regression harness for this story.
- Add UN-specific assertions for:
  - visible intro and summary area
  - readable, labeled entry controls
  - keyboard-only focus and pointer-free activation
  - no horizontal overflow at 360 px, 768 px, and desktop widths
  - reduced-motion behavior remaining intact in the UN shell
  - direct hash entry into `#un-command-center` still restoring focus and active chapter state
- Keep the existing navigation and chapter-progress assertions intact.
- Add a co-located unit or component test only if you extract a reusable helper or data transformer; otherwise do not add a new test file just for the shell.
- Verify on the rendered page rather than through snapshots, especially if the shell uses collapsible or button-based entry affordances.

### Project Structure Notes

- Likely add:
  - `src/components/modules/UNCommandCenter/UNCommandCenter.tsx`
  - any small local subcomponents or helpers in `src/components/modules/UNCommandCenter/`
- Likely update:
  - `src/App.tsx`
  - `src/data/sections/un-command-center.ts`
  - `tests/e2e/home.spec.ts`
- Usually no need to touch:
  - `src/data/navigation.ts`
  - `src/contexts/NavigationContext.tsx`
  - `src/components/layout/*`
  - `src/components/sections/NarrativeSection.tsx`
unless a very small shared helper becomes necessary.
- If chapter-specific rendering is introduced, prefer a narrow registry or conditional composition rooted in `src/data/sections/core-narrative.ts` plus `src/App.tsx` rather than moving navigation behavior into the module itself.
- Keep new module names in PascalCase with readable acronym handling, matching the repo's convention such as `UNCommandCenter`.

### References

- [Source: _bmad-output/planning-artifacts/epics.md, Epic 2: UN Institutional Explorer, Story 2.1]
- [Source: _bmad-output/planning-artifacts/epics.md, Epic 2: UN Institutional Explorer, Story 2.2]
- [Source: _bmad-output/planning-artifacts/epics.md, Epic 2: UN Institutional Explorer, Story 2.3]
- [Source: _bmad-output/planning-artifacts/prd.md, FR13-FR14, NFR19-NFR21, UX-DR11, UX-DR21-35]
- [Source: _bmad-output/planning-artifacts/architecture.md, Technical Constraints & Dependencies]
- [Source: _bmad-output/planning-artifacts/architecture.md, Frontend Architecture]
- [Source: _bmad-output/planning-artifacts/architecture.md, Requirements to Structure Mapping]
- [Source: _bmad-output/planning-artifacts/architecture.md, Responsive Design & Accessibility]
- [Source: _bmad-output/planning-artifacts/architecture.md, Testing Strategy]
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md, Component Strategy]
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md, UN Organ Explorer]
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md, Responsive Strategy]
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md, Accessibility Strategy]
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md, Testing Strategy]
- [Source: _bmad-output/project-context.md, Framework-Specific Rules]
- [Source: _bmad-output/project-context.md, Critical Implementation Rules]
- [Source: src/data/sections/un-command-center.ts, current UN chapter content and recap target]
- [Source: src/data/navigation.ts, chapter order and `un-command-center` anchor]
- [Source: src/contexts/NavigationContext.tsx, anchor-navigation and focus restoration]
- [Source: src/App.tsx, current chapter composition]
- [Source: src/components/sections/NarrativeSection.tsx, current shared section shell]
- [Source: src/components/layout/Navbar.tsx, current chapter progress and return-to-start controls]
- [Source: src/components/layout/MobileMenu.tsx, mobile chapter navigation]
- [Source: src/components/layout/SectionProgressRail.tsx, desktop progress rail]
- [Source: src/components/ui/button.tsx, shared action primitive]
- [Source: tests/e2e/home.spec.ts, smoke coverage baseline]

## Story Completion Status

- done
- Dedicated UN Command Center shell implemented; organ selection and device comparison remain intentionally deferred to Stories 2.2 and 2.3.

## Change Log

- 2026-04-26: Created ready-for-dev story context for the UN Command Center shell, aligned to the existing single-page navigation contract and the future organ explorer work in Stories 2.2 and 2.3.
- 2026-04-26: Implemented the UN Command Center shell, shell metadata, App wiring, and Playwright smoke coverage.

## Dev Agent Record

### Agent Model Used

GPT-5 Codex

### Debug Log References

- 2026-04-26: Reviewed Epic 2 Story 2.1, PRD FR13-FR14, NFR19-NFR21, UX-DR11, architecture frontend/responsive guidance, and the current UN chapter composition.
- 2026-04-26: Confirmed `src/data/sections/un-command-center.ts` already contains the chapter copy and recap target, while `src/components/modules/` is still empty.
- 2026-04-26: Reviewed the existing Playwright baseline in `tests/e2e/home.spec.ts` to keep the new coverage aligned with the current navigation and focus contract.
- 2026-04-26: Started implementation on `codex/story-2-1-introduce-the-un-command-center`; GitNexus impact for `App` reported LOW risk, 0 direct callers, and 0 affected processes.
- 2026-04-26: Added a failing Playwright assertion for the UN shell intro, summary region, entry controls, keyboard activation, and hash-entry continuity; confirmed it failed before implementation.
- 2026-04-26: GitNexus change detection after implementation reported low risk and 0 affected execution flows for indexed changes.

### Completion Notes List

- Added a dedicated `UNCommandCenter` module that preserves the `un-command-center` anchor, `UN Command Center` accessible region name, recap cue, and same-page focus behavior.
- Added shell metadata beside the existing UN chapter copy so the component renders authored intro, summary label, and shell-level entry controls without moving copy into JSX.
- Added Playwright smoke coverage for the UN intro, summary region, visible controls, keyboard expansion path, touch target size, direct hash entry, active chapter state, and current chapter reporting.
- Verified with `pnpm typecheck`, `pnpm lint`, `pnpm test:e2e tests/e2e/home.spec.ts`, and `pnpm build`.

### File List

- _bmad-output/implementation-artifacts/2-1-introduce-the-un-command-center.md
- _bmad-output/implementation-artifacts/sprint-status.yaml
- src/App.tsx
- src/components/modules/UNCommandCenter/UNCommandCenter.tsx
- src/data/sections/un-command-center.ts
- tests/e2e/home.spec.ts
