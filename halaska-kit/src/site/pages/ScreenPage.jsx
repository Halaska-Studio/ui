// The screen template: header, full preview with a desktop and mobile
// toggle and a full-screen action, anatomy with numbered hotspots, code.
import { useEffect, useState } from "react";
import { usePal, tokens, motion, interactiveBase, Button, IconButton, ThemeProvider, AccentContext } from "../kit";
import { useSite, usePageMeta } from "../state";
import { Link } from "../router";
import { SCREENS, patternById, screenComponent, relations } from "../registry";
import { screenBySlug } from "../data/screens.js";
import { componentBySlug } from "../data/components/index.js";
import { ScreenStage, LayoutToggle, useLayout, stageFor, spotsFor } from "../ui/ScreenStage";
import { CodeBlock } from "../ui/CodeBlock";
import { PageHeader, Section, ChipLink, PrevNext, DetailLayout } from "../ui/bits";
import { AddToProject } from "../email/gate";
import { NotFound } from "./NotFound";

function Fullscreen({ screen, layout, onClose }) {
  const site = useSite();
  const pal = usePal(site.theme);
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow; document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", onKey); document.body.style.overflow = prev; };
  }, [onClose]);
  const Example = screenComponent(screen);
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 1100, padding: 20, display: "flex", background: "rgba(0,0,0,0.5)", backdropFilter: "blur(6px)", WebkitBackdropFilter: "blur(6px)", animation: `halaska-fade-in ${motion.normal} ${motion.easeOut} both` }}>
      <div role="dialog" aria-modal="true" aria-label={`${screen.name} screen`} onClick={(e) => e.stopPropagation()} style={{ flex: 1, minWidth: 0, position: "relative", overflow: "auto", background: pal.bg, borderRadius: tokens.radius.xl, border: `1px solid ${pal.borderSubtle}`, boxShadow: "0 24px 80px rgba(0,0,0,0.35)", animation: `halaska-scale-in ${motion.smooth} ${motion.emphasized} both` }}>
        <div style={{ position: "absolute", top: 12, right: 12, zIndex: 5 }}>
          <IconButton theme={site.theme} icon="✕" size={36} variant="secondary" label="Close" onClick={onClose} />
        </div>
        {layout === "mobile" ? (
          <div style={{ minHeight: "100%", boxSizing: "border-box", display: "flex", justifyContent: "center", alignItems: "center", padding: "56px 12px 16px", background: pal.bgSubtle }}>
            <div style={{ width: stageFor(layout).w, maxWidth: "100%", height: stageFor(layout).h, position: "relative", overflow: "hidden", borderRadius: 28, border: `1px solid ${pal.borderSubtle}`, boxShadow: `0 8px 32px ${pal.shadow}` }}>
              <AccentContext.Provider value={site.accent}><ThemeProvider theme={site.theme}><Example theme={site.theme} layout="mobile" /></ThemeProvider></AccentContext.Provider>
            </div>
          </div>
        ) : (
          <div style={{ minWidth: 1000, height: "100%", position: "relative" }}>
            <AccentContext.Provider value={site.accent}><ThemeProvider theme={site.theme}><Example theme={site.theme} /></ThemeProvider></AccentContext.Provider>
          </div>
        )}
      </div>
    </div>
  );
}

let sourceMap = null;
export function ScreenPage({ slug }) {
  const { theme } = useSite(); const pal = usePal(theme);
  const screen = screenBySlug(slug);
  const [layout, setLayout] = useLayout();
  const [full, setFull] = useState(false);
  const [spot, setSpot] = useState(null);
  const [code, setCode] = useState(null);
  usePageMeta(screen ? `${screen.name} screen` : null, screen?.scenario);
  useEffect(() => {
    if (!screen) return;
    let live = true; setCode(null);
    (sourceMap ? Promise.resolve(sourceMap) : fetch("/source-map.json").then((r) => r.json()).then((j) => (sourceMap = j)))
      .then((j) => { if (live) setCode(j.blocks?.[screen.component] || ""); }).catch(() => { if (live) setCode(""); });
    return () => { live = false; };
  }, [slug]);
  if (!screen) return <NotFound />;
  const i = SCREENS.findIndex((s) => s.slug === slug);
  const rel = relations.screens[slug] || { patterns: [], components: [] };
  const link = (s) => s && { to: `/screens/${s.slug}`, label: s.name };
  const sections = [{ id: "anatomy", title: "Anatomy" }, { id: "built-from", title: "Built from" }, { id: "code", title: "Code" }];
  return (
    <DetailLayout sections={sections} wide>
      <PageHeader eyebrow={`${screen.paradigm} paradigm`} eyebrowTo="/screens" title={screen.name} lead={screen.scenario} />

      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 12, flexWrap: "wrap" }}>
        <LayoutToggle value={layout} onChange={(v) => { setLayout(v); setSpot(null); }} />
        <span style={{ flex: 1 }} />
        <Button theme={theme} variant="secondary" size="sm" icon="⤢" onClick={() => setFull(true)}>Open full screen</Button>
      </div>
      <ScreenStage screen={screen} layout={layout} interactive />
      {full && <Fullscreen screen={screen} layout={layout} onClose={() => setFull(false)} />}

      <Section id="anatomy" title="Anatomy" lead="Each number is a pattern from the kit. Select one to open its page.">
        <ScreenStage screen={screen} layout={layout} hotspots activeSpot={spot} onSpot={setSpot} />
        <ol style={{ listStyle: "none", margin: "20px 0 0", padding: 0, display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "10px 28px" }}>
          {spotsFor(screen, layout).map((h, k) => { const p = patternById(h.pattern); return (
            <li key={k} onMouseEnter={() => setSpot(k)} onMouseLeave={() => setSpot(null)} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
              <span style={{ width: 22, height: 22, borderRadius: 11, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", background: spot === k ? pal.accent : pal.accentBg, color: spot === k ? "#fff" : pal.accentText, fontFamily: tokens.font.mono, fontSize: 11, fontWeight: 600, transition: `background ${motion.fast} ${motion.easeOut}` }}>{k + 1}</span>
              <span style={{ minWidth: 0 }}>
                <Link to={p ? `/patterns/${p.slug}` : "/patterns"} style={{ ...tokens.type.sm, fontWeight: tokens.weight.medium, color: pal.text, display: "block" }}>{p?.title || h.pattern}</Link>
                <span style={{ ...tokens.type.sm, color: pal.textSecondary, lineHeight: 1.55 }}>{h.note}</span>
              </span>
            </li>
          ); })}
        </ol>
      </Section>

      <Section id="built-from" title="Built from" lead="Every component this screen renders, directly or through its patterns.">
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {rel.components.map((s) => { const c = componentBySlug(s); return c && <ChipLink key={s} to={`/components/${s}`}>{c.name}</ChipLink>; })}
        </div>
      </Section>

      <Section id="code" title="Code" lead={`The full composition of ${screen.component}.`}>
        <CodeBlock code={code == null ? "// Loading" : code || `import { ${screen.component} } from "./halaska-kit";\n\n<${screen.component} />`} maxHeight={560} />
      </Section>

      <AddToProject target={{ type: "screen", slug: screen.slug, name: screen.name, component: screen.component }} />
      <PrevNext prev={link(SCREENS[i - 1])} next={link(SCREENS[i + 1])} />
    </DetailLayout>
  );
}
