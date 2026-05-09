---
name: tests
description: "Skill for the Tests area of global-governance-docuweb. 39 symbols across 5 files."
---

# Tests

39 symbols | 5 files | Cohesion: 100%

## When to Use

- Working with code in `backend/`
- Understanding how test_sources_dashboard_returns_inventory_and_partial_markers, test_source_detail_exposes_distinct_history_groups, test_missing_source_returns_safe_404 work
- Modifying tests-related functionality

## Key Files

| File | Symbols |
|------|---------|
| `backend/tests/test_admin_stewardship.py` | test_sources_dashboard_returns_inventory_and_partial_markers, test_source_detail_exposes_distinct_history_groups, test_missing_source_returns_safe_404, test_source_chunk_inspection_defaults_to_latest_successful_document, test_source_citation_inspection_exposes_display_label_and_linked_chunks (+11) |
| `backend/tests/test_admin_auth.py` | test_malformed_or_expired_token_errors_return_401, test_unknown_maintainer_returns_403, test_inactive_maintainer_returns_403, test_disallowed_profile_role_returns_403, test_owner_profile_is_not_authorized_for_this_story (+6) |
| `backend/tests/test_admin_validation.py` | test_default_validation_set_is_listed_and_marked_default, test_launch_run_persists_summary_results_and_audit_events, test_duplicate_in_flight_launch_returns_safe_conflict, test_launch_route_accepts_post_without_csrf_token_for_bearer_auth, test_run_list_empty_and_not_found_states_are_safe (+5) |
| `backend/tests/test_request_validation.py` | test_validation_errors_convert_to_response_envelopes |
| `backend/common/validation.py` | to_envelope |

## Entry Points

Start here when exploring this area:

- **`test_sources_dashboard_returns_inventory_and_partial_markers`** (Method) — `backend/tests/test_admin_stewardship.py:25`
- **`test_source_detail_exposes_distinct_history_groups`** (Method) — `backend/tests/test_admin_stewardship.py:42`
- **`test_missing_source_returns_safe_404`** (Method) — `backend/tests/test_admin_stewardship.py:61`
- **`test_source_chunk_inspection_defaults_to_latest_successful_document`** (Method) — `backend/tests/test_admin_stewardship.py:71`
- **`test_source_citation_inspection_exposes_display_label_and_linked_chunks`** (Method) — `backend/tests/test_admin_stewardship.py:94`

## Key Symbols

| Symbol | Type | File | Line |
|--------|------|------|------|
| `test_sources_dashboard_returns_inventory_and_partial_markers` | Method | `backend/tests/test_admin_stewardship.py` | 25 |
| `test_source_detail_exposes_distinct_history_groups` | Method | `backend/tests/test_admin_stewardship.py` | 42 |
| `test_missing_source_returns_safe_404` | Method | `backend/tests/test_admin_stewardship.py` | 61 |
| `test_source_chunk_inspection_defaults_to_latest_successful_document` | Method | `backend/tests/test_admin_stewardship.py` | 71 |
| `test_source_citation_inspection_exposes_display_label_and_linked_chunks` | Method | `backend/tests/test_admin_stewardship.py` | 94 |
| `test_source_inspection_explains_missing_or_inactive_evidence` | Method | `backend/tests/test_admin_stewardship.py` | 113 |
| `test_chunk_and_citation_detail_return_safe_404_and_linked_evidence` | Method | `backend/tests/test_admin_stewardship.py` | 140 |
| `test_operational_endpoints_return_read_only_events` | Method | `backend/tests/test_admin_stewardship.py` | 175 |
| `test_dashboard_view_delegates_to_service_layer` | Method | `backend/tests/test_admin_stewardship.py` | 185 |
| `test_upload_creates_draft_inactive_source_and_audit_event` | Method | `backend/tests/test_admin_stewardship.py` | 204 |
| `test_upload_rejects_empty_unsupported_and_conflicting_files_safely` | Method | `backend/tests/test_admin_stewardship.py` | 236 |
| `test_metadata_edit_persists_and_records_audit` | Method | `backend/tests/test_admin_stewardship.py` | 290 |
| `test_lifecycle_transition_and_ingest_rules_are_safe` | Method | `backend/tests/test_admin_stewardship.py` | 311 |
| `test_revoked_session_error_stays_distinguishable` | Method | `backend/tests/test_admin_stewardship.py` | 381 |
| `test_retryable_outage_error_stays_distinguishable` | Method | `backend/tests/test_admin_stewardship.py` | 393 |
| `test_malformed_or_expired_token_errors_return_401` | Method | `backend/tests/test_admin_auth.py` | 103 |
| `test_unknown_maintainer_returns_403` | Method | `backend/tests/test_admin_auth.py` | 117 |
| `test_inactive_maintainer_returns_403` | Method | `backend/tests/test_admin_auth.py` | 124 |
| `test_disallowed_profile_role_returns_403` | Method | `backend/tests/test_admin_auth.py` | 135 |
| `test_owner_profile_is_not_authorized_for_this_story` | Method | `backend/tests/test_admin_auth.py` | 144 |

## How to Explore

1. `gitnexus_context({name: "test_sources_dashboard_returns_inventory_and_partial_markers"})` — see callers and callees
2. `gitnexus_query({query: "tests"})` — find related execution flows
3. Read key files listed above for implementation details
