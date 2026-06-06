from __future__ import annotations

import json
from unittest import mock

import pytest
from django.test import Client, override_settings

from chatbot.contracts import ChatContractError, normalize_chat_request, serialize_chat_outcome
from chatbot.dtos import (
    AnsweredOutcome,
    ChatCitation,
    ChatGrounding,
    CooldownOutcome,
    FallbackOutcome,
)


def test_request_normalization_defaults_student_depth_and_preserves_section() -> None:
    request = normalize_chat_request(
        {
            "question": "  Explain the UN Security Council.  ",
            "context": {"currentSectionId": " un-command-center "},
        }
    )

    assert request.question == "Explain the UN Security Council."
    assert request.current_section_id == "un-command-center"
    assert request.depth_mode == "student"


def test_request_normalization_accepts_expert_depth() -> None:
    request = normalize_chat_request(
        {
            "question": "Compare institutional legitimacy and enforcement.",
            "context": {"depthMode": "expert"},
        }
    )

    assert request.depth_mode == "expert"


@pytest.mark.parametrize(
    ("payload", "message"),
    [
        ({}, "question"),
        ({"question": "   "}, "question"),
        ({"question": "Valid", "context": []}, "context"),
        ({"question": "Valid", "context": {"depthMode": "advanced"}}, "depth"),
    ],
)
def test_request_normalization_rejects_invalid_public_shapes(
    payload: dict[str, object],
    message: str,
) -> None:
    with pytest.raises(ChatContractError, match=message):
        normalize_chat_request(payload)


@override_settings(
    ROOT_URLCONF="config.urls",
    PUBLIC_CHAT_REQUEST_BODY_MAX_BYTES=128,
    PUBLIC_CHAT_QUESTION_MAX_CHARS=40,
)
def test_public_chat_rejects_malformed_missing_and_oversized_requests() -> None:
    client = Client()

    malformed = client.post("/api/chat", data="{", content_type="application/json")
    missing = client.post("/api/chat", data={}, content_type="application/json")
    long_question = client.post(
        "/api/chat",
        data={"question": "x" * 41},
        content_type="application/json",
    )
    oversized_body = client.post(
        "/api/chat",
        data=json.dumps({"question": "x" * 150}),
        content_type="application/json",
    )

    assert malformed.status_code == 400
    assert malformed.json()["error"]["code"] == "invalid_json"
    assert missing.status_code == 400
    assert missing.json()["error"]["code"] == "invalid_request"
    assert long_question.status_code == 400
    assert long_question.json()["error"]["code"] == "invalid_request"
    assert oversized_body.status_code == 413
    assert oversized_body.json()["error"]["code"] == "payload_too_large"


@override_settings(ROOT_URLCONF="config.urls")
def test_public_chat_allows_browser_preflight_for_live_chat() -> None:
    client = Client()

    response = client.options(
        "/api/chat",
        HTTP_ORIGIN="http://127.0.0.1:4174",
        HTTP_ACCESS_CONTROL_REQUEST_METHOD="POST",
        HTTP_ACCESS_CONTROL_REQUEST_HEADERS="Content-Type, X-Anonymous-Session-Id",
    )

    assert response.status_code == 204
    assert response["Access-Control-Allow-Origin"] == "http://127.0.0.1:4174"
    assert response["Access-Control-Allow-Methods"] == "POST, OPTIONS"
    assert "X-Anonymous-Session-Id" in response["Access-Control-Allow-Headers"]


