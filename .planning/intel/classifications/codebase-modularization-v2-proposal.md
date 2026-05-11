# Classification: codebase-modularization-v2-proposal.md

path: archive/docs/planning-artifacts/codebase-modularization-v2-proposal.md
type: SPEC
precedence: SPEC
title: Global Governance Codebase Modularization v2 Proposal
scope_summary: Conservative post-brownfield modularization plan for the private maintainer console frontend and source stewardship backend.

## Extracted Intent

The document proposes a sequenced modularization effort that starts with the private maintainer console frontend, especially `maintainerDashboardShared.tsx`, then moves through source inventory, backend source repository extraction, overview page decomposition, and maintainer API wrapper splitting.

## Key Scope

- Split maintainer dashboard shared infrastructure from feature-owned page implementations.
- Move source detail, validation, audit trail, and chatbot trust implementation into feature-owned folders.
- Make `SourcesPage.tsx` a page coordinator rather than a combined page/component library.
- Split `backend/sources/repository.py` into contract, mapper, seed, storage, mutation, memory, and Supabase implementation modules.
- Split overview data builders from presentation.
- Split maintainer API wrappers by feature while preserving shared envelope/session handling.

## Cross References

- Supersedes: `archive/docs/planning-artifacts/codebase-modularization-v1-proposal.md`
- Related current planning: `.planning/phases/03-maintainer-readiness-hardening/03-CONTEXT.md`
- Related current planning: `.planning/phases/05-admin-ux-polish-for-maintainers/05-CONTEXT.md`
