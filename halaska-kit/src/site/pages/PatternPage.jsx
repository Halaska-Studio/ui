// The pattern template: header with "Use when", hero preview, states,
// guidance, built from, code, seen in.
import { useEffect, useState } from "react";
import { usePal, tokens, Text, Collapsible } from "../kit";
import { useSite, usePageMeta } from "../state";
import { PATTERNS, patternBySlug, patternById, relations, SCREENS } from "../registry";
import { componentBySlug } from "../data/components/index.js";
import { loadPatternExamples } from "../ui/examples";
import { PreviewFrame } from "../ui/PreviewFrame";
import { CodeBlock } from "../ui/CodeBlock";
import { PageHeader, Section, ChipLink, PrevNext, DetailLayout, Prose } from "../ui/bits";
import { AddToProject } from "../email/gate";
import { NotFound } from "./NotFound";

let sourceMap = null;
function Source({ component }) {
  const [code, setCode] = useState(null);
  const [open, setOpen] = useState(false);
  const { theme } = useSite(); const pal = usePal(theme);
  const load = () => {
    setOpen(true);
    if (code) return;
    (sourceMap ? Promise.resolve(sourceMap) : fetch("/source-map.json").then((r) => r.json()).then((j) => (sourceMap = j)))
      .then((j) => setCode(j.blocks?.[component] || "// Source not found in this build."))
      .catch(() => setCode("// Couldn't load the source just now."));
  };
  return open ? (
    <div style={{ marginTop: 12 }}><CodeBlock code={code || "// Loading"} maxHeight={520} /></div>
  ) : (
    <button type="button" onClick={load} style={{ marginTop: 12, border: "none", background: "transparent", padding: 0, cursor: "pointer", ...tokens.type.sm, color: pal.textSecondary, textDecoration: "underline", textUnderlineOffset: 3, fontFamily: tokens.font.sans }}>
      Show the full source of {component}
    </button>
  );
}

