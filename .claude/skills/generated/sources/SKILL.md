---
name: sources
description: "Skill for the Sources area of global-governance-docuweb. 12 symbols across 3 files."
---

# Sources

12 symbols | 3 files | Cohesion: 100%

## When to Use

- Working with code in `backend/`
- Understanding how dashboard, source_detail, ingestion_runs work
- Modifying sources-related functionality

## Key Files

| File | Symbols |
|------|---------|
| `backend/sources/views.py` | dashboard, source_detail, ingestion_runs, validation_runs, audit_events (+1) |
| `backend/sources/repository.py` | get_stewardship_dashboard, get_source_detail, _inventory_item, _overview |
| `backend/sources/dtos.py` | SourceInventoryItemDto, SourceDetailDto |

## Entry Points

Start here when exploring this area:

- **`dashboard`** (Function) — `backend/sources/views.py:10`
- **`source_detail`** (Function) — `backend/sources/views.py:18`
- **`ingestion_runs`** (Function) — `backend/sources/views.py:33`
- **`validation_runs`** (Function) — `backend/sources/views.py:41`
- **`audit_events`** (Function) — `backend/sources/views.py:49`

## Key Symbols

| Symbol | Type | File | Line |
|--------|------|------|------|
| `SourceInventoryItemDto` | Class | `backend/sources/dtos.py` | 25 |
| `SourceDetailDto` | Class | `backend/sources/dtos.py` | 38 |
| `dashboard` | Function | `backend/sources/views.py` | 10 |
| `source_detail` | Function | `backend/sources/views.py` | 18 |
| `ingestion_runs` | Function | `backend/sources/views.py` | 33 |
| `validation_runs` | Function | `backend/sources/views.py` | 41 |
| `audit_events` | Function | `backend/sources/views.py` | 49 |
| `get_stewardship_dashboard` | Function | `backend/sources/repository.py` | 114 |
| `get_source_detail` | Function | `backend/sources/repository.py` | 129 |
| `_guard_read_request` | Function | `backend/sources/views.py` | 57 |
| `_inventory_item` | Function | `backend/sources/repository.py` | 158 |
| `_overview` | Function | `backend/sources/repository.py` | 186 |

## How to Explore

1. `gitnexus_context({name: "dashboard"})` — see callers and callees
2. `gitnexus_query({query: "sources"})` — find related execution flows
3. Read key files listed above for implementation details
