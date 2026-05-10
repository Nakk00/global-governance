# Phase 2: Trust And Grounding Clarity - Specification

**Created:** 2026-05-10
**Ambiguity score:** 0.18 (gate: <= 0.20)
**Requirements:** 3 locked

## Goal

Learners can immediately tell whether a response is grounded, weak-support, refused, in cooldown, or falling back, and can inspect approved source support for narrative and chatbot claims without losing their place in the story.

## Background

The current app already has a source-aware chat shell with typed answered, weakSupport, refused, and cooldown states. `SourceAwareChat` renders expandable approved source chips for answered responses, weak-support guidance, and recovery actions for refusal and cooldown, and the grounded-chat parser already enforces the existing envelope. The narrative shell already exposes collapsible approved references in the conclusion section, `WpsDossier` already exposes evidence panels for timeline and comparison states, and the maintainer dashboard already has source/citation inspection and validation evidence views. The UN Command Center and recap surfaces still read as narrative modules rather than a shared trust vocabulary, and transport or parse failures still collapse into a generic chat error instead of a first-class learner fallback presentation. This phase makes the trust model coherent across the public learning flow and the private evaluator surface without changing the approved-source boundary or source ingestion pipeline.

## Requirements

1. **Unified chat trust states**: The learner-facing chat shell presents grounded, weak-support, refusal, cooldown, and fallback outcomes as distinct states with clear recovery actions.
   - Current: `SourceAwareChat` already shows answered, weakSupport, refused, and cooldown states, but transport or parse failures collapse into a generic `grounded_chat_unavailable` error message rather than a first-class learner fallback state.
   - Target: All five outcomes use a consistent learner-facing label, copy, and recovery affordance so the learner can tell what happened at a glance.
   - Acceptance: Fixtures for answered, weakSupport, refused, cooldown, and fallback or unavailable responses render different visible labels or messages, and the refusal, cooldown, and fallback recovery actions still restore focus to the composer or primary retry control.

2. **Coherent source support**: Approved source support for the core narrative, UN Command Center, West Philippine Sea dossier, recap surfaces, and chat uses one shared vocabulary and interaction pattern.
   - Current: Narrative disclosure blocks, WPS evidence panels, and chat source chips already exist, but each surface uses its own presentation and the UN Command Center and recap surfaces do not yet share the same support affordance pattern.
   - Target: Learners can open approved source support in each in-scope public surface without changing the current section, selected case/state, or scroll position.
   - Acceptance: A render or browser test covering narrative, UN, WPS, recap, and chat shows source-support details opening and closing while the active section hash, selected module state, and scroll position stay unchanged.

3. **Evaluator evidence trail**: Maintainer/evaluator views connect public claims back to approved source identities, citation details, and validation evidence.
   - Current: The maintainer dashboard already exposes source/citation inspection and validation evidence views, but that evidence trail lives in a separate private workflow from the learner-facing trust cues.
   - Target: A reviewer can trace a learner-visible claim to the same approved-source identity and citation record shown in maintainer validation and source inspection views.
   - Acceptance: From a maintainer source or validation screen, a reviewer can open citation or chunk detail for a claim shown in the public experience and verify the same approved-source label or identifier appears in both places.

## Boundaries

**In scope:**
- A clear learner-facing trust-state vocabulary for chat outcomes.
- Source-support affordances and labels across narrative, UN Command Center, WPS dossier, recap, and chat.
- Private evaluator and source inspection flows that trace public claims to approved source identity and validation evidence.
- Copy and UI semantics that make the above feel like one coherent course trust model.

**Out of scope:**
- Changing the grounded-response retrieval or answer-generation algorithm - this phase changes presentation and semantics, not the approved-source corpus or boundary rules.
- New source ingestion, moderation, or approval workflows - the approved-source set is already established.
- A public maintainer console or any new runtime cutover - evaluator tooling remains private and the Supabase chat boundary stays active.
- Depth-mode work, global-state rewrites, or large architecture refactors - those belong to other phases.

## Constraints

- Stay within the existing React + TypeScript Vite SPA for public surfaces and the existing private maintainer stack for evaluator views.
- Preserve keyboard access, focus restoration, and reduced-motion behavior on all trust-state and evidence surfaces.
- Keep compatibility with the current grounded-chat contract for answered, weakSupport, refused, and cooldown responses; any fallback presentation should layer on top of that contract instead of requiring a boundary cutover.
- Avoid broad global-store or router migrations just to unify trust labels.

## Acceptance Criteria

- [ ] Chat displays distinct visible states for grounded, weak-support, refusal, cooldown, and fallback or unavailable outcomes.
- [ ] Refusal, cooldown, and fallback recovery actions return focus to the composer or primary retry control.
- [ ] Narrative, UN Command Center, WPS dossier, recap, and chat support affordances open and close without changing the current section, selected case/state, or scroll position.
- [ ] Approved source support uses a consistent label or vocabulary scheme across in-scope public surfaces.
- [ ] Maintainer and evaluator views can trace a public claim to citation or validation detail with the same approved-source identity shown to learners.
- [ ] Existing grounded, weak-support, refusal, and cooldown chat tests still pass, and the fallback path is covered by a checked-in test.

## Ambiguity Report

| Dimension | Score | Min | Status | Notes |
|-----------|-------|-----|--------|-------|
| Goal Clarity | 0.90 | 0.75 | ✓ | Clear learner trust model, fallback presentation, and evidence trail. |
| Boundary Clarity | 0.84 | 0.70 | ✓ | Presentation and semantics are in scope; ingestion, cutover, and depth work are out. |
| Constraint Clarity | 0.76 | 0.65 | ✓ | SPA-only public surfaces, private evaluator stack, and accessibility constraints are explicit. |
| Acceptance Criteria | 0.78 | 0.70 | ✓ | Six pass/fail checks cover chat states, source support, evidence traceability, and test coverage. |
| **Ambiguity** | 0.18 | <=0.20 | ✓ | |

Status: ✓ = met minimum, ⚠ = below minimum (planner treats as assumption)

## Interview Log

| Round | Perspective | Question summary | Decision locked |
|-------|-------------|------------------|-----------------|
| 1 | Researcher | What exists today in chat, narrative, and evaluator evidence surfaces? | Typed grounded, weak-support, refusal, and cooldown chat states already exist; narrative references and maintainer source evidence already exist; the missing work is coherent trust vocabulary and explicit fallback presentation. |
| 2 | Simplifier | What is the minimum viable trust fix? | Standardize learner-facing labels and source-support patterns across public surfaces without changing the grounding algorithm or source ingestion. |
| 3 | Boundary Keeper | What must stay out of scope? | Do not add a public maintainer console, a runtime cutover, depth-mode work, or a global-state refactor in this phase. |

---

*Phase: 02-trust-and-grounding-clarity*
*Spec created: 2026-05-10*
*Next step: $gsd-discuss-phase 2 - implementation decisions (how to build what's specified above)*
