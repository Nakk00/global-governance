from __future__ import annotations

from collections.abc import Sequence
from dataclasses import dataclass, field

from retrieval.repositories import RetrievalCandidate
from retrieval.services import RetrievalService
from tests.chatbot_fakes import FakeNvidiaModelRoles


@dataclass
class RetrievalRepositoryDouble:
    candidates: list[RetrievalCandidate]
    source_index_version: str = "approved-sources-test-v1"
    calls: list[dict[str, object]] = field(default_factory=list)

    def retrieve_candidates(
        self,
        query_embedding: list[float],
        *,
        source_ids: tuple[str, ...] | None,
        limit: int,
    ) -> list[RetrievalCandidate]:
        self.calls.append(
            {
                "dimensions": len(query_embedding),
                "sourceIds": source_ids,
                "limit": limit,
            }
        )
        return [
            candidate
            for candidate in self.candidates
            if source_ids is None or candidate.source_id in source_ids
        ][:limit]


def test_retrieval_filters_inactive_sources_and_scopes_to_current_section() -> None:
    models = FakeNvidiaModelRoles()
    repository = RetrievalRepositoryDouble(
        candidates=[
            _candidate(
                source_id="gg-src-un-charter-institutions",
                content="The United Nations coordinates collective action through its organs.",
                section_ids=("un-command-center",),
            ),
            _candidate(
                source_id="gg-src-south-china-sea-award",
                content="The arbitral award clarifies maritime legal rights.",
                section_ids=("west-philippine-sea-dossier",),
            ),
            _candidate(
                source_id="gg-src-disabled-source",
                content="Disabled material must never support public answers.",
                active=False,
            ),
        ]
    )
    service = RetrievalService(
        repository=repository,
        models=models,
        section_source_ids={
            "un-command-center": ("gg-src-un-charter-institutions",),
        },
    )

    result = service.retrieve(
        "How does the United Nations coordinate action?",
        current_section_id="un-command-center",
    )

    assert repository.calls[0]["sourceIds"] == ("gg-src-un-charter-institutions",)
    assert [chunk.source_id for chunk in result.chunks] == [
        "gg-src-un-charter-institutions"
    ]
    assert result.source_index_version == "approved-sources-test-v1"


def test_retrieval_classifies_strong_support_and_packages_stable_safe_citations() -> None:
    models = FakeNvidiaModelRoles()
    repository = RetrievalRepositoryDouble(
        candidates=[
            _candidate(
                content=(
                    "Global governance coordinates institutions and rules without becoming "
                    "a world government."
                ),
                url="https://example.test/global-governance",
            ),
            _candidate(
                source_id="gg-src-private-storage",
                content="Global governance institutions depend on approved evidence.",
                url="http://127.0.0.1:54321/storage/v1/object/private/source.md",
            ),
        ]
    )

    result = RetrievalService(repository=repository, models=models).retrieve(
        "How does global governance coordinate institutions?"
    )

    assert result.support_level == "strong"
    assert result.citations[0].source_id.startswith("gg-src-")
    assert result.citations[0].url == "https://example.test/global-governance"
    assert result.citations[1].url is None
    assert [call.role for call in models.calls] == ["embedding", "rerank"]


def test_retrieval_returns_weak_support_without_fabricating_citations() -> None:
    repository = RetrievalRepositoryDouble(
        candidates=[
            _candidate(content="Institutions coordinate rules and expectations."),
        ]
    )

    result = RetrievalService(
        repository=repository,
        models=FakeNvidiaModelRoles(),
    ).retrieve("Predict tomorrow's unrelated election result")

    assert result.support_level == "weak"
    assert result.chunks == ()
    assert result.citations == ()


def test_retrieval_accepts_relevant_nvidia_scores_after_logit_normalization() -> None:
    result = RetrievalService(
        repository=RetrievalRepositoryDouble(
            candidates=[
                _candidate(
                    content=(
                        "The United Nations coordinates collective action through "
                        "approved institutions."
                    )
                )
            ]
        ),
        models=LowPositiveRerankModels(),
    ).retrieve("How does the UN coordinate collective action?")

    assert result.support_level == "strong"
    assert len(result.chunks) == 1


def test_retrieval_handles_an_empty_approved_store() -> None:
    result = RetrievalService(
        repository=RetrievalRepositoryDouble(candidates=[]),
        models=FakeNvidiaModelRoles(),
    ).retrieve("What is global governance?")

    assert result.support_level == "weak"
    assert result.chunks == ()
    assert result.citations == ()


class LowPositiveRerankModels(FakeNvidiaModelRoles):
    def rerank(self, query: str, passages: Sequence[str]) -> list[tuple[int, float]]:
        super().rerank(query, passages)
        return [(0, 0.12)]


def _candidate(
    *,
    source_id: str = "gg-src-global-governance-course-frame",
    content: str,
    section_ids: tuple[str, ...] = ("global-governance-overview",),
    active: bool = True,
    url: str | None = None,
) -> RetrievalCandidate:
    return RetrievalCandidate(
        chunk_id=f"{source_id}-chunk-0",
        source_id=source_id,
        content=content,
        title="Approved source",
        short_title="Approved source",
        source_type="course",
        detail="Supports the grounded explanation.",
        url=url,
        active=active,
        section_ids=section_ids,
        vector_score=0.9,
    )
