# Chapter 3 System Under Pressure Remaining Work

Status: Analysis snapshot
Last updated: 2026-06-04
Scope: Remaining implementation work for Chapter 3, `The System Under Pressure`
Source of comparison: `archive/docs/planning-artifacts/public-redesign-plans/public-homepage-redesign-proposal.md`

## Purpose

This file captures what still appears to be unfinished in Chapter 3 after comparing:

- the approved redesign proposal
- the current production code
- the current navigation model
- the current test expectations

Use this as a practical follow-up artifact for implementation planning, cleanup, or verification.

## Current State Summary

Chapter 3 is already partially implemented in production.

What is clearly done:

- the old `UN Command Center` and `Governance Limits` structure has been merged into the production Chapter 3 label, `The System Under Pressure`
- the four-chapter public navigation is already live
- legacy `#governance-limits` hashes redirect into Chapter 3
- the chapter already has a custom full-screen visual implementation
- the chapter already includes:
  - institution-room selection
  - a pressure diagram
  - a constraints panel
  - next-step navigation into the West Philippine Sea chapter

What is not clearly complete:

- the institution explorer does not yet expose the full body-specific teaching content in the visible UI
- the chapter does not appear to use the shared chapter-panel state model
- the richer internal comparison or explorer surface expected by tests is not fully present in the current component
- a planned transition layer exists in data but is not wired into the page flow

## Key Conclusion

Chapter 3 is not empty or blocked. It is already a real shipped chapter.

However, it still appears short of the proposal's fuller target for:

- explorable institution depth
- visible body-specific educational detail
- stronger internal chapter-state behavior
- complete alignment between current implementation and checked-in browser test expectations

## Remaining Work

## 1. Render the selected institution details visibly

Proposal alignment:

- Chapter 3 should feel spatial, memorable, and explorable
- body selection should reveal meaningful institution-specific teaching content
- the chapter should focus on visual explanation of what each body does

Current gap:

- the selected institution changes locally
- but the selected institution's detailed content is only surfaced through an `sr-only` live region
- the visible UI does not currently show the selected organ's `role`, `power`, `limit`, and `whyItMatters`

Why this matters:

- the data model already contains the depth
- the current UI gives the learner selection controls without the full visible payoff
- this is the clearest gap between proposal intent and current implementation

Suggested completion target:

- add a visible selected-organ detail panel
- render the current organ's:
  - role
  - scope of power
  - limitation
  - why it matters
- keep the current accessibility support, but stop relying on screen-reader-only output as the main detail surface

## 2. Align Chapter 3 with the shared panel-state navigation model

Proposal alignment:

- dense chapters can use internal sub-navigation instead of returning to long-scroll behavior
- chapter-state navigation is part of the redesign direction

Current gap:

- `NavigationContext` already supports chapter panel state
- `src/data/navigation.ts` already assigns Chapter 3 a `defaultPanelId`
- but the `UNCommandCenter` component currently uses local `useState` instead of shared chapter panel state

Why this matters:

- the component works visually, but it is less integrated with the shell than Chapter 2
- shared state would better support deep links, consistency, persistence, and future internal navigation controls

Suggested completion target:

- switch organ selection to use `activePanelByChapter` and `setActiveChapterPanel`
- preserve a clean default fallback for the initial panel
- keep keyboard and focus behavior stable after the state-model change

## 3. Reconcile the current component with existing Playwright expectations

Proposal alignment:

- Chapter 3 should support a richer explorable room metaphor
- the interaction should be clear across desktop, mobile, and reduced-motion states

Current gap:

- checked-in Playwright specs expect a richer comparison or explorer surface than the current component visibly renders
- tests refer to structures such as:
  - `Inspect the rooms of the UN system`
  - `General Assembly details`
  - `Security Council details`
  - `Scope of power`
  - `Limitation`
  - `Why it matters`
- those visible structures are not fully represented in the current production component

Why this matters:

- this suggests either unfinished implementation or stale test intent
- as long as those disagree, Chapter 3 remains partially unresolved even if it looks acceptable in manual review

Suggested completion target:

