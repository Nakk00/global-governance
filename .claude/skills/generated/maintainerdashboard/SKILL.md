---
name: maintainerdashboard
description: "Skill for the MaintainerDashboard area of global-governance-docuweb. 7 symbols across 5 files."
---

# MaintainerDashboard

7 symbols | 5 files | Cohesion: 41%

## When to Use

- Working with code in `src/`
- Understanding how useMaintainerGate, MaintainerLogin, reveal work
- Modifying maintainerdashboard-related functionality

## Key Files

| File | Symbols |
|------|---------|
| `src/components/modules/MaintainerDashboard/MaintainerLogin.tsx` | MaintainerLogin, reveal |
| `src/components/modules/MaintainerDashboard/shared/maintainerDashboardShared.tsx` | MaintainerFrame, AccessStateView |
| `src/components/modules/MaintainerDashboard/hooks/useMaintainerGate.ts` | useMaintainerGate |
| `src/components/modules/MaintainerDashboard/MaintainerDashboard.tsx` | MaintainerDashboard |
| `src/components/modules/MaintainerDashboard/MaintainerDashboard.test.tsx` | renderMaintainer |

## Entry Points

Start here when exploring this area:

- **`useMaintainerGate`** (Function) — `src/components/modules/MaintainerDashboard/hooks/useMaintainerGate.ts:12`
- **`MaintainerLogin`** (Function) — `src/components/modules/MaintainerDashboard/MaintainerLogin.tsx:24`
- **`reveal`** (Function) — `src/components/modules/MaintainerDashboard/MaintainerLogin.tsx:35`
- **`MaintainerDashboard`** (Function) — `src/components/modules/MaintainerDashboard/MaintainerDashboard.tsx:23`
- **`MaintainerFrame`** (Function) — `src/components/modules/MaintainerDashboard/shared/maintainerDashboardShared.tsx:539`

## Key Symbols

| Symbol | Type | File | Line |
|--------|------|------|------|
| `useMaintainerGate` | Function | `src/components/modules/MaintainerDashboard/hooks/useMaintainerGate.ts` | 12 |
| `MaintainerLogin` | Function | `src/components/modules/MaintainerDashboard/MaintainerLogin.tsx` | 24 |
| `reveal` | Function | `src/components/modules/MaintainerDashboard/MaintainerLogin.tsx` | 35 |
| `MaintainerDashboard` | Function | `src/components/modules/MaintainerDashboard/MaintainerDashboard.tsx` | 23 |
| `MaintainerFrame` | Function | `src/components/modules/MaintainerDashboard/shared/maintainerDashboardShared.tsx` | 539 |
| `AccessStateView` | Function | `src/components/modules/MaintainerDashboard/shared/maintainerDashboardShared.tsx` | 554 |
| `renderMaintainer` | Function | `src/components/modules/MaintainerDashboard/MaintainerDashboard.test.tsx` | 362 |

## Execution Flows

| Flow | Type | Steps |
|------|------|-------|
| `MaintainerDashboard → IsApiEnvelope` | cross_community | 7 |
| `MaintainerDashboard → ClearSupabaseSession` | cross_community | 6 |
| `MaintainerDashboard → MaintainerApiError` | cross_community | 6 |
| `MaintainerDashboard → IsSupabaseSessionExpired` | cross_community | 4 |
| `MaintainerDashboard → ParseMaintainerPreset` | cross_community | 4 |

## Connected Areas

| Area | Connections |
|------|-------------|
| Sources | 3 calls |
| Hooks | 2 calls |
| Cluster_75 | 2 calls |
| Cluster_78 | 2 calls |
| Overview | 1 calls |
| Cluster_76 | 1 calls |
| Validation | 1 calls |
| Cluster_77 | 1 calls |

## How to Explore

1. `gitnexus_context({name: "useMaintainerGate"})` — see callers and callees
2. `gitnexus_query({query: "maintainerdashboard"})` — find related execution flows
3. Read key files listed above for implementation details
