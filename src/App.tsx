import { useEffect, useState } from "react";
import { CubeMorph } from "./CubeMorph";
import { LogoCube } from "./LogoCube";
import { PluginGrid } from "./PluginGrid";
import { ScoreMark } from "./ScoreMark";
import { SCORE_PERCENTS, stateForPercent, type ScorePercent } from "./scores";

const REVEAL_MS = 7140;

type View = "home" | "score";

export default function App() {
  const [view, setView] = useState<View>("home");

  return view === "score" ? (
    <ScoreScreen onHome={() => setView("home")} onScore={() => setView("score")} />
  ) : (
    <HomeScreen onHome={() => setView("home")} onScore={() => setView("score")} />
  );
}

function HomeScreen({ onHome, onScore }: { onHome: () => void; onScore: () => void }) {
  const [query, setQuery] = useState("");

  return (
    <div className="hero-slot">
      <Topbar view="home" onHome={onHome} onScore={onScore} />
      <div className="hero-scale">
        <div className="hero-frame">
          <div className="copy">
            <h1>Prong: The Universal Plugin Directory</h1>
            <p className="lede">
              Every plugin gets a free listing of its interfaces, skills, and checks.
              <br />
              Claim it for free, or pay for managed submission to every major directory.
            </p>
          </div>

          <form
            className="search"
            role="search"
            onClick={(event) => {
              if (event.target instanceof Element && event.target.closest("button")) {
                return;
              }
              event.currentTarget.querySelector("input")?.focus();
            }}
            onSubmit={(event) => {
              event.preventDefault();
            }}
          >
            <label className="sr-only" htmlFor="search">
              Search plugins
            </label>
            <input
              id="search"
              value={query}
              placeholder="Search plugins..."
              onChange={(event) => setQuery(event.target.value)}
            />
            <button type="submit" aria-label="Search" className={query.trim() ? "is-ready" : undefined}>
              <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
                <path
                  fill="currentColor"
                  d="M6.5 1.5C9.26142 1.5 11.5 3.73858 11.5 6.5C11.5 7.51906 11.1944 8.46641 10.6709 9.25684L14.207 12.793C14.5976 13.1835 14.5976 13.8165 14.207 14.207C13.8165 14.5976 13.1835 14.5976 12.793 14.207L9.25684 10.6709C8.46641 11.1944 7.51906 11.5 6.5 11.5C3.73858 11.5 1.5 9.26142 1.5 6.5C1.5 3.73858 3.73858 1.5 6.5 1.5ZM6.5 3.5C4.84315 3.5 3.5 4.84315 3.5 6.5C3.5 8.15685 4.84315 9.5 6.5 9.5C8.15685 9.5 9.5 8.15685 9.5 6.5C9.5 4.84315 8.15685 3.5 6.5 3.5Z"
                />
              </svg>
            </button>
          </form>
          <PluginGrid query={query} />
        </div>
      </div>
      <SiteFooter />
    </div>
  );
}

function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-brand">
        <CubeMorph className="footer-cube" />
        <div>
          <p className="footer-name">Prong</p>
          <p className="footer-detail">The universal plugin directory. Free listings, with managed submission to every major directory.</p>
        </div>
      </div>
      <div className="footer-end">
        <p className="footer-copy">© 2026 Prong</p>
        <ul className="footer-social">
          <li>
            <a href="https://x.com" aria-label="Prong on X">
              X
            </a>
          </li>
          <li>
            <a href="https://github.com" aria-label="Prong on GitHub">
              GitHub
            </a>
          </li>
          <li>
            <a href="https://www.linkedin.com" aria-label="Prong on LinkedIn">
              LinkedIn
            </a>
          </li>
        </ul>
      </div>
    </footer>
  );
}

function ScoreScreen({ onHome, onScore }: { onHome: () => void; onScore: () => void }) {
  return (
    <div className="score-screen">
      <Topbar view="score" onHome={onHome} onScore={onScore} />
      <section className="studio" aria-label="Directory">
        <h1 className="sr-only">Directory</h1>
        <ScoreStudio />
      </section>
    </div>
  );
}

function ScoreStudio() {
  const [percent, setPercent] = useState<ScorePercent>(85);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [phase, setPhase] = useState<"loading" | "ready">("loading");
  const [reveal, setReveal] = useState(0);
  const visual = stateForPercent(percent);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const timeout = window.setTimeout(() => setPhase("ready"), reduced ? 0 : REVEAL_MS);
    return () => window.clearTimeout(timeout);
  }, [reveal]);

  function chooseScore(next: ScorePercent) {
    if (next === percent) {
      return;
    }
    setDirection(next > percent ? 1 : -1);
    setPercent(next);
  }

  function replay() {
    setPhase("loading");
    setReveal((value) => value + 1);
  }

  return (
    <div className="studio-col">
      <ScoreMark
        score={visual}
        label={`${percent}%`}
        size={48.083 * 3}
        animate
        direction={direction}
        phase={phase}
        playId={reveal}
      />
      <div className="score-actions">
        <div className="score-controls" role="group" aria-label="Choose a score">
          {SCORE_PERCENTS.map((value) => {
            const pressed = value === percent;
            return (
              <button
                key={value}
                type="button"
                aria-pressed={pressed}
                className={pressed ? "score-choice is-selected" : "score-choice"}
                style={pressed ? { color: stateForPercent(value).accent } : undefined}
                onClick={() => chooseScore(value)}
              >
                {value}%
              </button>
            );
          })}
        </div>
        <button type="button" className="score-replay" onClick={replay}>
          Replay
        </button>
      </div>
      <LogoCube />
    </div>
  );
}

function Topbar({ view, onHome, onScore }: { view: View; onHome: () => void; onScore: () => void }) {
  const onScoreView = view === "score";

  return (
    <header className="topbar">
      <nav className="nav" aria-label="Primary">
        <span>Plugins</span>
        <span>Agents</span>
        <span>Pricing</span>
        <button
          type="button"
          className={onScoreView ? "nav-link is-current" : "nav-link"}
          aria-current={onScoreView ? "page" : undefined}
          onClick={onScore}
        >
          Directory
        </button>
      </nav>
      <button type="button" className="logo-slot" onClick={onHome} aria-label="Prong home">
        <CubeMorph playEvery={10} />
      </button>
      <div className="nav nav-balance" aria-hidden="true">
        <span>Plugins</span>
        <span>Agents</span>
        <span>Pricing</span>
        <span>Directory</span>
      </div>
    </header>
  );
}

