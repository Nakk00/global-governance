# Story 2.2: Inspect UN Organs

Status: done

## Story

As a learner,
I want selecting a UN organ to reveal its role, powers, and limitations,
so that I can compare institutions quickly without relying on a long static explanation.

## Scope Clarification

- This story upgrades the existing `UNCommandCenter` shell into the organ explorer. Keep the intro, summary, shell entry controls, recap card, `un-command-center` anchor, and focus-restoration contract from Story 2.1.
- The organ selector and detail panel are the primary new interaction. Story 2.3 owns the device-specific comparison layout polish, so do not build a separate route, global store, or chat integration here.
- Keep organ copy in `src/data/sections/un-command-center.ts` or a narrow local content type so the chapter voice stays authored data, not JSX literals.
- Use the existing SPA anchor-navigation pattern and local component state only. The section must still work when navigated to directly by hash or via the progress and navigation controls.
- The interaction must stay keyboard-operable, visibly selected, and readable with reduced motion on the current responsive breakpoints.

## Acceptance Criteria

1. Given the UN organ list is visible, when I select an organ, then the detail panel updates to show that organ's role, scope of power, and limitation, and the selected state is obvious.
2. Given I switch between different organs, when the selection changes, then the information updates immediately without losing context, and I can tell the organs apart from the displayed content alone.
3. Given I explore the organs in sequence, when I review the module, then the content stays concise and structured rather than turning into one long wall of text, and the presentation supports comparison.
4. Given I use keyboard navigation, when I move through the organs, then each organ selection is reachable and focus visibility is preserved, and the interaction remains usable without a mouse.
5. Given the organ details render, when I inspect the panel, then I can understand why the organ matters in global governance, and the explanation supports the module's educational purpose.

## Tasks / Subtasks

- [x] Add organ content and selection state to the UN data module. (AC: 1, 2, 3, 5)
  - [x] Extend `src/data/sections/un-command-center.ts` with a structured organ dataset and copy fields for role, power, limit, and why-it-matters content.
  - [x] Keep the existing shell metadata and recap target in place; do not move the chapter voice into JSX.
  - [x] If reusable selection helpers are needed, keep them local to the UN module or a narrow `src/data/sections` type.
- [x] Turn `UNCommandCenter` into an accessible organ explorer. (AC: 1-5)
  - [x] Add local selection state and a clear default organ.
  - [x] Render the organ selector, selected state, and detail panel using shared shadcn/ui primitives and the existing editorial surfaces.
  - [x] Make the control pattern keyboard-operable with visible focus and no hover-only content.
  - [x] Preserve the shell intro, summary, entry controls, and recap card from Story 2.1.
- [x] Keep the module consistent with the existing single-page flow. (AC: 1-5)
  - [x] Preserve the `un-command-center` anchor, `UN Command Center` accessible region label, and focus restoration behavior.
  - [x] Avoid introducing a new route, global store, or chat logic.
  - [x] Keep the selected content readable on the current mobile, tablet, and desktop breakpoints and maintain reduced-motion safety.
- [x] Extend smoke coverage for organ selection. (AC: 1-5)
  - [x] Update `tests/e2e/home.spec.ts` to verify the default organ state, organ switching, visible selected state, keyboard activation, and the continued shell and anchor behavior.
  - [x] Add a co-located unit test only if a shared organ-content helper or state transformer is extracted.

### Review Findings

- [x] [Review][Patch] Duplicate supporting-detail content repeats the shell copy [src/components/modules/UNCommandCenter/UNCommandCenter.tsx:222]
- [x] [Review][Patch] Organ selector uses invalid list semantics for toggle buttons [src/components/modules/UNCommandCenter/UNCommandCenter.tsx:138]
- [x] [Review][Patch] Empty organ data can leave `selectedOrgan` undefined during render [src/components/modules/UNCommandCenter/UNCommandCenter.tsx:35]
- [x] [Review][Patch] Mobile navigation test uses a fixed timeout and can flake [tests/e2e/home.spec.ts:269]

## Dev Notes

### Current State

- Story 2.1 already put a dedicated UN shell in `src/components/modules/UNCommandCenter/UNCommandCenter.tsx`, wired through `src/App.tsx`, and backed by `src/data/sections/un-command-center.ts`. Treat that shell as the base layer, not something to replace.
- The current module renders the intro, summary, entry controls, and recap card with `Button` and `Collapsible`. Keep those shell-level cues visible and add the organ explorer as the main interaction surface beneath or between them.
- `src/contexts/NavigationContext.tsx` still owns hash navigation, focus restoration, and active chapter state. Do not duplicate that logic in the UN module.

### Implementation Guardrails

- The repo currently has shared `Button` and `Collapsible` primitives under `src/components/ui/`. If the selector benefits from tab semantics, add the primitive in `src/components/ui/` instead of inventing a one-off pattern in the feature folder.
- Use local component state. The project context and architecture both prefer thin contexts only for cross-cutting concerns, not for feature-level selection state.
- Keep all organ descriptions in repo-managed content, not hardcoded JSX. The copy should read like the rest of the chapter and stay aligned with the UN teaching voice.
- Keep the module clear under reduced motion and at touch sizes. No essential meaning should depend on hover, animation, or pointer-only affordances.
- The current comparison outcome for this story is "can tell the organs apart and understand their roles." Save device-specific comparison layout refinements for Story 2.3.

### Content Model Guidance

