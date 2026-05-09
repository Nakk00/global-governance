# Story 1.4: Explore the Core Narrative

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a learner,
I want the main content organized in layered sections,
so that I can understand the topic without being overwhelmed by dense text.

## Acceptance Criteria

1. Given I scroll through the core narrative chapters, when each section renders, then it opens with a concise summary before supporting detail. The reading order stays summary-first and the page reads like a guided explanation rather than a wall of text.
2. Given a chapter becomes dense, when I inspect it, then any extra detail is revealed through a keyboard-accessible, motion-safe local disclosure pattern that clarifies the idea instead of adding decorative noise. Essential meaning remains visible even when the extra layer is collapsed.
3. Given I finish a major narrative section, when I reach its end, then I see a short synthesis or key takeaway that reinforces the main point before the next chapter begins. The flow still feels like one coherent story.
4. Given I reach the conclusion, when the wrap-up renders, then it restates the project's thesis clearly and closes the core narrative cleanly without turning the page into a document dump. The `conclusion-references` section stays a narrative landing space for later source work, but this story does not render the full visible references list yet.
5. Given I use the site as a first-time visitor on a typical student device, when I read the full narrative, then I do not need an account or profile, the content remains readable at 360 px, 480 px, 768 px, 1024 px, and large desktop widths, and the narrative sections stay keyboard reachable with no horizontal scrolling.

## Tasks / Subtasks

- [x] Replace the placeholder chapter content in `src/App.tsx` with real narrative section components and preserve the existing canonical chapter ids from `src/data/navigation.ts` (AC: 1, 3, 4, 5)
  - [x] Add typed repo-managed copy modules under `src/data/sections/` for the overview lead-in, the UN bridge copy, the governance-limits bridge copy, the case-study bridge copy, and the conclusion so the section text stays reviewable and does not live inline in the component tree.
  - [x] Introduce a reusable narrative section composite under `src/components/sections/` that can render an always-visible summary, supporting detail, and end-of-section synthesis in a consistent structure.
  - [x] Keep the `journey-start` anchor, section order, and navigation labels stable so Story 1.3’s anchor/history behavior remains valid.
- [x] Add layered disclosure for dense content without turning the chapter into a wall of text (AC: 1, 2)
  - [x] Use shadcn/ui primitives from `src/components/ui` for any expandable content, cards, or structured detail patterns needed by the section.
  - [x] Prefer local section state for expand/collapse behavior; do not introduce a router or global store.
  - [x] Limit disclosure to supporting detail, examples, or clarifying notes; keep the lead summary and thesis sentence visible at all times.
  - [x] Make every reveal path keyboard operable and safe under reduced motion, with essential content still readable when detail is collapsed. Disclosure state can remain local to the current section and does not need to persist across hash navigation or reloads.
- [x] Add chapter transition and synthesis beats to keep the full flow coherent (AC: 3, 4)
  - [x] Use a chapter transition block between major narrative beats so the story resets attention without adding new navigation state.
  - [x] End each major section with a concise synthesis card or takeaway that reinforces the main point before the next chapter begins, but keep it informational only and do not add next-step or re-entry cues yet. If a shared synthesis surface is extracted, implement it as `src/components/sections/InsightRecapCard.tsx`.
  - [x] Keep the conclusion focused on the thesis; do not add the full visible references list yet, because later stories own the deeper source surfaces.
- [x] Expand smoke coverage for the narrative flow (AC: 1-5)
  - [x] Update `tests/e2e/home.spec.ts` to verify summary-first rendering, expandable detail, collapsed-summary visibility, keyboard toggling and focus behavior, synthesis blocks, conclusion thesis tie-back, and the continued no-account/no-profile experience.
  - [x] Keep the existing responsive checkpoints at 360, 480, 768, 1024, and large desktop widths, and assert no horizontal overflow.
  - [x] Verify keyboard-only traversal and reduced-motion behavior for the new narrative sections, including the disclosure controls and chapter transition beats.

## Dev Notes

