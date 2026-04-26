# Story 1.6: Shape the Editorial System

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a learner,
I want the site to use a coherent premium visual system,
so that I can trust the presentation and focus on the content.

## Scope Clarification

- This story owns site-wide editorial presentation across the existing Epic 1 journey surfaces: hero, chapter transitions, narrative sections, recap surfaces, and navigation chrome.
- This story does not introduce a new references drawer, citation browser, source-chip system, or chatbot evidence surface. Those deeper trust and reference interactions belong to Epic 4.
- In this story, "source-facing" means the existing `conclusion-references` narrative landing surface and any calm shared card treatment it reuses, not a new inspectable references experience.
- The implementation may refine the shared `Button` primitive only if the action hierarchy cannot be expressed cleanly through tokens or feature-layer styling alone.
- If motion polish requires `src/styles/motion.css`, the implementation must ensure the stylesheet is actually imported into the runtime path instead of leaving dead styling on disk.

## Acceptance Criteria

1. Given the journey is rendered, when I move between hero, navigation chrome, chapter transitions, narrative sections, recap surfaces, and the conclusion surface, then they share one token-driven color, typography, spacing, radius, and surface system instead of visibly divergent local styling rules.
2. Given multiple interactive controls appear in the same section, when I inspect the controls, then exactly one progress-driving action is visually emphasized, while navigation links, disclosure toggles, and other secondary controls remain clearly interactive but less visually dominant.
3. Given a major chapter transition appears, when the topic changes, then the transition uses the same editorial family as the rest of the journey while still reading as an attention reset instead of a second competing design language.
4. Given the existing `conclusion-references` surface appears, when I view it, then it reads as a calm source-adjacent landing surface with distinct typography and card treatment, but it does not introduce a new references interaction model or turn into a dense document dump.
5. Given the approved hybrid direction is applied, when I compare the main journey and the calmer support surfaces, then the implementation shows a documented mapping of Diplomatic Editorial, Strategic Atlas, and Institutional Ledger cues to specific shared tokens or reusable surface rules rather than relying on one-off interpretation.
6. Given the editorial system is updated, when I review light mode, dark mode, keyboard focus states, and reduced-motion behavior, then the new presentation remains readable, WCAG-AA-safe in intended text use, and consistent across those modes without breaking the existing anchor-navigation journey.

## Tasks / Subtasks

- [x] Establish the editorial token system in `src/index.css` so the site has one shared palette, typography scale, spacing rhythm, radius system, and surface treatment language aligned to the approved hybrid direction. (AC: 1, 5)
  - [x] Tune the global theme variables and Tailwind-facing tokens centrally instead of scattering one-off color or spacing fixes through component markup.
  - [x] Keep the existing SPA, dark/light theme behavior, and reduced-motion-safe defaults intact while making the reading surfaces feel more deliberate and premium.
  - [x] If a stronger heading voice is introduced, do it through the shared token layer so section titles, hero copy, and support surfaces stay in the same editorial family.
  - [x] Document the hybrid-direction mapping directly in `src/index.css` beside the shared token definitions, either as concise token-layer comments or a clearly labeled editorial-map note, so future stories can tell which tokens carry Diplomatic Editorial, Strategic Atlas, and Institutional Ledger responsibilities. (AC: 5)
- [x] Refine the shared shell and navigation chrome so the main journey reads as one system from the hero through the section rail. (AC: 1, 2, 5)
  - [x] Update `AppShell`, `Navbar`, `MobileMenu`, and `SectionProgressRail` to consume the shared editorial tokens rather than relying on local styling drift.
  - [x] Keep the active chapter, completed chapter, and return-to-start states visually clear without over-weighting secondary controls.
  - [x] Preserve the existing anchor-navigation contract and `NavigationContext` focus behavior; this story is about visual language, not routing or state architecture.
- [x] Restyle the major section composites so chapter beats, narrative sections, and recap surfaces feel like parts of one publication-like flow. (AC: 1, 2, 3, 5)
  - [x] Rework `HeroNarrativeFrame`, `ChapterTransitionBlock`, `NarrativeSection`, and `InsightRecapCard` to share spacing, surface, and hierarchy rules while still keeping their individual roles readable.
  - [x] Treat the hero CTA and recap next-step cue as progress-driving actions; keep nav links, return-to-start links, and disclosure toggles visibly interactive but visually subordinate.
  - [x] Keep chapter transitions as attention resets, not as a second competing design language.
