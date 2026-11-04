import { useEffect, useState } from "react";
import logoUrl from "./assets/logo.svg";
import searchUrl from "./assets/search.svg";
import { AnimatedPercent } from "./AnimatedPercent";
import { ScoreMark } from "./ScoreMark";
import { SCORE_PERCENTS, SCORE_STATES, stateForPercent, type ScorePercent, type ScoreState } from "./scores";

const PILL_INTERVAL_MS = 3000;
const REVEAL_MS = 7140;

type View = "home" | "score";

export default function App() {
  const [view, setView] = useState<View>("home");
  const pill = useCyclingPill();

  return view === "score" ? (
    <ScoreScreen onHome={() => setView("home")} onScore={() => setView("score")} />
  ) : (
    <HomeScreen pill={pill} onHome={() => setView("home")} onScore={() => setView("score")} />
  );
}

function useCyclingPill(): { score: ScoreState; direction: 1 | -1 } {
  const [pill, setPill] = useState<{ index: number; direction: 1 | -1 }>({
    index: 0,
    direction: -1,
  });

  useEffect(() => {
    const interval = window.setInterval(() => {
      setPill((current) => {
        const index = (current.index + 1) % SCORE_STATES.length;
        const direction = SCORE_STATES[index].value > SCORE_STATES[current.index].value ? 1 : -1;
        return { index, direction };
      });
    }, PILL_INTERVAL_MS);
    return () => window.clearInterval(interval);
  }, []);

  return { score: SCORE_STATES[pill.index], direction: pill.direction };
}

function HomeScreen({
  pill,
  onHome,
  onScore,
}: {
  pill: { score: ScoreState; direction: 1 | -1 };
  onHome: () => void;
  onScore: () => void;
}) {
  const [query, setQuery] = useState("");

  return (
    <div className="hero-slot">
      <div className="hero-scale">
        <div className="hero-frame">
          <Topbar view="home" onHome={onHome} onScore={onScore} />

          <div className="copy">
            <h1>AIndex: The App Directory for Agents</h1>
            <p className="lede">
              Apps get a free listing with AIndex® score{" "}
              <span className="pill" style={{ color: pill.score.accent }}>
                <DiamondMark accent={pill.score.accent} activeCell={pill.score.activeCell} />
                <AnimatedPercent text={pill.score.label} direction={pill.direction} enter={false} />
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
  );
}

function ScoreScreen({ onHome, onScore }: { onHome: () => void; onScore: () => void }) {
  return (
    <div className="score-screen">
      <Topbar view="score" onHome={onHome} onScore={onScore} />
      <section className="studio" aria-label="Score">
        <h1 className="sr-only">Score</h1>
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
    </div>
  );
}

function Topbar({ view, onHome, onScore }: { view: View; onHome: () => void; onScore: () => void }) {
  const onScoreView = view === "score";

  return (
    <header className="topbar">
      <nav className="nav" aria-label="Primary">
        <span>Network</span>
        <span>Method</span>
        <span>Developers</span>
        <button
          type="button"
          className={onScoreView ? "nav-link is-current" : "nav-link"}
          aria-current={onScoreView ? "page" : undefined}
          onClick={onScore}
        >
          Score
        </button>
      </nav>
      <button type="button" className="logo-slot" onClick={onHome} aria-label="AIndex home">
        <span className="logo-rot">
          <img src={logoUrl} alt="" />
        </span>
      </button>
      <div className="nav nav-balance" aria-hidden="true">
        <span>Network</span>
        <span>Method</span>
        <span>Developers</span>
        <span>Score</span>
      </div>
    </header>
  );
}

function DiamondMark({ accent, activeCell }: { accent: string; activeCell: number }) {
  return (
    <span className="diamond" aria-hidden="true">
      <span className="diamond-rot">
        {[0, 1, 2].map((cell) => (
          <span
            key={cell}
            className="diamond-cell"
            style={{ backgroundColor: cell === activeCell ? accent : "#ffffff" }}
          />
        ))}
        <span className="diamond-bar" />
      </span>
    </span>
  );
}
