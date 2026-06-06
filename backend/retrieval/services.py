from __future__ import annotations

from dataclasses import dataclass
from typing import Any, Protocol

from chatbot.contracts import is_safe_public_url
from chatbot.dtos import ChatCitation, SupportLevel
from retrieval.repositories import RetrievalCandidate, RetrievalRepository


class RetrievalModels(Protocol):
    def embed(self, texts: list[str]) -> tuple[list[list[float]], dict[str, Any]]: ...

    def rerank(self, query: str, passages: list[str]) -> list[tuple[int, float]]: ...


@dataclass(frozen=True)
class RetrievalResult:
    support_level: SupportLevel
    chunks: tuple[RetrievalCandidate, ...]
    citations: tuple[ChatCitation, ...]
    source_index_version: str


class RetrievalService:
    def __init__(
        self,
        *,
        repository: RetrievalRepository,
        models: RetrievalModels,
        section_source_ids: dict[str, tuple[str, ...]] | None = None,
        candidate_limit: int = 12,
        weak_threshold: float = 0.01,
        strong_threshold: float = 0.10,
        context_limit: int = 4,
    ) -> None:
        self.repository = repository
        self.models = models
        self.section_source_ids = section_source_ids or {}
        self.candidate_limit = candidate_limit
        self.weak_threshold = weak_threshold
        self.strong_threshold = strong_threshold
        self.context_limit = context_limit

    def retrieve(
        self,
        question: str,
        *,
        current_section_id: str | None = None,
    ) -> RetrievalResult:
        vectors, _evidence = self.models.embed([question])
        source_ids = (
            self.section_source_ids.get(current_section_id)
            if current_section_id
            else None
        )
        candidates = [
            candidate
            for candidate in self.repository.retrieve_candidates(
                vectors[0],
                source_ids=source_ids,
                limit=self.candidate_limit,
            )
            if candidate.active
            and candidate.source_id.startswith("gg-src-")
            and (source_ids is None or candidate.source_id in source_ids)
        ]
        if not candidates:
            return self._weak_result()

        ranking = self.models.rerank(
            question,
            [candidate.content for candidate in candidates],
        )
        selected = tuple(
            candidates[index]
            for index, score in ranking
            if 0 <= index < len(candidates) and score >= self.weak_threshold
        )[: self.context_limit]
        if not selected:
            return self._weak_result()

        top_score = max(score for index, score in ranking if 0 <= index < len(candidates))
        support_level: SupportLevel = (
            "strong" if top_score >= self.strong_threshold else "weak"
        )
        citations = _citations_for(selected)
        if support_level == "weak":
            return RetrievalResult(
                support_level="weak",
                chunks=(),
                citations=(),
                source_index_version=self.repository.source_index_version,
            )
        return RetrievalResult(
            support_level="strong",
            chunks=selected,
            citations=citations,
            source_index_version=self.repository.source_index_version,
        )

    def _weak_result(self) -> RetrievalResult:
        return RetrievalResult(
            support_level="weak",
            chunks=(),
            citations=(),
            source_index_version=self.repository.source_index_version,
        )


def _citations_for(candidates: tuple[RetrievalCandidate, ...]) -> tuple[ChatCitation, ...]:
    citations: list[ChatCitation] = []
    seen: set[str] = set()
    for candidate in candidates:
        if candidate.source_id in seen:
            continue
        seen.add(candidate.source_id)
        citations.append(
            ChatCitation(
                source_id=candidate.source_id,
                title=candidate.title,
                short_title=candidate.short_title,
                source_type=candidate.source_type,
                detail=candidate.detail,
                url=(
                    candidate.url
                    if candidate.url and is_safe_public_url(candidate.url)
                    else None
                ),
            )
        )
    return tuple(citations)
