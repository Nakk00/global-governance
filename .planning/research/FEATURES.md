# Features Research

## Framing

This feature pass is scoped to the **remaining brownfield MVP**, not the entire original vision. Existing learner flow, grounded chat, and private maintainer operations are treated as current baseline. The question here is what still belongs in the next MVP wave.

## Table Stakes

### Learning Depth

- **Student / Expert mode** — Let users switch explanation depth without losing context.
  - Complexity: High
  - Dependencies: shared content model, navigation-safe session state, flagship module copy structure, chat context alignment
- **Depth-safe fallbacks** — If a section lacks a variant, the app must degrade to a default explanation cleanly.
  - Complexity: Medium
  - Dependencies: content modeling, rendering contracts

### Trust & Grounding

- **Visible support states** — Users must understand grounded, weak-support, refusal, cooldown, and outage behavior.
  - Complexity: Medium
  - Dependencies: shared state/copy patterns across chat and references
- **Source visibility across the experience** — Key educational claims and chat responses should expose source support without derailing the narrative.
  - Complexity: Medium
  - Dependencies: source metadata surfaces, reference UI, content/references alignment

### Demo Readiness

- **Readiness-first maintainer overview** — Maintainers need a quick answer to “what is blocked, and what do I do next?”
  - Complexity: Medium
  - Dependencies: dashboard information architecture, backend readiness signals
- **Repeatable pre-demo verification** — Maintainers need a stable path through frontend, functions, backend, and browser checks.
  - Complexity: Medium
  - Dependencies: scripts, docs, test lanes, smoke/live test coverage

### Public Experience Resilience

- **Usable first paint before heavyweight modules finish loading**
  - Complexity: Medium
  - Dependencies: bundle splitting, lazy-loading choices, profiling
- **Graceful degradation when chat or premium visuals fail**
  - Complexity: Medium
  - Dependencies: explicit fallback states, UX polish, test coverage

## Differentiators

- **Depth-aware interactive documentary flow** — Not just a toggle, but a coherent explanation system across narrative, modules, and chat.
- **Source-aware academic trust cues** — The product feels credible because support is visible and bounded rather than implied.
- **Private stewardship and readiness surface** — Maintainers can actively protect the trust model without exposing operational complexity to learners.

## Anti-Features

- **Early public-chat runtime migration** — Moving learner chat to Django now adds migration risk without improving the brownfield MVP’s core classroom value.
- **Generic AI-assistant behavior** — Open-ended assistant behavior weakens the academic trust model.
- **Spectacle-first expansion** — Additional 3D or motion work that harms first render, readability, or demo reliability should be deferred.
- **Public maintainer discovery** — Linking or exposing private stewardship routes in the learner flow would dilute the product boundary.

## Feature Dependencies

- Student / Expert mode should land before any deeper chat-personalization or richer guidance work.
- Trust/readiness improvements depend on preserving the current runtime split rather than re-litigating it midstream.
- Performance hardening should happen after depth and trust work define what must remain in the initial render path.

---
*Written: 2026-05-06*
