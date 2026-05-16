# Phase 7: Validation Evidence Bridge - Context

**Gathered:** 2026-05-16
**Status:** Ready for planning

<domain>
## Phase Boundary

Connect terminal validation results back into source-facing stewardship
history so completed runs write immutable, source-level evidence rows that
source detail and inventory can read directly. The phase stays inside the
private maintainer boundary, preserves immutable validation runs, and does not
introduce new public routes or a new maintainer workflow surface.

</domain>

<spec_lock>
## Requirements (locked via SPEC.md)

**5 requirements are locked.** See `07-SPEC.md` for the full requirements,
boundaries, constraints, acceptance criteria, and ambiguity report.

Downstream agents MUST read `07-SPEC.md` before planning or implementing.
Requirements are not duplicated here.

</spec_lock>

<decisions>
## Implementation Decisions

### Bridge scope and persistence seam
- **D-01:** The bridge belongs behind the protected backend repository seam,
  not in browser code or a validation-only side channel.
- **D-02:** `StewardshipRepository` should gain a dedicated validation-history
  write helper, with matching in-memory and Supabase implementations exposed
  through the existing repository package and compatibility layer.
- **D-03:** The bridge runs only after a validation run reaches a terminal
  completed state; queued and processing runs stay inside `validation_runs`
  and do not write source-facing history rows.
- **D-04:** `validation_runs` remains immutable; source-facing history is
  append-only `source_validation_runs` rows.

### Canonical source mapping and idempotency
- **D-05:** `sourceSnapshotIds` must be resolved to canonical `source_id`
  values before persistence, and unresolved ids should fail the writeback
  rather than being silently skipped or aliased.
- **D-06:** Repeated snapshot ids that resolve to the same source should
  collapse to a single source-history row for that completed run.
- **D-07:** The bridge should use `validationRunId` plus `sourceId` as the
  idempotency boundary so retries do not double-write the same completed
  history entry.

### Source-facing outcome shape
- **D-08:** Terminal source-facing status should map into the existing
  `succeeded`, `warning`, `failed` vocabulary; `queued` stays reserved for
  in-flight or seeded history and is not emitted by this bridge. Map
  validation outcomes so `pass -> succeeded`, `weakSupport` or `refused ->
  warning`, and any `failed` or `error -> failed`.
- **D-09:** Terminal source rows should carry a short human-readable summary,
  while detailed counts and traceability data live in metadata.
- **D-10:** The browser should continue reading `latestValidationOutcome` and
  `validationHistory`; no browser-side synthesis of source evidence is added
  in this phase.

### Traceability and confirmation surfaces
- **D-11:** Persist validation-run, validation-set, and source-snapshot
  traceability metadata with each source history row, including the run id,
  set id, set name/version, source snapshot ids, counts, actor, and completion
  timestamp.
- **D-12:** Source detail remains the confirmation surface, and the
  validation workbench remains the canonical run launcher and run-level
  evidence surface.
- **D-13:** Same-screen refresh from the workbench back into source detail is
  a follow-up optimization, not a phase requirement.

### the agent's Discretion
- Exact helper names, file placement inside `backend/sources/repositories/`,
  and retry plumbing can be finalized in plan-phase as long as the repository
  seam and append-only source-history contract stay intact.
- Whether the writeback helper is surfaced as a small repository method or a
  thin repository wrapper is flexible if the same persistence contract is
  preserved.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Planning Core
- `.planning/ROADMAP.md` - Phase 7 goal placeholder, dependency on Phase 6,
  and roadmap status.
- `.planning/phases/GGOV-07-validation-evidence-bridge/07-SPEC.md` -
  locked WHAT/WHY requirements, boundaries, and acceptance criteria.
- `.planning/REQUIREMENTS.md` - `ADMIN-02` plus its acceptance signals for
  terminal source-facing validation history.
- `.planning/STATE.md` - milestone history and the note that Phase 7 was
  added.

### Prior Phase Context
- `.planning/phases/03-maintainer-readiness-hardening/03-CONTEXT.md` -
  readiness-first source drill-down and inline validation evidence decisions.
- `.planning/phases/05-admin-ux-polish-for-maintainers/05-CONTEXT.md` -
  private maintainer control-center direction and the validation evidence
  role in the console.
- `.planning/phases/06-maintainer-codebase-modularization/06-CONTEXT.md` -
  compatibility-layer and feature-owned module guidance for the maintainer
  and backend seams.

### Source Proposal and Architecture Maps
- `archive/docs/planning-artifacts/admin-side-validation-bridge-proposal.md`
  - source proposal that motivated the bridge.
- `.planning/codebase/ARCHITECTURE.md` - SPA-first frontend, protected Django
  maintainer boundary, and repository/DTO layering.
- `.planning/codebase/STACK.md` - React/Vite, Django, and Supabase boundary
  assumptions.
- `.planning/codebase/INTEGRATIONS.md` - `/api/admin/*`, Supabase REST/RPC,
  and service-role integration shape.
- `.planning/codebase/CONCERNS.md` - oversized repository seams and the
  fragile SPA/Django/Supabase boundary.

### Supabase Schema and Backend Seams
- `supabase/migrations/0010_create_stewardship_history.sql` -
  `source_validation_runs` schema, status vocabulary, and RLS.
- `supabase/migrations/0013_create_validation_workflow.sql` - immutable
  validation run schema and validation outcome vocabulary.
- `backend/sources/repositories/base.py` - `StewardshipRepository` protocol
  and `SourceSnapshot.validation_events`.
- `backend/sources/repositories/mappers.py` - source detail and inventory
  readback from validation events.
