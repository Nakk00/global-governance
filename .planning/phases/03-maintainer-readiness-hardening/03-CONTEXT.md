# Phase 3: Maintainer Readiness Hardening - Context

**Gathered:** 2026-05-09
**Status:** Ready for planning

<domain>
## Phase Boundary

Make the private maintainer surface easier to reason about, easier to navigate,
and safer to extend by reshaping the readiness overview, splitting the dashboard
into page-owned containers, and hardening the stewardship/source backend seam
that supports those workflows.

</domain>

<decisions>
## Implementation Decisions

### Readiness Overview Focus
- **D-01:** The maintainer overview should be a health-summary-first dashboard,
  not a blockers-first triage wall.
- **D-02:** The top summary should be grouped by workflow health rather than by
  abstract readiness states.
- **D-03:** Each workflow card should show status plus key metrics at a glance.
- **D-04:** The top-level summary cards should be Sources, Validation, and
  Audit/Operations.
- **D-05:** Clicking a workflow card should open a filtered drill-down view
  rather than a generic section landing or a direct jump to a single record.
- **D-06:** Filtered drill-downs should prioritize problems plus recent context.
- **D-07:** Recent context in drill-downs should appear inline per issue rather
  than in a separate activity strip or side panel.

### Drill-down Flow
- **D-08:** When a readiness finding is selected, the first destination should
  be source detail first.
- **D-09:** Source detail should lead with the current blocking issue, with
  broader source orientation supporting it.
- **D-10:** After the blocking issue, the next easiest move should be to inspect
  supporting validation context.
- **D-11:** Validation evidence should be shown inline on source detail as a
  summary, with deeper validation inspection available from there.

### Section Boundaries
- **D-12:** The private maintainer IA should use a hybrid model: keep the core
  implementation-friendly sections, but make the user experience readiness-first.
- **D-13:** Readiness-first navigation should live as an overview hub plus
  contextual readiness shortcuts inside sections.
- **D-14:** The readiness experience should be primary, while the original
  section model remains visible as secondary supporting structure.
- **D-15:** The Overview section should receive the largest simplification pass
  in this phase.

### Frontend Decomposition Strategy
- **D-16:** Frontend decomposition should use hook and component extraction,
  rather than a visual-only cleanup or a full state-model rewrite.
- **D-17:** The first extraction target should be page-owned containers, starting
  with overview/readiness UI slices.
- **D-18:** Extracted pieces should use mixed organization: visual shells for
  UI structure plus focused workflow hooks for readiness logic.
- **D-19:** The frontend should move toward independent page-level containers
  rather than keeping most state in the shared dashboard module or top-level
  shell.
- **D-20:** After the split, the top-level maintainer shell should own
  navigation, auth, and a small shared readiness context.

### Backend Seam Hardening
- **D-21:** The highest-priority backend seam in this phase is the
  stewardship/source flow.
- **D-22:** Backend hardening should focus on repository/service separation
  rather than only payload cleanup or mutation-guard polish.
- **D-23:** The service layer should primarily own readiness-oriented shaping
  for maintainer-facing contracts.
- **D-24:** Repositories should stay narrow and own raw data retrieval and
  persistence only.

### Testing Emphasis
- **D-25:** Phase 3 confidence should focus on maintainer integration seams
  across frontend and backend rather than one layer alone.
- **D-26:** The main testing mix should be frontend integration coverage plus
  Django API integration coverage, with browser E2E kept minimal.
- **D-27:** Minimal browser coverage should prove the overview-to-source-detail
  drill-down journey.

### the agent's Discretion
Exact page module names, hook names, DTO names, and the internal split between
Overview, Sources, Validation, and Operations remain flexible as long as the
page-owned container split, thin shell, and service-shaping seam are preserved.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Planning Scope
- `.planning/ROADMAP.md` — Phase 3 goal, plan seeds, dependencies, and success
  criteria for Maintainer Readiness Hardening.
- `.planning/REQUIREMENTS.md` — `READY-01`, `READY-02`, and `READY-03` define
  the locked product outcomes for the private maintainer surface.
- `.planning/PROJECT.md` — project-level constraints: private maintainer
  boundary, brownfield MVP posture, and trust-model constraints.
- `.planning/STATE.md` — current milestone state and known brownfield concern
  that the maintainer dashboard is large enough to need disciplined refactors.

### Frontend Maintainer Surface
- `src/components/modules/MaintainerDashboard/MaintainerDashboard.tsx` —
  thin maintainer shell, route composition, and auth gate handoff.
- `src/components/modules/MaintainerDashboard/shared/maintainerDashboardShared.tsx` —
  current monolithic implementation containing overview, source detail,
  validation workbench, operations, and shared helpers.
- `src/components/modules/MaintainerDashboard/overview/OverviewPage.tsx` —
  page-owned overview seam currently re-exporting the shared implementation.
