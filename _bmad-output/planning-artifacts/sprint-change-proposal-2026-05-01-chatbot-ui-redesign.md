# Sprint Change Proposal - Chatbot UI Redesign and Session History Alignment

**Project:** Global-Governance  
**Date:** 2026-05-01  
**Workflow:** `bmad-correct-course`  
**Mode:** Batch  
**Status:** Approved for planning-artifact update

## 1. Issue Summary

### Problem Statement

The current sprint plan and planning artifacts do not yet account for a major chatbot UI direction change that is now concrete and implementation-relevant.

The newly confirmed direction adds four specific requirements:

- a near-reference premium chatbot visual target
- a provided atmospheric background asset for the chat surface
- a true visible chat-history experience inside the UI
- a committed navy / gold / teal design direction

The current product direction already supports a bounded source-aware assistant, but the backlog still treats the richer chat presentation mostly as future polish. The current implementation also stores only one active answer state at a time rather than a visible message history.

### Trigger Context

This issue surfaced during pre-planning review of the chatbot redesign request after the current chat implementation and planning artifacts were mapped against the new reference image and background asset.

### Evidence

- The current chat component uses a single `answerState` rather than a message transcript in `src/components/chat/SourceAwareChat.tsx`.
- The current chat shell is already functional and typed, but its UI composition is much plainer than the approved visual target.
- The UX spec already expects a chat `message list`, but the current implementation does not yet render a true thread.
- The PRD and UX documents still frame richer chatbot presentation largely as post-MVP polish instead of a pre-demo requirement.
- The user has now provided `archive/images/Chatbot_BG.png` and explicitly selected:
  - recommended icons
  - true chat history
  - navy / gold / teal styling

### Issue Type

- New requirement emerged from stakeholders
- Misalignment between current backlog sequencing and clarified UX target

## 2. Impact Analysis

### Epic Impact

#### Current Epic Affected

Epic `5 Content Stewardship and Demo Reliability` is directly affected.

The new chatbot surface should not replace Stories `5.4` and `5.5`; it should follow them. Retrieval-backed grounding and server-driven suggestions still need to land first so the redesign has stable data and trust cues to render.

#### Future Epic Impact

Epic `6 Adaptive Presentation and Future Expansion` is indirectly affected.

Some chatbot presentation work that was previously implied as future polish is now being pulled forward into MVP, so Epic 6 should retain only deeper enhancements such as answer-depth variation, richer source interaction, and optional continuity beyond session-local history.

### Story Impact

#### Stories That Remain Valid

- `5.4 Orchestrate Retrieval-Backed Grounded Answers`
- `5.5 Add Topic Guard, Safety Guard, and Guided Chat Suggestions`

These remain necessary prerequisites.

#### Stories Requiring Re-sequencing

- `5.6 Rehearse Demo Readiness`
- `5.7 Bootstrap the Working Environment`

These should move later because the chat surface is part of demo readiness and should be finalized before rehearsal.

#### New Story Gap Identified

One missing implementation slice is needed:

1. A dedicated story for the premium source-aware chat redesign with session-local message history

### Artifact Conflicts

#### PRD

The PRD currently treats the chatbot as an integrated grounded assistant, but it does not clearly say the MVP chat surface should include premium onboarding and visible session-local history.

#### Epics

The epic backlog lacks a dedicated story for the redesign and still places demo rehearsal ahead of that UI change.

#### Architecture

The architecture supports the chat feature boundary, but it should explicitly clarify that MVP history is session-local UI continuity, not hidden backend memory or cross-session persistence.

#### UX Design

The UX spec already contains the right structural pattern, but it needs clearer anatomy for:

- premium intro state
- trust badges
- guided topic cards
- session-local thread behavior
- visual direction tied to the provided asset

### Technical Impact

- Frontend chat state will need to expand from one active answer state to a session-local transcript model.
- The chat surface will need a premium onboarding composition and redesigned trigger / dock treatment.
- Source chips and typed fallback states will need to attach to individual assistant messages within a thread.
- No backend conversational memory should be assumed in MVP unless a later story explicitly expands the contract.

## 3. Recommended Approach

### Selected Path

**Direct Adjustment**

Modify the current Epic 5 backlog by inserting one new story after Stories `5.4` and `5.5`, then update the PRD, architecture, UX, and sprint-status artifacts to reflect the clarified MVP chatbot surface.

### Why This Is Recommended

- It preserves the existing retrieval and safety sequencing instead of collapsing design and backend concerns together.
- It keeps the redesign inside MVP where it matters for demo quality.
- It avoids overcommitting to backend conversational memory by defining history as session-local UI continuity.
- It keeps Epic 6 focused on deeper future enhancements rather than basic chat polish that now clearly belongs before demo rehearsal.

### Alternatives Considered

#### Option 2: Potential Rollback

**Not recommended**

Rolling back the existing chat stories is unnecessary because the current shell, typed states, and source-support groundwork remain correct.

