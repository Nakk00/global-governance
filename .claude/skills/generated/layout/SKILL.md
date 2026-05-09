---
name: layout
description: "Skill for the Layout area of global-governance-docuweb. 8 symbols across 8 files."
---

# Layout

8 symbols | 8 files | Cohesion: 78%

## When to Use

- Working with code in `src/`
- Understanding how cn, useNavigation, InsightRecapCard work
- Modifying layout-related functionality

## Key Files

| File | Symbols |
|------|---------|
| `src/lib/utils.ts` | cn |
| `src/hooks/useNavigation.ts` | useNavigation |
| `src/components/ui/button.tsx` | Button |
| `src/components/sections/InsightRecapCard.tsx` | InsightRecapCard |
| `src/components/layout/SectionProgressRail.tsx` | SectionProgressRail |
| `src/components/layout/Navbar.tsx` | Navbar |
| `src/components/layout/MobileMenu.tsx` | MobileMenu |
| `src/components/chat/SourceAwareChat.tsx` | GroundedAnswerSurface |

## Entry Points

Start here when exploring this area:

- **`cn`** (Function) — `src/lib/utils.ts:3`
- **`useNavigation`** (Function) — `src/hooks/useNavigation.ts:4`
- **`InsightRecapCard`** (Function) — `src/components/sections/InsightRecapCard.tsx:10`
- **`SectionProgressRail`** (Function) — `src/components/layout/SectionProgressRail.tsx:7`
- **`Navbar`** (Function) — `src/components/layout/Navbar.tsx:12`

## Key Symbols

| Symbol | Type | File | Line |
|--------|------|------|------|
| `cn` | Function | `src/lib/utils.ts` | 3 |
| `useNavigation` | Function | `src/hooks/useNavigation.ts` | 4 |
| `InsightRecapCard` | Function | `src/components/sections/InsightRecapCard.tsx` | 10 |
| `SectionProgressRail` | Function | `src/components/layout/SectionProgressRail.tsx` | 7 |
| `Navbar` | Function | `src/components/layout/Navbar.tsx` | 12 |
| `MobileMenu` | Function | `src/components/layout/MobileMenu.tsx` | 8 |
| `Button` | Function | `src/components/ui/button.tsx` | 44 |
| `GroundedAnswerSurface` | Function | `src/components/chat/SourceAwareChat.tsx` | 350 |

## How to Explore

1. `gitnexus_context({name: "cn"})` — see callers and callees
2. `gitnexus_query({query: "layout"})` — find related execution flows
3. Read key files listed above for implementation details
