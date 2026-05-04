---
name: accounts
description: "Skill for the Accounts area of global-governance-docuweb. 23 symbols across 5 files."
---

# Accounts

23 symbols | 5 files | Cohesion: 100%

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
| `backend/accounts/views.py` | admin_me, _has_unexpected_body |
| `backend/accounts/permissions.py` | authorize_admin_request, _identity_from_profile |

## Entry Points

Start here when exploring this area:

- **`get_admin_profile_repository`** (Function) — `backend/accounts/services.py:149`
- **`provision_admin_profile`** (Function) — `backend/accounts/services.py:156`
- **`revoke_admin_profile`** (Function) — `backend/accounts/services.py:178`
- **`admin_me`** (Function) — `backend/accounts/views.py:10`
- **`authorize_admin_request`** (Function) — `backend/accounts/permissions.py:33`

## Key Symbols

| Symbol | Type | File | Line |
|--------|------|------|------|
| `AdminProfileRepositoryError` | Class | `backend/accounts/services.py` | 16 |
| `AdminProfileNotFoundError` | Class | `backend/accounts/services.py` | 20 |
| `get_admin_profile_repository` | Function | `backend/accounts/services.py` | 149 |
| `provision_admin_profile` | Function | `backend/accounts/services.py` | 156 |
| `revoke_admin_profile` | Function | `backend/accounts/services.py` | 178 |
| `admin_me` | Function | `backend/accounts/views.py` | 10 |
| `authorize_admin_request` | Function | `backend/accounts/permissions.py` | 33 |
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
| `_profile_from_record` | Function | `backend/accounts/services.py` | 135 |
| `_has_unexpected_body` | Function | `backend/accounts/views.py` | 40 |
| `_identity_from_profile` | Function | `backend/accounts/permissions.py` | 78 |

## How to Explore

1. `gitnexus_context({name: "get_admin_profile_repository"})` — see callers and callees
2. `gitnexus_query({query: "accounts"})` — find related execution flows
3. Read key files listed above for implementation details
