---
name: config
description: "Skill for the Config area of global-governance-docuweb. 3 symbols across 1 files."
---

# Config

3 symbols | 1 files | Cohesion: 100%

## When to Use

- Working with code in `backend/`
- Understanding how method_not_allowed_response, bootstrap_health, reserved_chat work
- Modifying config-related functionality

## Key Files

| File | Symbols |
|------|---------|
| `backend/config/api.py` | method_not_allowed_response, bootstrap_health, reserved_chat |

## Entry Points

Start here when exploring this area:

- **`method_not_allowed_response`** (Function) — `backend/config/api.py:16`
- **`bootstrap_health`** (Function) — `backend/config/api.py:24`
- **`reserved_chat`** (Function) — `backend/config/api.py:38`

## Key Symbols

| Symbol | Type | File | Line |
|--------|------|------|------|
| `method_not_allowed_response` | Function | `backend/config/api.py` | 16 |
| `bootstrap_health` | Function | `backend/config/api.py` | 24 |
| `reserved_chat` | Function | `backend/config/api.py` | 38 |

## How to Explore

1. `gitnexus_context({name: "method_not_allowed_response"})` — see callers and callees
2. `gitnexus_query({query: "config"})` — find related execution flows
3. Read key files listed above for implementation details
