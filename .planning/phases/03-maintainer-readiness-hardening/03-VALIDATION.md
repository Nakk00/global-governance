---
phase: 3
slug: 03-maintainer-readiness-hardening
status: verified
nyquist_compliant: true
wave_0_complete: true
created: 2026-05-09
audited: 2026-05-09
---

# Phase 3 - Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Vitest, Playwright, pytest-django |
| **Config file** | `vitest.config.ts`, `playwright.config.ts`, `backend/pyproject.toml` |
| **Quick run command** | `pnpm exec vitest run src/components/modules/MaintainerDashboard/MaintainerDashboard.test.tsx src/components/modules/MaintainerDashboard/hooks/useMaintainerNavigation.test.tsx && pnpm backend:test backend/tests/test_admin_auth.py backend/tests/test_admin_stewardship.py backend/tests/test_admin_validation.py` |
| **Full suite command** | `pnpm test:unit && pnpm test:e2e && pnpm backend:test && pnpm backend:check` |
| **Estimated runtime** | ~160 seconds |

---

## Sampling Rate

- **After every task commit:** Run the quick run command
- **After every plan wave:** Run the full suite command
- **Before `$gsd-verify-work`:** Full suite must be green
- **Max feedback latency:** 160 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 03-01-01 | 01 | 1 | READY-01 | T-03-01 / T-03-03 | Readiness cards preserve private-shell routing and avoid stale async overwrites while keeping the overview health-first. | unit | `pnpm exec vitest run src/components/modules/MaintainerDashboard/MaintainerDashboard.test.tsx` | ✅ | ✅ green |
| 03-01-02 | 01 | 1 | READY-01 / READY-02 | T-03-03 | Source detail leads with the blocker summary and inline validation evidence before deeper inspection. | unit | `pnpm exec vitest run src/components/modules/MaintainerDashboard/MaintainerDashboard.test.tsx` | ✅ | ✅ green |
| 03-01-03 | 01 | 1 | READY-01 / READY-02 | T-03-03 / T-03-04 | Readiness drill-downs stay path-specific, and the browser smoke journey proves overview -> source detail navigation. | unit + e2e | `pnpm test:e2e` | ✅ | ✅ green |
| 03-02-01 | 02 | 2 | READY-03 | T-03-01 / T-03-04 | The shell owns auth, navigation, and small shared readiness context while private sections stay visible. | unit | `pnpm exec vitest run src/components/modules/MaintainerDashboard/MaintainerDashboard.test.tsx src/components/modules/MaintainerDashboard/hooks/useMaintainerNavigation.test.tsx` | ✅ | ✅ green |
| 03-02-02 | 02 | 2 | READY-03 | T-03-04 | Extracted page containers preserve the private maintainer UI without leaking public learner routes. | unit | `pnpm test:unit` | ✅ | ✅ green |
| 03-02-03 | 02 | 2 | READY-03 | T-03-03 | The navigation hook preserves preset state and malformed routes safely normalize back to the overview. | unit | `pnpm exec vitest run src/components/modules/MaintainerDashboard/hooks/useMaintainerNavigation.test.tsx` | ✅ | ✅ green |
| 03-03-01 | 03 | 1 | READY-02 / READY-03 | T-03-02 / T-03-01 | Service-backed stewardship and validation seams preserve protected envelopes while moving orchestration out of repositories. | backend | `pnpm backend:test backend/tests/test_admin_auth.py backend/tests/test_admin_stewardship.py backend/tests/test_admin_validation.py` | ✅ | ✅ green |
| 03-03-02 | 03 | 1 | READY-02 | T-03-02 | Thin views still return the same safe success/error shapes for missing records and protected auth failures. | backend | `pnpm backend:test backend/tests/test_admin_stewardship.py backend/tests/test_admin_validation.py` | ✅ | ✅ green |
| 03-03-03 | 03 | 1 | READY-02 / READY-03 | T-03-02 / T-03-04 | Integration tests prove delegation and fallback behavior without changing the protected maintainer contract. | backend | `pnpm backend:test && pnpm backend:check` | ✅ | ✅ green |

---

## Wave 0 Requirements

Existing infrastructure covers all phase requirements.

---

## Manual-Only Verifications

All phase behaviors have automated verification.

---

## Validation Sign-Off

- [x] All tasks have `<automated>` verify or Wave 0 dependencies
- [x] Sampling continuity: no 3 consecutive tasks without automated verify
- [x] Wave 0 covers all MISSING references
- [x] No watch-mode flags
- [x] Feedback latency < 160s
- [x] `nyquist_compliant: true` set in frontmatter

**Approval:** approved 2026-05-09

---

## Validation Audit 2026-05-09

| Metric | Count |
|--------|-------|
| Gaps found | 0 |
| Resolved | 0 |
| Escalated | 0 |
