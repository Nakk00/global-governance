# Story 1.3: Navigate the Story

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a learner,
I want visible navigation and orientation cues,
so that I can move between major sections without getting lost.

## Acceptance Criteria

1. Given the major sections are present, when I use the top navigation, section progress rail, or mobile navigation control, then I can jump directly to any chapter-level section in the canonical learning flow. The navigation targets remain stable across direct clicks, hash entry, refresh, and browser back/forward behavior, and the `journey-start` landing target from Story 1.2 remains valid.
2. Given I move from one section to another, when the active section changes, then the navigation state, completed-state cue, or current chapter label updates to show where I am. I can see which part of the journey I am in.
3. Given I jump away from the current section and then return, when I land back on the page through a nav click, hash link, or browser history, then I can recover my place with visible labels or progress cues and focus moves to a readable section landmark or heading. The page does not leave me disoriented.
4. Given I use keyboard only, when I move through navigation controls, then each control is reachable, has a visible focus state, and can be activated without a pointer device. On touch-capable layouts, the interactive targets remain at least 44x44 px.
5. Given I use a small screen, when navigation collapses, then it remains usable, can be dismissed after selection, and does not cover the core content. The section flow stays readable and there is no focus trap.

## Tasks / Subtasks

- [x] Add a shared navigation data source and section ordering map (AC: 1, 2, 3)
  - [x] Create `src/data/navigation.ts` with the canonical learning-flow order, anchor IDs, visible labels, and any section metadata needed by both the top navigation and progress rail.
  - [x] Keep the section order aligned with the UX canonical sequence so later stories can plug content into the same anchors without renaming them.
  - [x] Avoid hard-coding section labels in multiple components.
- [x] Build the navigation shell and section progress rail (AC: 1, 2, 3, 5)
  - [x] Add `src/components/layout/AppShell.tsx`, `Navbar.tsx`, `MobileMenu.tsx`, and `SectionProgressRail.tsx` per the architecture map.
  - [x] Use a persistent desktop nav plus a condensed mobile presentation that preserves the same chapter-level destinations without covering the content.
  - [x] Include a visible current-location indicator, completed-state treatment, and a return-to-top or quick-reset action so users can reorient quickly after jumping around.
  - [x] Keep the navigation anchored in the SPA and avoid React Router or any global store.
- [x] Wire active-section tracking and in-page jump behavior (AC: 1, 2, 3, 4)
  - [x] Use a thin `NavigationContext` or focused hook such as `useActiveSection` to track the active section with local state and/or `IntersectionObserver`.
  - [x] Update the active state from scroll position, anchor clicks, hash changes, and browser history events so the current chapter is obvious even after jumping away and back.
  - [x] Reconcile the active section on initial load and hash entry, and fall back to the first canonical chapter when the hash is missing or invalid.
  - [x] Use deterministic section selection rules so nested content and transition blocks do not cause active-state flicker when multiple anchors are visible.
  - [x] When the viewport sits between anchors, prefer a stable nearest-previous or canonical default selection so the chapter label never blanks out.
  - [x] Preserve stable hash navigation semantics and move focus to the destination section landmark or heading so keyboard users land on a readable target.
  - [x] Ignore no-op clicks on the currently active destination so duplicate history entries are not created.
- [x] Make the controls accessible and responsive (AC: 4, 5)
  - [x] Use `aria-current`, clear labels, and visible focus states for every nav item.
  - [x] Ensure mobile collapse stays within touch-friendly bounds, uses at least 44x44 px touch targets, and does not obscure the current reading position.
  - [x] Provide an explicit dismiss path for the compact mobile nav, and auto-close it when the viewport expands back to desktop width.
  - [x] Add any anchor-offset or `scroll-padding-top` support needed so sticky UI does not cover section headings.
