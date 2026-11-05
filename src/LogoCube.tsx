const FACES = ["front", "back", "right", "left", "top", "bottom"] as const;

// The flat logo is three squares (A, I, and a blank) over the NDEX block.
// Reading order fills a 3×3 of those squares, like one face of a cube.
const CELLS = ["A", "I", "", "N", "D", "E", "X", "", ""] as const;

export function LogoCube() {
  return (
    <div className="logo-cube-scene" aria-hidden="true">
      <div className="logo-cube">
        {FACES.map((face) => (
          <div key={face} className={`logo-cube-face ${face}`}>
            {CELLS.map((letter, index) => (
              <span key={index} className="logo-cube-cell">
                {letter}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
