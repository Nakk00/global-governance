---
name: layout
description: "Skill for the Layout area of Global-Governance. 8 symbols across 7 files."
---

# Layout

8 symbols | 7 files | Cohesion: 95%

## When to Use

- Working with code in `src/`
- Understanding how useNavigation, cn, InsightRecapCard work
- Modifying layout-related functionality

## Key Files

| File | Symbols |
|------|---------|
| `src/components/layout/MobileMenu.tsx` | MobileMenu, closeAtDesktop |
| `src/hooks/useNavigation.ts` | useNavigation |
| `src/lib/utils.ts` | cn |
| `src/components/ui/button.tsx` | Button |
| `src/components/sections/InsightRecapCard.tsx` | InsightRecapCard |
| `src/components/layout/SectionProgressRail.tsx` | SectionProgressRail |
| `src/components/layout/Navbar.tsx` | Navbar |

## Entry Points

Start here when exploring this area:

- **`useNavigation`** (Function) — `src/hooks/useNavigation.ts:4`
- **`cn`** (Function) — `src/lib/utils.ts:3`
- **`InsightRecapCard`** (Function) — `src/components/sections/InsightRecapCard.tsx:10`
- **`SectionProgressRail`** (Function) — `src/components/layout/SectionProgressRail.tsx:7`
- **`Navbar`** (Function) — `src/components/layout/Navbar.tsx:12`

## Key Symbols

| Symbol | Type | File | Line |
|--------|------|------|------|
| `useNavigation` | Function | `src/hooks/useNavigation.ts` | 4 |
| `cn` | Function | `src/lib/utils.ts` | 3 |
| `InsightRecapCard` | Function | `src/components/sections/InsightRecapCard.tsx` | 10 |
| `SectionProgressRail` | Function | `src/components/layout/SectionProgressRail.tsx` | 7 |
| `Navbar` | Function | `src/components/layout/Navbar.tsx` | 12 |
| `MobileMenu` | Function | `src/components/layout/MobileMenu.tsx` | 8 |
| `closeAtDesktop` | Function | `src/components/layout/MobileMenu.tsx` | 19 |
| `Button` | Function | `src/components/ui/button.tsx` | 44 |

## How to Explore

1. `gitnexus_context({name: "useNavigation"})` — see callers and callees
2. `gitnexus_query({query: "layout"})` — find related execution flows
3. Read key files listed above for implementation details
