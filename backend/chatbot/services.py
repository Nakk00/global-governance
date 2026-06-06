from __future__ import annotations

from typing import Any, Protocol

from django.conf import settings

from chatbot.cache import CachedModelRoles, CachePolicy, OperationalCache
from chatbot.dtos import (
    AnsweredOutcome,
    ChatGrounding,
    ChatOutcome,
    ChatRequest,
    CooldownOutcome,
    FallbackOutcome,
    RefusedOutcome,
    WeakSupportOutcome,
)
from chatbot.nvidia import NvidiaModelRoles
from chatbot.protection import (
    ProtectionDecision,
    ProtectionUnavailable,
    PublicChatProtector,
    RedisProtectionStore,
    anonymous_identity_key,
)
from retrieval.repositories import SupabaseRetrievalRepository
from retrieval.services import RetrievalService

SECTION_SOURCE_IDS: dict[str, tuple[str, ...]] = {
    "hero-narrative-frame": ("gg-src-global-governance-course-frame",),
    "global-governance-overview": ("gg-src-global-governance-course-frame",),
    "governance-limits": (
        "gg-src-global-governance-course-frame",
        "gg-src-un-charter-institutions",
    ),
    "un-command-center": (
        "gg-src-global-governance-course-frame",
        "gg-src-un-charter-institutions",
    ),
    "west-philippine-sea-dossier": ("gg-src-south-china-sea-award",),
    "conclusion-references": (
        "gg-src-global-governance-course-frame",
        "gg-src-south-china-sea-award",
        "gg-src-un-charter-institutions",
    ),
}


class ChatModels(Protocol):
    def generate(
        self,
        prompt: str,
        context_chunks: list[str],
        depth_mode: str = "student",
    ) -> str: ...

    def check_topic(self, prompt: str) -> dict[str, Any]: ...

    def check_safety(self, text: str) -> dict[str, Any]: ...


class ChatProtector(Protocol):
    def check(self, identity: str) -> ProtectionDecision: ...

    def record_refusal(self, identity: str) -> ProtectionDecision | None: ...

    def record_success(self, identity: str) -> None: ...


class GroundedChatService:
    def __init__(self, *, models: ChatModels, retrieval: RetrievalService) -> None:
        self.models = models
        self.retrieval = retrieval

    def answer(self, request: ChatRequest) -> ChatOutcome:
        try:
            return self._answer(request)
        except Exception:
            return _fallback_outcome(request.current_section_id)

    def _answer(self, request: ChatRequest) -> ChatOutcome:
        if not bool(self.models.check_topic(request.question).get("allowed")):
            return RefusedOutcome(
                code="off_topic",
                message=(
                    "I can help with questions about this Global Governance course "
                    "and its approved materials."
                ),
                next_step=(
                    "Try asking about global governance, the UN, institutions, "
                    "or the current lesson."
                ),
            )
        if not bool(self.models.check_safety(request.question).get("allowed")):
            return RefusedOutcome(
                code="unsafe",
                message="I cannot help with that request.",
                next_step="Try a course-focused question about the current lesson.",
            )

        retrieval = self.retrieval.retrieve(
            request.question,
            current_section_id=request.current_section_id,
        )
        if retrieval.support_level != "strong":
            return WeakSupportOutcome(
                message=(
                    "Approved materials offer only partial support for this question."
                ),
                next_step="Try narrowing the question to the current lesson topic.",
                grounding=ChatGrounding(
                    support_level="weak",
                    cue="Limited support in approved materials",
                ),
            )

        answer = self.models.generate(
            request.question,
            [candidate.content for candidate in retrieval.chunks],
            request.depth_mode,
        ).strip()
        if not answer or not bool(self.models.check_safety(answer).get("allowed")):
            return _fallback_outcome(request.current_section_id)
        return AnsweredOutcome(
            answer=answer,
            grounding=ChatGrounding(
                support_level="strong",
                cue=f"Grounded with {len(retrieval.citations)} approved source"
                + ("" if len(retrieval.citations) == 1 else "s"),
            ),
            citations=retrieval.citations,
        )


