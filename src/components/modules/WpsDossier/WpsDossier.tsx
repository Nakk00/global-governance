import { useState, type ComponentType, type SVGProps } from "react"
import {
  BookOpen,
  ArrowRight,
  CheckCircle2,
  Clock,
  Compass,
  FileSearch,
  FileText,
  FolderOpen,
  Gavel,
  Globe2,
  Landmark,
  Layers,
  Map as MapIcon,
  MapPinned,
  RefreshCw,
  Scale,
  ScrollText,
  Shield,
  ShieldCheck,
  Target,
  TriangleAlert,
  Users,
} from "lucide-react"

import type { NarrativeSectionContent } from "@/data/sections/narrative-types"
import {
  wpsCaseFileBackground,
  wpsCaseFileEvidenceCategories,
  wpsCaseFileLegend,
  wpsCaseFileMapBase,
  wpsCaseFileMapLabels,
  wpsCaseFileMapSummary,
  wpsCaseFileReferences,
  wpsCaseFileRulingRealityRows,
  wpsCaseFileThesisActions,
  wpsCaseFileTimelineEvents,
  wpsCaseFileTrustCategories,
  type WpsCaseFileEvidenceCategory,
  type WpsCaseFileReferenceItem,
  type WpsCaseFileThesisAction,
  type WpsDossierShellContent,
} from "@/data/sections/west-philippine-sea-dossier"

type WpsDossierProps = {
  content: NarrativeSectionContent
  shell: WpsDossierShellContent
}

type WpsDossierIcon = ComponentType<SVGProps<SVGSVGElement>>

const timelineIcons: Record<string, WpsDossierIcon> = {
  "arbitration-filing": FileText,
  "tribunal-constituted": Gavel,
  "final-award": Scale,
  "post-award": RefreshCw,
}

const evidenceIcons: Record<
  WpsCaseFileEvidenceCategory["tone"],
  WpsDossierIcon
> = {
  history: ScrollText,
  geography: MapIcon,
  legal: Landmark,
  conduct: FileSearch,
}

const thesisIcons: Record<WpsCaseFileThesisAction["iconKey"], WpsDossierIcon> =
  {
    shield: ShieldCheck,
    globe: Globe2,
    users: Users,
    book: BookOpen,
  }

const referenceIcons: Record<
  WpsCaseFileReferenceItem["iconKey"],
  WpsDossierIcon
> = {
  book: BookOpen,
  landmark: Landmark,
  file: FileText,
  compass: Compass,
  users: Users,
}

