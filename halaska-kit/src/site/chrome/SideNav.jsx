// The site's only navigation: the name, search, the Copy prompt button, and
// four accordions (Get started, Screens, Patterns, Components). Sections start
// collapsed; the one holding the current page opens by itself. Also used
// inside the mobile drawer.
import { useEffect, useState } from "react";
import { Button, Kbd, usePal, tokens, motion, interactiveBase } from "../kit";
import { useSite } from "../state";
import { Link, useLocation } from "../router";
import { GROUPS, COMPONENTS, SCREENS } from "../registry";
import { TagPill, tagTone } from "../ui/bits";

export const REPO_URL = "https://github.com/Halaska-Studio/ui";

function NavLink({ to, children, active, pal, right }) {
  const [hover, setHover] = useState(false);
  return (
    <Link to={to} aria-current={active ? "page" : undefined}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        display: "flex", alignItems: "center", gap: 8, padding: "5px 10px", borderRadius: tokens.radius.sm,
        ...tokens.type.sm, fontWeight: active ? tokens.weight.medium : tokens.weight.regular,
        color: active ? pal.text : hover ? pal.text : pal.textSecondary,
        background: active ? pal.bgMuted : "transparent",
        transition: `background ${motion.fast} ${motion.easeOut}, color ${motion.fast} ${motion.easeOut}`,
      }}>
      <span style={{ flex: 1, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{children}</span>
      {right}
    </Link>
  );
}

function Accordion({ id, title, count, open, onToggle, pal, children }) {
  const [hover, setHover] = useState(false);
  return (
    <div>
      <button type="button" aria-expanded={open} aria-controls={`nav-${id}`} onClick={onToggle}
        onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
        style={{
          ...interactiveBase, width: "100%", display: "flex", alignItems: "center", gap: 8, padding: "8px 10px", borderRadius: tokens.radius.sm,
          textAlign: "left", background: hover ? pal.bgSubtle : "transparent",
          ...tokens.type.base, fontWeight: tokens.weight.semibold, color: pal.text, letterSpacing: "-0.01em",
        }}>
        <span style={{ flex: 1, minWidth: 0 }}>{title}</span>
        {count != null && <span style={{ ...tokens.type.xs, fontFamily: tokens.font.mono, fontWeight: tokens.weight.regular, color: pal.textTertiary }}>{count}</span>}
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"
          style={{ transform: open ? "rotate(90deg)" : "none", transition: `transform ${motion.normal} ${motion.easeInOut}`, color: pal.textTertiary, flexShrink: 0 }}><path d="M9 6l6 6-6 6" /></svg>
      </button>
      {open && <div id={`nav-${id}`} style={{ padding: "2px 0 10px" }}>{children}</div>}
    </div>
  );
}

const sectionOf = (path) => (path.startsWith("/screens") ? "screens" : path.startsWith("/patterns") ? "patterns" : path.startsWith("/components") ? "components" : path.startsWith("/docs") || path.startsWith("/changelog") ? "start" : null);