- `backend/sources/repositories/memory.py` - in-memory validation event
  storage for tests and local fallback.
- `backend/sources/repositories/supabase.py` - service-role readback from
  `source_validation_runs`.
- `backend/sources/repositories/__init__.py` - repository selection and
  runtime fallback wrappers.
- `backend/sources/dtos.py` - `latestValidationOutcome` and
  `validationHistory` DTO shape.
- `backend/validation/dtos.py` - validation run, result, and outcome
  vocabulary.
- `backend/validation/repository.py` - terminal run completion and
  `sourceSnapshotIds` handling.
- `backend/validation/views.py` and `backend/validation/services.py` -
  protected route and service seam for the run launcher.

### Frontend Read Paths
- `src/components/modules/MaintainerDashboard/shared/maintainerDashboardShared.tsx`
  - source validation evidence and validation summary UI.
- `src/components/modules/MaintainerDashboard/validation/ValidationWorkbench.tsx`
  - canonical validation run launcher and run-history view.
- `src/components/modules/MaintainerDashboard/hooks/useMaintainerDashboardData.ts`
  - protected mutation refresh pattern.
- `src/components/modules/MaintainerDashboard/sources/SourcePreviewRail.tsx`
  - source-level validation labels and detail readback.
- `src/components/modules/MaintainerDashboard/sources/SourceInventoryTable.tsx`
  - inventory-level validation labels and status pills.
- `src/components/modules/MaintainerDashboard/shared/formatters.ts` - current
  source-facing validation labels.
- `src/lib/maintainer/api.ts` - frontend DTO boundary for maintainer
  requests.

### Tests
- `backend/tests/test_admin_validation.py` - current coverage for immutable
  validation runs, result counts, and audit persistence.
- `backend/tests/test_admin_stewardship.py` - current coverage for source
  detail shape and empty validation history.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `backend/sources/repositories/base.py`: already models `validation_events`
  on source snapshots and is the natural seam for a validation write helper.
- `backend/sources/repositories/mappers.py`: already translates
  `validation_events` into `latestValidationOutcome` and `validationHistory`
  for source inventory/detail.
- `backend/sources/repositories/supabase.py` and
  `backend/sources/repositories/memory.py`: already read validation history,
  so they only need a writeback sibling to keep parity.
- `backend/validation/repository.py`: already owns validation run creation,
  completion, result persistence, and `sourceSnapshotIds`, so it can hand off
  terminal writeback after summarization.
- `src/components/modules/MaintainerDashboard/shared/maintainerDashboardShared.tsx`:
  already renders inline source validation evidence and validation run
  summaries.
- `src/components/modules/MaintainerDashboard/validation/ValidationWorkbench.tsx`:
  already launches runs and refreshes run history, making it the canonical
  user entry point for the bridge.
- `src/components/modules/MaintainerDashboard/hooks/useMaintainerDashboardData.ts`:
  already shows the protected mutation refresh pattern used elsewhere in the
  maintainer console.
- `src/components/modules/MaintainerDashboard/sources/SourcePreviewRail.tsx`
  and `src/components/modules/MaintainerDashboard/sources/SourceInventoryTable.tsx`:
  already consume source-facing validation labels without synthesizing history
  in the browser.

### Established Patterns
- Source detail is the confirmation surface; the validation workbench is the
  launch surface.
- Browser code reads source validation history, it does not manufacture it.
- Validation runs are immutable protected records, while source-facing
  history is a separate append-only view over those completed runs.
- Repository + DTO translation is the existing backend seam, with in-memory
  doubles already in place for tests.
- The maintainer UI already uses read-after-mutation refresh patterns for
  other source actions, so the bridge can follow that shape if the phase needs
  a UI refresh follow-up.

### Integration Points
- `StewardshipRepository` and `backend/sources/repositories/__init__.py` are
  the source-facing persistence seam that needs the new write helper.
- `backend/validation/repository.py` is the terminal completion path that
  should trigger the source-history writeback.
- `/api/admin/validation-runs` is the launcher path, and `/api/admin/sources/:id`
  is the readback path that should reflect the new history.
- `source_validation_runs` and `validation_runs` are the two tables that must
  stay distinct: one immutable run record, one source-facing evidence trail.
- `src/components/modules/MaintainerDashboard/shared/maintainerDashboardShared.tsx`
  and the source detail pages are the browser confirmation surfaces that will
  consume the persisted history.

</code_context>

<specifics>
## Specific Ideas

- Completed runs should write one terminal row per affected canonical source.
- Source id resolution should use canonical `source_id` values, not snapshot
  aliases.
- Source-facing status should stay in the existing four-value vocabulary:
  `queued`, `succeeded`, `warning`, `failed`, but the terminal bridge only
  emits `succeeded`, `warning`, or `failed`.
- `refused` belongs in the `warning` bucket for the source-facing trail unless
  a later phase explicitly broadens the status model.
- Traceability metadata should keep the validation run id, validation set
  identity, source snapshot ids, result counts, actor, and completion
  timestamp.
- The browser should still rely on `latestValidationOutcome` and
  `validationHistory`; no new client-side synthesis layer is needed for v1.
- A same-screen auto-refresh from the workbench into source detail is nice to
  have, but it is not required for the bridge to count as done.

</specifics>

<deferred>
## Deferred Ideas

- Same-screen auto-refresh from the workbench into source detail can be a
  future UX follow-up if the team wants the confirmation to feel immediate.
- Any broader redesign of maintainer navigation or a new validation summary
  surface belongs in a separate phase.

</deferred>

---

*Phase: 7-Validation Evidence Bridge*
*Context gathered: 2026-05-16 from discuss-phase auto analysis*
