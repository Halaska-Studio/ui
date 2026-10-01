// The three index pages: /screens, /patterns, /components.
import { useEffect, useState } from "react";
import { usePal, tokens, motion, interactiveBase, Text } from "../kit";
import { useSite, usePageMeta } from "../state";
import { Link, useLocation } from "../router";
import { GROUPS, PATTERNS, COMPONENTS, SCREENS, COUNTS } from "../registry";
import { COMPONENT_GROUPS } from "../data/components/index.js";
import { GROUP_INTROS } from "../data/patterns/index.js";
import { PARITY, CONVERSATION_MAP, PARITY_SUMMARY } from "../data/parity.js";
import { PreviewFrame, ComponentPreview, useScrollSpy } from "../ui/PreviewFrame";
import { ScreenStage, LayoutToggle, useLayout } from "../ui/ScreenStage";
import { PageHeader, Section, DetailLayout, Card, TagPill, tagTone, ChipLink } from "../ui/bits";

// One block per item on an index page: name, one line, a full-width live
// preview, and a link to the detail page. The id is the anchor the nav scrolls to.
function IndexBlock({ id, title, tags = [], line, detail, children }) {
  const { theme } = useSite(); const pal = usePal(theme);
  return (
    <article id={id} style={{ scrollMarginTop: 28 }}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 16, marginBottom: 12 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            <h3 style={{ ...tokens.type.md, fontWeight: tokens.weight.semibold, color: pal.text, margin: 0, letterSpacing: "-0.01em" }}>{title}</h3>
            {tags.map((t) => <TagPill key={t} tone={tagTone(t)}>{t}</TagPill>)}
          </div>
          {line && <p style={{ ...tokens.type.sm, color: pal.textSecondary, lineHeight: 1.6, margin: "4px 0 0", maxWidth: 420 }}>{line}</p>}
        </div>
        <Link to={detail} style={{ ...tokens.type.sm, fontWeight: tokens.weight.medium, color: pal.textSecondary, whiteSpace: "nowrap", display: "inline-flex", alignItems: "center", gap: 6, paddingTop: 4 }}>
          Details <span aria-hidden="true" style={{ color: pal.textTertiary }}>→</span>
        </Link>
      </div>
      {children}
    </article>
  );
}

// Index previews share one height on desktop so the page scrolls evenly.
const useIndexHeight = (base) => {
  const [wide, setWide] = useState(() => typeof window !== "undefined" && window.innerWidth >= 900);
  useEffect(() => {
    const on = () => setWide(window.innerWidth >= 900);
    window.addEventListener("resize", on);
    return () => window.removeEventListener("resize", on);
  }, []);
  return wide ? Math.max(600, base) : base;
};

function PatternBlock({ p }) {
  const minHeight = useIndexHeight(Math.max(280, (p.height || 480) - 72));
  return (
    <IndexBlock id={p.slug} title={p.title} line={p.docs.useWhen || p.desc} detail={`/patterns/${p.slug}`}>
      <PreviewFrame toolbar={false} housed={p.housed} align="top" minHeight={minHeight}>
        {p.Component && <p.Component />}
      </PreviewFrame>
    </IndexBlock>
  );
}

function ComponentBlock({ c }) {
  const minHeight = useIndexHeight(260);
  return (
    <IndexBlock id={c.slug} title={c.name} tags={c.tags || []} line={c.description} detail={`/components/${c.slug}`}>
      <ComponentPreview slug={c.slug} minHeight={minHeight} />
    </IndexBlock>
  );
}

function JumpChips({ items }) {
  const { theme } = useSite(); const pal = usePal(theme);
  return (
    <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 8 }}>
      {items.map(([to, label, n]) => (
        <Link key={to} to={to} style={{ height: 30, padding: "0 12px", borderRadius: tokens.radius.pill, display: "inline-flex", alignItems: "center", gap: 8, ...tokens.type.sm, whiteSpace: "nowrap", background: pal.bgSubtle, color: pal.textSecondary, boxShadow: `inset 0 0 0 1px ${pal.borderSubtle}` }}>
          {label}{n != null && <span style={{ fontFamily: tokens.font.mono, ...tokens.type.xs, opacity: 0.7 }}>{n}</span>}
        </Link>
      ))}
    </div>
  );
}