Effort: High  
Risk: High

#### Option 3: PRD MVP Review

**Not recommended**

Deferring this redesign fully to post-MVP would leave the main demo chatbot experience materially below the approved visual target and would keep backlog sequencing out of sync with presentation priorities.

Effort: Low  
Risk: Medium to High

### Effort, Risk, Timeline

- Effort: Medium
- Risk: Medium
- Timeline impact: Moderate within Epic 5, with one inserted story before demo rehearsal

## 4. Detailed Change Proposals

### A. Story Backlog Changes

#### Proposal A1 - Add a dedicated premium chat redesign story before demo rehearsal

**Artifact:** `epics.md`  
**Section:** Epic 5 story list

**OLD:**

```md
### Story 5.6: Rehearse Demo Readiness
```

**NEW:**

```md
### Story 5.6: Redesign the Source-Aware Chat Experience

As a learner,
I want the chatbot to feel like a premium course assistant with visible history and guided entry states,
So that I can ask follow-up questions confidently and use the chat naturally during the learning flow and demo.
```

**Rationale:** The redesign is a real implementation slice, not just polish.

#### Proposal A2 - Resequence demo rehearsal and bootstrap after the redesign

**Artifact:** `epics.md` and `sprint-status.yaml`  
**Section:** Epic 5 ordering

**OLD:**

```md
5-6-rehearse-demo-readiness
5-7-bootstrap-the-working-environment
```

**NEW:**

```md
5-6-redesign-the-source-aware-chat-experience
5-7-rehearse-demo-readiness
5-8-bootstrap-the-working-environment
```

**Rationale:** Demo readiness should validate the final intended chat surface, not a pre-redesign version.

#### Proposal A3 - Clarify Story 5.5's frontend expectation

**Artifact:** `epics.md`  
**Section:** Story `5.5` acceptance criteria

**OLD:**

```md
Then it returns approved, section-aware prompt suggestions from a server contract
And the frontend consumes them without introducing privileged logic into browser components
```

**NEW:**

```md
Then it returns approved, section-aware prompt suggestions from a server contract
And the frontend can render them as guided prompt cards or follow-up suggestions without introducing privileged logic into browser components
```

**Rationale:** The server contract should feed the redesigned surface directly.

### B. PRD Modifications

#### Proposal B1 - Move the premium chat surface into explicit MVP scope

**Artifact:** `prd.md`  
**Sections:** MVP scope and MVP feature set

**OLD:**

```md
... a grounded chatbot integrated into the site.
```

**NEW:**

```md
... a grounded chatbot integrated into the site as a premium source-aware course assistant with guided prompt entry and session-local message history.
```

**Rationale:** The chat redesign is now part of the intended demo-ready MVP experience.

#### Proposal B2 - Clarify what remains post-MVP

**Artifact:** `prd.md`  
**Section:** Post-MVP features

**OLD:**

```md
- richer chatbot user experience, including stronger prompt guidance and more polished source interaction
```

**NEW:**

```md
- deeper chatbot source interaction, answer-depth variation, and optional cross-session continuity beyond the MVP session-local history model
```

**Rationale:** This preserves future expansion without leaving the redesigned baseline ambiguous.

### C. Architecture Modifications

#### Proposal C1 - Define history as session-local MVP UI state

**Artifact:** `architecture.md`  
**Section:** Frontend Architecture / State management

**OLD:**

```md
- Do not introduce Redux or another heavyweight global state library in the MVP.
```

**NEW:**

```md
- Do not introduce Redux or another heavyweight global state library in the MVP.
- Keep MVP chat transcript continuity session-local to the chat surface unless a later story explicitly expands the backend contract for persistence or conversational memory.
```

**Rationale:** This keeps the redesign feasible without silently expanding backend scope.

#### Proposal C2 - Clarify the chat flow shape

**Artifact:** `architecture.md`  
**Section:** Data Flow

**OLD:**

```md
- chat composer → Edge Function `chat` → topic guard / retrieval / response assembly → source-aware response envelope → chat panel
```

**NEW:**

```md
- chat dock / intro state / session-local message list → chat composer → Edge Function `chat` → topic guard / retrieval / response assembly → source-aware response envelope → chat panel thread
```

**Rationale:** The architecture should reflect the actual UX target.

### D. UX Design Modifications

#### Proposal D1 - Expand Source-Aware Chat Panel anatomy

**Artifact:** `ux-design-specification.md`  
**Section:** Source-Aware Chat Panel

**OLD:**

```md
Anatomy: Entry button or dock, chat panel, server-driven prompt suggestions, grounded answer body, message list, source chips or source drawer, and fallback messaging.
```

**NEW:**

```md
Anatomy: Entry dock or button, premium intro state, trust badges, guided topic cards from server-driven suggestions, message list, grounded answer body, source chips or source drawer, composer, and fallback messaging.
```

**Rationale:** The anatomy now matches the approved reference direction.

#### Proposal D2 - Lock the visual direction and interaction model

