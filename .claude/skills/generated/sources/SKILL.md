---
name: sources
description: "Skill for the Sources area of global-governance-docuweb. 64 symbols across 14 files."
---

# Sources

64 symbols | 14 files | Cohesion: 95%

## When to Use

- Working with code in `backend/`
- Understanding how validation_sets, validation_runs, validation_run_detail work
- Modifying sources-related functionality

## Key Files

| File | Symbols |
|------|---------|
| `backend/sources/views.py` | dashboard, source_detail, source_chunks, source_citations, chunk_detail (+15) |
| `backend/validation/views.py` | validation_sets, validation_runs, validation_run_detail, launch_run, _guard_request (+1) |
| `backend/config/api.py` | method_not_allowed_response, bootstrap_health, reserved_chat, reserved_admin, not_found (+1) |
| `backend/sources/dtos.py` | SourceInventoryItemDto, SourceDetailDto, ChunkRowDto, ChunkDetailDto, CitationRowDto (+1) |
| `backend/common/validation.py` | to_response, require_json_content_type, validate_request_size, validate_json_object |
| `backend/sources/services.py` | get_stewardship_dashboard, list_ingestion_runs, list_validation_runs, list_audit_events |
| `backend/tests/test_request_validation.py` | test_rejects_wrong_content_type, test_rejects_oversized_body, test_rejects_malformed_json_object |
| `backend/common/responses.py` | success_envelope, success_response, error_response |
| `src/components/modules/MaintainerDashboard/sources/SourcesPage.tsx` | SourcesPage, SourcesKpiRow, PresetBanner |
| `backend/accounts/views.py` | admin_me, _has_unexpected_body |

## Entry Points

Start here when exploring this area:

- **`validation_sets`** (Function) — `backend/validation/views.py:15`
- **`validation_runs`** (Function) — `backend/validation/views.py:23`
- **`validation_run_detail`** (Function) — `backend/validation/views.py:33`
- **`launch_run`** (Function) — `backend/validation/views.py:48`
- **`dashboard`** (Function) — `backend/sources/views.py:16`

## Key Symbols

| Symbol | Type | File | Line |
|--------|------|------|------|
| `SourceInventoryItemDto` | Class | `backend/sources/dtos.py` | 34 |
| `SourceDetailDto` | Class | `backend/sources/dtos.py` | 48 |
| `ChunkRowDto` | Class | `backend/sources/dtos.py` | 130 |
| `ChunkDetailDto` | Class | `backend/sources/dtos.py` | 144 |
| `CitationRowDto` | Class | `backend/sources/dtos.py` | 151 |
| `CitationDetailDto` | Class | `backend/sources/dtos.py` | 164 |
| `validation_sets` | Function | `backend/validation/views.py` | 15 |
| `validation_runs` | Function | `backend/validation/views.py` | 23 |
| `validation_run_detail` | Function | `backend/validation/views.py` | 33 |
| `launch_run` | Function | `backend/validation/views.py` | 48 |
| `dashboard` | Function | `backend/sources/views.py` | 16 |
| `source_detail` | Function | `backend/sources/views.py` | 27 |
| `source_chunks` | Function | `backend/sources/views.py` | 48 |
| `source_citations` | Function | `backend/sources/views.py` | 66 |
| `chunk_detail` | Function | `backend/sources/views.py` | 84 |
| `citation_detail` | Function | `backend/sources/views.py` | 102 |
| `ingestion_runs` | Function | `backend/sources/views.py` | 120 |
| `validation_runs` | Function | `backend/sources/views.py` | 131 |
| `audit_events` | Function | `backend/sources/views.py` | 142 |
| `source_upload` | Function | `backend/sources/views.py` | 154 |

## Execution Flows

| Flow | Type | Steps |
|------|------|-------|
| `Source_detail → Error_envelope` | cross_community | 5 |
| `Source_detail → Parse_bearer_token` | intra_community | 5 |
| `Source_detail → Get_supabase_jwt_verifier` | intra_community | 5 |
| `Source_detail → Get_admin_profile_repository` | cross_community | 5 |
| `Validation_runs → Error_envelope` | cross_community | 5 |
| `Validation_runs → Parse_bearer_token` | intra_community | 5 |
| `Validation_runs → Get_supabase_jwt_verifier` | intra_community | 5 |
| `Source_activate → Error_envelope` | cross_community | 5 |
| `Source_activate → Parse_bearer_token` | cross_community | 5 |
| `Source_activate → Get_supabase_jwt_verifier` | cross_community | 5 |

## Connected Areas

| Area | Connections |
|------|-------------|
| Tests | 1 calls |
| Accounts | 1 calls |
| Overview | 1 calls |
| Public-homepage-redesign | 1 calls |

## How to Explore

1. `gitnexus_context({name: "validation_sets"})` — see callers and callees
2. `gitnexus_query({query: "sources"})` — find related execution flows
3. Read key files listed above for implementation details
