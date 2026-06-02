---
name: repositories
description: "Skill for the Repositories area of global-governance-docuweb. 109 symbols across 8 files."
---

# Repositories

109 symbols | 8 files | Cohesion: 81%

## When to Use

- Working with code in `backend/`
- Understanding how validate_transition, validate_ingest_request, validate_source_metadata work
- Modifying repositories-related functionality

## Key Files

| File | Symbols |
|------|---------|
| `backend/sources/repositories/supabase.py` | update_source_metadata, transition_source, dispatch_ingest, _mutation_result_from_record, _ensure_persisted_snapshot (+25) |
| `backend/sources/repositories/mappers.py` | document_from_row, citation_from_row, mutation_result, inspection_anchor, inspection_state (+22) |
| `backend/sources/repositories/memory.py` | get_dashboard, upload_source, update_source_metadata, transition_source, dispatch_ingest (+14) |
| `backend/sources/repositories/__init__.py` | _repository, _runtime_fallback_repository, _with_runtime_fallback, _should_use_runtime_fallback, get_stewardship_dashboard (+10) |
| `backend/sources/repositories/mutations.py` | validate_transition, validate_ingest_request, validate_source_metadata, lifecycle_event_type, clean_text (+6) |
| `backend/sources/repositories/storage.py` | quoted_csv, build_storage_path, sanitize_filename, content_type_for_name, read_uploaded_bytes |
| `backend/sources/repositories/seeds.py` | source_from_seed |
| `backend/tests/test_admin_stewardship.py` | setUp |

## Entry Points

Start here when exploring this area:

- **`validate_transition`** (Function) — `backend/sources/repositories/mutations.py:20`
- **`validate_ingest_request`** (Function) — `backend/sources/repositories/mutations.py:42`
- **`validate_source_metadata`** (Function) — `backend/sources/repositories/mutations.py:66`
- **`lifecycle_event_type`** (Function) — `backend/sources/repositories/mutations.py:151`
- **`clean_text`** (Function) — `backend/sources/repositories/mutations.py:161`

## Key Symbols

| Symbol | Type | File | Line |
|--------|------|------|------|
| `validate_transition` | Function | `backend/sources/repositories/mutations.py` | 20 |
| `validate_ingest_request` | Function | `backend/sources/repositories/mutations.py` | 42 |
| `validate_source_metadata` | Function | `backend/sources/repositories/mutations.py` | 66 |
| `lifecycle_event_type` | Function | `backend/sources/repositories/mutations.py` | 151 |
| `clean_text` | Function | `backend/sources/repositories/mutations.py` | 161 |
| `clean_list` | Function | `backend/sources/repositories/mutations.py` | 165 |
| `clean_source_id` | Function | `backend/sources/repositories/mutations.py` | 173 |
| `now` | Function | `backend/sources/repositories/mutations.py` | 180 |
| `document_from_row` | Function | `backend/sources/repositories/mappers.py` | 46 |
| `citation_from_row` | Function | `backend/sources/repositories/mappers.py` | 73 |
| `mutation_result` | Function | `backend/sources/repositories/mappers.py` | 87 |
| `quoted_csv` | Function | `backend/sources/repositories/storage.py` | 35 |
| `inspection_anchor` | Function | `backend/sources/repositories/mappers.py` | 197 |
| `inspection_state` | Function | `backend/sources/repositories/mappers.py` | 223 |
| `inspection_partial_data` | Function | `backend/sources/repositories/mappers.py` | 254 |
| `inspection_next_step` | Function | `backend/sources/repositories/mappers.py` | 284 |
| `chunk_row` | Function | `backend/sources/repositories/mappers.py` | 299 |
| `citation_row` | Function | `backend/sources/repositories/mappers.py` | 315 |
| `get_stewardship_dashboard` | Function | `backend/sources/repositories/__init__.py` | 76 |
| `get_source_detail` | Function | `backend/sources/repositories/__init__.py` | 80 |

## Execution Flows

| Flow | Type | Steps |
|------|------|-------|
| `Dispatch_ingest → _request` | cross_community | 6 |
| `Dispatch_ingest → Clean_list` | cross_community | 6 |
| `Dispatch_ingest → Event_from_row` | cross_community | 6 |
| `Get_source_citations → _request` | cross_community | 5 |
| `Get_source_citations → Clean_list` | cross_community | 5 |
| `Get_source_citations → Event_from_row` | cross_community | 5 |
| `Get_citation_detail → _request` | cross_community | 5 |
| `Get_citation_detail → Clean_list` | cross_community | 5 |
| `Get_source_chunks → _request` | cross_community | 5 |
| `Get_source_chunks → Clean_list` | cross_community | 5 |

## How to Explore

1. `gitnexus_context({name: "validate_transition"})` — see callers and callees
2. `gitnexus_query({query: "repositories"})` — find related execution flows
3. Read key files listed above for implementation details