- [x] Extend smoke coverage for orientation behavior (AC: 1-5)
  - [x] Update `tests/e2e/home.spec.ts` to verify desktop section jumps, active-section state, keyboard-only traversal, hash-entry deep links, refresh/back-forward restoration, and the mobile-collapsed nav state.
  - [x] Add coverage for initial hash landing, invalid-hash fallback, compact-nav dismissal, and breakpoint-driven mobile-nav reset.
  - [x] Keep the responsive pass at 360, 480, 768, 1024, and large desktop widths and assert no horizontal overflow.
  - [x] Verify reduced-motion behavior still preserves usable in-page navigation and does not make smooth scrolling required.
  - [x] Add a small hook/component test only if active-section logic is extracted into reusable code that benefits from unit coverage.

### Review Findings

- [x] [Review][Decision] Resolve whether the first canonical navigation target should be the Hero Narrative Frame or `journey-start` - Resolved by making the Hero Narrative Frame the first canonical navigation target while keeping `journey-start` as a valid Story 1.2 landing target.
- [x] [Review][Patch] Active-link no-op can leave a stale hash [src/contexts/NavigationContext.tsx:58]
- [x] [Review][Patch] Hashless browser-history return does not restore focus to a readable landmark [src/contexts/NavigationContext.tsx:77]
- [x] [Review][Patch] Mobile navigation overlays core content while open [src/components/layout/MobileMenu.tsx:53]
- [x] [Review][Patch] Mobile navigation can overflow short viewports without an internal scroll path [src/components/layout/MobileMenu.tsx:53]
- [x] [Review][Patch] User-interrupted programmatic scrolling can leave orientation state stale [src/contexts/NavigationContext.tsx:110]

## Dev Notes

- This story is the first cross-cutting navigation layer after the opening hero. Keep it focused on orientation, not on expanding the core narrative content.
- Architectural guardrails: SPA-first, single-page anchor navigation, no React Router, no global store, no public maintainer dashboard.
- If shared state is required, keep it in a thin navigation context or a focused hook. Do not introduce a heavyweight state library.
- The canonical learning-flow sequence comes from the UX spec: Hero Narrative Frame, global governance overview, UN Command Center, governance limits and enforcement, West Philippine Sea Interactive Dossier, conclusion and references.
- Keep the top-level navigation limited to those chapter-level destinations so the rail stays a stable orientation tool rather than a second content hierarchy.
- Navigation should be driven from one source of truth so the top nav, progress rail, and future section landmarks stay aligned.
- Keep the current `journey-start` landing target from Story 1.2 intact. This story should build around it, not replace it.
- Use stable in-page destinations with focusable landmarks or headings so users can return to a clear place after jumping around the page.
- The mobile presentation should collapse rather than disappear. If the screen is too narrow for the full rail, use a compact control that still exposes the same destinations.
- Preserve reduced-motion behavior. If any smooth-scroll enhancement or transition is added, it must degrade cleanly and never become required for navigation.
- Do not hide layout problems by masking overflow. The page should remain readable and keyboard accessible without clipping content.

### Previous Story Intelligence

- Story 1.2 established the opening hero and the `journey-start` in-page landing target. The new navigation layer should keep that anchor stable and compatible.
- Story 1.2 review fixes emphasized visible focus on the destination, cleaner hash navigation semantics, no horizontal overflow masking, and reduced-motion smoke coverage.
- Reuse the existing anchor-based SPA flow instead of introducing a separate routing model or a second navigation paradigm.

### Testing Standards Summary

- Prefer Playwright smoke coverage for the visible navigation and orientation flow because the risk here is end-to-end behavior, not isolated pure logic.
- Keep the existing responsive checkpoints at 360, 480, 768, 1024, and large desktop widths.
- Verify keyboard-only traversal and visible focus states for both desktop nav and the compact mobile presentation.
- Keep `pnpm lint`, `pnpm typecheck`, `pnpm build`, and the relevant `pnpm test:e2e` pass in the implementation checklist.
- Add co-located Vitest coverage only if the active-section logic is extracted into reusable stateful code that would benefit from a fast unit test.

### Project Structure Notes

- Likely files to add or update:
  - `src/App.tsx`
  - `src/components/layout/AppShell.tsx`
  - `src/components/layout/Navbar.tsx`
  - `src/components/layout/MobileMenu.tsx`
  - `src/components/layout/SectionProgressRail.tsx`
  - `src/data/navigation.ts`
  - `src/contexts/NavigationContext.tsx` or `src/hooks/useActiveSection.ts`
  - `src/index.css` only if sticky offsets or scroll padding are needed
  - `tests/e2e/home.spec.ts`
