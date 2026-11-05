import { useLayoutEffect, useRef } from "react";

const FACES = ["front", "back", "right", "left", "top", "bottom"] as const;
const TOP_CELLS = [
  { letter: "A", tone: "green" },
  { letter: "I", tone: "amber" },
  { letter: "", tone: "coral" },
] as const;

const SPIN_MS = 12000;
const AUTO_DEG_PER_MS = 360 / SPIN_MS;
const DRAG_DEG_PER_PX = 0.65;
const FLING_LIMIT = 1.4;
const FLING_EASE_MS = 600;
const REST_PITCH = -18;
const REST_ROLL = -22;

// NDEX outlines from the navbar logo, in the logo's own coordinates.
const NDEX_PATH =
  "M6.93026 29.2101H6.98494V25.3292H8.28377V31.5001H7.15682L4.47127 27.6164H4.42635V31.5001H3.12166V25.3292H4.26717L6.93026 29.2101ZM14.4517 25.3292C15.0725 25.3292 15.6073 25.4523 16.0553 25.6994C16.5031 25.9444 16.8474 26.298 17.0885 26.758C17.3313 27.2178 17.4527 27.7679 17.4527 28.4083C17.4527 29.051 17.3314 29.6036 17.0885 30.0656C16.8474 30.5276 16.5004 30.8829 16.0484 31.13C15.5986 31.3769 15.0605 31.5001 14.4342 31.5001H12.2457V25.3292H14.4517ZM25.4635 26.4054H22.6099V27.8761H25.2496V28.9513H22.6099V30.425H25.4752V31.5001H21.3053V25.3292H25.4635V26.4054ZM31.8531 27.4328H31.9019L33.1519 25.3292H34.6256L32.7428 28.4152L34.6676 31.5001H33.1676L31.9019 29.3937H31.8531L30.5875 31.5001H29.0933L31.025 28.4152L29.1295 25.3292H30.609L31.8531 27.4328ZM13.5504 30.382H14.3795C14.7652 30.382 15.09 30.3145 15.3531 30.1779C15.6182 30.0393 15.8172 29.8245 15.9498 29.5353C16.0842 29.2441 16.151 28.8681 16.151 28.4083C16.1509 27.9528 16.0842 27.5803 15.9498 27.2912C15.8173 27.0021 15.619 26.7891 15.356 26.6525C15.0929 26.5159 14.7681 26.4474 14.3824 26.4474H13.5504V30.382Z";

function cubeTransform(pitch: number, yaw: number): string {
  return `rotateX(${pitch}deg) rotateY(${yaw}deg) rotateZ(${REST_ROLL}deg)`;
}

function clamp(value: number, limit: number): number {
  return Math.max(-limit, Math.min(limit, value));
}

