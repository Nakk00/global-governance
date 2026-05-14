---
phase: 06-maintainer-codebase-modularization
plan: 05
subsystem: maintainer-dashboard
tags: [frontend, react, typescript, api, maintainer-dashboard, refactor, compatibility-barrel]
requires:
  - phase: 05-admin-ux-polish-for-maintainers
    provides: stable private maintainer control-center context and repository consumers
provides:
  - feature-owned overview builders, visual primitives, and table primitives
  - feature-grouped maintainer API modules around a shared transport/envelope core
  - compatibility re-exports so downstream imports can migrate incrementally
affects:
  - Phase 6
  - maintainer dashboard
  - maintainer API consumers
tech-stack:
  added: []
  patterns: [overview composition root, feature-grouped API modules, compatibility barrel migration]
key-files:
  created:
    - src/components/modules/MaintainerDashboard/overview/overview-builders.ts
    - src/components/modules/MaintainerDashboard/overview/OverviewMetrics.tsx
    - src/components/modules/MaintainerDashboard/overview/OverviewTables.tsx
    - src/lib/maintainer/client.ts
    - src/lib/maintainer/envelope.ts
    - src/lib/maintainer/auth-api.ts
    - src/lib/maintainer/source-api.ts
    - src/lib/maintainer/validation-api.ts
    - src/lib/maintainer/mutation-api.ts
    - src/components/modules/MaintainerDashboard/sources/SourcesPage.tsx
    - src/components/modules/MaintainerDashboard/sources/SourceDetailPage.test.tsx
    - src/components/modules/MaintainerDashboard/sources/SourcesPage.test.tsx
  modified:
    - src/components/modules/MaintainerDashboard/overview/OverviewPage.tsx
    - src/lib/maintainer/api.ts
    - src/lib/maintainer/api.test.ts
    - src/components/modules/MaintainerDashboard/hooks/useMaintainerGate.ts
    - src/components/modules/MaintainerDashboard/hooks/useMaintainerDashboardData.ts
    - src/components/modules/MaintainerDashboard/MaintainerDashboard.test.tsx
key-decisions:
  - "Kept OverviewPage.tsx as the composition root and moved overview row, summary, table, and metric logic into feature-owned helper modules."
  - "Split the maintainer API wrappers into feature-grouped modules around shared transport and envelope helpers, then left api.ts as a compatibility barrel."
  - "Retargeted downstream maintainer hooks, pages, and tests to the new API modules without changing routes, envelopes, or session-expiry behavior."
patterns-established:
  - "Composition-root pages can stay thin when row builders and visual primitives live in feature-owned helper modules."
  - "Compatibility barrels let a large API surface migrate incrementally while preserving existing imports during the transition."
requirements-completed:
  - MOD-04
  - MOD-05
duration: 6 min
completed: 2026-05-14
---

# Phase 6 Plan 5: Split overview builders and maintainer API wrappers by feature Summary

OverviewPage now composes feature-owned builders and primitives, and the maintainer API surface is split by feature behind a shared transport/envelope compatibility layer.

## Performance

- **Duration:** 6 min
- **Started:** 2026-05-14T13:05:00Z
- **Completed:** 2026-05-14T13:11:25Z
- **Tasks:** 2
- **Files modified:** 18

## Accomplishments
- Split the overview logic into `overview-builders.ts`, `OverviewMetrics.tsx`, and `OverviewTables.tsx`, leaving `OverviewPage.tsx` as a composition root.
- Moved maintainer transport, envelope parsing, and feature-specific wrappers into `client.ts`, `envelope.ts`, `auth-api.ts`, `source-api.ts`, `validation-api.ts`, and `mutation-api.ts`.
- Retargeted the maintainer hooks, sources page, and tests to the new feature modules while keeping `api.ts` as a compatibility barrel.

## Verification
- `pnpm format`
- `pnpm test:unit`
- `pnpm lint`
- `pnpm typecheck`
- `pnpm build`

## Task Commits

Each task was committed atomically:

1. **Task 1: Extract overview builders and visual primitives into helper modules** - `f88703b` (`refactor`)
2. **Task 2: Split maintainer API wrappers by feature around shared transport and envelope modules** - `79b1327` (`refactor`)

## Files Created/Modified
- `src/components/modules/MaintainerDashboard/overview/overview-builders.ts` - overview row, summary, blocker, and summary-card builders.
- `src/components/modules/MaintainerDashboard/overview/OverviewMetrics.tsx` - reusable overview status cards, pills, and metric primitives.
- `src/components/modules/MaintainerDashboard/overview/OverviewTables.tsx` - shared panel and compact table primitives for the overview screen.
- `src/components/modules/MaintainerDashboard/overview/OverviewPage.tsx` - composition root that now consumes the extracted overview helpers.
- `src/lib/maintainer/client.ts` - shared maintainer request transport helpers.
- `src/lib/maintainer/envelope.ts` - shared envelope parsing and `MaintainerApiError`.
- `src/lib/maintainer/auth-api.ts` - admin identity fetch wrapper.
- `src/lib/maintainer/source-api.ts` - source dashboard/detail wrappers and shared source types.
- `src/lib/maintainer/validation-api.ts` - validation fetch wrappers.
- `src/lib/maintainer/mutation-api.ts` - ingest, lifecycle, and metadata mutation wrappers.
- `src/lib/maintainer/api.ts` - compatibility export barrel over the split maintainer API modules.
- `src/lib/maintainer/api.test.ts` - compatibility-barrel and split-module coverage.
- `src/components/modules/MaintainerDashboard/hooks/useMaintainerGate.ts` - auth hook retargeted to the auth API module.
- `src/components/modules/MaintainerDashboard/hooks/useMaintainerDashboardData.ts` - data hook retargeted to the split maintainer API modules.
- `src/components/modules/MaintainerDashboard/sources/SourcesPage.tsx` - new source inventory page composition root.
- `src/components/modules/MaintainerDashboard/sources/SourceDetailPage.test.tsx` - source detail test retargeted to the split API surface.
- `src/components/modules/MaintainerDashboard/sources/SourcesPage.test.tsx` - source inventory test retargeted to the split API surface.
- `src/components/modules/MaintainerDashboard/MaintainerDashboard.test.tsx` - dashboard test retargeted to the new module boundaries.

## Decisions Made
- Kept the shared transport and envelope behavior centralized so session-expiry handling, request parsing, and error shape stayed stable.
- Left `src/lib/maintainer/api.ts` as a compatibility barrel so downstream imports can migrate gradually without route or response churn.
- Split the overview helpers coarsely instead of helper-per-file fragmentation so the feature remains easy to reason about and test.

## Deviations from Plan

### Auto-fixed Issues

None.

**Total deviations:** 0 auto-fixed.
**Impact on plan:** The wave stayed within scope and preserved the protected API and overview behavior.

## Issues Encountered
- `pnpm lint` still reported the pre-existing `.codex` warnings.
- `pnpm build` still showed the existing CSS minify warning about `file` being treated as a CSS property.
- The worktree still contains older maintainer-shell diffs outside this wave, and I left them untouched so the wave 5 commits stayed scoped to the plan files.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- Wave 5 is complete and the maintainer overview/API modularization goals for Phase 6 are satisfied.
- The remaining dirty worktree items are older modularization changes outside this wave and can be handled separately if a fully clean branch is needed.

---
*Phase: 06-maintainer-codebase-modularization*
*Completed: 2026-05-14*
