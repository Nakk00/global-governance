# Research Summary

## Key Findings

**Stack:** The repo already has the right brownfield shape for the product: a Vite SPA for the learner journey, Supabase Edge Functions for the active public chat path, Django for private maintainer orchestration, and a layered verification stack across frontend, functions, backend, and browser testing.

**Table Stakes For The Next MVP Wave:** Student / Expert mode, visible trust states and source support, a readiness-first maintainer surface, and stronger demo/release verification are the most valuable remaining scope items.

**Architecture Direction:** The safest plan is to preserve the current runtime split, add depth mode through content modeling and thin session state, harden trust surfaces next, then modularize the maintainer surface and tighten performance/verification.

**Watch Out For:** Do not plan against a future public Django chat boundary yet. Avoid depth-mode state sprawl, trust-state fragmentation, maintainer monolith growth, and performance regressions caused by eager premium features.

## Recommended MVP Sequence

1. Depth-aware content and session-state foundation
2. Trust and source-support polish across narrative and chat
3. Maintainer readiness modularization and stewardship hardening
4. Performance profiling, lazy-loading, and repeatable verification for demo use

## Implication For Roadmapping

The roadmap should be **coarse**, focused on the remaining brownfield MVP rather than replaying already-built work, and should keep the active Supabase public-chat boundary intact unless a future phase explicitly changes that contract.

---
*Written: 2026-05-06*