class PublicChatRuntime:
    def __init__(
        self,
        *,
        service: GroundedChatService,
        protector: ChatProtector,
    ) -> None:
        self.service = service
        self.protector = protector

    def answer(self, request: ChatRequest, *, identity: str) -> ChatOutcome:
        try:
            decision = self.protector.check(identity)
            if not decision.allowed:
                return _cooldown_outcome(decision)

            outcome = self.service.answer(request)
            if isinstance(outcome, RefusedOutcome):
                escalation = self.protector.record_refusal(identity)
                return _cooldown_outcome(escalation) if escalation else outcome

            self.protector.record_success(identity)
            return outcome
        except ProtectionUnavailable:
            return _fallback_outcome(request.current_section_id)


def answer_public_chat(
    request: ChatRequest,
    *,
    anonymous_session_id: str | None,
    remote_address: str | None,
) -> ChatOutcome:
    store = RedisProtectionStore(settings.REDIS_URL)
    base_models = NvidiaModelRoles()
    cache = OperationalCache(
        store=store,
        secret=settings.SECRET_KEY,
        policy=CachePolicy(
            schema_version="chat-cache-v1",
            policy_version=settings.PUBLIC_CHAT_POLICY_VERSION,
            source_index_version=settings.PUBLIC_CHAT_SOURCE_INDEX_VERSION,
            guard_ttl_seconds=settings.REDIS_GUARD_CACHE_TTL_SECONDS,
            query_helper_ttl_seconds=settings.REDIS_QUERY_HELPER_CACHE_TTL_SECONDS,
            retrieval_ttl_seconds=settings.REDIS_RETRIEVAL_CACHE_TTL_SECONDS,
            final_answer_enabled=settings.REDIS_FINAL_ANSWER_CACHE_ENABLED,
        ),
    )
    models = CachedModelRoles(models=base_models, cache=cache)
    retrieval = RetrievalService(
        repository=SupabaseRetrievalRepository(),
        models=models,
        section_source_ids=SECTION_SOURCE_IDS,
    )
    protector = PublicChatProtector(
        store=store,
        rate_window_seconds=settings.REDIS_RATE_LIMIT_WINDOW_SECONDS,
        rate_max_requests=settings.REDIS_RATE_LIMIT_MAX_REQUESTS,
        abuse_threshold=settings.REDIS_ABUSE_THRESHOLD,
        abuse_cooldown_seconds=settings.REDIS_ABUSE_COOLDOWN_SECONDS,
        protection_ttl_seconds=settings.REDIS_PROTECTION_TTL_SECONDS,
    )
    identity = anonymous_identity_key(
        session_id=anonymous_session_id,
        remote_address=remote_address,
        secret=settings.SECRET_KEY,
    )
    return PublicChatRuntime(
        service=GroundedChatService(models=models, retrieval=retrieval),
        protector=protector,
    ).answer(request, identity=identity)


def _fallback_outcome(current_section_id: str | None) -> FallbackOutcome:
    prompts = (
        ("Why does the West Philippine Sea case matter for governance?",)
        if current_section_id == "west-philippine-sea-dossier"
        else ("What is global governance?", "Why is the UN important?")
    )
    return FallbackOutcome(
        message="The assistant could not complete a grounded answer right now.",
        next_step="Continue with the lesson or try one of these course questions.",
        suggested_prompts=prompts,
        fallback_source_label="Current lesson summary",
    )


def _cooldown_outcome(decision: ProtectionDecision) -> CooldownOutcome:
    code = decision.code or "rate_limited"
    return CooldownOutcome(
        code=code,
        message="The assistant is temporarily limited.",
        next_step="Wait briefly, then ask a course-focused question.",
        retry_after_seconds=max(1, decision.retry_after_seconds),
    )
