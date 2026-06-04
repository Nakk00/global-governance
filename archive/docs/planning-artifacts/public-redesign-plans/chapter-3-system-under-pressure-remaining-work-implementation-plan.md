# Chapter 3 System Under Pressure Remaining Work Implementation Plan

Status: Strengthened draft implementation plan
Last updated: 2026-06-04
Scope: Finish the remaining implementation work for Chapter 3, `The System Under Pressure`
Primary scope source: `archive/docs/planning-artifacts/public-redesign-plans/chapter-3-system-under-pressure-remaining-work.md`

## Purpose

This plan converts the Chapter 3 remaining-work analysis into a code-aware implementation sequence grounded in the current frontend architecture.

It is meant to guide the next build pass for Chapter 3 while staying aligned with:

- the approved redesign direction
- the richer Chapter 3 mockup
- the UI reference spec created from that mockup
- the actual current component, data, navigation, and test seams in the repo

## Active Inputs

Treat these as active implementation inputs, not background reading.

### Planning and visual inputs

- `archive/docs/planning-artifacts/public-redesign-plans/chapter-3-system-under-pressure-remaining-work.md`
- `archive/docs/planning-artifacts/public-redesign-plans/chapter-3-system-under-pressure-ui-reference-spec.md`
- `archive/docs/planning-artifacts/generated-mockups/public-homepage-redesign/chapter-3-system-under-pressure-remaining-work-mockup-01.png`

### Current production and test inputs

- `src/components/modules/UNCommandCenter/UNCommandCenter.tsx`
- `src/data/sections/un-command-center.ts`
- `src/data/navigation.ts`
- `src/contexts/NavigationContext.tsx`
- `src/components/modules/UNCommandCenter/UNCommandCenter.test.tsx`
- `tests/e2e/public-homepage-four-chapter-chapter3.smoke.spec.ts`

### Code intelligence inputs used to strengthen this plan

- `graphify-out-merged/GRAPH_REPORT.md`
- `graphify-out/GRAPH_REPORT.md`
- GitNexus context and impact analysis for:
  - `UNCommandCenter`
  - `setActiveChapterPanel`

## Current Codebase Reality

The current Chapter 3 surface is already visually substantial, but it is still missing the main payoff promised by the redesign.

Confirmed current-state findings:

- `UNCommandCenter` currently stores room selection in local `useState` via `selectedOrganId`.
- The richer institution content already exists in `unOrgans` and is ready to support a visible educational detail stage.
- Chapter 3 already has a shell-level `defaultPanelId` of `general-assembly` in `src/data/navigation.ts`.
- Shared chapter panel state already exists in `NavigationContext` through `activePanelByChapter` and `setActiveChapterPanel`.
- Current unit coverage proves the existing selector toggle and chapter shell, but it does not yet prove a true center detail panel contract.
- Current Chapter 3 Playwright smoke coverage proves chapter navigation, pressure diagram visibility, and mobile containment, but it does not yet prove the richer selected-institution explorer behavior.

This means the remaining work is not content creation. It is primarily:

1. component composition
2. state model alignment
3. semantics and accessibility refinement
4. test contract expansion to cover the intended richer explorer

## Architecture Notes From Graphify And GitNexus

### Graphify takeaways

- The frontend graph shows navigation as a real cross-cutting area rather than a Chapter 3-specific detail.
- `NavigationProvider`, `useNavigation`, and related helpers sit in a shared community that already coordinates hash routing, section focus, and chapter state behavior.
- Chapter sections and mockup-style modules already share broad styling and layout conventions, so Chapter 3 should be deepened within the current shell rather than rebuilt as a special one-off.

### GitNexus takeaways

- `UNCommandCenter` is isolated enough to change safely from a code-coupling perspective; upstream impact came back `LOW`.
- GitNexus found only direct checked-in unit test coupling for `UNCommandCenter`, which means most execution risk is behavioral and UX-oriented rather than call-graph complexity.
- `setActiveChapterPanel` also showed `LOW` upstream impact, reinforcing that the risk is not broad breakage in the graph but correctness of navigation-state usage and test alignment.

