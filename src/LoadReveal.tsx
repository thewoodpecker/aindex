import { Fragment, type CSSProperties, type ReactNode } from "react";

const EASE_DELAY = (delay: number) => ({ animationDelay: `${delay}s` }) satisfies CSSProperties;

export function SoftBlurText({
  text,
  play,
  delay = 0.1,
  stagger = 0.025,
}: {
  text: string;
  play: boolean;
  delay?: number;
  stagger?: number;
}) {
  if (!play) {
    return <>{text}</>;
  }

  const words = text.split(" ");
  let charIndex = -1;

  return (
    <>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {words.map((word, wordIndex) => (
          <Fragment key={wordIndex}>
            <span className="soft-blur-word">
              {Array.from(word).map((char) => {
                charIndex += 1;
                const index = charIndex;
                return (
                  <span key={index} className="soft-blur-char" style={EASE_DELAY(delay + index * stagger)}>
                    {char}
                  </span>
                );
              })}
            </span>
            {wordIndex < words.length - 1 ? " " : null}
          </Fragment>
        ))}
      </span>
    </>
  );
}

export function LoadReveal({
  children,
  delay,
  className,
}: {
  children: ReactNode;
  delay: number;
  className?: string;
}) {
  return (
    <div className={className ? `load-reveal ${className}` : "load-reveal"} style={EASE_DELAY(delay)}>
      {children}
    </div>
  );
}