- This is the first content-heavy chapter pass after the hero and orientation shell. Keep the work focused on narrative clarity and layered reading, not on the later flagship interactions.
- The current `src/App.tsx` still renders placeholder section text from the canonical navigation list. Replace the placeholder copy with structured narrative sections, but do not rename the chapter ids or disturb the `NavigationProvider` and progress rail contract from Story 1.3.
- Keep the single-page anchor-navigation model intact. No router, no global store, and no backend work belong in this story.
- Use repo-managed content modules for all visible section copy. Do not bury the narrative text inside component markup.
- Treat the narrative sections as a single-column reading flow across all breakpoints; only spacing, max-width, and density should change.
- If a dense passage needs progressive disclosure, prefer a local accordion/collapsible pattern with clear labels and an always-visible summary. Hover-only affordances are not acceptable, and the disclosure should never hide the core thesis sentence or the opening summary.
- Chapter transitions should be lightweight attention resets, not new navigation state. They should help the site feel like one story without introducing re-entry cues yet; Story 1.5 owns the stronger recap and return-to-flow treatment.
- Keep the conclusion a thesis wrap-up only. The fuller visible reference surface belongs to the later trust and citation work, not this story, even though the canonical `conclusion-references` id remains stable.
- Keep reduced-motion behavior intact. Any motion in the narrative sections should be optional and never required to understand the content.
- Preserve semantic headings, readable line length, and focusable section landmarks so the story stays accessible as the narrative expands.
- Use `src/data/navigation.ts` as the source of truth for section ids and labels, but render the visible headings from the section content modules so nav text and in-page titles do not drift apart.

### Previous Story Intelligence

- Story 1.2 established the opening hero and the stable `journey-start` landing target. Keep that anchor untouched so the new narrative sections continue the same SPA journey cleanly.
- Story 1.3 already hardened the top navigation, section progress rail, hash handling, and focus recovery. This story should keep those ids and navigation labels stable while filling in the content layers.
- Reuse the existing anchor-based SPA flow instead of introducing any second navigation paradigm or content routing model.

### Testing Standards Summary

- Prefer Playwright smoke coverage for the visible narrative flow because the risk here is end-to-end readability, not isolated pure logic.
- Keep the responsive pass at 360, 480, 768, 1024, and large desktop widths.
- Verify keyboard-only traversal, visible focus, and reduced-motion behavior for every local disclosure pattern.
- Keep `pnpm lint`, `pnpm typecheck`, `pnpm build`, and the relevant `pnpm test:e2e` pass in the implementation checklist.
- Add a co-located unit or component test only if a shared narrative helper is extracted and benefits from fast coverage.

### Project Structure Notes

- Likely files to add or update:
  - `src/App.tsx`
  - `src/components/sections/ChapterTransitionBlock.tsx`
  - `src/components/sections/NarrativeSection.tsx`
  - `src/components/sections/InsightRecapCard.tsx` if a shared synthesis surface is extracted for section-end takeaways
  - `src/data/sections/global-governance-overview.ts`
  - `src/data/sections/un-command-center.ts`
  - `src/data/sections/governance-limits.ts`
  - `src/data/sections/west-philippine-sea-dossier.ts`
  - `src/data/sections/conclusion-content.ts`
  - `src/components/ui/accordion.tsx` or `src/components/ui/collapsible.tsx` if layered disclosure needs a primitive that does not already exist
  - `tests/e2e/home.spec.ts`
- `src/components/ui` currently contains only `button.tsx`; add any new shadcn primitives there instead of creating ad hoc shared UI copies inside section folders.
- Keep shared narrative copy in `src/data/sections` and keep the presentation wrappers in `src/components/sections` so later module stories can reuse the same content boundaries.
- Touch `src/index.css` only if a small global rhythm, scroll padding, or reading-width fix is truly unavoidable; prefer component-level Tailwind for the section layout.

### References

