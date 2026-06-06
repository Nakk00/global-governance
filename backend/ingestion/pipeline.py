from __future__ import annotations

import hashlib
import json
import re
from pathlib import Path
from typing import Any, cast

from pypdf import PdfReader

from ingestion.dtos import (
    ApprovedSourceManifest,
    ApprovedSourceManifestEntry,
    EmbeddingBatch,
    EmbeddingEvidence,
    IngestionChunk,
    IngestionDocument,
    IngestionPayload,
    IngestionReference,
    PassageEmbeddingAdapter,
    SourceFileType,
    SourceLineage,
    StorageTarget,
)

APPROVED_SOURCE_ROOT = "archive/docs/approved-sources/"
SUPPORTED_FILE_TYPES = {"md", "pdf"}
DEFAULT_CHUNK_MAX_CHARS = 1_200
DRY_RUN_DIMENSIONS = 384


class ManifestValidationError(ValueError):
    pass


class IngestionPipelineError(ValueError):
    pass


def load_approved_source_manifest(
    manifest_path: Path,
    *,
    repo_root: Path,
) -> ApprovedSourceManifest:
    try:
        raw_manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
    except FileNotFoundError as error:
        raise ManifestValidationError(
            f"Approved source manifest does not exist: {manifest_path}"
        ) from error
    except json.JSONDecodeError as error:
        raise ManifestValidationError("Approved source manifest is not valid JSON") from error

    if not isinstance(raw_manifest, dict):
        raise ManifestValidationError("Approved source manifest must be an object")
    version = _required_string(raw_manifest.get("version"), "version")
    raw_entries = raw_manifest.get("sources")
    if not isinstance(raw_entries, list) or not raw_entries:
        raise ManifestValidationError("Approved source manifest must contain sources")

    entries = tuple(
        _parse_manifest_entry(cast(dict[str, Any], entry), repo_root=repo_root)
        for entry in raw_entries
        if isinstance(entry, dict)
    )
    if len(entries) != len(raw_entries):
        raise ManifestValidationError("Every approved source entry must be an object")
    _validate_manifest_entries(entries)
    return ApprovedSourceManifest(version=version, entries=entries)


def prepare_ingestion(
    entry: ApprovedSourceManifestEntry,
    *,
    repo_root: Path,
    embedder: PassageEmbeddingAdapter | None,
    chunk_max_chars: int = DEFAULT_CHUNK_MAX_CHARS,
    dry_run: bool = False,
) -> IngestionPayload:
    source_file = _resolve_approved_path(repo_root, entry.source_path)
    source_bytes = source_file.read_bytes()
    normalized_content = normalize_source_text(extract_source_text(source_file, entry.file_type))
    if not normalized_content:
        raise IngestionPipelineError("Approved source content cannot be empty")

    chunk_texts = chunk_source_text(normalized_content, max_chars=chunk_max_chars)
    embedding_batch = (
        _dry_run_embeddings(chunk_texts) if dry_run else _embed_passages(embedder, chunk_texts)
    )
    checksum = _sha256(normalized_content)
    document_id = f"doc-{entry.source_id}-{checksum[:16]}"
    chunks = tuple(
        IngestionChunk(
            id=f"{document_id}-chunk-{index:04d}",
            document_id=document_id,
            source_id=entry.source_id,
            chunk_index=index,
            content=content,
            content_checksum=_sha256(content),
            token_count=len(content.split()),
            embedding=embedding_batch.vectors[index],
            metadata={
                "sourcePath": entry.source_path,
                "revision": entry.revision,
                "lineageKind": entry.lineage.kind,
                "rawSourcePath": entry.lineage.raw_source_path,
            },
        )
        for index, content in enumerate(chunk_texts)
    )
    title = entry.title or entry.source_id
    short_title = entry.short_title or title
    document = IngestionDocument(
        id=document_id,
        source_id=entry.source_id,
        title=title,
        source_path=entry.source_path,
        file_type=entry.file_type,
        revision=entry.revision,
        checksum=checksum,
        normalized_content=normalized_content,
        storage=entry.storage,
        source_type=entry.source_type,
        metadata={
            "storage": {
                "private": True,
                "bucket": entry.storage.bucket,
                "path": entry.storage.path,
            },
            "lineage": {
                "kind": entry.lineage.kind,
                "rawSourcePath": entry.lineage.raw_source_path,
            },
            "embedding": {
                "provider": embedding_batch.provider,
                "model": embedding_batch.model,
                "dimensions": embedding_batch.dimensions,
                "synthetic": embedding_batch.synthetic,
            },
        },
    )
    reference = IngestionReference(
        id=f"{document_id}-ref-{entry.source_id}",
        document_id=document_id,
        source_id=entry.source_id,
        citation_label=short_title,
        source_title=title,
        canonical_url=entry.canonical_url,
        chunk_ids=tuple(chunk.id for chunk in chunks),
        metadata={
            "revision": entry.revision,
            "sourceType": entry.source_type,
        },
    )
    return IngestionPayload(
        document=document,
        chunks=chunks,
        references=(reference,),
        embedding_evidence=EmbeddingEvidence(
            provider=embedding_batch.provider,
            model=embedding_batch.model,
            dimensions=embedding_batch.dimensions,
            synthetic=embedding_batch.synthetic,
        ),
        source_bytes=source_bytes,
        dry_run=dry_run,
    )


