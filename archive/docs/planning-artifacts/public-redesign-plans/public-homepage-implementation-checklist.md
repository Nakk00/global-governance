# Public Homepage Implementation Checklist

Status: Working checklist
Last updated: 2026-06-05
Scope: Build-oriented checklist for the public homepage redesign
Depends on: `archive/docs/planning-artifacts/public-homepage-redesign-proposal.md`

## Deadline Scope Lock - Four Chapters

- [x] Reduce the final public learning experience from six chapters to four.
- [x] Keep Chapter 1 as `Hero Narrative Frame`.
- [x] Keep Chapter 2 as `Global Governance Overview`.
- [x] Merge the old UN Command Center and Governance Limits material into Chapter 3, `The System Under Pressure`.
- [x] Make Chapter 4 case-study-first as `West Philippine Sea Case File`, then fold in the final conclusion and references.
- [x] Remove the old standalone Governance Limits and Conclusion navbar stops from the production experience.

Final production chapter order:

1. Hero Narrative Frame
2. Global Governance Overview
3. The System Under Pressure
4. West Philippine Sea Case File

## Purpose

This file turns the approved proposal direction into a simpler implementation checklist.

Use this when the team needs a practical "what do we do next?" artifact instead of a strategy or visual-direction document.

## Phase 0: Proposal And Visual Baseline

- [x] Finalize the public homepage redesign proposal
- [x] Create Hero and Overview wireframe artifact
- [x] Create Hero and Overview visual brief
- [x] Generate early concept images for Hero and Overview
- [x] Select the first baseline concept pair
- [x] Lock the polished Chapter 1 full-page mockup
- [x] Lock the polished Chapter 2 full-page mockup
- [x] Confirm the shared visual family between Chapter 1 and Chapter 2
- [x] Confirm the first shell and navbar design direction

Current review artifact:
- `archive/docs/planning-artifacts/public-homepage-phase-0-baseline-review.md`
- `archive/docs/planning-artifacts/public-homepage-phase-0-baseline-board.html`
- `archive/docs/planning-artifacts/public-homepage-shell-architecture-plan.md`

Current polished mockup candidates:
- `archive/docs/planning-artifacts/generated-mockups/public-homepage-redesign/hero-mockup-01.png`
- `archive/docs/planning-artifacts/generated-mockups/public-homepage-redesign/overview-mockup-01.png`

Current consistency note:
- navbar language has been aligned across both mockups
- both mockups now share the same frame size: `1536 x 1024`

Phase 0 outcome:
- `Approved baseline` on `2026-05-26`

Exit condition:
- We have an approved visual baseline for `Hero`, `Overview`, and the shared shell direction.

## Phase 1: Shell Architecture Foundation

- [x] Define the new top-level chapter navigation model
- [x] Define the new progress model that replaces or absorbs the current rail behavior
- [x] Define chapter-state movement rules for desktop
- [x] Define simplified but equivalent chapter behavior for mobile
- [x] Define chat placement and fallback behavior inside the new shell
- [x] Define reduced-motion equivalents for chapter and panel transitions
- [x] Decide what parts of the current `NavigationContext` can be reused versus replaced
- [x] Decide what parts of the current navbar can be reused versus rebuilt
- [x] Define the minimal new content/data shape needed to drive chapter states

Phase 1 planning artifacts:
- `archive/docs/planning-artifacts/public-homepage-shell-architecture-plan.md`
- `archive/docs/planning-artifacts/public-homepage-shell-implementation-brief.md`
- `archive/docs/planning-artifacts/public-homepage-shell-file-implementation-map.md`

Phase 1 implementation progress:
- [x] Expand `src/data/navigation.ts` with chapter shell metadata
- [x] Add chapter-state navigation APIs to `NavigationContext`
- [x] Keep legacy section navigation APIs working during the transition
- [x] Rebuild desktop `Navbar` as the first chapter command bar
- [x] Convert `SectionProgressRail` into a slimmer chapter progress surface
- [x] Preserve mobile menu behavior through the compatibility layer
- [x] Verify shell changes with typecheck, lint, build, smoke E2E, and layout E2E