- `src/components/modules/MaintainerDashboard/sources/SourceDetailPage.tsx` —
  page-owned source detail seam currently re-exporting the shared implementation.
- `src/components/modules/MaintainerDashboard/validation/ValidationWorkbench.tsx` —
  page-owned validation seam currently re-exporting the shared implementation.
- `src/components/modules/MaintainerDashboard/operations/OperationsPage.tsx` —
  page-owned operations seam currently re-exporting the shared implementation.
- `src/components/modules/MaintainerDashboard/hooks/useMaintainerGate.ts` —
  auth gate and session resolution.
- `src/components/modules/MaintainerDashboard/hooks/useMaintainerDashboardData.ts` —
  dashboard state, detail loading, mutation state, and refetch control.
- `src/lib/maintainer/api.ts` — frontend maintainer DTOs and fetch/mutation
  contracts across source, validation, and dashboard workflows.
- `src/lib/supabase/browser-client.ts` — maintainer session storage and auth
  helpers that the shell currently owns.

### Backend Stewardship And Validation Seams
- `backend/sources/services.py` — readiness-shaping seam for stewardable source
  contracts.
- `backend/sources/repository.py` — raw source retrieval, lifecycle, and
  ingestion persistence.
- `backend/sources/dtos.py` — source, dashboard, and stewardship DTO shapes
  that inform the readiness-facing contracts.
- `backend/validation/services.py` — readiness-shaping seam for validation-set
  and validation-run contracts.
- `backend/validation/repository.py` — raw validation-set and validation-run
  retrieval/persistence.
- `backend/validation/dtos.py` — validation DTO contracts that connect to the
  frontend validation workbench and source-detail evidence summaries.
- `backend/accounts/auth.py` — protected admin auth boundary used by the
  maintainer surface.

### Tests And Verification
- `src/components/modules/MaintainerDashboard/MaintainerDashboard.test.tsx` —
  current frontend maintainer coverage to evolve toward seam-level confidence.
- `backend/tests/test_admin_stewardship.py` — source-centered backend contract
  coverage for stewardship flows.
- `backend/tests/test_admin_validation.py` — backend validation coverage that
  should support source-detail evidence flows.
- `backend/tests/test_admin_auth.py` — auth boundary coverage for the private
  maintainer surface.
- `AGENTS.md` — repo testing strategy, especially the preference for frontend
  integration + Django tests with minimal Playwright for browser confidence.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/components/modules/MaintainerDashboard/shared/maintainerDashboardShared.tsx`:
  the current implementation already concentrates route parsing, state
  orchestration, overview, source detail, validation, operations, and shared UI
  helpers; it is the main candidate to split into real page-owned modules.
- `src/components/modules/MaintainerDashboard/hooks/useMaintainerDashboardData.ts`:
  already owns the data-loading and mutation seam that page containers can lean
  on once the rendering split is complete.
- `src/lib/maintainer/api.ts`: centralizes maintainer DTOs, fetches, and
  envelope parsing, so it remains the natural frontend integration seam.
- `backend/sources/services.py` and `backend/validation/services.py`: thin
  service layers that can become the readiness-shaping seam without moving raw
  data access into the browser.

### Established Patterns
- The private surface already uses section-based routing inside the SPA instead
  of a separate router architecture, so the phase should preserve that boundary
  while making readiness the dominant navigation story.
- The frontend already favors typed DTOs and boundary parsing via
  `src/lib/maintainer/api.ts`; Phase 3 should lean into that instead of
  inventing an untyped ad hoc fetch layer.
- Django is already the protected maintainer boundary, with source and
  validation concerns split into separate backend areas; the refactor should
  strengthen those seams rather than move logic into the browser.
- Repository/service separation should keep repositories narrow and let
  services shape maintainer-facing readiness contracts.

### Integration Points
- `MaintainerDashboard.tsx` should remain a thin shell that owns auth,
  navigation, and the small shared readiness context.
- `OverviewPage`, `SourceDetailPage`, `ValidationWorkbench`, and
  `OperationsPage` should become real page-owned modules rather than re-export
  adapters.
- Source detail needs to keep inline validation evidence and lifecycle context
  in one flow rather than forcing page hops.
- Backend source and validation services should shape the contracts consumed by
  the frontend integration layer, while repositories remain narrow data-access
  boundaries.

</code_context>

<specifics>
## Specific Ideas

- The overview should feel like a stable operational summary, not an error wall.
- Workflow cards should act as readiness entry points into focused, filtered
  drill-downs instead of generic navigation shortcuts.
- The key real-browser proof is the journey from overview into source-centered
  investigation, because that is the dominant maintainer story for this phase.

</specifics>

<deferred>
## Deferred Ideas

- Shared chapter-learning and Student / Expert depth seams belong in Phase 1,
  not Phase 3.

</deferred>

---

*Phase: 3-Maintainer Readiness Hardening*
*Context gathered: 2026-05-09*