- Keep the organ set bounded to the major UN bodies emphasized by the chapter, not a full encyclopedic directory.
- The current chapter copy already names the General Assembly, Security Council, Secretariat, and specialized agencies. Use the authored narrative as the starting point for the organ cards and keep the content concise.
- A narrow organ content type should capture the minimum needed for the explorer: `id`, `label`, `summary`, `role`, `power`, `limit`, and `whyItMatters`.
- Mirror the selected organ state in both semantics and styling, such as `aria-pressed`, `aria-selected`, or an equivalent explicit selected marker.

### Previous Story Intelligence

- Story 2.1 established the shell, anchor, recap chain, and entry controls. This story should extend that chapter without breaking the chapter identity or the hash-focus contract.
- Story 1.7 hardened keyboard, touch, responsive, and reduced-motion behavior across the core journey. Reuse those contracts instead of creating a new interaction model.
- Story 1.6 established the editorial token language and action hierarchy. Keep the UN module visually consistent with the rest of the site.
- Story 1.3 stabilized hash navigation and focus recovery. Preserve that behavior when organ selection is added.
- The shell already includes a short summary and supporting-detail disclosure. Use them as narrative scaffolding, not as a substitute for the organ explorer.

### Current Stack Notes

- The repo is already pinned to the current frontend stack in `package.json`: React 19.2.4, Vite 7.3.1, Motion 12.38.0, Lenis 1.3.23, shadcn 4.4.0, and TypeScript 5.9.3.
- Do not add dependency upgrades for this story unless a missing primitive is truly unavoidable.

### Testing Standards Summary

- Use `tests/e2e/home.spec.ts` as the primary regression harness.
- Add assertions for:
  - default organ selection and visible detail panel
  - switching to at least one other organ updates role, power, and limitation copy
  - selected state is obvious in the UI
  - keyboard-only movement and activation work without a mouse
  - the shell intro, summary, and recap still render
  - the `#un-command-center` hash still restores focus and active chapter state
  - the organ explorer remains readable at the current responsive checkpoints
- Add a co-located unit or component test only if a reusable selection helper or organ data transformer is extracted.
- Verify the rendered page rather than relying on snapshots for the organ panel state.

### Project Structure Notes

- Likely update:
  - `src/components/modules/UNCommandCenter/UNCommandCenter.tsx`
  - `src/data/sections/un-command-center.ts`
  - `tests/e2e/home.spec.ts`
- Likely add:
  - `src/components/modules/UNCommandCenter/UNOrganExplorer.tsx` or another narrow local subcomponent if the selector and panel need to be split for readability
- Usually no need to touch:
  - `src/App.tsx`
  - `src/data/navigation.ts`
  - `src/contexts/NavigationContext.tsx`
  - `src/components/sections/NarrativeSection.tsx`
  - `src/components/layout/*`
unless a very small shared helper becomes necessary.
- Keep new module and helper names in PascalCase with readable acronym handling, matching the repo convention such as `UNCommandCenter` and `UNOrganExplorer`.

### References

- [Source: _bmad-output/planning-artifacts/epics.md, Epic 2: UN Institutional Explorer, Story 2.2]
- [Source: _bmad-output/planning-artifacts/epics.md, Epic 2: UN Institutional Explorer, Story 2.3]
- [Source: _bmad-output/planning-artifacts/prd.md, FR13-FR14, NFR19-NFR21, UX-DR11, UX-DR21-35]
- [Source: _bmad-output/planning-artifacts/architecture.md, Technical Constraints & Dependencies]
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
- [Source: src/components/modules/UNCommandCenter/UNCommandCenter.tsx, current shell implementation]
- [Source: src/data/sections/un-command-center.ts, current UN chapter copy and shell metadata]
- [Source: src/components/ui/button.tsx, shared action primitive]
- [Source: src/components/ui/collapsible.tsx, shared disclosure primitive]
- [Source: tests/e2e/home.spec.ts, smoke coverage baseline]

## Story Completion Status

- review
- Organ explorer implemented and verified; Story 2.3 can refine device-specific comparison layout polish.

## Change Log

- 2026-04-26: Created ready-for-dev story context for the UN organ explorer, grounded in the existing UN shell and deferred device-specific comparison polish to Story 2.3.
- 2026-04-26: Implemented the UN organ explorer, added smoke coverage, and moved the story to review.

## Dev Agent Record

### Agent Model Used

GPT-5 Codex

### Debug Log References

- Story context built from Epic 2 Story 2.2, the current UN shell implementation, PRD and UX guidance, architecture constraints, and the existing Playwright baseline.
- GitNexus impact checked before code edits: `UNCommandCenter` LOW risk with 0 upstream dependents; `un-command-center.ts` LOW risk with 3 direct importers and 6 total upstream nodes.
- Validation passed: `pnpm format`, `pnpm lint`, `pnpm typecheck`, `pnpm build`, and `pnpm test:e2e` (18 passed).
- Render inspection completed with `playwright-cli` against `http://127.0.0.1:5173/#un-command-center`.

### Completion Notes List

- Added a typed `unOrgans` dataset with concise role, power, limitation, and why-it-matters copy for five UN bodies.
- Upgraded `UNCommandCenter` with local organ selection state, a default General Assembly selection, `aria-pressed` selected controls, and a live detail panel while preserving the existing shell, anchor, recap, and supporting-detail surfaces.
- Extended Playwright smoke coverage for default selection, organ switching, selected state, keyboard focus and activation, shell continuity, hash behavior, and responsive/reduced-motion regression coverage.
- No shared organ-content helper or transformer was extracted, so no co-located unit test was added.

### File List

- _bmad-output/implementation-artifacts/2-2-inspect-un-organs.md
- _bmad-output/implementation-artifacts/sprint-status.yaml
- src/components/modules/UNCommandCenter/UNCommandCenter.tsx
- src/data/sections/un-command-center.ts
- tests/e2e/home.spec.ts