Exit condition:
- The redesign has a clear shell architecture that can support full-screen chapter navigation without relying on the old long-scroll model.

## Phase 2: First Proof Chapters

### Hero Narrative Frame

- [x] Finalize Hero copy hierarchy
- [x] Finalize Hero CTA set
- [x] Finalize Hero shell placement
- [x] Finalize Hero mobile composition
- [x] Build Hero as a real full-screen chapter in the new shell

### Global Governance Overview

- [x] Finalize Overview state model
- [x] Finalize Overview panel structure
- [x] Finalize Overview educational content priorities
- [x] Finalize Overview mobile composition
- [x] Build Overview as a real full-screen chapter in the new shell

### First Proof Milestone

- [x] Connect `Hero` and `Overview` through real chapter navigation
- [x] Validate that both chapters feel like the same product family
- [x] Validate that the shell works across desktop and mobile
- [x] Validate that chat remains available without overpowering the chapters

Phase 2 implementation progress:
- [x] Move approved Hero and Overview concept images into `public/images/public-homepage`
- [x] Replace the Hero card layout with a full-bleed visual chapter stage
- [x] Add a dedicated `GlobalGovernanceOverviewChapter` implementation
- [x] Preserve the existing accessible anchors, recap path, and test-visible learning labels
- [x] Verify Phase 2 with typecheck, lint, build, smoke E2E, and layout E2E

Exit condition:
- `Hero + Overview + shell` work together as the first credible implementation baseline.

## Phase 3: Navigation And Interaction Hardening

- [ ] Add explicit previous and next chapter behavior
- [ ] Add internal sub-navigation behavior for dense chapters
- [ ] Add focus and keyboard navigation rules
- [ ] Add chapter-entry and chapter-exit motion rules
- [ ] Add reduced-motion fallbacks
- [ ] Validate that orientation cues remain clear during rapid navigation

Exit condition:
- The chapter system is understandable, accessible, and stable enough to scale to the remaining chapters.

## Phase 4: Reduced Final Chapter Migration

### The System Under Pressure

- [x] Merge UN institution content with governance-limits content
- [x] Rename the production chapter and navbar stop to `The System Under Pressure`
- [x] Keep institution exploration visible while making limits/enforcement the chapter payoff
- [x] Preserve `#governance-limits` as a compatibility redirect into Chapter 3

### West Philippine Sea Case File

- [x] Keep the WPS dossier as the case-study-first final page
- [x] Fold conclusion and source-reference inspection into the end of the WPS page
- [x] Preserve `#conclusion-references` as a compatibility redirect into Chapter 4
- [x] Replace stale WPS journey/layout coverage with chapter-owned Chapter 4 smoke coverage

### Removed Standalone Stops

- [x] Remove `Governance Limits and Enforcement` as a separate navbar page
- [x] Remove `Conclusion and References` as a separate navbar page
- [x] Remove dormant old-structure content files after replacement coverage passed

Exit condition:
- Four public chapters exist in the new shell and tell the complete learning arc without exposing the old six-page scope.

## Phase 5: Quality And Launch Readiness

- [ ] Validate desktop responsiveness
- [ ] Validate mobile responsiveness
- [ ] Validate no horizontal overflow traps
- [ ] Validate keyboard navigation
- [ ] Validate visible focus states
- [ ] Validate reduced-motion behavior
- [x] Validate chat fallback and containment behavior
- [ ] Validate performance assumptions for heavy visuals
- [x] Update homepage tests around chapter navigation and internal states
- [ ] Re-run the final build verification set

Exit condition:
- The redesigned homepage is visually coherent, accessible, testable, and ready for implementation sign-off.

## Recommended Immediate Next Steps

1. Resolve the unrelated MaintainerDashboard shared-module import and test drift so `pnpm test:unit`, `pnpm typecheck`, and `pnpm build` can return to green.
2. Use the chapter-owned smoke files as the default browser confidence layer for the four-chapter homepage.
3. Rebuild optional `@layout` coverage only when a browser-only layout risk remains after the chapter smoke checks.

## Working Note

- This checklist should be updated continuously as mockups are approved, architecture decisions are made, and real implementation begins.
