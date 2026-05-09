# Phase 3: Maintainer Readiness Hardening - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-05-09
**Phase:** 03-maintainer-readiness-hardening
**Areas discussed:** Maintainer dashboard split, backend stewardship seam

---

## Maintainer Dashboard Split

| Option | Description | Selected |
|--------|-------------|----------|
| Page containers | Make Overview, Sources, Source detail, Validation, and Operations real page-owned modules; keep only tiny shared helpers in the shell. | ✓ |
| Overview first | Focus the phase on a major Overview rewrite, with the other pages following the same split shape later. | |
| Shared shell | Keep most orchestration in the top-level shell and only extract a few helpers for now. | |

**User's choice:** Page containers
**Notes:** User chose the page-owned container split rather than an overview-first or shell-heavy variant.

---

## Backend Stewardship Seam

| Option | Description | Selected |
|--------|-------------|----------|
| Service shaping | Move readiness-oriented shaping into service modules and keep repositories narrow for raw retrieval and persistence. | ✓ |
| Repository split | Split the repository into smaller repository pieces first, then decide service shaping later. | |
| Light cleanup | Keep the current structure and only tighten payload handling or mutation guards. | |

**User's choice:** Service shaping
**Notes:** User deferred to the recommendation after the seam tradeoff was explained; the phase should treat service shaping as the real backend seam.

---

## the agent's Discretion

None beyond the phase-boundary decisions above.

## Deferred Ideas

- Shared chapter-learning and Student / Expert depth seams belong in Phase 1, not Phase 3.
