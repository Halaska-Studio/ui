// A full example screen, rendered live at its design size and scaled to the
// space available. Every screen has a desktop and a mobile layout; the
// LayoutToggle switches between them. Optional numbered hotspots link to the
// patterns in each region.
import { useEffect, useRef, useState } from "react";
import {
  ThemeProvider, AccentContext, usePal, tokens, motion, interactiveBase,
  CompareSlider, ChatParadigmBefore, ChatParadigmExample, PARADIGM_STAGE, PARADIGM_STAGE_MOBILE,
} from "../kit";
import { useSite } from "../state";
import { Link } from "../router";
import { screenComponent, patternById } from "../registry";
import { useInView } from "./PreviewFrame";

export const STAGE = PARADIGM_STAGE;
export const STAGE_MOBILE = PARADIGM_STAGE_MOBILE;
export const stageFor = (layout) => (layout === "mobile" ? STAGE_MOBILE : STAGE);
export const spotsFor = (screen, layout) => (layout === "mobile" && screen.hotspotsMobile) || screen.hotspots;

// Phones start on the mobile layout, everything else on desktop. The choice
// is the visitor's after that.
export function useLayout() {
  return useState(() => (typeof window !== "undefined" && window.innerWidth < 720 ? "mobile" : "desktop"));
}

const ICONS = {
  desktop: <><rect x="3" y="4.5" width="18" height="12" rx="2" /><path d="M8.5 20h7M12 16.5V20" /></>,
  mobile: <><rect x="7.5" y="3" width="9" height="18" rx="2.5" /><path d="M11 18h2" /></>,
};

