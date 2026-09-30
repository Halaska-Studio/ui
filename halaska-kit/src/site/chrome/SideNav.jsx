// The browser's left-hand nav: Get started, Screens, Patterns (collapsible
// lifecycle groups with counts), Components (alphabetical). Also used inside
// the mobile drawer.
import { useState } from "react";
import { usePal, tokens, motion, interactiveBase } from "../kit";
import { useSite } from "../state";
import { Link, useLocation } from "../router";
import { GROUPS, COMPONENTS, SCREENS } from "../registry";
import { TagPill, tagTone } from "../ui/bits";

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

function Heading({ children, pal, count, to }) {
  const inner = (
    <span style={{ display: "flex", alignItems: "center", gap: 8, padding: "0 10px", marginBottom: 6, ...tokens.type.xs, fontFamily: tokens.font.mono, letterSpacing: "0.08em", textTransform: "uppercase", color: pal.textTertiary }}>
      <span style={{ flex: 1 }}>{children}</span>{count != null && <span>{count}</span>}
    </span>
  );
  return to ? <Link to={to}>{inner}</Link> : inner;
}

export function SideNav({ onNavigate }) {
  const { theme } = useSite();
  const pal = usePal(theme);
  const { path } = useLocation();
  const currentGroup = GROUPS.find((g) => g.patterns.some((p) => path === `/patterns/${p.slug}`));
  const [open, setOpen] = useState(() => Object.fromEntries(GROUPS.map((g) => [g.id, true])));
  const is = (to) => path === to;
  return (
    <div onClick={(e) => { if (e.target.closest("a")) onNavigate?.(); }} style={{ fontFamily: tokens.font.sans, display: "flex", flexDirection: "column", gap: 26 }}>
      <div>
        <Heading pal={pal}>Get started</Heading>
        <NavLink pal={pal} to="/docs/install" active={is("/docs/install")}>Install</NavLink>
        <NavLink pal={pal} to="/docs/theming" active={is("/docs/theming")}>Theming</NavLink>
        <NavLink pal={pal} to="/changelog" active={is("/changelog")}>Changelog</NavLink>
      </div>
      <div>
        <Heading pal={pal} to="/screens">Screens</Heading>
        {SCREENS.map((s) => <NavLink key={s.slug} pal={pal} to={`/screens/${s.slug}`} active={is(`/screens/${s.slug}`)}>{s.name}</NavLink>)}
      </div>
      <div>
        <Heading pal={pal} count={GROUPS.reduce((n, g) => n + g.patterns.length, 0)} to="/patterns">Patterns</Heading>
        {GROUPS.map((g) => {
          const expanded = open[g.id] || currentGroup?.id === g.id;
          return (
            <div key={g.id} style={{ marginBottom: 2 }}>
              <button type="button" aria-expanded={expanded} onClick={() => setOpen((o) => ({ ...o, [g.id]: !expanded }))}
                style={{ ...interactiveBase, width: "100%", display: "flex", alignItems: "center", gap: 8, padding: "5px 10px", background: "transparent", textAlign: "left", ...tokens.type.sm, fontWeight: tokens.weight.medium, color: pal.text }}>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ transform: expanded ? "rotate(90deg)" : "none", transition: `transform ${motion.fast} ${motion.easeOut}`, color: pal.textTertiary, flexShrink: 0 }}><path d="M9 6l6 6-6 6" /></svg>
                <span style={{ flex: 1, minWidth: 0 }}>{g.title}</span>
                <span style={{ ...tokens.type.xs, fontFamily: tokens.font.mono, color: pal.textTertiary }}>{g.patterns.length}</span>
              </button>
              {expanded && (
                <div style={{ marginLeft: 14, paddingLeft: 6, borderLeft: `1px solid ${pal.borderSubtle}` }}>
                  {g.patterns.map((p) => <NavLink key={p.id} pal={pal} to={`/patterns/${p.slug}`} active={is(`/patterns/${p.slug}`)}>{p.title}</NavLink>)}
                </div>
              )}
            </div>
          );
        })}
      </div>
      <div>
        <Heading pal={pal} count={COMPONENTS.length} to="/components">Components</Heading>
        {COMPONENTS.map((c) => (
          <NavLink key={c.slug} pal={pal} to={`/components/${c.slug}`} active={is(`/components/${c.slug}`)}
            right={(c.tags || []).map((t) => <TagPill key={t} tone={tagTone(t)}>{t}</TagPill>)}>{c.name}</NavLink>
        ))}
      </div>
    </div>
  );
}
