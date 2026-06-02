# Chapter 3 System Under Pressure Implementation Plan

Status: Planning handoff for fresh implementation context
Created: 2026-06-01
Scope: Bring Chapter 3, `The System Under Pressure`, into the main public homepage
Implementation status: Not started

## Non-Implementation Boundary

This document is a planning artifact only. It intentionally does not modify runtime code.

The next implementation agent should use this file as the handoff plan, then re-check the current working tree before editing because this repository already has unrelated uncommitted changes.

## Context Sources Used

- Planning docs:
  - `archive/docs/planning-artifacts/public-redesign-plans/public-homepage-four-page-deadline-implementation-plan.md`
  - `archive/docs/planning-artifacts/public-redesign-plans/public-homepage-four-page-asset-resource-brief.md`
  - `archive/docs/planning-artifacts/public-redesign-plans/public-homepage-implementation-checklist.md`
  - `archive/docs/planning-artifacts/public-redesign-plans/public-homepage-redesign-proposal.md`
- Chapter 3 mockup image:
  - `archive/docs/planning-artifacts/generated-mockups/public-homepage-redesign/chapter-3-system-under-pressure-mockup-01.png`
- Production-ready Chapter 3 background asset:
  - `public/images/public-homepage/resource-pack/system-under-pressure/backgrounds/chapter-3-system-under-pressure-background-03.png`
- Mockup implementation reference:
  - `src/mockups/public-homepage-redesign/SystemUnderPressureMockupPage.tsx`
  - `src/mockups/public-homepage-redesign/systemUnderPressureMockupData.ts`
  - `src/mockups/public-homepage-redesign/system-under-pressure-mockup.css`
- Graphify reports:
  - `graphify-out-merged/GRAPH_REPORT.md`
  - `graphify-out/GRAPH_REPORT.md`
- GitNexus repository:
  - `global-governance-docuweb`

Graphify freshness note:

- Graphify reports were built from commit `7323c4aa`.
- Current HEAD during this planning pass was `25ced3edffd84bd8de41fe432f503a4889a84219`.
- Treat Graphify as architecture orientation. Treat current source and GitNexus as stronger implementation truth.

GitNexus freshness note:

- GitNexus index for `global-governance-docuweb` matched current HEAD during this planning pass.
- GitNexus reported 264 files, 3357 symbols, 6745 edges, and 281 processes.

## Executive Intent

Implement Chapter 3 on the main public homepage as `The System Under Pressure`.

The page should merge the old `UN Command Center` and `Governance limits and enforcement` chapters into one coherent chapter:

- Institutions organize cooperation.
- Rules and procedures structure choices.
- State interests, consent, vetoes, leverage, and political will constrain outcomes.
- The learner should leave with the key idea: institutions make cooperation possible, but politics decides how far rules travel.

The visible homepage should move toward the deadline four-chapter structure:

1. Hero Narrative Frame
2. Global Governance Overview
3. The System Under Pressure
4. West Philippine Sea Case File

## Current State

### Homepage Composition

The public homepage is composed in `src/App.tsx`.

Current flow:

1. `AppShell` wraps the public experience.
2. `HeroNarrativeFrame` renders first with `id={defaultChapterId}`.
3. `coreNarrativeSections.map(...)` renders the remaining narrative sections.
4. The render switch maps specific section IDs to specialized components:
   - `un-command-center` renders `UNCommandCenter`.
   - `west-philippine-sea-dossier` renders `WpsDossier`.
   - `global-governance-overview` renders `GlobalGovernanceOverviewChapter`.
   - all other sections render `NarrativeSection`.
5. `ChapterTransitionBlock` renders when `chapterTransitionsBySectionId` has a transition for the current section.

Key file:

- `src/App.tsx`

### Six-Chapter Model Locations

The six-chapter model still exists in several layers.

Primary navigation data:

- `src/data/navigation.ts`
- `chapterNavigation` currently contains:
  - `hero-narrative-frame`
  - `global-governance-overview`
  - `un-command-center`
  - `governance-limits`
  - `west-philippine-sea-dossier`
  - `conclusion-references`

Narrative order:

- `src/data/sections/core-narrative.ts`
- `coreNarrativeSections` currently contains:
  - `globalGovernanceOverview`
  - `unCommandCenter`
  - `governanceLimits`
  - `westPhilippineSeaDossier`
  - `conclusionContent`

Recap cue validation:

- `src/data/sections/core-narrative.ts`
- `resolveNarrativeRecapCue(...)` checks a section recap against the canonical next section returned by `getCanonicalRecapTargetId(...)`.
- If section order changes but recap metadata is not updated, recap links silently disappear.

Visible navigation and progress:

- `src/components/layout/Navbar.tsx`
- `src/components/layout/MobileMenu.tsx`
- `src/components/layout/SectionProgressRail.tsx`
- `src/components/layout/IdleScrollCue.tsx`
- These components all depend on `chapterNavigation`.

Hash routing and legacy redirects:

- `src/contexts/NavigationContext.tsx`
- `src/data/navigation.ts`
- `NavigationProvider` uses `resolveKnownSectionId(...)`, `isChapterId(...)`, and `getAdjacentChapterId(...)`.
- Current legacy redirects only map `journey-start` to `global-governance-overview`.

Chat context:

- `src/components/chat/SourceAwareChat.tsx`
- `src/data/chat/source-aware-chat.ts`
- `supabase/functions/_shared/chat-protection.ts`
- `src/data/source-bundles/approved-source-bundle.ts`
- `SourceAwareChat` sends `currentSectionId: activeSectionId`.
- Frontend starter prompts and server-side boundary keywords still include separate `un-command-center`, `governance-limits`, and `conclusion-references` entries.

