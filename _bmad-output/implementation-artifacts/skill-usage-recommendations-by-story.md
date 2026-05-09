# BMAD Skill Usage Recommendations by Story

This guide recommends whether to run or skip these three BMAD skills for each story in the current plan:

- `V` = `validate-create-story` or the optional create-story validation pass
- `A` = `bmad-review-adversarial-general`
- `E` = `bmad-review-edge-case-hunter`

## Why This Guide Exists

This guide exists to reduce unnecessary token usage while still protecting quality where it matters most.

Without a story-by-story recommendation, the default instinct is often to run all three skills on every story. In this project, that would be expensive and slow because not every story benefits equally from all three review passes. Some stories are mostly presentational, some are cross-cutting and risky, and some are heavy on interaction states or infrastructure boundaries.

The goal of this file is to make the review process more intentional:

- spend tokens where the likely risk is high
- skip skills where the expected value is low
- keep the team from over-reviewing simple stories and under-reviewing risky ones

In short, this is a cost-versus-risk guide for BMAD skill usage across the current story map.

## How to Read This

- `Run` means the skill is likely worth the token cost for that story.
- `Skip` means the story does not benefit enough from that skill to justify the cost by default.
- These recommendations are based on the current status in `sprint-status.yaml` and the scope and acceptance criteria in `epics.md`.

## Decision Rules Used

- Run `V` when a story is foundational, cross-cutting, architecturally risky, or easy to mis-specify.
- Run `A` when a story could suffer from vague scope, missed constraints, or weak acceptance criteria.
- Run `E` when the eventual implementation will likely have multiple UI states, branching behavior, responsive changes, accessibility paths, async behavior, or protection/fallback logic.
- Skip a skill when its value is low compared with the likely token cost for that story.

## Why We Made These Decisions

These recommendations were not chosen arbitrarily. They were based on the actual shape of the current project plan and the role of each skill:

- `sprint-status.yaml` was used to understand which stories are already done, which are `ready-for-dev`, and which are still in `backlog`.
- `epics.md` was used to inspect the acceptance criteria and infer each story's likely implementation risk, interaction complexity, and ambiguity.
- The three skill definitions were used to align each skill with the kind of problem it is actually designed to solve.

That leads to three important conclusions:

- `V` should not be used automatically on every story because the validation pass is most useful when the story itself is still likely to be weak, ambiguous, or structurally risky.
- `A` has the broadest usefulness because almost any story can benefit from a skeptical pre-implementation review.
- `E` is not primarily a story-writing tool. It is most valuable for stories that will eventually produce lots of states, branches, overlays, fallbacks, responsive behavior, or protection logic.

So the recommendations in this file are really a way of matching:

- story complexity
- story ambiguity
- likely implementation branchiness
- current story status

against the actual purpose of each skill.

## Story Recommendations

### Story 1.1: Set Up Initial Project from Starter Template

- `V`: Skip
  Reason: the story is already done and the foundation has already been implemented.
- `A`: Skip
  Reason: a pre-dev skeptical review is no longer useful unless the story is reopened.
- `E`: Skip
  Reason: edge-case review is best on an active implementation diff, not a completed scaffold story.

### Story 1.2: Open the Journey

- `V`: Skip
  Reason: skip if this story is already validated and unchanged; rerun only if the story was rewritten after approval.
- `A`: Run
  Reason: this is the first visible UX story and it is easy to under-specify the hero, CTA intent, and reduced-motion expectations.
- `E`: Run
  Reason: the implementation will include responsive layout, CTA behavior, and reduced-motion handling, which creates real edge paths worth checking.

### Story 1.3: Navigate the Story

- `V`: Run
  Reason: navigation and orientation are cross-cutting and easy to mis-specify early, so tightening the story is worth it.
- `A`: Run
  Reason: this story can drift into overbuilding or unclear behavior unless the requirements are challenged before coding.
- `E`: Run
  Reason: active section states, keyboard navigation, jump behavior, and mobile collapse all introduce branches and boundary conditions.

### Story 1.4: Explore the Core Narrative

- `V`: Skip
  Reason: this is content-structure heavy rather than architecture heavy, so the create-story validation pass is lower value by default.
- `A`: Run
  Reason: the story can easily become vague, text-heavy, or misaligned with the learning-flow intent unless critically reviewed.
- `E`: Skip
  Reason: skip unless the implementation introduces substantial interactive disclosure or other stateful reading aids that create real branching behavior.

### Story 1.5: Re-enter with Recaps

- `V`: Skip
  Reason: the scope is relatively focused and not strongly architectural.
- `A`: Run
  Reason: recap and re-entry cues are easy to make repetitive, unclear, or too weak to be useful.
- `E`: Run
  Reason: re-entry, repeated visits, and next-step cues create navigation and state edges worth checking after implementation.

### Story 1.6: Shape the Editorial System

- `V`: Run
  Reason: this story sets site-wide visual rules, so a validation pass helps catch weak or incomplete design constraints before implementation.
