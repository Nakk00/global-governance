---
name: chatbot
description: "Skill for the Chatbot area of global-governance-docuweb. 29 symbols across 7 files."
---

# Chatbot

29 symbols | 7 files | Cohesion: 87%

## When to Use

- Working with code in `backend/`
- Understanding how test_response_serialization_bounds_answer_citations_and_private_urls, serialize_chat_outcome, is_safe_public_url work
- Modifying chatbot-related functionality

## Key Files

| File | Symbols |
|------|---------|
| `scripts/chatbot/validate-chatbot-boundaries.ts` | readText, walkFiles, findForbiddenPatterns, findForbiddenPatternsInFiles, requireText (+4) |
| `backend/chatbot/nvidia.py` | check_topic, check_safety, _parse_guard_decision, _decision_from_guard_labels, embed (+3) |
| `backend/chatbot/contracts.py` | serialize_chat_outcome, _serialize_grounding, _serialize_citation, is_safe_public_url |
| `backend/tests/test_nvidia_model_roles.py` | test_model_roles_parse_topic_and_safety_guard_decisions, test_model_roles_normalize_native_guard_response_formats, test_model_roles_use_query_embedding_and_nvidia_rerank_contracts |
| `scripts/chatbot/approved-source-set.ts` | loadApprovedSourceFiles, parseManifestEntry, requiredString |
| `backend/tests/test_public_chat_contract.py` | test_response_serialization_bounds_answer_citations_and_private_urls |
| `backend/retrieval/services.py` | _citations_for |

## Entry Points

Start here when exploring this area:

- **`test_response_serialization_bounds_answer_citations_and_private_urls`** (Function) — `backend/tests/test_public_chat_contract.py:135`
- **`serialize_chat_outcome`** (Function) — `backend/chatbot/contracts.py:64`
- **`is_safe_public_url`** (Function) — `backend/chatbot/contracts.py:138`
- **`test_model_roles_parse_topic_and_safety_guard_decisions`** (Function) — `backend/tests/test_nvidia_model_roles.py:84`
- **`test_model_roles_normalize_native_guard_response_formats`** (Function) — `backend/tests/test_nvidia_model_roles.py:115`

## Key Symbols

| Symbol | Type | File | Line |
|--------|------|------|------|
| `test_response_serialization_bounds_answer_citations_and_private_urls` | Function | `backend/tests/test_public_chat_contract.py` | 135 |
| `serialize_chat_outcome` | Function | `backend/chatbot/contracts.py` | 64 |
| `is_safe_public_url` | Function | `backend/chatbot/contracts.py` | 138 |
| `test_model_roles_parse_topic_and_safety_guard_decisions` | Function | `backend/tests/test_nvidia_model_roles.py` | 84 |
| `test_model_roles_normalize_native_guard_response_formats` | Function | `backend/tests/test_nvidia_model_roles.py` | 115 |
| `test_model_roles_use_query_embedding_and_nvidia_rerank_contracts` | Function | `backend/tests/test_nvidia_model_roles.py` | 11 |
| `check_topic` | Method | `backend/chatbot/nvidia.py` | 336 |
| `check_safety` | Method | `backend/chatbot/nvidia.py` | 354 |
| `embed` | Method | `backend/chatbot/nvidia.py` | 230 |
| `rerank` | Method | `backend/chatbot/nvidia.py` | 285 |
| `readText` | Function | `scripts/chatbot/validate-chatbot-boundaries.ts` | 38 |
| `walkFiles` | Function | `scripts/chatbot/validate-chatbot-boundaries.ts` | 46 |
| `findForbiddenPatterns` | Function | `scripts/chatbot/validate-chatbot-boundaries.ts` | 77 |
| `findForbiddenPatternsInFiles` | Function | `scripts/chatbot/validate-chatbot-boundaries.ts` | 96 |
| `requireText` | Function | `scripts/chatbot/validate-chatbot-boundaries.ts` | 114 |
| `requireAbsentPaths` | Function | `scripts/chatbot/validate-chatbot-boundaries.ts` | 122 |
| `requireSupabaseConfigWithoutPublicChat` | Function | `scripts/chatbot/validate-chatbot-boundaries.ts` | 128 |
| `run` | Function | `scripts/chatbot/validate-chatbot-boundaries.ts` | 144 |
| `main` | Function | `scripts/chatbot/validate-chatbot-boundaries.ts` | 216 |
| `_citations_for` | Function | `backend/retrieval/services.py` | 110 |

## Connected Areas

| Area | Connections |
|------|-------------|
| Tests | 3 calls |

## How to Explore

1. `gitnexus_context({name: "test_response_serialization_bounds_answer_citations_and_private_urls"})` — see callers and callees
2. `gitnexus_query({query: "chatbot"})` — find related execution flows
3. Read key files listed above for implementation details
