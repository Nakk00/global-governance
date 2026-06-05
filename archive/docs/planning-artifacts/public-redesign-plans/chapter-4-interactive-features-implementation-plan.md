# Chapter 4 Interactive Features Implementation Plan

Status: Draft implementation plan  
Last updated: 2026-06-05  
Scope: Implement the interactive Chapter 4 case-file features shown in the generated mockup

## Reference Inputs

Primary design reference:

- `archive/docs/planning-artifacts/generated-mockups/public-homepage-redesign/chapter-4-interactive-mockup-01.png`

Supporting brief:

- `archive/docs/planning-artifacts/public-redesign-plans/chapter-4-interactive-mockup-design-brief.md`

Primary runtime targets:

- `src/components/modules/WpsDossier/WpsDossier.tsx`
- `src/data/sections/west-philippine-sea-dossier.ts`
- `src/index.css`
- `src/components/modules/WpsDossier/WpsDossier.test.tsx`
- `tests/e2e/public-homepage-four-chapter-chapter4.smoke.spec.ts`

Secondary integration targets:

- `src/components/chat/SourceAwareChat.tsx`
- `src/data/chat/source-aware-chat.ts`
- `src/components/chat/SourceAwareChat.test.tsx`
- `tests/e2e/source-aware-chatbox.smoke.spec.ts`

## Desired Outcome

Chapter 4 should move from a mostly static dossier board into an interactive case-file experience.

The final behavior should let the learner:

1. Choose a starting mode.
2. Click a timeline event and see the map, evidence, and source context respond.
3. Click a map location and see why that place matters.
4. Inspect evidence categories through an expanded source-backed evidence tray.
5. Expand a `Ruling vs Reality` row to understand the legal finding and enforcement gap.
6. Use the existing source-aware chat from the Chapter 4 context without leaving the case-file surface.

## Graphify Evidence

Graphify merged report:

- `graphify-out-merged/GRAPH_REPORT.md`
- built from commit `9a39e93b`
- current `git rev-parse HEAD` returned `9a39e93bc21e1da68e66a684792fb655c5bd78ed`
- therefore the merged and frontend graph reports match the inspected commit

Graphify frontend report:

- `graphify-out/GRAPH_REPORT.md`
- identifies a frontend community around `WpsDossier`, `HeroNarrativeFrame`, `ChapterTransitionBlock`, and the old `WpsEvidenceSurface`
- identifies navigation communities around `NavigationProvider`, `resolveKnownSectionId`, `getChapterIndex`, `getAdjacentChapterId`, and `AppShell`
- identifies chat communities around `SourceAwareChat`, starter prompts, and grounded chat request handling
- identifies Playwright helper and layout assertion communities around viewport containment, touch target checks, focus checks, and WPS comparison helpers

Graphify query result:

- query: `Chapter 4 WpsDossier interactions timeline map evidence chat navigation`
- traversal started from `WpsDossier`, `WpsEvidenceSurface`, and related WPS nodes
- returned nearby nodes in `App.tsx`, `WpsDossier.tsx`, `WpsDossier.test.tsx`, `AppShell`, `NavigationProvider`, `GlobalGovernanceOverviewChapter`, `UNCommandCenter`, `core-narrative.ts`, and `renderWithNavigation`

Important graph caveat:

- Graphify still surfaced `WpsEvidenceSurface`, but direct file search shows `src/components/modules/WpsDossier/WpsEvidenceSurface.tsx` is currently deleted in the working tree.
- Treat `WpsEvidenceSurface` as historical context only.
- Do not rebuild the old evidence-surface contract. Build the new evidence inspector inside the current `WpsDossier` model.

## GitNexus Evidence

GitNexus repo:

- `global-governance-docuweb`
- indexed at commit `9a39e93bc21e1da68e66a684792fb655c5bd78ed`

Symbol context:

- `WpsDossier` lives in `src/components/modules/WpsDossier/WpsDossier.tsx`.
- `WpsDossier` is called by tests and by `App.tsx`.
- `westPhilippineSeaDossier` lives in `src/data/sections/west-philippine-sea-dossier.ts`.
- `SourceAwareChat` lives in `src/components/chat/SourceAwareChat.tsx` and is mounted by `AppShell`.
- `getSourceAwareChatStarterPrompts` already has Chapter 4 prompts for `west-philippine-sea-dossier`.

Impact checks:

- `WpsDossier`: LOW risk, one direct test caller, no affected indexed execution processes.
- `getSourceAwareChatStarterPrompts`: LOW risk, direct coverage in `src/data/chat/source-aware-chat.test.ts`.
- `setActiveChapterPanel` in `NavigationContext`: LOW indexed upstream impact, but it is a shared context API used conceptually by Chapter 2 and Chapter 3 patterns.
- `SourceAwareChat`: HIGH risk because it is mounted by `AppShell` and covered by dedicated chat tests.
- `resolveKnownSectionId`: HIGH risk because it feeds `navigateToSection`, `reconcileHash`, `NavigationProvider`, `navigateToAdjacentChapter`, and `AppShell`.

Planning implication:

- Keep most implementation inside `WpsDossier` and `west-philippine-sea-dossier.ts`.
- Use existing chat behavior instead of rewriting `SourceAwareChat` in the first implementation pass.
- Do not change `resolveKnownSectionId` or legacy redirects as part of this work.

## Current Runtime Baseline

`WpsDossier` currently has local component state for:

- `selectedEventId`
- `selectedEvidenceId`

The component currently renders:

- heading and thesis
- timeline selector
- map panel
- evidence category buttons
- simple evidence detail text
- static `Ruling vs Reality` matrix
- final thesis
- references
- source trust guide

Current limitations:

- the `shell` prop is accepted but not used in `WpsDossier`
- map labels are rendered as noninteractive visual labels
- map frame is `aria-hidden`
- timeline state updates the map footer but not selected location or evidence state
- evidence detail does not expose source badges or excerpts
- `Ruling vs Reality` rows are static
- source-aware chat is globally mounted and context-aware, but Chapter 4 does not expose a local case-file chat entry beyond the global dock

## Implementation Strategy

Keep the implementation incremental and mostly local.

Do not start by redesigning global navigation, chat infrastructure, or backend source retrieval.

The first production-ready implementation should introduce a richer local interaction model in `WpsDossier`, then optionally integrate more deeply with the existing chat dock after the Chapter 4 UI is stable.

## Data Model Plan

### New Or Expanded Types

Add or expand these types in `src/data/sections/west-philippine-sea-dossier.ts`.

`WpsCaseFileMapHotspot`:

```ts
export type WpsCaseFileMapHotspot = {
  id: string
  label: string
  position: WpsCaseFileMapLabel["position"]
  summary: string
  whyItMatters: string
  relatedEventIds: string[]
  relatedEvidenceIds: string[]
  relatedComparisonRowIds: string[]
}
```

`WpsCaseFileInteractionMode`:

```ts
export type WpsCaseFileInteractionMode = {
  id: "evidence-file" | "law-power"
  title: string
  detail: string
  defaultEventId: string
  defaultEvidenceId: string
  defaultHotspotId: string
  defaultComparisonRowId: string
}
```

`WpsCaseFileEvidenceCategory` should remain the category source of truth, but add optional implementation fields only if the current `sourceIds` array is not enough:

```ts
sourceCountLabel?: string
linkedStateLabel?: string
primaryFinding?: string
```

`WpsCaseFileRulingRealityRow` should expand from two strings into a richer row:

```ts
export type WpsCaseFileRulingRealityRow = {
  id: string
  legalClarity: string
  politicalReality: string
  explanation: string
  citationLabel: string
  sourceIds: string[]
  relatedEventIds: string[]
  relatedEvidenceIds: string[]
}
```

### Data Constants

Add these constants:

- `wpsCaseFileInteractionModes`
- `wpsCaseFileMapHotspots`
- `wpsCaseFileDefaultInteractionState`

Keep the existing exports:

- `wpsCaseFileTimelineEvents`
- `wpsCaseFileMapLabels`
- `wpsCaseFileEvidenceCategories`
- `wpsCaseFileRulingRealityRows`
- `wpsCaseFileReferences`
- `wpsCaseFileTrustCategories`

### Source Linking Rule

Do not display raw `gg-src-*` IDs in the public UI.

Use source IDs for internal linking and tests, but render public labels through:

- `wpsCaseFileReferences`
- `wpsEvidenceRegistry`
- a new local source-label helper if needed

## Component State Plan

Keep state local inside `WpsDossier` for the first implementation pass.

Recommended local state:

```ts
const [activeModeId, setActiveModeId] = useState(...)
const [selectedEventId, setSelectedEventId] = useState(...)
const [selectedHotspotId, setSelectedHotspotId] = useState(...)
const [selectedEvidenceId, setSelectedEvidenceId] = useState(...)
const [expandedComparisonRowId, setExpandedComparisonRowId] = useState(...)
```

Derived values:

- `activeMode`
- `selectedEvent`
- `selectedHotspot`
- `selectedEvidence`
- `expandedComparisonRow`
- `selectedEvidenceSources`
- `selectedReferenceItems`

Do not store derived values in state.

### Sync Behavior

When a mode button is selected:

- set selected event to the mode default
- set selected hotspot to the mode default
- set selected evidence to the mode default
- set expanded comparison row to the mode default

When a timeline event is selected:

- update `selectedEventId`
- choose the first hotspot related to that event if one exists
- choose the first evidence category related to that event if one exists
- keep expanded comparison row unless the event directly maps to a stronger row

When a map hotspot is selected:

- update `selectedHotspotId`
- update selected event if the hotspot has a primary related event
- update selected evidence if the hotspot has a primary related evidence category
- preserve the learner's expanded comparison row unless the hotspot explicitly maps to one

When an evidence category is selected:

- update `selectedEvidenceId`
- update active source tray content
- optionally highlight related timeline and comparison rows

When a comparison row is expanded:

- update `expandedComparisonRowId`
- update evidence if the row has a direct evidence relationship
- do not scroll the page unless the user clicked a navigation-style CTA

## Interaction Feature Plan

## Phase 1. Entry Action Strip

### Goal

Make the chapter feel immediately clickable and investigative.

### Files

- `src/components/modules/WpsDossier/WpsDossier.tsx`
- `src/data/sections/west-philippine-sea-dossier.ts`
- `src/index.css`
- `src/components/modules/WpsDossier/WpsDossier.test.tsx`

### Tasks

1. Start using the existing `shell` prop in `WpsDossier`.
2. Render `shell.controls` below the chapter subtitle.
3. Give each control an icon from `lucide-react`.
4. Add `aria-pressed` to identify the active mode.
5. Add `aria-controls` that points to the board or active evidence tray.
6. Add a compact active-mode text region with `aria-live="polite"` if the mode change updates multiple panels.
7. Style the strip as a centered two-button control, visually aligned with the mockup.

### Acceptance Criteria

- `Open the evidence file` and `Trace law and power` are visible.
- Selecting each button visibly changes active state.
- The active button has `aria-pressed="true"`.
- Keyboard focus is visible.
- Touch target size is at least 44px high.
- No horizontal overflow at desktop or mobile smoke widths.

### Unit Tests

Add coverage in `WpsDossier.test.tsx`:

- default mode renders and has active pressed state
- clicking the second mode changes active pressed state
- mode click updates at least one visible downstream region

## Phase 2. Timeline, Hotspot, And Map Synchronization

### Goal

Make the map participate in the reasoning flow instead of remaining decorative.

### Files

- `src/data/sections/west-philippine-sea-dossier.ts`
- `src/components/modules/WpsDossier/WpsDossier.tsx`
- `src/index.css`
- `src/components/modules/WpsDossier/WpsDossier.test.tsx`
- `tests/e2e/public-homepage-four-chapter-chapter4.smoke.spec.ts`

### Tasks

