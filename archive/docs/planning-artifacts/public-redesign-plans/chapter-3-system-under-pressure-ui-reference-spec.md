# Chapter 3 System Under Pressure UI Reference Spec

Status: Visual reference spec
Last updated: 2026-06-04
Input reference image: `archive/docs/planning-artifacts/generated-mockups/public-homepage-redesign/chapter-3-system-under-pressure-remaining-work-mockup-01.png`
Method: Reference-image analysis plus `ui-ux-pro-max` design-system guidance

## Purpose

This file translates the Chapter 3 mockup into an implementation-friendly UI reference before engineering planning begins.

It is not a backlog checklist.
It is a visual and interaction contract for what the finished Chapter 3 should feel like if we implement the remaining work from:

- `archive/docs/planning-artifacts/public-redesign-plans/chapter-3-system-under-pressure-remaining-work.md`

## Reference Summary

The reference image shows a stronger final form of Chapter 3 than the current live implementation.

Its core improvement is simple and important:

- the institution selector now has a real visible payoff
- the selected institution opens a central educational detail surface
- the chapter still preserves the pressure model and constraints logic around it

This gives the page a clearer three-part teaching structure:

1. institution entry
2. selected institution understanding
3. political constraints and system outcomes

## UI UX Pro Max Readout

The `ui-ux-pro-max` search pass produced a useful base, but it needs adaptation to match the actual reference.

Useful outputs:

- pattern direction: narrative chapter progression with visible progress
- typography recommendation: `Crimson Pro` for headings and `Atkinson Hyperlegible` for body copy
- accessibility priorities: reduced motion, visible focus, logical tab order

What should not be adopted literally:

- the generated `Liquid Glass` style recommendation is too fluid and luxury-SaaS-coded for this chapter
- the light background recommendation does not fit the approved dark command-room visual language

Final interpretation:

- keep the strong narrative chapter structure from the tool
- keep the serif-plus-accessible-sans typography logic
- reject the lighter glassmorphism direction
- stay anchored in the darker institutional control-room aesthetic already established by the redesign

## Visual Direction

### Overall Mood

The page should feel like:

- a geopolitical command room
- a museum-grade educational exhibit
- a premium but serious public learning surface

It should not feel like:

- a corporate SaaS analytics dashboard
- a generic dark landing page
- a decorative sci-fi fantasy scene without educational structure

### Visual Identity

The identity in the reference image is built from:

- deep blue-black environmental background
- restrained gold for emphasis and pressure-related ideas
- cool electric blue for navigation, active state, and institution detail
- bright ivory serif display type for the main title

This is a high-contrast chapter with two active signal colors:

- blue for structure, coordination, selection, and navigation
- gold for pressure, limits, outcomes, and warning-weight concepts

### Typography

Recommended implementation direction:

- display heading: `Crimson Pro`
- body and UI copy: `Atkinson Hyperlegible`

Why this pairing fits:

- the serif heading keeps the chapter feeling editorial, civic, and intellectually grounded
- the body font keeps dense educational copy readable inside smaller panels

Typography behavior:

- the H1 should remain large and cinematic
- panel headings should be compact and crisp
- body text should avoid long line lengths
- all labels should stay highly readable on dark surfaces

## Layout Structure

The mockup resolves into five major horizontal bands:

1. top command bar navigation
2. chapter heading zone
3. main teaching grid
4. chapter progress strip
5. persistent utility chat trigger

### Main Teaching Grid

The core content area is a three-column composition:

1. left selector rail
2. center selected-institution detail stage
3. right constraints panel

This is the most important structural decision in the mockup.

The chapter works because the center column is no longer empty atmosphere.
It becomes the instructional heart of the screen.

## Component Breakdown

### 1. Top Chapter Command Bar

Purpose:

- orient the learner in the four-chapter journey
- make Chapter 3 clearly active
- keep the shell consistent with the rest of the redesigned homepage

Key traits from the mockup:

- dark glass-like shell
- numbered chapter links
- strong active highlight around Chapter 3
- progress summary at the right
- compact utility icons after progress

Implementation note:

- this should stay visually slimmer than the main content stage
- it acts as orientation, not the hero surface

### 2. Chapter Heading Block

Purpose:

- present the chapter title with enough scale to preserve narrative weight
- frame the chapter before the user starts exploring institutions

Key traits:

- centered `CHAPTER 3` eyebrow
- very large serif title
- blue subtitle line directly beneath

Implementation note:

- the subtitle is doing important explanatory work
- it should remain visible even when the rest of the page becomes denser

### 3. Left Institution Rooms Selector

Purpose:

- provide the entry points into the UN system
- make the chapter feel spatial and explorable

Key traits:

- stacked room cards
- icon plus label plus short summary
- one selected state with strong blue emphasis
- clear tap target sizing

Visual behavior:

- idle cards are dark and recessed
- selected card gains edge glow, brighter stroke, and stronger contrast
- the selector panel itself reads as a distinct control area, not a decorative sidebar

Content behavior:

- each row should preview the room in a single line or two
- this panel should not try to carry the full educational explanation

### 4. Center Selected Institution Detail Stage

Purpose:

