from __future__ import annotations

import hashlib
from collections.abc import Iterable, Mapping, Sequence
from dataclasses import dataclass, field
from typing import Any


@dataclass(frozen=True)
class ApprovedSourceFixture:
    source_id: str = "gg-src-global-governance-course-frame"
    title: str = "Global Governance Course Frame"
    short_title: str = "Course frame"
    source_type: str = "course"
    chunks: tuple[str, ...] = (
        "Global governance coordinates rules and institutions without becoming a world government.",
    )
    citation_detail: str = (
        "Explains the course distinction between governance and world government."
    )
    public_url: str | None = None


@dataclass(frozen=True)
class ProviderCall:
    role: str
    payload: Mapping[str, Any]


class DeterministicClock:
    def __init__(self, start_seconds: int = 1_893_456_000) -> None:
        self._current_seconds = start_seconds

    def now(self) -> int:
        return self._current_seconds

    def advance(self, seconds: int) -> None:
        if seconds < 0:
            raise ValueError("Clock cannot move backwards")

        self._current_seconds += seconds


class FakeRedisStore:
    def __init__(self, clock: DeterministicClock | None = None) -> None:
        self._clock = clock or DeterministicClock()
        self._values: dict[str, tuple[str, int | None]] = {}

    def get(self, key: str) -> str | None:
        self._drop_if_expired(key)
        record = self._values.get(key)

        return record[0] if record else None

    def set(self, key: str, value: str, ex: int | None = None) -> None:
        expires_at = self._clock.now() + ex if ex is not None else None
        self._values[key] = (value, expires_at)

    def incr(self, key: str, ex: int | None = None) -> int:
        next_value = int(self.get(key) or "0") + 1
        self.set(key, str(next_value), ex=ex)

        return next_value

    def delete(self, key: str) -> None:
        self._values.pop(key, None)

    def ttl(self, key: str) -> int:
        self._drop_if_expired(key)
        record = self._values.get(key)

        if record is None:
            return -2

        expires_at = record[1]
        if expires_at is None:
            return -1

        return max(0, expires_at - self._clock.now())

    def keys(self) -> tuple[str, ...]:
        for key in tuple(self._values):
            self._drop_if_expired(key)

        return tuple(sorted(self._values))

    def _drop_if_expired(self, key: str) -> None:
        record = self._values.get(key)
        if record is None:
            return

        expires_at = record[1]
        if expires_at is not None and expires_at <= self._clock.now():
            self.delete(key)


class FakeNvidiaModelRoles:
    generation_model = "nvidia/llama-3.1-nemotron-nano-8b-v1"
    embedding_model = "nvidia/llama-nemotron-embed-1b-v2"
    rerank_model = "nvidia/llama-nemotron-rerank-1b-v2"
    topic_guard_model = "nvidia/llama-3.1-nemoguard-8b-topic-control"
    safety_guard_model = "nvidia/llama-3.1-nemotron-safety-guard-8b-v3"

    def __init__(
        self,
        *,
        generation_text: str = "A grounded course answer from deterministic test context.",
        topic_allowed: bool = True,
        safety_allowed: bool = True,
        embedding_dimensions: int = 8,
    ) -> None:
        self.generation_text = generation_text
        self.topic_allowed = topic_allowed
        self.safety_allowed = safety_allowed
        self.embedding_dimensions = embedding_dimensions
        self.calls: list[ProviderCall] = []

    def generate(
        self, prompt: str, context_chunks: Sequence[str], depth_mode: str = "student"
    ) -> str:
        self.calls.append(
            ProviderCall(
                role="generation",
                payload={
                    "prompt": prompt,
                    "contextChunkCount": len(context_chunks),
                    "depthMode": depth_mode,
                    "model": self.generation_model,
                },
            )
        )

        return self.generation_text

    def embed(self, texts: Iterable[str]) -> tuple[list[list[float]], dict[str, Any]]:
        text_list = list(texts)
        self.calls.append(
            ProviderCall(
                role="embedding",
                payload={"textCount": len(text_list), "model": self.embedding_model},
            )
        )

        return (
            [deterministic_embedding(text, self.embedding_dimensions) for text in text_list],
            {"model": self.embedding_model, "dimensions": self.embedding_dimensions},
        )

    def rerank(self, query: str, passages: Sequence[str]) -> list[tuple[int, float]]:
        self.calls.append(
            ProviderCall(
                role="rerank",
                payload={"query": query, "passageCount": len(passages), "model": self.rerank_model},
            )
        )

        return sorted(
            (
                (index, deterministic_score(query, passage))
                for index, passage in enumerate(passages)
            ),
            key=lambda item: item[1],
            reverse=True,
        )

    def check_topic(self, prompt: str) -> dict[str, Any]:
        self.calls.append(
            ProviderCall(
                role="topic_guard",
                payload={"prompt": prompt, "model": self.topic_guard_model},
            )
        )

        return {
            "allowed": self.topic_allowed,
            "label": "in_scope" if self.topic_allowed else "off_topic",
        }

    def check_safety(self, text: str) -> dict[str, Any]:
        self.calls.append(
            ProviderCall(
                role="safety_guard",
                payload={"text": text, "model": self.safety_guard_model},
            )
        )

        return {
            "allowed": self.safety_allowed,
            "label": "safe" if self.safety_allowed else "unsafe",
        }


@dataclass
class ApprovedSourceStoreDouble:
    sources: list[ApprovedSourceFixture] = field(default_factory=lambda: [ApprovedSourceFixture()])

    def active_sources(self) -> list[ApprovedSourceFixture]:
        return list(self.sources)

    def retrieve(self, query: str, *, source_id: str | None = None) -> list[dict[str, Any]]:
        matches = [
            source for source in self.sources if source_id is None or source.source_id == source_id
        ]

        return [
            {
                "sourceId": source.source_id,
                "title": source.title,
                "shortTitle": source.short_title,
                "sourceType": source.source_type,
                "detail": source.citation_detail,
                "url": source.public_url,
                "chunk": chunk,
                "score": deterministic_score(query, chunk),
            }
            for source in matches
            for chunk in source.chunks
        ]


def deterministic_embedding(text: str, dimensions: int = 8) -> list[float]:
    digest = hashlib.sha256(text.encode("utf-8")).digest()

    return [round(digest[index] / 255, 6) for index in range(dimensions)]


def deterministic_score(query: str, passage: str) -> float:
    query_terms = {term.lower() for term in query.split() if term.strip()}
    passage_terms = {term.lower().strip(".,;:!?") for term in passage.split() if term.strip()}

    if not query_terms:
        return 0

    return round(len(query_terms & passage_terms) / len(query_terms), 6)
