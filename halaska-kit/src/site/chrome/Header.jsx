// Global header: name, primary links, search, GitHub and the Copy prompt
// button. Theme and colour scheme live in the action bar at the bottom.
import { useState } from "react";
import { Button, usePal, tokens, motion, interactiveBase, Kbd } from "../kit";
import { useSite } from "../state";
import { Link, useLocation } from "../router";
import { SideNav } from "./SideNav";

export const REPO_URL = "https://github.com/Halaska-Studio/ui";

function HeaderLink({ to, children, pal, active }) {
  const [hover, setHover] = useState(false);
  return (
    <Link to={to} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{ padding: "6px 10px", borderRadius: tokens.radius.sm, ...tokens.type.sm, fontWeight: active ? tokens.weight.medium : tokens.weight.regular, color: active || hover ? pal.text : pal.textSecondary, transition: `color ${motion.fast} ${motion.easeOut}` }}>{children}</Link>
  );
}

function IconBtn({ label, onClick, pal, children, href, className }) {
  const [hover, setHover] = useState(false);
  const style = { ...interactiveBase, width: 32, height: 32, padding: 0, borderRadius: tokens.radius.sm, display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0, background: hover ? pal.bgMuted : "transparent", color: pal.textSecondary };
  const props = { "aria-label": label, title: label, className, onMouseEnter: () => setHover(true), onMouseLeave: () => setHover(false), style };
  return href ? <a href={href} target="_blank" rel="noreferrer" {...props}>{children}</a> : <button type="button" onClick={onClick} {...props}>{children}</button>;
}

export function Header() {
  const { theme, setSearch, gate } = useSite();
  const pal = usePal(theme);
  const { path } = useLocation();
  const [drawer, setDrawer] = useState(false);
  const under = (p) => path === p || path.startsWith(`${p}/`);
  return (
    <>
      <header className="site-hdr">
        <IconBtn label="Open navigation" pal={pal} className="hdr-burger" onClick={() => setDrawer(true)}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16" /></svg>
        </IconBtn>
        <Link to="/" aria-label="Halaska UI, home" style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
          <img src={theme === "dark" ? "/favicon-dark.png" : "/favicon-32.png"} alt="" width="22" height="22" style={{ borderRadius: 6, display: "block" }} />
          <span style={{ ...tokens.type.base, fontWeight: tokens.weight.semibold, color: pal.text, letterSpacing: "-0.01em", whiteSpace: "nowrap" }}>Halaska UI</span>
        </Link>
        <nav className="hdr-links" aria-label="Primary">
          <HeaderLink pal={pal} to="/screens" active={under("/screens")}>Screens</HeaderLink>
          <HeaderLink pal={pal} to="/patterns" active={under("/patterns")}>Patterns</HeaderLink>
          <HeaderLink pal={pal} to="/components" active={under("/components")}>Components</HeaderLink>
          <HeaderLink pal={pal} to="/docs/install" active={under("/docs") || under("/changelog")}>Docs</HeaderLink>
        </nav>
        <div className="hdr-right">
          <button type="button" onClick={() => setSearch(true)} aria-label="Search" className="hdr-hide-sm"
            style={{ ...interactiveBase, height: 32, padding: "0 8px 0 12px", borderRadius: tokens.radius.sm, display: "inline-flex", alignItems: "center", gap: 28, background: pal.bgSubtle, boxShadow: `inset 0 0 0 1px ${pal.borderSubtle}`, color: pal.textTertiary, ...tokens.type.sm }}>
            Search <Kbd theme={theme}>⌘K</Kbd>
          </button>
          <IconBtn label="Search" pal={pal} className="hdr-burger" onClick={() => setSearch(true)}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
          </IconBtn>
          <IconBtn label="GitHub" pal={pal} href={REPO_URL} className="hdr-hide-sm">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.9 1.52 2.34 1.08 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.02a9.58 9.58 0 0 1 5 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.37.2 2.39.1 2.64.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85v2.74c0 .27.18.58.69.48A10 10 0 0 0 12 2Z" /></svg>
          </IconBtn>
          <Button theme={theme} variant="primary" size="sm" onClick={() => gate.requestPrompt({ placement: "header" })}>Copy prompt</Button>
        </div>
      </header>
      {drawer && (
        <>
          <div className="site-drawer-scrim" onClick={() => setDrawer(false)} />
          <aside className="site-drawer" aria-label="Navigation">
            <div style={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: 20 }}>
              {[["/screens", "Screens"], ["/patterns", "Patterns"], ["/components", "Components"]].map(([to, label]) => (
                <Link key={to} to={to} onClick={() => setDrawer(false)} style={{ padding: "8px 10px", ...tokens.type.md, fontWeight: tokens.weight.medium, color: pal.text }}>{label}</Link>
              ))}
            </div>
            <SideNav onNavigate={() => setDrawer(false)} />
          </aside>
        </>
      )}
    </>
  );
}
