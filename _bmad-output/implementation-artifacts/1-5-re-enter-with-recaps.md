# Story 1.5: Re-enter with Recaps

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a learner,
I want recap and next-step cues after major sections,
so that I can re-enter the learning flow confidently after exploring detail.

## Scope Clarification

- This story applies to the five `NarrativeSection` chapters rendered from `coreNarrativeSections`:
  - `global-governance-overview`
  - `un-command-center`
  - `governance-limits`
  - `west-philippine-sea-dossier`
  - `conclusion-references`
- This story does not add recap cues to the hero frame or the `journey-start` orientation block.
- “What I just covered” means the current section’s thesis and synthesis, not inferred browsing history or a reconstructed previous section.
- “Next” means the canonical in-page destination already implied by the existing chapter order:
  - `global-governance-overview` -> `un-command-center`
  - `un-command-center` -> `governance-limits`
  - `governance-limits` -> `west-philippine-sea-dossier`
  - `west-philippine-sea-dossier` -> `conclusion-references`
  - `conclusion-references` -> `journey-start`

## Acceptance Criteria

1. Given I complete any of the five narrative chapters, when I reach its recap area, then I see a brief synthesis of the chapter’s key takeaway plus a compact next-step cue, and the recap remains short enough to scan without feeling like a second chapter.
2. Given I land directly on any later narrative chapter by hash or by jumping from navigation, when I read its recap, then I can tell what this chapter just established and what canonical section comes next without relying on inferred prior-history state.
3. Given I review a section twice, when I read its recap, then it reinforces that chapter’s thesis instead of repeating the full section verbatim and stays focused on the section’s main argument.
4. Given I use the recap cues on mobile or desktop, when they render, then they remain visually subordinate to the section body, readable in plain-text order, and visually distinct from `ChapterTransitionBlock` so the page does not feel like it has two competing transition surfaces in sequence.
5. Given I use the recap cue with keyboard only or reduced motion enabled, when I activate the next-step action, then the app uses the existing SPA anchor-navigation flow, updates focus the same way as other in-page navigation, and remains usable without pointer-only affordances.
6. Given I reach the conclusion recap, when I activate its cue, then it returns me to the stable `journey-start` anchor as a calm restart path rather than pretending there is another forward chapter.

## Tasks / Subtasks

- [x] Add explicit recap cue metadata to the narrative content model and keep it repo-managed in `src/data/sections` (AC: 1, 2, 3, 6)
  - [x] Extend `NarrativeSectionContent` only as far as needed for a compact recap structure, such as thesis-oriented synthesis plus a next-step label and target id.
  - [x] Populate all five narrative section data modules with concise recap copy and canonical target ids instead of hardcoding labels or destination logic in components.
  - [x] Guard recap metadata so each cue renders safely when copy or target data is incomplete; fall back to the existing synthesis-only surface rather than showing a broken action.
  - [x] Keep the conclusion cue mapped to `journey-start`, not `hero-narrative-frame` and not `defaultChapterId`.
- [x] Introduce a single canonical resolver for recap destinations so recap cues stay aligned with the current chapter order (AC: 2, 6)
  - [x] Reuse existing chapter ids from `src/data/navigation.ts` and `coreNarrativeSections` instead of inventing parallel ids.
  - [x] Avoid scattering next-step mapping across `NarrativeSection`, `InsightRecapCard`, tests, and section data; if shared mapping is needed, centralize it in `src/data/sections/core-narrative.ts` or another typed data helper.
  - [x] Validate recap target ids against the existing known-section contract so mistyped or stale ids do not ship as clickable dead ends.
- [x] Render the recap as a local re-entry surface inside the existing narrative section shell (AC: 1, 4, 5)
  - [x] Update `InsightRecapCard` to support the recap takeaway plus one explicit next-step action while preserving readable plain-text order.
  - [x] Update `NarrativeSection` so the recap remains after the supporting detail and disclosures, preserving the current summary-first reading order.
  - [x] Keep the recap visually subordinate to the surrounding section content and clearly different in tone and structure from `ChapterTransitionBlock`.
