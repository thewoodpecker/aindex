import { useLayoutEffect, useRef } from "react";

const FACES = ["front", "back", "right", "left", "top", "bottom"] as const;

// Prong glyph from prong-cube-morph (geo.json "P"), centered in the 104 face.
const PRONG_PATH =
  "M19 14H85V61.12H41V90H19V14ZM41 29H63V46.12H41V29Z";

const SPIN_MS = 12000;
const AUTO_DEG_PER_MS = 360 / SPIN_MS;
const DRAG_DEG_PER_PX = 0.65;
const FLING_LIMIT = 1.4;
const FLING_EASE_MS = 600;
const REST_PITCH = -18;
const REST_ROLL = -22;

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
    <div ref={sceneRef} className="logo-cube-scene" aria-label="Prong logo. Drag to turn.">
      <div className="logo-cube-camera">
        <div ref={cubeRef} className="logo-cube">
          {FACES.map((face) => (
            <div key={face} className={`logo-cube-face ${face}`}>
              <svg className="logo-cube-mark" viewBox="0 0 104 104" aria-hidden="true">
                <path d={PRONG_PATH} fill="#ffffff" fillRule="evenodd" />
              </svg>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
