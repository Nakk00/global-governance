from __future__ import annotations

import json
from unittest import mock
from urllib.error import URLError

import pytest

from chatbot.nvidia import NvidiaModelRoles, NvidiaProviderError


def test_model_roles_use_query_embedding_and_nvidia_rerank_contracts() -> None:
    roles = _roles()
    responses = [
        _JsonResponse({"data": [{"index": 0, "embedding": [0.1, 0.2, 0.3]}]}),
        _JsonResponse(
            {
                "rankings": [
                    {"index": 1, "logit": 2.0},
                    {"index": 0, "logit": -2.0},
                ]
            }
        ),
    ]

    with mock.patch("chatbot.nvidia.urlopen", side_effect=responses) as mocked_urlopen:
        vectors, evidence = roles.embed(["How does the UN coordinate action?"])
        ranking = roles.rerank(
            "How does the UN coordinate action?",
            ["First passage", "Second passage"],
        )

    assert vectors == [[0.1, 0.2, 0.3]]
    assert evidence == {"model": "nvidia/test-embedding", "dimensions": 3}
    assert ranking[0][0] == 1
    assert ranking[0][1] > ranking[1][1]

    embedding_request = mocked_urlopen.call_args_list[0].args[0]
    embedding_payload = json.loads(embedding_request.data)
    assert embedding_request.full_url == "https://integrate.api.nvidia.test/v1/embeddings"
    assert embedding_payload["input_type"] == "query"
    assert embedding_payload["dimensions"] == 3

    rerank_request = mocked_urlopen.call_args_list[1].args[0]
    rerank_payload = json.loads(rerank_request.data)
    assert rerank_request.full_url.endswith("/test-rerank/reranking")
    assert rerank_payload["query"] == {"text": "How does the UN coordinate action?"}
    assert rerank_payload["passages"] == [
        {"text": "First passage"},
        {"text": "Second passage"},
    ]


def test_model_roles_generate_a_depth_aware_bounded_grounded_prompt() -> None:
    roles = _roles()
    response = _JsonResponse(
        {
            "choices": [
                {
                    "message": {
                        "content": "The UN coordinates action through institutions."
                    }
                }
            ]
        }
    )

    with mock.patch("chatbot.nvidia.urlopen", return_value=response) as mocked_urlopen:
        answer = roles.generate(
            "Explain the UN.",
            ["Approved context one.", "Approved context two."],
            "expert",
        )

    assert answer == "The UN coordinates action through institutions."
    request = mocked_urlopen.call_args.args[0]
    payload = json.loads(request.data)
    assert request.full_url == "https://integrate.api.nvidia.test/v1/chat/completions"
    assert payload["model"] == "nvidia/test-generation"
    assert "expert" in payload["messages"][0]["content"].lower()
    assert "Approved context one." in payload["messages"][1]["content"]
    assert payload["max_tokens"] == 260


def test_model_roles_parse_topic_and_safety_guard_decisions() -> None:
    roles = _roles()
    responses = [
        _JsonResponse(
            {
                "choices": [
                    {
                        "message": {
                            "content": '{"allowed": false, "label": "off_topic"}'
                        }
                    }
                ]
            }
        ),
        _JsonResponse(
            {
                "choices": [
                    {"message": {"content": '{"allowed": true, "label": "safe"}'}}
                ]
            }
        ),
    ]

    with mock.patch("chatbot.nvidia.urlopen", side_effect=responses):
        topic = roles.check_topic("Write a recipe.")
        safety = roles.check_safety("Explain global governance.")

    assert topic == {"allowed": False, "label": "off_topic"}
    assert safety == {"allowed": True, "label": "safe"}


def test_model_roles_normalize_native_guard_response_formats() -> None:
    roles = _roles()
    responses = [
        _JsonResponse(
            {"choices": [{"message": {"content": "on-topic"}}]}
        ),
        _JsonResponse(
            {
                "choices": [
                    {
                        "message": {
                            "content": (
                                '{"User Safety": "safe", '
                                '"Response Safety": "safe"}'
                            )
                        }
                    }
                ]
            }
        ),
    ]

    with mock.patch("chatbot.nvidia.urlopen", side_effect=responses):
        topic = roles.check_topic("Explain the UN.")
        safety = roles.check_safety("Explain the UN.")

    assert topic == {"allowed": True, "label": "in_scope"}
    assert safety == {"allowed": True, "label": "safe"}


def test_model_roles_return_typed_provider_failures() -> None:
    roles = _roles()

    with (
        mock.patch("chatbot.nvidia.urlopen", side_effect=URLError("offline")),
        pytest.raises(NvidiaProviderError) as error,
    ):
        roles.generate("Explain global governance.", ["Approved context."])

    assert error.value.code == "nvidia_provider_unavailable"
    assert "offline" not in str(error.value)


def _roles() -> NvidiaModelRoles:
    return NvidiaModelRoles(
        api_key="test-key",
        base_url="https://integrate.api.nvidia.test/v1",
        retrieval_base_url="https://ai.api.nvidia.test/v1/retrieval/nvidia",
        generation_model="nvidia/test-generation",
        embedding_model="nvidia/test-embedding",
        rerank_model="nvidia/test-rerank",
        topic_guard_model="nvidia/test-topic",
        safety_guard_model="nvidia/test-safety",
        embedding_dimensions=3,
        timeout_seconds=1,
    )


class _JsonResponse:
    def __init__(self, payload: dict[str, object]) -> None:
        self.payload = payload

    def __enter__(self) -> _JsonResponse:
        return self

    def __exit__(self, *args: object) -> None:
        return None

    def read(self) -> bytes:
        return json.dumps(self.payload).encode("utf-8")
