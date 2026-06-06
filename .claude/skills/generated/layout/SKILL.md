---
name: layout
description: "Skill for the Layout area of global-governance-docuweb. 10 symbols across 6 files."
---

# Layout

10 symbols | 6 files | Cohesion: 72%

## When to Use

- Working with code in `src/`
- Understanding how useNavigation, SectionProgressRail, Navbar work
- Modifying layout-related functionality

## Key Files

| File | Symbols |
|------|---------|
| `src/components/layout/IdleScrollCue.tsx` | IdleScrollCue, isChatPanelOpen, timeout, resetIdle |
| `src/components/layout/MobileMenu.tsx` | MobileMenu, closeAtDesktop |
| `src/hooks/useNavigation.ts` | useNavigation |
| `src/components/layout/SectionProgressRail.tsx` | SectionProgressRail |
| `src/components/layout/Navbar.tsx` | Navbar |
| `src/components/layout/AppShell.tsx` | AppShell |

## Entry Points

Start here when exploring this area:

- **`useNavigation`** (Function) — `src/hooks/useNavigation.ts:4`
- **`SectionProgressRail`** (Function) — `src/components/layout/SectionProgressRail.tsx:3`
- **`Navbar`** (Function) — `src/components/layout/Navbar.tsx:13`
- **`MobileMenu`** (Function) — `src/components/layout/MobileMenu.tsx:8`
- **`closeAtDesktop`** (Function) — `src/components/layout/MobileMenu.tsx:18`

## Key Symbols

| Symbol | Type | File | Line |
|--------|------|------|------|
| `useNavigation` | Function | `src/hooks/useNavigation.ts` | 4 |
| `SectionProgressRail` | Function | `src/components/layout/SectionProgressRail.tsx` | 3 |
| `Navbar` | Function | `src/components/layout/Navbar.tsx` | 13 |
| `MobileMenu` | Function | `src/components/layout/MobileMenu.tsx` | 8 |
| `closeAtDesktop` | Function | `src/components/layout/MobileMenu.tsx` | 18 |
| `IdleScrollCue` | Function | `src/components/layout/IdleScrollCue.tsx` | 21 |
| `AppShell` | Function | `src/components/layout/AppShell.tsx` | 12 |
| `timeout` | Function | `src/components/layout/IdleScrollCue.tsx` | 33 |
| `resetIdle` | Function | `src/components/layout/IdleScrollCue.tsx` | 37 |
| `isChatPanelOpen` | Function | `src/components/layout/IdleScrollCue.tsx` | 17 |

## Execution Flows

| Flow | Type | Steps |
|------|------|-------|
| `AppShell → GetHashSectionId` | cross_community | 4 |
| `AppShell → Cn` | cross_community | 4 |
| `AppShell → UseNavigation` | intra_community | 4 |
| `AppShell → CloseAtDesktop` | intra_community | 4 |
| `Navbar → Cn` | cross_community | 4 |
| `RenderSourceAwareChat → UseNavigation` | cross_community | 3 |
| `AppShell → ScheduleUpdate` | cross_community | 3 |
| `AppShell → IsChapterId` | cross_community | 3 |
| `AppShell → GetChapterIndex` | cross_community | 3 |

## Connected Areas

| Area | Connections |
|------|-------------|
| Public-homepage-redesign | 3 calls |
| Overview | 2 calls |
| Contexts | 1 calls |
| Chat | 1 calls |

## How to Explore

1. `gitnexus_context({name: "useNavigation"})` — see callers and callees
2. `gitnexus_query({query: "layout"})` — find related execution flows
3. Read key files listed above for implementation details
