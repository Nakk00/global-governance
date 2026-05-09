---
phase: 3
slug: 03-maintainer-readiness-hardening
status: verified
threats_open: 0
asvs_level: 1
created: 2026-05-09
audited: 2026-05-09
---

# Phase 3 - Security

> Per-phase security contract: threat register, accepted risks, and audit trail.

---

## Trust Boundaries

| Boundary | Description | Data Crossing |
|----------|-------------|---------------|
| Maintainer browser session -> private shell | Local storage session data only hydrates the authenticated maintainer gate and route state. | Supabase access token, refresh token, expiry metadata, and private route or preset state. |
| Browser -> protected Django admin endpoints | The SPA reads protected stewardship and validation data only through `/api/admin/*` endpoints. | Maintainer identity, source records, validation runs, audit events, and mutation payloads. |
| Django views -> services -> repositories | Views delegate read/write work to services while repositories stay narrow and access raw persistence only. | Readiness rollups, source-detail summaries, validation envelopes, and mutation results. |
| Public learner bundle -> private maintainer modules | Public-facing surfaces are checked to avoid leaking private maintainer routes or auth helpers. | Build-time JS, TS, CSS, and HTML bundle contents. |

---

## Threat Register

| Threat ID | Category | Component | Disposition | Mitigation | Status |
|-----------|----------|-----------|-------------|------------|--------|
| T-03-01 | Spoofing / Elevation | `backend/accounts/permissions.py`, `backend/tests/test_admin_auth.py`, `src/components/modules/MaintainerDashboard/hooks/useMaintainerGate.ts` | mitigate | Protected admin requests require a Supabase bearer token, verified JWT claims, a matching maintainer profile, active status, and recorded login; the browser gate only hydrates the private shell after `/api/admin/me` succeeds. | closed |
| T-03-02 | Information Disclosure | `backend/sources/views.py`, `backend/validation/views.py`, `backend/common/responses.py`, `backend/tests/test_admin_stewardship.py`, `backend/tests/test_admin_validation.py`, `backend/tests/test_common_responses.py` | mitigate | Views return stable success/error envelopes with fixed codes and no traceback leakage, and malformed or missing resources are handled through documented error codes. | closed |
| T-03-03 | Tampering / Integrity | `src/components/modules/MaintainerDashboard/hooks/useMaintainerDashboardData.ts`, `src/components/modules/MaintainerDashboard/MaintainerDashboard.test.tsx` | mitigate | Dashboard and detail request keys prevent stale async responses from overwriting newer source-detail or mutation state; regression coverage proves older loads cannot win after a newer mutation. | closed |
| T-03-04 | Information Disclosure | `backend/tests/test_admin_auth.py`, `src/components/modules/MaintainerDashboard/MaintainerDashboard.test.tsx` | mitigate | Public-facing bundle scans and maintainer shell coverage keep `/api/admin`, `/_internal/admin`, and browser auth helpers out of the learner surface while preserving the private boundary. | closed |

---

## Accepted Risks Log

No accepted risks.

---

## Verification Evidence

- `pnpm backend:test backend/tests/test_admin_auth.py backend/tests/test_admin_stewardship.py backend/tests/test_admin_validation.py`
- `pnpm exec vitest run src/components/modules/MaintainerDashboard/MaintainerDashboard.test.tsx src/components/modules/MaintainerDashboard/hooks/useMaintainerNavigation.test.tsx`

---

## Security Audit Trail

| Audit Date | Threats Total | Closed | Open | Run By |
|------------|---------------|--------|------|--------|
| 2026-05-09 | 4 | 4 | 0 | Codex |

---

## Sign-Off

- [x] All threats have a disposition (mitigate / accept / transfer)
- [x] Accepted risks documented in Accepted Risks Log
- [x] `threats_open: 0` confirmed
- [x] `status: verified` set in frontmatter

**Approval:** verified 2026-05-09
