---
name: tests
description: "Skill for the Tests area of global-governance-docuweb. 55 symbols across 10 files."
---

# Tests

55 symbols | 10 files | Cohesion: 98%

## When to Use

- Working with code in `backend/`
- Understanding how main, load_env_file, validate_required_env work
- Modifying tests-related functionality

## Key Files

| File | Symbols |
|------|---------|
| `backend/tests/test_admin_stewardship.py` | test_sources_dashboard_returns_inventory_and_partial_markers, test_source_detail_exposes_distinct_history_groups, test_missing_source_returns_safe_404, test_source_chunk_inspection_defaults_to_latest_successful_document, test_source_citation_inspection_exposes_display_label_and_linked_chunks (+13) |
| `backend/tests/test_admin_auth.py` | test_malformed_or_expired_token_errors_return_401, test_unknown_maintainer_returns_403, test_inactive_maintainer_returns_403, test_disallowed_profile_role_returns_403, test_owner_profile_is_not_authorized_for_this_story (+6) |
| `backend/tests/test_admin_validation.py` | test_default_validation_set_is_listed_and_marked_default, test_launch_run_persists_summary_results_and_audit_events, test_launch_route_accepts_post_without_csrf_token_for_bearer_auth, test_run_list_empty_and_not_found_states_are_safe, test_launch_requires_non_blank_validation_set_id (+4) |
| `backend/common/env.py` | load_env_file, validate_required_env, validate_python_runtime, validate_backend_dependencies, validate_supabase_service (+1) |
| `backend/tests/test_project_bootstrap.py` | test_missing_required_env_reports_actionable_message, test_prerequisite_check_allows_mocked_available_services, test_missing_backend_dependencies_reports_actionable_message, test_invalid_supabase_url_reports_actionable_message |
| `backend/tests/test_common_responses.py` | test_error_envelope_uses_user_safe_fields, test_unexpected_exceptions_convert_to_safe_envelopes |
| `backend/common/responses.py` | error_envelope, exception_to_error_envelope |
| `backend/manage.py` | main |
| `backend/tests/test_request_validation.py` | test_validation_errors_convert_to_response_envelopes |
| `backend/common/validation.py` | to_envelope |

## Entry Points

Start here when exploring this area:

- **`main`** (Function) — `backend/manage.py:10`
- **`load_env_file`** (Function) — `backend/common/env.py:32`
- **`validate_required_env`** (Function) — `backend/common/env.py:44`
- **`validate_python_runtime`** (Function) — `backend/common/env.py:61`
- **`validate_backend_dependencies`** (Function) — `backend/common/env.py:69`

## Key Symbols

| Symbol | Type | File | Line |
|--------|------|------|------|
| `main` | Function | `backend/manage.py` | 10 |
| `load_env_file` | Function | `backend/common/env.py` | 32 |
| `validate_required_env` | Function | `backend/common/env.py` | 44 |
| `validate_python_runtime` | Function | `backend/common/env.py` | 61 |
| `validate_backend_dependencies` | Function | `backend/common/env.py` | 69 |
| `validate_supabase_service` | Function | `backend/common/env.py` | 77 |
| `check_backend_prerequisites` | Function | `backend/common/env.py` | 105 |
| `error_envelope` | Function | `backend/common/responses.py` | 16 |
| `exception_to_error_envelope` | Function | `backend/common/responses.py` | 39 |
| `test_sources_dashboard_returns_inventory_and_partial_markers` | Method | `backend/tests/test_admin_stewardship.py` | 26 |
| `test_source_detail_exposes_distinct_history_groups` | Method | `backend/tests/test_admin_stewardship.py` | 55 |
| `test_missing_source_returns_safe_404` | Method | `backend/tests/test_admin_stewardship.py` | 76 |
| `test_source_chunk_inspection_defaults_to_latest_successful_document` | Method | `backend/tests/test_admin_stewardship.py` | 86 |
| `test_source_citation_inspection_exposes_display_label_and_linked_chunks` | Method | `backend/tests/test_admin_stewardship.py` | 109 |
| `test_source_inspection_explains_missing_or_inactive_evidence` | Method | `backend/tests/test_admin_stewardship.py` | 128 |
| `test_chunk_and_citation_detail_return_safe_404_and_linked_evidence` | Method | `backend/tests/test_admin_stewardship.py` | 155 |
| `test_operational_endpoints_return_read_only_events` | Method | `backend/tests/test_admin_stewardship.py` | 190 |
| `test_dashboard_view_delegates_to_service_layer` | Method | `backend/tests/test_admin_stewardship.py` | 200 |
| `test_sources_dashboard_falls_back_when_store_is_unavailable` | Method | `backend/tests/test_admin_stewardship.py` | 217 |
| `test_dashboard_monitoring_updates_after_ingest_and_audit_events` | Method | `backend/tests/test_admin_stewardship.py` | 234 |

## Execution Flows

| Flow | Type | Steps |
|------|------|-------|
| `Source_detail → Error_envelope` | cross_community | 5 |
| `Validation_runs → Error_envelope` | cross_community | 5 |
| `Source_activate → Error_envelope` | cross_community | 5 |
| `Source_approve → Error_envelope` | cross_community | 5 |
| `Source_disable → Error_envelope` | cross_community | 5 |
| `Source_archive → Error_envelope` | cross_community | 5 |
| `Validation_run_detail → Error_envelope` | cross_community | 4 |
| `Dashboard → Error_envelope` | cross_community | 4 |
| `Source_chunks → Error_envelope` | cross_community | 4 |
| `Source_citations → Error_envelope` | cross_community | 4 |

## How to Explore

1. `gitnexus_context({name: "main"})` — see callers and callees
2. `gitnexus_query({query: "tests"})` — find related execution flows
3. Read key files listed above for implementation details