**Artifact:** `ux-design-specification.md`  
**Section:** Source-Aware Chat Panel

**OLD:**

```md
Variants: Floating panel on desktop and bottom-sheet style presentation on mobile.
Interaction Behavior: Users ask a question, receive a bounded answer, inspect sources if needed, then return to the main narrative without losing place.
```

**NEW:**

```md
Variants: Floating panel on desktop and bottom-sheet style presentation on mobile, while preserving the same transcript model.
Visual Direction: Use the diplomatic navy, muted gold, and teal palette with atmospheric world-map or institutional texture assets when available, while keeping typography and contrast readable.
Interaction Behavior: Users can enter through guided topic cards, ask multiple follow-up questions in one session, keep prior responses visible in a session-local thread, inspect sources inline, and return to the main narrative without losing place.
```

**Rationale:** This turns the redesign request into a concrete UX contract.

## 5. Implementation Handoff

### Scope Classification

**Moderate**

This is a backlog and planning-artifact correction with one new story, one story resequencing step, and multiple document clarifications. It does not require a full product restart.

### Recommended Handoff

- **Product Owner / Developer**

### Responsibilities

#### Product Owner / Planning Responsibility

- confirm the inserted Epic 5 story order
- preserve the session-local history scope boundary for MVP
- use the updated PRD, architecture, and UX artifacts as the new planning baseline

#### Developer Responsibility

- implement Story `5.4` first
- implement Story `5.5` next so server-driven prompt suggestions exist
- implement Story `5.6` as the premium chat redesign and session-local history slice
- keep the typed chat contract and grounded source behavior intact while redesigning the surface

### Success Criteria for Implementation

- the chatbot visually matches the approved premium direction closely
- the chat surface uses the provided background asset effectively without harming readability
- users can see a real session-local message history in one open session
- server-driven suggestions can render as topic cards or follow-up suggestions
- source chips and fallback states remain attached to the correct assistant message
- demo rehearsal happens after the redesign story, not before

## 6. Checklist Execution Log

### Section 1 - Understand the Trigger and Context

- `1.1` `[x] Done` Trigger defined as the newly approved chatbot UI target and history requirement
- `1.2` `[x] Done` Core problem defined as backlog and artifact misalignment around MVP chat UX scope
- `1.3` `[x] Done` Evidence gathered from the current chat implementation, planning docs, and provided assets

### Section 2 - Epic Impact Assessment

- `2.1` `[!] Action-needed` Epic 5 needs one inserted story and resequencing before demo readiness
- `2.2` `[x] Done` Existing epic should be modified, not replaced
- `2.3` `[x] Done` Future epics reviewed for chatbot UX overlap
- `2.4` `[x] Done` No new epic required; one new story is sufficient
- `2.5` `[x] Done` Story order should change

### Section 3 - Artifact Conflict and Impact Analysis

- `3.1` `[!] Action-needed` PRD scope wording required clarification
- `3.2` `[!] Action-needed` Architecture needed explicit session-local history guidance
- `3.3` `[!] Action-needed` UX spec needed updated anatomy and visual direction
- `3.4` `[!] Action-needed` Sprint tracking required story insertion and renumbering

### Section 4 - Path Forward Evaluation

- `4.1` `[x] Viable` Direct adjustment is the best path
- `4.2` `[x] Not viable` Rollback is unnecessary
- `4.3` `[x] Not viable` Deferring the redesign fully to post-MVP would undermine the demo target
- `4.4` `[x] Done` Direct Adjustment selected with session-local history scope control

### Section 5 - Sprint Change Proposal Components

- `5.1` `[x] Done` Issue summary created
- `5.2` `[x] Done` Epic and artifact impacts documented
- `5.3` `[x] Done` Recommended path documented
- `5.4` `[x] Done` MVP impact and sequencing documented
- `5.5` `[x] Done` Handoff responsibilities documented

### Section 6 - Final Review and Handoff

- `6.1` `[x] Done` Checklist reviewed for completeness
- `6.2` `[x] Done` Proposal reviewed for internal consistency
- `6.3` `[x] Done` Explicit user instruction to complete the full workflow was treated as approval to produce and apply the planning-artifact changes in this run
- `6.4` `[x] Done` `sprint-status.yaml` updated to reflect the approved story insertion and resequencing
- `6.5` `[x] Done` Next-step handoff defined to Product Owner / Developer execution

## 7. Approval Gate

Approved through the user's explicit instruction on 2026-05-01 to run the `bmad-correct-course` workflow fully, create or update required artifacts, and not skip steps.

The approved next sequence is:

1. `5.4 Orchestrate Retrieval-Backed Grounded Answers`
2. `5.5 Add Topic Guard, Safety Guard, and Guided Chat Suggestions`
3. `5.6 Redesign the Source-Aware Chat Experience`
4. `5.7 Rehearse Demo Readiness`
5. `5.8 Bootstrap the Working Environment`
