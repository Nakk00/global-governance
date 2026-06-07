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
    source_id="gg-src-south-china-sea-award",
    title="South China Sea Arbitration Award",
    source_type="case",
    storage_bucket="approved-sources",
    storage_path="raw/topic-6-west-philippine-sea.md",
    revision="2026-06-06",
    chunks=(
        "The West Philippine Sea dispute shows how legal rulings and state behavior interact.",
    ),
)

WPS_ARBITRATION_FILING_FIXTURE = ApprovedSourceRecordFixture(
    source_id="gg-src-philippines-arbitration-filing",
    title="Philippines Notification and Statement of Claim",
    source_type="case",
    storage_bucket="approved-sources",
    storage_path="raw/topic-5-international-law-dispute-resolution-knowledge.md",
    revision="topic-5-2026-06-06",
    chunks=(
        "The Philippines used UNCLOS dispute settlement to frame legal questions "
        "around maritime rights.",
    ),
)

WPS_ENFORCEMENT_GAP_FIXTURE = ApprovedSourceRecordFixture(
    source_id="gg-src-wps-enforcement-gap-comparison",
    title="Tribunal Award and Post-Award Conduct Comparison",
    source_type="case",
    storage_bucket="approved-sources",
    storage_path="raw/topic-7-enforcement-gap-ruling-vs-reality-knowledge.md",
    revision="topic-7-2026-06-06",
    chunks=(
        "The award clarified legal rights while later conduct showed practical enforcement limits.",
    ),
)

WPS_POLITICAL_REALITY_FIXTURE = ApprovedSourceRecordFixture(
    source_id="gg-src-wps-political-reality-record",
    title="Diplomatic Response and State Behavior Record",
    source_type="case",
    storage_bucket="approved-sources",
    storage_path="raw/topic-8-asean-and-regional-governance-knowledge.md",
    revision="topic-8-2026-06-06",
    chunks=("Diplomacy, reputation, and state capacity shaped behavior after the award.",),
)

WPS_POST_AWARD_COMPLIANCE_FIXTURE = ApprovedSourceRecordFixture(
    source_id="gg-src-post-award-compliance-record",
    title="Post-Award Compliance and Diplomacy Record",
    source_type="case",
    storage_bucket="approved-sources",
    storage_path="raw/post-award-compliance-record-knowledge.md",
    revision="post-award-compliance-2026-06-07",
    chunks=("Post-award compliance showed the gap between legal clarity and enforcement.",),
)

WPS_SCARBOROUGH_FIXTURE = ApprovedSourceRecordFixture(
    source_id="gg-src-scarborough-standoff-record",
    title="Scarborough Shoal Standoff Public Record",
    source_type="case",
    storage_bucket="approved-sources",
    storage_path="raw/scarborough-standoff-record-knowledge.md",
    revision="scarborough-standoff-2026-06-07",
    chunks=("The Scarborough record shows state behavior around contested maritime access.",),
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
        approved_source_ids=(
            "gg-src-south-china-sea-award",
            "gg-src-wps-enforcement-gap-comparison",
            "gg-src-wps-political-reality-record",
            "gg-src-philippines-arbitration-filing",
            "gg-src-post-award-compliance-record",
            "gg-src-scarborough-standoff-record",
        ),
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
    return (
        APPROVED_SOURCE_FIXTURE,
        WPS_SOURCE_FIXTURE,
        WPS_ARBITRATION_FILING_FIXTURE,
        WPS_ENFORCEMENT_GAP_FIXTURE,
        WPS_POLITICAL_REALITY_FIXTURE,
        WPS_POST_AWARD_COMPLIANCE_FIXTURE,
        WPS_SCARBOROUGH_FIXTURE,
    )


def citation_records() -> tuple[CitationRecordFixture, ...]:
    return (APPROVED_CITATION_FIXTURE, WPS_CITATION_FIXTURE)


def section_context(section_id: str = "global-governance-overview") -> SectionContextFixture:
    return SECTION_CONTEXT_FIXTURES[section_id]
