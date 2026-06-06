from __future__ import annotations

from dataclasses import dataclass, field
from typing import Literal

DepthMode = Literal["student", "expert"]
SupportLevel = Literal["strong", "weak"]
ChatSourceType = Literal["primary", "course", "case", "reference"]
RefusalCode = Literal["off_topic", "unsafe"]
ProviderRole = Literal["generation", "embedding", "rerank", "topic_guard", "safety_guard"]


@dataclass(frozen=True)
class ChatRequest:
    question: str
    current_section_id: str | None
    depth_mode: DepthMode


@dataclass(frozen=True)
class ChatGrounding:
    support_level: SupportLevel
    cue: str


@dataclass(frozen=True)
class ChatCitation:
    source_id: str
    title: str
    short_title: str
    source_type: ChatSourceType
    detail: str
    url: str | None = None


@dataclass(frozen=True)
class AnsweredOutcome:
    answer: str
    grounding: ChatGrounding
    citations: tuple[ChatCitation, ...]
    state: Literal["answered"] = field(default="answered", init=False)


@dataclass(frozen=True)
class WeakSupportOutcome:
    message: str
    next_step: str
    grounding: ChatGrounding
    citations: tuple[ChatCitation, ...] = ()
    state: Literal["weakSupport"] = field(default="weakSupport", init=False)


@dataclass(frozen=True)
class RefusedOutcome:
    code: RefusalCode
    message: str
    next_step: str
    state: Literal["refused"] = field(default="refused", init=False)


@dataclass(frozen=True)
class CooldownOutcome:
    code: Literal["rate_limited", "abuse_cooldown"]
    message: str
    next_step: str
    retry_after_seconds: int
    state: Literal["cooldown"] = field(default="cooldown", init=False)


@dataclass(frozen=True)
class FallbackOutcome:
    message: str
    next_step: str
    suggested_prompts: tuple[str, ...]
    fallback_source_label: str | None = None
    state: Literal["fallback"] = field(default="fallback", init=False)


type ChatOutcome = (
    AnsweredOutcome
    | WeakSupportOutcome
    | RefusedOutcome
    | CooldownOutcome
    | FallbackOutcome
)
