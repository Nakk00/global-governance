# Chapter 4 Main Page Fit And Mockup Parity Implementation Plan

Status: Ready for implementation
Created: 2026-06-03
Scope: Align the production main-page `West Philippine Sea Case File` chapter with the approved standalone Chapter 4 mockup.

## Goal

When a user clicks the top navbar item for `West Philippine Sea Case File`, the production Chapter 4 surface should read like the approved mockup: a compact case-file board with timeline, map, evidence, ruling-versus-reality, final thesis, references, source trust, and chat arranged as one coherent full-page experience.

## Investigation Summary

The approved mockup route and the real main-page route are structurally similar, but the production page is taller and more source-led than the mockup.

- At `1920 x 1080`, the mockup stage fits inside the viewport, while the production WPS section is about `1360px` tall.
- Production uses the real fixed app navbar outside the chapter stage. The mockup owns its command bar inside the stage.
- `NavigationContext.focusSection()` scrolls full-page chapter stages to document top. GitNexus reports HIGH risk for changing this helper because it affects all chapter/hash navigation.
- Production references currently render six approved-source records. The mockup shows five public-facing reference labels: `PCA Case`, `UNCLOS`, `DFA`, `NAMRIA`, and `ASEAN`.
- The global chat dock can overlap the compact references/trust area at wide desktop sizes if the Chapter 4 surface is not given enough right/bottom clearance.

## Implementation Strategy

Do not rewrite global navigation. Keep the change scoped to Chapter 4 production layout and content presentation.

1. Compress Chapter 4 board spacing and panel heights with scoped `.wps-case-file` CSS.
2. Keep the main interactive board in the same mockup order:
   - timeline left
   - maritime map center
   - evidence shelf below map
   - ruling-versus-reality right
   - final thesis strip
   - references and source trust guide bottom row
3. Make the reference row display public-facing mockup labels while preserving approved source linkage in data.
4. Keep the global chat dock owned by `SourceAwareChat`; avoid duplicating a chapter-local chat button.
5. Preserve accessibility: semantic headings, `aria-pressed`, `aria-controls`, live selected details, visible focus, keyboard-safe links/buttons, and reduced-motion support.

## Files Likely To Change

- `src/components/modules/WpsDossier/WpsDossier.tsx`
  - render public-facing reference titles/details
  - optionally expose source IDs as non-visible data attributes only if needed
  - keep the element order aligned to the mockup

- `src/data/sections/west-philippine-sea-dossier.ts`
  - add presentation-facing reference labels/details
  - preserve existing approved source IDs and evidence registry behavior

- `src/index.css`
  - reduce `.wps-case-file` vertical padding
  - tune heading, map, evidence, timeline, comparison, thesis, references, and trust sizes
  - add desktop chat-safe bottom/right clearance where needed
  - preserve responsive stack behavior and no horizontal overflow

- `src/components/modules/WpsDossier/WpsDossier.test.tsx`
  - update assertions for mockup-style reference labels
  - verify non-mockup content remains absent
  - verify CTA and core matrix content remain visible

## Risks

- Global navigation changes are high risk and should be avoided unless the scoped layout fix is insufficient.
- Over-compressing text can hurt readability or accessibility.
- The global chat dock is fixed and shared; any chat-specific CSS should be scoped carefully or verified across other chapters.
- Production references must remain traceable to approved source records even if their visible labels become mockup-facing.

## Verification Plan

Run these checks after implementation:

- `pnpm lint`
- `pnpm typecheck`
- `pnpm exec vitest run src/components/modules/WpsDossier/WpsDossier.test.tsx src/data/sections/west-philippine-sea-dossier.test.ts src/data/sections/core-narrative.test.ts`
- browser measurements at:
  - `1920 x 1080`
  - `1440 x 900`
  - `390 x 844`
- confirm:
  - no visible `gg-src-*`
  - no old comparison-control content
  - mockup reference labels are present
  - no horizontal overflow
  - chat does not cover references or source trust
  - the Chapter 4 board is close to mockup height at desktop
- run GitNexus `detect_changes` before final handoff.
