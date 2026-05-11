# Phase 6: Maintainer Codebase Modularization - Context

**Gathered:** 2026-05-11
**Status:** Queued after Phase 5

<domain>
## Phase Boundary

Reduce maintainer console and source stewardship file size, mixed responsibilities,
and review risk through behavior-preserving module splits. This phase starts
after the Phase 5 control-center work stabilizes and must not change frontend
routes, backend response contracts, DTO fields, session-expiry behavior, or the
private maintainer boundary.

</domain>

<decisions>
## Implementation Decisions

### Sequencing
- **D-01:** Start modularization with the private maintainer console frontend,
  specifically `src/components/modules/MaintainerDashboard/shared/maintainerDashboardShared.tsx`.
- **D-02:** Split `SourcesPage.tsx` before the backend source repository so the
  lower-risk frontend seams settle first.
- **D-03:** Split `backend/sources/repository.py` only after running GitNexus
  impact analysis and identifying importers, tests, and stewardship workflows.
- **D-04:** Split overview builders and maintainer API wrappers after the main
  page and repository seams are stable.

### Stability
- **D-05:** The work is behavior-preserving. If the UI looks materially
  different or API contracts change, the phase has drifted.
- **D-06:** Temporary compatibility exports are allowed to reduce import churn.
- **D-07:** Split by feature ownership and responsibility boundaries, not by
  creating tiny files for their own sake.

### Boundaries
- **D-08:** Shared maintainer helpers should move into focused shared modules
  for types, routing, states, mutation state, and formatters.
- **D-09:** Source detail, validation, audit trail, and chatbot trust
  implementations should live in feature-owned folders.
- **D-10:** Backend source repository modules should separate base contracts,
  mappers, seeds, storage, mutation helpers, memory implementation, and Supabase
  implementation while keeping `repository.py` as a compatibility layer during
  transition.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Planning Scope
- `.planning/PROJECT.md` - private maintainer boundary, brownfield MVP posture,
  and SPA/runtime constraints.
- `.planning/REQUIREMENTS.md` - `MOD-01` through `MOD-05`.
- `.planning/ROADMAP.md` - Phase 6 goal, plan seeds, dependencies, and success
  criteria.
- `.planning/STATE.md` - current delivery context and warning that Phase 6 must
  not widen active Phase 4 or Phase 5 scope unless explicitly re-promoted.
- `.planning/INGEST-CONFLICTS.md` - ingest warnings about Phase 5 overlap and
  backend repository blast radius.
- `.planning/intel/SYNTHESIS.md` - synthesized modularization proposal.
- `archive/docs/planning-artifacts/codebase-modularization-v2-proposal.md` -
  source proposal.

### Frontend Maintainer Surface
- `src/components/modules/MaintainerDashboard/shared/maintainerDashboardShared.tsx`
- `src/components/modules/MaintainerDashboard/sources/SourcesPage.tsx`
- `src/components/modules/MaintainerDashboard/overview/OverviewPage.tsx`
- `src/components/modules/MaintainerDashboard/MaintainerDashboard.tsx`
- `src/components/modules/MaintainerDashboard/hooks/useMaintainerDashboardData.ts`
- `src/lib/maintainer/api.ts`

### Backend Source Stewardship
- `backend/sources/repository.py`
- `backend/sources/services.py`
- `backend/sources/dtos.py`
- `backend/sources/views.py`
- `backend/tests/test_admin_stewardship.py`

</canonical_refs>

<code_context>
## Existing Code Insights

- `maintainerDashboardShared.tsx` is the first modularization target because it
  mixes shared helpers with feature implementations.
- `SourcesPage.tsx` should keep selected source state, pagination/filter state,
  page composition, and navigation calls while extracting inventory filters,
  tables, cards, preview rail, metrics, and formatters.
- `backend/sources/repository.py` has wider blast radius than the frontend
  splits because it touches stewardship behavior, source mutations, ingestion
  dispatch, inspection, and dashboard data.
- `src/lib/maintainer/api.ts` should preserve shared client/envelope/session
  behavior while grouping endpoint wrappers by feature.

</code_context>

<specifics>
## Specific Ideas

- First PR: move shared non-feature helpers out of
  `maintainerDashboardShared.tsx` into focused shared modules.
- Keep compatibility exports until all direct imports are stable.
- Use frontend unit, lint, typecheck, and build checks for frontend splits.
- Use backend test, lint, typecheck, and Django checks for repository splits.

</specifics>

<deferred>
## Deferred Ideas

- Do not execute this phase until Phase 5 is stable unless the user explicitly
  re-promotes modularization into the active delivery lane.

</deferred>

---

*Phase: 6-Maintainer Codebase Modularization*
*Context gathered: 2026-05-11 from codebase modularization v2 proposal ingest*
