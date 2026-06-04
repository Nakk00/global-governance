import { useMemo, useState } from "react"

import {
  wpsCaseFileBackground,
  wpsCaseFileChapters,
  wpsCaseFileCopy,
  wpsCaseFileEvidenceCategories,
  wpsCaseFileLayerIcon,
  wpsCaseFileLegend,
  wpsCaseFileMapBase,
  wpsCaseFileMapLabels,
  wpsCaseFileReferences,
  wpsCaseFileRulingRealityRows,
  wpsCaseFileThesisActions,
  wpsCaseFileTimeline,
  wpsCaseFileTrustCategories,
  wpsCaseFileUtilities,
} from "./westPhilippineSeaCaseFileMockupData"
import "./west-philippine-sea-case-file-mockup.css"

const timelineDetailId = "wps-case-file-selected-timeline-detail"
const evidenceDetailId = "wps-case-file-selected-evidence-detail"

export function WestPhilippineSeaCaseFileMockupPage() {
  const [selectedTimelineId, setSelectedTimelineId] = useState(
    wpsCaseFileTimeline[0]?.id
  )
  const [selectedEvidenceId, setSelectedEvidenceId] = useState(
    wpsCaseFileEvidenceCategories[0]?.id
  )

  const selectedTimeline = useMemo(
    () =>
      wpsCaseFileTimeline.find((item) => item.id === selectedTimelineId) ??
      wpsCaseFileTimeline[0],
    [selectedTimelineId]
  )
  const selectedEvidence = useMemo(
    () =>
      wpsCaseFileEvidenceCategories.find(
        (category) => category.id === selectedEvidenceId
      ) ?? wpsCaseFileEvidenceCategories[0],
    [selectedEvidenceId]
  )

  const HeadingIcon = wpsCaseFileCopy.headingIcon
  const TimelineIcon = wpsCaseFileCopy.timelineIcon
  const MapIcon = wpsCaseFileCopy.mapIcon
  const EvidenceIcon = wpsCaseFileCopy.evidenceIcon
  const ComparisonIcon = wpsCaseFileCopy.comparisonIcon
  const LegalIcon = wpsCaseFileCopy.legalIcon
  const RealityIcon = wpsCaseFileCopy.realityIcon
  const AwardIcon = wpsCaseFileCopy.awardIcon
  const FinalThesisIcon = wpsCaseFileCopy.finalThesisIcon
  const ReferencesIcon = wpsCaseFileCopy.referencesIcon
  const TrustIcon = wpsCaseFileCopy.trustIcon
  const ChatIcon = wpsCaseFileCopy.chatIcon
  const DetailIcon = wpsCaseFileCopy.detailIcon
  const LayerIcon = wpsCaseFileLayerIcon

  return (
    <main className="wps-case-file-mockup">
      <section
        className="wps-case-file-mockup-stage"
        aria-labelledby="wps-case-file-mockup-heading"
      >
        <img
          className="wps-case-file-mockup-bg"
          src={wpsCaseFileBackground}
          alt=""
          aria-hidden="true"
          width="1536"
          height="1024"
          decoding="async"
        />
        <div className="wps-case-file-mockup-vignette" aria-hidden="true" />

        <header className="wps-case-file-mockup-navbar">
          <a
            className="wps-case-file-mockup-brand"
            href="#hero-narrative-frame"
          >
            <img
              src={wpsCaseFileCopy.brandLogoAsset}
              alt=""
              aria-hidden="true"
            />
            <span>
              <span className="wps-case-file-mockup-brand-title">
                Global Governance
              </span>
              <span className="wps-case-file-mockup-brand-subtitle">
                Understand. Connect. Act.
              </span>
            </span>
          </a>

          <nav
            className="wps-case-file-mockup-chapters"
            aria-label="Chapter 4 mockup chapters"
          >
            {wpsCaseFileChapters.map((chapter) => {
              const isActive = chapter.id === wpsCaseFileCopy.activeChapterId

              return (
                <a
                  key={chapter.id}
                  href={`#${chapter.id}`}
                  className="wps-case-file-mockup-chapter-link"
                  data-active={isActive || undefined}
                  aria-current={isActive ? "location" : undefined}
                >
                  <span className="wps-case-file-mockup-chapter-number">
                    {chapter.number}
                  </span>
                  <span className="wps-case-file-mockup-chapter-label">
                    {chapter.shortLabel}
                  </span>
                </a>
              )
            })}
          </nav>

          <div className="wps-case-file-mockup-utilities">
            <div
              className="wps-case-file-mockup-progress"
              aria-label="Progress 04 of 04"
            >
              <span>Progress</span>
              <strong>04 / 04</strong>
            </div>
            {wpsCaseFileUtilities.map((utility) => {
              const Icon = utility.icon

              return (
                <button
                  key={utility.label}
                  className="wps-case-file-mockup-utility"
                  type="button"
                >
                  <Icon aria-hidden={true} />
                  <span>{utility.label}</span>
                </button>
              )
            })}
          </div>
        </header>

        <div className="wps-case-file-mockup-board">
          <header className="wps-case-file-mockup-heading-block">
            <p className="wps-case-file-mockup-eyebrow">
              <span aria-hidden="true" />
              {wpsCaseFileCopy.eyebrow}
              <span aria-hidden="true" />
            </p>
            <h1
              id="wps-case-file-mockup-heading"
              className="wps-case-file-mockup-title"
            >
              {wpsCaseFileCopy.title}
            </h1>
            <p className="wps-case-file-mockup-subtitle">
              {wpsCaseFileCopy.subtitle}
            </p>
          </header>

          <aside className="wps-case-file-mockup-panel wps-case-file-mockup-timeline">
            <div className="wps-case-file-mockup-panel-heading">
              <TimelineIcon aria-hidden={true} />
              <h2>{wpsCaseFileCopy.timelineTitle}</h2>
            </div>
            <div className="wps-case-file-mockup-timeline-list">
              {wpsCaseFileTimeline.map((item) => {
                const Icon = item.icon
                const isSelected = item.id === selectedTimelineId

                return (
                  <button
                    key={item.id}
                    type="button"
                    className="wps-case-file-mockup-timeline-item"
                    aria-pressed={isSelected}
                    aria-controls={timelineDetailId}
                    data-active={isSelected || undefined}
                    onClick={() => setSelectedTimelineId(item.id)}
                  >
                    <span className="wps-case-file-mockup-timeline-marker">
                      <span aria-hidden="true" />
                    </span>
                    <span className="wps-case-file-mockup-timeline-copy">
                      <strong>{item.year}</strong>
                      <span>{item.title}</span>
                    </span>
                    <span className="wps-case-file-mockup-timeline-icon">
                      <Icon aria-hidden={true} />
                    </span>
                  </button>
                )
              })}
            </div>
            <p
              id={timelineDetailId}
              className="wps-case-file-mockup-selected-detail"
              aria-live="polite"
            >
              <strong>{selectedTimeline?.summary}</strong>
              <span>{selectedTimeline?.detail}</span>
            </p>
            <button className="wps-case-file-mockup-panel-link" type="button">
              <span>{wpsCaseFileCopy.timelineCta}</span>
              <DetailIcon aria-hidden={true} />
            </button>
          </aside>

          <section
            className="wps-case-file-mockup-panel wps-case-file-mockup-map"
            aria-labelledby="wps-case-file-map-heading"
          >
            <div className="wps-case-file-mockup-panel-heading wps-case-file-mockup-map-heading">
              <MapIcon aria-hidden={true} />
              <h2 id="wps-case-file-map-heading">{wpsCaseFileCopy.mapTitle}</h2>
            </div>
            <p className="sr-only">{wpsCaseFileCopy.mapSummary}</p>
            <img
              className="wps-case-file-mockup-map-art"
              src={wpsCaseFileMapBase}
              alt=""
              aria-hidden="true"
              decoding="async"
              width="1672"
              height="941"
            />
            <div className="wps-case-file-mockup-map-frame" aria-hidden="true">
              <div className="wps-case-file-mockup-compass">
                <HeadingIcon aria-hidden={true} />
                <span>N</span>
              </div>
              <span className="wps-case-file-mockup-map-line" data-line="eez" />
              <span
                className="wps-case-file-mockup-map-line"
                data-line="claim"
              />
              <span
                className="wps-case-file-mockup-map-line"
                data-line="tribunal"
              />
              <span
                className="wps-case-file-mockup-map-line"
                data-line="baseline"
              />
              <span
                className="wps-case-file-mockup-island-chain"
                data-chain="one"
              />
              <span
                className="wps-case-file-mockup-island-chain"
                data-chain="two"
              />
              {wpsCaseFileMapLabels.map((mapLabel) => (
                <span
                  key={mapLabel.id}
                  className="wps-case-file-mockup-map-label"
                  data-position={mapLabel.position}
                >
                  {mapLabel.label}
                </span>
              ))}
            </div>
            <div className="wps-case-file-mockup-map-footer">
              <p>
                <strong>{selectedTimeline?.year}</strong>
                <span>{selectedTimeline?.summary}</span>
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
            className="wps-case-file-mockup-panel wps-case-file-mockup-evidence"
            aria-labelledby="wps-case-file-evidence-heading"
          >
            <div className="wps-case-file-mockup-panel-heading">
              <EvidenceIcon aria-hidden={true} />
              <h2 id="wps-case-file-evidence-heading">
                {wpsCaseFileCopy.evidenceTitle}
              </h2>
            </div>
            <div className="wps-case-file-mockup-evidence-grid">
              {wpsCaseFileEvidenceCategories.map((category) => {
                const Icon = category.icon
                const isSelected = category.id === selectedEvidenceId

                return (
                  <button
                    key={category.id}
                    type="button"
                    className="wps-case-file-mockup-evidence-card"
                    data-tone={category.tone}
                    data-active={isSelected || undefined}
                    aria-pressed={isSelected}
                    aria-controls={evidenceDetailId}
                    aria-label={`Inspect evidence for ${category.title}`}
                    onClick={() => setSelectedEvidenceId(category.id)}
                  >
                    <span
                      className="wps-case-file-mockup-evidence-texture"
                      aria-hidden="true"
                    >
                      <Icon aria-hidden={true} />
                    </span>
                    <strong>{category.title}</strong>
                    <span>{category.summary}</span>
                    <small>
                      {category.sourceTypeLabel}
                      <LayerIcon aria-hidden={true} />
                    </small>
                  </button>
                )
              })}
            </div>
            <p
              id={evidenceDetailId}
              className="wps-case-file-mockup-evidence-detail"
              aria-live="polite"
            >
              <strong>{selectedEvidence?.sourceTypeLabel}</strong>
              <span>{selectedEvidence?.summary}</span>
            </p>
            <button className="wps-case-file-mockup-panel-link" type="button">
              <span>{wpsCaseFileCopy.evidenceCta}</span>
              <DetailIcon aria-hidden={true} />
            </button>
          </section>

          <section className="wps-case-file-mockup-panel wps-case-file-mockup-comparison">
            <div className="wps-case-file-mockup-panel-heading">
              <ComparisonIcon aria-hidden={true} />
              <h2>{wpsCaseFileCopy.comparisonTitle}</h2>
            </div>
            <div className="wps-case-file-mockup-matrix">
              <div className="wps-case-file-mockup-matrix-heading">
                <span>
                  <strong>{wpsCaseFileCopy.legalHeading}</strong>
                  <small>{wpsCaseFileCopy.legalSubheading}</small>
                </span>
                <span>
                  <strong>{wpsCaseFileCopy.realityHeading}</strong>
                  <small>{wpsCaseFileCopy.realitySubheading}</small>
                </span>
              </div>
              <div className="wps-case-file-mockup-matrix-body">
                <span className="wps-case-file-mockup-vs" aria-hidden="true">
                  vs
                </span>
                {wpsCaseFileRulingRealityRows.map((row) => (
                  <div key={row.id} className="wps-case-file-mockup-matrix-row">
                    <p>
                      <LegalIcon aria-hidden={true} />
                      <span>{row.legalClarity}</span>
                    </p>
                    <p>
                      <RealityIcon aria-hidden={true} />
                      <span>{row.politicalReality}</span>
                    </p>
                  </div>
                ))}
              </div>
            </div>
            <p className="wps-case-file-mockup-award-note">
              <AwardIcon aria-hidden={true} />
              <span>{wpsCaseFileCopy.awardNote}</span>
            </p>
          </section>

          <section className="wps-case-file-mockup-panel wps-case-file-mockup-thesis">
            <div className="wps-case-file-mockup-thesis-heading">
              <FinalThesisIcon aria-hidden={true} />
              <h2>{wpsCaseFileCopy.finalThesisTitle}</h2>
            </div>
            <p>{wpsCaseFileCopy.finalThesisBody}</p>
            <div className="wps-case-file-mockup-thesis-actions">
              {wpsCaseFileThesisActions.map((action) => {
                const Icon = action.icon

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

          <section className="wps-case-file-mockup-panel wps-case-file-mockup-references">
            <div className="wps-case-file-mockup-panel-heading">
              <ReferencesIcon aria-hidden={true} />
              <h2>{wpsCaseFileCopy.referencesTitle}</h2>
            </div>
            <div className="wps-case-file-mockup-reference-list">
              {wpsCaseFileReferences.map((reference) => {
                const Icon = reference.icon

                return (
                  <article key={reference.id}>
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

          <aside className="wps-case-file-mockup-panel wps-case-file-mockup-trust">
            <div className="wps-case-file-mockup-panel-heading">
              <TrustIcon aria-hidden={true} />
              <h2>{wpsCaseFileCopy.trustTitle}</h2>
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

          <button className="wps-case-file-mockup-chat-dock" type="button">
            <span className="wps-case-file-mockup-chat-icon">
              <ChatIcon aria-hidden={true} />
            </span>
            <span>
              <strong>{wpsCaseFileCopy.chatTitle}</strong>
              <small>{wpsCaseFileCopy.chatMeta}</small>
            </span>
            <span className="wps-case-file-mockup-chat-arrow">
              <DetailIcon aria-hidden={true} />
            </span>
          </button>
        </div>
      </section>
    </main>
  )
}

export default WestPhilippineSeaCaseFileMockupPage