- [x] Establish the source-facing and conclusion treatment so later Epic 4 reference and evidence surfaces can inherit a credible academic frame without being prematurely implemented here. (AC: 4, 5)
  - [x] Keep `conclusion-references` as the first calm source-landing surface and make it visually distinct without turning it into a dense document dump.
  - [x] Reuse the same editorial rules for any future reference or citation-facing component instead of inventing a separate visual system later, but do not add new inspectable reference interactions in this story.
  - [x] If a shared source-card or reference-surface primitive becomes useful, keep it in the feature-owned section layer rather than moving content back into `src/components/ui`.
- [x] Expand smoke coverage in `tests/e2e/home.spec.ts` so the editorial system is verified at the flow level instead of only by inspection. (AC: 1-6)
  - [x] Check that the hero, transitions, narrative sections, recap surfaces, and conclusion surface render with the intended hierarchy at the existing responsive checkpoints.
  - [x] Verify that the dominant action stands out, secondary actions remain supportive, and source-facing surfaces are visually distinct but still aligned to the same journey.
  - [x] Keep the current navigation, recap, keyboard, and reduced-motion assertions intact while adding any new system-level checks.
  - [x] Verify no horizontal overflow and intact focus visibility at the existing responsive checkpoints in both default and reduced-motion modes.
- [x] Add at least one implementation-level verification for the shared editorial system beyond Playwright smoke checks. (AC: 1, 5, 6)
  - [x] If shared token helpers or class composers are extracted, cover them with a co-located unit or component test.
  - [x] If no helper is extracted, record a manual verification checklist covering light mode, dark mode, CTA hierarchy, conclusion calmness, and transition consistency so review is not reduced to subjective visual impressions.

## Dev Notes

- This story owns the site-wide editorial language, not a new content model or interaction system. Keep the narrative order, recap cues, anchor navigation, and chapter ids from Stories 1.3-1.5 unchanged.
- The approved UX direction is a hybrid: Diplomatic Editorial as the default language, Strategic Atlas for hierarchy/navigation clarity, Institutional Ledger for references and reading surfaces, and the existing casefile/command accents only where those modules need them.
- The repo currently ships a simple `Geist Variable`-based theme. If you introduce a more expressive heading stack or stronger contrast between display text and body text, centralize it in the token layer so every shared surface inherits it consistently.
- The implementation should explicitly map the hybrid direction to reusable rules. Put that mapping beside the shared token definitions in `src/index.css` so it stays attached to the actual source of truth. For example, typography and reading surfaces can carry Diplomatic Editorial, navigation state and section wayfinding can carry Strategic Atlas, and conclusion/source-adjacent cards can carry Institutional Ledger.
- Keep the visual system coherent across hero, progress/navigation chrome, chapter transitions, narrative sections, recap cards, and conclusion surfaces. Later module stories should be able to reuse the same tokens rather than restyling from scratch.
- Do not create a second design system for references or support surfaces. They should be distinct and calmer than the main narrative, but still clearly part of the same publication-like experience.
- Do not pull Epic 4 work forward by introducing a reference drawer, source chips, inspectable citation list, or chatbot evidence interaction in this story. This story should prepare the visual frame those later surfaces can inherit.
- Keep the work in the frontend SPA. No router, global store, backend logic, or privileged retrieval work belongs in this story.
- Preserve reduced-motion behavior and visible focus states while adjusting the visual language. This story can refine presentation, but it must not make interactions harder to perceive or use.
- If a shared action-hierarchy tweak is needed, prefer a centralized primitive or token change over per-component duplication. The goal is a clear editorial rule, not a scattered set of hard-coded exceptions.
- If `src/styles/motion.css` is used for polish, import it from the active app entry path so motion-safe refinements are real runtime behavior, not dead stylesheet intent.

### Previous Story Intelligence

- Story 1.4 established the layered narrative structure, summary-first reading order, chapter transitions, and the shared section shells that this story should now polish rather than replace.
- Story 1.5 added recap re-entry cues and navigation continuity, including the `journey-start` return path. Keep that interaction contract stable and make the cue surfaces feel more integrated, not more prominent.
- Story 1.3 hardened the anchor-navigation model, focus recovery, and hash handling. This story should preserve those mechanics and only change the presentation layer around them.

### Testing Standards Summary

