from __future__ import annotations

import json
from pathlib import Path
from typing import Any

SECTION_SOURCE_PROJECTION_PATH = Path(__file__).with_name("section-source-projection.json")


def load_section_source_ids(
    path: Path = SECTION_SOURCE_PROJECTION_PATH,
) -> dict[str, tuple[str, ...]]:
    payload = json.loads(path.read_text(encoding="utf-8"))
    section_source_ids = _read_object(payload, "sectionSourceIds")

    return {
        section_id: tuple(_read_source_ids(source_ids, section_id))
        for section_id, source_ids in section_source_ids.items()
    }


def _read_object(payload: Any, key: str) -> dict[str, Any]:
    if not isinstance(payload, dict):
        raise ValueError("Section source projection must be a JSON object.")

    value = payload.get(key)
    if not isinstance(value, dict):
        raise ValueError(f"Section source projection is missing `{key}`.")

    return value


def _read_source_ids(value: Any, section_id: str) -> list[str]:
    if not isinstance(value, list):
        raise ValueError(f"Section `{section_id}` must define source ids as a list.")

    source_ids = [source_id for source_id in value if isinstance(source_id, str)]
    if len(source_ids) != len(value) or not source_ids:
        raise ValueError(f"Section `{section_id}` has invalid source ids.")

    return source_ids