- [Source: _bmad-output/planning-artifacts/epics.md, Story 1.4: Explore the Core Narrative]
- [Source: _bmad-output/planning-artifacts/epics.md, Epic 1: Guided Learning Journey]
- [Source: _bmad-output/planning-artifacts/prd.md, FR1-FR7, FR8-FR12, FR18-FR22, NFR17-NFR21]
- [Source: _bmad-output/planning-artifacts/architecture.md, Frontend Architecture]
- [Source: _bmad-output/planning-artifacts/architecture.md, Architectural Boundaries]
- [Source: _bmad-output/planning-artifacts/architecture.md, File Organization Patterns]
- [Source: _bmad-output/planning-artifacts/architecture.md, Requirements to Structure Mapping]
- [Source: _bmad-output/project-context.md, Critical Implementation Rules]
- [Source: _bmad-output/project-context.md, Testing Rules]
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md, Information Architecture & Narrative Order]
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md, Chapter Transition Block]
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md, Insight Recap Card]
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md, Navigation Patterns]
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md, Responsive Design & Accessibility]
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md, UX Consistency Patterns]
- [Source: _bmad-output/implementation-artifacts/1-3-navigate-the-story.md, Dev Notes and Review Findings]
- [Source: _bmad-output/implementation-artifacts/1-2-open-the-journey.md, Dev Notes and Review Findings]
- [Source: src/App.tsx, current placeholder chapter shell]
- [Source: src/data/navigation.ts, canonical chapter ids and order]
- [Source: src/components/layout/AppShell.tsx, current navigation shell]
- [Source: src/components/sections/HeroNarrativeFrame.tsx, opening hero and `journey-start` continuation target]
- [Source: tests/e2e/home.spec.ts, current smoke coverage baseline]

### Story Completion Status

- ready-for-dev
- Comprehensive developer guide created from the epic, PRD, architecture, UX, current source tree, and prior story handoff.

## Dev Agent Record

### Agent Model Used

GPT-5 Codex

### Debug Log References

- Story created from the current epic, PRD, architecture, UX, project context, and the live placeholder narrative shell in `src/App.tsx`.
- Navigation and focus behavior from Story 1.3 must remain stable while the content layers are replaced.
- 2026-04-25: GitNexus impact analysis for `App` returned LOW risk, 0 direct callers, 0 affected processes.
- 2026-04-25: Red phase confirmed with `pnpm test:e2e tests/e2e/home.spec.ts`; the four new narrative-flow expectations failed against the placeholder implementation while existing navigation coverage passed.
- 2026-04-25: Green/refactor validation passed with `pnpm lint`, `pnpm typecheck`, `pnpm build`, and `pnpm test:e2e tests/e2e/home.spec.ts`.
- 2026-04-25: GitNexus detect changes returned LOW risk with no affected execution flows for tracked modified symbols.

### Completion Notes List

- Ready-for-dev context assembled for the core narrative chapter work.
- No code changes were made as part of story creation.
- Replaced placeholder chapter rendering with typed narrative content modules, a reusable `NarrativeSection`, section-end synthesis, and lightweight chapter transition beats.
- Added a Radix-backed shadcn-style collapsible primitive and used it for keyboard-operable local disclosure while keeping summaries and thesis text visible when collapsed.
- Preserved canonical anchor ids, navigation labels, hash focus behavior, and the no-account reading flow while adding responsive narrative smoke coverage.
- Validation passed: `pnpm lint`, `pnpm typecheck`, `pnpm build`, and `pnpm test:e2e tests/e2e/home.spec.ts`.

### File List

- _bmad-output/implementation-artifacts/1-4-explore-the-core-narrative.md
- _bmad-output/implementation-artifacts/sprint-status.yaml
- src/App.tsx
- src/components/sections/ChapterTransitionBlock.tsx
- src/components/sections/InsightRecapCard.tsx
- src/components/sections/NarrativeSection.tsx
- src/components/ui/collapsible.tsx
- src/data/sections/conclusion-content.ts
- src/data/sections/core-narrative.ts
- src/data/sections/global-governance-overview.ts
- src/data/sections/governance-limits.ts
- src/data/sections/narrative-types.ts
- src/data/sections/un-command-center.ts
- src/data/sections/west-philippine-sea-dossier.ts
- tests/e2e/home.spec.ts

### Change Log

- 2026-04-25: Created Story 1.4 context and updated sprint tracking to ready-for-dev.
- 2026-04-25: Implemented the core narrative sections, disclosure layer, synthesis and transition beats, and expanded Playwright smoke coverage; story moved to review.
