# Phase 7: Validation Evidence Bridge - Specification

**Created:** 2026-05-16
**Ambiguity score:** 0.06 (gate: <= 0.20)
**Requirements:** 5 locked

## Goal

Completed validation runs write canonical source-facing evidence rows so source detail and inventory reflect terminal validation outcomes for each affected source without browser-side synthesis.

## Background

Today, `backend/validation/repository.py` already creates immutable validation runs, results, and audit events, and `backend/sources/repositories/mappers.py` already reads `source_validation_runs` into `latestValidationOutcome` and `validationHistory` for source detail and inventory views. The missing piece is the writeback bridge from terminal validation completion into `source_validation_runs` rows for each affected canonical source. The validation workbench is already the canonical run launcher and run-level evidence surface, and source detail is already the confirmation surface.

## Requirements

1. **Terminal source writeback**: A completed validation run writes one `source_validation_runs` row per affected canonical source.
   - Current: Validation completion persists immutable `validation_runs`, `validation_results`, and `validation_audit_events`, but no source-facing validation history rows are written.
   - Target: When a validation run reaches terminal completed state, the backend writes one source history row for each affected canonical source.
   - Acceptance: A completed demo readiness run produces one `source_validation_runs` row per unique canonical source referenced by the run, and no source history row exists before the run completes.

2. **Canonical source resolution**: Validation snapshot ids resolve to canonical `source_id` values before source history is persisted.
   - Current: Validation runs store `sourceSnapshotIds`, while source history rows are keyed by `source_id`.
   - Target: The bridge maps every `sourceSnapshotId` to a canonical `source_id`, collapses duplicate aliases to a single source entry, and fails writeback when an id cannot be resolved.
   - Acceptance: A run with duplicate snapshot aliases creates no duplicate source history rows, and an unresolved snapshot id causes writeback to fail without inserting partial source history rows.

3. **Terminal outcome mapping**: Source-facing history rows use the existing terminal source status vocabulary and derive status from the completed validation run.
   - Current: Validation results use question-level outcomes (`pass`, `weakSupport`, `refused`, `failed`, `error`), while source-facing history uses `succeeded`, `warning`, `failed`, and `queued`.
   - Target: The bridge assigns terminal source-facing status deterministically: any `failed` or `error` result maps the source row to `failed`; otherwise, any `weakSupport` or `refused` result maps the source row to `warning`; otherwise the source row is `succeeded`.
   - Acceptance: A completed run with only `pass` results writes source rows labeled `succeeded`; a run with `weakSupport` or `refused` but no `failed` or `error` writes `warning`; a run with any `failed` or `error` writes `failed`.

4. **Traceability metadata**: Each persisted source history row carries run, set, source, and completion traceability fields.
   - Current: `source_validation_runs` has a generic `metadata` payload, but the phase does not yet require a fixed writeback shape.
   - Target: Each source history row includes the validation run id, validation set id, validation set name, validation set version, canonical `source_id`, original `sourceSnapshotIds`, result counts, actor, completion timestamp, and a short summary.
   - Acceptance: Readback from `source_validation_runs` exposes those metadata fields for a completed run, and source detail/history tests can assert them without reconstructing information from validation run detail.

5. **Server-driven readback**: Source detail and inventory continue to render validation state from backend-provided fields, not browser-side synthesis.
   - Current: Source detail and inventory already read `latestValidationOutcome` and `validationHistory` from backend DTOs, and the validation workbench remains the canonical launcher and run-level evidence surface.
   - Target: The bridge keeps source validation evidence server-driven, so source detail and inventory continue to show validation state from persisted backend history.
   - Acceptance: After a completed validation run, source detail and inventory display the expected backend-derived validation labels and history entries without any client-side reconstruction of source validation history.

## Boundaries

**In scope:**
- Backend writeback from completed validation runs into `source_validation_runs`
- Canonical `sourceSnapshotIds -> source_id` resolution and deduplication
- Terminal source-facing status derivation and traceability metadata
- Backend readback that keeps source detail and inventory server-driven

**Out of scope:**
- Changing validation question sets or the validation evaluation logic - those belong to the validation workflow itself, not the evidence bridge
- Adding new maintainer navigation surfaces or a separate confirmation page - source detail and the workbench already cover confirmation
- Introducing a new source status model beyond the existing terminal vocabulary - the phase should fit the current inventory/status contract
- Public chat, learner-facing routes, or non-maintainer product surfaces - this phase stays inside the private maintainer boundary

## Constraints

- `validation_runs` remains immutable; the bridge must not repurpose it as the source-facing evidence store.
- `source_validation_runs` remains the append-only source-facing evidence table and must stay service-role only.
- The bridge must stay behind the protected backend repository/service seams; no browser-side writeback is allowed.
- The source-facing terminal status vocabulary remains `succeeded`, `warning`, and `failed`; `queued` stays reserved for seeded or in-flight history and is not emitted by this phase.
- The validation workbench remains the canonical run launcher and run-level evidence surface.

## Acceptance Criteria

- [ ] A completed validation run writes exactly one `source_validation_runs` row per unique canonical source affected by the run.
- [ ] No `source_validation_runs` row is written before validation completion.
- [ ] Source history rows include the required traceability metadata fields for run id, set id, set name, set version, canonical source id, sourceSnapshotIds, result counts, actor, completion timestamp, and summary.
- [ ] The terminal source-facing outcome mapping is deterministic and matches the phase rules for `succeeded`, `warning`, and `failed`.
- [ ] Source detail and inventory continue to render validation state from backend-provided `latestValidationOutcome` and `validationHistory` fields without client-side synthesis.
- [ ] `validation_runs` remains immutable and separate from source-facing history storage.

## Ambiguity Report

| Dimension          | Score | Min  | Status | Notes |
|--------------------|-------|------|--------|-------|
| Goal Clarity       | 0.96  | 0.75 | ✓      | Phase goal is terminal source evidence writeback. |
| Boundary Clarity   | 0.95  | 0.70 | ✓      | In-scope and out-of-scope items are explicit. |
| Constraint Clarity | 0.90  | 0.65 | ✓      | Persistence seam, immutability, and status vocabulary are locked. |
| Acceptance Criteria | 0.92  | 0.70 | ✓      | Acceptance checks are concrete and pass/fail. |
| **Ambiguity**      | 0.06  | <=0.20| ✓      | Enough clarity for planning without more WHAT/WHY questions. |

Status: ✓ = met minimum, ⚠ = below minimum (planner treats as assumption)

## Interview Log

| Round | Perspective | Question summary | Decision locked |
|-------|-------------|------------------|-----------------|
| 0 | Auto gate | Initial clarity check from roadmap, requirements, and captured phase context | No interview rounds were needed; the phase was already clear enough to lock requirements directly. |

[--auto] Requirements were sufficiently clear from the roadmap, requirements, state, and Phase 7 context, so the spec was generated directly.

---

*Phase: 07-validation-evidence-bridge*
*Spec created: 2026-05-16*
*Next step: $gsd-discuss-phase 7 --auto - implementation decisions (how to build what's specified above)*
