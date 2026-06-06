# Task Plan: Chapter 4 Interactive Features Execution Initialization

## Goal
Initialize an execution-ready planning package for `chapter-4-interactive-features-implementation-plan.md` so the next implementation pass can start with clear scope, constraints, and verification targets.

## Current Phase
Phase 5

## Phases

### Phase 1: Initialization And Scope Lock
- [x] Read the source implementation plan.
- [x] Read the `planning-with-files` skill instructions.
- [x] Review existing `plans-memory` artifacts and determine whether they should be reused or re-scoped.
- [x] Confirm the active plan remains the Chapter 4 interactive implementation plan.
- **Status:** complete

### Phase 2: First Slice Preparation
- [x] Identify the safest first implementation slice from the active plan.
- [x] Lock the initial file scope for that slice.
- [x] Capture shared-surface guardrails for chat, navigation, and redirects.
- **Status:** complete

### Phase 3: Runtime Implementation
- [x] Execute the approved local WPS interaction slice in runtime files.
- [x] Keep state and behavior local to `WpsDossier` unless a later gate expands scope.
- [x] Update findings and progress after each meaningful implementation step.
- **Status:** complete

### Phase 4: Verification
- [x] Run the targeted unit and browser checks named in the implementation plan.
- [x] Record unrelated failures separately from Chapter 4 regressions.
- [x] Confirm accessibility, reduced-motion, and no-overflow expectations covered by targeted tests and CSS.
- **Status:** complete

### Phase 5: Handoff
- [x] Review touched planning and runtime files.
- [x] Summarize completed work, residual risks, and follow-up decisions.
- [ ] Hand the implementation results back to the user.
- **Status:** in_progress

## Key Questions
1. What is the safest first executable slice: mode strip, map hotspots, evidence tray, or comparison drawer?
2. Which shared surfaces must remain untouched in the first pass because GitNexus marked them high risk?
3. Which targeted tests are required for the first slice before broader validation is worth running?
4. What evidence from the existing plan is stable enough to preserve as baseline guidance for the implementation pass?

## Decisions Made
| Decision | Rationale |
|----------|-----------|
| Reuse the existing `plans-memory` folder instead of creating a second planning location | The requested planning workspace already exists beside the target plan and matches the skill's persistent-files pattern. |
| Re-scope the planning files from "plan strengthening" to "execution initialization" | The old artifacts were useful background, but they were aimed at improving the plan rather than starting implementation from it. |
| Keep the Chapter 4 implementation plan as the primary source of truth | It already contains the strongest cross-checked scope, risk, and testing guidance. |
| Treat `WpsDossier`, WPS data, WPS CSS, and WPS-specific tests as the preferred first-pass scope | The plan and prior GitNexus evidence both identify chat and navigation as higher-risk shared surfaces. |
| Preserve prior Graphify and GitNexus findings instead of regenerating them during initialization | The target plan already records fresh evidence for the current commit, and this task is to initialize planning, not redo research. |
| First implementation scope is local WPS interaction work | GitNexus impact is LOW for `WpsDossier` and MEDIUM for the WPS data file, with no indexed execution flows affected. |
| Treat MaintainerDashboard test/build failures as unrelated drift for this pass | The errors are in missing/shared MaintainerDashboard modules and expectations outside Chapter 4; targeted WPS checks pass. |

## Errors Encountered
| Error | Attempt | Resolution |
|-------|---------|------------|
| Existing planning artifacts were scoped to a prior strengthening pass rather than implementation kickoff | 1 | Re-based them into an execution initialization package while keeping the previous evidence available in the main plan and addendum. |
| Full unit/build/default Playwright lanes are blocked by unrelated MaintainerDashboard drift | 1 | Verified Chapter 4 with focused WPS unit tests, lint, typecheck, and dev-server Playwright smoke; documented the blocker. |

## Notes
- The active plan is `archive/docs/planning-artifacts/public-redesign-plans/chapter-4-interactive-features-implementation-plan.md`.
- Companion working-memory files live under `archive/docs/planning-artifacts/public-redesign-plans/plans-memory/`.
- Re-read this task plan before choosing the first runtime implementation slice.
