---
name: accounts
description: "Skill for the Accounts area of global-governance-docuweb. 20 symbols across 4 files."
---

# Accounts

20 symbols | 4 files | Cohesion: 98%

## When to Use

- Working with code in `backend/`
- Understanding how get_admin_profile_repository, provision_admin_profile, revoke_admin_profile work
- Modifying accounts-related functionality

## Key Files

| File | Symbols |
|------|---------|
| `backend/accounts/services.py` | get_by_supabase_user_id, record_login, upsert, revoke, _request (+6) |
| `backend/tests/test_admin_auth.py` | test_verifier_uses_configured_issuer_audience_role_and_jwks, test_jwks_failure_refreshes_cache_and_fails_safely, test_verified_claims_reject_wrong_supabase_role, test_upsert_targets_supabase_user_id_conflict |
| `backend/accounts/auth.py` | verify, refresh_keys, _jwks_client, _claims_from_payload |
| `backend/accounts/management/commands/provision_admin.py` | handle |

## Entry Points

Start here when exploring this area:

- **`get_admin_profile_repository`** (Function) — `backend/accounts/services.py:149`
- **`provision_admin_profile`** (Function) — `backend/accounts/services.py:156`
- **`revoke_admin_profile`** (Function) — `backend/accounts/services.py:178`
- **`AdminProfileRepositoryError`** (Class) — `backend/accounts/services.py:16`
- **`AdminProfileNotFoundError`** (Class) — `backend/accounts/services.py:20`

## Key Symbols

| Symbol | Type | File | Line |
|--------|------|------|------|
| `AdminProfileRepositoryError` | Class | `backend/accounts/services.py` | 16 |
| `AdminProfileNotFoundError` | Class | `backend/accounts/services.py` | 20 |
| `get_admin_profile_repository` | Function | `backend/accounts/services.py` | 149 |
| `provision_admin_profile` | Function | `backend/accounts/services.py` | 156 |
| `revoke_admin_profile` | Function | `backend/accounts/services.py` | 178 |
| `test_verifier_uses_configured_issuer_audience_role_and_jwks` | Method | `backend/tests/test_admin_auth.py` | 244 |
| `test_jwks_failure_refreshes_cache_and_fails_safely` | Method | `backend/tests/test_admin_auth.py` | 277 |
| `test_verified_claims_reject_wrong_supabase_role` | Method | `backend/tests/test_admin_auth.py` | 297 |
| `verify` | Method | `backend/accounts/auth.py` | 77 |
| `refresh_keys` | Method | `backend/accounts/auth.py` | 105 |
| `test_upsert_targets_supabase_user_id_conflict` | Method | `backend/tests/test_admin_auth.py` | 365 |
| `get_by_supabase_user_id` | Method | `backend/accounts/services.py` | 48 |
| `record_login` | Method | `backend/accounts/services.py` | 60 |
| `upsert` | Method | `backend/accounts/services.py` | 70 |
| `revoke` | Method | `backend/accounts/services.py` | 88 |
| `handle` | Method | `backend/accounts/management/commands/provision_admin.py` | 24 |
| `_profile_from_record` | Function | `backend/accounts/services.py` | 135 |
| `_jwks_client` | Method | `backend/accounts/auth.py` | 109 |
| `_claims_from_payload` | Method | `backend/accounts/auth.py` | 119 |
| `_request` | Method | `backend/accounts/services.py` | 104 |

## Execution Flows

| Flow | Type | Steps |
|------|------|-------|
| `Source_detail → Get_admin_profile_repository` | cross_community | 5 |
| `Source_activate → Get_admin_profile_repository` | cross_community | 5 |
| `Source_approve → Get_admin_profile_repository` | cross_community | 5 |
| `Source_disable → Get_admin_profile_repository` | cross_community | 5 |
| `Source_archive → Get_admin_profile_repository` | cross_community | 5 |
| `Validation_runs → Get_admin_profile_repository` | cross_community | 4 |
| `Validation_run_detail → Get_admin_profile_repository` | cross_community | 4 |
| `Dashboard → Get_admin_profile_repository` | cross_community | 4 |
| `Source_chunks → Get_admin_profile_repository` | cross_community | 4 |
| `Source_citations → Get_admin_profile_repository` | cross_community | 4 |

## How to Explore

1. `gitnexus_context({name: "get_admin_profile_repository"})` — see callers and callees
2. `gitnexus_query({query: "accounts"})` — find related execution flows
3. Read key files listed above for implementation details
