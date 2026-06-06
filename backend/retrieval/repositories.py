from __future__ import annotations

import json
from collections.abc import Sequence
from dataclasses import dataclass
from typing import Any, Protocol, cast
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen

from django.conf import settings

from chatbot.dtos import ChatSourceType


class RetrievalRepositoryError(RuntimeError):
    pass


@dataclass(frozen=True)
class RetrievalCandidate:
    chunk_id: str
    source_id: str
    content: str
    title: str
    short_title: str
    source_type: ChatSourceType
    detail: str
    url: str | None
    active: bool
    section_ids: tuple[str, ...]
    vector_score: float


class RetrievalRepository(Protocol):
    source_index_version: str

    def retrieve_candidates(
        self,
        query_embedding: list[float],
        *,
        source_ids: tuple[str, ...] | None,
        limit: int,
    ) -> list[RetrievalCandidate]: ...


class SupabaseRetrievalRepository:
    def __init__(
        self,
        *,
        supabase_url: str | None = None,
        service_role_key: str | None = None,
        timeout_seconds: float | None = None,
        source_index_version: str | None = None,
    ) -> None:
        self.supabase_url = (
            supabase_url if supabase_url is not None else settings.SUPABASE_URL
        ).rstrip("/")
        self.service_role_key = (
            service_role_key
            if service_role_key is not None
            else settings.SUPABASE_SERVICE_ROLE_KEY
        )
        self.timeout_seconds = (
            timeout_seconds
            if timeout_seconds is not None
            else settings.SUPABASE_REST_TIMEOUT_SECONDS
        )
        self.source_index_version = (
            source_index_version
            if source_index_version is not None
            else settings.PUBLIC_CHAT_SOURCE_INDEX_VERSION
        )

    def retrieve_candidates(
        self,
        query_embedding: list[float],
        *,
        source_ids: tuple[str, ...] | None,
        limit: int,
    ) -> list[RetrievalCandidate]:
        self._require_config()
        request = Request(
            f"{self.supabase_url}/rest/v1/rpc/retrieve_approved_chunks",
            data=json.dumps(
                {
                    "query_embedding": query_embedding,
                    "requested_source_ids": list(source_ids) if source_ids else None,
                    "match_count": limit,
                }
            ).encode("utf-8"),
            headers={
                "apikey": self.service_role_key,
                "Authorization": f"Bearer {self.service_role_key}",
                "Content-Type": "application/json",
            },
            method="POST",
        )
        try:
            with urlopen(request, timeout=self.timeout_seconds) as response:
                payload = json.loads(response.read().decode("utf-8"))
        except HTTPError as error:
            raise RetrievalRepositoryError(
                f"Approved-source retrieval failed with status {error.code}"
            ) from error
        except (URLError, TimeoutError) as error:
            raise RetrievalRepositoryError("Approved-source retrieval is unavailable") from error
        except (UnicodeDecodeError, json.JSONDecodeError) as error:
            raise RetrievalRepositoryError(
                "Approved-source retrieval returned malformed data"
            ) from error

        if not isinstance(payload, list):
            raise RetrievalRepositoryError("Approved-source retrieval returned invalid data")
        return [_candidate_from_row(row) for row in payload if isinstance(row, dict)]

    def _require_config(self) -> None:
        if not self.supabase_url or not self.service_role_key:
            raise RetrievalRepositoryError(
                "Supabase service configuration is required for retrieval"
            )


def _candidate_from_row(row: dict[str, Any]) -> RetrievalCandidate:
    source_type = str(row.get("sourceType", "reference"))
    if source_type not in {"primary", "course", "case", "reference"}:
        source_type = "reference"
    raw_sections = row.get("sectionIds")
    section_ids: Sequence[object] = raw_sections if isinstance(raw_sections, list) else ()
    return RetrievalCandidate(
        chunk_id=str(row.get("chunkId", "")),
        source_id=str(row.get("sourceId", "")),
        content=str(row.get("content", "")),
        title=str(row.get("title", "")),
        short_title=str(row.get("shortTitle", "")),
        source_type=cast(ChatSourceType, source_type),
        detail=str(row.get("detail", "")),
        url=str(row["url"]) if row.get("url") else None,
        active=bool(row.get("active", False)),
        section_ids=tuple(str(value) for value in section_ids),
        vector_score=float(row.get("vectorScore", 0)),
    )
