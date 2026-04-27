# Story 3.1: Open the Case Dossier

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a learner,
I want the West Philippine Sea dossier to introduce the case and its purpose,
so that I understand why this section matters before I start exploring the evidence.

## Acceptance Criteria

1. Given I open the case study section, when the dossier renders, then it identifies the West Philippine Sea as the topic, frames the section as an evidence-led investigation, and exposes the chapter through a named section region with a visible heading and clear chapter label.
2. Given I arrive from the main learning journey or by direct hash entry to `#west-philippine-sea-dossier`, when the dossier loads, then it feels like a continuation of the page narrative rather than a separate page, preserves the canonical anchor/focus behavior, and restores focus to the dossier region on direct entry, refresh, and browser-history navigation.
3. Given I view the dossier at 360 px, 768 px, 1024 px, or 1440 px, when the layout appears, then the intro surface, authored summary, and entry controls remain readable without horizontal scrolling or clipped controls, and the module is visually distinct through a concrete shell treatment rather than copy alone.
4. Given I use keyboard only, when I enter the dossier, then exactly two primary entry controls are reachable as real buttons, show visible focus states, and let me begin the section without a pointer device.
5. Given the dossier shell is introduced, when it opens the chapter, then it preserves the existing authored summary, disclosure, supporting details, synthesis, and recap flow from `src/data/sections/west-philippine-sea-dossier.ts` instead of replacing or duplicating that content.
6. Given the governance-limits chapter recap points into the dossier, when I use the `Continue to West Philippine Sea dossier` cue, then the navigation lands on the dossier section and keeps the canonical recap handoff intact.
7. Given the dossier shell uses collapsible or animated reveal behavior, when reduced motion is requested, then the chapter remains fully usable without motion-dependent meaning and the smoke coverage verifies that contract.

## Tasks / Subtasks

- [x] Build a dedicated West Philippine Sea dossier shell/module and wire it into the SPA. (AC: 1, 2, 3, 4)
  - [x] Add `src/components/modules/WpsDossier/WpsDossier.tsx` as the section-level composer for the case file.
  - [x] Keep the authored case narrative in `src/data/sections/west-philippine-sea-dossier.ts` as the source of truth; add only the minimal shell/entry copy needed for the chapter opening and do not duplicate the existing summary/thesis as a second intro block.
  - [x] Update `src/App.tsx` so the `west-philippine-sea-dossier` chapter renders through the dedicated module while the rest of the narrative continues to use `NarrativeSection`.
  - [x] Render the dossier as a named section region with the canonical `west-philippine-sea-dossier` id, a visible heading, and the existing navigation label so anchor entry and landmarks stay coherent.
  - [x] Preserve the canonical anchor id, recap target, and `chapterTransitionsBySectionId` flow from `governance-limits` into the dossier, including direct hash entry and browser-history focus restoration.
  - [x] Do not introduce a route, carousel, or separate page for the dossier.
- [x] Shape the shell as a continuation of the main narrative with responsive entry controls. (AC: 1, 2, 3, 4, 5, 7)
  - [x] Introduce a concise intro/entry surface that makes the chapter feel like a case file opening, not a hard reset, and use a concrete surface/layout treatment so the dossier reads as distinct from adjacent narrative sections.
  - [x] Keep the summary, supporting detail, and entry controls readable at 360 px, 768 px, 1024 px, and 1440 px with no horizontal overflow, clipped controls, or layout-dependent horizontal scrolling.
  - [x] Define exactly two primary entry controls with stable user-facing labels and real button semantics so keyboard and E2E coverage can target them consistently.
  - [x] Keep the existing disclosure, supporting detail, synthesis, and recap content visible in the dossier shell so the chapter opens with a custom surface without dropping the authored narrative structure.
  - [x] Leave timeline, ruling-versus-reality, and evidence depth for later Epic 3 stories; this story only establishes the dossier shell and entry experience.
- [x] Extend smoke coverage for the dossier entry experience. (AC: 1, 2, 3, 4, 6, 7)
  - [x] Update `tests/e2e/home.spec.ts` to verify the dossier chapter opens as a cohesive continuation, stays readable at representative breakpoints, and preserves keyboard access and focus visibility.
  - [x] Verify direct hash entry to `#west-philippine-sea-dossier`, refresh persistence, and browser-history focus restoration for the dossier region.
  - [x] Verify the governance-limits recap cue still lands on the dossier and preserves the canonical chapter handoff.
  - [x] Verify the two primary entry controls are reachable by keyboard, visibly focused, touch-safe, and remain fully contained within the viewport at 360 px, 768 px, 1024 px, and 1440 px.
  - [x] Keep the existing narrative-flow, UN module, and no-overflow coverage intact.
  - [x] Use role-based and geometry-based assertions rather than snapshots or fixed sleeps.
  - [x] Add reduced-motion coverage for any dossier control or reveal that animates, and verify the shell remains usable when motion is reduced.

### Review Findings

