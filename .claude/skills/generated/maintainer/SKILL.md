---
name: maintainer
description: "Skill for the Maintainer area of global-governance-docuweb. 25 symbols across 7 files."
---

# Maintainer

25 symbols | 7 files | Cohesion: 73%

## When to Use

- Working with code in `src/`
- Understanding how fetchSourceChunks, fetchSourceCitations, fetchChunkDetail work
- Modifying maintainer-related functionality

## Key Files

| File | Symbols |
|------|---------|
| `src/components/modules/MaintainerDashboard/shared/maintainerDashboardShared.tsx` | loadChunks, loadCitations, openChunkDetail, openCitationDetail, loadValidation (+4) |
| `src/lib/maintainer/source-api.ts` | fetchSourceChunks, fetchSourceCitations, fetchChunkDetail, fetchCitationDetail |
| `src/lib/maintainer/validation-api.ts` | fetchValidationSets, fetchValidationRuns, fetchValidationRunDetail, launchValidationRun |
| `src/lib/maintainer/envelope.ts` | MaintainerApiError, parseMaintainerEnvelope, isApiEnvelope |
| `src/components/modules/MaintainerDashboard/validation/ValidationWorkbench.tsx` | loadValidation, timer, runSelectedSet |
| `src/lib/maintainer/client.ts` | fetchMaintainerJson |
| `src/components/modules/MaintainerDashboard/MaintainerDashboard.test.tsx` | arrange |

## Entry Points

Start here when exploring this area:

- **`fetchSourceChunks`** (Function) — `src/lib/maintainer/source-api.ts:45`
- **`fetchSourceCitations`** (Function) — `src/lib/maintainer/source-api.ts:55`
- **`fetchChunkDetail`** (Function) — `src/lib/maintainer/source-api.ts:65`
- **`fetchCitationDetail`** (Function) — `src/lib/maintainer/source-api.ts:75`
- **`parseMaintainerEnvelope`** (Function) — `src/lib/maintainer/envelope.ts:34`

## Key Symbols

| Symbol | Type | File | Line |
|--------|------|------|------|
| `MaintainerApiError` | Class | `src/lib/maintainer/envelope.ts` | 16 |
| `fetchSourceChunks` | Function | `src/lib/maintainer/source-api.ts` | 45 |
| `fetchSourceCitations` | Function | `src/lib/maintainer/source-api.ts` | 55 |
| `fetchChunkDetail` | Function | `src/lib/maintainer/source-api.ts` | 65 |
| `fetchCitationDetail` | Function | `src/lib/maintainer/source-api.ts` | 75 |
| `parseMaintainerEnvelope` | Function | `src/lib/maintainer/envelope.ts` | 34 |
| `fetchMaintainerJson` | Function | `src/lib/maintainer/client.ts` | 7 |
| `fetchValidationSets` | Function | `src/lib/maintainer/validation-api.ts` | 15 |
| `fetchValidationRuns` | Function | `src/lib/maintainer/validation-api.ts` | 22 |
| `fetchValidationRunDetail` | Function | `src/lib/maintainer/validation-api.ts` | 29 |
| `launchValidationRun` | Function | `src/lib/maintainer/validation-api.ts` | 39 |
| `loadValidation` | Function | `src/components/modules/MaintainerDashboard/validation/ValidationWorkbench.tsx` | 202 |
| `timer` | Function | `src/components/modules/MaintainerDashboard/validation/ValidationWorkbench.tsx` | 318 |
| `runSelectedSet` | Function | `src/components/modules/MaintainerDashboard/validation/ValidationWorkbench.tsx` | 324 |
| `loadValidation` | Function | `src/components/modules/MaintainerDashboard/shared/maintainerDashboardShared.tsx` | 1099 |
| `timer` | Function | `src/components/modules/MaintainerDashboard/shared/maintainerDashboardShared.tsx` | 1215 |
| `runSelectedSet` | Function | `src/components/modules/MaintainerDashboard/shared/maintainerDashboardShared.tsx` | 1221 |
| `isApiEnvelope` | Function | `src/lib/maintainer/envelope.ts` | 57 |
| `arrange` | Function | `src/components/modules/MaintainerDashboard/MaintainerDashboard.test.tsx` | 868 |
| `loadChunks` | Function | `src/components/modules/MaintainerDashboard/shared/maintainerDashboardShared.tsx` | 2295 |

## Execution Flows

| Flow | Type | Steps |
|------|------|-------|
| `MaintainerDashboard → IsApiEnvelope` | cross_community | 7 |
| `UseMaintainerDashboardData → IsApiEnvelope` | cross_community | 7 |
| `MaintainerDashboard → ClearSupabaseSession` | cross_community | 6 |
| `MaintainerDashboard → MaintainerApiError` | cross_community | 6 |
| `ValidationWorkbench → IsApiEnvelope` | cross_community | 6 |
| `SourceDetailPanel → IsApiEnvelope` | cross_community | 6 |
| `UseMaintainerDashboardData → ClearSupabaseSession` | cross_community | 6 |
| `UseMaintainerDashboardData → MaintainerApiError` | cross_community | 6 |
| `Timer → IsApiEnvelope` | cross_community | 6 |
| `MaintainerDashboard → ClearSupabaseSession` | cross_community | 5 |

## Connected Areas

| Area | Connections |
|------|-------------|
| Supabase | 1 calls |

## How to Explore

1. `gitnexus_context({name: "fetchSourceChunks"})` — see callers and callees
2. `gitnexus_query({query: "maintainer"})` — find related execution flows
3. Read key files listed above for implementation details