- [x] Use the current navigation contract for the cue action instead of inventing a new one (AC: 5, 6)
  - [x] Implement the recap action as a real in-page navigation affordance tied to the existing anchor-navigation and `NavigationContext` behavior.
  - [x] Handle the conclusion recap as an explicit `journey-start` path even though it is not a chapter-level destination in the primary progress sequence.
  - [x] If using a button-style control, wire it through the same focus-restoring navigation flow as other in-page controls. If using a link, ensure the hash target and focus result match the current app behavior.
  - [x] Do not add React Router, a global store, backend logic, or an alternate page-level navigation pattern.
- [x] Keep the cue accessible, motion-safe, and semantically clear (AC: 4, 5)
  - [x] Preserve visible focus treatment, keyboard activation, readable fallback states, and reduced-motion-safe behavior for the cue surface.
  - [x] Give the next-step control a clear accessible name that includes the destination chapter label or return action.
- [x] Expand smoke coverage for section re-entry and repeat visits (AC: 1-6)
  - [x] Update `tests/e2e/home.spec.ts` to verify recap visibility and next-step cue text for each narrative section.
  - [x] Verify keyboard activation of the cue, correct hash updates, and focus placement after using the cue.
  - [x] Verify direct entry to a later chapter still exposes a recap that explains the current chapter and points to the canonical next destination.
  - [x] Verify the conclusion recap returns to `#journey-start`.
  - [x] Keep the existing responsive checkpoints and reduced-motion assertions so recap surfaces are covered across the same device set as the rest of the journey.

## Dev Notes

- This story builds on the summary-first narrative from Story 1.4 and should add a compact “what to do next” layer, not another long explanation block.
- The section progress rail and top navigation already handle coarse re-entry. This story is about local checkpoint cues inside the five narrative sections so learners can re-enter the flow without feeling lost.
- The recap should describe the current chapter, not guess what the learner previously read. For deep-link entry, that means “what this chapter established” plus “where to go next.”
- Keep the cues short and action-oriented. For the first four narrative chapters, the cue points to the next canonical chapter in the existing learning order. For the conclusion, the cue becomes a calm return-to-start path targeting `journey-start`.
- Use the existing SPA anchor-navigation model and the current `NavigationContext` focus behavior. Match the established interaction contract instead of creating a second recap-specific navigation pattern, but do handle the `journey-start` return path explicitly because it is a known section without being a chapter destination.
- If a shared next-step mapping or helper is needed, create one typed source of truth rather than duplicating destination logic across content modules, UI components, and tests.
- The current `InsightRecapCard` is intentionally simple. Extend it only as far as needed to support a concise takeaway plus one next-step action, and keep the recap readable in plain-text order.
- If recap metadata is missing, stale, or invalid, degrade to a non-interactive takeaway instead of rendering a broken control or silently redirecting to the default chapter.
- Do not conflate recap cues with chapter transitions. `ChapterTransitionBlock` remains the bridge between topics; the recap should reinforce the current section and provide a subordinate re-entry cue.
- Preserve reduced-motion, visible focus states, and responsive readability at 360 px, 480 px, 768 px, 1024 px, and desktop widths.
- Story 1.6 owns broader editorial-system polish. Keep this story focused on comprehension support, re-entry behavior, and canonical next-step continuity.

### Previous Story Intelligence

- Story 1.4 established the summary-first narrative sections, local disclosure, and synthesis cards. Reuse that structure instead of reshaping the reading flow.
- Story 1.3 hardened the anchor-navigation model, active chapter tracking, and focus recovery. The new recap cues should fit that model rather than compete with it.
- Story 1.2 established the stable `journey-start` landing target. Keep that anchor unchanged so recap-based re-entry stays consistent.

### Testing Standards Summary