- choose one of two paths:
  1. implement the richer explorer layout that the tests already describe
  2. simplify or rewrite the tests if the current lighter-weight chapter is the intended final product

Recommended direction:

- prefer implementing the richer explorer, because it better matches both the proposal and the existing data model

## 4. Decide whether the chapter needs an explicit internal transition layer

Proposal alignment:

- Chapter 3 should explain institutions and limits together
- internal controlled progression is allowed for dense chapters

Current gap:

- `constraintsTransition` exists in Chapter 3 data
- but the shared transition map is currently empty, so that transition is never rendered
- the chapter currently places institution rooms, pressure logic, and constraints on one composed surface

Why this matters:

- the current implementation may be sufficient as a single-screen synthesis
- but the presence of unused transition data suggests the chapter may have been intended to include one more guided step or internal bridge

Suggested completion target:

- decide whether to:
  1. fully remove unused transition content if the single-screen composition is final
  2. wire the transition into the chapter flow if a guided internal layer is still desired

## 5. Strengthen the institution-room metaphor beyond label selection

Proposal alignment:

- the chapter should use an interactive chamber or room metaphor
- it should create memorable navigation between institutional roles and responsibilities

Current gap:

- the room selector is present
- but the selected-room experience is still fairly light
- there is not yet much visible sense of "entering" or "inspecting" a room beyond pressing a button

Why this matters:

- the visual shell is strong, but the interaction payoff is still modest compared with the proposal's ambition

Suggested completion target:

- make room selection feel more like entering a focused institutional surface
- this could be done without overcomplicating the chapter by adding:
  - a visible selected-room detail area
  - stronger emphasis states
  - a more explicit explorer region label
  - controlled transitions between selected institutions

## 6. Verify reduced-motion and keyboard behavior against the richer Chapter 3 target

Proposal alignment:

- reduced motion must preserve structure and meaning
- keyboard reachability and visible focus are architectural constraints

Current gap:

- the chapter already includes basic button interaction and focusable navigation
- but the richer explorer behavior expected by tests implies more detail surfaces and more state changes than the current visible UI exposes

Why this matters:

- if Chapter 3 gains the missing visible detail panel and shared panel state, those behaviors need verification again

Suggested completion target:

- verify:
  - tab order through selector controls
  - visible focus on institution buttons
  - state updates through keyboard activation
  - reduced-motion treatment for selection-state changes
  - mobile containment after richer detail content is added

## 7. Clean up proposal-era naming leftovers where necessary

Proposal alignment:

- production naming should consistently reflect the four-chapter deadline version

Current gap:

- production Chapter 3 naming is already updated
- but there are still proposal-era or mockup-era references to older chapter names in supporting materials and mockup data

Why this matters:

- not all of these are production blockers
- but they can create confusion during future implementation passes

Suggested completion target:

- keep production code and active tests aligned with:
  - `The System Under Pressure`
  - `West Philippine Sea Case File`
- treat older six-chapter naming in mockups or archival planning files as non-blocking unless those files are still being used as active implementation inputs

## Recommended Priority Order

1. Render the selected institution details visibly.
2. Reconcile Chapter 3 with current Playwright expectations.
3. Move organ selection into shared chapter-panel state.
4. Decide whether the unused `constraintsTransition` should be wired or removed.
5. Re-verify keyboard, reduced-motion, and mobile behavior after the richer explorer lands.

## Practical Definition Of Done

Chapter 3 should be considered closer to complete when all of the following are true:

- the learner can select an institution room and see visible body-specific details
- the visible detail surface clearly explains role, power, limitation, and why it matters
- Chapter 3's internal state is consistent with the shell's chapter-state model
- browser tests and production UI agree on what the chapter actually contains
- keyboard, reduced-motion, and mobile behavior still pass after the richer explorer is added
- no stale transition or unused implementation scaffolding remains without an intentional reason

## Working Note

This artifact reflects a comparison between the current codebase and the proposal as of `2026-06-04`.

It should be updated if:

- Chapter 3 receives a richer institution detail surface
- the test contract is intentionally simplified
- the chapter-panel state model is wired in
- the proposal direction for Chapter 3 changes
