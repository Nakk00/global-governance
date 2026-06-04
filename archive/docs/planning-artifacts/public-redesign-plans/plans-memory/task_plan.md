# Task Plan: Chapter 3 System Under Pressure Implementation

## Goal
Execute the strengthened Chapter 3 implementation plan so `The System Under Pressure` becomes a finished institutional explorer with visible selected-institution detail, shared chapter panel state, intentional cleanup, and verified responsive/accessibility behavior.

## Current Phase
Complete

## Phases

### Phase 0: Plan Initialization
- [x] Read the `planning-with-files` skill instructions
- [x] Re-read the strengthened implementation plan before deciding how to initialize tracking
- [x] Replace the older "write the plan" tracker with an execution tracker for the Chapter 3 implementation
- [x] Update findings and progress logs for this initialized plan state
- **Status:** complete

### Phase 1: Lock The Implementation Target
- [x] Re-read the remaining-work note and UI reference spec
- [x] Review the mockup image as the visual target for the center detail stage
- [x] Confirm stable layout zones: heading, selector, center teaching stage, constraints panel, bottom chapter strip
- [x] Record the intended desktop and mobile structure before production edits
- **Status:** complete

### Phase 2: Build The Visible Selected-Institution Detail Stage
- [x] Update `UNCommandCenter` to render a center selected-institution detail stage
- [x] Render `Role`, `Scope of power`, `Limitation`, and `Why it matters` from `unOrgans`
- [x] Preserve the existing pressure diagram as supporting context below the detail stage
- [x] Keep the selected room visibly linked to the detail stage
- **Status:** complete

### Phase 3: Move Room Selection Into Shared Chapter Panel State
- [x] Replace local-only `selectedOrganId` state with shared navigation panel state
- [x] Use Chapter 3's `defaultPanelId` fallback of `general-assembly`
- [x] Validate missing or invalid panel ids fall back safely
- [x] Confirm direct hash entry, adjacent navigation, browser history, and revisit behavior remain stable through targeted browser/unit checks
- **Status:** complete

### Phase 4: Align Semantics And Tests With The Richer Explorer Contract
- [x] Strengthen `UNCommandCenter` unit tests for default panel, invalid fallback, shared-state update, keyboard activation, and visible detail blocks
- [x] Refine minimal Playwright coverage for the visible selected-institution explorer flow
- [x] Keep deeper state matrices in Vitest rather than expanding browser coverage unnecessarily
- [x] Confirm implementation and tests describe the same user-facing contract
- **Status:** complete

### Phase 5: Resolve Transition And Naming Leftovers
- [x] Decide whether `constraintsTransition` has a runtime role
- [x] Remove unused transition data
- [x] Confirm active production naming uses `The System Under Pressure` and `West Philippine Sea Case File`
- [x] Ignore archival naming unless it leaks into active code or tests
- **Status:** complete

### Phase 6: Accessibility, Motion, And Responsive Verification
- [x] Verify focus visibility and keyboard selection behavior
- [x] Verify active state does not rely on color alone
- [x] Verify reduced-motion behavior preserves structure and meaning through focused smoke coverage
- [x] Verify mobile containment, readable spacing, and no horizontal overflow
- [x] Use Playwright screenshots for desktop, tablet, and mobile visual review
- [x] Confirm collapsed mobile order preserves the teaching sequence
- **Status:** complete

### Phase 7: Repo Verification And Delivery
- [x] Run focused Chapter 3 unit coverage
- [x] Run `pnpm lint`
- [x] Run `pnpm typecheck`
- [x] Run targeted Playwright screenshots and direct desktop/mobile browser verification against the local Vite server
- [x] Record broader repo failures from `pnpm test:unit`, `pnpm build`, and the old/default E2E lane as unrelated/outdated blockers
- [x] Run GitNexus detect-changes before handoff
- [x] Summarize changed files, verification results, and follow-up risks
- **Status:** complete

## Key Questions
1. Should the center detail stage become the dominant middle surface, with the pressure diagram supporting it below or alongside it?
2. Can Chapter 3 use the existing `NavigationContext` panel APIs directly, or does it need a small local normalization helper?
3. Is `constraintsTransition` still part of the runtime experience, or should it be removed from active production data?
4. What is the minimum Playwright coverage that proves the richer explorer flow without turning smoke tests into a broad matrix?
5. Does the mobile layout preserve the teaching sequence after the selected-institution detail stage is added?

## Decisions Made
| Decision | Rationale |
|----------|-----------|
| Use `plans-memory` as this plan's working-memory folder | The user pointed at this plan and its supporting artifacts in the same planning-artifacts area, so keeping the three skill files there avoids creating a competing root-level tracker |
| Treat the strengthened implementation plan as the execution source of truth | It incorporates the remaining-work note, UI reference spec, mockup, Graphify findings, and GitNexus impact/context findings |
| Make the selected-institution detail stage the center teaching surface | The remaining-work note and UI reference spec both describe it as the clearest missing learner payoff |
| Use shared chapter panel state for Chapter 3 room selection | Chapter 3 already has `defaultPanelId: "general-assembly"`, and Chapter 2 has a proven local pattern for the same state model |
| Remove the Chapter 3 `Key takeaway` card | User visual review confirmed the mockup-aligned center panel should focus on selected-room detail plus pressure flow |
| Reset stale nested grid areas inside the center panel | The pressure diagram's old outer-grid placement caused the half-empty center card that the screenshot comparison exposed |
| Remove `constraintsTransition` | GitNexus found no consumers, and the final Chapter 3 direction is a composed single-screen explorer rather than a separate transition handoff |
| Verify with targeted Playwright screenshots and direct browser checks instead of relying on the default E2E lane | The user flagged the default E2E script as old/outdated, and the checked-in Playwright config also depends on a build currently blocked by unrelated MaintainerDashboard issues |

## Errors Encountered
| Error | Attempt | Resolution |
|-------|---------|------------|
| Desktop screenshot showed the new center detail stage overflowing into the hero/fixed-nav area | 1 | Changed the wide-screen Chapter 3 grid to content-height rows and top-aligned the three main columns |
| User visual review caught that the center panel still did not match the mockup | 1 | Reset stale nested grid placement, expanded the center content full width, and removed the `Key takeaway` card |
| `pnpm test:unit` failed in unrelated MaintainerDashboard tests | 1 | Kept focused Chapter 3 unit coverage as the relevant passing layer and recorded the unrelated blocker |
| `pnpm build` failed in unrelated MaintainerDashboard modules/types | 1 | Recorded as a repo blocker outside Chapter 3 scope |
| The default/full E2E lane failed outside Chapter 3 and was later avoided per user direction | 1 | Used targeted Playwright screenshots and direct runtime checks instead |

## Notes
- Re-read this file before any follow-up Chapter 3 pass.
- GitNexus detect-changes reported low risk and no affected execution flows, but the result is noisy because the worktree already contains many unrelated changes.
- The local Vite dev server used for screenshots is available at `http://127.0.0.1:5173/#un-command-center` during this handoff if the spawned process is still running.
