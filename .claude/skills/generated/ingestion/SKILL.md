---
name: ingestion
description: "Skill for the Ingestion area of global-governance-docuweb. 42 symbols across 5 files."
---

# Ingestion

42 symbols | 5 files | Cohesion: 79%

## When to Use

- Working with code in `backend/`
- Understanding how test_pipeline_extracts_normalizes_chunks_checksums_and_provider_vectors, test_pipeline_requires_a_real_embedding_adapter_outside_dry_run, test_pipeline_supports_explicit_synthetic_vectors_only_for_dry_run work
- Modifying ingestion-related functionality

## Key Files

| File | Symbols |
|------|---------|
| `backend/ingestion/repository.py` | persist, _upload_private_source, _validate_payload_for_persistence, _result, _content_type (+10) |
| `backend/ingestion/pipeline.py` | prepare_ingestion, extract_source_text, normalize_source_text, chunk_source_text, _embed_passages (+9) |
| `backend/tests/test_ingestion_pipeline.py` | test_pipeline_extracts_normalizes_chunks_checksums_and_provider_vectors, test_pipeline_requires_a_real_embedding_adapter_outside_dry_run, test_pipeline_supports_explicit_synthetic_vectors_only_for_dry_run, test_pipeline_rejects_empty_markdown_and_malformed_pdf, test_pipeline_extracts_pdf_pages_through_the_pdf_reader (+3) |
| `backend/tests/test_ingestion_repository.py` | test_supabase_repository_uploads_private_source_and_uses_atomic_rpc, test_supabase_repository_rejects_rpc_without_complete_vector_evidence, test_supabase_repository_removes_new_private_object_when_rpc_fails, test_supabase_repository_treats_local_storage_wrapped_404_as_missing |
| `backend/ingestion/dtos.py` | embed_passages |

## Entry Points

Start here when exploring this area:

- **`test_pipeline_extracts_normalizes_chunks_checksums_and_provider_vectors`** (Function) — `backend/tests/test_ingestion_pipeline.py:42`
- **`test_pipeline_requires_a_real_embedding_adapter_outside_dry_run`** (Function) — `backend/tests/test_ingestion_pipeline.py:74`
- **`test_pipeline_supports_explicit_synthetic_vectors_only_for_dry_run`** (Function) — `backend/tests/test_ingestion_pipeline.py:87`
- **`test_pipeline_rejects_empty_markdown_and_malformed_pdf`** (Function) — `backend/tests/test_ingestion_pipeline.py:106`
- **`test_pipeline_extracts_pdf_pages_through_the_pdf_reader`** (Function) — `backend/tests/test_ingestion_pipeline.py:118`

## Key Symbols

| Symbol | Type | File | Line |
|--------|------|------|------|
| `test_pipeline_extracts_normalizes_chunks_checksums_and_provider_vectors` | Function | `backend/tests/test_ingestion_pipeline.py` | 42 |
| `test_pipeline_requires_a_real_embedding_adapter_outside_dry_run` | Function | `backend/tests/test_ingestion_pipeline.py` | 74 |
| `test_pipeline_supports_explicit_synthetic_vectors_only_for_dry_run` | Function | `backend/tests/test_ingestion_pipeline.py` | 87 |
| `test_pipeline_rejects_empty_markdown_and_malformed_pdf` | Function | `backend/tests/test_ingestion_pipeline.py` | 106 |
| `test_pipeline_extracts_pdf_pages_through_the_pdf_reader` | Function | `backend/tests/test_ingestion_pipeline.py` | 118 |
| `test_pipeline_rejects_invalid_chunk_and_embedding_shapes` | Function | `backend/tests/test_ingestion_pipeline.py` | 134 |
| `test_normalization_is_stable_and_removes_excess_blank_lines` | Function | `backend/tests/test_ingestion_pipeline.py` | 160 |
| `prepare_ingestion` | Function | `backend/ingestion/pipeline.py` | 71 |
| `extract_source_text` | Function | `backend/ingestion/pipeline.py` | 169 |
| `normalize_source_text` | Function | `backend/ingestion/pipeline.py` | 186 |
| `chunk_source_text` | Function | `backend/ingestion/pipeline.py` | 194 |
| `test_supabase_repository_uploads_private_source_and_uses_atomic_rpc` | Function | `backend/tests/test_ingestion_repository.py` | 94 |
| `test_supabase_repository_rejects_rpc_without_complete_vector_evidence` | Function | `backend/tests/test_ingestion_repository.py` | 122 |
| `test_supabase_repository_removes_new_private_object_when_rpc_fails` | Function | `backend/tests/test_ingestion_repository.py` | 144 |
| `test_supabase_repository_treats_local_storage_wrapped_404_as_missing` | Function | `backend/tests/test_ingestion_repository.py` | 167 |
| `embed_passages` | Method | `backend/ingestion/dtos.py` | 51 |
| `persist` | Method | `backend/ingestion/repository.py` | 125 |
| `read_private_source` | Method | `backend/ingestion/repository.py` | 151 |
| `_entry` | Function | `backend/tests/test_ingestion_pipeline.py` | 255 |
| `_embed_passages` | Function | `backend/ingestion/pipeline.py` | 291 |

## Execution Flows

| Flow | Type | Steps |
|------|------|-------|
| `Dispatch_ingest → _normalized_path` | cross_community | 7 |
| `Dispatch_ingest → _required_string` | cross_community | 7 |
| `Dispatch_ingest → _resolve_approved_path` | cross_community | 7 |
| `Dispatch_ingest → _required_mapping` | cross_community | 7 |
| `Dispatch_ingest → Normalize_source_text` | cross_community | 6 |
| `Dispatch_ingest → Extract_source_text` | cross_community | 6 |
| `Persist → _storage_url` | cross_community | 4 |
| `Persist → _headers` | cross_community | 4 |
| `Persist → _execute` | cross_community | 4 |

## Connected Areas

| Area | Connections |
|------|-------------|
| Tests | 3 calls |

## How to Explore

1. `gitnexus_context({name: "test_pipeline_extracts_normalizes_chunks_checksums_and_provider_vectors"})` — see callers and callees
2. `gitnexus_query({query: "ingestion"})` — find related execution flows
3. Read key files listed above for implementation details
