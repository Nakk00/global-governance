from __future__ import annotations

import hashlib
import hmac
from dataclasses import dataclass
from typing import Literal, Protocol

from redis import Redis


class ProtectionUnavailable(RuntimeError):
    pass


class ProtectionStore(Protocol):
    def get(self, key: str) -> str | None: ...

    def set(self, key: str, value: str, ex: int | None = None) -> None: ...

    def incr(self, key: str, ex: int | None = None) -> int: ...

    def delete(self, key: str) -> None: ...

    def ttl(self, key: str) -> int: ...


class RedisProtectionStore:
    def __init__(self, redis_url: str, *, socket_timeout_seconds: float = 2) -> None:
        if not redis_url:
            raise ProtectionUnavailable("Redis protection configuration is missing.")
        self.client = Redis.from_url(
            redis_url,
            decode_responses=True,
            socket_connect_timeout=socket_timeout_seconds,
            socket_timeout=socket_timeout_seconds,
        )

    def get(self, key: str) -> str | None:
        value = self.client.get(key)
        return str(value) if value is not None else None

    def set(self, key: str, value: str, ex: int | None = None) -> None:
        self.client.set(key, value, ex=ex)

    def incr(self, key: str, ex: int | None = None) -> int:
        raw_value = self.client.incr(key)
        if not isinstance(raw_value, int):
            raise ProtectionUnavailable("Redis returned an invalid counter value.")
        value = raw_value
        if value == 1 and ex is not None:
            self.client.expire(key, ex)
        return value

    def delete(self, key: str) -> None:
        self.client.delete(key)

    def ttl(self, key: str) -> int:
        value = self.client.ttl(key)
        if not isinstance(value, int):
            raise ProtectionUnavailable("Redis returned an invalid TTL value.")
        return value


@dataclass(frozen=True)
class ProtectionDecision:
    allowed: bool
    code: Literal["rate_limited", "abuse_cooldown"] | None = None
    retry_after_seconds: int = 0


class PublicChatProtector:
    def __init__(
        self,
        *,
        store: ProtectionStore,
        rate_window_seconds: int,
        rate_max_requests: int,
        abuse_threshold: int,
        abuse_cooldown_seconds: int,
        protection_ttl_seconds: int,
    ) -> None:
        if min(
            rate_window_seconds,
            rate_max_requests,
            abuse_threshold,
            abuse_cooldown_seconds,
            protection_ttl_seconds,
        ) <= 0:
            raise ValueError("Public chat protection settings must be positive.")
        self.store = store
        self.rate_window_seconds = rate_window_seconds
        self.rate_max_requests = rate_max_requests
        self.abuse_threshold = abuse_threshold
        self.abuse_cooldown_seconds = abuse_cooldown_seconds
        self.protection_ttl_seconds = protection_ttl_seconds

    def check(self, identity: str) -> ProtectionDecision:
        try:
            cooldown_ttl = self.store.ttl(self._key(identity, "cooldown"))
            if cooldown_ttl > 0:
                return ProtectionDecision(
                    allowed=False,
                    code="abuse_cooldown",
                    retry_after_seconds=cooldown_ttl,
                )

            rate_key = self._key(identity, "rate")
            count = self.store.incr(rate_key, ex=self.rate_window_seconds)
            if count > self.rate_max_requests:
                return ProtectionDecision(
                    allowed=False,
                    code="rate_limited",
                    retry_after_seconds=max(1, self.store.ttl(rate_key)),
                )
            return ProtectionDecision(allowed=True)
        except Exception as error:
            raise ProtectionUnavailable(
                "Public chat protection is temporarily unavailable."
            ) from error

    def record_refusal(self, identity: str) -> ProtectionDecision | None:
        try:
            abuse_key = self._key(identity, "abuse")
            count = self.store.incr(abuse_key, ex=self.protection_ttl_seconds)
            if count < self.abuse_threshold:
                return None

            self.store.set(
                self._key(identity, "cooldown"),
                "1",
                ex=self.abuse_cooldown_seconds,
            )
            self.store.delete(abuse_key)
            return ProtectionDecision(
                allowed=False,
                code="abuse_cooldown",
                retry_after_seconds=self.abuse_cooldown_seconds,
            )
        except Exception as error:
            raise ProtectionUnavailable(
                "Public chat protection is temporarily unavailable."
            ) from error

    def record_success(self, identity: str) -> None:
        try:
            self.store.delete(self._key(identity, "abuse"))
        except Exception as error:
            raise ProtectionUnavailable(
                "Public chat protection is temporarily unavailable."
            ) from error

    @staticmethod
    def _key(identity: str, suffix: str) -> str:
        return f"chat:protection:{identity}:{suffix}"


def anonymous_identity_key(
    *,
    session_id: str | None,
    remote_address: str | None,
    secret: str,
) -> str:
    if not secret:
        raise ValueError("Anonymous identity hashing requires a server secret.")
    normalized_session = (session_id or "no-session").strip()[:256]
    normalized_address = (remote_address or "unknown-address").strip()[:128]
    digest = hmac.new(
        secret.encode("utf-8"),
        f"{normalized_session}\n{normalized_address}".encode(),
        hashlib.sha256,
    ).hexdigest()
    return f"anon:{digest}"