export function WpsDossier({ content }: WpsDossierProps) {
  const [selectedEventId, setSelectedEventId] = useState(
    wpsCaseFileTimelineEvents[0]?.id
  )
  const [selectedEvidenceId, setSelectedEvidenceId] = useState(
    wpsCaseFileEvidenceCategories[0]?.id
  )

  const headingId = `${content.id}-heading`
  const timelineHeadingId = `${content.id}-timeline-heading`
  const timelineDetailId = `${content.id}-timeline-detail`
  const evidenceHeadingId = `${content.id}-evidence-heading`
  const evidenceDetailId = `${content.id}-evidence-detail`
  const mapHeadingId = `${content.id}-map-heading`
  const comparisonHeadingId = `${content.id}-comparison-heading`
  const thesisHeadingId = `${content.id}-thesis-heading`
  const referencesHeadingId = `${content.id}-references-heading`
  const trustHeadingId = `${content.id}-trust-heading`

  const selectedEvent =
    wpsCaseFileTimelineEvents.find((event) => event.id === selectedEventId) ??
    wpsCaseFileTimelineEvents[0]
  const selectedEvidence =
    wpsCaseFileEvidenceCategories.find(
      (category) => category.id === selectedEvidenceId
    ) ?? wpsCaseFileEvidenceCategories[0]

  if (!selectedEvent || !selectedEvidence) {
    return null
  }

  return (
    <section
      id={content.id}
      aria-label={content.navigationLabel}
      data-editorial-surface="wps-dossier"
      className="mockup-chapter-stage wps-case-file editorial-section relative isolate min-h-svh overflow-hidden"
      tabIndex={-1}
    >
      <img
        className="wps-case-file__bg"
        src={wpsCaseFileBackground}
        alt=""
        aria-hidden="true"
        width="1536"
        height="1024"
        decoding="async"
        loading="lazy"
      />
      <div className="wps-case-file__vignette" aria-hidden="true" />

      <div className="editorial-container wps-case-file__container">
        <header className="wps-case-file__heading-block">
          <p className="wps-case-file__eyebrow">
            <span aria-hidden="true" />
            {content.eyebrow}
            <span aria-hidden="true" />
          </p>
          <h2 id={headingId} className="wps-case-file__title">
            {content.title}
          </h2>
          <p className="wps-case-file__subtitle">{content.thesis}</p>
        </header>

        <div className="wps-case-file__board">
          <aside
            className="wps-case-file__panel wps-case-file__timeline"
            aria-labelledby={timelineHeadingId}
          >
            <div className="wps-case-file__panel-heading">
              <Clock aria-hidden={true} />
              <h3 id={timelineHeadingId}>Timeline</h3>
            </div>

            <div
              data-wps-timeline-layout="chronology"
              className="wps-case-file__timeline-shell"
            >
              <div
                role="group"
                aria-label="Timeline event selector"
                data-wps-timeline-part="selector"
                className="wps-case-file__timeline-list"
              >
                {wpsCaseFileTimelineEvents.map((event) => {
                  const Icon = timelineIcons[event.id] ?? Gavel
                  const isSelected = event.id === selectedEvent.id
                  const eventButtonId = `${content.id}-timeline-${event.id}`

                  return (
                    <button
                      key={event.id}
                      id={eventButtonId}
                      type="button"
                      className="wps-case-file__timeline-item"
                      aria-pressed={isSelected}
                      aria-controls={timelineDetailId}
                      data-active={isSelected ? "true" : undefined}
                      onClick={() => setSelectedEventId(event.id)}
                    >
                      <span className="wps-case-file__timeline-marker">
                        <span aria-hidden="true" />
                      </span>
                      <span className="wps-case-file__timeline-copy">
                        <strong>{event.year}</strong>
                        <span>{event.label}</span>
                      </span>
                      <span className="wps-case-file__timeline-icon">
                        <Icon aria-hidden={true} />
                      </span>
                    </button>
                  )
                })}
              </div>

              <div
                id={timelineDetailId}
                role="region"
                aria-live="polite"
                aria-labelledby={`${content.id}-timeline-${selectedEvent.id}`}
                data-wps-timeline-part="details"
                className="wps-case-file__selected-detail"
              >
                <p>
                  <strong>{selectedEvent.summary}</strong>
                  <span>{selectedEvent.significance}</span>
                </p>
                <a
                  className="wps-case-file__panel-link"
                  href={`#${timelineDetailId}`}
                >
                  <span>View timeline details</span>
                  <ArrowRight aria-hidden={true} />
                </a>
              </div>
            </div>
          </aside>

          <section
            className="wps-case-file__panel wps-case-file__map"
            aria-labelledby={mapHeadingId}
          >
            <div className="wps-case-file__panel-heading wps-case-file__map-heading">
              <MapPinned aria-hidden={true} />
              <h3 id={mapHeadingId}>Maritime Case Map</h3>
            </div>
            <p className="sr-only">{wpsCaseFileMapSummary}</p>
            <img
              className="wps-case-file__map-art"
              src={wpsCaseFileMapBase}
              alt=""
              aria-hidden="true"
              width="1672"
              height="941"
              decoding="async"
              loading="lazy"
            />
            <div className="wps-case-file__map-frame" aria-hidden="true">
              <div className="wps-case-file__compass">
                <Compass aria-hidden={true} />
                <span>N</span>
              </div>
              <span className="wps-case-file__map-line" data-line="eez" />
              <span className="wps-case-file__map-line" data-line="claim" />
              <span className="wps-case-file__map-line" data-line="tribunal" />
              <span className="wps-case-file__map-line" data-line="baseline" />
              <span className="wps-case-file__island-chain" data-chain="one" />
              <span className="wps-case-file__island-chain" data-chain="two" />
              {wpsCaseFileMapLabels.map((mapLabel) => (
                <span
                  key={mapLabel.id}
                  className="wps-case-file__map-label"
                  data-position={mapLabel.position}
                >
                  {mapLabel.label}
                </span>
              ))}
            </div>
            <div className="wps-case-file__map-footer">
              <p>
                <strong>{selectedEvent.year}</strong>
                <span>{selectedEvent.summary}</span>
              </p>
              <ul aria-label="Map legend">
                {wpsCaseFileLegend.map((item) => (
                  <li key={item.label}>
                    <span data-tone={item.tone} aria-hidden="true" />
                    {item.label}
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <section
            className="wps-case-file__panel wps-case-file__evidence"
            aria-labelledby={evidenceHeadingId}
          >
            <div className="wps-case-file__panel-heading">
              <FolderOpen aria-hidden={true} />
              <h3 id={evidenceHeadingId}>Evidence</h3>
            </div>
            <div className="wps-case-file__evidence-grid">
              {wpsCaseFileEvidenceCategories.map((category) => {
                const Icon = evidenceIcons[category.tone]
                const isSelected = category.id === selectedEvidence.id

                return (
                  <button
                    key={category.id}
                    type="button"
                    className="wps-case-file__evidence-card"
                    data-tone={category.tone}
                    data-active={isSelected ? "true" : undefined}
                    aria-pressed={isSelected}
                    aria-controls={evidenceDetailId}
                    aria-label={`Inspect evidence for ${category.title}`}
                    onClick={() => setSelectedEvidenceId(category.id)}
                  >
                    <span
                      className="wps-case-file__evidence-texture"
                      aria-hidden="true"
                    >
                      <Icon aria-hidden={true} />
                    </span>
                    <strong>{category.title}</strong>
                    <span>{category.summary}</span>
                    <small>
                      {category.sourceTypeLabel}
                      <Layers aria-hidden={true} />
                    </small>
                  </button>
                )
              })}
            </div>
            <p
              id={evidenceDetailId}
              data-wps-evidence-surface=""
              className="wps-case-file__evidence-detail"
              aria-live="polite"
            >
              <strong>{selectedEvidence.sourceTypeLabel}</strong>
              <span>{selectedEvidence.summary}</span>
            </p>
            <a
              className="wps-case-file__panel-link wps-case-file__evidence-link"
              href={`#${referencesHeadingId}`}
            >
              <span>Explore all evidence</span>
              <ArrowRight aria-hidden={true} />
            </a>
          </section>

          <section
            className="wps-case-file__panel wps-case-file__comparison"
            aria-labelledby={comparisonHeadingId}
          >
            <div className="wps-case-file__panel-heading">
              <Scale aria-hidden={true} />
              <h3 id={comparisonHeadingId}>Ruling vs Reality</h3>
            </div>

            <div
              data-wps-comparison-layout="ruling-reality"
              className="wps-case-file__matrix"
            >
              <div className="wps-case-file__matrix-heading">
                <span>
                  <strong>Legal Clarity</strong>
                  <small>2016 Award</small>
                </span>
                <span>
                  <strong>Political Reality</strong>
                  <small>Today</small>
                </span>
              </div>
              <div className="wps-case-file__matrix-body">
                <span className="wps-case-file__vs" aria-hidden="true">
                  vs
                </span>
                {wpsCaseFileRulingRealityRows.map((row) => (
                  <div key={row.id} className="wps-case-file__matrix-row">
                    <p>
                      <CheckCircle2 aria-hidden={true} />
                      <span>{row.legalClarity}</span>
                    </p>
                    <p>
                      <TriangleAlert aria-hidden={true} />
                      <span>{row.politicalReality}</span>
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <p className="wps-case-file__award-note">
              <Globe2 aria-hidden={true} />
              <span>
                The Award is final and without appeal. Its full effect depends
                on political will and consistent, lawful action.
              </span>
            </p>
          </section>

          <section
            className="wps-case-file__panel wps-case-file__thesis"
            aria-labelledby={thesisHeadingId}
          >
            <div className="wps-case-file__thesis-heading">
              <Target aria-hidden={true} />
              <h3 id={thesisHeadingId}>Final Thesis</h3>
            </div>
            <p>{content.synthesis}</p>
            <div className="wps-case-file__thesis-actions">
              {wpsCaseFileThesisActions.map((action) => {
                const Icon = thesisIcons[action.iconKey]

                return (
                  <article key={action.id}>
                    <Icon aria-hidden={true} />
                    <span>
                      <strong>{action.label}</strong>
                      <small>{action.detail}</small>
                    </span>
                  </article>
                )
              })}
            </div>
          </section>

          <section
            className="wps-case-file__panel wps-case-file__references"
            aria-labelledby={referencesHeadingId}
          >
            <div className="wps-case-file__panel-heading">
              <FileText aria-hidden={true} />
              <h3 id={referencesHeadingId}>References & Sources</h3>
            </div>
            <div className="wps-case-file__reference-list">
              {wpsCaseFileReferences.map((reference) => {
                const Icon = referenceIcons[reference.iconKey]

                return (
                  <article
                    key={reference.id}
                    data-source-ids={reference.sourceIds.join(" ")}
                  >
                    <Icon aria-hidden={true} />
                    <span>
                      <strong>{reference.title}</strong>
                      <small>{reference.detail}</small>
                    </span>
                  </article>
                )
              })}
            </div>
          </section>

          <aside
            className="wps-case-file__panel wps-case-file__trust"
            aria-labelledby={trustHeadingId}
          >
            <div className="wps-case-file__panel-heading">
              <Shield aria-hidden={true} />
              <h3 id={trustHeadingId}>Source Trust Guide</h3>
            </div>
            <ul>
              {wpsCaseFileTrustCategories.map((category) => (
                <li key={category.id}>
                  <span data-tone={category.tone} aria-hidden="true" />
                  <strong>{category.label}</strong>
                  <small>{category.detail}</small>
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </div>
    </section>
  )
}
