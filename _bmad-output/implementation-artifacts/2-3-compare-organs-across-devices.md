# Story 2.3: Compare Organs Across Devices

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a learner,
I want the UN module to support comparison on both large and small screens,
so that I can study the institutions comfortably regardless of device.

## Acceptance Criteria

1. Given I view the UN module on desktop, when the comparison view renders, then the layout can present organ differences in a clear comparative structure, and the comparison remains readable without crowding the panel.
2. Given I view the UN module on tablet or mobile, when the layout adapts, then the module collapses into a stacked or hybrid layout that still preserves the key organ details, and no horizontal scrolling is required.
3. Given reduced motion is enabled, when I switch organs or move through the module, then motion is restrained and never obscures the text or state change, and the content remains understandable.
4. Given I use keyboard only, when I explore comparison controls, then every control is reachable and has a visible focus state, and I can complete the module without a mouse.
5. Given I scan the module on any target breakpoint, when I look for the organ content, then nothing depends on hover alone to understand the comparison, and the module remains readable and consistent with the main design language.

## Tasks / Subtasks

- [x] Refine the UN organ comparison layout across breakpoints. (AC: 1, 2, 3, 5)
  - [x] Update `src/components/modules/UNCommandCenter/UNCommandCenter.tsx` so the selector, detail panel, and supporting labels read as a clear comparison surface on desktop while still collapsing cleanly on tablet and mobile.
  - [x] Keep the organ data, selected state, shell intro, summary, and recap card from Story 2.2 intact; this story is layout polish, not a content rewrite.
  - [x] Avoid horizontal overflow, swipe-only carousels, or hover-only comparisons; preserve explicit organ buttons and visible selected state.
- [x] Preserve motion, focus, and reading behavior while the layout adapts. (AC: 2, 3, 4, 5)
  - [x] Keep reduced-motion behavior intact so layout shifts and selection changes do not obscure text or state changes.
  - [x] Maintain keyboard reachability and visible focus for every comparison control and selection path.
  - [x] Ensure the stacked or hybrid mobile/tablet composition remains readable at 360 px, 768 px, and desktop widths without clipping or crowding.
- [x] Extend smoke coverage for responsive comparison behavior. (AC: 1-5)
  - [x] Update `tests/e2e/home.spec.ts` to verify desktop comparative structure, tablet/mobile stacked or hybrid behavior, no horizontal scrolling, keyboard access, and reduced-motion safety.
  - [x] Use rendered layout and geometry assertions instead of snapshots or fixed delays.
  - [x] Keep the existing UN shell and organ-selection coverage from Story 2.2 intact.
  - [x] Add a narrow local comparison subcomponent only if it genuinely improves readability and maintainability.

## Dev Notes

### Current State

- Story 2.2 is complete. `UNCommandCenter` already owns local organ selection state, the shell intro, the entry controls, the live detail panel, the `aria-pressed` organ buttons, and the current grid-based responsive split.
- The module already uses an accessible anchor, focus restoration, and a no-horizontal-scroll baseline from the core journey.
- The desktop layout currently flips into a two-column grid at large screens, while smaller screens stack naturally. The remaining work is to make that arrangement read as a deliberate comparison experience rather than only a responsive split.
- `tests/e2e/home.spec.ts` already covers the shell, organ switching, keyboard activation, reduced motion, and general no-overflow checks. Extend rather than replace it.
- `src/contexts/NavigationContext.tsx` still owns hash navigation and focus recovery. Keep that contract intact.
- `src/data/sections/un-command-center.ts` already contains the authored organ dataset and shell copy. Do not move the chapter voice into JSX.

### Previous Story Intelligence

- Story 2.2 already fixed the shell and organ explorer. Keep the current selection semantics and detail panel, and do not reintroduce invalid list semantics or empty-state regressions.
- Story 1.7 established responsive, keyboard, touch, and reduced-motion hardening across the core journey. Reuse those contracts instead of inventing a new interaction model.
- The current comparison outcome from Story 2.2 is already "can tell the organs apart and understand their roles." This story upgrades the layout presentation across devices, not the interaction model.

### Implementation Guardrails

- Keep the current organ data and selection model. This story is about responsive comparison polish, not a new organ architecture.
- Do not introduce a carousel, swipe rail, new route, global store, or other navigation model.
- Preserve explicit button semantics, `aria-pressed`, region labels, and live details. No hover-only or pointer-only meaning.
- Keep the module legible on desktop, tablet, and mobile. Prefer split comparison on large screens and stacked or hybrid reading on smaller screens.
- Maintain reduced-motion safety and visible focus states throughout the comparison surface.
- If a helper cue is needed, keep it in `src/data/sections/un-command-center.ts` or a narrow local type, not JSX literals.
- Do not upgrade dependencies or introduce a new UI primitive unless there is a clear need.

