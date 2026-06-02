---
name: ui
description: "Skill for the Ui area of global-governance-docuweb. 11 symbols across 3 files."
---

# Ui

11 symbols | 3 files | Cohesion: 75%

## When to Use

- Working with code in `src/`
- Understanding how Table, TableHeader, TableBody work
- Modifying ui-related functionality

## Key Files

| File | Symbols |
|------|---------|
| `src/components/ui/table.tsx` | Table, TableHeader, TableBody, TableRow, TableHead (+1) |
| `src/components/modules/MaintainerDashboard/shared/maintainerDashboardShared.tsx` | ValidationResultsTable, ResponsiveChunkTable, ResponsiveCitationTable, SectionState |
| `src/components/modules/MaintainerDashboard/validation/ValidationWorkbench.tsx` | ValidationResultsTable |

## Entry Points

Start here when exploring this area:

- **`Table`** (Function) — `src/components/ui/table.tsx:4`
- **`TableHeader`** (Function) — `src/components/ui/table.tsx:13`
- **`TableBody`** (Function) — `src/components/ui/table.tsx:28`
- **`TableRow`** (Function) — `src/components/ui/table.tsx:35`
- **`TableHead`** (Function) — `src/components/ui/table.tsx:42`

## Key Symbols

| Symbol | Type | File | Line |
|--------|------|------|------|
| `Table` | Function | `src/components/ui/table.tsx` | 4 |
| `TableHeader` | Function | `src/components/ui/table.tsx` | 13 |
| `TableBody` | Function | `src/components/ui/table.tsx` | 28 |
| `TableRow` | Function | `src/components/ui/table.tsx` | 35 |
| `TableHead` | Function | `src/components/ui/table.tsx` | 42 |
| `TableCell` | Function | `src/components/ui/table.tsx` | 49 |
| `ValidationResultsTable` | Function | `src/components/modules/MaintainerDashboard/validation/ValidationWorkbench.tsx` | 112 |
| `SectionState` | Function | `src/components/modules/MaintainerDashboard/shared/maintainerDashboardShared.tsx` | 3945 |
| `ValidationResultsTable` | Function | `src/components/modules/MaintainerDashboard/shared/maintainerDashboardShared.tsx` | 1453 |
| `ResponsiveChunkTable` | Function | `src/components/modules/MaintainerDashboard/shared/maintainerDashboardShared.tsx` | 3203 |
| `ResponsiveCitationTable` | Function | `src/components/modules/MaintainerDashboard/shared/maintainerDashboardShared.tsx` | 3283 |

## Connected Areas

| Area | Connections |
|------|-------------|
| Overview | 5 calls |
| Public-homepage-redesign | 4 calls |

## How to Explore

1. `gitnexus_context({name: "Table"})` — see callers and callees
2. `gitnexus_query({query: "ui"})` — find related execution flows
3. Read key files listed above for implementation details
