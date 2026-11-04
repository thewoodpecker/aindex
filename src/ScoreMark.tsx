import { AnimatedPercent, STAGGER_MS } from "./AnimatedPercent";
import { MARK_SIZE, type ScoreState } from "./scores";

const CELL_LETTERS = ["A", "I", ""] as const;
const WHITE = "#ffffff";
const WORDMARK_SIZE = 11.314;
const WORDMARK_TRACKING = 3.1678;
const WORDMARK_PAD = 1.212;
const WORDMARK_LETTERS = ["N", "D", "E", "X"] as const;

function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

type ScoreMarkProps = {
  score: ScoreState;
  label?: string;
  size?: number;
  animate?: boolean;
  direction?: 1 | -1;
  phase?: "loading" | "ready";
  playId?: number;
};

export function ScoreMark({
  score,
  label,
  size = MARK_SIZE,
  animate = false,
  direction = 1,
  phase = "ready",
  playId = 0,
}: ScoreMarkProps) {
  const loading = phase === "loading";
  const scale = size / MARK_SIZE;
  const topHeight = 17.375 * scale;
  const gap = 1.616 * scale;
  const fontSize = 11.314 * scale;
  const textBox = 14 * scale;
  const text = label ?? score.label;
  const digitPad = 4 * scale;
  const barPadBottom = WORDMARK_PAD * scale;
  const reduced = prefersReducedMotion();
  const showWordmark = animate && (loading || !reduced);
  const leaving = showWordmark && !loading;

  return (
    <div
      className={animate ? `mark is-live${loading ? " is-loading" : ""}` : "mark"}
      style={{ width: size, height: size }}
      data-score={score.id}
      data-phase={phase}
      data-percent={text}
      aria-busy={loading}
    >
      <div className="mark-top" key={playId} style={{ height: topHeight, gap, paddingBottom: gap }}>
        {CELL_LETTERS.map((letter, index) => {
          const active = index === score.activeCell;
          return (
            <div
              className="cell"
              key={letter || "end"}
              style={loading ? undefined : { backgroundColor: active ? score.accent : WHITE }}
            >
              {letter ? (
                <span className="cell-letter" style={{ fontSize, lineHeight: `${textBox}px` }}>
                  {letter}
                </span>
              ) : null}
            </div>
          );
        })}
      </div>
      <div
        className="score-bar"
        style={{
          backgroundColor: loading ? WHITE : score.accent,
          alignItems: "flex-start",
          padding: `0 ${digitPad}px ${barPadBottom}px`,
          fontSize,
          lineHeight: "normal",
        }}
      >
        {loading ? <span className="sr-only">Loading score</span> : null}
        {!loading && animate ? <AnimatedPercent text={text} direction={direction} /> : null}
        {!loading && !animate ? <span className="percent percent-static">{text}</span> : null}
        {showWordmark ? (
          <span
            className={leaving ? "wordmark is-leaving" : "wordmark"}
            aria-hidden={leaving ? true : undefined}
            style={{
              fontSize: WORDMARK_SIZE * scale,
              lineHeight: "normal",
              letterSpacing: `${WORDMARK_TRACKING * scale}px`,
              ...(leaving ? { left: digitPad, bottom: barPadBottom } : {}),
            }}
          >
            {WORDMARK_LETTERS.map((letter, index) => (
              <span
                key={letter}
                className={
                  leaving
                    ? `wordmark-letter ${direction > 0 ? "digit-leave-up" : "digit-leave-down"}`
                    : "wordmark-letter"
                }
                style={leaving ? { animationDelay: `${index * STAGGER_MS}ms` } : undefined}
              >
                {letter}
              </span>
            ))}
          </span>
        ) : null}
      </div>
    </div>
  );
}