### Testing Standards Summary

- Use `tests/e2e/home.spec.ts` as the main harness.
- Verify the module at representative widths, including 360 px, 768 px, 1024 px, and 1440 px.
- Assert desktop comparative structure, stacked or hybrid small-screen behavior, no horizontal overflow, keyboard reachability, visible focus, and reduced-motion safety.
- Prefer bounding-box or layout assertions on the rendered page over snapshots or fixed sleeps.
- Keep the current hash-entry, shell, and organ-selection coverage in place.

### Project Structure Notes

- Likely update: `src/components/modules/UNCommandCenter/UNCommandCenter.tsx`, `tests/e2e/home.spec.ts`
- Likely add: `src/components/modules/UNCommandCenter/UNOrganComparison.tsx` or a similarly narrow local subcomponent if the comparison layout becomes easier to maintain that way
- Usually no need to touch: `src/App.tsx`, `src/data/navigation.ts`, `src/contexts/NavigationContext.tsx`
  - unless a tiny authored cue in `src/data/sections/un-command-center.ts` is required for the responsive layout

### References

- [Source: _bmad-output/planning-artifacts/epics.md, Epic 2: UN Institutional Explorer, Story 2.3]
- [Source: _bmad-output/planning-artifacts/prd.md, FR13-FR14, NFR19-NFR21, UX-DR11, UX-DR21-35]
- [Source: _bmad-output/planning-artifacts/architecture.md, Frontend Architecture]
- [Source: _bmad-output/planning-artifacts/architecture.md, Requirements to Structure Mapping]
- [Source: _bmad-output/planning-artifacts/architecture.md, Responsive Design & Accessibility]
- [Source: _bmad-output/planning-artifacts/architecture.md, Testing Strategy]
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md, UN Organ Explorer]
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md, Responsive Strategy]
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md, Breakpoint Strategy]
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md, Accessibility Strategy]
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md, Testing Strategy]
- [Source: _bmad-output/project-context.md, Framework-Specific Rules]
- [Source: _bmad-output/project-context.md, Critical Implementation Rules]
- [Source: src/components/modules/UNCommandCenter/UNCommandCenter.tsx, current responsive organ explorer]
- [Source: src/data/sections/un-command-center.ts, current organ dataset and shell copy]
- [Source: tests/e2e/home.spec.ts, existing UN smoke coverage]

## Story Completion Status

- done
- Ultimate context engine analysis completed - comprehensive developer guide created

## Change Log

- 2026-04-27: Implemented responsive UN organ comparison layout polish, extended Playwright smoke coverage, and marked the story done.
- 2026-04-27: Created ready-for-dev story context for the UN comparison layout polish, grounded in the implemented organ explorer and the responsive requirements from the epic, PRD, architecture, and UX spec.

## Dev Agent Record

### Agent Model Used

GPT-5 Codex

### Debug Log References

- Reviewed Epic 2 Story 2.3, the completed Story 2.2 implementation, current UN module code, current Playwright smoke coverage, recent Epic 2 commits, and the responsive guidance in the PRD, architecture, and UX spec.
- Confirmed the current `UNCommandCenter` implementation already uses local selection state, a live detail panel, and a responsive grid split that needs device-specific comparison polish rather than a redesign.
- Ran GitNexus impact analysis for `UNCommandCenter`: LOW risk, 0 direct callers, 0 affected processes.
- Added a failing Playwright responsive-comparison smoke test first, then implemented the comparison layout markers and containment needed to pass it.
- Ran `pnpm format`, `pnpm lint`, `pnpm typecheck`, `pnpm build`, and `pnpm test:e2e`; all passed.

### Completion Notes List

- Story scope is intentionally narrow: comparison layout polish only.
- Existing shell, organ data, selection state, hash navigation, and focus handling remain in place.
- The story explicitly blocks carousel-style, hover-only, or pointer-only comparison patterns.
- Added an explicit comparison surface with selector/detail layout hooks, responsive containment, and denser detail cards that preserve the existing organ content.
- Extended Playwright coverage for 360 px, 768 px, 1024 px, and 1440 px across default and reduced-motion modes, including geometry, overflow, keyboard focus, and selection checks.
- Kept the implementation within the existing `UNCommandCenter` component; no new subcomponent or dependency was needed.

### File List

- _bmad-output/implementation-artifacts/2-3-compare-organs-across-devices.md
- _bmad-output/implementation-artifacts/sprint-status.yaml
- src/components/modules/UNCommandCenter/UNCommandCenter.tsx
- tests/e2e/home.spec.ts