export function PatternPage({ slug }) {
  const { theme } = useSite(); const pal = usePal(theme);
  const pat = patternBySlug(slug);
  const [extra, setExtra] = useState(null);
  const docs = pat?.docs || {};
  usePageMeta(pat?.title, docs.useWhen || pat?.desc);
  useEffect(() => {
    let live = true; setExtra(null);
    loadPatternExamples(slug).then((d) => { if (live) setExtra(d); });
    return () => { live = false; };
  }, [slug]);
  if (!pat) return <NotFound />;
  const i = PATTERNS.findIndex((p) => p.slug === slug);
  const rel = relations.patterns[pat.id] || { components: [], screens: [] };
  const usage = docs.usage || extra?.usage || `import { ${pat.component} } from "./halaska-kit";\n\n<${pat.component} />`;
  const states = extra?.examples || [];
  const sections = [
    { id: "states", title: "States" }, { id: "guidance", title: "Guidance" },
    ...(rel.components.length ? [{ id: "built-from", title: "Built from" }] : []),
    { id: "code", title: "Code" },
    ...(rel.screens.length ? [{ id: "seen-in", title: "Seen in" }] : []),
  ];
  const link = (p) => p && { to: `/patterns/${p.slug}`, label: p.title };
  const Comp = pat.Component;
  const list = (items, mark, color) => (
    <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 8 }}>
      {items.map((t, k) => <li key={k} style={{ display: "flex", gap: 10, ...tokens.type.sm, color: pal.textSecondary, lineHeight: 1.6 }}><span style={{ color, flexShrink: 0 }}>{mark}</span><span>{t}</span></li>)}
    </ul>
  );
  return (
    <DetailLayout sections={sections}>
      <PageHeader eyebrow={pat.group} eyebrowTo={`/patterns#${pat.groupId}`} title={pat.title} lead={pat.desc}>
        <div style={{ marginTop: 16, padding: "12px 14px", borderRadius: tokens.radius.md, background: pal.bgSubtle, border: `1px solid ${pal.borderSubtle}`, ...tokens.type.base, color: pal.text, lineHeight: 1.6, maxWidth: 640 }}>
          <span style={{ fontFamily: tokens.font.mono, ...tokens.type.xs, color: pal.textTertiary, display: "block", marginBottom: 2, letterSpacing: "0.06em", textTransform: "uppercase" }}>Use when</span>
          {docs.useWhen || "Guidance for this pattern is being written."}
        </div>
      </PageHeader>

      <PreviewFrame code={usage} replay={pat.replay} housed={pat.housed} align="top" minHeight={Math.max(280, (pat.height || 480) - 72)}>
        {({ key }) => <Comp key={key} />}
      </PreviewFrame>

      <Section id="states" title="States" lead={states.length ? "Each state, rendered live." : undefined}>
        {states.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 24, marginBottom: docs.states?.length ? 24 : 0 }}>
            {states.map((ex) => (
              <div key={ex.name}>
                <h3 style={{ ...tokens.type.base, fontWeight: tokens.weight.semibold, color: pal.text, margin: "0 0 4px" }}>{ex.title}</h3>
                {ex.description && <p style={{ ...tokens.type.sm, color: pal.textSecondary, margin: "0 0 12px", lineHeight: 1.6 }}>{ex.description}</p>}
                <PreviewFrame code={ex.code} align="top" minHeight={220} replay>{({ key }) => <ex.Component key={key} />}</PreviewFrame>
              </div>
            ))}
          </div>
        )}
        {docs.states?.length > 0 ? (
          <div className="table-wrap"><table><thead><tr><th>State</th><th>What the user sees</th></tr></thead><tbody>
            {docs.states.map((st) => <tr key={st.name}><td style={{ color: pal.text, fontWeight: 500, whiteSpace: "nowrap" }}>{st.name}</td><td style={{ color: pal.textSecondary }}>{st.note}</td></tr>)}
          </tbody></table></div>
        ) : !states.length && <Text size="sm" style={{ color: pal.textTertiary }}>The states for this pattern are being documented.</Text>}
      </Section>

      <Section id="guidance" title="Guidance">
        <div className="stack-sm" style={{ display: "flex", gap: 32, alignItems: "flex-start" }}>
          <div style={{ flex: 1, minWidth: 0 }}><div style={{ ...tokens.type.xs, fontFamily: tokens.font.mono, letterSpacing: "0.06em", textTransform: "uppercase", color: pal.textTertiary, marginBottom: 10 }}>Do</div>{list(docs.do || [], "✓", pal.success)}</div>
          <div style={{ flex: 1, minWidth: 0 }}><div style={{ ...tokens.type.xs, fontFamily: tokens.font.mono, letterSpacing: "0.06em", textTransform: "uppercase", color: pal.textTertiary, marginBottom: 10 }}>Don't</div>{list(docs.dont || [], "✕", pal.danger)}</div>
        </div>
        {docs.neighbours?.length > 0 && (
          <div style={{ marginTop: 24 }}>
            <div style={{ ...tokens.type.xs, fontFamily: tokens.font.mono, letterSpacing: "0.06em", textTransform: "uppercase", color: pal.textTertiary, marginBottom: 10 }}>Or reach for</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {docs.neighbours.map((n) => { const other = patternById(n.id); return other && (
                <div key={n.id} style={{ display: "flex", gap: 12, alignItems: "baseline", flexWrap: "wrap" }}>
                  <ChipLink to={`/patterns/${other.slug}`}>{other.title}</ChipLink>
                  <span style={{ ...tokens.type.sm, color: pal.textSecondary, flex: 1, minWidth: 200 }}>{n.when}</span>
                </div>
              ); })}
            </div>
          </div>
        )}
      </Section>

      {rel.components.length > 0 && (
        <Section id="built-from" title="Built from">
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {rel.components.map((s) => { const c = componentBySlug(s); return c && <ChipLink key={s} to={`/components/${s}`}>{c.name}</ChipLink>; })}
          </div>
        </Section>
      )}

      <Section id="code" title="Code">
        <CodeBlock code={usage} />
        <Source component={pat.component} />
      </Section>

      {rel.screens.length > 0 && (
        <Section id="seen-in" title="Seen in">
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {rel.screens.map((s) => { const sc = SCREENS.find((x) => x.slug === s); return sc && <ChipLink key={s} to={`/screens/${s}`}>{sc.name} screen</ChipLink>; })}
          </div>
        </Section>
      )}

      <AddToProject target={{ type: "pattern", slug: pat.slug, title: pat.title, component: pat.component, desc: pat.desc, useWhen: docs.useWhen }} />
      <PrevNext prev={link(PATTERNS[i - 1])} next={link(PATTERNS[i + 1])} />
    </DetailLayout>
  );
}
