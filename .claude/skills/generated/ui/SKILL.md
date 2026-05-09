---
name: ui
description: "Skill for the Ui area of global-governance-docuweb. 8 symbols across 4 files."
---

# Ui

8 symbols | 4 files | Cohesion: 67%

## When to Use

- Working with code in `src/`
- Understanding how cn, Table, TableHeader work
- Modifying ui-related functionality

## Key Files

| File | Symbols |
|------|---------|
| `src/components/ui/table.tsx` | Table, TableHeader, TableRow, TableHead, TableCell |
| `src/lib/utils.ts` | cn |
| `src/components/ui/button.tsx` | Button |
| `src/components/chat/SourceAwareChat.tsx` | GroundedAnswerSurface |

## Entry Points

Start here when exploring this area:

- **`cn`** (Function) — `src/lib/utils.ts:3`
- **`Table`** (Function) — `src/components/ui/table.tsx:4`
- **`TableHeader`** (Function) — `src/components/ui/table.tsx:13`
- **`TableRow`** (Function) — `src/components/ui/table.tsx:35`
- **`TableHead`** (Function) — `src/components/ui/table.tsx:42`

## Key Symbols

| Symbol | Type | File | Line |
|--------|------|------|------|
| `cn` | Function | `src/lib/utils.ts` | 3 |
| `Table` | Function | `src/components/ui/table.tsx` | 4 |
| `TableHeader` | Function | `src/components/ui/table.tsx` | 13 |
| `TableRow` | Function | `src/components/ui/table.tsx` | 35 |
| `TableHead` | Function | `src/components/ui/table.tsx` | 42 |
| `TableCell` | Function | `src/components/ui/table.tsx` | 49 |
| `Button` | Function | `src/components/ui/button.tsx` | 44 |
| `GroundedAnswerSurface` | Function | `src/components/chat/SourceAwareChat.tsx` | 350 |

## How to Explore

1. `gitnexus_context({name: "cn"})` — see callers and callees
2. `gitnexus_query({query: "ui"})` — find related execution flows
3. Read key files listed above for implementation details
