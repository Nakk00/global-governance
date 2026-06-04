---
name: validation
description: "Skill for the Validation area of global-governance-docuweb. 60 symbols across 7 files."
---

# Validation

60 symbols | 7 files | Cohesion: 83%

## When to Use

- Working with code in `backend/`
- Understanding how seed_inflight_validation_run, list_validation_sets, list_validation_runs work
- Modifying validation-related functionality

## Key Files

| File | Symbols |
|------|---------|
| `backend/validation/repository.py` | list_sets, list_runs, get_run, seed_inflight_validation_run, list_validation_sets (+33) |
| `src/components/modules/MaintainerDashboard/validation/validation-remediation.ts` | reviewStatusForOutcome, destinationSurfaceForOutcome, nextActionForOutcome, followUpForOutcome, formatSourceContextLabel (+1) |
| `src/components/modules/MaintainerDashboard/shared/maintainerDashboardShared.tsx` | ValidationWorkbench, ValidationSummary, ValidationRunHistory, validationStatusLabel, ValidationAlert |
| `backend/tests/test_admin_validation.py` | test_duplicate_in_flight_launch_returns_safe_conflict, test_result_row_preserves_zero_support_score, setUp |
| `src/components/modules/MaintainerDashboard/validation/ValidationRemediationQueue.tsx` | DetailTerm, RemediationAction, ValidationRemediationQueue |
| `src/components/modules/MaintainerDashboard/validation/ValidationWorkbench.tsx` | ValidationSummary, DetailTerm, ValidationWorkbench |
| `backend/validation/dtos.py` | ValidationRunSummaryDto, ValidationRunDetailDto |

## Entry Points

Start here when exploring this area:

- **`seed_inflight_validation_run`** (Function) — `backend/validation/repository.py:596`
- **`list_validation_sets`** (Function) — `backend/validation/repository.py:603`
- **`list_validation_runs`** (Function) — `backend/validation/repository.py:613`
- **`get_validation_run`** (Function) — `backend/validation/repository.py:623`
- **`launch_validation_run`** (Function) — `backend/validation/repository.py:633`

## Key Symbols

| Symbol | Type | File | Line |
|--------|------|------|------|
| `ValidationRunSummaryDto` | Class | `backend/validation/dtos.py` | 51 |
| `ValidationRunDetailDto` | Class | `backend/validation/dtos.py` | 77 |
| `seed_inflight_validation_run` | Function | `backend/validation/repository.py` | 596 |
| `list_validation_sets` | Function | `backend/validation/repository.py` | 603 |
| `list_validation_runs` | Function | `backend/validation/repository.py` | 613 |
| `get_validation_run` | Function | `backend/validation/repository.py` | 623 |
| `launch_validation_run` | Function | `backend/validation/repository.py` | 633 |
| `buildValidationRemediationItems` | Function | `src/components/modules/MaintainerDashboard/validation/validation-remediation.ts` | 107 |
| `ValidationRemediationQueue` | Function | `src/components/modules/MaintainerDashboard/validation/ValidationRemediationQueue.tsx` | 56 |
| `ValidationSummary` | Function | `src/components/modules/MaintainerDashboard/validation/ValidationWorkbench.tsx` | 56 |
| `ValidationWorkbench` | Function | `src/components/modules/MaintainerDashboard/validation/ValidationWorkbench.tsx` | 192 |
| `ValidationWorkbench` | Function | `src/components/modules/MaintainerDashboard/shared/maintainerDashboardShared.tsx` | 1089 |
| `reset_validation_state` | Function | `backend/validation/repository.py` | 590 |
| `list_sets` | Method | `backend/validation/repository.py` | 122 |
| `list_runs` | Method | `backend/validation/repository.py` | 132 |
| `get_run` | Method | `backend/validation/repository.py` | 137 |
| `test_duplicate_in_flight_launch_returns_safe_conflict` | Method | `backend/tests/test_admin_validation.py` | 80 |
| `launch_run` | Method | `backend/validation/repository.py` | 140 |
| `seed_inflight` | Method | `backend/validation/repository.py` | 205 |
| `launch_run` | Method | `backend/validation/repository.py` | 301 |

## Execution Flows

| Flow | Type | Steps |
|------|------|-------|
| `ValidationWorkbench → IsApiEnvelope` | cross_community | 6 |
| `ValidationWorkbench → ClearSupabaseSession` | cross_community | 5 |
| `ValidationWorkbench → MaintainerApiError` | cross_community | 5 |
| `ValidationWorkbench → ClearSupabaseSession` | cross_community | 5 |
| `ValidationWorkbench → MaintainerApiError` | cross_community | 5 |
| `Launch_validation_run → _now` | cross_community | 4 |
| `Launch_validation_run → _answer_preview` | cross_community | 4 |
| `ValidationRemediationQueue → Cn` | cross_community | 4 |
| `Launch_run → _request` | cross_community | 3 |
| `ValidationWorkbench → ValidationAlertForRun` | cross_community | 3 |

## Connected Areas

| Area | Connections |
|------|-------------|
| Public-homepage-redesign | 7 calls |
| Maintainer | 4 calls |
| Ui | 3 calls |
| MaintainerDashboard | 2 calls |
| Tests | 1 calls |

## How to Explore

1. `gitnexus_context({name: "seed_inflight_validation_run"})` — see callers and callees
2. `gitnexus_query({query: "validation"})` — find related execution flows
3. Read key files listed above for implementation details
