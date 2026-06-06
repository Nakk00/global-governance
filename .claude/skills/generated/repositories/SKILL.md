---
name: repositories
description: "Skill for the Repositories area of global-governance-docuweb. 112 symbols across 8 files."
---

# Repositories

112 symbols | 8 files | Cohesion: 78%

## When to Use

- Working with code in `backend/`
- Understanding how validate_ingest_request, validate_source_metadata, lifecycle_event_type work
- Modifying repositories-related functionality

## Key Files

| File | Symbols |
|------|---------|
| `backend/sources/repositories/supabase.py` | update_source_metadata, transition_source, dispatch_ingest, _mutation_result_from_record, _ensure_persisted_snapshot (+25) |
| `backend/sources/repositories/mappers.py` | document_from_row, citation_from_row, mutation_result, inspection_anchor, inspection_state (+22) |
| `backend/sources/repositories/memory.py` | get_dashboard, upload_source, update_source_metadata, transition_source, dispatch_ingest (+14) |
| `backend/sources/repositories/__init__.py` | _repository, _runtime_fallback_repository, _with_runtime_fallback, _should_use_runtime_fallback, get_stewardship_dashboard (+10) |
| `backend/sources/repositories/mutations.py` | validate_ingest_request, validate_source_metadata, lifecycle_event_type, clean_text, clean_list (+6) |
| `backend/sources/repositories/storage.py` | quoted_csv, build_storage_path, sanitize_filename, content_type_for_name, read_uploaded_bytes |
| `backend/tests/test_admin_stewardship.py` | test_ingest_job_moves_through_processing_before_success, runner, test_failed_ingest_is_retryable_and_blocks_activation, setUp |
| `backend/sources/repositories/seeds.py` | source_from_seed |

## Entry Points

Start here when exploring this area:

- **`validate_ingest_request`** (Function) — `backend/sources/repositories/mutations.py:42`
- **`validate_source_metadata`** (Function) — `backend/sources/repositories/mutations.py:69`
- **`lifecycle_event_type`** (Function) — `backend/sources/repositories/mutations.py:154`
- **`clean_text`** (Function) — `backend/sources/repositories/mutations.py:164`
- **`clean_list`** (Function) — `backend/sources/repositories/mutations.py:168`

## Key Symbols

| Symbol | Type | File | Line |
|--------|------|------|------|
| `validate_ingest_request` | Function | `backend/sources/repositories/mutations.py` | 42 |
| `validate_source_metadata` | Function | `backend/sources/repositories/mutations.py` | 69 |
| `lifecycle_event_type` | Function | `backend/sources/repositories/mutations.py` | 154 |
| `clean_text` | Function | `backend/sources/repositories/mutations.py` | 164 |
| `clean_list` | Function | `backend/sources/repositories/mutations.py` | 168 |
| `clean_source_id` | Function | `backend/sources/repositories/mutations.py` | 176 |
| `now` | Function | `backend/sources/repositories/mutations.py` | 183 |
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
| `get_stewardship_dashboard` | Function | `backend/sources/repositories/__init__.py` | 79 |
| `get_source_detail` | Function | `backend/sources/repositories/__init__.py` | 83 |
| `get_source_chunks` | Function | `backend/sources/repositories/__init__.py` | 87 |

## Execution Flows

| Flow | Type | Steps |
|------|------|-------|
| `Dispatch_ingest → _normalized_path` | cross_community | 7 |
| `Dispatch_ingest → _required_string` | cross_community | 7 |
| `Dispatch_ingest → _resolve_approved_path` | cross_community | 7 |
| `Dispatch_ingest → _required_mapping` | cross_community | 7 |
| `Dispatch_ingest → _request` | cross_community | 6 |
| `Dispatch_ingest → Clean_list` | cross_community | 6 |
| `Dispatch_ingest → Event_from_row` | cross_community | 6 |
| `Dispatch_ingest → _validate_manifest_entries` | cross_community | 6 |
| `Dispatch_ingest → Normalize_source_text` | cross_community | 6 |
| `Dispatch_ingest → Extract_source_text` | cross_community | 6 |

## Connected Areas

| Area | Connections |
|------|-------------|
| Tests | 1 calls |

## How to Explore

1. `gitnexus_context({name: "validate_ingest_request"})` — see callers and callees
2. `gitnexus_query({query: "repositories"})` — find related execution flows
3. Read key files listed above for implementation details