export function LayoutToggle({ value, onChange }) {
  const pal = usePal(useSite().theme);
  return (
    <div role="radiogroup" aria-label="Layout" style={{ display: "inline-flex", gap: 2, padding: 3, borderRadius: tokens.radius.md, background: pal.bgSubtle, border: `1px solid ${pal.borderSubtle}` }}>
      {["desktop", "mobile"].map((id) => {
        const on = value === id;
        return (
          <button key={id} type="button" role="radio" aria-checked={on} onClick={() => onChange(id)}
            style={{
              ...interactiveBase, height: 28, padding: "0 10px", borderRadius: tokens.radius.sm, display: "inline-flex", alignItems: "center", gap: 6,
              ...tokens.type.xs, fontWeight: on ? tokens.weight.medium : tokens.weight.regular,
              background: on ? pal.bgElevated : "transparent", color: on ? pal.text : pal.textTertiary,
              boxShadow: on ? `0 1px 2px ${pal.shadow}, 0 0 0 1px ${pal.borderSubtle}` : "none",
              transition: `background ${motion.fast} ${motion.easeOut}, color ${motion.normal} ${motion.easeInOut}`,
            }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{ICONS[id]}</svg>
            {id === "desktop" ? "Desktop" : "Mobile"}
          </button>
        );
      })}
    </div>
  );
}

// Measures the available width and returns the scale that fits the stage.
function useFit(stageWidth) {
  const ref = useRef(null);
  const [scale, setScale] = useState(stageWidth > 600 ? 0.5 : 1);
  useEffect(() => {
    const measure = () => { if (ref.current) setScale(Math.min(1, ref.current.clientWidth / stageWidth)); };
    measure();
    const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(measure) : null;
    if (ro && ref.current) ro.observe(ref.current);
    window.addEventListener("resize", measure);
    return () => { if (ro) ro.disconnect(); window.removeEventListener("resize", measure); };
  }, [stageWidth]);
  return [ref, scale];
}

const frameRadius = (layout, scale) => (layout === "mobile" ? Math.round(28 * scale) : tokens.radius.lg);

export function ScreenStage({ screen, layout = "desktop", hotspots = false, interactive = false, activeSpot, onSpot }) {
  const site = useSite();
  const pal = usePal(site.theme);
  const stage = stageFor(layout);
  const [boxRef, scale] = useFit(stage.w);
  const [ref, seen] = useInView("300px");
  const Example = screenComponent(screen);
  const spots = spotsFor(screen, layout);
  return (
    <div ref={ref}>
      <div ref={boxRef} style={{ width: "100%", display: "flex", justifyContent: "center" }}>
        <div style={{
          position: "relative", width: Math.round(stage.w * scale), height: Math.round(stage.h * scale), overflow: "hidden", flexShrink: 0,
          borderRadius: frameRadius(layout, scale), border: `1px solid ${pal.borderSubtle}`, background: pal.bgSubtle,
          boxShadow: `0 8px 32px ${pal.shadow}`, transition: `border-color ${motion.smooth} ${motion.easeInOut}`,
        }}>
          <div style={{ position: "absolute", top: 0, left: 0, width: stage.w, height: stage.h, transform: `scale(${scale})`, transformOrigin: "top left", pointerEvents: interactive ? "auto" : "none" }}>
            {seen && Example && (
              <AccentContext.Provider value={site.accent}><ThemeProvider theme={site.theme}><Example key={layout} theme={site.theme} layout={layout} /></ThemeProvider></AccentContext.Provider>
            )}
          </div>
          {hotspots && spots.map((h, i) => {
            const pattern = patternById(h.pattern);
            const on = activeSpot === i;
            return (
              <Link key={i} to={pattern ? `/patterns/${pattern.slug}` : "/patterns"} aria-label={`${i + 1}. ${pattern?.title || "Pattern"}`} title={pattern?.title}
                onMouseEnter={() => onSpot?.(i)} onMouseLeave={() => onSpot?.(null)} onFocus={() => onSpot?.(i)} onBlur={() => onSpot?.(null)}
                style={{
                  position: "absolute", left: `${h.x}%`, top: `${h.y}%`, width: 24, height: 24, marginLeft: -12, marginTop: -12, borderRadius: 12,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  background: pal.accent, color: "#fff", fontFamily: tokens.font.mono, fontSize: 11, fontWeight: 600,
                  boxShadow: on ? `0 0 0 6px ${pal.accentBg}, 0 4px 12px rgba(0,0,0,0.25)` : `0 0 0 3px ${pal.bg}, 0 2px 8px rgba(0,0,0,0.2)`,
                  transform: on ? "scale(1.15)" : "scale(1)", transition: `transform ${motion.fast} ${motion.easeOut}, box-shadow ${motion.fast} ${motion.easeOut}`,
                }}>{i + 1}</Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// One side of the comparison: a screen at its design size, scaled.
function Scaled({ stage, scale, children }) {
  const pal = usePal(useSite().theme);
  return (
    <div style={{ position: "relative", width: "100%", height: Math.round(stage.h * scale), overflow: "hidden", background: pal.bgSubtle }}>
      <div style={{ position: "absolute", top: 0, left: 0, width: stage.w, height: stage.h, transform: `scale(${scale})`, transformOrigin: "top left", pointerEvents: "none" }}>
        {children}
      </div>
    </div>
  );
}

// Before and after: the Chat screen as a coding agent left it, then with the
// kit applied, in either layout.
export function BeforeAfter({ layout = "desktop" }) {
  const site = useSite();
  const pal = usePal(site.theme);
  const stage = stageFor(layout);
  const [boxRef, scale] = useFit(stage.w);
  const [ref, seen] = useInView("300px");
  return (
    <div ref={ref}>
      <div ref={boxRef} style={{ width: "100%", display: "flex", justifyContent: "center" }}>
        <div style={{
          width: Math.round(stage.w * scale), flexShrink: 0, overflow: "hidden", borderRadius: frameRadius(layout, scale),
          border: `1px solid ${pal.borderSubtle}`, boxShadow: `0 8px 32px ${pal.shadow}`, minHeight: Math.round(stage.h * scale), background: pal.bgSubtle,
        }}>
          {seen && (
            <AccentContext.Provider value={site.accent}><ThemeProvider theme={site.theme}>
              <CompareSlider key={layout} theme={site.theme}
                before={<Scaled stage={stage} scale={scale}><ChatParadigmBefore theme={site.theme} layout={layout} /></Scaled>}
                after={<Scaled stage={stage} scale={scale}><ChatParadigmExample theme={site.theme} layout={layout} /></Scaled>} />
            </ThemeProvider></AccentContext.Provider>
          )}
        </div>
      </div>
    </div>
  );
}
