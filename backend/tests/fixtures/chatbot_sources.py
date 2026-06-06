from __future__ import annotations

from dataclasses import dataclass


@dataclass(frozen=True)
class ApprovedSourceRecordFixture:
    source_id: str
    title: str
    source_type: str
    storage_bucket: str
    storage_path: str
    revision: str
    chunks: tuple[str, ...]


@dataclass(frozen=True)
class CitationRecordFixture:
    citation_id: str
    source_id: str
    title: str
    short_title: str
    source_type: str
    detail: str
    chunk_ids: tuple[str, ...]


@dataclass(frozen=True)
class SectionContextFixture:
    section_id: str
    title: str
    approved_source_ids: tuple[str, ...]
    starter_prompts: tuple[str, ...]


APPROVED_SOURCE_FIXTURE = ApprovedSourceRecordFixture(
    source_id="gg-src-global-governance-course-frame",
    title="Global Governance Course Frame",
    source_type="course",
    storage_bucket="approved-sources",
    storage_path="raw/topic-1-global-governance.md",
    revision="2026-06-06",
    chunks=(
        "Global governance coordinates rules and institutions without becoming a world government.",
        "Institutions make cooperation more visible, repeatable, and contestable.",
    ),
)

WPS_SOURCE_FIXTURE = ApprovedSourceRecordFixture(
    source_id="gg-src-west-philippine-sea-dossier",
    title="West Philippine Sea Dossier",
    source_type="case",
    storage_bucket="approved-sources",
    storage_path="raw/topic-6-west-philippine-sea.md",
    revision="2026-06-06",
    chunks=(
        "The West Philippine Sea dispute shows how legal rulings and state behavior interact.",
    ),
)

APPROVED_CITATION_FIXTURE = CitationRecordFixture(
    citation_id="ref-global-governance-course-frame",
    source_id=APPROVED_SOURCE_FIXTURE.source_id,
    title=APPROVED_SOURCE_FIXTURE.title,
    short_title="Course frame",
    source_type=APPROVED_SOURCE_FIXTURE.source_type,
    detail="Supports the distinction between governance and world government.",
    chunk_ids=("chunk-global-governance-course-frame-0",),
)

WPS_CITATION_FIXTURE = CitationRecordFixture(
    citation_id="ref-west-philippine-sea-dossier",
    source_id=WPS_SOURCE_FIXTURE.source_id,
    title=WPS_SOURCE_FIXTURE.title,
    short_title="WPS dossier",
    source_type=WPS_SOURCE_FIXTURE.source_type,
    detail="Supports scoped answers about legal clarity and political enforcement.",
    chunk_ids=("chunk-west-philippine-sea-dossier-0",),
)

SECTION_CONTEXT_FIXTURES = {
    "global-governance-overview": SectionContextFixture(
        section_id="global-governance-overview",
        title="Global Governance Overview",
        approved_source_ids=(APPROVED_SOURCE_FIXTURE.source_id,),
        starter_prompts=(
            "What is global governance?",
            "How is global governance different from world government?",
        ),
    ),
    "west-philippine-sea-dossier": SectionContextFixture(
        section_id="west-philippine-sea-dossier",
        title="West Philippine Sea Dossier",
        approved_source_ids=(WPS_SOURCE_FIXTURE.source_id,),
        starter_prompts=(
            "Why does the West Philippine Sea case matter for governance?",
            "How can law clarify a dispute without ending political conflict?",
        ),
    ),
}

ANONYMOUS_SESSION_HEADERS = {
    "HTTP_X_ANONYMOUS_SESSION_ID": "anon-session-fixture",
}


def approved_source_records() -> tuple[ApprovedSourceRecordFixture, ...]:
    return (APPROVED_SOURCE_FIXTURE, WPS_SOURCE_FIXTURE)


def citation_records() -> tuple[CitationRecordFixture, ...]:
    return (APPROVED_CITATION_FIXTURE, WPS_CITATION_FIXTURE)


def section_context(section_id: str = "global-governance-overview") -> SectionContextFixture:
    return SECTION_CONTEXT_FIXTURES[section_id]
