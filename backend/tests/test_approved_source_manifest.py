from __future__ import annotations

import json
from pathlib import Path

import pytest

from ingestion.pipeline import ManifestValidationError, load_approved_source_manifest
from tests.fixtures.chatbot_sources import SECTION_CONTEXT_FIXTURES, approved_source_records

REPO_ROOT = Path(__file__).resolve().parents[2]
MANIFEST_PATH = REPO_ROOT / "archive" / "docs" / "approved-sources" / "manifest.json"
SOURCE_ROOT = REPO_ROOT / "archive" / "docs" / "approved-sources"


def _write_manifest(tmp_path: Path, entries: list[dict[str, object]]) -> Path:
    manifest_path = tmp_path / "archive/docs/approved-sources/manifest.json"
    manifest_path.parent.mkdir(parents=True, exist_ok=True)
    manifest_path.write_text(
        json.dumps({"version": "2026-06-06", "sources": entries}),
        encoding="utf-8",
    )
    return manifest_path


def _entry(
    source_path: str,
    *,
    revision: str = "2026-06-06",
    lineage: dict[str, str] | None = None,
) -> dict[str, object]:
    return {
        "sourcePath": source_path,
        "sourceId": "gg-src-global-governance-course-frame",
        "fileType": Path(source_path).suffix.removeprefix("."),
        "revision": revision,
        "storage": {
            "bucket": "processed-exports",
            "path": source_path.removeprefix("archive/docs/approved-sources/"),
        },
        "lineage": lineage
        or {
            "kind": "raw",
            "rawSourcePath": source_path,
        },
    }


def test_manifest_covers_every_staged_supported_source_file() -> None:
    manifest = load_approved_source_manifest(MANIFEST_PATH, repo_root=REPO_ROOT)
    staged_paths = {
        path.relative_to(REPO_ROOT).as_posix()
        for path in SOURCE_ROOT.rglob("*")
        if path.is_file() and path.suffix.lower() in {".md", ".pdf"} and path.name != "README.md"
    }

    assert {entry.source_path for entry in manifest.entries} == staged_paths
    assert all(entry.source_id.startswith("gg-src-") for entry in manifest.entries)


def test_manifest_and_backend_fixtures_cover_section_scoped_chat_sources() -> None:
    manifest = load_approved_source_manifest(MANIFEST_PATH, repo_root=REPO_ROOT)
    manifest_source_ids = {entry.source_id for entry in manifest.entries}
    fixture_source_ids = {source.source_id for source in approved_source_records()}

    for section in SECTION_CONTEXT_FIXTURES.values():
        for source_id in section.approved_source_ids:
            assert source_id in manifest_source_ids
            assert source_id in fixture_source_ids


def test_manifest_keeps_raw_and_normalized_files_on_one_canonical_source_identity(
    tmp_path: Path,
) -> None:
    raw_path = tmp_path / "archive/docs/approved-sources/raw/source.md"
    normalized_path = tmp_path / "archive/docs/approved-sources/normalized/source.md"
    raw_path.parent.mkdir(parents=True)
    normalized_path.parent.mkdir(parents=True)
    raw_path.write_text("# Raw source", encoding="utf-8")
    normalized_path.write_text("# Normalized source", encoding="utf-8")
    manifest_path = _write_manifest(
        tmp_path,
        [
            _entry(
                "archive/docs/approved-sources/raw/source.md",
                revision="raw-2026-06-06",
            ),
            _entry(
                "archive/docs/approved-sources/normalized/source.md",
                revision="normalized-2026-06-06",
                lineage={
                    "kind": "normalized",
                    "rawSourcePath": "archive/docs/approved-sources/raw/source.md",
                },
            ),
        ],
    )

    manifest = load_approved_source_manifest(manifest_path, repo_root=tmp_path)

    assert {entry.source_id for entry in manifest.entries} == {
        "gg-src-global-governance-course-frame"
    }
    assert manifest.entries[1].lineage.raw_source_path == manifest.entries[0].source_path


@pytest.mark.parametrize(
    ("entries", "message"),
    [
        (
            [
                _entry("archive/docs/approved-sources/raw/source.md", revision="same"),
                _entry("archive/docs/approved-sources/raw/source-copy.md", revision="same"),
            ],
            "Duplicate source revision",
        ),
        (
            [_entry("archive/docs/approved-sources/raw/missing.md")],
            "does not exist",
        ),
        (
            [
                {
                    **_entry("archive/docs/approved-sources/raw/source.txt"),
                    "fileType": "txt",
                }
            ],
            "Unsupported approved source type",
        ),
    ],
)
def test_manifest_rejects_duplicate_revisions_missing_files_and_unsupported_types(
    tmp_path: Path,
    entries: list[dict[str, object]],
    message: str,
) -> None:
    for entry in entries:
        source_path = tmp_path / str(entry["sourcePath"])
        if "missing" not in source_path.name:
            source_path.parent.mkdir(parents=True, exist_ok=True)
            source_path.write_text("approved content", encoding="utf-8")
    manifest_path = _write_manifest(tmp_path, entries)

    with pytest.raises(ManifestValidationError, match=message):
        load_approved_source_manifest(manifest_path, repo_root=tmp_path)


@pytest.mark.parametrize(
    ("payload", "message"),
    [
        ("[]", "must be an object"),
        ('{"version":"2026-06-06","sources":[]}', "must contain sources"),
        ('{"version":"2026-06-06","sources":["bad"]}', "must be an object"),
        ("{not-json", "not valid JSON"),
    ],
)
def test_manifest_rejects_invalid_document_shapes(
    tmp_path: Path,
    payload: str,
    message: str,
) -> None:
    manifest_path = tmp_path / "manifest.json"
    manifest_path.write_text(payload, encoding="utf-8")

    with pytest.raises(ManifestValidationError, match=message):
        load_approved_source_manifest(manifest_path, repo_root=tmp_path)


def test_manifest_rejects_file_type_mismatch_and_parent_traversal(tmp_path: Path) -> None:
    source_path = tmp_path / "archive/docs/approved-sources/raw/source.md"
    source_path.parent.mkdir(parents=True)
    source_path.write_text("approved", encoding="utf-8")

    mismatch = _write_manifest(
        tmp_path,
        [{**_entry("archive/docs/approved-sources/raw/source.md"), "fileType": "pdf"}],
    )
    with pytest.raises(ManifestValidationError, match="does not match"):
        load_approved_source_manifest(mismatch, repo_root=tmp_path)

    traversal = _write_manifest(
        tmp_path,
        [_entry("archive/docs/approved-sources/raw/../source.md")],
    )
    with pytest.raises(ManifestValidationError, match="parent traversal"):
        load_approved_source_manifest(traversal, repo_root=tmp_path)
