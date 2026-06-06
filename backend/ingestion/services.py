from __future__ import annotations

from pathlib import Path

from django.conf import settings

from chatbot.nvidia import NvidiaEmbeddingAdapter
from ingestion.dtos import IngestionRunResult
from ingestion.pipeline import load_approved_source_manifest, prepare_ingestion
from ingestion.repository import SupabaseIngestionRepository

REPO_ROOT = Path(__file__).resolve().parents[2]
DEFAULT_MANIFEST_PATH = REPO_ROOT / "archive" / "docs" / "approved-sources" / "manifest.json"


class IngestionServiceError(RuntimeError):
    pass


def ingest_approved_sources(
    *,
    source_ids: set[str] | None = None,
    dry_run: bool = False,
    manifest_path: Path = DEFAULT_MANIFEST_PATH,
) -> tuple[IngestionRunResult, ...]:
    manifest = load_approved_source_manifest(manifest_path, repo_root=REPO_ROOT)
    entries = tuple(
        entry for entry in manifest.entries if source_ids is None or entry.source_id in source_ids
    )
    if source_ids is not None and {entry.source_id for entry in entries} != source_ids:
        missing = sorted(source_ids - {entry.source_id for entry in entries})
        if missing:
            raise IngestionServiceError(
                f"Approved source ids are not present in the manifest: {', '.join(missing)}"
            )
    if not entries:
        raise IngestionServiceError("No approved sources were selected for ingestion")

    embedder = None if dry_run else NvidiaEmbeddingAdapter()
    repository = None if dry_run else SupabaseIngestionRepository()
    results: list[IngestionRunResult] = []
    for entry in entries:
        payload = prepare_ingestion(
            entry,
            repo_root=REPO_ROOT,
            embedder=embedder,
            dry_run=dry_run,
        )
        if dry_run:
            results.append(
                IngestionRunResult(
                    document_id=payload.document.id,
                    chunk_count=len(payload.chunks),
                    reference_count=len(payload.references),
                    embedding_model=payload.embedding_evidence.model,
                    embedding_dimensions=payload.embedding_evidence.dimensions,
                )
            )
        else:
            assert repository is not None
            results.append(repository.persist(payload))
    return tuple(results)


def ingest_stewardship_source(source: object) -> IngestionRunResult:
    source_id = getattr(source, "source_id", "")
    if not source_id:
        raise IngestionServiceError("Stewardship source is missing its canonical source id")
    results = ingest_approved_sources(
        source_ids={source_id},
        dry_run=settings.INGESTION_DRY_RUN,
    )
    if len(results) == 1:
        return results[0]
    return IngestionRunResult(
        document_id=results[-1].document_id,
        chunk_count=sum(result.chunk_count for result in results),
        reference_count=sum(result.reference_count for result in results),
        embedding_model=results[-1].embedding_model,
        embedding_dimensions=results[-1].embedding_dimensions,
    )
