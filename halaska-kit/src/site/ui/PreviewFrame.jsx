// The one preview frame, used by every template and by the landing page.
// A quiet canvas, a toolbar (Preview / Code, theme, colour scheme, copy), and
// the content centred on it. Content mounts when the frame nears the viewport.
import { Component, useEffect, useRef, useState } from "react";
import { ThemeProvider, AccentContext, ACCENT_COLORS, usePal, tokens, motion, interactiveBase } from "../kit";
import { useSite } from "../state";
import { CodeBlock, CopyButton } from "./CodeBlock";

export function useInView(margin = "400px") {
  const ref = useRef(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    if (seen || !ref.current) return;
    if (typeof IntersectionObserver === "undefined") { setSeen(true); return; }
    const io = new IntersectionObserver((entries) => { if (entries.some((e) => e.isIntersecting)) { setSeen(true); io.disconnect(); } }, { rootMargin: margin });
    io.observe(ref.current);
    return () => io.disconnect();
  }, [seen, margin]);
  return [ref, seen];
}

// A broken example should cost its own frame, not the page.
class Boundary extends Component {
  constructor(props) { super(props); this.state = { failed: false }; }
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch(error) { console.error("Preview failed:", error); }
  render() {
    return this.state.failed
      ? <span data-preview-error style={{ fontFamily: tokens.font.sans, fontSize: 13, opacity: 0.6 }}>This preview failed to render.</span>
      : this.props.children;
  }
}

function ToolButton({ children, label, active, onClick, pal, width = 28 }) {
  const [hover, setHover] = useState(false);
  return (
    <button type="button" aria-label={label} title={label} onClick={onClick}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        ...interactiveBase, minWidth: width, height: 28, padding: width === 28 ? 0 : "0 10px", borderRadius: tokens.radius.sm,
        display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 6, flexShrink: 0,
        ...tokens.type.xs, fontWeight: active ? tokens.weight.medium : tokens.weight.regular,
        background: active ? pal.bgMuted : hover ? pal.bgMuted : "transparent", color: active ? pal.text : pal.textTertiary,
        transition: `background ${motion.fast} ${motion.easeOut}, color ${motion.normal} ${motion.easeInOut}`,
      }}>{children}</button>
  );
}

