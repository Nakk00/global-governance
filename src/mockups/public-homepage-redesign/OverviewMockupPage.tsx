import { ArrowRight, ChevronDown, MessageCircle, Mouse } from "lucide-react"

import {
  overviewLegendItems,
  overviewLensControls,
  overviewMockupChapters,
  overviewMockupCopy,
  overviewMockupUtilities,
  overviewRelationships,
  overviewSystemNodes,
} from "./overviewMockupData"
import "./overview-mockup.css"

const activeChapterId = "global-governance-overview"

export function OverviewMockupPage() {
  const CenterIcon = overviewMockupCopy.centerIcon
  const NextIcon = overviewMockupCopy.nextIcon

  return (
    <main className="public-homepage-overview-mockup">
      <section
        className="overview-mockup-stage"
        aria-labelledby="overview-mockup-heading"
      >
        <div className="overview-mockup-bg" aria-hidden="true" />

        <header className="overview-mockup-navbar">
          <a className="overview-mockup-brand" href="#hero-narrative-frame">
            <span className="overview-mockup-brand-mark" aria-hidden="true" />
            <span>
              <span className="overview-mockup-brand-title">
                Global Governance
              </span>
              <span className="overview-mockup-brand-subtitle">
                Understand. Connect. Act.
              </span>
            </span>
          </a>

          <nav
            className="overview-mockup-chapters"
            aria-label="Overview mockup chapters"
          >
            {overviewMockupChapters.map((chapter) => {
              const isActive = chapter.id === activeChapterId

              return (
                <a
                  key={chapter.id}
                  href={`#${chapter.id}`}
                  className="overview-mockup-chapter-link"
                  aria-current={isActive ? "location" : undefined}
                  data-active={isActive || undefined}
                >
                  <span className="overview-mockup-chapter-number">
                    {chapter.number}
                  </span>
                  <span className="overview-mockup-chapter-label">
                    {chapter.shortLabel}
                  </span>
                </a>
              )
            })}
          </nav>

          <div className="overview-mockup-nav-actions">
            <div
              className="overview-mockup-progress"
              aria-label="Progress 02 of 06"
            >
              <span>Progress</span>
              <strong>02 / 06</strong>
              <i aria-hidden="true" />
            </div>
            {overviewMockupUtilities.map((utility) => {
              const Icon = utility.icon

              return (
                <button
                  key={utility.label}
                  className="overview-mockup-utility"
                  type="button"
                >
                  <Icon aria-hidden={true} />
                  <span>{utility.label}</span>
                </button>
              )
            })}
            <button className="overview-mockup-chat-button" type="button">
              <MessageCircle aria-hidden="true" />
              <span>Chat</span>
            </button>
          </div>
        </header>

        <div className="overview-mockup-layout">
          <div className="overview-mockup-heading-block">
            <p className="overview-mockup-eyebrow">
              <span aria-hidden="true" />
              {overviewMockupCopy.eyebrow}
              <span aria-hidden="true" />
            </p>
            <h1 id="overview-mockup-heading" className="overview-mockup-title">
              {overviewMockupCopy.title}
            </h1>
            <span className="overview-mockup-title-divider" aria-hidden="true">
              <CenterIcon />
            </span>
            <p className="overview-mockup-support">
              {overviewMockupCopy.support}
            </p>
          </div>

          <aside className="overview-mockup-panel overview-mockup-left-panel">
            <p className="overview-mockup-kicker">
              {overviewMockupCopy.selectedKicker}
            </p>
            <h2>{overviewMockupCopy.selectedTitle}</h2>
            <p>{overviewMockupCopy.selectedBody}</p>
            <p>{overviewMockupCopy.selectedDetail}</p>
            <div className="overview-mockup-panel-rule" aria-hidden="true" />
            <p className="overview-mockup-mini-kicker">
              {overviewMockupCopy.relationshipKicker}
            </p>
            <div className="overview-mockup-relationship-list">
              {overviewRelationships.map((relationship) => {
                const Icon = relationship.icon

                return (
                  <button key={relationship.label} type="button">
                    <Icon aria-hidden={true} />
                    <span>{relationship.label}</span>
                    <ArrowRight aria-hidden="true" />
                  </button>
                )
              })}
            </div>
          </aside>

          <section
            className="overview-mockup-system"
            aria-label="Global governance system diagram"
          >
            <div className="overview-mockup-system-lines" aria-hidden="true">
              <span data-line="horizontal" />
              <span data-line="vertical" />
              <span data-line="diagonal-a" />
              <span data-line="diagonal-b" />
              <span data-line="ring-one" />
              <span data-line="ring-two" />
              <span data-line="ring-three" />
            </div>
            <div className="overview-mockup-system-hub">
              <CenterIcon aria-hidden={true} />
              <strong>{overviewMockupCopy.centerLabel}</strong>
            </div>
            {overviewSystemNodes.map((node) => {
              const Icon = node.icon

              return (
                <div
                  key={node.label}
                  className="overview-mockup-system-node"
                  data-position={node.position}
                >
                  <Icon aria-hidden={true} />
                  <span>{node.label}</span>
                </div>
              )
            })}
          </section>

          <aside className="overview-mockup-panel overview-mockup-right-panel">
            <p className="overview-mockup-kicker">
              {overviewMockupCopy.whyKicker}
            </p>
            <h2>{overviewMockupCopy.whyTitle}</h2>
            <p>{overviewMockupCopy.whyBody}</p>
            <p>{overviewMockupCopy.whyDetail}</p>
            <div className="overview-mockup-quote-card">
              <span aria-hidden="true">
                <img
                  src="/images/public-homepage/resource-pack/hero/governance-compass-mark-01.png"
                  alt=""
                />
              </span>
              <strong>{overviewMockupCopy.whyQuote}</strong>
            </div>
          </aside>

          <aside
            className="overview-mockup-legend"
            aria-label="System connections legend"
          >
            <p>System Connections Legend</p>
            <ul>
              {overviewLegendItems.map((item) => (
                <li key={item.label}>
                  <span data-tone={item.tone} aria-hidden="true" />
                  {item.label}
                </li>
              ))}
            </ul>
          </aside>

          <div className="overview-mockup-lenses">
            <p>
              <span aria-hidden="true" />
              {overviewMockupCopy.lensesKicker}
              <span aria-hidden="true" />
            </p>
            <div className="overview-mockup-lens-list">
              {overviewLensControls.map((lens) => {
                const Icon = lens.icon

                return (
                  <button
                    key={lens.label}
                    type="button"
                    aria-pressed={lens.active ? "true" : "false"}
                    data-active={lens.active || undefined}
                  >
                    {lens.asset ? (
                      <img src={lens.asset} alt="" aria-hidden="true" />
                    ) : (
                      <Icon aria-hidden={true} />
                    )}
                    <span>{lens.label}</span>
                  </button>
                )
              })}
            </div>
          </div>

          <a className="overview-mockup-next-card" href="#un-command-center">
            <img
              src="/images/public-homepage/resource-pack/overview/overview-un-command-mark-white-bg-01.png"
              alt=""
              aria-hidden="true"
            />
            <span>
              <small>{overviewMockupCopy.nextKicker}</small>
              <strong>{overviewMockupCopy.nextTitle}</strong>
              <em>{overviewMockupCopy.nextBody}</em>
            </span>
            <NextIcon aria-hidden={true} />
          </a>

          <div className="overview-mockup-scroll-cue" aria-hidden="true">
            <span>
              <Mouse />
            </span>
            <p>{overviewMockupCopy.scrollCue}</p>
            <ChevronDown />
          </div>

          <button className="overview-mockup-chat-dock" type="button">
            <span className="overview-mockup-chat-icon">
              <MessageCircle aria-hidden="true" />
            </span>
            <span>
              <strong>{overviewMockupCopy.chatTitle}</strong>
              <small>{overviewMockupCopy.chatMeta}</small>
            </span>
            <span className="overview-mockup-chat-arrow">
              <ArrowRight aria-hidden="true" />
            </span>
          </button>
        </div>
      </section>
    </main>
  )
}

export default OverviewMockupPage
