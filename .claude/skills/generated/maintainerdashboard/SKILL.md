---
name: maintainerdashboard
description: "Skill for the MaintainerDashboard area of global-governance-docuweb. 7 symbols across 2 files."
---

# MaintainerDashboard

7 symbols | 2 files | Cohesion: 78%

## When to Use

- Working with code in `src/`
- Understanding how getSupabaseSession, isSupabaseSessionExpired, clearSupabaseSession work
- Modifying maintainerdashboard-related functionality

## Key Files

| File | Symbols |
|------|---------|
| `src/components/modules/MaintainerDashboard/MaintainerDashboard.tsx` | MaintainerDashboard, signOut, handleMaintainerReadAuthFailure, mapGateError |
| `src/lib/supabase/browser-client.ts` | getSupabaseSession, isSupabaseSessionExpired, clearSupabaseSession |

## Entry Points

Start here when exploring this area:

- **`getSupabaseSession`** (Function) — `src/lib/supabase/browser-client.ts:22`
- **`isSupabaseSessionExpired`** (Function) — `src/lib/supabase/browser-client.ts:41`
- **`clearSupabaseSession`** (Function) — `src/lib/supabase/browser-client.ts:86`
- **`MaintainerDashboard`** (Function) — `src/components/modules/MaintainerDashboard/MaintainerDashboard.tsx:45`
- **`signOut`** (Function) — `src/components/modules/MaintainerDashboard/MaintainerDashboard.tsx:159`

## Key Symbols

| Symbol | Type | File | Line |
|--------|------|------|------|
| `getSupabaseSession` | Function | `src/lib/supabase/browser-client.ts` | 22 |
| `isSupabaseSessionExpired` | Function | `src/lib/supabase/browser-client.ts` | 41 |
| `clearSupabaseSession` | Function | `src/lib/supabase/browser-client.ts` | 86 |
| `MaintainerDashboard` | Function | `src/components/modules/MaintainerDashboard/MaintainerDashboard.tsx` | 45 |
| `signOut` | Function | `src/components/modules/MaintainerDashboard/MaintainerDashboard.tsx` | 159 |
| `handleMaintainerReadAuthFailure` | Function | `src/components/modules/MaintainerDashboard/MaintainerDashboard.tsx` | 411 |
| `mapGateError` | Function | `src/components/modules/MaintainerDashboard/MaintainerDashboard.tsx` | 692 |

## Execution Flows

| Flow | Type | Steps |
|------|------|-------|
| `MaintainerDashboard → ClearSupabaseSession` | cross_community | 4 |
| `MaintainerDashboard → MaintainerApiError` | cross_community | 4 |
| `FetchStewardshipDashboard → ClearSupabaseSession` | cross_community | 3 |
| `FetchSourceDetail → ClearSupabaseSession` | cross_community | 3 |

## Connected Areas

| Area | Connections |
|------|-------------|
| Maintainer | 3 calls |

## How to Explore

1. `gitnexus_context({name: "getSupabaseSession"})` — see callers and callees
2. `gitnexus_query({query: "maintainerdashboard"})` — find related execution flows
3. Read key files listed above for implementation details
