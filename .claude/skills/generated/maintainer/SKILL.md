---
name: maintainer
description: "Skill for the Maintainer area of global-governance-docuweb. 39 symbols across 7 files."
---

# Maintainer

39 symbols | 7 files | Cohesion: 92%

## When to Use

- Working with code in `src/`
- Understanding how getSupabaseSession, isSupabaseSessionExpired, clearSupabaseSession work
- Modifying maintainer-related functionality

## Key Files

| File | Symbols |
|------|---------|
| `src/lib/maintainer/api.ts` | MaintainerApiError, fetchAdminMe, fetchStewardshipDashboard, fetchSourceDetail, fetchSourceChunks (+14) |
| `src/components/modules/MaintainerDashboard/shared/maintainerDashboardShared.tsx` | MaintainerDashboard, signOut, runMutation, handleMaintainerReadAuthFailure, SourceDetailPanel (+8) |
| `src/lib/supabase/browser-client.ts` | getSupabaseSession, isSupabaseSessionExpired, clearSupabaseSession |
| `src/components/modules/MaintainerDashboard/hooks/useMaintainerNavigation.ts` | useMaintainerNavigation |
| `src/components/modules/MaintainerDashboard/hooks/useMaintainerGate.ts` | useMaintainerGate |
| `src/components/modules/MaintainerDashboard/hooks/useMaintainerDashboardData.ts` | useMaintainerDashboardData |
| `src/components/modules/MaintainerDashboard/MaintainerDashboard.tsx` | MaintainerDashboard |

## Entry Points

Start here when exploring this area:

- **`getSupabaseSession`** (Function) — `src/lib/supabase/browser-client.ts:22`
- **`isSupabaseSessionExpired`** (Function) — `src/lib/supabase/browser-client.ts:41`
- **`clearSupabaseSession`** (Function) — `src/lib/supabase/browser-client.ts:86`
- **`fetchAdminMe`** (Function) — `src/lib/maintainer/api.ts:290`
- **`fetchStewardshipDashboard`** (Function) — `src/lib/maintainer/api.ts:294`

## Key Symbols

| Symbol | Type | File | Line |
|--------|------|------|------|
| `MaintainerApiError` | Class | `src/lib/maintainer/api.ts` | 272 |
| `getSupabaseSession` | Function | `src/lib/supabase/browser-client.ts` | 22 |
| `isSupabaseSessionExpired` | Function | `src/lib/supabase/browser-client.ts` | 41 |
| `clearSupabaseSession` | Function | `src/lib/supabase/browser-client.ts` | 86 |
| `fetchAdminMe` | Function | `src/lib/maintainer/api.ts` | 290 |
| `fetchStewardshipDashboard` | Function | `src/lib/maintainer/api.ts` | 294 |
| `fetchSourceDetail` | Function | `src/lib/maintainer/api.ts` | 301 |
| `fetchSourceChunks` | Function | `src/lib/maintainer/api.ts` | 311 |
| `fetchSourceCitations` | Function | `src/lib/maintainer/api.ts` | 321 |
| `fetchChunkDetail` | Function | `src/lib/maintainer/api.ts` | 331 |
| `fetchCitationDetail` | Function | `src/lib/maintainer/api.ts` | 341 |
| `uploadSource` | Function | `src/lib/maintainer/api.ts` | 390 |
| `updateSourceMetadata` | Function | `src/lib/maintainer/api.ts` | 413 |
| `mutateSourceLifecycle` | Function | `src/lib/maintainer/api.ts` | 429 |
| `ingestSource` | Function | `src/lib/maintainer/api.ts` | 441 |
| `useMaintainerNavigation` | Function | `src/components/modules/MaintainerDashboard/hooks/useMaintainerNavigation.ts` | 7 |
| `useMaintainerGate` | Function | `src/components/modules/MaintainerDashboard/hooks/useMaintainerGate.ts` | 14 |
| `useMaintainerDashboardData` | Function | `src/components/modules/MaintainerDashboard/hooks/useMaintainerDashboardData.ts` | 33 |
| `MaintainerDashboard` | Function | `src/components/modules/MaintainerDashboard/MaintainerDashboard.tsx` | 21 |
| `MaintainerDashboard` | Function | `src/components/modules/MaintainerDashboard/shared/maintainerDashboardShared.tsx` | 205 |

## Execution Flows

| Flow | Type | Steps |
|------|------|-------|
| `UseMaintainerDashboardData → IsApiEnvelope` | intra_community | 5 |
| `ValidationWorkbench → IsApiEnvelope` | cross_community | 5 |
| `MaintainerDashboard → ClearSupabaseSession` | intra_community | 5 |
| `MaintainerDashboard → MaintainerApiError` | intra_community | 5 |
| `UseMaintainerGate → IsApiEnvelope` | intra_community | 5 |
| `RunSelectedSet → IsApiEnvelope` | cross_community | 5 |
| `RunMutation → ParseMaintainerPreset` | cross_community | 5 |
| `SourceDetailPanel → IsApiEnvelope` | intra_community | 5 |
| `OpenChunkDetail → IsApiEnvelope` | intra_community | 5 |
| `OpenCitationDetail → IsApiEnvelope` | intra_community | 5 |

## Connected Areas

| Area | Connections |
|------|-------------|
| Hooks | 3 calls |

## How to Explore

1. `gitnexus_context({name: "getSupabaseSession"})` — see callers and callees
2. `gitnexus_query({query: "maintainer"})` — find related execution flows
3. Read key files listed above for implementation details
