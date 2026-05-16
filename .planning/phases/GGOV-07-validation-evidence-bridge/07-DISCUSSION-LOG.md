# Phase 7: Validation Evidence Bridge - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md - this log preserves the alternatives considered.

**Date:** 2026-05-16
**Phase:** 07-validation-evidence-bridge
**Areas discussed:** Bridge scope and persistence seam, Canonical source mapping and idempotency, Source-facing outcome shape, Traceability and confirmation surfaces

---

## Bridge scope and persistence seam

| Option | Description | Selected |
|--------|-------------|----------|
| Repository write helper at terminal completion | Extend `StewardshipRepository` and write only after completed runs. | ✓ |
| Validation-only side channel | Add writeback inside the validation repository only. | |
| Browser-side synthesis | Update the UI history from run results without backend persistence. | |

**User's choice:** Auto-selected recommended default.
**Notes:** The source detail surface already reads persisted validation history, so the bridge should stay server-owned and land behind the existing repository seam.

---

## Canonical source mapping and idempotency

| Option | Description | Selected |
|--------|-------------|----------|
| Canonical source id with idempotent retry | Resolve `sourceSnapshotIds`, dedupe repeats, and no-op retries. | ✓ |
| Keep snapshot ids as-is | Persist snapshot ids directly and let source detail resolve later. | |
| Best-effort partial writes | Skip unresolved ids and continue writing the rest. | |

**User's choice:** Auto-selected recommended default.
**Notes:** Canonical ids prevent drift between source detail and the validation workbench, and retries should be safe rather than duplicating source history.

---

## Source-facing outcome shape

| Option | Description | Selected |
|--------|-------------|----------|
| Pass/warning/fail mapping | Map `pass` -> succeeded, `weakSupport`/`refused` -> warning, `failed`/`error` -> failed. | ✓ |
| Reflect question outcomes directly | Try to store question-level validation outcomes in source history. | |
| Add a new source status | Expand the source model with a refused/partial status. | |

**User's choice:** Auto-selected recommended default.
**Notes:** The source DTO vocabulary is already fixed, so the bridge should fit the existing inventory labels instead of widening the model.

---

## Traceability and confirmation surfaces

| Option | Description | Selected |
|--------|-------------|----------|
| Backend metadata only, no UI change | Store validation metadata on the source row and keep current UI read paths. | ✓ |
| Add same-screen refresh | Make the workbench auto-refresh source detail after a launch. | |
| Add a new confirmation page | Introduce a separate bridge result screen. | |

**User's choice:** Auto-selected recommended default.
**Notes:** The existing source detail and validation workbench already cover confirmation, so this phase can stay backend-first and leave same-screen refresh for later.

---

## the agent's Discretion

- Exact helper names, file placement, and retry plumbing can be finalized in
  plan-phase as long as the repository seam and append-only source-history
  contract stay intact.

## Deferred Ideas

- Same-screen auto-refresh from the workbench into source detail is a future
  UX follow-up, not a requirement for this phase.