- [x] [Review][Patch] Defined the dossier shell as a named section region with a visible heading and chapter label so the entry point is semantically testable.
- [x] [Review][Patch] Defined the primary entry controls as exactly two real buttons with stable labels so keyboard and smoke coverage have a concrete target.
- [x] [Review][Patch] Added direct hash-entry, refresh, and browser-history focus-restoration expectations for `#west-philippine-sea-dossier`.
- [x] [Review][Patch] Replaced vague responsive language with explicit 360 px, 768 px, 1024 px, and 1440 px layout expectations, including no clipped controls or horizontal overflow.
- [x] [Review][Patch] Replaced subjective distinctness language with a concrete shell-treatment requirement so the module can be reviewed consistently.
- [x] [Review][Patch] Required the authored dossier content structure to remain visible in the custom shell so implementation cannot drop the existing summary, disclosure, and recap flow.
- [x] [Review][Patch] Blocked duplicate intro copy by stating that the shell may add minimal opening copy but must not repeat the existing summary/thesis as a second intro block.
- [x] [Review][Patch] Made reduced-motion verification explicit for any dossier reveal or control that animates.
- [x] [Review][Patch] Elevated the governance-limits recap handoff into explicit acceptance and smoke-test coverage.

## Dev Notes

### Current State

- `coreNarrativeSections` already includes `westPhilippineSeaDossier` between `governance-limits` and `conclusion-references`, and `governance-limits` already points its recap cue at `#west-philippine-sea-dossier`.
- The authored case copy already lives in `src/data/sections/west-philippine-sea-dossier.ts`; it frames the West Philippine Sea as a governance test and already contains the summary, thesis, supporting details, disclosure, synthesis, and recap text.
- `src/App.tsx` currently renders every section except `un-command-center` through the generic `NarrativeSection` component, so the case chapter still uses the default narrative shell today.
- `tests/e2e/home.spec.ts` already covers anchor navigation, the UN module, the governance-limits recap cue, and the full narrative's no-overflow and keyboard behavior. Extend that harness rather than replacing it.

### Carry-Forward from Epic 2

- The UN module is the closest local precedent for this story. It uses a section-level composer with an explicit intro, summary surface, entry controls, accessible focus states, and a recap handoff.
- Story 2.3 proved that responsive module smoke tests should rely on role-based locators, keyboard flow, and geometry checks instead of brittle screenshots or fixed sleeps.
- Keep the same no-horizontal-overflow, reduced-motion, and visible-focus expectations for the dossier shell. The visual language should differ, but the accessibility contract should not.
- Use the UN shell as the implementation pattern for landmark semantics and stable control targeting, but keep the dossier copy tighter so the opening does not become a second summary surface that repeats the authored chapter text.

### Story Scope Boundaries

- This story should establish the dossier opening and entry behavior only.
- Do not build the timeline rail, event cards, ruling-versus-reality comparison, or evidence drawer yet; those belong to later Epic 3 stories.
- Keep the case facts, recap flow, and canonical anchor ids intact.
- Keep the page as a single-page anchor-navigation experience.
- The shell may add a minimal case-opening cue and two entry controls, but it must not replace, hide, or duplicate the authored summary, disclosure, supporting details, synthesis, or recap structure already defined in `src/data/sections/west-philippine-sea-dossier.ts`.

### Architecture Guardrails

- Follow the SPA-first React + Vite structure already used elsewhere in the repo.
- Keep feature composites in `src/components/modules/`.
- Keep shared primitives in `src/components/ui` and keep content data in `src/data/sections`.
- Preserve `aria-label`, focus restoration, visible focus states, reduced-motion behavior, and no-horizontal-scroll behavior across the new shell.
- Keep the canonical anchor-navigation and focus-restoration contract intact for direct hash entry, refresh, and browser-history navigation into the dossier.
- Reuse the existing `InsightRecapCard` and section/navigation patterns where they still fit; do not invent a parallel navigation model.
- If a small shell-content type is needed, keep it alongside the case data or in a narrow local type, not in JSX literals.

### Project Structure Notes

- Likely new module home: `src/components/modules/WpsDossier/`
- Likely update: `src/App.tsx`
- Likely update: `src/data/sections/west-philippine-sea-dossier.ts`
- Likely update: `tests/e2e/home.spec.ts`
- Usually no need to touch: `src/data/navigation.ts`, `src/data/sections/core-narrative.ts`, `src/contexts/NavigationContext.tsx`
- Architecture examples refer to `src/data/sections/case-study-content.ts`, but the repo already uses `src/data/sections/west-philippine-sea-dossier.ts`; keep the current file unless the implementation explicitly needs a rename.

### Testing Standards Summary

- Use `tests/e2e/home.spec.ts` as the main harness.
- Verify the dossier at representative widths, including 360 px, 768 px, 1024 px, and 1440 px.
- Assert readable intro/entry surface, keyboard reachability, visible focus, reduced-motion safety if animated, and no horizontal overflow.
- Prefer role-based locators, bounding-box checks, and layout assertions over snapshots or sleeps.