### Practical implication

The work is low-risk in graph blast radius, but medium-risk in UX contract drift because:

- the component is user-facing
- it participates in hash-driven chapter navigation
- it has responsive and accessibility expectations
- the existing tests currently under-describe the richer redesign target

## Desired End State

Chapter 3 should feel like a finished institutional explorer rather than a visually polished placeholder.

At the end of this work:

- selecting an institution room reveals a clearly visible structured detail stage in the center column
- that selection is driven by shared chapter panel state instead of isolated local-only state
- the component still preserves the existing chapter shell, pressure diagram, constraints panel, and chapter navigation strip
- the implementation matches an intentional richer explorer contract in unit and browser tests
- responsive, reduced-motion, and keyboard behavior remain strong after the center panel is added
- stale transition or naming leftovers are intentionally resolved instead of left ambiguous

## Confirmed Gaps To Close

### Gap 1: Missing center educational payoff

The data model already includes `role`, `power`, `limit`, and `whyItMatters`, but the live component only announces the selected room through visually hidden text.

### Gap 2: Selection state is too local

The live component uses `useState(unOrgans[0]?.id)` instead of the existing shared chapter-panel model even though Chapter 3 already has `defaultPanelId: "general-assembly"`.

### Gap 3: Test coverage is shallower than the redesign target

Current tests prove the shell and selector toggling, but not the richer center-stage explorer behavior implied by the remaining-work analysis and UI reference spec.

### Gap 4: Transition and naming scaffolding remains unresolved

`constraintsTransition` is still present in active section data even though the current live component does not obviously use it as a meaningful chapter transition surface.

## Delivery Strategy

Recommended order:

1. lock the implementation target using the remaining-work note, mockup, and UI reference spec
2. build the visible selected-institution detail stage inside the current Chapter 3 shell
3. migrate selection from local state into shared chapter panel state
4. align semantics and test coverage with the richer explorer contract
5. clean up unused transition or naming leftovers
6. run focused verification at the smallest effective test layers first

This keeps the most visible learning payoff first while avoiding premature test churn before the component shape is settled.

## Implementation Map

### Primary production files likely to change

- `src/components/modules/UNCommandCenter/UNCommandCenter.tsx`
- `src/data/sections/un-command-center.ts`

### Shared-state integration files that may change

- `src/contexts/NavigationContext.tsx` only if current shared APIs are insufficient
- `src/hooks/useNavigation.ts` if Chapter 3 adopts the shared hook directly

### Tests likely to change or expand

- `src/components/modules/UNCommandCenter/UNCommandCenter.test.tsx`
- `tests/e2e/public-homepage-four-chapter-chapter3.smoke.spec.ts`
- possibly a new or split browser spec if richer Chapter 3 interaction grows beyond smoke intent

### Files that should remain unchanged unless implementation evidence forces it

- `src/data/navigation.ts`
- global chapter shell structure in `src/App.tsx`
- unrelated chapter modules

## Phase 1: Lock The Implementation Target

Goal:

- confirm the final Chapter 3 shape before changing state or tests

Tasks:

- re-read the remaining-work note and UI reference spec
- keep the mockup image open during implementation review
- define which current layout zones remain stable:
  - heading block
  - left institution selector
  - center teaching stage
  - right constraints panel
  - bottom chapter strip
- explicitly decide whether the center stage replaces the diagram as the main focal element or coexists with it as the dominant detail surface
- document the intended responsive order for mobile before implementation begins

Deliverable:

- a locked implementation target for the live Chapter 3 surface

Exit condition:

- the team can describe the final desktop and mobile structure without ambiguity

## Phase 2: Build The Visible Selected-Institution Detail Stage

Goal:

- turn room selection into visible learning content

Tasks:

- add a true center-column selected-institution detail stage in `UNCommandCenter`
- render the selected institution's:
  - `Role`
  - `Scope of power`
  - `Limitation`
  - `Why it matters`
- preserve strong visible linkage between the selected room button and the center stage
- ensure the selected institution name remains obvious at a glance
- keep the copy broken into compact blocks rather than a single prose slab
- preserve the existing pressure diagram as supporting context unless implementation review shows it must be visually rebalanced

Implementation notes:

- reuse the existing `unOrgans` structure; do not invent a second source of truth
- prefer semantic headings, definition-style grouping, or equivalent structured markup over generic paragraph stacks
- treat the current `aria-live` text as fallback support, not the main experience

Deliverable:

- a visible selected-institution teaching stage that matches the redesign intent

Exit condition:

- selecting a room changes visible structured content in the center of the chapter

## Phase 3: Move Room Selection Into Shared Chapter Panel State

Goal:

- align Chapter 3 behavior with the shell's shared chapter panel model

Tasks:

- replace local `selectedOrganId` state with shared chapter panel state
- read the active panel for `un-command-center` from navigation state
- use `general-assembly` from `src/data/navigation.ts` as the default fallback
- validate fallback behavior when the stored panel id is missing or invalid
- ensure state remains stable through:
  - direct `#un-command-center` entry
  - previous/next chapter navigation
  - browser history and hash revisit flows
  - multiple visits within one session

Implementation notes:

- prefer the shared navigation pattern already exercised by Chapter 2 tests instead of inventing Chapter 3-only state rules
- avoid broadening `NavigationContext` unless the current API truly cannot express the behavior
- if a normalization helper is needed to map panel ids to `unOrgans`, keep it local to the Chapter 3 module unless another chapter clearly needs the same abstraction

Deliverable:

- Chapter 3 selection state owned by the shared navigation model

Exit condition:

- room selection is no longer stored only in local component state

## Phase 4: Align Semantics And Tests With The Richer Explorer Contract

Goal:

- bring the production surface and checked-in tests into the same intentional contract

Tasks:

- strengthen `UNCommandCenter` unit tests to prove:
  - the default panel resolves to `general-assembly`
  - invalid stored panel ids fall back safely
  - clicking a room updates the shared panel state
  - the center detail stage exposes all four content blocks for the selected institution
- extend browser smoke coverage only for the core user-visible guarantees:
  - room selector remains visible
  - selecting a room reveals the correct visible detail content
  - chapter remains focused and contained after navigation
- keep repeated rule matrices and edge-state validation in Vitest instead of bloating Playwright

Recommended direction:

- make the component meet the richer explorer contract rather than shrinking tests to the current placeholder behavior

Why:

- it matches the redesign plan
- it matches the mockup and UI spec
- it uses content already present in `unOrgans`
- it avoids locking in an incomplete implementation through underpowered tests

Deliverable:

- unit and browser tests that describe the same finished Chapter 3 experience

Exit condition:

- no meaningful mismatch remains between implementation intent and checked-in test expectations

## Phase 5: Resolve Transition And Naming Leftovers

Goal:

- remove ambiguity that will otherwise keep polluting future planning and maintenance

Tasks:

- decide whether `constraintsTransition` is still part of the intended Chapter 3 runtime experience
- if not needed, remove it from active production data
- if still needed, give it a visible runtime role and corresponding verification
- confirm active production naming consistently uses:
  - `The System Under Pressure`
  - `West Philippine Sea Case File`
- ignore purely archival naming unless it leaks into live code or tests

Deliverable:

- production-facing Chapter 3 data and naming that reflect intentional choices

Exit condition:

- no active leftover artifact exists without a clear runtime purpose

## Phase 6: Accessibility, Motion, And Responsive Verification

Goal:

- prove the richer Chapter 3 surface still holds up across supported interaction modes

Tasks:

- verify visible focus on room selectors and any center-stage controls
- verify selection can be understood without color alone
- verify logical reading and tab order after the center panel is introduced
- verify reduced-motion behavior for state changes
- verify mobile containment, readable spacing, and no horizontal overflow
- verify the teaching order still makes sense when the desktop three-column structure collapses

Focus areas from the UI reference spec:

- active state must not rely on color alone
- reduced motion must preserve structure and meaning
- mobile simplification must not destroy the left-to-center-to-right teaching sequence

Deliverable:

- confirmed accessibility and responsive stability for the richer Chapter 3 implementation

Exit condition:

- the enhanced chapter remains usable and legible across desktop, tablet, mobile, and reduced-motion contexts

## Verification Plan

Follow the repo's preferred fast-to-slower test layering.

### Primary verification

1. `pnpm test:unit`
2. `pnpm test:e2e`
3. `pnpm lint`
4. `pnpm typecheck`
5. `pnpm build`

### Add-on verification when layout changes are substantial

- `pnpm test:e2e:layout`

### What each layer should prove

- `pnpm test:unit`
  - panel-state fallback behavior
  - visible selected-institution content
  - state updates through navigation context
  - accessible names and region semantics that do not need a real browser
- `pnpm test:e2e`
  - actual chapter navigation
  - focus behavior after hash navigation
  - visible mobile containment
  - one or two critical Chapter 3 explorer flows
- `pnpm test:e2e:layout`
  - optional containment and layout sweeps if the center stage materially changes responsive composition

## Risks To Watch

### Risk 1: The center stage becomes too dense

Why:

- the redesign adds four instructional content blocks, and the current chapter already has a pressure diagram competing for attention

Mitigation:

- keep content segmented and compact
- give the selected institution stage stronger hierarchy than the diagram
- preserve short summaries in the left selector so the center stage carries the deeper explanation

### Risk 2: Shared-state migration introduces subtle fallback bugs

Why:

- the chapter will move from simple local state into a hash-aware shared navigation model

Mitigation:

- explicitly test invalid-panel fallback and default-panel initialization in Vitest
- validate revisit behavior through browser navigation instead of assuming it from unit tests

### Risk 3: Browser tests stay too weak for the intended redesign

Why:

- current smoke coverage proves navigation and containment, but not the central explorer payoff

Mitigation:

- add only the minimum browser assertions that prove the user can actually experience the richer Chapter 3 state change
- keep deep state matrices in unit tests

### Risk 4: Unused scaffolding survives the implementation pass

Why:

- `constraintsTransition` and older naming artifacts can survive if they are treated as cleanup for later

Mitigation:

- treat cleanup as part of the same delivery pass, not a postscript

## Recommended Build Order

1. Lock the final live structure against the mockup and UI spec.
2. Add the visible center detail stage using existing `unOrgans` content.
3. Move selection into shared chapter panel state.
4. Strengthen unit coverage around fallback and shared-state behavior.
5. Add or refine minimal browser coverage for the richer explorer contract.
6. Remove or intentionally wire any leftover transition and naming artifacts.
7. Run repo-standard verification and optional layout coverage if needed.

## Definition Of Done

Chapter 3 is ready for sign-off when:

- institution selection visibly updates a structured center detail stage
- the detail stage communicates role, scope of power, limitation, and why it matters
- Chapter 3 selection state participates in shared chapter navigation state
- default and invalid-panel fallback behavior are covered by unit tests
- browser coverage proves the richer explorer interaction at least once in the real shell
- keyboard, focus, reduced-motion, and responsive containment remain sound
- no active transition or naming artifact remains without an intentional runtime reason

## Working Note

Use this plan together with:

- `chapter-3-system-under-pressure-remaining-work.md`
- `chapter-3-system-under-pressure-ui-reference-spec.md`
- `chapter-3-system-under-pressure-remaining-work-mockup-01.png`

If any of those inputs change, or if the Chapter 3 component, navigation model, or relevant tests change materially before implementation starts, refresh this plan against the latest code and rerun Graphify and GitNexus context checks.
