// The component template. Every component page uses it, no exceptions:
// header, hero preview, usage, examples, props, accessibility, used in,
// previous and next.
import { useEffect, useState } from "react";
import { usePal, tokens, Text } from "../kit";
import { useSite, usePageMeta } from "../state";
import { COMPONENTS, relations, patternById, SCREENS } from "../registry";
import { componentBySlug } from "../data/components/index.js";
import api from "../generated/api.json";
import { loadComponentExamples } from "../ui/examples";
import { PreviewFrame } from "../ui/PreviewFrame";
import { CodeBlock } from "../ui/CodeBlock";
import { PageHeader, Section, ChipLink, PrevNext, DetailLayout, Prose, TagPill } from "../ui/bits";
import { AddToProject } from "../email/gate";
import { NotFound } from "./NotFound";

const STATUS_LABEL = { match: "Matches shadcn/ui", partial: "Partial parity", halaska: "Halaska only" };

function PropsTable({ name }) {
  const { theme } = useSite(); const pal = usePal(theme);
  const rows = api[name];
  if (!rows?.length) return null;
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ ...tokens.type.sm, fontFamily: tokens.font.mono, color: pal.text, marginBottom: 8 }}>{name}</div>
      <div className="table-wrap">
        <table>
          <thead><tr><th>Prop</th><th>Type</th><th>Default</th><th>Description</th></tr></thead>
          <tbody>
            {rows.map((p) => (
              <tr key={p.name}>
                <td style={{ fontFamily: tokens.font.mono, color: pal.text, whiteSpace: "nowrap" }}>{p.name}</td>
                <td style={{ fontFamily: tokens.font.mono, color: pal.textSecondary, fontSize: 12 }}>{p.type}</td>
                <td style={{ fontFamily: tokens.font.mono, color: pal.textTertiary, fontSize: 12, whiteSpace: "nowrap" }}>{p.default ?? "·"}</td>
                <td style={{ color: pal.textSecondary }}>{p.description || ""}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function ComponentPage({ slug }) {
  const { theme } = useSite(); const pal = usePal(theme);
  const meta = componentBySlug(slug);
  const [data, setData] = useState(null);
  usePageMeta(meta?.name, meta?.description);
  useEffect(() => {
    let live = true; setData(null);
    loadComponentExamples(slug).then((d) => { if (live) setData(d || { usage: "", examples: [] }); });
    return () => { live = false; };
  }, [slug]);
  if (!meta) return <NotFound />;
  const i = COMPONENTS.findIndex((c) => c.slug === slug);
  const rel = relations.components[slug] || { patterns: [], screens: [] };
  const [hero, ...rest] = data?.examples || [];
  const sections = [
    { id: "usage", title: "Usage" },
    ...(rest.length ? [{ id: "examples", title: "Examples" }] : []),
    { id: "props", title: "Props" },
    ...(meta.a11y?.length ? [{ id: "accessibility", title: "Accessibility" }] : []),
    ...(rel.patterns.length || rel.screens.length ? [{ id: "used-in", title: "Used in" }] : []),
  ];
  const link = (c) => c && { to: `/components/${c.slug}`, label: c.name };
  return (
    <DetailLayout sections={sections}>
      <PageHeader eyebrow={meta.group} eyebrowTo="/components" title={meta.name} lead={meta.description} tags={meta.tags || []}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginTop: 14, ...tokens.type.sm, color: pal.textTertiary }}>
          <TagPill>{STATUS_LABEL[meta.status] || "Halaska only"}</TagPill>
          {meta.shadcn && <span>shadcn/ui equivalent: <a href={`https://ui.shadcn.com/docs/components/${meta.shadcn.toLowerCase().replace(/\s+/g, "-")}`} target="_blank" rel="noreferrer" style={{ textDecoration: "underline", textUnderlineOffset: 3 }}>{meta.shadcn}</a></span>}
          <span style={{ fontFamily: tokens.font.mono }}>{(meta.exports || []).join(", ")}</span>
        </div>
      </PageHeader>

      {hero ? (
        <PreviewFrame code={hero.code} minHeight={280}><hero.Component /></PreviewFrame>
      ) : (
        <PreviewFrame minHeight={280} toolbar={false}><Text size="sm" style={{ color: pal.textTertiary }}>{data ? "Examples for this component are on their way." : "Loading"}</Text></PreviewFrame>
      )}

      <Section id="usage" title="Usage">
        <CodeBlock code={data?.usage || `import { ${(meta.exports || [meta.name])[0]} } from "./halaska-kit";`} />
      </Section>

      {rest.length > 0 && (
        <Section id="examples" title="Examples">
          <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
            {rest.map((ex) => (
              <div key={ex.name} id={`ex-${ex.name.toLowerCase()}`}>
                <h3 style={{ ...tokens.type.base, fontWeight: tokens.weight.semibold, color: pal.text, margin: "0 0 4px" }}>{ex.title}</h3>
                {ex.description && <p style={{ ...tokens.type.sm, color: pal.textSecondary, margin: "0 0 12px", lineHeight: 1.6 }}>{ex.description}</p>}
                <PreviewFrame code={ex.code} minHeight={200}><ex.Component /></PreviewFrame>
              </div>
            ))}
          </div>
        </Section>
      )}

      <Section id="props" title="Props" lead="Read from the kit's own function signatures at build time.">
        {(meta.exports || []).map((name) => <PropsTable key={name} name={name} />)}
      </Section>

      {meta.a11y?.length > 0 && (
        <Section id="accessibility" title="Accessibility">
          <Prose><ul style={{ margin: 0, paddingLeft: 18 }}>{meta.a11y.map((line, k) => <li key={k} style={{ marginBottom: 6 }}>{line}</li>)}</ul></Prose>
        </Section>
      )}

      {(rel.patterns.length > 0 || rel.screens.length > 0) && (
        <Section id="used-in" title="Used in">
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {rel.screens.map((s) => { const sc = SCREENS.find((x) => x.slug === s); return sc && <ChipLink key={s} to={`/screens/${s}`}>{sc.name} screen</ChipLink>; })}
            {rel.patterns.map((id) => { const p = patternById(id); return p && <ChipLink key={id} to={`/patterns/${p.slug}`}>{p.title}</ChipLink>; })}
          </div>
        </Section>
      )}

      <AddToProject />
      <PrevNext prev={link(COMPONENTS[i - 1])} next={link(COMPONENTS[i + 1])} />
    </DetailLayout>
  );
}