- Prefer Playwright smoke coverage for this story because the risk is system-level visual coherence, not isolated pure logic.
- Verify the editorial system across the existing responsive checkpoints, including readable hierarchy, calm support surfaces, dominant primary actions, no horizontal overflow, and stable focus visibility.
- Keep reduced-motion assertions and keyboard/focus coverage intact, especially around the hero CTA, nav chrome, recap cues, and conclusion return path.
- Include explicit light-mode and dark-mode review in the verification pass because this story changes global tokens rather than a local component only.
- Add a co-located unit or component test if a shared editorial helper, token mapper, or class composer is extracted. If none is extracted, keep Playwright smoke checks plus a short manual verification record for hierarchy and theme consistency.

### Project Structure Notes

- Likely files to add or update:
  - `src/index.css`
  - `src/components/layout/AppShell.tsx`
  - `src/components/layout/Navbar.tsx`
  - `src/components/layout/MobileMenu.tsx`
  - `src/components/layout/SectionProgressRail.tsx`
  - `src/components/sections/HeroNarrativeFrame.tsx`
  - `src/components/sections/ChapterTransitionBlock.tsx`
  - `src/components/sections/NarrativeSection.tsx`
  - `src/components/sections/InsightRecapCard.tsx`
  - `src/components/ui/button.tsx` if a shared action-hierarchy adjustment cannot be expressed cleanly at the component layer
  - `src/styles/motion.css` if the editorial polish needs motion-safe background or transition tuning and the file is imported into the live app path
  - `tests/e2e/home.spec.ts`
- There is not yet a dedicated `references` feature surface in `src/`, so keep the source-facing treatment aligned to the conclusion surface and shared card patterns instead of inventing a parallel visual language.
- Keep content definitions in `src/data/sections` and presentation wrappers in `src/components/sections`; do not push editorial copy into component markup.
- Keep any new token or surface rules centralized. Avoid one-off class forks that would make later module stories harder to reuse.
- Relevant existing behavior also lives in `src/data/navigation.ts` and `src/contexts/NavigationContext.tsx`; preserve those contracts while refining presentation around them.

### Review Findings

- [x] [Review][Patch] Clarified that this story prepares the visual frame for references but does not implement Epic 4 reference interactions, avoiding scope bleed into trust-surface work.
- [x] [Review][Patch] Replaced subjective-only completion language with measurable hierarchy, token, mode, and verification requirements so implementation can be reviewed consistently.
- [x] [Review][Patch] Defined which controls count as progress-driving actions versus supportive controls, reducing ambiguity around any shared button hierarchy change.
- [x] [Review][Patch] Added an explicit runtime-import note for `src/styles/motion.css` so motion polish cannot be "implemented" without actually loading.
- [x] [Review][Patch] Added navigation source-of-truth references so presentation work does not accidentally drift from the existing anchor/focus contract.

### References

- [Source: _bmad-output/planning-artifacts/epics.md, Story 1.6: Shape the Editorial System]
- [Source: _bmad-output/planning-artifacts/prd.md, FR18-FR22, FR30-FR34, NFR18-NFR21]
- [Source: _bmad-output/planning-artifacts/architecture.md, UX Coverage Map]
- [Source: _bmad-output/planning-artifacts/architecture.md, File Organization Patterns]
- [Source: _bmad-output/planning-artifacts/architecture.md, Requirements Coverage Validation]
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md, Visual Design Foundation]
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md, Design Direction Decision]
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md, Scope Boundaries]
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md, Requirements Traceability]
- [Source: _bmad-output/project-context.md, Critical Implementation Rules]
- [Source: _bmad-output/project-context.md, Code Quality & Style Rules]
- [Source: src/index.css, current theme/token layer]
- [Source: src/components/layout/AppShell.tsx, current shell]
- [Source: src/components/layout/Navbar.tsx, primary navigation chrome]
- [Source: src/components/layout/MobileMenu.tsx, mobile navigation chrome]
- [Source: src/components/layout/SectionProgressRail.tsx, section progress chrome]
- [Source: src/components/sections/HeroNarrativeFrame.tsx, opening hero surface]
- [Source: src/components/sections/ChapterTransitionBlock.tsx, chapter reset surface]
- [Source: src/components/sections/InsightRecapCard.tsx, recap/support surface]
- [Source: src/components/sections/NarrativeSection.tsx, section shell]
- [Source: src/data/sections/conclusion-content.ts, current conclusion/source-landing copy]
- [Source: src/data/navigation.ts, canonical section ids and chapter order]
- [Source: src/contexts/NavigationContext.tsx, current anchor-navigation and focus contract]
- [Source: src/main.tsx, active stylesheet import path]
- [Source: tests/e2e/home.spec.ts, existing smoke coverage baseline]

