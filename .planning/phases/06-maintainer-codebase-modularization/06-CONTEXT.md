# Phase 6: Maintainer Codebase Modularization - Context

**Gathered:** 2026-05-12
**Status:** Ready for planning

<domain>
## Phase Boundary

Reduce the maintainer console and source stewardship file size, mixed
responsibilities, and review risk through behavior-preserving module splits.
This phase stays inside the private maintainer boundary and must not change
frontend routes, backend response contracts, DTO field names, session-expiry
behavior, or add new user-visible capabilities.

</domain>

<spec_lock>
## Requirements (locked via SPEC.md)

**5 requirements are locked.** See `06-SPEC.md` for full requirements,
boundaries, and acceptance criteria.

Downstream agents MUST read `06-SPEC.md` before planning or implementing.
Requirements are not duplicated here.

**In scope (from SPEC.md):**
- Split maintainer dashboard shared infrastructure away from feature pages.
- Reduce `SourcesPage.tsx` to page state and page composition.
- Move source detail, validation, audit trail, and chatbot trust code into feature-owned modules or folders.
- Split `backend/sources/repository.py` into responsibility-focused modules while keeping a compatibility layer.
- Separate overview builders and visual primitives from `OverviewPage.tsx`.
- Group maintainer API wrappers by feature while preserving shared transport behavior.

**Out of scope (from SPEC.md):**
- New maintainer features or new routes.
- Changes to frontend routes, backend response contracts, DTO field names, session-expiry behavior, or private maintainer access rules.
- Public maintainer discovery or learner-visible functionality.
- A redesign of maintainer UI or data model semantics.

</spec_lock>

<decisions>
## Implementation Decisions

### Shell and shared infra
- **D-01:** Keep `MaintainerDashboard.tsx` as the private shell that owns auth
  bootstrap, session-expiry handling, and route/page selection; modularization
  starts by splitting `maintainerDashboardShared.tsx`, not the shell.
- **D-02:** Split the shared implementation into a small set of
  concern-based modules first (`types`, `routing`, `states`,
  `mutation-state`, `formatters`) and keep compatibility exports in place
  while imports settle.
- **D-03:** Preserve `useMaintainerDashboardData` and
  `src/lib/maintainer/api.ts` as the data and transport seams for this phase
  rather than introducing a new store or router.

### Source inventory decomposition
- **D-04:** Keep page-local search, filter, pagination, and selection state in
  `SourcesPage.tsx`; the page should remain the container for that UI state.
- **D-05:** Move inventory filters, tables/cards, preview rail, metrics,
  formatters, and source detail/validation/audit/trust UI into feature-owned
  modules under `sources/`, using coarse-grained modules such as
  `SourceInventoryFilters`, `SourceInventoryTable`, `SourceInventoryCards`,
  `SourcePreviewRail`, `source-metrics`, `source-formatters`,
  `source-history`, and `source-inspection`.
- **D-06:** Favor coarse-grained feature modules over helper-per-file sprawl so
  the private console becomes easier to own instead of more fragmented.

### Repository layout
- **D-07:** Split `backend/sources/repository.py` into a compatibility layer
  plus a `backend/sources/repositories/` package, rather than a nested
  `repository/` package or a bigger rewrite.
- **D-08:** Use `base.py`, `mappers.py`, `memory.py`, `mutations.py`,
  `seeds.py`, `storage.py`, and `supabase.py` in that package so the public
  repository surface stays stable while implementation concerns separate.
- **D-09:** Keep the `StewardshipRepository` protocol, the in-memory
  repository, and the Supabase repository aligned with the existing
  service/view/DTO contracts during the migration.

### Overview and API grouping
- **D-10:** Extract `OverviewPage.tsx` builders and visual primitives into
  overview helper modules, leaving `OverviewPage.tsx` as the composition root.
- **D-11:** Keep shared maintainer transport, envelope parsing, request-shape
  handling, response parsing, and session-expiry behavior centralized, then
  group API wrappers by feature family in sibling modules such as `client.ts`,
  `envelope.ts`, `auth-api.ts`, `source-api.ts`, `validation-api.ts`, and
  `mutation-api.ts`.
