# Orbital Diplomacy Implementation Spec

## Direction

`Orbital Diplomacy` is the selected Story 1.6 visual system. It keeps the premium galaxy mood, but makes the experience feel mapped, navigational, and institutionally deliberate rather than dreamy or purely cinematic.

## UI/UX Pro Max Translation

- Typography:
  - Display and section headings: `Libre Bodoni`
  - Body and UI: `Public Sans`
- Design cues to keep:
  - Editorial grid discipline
  - High-contrast dark surfaces
  - One strong orbit accent family
  - Reduced-motion-safe reveal choreography
- Anti-patterns to avoid:
  - Neon HUD overload
  - Thin unreadable sci-fi lines
  - Scroll-jacking
  - Glow-heavy text contrast loss

## Token Rules

- Canvas:
  - Dark mode is the emotional center: midnight indigo, deep navy, low-purple black
  - Light mode remains supported with cool celestial paper tones
- Accent:
  - Use one orbital blue-violet family for active state, route lines, and primary actions
- Surfaces:
  - Matte reading planes
  - Slightly brighter raised planes
  - Soft radial glow only in background fields and border highlights
- Shape:
  - Rounded large panels
  - Rounded pill controls for navigation and primary actions

## Component Mapping

- `src/index.css`
  - Owns the orbital token system, gradients, nav shells, rail styles, and hero/transition utility surfaces
- `src/components/layout/Navbar.tsx`
  - Floating orbital command bar with soft blur and pill chapter links
- `src/components/layout/MobileMenu.tsx`
  - Mobile continuation of the same command-bar language
- `src/components/layout/SectionProgressRail.tsx`
  - Orbital route card with numbered markers and quieter chapter labels
- `src/components/sections/HeroNarrativeFrame.tsx`
  - Large display panel plus orbit rail companion panel
- `src/components/sections/ChapterTransitionBlock.tsx`
  - Mapped chapter reset card with directional linework
- `src/components/sections/NarrativeSection.tsx`
  - Summary-first matte panels and rounded disclosure surfaces
- `src/components/sections/InsightRecapCard.tsx`
  - Recap card inherits the orbital ledger treatment
- `src/App.tsx`
  - Journey start becomes a first-class orbital panel instead of loose text on the page

## Motion Rules

- Motion should emphasize only one or two key elements per view
- Use slow atmospheric glow and route-line emphasis, not constant animation
- Reduced motion must disable decorative orbital effects and retain only essential state change

## Verification Focus

- Primary action remains clearly stronger than nav/disclosure controls
- Dark mode contrast stays readable on all reading surfaces
- Light mode still works as a coherent alternate presentation
- No horizontal overflow at current responsive checkpoints
