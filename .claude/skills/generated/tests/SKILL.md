---
name: tests
description: "Skill for the Tests area of global-governance-docuweb. 20 symbols across 4 files."
---

# Tests

20 symbols | 4 files | Cohesion: 100%

## When to Use

- Working with code in `backend/`
- Understanding how test_malformed_or_expired_token_errors_return_401, test_unknown_maintainer_returns_403, test_inactive_maintainer_returns_403 work
- Modifying tests-related functionality

## Key Files

| File | Symbols |
|------|---------|
| `backend/tests/test_admin_auth.py` | test_malformed_or_expired_token_errors_return_401, test_unknown_maintainer_returns_403, test_inactive_maintainer_returns_403, test_disallowed_profile_role_returns_403, test_owner_profile_is_not_authorized_for_this_story (+6) |
| `backend/tests/test_admin_stewardship.py` | test_sources_dashboard_returns_inventory_and_partial_markers, test_source_detail_exposes_distinct_history_groups, test_missing_source_returns_safe_404, test_operational_endpoints_return_read_only_events, test_revoked_session_error_stays_distinguishable (+2) |
| `backend/tests/test_request_validation.py` | test_validation_errors_convert_to_response_envelopes |
| `backend/common/validation.py` | to_envelope |

## Entry Points

Start here when exploring this area:

- **`test_malformed_or_expired_token_errors_return_401`** (Method) — `backend/tests/test_admin_auth.py:103`
- **`test_unknown_maintainer_returns_403`** (Method) — `backend/tests/test_admin_auth.py:117`
- **`test_inactive_maintainer_returns_403`** (Method) — `backend/tests/test_admin_auth.py:124`
- **`test_disallowed_profile_role_returns_403`** (Method) — `backend/tests/test_admin_auth.py:135`
- **`test_owner_profile_is_not_authorized_for_this_story`** (Method) — `backend/tests/test_admin_auth.py:144`

## Key Symbols

| Symbol | Type | File | Line |
|--------|------|------|------|
| `test_malformed_or_expired_token_errors_return_401` | Method | `backend/tests/test_admin_auth.py` | 103 |
| `test_unknown_maintainer_returns_403` | Method | `backend/tests/test_admin_auth.py` | 117 |
| `test_inactive_maintainer_returns_403` | Method | `backend/tests/test_admin_auth.py` | 124 |
| `test_disallowed_profile_role_returns_403` | Method | `backend/tests/test_admin_auth.py` | 135 |
| `test_owner_profile_is_not_authorized_for_this_story` | Method | `backend/tests/test_admin_auth.py` | 144 |
| `test_valid_maintainer_returns_canonical_identity_and_records_login` | Method | `backend/tests/test_admin_auth.py` | 153 |
| `test_internal_admin_alias_delegates_to_same_boundary` | Method | `backend/tests/test_admin_auth.py` | 172 |
| `test_verifier_unavailable_returns_401` | Method | `backend/tests/test_admin_auth.py` | 193 |
| `test_profile_lookup_failure_returns_stable_503` | Method | `backend/tests/test_admin_auth.py` | 205 |
| `test_login_write_failure_returns_stable_503` | Method | `backend/tests/test_admin_auth.py` | 217 |
| `test_sources_dashboard_returns_inventory_and_partial_markers` | Method | `backend/tests/test_admin_stewardship.py` | 20 |
| `test_source_detail_exposes_distinct_history_groups` | Method | `backend/tests/test_admin_stewardship.py` | 33 |
| `test_missing_source_returns_safe_404` | Method | `backend/tests/test_admin_stewardship.py` | 52 |
| `test_operational_endpoints_return_read_only_events` | Method | `backend/tests/test_admin_stewardship.py` | 62 |
| `test_revoked_session_error_stays_distinguishable` | Method | `backend/tests/test_admin_stewardship.py` | 72 |
| `test_retryable_outage_error_stays_distinguishable` | Method | `backend/tests/test_admin_stewardship.py` | 84 |
| `test_validation_errors_convert_to_response_envelopes` | Method | `backend/tests/test_request_validation.py` | 50 |
| `to_envelope` | Method | `backend/common/validation.py` | 17 |
| `_patched_auth` | Method | `backend/tests/test_admin_auth.py` | 230 |
| `_authorized` | Method | `backend/tests/test_admin_stewardship.py` | 96 |

## How to Explore

1. `gitnexus_context({name: "test_malformed_or_expired_token_errors_return_401"})` — see callers and callees
2. `gitnexus_query({query: "tests"})` — find related execution flows
3. Read key files listed above for implementation details
