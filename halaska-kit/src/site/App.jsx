// The site: a landing page that sells the kit and a browser that documents
// it. Built from the kit itself; the chrome stays quiet.
import { useEffect, useMemo, useState } from "react";
import { ThemeProvider, AccentContext, usePal, injectStyles, tokens, interactiveBase } from "./kit";
import { SiteContext, useSite } from "./state";
import { useLocation, redirectLegacyHash } from "./router";
import { useGateController, GateModal, GateToast } from "./email/gate";
import { SideNav } from "./chrome/SideNav";
import { Footer } from "./chrome/Footer";
import { FloatingCopy } from "./chrome/FloatingCopy";
import { Search } from "./chrome/Search";
import { patternBySlug } from "./registry";
import { screenBySlug } from "./data/screens.js";
import { Landing } from "./pages/Landing";
import { ComponentPage } from "./pages/ComponentPage";
import { PatternPage } from "./pages/PatternPage";
import { ScreenPage } from "./pages/ScreenPage";
import { PatternsIndex, ScreensIndex, ComponentsIndex } from "./pages/indexes";
import { DocsInstall } from "./pages/DocsInstall";
import { DocsTheming } from "./pages/DocsTheming";
import { Changelog } from "./pages/Changelog";
import { NotFound } from "./pages/NotFound";
import "./site.css";

const stored = (k, fallback) => { try { return window.localStorage.getItem(k) || fallback; } catch (e) { return fallback; } };
const keep = (k, v) => { try { window.localStorage.setItem(k, v); } catch (e) { /* private mode */ } };

function route(path) {
  const seg = path.split("/").filter(Boolean);
  if (seg.length === 0) return { page: <Landing />, landing: true };
  const [a, b] = seg;
  if (a === "screens") return b ? { page: <ScreenPage slug={b} />, target: screenTarget(b) } : { page: <ScreensIndex /> };
  if (a === "patterns") return b ? { page: <PatternPage slug={b} />, target: patternTarget(b) } : { page: <PatternsIndex /> };
  if (a === "components") return b ? { page: <ComponentPage slug={b} /> } : { page: <ComponentsIndex /> };
  if (a === "docs" && b === "install") return { page: <DocsInstall /> };
  if (a === "docs" && b === "theming") return { page: <DocsTheming /> };
  if (a === "docs" && !b) return { page: <DocsInstall /> };
  if (a === "changelog") return { page: <Changelog /> };
  return { page: <NotFound /> };
}
const patternTarget = (slug) => { const p = patternBySlug(slug); return p && { type: "pattern", slug: p.slug, title: p.title, component: p.component, desc: p.desc, useWhen: p.docs.useWhen }; };
const screenTarget = (slug) => { const s = screenBySlug(slug); return s && { type: "screen", slug: s.slug, name: s.name, component: s.component }; };

// Collapses the left menu to a thin strip, and brings it back.
function NavCollapse({ open, onChange }) {
  const { theme } = useSite();
  const pal = usePal(theme);
  const [hover, setHover] = useState(false);
  return (
    <button type="button" className="nav-collapse" aria-label={open ? "Collapse menu" : "Expand menu"} title={open ? "Collapse menu" : "Expand menu"} aria-expanded={open}
      onClick={() => onChange(!open)} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{ ...interactiveBase, width: 28, height: 28, padding: 0, borderRadius: tokens.radius.sm, display: "inline-flex", alignItems: "center", justifyContent: "center", background: hover ? pal.bgMuted : "transparent", color: pal.textTertiary }}>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="3.5" y="4.5" width="17" height="15" rx="2.5" /><path d="M9.5 4.5v15" />{open ? <path d="m15.5 10-2 2 2 2" /> : <path d="m14 10 2 2-2 2" />}
      </svg>
    </button>
  );
}

const systemTheme = () => (typeof window !== "undefined" && window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");

export default function App() {
  // Light or dark follows the system until the visitor picks one in the action bar.
  const [theme, setThemeState] = useState(() => stored("halaska:theme", null) || systemTheme());
  const [accent, setAccentState] = useState(() => stored("halaska:accent", "#8b5cf6"));
  const [search, setSearch] = useState(false);
  const [drawer, setDrawer] = useState(false);
  const [navOpen, setNavOpenState] = useState(() => stored("halaska:nav", "open") !== "closed");
  const setNavOpen = (open) => { setNavOpenState(open); keep("halaska:nav", open ? "open" : "closed"); };
  const gate = useGateController();
  const { path } = useLocation();
  useEffect(() => { injectStyles(); redirectLegacyHash(); }, []);
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const follow = () => { if (!stored("halaska:theme", null)) setThemeState(mq.matches ? "dark" : "light"); };
    mq.addEventListener?.("change", follow);
    return () => mq.removeEventListener?.("change", follow);
  }, []);
  const setTheme = (t) => { setThemeState(t); keep("halaska:theme", t); };
  const setAccent = (a) => { setAccentState(a); keep("halaska:accent", a); };
  const site = useMemo(() => ({ theme, setTheme, accent, setAccent, search, setSearch, gate, openMenu: () => setDrawer(true) }), [theme, accent, search, gate]);
  const { page, landing, target } = route(path);
  return (
    <SiteContext.Provider value={site}>
      <AccentContext.Provider value={accent}>
        <ThemeProvider theme={theme}>
          <Shell theme={theme}>
            <div className={navOpen ? "site-shell" : "site-shell nav-closed"}>
              <nav className="site-nav" aria-label="Site">
                {navOpen ? <SideNav onCollapse={<NavCollapse open onChange={setNavOpen} />} /> : <NavCollapse open={false} onChange={setNavOpen} />}
              </nav>
              <main style={{ minWidth: 0 }}>
                {page}
                <Footer />
              </main>
            </div>
            {drawer && (
              <>
                <div className="site-drawer-scrim" onClick={() => setDrawer(false)} />
                <aside className="site-drawer" aria-label="Navigation"><SideNav onNavigate={() => setDrawer(false)} /></aside>
              </>
            )}
            <FloatingCopy target={target} />
            <GateToast />
            <GateModal />
            <Search />
          </Shell>
        </ThemeProvider>
      </AccentContext.Provider>
    </SiteContext.Provider>
  );
}

// Sets the chrome's CSS variables from the kit's palette so site.css and the
// kit agree on colour in both themes.
function Shell({ theme, children }) {
  const pal = usePal(theme);
  useEffect(() => { document.body.style.background = pal.bg; document.documentElement.style.colorScheme = theme; }, [pal.bg, theme]);
  return (
    <div className="site" style={{
      "--s-bg": pal.bg, "--s-text": pal.text, "--s-text-3": pal.textTertiary, "--s-border": pal.borderSubtle,
      "--s-accent-bg": pal.accentBg, "--s-glass": theme === "dark" ? "rgba(17,17,17,0.8)" : "rgba(255,255,255,0.8)",
    }}>{children}</div>
  );
}
