import { ArrowRight, ChevronDown, Mouse } from "lucide-react"

import {
  constraintCards,
  institutionRooms,
  pressureNodes,
  systemPressureBackground,
  systemPressureCopy,
  systemPressureMockupChapters,
  systemPressureUtilities,
} from "./systemUnderPressureMockupData"
import "./system-under-pressure-mockup.css"

export function SystemUnderPressureMockupPage() {
  const FlowIcon = systemPressureCopy.flowIcon
  const RoomLinkIcon = systemPressureCopy.roomLinkIcon
  const TakeawayIcon = systemPressureCopy.takeawayIcon

  return (
    <main className="system-pressure-mockup">
      <section
        className="system-pressure-stage"
        aria-labelledby="system-pressure-heading"
      >
        <img
          className="system-pressure-bg"
          src={systemPressureBackground}
          alt=""
          aria-hidden="true"
        />
        <div className="system-pressure-vignette" aria-hidden="true" />

        <header className="system-pressure-navbar">
          <a className="system-pressure-brand" href="#hero-narrative-frame">
            <img src={systemPressureCopy.logoAsset} alt="" aria-hidden="true" />
            <span>
              <span className="system-pressure-brand-title">
                Global Governance
              </span>
              <span className="system-pressure-brand-subtitle">
                Understand. Connect. Act.
              </span>
            </span>
          </a>

          <nav
            className="system-pressure-chapters"
            aria-label="System pressure mockup chapters"
          >
            {systemPressureMockupChapters.map((chapter) => {
              const isActive = chapter.id === systemPressureCopy.activeChapterId

              return (
                <a
                  key={chapter.id}
                  href={`#${chapter.id}`}
                  className="system-pressure-chapter-link"
                  data-active={isActive || undefined}
                  aria-current={isActive ? "location" : undefined}
                >
                  <span className="system-pressure-chapter-number">
                    {chapter.number}
                  </span>
                  <span className="system-pressure-chapter-label">
                    {chapter.shortLabel}
                  </span>
                </a>
              )
            })}
          </nav>

          <div className="system-pressure-utilities">
            {systemPressureUtilities.map((utility) => {
              const Icon = utility.icon

              return (
                <button
                  key={utility.label}
                  className="system-pressure-utility"
                  type="button"
                >
                  <Icon aria-hidden={true} />
                  <span>{utility.label}</span>
                </button>
              )
            })}
          </div>
        </header>

        <div className="system-pressure-layout">
          <header className="system-pressure-heading-block">
            <p className="system-pressure-eyebrow">
              <span aria-hidden="true" />
              {systemPressureCopy.eyebrow}
              <span aria-hidden="true" />
            </p>
            <h1 id="system-pressure-heading" className="system-pressure-title">
              {systemPressureCopy.title}
            </h1>
            <p className="system-pressure-support">
              {systemPressureCopy.support}
            </p>
          </header>

          <aside className="system-pressure-panel system-pressure-rooms">
            <p className="system-pressure-kicker">
              {systemPressureCopy.institutionKicker}
            </p>
            <div className="system-pressure-room-list">
              {institutionRooms.map((room, index) => {
                const Icon = room.icon

                return (
                  <button
                    key={room.label}
                    type="button"
                    className="system-pressure-room"
                    data-active={index === 0 || undefined}
                  >
                    <span className="system-pressure-room-icon">
                      <Icon aria-hidden={true} />
                    </span>
                    <span>
                      <strong>{room.label}</strong>
                      <small>{room.body}</small>
                    </span>
                    <ArrowRight aria-hidden="true" />
                  </button>
                )
              })}
            </div>
            <button className="system-pressure-room-link" type="button">
              <RoomLinkIcon aria-hidden={true} />
              <span>{systemPressureCopy.roomLink}</span>
            </button>
          </aside>

          <section
            className="system-pressure-diagram"
            aria-label="Rules, institutions, state choices, and outcomes pressure diagram"
          >
            <div className="system-pressure-coordination" aria-hidden="true">
              <span>{systemPressureCopy.coordinationLabel}</span>
            </div>
            <div className="system-pressure-node-row">
              {pressureNodes.map((node, index) => {
                const Icon = node.icon

                return (
                  <article
                    key={node.label}
                    className="system-pressure-node"
                    data-tone={node.tone}
                  >
                    <span className="system-pressure-node-icon">
                      <Icon aria-hidden={true} />
                    </span>
                    <h2>{node.label}</h2>
                    <p>{node.body}</p>
                    {index < pressureNodes.length - 1 ? (
                      <FlowIcon
                        className="system-pressure-flow"
                        aria-hidden={true}
                      />
                    ) : null}
                  </article>
                )
              })}
            </div>
            <div className="system-pressure-pressure" aria-hidden="true">
              <span>{systemPressureCopy.pressureLabel}</span>
            </div>
            <aside className="system-pressure-takeaway">
              <span className="system-pressure-takeaway-icon">
                <TakeawayIcon aria-hidden={true} />
              </span>
              <span>
                <strong>{systemPressureCopy.takeawayTitle}</strong>
                <small>{systemPressureCopy.takeaway}</small>
              </span>
            </aside>
          </section>

          <aside className="system-pressure-panel system-pressure-constraints">
            <p className="system-pressure-kicker">
              {systemPressureCopy.constraintsKicker}
            </p>
            <div className="system-pressure-constraint-list">
              {constraintCards.map((constraint) => {
                const Icon = constraint.icon

                return (
                  <article
                    key={constraint.label}
                    className="system-pressure-constraint"
                  >
                    <Icon aria-hidden={true} />
                    <span>
                      <strong>{constraint.label}</strong>
                      <small>{constraint.body}</small>
                    </span>
                  </article>
                )
              })}
            </div>
            <strong className="system-pressure-closing">
              {systemPressureCopy.closing}
            </strong>
          </aside>

          <footer className="system-pressure-bottom-nav">
            {systemPressureMockupChapters.map((chapter) => {
              const isActive = chapter.id === systemPressureCopy.activeChapterId
              const Icon = chapter.icon

              return (
                <a
                  key={chapter.id}
                  href={`#${chapter.id}`}
                  className="system-pressure-bottom-chapter"
                  data-active={isActive || undefined}
                >
                  <span className="system-pressure-bottom-icon">
                    <Icon aria-hidden={true} />
                  </span>
                  <span>
                    <strong>
                      <small>{chapter.number.padStart(2, "0")}</small>{" "}
                      {chapter.label}
                    </strong>
                    <em>{chapter.summary}</em>
                  </span>
                </a>
              )
            })}
            <a
              className="system-pressure-next"
              href="#west-philippine-sea-dossier"
            >
              <span>
                <small>{systemPressureCopy.nextKicker}</small>
                <strong>{systemPressureCopy.nextTitle}</strong>
              </span>
              <ArrowRight aria-hidden="true" />
            </a>
          </footer>

          <div className="system-pressure-scroll-cue" aria-hidden="true">
            <Mouse />
            <span />
            <ChevronDown />
          </div>
        </div>
      </section>
    </main>
  )
}

export default SystemUnderPressureMockupPage
