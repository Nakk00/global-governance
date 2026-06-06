from __future__ import annotations

import json
from copy import deepcopy
from email.message import Message
from io import BytesIO
from pathlib import Path
from unittest import mock
from urllib.error import HTTPError

import pytest

from ingestion.dtos import (
    EmbeddingEvidence,
    IngestionChunk,
    IngestionDocument,
    IngestionPayload,
    IngestionReference,
    StorageTarget,
)
from ingestion.repository import (
    IngestionPersistenceError,
    InMemoryIngestionRepository,
    SupabaseIngestionRepository,
)


def test_persistence_writes_private_object_document_chunks_references_and_vectors_atomically() -> (
    None
):
    repository = InMemoryIngestionRepository()
    payload = _payload()

    result = repository.persist(payload)

    assert result.document_id == payload.document.id
    assert result.chunk_count == 2
    assert result.reference_count == 1
    assert (
        repository.private_objects[(payload.document.storage.bucket, payload.document.storage.path)]
        == payload.source_bytes
    )
    assert repository.documents[payload.document.id] == payload.document
    assert set(repository.chunks) == {chunk.id for chunk in payload.chunks}
    assert all(repository.chunks[chunk.id].embedding for chunk in payload.chunks)
    assert repository.references[payload.references[0].id] == payload.references[0]
    assert repository.reference_chunks == {
        (payload.references[0].id, payload.chunks[0].id),
        (payload.references[0].id, payload.chunks[1].id),
    }


def test_persistence_is_idempotent_for_the_same_document_revision() -> None:
    repository = InMemoryIngestionRepository()
    payload = _payload()

    first = repository.persist(payload)
    second = repository.persist(payload)

    assert second == first
    assert len(repository.private_objects) == 1
    assert len(repository.documents) == 1
    assert len(repository.chunks) == 2
    assert len(repository.references) == 1


def test_persistence_rolls_back_every_write_after_partial_failure() -> None:
    repository = InMemoryIngestionRepository(fail_after="chunks")
    before = deepcopy(repository.snapshot())

    with pytest.raises(IngestionPersistenceError, match="chunks"):
        repository.persist(_payload())

    assert repository.snapshot() == before


def test_persistence_rejects_public_storage_and_synthetic_production_vectors() -> None:
    repository = InMemoryIngestionRepository()
    public_payload = _payload(storage=StorageTarget(bucket="public", path="course.md"))
    synthetic_payload = _payload(
        embedding_evidence=EmbeddingEvidence(
            provider="dry-run",
            model="deterministic-test-vector",
            dimensions=3,
            synthetic=True,
        )
    )

    with pytest.raises(IngestionPersistenceError, match="private"):
        repository.persist(public_payload)
    with pytest.raises(IngestionPersistenceError, match="synthetic"):
        repository.persist(synthetic_payload)


def test_supabase_repository_uploads_private_source_and_uses_atomic_rpc() -> None:
    repository = SupabaseIngestionRepository(
        supabase_url="https://supabase.test",
        service_role_key="service-role",
        timeout_seconds=1,
    )
    responses = [
        HTTPError("https://supabase.test/object", 404, "missing", Message(), None),
        _BytesResponse(b""),
        _BytesResponse(
            b'{"documentId":"doc-course-abc123","embeddingCount":2,"embeddingDimensions":3}'
        ),
    ]

    with mock.patch("ingestion.repository.urlopen", side_effect=responses) as mocked_urlopen:
        result = repository.persist(_payload())

    assert result.document_id == "doc-course-abc123"
    requests = [call.args[0] for call in mocked_urlopen.call_args_list]
    assert requests[0].method == "GET"
    assert requests[1].method == "POST"
    assert "/storage/v1/object/processed-exports/raw/course.md" in requests[1].full_url
    assert requests[2].method == "POST"
    assert requests[2].full_url.endswith("/rest/v1/rpc/persist_ingestion_document")
    rpc_body = json.loads(requests[2].data)
    assert rpc_body["payload"]["document"]["embeddingConfig"]["synthetic"] is False


def test_supabase_repository_rejects_rpc_without_complete_vector_evidence() -> None:
    repository = SupabaseIngestionRepository(
        supabase_url="https://supabase.test",
        service_role_key="service-role",
        timeout_seconds=1,
    )
    responses = [
        HTTPError("https://supabase.test/object", 404, "missing", Message(), None),
        _BytesResponse(b""),
        _BytesResponse(
            b'{"documentId":"doc-course-abc123","embeddingCount":0,"embeddingDimensions":null}'
        ),
        _BytesResponse(b""),
    ]

    with (
        mock.patch("ingestion.repository.urlopen", side_effect=responses),
        pytest.raises(IngestionPersistenceError, match="vector evidence"),
    ):
        repository.persist(_payload())


