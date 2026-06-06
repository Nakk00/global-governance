# Implementation Plan: [FEATURE]

**Branch**: `[###-feature-name]` | **Date**: [DATE] | **Spec**: [link]

**Input**: Feature specification from `/specs/[###-feature-name]/spec.md`

**Note**: This template is filled in by the `/speckit-plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

[Extract from feature spec: primary requirement + technical approach from research]

## Technical Context

<!--
  ACTION REQUIRED: Replace the content in this section with the technical details
  for the project. The structure here is presented in advisory capacity to guide
  the iteration process.
-->

**Language/Version**: TypeScript 5.x, React 19, Vite 7; Python/Django only if backend is touched

**Primary Dependencies**: React, Vite, shadcn/radix primitives, Django public/protected backend surfaces, Supabase data services and non-chat Edge Functions as applicable

**Storage**: Supabase/Postgres or existing repo data files when applicable; otherwise N/A

**Testing**: Mandatory red-green-refactor using Vitest + React Testing Library + MSW, non-chat Supabase Function Vitest, pytest, and focused Playwright/live-chat canaries; changed executable scope MUST meet 80% coverage

**Target Platform**: Browser SPA, Django public-chat/protected-admin surfaces, and Supabase data plus non-chat function surfaces as applicable

**Project Type**: Vite React SPA with Django public/protected backend surfaces and Supabase data plus non-chat Edge Functions

**Performance Goals**: Preserve responsive learning flow; lazy-load heavy media/3D assets; avoid blocking the core page

**Constraints**: Multi-runtime modular monorepo, SPA-first public frontend, Django-owned public chat, keyboard access, reduced motion, typed boundary states, server-only secrets outside `src/`

**Scale/Scope**: [feature-owned surface, affected user journeys, touched data/API boundaries, or NEEDS CLARIFICATION]

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Runtime Boundaries**: Does the plan preserve the React SPA, Django public-chat/protected-admin, and Supabase data plus non-chat function responsibilities without crossing browser/server trust boundaries?
- **Runtime-Appropriate Ownership**: Are React changes feature/workflow-owned, Django changes domain-owned, and Supabase changes organized around thin entry points and cohesive workflow policies?
- **Composition Roots**: Do `App.tsx`, Django views, and Edge Function `index.ts` files remain focused on composition, request adaptation, or delegation?
- **Privileged Logic Boundary**: Does browser-facing code avoid service-role access, server-only secrets, privileged retrieval, ingestion, and citation packaging?
- **Shared Modules and Abstractions**: Does each new shared module name multiple real consumers or a stable contract, and does each adapter/layer correspond to real variation or hidden complexity?
- **Typed Boundary States**: Are external inputs normalized at runtime boundaries and are absence, failure, fallback, refusal, weak-support, and cooldown states explicit?
- **Cohesion and Styling Ownership**: Does the design use domain language, preserve cohesive responsibilities, avoid arbitrary fragmentation, and place feature styles with their owner?
- **Accessible Resilience**: Does the plan cover keyboard access, visible focus, reduced motion, responsive behavior, and fallback/empty/error states?
- **TDD Sequence**: Does each behavior-changing slice define the user journey, failing test, minimum implementation, green verification, and refactor checkpoint in that order?
- **Test Layer**: Is the fastest sufficient verification layer identified, with E2E reserved for critical journeys and tests focused on observable behavior rather than private structure?
- **Coverage Gate**: Does the plan define the new/materially changed executable scope, coverage command, and 80% minimum for every metric reported by the selected tool?
- **Verification and Delivery**: Are the exact `pnpm` checks, graph/impact-analysis needs, and PR handoff expectations named for the changed surfaces?

## Project Structure

### Documentation (this feature)

```text
specs/[###-feature]/
├── plan.md              # This file (/speckit-plan command output)
├── research.md          # Phase 0 output (/speckit-plan command)
├── data-model.md        # Phase 1 output (/speckit-plan command)
├── quickstart.md        # Phase 1 output (/speckit-plan command)
├── contracts/           # Phase 1 output (/speckit-plan command)
└── tasks.md             # Phase 2 output (/speckit-tasks command - NOT created by /speckit-plan)
```

### Source Code (repository root)
<!--
  ACTION REQUIRED: Replace the placeholder tree below with the concrete layout
  for this feature. Delete unused options and expand the chosen structure with
  real paths (e.g., apps/admin, packages/something). The delivered plan must
  not include Option labels.
-->

```text
src/
├── components/
│   ├── layout/
│   ├── sections/
│   ├── modules/
│   ├── chat/
│   ├── references/
│   └── ui/
├── data/
├── lib/
├── hooks/
├── contexts/
└── types/

supabase/
├── functions/
│   ├── <function-name>/index.ts
│   ├── _shared/
│   └── tests/
└── migrations/

backend/
└── tests/

tests/
├── e2e/
├── playwright/
└── support/msw/

public/
└── [static assets, lazy-load heavy media where possible]
```

**Structure Decision**: [Document the selected structure and reference the real
directories captured above]

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., 4th project] | [current need] | [why 3 projects insufficient] |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient] |