def extract_source_text(path: Path, file_type: SourceFileType) -> str:
    if file_type == "md":
        content = path.read_text(encoding="utf-8")
    elif file_type == "pdf":
        try:
            reader = PdfReader(path)
            content = "\n\n".join(page.extract_text() or "" for page in reader.pages)
        except Exception as error:
            raise IngestionPipelineError(f"Malformed PDF input: {path.name}") from error
    else:
        raise IngestionPipelineError(f"Unsupported approved source type: {file_type}")

    if not content.strip():
        raise IngestionPipelineError(f"Approved source content is empty: {path.name}")
    return content


def normalize_source_text(content: str) -> str:
    normalized_lines = [
        re.sub(r"[ \t]+$", "", line)
        for line in content.replace("\r\n", "\n").replace("\r", "\n").split("\n")
    ]
    return re.sub(r"\n{3,}", "\n\n", "\n".join(normalized_lines)).strip()


def chunk_source_text(content: str, *, max_chars: int) -> tuple[str, ...]:
    if max_chars < 32:
        raise IngestionPipelineError("Chunk size must be at least 32 characters")
    blocks = [block.strip() for block in re.split(r"\n{2,}", content) if block.strip()]
    chunks: list[str] = []
    current = ""

    for block in blocks:
        for piece in _split_oversized_block(block, max_chars=max_chars):
            candidate = f"{current}\n\n{piece}".strip() if current else piece
            if len(candidate) <= max_chars:
                current = candidate
                continue
            chunks.append(current)
            current = piece
    if current:
        chunks.append(current)
    if not chunks:
        raise IngestionPipelineError("Approved source content produced no chunks")
    return tuple(chunks)


def _parse_manifest_entry(
    raw: dict[str, Any],
    *,
    repo_root: Path,
) -> ApprovedSourceManifestEntry:
    source_path = _normalized_path(_required_string(raw.get("sourcePath"), "sourcePath"))
    if not source_path.startswith(APPROVED_SOURCE_ROOT):
        raise ManifestValidationError(
            "Approved source paths must stay under archive/docs/approved-sources/"
        )
    file_type = _required_string(raw.get("fileType"), "fileType")
    if file_type not in SUPPORTED_FILE_TYPES:
        raise ManifestValidationError(f"Unsupported approved source type: {file_type}")
    expected_suffix = f".{file_type}"
    if not source_path.lower().endswith(expected_suffix):
        raise ManifestValidationError(
            f"Approved source file type does not match path: {source_path}"
        )
    resolved_path = _resolve_approved_path(repo_root, source_path)
    if not resolved_path.is_file():
        raise ManifestValidationError(f"Approved source file does not exist: {source_path}")

    storage = _required_mapping(raw.get("storage"), "storage")
    lineage = _required_mapping(raw.get("lineage"), "lineage")
    lineage_kind = _required_string(lineage.get("kind"), "lineage.kind")
    if lineage_kind not in {"raw", "normalized"}:
        raise ManifestValidationError(f"Unsupported lineage kind: {lineage_kind}")
    raw_source_path = _normalized_path(
        _required_string(lineage.get("rawSourcePath"), "lineage.rawSourcePath")
    )
    if lineage_kind == "raw" and raw_source_path != source_path:
        raise ManifestValidationError("Raw source lineage must point to itself")
    if lineage_kind == "normalized" and "/raw/" not in raw_source_path:
        raise ManifestValidationError("Normalized source lineage must point to a raw source")

    return ApprovedSourceManifestEntry(
        source_path=source_path,
        source_id=_required_string(raw.get("sourceId"), "sourceId"),
        file_type=cast(SourceFileType, file_type),
        revision=_required_string(raw.get("revision"), "revision"),
        storage=StorageTarget(
            bucket=_required_string(storage.get("bucket"), "storage.bucket"),
            path=_normalized_path(_required_string(storage.get("path"), "storage.path")),
        ),
        lineage=SourceLineage(
            kind=cast(Any, lineage_kind),
            raw_source_path=raw_source_path,
        ),
        title=_optional_string(raw.get("title")),
        short_title=_optional_string(raw.get("shortTitle")),
        source_type=_optional_string(raw.get("sourceType")) or "reference",
        canonical_url=_optional_string(raw.get("canonicalUrl")) or None,
    )