1. Add `wpsCaseFileMapHotspots`.
2. Replace noninteractive map location labels with a semantic hotspot layer.
3. Keep the decorative map geometry `aria-hidden`, but make hotspot buttons accessible.
4. Position hotspot buttons using the existing `position` tokens.
5. Add one selected hotspot tooltip.
6. Add data attributes for testable layout and state:
   - `data-wps-map-hotspot`
   - `data-position`
   - `data-active`
   - `data-related-event`
7. Add a visual connector from selected timeline event to selected hotspot.
8. Keep connector purely decorative with `aria-hidden="true"`.
9. Ensure the map summary remains available to screen readers.

### Acceptance Criteria

- map hotspots are focusable buttons
- hotspot labels are accessible
- selecting `Scarborough Shoal`, `Spratly Islands`, `Palawan`, or `West Philippine Sea` changes the visible tooltip
- selecting the 2016 timeline event selects a relevant map state
- selected timeline and selected hotspot are visibly linked
- map remains readable when the connector is absent under reduced motion or narrow mobile layout

### Unit Tests

Add coverage in `WpsDossier.test.tsx`:

- map hotspots render as buttons
- clicking a hotspot changes the tooltip text
- clicking the 2016 timeline event changes the active hotspot or active map context
- connector is present as decorative markup only

### E2E Tests

Extend `public-homepage-four-chapter-chapter4.smoke.spec.ts`:

- focus a map hotspot and assert visible focus
- click a hotspot and assert selected tooltip text
- assert no horizontal overflow after hotspot interaction

## Phase 3. Evidence Inspector Tray

### Goal

Turn the evidence area into the proof layer for the case file.

### Files

- `src/data/sections/west-philippine-sea-dossier.ts`
- `src/components/modules/WpsDossier/WpsDossier.tsx`
- `src/index.css`
- `src/components/modules/WpsDossier/WpsDossier.test.tsx`

### Tasks

1. Keep the four existing evidence category buttons.
2. Replace the current short paragraph detail with an evidence inspector tray.
3. Show:
   - selected source type
   - selected category summary
   - primary finding
   - source count or source badges
   - linked-state chip such as `Linked to 2016 ruling`
   - `View source excerpts` action
4. Build source display from existing `sourceIds` and `wpsCaseFileReferences`.
5. Do not expose raw source IDs in visible public copy.
6. Keep `Explore all evidence` as a navigation link to references.
7. Use `aria-live="polite"` on the tray content.
8. Keep category buttons with `aria-pressed`.

### Acceptance Criteria

- selected evidence category still updates by click and keyboard activation
- evidence tray shows public source labels or badges
- `View source excerpts` is visible and focusable
- raw `gg-src-*` strings are not visible
- source trust guide remains visible

### Unit Tests

Update existing evidence tests:

- default tray shows historical records plus a public source badge
- selecting legal findings shows tribunal or award-oriented content
- raw source IDs remain hidden
- source excerpt button is focusable

## Phase 4. Expandable Ruling Vs Reality Rows

### Goal

Make the comparison matrix inspectable while preserving the fast scan.

### Files

- `src/data/sections/west-philippine-sea-dossier.ts`
- `src/components/modules/WpsDossier/WpsDossier.tsx`
- `src/index.css`
- `src/components/modules/WpsDossier/WpsDossier.test.tsx`

### Tasks

1. Expand `wpsCaseFileRulingRealityRows` with explanations and source metadata.
2. Render each row as a button or button-like disclosure control.
3. Use one expanded row at a time.
4. Use `aria-expanded` and `aria-controls`.
5. Keep the matrix visual split between legal clarity and political reality.
6. Place explanation content inside a drawer below the selected row.
7. Add citation chip based on row `sourceIds`.
8. Sync selected evidence category when a row maps clearly to source-backed evidence.

### Acceptance Criteria

- one row is expanded by default
- clicking another row expands it and collapses the previous one
- expanded row includes explanation and citation chip
- collapsed rows remain visible and selectable
- keyboard activation works
- no radio role is introduced unless the UI becomes a true single-select radio group

### Unit Tests

Replace the older expectation that the matrix has no extra controls.

New tests:

- default expanded row is visible
- row buttons have accessible names
- clicking `Scarborough Shoal` row changes expanded explanation
- citation chip is visible without raw source IDs
- selected evidence may update when a mapped row is expanded

## Phase 5. Chapter-Aware Chat Dock Integration

### Goal

Make the existing source-aware chat feel tied to Chapter 4 without destabilizing global chat behavior.

### Risk Note

GitNexus marks `SourceAwareChat` as HIGH risk because it is mounted by `AppShell` and participates in global chat behavior.

Do not rewrite the chat component in the first pass.

### Preferred First Approach

Use the existing global dock.

Because `SourceAwareChat` already reads `activeSectionId` from navigation and `source-aware-chat.ts` already maps prompts for `west-philippine-sea-dossier`, Chapter 4 can rely on the global dock for functional behavior.

The Chapter 4 implementation can add a local visual nudge, but it should not duplicate a second independent chat form.

### Optional Later Approach

If the local mockup-style chat dock is required, introduce a small control API in `SourceAwareChat` only after the Chapter 4 local features are stable.

Potential API:

```ts
type SourceAwareChatProps = {
  starterPrompts?: unknown
  chatClient?: (...)
  defaultOpen?: boolean
  triggerVariant?: "global" | "chapter-dock"
}
```

This should be treated as a separate implementation phase because it affects `AppShell`, chat tests, motion behavior, focus return, and Playwright chat coverage.

### First-Pass Tasks

1. Confirm active section is `west-philippine-sea-dossier` when Chapter 4 is focused.
2. Keep the global source-aware dock visible.
3. Ensure Chapter 4 starter prompts are still selected when the user opens the dock.
4. Add a local `Ask about this case` button only if it activates the existing dock through a supported mechanism.
5. Avoid duplicate fixed chat widgets.

### Acceptance Criteria

- opening chat from Chapter 4 shows WPS starter prompts
- prompt submission forwards `currentSectionId: "west-philippine-sea-dossier"`
- existing chat E2E coverage still passes
- `SourceAwareChat` focus and Escape behavior remain unchanged

### Tests

Use existing chat test layers:

- `src/components/chat/SourceAwareChat.test.tsx`
- `src/data/chat/source-aware-chat.test.ts`
- `tests/e2e/source-aware-chatbox.smoke.spec.ts`
- `tests/e2e/chat-boundary-validation.spec.ts` if prompt interaction changes

## Phase 6. Responsive And Reduced-Motion Pass

### Goal

Preserve the current learning flow on desktop and mobile.

### Tasks

1. Desktop layout should match the mockup hierarchy.
2. Tablet layout should keep timeline, map, evidence, and comparison readable without horizontal overflow.
3. Mobile layout should stack in a deliberate order:
   - title
   - mode controls
   - timeline
   - map hotspots
   - evidence inspector
   - ruling drawer
   - final thesis
   - references
   - trust guide
4. Hotspots should become list controls if absolute map buttons become too small.
5. Connector line can be hidden on mobile.
6. Reduced motion should disable connector animation and glowing pulses while preserving selected states.

### CSS Areas

Modify existing WPS CSS in `src/index.css` around:

- `.wps-case-file`
- `.wps-case-file__board`
- `.wps-case-file__timeline-item`
- `.wps-case-file__map`
- `.wps-case-file__map-frame`
- `.wps-case-file__evidence-card`
- `.wps-case-file__evidence-detail`
- `.wps-case-file__matrix-row`
- `.wps-case-file :where(a, button):focus-visible`

Add new classes with the same BEM-like prefix:

- `.wps-case-file__mode-strip`
- `.wps-case-file__mode-button`
- `.wps-case-file__hotspot`
- `.wps-case-file__hotspot-tooltip`
- `.wps-case-file__sync-line`
- `.wps-case-file__evidence-tray`
- `.wps-case-file__source-chip`
- `.wps-case-file__matrix-button`
- `.wps-case-file__matrix-drawer`

## Testing Plan

### Playwright Policy

Use Playwright in two different ways for this Chapter 4 work:

