import { useEffect, useState } from "react";
import { CubeMorph } from "./CubeMorph";
import { SoftBlurText } from "./LoadReveal";
import { PluginDetail } from "./PluginDetail";
import { PluginGrid } from "./PluginGrid";
import { findPlugin } from "./plugins";

const PLUGIN_PARAM = "plugin";

function pluginNameFromUrl() {
  const name = new URLSearchParams(window.location.search).get(PLUGIN_PARAM);
  if (!name || !findPlugin(name)) {
    return null;
  }
  return name;
}

function urlForPlugin(name: string | null) {
  const url = new URL(window.location.href);
  if (name) {
    url.searchParams.set(PLUGIN_PARAM, name);
  } else {
    url.searchParams.delete(PLUGIN_PARAM);
  }
  return `${url.pathname}${url.search}${url.hash}`;
}

function currentUrl() {
  return `${window.location.pathname}${window.location.search}${window.location.hash}`;
}

export default function App() {
  const [open, setOpen] = useState<string | null>(pluginNameFromUrl);

  useEffect(() => {
    const raw = new URLSearchParams(window.location.search).get(PLUGIN_PARAM);
    if (raw && !findPlugin(raw)) {
      history.replaceState(history.state, "", urlForPlugin(null));
    }

    const onPopState = () => {
      setOpen(pluginNameFromUrl());
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  function openPlugin(name: string) {
    if (!findPlugin(name)) {
      return;
    }
    setOpen(name);
    const next = urlForPlugin(name);
    if (currentUrl() !== next) {
      history.pushState({ prongPlugin: name }, "", next);
    }
  }

  function closePlugin() {
    setOpen(null);
    const next = urlForPlugin(null);
    if (currentUrl() !== next) {
      history.replaceState(null, "", next);
    }
  }

  return (
    <>
      <div className={open ? "screen-hidden" : undefined}>
        <HomeScreen onOpen={openPlugin} />
      </div>
      {open ? <PluginDetail name={open} onBack={closePlugin} /> : null}
    </>
  );
}

function HomeScreen({ onOpen }: { onOpen: (name: string) => void }) {
  const [query, setQuery] = useState("");
  const [intro, setIntro] = useState(true);

  useEffect(() => {
    const timeout = window.setTimeout(() => setIntro(false), 4000);
    return () => window.clearTimeout(timeout);
  }, []);

  return (
    <div className="hero-slot">
      <Topbar intro={intro} onHome={() => window.scrollTo(0, 0)} />
      <div className="hero-scale">
        <div className="hero-frame">
          <div className="copy">
            <h1>
              <SoftBlurText text="Prong: The Universal Plugin Directory" play={intro} />
            </h1>
            <p className={intro ? "lede load-reveal" : "lede"} style={intro ? { animationDelay: "0.3s" } : undefined}>
              Every plugin gets a free listing of its interfaces, skills, and checks.
              <br />
              Claim it for free, or pay for managed submission to every major directory.
            </p>
          </div>

          <form
            className={intro ? "search load-reveal" : "search"}
            style={intro ? { animationDelay: "0.45s" } : undefined}
            role="search"
            onClick={(event) => {
              if (event.target instanceof Element && event.target.closest("button")) {
                return;
              }
              event.currentTarget.querySelector("input")?.focus();
            }}
            onSubmit={(event) => {
              event.preventDefault();
            }}
          >
            <label className="sr-only" htmlFor="search">
              Search plugins
            </label>
            <input
              id="search"
              value={query}
              placeholder="Search plugins..."
              onChange={(event) => setQuery(event.target.value)}
            />
            <button type="submit" aria-label="Search" className={query.trim() ? "is-ready" : undefined}>
              <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
                <path
                  fill="currentColor"
                  d="M6.5 1.5C9.26142 1.5 11.5 3.73858 11.5 6.5C11.5 7.51906 11.1944 8.46641 10.6709 9.25684L14.207 12.793C14.5976 13.1835 14.5976 13.8165 14.207 14.207C13.8165 14.5976 13.1835 14.5976 12.793 14.207L9.25684 10.6709C8.46641 11.1944 7.51906 11.5 6.5 11.5C3.73858 11.5 1.5 9.26142 1.5 6.5C1.5 3.73858 3.73858 1.5 6.5 1.5ZM6.5 3.5C4.84315 3.5 3.5 4.84315 3.5 6.5C3.5 8.15685 4.84315 9.5 6.5 9.5C8.15685 9.5 9.5 8.15685 9.5 6.5C9.5 4.84315 8.15685 3.5 6.5 3.5Z"
                />
              </svg>
            </button>
          </form>
          <PluginGrid query={query} intro={intro} onOpen={onOpen} />
        </div>
      </div>
      <SiteFooter intro={intro} />
    </div>
  );
}

function SiteFooter({ intro = false }: { intro?: boolean }) {
  return (
    <footer className={intro ? "site-footer load-reveal" : "site-footer"} style={intro ? { animationDelay: "0.66s" } : undefined}>
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
  );
}

function Topbar({ intro, onHome }: { intro: boolean; onHome: () => void }) {
  return (
    <header className={intro ? "topbar load-reveal" : "topbar"}>
      <nav className="nav" aria-label="Primary">
        <span>Plugins</span>
        <span>Agents</span>
        <span>Pricing</span>
      </nav>
      <button type="button" className="logo-slot" aria-label="Prong home" onClick={onHome}>
        <CubeMorph playEvery={10} />
      </button>
      <div className="nav nav-balance" aria-hidden="true">
        <span>Plugins</span>
        <span>Agents</span>
        <span>Pricing</span>
      </div>
    </header>
  );
}

