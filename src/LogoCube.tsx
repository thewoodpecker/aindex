const FACES = ["front", "back", "right", "left", "top", "bottom"] as const;
const TOP_CELLS = ["A", "I", ""] as const;

// NDEX outlines from the navbar logo, in the logo's own coordinates.
const NDEX_PATH =
  "M6.93026 29.2101H6.98494V25.3292H8.28377V31.5001H7.15682L4.47127 27.6164H4.42635V31.5001H3.12166V25.3292H4.26717L6.93026 29.2101ZM14.4517 25.3292C15.0725 25.3292 15.6073 25.4523 16.0553 25.6994C16.5031 25.9444 16.8474 26.298 17.0885 26.758C17.3313 27.2178 17.4527 27.7679 17.4527 28.4083C17.4527 29.051 17.3314 29.6036 17.0885 30.0656C16.8474 30.5276 16.5004 30.8829 16.0484 31.13C15.5986 31.3769 15.0605 31.5001 14.4342 31.5001H12.2457V25.3292H14.4517ZM25.4635 26.4054H22.6099V27.8761H25.2496V28.9513H22.6099V30.425H25.4752V31.5001H21.3053V25.3292H25.4635V26.4054ZM31.8531 27.4328H31.9019L33.1519 25.3292H34.6256L32.7428 28.4152L34.6676 31.5001H33.1676L31.9019 29.3937H31.8531L30.5875 31.5001H29.0933L31.025 28.4152L29.1295 25.3292H30.609L31.8531 27.4328ZM13.5504 30.382H14.3795C14.7652 30.382 15.09 30.3145 15.3531 30.1779C15.6182 30.0393 15.8172 29.8245 15.9498 29.5353C16.0842 29.2441 16.151 28.8681 16.151 28.4083C16.1509 27.9528 16.0842 27.5803 15.9498 27.2912C15.8173 27.0021 15.619 26.7891 15.356 26.6525C15.0929 26.5159 14.7681 26.4474 14.3824 26.4474H13.5504V30.382Z";

export function LogoCube() {
  return (
    <div className="logo-cube-scene" aria-hidden="true">
      <div className="logo-cube-camera">
        <div className="logo-cube">
          {FACES.map((face) => (
            <div key={face} className={`logo-cube-face ${face}`}>
              {TOP_CELLS.map((letter, index) => (
                <span key={index} className="logo-cube-cell">
                  {letter}
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