export function PatternsIndex() {
  usePageMeta("Patterns", `${COUNTS.patterns} AI UX patterns grouped by lifecycle.`);
  useScrollSpy(PATTERNS.map((p) => p.slug));
  return (
    <DetailLayout wide sections={GROUPS.map((g) => ({ id: g.id, title: g.title }))}>
      <PageHeader eyebrow="Patterns" title={`${COUNTS.patterns} AI UX patterns`} lead="The moments every AI product has to get right, grouped by where they sit in the life of a task. Scroll through them here; open one for the states, guidance and code." />
      <JumpChips items={GROUPS.map((g) => [`/patterns#${g.id}`, g.title, g.patterns.length])} />
      {GROUPS.map((g) => (
        <Section key={g.id} id={g.id} title={g.title} lead={GROUP_INTROS[g.id] || g.blurb}>
          <div style={{ display: "flex", flexDirection: "column", gap: 40 }}>
            {g.patterns.map((p) => <PatternBlock key={p.id} p={p} />)}
          </div>
        </Section>
      ))}
    </DetailLayout>
  );
}
export function ScreensIndex() {
  const { theme } = useSite(); const pal = usePal(theme);
  usePageMeta("Screens", "Full example screens built only from the kit.");
  const [layout, setLayout] = useLayout();
  return (
    <DetailLayout wide>
      <PageHeader eyebrow="Screens" title="Full-screen examples" lead="Whole product screens built only from the kit's patterns and components, annotated so you can see which piece does what." />
      <div style={{ marginBottom: 24 }}><LayoutToggle value={layout} onChange={setLayout} /></div>
      <div className={layout === "mobile" ? "screens-mobile" : undefined} style={{ display: "flex", flexDirection: "column", gap: 40 }}>
        {SCREENS.map((s) => (
          <div key={s.slug}>
            <div style={{ display: "flex", alignItems: "baseline", gap: 12, flexWrap: "wrap", marginBottom: 12 }}>
              <Link to={`/screens/${s.slug}`} style={{ ...tokens.type.lg, fontWeight: tokens.weight.semibold, color: pal.text }}>{s.name}</Link>
              <span style={{ ...tokens.type.sm, color: pal.textTertiary, fontFamily: tokens.font.mono }}>{s.paradigm} · {s.hotspots.length} patterns</span>
              <span style={{ flex: 1 }} />
              <Link to={`/screens/${s.slug}`} style={{ ...tokens.type.sm, color: pal.textSecondary, textDecoration: "underline", textUnderlineOffset: 3 }}>Open the anatomy</Link>
            </div>
            <Link to={`/screens/${s.slug}`} aria-label={`${s.name} screen`} style={{ display: "block" }}><ScreenStage screen={s} layout={layout} /></Link>
            <p style={{ ...tokens.type.sm, color: pal.textSecondary, lineHeight: 1.65, margin: "12px 0 0", maxWidth: 420 }}>{s.description}</p>
          </div>
        ))}
      </div>
    </DetailLayout>
  );
}

const STATUS = { match: ["Match", "success"], partial: ["Partial", "warning"], missing: ["Missing", "danger"], planned: ["Not planned", "textTertiary"], halaska: ["Halaska only", "accent"], mapped: ["Mapped", "accent"] };

export function ComponentsIndex() {
  const { theme } = useSite(); const pal = usePal(theme);
  usePageMeta("Components", `${COUNTS.components} components: shadcn/ui parity plus the Halaska additions.`);
  const groups = COMPONENT_GROUPS.map((g) => [g, COMPONENTS.filter((c) => c.group === g)]).filter(([, list]) => list.length);
  const gid = (g) => `g-${g.toLowerCase().replace(/[^a-z]+/g, "-")}`;
  useScrollSpy(COMPONENTS.map((c) => c.slug));
  return (
    <DetailLayout wide sections={[...groups.map(([g]) => ({ id: gid(g), title: g })), ...(PARITY.length ? [{ id: "parity", title: "shadcn/ui parity" }] : [])]}>
      <PageHeader eyebrow="Components" title={`${COUNTS.components} components`} lead={PARITY_SUMMARY || "The base layer under the patterns. Names follow shadcn/ui where an equivalent exists; the Halaska additions are tagged."} />
      <JumpChips items={groups.map(([g, list]) => [`/components#${gid(g)}`, g, list.length])} />
      {groups.map(([g, list]) => (
        <Section key={g} id={gid(g)} title={g} lead={`${list.length} components`}>
          <div style={{ display: "flex", flexDirection: "column", gap: 40 }}>
            {list.map((c) => <ComponentBlock key={c.slug} c={c} />)}
          </div>
        </Section>
      ))}
      {PARITY.length > 0 && (
        <Section id="parity" title="shadcn/ui parity" lead="Every component in the shadcn/ui docs, and where the kit stands on it.">
          <div className="table-wrap"><table>
            <thead><tr><th>shadcn/ui</th><th>Status</th><th>In the kit</th><th>Notes</th></tr></thead>
            <tbody>
              {PARITY.map((r) => { const [label, tone] = STATUS[r.status] || STATUS.missing; return (
                <tr key={r.shadcn}>
                  <td style={{ color: pal.text, fontWeight: 500, whiteSpace: "nowrap" }}>{r.shadcn}</td>
                  <td style={{ whiteSpace: "nowrap", color: pal[tone] || pal.textTertiary, fontFamily: tokens.font.mono, fontSize: 12 }}>{label}</td>
                  <td style={{ whiteSpace: "nowrap" }}>{r.slug ? <Link to={r.to || `/components/${r.slug}`} style={{ textDecoration: "underline", textUnderlineOffset: 3, color: pal.text }}>{r.kit || r.slug}</Link> : <span style={{ color: pal.textTertiary }}>{r.kit || "·"}</span>}</td>
                  <td style={{ color: pal.textSecondary }}>{r.note}</td>
                </tr>
              ); })}
            </tbody>
          </table></div>
        </Section>
      )}
    </DetailLayout>
  );
}