Tests:

- `src/data/sections/core-narrative.test.ts`
- `src/components/modules/UNCommandCenter/UNCommandCenter.test.tsx`
- `src/data/chat/source-aware-chat.test.ts`
- `src/lib/chat/grounded-answer.test.ts`
- `supabase/functions/tests/chat.test.ts`
- `supabase/functions/tests/chat-boundary-validation.test.ts`
- `tests/playwright/home-page-helpers.ts`
- `tests/e2e/home-smoke.spec.ts`
- `tests/e2e/home-layout.spec.ts`
- `tests/e2e/home-journey.spec.ts`
- `tests/e2e/public-homepage-redesign.smoke.spec.ts`

### Existing Chapter 3 Code That Can Be Reused

Current production Chapter 3:

- `src/components/modules/UNCommandCenter/UNCommandCenter.tsx`
- `src/data/sections/un-command-center.ts`

Reusable traits:

- Local selected-organ state.
- Accessible button controls with `aria-pressed`.
- `aria-live` detail panel.
- Existing `InsightRecapCard` integration.
- Existing tests proving organ selection and disclosure behavior.
- Existing UN organ content for General Assembly, Security Council, Secretariat, International Court, and specialized agencies.

Current Governance Limits content:

- `src/data/sections/governance-limits.ts`

Reusable traits:

- Core thesis: rules matter but do not enforce themselves.
- Constraint language around consent, coalitions, leverage, and political will.
- Existing transition language into the WPS case file.

Mockup code that can be reused as production reference:

- `src/mockups/public-homepage-redesign/SystemUnderPressureMockupPage.tsx`
- `src/mockups/public-homepage-redesign/systemUnderPressureMockupData.ts`
- `src/mockups/public-homepage-redesign/system-under-pressure-mockup.css`

Reusable mockup assets/data:

- `systemPressureBackground`
- `institutionRooms`
- `pressureNodes`
- `constraintCards`
- `systemPressureCopy`
- Layout concept: left institution rooms, center pressure diagram, right constraints panel, bottom four-chapter preview, next card to WPS.

Do not directly mount the mockup page inside the production homepage. Convert the useful structure into production-owned component/data/CSS so the main page keeps the existing shell, navigation provider, chat, and accessibility contracts.

## Target State

### Chapter 3 Experience

Chapter 3 should render as a full-screen visual chapter aligned with the approved mockup direction.

Required visible content:

- Chapter label: `Chapter 3`
- Main title: `The System Under Pressure`
- Subtitle: `Institutions organize cooperation. Politics tests the limits.`
- Left panel: institution rooms
- Center: pressure diagram
  - `Rules`
  - `Institutions`
  - `State Choices`
  - `Outcomes`
- Right panel: constraints
  - `Consent`
  - `Veto`
  - `Political Will`
  - `Leverage`
  - `Uneven Enforcement`
- Bottom or recap takeaway:
  - `Institutions make cooperation possible. Politics decides how far it goes.`

Required educational merge:

- Preserve the UN as a shared address for global politics.
- Preserve major UN bodies as institutional rooms.
- Add the governance-limits lesson into the same chapter.
- Make enforcement limits the payoff, not a separate chapter.

### Navigation Target

Visible production navigation should show four stops:

1. `Hero Narrative Frame`
2. `Global Governance Overview`
3. `The System Under Pressure`
4. `West Philippine Sea Case File`

Recommended canonical-ID posture for deadline safety:

- Keep the canonical Chapter 3 section ID as `un-command-center` for this phase.
- Change the visible label, title, shell copy, and data to `The System Under Pressure`.
- Add legacy hash redirect from `governance-limits` to `un-command-center`.
- Add legacy hash redirect from `conclusion-references` to `west-philippine-sea-dossier` only if Chapter 4 conclusion/reference folding is included in the same implementation. If Chapter 4 folding is not implemented yet, defer this redirect.

Reason:

- Keeping `un-command-center` avoids a wider rename across chat context, approved source adapters, server protection, tests, and source maps.
- The user-visible experience can still show `The System Under Pressure`.
- Old `#governance-limits` links can preserve behavior through redirect.

Long-term cleaner alternative:

- Migrate canonical ID to `system-under-pressure`.
- Update chat prompt maps, server boundary keywords, approved source section IDs, tests, hash redirects, and any source maps.
- This is cleaner semantically, but broader and riskier under deadline pressure.

Recommendation:

- Use the deadline-safe canonical ID approach for this implementation.
- Document a future cleanup task to rename `un-command-center` to `system-under-pressure` after the four-page deadline build stabilizes.

## Remove / Replace / Preserve

### Remove From Visible Production Navigation

Remove these visible navigation stops from `chapterNavigation`:

- `governance-limits`
- `conclusion-references`

Important:

- Removing from `chapterNavigation` affects `Navbar`, `MobileMenu`, `SectionProgressRail`, `IdleScrollCue`, `chapterCount`, and adjacent chapter movement.
- Do not remove the underlying content files yet unless the implementation also finishes Chapter 4 conclusion/reference folding.

### Remove From Production Narrative Order

Remove `governanceLimits` from `coreNarrativeSections`.

For this Chapter 3 task, two options exist for `conclusionContent`:

Option A, strict Chapter 3 only:

