---
name: validation
description: "Skill for the Validation area of global-governance-docuweb. 45 symbols across 3 files."
---

# Validation

45 symbols | 3 files | Cohesion: 89%

## When to Use

- Working with code in `backend/`
- Understanding how seed_inflight_validation_run, list_validation_sets, list_validation_runs work
- Modifying validation-related functionality

## Key Files

| File | Symbols |
|------|---------|
| `backend/validation/repository.py` | launch_run, seed_inflight, _has_inflight_run, launch_run, _create_audit_event (+32) |
| `backend/validation/views.py` | validation_sets, validation_runs, validation_run_detail, launch_run, _guard_request (+1) |
| `backend/validation/dtos.py` | ValidationRunSummaryDto, ValidationRunDetailDto |

## Entry Points

Start here when exploring this area:

- **`seed_inflight_validation_run`** (Function) — `backend/validation/repository.py:595`
- **`list_validation_sets`** (Function) — `backend/validation/repository.py:602`
- **`list_validation_runs`** (Function) — `backend/validation/repository.py:612`
- **`get_validation_run`** (Function) — `backend/validation/repository.py:622`
- **`launch_validation_run`** (Function) — `backend/validation/repository.py:632`

## Key Symbols

| Symbol | Type | File | Line |
|--------|------|------|------|
| `ValidationRunSummaryDto` | Class | `backend/validation/dtos.py` | 51 |
| `ValidationRunDetailDto` | Class | `backend/validation/dtos.py` | 77 |
| `seed_inflight_validation_run` | Function | `backend/validation/repository.py` | 595 |
| `list_validation_sets` | Function | `backend/validation/repository.py` | 602 |
| `list_validation_runs` | Function | `backend/validation/repository.py` | 612 |
| `get_validation_run` | Function | `backend/validation/repository.py` | 622 |
| `launch_validation_run` | Function | `backend/validation/repository.py` | 632 |
| `validation_sets` | Function | `backend/validation/views.py` | 15 |
| `validation_runs` | Function | `backend/validation/views.py` | 23 |
| `validation_run_detail` | Function | `backend/validation/views.py` | 33 |
| `launch_run` | Function | `backend/validation/views.py` | 48 |
| `launch_run` | Method | `backend/validation/repository.py` | 140 |
| `seed_inflight` | Method | `backend/validation/repository.py` | 205 |
| `launch_run` | Method | `backend/validation/repository.py` | 301 |
| `list_sets` | Method | `backend/validation/repository.py` | 122 |
| `list_runs` | Method | `backend/validation/repository.py` | 132 |
| `get_run` | Method | `backend/validation/repository.py` | 137 |
| `list_sets` | Method | `backend/validation/repository.py` | 246 |
| `list_runs` | Method | `backend/validation/repository.py` | 270 |
| `get_run` | Method | `backend/validation/repository.py` | 282 |

## Execution Flows

| Flow | Type | Steps |
|------|------|-------|
| `Launch_validation_run → _now` | cross_community | 4 |
| `Launch_validation_run → _answer_preview` | cross_community | 4 |
| `Launch_run → _request` | cross_community | 3 |
| `Validation_runs → _authorize_mutation` | intra_community | 3 |
| `List_validation_sets → _set_dto` | intra_community | 3 |
| `List_validation_runs → _run_summary` | intra_community | 3 |
| `Launch_validation_run → _has_inflight_run` | cross_community | 3 |
| `Get_run → _request` | intra_community | 3 |
| `Get_run → _result_from_row` | intra_community | 3 |

## How to Explore

1. `gitnexus_context({name: "seed_inflight_validation_run"})` — see callers and callees
2. `gitnexus_query({query: "validation"})` — find related execution flows
3. Read key files listed above for implementation details