### Latest Tech Notes

- The repo currently pins `react` and `react-dom` at `^19.2.4`, `vite` at `^7.3.1`, and `@playwright/test` at `^1.59.1` in `package.json`.
- Official Playwright docs continue to recommend user-facing locators such as `getByRole()` and media emulation with `page.emulateMedia()`, which matches the existing smoke-test style.
- Official Vite release notes show Vite 8 is available, but this story does not require a build-tool upgrade; stay on the repo's pinned Vite 7.x baseline.
- This story stays within React function components and hooks; no version-specific React upgrade work is required.

### References

- [Source: `_bmad-output/planning-artifacts/epics.md`, Epic 3, Story 3.1 and Epic 3 overview]
- [Source: `_bmad-output/planning-artifacts/prd.md`, FR5, FR15-FR16, FR18-FR21, NFR19-NFR21]
- [Source: `_bmad-output/planning-artifacts/architecture.md`, Frontend Architecture, Component Boundaries, Requirements to Structure Mapping, Responsive Design & Accessibility, Testing Strategy]
- [Source: `_bmad-output/planning-artifacts/ux-design-specification.md`, West Philippine Sea Interactive Dossier, Responsive Strategy, Breakpoint Strategy, Accessibility Strategy, Testing Strategy]
- [Source: `_bmad-output/planning-artifacts/implementation-readiness-report-2026-04-24.md`, PRD Analysis, Epic Coverage Validation, UX Alignment Assessment]
- [Source: `src/App.tsx`, current section rendering flow]
- [Source: `src/data/sections/core-narrative.ts`, canonical chapter order and recap target]
- [Source: `src/data/sections/governance-limits.ts`, recap cue into the dossier]
- [Source: `src/data/sections/west-philippine-sea-dossier.ts`, current case narrative content]
- [Source: `tests/e2e/home.spec.ts`, current navigation and responsive smoke coverage]
- [Source: `src/components/modules/UNCommandCenter/UNCommandCenter.tsx`, local precedent for a section-level module shell]

## Story Completion Status

- done
- Ultimate context engine analysis completed - comprehensive developer guide created

## Dev Agent Record

### Agent Model Used

GPT-5 Codex

### Debug Log References

- Story context created from the approved epics, PRD, architecture, UX specification, implementation readiness report, current section code, and current Playwright smoke coverage.
- Local package versions checked in `package.json`: React 19.2.4, Vite 7.3.1, Playwright 1.59.1.
- Official Playwright docs consulted for resilient locator and media-emulation guidance; official Vite release notes confirm Vite 8 exists, but no upgrade is required for this story.
- 2026-04-27: GitNexus impact analysis run for `App` and `UNCommandCenter`; both returned LOW risk with no direct upstream callers. The dossier data file is indexed as a file but not as a named symbol.
- 2026-04-27: Confirmed red phase with focused WPS Playwright coverage failing before the custom shell existed.
- 2026-04-27: Verification passed: `pnpm format`, `pnpm lint`, `pnpm typecheck`, `pnpm build`, focused WPS Playwright tests, and full `pnpm test:e2e` (21 passed). One full-suite run exposed a transient pre-existing UN mobile-nav timing failure; the test passed in isolation and on full-suite rerun.
- 2026-04-27: GitNexus `detect_changes({ scope: "all" })` reported LOW risk and no affected execution flows; unrelated pre-existing working-tree changes remain outside this story scope.

### Completion Notes List

- Story is intentionally narrow: dossier shell and entry experience only.
- Existing case narrative content remains the source of truth.
- Timeline, evidence, and ruling-versus-reality interactions are explicitly deferred to later Epic 3 stories.
- The story preserves the single-page anchor-navigation flow and the current recap chain into the conclusion section.
- Added a dedicated `WpsDossier` section module with a visible case-file heading, chapter label, evidence-led investigation frame, and exactly two keyboard-operable primary entry buttons.
- Preserved the authored dossier summary, thesis/supporting details, disclosure, synthesis, and recap handoff while adding only minimal shell copy in `src/data/sections/west-philippine-sea-dossier.ts`.
- Extended Playwright smoke coverage for direct hash entry, refresh/history focus restoration, governance-limits recap handoff, responsive containment at 360/768/1024/1440 px, visible focus, touch target sizing, and reduced-motion usability.

### File List

- _bmad-output/implementation-artifacts/3-1-open-the-case-dossier.md
- _bmad-output/implementation-artifacts/sprint-status.yaml
- src/App.tsx
- src/components/modules/WpsDossier/WpsDossier.tsx
- src/data/sections/west-philippine-sea-dossier.ts
- src/index.css
- tests/e2e/home.spec.ts

### Change Log

- 2026-04-27: Implemented the West Philippine Sea dossier shell, wired it into the SPA, added shell content and styling, and expanded E2E smoke coverage. Story moved to review.
