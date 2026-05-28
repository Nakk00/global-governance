# Public Homepage Overview UI/UX Pro Max Design System

Status: Draft design contract for the isolated Chapter 2 TSX mockup. Do not apply to the live homepage until the mockup is approved.

Reference:

- `archive/docs/planning-artifacts/generated-mockups/public-homepage-redesign/overview-mockup-01.png`

Reference dimensions:

- `1536 x 1024`

Generated with:

- Skill: `ui-ux-pro-max`
- Design-system query: `educational landing page global governance systems map diplomatic cinematic dark overview`
- UX query: `cinematic dark educational systems map glass navigation accessibility`
- Style query: `cinematic global systems map dark diplomatic blue gold glassmorphism`
- Typography query: `academic accessible cinematic governance serif sans`
- Stack query: `isolated React TSX mockup cinematic landing page shadcn accessibility`

## Interpretation

The `ui-ux-pro-max` design-system search recommended a social-proof/testimonial landing-page pattern. That recommendation is rejected for Chapter 2 because the approved reference is not a conversion page.

The adopted recommendations are:

- Dark OLED readability.
- Glassmorphic command-shell panels.
- Academic serif plus accessible sans typography.
- Cinematic storytelling without heavy parallax.
- Strong keyboard, heading, and reduced-motion accessibility.

The approved direction is a cinematic systems-map learning surface: a premium global atlas where the learner sees relationships first, then reads the explanation.

## Design Direction

Name: Cinematic Governance Systems Atlas

Product type: Public educational chapter screen

Industry/context: Global governance, political education, systems literacy, source-aware learning

Primary experience goal: Help the learner understand that global governance is a network of actors, rules, institutions, issue areas, and shared constraints, not a single world government.

Primary pattern:

- Full-screen chapter-based systems map.
- Progress-aware floating top command shell.
- Central circular governance diagram.
- Left and right explanatory glass panels.
- Bottom lens controls for changing interpretive mode.
- Bottom legend explaining connection types.
- Bottom-right next-chapter card.

## Reference Image Read

The approved mockup establishes these non-negotiable visual anchors:

- Floating rounded command navbar across the top.
- Active Chapter 2 capsule with blue glow.
- Progress label shown as `02 / 06`.
- Large centered `Chapter 2` eyebrow.
- Two-line serif title: `Global Governance Overview`.
- Short centered teaching paragraph under the title.
- Dark full-bleed world map background with city lights and orbital connection arcs.
- Left glass panel titled `Selected Relationship`.
- Right glass panel titled `Why It Matters`.
- Central circular `Global Governance` hub with six surrounding nodes.
- Bottom lens controls: `System Framing`, `Actor Relationships`, `Rules & Cooperation`, `Power & Inequality`.
- Bottom-left system connections legend.
- Bottom-right next-card pointing to `UN Command Center`.
- Bottom-center scroll cue.

## Visual System

Canvas:

- Deep navy/black global night map.
- World geography should be visible but subordinate to UI text.
- Connection arcs should feel layered and international, not decorative noise.
- The center field must stay dark enough to preserve the title and system diagram.

Core palette:

- Near-black ocean: `#020812`
- Midnight navy: `#061426`
- Command-shell navy: `#08192D`
- Glass panel fill: `rgba(8, 25, 45, 0.72)`
- Border blue: `#2E5B82`
- Active glow blue: `#7CCBFF`
- Data cyan: `#4DD6FF`
- Diplomatic gold: `#D99B37`
- Soft amber line: `#E6B66A`
- White text: `#F8FAFC`
- Muted text: `#B8C4D6`

`ui-ux-pro-max` palette notes:

- Adopt the `Theater/Cinema` dark background and spotlight-gold logic.
- Borrow the trust-blue and achievement-gold pairing.
- Do not adopt light sky-blue landing-page backgrounds.
- Do not adopt purple/indigo educational-app defaults.

## Typography

Recommended by `ui-ux-pro-max`:

- Heading: Crimson Pro
- Body: Atkinson Hyperlegible

Project-compatible mapping:

- Use the same heading/body approach as the Chapter 1 mockup unless the project adds new fonts deliberately.
- Preserve a high-contrast serif for the main title.
- Use a readable sans for nav labels, panel metadata, controls, and utility text.

Hierarchy:

- Brand: compact uppercase/small title treatment.
- Chapter eyebrow: uppercase gold tracking.
- Main title: large serif, centered, two lines.
- Support copy: centered, two to three short lines.
- Panel headings: uppercase cyan micro-labels.
- Panel titles: medium serif or high-contrast title.
- Control labels: readable sans, no tiny low-contrast text.

## Layout System

Viewport target:

- Desktop reference: `1536 x 1024`.
- The isolated TSX mockup should fit as a full-screen chapter at this size.
- Avoid forced desktop vertical scrolling unless the viewport is smaller.

Primary grid:

- Top: floating command navigation shell.
- Upper center: chapter eyebrow, title, and teaching copy.
- Left: selected relationship panel.
- Center: circular system diagram.
- Right: why-it-matters panel.
- Bottom-left: connection legend.
- Bottom-center: lens controls and scroll cue.
- Bottom-right: next chapter card.

Spatial rules:

- Keep the central diagram optically centered under the title.
- Side panels should be balanced and should not cover the title.
- Bottom controls should not collide with the central system orbit.
- The legend should stay low and quiet, not compete with the teaching panels.
- The next-card should feel like a continuation affordance, not a primary sales CTA.

## Systems Diagram Contract

Center hub:

- Label: `Global Governance`.
- Treatment: circular glass hub, gold rim, soft internal glow.

Required surrounding nodes:

- `States`
- `Institutions`
- `Norms`
- `Civil Society`
- `Markets & Technology`
- `Issue Areas`

Connection types:

- Coordination and partnership: blue line.
- Influence and power: gold line.
- Information and norm flow: cyan line.
- Response and adaptation: dotted amber line.

Diagram rules:

- Nodes must be real text or accessible labels, not baked into a flat background.
- Lines can be CSS/SVG decoration, but the relationship model should stay legible.
- Use icons sparingly and consistently, preferably Lucide or existing project-approved icons.
- The diagram should communicate interdependence before detail.

## Interaction Rules

From `ui-ux-pro-max` UX guidance:

- All controls must be reachable by keyboard.
- Tab order must match visual order.
- Active chapter must be visually indicated.
- Heading levels must stay sequential.
- Fixed navigation must not obscure the main content.
- Decorative images should use empty alt text; meaningful imagery needs useful alt text.
- Reduced-motion users must not receive animated orbiting, sweeping, or parallax effects.

Mockup-specific behavior:

- The top chapter nav can be visual/static in the isolated mockup.
- Lens controls can be visual buttons first, with `System Framing` active.
- Search, Glossary, Guide, and Chat can remain visual placeholders unless wiring is explicitly requested.
- Do not reuse the live `SourceAwareChat` component in the isolated mockup unless the route is intentionally wrapped with the live navigation context.

## Motion

Allowed:

- Slow background shimmer.
- Subtle connection-line glow.
- Active nav capsule glow.
- Gentle panel entrance.
- Soft hover brightening for buttons and controls.

Avoid:

- Heavy parallax from the `Parallax Storytelling` result because it has poor accessibility and performance risk.
- Fast orbiting nodes.
- Flickering HUD effects.
- Cyberpunk glitch treatment.
- Layout-shifting hover scale.
- Motion that ignores `prefers-reduced-motion`.

## Implementation Contract

Recommended isolated files:

- `src/mockups/public-homepage-redesign/OverviewMockupPage.tsx`
- `src/mockups/public-homepage-redesign/overviewMockupData.ts`
- `src/mockups/public-homepage-redesign/overview-mockup.css`

Recommended route:

- `/mockups/public-homepage-redesign/overview`

Implementation notes:

- Mirror the isolated-route strategy used by the Chapter 1 hero mockup.
- Keep the mockup scoped to its own CSS file rather than expanding global `index.css`.
- Keep UI text in TSX, not baked into the background image.
- Use the approved PNG as a visual reference, not as a single full-page background.
- Prefer CSS/SVG for the orbit diagram so text, focus, and responsiveness remain controllable.

## Asset Rules

Use or create assets only as decorative layers:

- Full-bleed dark world map background.
- Subtle route/network overlay.
- Panel noise or glass texture.
- Governance compass or institutional mark if already part of the Chapter 1 visual family.

Asset guidance:

- Do not bake the navbar, panels, title, or diagram labels into a bitmap.
- Keep background contrast low enough for white text.
- Keep map detail visible but avoid making geography fight the diagram.
- If a resource pack is created later, keep it under `public/images/public-homepage/resource-pack/overview/`.

Generated resource pack:

- `public/images/public-homepage/resource-pack/overview/overview-global-systems-bg-01.png`
- `public/images/public-homepage/resource-pack/overview/overview-compass-mark-white-bg-01.png`
- `public/images/public-homepage/resource-pack/overview/overview-system-framing-mark-white-bg-01.png`
- `public/images/public-homepage/resource-pack/overview/overview-un-command-mark-white-bg-01.png`
- `public/images/public-homepage/resource-pack/overview/README.md`

Shared resource:

- `public/images/public-homepage/resource-pack/hero/governance-compass-mark-01.png` remains the preferred compass/brand mark for implementation.

## Anti-Patterns

Do not:

- Convert Chapter 2 into testimonials, logos, or social proof.
- Use a generic dashboard grid.
- Add a right-side progress rail that competes with the top command shell.
- Bake UI text into the reference image.
- Use purple-default SaaS styling.
- Use neon cyberpunk as the dominant language.
- Overload the screen with charts, metrics, or dense data tables.
- Make the system diagram too small to read.
- Hide the meaning of line types.
- Treat the next-card as a sales CTA.
- Add emojis as icons.

## Acceptance Checklist

- The first glance resembles `overview-mockup-01.png`.
- The screen reads as Chapter 2, not a variant of the Hero.
- The navbar is a floating command shell with Chapter 2 active.
- The title and teaching paragraph are centered and dominant.
- The side panels match the selected-relationship and why-it-matters roles.
- The central system diagram includes all six required node groups.
- Lens controls appear at the bottom with `System Framing` active.
- The connection legend is visible and understandable.
- The next-card points to `UN Command Center`.
- The design remains readable at the `1536 x 1024` reference size.
- Keyboard focus, semantic headings, and reduced-motion fallbacks are preserved.