- Prefer Playwright smoke coverage for the visible re-entry flow because the risk here is end-to-end readability and navigation behavior, not isolated pure logic.
- Verify recap order, cue labeling, keyboard-only activation, correct hash transitions, visible focus, reduced-motion behavior, and direct-entry re-entry across the same responsive checkpoints used by the earlier journey stories.
- Include one failure-path assertion for invalid or suppressed recap actions if a shared resolver or guard is extracted, so the fallback behavior stays intentional.
- Keep `pnpm lint`, `pnpm typecheck`, `pnpm build`, and the relevant `pnpm test:e2e` pass in the implementation checklist.
- Add unit or component coverage only if a shared recap helper, cue resolver, or canonical destination mapper is extracted and benefits from fast coverage.

### Review Findings

- [x] [Review][Patch] Missing or stale recap target metadata can render a broken action or wrong anchor fallback [`_bmad-output/implementation-artifacts/1-5-re-enter-with-recaps.md`:41]
- [x] [Review][Patch] Conclusion recap needs an explicit `journey-start` navigation path because the current primary navigation contract is chapter-oriented [`_bmad-output/implementation-artifacts/1-5-re-enter-with-recaps.md`:52]

### Project Structure Notes

- Likely files to add or update:
  - `src/data/sections/narrative-types.ts`
  - `src/data/sections/global-governance-overview.ts`
  - `src/data/sections/un-command-center.ts`
  - `src/data/sections/governance-limits.ts`
  - `src/data/sections/west-philippine-sea-dossier.ts`
  - `src/data/sections/conclusion-content.ts`
  - `src/data/sections/core-narrative.ts` if a shared cue map or typed resolver is centralized
  - `src/components/sections/InsightRecapCard.tsx`
  - `src/components/sections/NarrativeSection.tsx`
  - `tests/e2e/home.spec.ts`
- Keep recap copy in `src/data/sections`, not inline in the component tree.
- Leave `src/components/layout/Navbar.tsx` and `SectionProgressRail.tsx` alone unless implementation truly needs a tiny hook-in to reuse the existing navigation behavior.

### References

- [Source: _bmad-output/planning-artifacts/epics.md, Story 1.5: Re-enter with Recaps]
- [Source: _bmad-output/planning-artifacts/epics.md, Epic 1: Guided Learning Journey]
- [Source: _bmad-output/planning-artifacts/prd.md, FR8-FR12, FR18-FR22, NFR17-NFR21]
- [Source: _bmad-output/planning-artifacts/architecture.md, Requirements Coverage Validation]
- [Source: _bmad-output/planning-artifacts/architecture.md, UX Coverage Map]
- [Source: _bmad-output/project-context.md, Critical Implementation Rules]
- [Source: _bmad-output/project-context.md, Framework-Specific Rules]
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md, Section Progress Rail]
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md, Chapter Transition Block]
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md, Insight Recap Card]
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md, Navigation Patterns]
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md, Journey Patterns]
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md, Requirements Traceability]
- [Source: _bmad-output/implementation-artifacts/1-4-explore-the-core-narrative.md, Dev Notes and Previous Story Intelligence]
- [Source: _bmad-output/implementation-artifacts/1-3-navigate-the-story.md, Dev Notes and Previous Story Intelligence]
- [Source: _bmad-output/implementation-artifacts/1-2-open-the-journey.md, Dev Notes and Previous Story Intelligence]
- [Source: src/components/sections/InsightRecapCard.tsx, current recap surface]
- [Source: src/components/sections/NarrativeSection.tsx, current section composition]
- [Source: src/data/sections/core-narrative.ts, current section order and transition map]
- [Source: src/data/navigation.ts, canonical chapter ids and order]
- [Source: tests/e2e/home.spec.ts, current smoke coverage baseline]

## Story Completion Status

- done
- Story implemented, regression-patched, and verified with recap restart behavior staying stable on `journey-start`.

## Dev Agent Record

