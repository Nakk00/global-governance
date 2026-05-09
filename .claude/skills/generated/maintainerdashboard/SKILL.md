---
name: maintainerdashboard
description: "Skill for the MaintainerDashboard area of global-governance-docuweb. 8 symbols across 2 files."
---

# MaintainerDashboard

8 symbols | 2 files | Cohesion: 100%

## When to Use

- Working with code in `src/`
- Understanding how MaintainerLogin, reveal work
- Modifying maintainerdashboard-related functionality

## Key Files

| File | Symbols |
|------|---------|
| `src/components/modules/MaintainerDashboard/MaintainerDashboard.test.tsx` | renderMaintainer, detailFrom, resolveFirstDetail, resolveDashboardLoad, resolveFirstChunks (+1) |
| `src/components/modules/MaintainerDashboard/MaintainerLogin.tsx` | MaintainerLogin, reveal |

## Entry Points

Start here when exploring this area:

- **`MaintainerLogin`** (Function) — `src/components/modules/MaintainerDashboard/MaintainerLogin.tsx:24`
- **`reveal`** (Function) — `src/components/modules/MaintainerDashboard/MaintainerLogin.tsx:35`

## Key Symbols

| Symbol | Type | File | Line |
|--------|------|------|------|
| `MaintainerLogin` | Function | `src/components/modules/MaintainerDashboard/MaintainerLogin.tsx` | 24 |
| `reveal` | Function | `src/components/modules/MaintainerDashboard/MaintainerLogin.tsx` | 35 |
| `renderMaintainer` | Function | `src/components/modules/MaintainerDashboard/MaintainerDashboard.test.tsx` | 201 |
| `detailFrom` | Function | `src/components/modules/MaintainerDashboard/MaintainerDashboard.test.tsx` | 206 |
| `resolveFirstDetail` | Function | `src/components/modules/MaintainerDashboard/MaintainerDashboard.test.tsx` | 748 |
| `resolveDashboardLoad` | Function | `src/components/modules/MaintainerDashboard/MaintainerDashboard.test.tsx` | 837 |
| `resolveFirstChunks` | Function | `src/components/modules/MaintainerDashboard/MaintainerDashboard.test.tsx` | 1019 |
| `resolveChunkDetail` | Function | `src/components/modules/MaintainerDashboard/MaintainerDashboard.test.tsx` | 1069 |

## How to Explore

1. `gitnexus_context({name: "MaintainerLogin"})` — see callers and callees
2. `gitnexus_query({query: "maintainerdashboard"})` — find related execution flows
3. Read key files listed above for implementation details