- Leave `conclusionContent` in `coreNarrativeSections` temporarily.
- But this conflicts with four visible navigation stops because the conclusion would still render on the page without nav.
- Not recommended unless Chapter 4 is explicitly out of scope and the team accepts a temporary hidden section.

Option B, deadline-aligned:

- Remove `conclusionContent` from `coreNarrativeSections`.
- Preserve the file for future reuse when Chapter 4 folds references into WPS.
- Update WPS recap metadata so the WPS page returns to the opening chapter or has no next-step link until Chapter 4 finale merge is implemented.
- Recommended for the four-page deadline migration if the implementation is allowed to touch final order.

Recommended implementation:

- Remove both `governanceLimits` and `conclusionContent` from production order.
- Do not delete their source files in this phase.
- Use `governanceLimits` as input content for merged Chapter 3.
- Leave `conclusion-content.ts` intact for Chapter 4 follow-up work.

### Replace / Rename

Replace visible `UN Command Center` labels with `The System Under Pressure` in:

- `src/data/navigation.ts`
- `src/data/sections/un-command-center.ts`
- `src/data/sections/global-governance-overview.ts`
- `src/data/sections/global-governance-overview-visual.ts`
- `src/components/sections/GlobalGovernanceOverviewChapter.tsx` fallback label, if fallback remains.
- Tests that assert visible labels.

Possible component naming:

Deadline-safe option:

- Keep file/component name `UNCommandCenter` in this phase.
- Update visible UI and data to `The System Under Pressure`.
- This avoids file renames and import churn.

Cleaner option:

- Rename component folder and function to `SystemUnderPressure`.
- Use GitNexus rename if renaming symbols.
- Update imports, tests, and references.
- More work and higher risk.

Recommendation:

- Keep `UNCommandCenter` as the internal component name for this phase.
- Add an implementation note in the component or data only if necessary. Avoid noisy comments unless code becomes confusing.

### Preserve

Preserve these compatibility contracts:

- `#un-command-center` should still work as the canonical Chapter 3 anchor for now.
- `#governance-limits` should redirect to `#un-command-center`.
- `#journey-start` should continue redirecting to `#global-governance-overview`.
- Chat should continue to receive a valid `currentSectionId`.
- Reduced-motion behavior should not introduce transitions that ignore existing motion safeguards.
- Keyboard navigation and focus behavior should remain intact through `NavigationProvider`.
- Existing source bundle section IDs should not be changed unless the implementation intentionally updates frontend and Supabase chat/source behavior together.

## GitNexus Blast-Radius Notes

These impact checks were run during planning.

### `UNCommandCenter`

- File: `src/components/modules/UNCommandCenter/UNCommandCenter.tsx`
- Risk: LOW
- Impact:
  - Direct impacted item: `src/components/modules/UNCommandCenter/UNCommandCenter.test.tsx`
  - No affected execution flows reported.
- Interpretation:
  - Reworking this component is locally safe if tests are updated.
  - Browser layout tests may still need updates because they assert visible names and layout markers.

### `GlobalGovernanceOverviewChapter`

- File: `src/components/sections/GlobalGovernanceOverviewChapter.tsx`
- Risk: LOW
- Impact:
  - Direct caller: `src/App.tsx`
  - Affected module: `Sections`
- Interpretation:
  - Updating next-card fallback labels or destination behavior is low risk.

### `NavigationProvider`

- File: `src/contexts/NavigationContext.tsx`
- Risk: LOW
- Impact:
  - Direct caller: `AppShell`
  - Indirect caller: `App`
  - Affected process: `AppShell`
- Interpretation:
  - Avoid changing this function unless necessary.
  - Prefer updating `chapterNavigation` and `legacySectionRedirects` instead of editing navigation logic.

### `resolveNarrativeRecapCue`

- File: `src/data/sections/core-narrative.ts`
- Risk: HIGH
- Impact:
  - Direct users: `NarrativeSection`, `GlobalGovernanceOverviewChapter`, `WpsDossier`, `UNCommandCenter`, `core-narrative.test.ts`
  - Affected processes:
    - `NarrativeSection`
    - `WpsDossier`
    - `GlobalGovernanceOverviewChapter`
    - `UNCommandCenter`
- Interpretation:
  - Do not change the logic unless absolutely necessary.
  - Change `coreNarrativeSections` order and section recap metadata instead.
  - Update tests to match the new canonical order.

### `isCourseBoundaryQuestion`

- File: `supabase/functions/_shared/chat-protection.ts`
- Risk: LOW
- Impact:
  - Direct caller: `evaluateChatProtection`
  - Test impact: `supabase/functions/tests/chat.test.ts`, `supabase/functions/tests/chat-boundary-validation.test.ts`
  - Runtime impact: `supabase/functions/chat/index.ts`
- Interpretation:
  - Do not edit chat protection in the Chapter 3 UI pass unless changing canonical IDs.
  - If keeping `un-command-center`, no server-side chat protection edit should be required for this phase.

## File-by-File Implementation Plan

### `src/data/navigation.ts`

Current responsibility:

- Defines visible chapter navigation.
- Exports `chapterCount`, `defaultChapterId`, `isChapterId`, `resolveKnownSectionId`, and adjacent chapter helpers.

Proposed change:

- Keep `hero-narrative-frame` and `global-governance-overview`.
- Update the `un-command-center` item:
  - `number: 3`
  - `label: "The System Under Pressure"`
  - `shellLabel: "The System Under Pressure"`
  - `mobileLabel: "Pressure"` or `"System Pressure"`
  - `eyebrow: "Institutions under pressure"` or `"Institutions"`
  - `summary: "Institutions organize cooperation while politics tests enforcement limits."`
  - `themeKey: "system-pressure"` or keep `"command-center"` if CSS depends on old theme.
  - `defaultPanelId: "general-assembly"` or a new `"rules"` / `"coordination"` panel if active-panel state is introduced.
  - `chapterKind: "analysis"` or `"module"`. Prefer `"analysis"` if the chapter now centers on institutions plus limits.
- Update `west-philippine-sea-dossier`:
  - `number: 4`
  - `shellLabel: "West Philippine Sea Case File"`
  - `label: "West Philippine Sea Case File"` or preserve lower-case style if tests expect label capitalization.
  - `mobileLabel: "WPS Case"`
- Remove `governance-limits` and `conclusion-references` from `chapterNavigation`.
- Expand `legacySectionRedirects`:
  - `journey-start -> global-governance-overview`
  - `governance-limits -> un-command-center`
  - `conclusion-references -> west-philippine-sea-dossier` only if conclusion is removed from production order in this pass.

Risk level:

- Medium.
- GitNexus reported `chapterNavigation` impact as low previously, but source search shows broad consumers through imported data.

Tests/checks affected:

- Navigation unit behavior indirectly through browser tests.
- `tests/playwright/home-page-helpers.ts`
- `tests/e2e/*` files with six-chapter assumptions.

### `src/data/sections/core-narrative.ts`

Current responsibility:

- Defines the production narrative order after the hero.
- Defines transition blocks.
- Validates recap cue targets against canonical section order.

Proposed change:

- Remove `governanceLimits` from `coreNarrativeSections`.
- Remove `conclusionContent` from `coreNarrativeSections` if executing the four-chapter deadline order now.
- Result should be:
  - `globalGovernanceOverview`
  - `unCommandCenter`
  - `westPhilippineSeaDossier`
- Update `chapterTransitionsBySectionId`:
  - Keep `[globalGovernanceOverview.id, institutionsTransition]` only if text is updated to Chapter 3.
  - Remove `[unCommandCenter.id, constraintsTransition]`.
  - Remove `[governanceLimits.id, caseFileTransition]`.
  - Add `[unCommandCenter.id, caseFileTransition]`, or create a renamed transition like `caseFileTransition` with language from `governance-limits.ts`.
- Do not change `resolveNarrativeRecapCue(...)` logic.

Risk level:

- Medium to high because `resolveNarrativeRecapCue` uses this order and tests assert exact next-step targets.

Tests/checks affected:

- `src/data/sections/core-narrative.test.ts`
- `UNCommandCenter` recap behavior.
- WPS recap behavior.

### `src/data/sections/un-command-center.ts`

Current responsibility:

- Defines Chapter 3 narrative content, UN organ data, shell copy, and transition into constraints.

Proposed change:

- Update `unCommandCenter` visible content:
  - Keep `id: "un-command-center"` for deadline safety.
  - `navigationLabel: "The System Under Pressure"`
  - `eyebrow: "Institutions under pressure"`
  - `title: "The System Under Pressure"`
  - `summary`: merge UN coordination with political/enforcement limits.
  - `thesis`: institutions organize cooperation, but state choices and political will decide outcomes.
  - `supportingDetails`: include concise points from both current UN content and `governanceLimits`.
  - `disclosures`: either preserve one local disclosure or replace with "How institutions organize pressure" and "Why enforcement remains uneven".
  - `synthesis`: use the mockup takeaway.
  - `recap.nextStepLabel`: `Continue to West Philippine Sea Case File`
  - `recap.nextStepTargetId`: `west-philippine-sea-dossier`
- Keep `unOrgans` but consider small wording updates:
  - Make each `limit` field sharper and consistent with pressure theme.
  - Consider replacing `Secretariat` visible room in the production UI with "International Law" if using mockup room list. If preserving `unOrgans`, keep Secretariat as an inspectable UN room for accuracy.
- Add production-owned data for the new visual layer if not creating a separate data file:
  - pressure nodes
  - constraint cards
  - background asset path
  - chapter bottom summaries
- Deprecate or stop exporting `constraintsTransition` if no longer used.

Risk level:

- Low to medium.
- Mostly data/copy, but recap metadata affects navigation behavior.

Tests/checks affected:

- `src/components/modules/UNCommandCenter/UNCommandCenter.test.tsx`
- `src/data/sections/core-narrative.test.ts`
- Playwright expectations for visible text.

### `src/data/sections/governance-limits.ts`

Current responsibility:

- Defines old standalone Governance Limits section and transition to WPS.

Proposed change:

- Do not delete the file in this phase.
- Use its `summary`, `thesis`, `supportingDetails`, `synthesis`, and `caseFileTransition` as source material for merged Chapter 3.
- If `caseFileTransition` remains imported by `core-narrative.ts`, it can continue living here. Consider moving it later to a more neutral file if the old standalone section is retired fully.
- Add a short code comment only if future readers would otherwise assume the file is dead. Example:
  - `// Retained as source content for the merged System Under Pressure chapter until the four-page migration is fully cleaned up.`
- Avoid deleting old content until Chapter 4 folding is complete and tests are migrated.

Risk level:

- Low if left intact.
- Medium if imports are removed and lint detects unused exports or tests still import it.

Tests/checks affected:

- Minimal unless imports are removed or tests target old content.

### `src/components/modules/UNCommandCenter/UNCommandCenter.tsx`

Current responsibility:

- Renders current UN Command Center as a long editorial section with entry controls, organ explorer, disclosure, and recap.

Proposed change:

- Convert the rendered surface into a full-screen chapter aligned with `SystemUnderPressureMockupPage`.
- Keep the function/component name for deadline safety.
- Change outer section:
  - Keep `id={content.id}`.
  - Use `aria-labelledby={headingId}` or keep `aria-label={content.navigationLabel}` with correct label.
  - Set `data-editorial-surface="system-under-pressure"` or keep existing plus add `data-chapter="system-under-pressure"` for tests. Prefer the new data surface and update tests.
  - Use `mockup-chapter-stage` class like Hero and Overview.
- Add a background image using the production asset path.
- Build layout:
  - Header: Chapter 3 title/subtitle.
  - Left aside: institution rooms or existing organ buttons.
  - Center section: pressure diagram.
  - Right aside: constraints cards.
  - Bottom/nav/recap: compact four-chapter preview or next card to WPS.
- Preserve accessibility:
  - Institution room buttons need `type="button"`.
  - Active selection must expose `aria-pressed`.
  - Detail panel should keep `aria-live="polite"` if selected room details update.
  - Section should be focusable via `tabIndex={-1}` for hash navigation.
  - Do not rely on visual-only labels for the pressure diagram. Include an `sr-only` explanation.
- Preserve reduced-motion:
  - Avoid animated transitions unless covered by `motion-reduce` CSS or the existing global reduced-motion block.
  - If importing mockup CSS patterns, strip purely decorative motion or ensure `@media (prefers-reduced-motion: reduce)` removes it.

Risk level:

- Medium.
- GitNexus direct upstream impact is low, but browser layout and accessibility expectations change.

Tests/checks affected:

- `src/components/modules/UNCommandCenter/UNCommandCenter.test.tsx`
- `tests/playwright/home-page-helpers.ts`
- A new focused Playwright spec recommended below.

### `src/components/modules/UNCommandCenter/UNCommandCenter.test.tsx`

Current responsibility:

- Tests local organ selection and disclosure behavior.

Proposed change:

- Keep a local component test for room selection.
- Update names from `UN Command Center` framing to `The System Under Pressure`.
- Assert:
  - Default room is selected.
  - Selecting Security Council or Consent/Veto related control updates visible details.
  - Pressure diagram labels render.
  - Constraints list renders.
  - Next link points to `#west-philippine-sea-dossier`.

Risk level:

- Low.

Tests/checks affected:

- `pnpm test:unit`

### `src/components/sections/GlobalGovernanceOverviewChapter.tsx`

Current responsibility:

- Renders Chapter 2 visual page and next card.
- Uses recap cue or fallback:
  - `nextTargetId` fallback is `un-command-center`.
  - `nextLabel` fallback is `Continue to UN Command Center`.

Proposed change:

- Keep target ID fallback as `un-command-center`.
- Change label fallback to `Continue to The System Under Pressure`.
- Ensure visible next card copy comes from `overviewVisualCopy.nextTitle`.
- If `global-governance-overview.ts` recap metadata is updated correctly, fallback should rarely matter. Still update it to avoid stale screen-reader text.

Risk level:

- Low.

Tests/checks affected:

- `tests/e2e/public-homepage-redesign.smoke.spec.ts`
- Any tests looking for `Continue to UN Command Center`.

### `src/data/sections/global-governance-overview.ts`

Current responsibility:

- Defines Chapter 2 narrative and recap metadata.

Proposed change:

- Update recap:
  - `nextStepLabel: "Continue to The System Under Pressure"`
  - `nextStepTargetId: "un-command-center"` if keeping canonical ID.
- Optionally update transition copy from "main room" to "system under pressure".

Risk level:

- Low.

Tests/checks affected:

- `src/data/sections/core-narrative.test.ts`
- Playwright tests asserting the old label.

### `src/data/sections/global-governance-overview-visual.ts`

Current responsibility:

- Defines Chapter 2 visual labels and next-card copy.

Proposed change:

- Update:
  - `nextTitle: "The System Under Pressure"`
  - `nextBody`: e.g. `See how institutions organize cooperation while politics tests their limits.`
  - If the next asset still says UN command visually, either keep for deadline if acceptable or replace later with a system-pressure asset.

Risk level:

- Low.

Tests/checks affected:

- `tests/e2e/public-homepage-redesign.smoke.spec.ts`
- Focused Chapter 3 flow spec.

### `src/components/layout/Navbar.tsx`

Current responsibility:

- Renders desktop command bar from `chapterNavigation`.
- Uses `chapterCount` for `01 / 06` style progress.

Proposed change:

- Ideally no direct code changes.
- It should automatically show four items and progress `03 / 04` after `chapterNavigation` changes.
- Verify labels fit at desktop widths because `The System Under Pressure` is longer than `UN Command Center`.

Risk level:

- Low if untouched.
- Medium if CSS needs adjustment.

Tests/checks affected:

- New focused Playwright spec.
- Existing old E2E specs if they are run.

### `src/components/layout/MobileMenu.tsx`

Current responsibility:

- Renders mobile chapter list from `chapterNavigation`.

Proposed change:

- Ideally no direct code changes.
- Verify only four links appear.
- Verify `Current chapter: The System Under Pressure` appears after navigating to Chapter 3.

Risk level:

- Low if untouched.

Tests/checks affected:

- New focused Playwright spec.

### `src/components/layout/SectionProgressRail.tsx`

Current responsibility:

- Screen-reader-only progress nav from `chapterNavigation`.

