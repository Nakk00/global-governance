---
name: maintainerdashboard
description: "Skill for the MaintainerDashboard area of global-governance-docuweb. 13 symbols across 4 files."
---

# MaintainerDashboard

13 symbols | 4 files | Cohesion: 56%

## When to Use

- Working with code in `src/`
- Understanding how MaintainerLogin, reveal, MaintainerDashboard work
- Modifying maintainerdashboard-related functionality

## Key Files

| File | Symbols |
|------|---------|
| `src/components/modules/MaintainerDashboard/shared/maintainerDashboardShared.tsx` | MaintainerDashboard, MaintainerFrame, AccessStateView, DashboardView, DashboardDataState (+4) |
| `src/components/modules/MaintainerDashboard/MaintainerLogin.tsx` | MaintainerLogin, reveal |
| `src/components/modules/MaintainerDashboard/MaintainerDashboard.tsx` | MaintainerDashboard |
| `src/components/modules/MaintainerDashboard/MaintainerDashboard.test.tsx` | renderMaintainer |

## Entry Points

Start here when exploring this area:

- **`MaintainerLogin`** (Function) — `src/components/modules/MaintainerDashboard/MaintainerLogin.tsx:24`
- **`reveal`** (Function) — `src/components/modules/MaintainerDashboard/MaintainerLogin.tsx:35`
- **`MaintainerDashboard`** (Function) — `src/components/modules/MaintainerDashboard/MaintainerDashboard.tsx:23`
- **`MaintainerDashboard`** (Function) — `src/components/modules/MaintainerDashboard/shared/maintainerDashboardShared.tsx:246`
- **`MaintainerFrame`** (Function) — `src/components/modules/MaintainerDashboard/shared/maintainerDashboardShared.tsx:539`

## Key Symbols

| Symbol | Type | File | Line |
|--------|------|------|------|
| `MaintainerLogin` | Function | `src/components/modules/MaintainerDashboard/MaintainerLogin.tsx` | 24 |
| `reveal` | Function | `src/components/modules/MaintainerDashboard/MaintainerLogin.tsx` | 35 |
| `MaintainerDashboard` | Function | `src/components/modules/MaintainerDashboard/MaintainerDashboard.tsx` | 23 |
| `MaintainerDashboard` | Function | `src/components/modules/MaintainerDashboard/shared/maintainerDashboardShared.tsx` | 246 |
| `MaintainerFrame` | Function | `src/components/modules/MaintainerDashboard/shared/maintainerDashboardShared.tsx` | 539 |
| `AccessStateView` | Function | `src/components/modules/MaintainerDashboard/shared/maintainerDashboardShared.tsx` | 554 |
| `DashboardDataState` | Function | `src/components/modules/MaintainerDashboard/shared/maintainerDashboardShared.tsx` | 694 |
| `MaintainerSectionNav` | Function | `src/components/modules/MaintainerDashboard/shared/maintainerDashboardShared.tsx` | 776 |
| `SourceUploadPage` | Function | `src/components/modules/MaintainerDashboard/shared/maintainerDashboardShared.tsx` | 956 |
| `OperationsPage` | Function | `src/components/modules/MaintainerDashboard/shared/maintainerDashboardShared.tsx` | 1062 |
| `SectionSkeleton` | Function | `src/components/modules/MaintainerDashboard/shared/maintainerDashboardShared.tsx` | 3928 |
| `renderMaintainer` | Function | `src/components/modules/MaintainerDashboard/MaintainerDashboard.test.tsx` | 362 |
| `DashboardView` | Function | `src/components/modules/MaintainerDashboard/shared/maintainerDashboardShared.tsx` | 589 |

## Execution Flows

| Flow | Type | Steps |
|------|------|-------|
| `MaintainerDashboard → ClearSupabaseSession` | cross_community | 6 |
| `MaintainerDashboard → MaintainerApiError` | cross_community | 6 |
| `MaintainerDashboard → ClearSupabaseSession` | cross_community | 5 |
| `MaintainerDashboard → MaintainerApiError` | cross_community | 5 |
| `MaintainerDashboard → HandleMaintainerReadAuthFailure` | cross_community | 5 |
| `DashboardView → Cn` | cross_community | 5 |
| `MaintainerDashboard → IsSupabaseSessionExpired` | cross_community | 4 |
| `MaintainerDashboard → ParseMaintainerPreset` | cross_community | 4 |
| `DashboardView → BuildSourceDetailPath` | cross_community | 4 |
| `DashboardView → FilterSourcesForPreset` | cross_community | 4 |

## Connected Areas

| Area | Connections |
|------|-------------|
| Hooks | 10 calls |
| Sources | 3 calls |
| Cluster_75 | 2 calls |
| Cluster_76 | 2 calls |
| Cluster_77 | 2 calls |
| Public-homepage-redesign | 2 calls |
| Overview | 1 calls |
| Supabase | 1 calls |

## How to Explore

1. `gitnexus_context({name: "MaintainerLogin"})` — see callers and callees
2. `gitnexus_query({query: "maintainerdashboard"})` — find related execution flows
3. Read key files listed above for implementation details
