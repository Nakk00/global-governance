import {
  ArrowRight,
  ChevronDown,
  Landmark,
  MessageCircle,
  Mouse,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  heroMockupChapters,
  heroMockupCopy,
  heroMockupPillars,
  heroMockupSystemRows,
  heroMockupUtilities,
} from "./heroMockupData"
import "./hero-mockup.css"

const activeChapterId = "hero-narrative-frame"

export function HeroMockupPage() {
  return (
    <main className="public-homepage-hero-mockup">
      <section
        className="hero-mockup-stage"
        aria-labelledby="hero-mockup-heading"
      >
        <div className="hero-mockup-bg" aria-hidden="true" />
        <img
          className="hero-mockup-route-overlay"
          src="/images/public-homepage/resource-pack/hero/hero-route-overlay.svg"
          alt=""
          aria-hidden="true"
        />

        <header className="hero-mockup-navbar">
          <a className="hero-mockup-brand" href="#hero-narrative-frame">
            <span className="hero-mockup-brand-mark" aria-hidden="true" />
            <span>
              <span className="hero-mockup-brand-title">Global Governance</span>
              <span className="hero-mockup-brand-subtitle">
                Understand. Connect. Act.
              </span>
            </span>
          </a>

          <nav className="hero-mockup-chapters" aria-label="Hero mockup chapters">
            {heroMockupChapters.map((chapter) => {
              const isActive = chapter.id === activeChapterId

              return (
                <a
                  key={chapter.id}
                  href={`#${chapter.id}`}
                  className="hero-mockup-chapter-link"
                  aria-current={isActive ? "location" : undefined}
                  data-active={isActive || undefined}
                >
                  <span className="hero-mockup-chapter-number">
                    {chapter.number}
                  </span>
                  <span className="hero-mockup-chapter-label">
                    {chapter.shortLabel}
                  </span>
                </a>
              )
            })}
          </nav>

          <div className="hero-mockup-nav-actions">
            <div className="hero-mockup-progress" aria-label="Progress 01 of 06">
              <span>Progress</span>
              <strong>01 / 06</strong>
              <i aria-hidden="true" />
            </div>
            {heroMockupUtilities.map((utility) => {
              const Icon = utility.icon

              return (
                <button
                  key={utility.label}
                  className="hero-mockup-utility"
                  type="button"
                >
                  <Icon aria-hidden={true} />
                  <span>{utility.label}</span>
                </button>
              )
            })}
            <button className="hero-mockup-chat-button" type="button">
              <MessageCircle aria-hidden="true" />
              <span>Chat</span>
            </button>
          </div>
        </header>

        <div className="hero-mockup-layout">
          <aside className="hero-mockup-panel hero-mockup-system-panel">
            <p className="hero-mockup-kicker">The Global System</p>
            <p className="hero-mockup-system-intro">
              {heroMockupCopy.systemIntro}
            </p>
            <ul className="hero-mockup-system-list" aria-label="Global system layers">
              {heroMockupSystemRows.map((row) => {
                const Icon = row.icon

                return (
                  <li key={row.label}>
                    <Icon aria-hidden={true} />
                    <span>{row.label}</span>
                  </li>
                )
              })}
            </ul>
          </aside>

          <div className="hero-mockup-copy">
            <p className="hero-mockup-eyebrow">{heroMockupCopy.eyebrow}</p>
            <span className="hero-mockup-divider" aria-hidden="true" />
            <h1 id="hero-mockup-heading" className="hero-mockup-title">
              {heroMockupCopy.headlineBeforeHighlight}{" "}
              <span>{heroMockupCopy.headlineHighlight}</span>{" "}
              {heroMockupCopy.headlineAfterHighlight}
            </h1>
            <p className="hero-mockup-support">{heroMockupCopy.support}</p>
            <div className="hero-mockup-ctas">
              <Button asChild className="hero-mockup-primary-cta">
                <a href="#global-governance-overview">
                  {heroMockupCopy.primaryCta}
                  <ArrowRight aria-hidden="true" />
                </a>
              </Button>
              <Button asChild variant="outline" className="hero-mockup-secondary-cta">
                <a href="#chapter-route"> {heroMockupCopy.secondaryCta}</a>
              </Button>
            </div>
          </div>

          <aside className="hero-mockup-panel hero-mockup-pillars-panel">
            <p className="hero-mockup-kicker hero-mockup-kicker-centered">
              System Pillars
            </p>
            <div className="hero-mockup-orbit" aria-label="System pillars">
              <span className="hero-mockup-orbit-ring" aria-hidden="true" />
              <span className="hero-mockup-orbit-ring hero-mockup-orbit-ring-inner" aria-hidden="true" />
              <span className="hero-mockup-orbit-line hero-mockup-orbit-line-vertical" aria-hidden="true" />
              <span className="hero-mockup-orbit-line hero-mockup-orbit-line-horizontal" aria-hidden="true" />
              <span className="hero-mockup-orbit-center">
                <Landmark aria-hidden="true" />
              </span>
              {heroMockupPillars.map((pillar) => {
                const Icon = pillar.icon

                return (
                  <span
                    key={pillar.label}
                    className="hero-mockup-pillar-node"
                    data-position={pillar.position}
                  >
                    <Icon aria-hidden={true} />
                    <span>{pillar.label}</span>
                  </span>
                )
              })}
            </div>
            <div className="hero-mockup-pillar-quote">
              <span aria-hidden="true">“</span>
              <p>{heroMockupCopy.pillarQuote}</p>
              <strong>{heroMockupCopy.pillarEmphasis}</strong>
            </div>
          </aside>

          <aside className="hero-mockup-panel hero-mockup-focus-card">
            <p className="hero-mockup-mini-kicker">Current Focus</p>
            <h2>Hero Narrative Frame</h2>
            <p>{heroMockupCopy.currentFocus}</p>
            <span className="hero-mockup-focus-progress" aria-hidden="true" />
          </aside>

          <div className="hero-mockup-scroll-cue" aria-hidden="true">
            <span>
              <Mouse />
            </span>
            <p>Scroll to explore</p>
            <ChevronDown />
          </div>

          <button className="hero-mockup-chat-dock" type="button">
            <span className="hero-mockup-chat-icon">
              <MessageCircle aria-hidden="true" />
            </span>
            <span>
              <strong>{heroMockupCopy.chatTitle}</strong>
              <small>{heroMockupCopy.chatMeta}</small>
            </span>
            <span className="hero-mockup-chat-arrow">
              <ArrowRight aria-hidden="true" />
            </span>
          </button>
        </div>
      </section>
    </main>
  )
}

export default HeroMockupPage
