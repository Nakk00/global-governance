---

description: "Task list template for feature implementation"
---

# Tasks: [FEATURE NAME]

**Input**: Design documents from `/specs/[###-feature-name]/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Tests are mandatory for every behavior-changing story. Generate red test tasks before implementation, green verification after implementation, and a refactor checkpoint while tests remain green. Choose the fastest layer that proves the behavior and verify at least 80% coverage for new or materially changed executable code.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Frontend SPA**: `src/components/{layout,sections,modules,chat,references,ui}`, `src/data`, `src/lib`, `src/hooks`, `src/contexts`, `src/types`
- **Supabase Edge Functions**: `supabase/functions/<function-name>/index.ts`, shared helpers in `supabase/functions/_shared`, tests in `supabase/functions/tests`
- **Django backend**: public chat plus privileged maintainer/admin work under `backend/`, tests under `backend/tests`
- **Browser E2E**: checked-in Playwright specs in `tests/e2e`, shared browser helpers in `tests/playwright`
- **MSW/support**: shared network handlers and fixtures in `tests/support/msw`
- **Static assets**: `public/`, with heavy media or 3D assets isolated for lazy loading
- Paths in generated tasks MUST use real repo paths from plan.md

<!--
  ============================================================================
  IMPORTANT: The tasks below are SAMPLE TASKS for illustration purposes only.

  The /speckit-tasks command MUST replace these with actual tasks based on:
  - User stories from spec.md (with their priorities P1, P2, P3...)
  - Feature requirements from plan.md
  - Entities from data-model.md
  - Endpoints from contracts/

  Tasks MUST be organized by user story so each story can be:
  - Implemented independently
  - Tested independently
  - Delivered as an MVP increment

  DO NOT keep these sample tasks in the generated tasks.md file.
  ============================================================================
-->

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [ ] T001 Confirm the plan uses existing feature-owned directories and create only approved missing folders
- [ ] T002 Add or update dependencies only if plan.md justifies them; use `pnpm`
- [ ] T003 [P] Configure coverage tooling and deterministic fixtures required to measure the feature's changed executable scope at 80% or higher

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

Examples of foundational tasks (adjust based on your project):

- [ ] T004 Define typed data, response, or UI-state contracts and runtime-boundary validation in the approved `src/`, `supabase/`, or `backend/` location
- [ ] T005 [P] Add a shared module or adapter only when plan.md names its consumers, stable contract, or real point of variation
- [ ] T006 [P] Add accessibility, reduced-motion, and fallback-state plumbing needed by all stories
- [ ] T007 Update Supabase migration, Edge Function, or Django foundation only if the plan requires privileged work
- [ ] T008 Configure error handling so refusal, weak-support, cooldown, empty, and loading states remain typed user-visible states
- [ ] T009 Confirm feature-specific styling ownership and the verification command set from plan.md before story implementation begins

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - [Title] (Priority: P1) 🎯 MVP

**Goal**: [Brief description of what this story delivers]

**Independent Test**: [How to verify this story works on its own]

### Red Tests for User Story 1

> **NOTE: Complete these tasks and confirm they fail for the intended reason before implementation.**

- [ ] T010 [P] [US1] Component, MSW, Supabase Function, backend, or Playwright test in the repo-approved folder selected by plan.md
- [ ] T011 [P] [US1] Component or MSW integration test for [behavior] in src/[feature]/[name].test.tsx
- [ ] T012 [US1] Add the required cross-runtime or browser test in the repo-approved folder, run the focused story tests, and record the expected red result

### Implementation for User Story 1

- [ ] T013 [P] [US1] Create or update feature component in src/components/[boundary]/[feature]/[file].tsx
- [ ] T014 [P] [US1] Create or update data/types/helpers in src/data, src/types, or src/lib as planned
- [ ] T015 [US1] Wire [interaction/state] into the owning section or module
- [ ] T016 [US1] Add validation, typed fallback/error states, reduced-motion behavior, and visible focus handling
- [ ] T017 [US1] Update Supabase/Django code only if required by the privileged boundary in plan.md
- [ ] T018 [US1] Run the story-specific tests to green, refactor while green, and verify the story's changed executable scope meets the 80% coverage gate

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - [Title] (Priority: P2)

**Goal**: [Brief description of what this story delivers]

**Independent Test**: [How to verify this story works on its own]

### Red Tests for User Story 2

- [ ] T019 [P] [US2] Component, MSW, Supabase Function, backend, or Playwright test in the repo-approved folder selected by plan.md
- [ ] T020 [US2] Add accessibility or fallback-state regression coverage, run the focused story tests, and record the expected red result

### Implementation for User Story 2

- [ ] T021 [P] [US2] Create or update feature-owned component, data, type, or helper files from plan.md
- [ ] T022 [US2] Implement [interaction/state/API boundary] in the owning module
- [ ] T023 [US2] Preserve User Story 1 behavior while integrating shared components or helpers
- [ ] T024 [US2] Run the story-specific tests to green, refactor while green, and verify the story's changed executable scope meets the 80% coverage gate

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - [Title] (Priority: P3)

**Goal**: [Brief description of what this story delivers]

**Independent Test**: [How to verify this story works on its own]

### Red Tests for User Story 3

- [ ] T025 [P] [US3] Component, MSW, Supabase Function, backend, or Playwright test in the repo-approved folder selected by plan.md
- [ ] T026 [US3] Add accessibility, layout, or live-chat coverage for the selected risk surface, run the focused story tests, and record the expected red result

### Implementation for User Story 3

- [ ] T027 [P] [US3] Create or update feature-owned component, data, type, or helper files from plan.md
- [ ] T028 [US3] Implement [interaction/state/API boundary] in the owning module
- [ ] T029 [US3] Run the story-specific tests to green, refactor while green, and verify the story's changed executable scope meets the 80% coverage gate

**Checkpoint**: All user stories should now be independently functional

---

[Add more user story phases as needed, following the same pattern]

---

## Phase N: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] TXXX [P] Documentation updates in docs/
- [ ] TXXX Cohesion, naming, or ownership cleanup justified by the changed behavior
- [ ] TXXX Remove temporary compatibility exports whose documented removal condition is satisfied
- [ ] TXXX Performance optimization across all stories
- [ ] TXXX [P] Close measured coverage gaps in co-located unit/component, MSW, non-chat Supabase Function, or backend tests
- [ ] TXXX Confirm no skipped or disabled tests are being used to satisfy acceptance or coverage gates
- [ ] TXXX Security hardening
- [ ] TXXX Run quickstart.md validation
- [ ] TXXX Run required `pnpm` verification commands from plan.md

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3)
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - May integrate with US1 but should be independently testable
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - May integrate with US1/US2 but should be independently testable

### Within Each User Story

- Write and run focused tests first; confirm the intended red result before implementation
- Types/data contracts before components or server handlers
- Shared helpers before feature wiring only when their consumers or stable contract are already known
- Implement the minimum behavior needed for green, then refactor while tests remain green
- Verify the changed executable scope meets the 80% coverage gate
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel (within Phase 2)
- Once Foundational phase completes, all user stories can start in parallel (if team capacity allows)
- All tests for a user story marked [P] can run in parallel
- Independent feature-owned files within a story marked [P] can run in parallel
- Different user stories can be worked on in parallel by different team members

---

## Parallel Example: User Story 1

```bash
# Launch all red tests for User Story 1 together:
Task: "Component/MSW test for [behavior] in src/[feature]/[name].test.tsx"
Task: "Supabase/backend/Playwright test in the approved repo folder if this story touches that layer"

# Launch independent implementation files for User Story 1 together:
Task: "Update feature component in src/components/[boundary]/[feature]/[file].tsx"
Task: "Update typed helper or data definition in src/lib, src/types, or src/data"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test User Story 1 independently
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Test independently → Deploy/Demo
4. Add User Story 3 → Test independently → Deploy/Demo
5. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1
   - Developer B: User Story 2
   - Developer C: User Story 3
3. Stories complete and integrate independently

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable through the selected fastest layer
- Every behavior-changing task follows red-green-refactor; document any constitution-approved exception
- New or materially changed executable code must meet the 80% coverage gate
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, arbitrary helper extraction, unclear shared ownership, same file conflicts, and cross-story dependencies that break independence