- Keep shared primitives in `src/components/ui` and feature/layout composites in `src/components/layout`.
- Keep section labels and anchor metadata in `src/data` so the layout components do not drift from the canonical learning order.
- Avoid introducing a routed page structure; this story should still read as one continuous site.

### References

- [Source: _bmad-output/planning-artifacts/epics.md, Story 1.3: Navigate the Story]
- [Source: _bmad-output/planning-artifacts/epics.md, Epic 1: Guided Learning Journey]
- [Source: _bmad-output/planning-artifacts/prd.md, FR8-FR12, NFR17-NFR21]
- [Source: _bmad-output/planning-artifacts/architecture.md, Frontend Architecture]
- [Source: _bmad-output/planning-artifacts/architecture.md, Architectural Boundaries]
- [Source: _bmad-output/planning-artifacts/architecture.md, File Organization Patterns]
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md, Information Architecture & Narrative Order]
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md, Section Progress Rail]
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md, Navigation Patterns]
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md, Responsive Design & Accessibility]
- [Source: _bmad-output/implementation-artifacts/1-2-open-the-journey.md, Dev Notes and Review Findings]
- [Source: _bmad-output/project-context.md, Critical Implementation Rules]
- [Source: src/App.tsx, current landing shell and `journey-start` section]
- [Source: src/components/sections/HeroNarrativeFrame.tsx, current anchor-based continue behavior]
- [Source: tests/e2e/home.spec.ts, current smoke coverage baseline]

### Story Completion Status

- ready-for-dev
- Comprehensive developer guide created from the epic, PRD, architecture, UX, project context, and prior story learnings.

## Dev Agent Record

### Agent Model Used

GPT-5 Codex

### Debug Log References

- 2026-04-25: GitNexus impact analysis run for `App` and `HeroNarrativeFrame`; both returned LOW risk with zero direct callers/processes affected.
- 2026-04-25: Red E2E pass confirmed missing navigation shell, progress rail, mobile menu, and chapter landmarks before implementation.
- 2026-04-25: GitNexus CLI did not expose `detect_changes`; verified index status with `npx gitnexus status` and reviewed git diff/status instead.

### Completion Notes List

- Implemented canonical chapter metadata in `src/data/navigation.ts` and rendered the same source through top navigation, mobile navigation, progress rail, and section landmarks.
- Added a thin navigation provider/hook that tracks active/completed sections, reconciles valid and invalid hashes, supports browser history restoration, ignores no-op active clicks, and moves focus to readable section landmarks on navigation.
- Added responsive layout navigation with desktop primary nav, desktop progress rail, touch-friendly mobile menu, explicit dismiss behavior, breakpoint reset, current-chapter labeling, completed-state cues, and return-to-start actions.
- Extended Playwright smoke coverage for desktop jumps, rail navigation, active state, hash entry, invalid-hash fallback, refresh/back-forward restoration, keyboard activation, mobile collapse/dismiss/reset, reduced motion, and responsive overflow checks.
- Verification passed: `pnpm lint`, `pnpm typecheck`, `pnpm build`, `pnpm test:e2e tests/e2e/home.spec.ts`.

### File List

- `_bmad-output/implementation-artifacts/1-3-navigate-the-story.md`
- `_bmad-output/implementation-artifacts/sprint-status.yaml`
- `src/App.tsx`
- `src/components/layout/AppShell.tsx`
- `src/components/layout/MobileMenu.tsx`
- `src/components/layout/Navbar.tsx`
- `src/components/layout/SectionProgressRail.tsx`
- `src/contexts/NavigationContext.tsx`
- `src/contexts/navigation-context.ts`
- `src/data/navigation.ts`
- `src/hooks/useNavigation.ts`
- `src/index.css`
- `tests/e2e/home.spec.ts`

### Change Log

- 2026-04-25: Added shared chapter navigation, responsive app navigation shell, active-section behavior, focus-safe hash navigation, and E2E orientation coverage for Story 1.3.
