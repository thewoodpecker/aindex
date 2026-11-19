import { useEffect, useState } from "react";
import { PRONG_SOCKETS } from "./prongSockets";

const HOLD_MS = 1400;

export function ProngMark() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (media.matches) {
      return;
    }
    const id = window.setInterval(() => {
      setIndex((current) => (current + 1) % PRONG_SOCKETS.length);
    }, HOLD_MS);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div className="hero-logo" role="img" aria-label="Animated Prong logo">
      <svg viewBox="0 0 104 104" aria-hidden="true">
        <rect width="104" height="104" rx="23.4" fill="#FF4F1F" />
        {PRONG_SOCKETS.map((socket, socketIndex) => (
          <path
            key={socket.name}
            d={socket.d}
            fill="#ffffff"
            opacity={socketIndex === index ? 1 : 0}
          />
        ))}
      </svg>
    </div>
  );
}
