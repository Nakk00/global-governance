# Findings & Decisions

## Requirements
- Use the `planning-with-files` skill to keep persistent planning memory for the Chapter 3 implementation plan.
- Execute `archive/docs/planning-artifacts/public-redesign-plans/chapter-3-system-under-pressure-remaining-work-implementation-plan.md`.
- Keep the plan memory beside the supporting artifacts in `archive/docs/planning-artifacts/public-redesign-plans/plans-memory`.
- Use Graphify and GitNexus to ground the work in codebase structure and impact.
- Use Playwright screenshots for current Chapter 3 UI context.
- Do not rely on the repo's default E2E script for final confidence because the user flagged it as old/outdated.
- Use the `responsive-design` skill for the final layout review.

## Research Findings
- The `planning-with-files` skill requires three persistent files: `task_plan.md`, `findings.md`, and `progress.md`.
- The strengthened implementation plan is the source of truth for this execution pass.
- The implementation plan identifies the main Chapter 3 gaps as visible selected-institution detail, shared navigation panel state, stronger test coverage, transition cleanup, and responsive/accessibility verification.
- Graphify merged/frontend reports show navigation and browser-layout helpers as cross-cutting areas, so Chapter 3 needed focused navigation-state and containment verification rather than a one-file visual-only change.
- GitNexus impact checks before production edits:
  - `UNCommandCenter` upstream impact was `LOW`; the direct affected item reported was the checked-in `UNCommandCenter` unit test.
  - `constraintsTransition` upstream impact was `LOW` with no reported consumers.
- Chapter 2 provided the closest production pattern:
  - read `activePanelByChapter` and `setActiveChapterPanel` from `useNavigation`
  - derive active panel id from shared state with a default fallback
  - fall back safely when navigation state contains an invalid panel id
  - use a stateful unit-test harness to exercise real `setActiveChapterPanel` updates
- The `responsive-design` skill reinforced the final checks used here:
  - mobile-first stacking
  - content-driven breakpoints
  - no horizontal overflow
  - tap targets at or above 44px
  - readable line lengths inside dense panels

## Implementation Findings
- `UNCommandCenter` now renders a visible selected-institution detail stage from the existing `unOrgans` fields:
  - `role`
  - `power`
  - `limit`
  - `whyItMatters`
- Room selection now uses shared chapter panel state instead of local-only `useState`.
- Invalid or missing panel ids fall back to Chapter 3's `defaultPanelId` of `general-assembly`.
- The pressure diagram remains in the chapter as secondary context beneath the selected-institution detail stage.
- The `Key takeaway` card was removed from Chapter 3 after visual review because it was not needed in the mockup-aligned center analysis panel.
- `constraintsTransition` was removed from active Chapter 3 data because no runtime consumer was found.
- Unit coverage now proves default rendering, shared-state update, keyboard activation, and invalid-state fallback.
- Minimal Playwright coverage was strengthened for the visible selected-room detail flow.