Proposed change:

- Ideally no direct code changes.
- Verify only four accessible links after data update.

Risk level:

- Low if untouched.

Tests/checks affected:

- Accessibility checks in new focused spec if included.

### `src/components/layout/IdleScrollCue.tsx`

Current responsibility:

- Uses `chapterNavigation` and active chapter index to decide whether a next-chapter cue exists.

Proposed change:

- Ideally no direct code changes.
- Verify Chapter 3 cue goes to WPS and Chapter 4 has no next cue.

Risk level:

- Low if untouched.

Tests/checks affected:

- Optional browser assertion in focused spec.

### `src/contexts/NavigationContext.tsx`

Current responsibility:

- Tracks active section/chapter.
- Handles hash reconciliation, redirects, focus, scroll, adjacent chapter movement, and active panel state.

Proposed change:

- Avoid editing.
- Let `legacySectionRedirects` in `navigation.ts` handle `#governance-limits`.
- If `#conclusion-references` redirect is needed, add it to `navigation.ts`.

Risk level:

- Low if untouched.
- GitNexus impact for editing `NavigationProvider` is low, but this is foundational behavior. Avoid logic changes.

Tests/checks affected:

- Focused hash redirect spec.

### `src/data/chat/source-aware-chat.ts`

Current responsibility:

- Defines frontend starter prompts by active section ID.

Proposed change:

- If keeping canonical `un-command-center`:
  - Merge the old `governance-limits` starter prompts into the `un-command-center` prompt set.
  - Keep the `governance-limits` key temporarily so old section IDs passed from tests or redirected states still get useful prompts.
  - If `conclusion-references` is redirected to WPS, decide whether to keep its starter prompts as fallback only.
- If migrating canonical ID to `system-under-pressure`:
  - Add `system-under-pressure` to `SourceAwareChatSectionId`.
  - Duplicate or move prompts.
  - Update all callers/tests/server source maps accordingly.

Recommended for this phase:

- Keep `un-command-center`.
- Merge starter prompt wording into the Chapter 3 prompt set.
- Do not remove `governance-limits` or `conclusion-references` entries yet.

Risk level:

- Low to medium.

Tests/checks affected:

- `src/data/chat/source-aware-chat.test.ts`
- `src/components/chat/SourceAwareChat.test.tsx`

### `src/data/source-bundles/approved-source-bundle.ts`

Current responsibility:

- Maps approved sources to chat citation section IDs and evidence/reference adapters.

Proposed change:

- Avoid changing in this phase if keeping `un-command-center`.
- Current source mappings already connect the course frame and UN Charter to both `un-command-center` and `governance-limits`.
- If `conclusion-references` is removed from visible production, do not remove source references until Chapter 4 source/reference folding is implemented.

Risk level:

- Low if untouched.
- Medium to high if changed, because source identity and chat citations are contract-like.

Tests/checks affected:

- Chat/source tests.
- Supabase function tests if server bundle differs.

### `supabase/functions/_shared/chat-protection.ts`

Current responsibility:

- Defines server-side section boundary keywords for chat protection.

Proposed change:

- Avoid editing if keeping `un-command-center`.
- Existing `un-command-center` and `governance-limits` keys already cover the merged topic.
- Only update if canonical section ID changes to `system-under-pressure`.

Risk level:

- Low if untouched.
- GitNexus impact for `isCourseBoundaryQuestion` is low, but it touches `evaluateChatProtection`, chat endpoint behavior, and Supabase function tests.

Tests/checks affected:

- `pnpm test:functions` if edited.

### `tests/playwright/home-page-helpers.ts`

Current responsibility:

- Shared helper data and layout assertions for broad homepage Playwright specs.

Proposed change:

- Do not make this the main verification path.
- If old specs must remain runnable, update:
  - `chapterNames` to four visible labels.
  - `narrativeSections` to current visible sections.
  - `summaryFirstSections` if conclusion is removed.
  - `recapCues` to the new order.
  - Rename or replace `expectUNComparisonLayout` only if reused by focused specs.
- Prefer adding a new helper specific to Chapter 3 if the old helper is too tied to the six-chapter page.

Risk level:

- Medium because broad old tests depend on this shared data.

Tests/checks affected:

- All old Playwright specs that import this helper.

### New Focused Playwright Spec

Recommended new file:

- `tests/e2e/public-homepage-four-chapter-chapter3.smoke.spec.ts`

Purpose:

- Fast browser confidence for only the new four-chapter Chapter 3 flow.
- Avoid using the old broad default homepage suite as the main validation path.

Suggested tags:

- Use `@smoke`.
- Keep it small so `pnpm exec playwright test tests/e2e/public-homepage-four-chapter-chapter3.smoke.spec.ts --grep @smoke` is fast.

Suggested coverage:

1. Navigate to `/`.
2. Assert primary nav has four visible chapter links on desktop:
   - `Hero Narrative Frame`
   - `Global Governance Overview`
   - `The System Under Pressure`
   - `West Philippine Sea Case File`
3. Navigate to Chapter 3 by clicking the nav link.
4. Assert URL is `#un-command-center` if using deadline-safe canonical ID.
5. Assert Chapter 3 region/title is visible:
   - `The System Under Pressure`
   - `Institutions organize cooperation. Politics tests the limits.`
6. Assert pressure diagram labels are visible:
   - `Rules`
   - `Institutions`
   - `State Choices`
   - `Outcomes`
7. Assert constraint labels are visible:
   - `Consent`
   - `Veto`
   - `Political Will`
   - `Leverage`
   - `Uneven Enforcement`