export function LogoCube() {
  const sceneRef = useRef<HTMLDivElement>(null);
  const cubeRef = useRef<HTMLDivElement>(null);
  const pitch = useRef(REST_PITCH);
  const yaw = useRef(0);
  const pitchVel = useRef(0);
  const yawVel = useRef(AUTO_DEG_PER_MS);
  const dragging = useRef(false);
  const reduced = useRef(false);
  const pointerId = useRef<number | null>(null);
  const lastX = useRef(0);
  const lastY = useRef(0);
  const lastMoveAt = useRef(0);

  useLayoutEffect(() => {
    const scene = sceneRef.current;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncReduced = () => {
      reduced.current = media.matches;
    };
    syncReduced();
    if (reduced.current) {
      yaw.current = -32;
    }
    media.addEventListener("change", syncReduced);

    const apply = () => {
      if (cubeRef.current) {
        cubeRef.current.style.transform = cubeTransform(pitch.current, yaw.current);
      }
    };

    const clock = { last: performance.now(), frame: 0 };
    const tick = (now: number) => {
      const dt = Math.min(now - clock.last, 48);
      clock.last = now;
      if (!dragging.current && !reduced.current) {
        yaw.current += yawVel.current * dt;
        pitch.current += pitchVel.current * dt;
        const blend = 1 - Math.exp(-dt / FLING_EASE_MS);
        yawVel.current += (AUTO_DEG_PER_MS - yawVel.current) * blend;
        pitchVel.current += (0 - pitchVel.current) * blend;
        pitch.current += (REST_PITCH - pitch.current) * blend;
      }
      apply();
      clock.frame = window.requestAnimationFrame(tick);
    };

    const finishDrag = (event: PointerEvent) => {
      if (!dragging.current || event.pointerId !== pointerId.current) {
        return;
      }
      if (reduced.current || performance.now() - lastMoveAt.current > 60) {
        yawVel.current = reduced.current ? AUTO_DEG_PER_MS : 0;
        pitchVel.current = 0;
      }
      yawVel.current = clamp(yawVel.current, FLING_LIMIT);
      pitchVel.current = clamp(pitchVel.current, FLING_LIMIT);
      dragging.current = false;
      pointerId.current = null;
      scene?.classList.remove("is-dragging");
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", finishDrag);
      window.removeEventListener("pointercancel", finishDrag);
    };

    const onPointerMove = (event: PointerEvent) => {
      if (!dragging.current || event.pointerId !== pointerId.current) {
        return;
      }
      const now = performance.now();
      const dx = event.clientX - lastX.current;
      const dy = event.clientY - lastY.current;
      const dt = now - lastMoveAt.current;
      lastX.current = event.clientX;
      lastY.current = event.clientY;
      lastMoveAt.current = now;
      const yawDelta = dx * DRAG_DEG_PER_PX;
      const pitchDelta = dy * DRAG_DEG_PER_PX;
      yaw.current += yawDelta;
      pitch.current += pitchDelta;
      if (dt > 0) {
        const yawSample = yawDelta / dt;
        const pitchSample = pitchDelta / dt;
        if (dt < 80) {
          yawVel.current = yawVel.current * 0.35 + yawSample * 0.65;
          pitchVel.current = pitchVel.current * 0.35 + pitchSample * 0.65;
        } else {
          yawVel.current = yawSample;
          pitchVel.current = pitchSample;
        }
      }
      apply();
    };

    const onPointerDown = (event: PointerEvent) => {
      if (dragging.current || (event.pointerType === "mouse" && event.button !== 0)) {
        return;
      }
      dragging.current = true;
      pointerId.current = event.pointerId;
      yawVel.current = 0;
      pitchVel.current = 0;
      lastX.current = event.clientX;
      lastY.current = event.clientY;
      lastMoveAt.current = performance.now();
      scene?.classList.add("is-dragging");
      scene?.setPointerCapture(event.pointerId);
      window.addEventListener("pointermove", onPointerMove);
      window.addEventListener("pointerup", finishDrag);
      window.addEventListener("pointercancel", finishDrag);
    };

    apply();
    clock.frame = window.requestAnimationFrame(tick);
    scene?.addEventListener("pointerdown", onPointerDown);
    return () => {
      media.removeEventListener("change", syncReduced);
      scene?.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", finishDrag);
      window.removeEventListener("pointercancel", finishDrag);
      window.cancelAnimationFrame(clock.frame);
    };
  }, []);

  return (
    <div ref={sceneRef} className="logo-cube-scene" aria-label="AIndex logo. Drag to turn.">
      <div className="logo-cube-camera">
        <div ref={cubeRef} className="logo-cube">
          {FACES.map((face) => (
            <div key={face} className={`logo-cube-face ${face}`}>
              {TOP_CELLS.map((cell) => (
                <span key={cell.tone} className={`logo-cube-cell is-${cell.tone}`}>
                  {cell.letter}
                </span>
              ))}
              <span className="logo-cube-cell logo-cube-bar">
                <svg className="logo-cube-ndex" viewBox="0 12.75 36.7503 22.5" preserveAspectRatio="none">
                  <path d={NDEX_PATH} fill="currentColor" />
                </svg>
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