- `A`: Run
  Reason: design-system stories benefit from skeptical review because vague styling goals often turn into unfocused implementation.
- `E`: Skip
  Reason: this story is more about system coherence than branching runtime logic, so edge-case review is lower ROI by default.

### Story 1.7: Keep the Core Journey Usable

- `V`: Run
  Reason: this is a cross-cutting quality story touching accessibility, responsiveness, and motion safety across the whole journey.
- `A`: Run
  Reason: usability hardening stories often hide vague expectations unless reviewed critically.
- `E`: Run
  Reason: this story is almost entirely about boundary conditions such as breakpoints, keyboard paths, motion settings, and performance-sensitive behavior.

### Story 2.1: Introduce the UN Command Center

- `V`: Run
  Reason: this is a flagship module with structural and interaction complexity, so stronger story validation is worth the cost.
- `A`: Run
  Reason: module shell stories often leave unclear state, layout, and scope boundaries unless challenged.
- `E`: Run
  Reason: responsive layout, module entry states, and interaction framing create multiple branches to verify.

### Story 2.2: Inspect UN Organs

- `V`: Skip
  Reason: once the command-center shell is defined, this story is more incremental than foundational.
- `A`: Run
  Reason: organ detail behavior can still become vague or repetitive without skeptical review.
- `E`: Run
  Reason: selection states, comparison cues, and keyboard traversal create real behavioral edges.

### Story 2.3: Compare Organs Across Devices

- `V`: Skip
  Reason: the story is an extension of an already-defined module rather than a new architecture pivot.
- `A`: Run
  Reason: device-specific comparison behavior can be underspecified and lead to awkward UX if not challenged.
- `E`: Run
  Reason: responsive comparison views are exactly the kind of branch-heavy behavior edge-case review catches well.

### Story 3.1: Open the Case Dossier

- `V`: Run
  Reason: this is another flagship module shell and sets the frame for later dossier stories.
- `A`: Run
  Reason: the dossier can easily become too generic or too decorative unless the story is pressure-tested.
- `E`: Run
  Reason: entry states, reading flow, and responsive adaptation create multiple UI paths to inspect.

### Story 3.2: Follow the Timeline

- `V`: Skip
  Reason: the timeline builds on the dossier shell and is not as architecturally open-ended.
- `A`: Run
  Reason: chronology, clarity, and compactness are easy to promise vaguely and implement poorly.
- `E`: Run
  Reason: event selection, sequence progression, keyboard navigation, and mobile adaptation all create clear edge paths.

### Story 3.3: Compare Ruling and Reality

- `V`: Skip
  Reason: this story is focused and builds on the existing case-dossier structure.
- `A`: Run
  Reason: comparison stories often hide conceptual ambiguity unless reviewed skeptically first.
- `E`: Run
  Reason: state switching, reduced-motion behavior, and cross-breakpoint readability create strong edge-case value.

### Story 3.4: Inspect Case Evidence

- `V`: Run
  Reason: evidence surfaces affect trust, overlays, and accessibility, so stronger story validation is worthwhile.
- `A`: Run
  Reason: source treatment can easily become decorative or detached from the learning flow unless challenged.
- `E`: Run
  Reason: drawers, overlays, focus return, and motion-safe opening behavior are rich with edge conditions.

### Story 4.1: Close with Thesis and References

- `V`: Skip
  Reason: the story is mostly presentational and less architecture-heavy than the chat stories that follow.
- `A`: Run
  Reason: conclusion/reference stories benefit from skeptical review because they can end up weak, disconnected, or too document-like.
- `E`: Skip
  Reason: skip unless the references open in an overlay, drawer, or other focus-managing surface that needs extra edge-case handling.

### Story 4.2: Open the Source-Aware Chat

- `V`: Run
  Reason: chat-shell stories have many UX and boundary requirements, so validation helps reduce drift before coding.
- `A`: Run
  Reason: this story can easily miss bounded-role framing, prompt UX, and mobile/keyboard constraints.
- `E`: Run
  Reason: open/close behavior, mobile presentation, focus handling, and suggested prompt interaction all create important edges.

### Story 4.3: Receive Grounded Answers

- `V`: Run
  Reason: this story sits at the core of trust, citations, weak-support handling, and content alignment.
- `A`: Run
  Reason: grounded-answer stories are easy to oversimplify and need skeptical scrutiny before implementation.
- `E`: Run
  Reason: success, weak-support, evidence reveal, and alignment states create many behavioral branches.

### Story 4.4: Handle Refusal and Protection States

- `V`: Run
  Reason: refusal, cooldown, and protection-state stories are easy to get wrong if the story context is not sharp.
- `A`: Run
  Reason: this story benefits from critical review because calm refusal behavior and protection messaging are often underspecified.
- `E`: Run
  Reason: off-topic, cooldown, repeated triggering, and fallback flows are pure branch-heavy behavior.

### Story 5.1: Manage Approved Source Bundles

- `V`: Run
  Reason: this story introduces maintainership and governance rules that can affect many later retrieval stories.