8. Assert old hash redirect:
   - Visit `/#governance-limits`.
   - Expect URL to become `#un-command-center`.
   - Expect Chapter 3 to be focused or visible.
9. Assert mobile nav exposes four links at a small viewport.
10. Assert no horizontal overflow for one desktop and one mobile viewport.

Do not test every legacy old homepage journey here.

## Testing Strategy

### Unit and Component Tests

Run:

- `pnpm test:unit`

Expected updated/added unit tests:

- Update `src/data/sections/core-narrative.test.ts`:
  - Expected next targets should become:
    - `global-governance-overview -> un-command-center`
    - `un-command-center -> west-philippine-sea-dossier`
    - `west-philippine-sea-dossier -> hero-narrative-frame` or no next step, depending on WPS recap decision.
  - If WPS still points to `conclusion-references` after conclusion removal, this test should fail and force a metadata update.
- Update `src/components/modules/UNCommandCenter/UNCommandCenter.test.tsx`:
  - Assert new title and merged content.
  - Assert room selection still works.
  - Assert constraints render.
  - Assert next step targets WPS.
- Update `src/data/chat/source-aware-chat.test.ts` only if starter prompts change.
- Update `src/components/chat/SourceAwareChat.test.tsx` only if active section prompt behavior changes.

### Focused Playwright

Create the new focused spec:

- `tests/e2e/public-homepage-four-chapter-chapter3.smoke.spec.ts`

Run only this spec for browser validation:

- `pnpm exec playwright test tests/e2e/public-homepage-four-chapter-chapter3.smoke.spec.ts --grep @smoke`

Do not use `pnpm test:e2e` as the main verification path for this task unless the user explicitly approves it. The default `pnpm test:e2e` still collects old `@smoke` homepage assumptions and may be slow or noisy until the old broad specs are migrated.

### Existing Broad E2E Tests

Do not make the old broad tests the implementation gate.

Migration strategy:

- Update old broad tests only enough to prevent obviously stale expectations if they are touched.
- Prefer a follow-up cleanup phase to retire or rewrite old six-chapter specs.
- Keep the Chapter 3 implementation gate focused on the new targeted spec plus unit/type/lint/build.

### Supabase Function Tests

Only run if chat/server section IDs are changed:

- `pnpm test:functions`

If keeping `un-command-center` and not changing `supabase/functions/_shared/chat-protection.ts`, function tests are optional for this phase.

## Verification Commands

Recommended order after implementation:

1. `pnpm test:unit`
2. `pnpm typecheck`
3. `pnpm lint`
4. `pnpm build`
5. `pnpm exec playwright test tests/e2e/public-homepage-four-chapter-chapter3.smoke.spec.ts --grep @smoke`

Conditional:

- Run `pnpm format` if formatting-sensitive TS/TSX edits are substantial.
- Run `pnpm test:functions` only if Supabase chat protection, server source mapping, or function tests are changed.
- Run `pnpm test:e2e` only with explicit user approval.

Before any commit:

- Run `gitnexus_detect_changes(scope: "all")`.
- Confirm affected symbols and processes match the intended Chapter 3/navigation/test scope.

## Implementation Sequence

### Step 1: Re-check Worktree and Context

- Run `git status --short`.
- Note unrelated existing changes.
- Do not revert unrelated user or generated changes.
- Re-read this plan and the two active planning docs:
  - `public-homepage-four-page-deadline-implementation-plan.md`
  - `public-homepage-four-page-asset-resource-brief.md`

### Step 2: Re-run Required Impact Checks Before Editing

Before editing these likely symbols, run GitNexus impact checks:

- `UNCommandCenter`, upstream, include tests.
- `GlobalGovernanceOverviewChapter`, upstream, include tests.
- `NavigationProvider` only if touching navigation logic.
- `resolveNarrativeRecapCue` only if considering logic changes. Prefer not to edit it.
- `isCourseBoundaryQuestion` only if touching Supabase chat protection.

If any check returns HIGH or CRITICAL, pause and report before editing.

### Step 3: Update Navigation Data

- Edit `src/data/navigation.ts`.
- Reduce `chapterNavigation` to four visible chapters.
- Keep canonical `un-command-center` for Chapter 3.
- Add `governance-limits -> un-command-center` legacy redirect.
- Add `conclusion-references -> west-philippine-sea-dossier` only if conclusion is removed from production order in this pass.
- Confirm `chapterCount` naturally becomes 4.

### Step 4: Update Narrative Order and Recap Flow

- Edit `src/data/sections/core-narrative.ts`.
- Remove old standalone `governanceLimits` from `coreNarrativeSections`.
- Remove `conclusionContent` if executing the four-page production order now.
- Rewire transitions so `un-command-center` leads to WPS.
- Do not modify `resolveNarrativeRecapCue` unless unavoidable.

### Step 5: Merge Chapter 3 Copy/Data

- Edit `src/data/sections/un-command-center.ts`.
- Update visible Chapter 3 title/label/copy to `The System Under Pressure`.
- Fold in governance-limits ideas.
- Set recap next target to WPS.
- Add or expose pressure diagram and constraint data if the component will import it from this file.
- Preserve old `governance-limits.ts` as source material for now.

### Step 6: Convert the Chapter 3 Component Surface

- Edit `src/components/modules/UNCommandCenter/UNCommandCenter.tsx`.
- Preserve component state and accessibility patterns.
- Adopt the mockup structure:
  - background image
  - heading
  - institution room selector
  - central pressure diagram
  - constraints panel
  - takeaway/next card