- provide the visible educational payoff for room selection
- turn a button press into a meaningful teaching moment

This is the single most important addition in the mockup.

Required structure:

- detail title such as `Security Council details`
- selected-state badge such as `Selected room: Security Council`
- four clearly separated content blocks:
  - `Role`
  - `Scope of power`
  - `Limitation`
  - `Why it matters`

Why this matters:

- it converts chapter interaction into learning
- it visualizes the missing work already identified in the Chapter 3 remaining-work note
- it makes the room metaphor feel real instead of purely presentational

Visual traits:

- this panel should feel like a central analysis surface
- stronger framing than the left selector rail
- enough spacing for reading without becoming plain article text
- subtle iconography is welcome if it clarifies categories

Content behavior:

- copy should stay concise and scannable
- each block should deliver one distinct idea
- do not collapse all four blocks into one paragraph

### 5. Pressure Flow Diagram

Purpose:

- connect institution detail back to the chapter's larger systems lesson

Flow:

- `Rules`
- `Institutions`
- `State Choices`
- `Outcomes`

Visual traits:

- compact horizontal chain
- blue on the coordination side
- gold on the pressure side
- labeled `PRESSURE FLOW` and `PRESSURE` band

Implementation note:

- the diagram should remain secondary to the selected-institution detail stage
- it explains system logic after the learner understands the room they selected

### 6. Right Constraints Panel

Purpose:

- show why institutions do not automatically control outcomes

Content list:

- Consent
- Veto
- Political Will
- Leverage
- Uneven Enforcement

Visual traits:

- gold-framed emphasis surface
- repeated card rhythm for each constraint
- strong closing statement at the bottom

Content behavior:

- each constraint should stay short and memorable
- this panel should read like a pressure ledger, not like a text essay

### 7. Bottom Chapter Progress Strip

Purpose:

- preserve orientation without forcing the user back to the top nav
- maintain the chapter-journey feeling

Key traits:

- chapter cards across the full width
- Chapter 3 active state
- explicit next-step card for Chapter 4

Implementation note:

- this strip should remain low-profile enough not to steal attention from the main grid
- it works best as a persistent narrative footer

## Interaction Guidance

### Primary Interaction

The main interaction is room selection.

Expected behavior:

- selecting a room updates the center detail stage
- the selected card becomes visually active
- the detail content changes without disorienting the user

### Motion

Use motion sparingly and meaningfully.

Recommended motion:

- soft emphasis transition on room selection
- controlled fade or slide for detail content change
- subtle glow transitions on active states

Avoid:

- oversized parallax
- dramatic panel flights
- multiple moving zones changing at once

### Reduced Motion

The UX guidance from `ui-ux-pro-max` strongly supports keeping reduced-motion behavior first-class.

Required reduced-motion behavior:

- keep the same layout
- keep the same visible state changes
- replace animated transitions with calmer opacity or instant swaps
- do not remove the educational structure when motion is reduced

### Keyboard and Focus

Required behavior:

- tab order should follow visible order
- room cards need strong visible focus
- active room state must be distinguishable from focus state
- the center detail stage should update in a way that remains clear to keyboard users

## Content Rules

### Writing Tone

The copy should feel:

- serious
- public-facing
- educational
- concise

It should not feel:

- corporate
- overly academic in sentence length
- ornamental

### Density

The reference image succeeds because it keeps high information density without looking cramped.

Rules:

- use short paragraphs
- cap line length inside detail blocks
- let labels carry structure
- prefer one idea per block

## Accessibility Rules

From the mockup and the `ui-ux-pro-max` UX guidance, these are non-negotiable:

- visible focus rings on all room cards and nav controls
- reduced-motion support via `prefers-reduced-motion`
- keyboard access to all chapter interactions
- high contrast on all dark surfaces
- readable text sizing inside panels
- no reliance on color alone to indicate active state

## Responsive Behavior

Desktop target:

- preserve the three-column relationship
- center detail stage should remain dominant

Tablet target:

- left selector can stay left if width allows
- otherwise stack selector above detail stage

Mobile target:

- selector first
- selected detail stage second
- pressure flow third
- constraints panel after
- bottom chapter strip remains readable and contained

Important rule:

- mobile should simplify the composition without destroying the teaching order

## Implementation Implications

If we build toward this reference, Chapter 3 likely needs:

- a visible institution detail panel
- shared chapter-panel state instead of isolated local-only selection state
- alignment between implementation and existing richer Playwright expectations
- re-verification of keyboard, reduced-motion, and mobile behavior

This matches the unfinished areas already captured in:

- `chapter-3-system-under-pressure-remaining-work.md`

## Definition Of Visual Match

We should consider implementation visually aligned with this reference when:

- the selected institution has a clearly visible detail surface
- the page still reads as one unified chapter, not three unrelated panels
- blue and gold are used with discipline and meaning
- the center column becomes the instructional anchor of the screen
- the constraints panel still feels strong without overpowering the institution detail
- the chapter remains readable and stable on smaller screens

## Recommended File Role

Use this file as:

- the visual-reference artifact before implementation planning
- the discussion anchor when refining Chapter 3 scope
- the handoff note for UI implementation decisions

Do not use this file as a task tracker or verification log.