## Story Completion Status

- done
- Ultimate context engine analysis completed - comprehensive developer guide created

## Change Log

- 2026-04-25: Implemented the shared editorial token system, updated journey shell/surfaces, expanded E2E coverage, and moved story status to review.
- 2026-04-26: Marked the story as done after implementation verification and completion handoff.

## Dev Agent Record

### Agent Model Used

GPT-5 Codex

### Debug Log References

- 2026-04-25: Reviewed epic 1.6, PRD FR18-FR22/FR30-FR34/NFR18-NFR21, UX design foundation, project context, and the live source tree to shape the story.
- 2026-04-25: Confirmed the current shared surfaces are `src/index.css`, `AppShell`, `Navbar`, `MobileMenu`, `SectionProgressRail`, `HeroNarrativeFrame`, `ChapterTransitionBlock`, `NarrativeSection`, and `InsightRecapCard`.
- 2026-04-25: Confirmed there is not yet a dedicated `references` component surface, so the conclusion/source-landing treatment should stay aligned with the shared editorial system.
- 2026-04-25: Switched to the correct story branch: `codex/story-1-6-shape-the-editorial-system`.
- 2026-04-25: Recent implementation pattern from stories 1.4 and 1.5 was to update the story artifact, shared section/chrome components, and `tests/e2e/home.spec.ts` together.
- 2026-04-25: Ran GitNexus impact analysis before editing `App`, `AppShell`, `Navbar`, `MobileMenu`, `SectionProgressRail`, `HeroNarrativeFrame`, `ChapterTransitionBlock`, `NarrativeSection`, and `InsightRecapCard`; all returned LOW risk with no direct callers or affected processes.
- 2026-04-25: Implemented centralized editorial tokens and component-level surface consumption without changing the anchor-navigation or focus recovery contract.
- 2026-04-25: Verified with `pnpm typecheck`, `pnpm lint`, `pnpm build`, `pnpm exec vitest run src`, and `pnpm test:e2e -- tests/e2e/home.spec.ts`.
- 2026-04-25: `pnpm exec vitest run` without a path still loads Playwright E2E specs and fails because Playwright tests are not Vitest tests; reran scoped to `src`, which passed.
- 2026-04-25: Used `playwright-cli` against local Vite at `http://127.0.0.1:5173` for a rendered desktop sanity pass; temporary screenshot/log artifacts and server process were cleaned up.

### Completion Notes List

- Ready-for-dev context assembled for the editorial-system story.
- No implementation code was changed as part of story creation.
- The story preserves the established anchor-navigation and recap contracts while focusing the next implementation on shared presentation and hierarchy.
- Review patch tightened scope boundaries, clarified action hierarchy, and added concrete verification expectations for tokens, themes, motion, and conclusion/source-adjacent treatment.
- Implemented a centralized editorial system in `src/index.css` with documented Diplomatic Editorial, Strategic Atlas, and Institutional Ledger token responsibilities.
- Updated shell, navigation chrome, hero, chapter transitions, narrative sections, recap cards, and the conclusion/source landing summary to consume shared editorial surface/action rules.
- Added flow-level Playwright checks for shared surface markers, primary versus secondary action hierarchy, source-facing visual distinction, responsive checkpoints, reduced motion, and light/dark readability.
- Manual verification checklist recorded: light mode readable, dark mode readable, hero CTA is the only hero primary action, nav/rail/return/disclosure controls remain secondary, conclusion summary uses the calmer ledger surface, and chapter transitions read as resets within the same editorial family.

### File List

- `_bmad-output/implementation-artifacts/1-6-shape-the-editorial-system.md`
- `_bmad-output/implementation-artifacts/sprint-status.yaml`
- `src/App.tsx`
- `src/index.css`
- `src/components/layout/AppShell.tsx`
- `src/components/layout/Navbar.tsx`
- `src/components/layout/MobileMenu.tsx`
- `src/components/layout/SectionProgressRail.tsx`
- `src/components/sections/HeroNarrativeFrame.tsx`
- `src/components/sections/ChapterTransitionBlock.tsx`
- `src/components/sections/NarrativeSection.tsx`
- `src/components/sections/InsightRecapCard.tsx`
- `tests/e2e/home.spec.ts`
