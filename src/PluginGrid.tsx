import type { ReactNode } from "react";
import { LoadReveal } from "./LoadReveal";
import { PLUGIN_SECTIONS } from "./plugins";

const SECTIONS = PLUGIN_SECTIONS;

export function PluginGrid({
  query,
  intro = false,
  onOpen,
}: {
  query: string;
  intro?: boolean;
  onOpen: (name: string) => void;
}) {
  const needle = query.trim().toLowerCase();
  const sections = SECTIONS.map((section) => ({
    ...section,
    plugins: section.plugins.filter((plugin) => {
      if (!needle) {
        return true;
      }
      return `${plugin.name} ${plugin.description}`.toLowerCase().includes(needle);
    }),
  })).filter((section) => section.plugins.length > 0);

  if (sections.length === 0) {
    return (
      <section className="plugin-board" aria-label="Plugins">
        <p className="plugin-empty">No plugins match “{query.trim()}”.</p>
      </section>
    );
  }

  let revealIndex = 0;

  return (
    <div className="plugin-board">
      {sections.map((section) => {
        const headingIndex = revealIndex;
        revealIndex += 1;
        return (
          <section key={section.title} className="plugin-section" aria-label={section.title}>
            <Reveal intro={intro} delay={0.6 + headingIndex * 0.07} className="plugin-section-head">
              <h2>{section.title}</h2>
              {section.lede ? <p>{section.lede}</p> : null}
            </Reveal>
            <div className="plugin-grid">
              {section.plugins.map((plugin) => {
                const cardIndex = revealIndex;
                revealIndex += 1;
                return (
                  <Reveal key={plugin.name} intro={intro} delay={0.6 + cardIndex * 0.07} className="plugin-card-slot">
                    <article className="plugin-card">
                      <button type="button" className="plugin-hit" aria-label={`Open ${plugin.name}`} onClick={() => onOpen(plugin.name)} />
                      <div className="plugin-mark">
                        <img src={plugin.logo} alt="" />
                      </div>
                      <div className="plugin-copy">
                        <h3>{plugin.name}</h3>
                        <p>{plugin.description}</p>
                        {plugin.popular ? <span className="plugin-popular">Popular</span> : null}
                      </div>
                      <span className="plugin-add" aria-hidden="true">
                        +
                      </span>
                    </article>
                  </Reveal>
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}

function Reveal({
  intro,
  delay,
  className,
  children,
}: {
  intro: boolean;
  delay: number;
  className?: string;
  children: ReactNode;
}) {
  if (!intro) {
    return <div className={className}>{children}</div>;
  }
  return (
    <LoadReveal delay={delay} className={className}>
      {children}
    </LoadReveal>
  );
}