## Visual/Browser Findings
- Prior mockup findings remain valid: Chapter 3 should read as a three-column teaching grid with institution selector, center detail stage, and constraints panel.
- Desktop screenshot before the final CSS adjustment showed the new center stage overflowing upward into the hero/fixed-navigation area because the wide grid still used a fixed viewport-height row model from the older diagram-only design.
- The final desktop CSS uses content-height rows and top-aligns the three main columns, removing the collision while keeping the center detail stage dominant.
- Tablet hash-entry screenshots showed the fixed command bar sitting too close to the chapter title, so the tablet/mobile Chapter 3 top offset was increased.
- A later mockup comparison showed the center analysis panel still wasting its right side. Root cause: the nested pressure diagram retained an old `grid-area: diagram` from the previous outer-grid design, creating implicit half-width columns inside `.system-pressure-center-stage`.
- Resetting the selected detail and pressure diagram to `grid-area: auto` lets both span the full center analysis panel, matching the mockup's single wide center card.
- Final desktop screenshot path: `test-results/chapter3-responsive/chapter3-desktop-after.png`.
- Final mockup-parity desktop screenshot path: `test-results/chapter3-responsive/chapter3-final-desktop.png`.
- Tablet screenshot path: `test-results/chapter3-responsive/chapter3-tablet.png`.
- Final tablet screenshot path: `test-results/chapter3-responsive/chapter3-final-tablet.png`.
- Mobile viewport screenshot path: `test-results/chapter3-responsive/chapter3-mobile-viewport.png`.
- Final mobile screenshot path: `test-results/chapter3-responsive/chapter3-final-mobile.png`.
- Mobile full-page screenshot path: `test-results/chapter3-responsive/chapter3-mobile-full.png`.
- Mobile visual review preserved the intended teaching order: heading, room selector, selected detail, pressure flow, constraints, bottom chapter navigation.
- Direct Playwright runtime verification against the Vite dev server confirmed desktop, tablet, and mobile detail selection updates, non-clipped chapter titles, and no horizontal overflow.

## Technical Decisions
| Decision | Rationale |
|----------|-----------|
| Keep plan memory in `plans-memory` | The supporting artifacts already live there, and the user explicitly pointed to that folder |
| Make the selected-institution detail stage the center teaching surface | The remaining-work note and UI reference spec identify it as the missing learner payoff |
| Keep the pressure flow below the detail stage | It still explains the system logic, but it should not compete with the selected-room teaching surface |
| Remove the `Key takeaway` box from Chapter 3 | The mockup composition is clearer when the center card contains selected-room details plus pressure flow only |
| Reset stale nested grid areas inside the center stage | The old diagram grid area made the new center panel split into implicit columns, causing the half-empty card the visual review caught |
| Mirror the Chapter 2 shared-panel pattern for Chapter 3 | It avoids new shared APIs and uses an already-tested navigation state model |
| Remove `constraintsTransition` | The data had no GitNexus consumers and no meaningful visible role in the final composed chapter |
| Use targeted Playwright screenshots and direct browser checks for final layout confidence | The default E2E lane is stale/outdated for this moment and the checked-in Playwright config currently depends on a build blocked outside Chapter 3 |

## Issues Encountered
| Issue | Resolution |
|-------|------------|
| Existing planning files tracked the older planning-writing task | Replaced them with execution-oriented tracking for the strengthened implementation plan |
| Desktop visual capture exposed center-stage overflow from the old fixed grid row model | Switched the wide grid to content-height rows and top alignment |
| User visual review caught that the center stage still did not match the mockup | Reset stale nested grid areas, expanded detail/pressure flow to full center width, and removed the extra takeaway card |
| `pnpm test:unit` failed in unrelated MaintainerDashboard tests | Recorded as unrelated after focused Chapter 3 unit tests passed |
| `pnpm build` failed in unrelated MaintainerDashboard missing modules/types | Recorded as unrelated repo blocker |
| The default/full E2E lane failed outside Chapter 3 and was later avoided per user direction | Used targeted Chapter 3 checks, screenshots, and direct Playwright runtime verification instead |

## Resources
- `archive/docs/planning-artifacts/public-redesign-plans/chapter-3-system-under-pressure-remaining-work-implementation-plan.md`
- `archive/docs/planning-artifacts/public-redesign-plans/chapter-3-system-under-pressure-remaining-work.md`
- `archive/docs/planning-artifacts/public-redesign-plans/chapter-3-system-under-pressure-ui-reference-spec.md`
- `archive/docs/planning-artifacts/generated-mockups/public-homepage-redesign/chapter-3-system-under-pressure-remaining-work-mockup-01.png`
- `.codex/skills/planning-with-files/SKILL.md`
- `.codex/skills/responsive-design/SKILL.md`
- `graphify-out-merged/GRAPH_REPORT.md`
- `graphify-out/GRAPH_REPORT.md`
