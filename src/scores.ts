export const SCORE_STATES = [
  { id: "high", label: "85%", value: 85, accent: "#46d08f", activeCell: 0 },
  { id: "mid", label: "50%", value: 50, accent: "#ffc107", activeCell: 1 },
  { id: "low", label: "12%", value: 12, accent: "#ef5350", activeCell: 2 },
] as const;

export type ScoreState = (typeof SCORE_STATES)[number];
export type ScoreId = ScoreState["id"];

export const SCORE_PERCENTS = [0, 12, 25, 40, 50, 65, 75, 85, 100] as const;
export type ScorePercent = (typeof SCORE_PERCENTS)[number];

export const MARK_SIZE = 48.083;

export function scoreById(id: ScoreId): ScoreState {
  const score = SCORE_STATES.find((state) => state.id === id);
  if (!score) {
    return SCORE_STATES[0];
  }
  return score;
}

// Each percentage uses the nearest of the three logo states. There is no fourth state.
export function stateForPercent(percent: number): ScoreState {
  return SCORE_STATES.reduce((nearest, state) =>
    Math.abs(state.value - percent) < Math.abs(nearest.value - percent) ? state : nearest,
  );
}
