---
name: ui
description: "Skill for the Ui area of global-governance-docuweb. 10 symbols across 2 files."
---

# Ui

10 symbols | 2 files | Cohesion: 72%

## When to Use

- Working with code in `src/`
- Understanding how Table, TableHeader, TableBody work
- Modifying ui-related functionality

## Key Files

| File | Symbols |
|------|---------|
| `src/components/ui/table.tsx` | Table, TableHeader, TableBody, TableRow, TableHead (+1) |
| `src/components/modules/MaintainerDashboard/shared/maintainerDashboardShared.tsx` | ValidationResultsTable, ResponsiveChunkTable, ResponsiveCitationTable, SectionState |

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
| `SectionState` | Function | `src/components/modules/MaintainerDashboard/shared/maintainerDashboardShared.tsx` | 3945 |
| `ValidationResultsTable` | Function | `src/components/modules/MaintainerDashboard/shared/maintainerDashboardShared.tsx` | 1453 |
| `ResponsiveChunkTable` | Function | `src/components/modules/MaintainerDashboard/shared/maintainerDashboardShared.tsx` | 3203 |
| `ResponsiveCitationTable` | Function | `src/components/modules/MaintainerDashboard/shared/maintainerDashboardShared.tsx` | 3283 |

## Connected Areas

| Area | Connections |
|------|-------------|
| Overview | 5 calls |
| Public-homepage-redesign | 3 calls |

## How to Explore

1. `gitnexus_context({name: "Table"})` — see callers and callees
2. `gitnexus_query({query: "ui"})` — find related execution flows
3. Read key files listed above for implementation details
