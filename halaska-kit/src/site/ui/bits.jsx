// Small layout pieces shared by the page templates.
import { usePal, tokens, motion, Text, Heading } from "../kit";
import { useSite } from "../state";
import { Link } from "../router";

export function TagPill({ children, tone = "neutral" }) {
  const { theme } = useSite(); const pal = usePal(theme);
  const accent = tone === "accent";
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", height: 18, padding: "0 7px", borderRadius: tokens.radius.pill, flexShrink: 0,
      fontFamily: tokens.font.mono, fontSize: 9.5, letterSpacing: "0.08em", textTransform: "uppercase",
      background: accent ? pal.accentBg : pal.bgMuted, color: accent ? pal.accentText : pal.textTertiary,
    }}>{children}</span>
  );
}
export const tagTone = (t) => (t === "AI" || t === "New" ? "accent" : "neutral");

export function Count({ n, label }) {
  const { theme } = useSite(); const pal = usePal(theme);
  return (
    <span style={{ display: "inline-flex", alignItems: "baseline", gap: 6 }}>
      <span style={{ fontFamily: tokens.font.mono, ...tokens.type.lg, fontWeight: tokens.weight.semibold, color: pal.text }}>{n}</span>
      <span style={{ ...tokens.type.sm, color: pal.textTertiary }}>{label}</span>
    </span>
  );
}

export function PageHeader({ eyebrow, eyebrowTo, title, lead, tags = [], children }) {
  const { theme } = useSite(); const pal = usePal(theme);
  return (
    <header style={{ marginBottom: 32 }}>
      {eyebrow && (eyebrowTo
        ? <Link to={eyebrowTo} style={{ ...tokens.type.sm, color: pal.textTertiary, fontFamily: tokens.font.mono }}>{eyebrow}</Link>
        : <span style={{ ...tokens.type.sm, color: pal.textTertiary, fontFamily: tokens.font.mono }}>{eyebrow}</span>)}
      <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", marginTop: eyebrow ? 8 : 0 }}>
        <h1 style={{ ...tokens.type.xxl, fontWeight: tokens.weight.bold, letterSpacing: "-0.02em", color: pal.text, margin: 0 }}>{title}</h1>
        {tags.map((t) => <TagPill key={t} tone={tagTone(t)}>{t}</TagPill>)}
      </div>
      {lead && <p style={{ ...tokens.type.md, color: pal.textSecondary, lineHeight: 1.65, margin: "12px 0 0", maxWidth: 640 }}>{lead}</p>}
      {children}
    </header>
  );
}

export function Section({ id, title, lead, children, style: sp }) {
  const { theme } = useSite(); const pal = usePal(theme);
  return (
    <section id={id} style={{ marginTop: 48, scrollMarginTop: 28, ...sp }}>
      <h2 style={{ ...tokens.type.lg, fontWeight: tokens.weight.semibold, color: pal.text, margin: "0 0 6px", letterSpacing: "-0.01em" }}>{title}</h2>
      {lead && <p style={{ ...tokens.type.sm, color: pal.textSecondary, lineHeight: 1.65, margin: "0 0 16px", maxWidth: 620 }}>{lead}</p>}
      <div style={{ marginTop: lead ? 0 : 14 }}>{children}</div>
    </section>
  );
}

export function ChipLink({ to, children, mono }) {
  const { theme } = useSite(); const pal = usePal(theme);
  return (
    <Link to={to} style={{
      display: "inline-flex", alignItems: "center", gap: 6, height: 28, padding: "0 11px", borderRadius: tokens.radius.pill,
      background: pal.bgSubtle, boxShadow: `inset 0 0 0 1px ${pal.borderSubtle}`, color: pal.textSecondary,
      ...tokens.type.sm, fontFamily: mono ? tokens.font.mono : tokens.font.sans, whiteSpace: "nowrap",
      transition: `background ${motion.fast} ${motion.easeOut}`,
    }}>{children}</Link>
  );
}

export function PrevNext({ prev, next }) {
  const { theme } = useSite(); const pal = usePal(theme);
  const cell = (item, dir) => item ? (
    <Link to={item.to} style={{
      flex: 1, minWidth: 0, padding: "14px 16px", borderRadius: tokens.radius.md, border: `1px solid ${pal.borderSubtle}`,
      display: "flex", flexDirection: "column", gap: 2, alignItems: dir === "next" ? "flex-end" : "flex-start",
    }}>
      <span style={{ ...tokens.type.xs, color: pal.textTertiary }}>{dir === "next" ? "Next" : "Previous"}</span>
      <span style={{ ...tokens.type.base, fontWeight: tokens.weight.medium, color: pal.text }}>{item.label}</span>
    </Link>
  ) : <span style={{ flex: 1 }} />;
  return <nav aria-label="Previous and next" style={{ display: "flex", gap: 12, marginTop: 56 }}>{cell(prev, "prev")}{cell(next, "next")}</nav>;
}

// Detail layout: the article plus the "On this page" rail on wide screens.
export function DetailLayout({ sections = [], wide, children }) {
  const { theme } = useSite(); const pal = usePal(theme);
  return (
    <div className="site-main">
      <article className={wide ? "site-article wide" : "site-article"}>{children}</article>
      {sections.length > 0 && (
        <aside className="site-rail" aria-label="On this page">
          <div style={{ ...tokens.type.xs, color: pal.textTertiary, marginBottom: 10 }}>On this page</div>
          {sections.map((s) => (
            <a key={s.id} href={`#${s.id}`} onClick={(e) => { e.preventDefault(); const el = document.getElementById(s.id); if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 28, behavior: "smooth" }); }}
              style={{ display: "block", padding: "5px 0", ...tokens.type.sm, color: pal.textSecondary }}>{s.title}</a>
          ))}
        </aside>
      )}
    </div>
  );
}

export function Card({ to, children, style: sp }) {
  const { theme } = useSite(); const pal = usePal(theme);
  const base = {
    display: "flex", flexDirection: "column", gap: 10, padding: 14, borderRadius: tokens.radius.lg, minWidth: 0,
    border: `1px solid ${pal.borderSubtle}`, background: pal.bgElevated,
    transition: `border-color ${motion.normal} ${motion.easeInOut}, background ${motion.smooth} ${motion.easeInOut}`, ...sp,
  };
  return to ? <Link to={to} style={base}>{children}</Link> : <div style={base}>{children}</div>;
}

export function Prose({ children }) {
  const { theme } = useSite(); const pal = usePal(theme);
  return <div style={{ ...tokens.type.base, color: pal.textSecondary, lineHeight: 1.7, maxWidth: 640 }}>{children}</div>;
}