1. `playwright-cli` for visual and experiential validation:
   - open the live Chapter 4 page
   - inspect structure with snapshots
   - capture screenshots
   - confirm the page feels correct after interaction changes
2. Targeted checked-in Playwright specs for regression coverage:
   - use the Chapter 4-specific smoke file first
   - use chat-specific coverage only if Chapter 4 changes actually touch chat behavior

Do not use the broad default E2E script as the primary validation path for this work.

Specifically:

- do not default to `pnpm test:e2e`
- do not default to `pnpm test:e2e:all`
- do not use whole-homepage browser coverage when a focused Chapter 4 spec proves the behavior

If the existing Chapter 4 smoke file stops being sufficient, expand that file or add a new Chapter 4-specific Playwright spec instead of falling back to the broad default suite.

### Unit And Component Tests

Run:

- `pnpm test:unit`

Primary tests to update:

- `src/components/modules/WpsDossier/WpsDossier.test.tsx`
- `src/data/sections/west-philippine-sea-dossier.test.ts`
- `src/data/chat/source-aware-chat.test.ts` if chat prompt labels or mappings change
- `src/components/chat/SourceAwareChat.test.tsx` only if chat API or trigger behavior changes

Coverage matrix:

- mode controls
- timeline selection
- hotspot selection
- evidence selection and source tray
- comparison row expansion
- hidden raw source IDs
- final thesis and trust guide still visible

### Playwright Tests

Run targeted browser coverage only:

- `pnpm exec playwright test tests/e2e/public-homepage-four-chapter-chapter4.smoke.spec.ts --reporter=line`
- `pnpm exec playwright test tests/e2e/home-smoke.spec.ts --reporter=line` only if Chapter 4 changes affect shared top-level shell behavior
- `pnpm exec playwright test tests/e2e/source-aware-chatbox.smoke.spec.ts --reporter=line` if chat behavior changes

Update `public-homepage-four-chapter-chapter4.smoke.spec.ts` to assert:

- entry action controls visible and touch-safe
- timeline event changes synced map or evidence state
- hotspot click updates tooltip
- evidence tray expands with source badges
- comparison drawer expands
- no removed standalone nav stops return
- no horizontal overflow

### Manual Browser Verification

Use `playwright-cli` for visual inspection:

```powershell
playwright-cli -s=chapter4-interactive open http://127.0.0.1:5173/#west-philippine-sea-dossier
playwright-cli -s=chapter4-interactive snapshot --filename=.tmp/playwright/chapter4-interactive.yaml
playwright-cli -s=chapter4-interactive screenshot --filename=.tmp/playwright/chapter4-interactive.png
```

Also check:

- desktop `1536 x 1024`
- tablet `768 x 1024`
- mobile `390 x 844`
- reduced-motion emulation if available through Playwright test config
- actual interaction feel after clicking timeline events, hotspots, evidence cards, and comparison drawers

### Project Checks

Default frontend checks after implementation:

- `pnpm lint`
- `pnpm typecheck`
- `pnpm test:unit`
- `pnpm exec playwright test tests/e2e/public-homepage-four-chapter-chapter4.smoke.spec.ts --reporter=line`
- `pnpm build`

Exclude from the default Chapter 4 verification loop:

- `pnpm test:e2e`
- `pnpm test:e2e:all`

Only bring in broader Playwright coverage if the implementation clearly changes shared homepage shell behavior outside the Chapter 4 surface.

Known caveat:

- Earlier Chapter 4 planning notes recorded unrelated `MaintainerDashboard` build and unit-test drift.
- If those failures still exist, record them separately and judge this work first by targeted WPS unit and Playwright checks.

## Risk Register

### Risk: Chat Integration Drift

Severity: High

Cause:

- `SourceAwareChat` is global and mounted through `AppShell`.

Mitigation:

- first implementation pass should not duplicate or rewrite the chat widget
- rely on existing `activeSectionId` prompt mapping
- defer local dock API changes until core WPS interactions pass

### Risk: Navigation Redirect Regression

Severity: High

Cause:

- `resolveKnownSectionId` has HIGH GitNexus impact.

