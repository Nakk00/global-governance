# Ingested Constraints

Source: `archive/docs/planning-artifacts/codebase-modularization-v2-proposal.md`

- Preserve the React + TypeScript Vite SPA and section/anchor-oriented maintainer architecture.
- Do not introduce React Router, a global store, route changes, backend response contract changes, DTO field renames, or new public maintainer features as part of this modularization.
- Keep the maintainer console private and feature-owned.
- Keep browser-facing code under `src/`; keep privileged maintainer and source stewardship logic in backend/Supabase boundaries as already defined by the project.
- Prefer compatibility exports during transition to reduce import churn.
- Preserve reduced-motion behavior, keyboard access, fallback states, and existing route semantics.
- Verify frontend modularization with `pnpm test:unit`, `pnpm lint`, `pnpm typecheck`, and `pnpm build`.
- Verify backend repository modularization with `pnpm backend:test`, `pnpm backend:lint`, `pnpm backend:typecheck`, and `pnpm backend:check`.
- Use `pnpm test:e2e` only when route, browser journey, or layout confidence is actually affected.

## Admin Side Documentation Constraints

- Keep the guide beginner-friendly and explicitly separate verified facts from assumptions.
- Do not turn improvement ideas into implied runtime commitments; keep them in a separate future story or phase.
- Cite the current code and test areas named in the proposal so the walkthrough stays grounded in the actual repo.
- Keep the Mermaid graph focused on the core browser -> login -> gate -> data-load path rather than every helper.
- Preserve the explicit private maintainer boundary so readers do not confuse it with a public admin dashboard.
- Re-verify the guide if auth, route, or maintainer behavior changes later.
