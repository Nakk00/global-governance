---
name: sections
description: "Skill for the Sections area of Global-Governance. 3 symbols across 2 files."
---

# Sections

3 symbols | 2 files | Cohesion: 67%

## When to Use

- Working with code in `src/`
- Understanding how resolveNarrativeRecapCue, NarrativeSection work
- Modifying sections-related functionality

## Key Files

| File | Symbols |
|------|---------|
| `src/data/sections/core-narrative.ts` | getCanonicalRecapTargetId, resolveNarrativeRecapCue |
| `src/components/sections/NarrativeSection.tsx` | NarrativeSection |

## Entry Points

Start here when exploring this area:

- **`resolveNarrativeRecapCue`** (Function) — `src/data/sections/core-narrative.ts:56`
- **`NarrativeSection`** (Function) — `src/components/sections/NarrativeSection.tsx:18`

## Key Symbols

| Symbol | Type | File | Line |
|--------|------|------|------|
| `resolveNarrativeRecapCue` | Function | `src/data/sections/core-narrative.ts` | 56 |
| `NarrativeSection` | Function | `src/components/sections/NarrativeSection.tsx` | 18 |
| `getCanonicalRecapTargetId` | Function | `src/data/sections/core-narrative.ts` | 42 |

## Execution Flows

| Flow | Type | Steps |
|------|------|-------|
| `NarrativeSection → IsChapterId` | cross_community | 4 |
| `NarrativeSection → GetCanonicalRecapTargetId` | intra_community | 3 |

## Connected Areas

| Area | Connections |
|------|-------------|
| Contexts | 1 calls |
| Layout | 1 calls |

## How to Explore

1. `gitnexus_context({name: "resolveNarrativeRecapCue"})` — see callers and callees
2. `gitnexus_query({query: "sections"})` — find related execution flows
3. Read key files listed above for implementation details
