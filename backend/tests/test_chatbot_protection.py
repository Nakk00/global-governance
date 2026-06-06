from __future__ import annotations

import pytest

from chatbot.protection import (
    ProtectionUnavailable,
    PublicChatProtector,
    anonymous_identity_key,
)
from tests.chatbot_fakes import DeterministicClock, FakeRedisStore


def test_anonymous_identity_is_stable_hashed_and_contains_no_raw_identifiers() -> None:
    first = anonymous_identity_key(
        session_id="browser-session-123",
        remote_address="203.0.113.8",
        secret="server-secret",
    )
    second = anonymous_identity_key(
        session_id="browser-session-123",
        remote_address="203.0.113.8",
        secret="server-secret",
    )

    assert first == second
    assert first.startswith("anon:")
    assert "browser-session-123" not in first
    assert "203.0.113.8" not in first


def test_rate_limit_blocks_only_after_the_window_limit_and_then_expires() -> None:
    clock = DeterministicClock()
    protector = _protector(clock=clock, rate_max_requests=2)
    identity = "anon:test"

    assert protector.check(identity).allowed is True
    assert protector.check(identity).allowed is True

    blocked = protector.check(identity)
    assert blocked.allowed is False
    assert blocked.code == "rate_limited"
    assert blocked.retry_after_seconds == 60

    clock.advance(60)
    assert protector.check(identity).allowed is True


def test_repeated_refusals_create_and_expire_an_abuse_cooldown() -> None:
    clock = DeterministicClock()
    protector = _protector(clock=clock, abuse_threshold=3)
    identity = "anon:test"

    assert protector.record_refusal(identity) is None
    assert protector.record_refusal(identity) is None
    cooldown = protector.record_refusal(identity)

    assert cooldown is not None
    assert cooldown.code == "abuse_cooldown"
    assert cooldown.retry_after_seconds == 90
    assert protector.check(identity).code == "abuse_cooldown"

    clock.advance(90)
    assert protector.check(identity).allowed is True


def test_success_resets_consecutive_abuse_without_resetting_rate_window() -> None:
    clock = DeterministicClock()
    store = FakeRedisStore(clock)
    protector = _protector(clock=clock, store=store, rate_max_requests=4)
    identity = "anon:test"

    protector.check(identity)
    protector.record_refusal(identity)
    protector.record_success(identity)
    assert protector.record_refusal(identity) is None

    rate_keys = [key for key in store.keys() if key.endswith(":rate")]
    abuse_keys = [key for key in store.keys() if key.endswith(":abuse")]
    assert rate_keys
    assert abuse_keys
    assert store.get(abuse_keys[0]) == "1"


def test_store_failures_raise_a_typed_protection_error() -> None:
    protector = PublicChatProtector(
        store=FailingRedisStore(),
        rate_window_seconds=60,
        rate_max_requests=2,
        abuse_threshold=3,
        abuse_cooldown_seconds=90,
        protection_ttl_seconds=300,
    )

    with pytest.raises(ProtectionUnavailable):
        protector.check("anon:test")


def _protector(
    *,
    clock: DeterministicClock,
    store: FakeRedisStore | None = None,
    rate_max_requests: int = 10,
    abuse_threshold: int = 3,
) -> PublicChatProtector:
    return PublicChatProtector(
        store=store or FakeRedisStore(clock),
        rate_window_seconds=60,
        rate_max_requests=rate_max_requests,
        abuse_threshold=abuse_threshold,
        abuse_cooldown_seconds=90,
        protection_ttl_seconds=300,
    )


class FailingRedisStore:
    def get(self, key: str) -> str | None:
        raise OSError("redis unavailable")

    def set(self, key: str, value: str, ex: int | None = None) -> None:
        raise OSError("redis unavailable")

    def incr(self, key: str, ex: int | None = None) -> int:
        raise OSError("redis unavailable")

    def delete(self, key: str) -> None:
        raise OSError("redis unavailable")

    def ttl(self, key: str) -> int:
        raise OSError("redis unavailable")
