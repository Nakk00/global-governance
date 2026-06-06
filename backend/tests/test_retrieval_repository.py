from __future__ import annotations

import json
from unittest import mock

import pytest

from retrieval.repositories import (
    RetrievalRepositoryError,
    SupabaseRetrievalRepository,
)


def test_repository_calls_service_role_rpc_and_maps_candidates() -> None:
    repository = _repository()
    response = _JsonResponse(
        [
            {
                "chunkId": "chunk-1",
                "sourceId": "gg-src-un-charter-institutions",
                "content": "Approved institutional context.",
                "title": "Charter of the United Nations",
                "shortTitle": "UN Charter",
                "sourceType": "primary",
                "detail": "Supports the institutional explanation.",
                "url": "https://www.un.org/en/about-us/un-charter/full-text",
                "active": True,
                "sectionIds": ["un-command-center"],
                "vectorScore": 0.81,
            }
        ]
    )

    with mock.patch("retrieval.repositories.urlopen", return_value=response) as urlopen:
        candidates = repository.retrieve_candidates(
            [0.1, 0.2, 0.3],
            source_ids=("gg-src-un-charter-institutions",),
            limit=4,
        )

    assert len(candidates) == 1
    assert candidates[0].source_type == "primary"
    assert candidates[0].section_ids == ("un-command-center",)
    assert candidates[0].vector_score == 0.81

    request = urlopen.call_args.args[0]
    assert request.full_url.endswith("/rest/v1/rpc/retrieve_approved_chunks")
    assert request.headers["Apikey"] == "service-role"
    assert json.loads(request.data) == {
        "query_embedding": [0.1, 0.2, 0.3],
        "requested_source_ids": ["gg-src-un-charter-institutions"],
        "match_count": 4,
    }


def test_repository_falls_back_to_reference_for_unknown_source_types() -> None:
    repository = _repository()
    response = _JsonResponse(
        [
            {
                "chunkId": "chunk-1",
                "sourceId": "gg-src-source",
                "content": "Approved context.",
                "sourceType": "unexpected",
                "active": True,
            }
        ]
    )

    with mock.patch("retrieval.repositories.urlopen", return_value=response):
        candidate = repository.retrieve_candidates(
            [0.1, 0.2, 0.3],
            source_ids=None,
            limit=1,
        )[0]

    assert candidate.source_type == "reference"
    assert candidate.section_ids == ()


def test_repository_rejects_missing_config_and_malformed_payloads() -> None:
    with pytest.raises(RetrievalRepositoryError, match="configuration"):
        SupabaseRetrievalRepository(
            supabase_url="",
            service_role_key="",
        ).retrieve_candidates([0.1], source_ids=None, limit=1)

    with (
        mock.patch(
            "retrieval.repositories.urlopen",
            return_value=_JsonResponse({"unexpected": True}),
        ),
        pytest.raises(RetrievalRepositoryError, match="invalid data"),
    ):
        _repository().retrieve_candidates([0.1], source_ids=None, limit=1)


def _repository() -> SupabaseRetrievalRepository:
    return SupabaseRetrievalRepository(
        supabase_url="http://127.0.0.1:54321",
        service_role_key="service-role",
        timeout_seconds=1,
        source_index_version="test-index-v1",
    )


class _JsonResponse:
    def __init__(self, payload: object) -> None:
        self.payload = payload

    def __enter__(self) -> _JsonResponse:
        return self

    def __exit__(self, *args: object) -> None:
        return None

    def read(self) -> bytes:
        return json.dumps(self.payload).encode("utf-8")
