---
name: supabase
description: "Skill for the Supabase area of global-governance-docuweb. 11 symbols across 5 files."
---

# Supabase

11 symbols | 5 files | Cohesion: 88%

## When to Use

- Working with code in `src/`
- Understanding how getSupabaseSession, isSupabaseSessionExpired, clearSupabaseSession work
- Modifying supabase-related functionality

## Key Files

| File | Symbols |
|------|---------|
| `src/lib/supabase/browser-client.ts` | getSupabaseSession, isSupabaseSessionExpired, clearSupabaseSession, signInWithPassword |
| `src/components/modules/MaintainerDashboard/shared/maintainerDashboardShared.tsx` | resolveGate, signOut, mapGateError |
| `src/components/modules/MaintainerDashboard/hooks/useMaintainerGate.ts` | resolveGate, signOut |
| `src/lib/maintainer/auth-api.ts` | fetchAdminMe |
| `src/components/modules/MaintainerDashboard/MaintainerLogin.tsx` | submit |

## Entry Points

Start here when exploring this area:

- **`getSupabaseSession`** (Function) — `src/lib/supabase/browser-client.ts:22`
- **`isSupabaseSessionExpired`** (Function) — `src/lib/supabase/browser-client.ts:41`
- **`clearSupabaseSession`** (Function) — `src/lib/supabase/browser-client.ts:86`
- **`fetchAdminMe`** (Function) — `src/lib/maintainer/auth-api.ts:7`
- **`resolveGate`** (Function) — `src/components/modules/MaintainerDashboard/hooks/useMaintainerGate.ts:15`

## Key Symbols

| Symbol | Type | File | Line |
|--------|------|------|------|
| `getSupabaseSession` | Function | `src/lib/supabase/browser-client.ts` | 22 |
| `isSupabaseSessionExpired` | Function | `src/lib/supabase/browser-client.ts` | 41 |
| `clearSupabaseSession` | Function | `src/lib/supabase/browser-client.ts` | 86 |
| `fetchAdminMe` | Function | `src/lib/maintainer/auth-api.ts` | 7 |
| `resolveGate` | Function | `src/components/modules/MaintainerDashboard/hooks/useMaintainerGate.ts` | 15 |
| `signOut` | Function | `src/components/modules/MaintainerDashboard/hooks/useMaintainerGate.ts` | 36 |
| `resolveGate` | Function | `src/components/modules/MaintainerDashboard/shared/maintainerDashboardShared.tsx` | 267 |
| `signOut` | Function | `src/components/modules/MaintainerDashboard/shared/maintainerDashboardShared.tsx` | 396 |
| `mapGateError` | Function | `src/components/modules/MaintainerDashboard/shared/maintainerDashboardShared.tsx` | 3979 |
| `signInWithPassword` | Function | `src/lib/supabase/browser-client.ts` | 47 |
| `submit` | Function | `src/components/modules/MaintainerDashboard/MaintainerLogin.tsx` | 52 |

## Execution Flows

| Flow | Type | Steps |
|------|------|-------|
| `MaintainerDashboard → IsApiEnvelope` | cross_community | 7 |
| `MaintainerDashboard → ClearSupabaseSession` | cross_community | 6 |
| `MaintainerDashboard → MaintainerApiError` | cross_community | 6 |
| `UseMaintainerDashboardData → ClearSupabaseSession` | cross_community | 6 |
| `MaintainerDashboard → ClearSupabaseSession` | cross_community | 5 |
| `MaintainerDashboard → MaintainerApiError` | cross_community | 5 |
| `ValidationWorkbench → ClearSupabaseSession` | cross_community | 5 |
| `ValidationWorkbench → ClearSupabaseSession` | cross_community | 5 |
| `SourceDetailPanel → ClearSupabaseSession` | cross_community | 5 |
| `ResolveGate → IsApiEnvelope` | cross_community | 5 |

## Connected Areas

| Area | Connections |
|------|-------------|
| Maintainer | 1 calls |

## How to Explore

1. `gitnexus_context({name: "getSupabaseSession"})` — see callers and callees
2. `gitnexus_query({query: "supabase"})` — find related execution flows
3. Read key files listed above for implementation details
