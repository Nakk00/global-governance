---
name: layout
description: "Skill for the Layout area of Global-Governance. 7 symbols across 6 files."
---

# Layout

7 symbols | 6 files | Cohesion: 100%

## When to Use

- Working with code in `src/`
- Understanding how cn, useNavigation, SectionProgressRail work
- Modifying layout-related functionality

## Key Files

| File | Symbols |
|------|---------|
| `src/components/layout/MobileMenu.tsx` | MobileMenu, closeAtDesktop |
| `src/lib/utils.ts` | cn |
| `src/hooks/useNavigation.ts` | useNavigation |
| `src/components/ui/button.tsx` | Button |
| `src/components/layout/SectionProgressRail.tsx` | SectionProgressRail |
| `src/components/layout/Navbar.tsx` | Navbar |

## Entry Points

Start here when exploring this area:

- **`cn`** (Function) — `src/lib/utils.ts:3`
- **`useNavigation`** (Function) — `src/hooks/useNavigation.ts:4`
- **`SectionProgressRail`** (Function) — `src/components/layout/SectionProgressRail.tsx:7`
- **`Navbar`** (Function) — `src/components/layout/Navbar.tsx:12`
- **`MobileMenu`** (Function) — `src/components/layout/MobileMenu.tsx:8`

## Key Symbols

| Symbol | Type | File | Line |
|--------|------|------|------|
| `cn` | Function | `src/lib/utils.ts` | 3 |
| `useNavigation` | Function | `src/hooks/useNavigation.ts` | 4 |
| `SectionProgressRail` | Function | `src/components/layout/SectionProgressRail.tsx` | 7 |
| `Navbar` | Function | `src/components/layout/Navbar.tsx` | 12 |
| `MobileMenu` | Function | `src/components/layout/MobileMenu.tsx` | 8 |
| `closeAtDesktop` | Function | `src/components/layout/MobileMenu.tsx` | 19 |
| `Button` | Function | `src/components/ui/button.tsx` | 44 |

## How to Explore

1. `gitnexus_context({name: "cn"})` — see callers and callees
2. `gitnexus_query({query: "layout"})` — find related execution flows
3. Read key files listed above for implementation details
