from __future__ import annotations

import hashlib
import hmac
import json
from collections.abc import Sequence
from dataclasses import dataclass
from typing import Any, Literal, Protocol

from chatbot.protection import ProtectionStore

CacheClass = Literal[
    "guardDecision",
    "queryHelper",
    "retrievalResult",
    "finalAnswer",
]


class ModelRoles(Protocol):
    generation_model: str
    embedding_model: str
    rerank_model: str
    topic_guard_model: str
    safety_guard_model: str

    def generate(
        self,
        prompt: str,
        context_chunks: Sequence[str],
        depth_mode: str = "student",
    ) -> str: ...

    def embed(self, texts: list[str]) -> tuple[list[list[float]], dict[str, Any]]: ...

    def rerank(self, query: str, passages: Sequence[str]) -> list[tuple[int, float]]: ...

    def check_topic(self, prompt: str) -> dict[str, Any]: ...

    def check_safety(self, text: str) -> dict[str, Any]: ...


@dataclass(frozen=True)
class CachePolicy:
    schema_version: str
    policy_version: str
    source_index_version: str
    guard_ttl_seconds: int
    query_helper_ttl_seconds: int
    retrieval_ttl_seconds: int
    final_answer_enabled: bool = False


class OperationalCache:
    def __init__(
        self,
        *,
        store: ProtectionStore,
        secret: str,
        policy: CachePolicy,
    ) -> None:
        if not secret:
            raise ValueError("Operational cache requires an HMAC secret.")
        self.store = store
        self.secret = secret
        self.policy = policy

    def key_for(
        self,
        cache_class: CacheClass,
        prompt: str,
        *,
        model_version: str | None = None,
    ) -> str:
        material = "\n".join(
            (
                self.policy.schema_version,
                self.policy.policy_version,
                self.policy.source_index_version,
                cache_class,
                model_version or "no-model",
                prompt,
            )
        )
        digest = hmac.new(
            self.secret.encode("utf-8"),
            material.encode("utf-8"),
            hashlib.sha256,
        ).hexdigest()
        return (
            f"chat-cache:{cache_class}:{self.policy.schema_version}:"
            f"{self.policy.policy_version}:{digest}"
        )

    def set(
        self,
        cache_class: CacheClass,
        prompt: str,
        value: dict[str, Any],
        *,
        model_version: str | None = None,
    ) -> None:
        if cache_class == "finalAnswer" and not self.policy.final_answer_enabled:
            raise ValueError("Final answer caching is disabled by policy.")
        ttl = self._ttl_for(cache_class)
        envelope = {
            "cacheClass": cache_class,
            "schemaVersion": self.policy.schema_version,
            "policyVersion": self.policy.policy_version,
            "sourceIndexVersion": self.policy.source_index_version,
            "modelVersion": model_version,
            "value": value,
        }
        self.store.set(
            self.key_for(cache_class, prompt, model_version=model_version),
            json.dumps(envelope, separators=(",", ":"), sort_keys=True),
            ex=ttl,
        )

    def get(
        self,
        cache_class: CacheClass,
        prompt: str,
        *,
        model_version: str | None = None,
    ) -> dict[str, Any] | None:
        raw_value = self.store.get(self.key_for(cache_class, prompt, model_version=model_version))
        if raw_value is None:
            return None
        try:
            envelope = json.loads(raw_value)
        except json.JSONDecodeError:
            return None
        if (
            not isinstance(envelope, dict)
            or envelope.get("cacheClass") != cache_class
            or envelope.get("schemaVersion") != self.policy.schema_version
            or envelope.get("policyVersion") != self.policy.policy_version
            or envelope.get("sourceIndexVersion") != self.policy.source_index_version
            or envelope.get("modelVersion") != model_version
            or not isinstance(envelope.get("value"), dict)
        ):
            return None
        return envelope["value"]

    def _ttl_for(self, cache_class: CacheClass) -> int:
        if cache_class == "guardDecision":
            return self.policy.guard_ttl_seconds
        if cache_class == "queryHelper":
            return self.policy.query_helper_ttl_seconds
        return self.policy.retrieval_ttl_seconds


class CachedModelRoles:
    def __init__(self, *, models: ModelRoles, cache: OperationalCache) -> None:
        self.models = models
        self.cache = cache
        self.generation_model = models.generation_model
        self.embedding_model = models.embedding_model
        self.rerank_model = models.rerank_model
        self.topic_guard_model = models.topic_guard_model
        self.safety_guard_model = models.safety_guard_model

    def generate(
        self,
        prompt: str,
        context_chunks: Sequence[str],
        depth_mode: str = "student",
    ) -> str:
        return self.models.generate(prompt, context_chunks, depth_mode)

    def embed(self, texts: list[str]) -> tuple[list[list[float]], dict[str, Any]]:
        cache_input = "\n".join(texts)
        cached = self.cache.get(
            "queryHelper",
            cache_input,
            model_version=self.embedding_model,
        )
        if cached is not None:
            vectors = cached.get("vectors")
            evidence = cached.get("evidence")
            if (
                isinstance(vectors, list)
                and all(
                    isinstance(vector, list)
                    and all(isinstance(value, int | float) for value in vector)
                    for vector in vectors
                )
                and isinstance(evidence, dict)
            ):
                return (
                    [[float(value) for value in vector] for vector in vectors],
                    evidence,
                )

        vectors, evidence = self.models.embed(texts)
        self.cache.set(
            "queryHelper",
            cache_input,
            {"vectors": vectors, "evidence": evidence},
            model_version=self.embedding_model,
        )
        return vectors, evidence

    def rerank(self, query: str, passages: Sequence[str]) -> list[tuple[int, float]]:
        cache_input = "\n".join((query, *passages))
        cached = self.cache.get(
            "retrievalResult",
            cache_input,
            model_version=self.rerank_model,
        )
        if cached is not None:
            rankings = cached.get("rankings")
            if isinstance(rankings, list):
                parsed = [
                    (int(item[0]), float(item[1]))
                    for item in rankings
                    if (
                        isinstance(item, list)
                        and len(item) == 2
                        and isinstance(item[0], int)
                        and isinstance(item[1], int | float)
                    )
                ]
                if len(parsed) == len(rankings):
                    return parsed

        rankings = self.models.rerank(query, passages)
        self.cache.set(
            "retrievalResult",
            cache_input,
            {"rankings": [list(item) for item in rankings]},
            model_version=self.rerank_model,
        )
        return rankings

    def check_topic(self, prompt: str) -> dict[str, Any]:
        return self._guard_decision(
            f"topic\n{prompt}",
            model_version=self.topic_guard_model,
            fetch=lambda: self.models.check_topic(prompt),
        )

    def check_safety(self, text: str) -> dict[str, Any]:
        return self._guard_decision(
            f"safety\n{text}",
            model_version=self.safety_guard_model,
            fetch=lambda: self.models.check_safety(text),
        )

    def _guard_decision(
        self,
        cache_input: str,
        *,
        model_version: str,
        fetch: Any,
    ) -> dict[str, Any]:
        cached = self.cache.get(
            "guardDecision",
            cache_input,
            model_version=model_version,
        )
        if cached is not None and isinstance(cached.get("allowed"), bool):
            return cached
        decision = fetch()
        self.cache.set(
            "guardDecision",
            cache_input,
            decision,
            model_version=model_version,
        )
        return decision
