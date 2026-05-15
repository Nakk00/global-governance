# Ingest Synthesis: Codebase Modularization V2 Proposal

## Source

- `archive/docs/planning-artifacts/codebase-modularization-v2-proposal.md` classified as `SPEC`

## Summary

The ingested proposal recommends a behavior-preserving modularization program for the private maintainer console and source stewardship backend. It prioritizes frontend maintainer decomposition first, then backend repository decomposition, because the frontend work has clearer boundaries and lower backend contract risk.

## Planning Interpretation

This should not replace existing MVP phases. It fits best as a new structural maintenance phase after the current admin UX polish work, or as a backlog item promoted after Phase 5 stabilizes.

Recommended planning route:

- Add a new future phase after Phase 5: `Maintainer Codebase Modularization`
- Add new requirements under a maintainability/refactor category, likely `MOD-01` through `MOD-05`
- Preserve Phase 4 and Phase 5 delivery intent
- Avoid merging modularization tasks into Phase 5 execution plans unless the user explicitly wants to widen active Phase 5 scope

## Proposed Phase

### Phase 6: Maintainer Codebase Modularization

Goal: Reduce maintainer console and source stewardship file size, mixed responsibilities, and review risk through behavior-preserving module splits after the Phase 5 control-center work stabilizes.

Requirements: `MOD-01`, `MOD-02`, `MOD-03`, `MOD-04`, `MOD-05`

Success criteria:
1. `maintainerDashboardShared.tsx` no longer owns full feature pages.
2. Source detail, validation, audit trail, and chatbot trust implementations live in feature-owned folders.
3. `SourcesPage.tsx` is reduced to page state and composition.
4. `backend/sources/repository.py` becomes a compatibility export layer instead of a monolithic repository implementation.
5. `OverviewPage.tsx` and maintainer API wrappers are split without changing routes, DTO fields, response envelopes, or session-expiry behavior.

Suggested plans:
- 06-01: Split maintainer shared types, routing, states, mutation helpers, and generic formatters
- 06-02: Move source detail, validation, audit trail, and chatbot trust implementation into feature-owned modules
- 06-03: Split source inventory page components and metrics helpers
- 06-04: Split backend source repository into base, mapper, seed, storage, mutation, memory, and Supabase modules
- 06-05: Split overview builders and maintainer API wrappers by feature

## Verification

Frontend-focused plans:
- `pnpm test:unit`
- `pnpm lint`
- `pnpm typecheck`
- `pnpm build`

Backend repository plan:
- `pnpm backend:test`
- `pnpm backend:lint`
- `pnpm backend:typecheck`
- `pnpm backend:check`
- `pnpm lint`
- `pnpm typecheck`

Impact/safety checks:
- Run GitNexus impact analysis before editing high-fan-out functions, classes, or methods.
- Run `gitnexus_detect_changes()` before any commit.

---

# Ingest Synthesis: Admin Side Documentation Proposal v4

## Source

- `archive/docs/planning-artifacts/admin-side-documentation-proposal.md` classified as `DOC`

## Summary

The ingested proposal is a documentation-first maintainer playbook for the private admin surface. It asks for a beginner-friendly walkthrough that explains the top-level tabs, blocker states, source-detail tabs, validation follow-up, a Mermaid diagram of the end-to-end access path, a short verification summary, and a gap list.

## Planning Interpretation

This is best treated as docs-update work rather than a roadmap phase change. The proposal does not introduce new runtime behavior and explicitly separates future improvement ideas from the documentation task.

No roadmap phase addition is required from this ingest because the proposal is documentation-only.

Recommended planning route:

- Hand the guide-writing work to `gsd-docs-update`
- Use the proposal’s verified facts as the source of truth and mark everything else as a gap or assumption
- Keep the admin-side improvement ideas separate until they are explicitly promoted into their own story or phase

## Verification

- Cite the current admin-related code and test areas named in the proposal
- Include the Mermaid graph and gap list requested by the proposal
- Re-verify if auth, route, or maintainer behavior changes later
