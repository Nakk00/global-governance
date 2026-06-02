---
name: hooks
description: "Skill for the Hooks area of global-governance-docuweb. 27 symbols across 5 files."
---

# Hooks

27 symbols | 5 files | Cohesion: 73%

## When to Use

- Working with code in `src/`
- Understanding how uploadSource, updateSourceMetadata, mutateSourceLifecycle work
- Modifying hooks-related functionality

## Key Files

| File | Symbols |
|------|---------|
| `src/components/modules/MaintainerDashboard/hooks/useMaintainerDashboardData.ts` | applyMutationResult, runMutation, uploadDraft, updateSource, runLifecycleAction (+7) |
| `src/components/modules/MaintainerDashboard/shared/maintainerDashboardShared.tsx` | MaintainerDashboard, syncRouteFromHistory, applyMutationResult, navigateTo, parseMaintainerRoute (+1) |
| `src/lib/maintainer/mutation-api.ts` | uploadSource, updateSourceMetadata, mutateSourceLifecycle, ingestSource |
| `src/components/modules/MaintainerDashboard/hooks/useMaintainerNavigation.ts` | useMaintainerNavigation, navigateTo, syncRouteFromHistory |
| `src/lib/maintainer/source-api.ts` | fetchStewardshipDashboard, fetchSourceDetail |

## Entry Points

Start here when exploring this area:

- **`uploadSource`** (Function) — `src/lib/maintainer/mutation-api.ts:15`
- **`updateSourceMetadata`** (Function) — `src/lib/maintainer/mutation-api.ts:38`
- **`mutateSourceLifecycle`** (Function) — `src/lib/maintainer/mutation-api.ts:54`
- **`ingestSource`** (Function) — `src/lib/maintainer/mutation-api.ts:66`
- **`applyMutationResult`** (Function) — `src/components/modules/MaintainerDashboard/hooks/useMaintainerDashboardData.ts:232`

## Key Symbols

| Symbol | Type | File | Line |
|--------|------|------|------|
| `uploadSource` | Function | `src/lib/maintainer/mutation-api.ts` | 15 |
| `updateSourceMetadata` | Function | `src/lib/maintainer/mutation-api.ts` | 38 |
| `mutateSourceLifecycle` | Function | `src/lib/maintainer/mutation-api.ts` | 54 |
| `ingestSource` | Function | `src/lib/maintainer/mutation-api.ts` | 66 |
| `applyMutationResult` | Function | `src/components/modules/MaintainerDashboard/hooks/useMaintainerDashboardData.ts` | 232 |
| `runMutation` | Function | `src/components/modules/MaintainerDashboard/hooks/useMaintainerDashboardData.ts` | 247 |
| `uploadDraft` | Function | `src/components/modules/MaintainerDashboard/hooks/useMaintainerDashboardData.ts` | 272 |
| `updateSource` | Function | `src/components/modules/MaintainerDashboard/hooks/useMaintainerDashboardData.ts` | 286 |
| `runLifecycleAction` | Function | `src/components/modules/MaintainerDashboard/hooks/useMaintainerDashboardData.ts` | 300 |
| `queueIngest` | Function | `src/components/modules/MaintainerDashboard/hooks/useMaintainerDashboardData.ts` | 317 |
| `MaintainerDashboard` | Function | `src/components/modules/MaintainerDashboard/shared/maintainerDashboardShared.tsx` | 246 |
| `fetchStewardshipDashboard` | Function | `src/lib/maintainer/source-api.ts` | 28 |
| `fetchSourceDetail` | Function | `src/lib/maintainer/source-api.ts` | 35 |
| `useMaintainerDashboardData` | Function | `src/components/modules/MaintainerDashboard/hooks/useMaintainerDashboardData.ts` | 37 |
| `loadSourceDetail` | Function | `src/components/modules/MaintainerDashboard/hooks/useMaintainerDashboardData.ts` | 63 |
| `loadSourcePreview` | Function | `src/components/modules/MaintainerDashboard/hooks/useMaintainerDashboardData.ts` | 101 |
| `retrySelectedSourcePreview` | Function | `src/components/modules/MaintainerDashboard/hooks/useMaintainerDashboardData.ts` | 141 |
| `loadDashboard` | Function | `src/components/modules/MaintainerDashboard/hooks/useMaintainerDashboardData.ts` | 148 |
| `selectSource` | Function | `src/components/modules/MaintainerDashboard/hooks/useMaintainerDashboardData.ts` | 215 |
| `useMaintainerNavigation` | Function | `src/components/modules/MaintainerDashboard/hooks/useMaintainerNavigation.ts` | 7 |

## Execution Flows

| Flow | Type | Steps |
|------|------|-------|
| `UseMaintainerDashboardData → IsApiEnvelope` | cross_community | 7 |
| `UseMaintainerDashboardData → ClearSupabaseSession` | cross_community | 6 |
| `UseMaintainerDashboardData → MaintainerApiError` | cross_community | 6 |
| `MaintainerDashboard → ClearSupabaseSession` | cross_community | 5 |
| `MaintainerDashboard → MaintainerApiError` | cross_community | 5 |
| `UploadDraft → IsApiEnvelope` | cross_community | 5 |
| `UpdateSource → IsApiEnvelope` | cross_community | 5 |
| `RunLifecycleAction → IsApiEnvelope` | cross_community | 5 |
| `QueueIngest → IsApiEnvelope` | cross_community | 5 |
| `MaintainerDashboard → ParseMaintainerPreset` | cross_community | 4 |

## Connected Areas

| Area | Connections |
|------|-------------|
| Maintainer | 6 calls |
| Cluster_74 | 3 calls |
| MaintainerDashboard | 3 calls |
| Supabase | 1 calls |
| Cluster_75 | 1 calls |
| Sources | 1 calls |

## How to Explore

1. `gitnexus_context({name: "uploadSource"})` — see callers and callees
2. `gitnexus_query({query: "hooks"})` — find related execution flows
3. Read key files listed above for implementation details