- **D-12:** Preserve `MaintainerApiError` and other shared parsing helpers as
  compatibility exports while downstream imports are migrated.

### Transition strategy
- **D-13:** Use incremental import migration and temporary compatibility
  barrels across every split, removing shims only after the new module paths
  are green.
- **D-14:** Keep the splits coarse-grained and feature-owned, not
  helper-per-file, so the refactor removes friction without creating a new
  maintenance tax.

### the agent's Discretion
Exact helper names and file splits can be finalized in plan-phase as long as
the shell/data seams, package shapes, and compatibility-export approach stay
stable.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Planning Core
- `.planning/PROJECT.md` - brownfield MVP posture, private maintainer boundary,
  and SPA/runtime constraints.
- `.planning/REQUIREMENTS.md` - `MOD-01` through `MOD-05` and the surrounding
  maintainability guardrails.
- `.planning/ROADMAP.md` - Phase 6 goal, dependencies, plan seeds, and success
  criteria.
- `.planning/STATE.md` - current delivery state and the note that Phase 6 must
  not widen active Phase 4 or Phase 5 scope.
- `.planning/phases/06-maintainer-codebase-modularization/06-SPEC.md` - locked
  requirements, boundaries, and acceptance criteria for this phase.
- `.planning/phases/05-admin-ux-polish-for-maintainers/05-CONTEXT.md` - Phase
  5 control-center decisions that modularization must preserve.
- `.planning/phases/03-maintainer-readiness-hardening/03-CONTEXT.md` - earlier
  readiness-first shell and source-first drill-down decisions.
- `.planning/INGEST-CONFLICTS.md` - warning that modularization overlaps Phase
  5 and that the backend split has a wider blast radius.
- `.planning/intel/SYNTHESIS.md` - synthesized modularization proposal and
  suggested phase order.
- `archive/docs/planning-artifacts/codebase-modularization-v2-proposal.md` -
  source proposal with target module shapes and verification guidance.

### Code Graph and Maps
- `graphify-out-merged/GRAPH_REPORT.md` - merged cross-layer dependency map and
  maintainer/source communities.
- `.planning/codebase/STACK.md` - runtime, framework, and verification stack
  boundaries.
- `.planning/codebase/ARCHITECTURE.md` - SPA-first architecture, shell
  boundaries, and backend integration layers.
- `.planning/codebase/CONVENTIONS.md` - naming and module-design conventions
  for splits.
- `.planning/codebase/CONCERNS.md` - large maintainer shell and repository seam
  risks.

### Frontend Maintainer Surface
- `src/components/modules/MaintainerDashboard/MaintainerDashboard.tsx` -
  private shell, auth bootstrap, and route selection.
- `src/components/modules/MaintainerDashboard/AdminPortalShell.tsx` - admin
  shell utilities and utility bar.
- `src/components/modules/MaintainerDashboard/hooks/useMaintainerDashboardData.ts`
  - dashboard/data-loading seam.
- `src/components/modules/MaintainerDashboard/hooks/useMaintainerGate.ts` -
  auth/session gate seam.
- `src/components/modules/MaintainerDashboard/shared/maintainerDashboardShared.tsx`
  - current monolith that this phase splits.
- `src/components/modules/MaintainerDashboard/sources/SourcesPage.tsx` - source
  inventory page container.
- `src/components/modules/MaintainerDashboard/overview/OverviewPage.tsx` -
  overview builders and primitives to extract.
- `src/lib/maintainer/api.ts` - current maintainer transport and DTO boundary.

### Backend Stewardship
- `backend/sources/repository.py` - current repository monolith and
  compatibility target.
- `backend/sources/services.py` - protected backend service seam.
- `backend/sources/views.py` - protected backend view seam.
- `backend/sources/dtos.py` - source stewardship DTO contracts.
- `backend/tests/test_admin_stewardship.py` - main backend regression suite for
  stewardship flows.