### Agent Model Used

GPT-5

### Debug Log References

- 2026-04-25: GitNexus impact checks before implementation: `NarrativeSection`, `InsightRecapCard`, `NavigationProvider`, `isKnownSectionId`, `isChapterId`, `getChapterIndex`; all LOW risk.
- 2026-04-25: Red phase confirmed with failing `pnpm exec vitest run src/data/sections/core-narrative.test.ts` and failing recap-focused Playwright test before implementation.
- 2026-04-25: Post-format `pnpm exec vitest run` was not a valid full-suite command because Vitest attempted to load Playwright specs; reran the intended co-located Vitest test directly.
- 2026-04-25: GitNexus `detect_changes(scope: all)` reported medium overall risk, with expected navigation-provider process impact and no high/critical warnings.
- 2026-04-25: Post-review patch kept `journey-start` active after conclusion recap navigation until the first chapter crosses the observer threshold; targeted Vitest and Playwright checks passed again.

### Implementation Plan

- Add typed recap metadata to the five narrative content modules.
- Resolve recap cues through `coreNarrativeSections` order and `isKnownSectionId` so stale targets fall back to non-interactive takeaway text.
- Render recap actions as links that call the existing `NavigationContext` anchor/focus flow, including the `journey-start` conclusion path.
- Cover resolver fallback with Vitest and visible/keyboard/hash/focus behavior with Playwright.

### Completion Notes List

- Clarified the exact sections that receive recap cues and excluded hero and orientation surfaces.
- Defined canonical next-step targets, including the conclusion return path to `journey-start`.
- Tightened acceptance criteria and task language around navigation behavior, duplicate transition risk, and Playwright coverage.
- Patched the story with explicit fallback handling for invalid recap metadata and an explicit `journey-start` return-path requirement for the conclusion cue.
- Added compact recap metadata for all five narrative chapters, including conclusion return-to-start behavior.
- Added `resolveNarrativeRecapCue` to centralize canonical next-step validation and stale-target fallback.
- Extended `InsightRecapCard` and `NarrativeSection` to render subordinate recap cues in readable order after section detail/disclosures.
- Updated navigation so known section ids, including `journey-start`, can use the same focus-restoring anchor flow.
- Added Vitest resolver coverage and Playwright smoke coverage for recap visibility, direct entry, keyboard activation, hash changes, focus placement, responsive checkpoints, and reduced motion.
- Patched the navigation observer so conclusion recap restart keeps `journey-start` as the settled current location instead of snapping back to the hero chapter label.
- Verification passed: `pnpm format`, `pnpm exec vitest run src/data/sections/core-narrative.test.ts`, `pnpm lint`, `pnpm typecheck`, `pnpm build`, `pnpm test:e2e -- tests/e2e/home.spec.ts`.

### File List

- `_bmad-output/implementation-artifacts/1-5-re-enter-with-recaps.md`
- `_bmad-output/implementation-artifacts/sprint-status.yaml`
- `src/components/layout/MobileMenu.tsx`
- `src/components/layout/Navbar.tsx`
- `src/components/layout/SectionProgressRail.tsx`
- `src/components/sections/InsightRecapCard.tsx`
- `src/components/sections/NarrativeSection.tsx`
- `src/contexts/NavigationContext.tsx`
- `src/contexts/navigation-context.ts`
- `src/data/sections/conclusion-content.ts`
- `src/data/sections/core-narrative.test.ts`
- `src/data/sections/core-narrative.ts`
- `src/data/sections/global-governance-overview.ts`
- `src/data/sections/governance-limits.ts`
- `src/data/sections/narrative-types.ts`
- `src/data/sections/un-command-center.ts`
- `src/data/sections/west-philippine-sea-dossier.ts`
- `tests/e2e/home.spec.ts`

### Change Log

- 2026-04-25: Implemented recap metadata, canonical cue resolution, in-page recap navigation, and story smoke coverage.
