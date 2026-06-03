# Chapter 2 Visual Adjustments Implementation Plan

Last updated: 2026-06-03

## Request

Adjust the Chapter 2 "Global Governance Overview" visual so the active focus state is easier to see, the side panels do not obstruct lower elements, and the bottom "System Connections Legend" and "Next Chapter" cards align cleanly.

## Codebase Inspection Summary

- Main component: `src/components/sections/GlobalGovernanceOverviewChapter.tsx`
- Main styling surface: `src/index.css`
- Lens state data: `src/data/sections/global-governance-overview-visual.ts`
- Existing component test: `src/components/sections/GlobalGovernanceOverviewChapter.test.tsx`

GitNexus impact check for `GlobalGovernanceOverviewChapter` returned LOW risk:

- Direct upstream caller: `src/App.tsx`
- Direct callers: 1
- Affected modules: `Sections`
- Affected execution flows: none reported

Graphify was checked for orientation, but its reports were built from commit `7323c4aa` while the current repo is at `f40305d`. I will treat Graphify as broad context only and rely on the current source files for exact implementation details.

## Current Layout Findings

The Chapter 2 desktop grid is defined in `src/index.css` with:

- Three columns: left panel, center diagram, right panel.
- Four rows: header, main content, bottom cards/controls, active lens.
- Grid areas:
  - `left` for "Selected relationship"
  - `right` for "Why it matters"
  - `legend` for "System Connections Legend"
  - `next` for "Next Chapter"
  - `controls` for the lens buttons

The side panels already use a slight upward transform:

```css
transform: translateY(clamp(-1.8rem, -2.25svh, -1.2rem));
```

That is not enough vertical clearance in the screenshot. The panels remain visually close to the lower legend/next-card row.

The bottom cards are not currently aligned because `overview-next-card` has a desktop-only bottom margin:

```css
@media (min-width: 72.01rem) {
  .overview-next-card {
    margin-bottom: clamp(8.2rem, 12svh, 9rem);
  }
}
```

The legend does not receive the same offset, so "System Connections Legend" and "Next Chapter" sit at different vertical positions.

The active/focus states already exist through data attributes and aria state:

- `.overview-relation-card[data-focus="true"]`
- `.overview-system-node[data-focus="true"]`
- `.overview-legend li[data-focus="true"]`
- `.mockup-lens-button[aria-pressed="true"]`

The implementation should strengthen those existing states rather than changing the state model.

## Implementation Plan

### 1. Make the Active Glow More Noticeable

Expected file:

- `src/index.css`

Approach:

- Strengthen `.mockup-lens-button[aria-pressed="true"]` so the clicked lens button reads as selected immediately.
- Strengthen `.overview-system-node[data-focus="true"]` so active diagram nodes look intentionally illuminated, not just lightly highlighted.
- Strengthen `.overview-relation-card[data-focus="true"]` so focused relationship pills match the stronger diagram glow.
- Keep dimensions stable. Do not increase borders, padding, or element size in a way that causes layout shift.
- Use layered `box-shadow`, `filter: drop-shadow(...)`, brighter border color, and slightly richer radial backgrounds.
- Preserve reduced-motion behavior by keeping transitions disabled under `prefers-reduced-motion: reduce`.

Recommended CSS direction:

- Add stronger outer blue/cyan bloom plus a tighter gold rim on active nodes.
- Add a clearer gold/blue glow around active relationship cards.
- Add an active lens button glow that is visibly connected to the node state.
- Avoid animation unless visual testing shows the static glow is still too subtle.

Risk:

- Too much glow can muddy text readability on the dark map. Verification should check contrast and text clarity on active pills, node labels, and button labels.

### 2. Move "Selected Relationship" and "Why It Matters" Upward

Expected file:

- `src/index.css`

Approach:

- Increase the negative desktop transform on `.overview-left-panel` and `.overview-right-panel`.
- Keep the adjustment scoped to desktop/tablet-wide layouts where the side panels are in the three-column grid.
- Leave the mobile rule intact because the panels become block-flow content under `@media (max-width: 64rem)` and already reset `transform: none`.
- Review short-height desktop media queries carefully. The current design compresses panel padding and text at lower heights, so the upward shift should not push panels into the header.

Recommended CSS direction:

- Change the base side-panel transform from approximately `-1.2rem` to `-1.8rem` minimum and from approximately `-1.8rem` to around `-3rem` maximum.
- If short-height desktop needs a different value, add a scoped override under the existing `@media (min-width: 72.01rem) and (max-height: 58rem)` block.

Risk:

- Moving panels up can create crowding near the title/support text on shorter laptops. Verification should include 1366x768, 1536x864, and 1920x1080-style viewports.

### 3. Align "System Connections Legend" and "Next Chapter"

Expected file:

- `src/index.css`

Approach:

- Align the two bottom cards by applying the same desktop vertical offset to both `.overview-legend` and `.overview-next-card`.
- Prefer a shared desktop rule instead of a one-off margin on only the next card.
- Keep both cards on the same grid row and preserve their `align-self: end` behavior.
- Validate that this still clears the persistent chat trigger in the lower-right corner.

Recommended CSS direction:

```css
@media (min-width: 72.01rem) {
  .overview-legend,
  .overview-next-card {
    margin-bottom: clamp(...);
  }
}
```

The exact `clamp(...)` value should be confirmed visually. The current next-card value clears the chat trigger, so the first implementation pass should reuse it for the legend, then tune if the left panel/legend spacing becomes too tight.

Risk:

- Applying the same offset to the legend may bring it closer to the left side panel. This should be solved together with the side-panel upward shift.
- On short-height screens, the shared margin may consume too much vertical space. If needed, reduce the shared margin inside the existing short-height desktop media query.

## Files Expected To Change

Primary:

- `src/index.css`

Possible only if visual verification reveals markup needs:

- `src/components/sections/GlobalGovernanceOverviewChapter.tsx`

Not expected:

- `src/data/sections/global-governance-overview-visual.ts`
- Tests, unless the CSS class/state semantics change. The current plan preserves the same data attributes and aria state.

## Verification Plan

Run fast checks after implementation:

- `pnpm typecheck`
- `pnpm lint`
- `pnpm exec vitest run src/components/sections/GlobalGovernanceOverviewChapter.test.tsx`

Use browser verification with the running Vite app:

- Inspect Chapter 2 at desktop width where the issue was visible.
- Click each lens button and confirm:
  - active button glow is obvious
  - focused relationship cards are obvious
  - focused diagram nodes are obvious
  - legend focus remains readable
- Capture/check representative viewports:
  - 1366x768
  - 1536x864
  - 1920x1080
  - 1024x768
  - 768x1024
  - 390x844
- Confirm no horizontal overflow.
- Confirm side panels do not obstruct the legend, lens controls, next card, or chat trigger.
- Confirm "System Connections Legend" and "Next Chapter" have aligned top edges on desktop.
- Confirm mobile still stacks naturally and does not inherit desktop transforms.
- Confirm reduced-motion still removes transitions for highlighted elements.

Known project-wide note:

- Broader `pnpm build`, `pnpm test:unit`, and `pnpm test:e2e` were previously blocked by unrelated MaintainerDashboard import/test issues. If those blockers remain, report them separately instead of treating them as caused by this visual adjustment.

## Recommended Execution Order

1. Update the active/focus CSS states first because that is isolated and low-risk.
2. Apply the shared bottom-card alignment rule for `.overview-legend` and `.overview-next-card`.
3. Increase the side-panel upward transform, then tune for desktop and short-height desktop.
4. Run targeted checks and interactive browser verification.
5. If visual checks show overlap at a specific viewport, tune only the relevant media query instead of changing the component structure.