- `A`: Run
  Reason: source-bundle management can hide gaps in reviewability, traceability, and scope boundaries.
- `E`: Run
  Reason: add/remove/update flows and diff/review behavior create data and workflow edge cases.

### Story 5.2: Prepare Sources for Ingestion

- `V`: Run
  Reason: ingestion is infrastructural, deterministic, and easy to mis-specify without stronger story validation.
- `A`: Run
  Reason: ingestion stories benefit from skeptical review because unsupported files, determinism, and storage separation are easy to miss.
- `E`: Run
  Reason: file-type handling, repeated runs, failure modes, and output consistency all create strong edge-case value.

### Story 5.3: Validate Chatbot Boundaries

- `V`: Run
  Reason: this story is itself about verification strategy, so validating the story is worth the token spend.
- `A`: Run
  Reason: a skeptical pass helps ensure the validation story is not too shallow or overly optimistic.
- `E`: Run
  Reason: refusal, weak support, rate limits, and citation integrity all depend on exhaustive path coverage.

### Story 5.4: Rehearse Demo Readiness

- `V`: Run
  Reason: this story combines navigation, learning-flow, references, and chat stability into one high-risk demo scope.
- `A`: Run
  Reason: demo-readiness stories benefit from cynical review because teams often mark them complete too easily.
- `E`: Run
  Reason: degraded features, slower conditions, and fallback behavior are exactly the kinds of scenarios edge-case review should probe.

### Story 5.5: Bootstrap the Working Environment

- `V`: Run
  Reason: setup and reproducibility stories are easy to underspecify and can waste large amounts of future time if weak.
- `A`: Run
  Reason: skeptical review helps catch unclear setup steps, hidden assumptions, and missing secret-boundary rules.
- `E`: Skip
  Reason: the story is workflow-heavy and documentation-heavy, with fewer runtime branches than the interaction stories.

### Story 6.1: Switch Explanation Depth

- `V`: Run
  Reason: mode-switching introduces cross-cutting content and state behavior that benefits from a stronger upfront story.
- `A`: Run
  Reason: depth-mode stories are prone to vague promises about consistency and readability unless challenged.
- `E`: Run
  Reason: mode toggles, content parity, and layout stability create many reachable edge cases.

### Story 6.2: Layer Optional Presentation Enhancements

- `V`: Run
  Reason: optional enhancement stories need sharp boundaries so polish does not become a dependency.
- `A`: Run
  Reason: skeptical review helps protect the “optional, not required” rule from being diluted.
- `E`: Run
  Reason: enhanced-versus-disabled paths and graceful degradation are rich in boundary conditions.

### Story 6.3: Prepare a Simulator-Ready Scenario Shell

- `V`: Skip
  Reason: skip for now because this is a lightweight future scaffold, not because the story is risk-free.
- `A`: Run
  Reason: skeptical review helps ensure the shell stays clearly separate from the MVP and does not sprawl.
- `E`: Skip
  Reason: the current shell should not introduce immediate runtime branches; revisit when the scenario becomes interactive.

## Fast Summary

If you need the cheapest default rule set:

- Always run `A` for stories that are still being prepared for implementation.
- Run `V` only for foundational, cross-cutting, infrastructure, trust, or ambiguous stories.
- Run `E` only for stories that will produce meaningful interaction branches, state transitions, overlays, async behavior, responsive behavior, accessibility paths, or protection logic.

## Current Story Focus

For the story that is currently `ready-for-dev`:

- `1.2-open-the-journey`
  - `V`: Skip
  - `A`: Run
  - `E`: Run after the implementation diff exists

## Files Investigated

These recommendations were based on the following files:

- [sprint-status.yaml](<C:/Users/Nakko/Desktop/VSCode - Project Files/Global-Governance/_bmad-output/implementation-artifacts/sprint-status.yaml>)
  Reason: used to inspect current story status such as `done`, `ready-for-dev`, and `backlog`.
- [epics.md](<C:/Users/Nakko/Desktop/VSCode - Project Files/Global-Governance/_bmad-output/planning-artifacts/epics.md>)
  Reason: used to inspect story titles, acceptance criteria, and likely implementation complexity for every story from `1.1` through `6.3`.
- [SKILL.md](<C:/Users/Nakko/Desktop/VSCode - Project Files/Global-Governance/.agents/skills/bmad-create-story/SKILL.md>)
  Reason: used to confirm the intended purpose of `bmad-create-story`.
- [SKILL.md](<C:/Users/Nakko/Desktop/VSCode - Project Files/Global-Governance/.agents/skills/bmad-review-adversarial-general/SKILL.md>)
  Reason: used to confirm that the skill is a skeptical content review pass intended to find broad problems and missing pieces.
- [SKILL.md](<C:/Users/Nakko/Desktop/VSCode - Project Files/Global-Governance/.agents/skills/bmad-review-edge-case-hunter/SKILL.md>)
  Reason: used to confirm that the skill is specifically for unhandled paths, branching logic, and edge conditions.
