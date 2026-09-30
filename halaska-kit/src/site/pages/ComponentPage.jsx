// The component template. Every component page uses it, no exceptions:
// header, hero preview (its Code tab holds the usage snippet), examples,
// used in, accessibility, previous and next.
import { useEffect, useState } from "react";
import { usePal, tokens, Text } from "../kit";
import { useSite, usePageMeta } from "../state";
import { COMPONENTS, relations, patternById, SCREENS } from "../registry";
import { componentBySlug } from "../data/components/index.js";
import { loadComponentExamples } from "../ui/examples";
import { PreviewFrame } from "../ui/PreviewFrame";
import { PageHeader, Section, ChipLink, PrevNext, DetailLayout, Prose, TagPill } from "../ui/bits";
import { AddToProject } from "../email/gate";
import { NotFound } from "./NotFound";

const STATUS_LABEL = { match: "Matches shadcn/ui", partial: "Partial parity", halaska: "Halaska only" };

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
    ...(rest.length ? [{ id: "examples", title: "Examples" }] : []),
    ...(rel.patterns.length || rel.screens.length ? [{ id: "used-in", title: "Used in" }] : []),
    ...(meta.a11y?.length ? [{ id: "accessibility", title: "Accessibility" }] : []),
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
        <PreviewFrame code={data.usage ? `${data.usage.trim()}\n\n// The example in the preview\n${hero.code}` : hero.code} minHeight={280}><hero.Component /></PreviewFrame>
      ) : (
        <PreviewFrame minHeight={280} toolbar={false}><Text size="sm" style={{ color: pal.textTertiary }}>{data ? "Examples for this component are on their way." : "Loading"}</Text></PreviewFrame>
      )}

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

      {(rel.patterns.length > 0 || rel.screens.length > 0) && (
        <Section id="used-in" title="Used in" lead="The screens and patterns that are built with this component.">
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {rel.screens.map((s) => { const sc = SCREENS.find((x) => x.slug === s); return sc && <ChipLink key={s} to={`/screens/${s}`}>{sc.name} screen</ChipLink>; })}
            {rel.patterns.map((id) => { const p = patternById(id); return p && <ChipLink key={id} to={`/patterns/${p.slug}`}>{p.title}</ChipLink>; })}
          </div>
        </Section>
      )}

      {meta.a11y?.length > 0 && (
        <Section id="accessibility" title="Accessibility">
          <Prose><ul style={{ margin: 0, paddingLeft: 18 }}>{meta.a11y.map((line, k) => <li key={k} style={{ marginBottom: 6 }}>{line}</li>)}</ul></Prose>
        </Section>
      )}

      <AddToProject />
      <PrevNext prev={link(COMPONENTS[i - 1])} next={link(COMPONENTS[i + 1])} />
    </DetailLayout>
  );
}
