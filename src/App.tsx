import { useEffect, useState } from "react";
import logoUrl from "./assets/logo.svg";
import searchUrl from "./assets/search.svg";
import { ScoreMark } from "./ScoreMark";
import { SCORE_PERCENTS, scoreById, stateForPercent, type ScorePercent } from "./scores";

const PILL_SCORE = scoreById("high");
const REVEAL_MS = 7140;

export default function App() {
  const [query, setQuery] = useState("");
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
    <>
      <div className="hero-slot">
        <div className="hero-scale">
          <div className="hero-frame">
            <header className="topbar">
              <nav className="nav" aria-label="Primary">
                <span>Network</span>
                <span>Method</span>
                <span>Developers</span>
              </nav>
              <div className="logo-slot">
                <div className="logo-rot">
                  <img src={logoUrl} alt="AIndex" />
                </div>
              </div>
              <div className="nav nav-balance" aria-hidden="true">
                <span>Network</span>
                <span>Method</span>
                <span>Developers</span>
              </div>
            </header>

            <div className="copy">
              <h1>AIndex: The App Directory for Agents</h1>
              <p className="lede">
                Apps get a free listing with AIndex® score{" "}
                <span className="pill">
                  <DiamondMark accent={PILL_SCORE.accent} />
                  <span>{PILL_SCORE.label}</span>
                </span>{" "}
                and real-time agent reviews.
                <br />
                Agents get a free directory of verified connections and tested skills.
              </p>
            </div>

            <form
              className="search"
              role="search"
              onSubmit={(event) => {
                event.preventDefault();
              }}
            >
              <label className="sr-only" htmlFor="search">
                Search AIndex
              </label>
              <input
                id="search"
                value={query}
                placeholder="Search AIndex..."
                onChange={(event) => setQuery(event.target.value)}
              />
              <button type="submit" aria-label="Search">
                <img src={searchUrl} alt="" />
              </button>
            </form>
          </div>
        </div>
      </div>

      <section className="studio" aria-label="Score">
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
        </div>
      </section>
    </>
  );
}

function DiamondMark({ accent }: { accent: string }) {
  return (
    <span className="diamond" aria-hidden="true">
      <span className="diamond-rot">
        <span className="diamond-cell" style={{ backgroundColor: accent }} />
        <span className="diamond-cell" />
        <span className="diamond-cell" />
        <span className="diamond-bar" />
      </span>
    </span>
  );
}
