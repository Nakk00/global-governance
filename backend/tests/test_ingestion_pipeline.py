from __future__ import annotations

import json
from pathlib import Path
from unittest import mock
from urllib.error import URLError

import pytest

from chatbot.nvidia import NvidiaEmbeddingAdapter, NvidiaProviderError
from ingestion.dtos import (
    ApprovedSourceManifestEntry,
    EmbeddingBatch,
    SourceLineage,
    StorageTarget,
)
from ingestion.pipeline import (
    IngestionPipelineError,
    extract_source_text,
    normalize_source_text,
    prepare_ingestion,
)


class RecordingEmbedder:
    def __init__(self, dimensions: int = 4) -> None:
        self.dimensions = dimensions
        self.calls: list[tuple[str, ...]] = []

    def embed_passages(self, texts: list[str]) -> EmbeddingBatch:
        self.calls.append(tuple(texts))
        return EmbeddingBatch(
            vectors=tuple(
                tuple(round((index + 1) / 10, 2) for index in range(self.dimensions)) for _ in texts
            ),
            provider="nvidia",
            model="nvidia/test-embedding-model",
            dimensions=self.dimensions,
            synthetic=False,
        )


def test_pipeline_extracts_normalizes_chunks_checksums_and_provider_vectors(
    tmp_path: Path,
) -> None:
    source_path = tmp_path / "archive/docs/approved-sources/raw/course.md"
    source_path.parent.mkdir(parents=True)
    source_path.write_text(
        "# Course frame\r\n\r\n"
        "Global governance coordinates institutions, rules, and accountability.  \r\n\r\n"
        "It does not erase state sovereignty. " * 8,
        encoding="utf-8",
    )
    embedder = RecordingEmbedder()

    payload = prepare_ingestion(
        _entry("archive/docs/approved-sources/raw/course.md"),
        repo_root=tmp_path,
        embedder=embedder,
        chunk_max_chars=120,
    )

    assert "\r" not in payload.document.normalized_content
    assert payload.document.checksum
    assert len(payload.chunks) > 1
    assert all(0 < len(chunk.content) <= 120 for chunk in payload.chunks)
    assert all(chunk.content_checksum for chunk in payload.chunks)
    assert all(len(chunk.embedding) == 4 for chunk in payload.chunks)
    assert payload.embedding_evidence.model == "nvidia/test-embedding-model"
    assert payload.embedding_evidence.synthetic is False
    assert embedder.calls == [tuple(chunk.content for chunk in payload.chunks)]
    assert payload.references[0].chunk_ids == tuple(chunk.id for chunk in payload.chunks)


def test_pipeline_requires_a_real_embedding_adapter_outside_dry_run(tmp_path: Path) -> None:
    source_path = tmp_path / "archive/docs/approved-sources/raw/course.md"
    source_path.parent.mkdir(parents=True)
    source_path.write_text("# Course frame\n\nApproved content.", encoding="utf-8")

    with pytest.raises(IngestionPipelineError, match="embedding adapter"):
        prepare_ingestion(
            _entry("archive/docs/approved-sources/raw/course.md"),
            repo_root=tmp_path,
            embedder=None,
        )


def test_pipeline_supports_explicit_synthetic_vectors_only_for_dry_run(
    tmp_path: Path,
) -> None:
    source_path = tmp_path / "archive/docs/approved-sources/raw/course.md"
    source_path.parent.mkdir(parents=True)
    source_path.write_text("# Course frame\n\nApproved content.", encoding="utf-8")

    payload = prepare_ingestion(
        _entry("archive/docs/approved-sources/raw/course.md"),
        repo_root=tmp_path,
        embedder=None,
        dry_run=True,
    )

    assert payload.embedding_evidence.synthetic is True
    assert payload.embedding_evidence.provider == "dry-run"
    assert all(chunk.embedding for chunk in payload.chunks)


def test_pipeline_rejects_empty_markdown_and_malformed_pdf(tmp_path: Path) -> None:
    empty_markdown = tmp_path / "empty.md"
    empty_markdown.write_text(" \n\t", encoding="utf-8")
    malformed_pdf = tmp_path / "bad.pdf"
    malformed_pdf.write_bytes(b"not-a-pdf")

    with pytest.raises(IngestionPipelineError, match="empty"):
        extract_source_text(empty_markdown, "md")
    with pytest.raises(IngestionPipelineError, match="PDF"):
        extract_source_text(malformed_pdf, "pdf")


def test_pipeline_extracts_pdf_pages_through_the_pdf_reader(tmp_path: Path) -> None:
    pdf_path = tmp_path / "approved.pdf"
    pdf_path.write_bytes(b"%PDF-test")
    fake_reader = mock.Mock(
        pages=[
            mock.Mock(extract_text=mock.Mock(return_value="First page")),
            mock.Mock(extract_text=mock.Mock(return_value="Second page")),
        ]
    )

    with mock.patch("ingestion.pipeline.PdfReader", return_value=fake_reader):
        content = extract_source_text(pdf_path, "pdf")

    assert content == "First page\n\nSecond page"


