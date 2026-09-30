// The three index pages: /screens, /patterns, /components.
import { useState } from "react";
import { usePal, tokens, motion, interactiveBase, Text } from "../kit";
import { useSite, usePageMeta } from "../state";
import { Link, useLocation } from "../router";
import { GROUPS, PATTERNS, COMPONENTS, SCREENS, COUNTS } from "../registry";
import { COMPONENT_GROUPS } from "../data/components/index.js";
import { GROUP_INTROS } from "../data/patterns/index.js";
import { PARITY, CONVERSATION_MAP, PARITY_SUMMARY } from "../data/parity.js";
import { LiveThumb, ComponentThumb } from "../ui/PreviewFrame";
import { ScreenStage, LayoutToggle, useLayout } from "../ui/ScreenStage";
import { PageHeader, Section, DetailLayout, Card, TagPill, tagTone, ChipLink } from "../ui/bits";

export function PatternCard({ pattern }) {
  const { theme } = useSite(); const pal = usePal(theme);
  const Comp = pattern.Component;
  return (
    <Card to={`/patterns/${pattern.slug}`}>
      <LiveThumb width={600} height={Math.min(400, (pattern.height || 480) - 80)} scale={0.5} housed={pattern.housed}>{Comp && <Comp />}</LiveThumb>
      <div>
        <div style={{ ...tokens.type.base, fontWeight: tokens.weight.semibold, color: pal.text }}>{pattern.title}</div>
        <div style={{ ...tokens.type.sm, color: pal.textSecondary, lineHeight: 1.55, marginTop: 2 }}>{pattern.docs.useWhen || pattern.desc}</div>
      </div>
    </Card>
  );
}

export function PatternsIndex() {
  const { theme } = useSite(); const pal = usePal(theme);
  const [filter, setFilter] = useState("all");
  usePageMeta("Patterns", `${COUNTS.patterns} AI UX patterns grouped by lifecycle.`);
  const shown = filter === "all" ? GROUPS : GROUPS.filter((g) => g.id === filter);
  const chip = (id, label, n) => (
    <button key={id} type="button" aria-pressed={filter === id} onClick={() => setFilter(id)}
      style={{ ...interactiveBase, height: 30, padding: "0 12px", borderRadius: tokens.radius.pill, display: "inline-flex", alignItems: "center", gap: 8, ...tokens.type.sm, whiteSpace: "nowrap", background: filter === id ? pal.text : pal.bgSubtle, color: filter === id ? pal.bg : pal.textSecondary, boxShadow: filter === id ? "none" : `inset 0 0 0 1px ${pal.borderSubtle}` }}>
      {label}<span style={{ fontFamily: tokens.font.mono, ...tokens.type.xs, opacity: 0.7 }}>{n}</span>
    </button>
  );
  return (
    <DetailLayout wide>
      <PageHeader eyebrow="Patterns" title={`${COUNTS.patterns} AI UX patterns`} lead="The moments every AI product has to get right, grouped by where they sit in the life of a task. Each one says when to use it." />
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 8 }}>
        {chip("all", "All", COUNTS.patterns)}
        {GROUPS.map((g) => chip(g.id, g.title, g.patterns.length))}
      </div>
      {shown.map((g) => (
        <Section key={g.id} id={g.id} title={g.title} lead={GROUP_INTROS[g.id] || g.blurb}>
          <div className="grid-cards" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))" }}>
            {g.patterns.map((p) => <PatternCard key={p.id} pattern={p} />)}
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
            <p style={{ ...tokens.type.sm, color: pal.textSecondary, lineHeight: 1.65, margin: "12px 0 0", maxWidth: 640 }}>{s.description}</p>
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
  return (
    <DetailLayout wide sections={[...groups.map(([g]) => ({ id: `g-${g.toLowerCase().replace(/[^a-z]+/g, "-")}`, title: g })), ...(PARITY.length ? [{ id: "parity", title: "shadcn/ui parity" }] : [])]}>
      <PageHeader eyebrow="Components" title={`${COUNTS.components} components`} lead={PARITY_SUMMARY || "The base layer under the patterns. Names follow shadcn/ui where an equivalent exists; the Halaska additions are tagged."} />
      {groups.map(([g, list]) => (
        <Section key={g} id={`g-${g.toLowerCase().replace(/[^a-z]+/g, "-")}`} title={g} lead={`${list.length} components`}>
          <div className="grid-cards" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))" }}>
            {list.map((c) => (
              <Card key={c.slug} to={`/components/${c.slug}`} style={{ gap: 6 }}>
                <div style={{ marginBottom: 6 }}><ComponentThumb slug={c.slug} /></div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ ...tokens.type.base, fontWeight: tokens.weight.semibold, color: pal.text, flex: 1, minWidth: 0 }}>{c.name}</span>
                  {(c.tags || []).map((t) => <TagPill key={t} tone={tagTone(t)}>{t}</TagPill>)}
                </div>
                <div style={{ ...tokens.type.sm, color: pal.textSecondary, lineHeight: 1.55 }}>{c.description}</div>
              </Card>
            ))}
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
