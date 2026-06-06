---
name: tests
description: "Skill for the Tests area of global-governance-docuweb. 148 symbols across 30 files."
---

# Tests

148 symbols | 30 files | Cohesion: 92%

## When to Use

- Working with code in `backend/`
- Understanding how main, load_env_file, validate_required_env work
- Modifying tests-related functionality

## Key Files

| File | Symbols |
|------|---------|
| `backend/tests/test_admin_stewardship.py` | test_sources_dashboard_returns_inventory_and_partial_markers, test_source_detail_exposes_distinct_history_groups, test_missing_source_returns_safe_404, test_source_chunk_inspection_defaults_to_latest_successful_document, test_source_citation_inspection_exposes_display_label_and_linked_chunks (+13) |
| `backend/tests/chatbot_fakes.py` | get, set, incr, delete, ttl (+10) |
| `backend/tests/test_chatbot_orchestration.py` | test_strong_support_uses_all_model_roles_and_preserves_expert_depth, test_weak_support_returns_limited_state_without_generation, test_off_topic_prompt_is_refused_before_retrieval, test_unsafe_prompt_returns_bounded_refusal_without_internal_details, test_unsafe_generated_output_becomes_a_typed_fallback (+8) |
| `backend/tests/test_admin_auth.py` | test_malformed_or_expired_token_errors_return_401, test_unknown_maintainer_returns_403, test_inactive_maintainer_returns_403, test_disallowed_profile_role_returns_403, test_owner_profile_is_not_authorized_for_this_story (+6) |
| `backend/common/env.py` | load_env_file, validate_required_env, validate_python_runtime, validate_backend_dependencies, check_backend_prerequisites (+4) |
| `backend/tests/test_admin_validation.py` | test_default_validation_set_is_listed_and_marked_default, test_launch_run_persists_summary_results_and_audit_events, test_launch_route_accepts_post_without_csrf_token_for_bearer_auth, test_run_list_empty_and_not_found_states_are_safe, test_launch_requires_non_blank_validation_set_id (+4) |
| `backend/tests/test_retrieval_service.py` | test_retrieval_filters_inactive_sources_and_scopes_to_current_section, test_retrieval_classifies_strong_support_and_packages_stable_safe_citations, test_retrieval_returns_weak_support_without_fabricating_citations, test_retrieval_accepts_relevant_nvidia_scores_after_logit_normalization, _candidate (+2) |
| `backend/tests/test_approved_source_manifest.py` | _write_manifest, _entry, test_manifest_keeps_raw_and_normalized_files_on_one_canonical_source_identity, test_manifest_rejects_duplicate_revisions_missing_files_and_unsupported_types, test_manifest_rejects_file_type_mismatch_and_parent_traversal (+2) |
| `backend/tests/test_project_bootstrap.py` | test_missing_required_env_reports_actionable_message, test_prerequisite_check_allows_mocked_available_services, test_prerequisite_check_validates_required_local_services, test_missing_backend_dependencies_reports_actionable_message, test_invalid_supabase_url_reports_actionable_message (+1) |
| `backend/tests/test_ingestion_repository.py` | test_persistence_writes_private_object_document_chunks_references_and_vectors_atomically, test_persistence_is_idempotent_for_the_same_document_revision, test_persistence_rolls_back_every_write_after_partial_failure, test_persistence_rejects_public_storage_and_synthetic_production_vectors, _payload |

## Entry Points

Start here when exploring this area:

- **`main`** (Function) — `backend/manage.py:10`
- **`load_env_file`** (Function) — `backend/common/env.py:33`
- **`validate_required_env`** (Function) — `backend/common/env.py:45`
- **`validate_python_runtime`** (Function) — `backend/common/env.py:62`
- **`validate_backend_dependencies`** (Function) — `backend/common/env.py:70`

## Key Symbols

| Symbol | Type | File | Line |
|--------|------|------|------|
| `LowPositiveRerankModels` | Class | `backend/tests/test_retrieval_service.py` | 154 |
| `UnsafePromptModels` | Class | `backend/tests/test_chatbot_orchestration.py` | 164 |
| `UnsafeOutputModels` | Class | `backend/tests/test_chatbot_orchestration.py` | 170 |
| `FailingTopicGuardModels` | Class | `backend/tests/test_chatbot_orchestration.py` | 184 |
| `FakeNvidiaModelRoles` | Class | `backend/tests/chatbot_fakes.py` | 96 |
| `main` | Function | `backend/manage.py` | 10 |
| `load_env_file` | Function | `backend/common/env.py` | 33 |
| `validate_required_env` | Function | `backend/common/env.py` | 45 |
| `validate_python_runtime` | Function | `backend/common/env.py` | 62 |
| `validate_backend_dependencies` | Function | `backend/common/env.py` | 70 |
| `check_backend_prerequisites` | Function | `backend/common/env.py` | 144 |
| `test_strong_support_uses_all_model_roles_and_preserves_expert_depth` | Function | `backend/tests/test_chatbot_orchestration.py` | 10 |
| `test_weak_support_returns_limited_state_without_generation` | Function | `backend/tests/test_chatbot_orchestration.py` | 47 |
| `test_off_topic_prompt_is_refused_before_retrieval` | Function | `backend/tests/test_chatbot_orchestration.py` | 68 |
| `test_unsafe_prompt_returns_bounded_refusal_without_internal_details` | Function | `backend/tests/test_chatbot_orchestration.py` | 83 |
| `test_unsafe_generated_output_becomes_a_typed_fallback` | Function | `backend/tests/test_chatbot_orchestration.py` | 99 |
| `test_provider_failure_becomes_a_safe_typed_fallback` | Function | `backend/tests/test_chatbot_orchestration.py` | 114 |
| `test_persistence_writes_private_object_document_chunks_references_and_vectors_atomically` | Function | `backend/tests/test_ingestion_repository.py` | 27 |
| `test_persistence_is_idempotent_for_the_same_document_revision` | Function | `backend/tests/test_ingestion_repository.py` | 52 |
| `test_persistence_rolls_back_every_write_after_partial_failure` | Function | `backend/tests/test_ingestion_repository.py` | 66 |

## Execution Flows

| Flow | Type | Steps |
|------|------|-------|
| `Dispatch_ingest → _normalized_path` | cross_community | 7 |
| `Dispatch_ingest → _required_string` | cross_community | 7 |
| `Dispatch_ingest → _resolve_approved_path` | cross_community | 7 |
| `Dispatch_ingest → _required_mapping` | cross_community | 7 |
| `Dispatch_ingest → _validate_manifest_entries` | cross_community | 6 |
| `Dispatch_ingest → Normalize_source_text` | cross_community | 6 |
| `Dispatch_ingest → Extract_source_text` | cross_community | 6 |
| `Source_detail → Error_envelope` | cross_community | 5 |
| `Validation_runs → Error_envelope` | cross_community | 5 |
| `Source_activate → Error_envelope` | cross_community | 5 |

## Connected Areas

| Area | Connections |
|------|-------------|
| Ingestion | 5 calls |
| Chatbot | 2 calls |

## How to Explore

1. `gitnexus_context({name: "main"})` — see callers and callees
2. `gitnexus_query({query: "tests"})` — find related execution flows
3. Read key files listed above for implementation details