### Repo Rules
- `AGENTS.md` - file placement, verification, and private maintainer boundary
  rules.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/components/modules/MaintainerDashboard/MaintainerDashboard.tsx`: shell
  entry point that already handles auth/session bootstrap, route selection, and
  page loading.
- `src/components/modules/MaintainerDashboard/AdminPortalShell.tsx`:
  reusable admin chrome and utility bar.
- `src/components/modules/MaintainerDashboard/hooks/useMaintainerDashboardData.ts`:
  dashboard/data-loading seam that the page containers can keep using.
- `src/components/modules/MaintainerDashboard/hooks/useMaintainerGate.ts`:
  auth/session gate seam for the private surface.
- `src/components/modules/MaintainerDashboard/shared/maintainerDashboardShared.tsx`:
  current monolith containing route parsing, source helpers, page bodies,
  validation workbench, audit trail, and chatbot trust helpers.
- `src/components/modules/MaintainerDashboard/sources/SourcesPage.tsx`: page-
  local search, filter, pagination, selection sync, and helper functions such
  as `buildSourceMetrics`, `validationStatusKey`, `sourceMatchesSearch`,
  `getSourceTypeOptions`, `detailMetadataValue`, and `formatDate`.
- `src/components/modules/MaintainerDashboard/overview/OverviewPage.tsx`:
  inline builders and primitives such as `buildBlockers`, `buildActions`,
  `buildSourceRow`, `buildValidationRows`, `buildAuditRows`,
  `buildValidationSummary`, `buildTrustSummary`, `StatusCard`,
  `DashboardPanel`, `CompactTable`, and `RingMetric`.
- `src/lib/maintainer/api.ts`: central transport, DTO, and session-expiry
  boundary for maintainer requests.
- `backend/sources/repository.py`: `StewardshipRepository`,
  `InMemoryStewardshipRepository`, `SupabaseStewardshipRepository`, and many
  private helpers concentrated in one file.
- `backend/sources/services.py` and `backend/sources/views.py`: the protected
  backend seams that should stay contract-stable during the split.

### Established Patterns
- The private maintainer surface is SPA-first and anchor-navigation oriented,
  not React Router based.
- Boundary parsing and typed DTOs already form the frontend/backend contract
  seam.
- Compatibility exports are acceptable during behavior-preserving transitions.
- Repository/service separation is already the backend pattern, so repositories
  should remain the raw data-access layer.

### Integration Points
- `MaintainerDashboard.tsx`, `AdminPortalShell`, and the maintainer hook layer
  are the shell and navigation entry points.
- `SourcesPage`, `OverviewPage`, `SourceDetailPage`, `ValidationWorkbench`,
  `AuditTrailPage`, and `ChatbotTrustPage` are the feature seams that
  modularization should feed.
- `src/lib/maintainer/api.ts`, `backend/sources/services.py`, and
  `backend/sources/views.py` are the contract seams that should stay
  behavior-identical.
- `backend/tests/test_admin_stewardship.py` is the key backend regression
  suite.

</code_context>

<specifics>
## Specific Ideas

- The first PR should move only shared non-feature helpers out of
  `maintainerDashboardShared.tsx`.
- Preserve compatibility exports until all direct imports are stable.
- Backend repository modularization should stay in its own plan with GitNexus
  impact analysis and backend verification before implementation.
- Use the module shapes from the v2 proposal as the starting point:
  `shared/types.ts`, `shared/routing.ts`, `shared/states.tsx`,
  `shared/mutation-state.ts`, `shared/formatters.ts`,
  `backend/sources/repositories/base.py`, `mappers.py`, `memory.py`,
  `mutations.py`, `seeds.py`, `storage.py`, `supabase.py`,
  `overview-builders.ts`, `OverviewMetrics.tsx`, `OverviewTables.tsx`,
  `client.ts`, `envelope.ts`, `auth-api.ts`, `source-api.ts`,
  `validation-api.ts`, and `mutation-api.ts`.
- Keep the splits coarse-grained and feature-owned rather than helper-per-file.

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 6-Maintainer Codebase Modularization*
*Context gathered: 2026-05-12 from discuss-phase auto analysis and codebase modularization v2 proposal ingest*
