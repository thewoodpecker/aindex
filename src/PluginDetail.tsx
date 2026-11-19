import { useEffect, useMemo, useState } from "react";
import { CubeMorph } from "./CubeMorph";
import { findPlugin, hostLabel, type PluginListing } from "./plugins";

export function PluginDetail({ name, onBack }: { name: string; onBack: () => void }) {
  const plugin = findPlugin(name);
  const [toolQuery, setToolQuery] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [name]);

  return (
    <div className="detail-screen">
      <header className="topbar">
        <nav className="nav" aria-label="Primary">
          <span>Plugins</span>
          <span>Agents</span>
          <span>Pricing</span>
        </nav>
        <button type="button" className="logo-slot" aria-label="Prong home" onClick={onBack}>
          <CubeMorph playEvery={10} />
        </button>
        <div className="nav nav-balance" aria-hidden="true">
          <span>Plugins</span>
          <span>Agents</span>
          <span>Pricing</span>
        </div>
      </header>
      {plugin ? (
        <DetailBody plugin={plugin} toolQuery={toolQuery} onBack={onBack} onToolQuery={setToolQuery} />
      ) : (
        <main className="detail">
          <p className="detail-missing">That plugin is not in the directory.</p>
          <button type="button" className="detail-back" onClick={onBack}>
            Back to plugins
          </button>
        </main>
      )}
      <footer className="site-footer">
        <div className="footer-brand">
          <CubeMorph className="footer-cube" />
          <div>
            <p className="footer-name">Prong</p>
            <p className="footer-detail">The universal plugin directory. Free listings, with managed submission to every major directory.</p>
          </div>
        </div>
        <div className="footer-end">
          <p className="footer-copy">© 2026 Prong</p>
          <ul className="footer-social">
            <li>
              <a href="https://x.com" aria-label="Prong on X">
                X
              </a>
            </li>
            <li>
              <a href="https://github.com" aria-label="Prong on GitHub">
                GitHub
              </a>
            </li>
            <li>
              <a href="https://www.linkedin.com" aria-label="Prong on LinkedIn">
                LinkedIn
              </a>
            </li>
          </ul>
        </div>
      </footer>
    </div>
  );
}

function DetailBody({
  plugin,
  toolQuery,
  onBack,
  onToolQuery,
}: {
  plugin: PluginListing;
  toolQuery: string;
  onBack: () => void;
  onToolQuery: (value: string) => void;
}) {
  const needle = toolQuery.trim().toLowerCase();
  const readTools = useMemo(
    () => plugin.readTools.filter((tool) => tool.toLowerCase().includes(needle)),
    [needle, plugin.readTools],
  );
  const writeTools = useMemo(
    () => plugin.writeTools.filter((tool) => tool.toLowerCase().includes(needle)),
    [needle, plugin.writeTools],
  );

  return (
    <main className="detail">
      <p className="detail-crumb">
        <button type="button" onClick={onBack}>
          Plugins
        </button>
        <span aria-hidden="true">›</span>
        {plugin.name}
      </p>
      <div className="detail-mark">
        <img src={plugin.logo} alt="" />
      </div>
      <div className="detail-head">
        <div>
          <h1>{plugin.name}</h1>
          <p>{plugin.summary}</p>
        </div>
      </div>

      <section className="detail-section" aria-labelledby="plugin-platforms">
        <h2 id="plugin-platforms">Platforms</h2>
        <ul className="detail-platforms">
          {plugin.platforms.map((platform) => (
            <li key={platform}>{platform}</li>
          ))}
        </ul>
      </section>

      <section className="detail-section" aria-labelledby="plugin-overview">
        <h2 id="plugin-overview">Overview</h2>
        <ul className="detail-overview">
          {plugin.overview.map((item) => (
            <li key={item}>
              <OverviewBullet />
              {item}
            </li>
          ))}
        </ul>
      </section>

      <section className="detail-section" aria-labelledby="plugin-permissions">
        <div className="detail-section-head">
          <h2 id="plugin-permissions">Manage permissions</h2>
          <label className="detail-tool-search">
            <span className="sr-only">Search tools</span>
            <SearchIcon />
            <input
              value={toolQuery}
              placeholder="Search tools"
              onChange={(event) => onToolQuery(event.target.value)}
            />
          </label>
        </div>
        {readTools.length === 0 && writeTools.length === 0 ? (
          <p className="detail-empty">No tools match “{toolQuery.trim()}”.</p>
        ) : (
          <div className="detail-groups">
            {readTools.length > 0 ? <ToolGroup title="Read-only tools" tools={readTools} /> : null}
            {writeTools.length > 0 ? <ToolGroup title="Write / delete tools" tools={writeTools} /> : null}
          </div>
        )}
      </section>

      <section className="detail-section" aria-labelledby="plugin-info">
        <h2 id="plugin-info">Information</h2>
        <dl className="detail-info">
          <div>
            <dt>Categories</dt>
            <dd className="detail-tags">
              {plugin.categories.map((category) => (
                <span key={category}>{category}</span>
              ))}
            </dd>
          </div>
          <div>
            <dt>Website</dt>
            <dd>
              <a href={plugin.website} target="_blank" rel="noreferrer">
                <GlobeIcon />
                {hostLabel(plugin.website)}
              </a>
            </dd>
          </div>
          <div>
            <dt>Documentation</dt>
            <dd>
              <a href={plugin.docs} target="_blank" rel="noreferrer">
                <GlobeIcon />
                {hostLabel(plugin.docs)}
              </a>
            </dd>
          </div>
          <div>
            <dt>Support</dt>
            <dd>
              <a href={plugin.support} target="_blank" rel="noreferrer">
                <GlobeIcon />
                {hostLabel(plugin.support)}
              </a>
            </dd>
          </div>
          <div>
            <dt>Directory</dt>
            <dd>Prong</dd>
          </div>
        </dl>
      </section>
    </main>
  );
}

