from __future__ import annotations

from dataclasses import dataclass, field
from typing import Literal, Protocol

SourceFileType = Literal["md", "pdf"]
LineageKind = Literal["raw", "normalized"]


@dataclass(frozen=True)
class StorageTarget:
    bucket: str
    path: str


@dataclass(frozen=True)
class SourceLineage:
    kind: LineageKind
    raw_source_path: str


@dataclass(frozen=True)
class ApprovedSourceManifestEntry:
    source_path: str
    source_id: str
    file_type: SourceFileType
    revision: str
    storage: StorageTarget
    lineage: SourceLineage
    title: str = ""
    short_title: str = ""
    source_type: str = "reference"
    canonical_url: str | None = None


@dataclass(frozen=True)
class ApprovedSourceManifest:
    version: str
    entries: tuple[ApprovedSourceManifestEntry, ...]


@dataclass(frozen=True)
class EmbeddingBatch:
    vectors: tuple[tuple[float, ...], ...]
    provider: str
    model: str
    dimensions: int
    synthetic: bool


class PassageEmbeddingAdapter(Protocol):
    def embed_passages(self, texts: list[str]) -> EmbeddingBatch: ...


@dataclass(frozen=True)
class EmbeddingEvidence:
    provider: str
    model: str
    dimensions: int
    synthetic: bool


@dataclass(frozen=True)
class IngestionDocument:
    id: str
    source_id: str
    title: str
    source_path: str
    file_type: SourceFileType
    revision: str
    checksum: str
    normalized_content: str
    storage: StorageTarget
    metadata: dict[str, object] = field(default_factory=dict)
    source_type: str = "reference"


@dataclass(frozen=True)
class IngestionChunk:
    id: str
    document_id: str
    source_id: str
    chunk_index: int
    content: str
    content_checksum: str
    token_count: int
    embedding: tuple[float, ...]
    metadata: dict[str, object] = field(default_factory=dict)


@dataclass(frozen=True)
class IngestionReference:
    id: str
    document_id: str
    source_id: str
    citation_label: str
    source_title: str
    canonical_url: str | None
    chunk_ids: tuple[str, ...]
    metadata: dict[str, object] = field(default_factory=dict)


@dataclass(frozen=True)
class IngestionPayload:
    document: IngestionDocument
    chunks: tuple[IngestionChunk, ...]
    references: tuple[IngestionReference, ...]
    embedding_evidence: EmbeddingEvidence
    source_bytes: bytes
    dry_run: bool


@dataclass(frozen=True)
class IngestionRunResult:
    document_id: str
    chunk_count: int
    reference_count: int
    embedding_model: str
    embedding_dimensions: int


class IngestionRunner(Protocol):
    def __call__(self, source: object) -> IngestionRunResult: ...