def test_supabase_repository_removes_new_private_object_when_rpc_fails() -> None:
    repository = SupabaseIngestionRepository(
        supabase_url="https://supabase.test",
        service_role_key="service-role",
        timeout_seconds=1,
    )
    responses = [
        HTTPError("https://supabase.test/object", 404, "missing", Message(), None),
        _BytesResponse(b""),
        HTTPError("https://supabase.test/rpc", 500, "failed", Message(), None),
        _BytesResponse(b""),
    ]

    with (
        mock.patch("ingestion.repository.urlopen", side_effect=responses) as mocked_urlopen,
        pytest.raises(IngestionPersistenceError, match="status 500"),
    ):
        repository.persist(_payload())

    cleanup_request = mocked_urlopen.call_args_list[-1].args[0]
    assert cleanup_request.method == "DELETE"


def test_supabase_repository_treats_local_storage_wrapped_404_as_missing() -> None:
    repository = SupabaseIngestionRepository(
        supabase_url="http://127.0.0.1:54321",
        service_role_key="service-role",
        timeout_seconds=1,
    )
    wrapped_not_found = HTTPError(
        "http://127.0.0.1:54321/storage/v1/object/processed-exports/missing.md",
        400,
        "Bad Request",
        Message(),
        BytesIO(b'{"statusCode":"404","error":"not_found","message":"Object not found"}'),
    )

    with mock.patch("ingestion.repository.urlopen", side_effect=wrapped_not_found):
        assert repository.read_private_source("processed-exports", "missing.md") is None


def test_vector_repair_migration_persists_and_reports_embedding_evidence() -> None:
    migration = (
        Path(__file__).resolve().parents[2]
        / "supabase"
        / "migrations"
        / "0015_repair_ingestion_vector_persistence.sql"
    ).read_text(encoding="utf-8")

    assert "embedding," in migration
    assert "'embeddingCount'" in migration
    assert "'embeddingDimensions'" in migration
    assert "raise exception 'Persisted embedding evidence is incomplete'" in migration


class _BytesResponse:
    def __init__(self, payload: bytes) -> None:
        self.payload = payload

    def __enter__(self) -> _BytesResponse:
        return self

    def __exit__(self, *args: object) -> None:
        return None

    def read(self) -> bytes:
        return self.payload


def _payload(
    *,
    storage: StorageTarget | None = None,
    embedding_evidence: EmbeddingEvidence | None = None,
) -> IngestionPayload:
    target = storage or StorageTarget(bucket="processed-exports", path="raw/course.md")
    evidence = embedding_evidence or EmbeddingEvidence(
        provider="nvidia",
        model="nvidia/test-embedding-model",
        dimensions=3,
        synthetic=False,
    )
    document = IngestionDocument(
        id="doc-course-abc123",
        source_id="gg-src-global-governance-course-frame",
        title="Global Governance Course Frame",
        source_path="archive/docs/approved-sources/raw/course.md",
        file_type="md",
        revision="2026-06-06",
        checksum="abc123",
        normalized_content="Approved source content.",
        storage=target,
        metadata={"storage": {"private": True}},
    )
    chunks = (
        IngestionChunk(
            id="doc-course-abc123-chunk-0000",
            document_id=document.id,
            source_id=document.source_id,
            chunk_index=0,
            content="Approved source",
            content_checksum="chunk-1",
            token_count=2,
            embedding=(0.1, 0.2, 0.3),
            metadata={},
        ),
        IngestionChunk(
            id="doc-course-abc123-chunk-0001",
            document_id=document.id,
            source_id=document.source_id,
            chunk_index=1,
            content="content.",
            content_checksum="chunk-2",
            token_count=1,
            embedding=(0.4, 0.5, 0.6),
            metadata={},
        ),
    )
    references = (
        IngestionReference(
            id="doc-course-abc123-ref-course",
            document_id=document.id,
            source_id=document.source_id,
            citation_label="Course frame",
            source_title=document.title,
            canonical_url=None,
            chunk_ids=tuple(chunk.id for chunk in chunks),
            metadata={},
        ),
    )
    return IngestionPayload(
        document=document,
        chunks=chunks,
        references=references,
        embedding_evidence=evidence,
        source_bytes=b"# Approved source content.",
        dry_run=False,
    )
