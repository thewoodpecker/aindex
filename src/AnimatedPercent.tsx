import { useEffect, useState } from "react";

const DURATION_MS = 320;
export const STAGGER_MS = 40;

type AnimatedPercentProps = {
  text: string;
  direction: 1 | -1;
  /** When false, show the first value immediately. Later changes still animate. */
  enter?: boolean;
};

function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(prefersReducedMotion);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  return reduced;
}

const PLACES = ["hundreds", "tens", "ones", "sign"] as const;
type Place = (typeof PLACES)[number];
type PlaceMap = Record<Place, string | undefined>;

function placesOf(text: string): PlaceMap {
  const hasSign = text.endsWith("%");
  const digits = Array.from(hasSign ? text.slice(0, -1) : text);
  const sign = hasSign ? "%" : undefined;
  if (digits.length <= 1) {
    return { hundreds: undefined, tens: digits[0], ones: undefined, sign };
  }
  if (digits.length === 2) {
    return { hundreds: undefined, tens: digits[0], ones: digits[1], sign };
  }
  return {
    hundreds: digits[digits.length - 3],
    tens: digits[digits.length - 2],
    ones: digits[digits.length - 1],
    sign,
  };
}

function changedPlaces(from: PlaceMap, to: PlaceMap): Place[] {
  return PLACES.filter((place) => from[place] !== to[place]);
}

function animationMs(from: string, to: string): number {
  const changes = changedPlaces(placesOf(from), placesOf(to)).length;
  return DURATION_MS + Math.max(0, changes - 1) * STAGGER_MS;
}

export function AnimatedPercent({ text, direction, enter = true }: AnimatedPercentProps) {
  const reduced = usePrefersReducedMotion();
  const [shown, setShown] = useState(text);
  const [from, setFrom] = useState<string | null>(!enter || prefersReducedMotion() ? null : "");

  if (text !== shown) {
    setFrom(reduced ? null : shown);
    setShown(text);
  }

  if (reduced && from != null) {
    setFrom(null);
  }

  useEffect(() => {
    if (from == null || reduced) {
      return;
    }
    const timeout = window.setTimeout(() => setFrom(null), animationMs(from, shown));
    return () => window.clearTimeout(timeout);
  }, [from, shown, reduced]);

  const currentPlaces = placesOf(shown);
  const previousPlaces = placesOf(from ?? shown);
  const changes = from == null ? [] : changedPlaces(previousPlaces, currentPlaces);
  const enterClass = direction > 0 ? "digit-enter-up" : "digit-enter-down";
  const leaveClass = direction > 0 ? "digit-leave-up" : "digit-leave-down";

  function renderPlace(place: Place) {
    const character = currentPlaces[place];
    const outgoing = previousPlaces[place];
    const changed = changes.includes(place);
    const delayStyle = changed ? { animationDelay: `${changes.indexOf(place) * STAGGER_MS}ms` } : undefined;
    const collapsed = place !== "sign" && character == null;
    const className = [
      "digit-slot",
      place === "sign" ? "is-sign" : "",
      collapsed ? "is-collapsed" : "",
    ]
      .filter(Boolean)
      .join(" ");
    return (
      <span className={className} key={place}>
        {changed && outgoing != null ? (
          <span className={leaveClass} style={delayStyle}>
            {outgoing}
          </span>
        ) : null}
        {character != null ? (
          <span className={changed ? enterClass : undefined} style={delayStyle}>
            {character}
          </span>
        ) : null}
      </span>
    );
  }

  return (
    <span className="percent">
      <span className="sr-only">{shown}</span>
      <span className="percent-glyphs" aria-hidden="true">
        <span className="percent-digits">
          {renderPlace("hundreds")}
          {renderPlace("tens")}
          {renderPlace("ones")}
        </span>
        {renderPlace("sign")}
      </span>
    </span>
  );
}