export function SideNav({ onNavigate, onCollapse }) {
  const { theme, setSearch, gate } = useSite();
  const pal = usePal(theme);
  const { path } = useLocation();
  const [open, setOpen] = useState(() => { const s = sectionOf(path); return s ? { [s]: true } : {}; });
  // Arriving on a page opens its section; nothing closes on its own.
  useEffect(() => { const s = sectionOf(path); if (s) setOpen((o) => (o[s] ? o : { ...o, [s]: true })); }, [path]);
  const toggle = (id) => () => setOpen((o) => ({ ...o, [id]: !o[id] }));
  const is = (to) => path === to;
  const [ghHover, setGhHover] = useState(false);
  return (
    <div onClick={(e) => { if (e.target.closest("a")) onNavigate?.(); }} style={{ fontFamily: tokens.font.sans, display: "flex", flexDirection: "column", minHeight: "100%" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, height: 32, padding: "0 4px 0 8px", marginBottom: 16 }}>
        <Link to="/" aria-label="Halaska UI, home" style={{ display: "inline-flex", alignItems: "center", gap: 8, flex: 1, minWidth: 0 }}>
          <img src={theme === "dark" ? "/favicon-dark.png" : "/favicon-32.png"} alt="" width="22" height="22" style={{ borderRadius: 6, display: "block" }} />
          <span style={{ ...tokens.type.base, fontWeight: tokens.weight.semibold, color: pal.text, letterSpacing: "-0.01em", whiteSpace: "nowrap" }}>Halaska UI</span>
        </Link>
        {onCollapse}
      </div>

      <button type="button" onClick={() => { setSearch(true); onNavigate?.(); }} aria-label="Search"
        style={{ ...interactiveBase, width: "100%", height: 34, padding: "0 8px 0 10px", borderRadius: tokens.radius.sm, display: "flex", alignItems: "center", gap: 8, background: pal.bgSubtle, boxShadow: `inset 0 0 0 1px ${pal.borderSubtle}`, color: pal.textTertiary, ...tokens.type.sm, textAlign: "left" }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
        <span style={{ flex: 1 }}>Search</span>
        <Kbd theme={theme}>⌘K</Kbd>
      </button>
      <div style={{ margin: "16px 0 22px", padding: 14, borderRadius: tokens.radius.md, background: pal.bgSubtle, border: `1px solid ${pal.borderSubtle}` }}>
        <div style={{ ...tokens.type.sm, fontWeight: tokens.weight.semibold, color: pal.text, marginBottom: 4 }}>Use the kit</div>
        <div style={{ ...tokens.type.xs, color: pal.textSecondary, lineHeight: 1.55, marginBottom: 12 }}>Copy the prompt and paste it into your coding agent. It installs the kit and applies it to what you have built.</div>
        <Button theme={theme} variant="primary" size="sm" fullWidth onClick={() => { gate.requestPrompt({ placement: "nav" }); onNavigate?.(); }}>Copy prompt</Button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 2, flex: 1 }}>
        <Accordion id="start" title="Get started" open={!!open.start} onToggle={toggle("start")} pal={pal}>
          <NavLink pal={pal} to="/docs/install" active={is("/docs/install")}>Install</NavLink>
          <NavLink pal={pal} to="/docs/theming" active={is("/docs/theming")}>Theming</NavLink>
          <NavLink pal={pal} to="/changelog" active={is("/changelog")}>Changelog</NavLink>
        </Accordion>
        <Accordion id="screens" title="Screens" open={!!open.screens} onToggle={toggle("screens")} pal={pal}>
          <NavLink pal={pal} to="/screens" active={is("/screens")}>All screens</NavLink>
          {SCREENS.map((s) => <NavLink key={s.slug} pal={pal} to={`/screens/${s.slug}`} active={is(`/screens/${s.slug}`)}>{s.name}</NavLink>)}
        </Accordion>
        <Accordion id="patterns" title="Patterns" count={GROUPS.reduce((n, g) => n + g.patterns.length, 0)} open={!!open.patterns} onToggle={toggle("patterns")} pal={pal}>
          <NavLink pal={pal} to="/patterns" active={is("/patterns")}>All patterns</NavLink>
          {GROUPS.map((g) => (
            <div key={g.id}>
              <div style={{ padding: "12px 10px 4px", ...tokens.type.xs, fontFamily: tokens.font.mono, letterSpacing: "0.06em", textTransform: "uppercase", color: pal.textTertiary }}>{g.title}</div>
              {g.patterns.map((p) => <NavLink key={p.id} pal={pal} to={`/patterns/${p.slug}`} active={is(`/patterns/${p.slug}`)}>{p.title}</NavLink>)}
            </div>
          ))}
        </Accordion>
        <Accordion id="components" title="Components" count={COMPONENTS.length} open={!!open.components} onToggle={toggle("components")} pal={pal}>
          <NavLink pal={pal} to="/components" active={is("/components")}>All components</NavLink>
          {COMPONENTS.map((c) => (
            <NavLink key={c.slug} pal={pal} to={`/components/${c.slug}`} active={is(`/components/${c.slug}`)}
              right={(c.tags || []).map((t) => <TagPill key={t} tone={tagTone(t)}>{t}</TagPill>)}>{c.name}</NavLink>
          ))}
        </Accordion>
      </div>

      <a href={REPO_URL} target="_blank" rel="noreferrer" onMouseEnter={() => setGhHover(true)} onMouseLeave={() => setGhHover(false)}
        style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 10px", marginTop: 16, borderRadius: tokens.radius.sm, ...tokens.type.sm, color: ghHover ? pal.text : pal.textSecondary }}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.9 1.52 2.34 1.08 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.02a9.58 9.58 0 0 1 5 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.37.2 2.39.1 2.64.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85v2.74c0 .27.18.58.69.48A10 10 0 0 0 12 2Z" /></svg>
        GitHub
      </a>
    </div>
  );
}
