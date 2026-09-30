// The site: a landing page that sells the kit and a browser that documents
// it. Built from the kit itself; the chrome stays quiet.
import { useEffect, useMemo, useState } from "react";
import { ThemeProvider, AccentContext, usePal, injectStyles } from "./kit";
import { SiteContext } from "./state";
import { useLocation, redirectLegacyHash } from "./router";
import { useGateController, GateModal, GateToast } from "./email/gate";
import { Header } from "./chrome/Header";
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

const systemTheme = () => (typeof window !== "undefined" && window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");

export default function App() {
  // Light or dark follows the system until the visitor picks one in the action bar.
  const [theme, setThemeState] = useState(() => stored("halaska:theme", null) || systemTheme());
  const [accent, setAccentState] = useState(() => stored("halaska:accent", "#8b5cf6"));
  const [search, setSearch] = useState(false);
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
  const site = useMemo(() => ({ theme, setTheme, accent, setAccent, search, setSearch, gate }), [theme, accent, search, gate]);
  const { page, landing, target } = route(path);
  return (
    <SiteContext.Provider value={site}>
      <AccentContext.Provider value={accent}>
        <ThemeProvider theme={theme}>
          <Shell theme={theme}>
            <Header />
            {landing ? page : (
              <div className="site-shell">
                <nav className="site-nav" aria-label="Browse"><SideNav /></nav>
                <main>{page}</main>
              </div>
            )}
            <Footer />
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
