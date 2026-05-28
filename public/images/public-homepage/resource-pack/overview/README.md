# Overview Resource Pack

Purpose: source assets for the isolated Chapter 2 `Global Governance Overview` mockup.

## Assets

- `overview-global-systems-bg-01.png` - generated raster background for the full-screen world systems map.
- `overview-compass-mark-white-bg-01.png` - white-background compass source image for transparency prep.
- `overview-system-framing-mark-white-bg-01.png` - white-background system-framing network source image for transparency prep.
- `overview-un-command-mark-white-bg-01.png` - white-background UN Command Center continuation source image for transparency prep.

Shared asset dependency:

- `../hero/governance-compass-mark-01.png` remains the canonical compass/brand mark for implementation unless a later pass replaces it.

## Background Generation Prompt

```text
Create a project-ready website background image for a public educational chapter titled Global Governance Overview. Aspect ratio 3:2, high resolution suitable for 1536x1024 layout. Cinematic dark diplomatic world atlas at night: deep navy oceans, visible world map geography, subtle city lights, soft orbital route arcs, faint institutional network nodes, premium museum-wall / strategic command-interface atmosphere. Composition must leave clear dark readable zones for UI overlays: a wide empty top band for navigation, centered title-safe area in upper middle, left and right side panel-safe areas, central lower area for an orbit diagram, bottom band for controls. No text, no labels, no logos, no UI cards, no people, no flags, no watermark. Colors: near-black navy, muted cyan connection lights, soft diplomatic gold arcs, restrained contrast. The image should feel related to a cinematic global governance systems map, not sci-fi cyberpunk, not dashboard, not generic stock photo.
```

## Implementation Notes

- Keep all readable UI text in TSX/CSS.
- Use the background as atmosphere only; do not depend on it for content meaning.
- Overlay real buttons, headings, and labels above these assets for accessibility.
- The white-background mark PNGs are intentionally not transparent; remove their backgrounds manually before final implementation if needed.
