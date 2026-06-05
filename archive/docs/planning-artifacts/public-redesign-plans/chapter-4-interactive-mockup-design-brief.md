# Chapter 4 Interactive Mockup Design Brief

Status: Draft reference brief  
Last updated: 2026-06-05  
Scope: Visual and interaction brief for the Chapter 4 interactive mockup concept

## Reference

Primary reference image:

- [chapter-4-interactive-mockup-01.png](../generated-mockups/public-homepage-redesign/chapter-4-interactive-mockup-01.png)

This brief uses the generated mockup above as the visual reference for the next interactive direction of `West Philippine Sea Case File`.

## Purpose

Chapter 4 should feel like the most evidence-driven and investigation-oriented chapter in the four-chapter learning flow.

The goal is not to turn the chapter into a generic dashboard.

The goal is to make the learner feel like they are opening a live case file:

- choose an entry path
- inspect events and locations
- connect legal findings to political reality
- follow the evidence trail
- ask grounded questions without leaving the chapter context

## Design Direction

This concept keeps the approved public homepage tone:

- serious
- editorial
- geopolitical
- cinematic
- evidence-led

The reference mockup should be read as a premium academic case board rather than a playful app or a corporate analytics dashboard.

## UI-UX-Pro-Max Guidance Used

The `ui-ux-pro-max` skill was used as a design support layer for this brief.

Useful guidance retained:

- `Immersive/Interactive Experience` as the pattern direction
- micro-interactions as the preferred interaction style
- visible focus and accessible button states
- clear labels for icon-heavy actions
- safe loading-state treatment for async actions
- minimum touch-friendly target sizing on smaller screens

Guidance intentionally adapted, not copied literally:

- the tool suggested playful educational typography and a light palette that do not fit this repo's Chapter 4 tone
- the reference image already establishes a stronger direction: dark maritime editorial UI with gold and cyan emphasis
- the final design system for this chapter should therefore follow the reference image first and use the skill as a guardrail layer, not as the visual source of truth

## Core Experience

The interaction model shown in the reference mockup has five main jobs:

1. Give the learner a clear starting move.
2. Let the learner move between time, place, and evidence without losing context.
3. Make the legal-versus-political tension inspectable instead of static.
4. Keep source trust visible at all times.
5. Keep chapter-aware chat present as a helper, not a takeover.

## Visual System

### Mood

- dark naval blue foundation
- deep ocean texture and map-grid atmosphere
- gold used for selection, chapter framing, and emphasis
- cyan used for active hotspots, map signals, and guided focus
- white and pale blue typography for contrast and hierarchy

### Typography

- large editorial serif headline for the chapter title
- clean, compact sans-serif for interface labels, metadata, badges, and card controls
- strong hierarchy between chapter title, panel titles, evidence labels, and support text

### Surface Language

- rounded dossier panels
- thin illuminated borders
- subtle inner glow for active states
- layered depth without heavy glassmorphism
- restrained motion cues rather than decorative animation

## Interaction Additions Captured In The Mockup

### 1. Entry Action Strip

Two top-level buttons sit below the subtitle:

- `Open the evidence file`
- `Trace law and power`

These give Chapter 4 the same immediate "click here to begin" energy that earlier chapters already have.

### 2. Clickable Maritime Case Map

The map becomes a real learning control, not only a visual support panel.

Target behavior:

- hotspots for Scarborough Shoal, Spratly Islands, Palawan, and West Philippine Sea
- visible selected location state
- a small contextual tooltip explaining why the selected location matters
- map selection should sync with timeline and evidence state

### 3. Timeline-To-Map Synchronization

The timeline should drive more than a text swap.

Target behavior:

- selected event glows clearly
- the selected event visually links to a relevant map location
- state changes should also update the evidence tray where appropriate

### 4. Richer Evidence Inspector

The evidence panel should feel like a real dossier surface.

Target behavior:

- category cards remain the primary entry controls
- one active evidence tray expands below them
- show source chips or badges
- show a current-state tag such as `Linked to 2016 ruling`
- include a clear call to action like `View source excerpts`

### 5. Interactive Ruling vs Reality

This panel should not remain a static comparison wall.

Target behavior:

- one active row can expand into deeper explanation
- the expanded state can show a short rationale plus a citation chip
- the rest of the rows remain visible and selectable

### 6. Chapter-Aware Chat Dock

The chat should feel attached to the case file instead of floating as a global afterthought.

Target behavior:

- visible dock at lower right
- clear label: `Ask a question about this chapter`
- starter prompt chips tied to Chapter 4
- chapter-aware grounding preserved when the learner asks about the ruling, evidence, or enforcement gap

## Information Hierarchy

The reference mockup establishes this reading order:

1. chapter title and thesis
2. entry actions
3. timeline, map, and ruling gap as the main reasoning surfaces
4. evidence inspector as the proof layer
5. final thesis as synthesis
6. references and trust guide as credibility anchors
7. chat as optional guided assistance

This order should be preserved in future implementation work.

## Accessibility And UX Guardrails

The interaction layer should keep the current public-homepage accessibility posture.

Required guardrails:

- all icon-only actions need accessible names
- all new controls need visible focus states
- clickable cards and hotspots should have touch-safe sizing on smaller layouts
- async actions such as chat submit or excerpt loading must prevent repeated accidental clicks
- reduced-motion behavior should keep meaning without relying on animation
- the chapter must remain usable even if chat or enhanced data views fail

## Implementation Notes

This brief is a design reference, not an implementation commitment.

If implementation starts, prefer this rollout order:

1. entry action strip
2. map hotspots synced with timeline and evidence
3. richer evidence detail tray
4. expandable `Ruling vs Reality`
5. integrated Chapter 4 chat dock

This order keeps the biggest learning payoff early while avoiding an oversized first implementation slice.

## Recommendation

Treat the reference mockup as the preferred visual target for the next Chapter 4 interaction pass.

Use `ui-ux-pro-max` as a supporting system for:

- interaction quality
- accessibility guardrails
- responsive treatment
- state clarity

Do not let generic skill output override the stronger editorial direction already established by the Chapter 4 mockup and the broader public-homepage redesign language.
