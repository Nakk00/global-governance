from __future__ import annotations

import pytest

from chatbot.cache import CachedModelRoles, CachePolicy, OperationalCache
from tests.chatbot_fakes import (
    DeterministicClock,
    FakeNvidiaModelRoles,
    FakeRedisStore,
)


def test_cache_keys_are_hmac_versioned_and_contain_no_raw_prompt() -> None:
    cache = _cache()
    prompt = "How does the UN coordinate global governance?"

    key = cache.key_for(
        "guardDecision",
        prompt,
        model_version="nvidia/topic-v1",
    )

    assert prompt not in key
    assert "public-chat-v2" in key
    assert key != _cache(policy_version="public-chat-v3").key_for(
        "guardDecision",
        prompt,
        model_version="nvidia/topic-v1",
    )
    assert key != cache.key_for(
        "guardDecision",
        prompt,
        model_version="nvidia/topic-v2",
    )


def test_guard_and_query_helper_entries_use_explicit_ttls_without_raw_text() -> None:
    clock = DeterministicClock()
    store = FakeRedisStore(clock)
    cache = _cache(store=store)
    prompt = "Explain institutional legitimacy."

    cache.set(
        "guardDecision",
        prompt,
        {"allowed": True, "label": "in_scope"},
        model_version="nvidia/topic-v1",
    )
    cache.set(
        "queryHelper",
        prompt,
        {"embedding": [0.1, 0.2, 0.3]},
        model_version="nvidia/embed-v1",
    )

    keys = store.keys()
    assert len(keys) == 2
    assert all(prompt not in key for key in keys)
    assert all(prompt not in (store.get(key) or "") for key in keys)
    assert sorted(store.ttl(key) for key in keys) == [120, 600]

    assert cache.get(
        "guardDecision",
        prompt,
        model_version="nvidia/topic-v1",
    ) == {"allowed": True, "label": "in_scope"}


def test_source_index_version_invalidates_retrieval_dependent_keys() -> None:
    prompt = "Explain the UN."
    first = _cache(source_index_version="sources-v1").key_for(
        "retrievalResult",
        prompt,
        model_version="nvidia/rerank-v1",
    )
    second = _cache(source_index_version="sources-v2").key_for(
        "retrievalResult",
        prompt,
        model_version="nvidia/rerank-v1",
    )

    assert first != second


def test_expired_or_version_mismatched_entries_are_not_reused() -> None:
    clock = DeterministicClock()
    store = FakeRedisStore(clock)
    cache = _cache(store=store)
    prompt = "Explain the UN."

    cache.set(
        "guardDecision",
        prompt,
        {"allowed": True},
        model_version="nvidia/topic-v1",
    )
    clock.advance(601)
    assert (
        cache.get(
            "guardDecision",
            prompt,
            model_version="nvidia/topic-v1",
        )
        is None
    )


def test_final_answer_caching_is_disabled_by_policy() -> None:
    cache = _cache()

    with pytest.raises(ValueError, match="disabled"):
        cache.set(
            "finalAnswer",
            "Explain the UN.",
            {"answer": "Do not cache this."},
            model_version="nvidia/generation-v1",
        )


def test_cached_model_roles_reuse_guards_embedding_and_rerank_but_not_generation() -> None:
    models = FakeNvidiaModelRoles(generation_text="Grounded answer.")
    cached = CachedModelRoles(models=models, cache=_cache())
    prompt = "How does the UN coordinate action?"
    passages = ["The UN coordinates action through institutions."]

    assert cached.check_topic(prompt)["allowed"] is True
    assert cached.check_topic(prompt)["allowed"] is True
    assert cached.check_safety(prompt)["allowed"] is True
    assert cached.check_safety(prompt)["allowed"] is True
    assert cached.embed([prompt]) == cached.embed([prompt])
    assert cached.rerank(prompt, passages) == cached.rerank(prompt, passages)
    assert cached.generate(prompt, passages) == "Grounded answer."
    assert cached.generate(prompt, passages) == "Grounded answer."

    roles = [call.role for call in models.calls]
    assert roles.count("topic_guard") == 1
    assert roles.count("safety_guard") == 1
    assert roles.count("embedding") == 1
    assert roles.count("rerank") == 1
    assert roles.count("generation") == 2


def _cache(
    *,
    store: FakeRedisStore | None = None,
    policy_version: str = "public-chat-v2",
    source_index_version: str = "sources-v1",
) -> OperationalCache:
    return OperationalCache(
        store=store or FakeRedisStore(),
        secret="cache-secret",
        policy=CachePolicy(
            schema_version="chat-cache-v1",
            policy_version=policy_version,
            source_index_version=source_index_version,
            guard_ttl_seconds=600,
            query_helper_ttl_seconds=120,
            retrieval_ttl_seconds=90,
            final_answer_enabled=False,
        ),
    )