def _validate_manifest_entries(entries: tuple[ApprovedSourceManifestEntry, ...]) -> None:
    source_paths: set[str] = set()
    revisions: set[tuple[str, str]] = set()
    entry_paths = {entry.source_path for entry in entries}
    for entry in entries:
        if entry.source_path in source_paths:
            raise ManifestValidationError(f"Duplicate source path: {entry.source_path}")
        source_paths.add(entry.source_path)
        revision_key = (entry.source_id, entry.revision)
        if revision_key in revisions:
            raise ManifestValidationError(
                f"Duplicate source revision: {entry.source_id} {entry.revision}"
            )
        revisions.add(revision_key)
        if entry.lineage.kind == "normalized" and entry.lineage.raw_source_path not in entry_paths:
            raise ManifestValidationError(
                f"Normalized source lineage is missing raw file: {entry.lineage.raw_source_path}"
            )


def _embed_passages(
    embedder: PassageEmbeddingAdapter | None,
    chunks: tuple[str, ...],
) -> EmbeddingBatch:
    if embedder is None:
        raise IngestionPipelineError("Production ingestion requires a real embedding adapter")
    batch = embedder.embed_passages(list(chunks))
    if batch.synthetic:
        raise IngestionPipelineError("Production ingestion cannot use synthetic embeddings")
    if len(batch.vectors) != len(chunks):
        raise IngestionPipelineError("Embedding provider returned the wrong vector count")
    if batch.dimensions <= 0 or any(len(vector) != batch.dimensions for vector in batch.vectors):
        raise IngestionPipelineError("Embedding provider returned invalid vector dimensions")
    return batch


def _dry_run_embeddings(chunks: tuple[str, ...]) -> EmbeddingBatch:
    vectors = tuple(
        tuple(round(digest[index % len(digest)] / 255, 8) for index in range(DRY_RUN_DIMENSIONS))
        for digest in (hashlib.sha256(chunk.encode("utf-8")).digest() for chunk in chunks)
    )
    return EmbeddingBatch(
        vectors=vectors,
        provider="dry-run",
        model="deterministic-dry-run-vector",
        dimensions=DRY_RUN_DIMENSIONS,
        synthetic=True,
    )


def _split_oversized_block(block: str, *, max_chars: int) -> list[str]:
    if len(block) <= max_chars:
        return [block]
    pieces: list[str] = []
    remaining = block
    while len(remaining) > max_chars:
        split_at = remaining.rfind(" ", 0, max_chars + 1)
        if split_at <= 0:
            split_at = max_chars
        pieces.append(remaining[:split_at].strip())
        remaining = remaining[split_at:].strip()
    if remaining:
        pieces.append(remaining)
    return pieces


def _resolve_approved_path(repo_root: Path, source_path: str) -> Path:
    root = (repo_root / APPROVED_SOURCE_ROOT).resolve()
    resolved = (repo_root / source_path).resolve()
    if root != resolved and root not in resolved.parents:
        raise ManifestValidationError("Approved source path escapes the staging directory")
    return resolved


def _normalized_path(value: str) -> str:
    normalized = value.replace("\\", "/")
    if any(segment == ".." for segment in normalized.split("/")):
        raise ManifestValidationError("Approved source paths cannot contain parent traversal")
    return "/".join(segment for segment in normalized.split("/") if segment not in {"", "."})


def _required_string(value: object, field: str) -> str:
    if not isinstance(value, str) or not value.strip():
        raise ManifestValidationError(f"{field} must be a non-empty string")
    return value.strip()


def _optional_string(value: object) -> str:
    return value.strip() if isinstance(value, str) else ""


def _required_mapping(value: object, field: str) -> dict[str, Any]:
    if not isinstance(value, dict):
        raise ManifestValidationError(f"{field} must be an object")
    return cast(dict[str, Any], value)


def _sha256(content: str) -> str:
    return hashlib.sha256(content.encode("utf-8")).hexdigest()
