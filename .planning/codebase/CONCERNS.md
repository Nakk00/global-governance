# Codebase Concerns

**Analysis Date:** 2026-05-06

## Tech Debt

**Maintainer dashboard orchestration lives in one very large component:**
- Issue: `src/components/modules/MaintainerDashboard/MaintainerDashboard.tsx` concentrates route parsing, auth gating, dashboard loading, detail loading, mutation flows, inspection panes, and validation workbench state.
- Why: it acts as the first integrated maintainer surface and keeps a lot of wiring in one place.
- Impact: future maintainer features are likely to become harder to reason about, test, and safely refactor.
- Fix approach: split route shells, inspector panels, and validation workbench concerns into feature-owned child components/hooks while keeping `src/lib/maintainer/api.ts` as the network boundary.

**Supabase-backed repositories are oversized and highly coupled:**
- Issue: `backend/sources/repository.py` contains a very large `SupabaseStewardshipRepository`, and `backend/validation/repository.py` follows a similar repository-heavy pattern.
- Why: the backend is centralizing multiple stewardship and validation workflows behind a protected orchestration layer.
- Impact: changes to one endpoint can ripple across mapping, snapshots, events, chunks, citations, and mutation logic inside a single file.
- Fix approach: extract sub-repositories or service modules by concern, especially around reads vs. mutations vs. ingestion/validation dispatch.

## Known Behavior Constraints

**Public Django chat cutover is intentionally deferred:**
- Symptoms: `_internal/chat/` returns a stable 501-style deferred response instead of serving the learner chat experience.
- Trigger: any attempt to treat Django as the public chat backend today.
- Workaround: keep the public browser chat pointed at `supabase/functions/v1/chat` through `src/lib/chat/api-client.ts`.
- Root cause: the project explicitly reserves Django chat orchestration for a later migration story.

**Maintainer auth is session-local and browser-stored:**
- Symptoms: maintainer session state depends on `localStorage` persistence in `src/lib/supabase/browser-client.ts`.
- Trigger: browser storage clearing, expiry, or cross-device expectations.
- Workaround: re-authenticate and let the backend re-verify each request.
- Root cause: the current boundary favors a thin SPA auth client over a fuller cookie/session integration.

## Security Considerations

**Service-role logic is split across Django and Supabase server code:**
- Risk: accidental leakage of server-only concerns into `src/` if future changes ignore the current boundary rules.
- Current mitigation: env templates clearly separate `VITE_*` from backend-only vars, and the repo docs repeatedly warn not to import service-role logic into browser code.
- Recommendations: preserve strict reviews around `src/` imports, keep protected mutations behind Django or Edge Functions, and add automated checks if the boundary widens.

**Maintainer session tokens are stored in browser localStorage:**
- Risk: localStorage is easier to misuse than httpOnly cookie storage if future auth scope expands.
- Current mitigation: only the protected maintainer area uses it, and Django revalidates bearer tokens server-side.
- Recommendations: if the maintainer surface grows, evaluate whether cookie-based session handling or shorter-lived refresh flow hardening is warranted.

## Performance Bottlenecks

**Route-level lazy loading is only applied to the maintainer dashboard:**
- Problem: the maintainer surface is deferred, but some rich learner-facing modules still ship as part of the main SPA bundle.
- Evidence: `src/App.tsx` lazy-loads `MaintainerDashboard`, while `UNCommandCenter` and `WpsDossier` are imported eagerly.
- Cause: the public experience is intentionally cohesive, but the feature set is growing.
- Improvement path: keep profiling above-the-fold bundle cost and selectively lazy-load heavy non-initial sections or media-backed modules if first render regresses.

**Protection and retrieval rules are duplicated across multiple layers:**
- Problem: learner chat behavior is expressed in content bundles, frontend parsers, Edge Function helpers, and test fixtures.
- Cause: the grounded-chat contract is intentionally strict and heavily tested.
- Improvement path: preserve shared fixtures and consider stronger contract-sharing between `src/` and `supabase/functions/_shared/` where safe.

## Fragile Areas

**SPA / Django / Supabase boundary split:**
- Why fragile: learner flows, maintainer flows, and future cutover work span three runtimes with different auth and deployment assumptions.
- Common failures: pointing the frontend at the wrong endpoint, drifting response envelopes, or duplicating behavior inconsistently between Django and Edge Functions.
- Safe modification: update both contract tests and the appropriate runtime-specific test lane when changing shared request/response behavior.
- Test coverage: generally good, but the seam still needs deliberate verification selection.

**Hash-navigation and focus management:**
- Why fragile: `src/contexts/NavigationContext.tsx` coordinates hash reconciliation, scroll anchoring, programmatic navigation holds, and focus restoration.
- Common failures: regressions in active-section tracking, focus jumps, or scroll logic across breakpoints.
- Safe modification: prefer targeted unit tests and layout/browser checks before changing the navigation timing logic.
- Test coverage: some browser coverage exists, but the behavior is still timing-sensitive.

## Scaling Limits

**In-memory protection store default:**
- Current capacity: suitable for local dev and single-instance serving.
- Limit: protection counters are process-local unless Redis is configured.
- Symptoms at limit: inconsistent rate limiting across replicas or process restarts.
- Scaling path: configure `REDIS_URL` and validate multi-instance behavior if public traffic grows.

## Dependencies at Risk

**No checked-in CI workflow:**
- Risk: quality gates depend on developers remembering to run the intended `pnpm` and backend checks locally.
- Impact: regressions can slip through when work spans frontend, Supabase functions, and Django together.
- Migration plan: add CI once the current workflow stabilizes enough to codify the expected lanes.

## Test Coverage Gaps

**No centralized end-to-end CI enforcement for the full stack:**
- What's not tested automatically in-repo: the combined Vite + Django + Supabase stack through a checked-in CI pipeline.
- Risk: integration drift between runtimes may be caught only during local rehearsal.
- Priority: High for long-lived maintainer/admin growth.
- Difficulty to test: moderate, because it requires coordinated local services and environment setup.

---

*Concerns audit: 2026-05-06*
*Update as architectural risks are reduced or new fragile seams appear*