@override_settings(
    ROOT_URLCONF="config.urls",
    PUBLIC_CHAT_ANSWER_MAX_CHARS=40,
    PUBLIC_CHAT_VISIBLE_CITATION_LIMIT=2,
)
def test_public_chat_passes_depth_and_section_to_orchestration() -> None:
    client = Client()
    outcome = AnsweredOutcome(
        answer="A bounded grounded answer.",
        grounding=ChatGrounding(support_level="strong", cue="Grounded answer"),
        citations=(
            ChatCitation(
                source_id="gg-src-un-charter-institutions",
                title="Charter of the United Nations",
                short_title="UN Charter",
                source_type="primary",
                detail="Supports the institutional explanation.",
                url="https://www.un.org/en/about-us/un-charter/full-text",
            ),
        ),
    )

    with mock.patch("chatbot.views.answer_public_chat", return_value=outcome) as answer:
        response = client.post(
            "/api/chat",
            data={
                "question": "Explain the UN.",
                "context": {
                    "currentSectionId": "un-command-center",
                    "depthMode": "expert",
                },
            },
            content_type="application/json",
        )

    assert response.status_code == 200
    assert response["Access-Control-Allow-Origin"] == "*"
    request = answer.call_args.args[0]
    assert request.current_section_id == "un-command-center"
    assert request.depth_mode == "expert"
    assert response.json()["data"]["state"] == "answered"


@override_settings(ROOT_URLCONF="config.urls")
def test_public_chat_returns_cooldown_as_http_429_typed_success() -> None:
    client = Client()
    cooldown = CooldownOutcome(
        code="rate_limited",
        message="The assistant is temporarily limited.",
        next_step="Wait briefly, then ask a course-focused question.",
        retry_after_seconds=45,
    )

    with mock.patch("chatbot.views.answer_public_chat", return_value=cooldown) as answer:
        response = client.post(
            "/api/chat",
            data={"question": "Explain the UN."},
            content_type="application/json",
            HTTP_X_ANONYMOUS_SESSION_ID="browser-session",
            REMOTE_ADDR="203.0.113.8",
        )

    assert response.status_code == 429
    assert response.json()["success"] is True
    assert response.json()["data"]["state"] == "cooldown"
    assert answer.call_args.kwargs == {
        "anonymous_session_id": "browser-session",
        "remote_address": "203.0.113.8",
    }


@override_settings(
    PUBLIC_CHAT_ANSWER_MAX_CHARS=24,
    PUBLIC_CHAT_VISIBLE_CITATION_LIMIT=2,
)
def test_response_serialization_bounds_answer_citations_and_private_urls() -> None:
    citations = tuple(
        ChatCitation(
            source_id=f"gg-src-source-{index}",
            title=f"Source {index}",
            short_title=f"S{index}",
            source_type="reference",
            detail="Approved support.",
            url=(
                "https://example.test/source"
                if index == 0
                else "http://127.0.0.1:54321/storage/v1/object/private/source.pdf"
            ),
        )
        for index in range(4)
    )
    data = serialize_chat_outcome(
        AnsweredOutcome(
            answer="A" * 80,
            grounding=ChatGrounding(support_level="strong", cue="Grounded answer"),
            citations=citations,
        )
    )

    assert len(data["answer"]) == 24
    assert len(data["citations"]) == 2
    assert data["citations"][0]["url"] == "https://example.test/source"
    assert "url" not in data["citations"][1]
    assert all("storage" not in citation for citation in data["citations"])


@override_settings(ROOT_URLCONF="config.urls")
def test_provider_failure_returns_typed_safe_fallback_without_internal_details() -> None:
    client = Client()
    fallback = FallbackOutcome(
        message="The assistant could not complete a grounded answer right now.",
        next_step="Continue with the lesson or try a course question.",
        suggested_prompts=("What is global governance?", "Why is the UN important?"),
        fallback_source_label="Current lesson summary",
    )

    with mock.patch("chatbot.views.answer_public_chat", return_value=fallback):
        response = client.post(
            "/api/chat",
            data={"question": "Explain the UN."},
            content_type="application/json",
        )

    assert response.status_code == 200
    assert response.json()["data"] == {
        "state": "fallback",
        "message": fallback.message,
        "nextStep": fallback.next_step,
        "suggestedPrompts": list(fallback.suggested_prompts),
        "fallbackSource": {"label": "Current lesson summary"},
    }