def test_pipeline_rejects_invalid_chunk_and_embedding_shapes(tmp_path: Path) -> None:
    from ingestion.pipeline import chunk_source_text

    with pytest.raises(IngestionPipelineError, match="at least 32"):
        chunk_source_text("approved content", max_chars=12)

    source_path = tmp_path / "archive/docs/approved-sources/raw/course.md"
    source_path.parent.mkdir(parents=True)
    source_path.write_text("Approved content for embedding.", encoding="utf-8")
    malformed_embedder = mock.Mock()
    malformed_embedder.embed_passages.return_value = EmbeddingBatch(
        vectors=(),
        provider="nvidia",
        model="bad",
        dimensions=3,
        synthetic=False,
    )

    with pytest.raises(IngestionPipelineError, match="wrong vector count"):
        prepare_ingestion(
            _entry("archive/docs/approved-sources/raw/course.md"),
            repo_root=tmp_path,
            embedder=malformed_embedder,
        )


def test_normalization_is_stable_and_removes_excess_blank_lines() -> None:
    source = "Heading  \r\n\r\n\r\nBody\t \r\n"

    normalized = normalize_source_text(source)

    assert normalized == "Heading\n\nBody"


def test_nvidia_embedding_adapter_batches_and_validates_provider_vectors() -> None:
    responses = [
        _JsonResponse(
            {
                "data": [
                    {"index": 0, "embedding": [0.1, 0.2, 0.3]},
                    {"index": 1, "embedding": [0.4, 0.5, 0.6]},
                ]
            }
        ),
        _JsonResponse({"data": [{"index": 0, "embedding": [0.7, 0.8, 0.9]}]}),
    ]
    adapter = NvidiaEmbeddingAdapter(
        api_key="test-key",
        base_url="https://integrate.api.nvidia.test/v1",
        model="nvidia/test-embedding-model",
        dimensions=3,
        batch_size=2,
        timeout_seconds=1,
    )

    with mock.patch("chatbot.nvidia.urlopen", side_effect=responses) as mocked_urlopen:
        batch = adapter.embed_passages(["one", "two", "three"])

    assert batch.vectors == (
        (0.1, 0.2, 0.3),
        (0.4, 0.5, 0.6),
        (0.7, 0.8, 0.9),
    )
    assert batch.model == "nvidia/test-embedding-model"
    assert batch.dimensions == 3
    assert batch.synthetic is False
    assert mocked_urlopen.call_count == 2
    first_request = mocked_urlopen.call_args_list[0].args[0]
    assert json.loads(first_request.data)["input"] == ["one", "two"]
    assert json.loads(first_request.data)["dimensions"] == 3


def test_nvidia_embedding_adapter_returns_typed_provider_failures() -> None:
    adapter = NvidiaEmbeddingAdapter(
        api_key="test-key",
        base_url="https://integrate.api.nvidia.test/v1",
        dimensions=3,
    )

    with (
        mock.patch("chatbot.nvidia.urlopen", side_effect=URLError("offline")),
        pytest.raises(NvidiaProviderError) as error,
    ):
        adapter.embed_passages(["approved passage"])

    assert error.value.code == "nvidia_embedding_unavailable"


def test_nvidia_embedding_adapter_rejects_missing_config_and_bad_dimensions() -> None:
    with pytest.raises(NvidiaProviderError) as config_error:
        NvidiaEmbeddingAdapter(api_key="", base_url="").embed_passages(["passage"])
    assert config_error.value.code == "nvidia_embedding_config"

    adapter = NvidiaEmbeddingAdapter(
        api_key="test-key",
        base_url="https://integrate.api.nvidia.test/v1",
        dimensions=3,
    )
    response = _JsonResponse({"data": [{"index": 0, "embedding": [0.1]}]})
    with (
        mock.patch("chatbot.nvidia.urlopen", return_value=response),
        pytest.raises(NvidiaProviderError) as dimensions_error,
    ):
        adapter.embed_passages(["passage"])
    assert dimensions_error.value.code == "nvidia_embedding_dimensions"


class _JsonResponse:
    def __init__(self, payload: dict[str, object]) -> None:
        self.payload = payload

    def __enter__(self) -> _JsonResponse:
        return self

    def __exit__(self, *args: object) -> None:
        return None

    def read(self) -> bytes:
        return json.dumps(self.payload).encode("utf-8")


def _entry(source_path: str) -> ApprovedSourceManifestEntry:
    return ApprovedSourceManifestEntry(
        source_path=source_path,
        source_id="gg-src-global-governance-course-frame",
        file_type="md",
        revision="2026-06-06",
        storage=StorageTarget(
            bucket="processed-exports",
            path="raw/course.md",
        ),
        lineage=SourceLineage(
            kind="raw",
            raw_source_path=source_path,
        ),
    )
