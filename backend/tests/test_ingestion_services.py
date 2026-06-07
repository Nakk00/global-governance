from __future__ import annotations

from io import StringIO
from pathlib import Path
from types import SimpleNamespace
from unittest import mock

import pytest
from django.core.management import call_command
from django.test import override_settings

from ingestion.pipeline import load_approved_source_manifest
from ingestion.repository import InMemoryIngestionRepository
from ingestion.services import IngestionServiceError, ingest_approved_sources
from tests.test_ingestion_pipeline import RecordingEmbedder

REPO_ROOT = Path(__file__).resolve().parents[2]
MANIFEST_PATH = REPO_ROOT / "archive" / "docs" / "approved-sources" / "manifest.json"


def test_dry_run_processes_every_manifest_file_without_persistence() -> None:
    results = ingest_approved_sources(dry_run=True)
    manifest = load_approved_source_manifest(MANIFEST_PATH, repo_root=REPO_ROOT)

    assert len(results) == len(manifest.entries)
    assert all(result.chunk_count > 0 for result in results)
    assert all(result.reference_count == 1 for result in results)
    assert all(result.embedding_model == "deterministic-dry-run-vector" for result in results)
    assert all(result.embedding_dimensions == 384 for result in results)


def test_selected_real_ingestion_uses_provider_and_repository_adapters() -> None:
    repository = InMemoryIngestionRepository()
    embedder = RecordingEmbedder(dimensions=4)

    with (
        mock.patch("ingestion.services.NvidiaEmbeddingAdapter", return_value=embedder),
        mock.patch(
            "ingestion.services.SupabaseIngestionRepository",
            return_value=repository,
        ),
    ):
        results = ingest_approved_sources(
            source_ids={"gg-src-un-charter-institutions"},
        )

    assert len(results) == 1
    assert results[0].embedding_model == "nvidia/test-embedding-model"
    assert len(repository.documents) == 1
    assert len(repository.private_objects) == 1


def test_selected_ingestion_rejects_unknown_or_empty_source_sets() -> None:
    with pytest.raises(IngestionServiceError, match="not present"):
        ingest_approved_sources(source_ids={"gg-src-missing"}, dry_run=True)
    with pytest.raises(IngestionServiceError, match="No approved sources"):
        ingest_approved_sources(source_ids=set(), dry_run=True)


@override_settings(INGESTION_DRY_RUN=True)
def test_stewardship_ingestion_aggregates_multiple_manifest_revisions() -> None:
    from ingestion.services import ingest_stewardship_source

    result = ingest_stewardship_source(
        SimpleNamespace(source_id="gg-src-global-governance-course-frame")
    )

    assert result.chunk_count > 3
    assert result.reference_count == 3
    assert result.embedding_model == "deterministic-dry-run-vector"


def test_stewardship_ingestion_requires_a_canonical_source_id() -> None:
    from ingestion.services import ingest_stewardship_source

    with pytest.raises(IngestionServiceError, match="canonical source id"):
        ingest_stewardship_source(SimpleNamespace())


def test_management_command_supports_selected_dry_run() -> None:
    output = StringIO()

    call_command(
        "ingest_approved_sources",
        "--source-id",
        "gg-src-un-charter-institutions",
        "--dry-run",
        stdout=output,
    )

    rendered = output.getvalue()
    assert "dry-run: doc-gg-src-un-charter-institutions" in rendered
    assert "Processed 1 approved source file(s)." in rendered
