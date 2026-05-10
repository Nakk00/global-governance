# Pitfalls Research

## Pitfall 1: Planning Against Future Architecture Instead Of Current Reality

- **Why it matters**: The product docs contain a future Django public-chat direction, but the current browser flow and tests still rely on Supabase Edge Functions for learner chat.
- **Warning signs**: New roadmap items assume Django owns `/chat`; frontend wiring or tests start drifting away from the active boundary; duplicated chat behavior appears in two runtimes.
- **Prevention**: Treat Django public-chat cutover as explicit future scope until a dedicated migration phase promotes it.
- **Phase to address**: Planning baseline and all near-term MVP phases

## Pitfall 2: Letting Student / Expert Mode Become State Explosion

- **Why it matters**: Depth mode touches narrative copy, modules, recaps, and chat. If modeled ad hoc, it will spread branching logic across the app.
- **Warning signs**: Repeated `if expert` conditionals in many components; inconsistent depth behavior between sections; chat tone and page content diverge.
- **Prevention**: Start with a shared content contract and one thin session-state seam, then thread it through surfaces intentionally.
- **Phase to address**: Phase 1

## Pitfall 3: Keeping Trust Cues Fragmented

- **Why it matters**: The current product depends on visible grounding and bounded behavior. If references, chat states, and evidence surfaces diverge, evaluator trust drops quickly.
- **Warning signs**: Chat shows weak-support but page references imply certainty; different wording or UI semantics across trust states; source visibility varies by section with no clear rule.
- **Prevention**: Standardize trust-state language and support-surface behavior before adding more feature depth.
- **Phase to address**: Phase 2

## Pitfall 4: Growing The Maintainer Surface Inside One Giant Composite

- **Why it matters**: `MaintainerDashboard.tsx` already concentrates too many concerns. More MVP work there increases regression risk and slows debugging.
- **Warning signs**: New route logic, inspection panes, or validation workflows continue landing in the same file; tests become harder to localize.
- **Prevention**: Split private overview, sources, validation, and audit concerns into smaller feature-owned slices while keeping the API boundary stable.
- **Phase to address**: Phase 3

## Pitfall 5: Chasing Visual Ambition Before Demo Reliability

- **Why it matters**: The product wins by being memorable and credible, not by loading every premium experience at once.
- **Warning signs**: New heavy modules become eager imports; above-the-fold performance regresses; fallback states feel secondary or untested.
- **Prevention**: Profile initial render, defer heavyweight modules, and keep failure-state UX first-class.
- **Phase to address**: Phase 4

## Pitfall 6: Relying On Memory Instead Of Repeatable Verification

- **Why it matters**: The repo spans frontend, Supabase functions, and Django, but there is no full checked-in CI pipeline yet.
- **Warning signs**: Demo bugs appear only during manual rehearsal; contributors run different check subsets; changes cross boundaries without the right test lane.
- **Prevention**: Treat the verification path as a product artifact with named commands, browser lanes, and live-chat checks where appropriate.
- **Phase to address**: Phase 4

---
*Written: 2026-05-06*
