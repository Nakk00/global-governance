---
name: scripts
description: "Skill for the Scripts area of Global-Governance. 15 symbols across 2 files."
---

# Scripts

15 symbols | 2 files | Cohesion: 92%

## When to Use

- Working with code in `_bmad/`
- Understanding how load_toml, deep_merge, extract_key work
- Modifying scripts-related functionality

## Key Files

| File | Symbols |
|------|---------|
| `_bmad/scripts/resolve_customization.py` | find_project_root, load_toml, extract_key, main, _detect_keyed_merge_field (+3) |
| `_bmad/scripts/resolve_config.py` | load_toml, _detect_keyed_merge_field, _merge_by_key, _merge_arrays, deep_merge (+2) |

## Entry Points

Start here when exploring this area:

- **`load_toml`** (Function) — `_bmad/scripts/resolve_config.py:44`
- **`deep_merge`** (Function) — `_bmad/scripts/resolve_config.py:111`
- **`extract_key`** (Function) — `_bmad/scripts/resolve_config.py:125`
- **`main`** (Function) — `_bmad/scripts/resolve_config.py:136`
- **`find_project_root`** (Function) — `_bmad/scripts/resolve_customization.py:55`

## Key Symbols

| Symbol | Type | File | Line |
|--------|------|------|------|
| `load_toml` | Function | `_bmad/scripts/resolve_config.py` | 44 |
| `deep_merge` | Function | `_bmad/scripts/resolve_config.py` | 111 |
| `extract_key` | Function | `_bmad/scripts/resolve_config.py` | 125 |
| `main` | Function | `_bmad/scripts/resolve_config.py` | 136 |
| `find_project_root` | Function | `_bmad/scripts/resolve_customization.py` | 55 |
| `load_toml` | Function | `_bmad/scripts/resolve_customization.py` | 66 |
| `extract_key` | Function | `_bmad/scripts/resolve_customization.py` | 168 |
| `main` | Function | `_bmad/scripts/resolve_customization.py` | 179 |
| `deep_merge` | Function | `_bmad/scripts/resolve_customization.py` | 149 |
| `_detect_keyed_merge_field` | Function | `_bmad/scripts/resolve_config.py` | 70 |
| `_merge_by_key` | Function | `_bmad/scripts/resolve_config.py` | 79 |
| `_merge_arrays` | Function | `_bmad/scripts/resolve_config.py` | 102 |
| `_detect_keyed_merge_field` | Function | `_bmad/scripts/resolve_customization.py` | 95 |
| `_merge_by_key` | Function | `_bmad/scripts/resolve_customization.py` | 112 |
| `_merge_arrays` | Function | `_bmad/scripts/resolve_customization.py` | 138 |

## Execution Flows

| Flow | Type | Steps |
|------|------|-------|
| `Main → _detect_keyed_merge_field` | cross_community | 4 |
| `Main → _merge_by_key` | cross_community | 4 |
| `Main → _detect_keyed_merge_field` | intra_community | 4 |
| `Main → _merge_by_key` | intra_community | 4 |

## How to Explore

1. `gitnexus_context({name: "load_toml"})` — see callers and callees
2. `gitnexus_query({query: "scripts"})` — find related execution flows
3. Read key files listed above for implementation details
