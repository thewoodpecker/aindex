const FACES = ["front", "back", "right", "left", "top", "bottom"] as const;
const TOP_CELLS = ["A", "I", ""] as const;

export function LogoCube() {
  return (
    <div className="logo-cube-scene" aria-hidden="true">
      <div className="logo-cube">
        {FACES.map((face) => (
          <div key={face} className={`logo-cube-face ${face}`}>
            {TOP_CELLS.map((letter, index) => (
              <span key={index} className="logo-cube-cell">
                {letter}
              </span>
            ))}
            <span className="logo-cube-cell logo-cube-bar">NDEX</span>
          </div>
        ))}
      </div>
    </div>
  );
}
