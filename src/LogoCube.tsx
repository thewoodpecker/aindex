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

// NDEX outlines from the navbar logo, in the logo's own coordinates.
const NDEX_PATH =
  "M6.93026 29.2101H6.98494V25.3292H8.28377V31.5001H7.15682L4.47127 27.6164H4.42635V31.5001H3.12166V25.3292H4.26717L6.93026 29.2101ZM14.4517 25.3292C15.0725 25.3292 15.6073 25.4523 16.0553 25.6994C16.5031 25.9444 16.8474 26.298 17.0885 26.758C17.3313 27.2178 17.4527 27.7679 17.4527 28.4083C17.4527 29.051 17.3314 29.6036 17.0885 30.0656C16.8474 30.5276 16.5004 30.8829 16.0484 31.13C15.5986 31.3769 15.0605 31.5001 14.4342 31.5001H12.2457V25.3292H14.4517ZM25.4635 26.4054H22.6099V27.8761H25.2496V28.9513H22.6099V30.425H25.4752V31.5001H21.3053V25.3292H25.4635V26.4054ZM31.8531 27.4328H31.9019L33.1519 25.3292H34.6256L32.7428 28.4152L34.6676 31.5001H33.1676L31.9019 29.3937H31.8531L30.5875 31.5001H29.0933L31.025 28.4152L29.1295 25.3292H30.609L31.8531 27.4328ZM13.5504 30.382H14.3795C14.7652 30.382 15.09 30.3145 15.3531 30.1779C15.6182 30.0393 15.8172 29.8245 15.9498 29.5353C16.0842 29.2441 16.151 28.8681 16.151 28.4083C16.1509 27.9528 16.0842 27.5803 15.9498 27.2912C15.8173 27.0021 15.619 26.7891 15.356 26.6525C15.0929 26.5159 14.7681 26.4474 14.3824 26.4474H13.5504V30.382Z";

function cubeTransform(yaw: number): string {
  return `rotateX(-18deg) rotateY(${yaw}deg) rotateZ(-22deg)`;
}

export function LogoCube() {
  const sceneRef = useRef<HTMLDivElement>(null);
  const cubeRef = useRef<HTMLDivElement>(null);
  const yaw = useRef(0);
  const velocity = useRef(AUTO_DEG_PER_MS);
  const dragging = useRef(false);
  const reduced = useRef(false);
  const lastX = useRef(0);
  const lastMoveAt = useRef(0);

  useLayoutEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncReduced = () => {
      reduced.current = media.matches;
    };
    syncReduced();
    if (reduced.current) {
      yaw.current = -32;
    }
    media.addEventListener("change", syncReduced);

    const clock = { last: performance.now(), frame: 0 };
    const tick = (now: number) => {
      const dt = Math.min(now - clock.last, 48);
      clock.last = now;
      if (!dragging.current && !reduced.current) {
        yaw.current += velocity.current * dt;
        const blend = 1 - Math.exp(-dt / FLING_EASE_MS);
        velocity.current += (AUTO_DEG_PER_MS - velocity.current) * blend;
      }
      if (cubeRef.current) {
        cubeRef.current.style.transform = cubeTransform(yaw.current);
      }
      clock.frame = window.requestAnimationFrame(tick);
    };
    if (cubeRef.current) {
      cubeRef.current.style.transform = cubeTransform(yaw.current);
    }
    clock.frame = window.requestAnimationFrame(tick);
    return () => {
      media.removeEventListener("change", syncReduced);
      window.cancelAnimationFrame(clock.frame);
    };
  }, []);

  function onPointerDown(event: React.PointerEvent<HTMLDivElement>) {
    if (dragging.current) {
      return;
    }
    dragging.current = true;
    velocity.current = 0;
    lastX.current = event.clientX;
    lastMoveAt.current = performance.now();
    event.currentTarget.classList.add("is-dragging");
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function onPointerMove(event: React.PointerEvent<HTMLDivElement>) {
    if (!dragging.current) {
      return;
    }
    const now = performance.now();
    const dx = event.clientX - lastX.current;
    const dt = now - lastMoveAt.current;
    lastX.current = event.clientX;
    lastMoveAt.current = now;
    const delta = dx * DRAG_DEG_PER_PX;
    yaw.current += delta;
    if (dt > 0) {
      const sample = delta / dt;
      velocity.current = dt < 80 ? velocity.current * 0.35 + sample * 0.65 : sample;
    }
  }

  function endDrag(event: React.PointerEvent<HTMLDivElement>) {
    if (!dragging.current) {
      return;
    }
    if (performance.now() - lastMoveAt.current > 60) {
      velocity.current = 0;
    }
    velocity.current = Math.max(-FLING_LIMIT, Math.min(FLING_LIMIT, velocity.current));
    dragging.current = false;
    event.currentTarget.classList.remove("is-dragging");
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  }

  return (
    <div
      ref={sceneRef}
      className="logo-cube-scene"
      aria-label="AIndex logo. Drag to spin."
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
    >
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
