from __future__ import annotations

from sources.dtos import ApprovedSourceSeed

from .base import SourceRecord

APPROVED_SOURCE_SEEDS: tuple[ApprovedSourceSeed, ...] = (
    ApprovedSourceSeed(
        source_id="gg-src-global-governance-course-frame",
        title="Global Governance Course Frame",
        source_type="course",
        provenance="Repo-authored course framing; curriculum source",
        summary="Defines the course distinction between global governance and world government.",
        usage_scope=("chat", "ingestion"),
    ),
    ApprovedSourceSeed(
        source_id="gg-src-philippines-arbitration-filing",
        title="Philippines Notification and Statement of Claim",
        source_type="case",
        provenance="2013 legal filing; UNCLOS arbitration; case initiation",
        summary=(
            "Identifies the legal questions the Philippines brought under UNCLOS "
            "dispute settlement."
        ),
        usage_scope=("evidence", "ingestion"),
        aliases=("wps-src-2013-arbitration-filing",),
    ),
    ApprovedSourceSeed(
        source_id="gg-src-post-award-compliance-record",
        title="Post-Award Compliance and Diplomacy Record",
        source_type="case",
        provenance="Post-2016 implementation context; diplomacy; enforcement limits",
        summary=(
            "Tracks continued maritime pressure, diplomatic positioning, and public "
            "accountability after the award."
        ),
        usage_scope=("evidence", "ingestion"),
        aliases=("wps-src-post-2016-compliance",),
    ),
    ApprovedSourceSeed(
        source_id="gg-src-scarborough-standoff-record",
        title="Scarborough Shoal Standoff Public Record",
        source_type="case",
        provenance="2012 maritime incident; timeline source; contested access",
        summary=(
            "Shows how official vessels and access claims turned Scarborough Shoal "
            "into a visible dispute."
        ),
        usage_scope=("evidence", "ingestion"),
        aliases=("wps-src-2012-scarborough",),
    ),
    ApprovedSourceSeed(
        source_id="gg-src-south-china-sea-award",
        title="South China Sea Arbitration Award",
        source_type="case",
        provenance="2016 UNCLOS tribunal award; legal record; West Philippine Sea case",
        summary=(
            "Clarifies maritime entitlements and legal findings while showing that "
            "legal judgment and political enforcement remain different problems."
        ),
        usage_scope=("presentation", "chat", "evidence", "ingestion"),
        aliases=("gg-src-wps-arbitral-ruling", "wps-src-2016-tribunal-award"),
    ),
    ApprovedSourceSeed(
        source_id="gg-src-sustainable-development-report",
        title="UN Sustainable Development Goals Report",
        source_type="reference",
        provenance="UN public progress report; accountability evidence; policy snapshot",
        summary=(
            "Tracks shared goals, uneven progress, and the public evidence "
            "governments use to compare commitments against visible outcomes."
        ),
        usage_scope=("presentation", "ingestion"),
    ),
    ApprovedSourceSeed(
        source_id="gg-src-un-charter-institutions",
        title="Charter of the United Nations",
        source_type="primary",
        provenance="Foundational UN treaty; institutional design; primary source",
        summary=(
            "Defines the UN's purposes, organs, member obligations, and Security Council structure."
        ),
        usage_scope=("presentation", "chat", "ingestion"),
    ),
    ApprovedSourceSeed(
        source_id="gg-src-wps-enforcement-gap-comparison",
        title="Tribunal Award and Post-Award Conduct Comparison",
        source_type="case",
        provenance="Comparison source; legal outcome versus implementation; UNCLOS",
        summary=(
            "Pairs the award and later conduct to separate legal clarification from "
            "enforcement capacity."
        ),
        usage_scope=("evidence", "ingestion"),
        aliases=("wps-src-comparison-enforcement-gap",),
    ),
    ApprovedSourceSeed(
        source_id="gg-src-wps-political-reality-record",
        title="Diplomatic Response and State Behavior Record",
        source_type="case",
        provenance="Comparison source; diplomacy; state behavior",
        summary="Records how states used diplomacy, reputation, and capacity after the award.",
        usage_scope=("evidence", "ingestion"),
        aliases=("wps-src-comparison-political-reality",),
    ),
)


def source_from_seed(seed: ApprovedSourceSeed) -> SourceRecord:
    return SourceRecord(
        source_id=seed.source_id,
        title=seed.title,
        source_type=seed.source_type,
        provenance=seed.provenance,
        summary=seed.summary,
        usage_scope=list(seed.usage_scope),
        aliases=list(seed.aliases),
        lifecycle_state=seed.lifecycle_state,
        storage_path="bootstrap-approved-source-bundle",
    )


__all__ = ["APPROVED_SOURCE_SEEDS", "source_from_seed"]