export function PreviewFrame({
  children, code, title, minHeight = 240, align = "center", pad = 32, housed = false,
  replay = false, toolbar = true, canvas = true, flush = false, style: sp,
}) {
  const site = useSite();
  const [tab, setTab] = useState("preview");
  const [localTheme, setLocalTheme] = useState(null);
  const [localAccent, setLocalAccent] = useState(null);
  const [swatches, setSwatches] = useState(false);
  const [run, setRun] = useState(0);
  const [narrow, setNarrow] = useState(false);
  const [ref, seen] = useInView();
  const theme = localTheme || site.theme;
  const accent = localAccent || site.accent;
  const chrome = usePal(site.theme);
  const pal = usePal(theme);
  const body = typeof children === "function" ? children({ key: run }) : children;
  return (
    <div ref={ref} style={{
      borderRadius: tokens.radius.lg, border: `1px solid ${chrome.borderSubtle}`, background: chrome.bg,
      transition: `border-color ${motion.smooth} ${motion.easeInOut}, background ${motion.smooth} ${motion.easeInOut}`, ...sp,
    }}>
      {toolbar && (
        <div style={{ display: "flex", alignItems: "center", gap: 2, padding: "6px 8px", borderBottom: `1px solid ${chrome.borderSubtle}`, fontFamily: tokens.font.sans }}>
          {code ? (
            <>
              <ToolButton pal={chrome} width={0} active={tab === "preview"} onClick={() => setTab("preview")} label="Preview">Preview</ToolButton>
              <ToolButton pal={chrome} width={0} active={tab === "code"} onClick={() => setTab("code")} label="Code">Code</ToolButton>
            </>
          ) : title ? <span style={{ ...tokens.type.xs, color: chrome.textTertiary, padding: "0 8px" }}>{title}</span> : null}
          <span style={{ flex: 1 }} />
          {replay && <ToolButton pal={chrome} width={0} onClick={() => { setTab("preview"); setRun((n) => n + 1); }} label="Replay">↻ Replay</ToolButton>}
          {swatches && ACCENT_COLORS.map((c) => (
            <button key={c.name} type="button" aria-label={`${c.name} colour scheme`} title={c.name} onClick={() => { setLocalAccent(c.value); setSwatches(false); }}
              style={{ ...interactiveBase, width: 14, height: 14, padding: 0, margin: "0 3px", borderRadius: 7, background: c.value, boxShadow: accent === c.value ? `0 0 0 2px ${chrome.bg}, 0 0 0 3px ${c.value}` : "none" }} />
          ))}
          <span className="hide-phone" style={{ display: "inline-flex" }}>
            <ToolButton pal={chrome} active={narrow} onClick={() => { setTab("preview"); setNarrow((n) => !n); }} label={narrow ? "Preview at full width" : "Preview at phone width"}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="7.5" y="3" width="9" height="18" rx="2.5" /><path d="M11 18h2" />
              </svg>
            </ToolButton>
          </span>
          <ToolButton pal={chrome} onClick={() => setSwatches((s) => !s)} label="Colour scheme">
            <span style={{ width: 12, height: 12, borderRadius: 6, background: accent, display: "block" }} />
          </ToolButton>
          <ToolButton pal={chrome} onClick={() => setLocalTheme(theme === "dark" ? "light" : "dark")} label={theme === "dark" ? "Preview in light" : "Preview in dark"}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              {theme === "dark" ? <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" /> : <><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></>}
            </svg>
          </ToolButton>
          {code && <CopyButton text={code} label="Copy code" theme={site.theme} />}
        </div>
      )}
      {tab === "code" && code ? (
        <CodeBlock code={code} theme={site.theme} bare maxHeight={Math.max(minHeight, 360)} />
      ) : (
        <AccentContext.Provider value={accent}>
          <ThemeProvider theme={theme}>
            <div style={{
              position: "relative", minHeight, display: "flex", justifyContent: "center",
              alignItems: housed ? "stretch" : align === "top" ? "flex-start" : "center",
              padding: flush ? 0 : housed ? `0 min(${pad}px, 4.5vw) min(${pad}px, 4.5vw)` : `min(${pad}px, 4.5vw)`,
              // Not clipped, so menus and popovers opened inside a preview can overflow the frame.
              borderRadius: toolbar ? `0 0 ${tokens.radius.lg - 1}px ${tokens.radius.lg - 1}px` : tokens.radius.lg - 1,
              backgroundColor: canvas ? pal.bgSubtle : pal.bg, color: pal.text, fontFamily: tokens.font.sans,
              backgroundImage: canvas ? `radial-gradient(${theme === "dark" ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.045)"} 1px, transparent 1px)` : "none",
              backgroundSize: "18px 18px",
              transition: `background-color ${motion.smooth} ${motion.easeInOut}`,
            }}>
              <Boundary key={run}>{seen ? (narrow ? (
                <div key={run} style={{
                  width: 390, maxWidth: "100%", boxSizing: "border-box", alignSelf: "stretch", display: "flex", justifyContent: "center",
                  alignItems: align === "top" ? "flex-start" : "center", padding: "28px 16px", background: pal.bg,
                  borderLeft: `1px dashed ${pal.border}`, borderRight: `1px dashed ${pal.border}`, overflow: "hidden",
                }}><div style={{ maxWidth: "100%", minWidth: 0 }}>{body}</div></div>
              ) : housed ? (
                <div style={{
                  boxSizing: "border-box", maxWidth: "100%", display: "flex", justifyContent: "center", alignItems: "flex-start",
                  padding: "40px min(36px, 4.5vw) 28px", background: pal.bgElevated,
                  borderLeft: `1px solid ${pal.borderSubtle}`, borderRight: `1px solid ${pal.borderSubtle}`, borderBottom: `1px solid ${pal.borderSubtle}`,
                  borderRadius: `0 0 ${tokens.radius.lg}px ${tokens.radius.lg}px`, boxShadow: `0 12px 32px ${pal.shadow}`,
                }} key={run}>{body}</div>
              ) : <div key={run} style={{ maxWidth: "100%", display: "flex", justifyContent: "center", alignItems: align === "top" ? "flex-start" : "center", width: flush ? "100%" : undefined }}>{body}</div>) : null}</Boundary>
            </div>
          </ThemeProvider>
        </AccentContext.Provider>
      )}
    </div>
  );
}

// A small, non-interactive live preview scaled into a fixed box: used on
// index cards and the landing page.
export function LiveThumb({ children, width = 480, height = 300, scale = 0.5, housed = false, style: sp }) {
  const site = useSite();
  const pal = usePal(site.theme);
  const [ref, seen] = useInView("300px");
  return (
    <div ref={ref} aria-hidden="true" style={{
      position: "relative", width: "100%", height: Math.round(height * scale), overflow: "hidden", borderRadius: tokens.radius.md,
      backgroundColor: pal.bgSubtle, backgroundImage: `radial-gradient(${site.theme === "dark" ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.045)"} 1px, transparent 1px)`, backgroundSize: "14px 14px",
      transition: `background-color ${motion.smooth} ${motion.easeInOut}`, ...sp,
    }}>
      {seen && (
        <div style={{
          position: "absolute", top: 0, left: "50%", width, height, marginLeft: -width / 2, pointerEvents: "none",
          transform: `scale(${scale})`, transformOrigin: "top center",
          display: "flex", justifyContent: "center", alignItems: "flex-start", paddingTop: housed ? 0 : 28, boxSizing: "border-box",
        }}>
          {housed ? (
            <div style={{
              boxSizing: "border-box", maxWidth: "100%", padding: "32px 32px 24px", background: pal.bgElevated,
              borderLeft: `1px solid ${pal.borderSubtle}`, borderRight: `1px solid ${pal.borderSubtle}`, borderBottom: `1px solid ${pal.borderSubtle}`,
              borderRadius: `0 0 ${tokens.radius.lg}px ${tokens.radius.lg}px`,
            }}>{children}</div>
          ) : children}
        </div>
      )}
    </div>
  );
}
