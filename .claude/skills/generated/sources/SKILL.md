---
name: sources
description: "Skill for the Sources area of global-governance-docuweb. 136 symbols across 4 files."
---

# Sources

136 symbols | 4 files | Cohesion: 80%

## When to Use

- Working with code in `backend/`
- Understanding how get_stewardship_dashboard, get_source_detail, get_source_chunks work
- Modifying sources-related functionality

## Key Files

| File | Symbols |
|------|---------|
| `backend/sources/repository.py` | get_source_detail, get_source_chunks, get_source_citations, get_chunk_detail, _latest_document (+101) |
| `backend/sources/views.py` | dashboard, source_chunks, source_citations, chunk_detail, citation_detail (+15) |
| `backend/sources/dtos.py` | SourceInventoryItemDto, SourceDetailDto, ChunkRowDto, ChunkDetailDto, CitationRowDto (+1) |
| `backend/sources/services.py` | get_stewardship_dashboard, list_ingestion_runs, list_validation_runs, list_audit_events |

## Entry Points

Start here when exploring this area:

- **`get_stewardship_dashboard`** (Function) — `backend/sources/repository.py:1293`
- **`get_source_detail`** (Function) — `backend/sources/repository.py:1297`
- **`get_source_chunks`** (Function) — `backend/sources/repository.py:1301`
- **`get_source_citations`** (Function) — `backend/sources/repository.py:1305`
- **`get_chunk_detail`** (Function) — `backend/sources/repository.py:1309`

## Key Symbols

| Symbol | Type | File | Line |
|--------|------|------|------|
| `SourceInventoryItemDto` | Class | `backend/sources/dtos.py` | 34 |
| `SourceDetailDto` | Class | `backend/sources/dtos.py` | 48 |
| `ChunkRowDto` | Class | `backend/sources/dtos.py` | 89 |
| `ChunkDetailDto` | Class | `backend/sources/dtos.py` | 103 |
| `CitationRowDto` | Class | `backend/sources/dtos.py` | 110 |
| `CitationDetailDto` | Class | `backend/sources/dtos.py` | 123 |
| `get_stewardship_dashboard` | Function | `backend/sources/repository.py` | 1293 |
| `get_source_detail` | Function | `backend/sources/repository.py` | 1297 |
| `get_source_chunks` | Function | `backend/sources/repository.py` | 1301 |
| `get_source_citations` | Function | `backend/sources/repository.py` | 1305 |
| `get_chunk_detail` | Function | `backend/sources/repository.py` | 1309 |
| `get_citation_detail` | Function | `backend/sources/repository.py` | 1313 |
| `upload_source` | Function | `backend/sources/repository.py` | 1317 |
| `update_source_metadata` | Function | `backend/sources/repository.py` | 1326 |
| `transition_source` | Function | `backend/sources/repository.py` | 1332 |
| `dispatch_ingest` | Function | `backend/sources/repository.py` | 1340 |
| `dashboard` | Function | `backend/sources/views.py` | 18 |
| `source_chunks` | Function | `backend/sources/views.py` | 50 |
| `source_citations` | Function | `backend/sources/views.py` | 68 |
| `chunk_detail` | Function | `backend/sources/views.py` | 86 |

## Execution Flows

| Flow | Type | Steps |
|------|------|-------|
| `Dispatch_ingest → _request` | cross_community | 6 |
| `Dispatch_ingest → _clean_list` | cross_community | 6 |
| `Dispatch_ingest → _event_from_row` | cross_community | 6 |
| `Get_source_citations → _request` | cross_community | 5 |
| `Get_source_citations → _clean_list` | cross_community | 5 |
| `Get_source_citations → _event_from_row` | cross_community | 5 |
| `Get_citation_detail → _request` | cross_community | 5 |
| `Get_citation_detail → _clean_list` | cross_community | 5 |
| `Get_source_chunks → _request` | cross_community | 5 |
| `Get_source_chunks → _clean_list` | cross_community | 5 |

## How to Explore

1. `gitnexus_context({name: "get_stewardship_dashboard"})` — see callers and callees
2. `gitnexus_query({query: "sources"})` — find related execution flows
3. Read key files listed above for implementation details