function ToolGroup({ title, tools }: { title: string; tools: readonly string[] }) {
  const [open, setOpen] = useState(false);
  const [access, setAccess] = useState("Allow");

  return (
    <div className={open ? "tool-group is-open" : "tool-group"}>
      <div className="tool-group-bar">
        <button type="button" className="tool-group-toggle" aria-expanded={open} onClick={() => setOpen((value) => !value)}>
          <span className="tool-chevron" aria-hidden="true" />
          {title} ({tools.length})
        </button>
        <label className="sr-only" htmlFor={`access-${title.replace(/\W+/g, "-")}`}>
          {title} access
        </label>
        <select id={`access-${title.replace(/\W+/g, "-")}`} value={access} onChange={(event) => setAccess(event.target.value)}>
          <option>Allow</option>
          <option>Ask</option>
          <option>Deny</option>
        </select>
      </div>
      <div className="tool-group-panel" inert={open ? undefined : true}>
        <div className="tool-group-clip">
          <ul>
            {tools.map((tool) => (
              <li key={tool}>{tool}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function OverviewBullet() {
  const face = (points: string, tone: "top" | "lit" | "shade") => (
    <polygon className={`detail-face detail-face-${tone}`} points={points} />
  );

  return (
    <svg className="detail-bullet" viewBox="-91 -104 194 208" aria-hidden="true">
      {face("0,0 -86.6,-50 0,-100 86.6,-50", "top")}
      {face("-86.6,-50 0,0 0,100 -86.6,50", "lit")}
      {face("0,0 86.6,-50 86.6,50 0,100", "shade")}
      {face("91.8,13 98.73,9 98.73,53 91.8,57", "shade")}
      {face("91.8,13 57.16,-7 57.16,37 91.8,57", "lit")}
      {face("91.8,13 57.16,-7 64.09,-11 98.73,9", "top")}
      {face("58.89,32 65.82,28 65.82,72 58.89,76", "shade")}
      {face("58.89,32 24.25,12 24.25,56 58.89,76", "lit")}
      {face("58.89,32 24.25,12 31.18,8 65.82,28", "top")}
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <circle cx="7" cy="7" r="4.25" fill="none" stroke="currentColor" strokeWidth="1.3" />
      <path d="M10.2 10.2 13.2 13.2" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

function GlobeIcon() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <circle cx="8" cy="8" r="5.25" fill="none" stroke="currentColor" strokeWidth="1.2" />
      <path d="M8 2.75c1.4 1.5 1.4 9 0 10.5M8 2.75c-1.4 1.5-1.4 9 0 10.5M3 8h10" fill="none" stroke="currentColor" strokeWidth="1.1" />
    </svg>
  );
}
