---
name: layout
description: "Skill for the Layout area of global-governance-docuweb. 5 symbols across 5 files."
---

# Layout

5 symbols | 5 files | Cohesion: 67%

## When to Use

- Working with code in `src/`
- Understanding how useNavigation, InsightRecapCard, SectionProgressRail work
- Modifying layout-related functionality

## Key Files

| File | Symbols |
|------|---------|
| `src/hooks/useNavigation.ts` | useNavigation |
| `src/components/sections/InsightRecapCard.tsx` | InsightRecapCard |
| `src/components/layout/SectionProgressRail.tsx` | SectionProgressRail |
| `src/components/layout/Navbar.tsx` | Navbar |
| `src/components/layout/MobileMenu.tsx` | MobileMenu |

## Entry Points

Start here when exploring this area:

- **`useNavigation`** (Function) — `src/hooks/useNavigation.ts:4`
- **`InsightRecapCard`** (Function) — `src/components/sections/InsightRecapCard.tsx:10`
- **`SectionProgressRail`** (Function) — `src/components/layout/SectionProgressRail.tsx:7`
- **`Navbar`** (Function) — `src/components/layout/Navbar.tsx:12`
- **`MobileMenu`** (Function) — `src/components/layout/MobileMenu.tsx:8`

## Key Symbols

| Symbol | Type | File | Line |
|--------|------|------|------|
| `useNavigation` | Function | `src/hooks/useNavigation.ts` | 4 |
| `InsightRecapCard` | Function | `src/components/sections/InsightRecapCard.tsx` | 10 |
| `SectionProgressRail` | Function | `src/components/layout/SectionProgressRail.tsx` | 7 |
| `Navbar` | Function | `src/components/layout/Navbar.tsx` | 12 |
| `MobileMenu` | Function | `src/components/layout/MobileMenu.tsx` | 8 |

## Connected Areas

| Area | Connections |
|------|-------------|
| Ui | 3 calls |

## How to Explore

1. `gitnexus_context({name: "useNavigation"})` — see callers and callees
2. `gitnexus_query({query: "layout"})` — find related execution flows
3. Read key files listed above for implementation details
