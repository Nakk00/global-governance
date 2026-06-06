from __future__ import annotations

import ipaddress
from typing import Any, cast
from urllib.parse import urlparse

from django.conf import settings

from chatbot.dtos import (
    AnsweredOutcome,
    ChatCitation,
    ChatGrounding,
    ChatOutcome,
    ChatRequest,
    CooldownOutcome,
    DepthMode,
    FallbackOutcome,
    RefusedOutcome,
    WeakSupportOutcome,
)


class ChatContractError(ValueError):
    def __init__(self, message: str, *, code: str = "invalid_request", status: int = 400) -> None:
        super().__init__(message)
        self.code = code
        self.status = status


def normalize_chat_request(payload: dict[str, Any]) -> ChatRequest:
    raw_question = payload.get("question")
    if not isinstance(raw_question, str) or not raw_question.strip():
        raise ChatContractError("A non-empty question is required.")
    question = raw_question.strip()
    if len(question) > settings.PUBLIC_CHAT_QUESTION_MAX_CHARS:
        raise ChatContractError("The question exceeds the public chat limit.")

    raw_context = payload.get("context")
    if raw_context is None:
        context: dict[str, Any] = {}
    elif isinstance(raw_context, dict):
        context = raw_context
    else:
        raise ChatContractError("Chat context must be a JSON object.")

    raw_section_id = context.get("currentSectionId")
    if raw_section_id is None:
        section_id = None
    elif isinstance(raw_section_id, str) and raw_section_id.strip():
        section_id = raw_section_id.strip()[:128]
    else:
        raise ChatContractError("Current section context must be a non-empty string.")

    raw_depth = context.get("depthMode", "student")
    if raw_depth not in {"student", "expert"}:
        raise ChatContractError("Chat depth must be student or expert.")

    return ChatRequest(
        question=question,
        current_section_id=section_id,
        depth_mode=cast(DepthMode, raw_depth),
    )


def serialize_chat_outcome(outcome: ChatOutcome) -> dict[str, Any]:
    if isinstance(outcome, AnsweredOutcome):
        return {
            "state": outcome.state,
            "answer": outcome.answer[: settings.PUBLIC_CHAT_ANSWER_MAX_CHARS],
            "grounding": _serialize_grounding(outcome.grounding),
            "citations": [
                _serialize_citation(citation)
                for citation in outcome.citations[
                    : settings.PUBLIC_CHAT_VISIBLE_CITATION_LIMIT
                ]
            ],
        }
    if isinstance(outcome, WeakSupportOutcome):
        return {
            "state": outcome.state,
            "message": outcome.message,
            "nextStep": outcome.next_step,
            "grounding": _serialize_grounding(outcome.grounding),
            "citations": [
                _serialize_citation(citation)
                for citation in outcome.citations[
                    : settings.PUBLIC_CHAT_VISIBLE_CITATION_LIMIT
                ]
            ],
        }
    if isinstance(outcome, RefusedOutcome):
        return {
            "state": outcome.state,
            "code": outcome.code,
            "message": outcome.message,
            "nextStep": outcome.next_step,
        }
    if isinstance(outcome, CooldownOutcome):
        return {
            "state": outcome.state,
            "code": outcome.code,
            "message": outcome.message,
            "nextStep": outcome.next_step,
            "retryAfterSeconds": outcome.retry_after_seconds,
        }
    if isinstance(outcome, FallbackOutcome):
        data: dict[str, Any] = {
            "state": outcome.state,
            "message": outcome.message,
            "nextStep": outcome.next_step,
            "suggestedPrompts": list(outcome.suggested_prompts),
        }
        if outcome.fallback_source_label:
            data["fallbackSource"] = {"label": outcome.fallback_source_label}
        return data
    raise TypeError("Unsupported public chat outcome")


def _serialize_grounding(grounding: ChatGrounding) -> dict[str, str]:
    return {
        "supportLevel": grounding.support_level,
        "cue": grounding.cue,
    }


def _serialize_citation(citation: ChatCitation) -> dict[str, str]:
    data = {
        "sourceId": citation.source_id,
        "title": citation.title,
        "shortTitle": citation.short_title,
        "sourceType": citation.source_type,
        "detail": citation.detail,
    }
    if citation.url and is_safe_public_url(citation.url):
        data["url"] = citation.url
    return data


def is_safe_public_url(value: str) -> bool:
    try:
        parsed = urlparse(value)
        if parsed.scheme not in {"http", "https"} or not parsed.hostname:
            return False
        if parsed.hostname.lower() == "localhost":
            return False
        try:
            address = ipaddress.ip_address(parsed.hostname)
        except ValueError:
            return True
        return not (
            address.is_private
            or address.is_loopback
            or address.is_link_local
            or address.is_reserved
        )
    except ValueError:
        return False
