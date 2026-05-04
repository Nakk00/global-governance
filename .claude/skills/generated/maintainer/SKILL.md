---
name: maintainer
description: "Skill for the Maintainer area of global-governance-docuweb. 5 symbols across 1 files."
---

# Maintainer

5 symbols | 1 files | Cohesion: 67%

## When to Use

- Working with code in `src/`
- Understanding how fetchAdminMe, fetchStewardshipDashboard, fetchSourceDetail work
- Modifying maintainer-related functionality

## Key Files

| File | Symbols |
|------|---------|
| `src/lib/maintainer/api.ts` | MaintainerApiError, fetchAdminMe, fetchStewardshipDashboard, fetchSourceDetail, fetchMaintainerJson |

## Entry Points

Start here when exploring this area:

- **`fetchAdminMe`** (Function) — `src/lib/maintainer/api.ts:84`
- **`fetchStewardshipDashboard`** (Function) — `src/lib/maintainer/api.ts:88`
- **`fetchSourceDetail`** (Function) — `src/lib/maintainer/api.ts:95`
- **`MaintainerApiError`** (Class) — `src/lib/maintainer/api.ts:73`

## Key Symbols

| Symbol | Type | File | Line |
|--------|------|------|------|
| `MaintainerApiError` | Class | `src/lib/maintainer/api.ts` | 73 |
| `fetchAdminMe` | Function | `src/lib/maintainer/api.ts` | 84 |
| `fetchStewardshipDashboard` | Function | `src/lib/maintainer/api.ts` | 88 |
| `fetchSourceDetail` | Function | `src/lib/maintainer/api.ts` | 95 |
| `fetchMaintainerJson` | Function | `src/lib/maintainer/api.ts` | 105 |

## Execution Flows

| Flow | Type | Steps |
|------|------|-------|
| `MaintainerDashboard → ClearSupabaseSession` | cross_community | 4 |
| `MaintainerDashboard → MaintainerApiError` | cross_community | 4 |
| `FetchStewardshipDashboard → ClearSupabaseSession` | cross_community | 3 |
| `FetchStewardshipDashboard → MaintainerApiError` | intra_community | 3 |
| `FetchSourceDetail → ClearSupabaseSession` | cross_community | 3 |
| `FetchSourceDetail → MaintainerApiError` | intra_community | 3 |

## Connected Areas

| Area | Connections |
|------|-------------|
| MaintainerDashboard | 1 calls |

## How to Explore

1. `gitnexus_context({name: "fetchAdminMe"})` — see callers and callees
2. `gitnexus_query({query: "maintainer"})` — find related execution flows
3. Read key files listed above for implementation details