- Use existing `Button`, `cn`, and local patterns.
- Keep `tabIndex={-1}` and a reliable accessible name.
- Add stable test selectors only where role/name queries would be brittle.

### Step 7: Add Production CSS

Preferred location:

- `src/index.css`

Plan:

- Do not import mockup CSS directly into production if it is scoped for standalone mockup pages.
- Copy/adapt needed classes under a production-specific namespace, for example:
  - `.system-pressure-chapter-stage`
  - `.system-pressure-panel`
  - `.system-pressure-diagram`
- Ensure mobile layouts stack cleanly.
- Ensure no horizontal overflow.
- Add reduced-motion safeguards if any transitions are introduced.

### Step 8: Update Chapter 2 Next Copy

- Edit `src/data/sections/global-governance-overview.ts`.
- Edit `src/data/sections/global-governance-overview-visual.ts`.
- Edit `src/components/sections/GlobalGovernanceOverviewChapter.tsx` fallback strings if needed.
- Ensure Chapter 2 now points visibly to `The System Under Pressure`.

### Step 9: Preserve Chat Compatibility

- If keeping canonical `un-command-center`, do not change server chat IDs.
- Optionally update frontend starter prompts in `src/data/chat/source-aware-chat.ts` so Chapter 3 prompts include both UN and limits concepts.
- Keep old `governance-limits` prompt mapping temporarily.
- Do not edit source bundle IDs unless a separate source-mapping decision is made.

### Step 10: Update Unit Tests

- Update `src/data/sections/core-narrative.test.ts`.
- Update `src/components/modules/UNCommandCenter/UNCommandCenter.test.tsx`.
- Update chat tests only if prompt data changed.
- Run `pnpm test:unit`.

### Step 11: Add Focused Browser Spec

- Create `tests/e2e/public-homepage-four-chapter-chapter3.smoke.spec.ts`.
- Keep it short and targeted.
- Cover:
  - four visible nav stops
  - Chapter 3 renders
  - old `#governance-limits` redirects
  - desktop/mobile no horizontal overflow
  - basic keyboard or focus confidence
- Run:
  - `pnpm exec playwright test tests/e2e/public-homepage-four-chapter-chapter3.smoke.spec.ts --grep @smoke`

### Step 12: Verification and Scope Audit

- Run:
  - `pnpm test:unit`
  - `pnpm typecheck`
  - `pnpm lint`
  - `pnpm build`
  - targeted Playwright command above
- Run `gitnexus_detect_changes(scope: "all")`.
- Confirm changes affect:
  - Chapter 3 component/data
  - navigation data
  - narrative order
  - focused tests
  - optional chat prompt text
- Confirm changes do not unexpectedly affect backend or Supabase code unless intentionally edited.

## Acceptance Criteria

Implementation is acceptable when:

- The visible main homepage nav has four chapters.
- Chapter 3 is visibly named `The System Under Pressure`.
- Chapter 3 combines institution exploration with enforcement/governance limits.
- Chapter 3 visually follows the approved mockup direction.
- Chapter 2 next path leads to Chapter 3 with updated wording.
- Chapter 3 next path leads to WPS.
- `#governance-limits` does not break and redirects to the merged Chapter 3.
- Chat remains available and receives a supported section context.
- Keyboard focus still lands on the chapter after hash navigation.
- Reduced-motion users are not forced through decorative motion.
- The new focused browser spec passes.
- `pnpm test:unit`, `pnpm typecheck`, `pnpm lint`, and `pnpm build` pass.

## Fresh-Context Execution Checklist

Use this checklist directly in the next context window.

- [ ] Read this plan.
- [ ] Run `git status --short`.
- [ ] Re-read the two active four-page planning docs.
- [ ] Run GitNexus impact for `UNCommandCenter`.
- [ ] Run GitNexus impact for `GlobalGovernanceOverviewChapter`.
- [ ] Run GitNexus impact for `resolveNarrativeRecapCue` if tempted to edit it; avoid editing it if possible.
- [ ] Update `src/data/navigation.ts` to four visible chapters.
- [ ] Add `governance-limits -> un-command-center` legacy redirect.
- [ ] Decide whether `conclusion-references -> west-philippine-sea-dossier` belongs in this same pass.
- [ ] Update `src/data/sections/core-narrative.ts` to remove standalone Governance Limits from production order.
- [ ] Remove conclusion from production order if executing the four-page deadline structure fully.
- [ ] Update `src/data/sections/un-command-center.ts` copy and recap metadata.
- [ ] Rework `src/components/modules/UNCommandCenter/UNCommandCenter.tsx` into the System Under Pressure chapter surface.
- [ ] Add production CSS for the Chapter 3 visual layout.
- [ ] Update Chapter 2 next-card copy/data.
- [ ] Preserve chat compatibility; update frontend starter prompts only if needed.
- [ ] Update component/unit tests.
- [ ] Add the focused Playwright spec.
- [ ] Run `pnpm test:unit`.
- [ ] Run `pnpm typecheck`.
- [ ] Run `pnpm lint`.
- [ ] Run `pnpm build`.
- [ ] Run `pnpm exec playwright test tests/e2e/public-homepage-four-chapter-chapter3.smoke.spec.ts --grep @smoke`.
- [ ] Run `gitnexus_detect_changes(scope: "all")` before any commit.
- [ ] Report any failed checks and whether they are caused by changed implementation or stale old broad E2E assumptions.