Mitigation:

- do not modify `src/data/navigation.ts`
- preserve `#conclusion-references` redirect to `#west-philippine-sea-dossier`
- keep Chapter 4 smoke coverage around redirect behavior

### Risk: Data Shape Overload

Severity: Medium

Cause:

- Chapter 4 already has several content arrays and source-linked records.

Mitigation:

- add small explicit types
- keep source linking in data, not hard-coded inside JSX
- derive public labels from references rather than duplicating source text in many places

### Risk: Mobile Map Hotspots Become Too Small

Severity: Medium

Cause:

- absolute-positioned map hotspots may not remain touch-safe on narrow screens.

Mitigation:

- use large invisible button hit areas
- provide a hotspot list fallback below the map on mobile
- test touch target size in Playwright

### Risk: Visual Density

Severity: Medium

Cause:

- the mockup adds more controls to an already dense chapter.

Mitigation:

- use progressive disclosure for comparison rows and evidence tray
- keep one active drawer at a time
- avoid showing every source detail at once

### Risk: Source Trust Regression

Severity: Medium

Cause:

- richer evidence display may expose internal IDs or overpromise source excerpt retrieval.

Mitigation:

- keep raw source IDs hidden
- use public reference labels
- make `View source excerpts` a local UI affordance first unless real excerpt retrieval is explicitly in scope

## Implementation Order

Recommended order:

1. Expand WPS data types and add source-linked interaction constants.
2. Render entry action strip and local mode state.
3. Convert map labels into hotspot controls.
4. Sync timeline, hotspot, and evidence state.
5. Replace evidence paragraph with evidence inspector tray.
6. Convert comparison rows into expandable controls.
7. Update WPS component tests.
8. Update Chapter 4 Playwright smoke.
9. Run targeted checks.
10. Decide whether deeper chat dock integration is worth a separate follow-up.

## Code Review Checklist

Before considering implementation complete:

- `WpsDossier` still renders when data arrays are non-empty
- no new global store is introduced
- no React Router is introduced
- no Next.js assumptions are added
- `resolveKnownSectionId` is untouched
- `#conclusion-references` redirect still works
- source IDs are not visible in public UI
- all new controls have accessible names
- all new controls have visible focus states
- no layout shifts when toggling comparison rows
- no horizontal overflow on the smoke breakpoints
- reduced-motion users still see the same state changes
- Chapter 4 still remains the fourth and final public chapter

## Acceptance Criteria

The implementation is accepted when:

- Chapter 4 visually matches the interaction direction in `chapter-4-interactive-mockup-01.png`.
- The two entry action buttons are live and keyboard accessible.
- Timeline selection updates visible detail and synced map or evidence state.
- Map hotspots are clickable, focusable, labeled, and update a selected detail card.
- Evidence cards update an expanded tray with source labels or badges.
- `Ruling vs Reality` supports one expanded row with explanation and citation chip.
- Chapter-aware chat still opens with WPS prompts from the existing global chat behavior.
- Existing Chapter 4 nav and redirect contracts remain intact.
- Targeted unit and Playwright checks pass, or unrelated failures are documented separately.

## Out Of Scope

Do not include these in the first implementation pass:

- backend source excerpt retrieval
- new Supabase Edge Function behavior
- changes to `/functions/v1/chat`
- changes to Django maintainer workflows
- changes to public chapter count or chapter IDs
- changes to `resolveKnownSectionId`
- reintroducing standalone `Governance Limits and Enforcement`
- reintroducing standalone `Conclusion and References`
- reviving `WpsEvidenceSurface`

## Follow-Up Decision Points

After the first implementation pass, decide:

- whether the local Chapter 4 chat dock is still needed after the global dock is tested in context
- whether `View source excerpts` should stay as a local reference jump or become a real source excerpt panel
- whether selected Chapter 4 state should persist through `NavigationContext.activePanelByChapter`
- whether a second Chapter 4-specific Playwright spec is needed for deeper interaction coverage instead of using the broad default E2E suite
- whether the generated mockup should be refreshed after implementation screenshots exist
