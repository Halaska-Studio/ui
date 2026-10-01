// The action bar: on every page, bottom centre. It holds the things that
// change the page in front of you: the install prompt, a light and dark
// toggle, and the colour scheme. On pattern and screen pages the copy label
// reflects the page and copies the scoped prompt.
import { useEffect, useRef, useState } from "react";
import { tokens, motion, interactiveBase, ACCENT_COLORS } from "../kit";
import { useSite } from "../state";
import { promptLabel } from "../email/gate";

const EASE = "cubic-bezier(0.2, 0, 0, 1)";

export function FloatingCopy({ target }) {
  const { theme, setTheme, accent, setAccent, gate, setSearch, menuOpen, setMenuOpen } = useSite();
  const [colorOpen, setColorOpen] = useState(false);
  // When the menu opens the bar collapses towards its left edge, so the close
  // control lands exactly where the menu button was.
  const [anchor, setAnchor] = useState(null);
  const openMenu = () => { setColorOpen(false); setAnchor(rootRef.current ? Math.round(rootRef.current.getBoundingClientRect().left) : null); setMenuOpen(true); };
  const [hover, setHover] = useState(false);
  const rootRef = useRef(null);
  const isDark = theme === "dark";
  const barIsDark = !isDark; // the bar inverts against the page
  const barBg = barIsDark ? "rgba(12,12,12,0.88)" : "rgba(250,250,250,0.88)";
  const barBorder = barIsDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)";
  const barText = barIsDark ? "#999" : "#666";
  const barTextActive = barIsDark ? "#fff" : "#111";
  const activeBg = barIsDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)";
  const hoverBg = barIsDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)";
  const thumbBg = barIsDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.08)";
  const thumb = 22, pad = 2;

  useEffect(() => {
    if (!colorOpen) return;
    const onDown = (e) => { if (rootRef.current && !rootRef.current.contains(e.target)) setColorOpen(false); };
    const onKey = (e) => { if (e.key === "Escape") setColorOpen(false); };
    document.addEventListener("mousedown", onDown);
    window.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("mousedown", onDown); window.removeEventListener("keydown", onKey); };
  }, [colorOpen]);

  const iconBtn = { ...interactiveBase, width: 32, height: 32, padding: 0, flexShrink: 0, display: "inline-flex", alignItems: "center", justifyContent: "center", background: "transparent", color: barText, borderRadius: tokens.radius.sm };
  const divider = <div aria-hidden="true" style={{ width: 1, height: 20, background: barBorder, margin: "0 4px", flexShrink: 0 }} />;
  const half = (on) => ({ width: thumb + pad, height: thumb + pad * 2, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: on ? barTextActive : barText, position: "relative", zIndex: 1, transition: "color 0.2s ease" });

  return (
    <div ref={rootRef} role="toolbar" aria-label="Page actions" style={{
      position: "fixed", bottom: 20, zIndex: 800, maxWidth: "calc(100vw - 24px)", boxSizing: "border-box",
      left: menuOpen && anchor != null ? anchor : "50%", transform: menuOpen && anchor != null ? "none" : "translateX(-50%)",
      display: "flex", alignItems: "center", gap: 0, padding: 6, borderRadius: menuOpen ? 999 : tokens.radius.md,
      background: barBg, border: `1px solid ${barBorder}`, backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
      boxShadow: barIsDark ? "0 8px 32px rgba(0,0,0,0.3)" : "0 8px 32px rgba(0,0,0,0.12)",
      transition: `background 0.35s ${EASE}, border-color 0.35s ${EASE}, box-shadow 0.35s ${EASE}, border-radius 0.35s ${EASE}, left 0.35s ${EASE}, transform 0.35s ${EASE}`,
    }}>
      {/* While the menu is open the bar shrinks to a single close control. */}
      <button type="button" aria-label="Close menu" onClick={() => setMenuOpen(false)} tabIndex={menuOpen ? 0 : -1} aria-hidden={!menuOpen}
        style={{ ...iconBtn, width: menuOpen ? 32 : 0, height: 32, borderRadius: 16, opacity: menuOpen ? 1 : 0, overflow: "hidden", padding: 0,
          transition: `width 0.35s ${EASE}, opacity 0.2s ease ${menuOpen ? "0.15s" : "0s"}` }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" /></svg>
      </button>
      <div aria-hidden={menuOpen} style={{
        display: "flex", alignItems: "center", gap: 4, overflow: "hidden", whiteSpace: "nowrap",
        maxWidth: menuOpen ? 0 : 600, opacity: menuOpen ? 0 : 1,
        transition: `max-width 0.35s ${EASE}, opacity 0.2s ease ${menuOpen ? "0s" : "0.1s"}`,
      }}>
      <button type="button" className="bar-sm" aria-label="Menu" tabIndex={menuOpen ? -1 : 0} onClick={openMenu} style={iconBtn}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16" /></svg>
      </button>
      <button type="button" onClick={() => { setColorOpen(false); gate.requestPrompt({ placement: "floating", target }); }}
        onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
        style={{
          ...interactiveBase, fontFamily: tokens.font.sans, ...tokens.type.sm, fontWeight: tokens.weight.medium,
          padding: "8px 12px", borderRadius: tokens.radius.md, whiteSpace: "nowrap", letterSpacing: "-0.01em",
          color: hover ? barTextActive : barText, background: hover ? hoverBg : "transparent",
          transition: `background ${motion.normal} ${motion.easeInOut}, color ${motion.normal} ${motion.easeInOut}`,
        }}><span className="bar-lg">{promptLabel(target)}</span><span className="bar-sm">Copy prompt</span></button>

      {divider}

      <button type="button" aria-label="Search" title="Search" onClick={() => { setColorOpen(false); setSearch(true); }} style={iconBtn}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
      </button>

      {divider}

      {/* Light and dark: a sliding toggle */}
      <button type="button" role="switch" aria-checked={isDark} aria-label="Dark mode" onClick={() => setTheme(isDark ? "light" : "dark")}
        style={{
          ...interactiveBase, width: thumb * 2 + pad * 2, height: thumb + pad * 2, borderRadius: 999, flexShrink: 0,
          background: activeBg, position: "relative", padding: 0, display: "flex", alignItems: "center",
          transition: `background ${motion.smooth} ${motion.emphasized}`,
        }}>
        <div style={{
          position: "absolute", width: thumb, height: thumb, borderRadius: thumb / 2, background: thumbBg,
          left: isDark ? pad + thumb : pad, top: pad, transition: `left 0.35s ${EASE}, background ${motion.smooth} ${motion.emphasized}`,
        }} />
        <div aria-hidden="true" style={half(!isDark)}>&#9728;</div>
        <div aria-hidden="true" style={half(isDark)}>&#9790;</div>
      </button>

      {divider}

      {/* Colour scheme: a paint bucket, with the swatches opening beside it */}
      <div style={{ display: "flex", alignItems: "center", padding: "0 4px" }}>
        <button type="button" onClick={() => setColorOpen((o) => !o)} aria-label="Colour scheme" aria-expanded={colorOpen}
          style={{
            ...interactiveBase, width: 28, height: 28, padding: 0, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center",
            background: colorOpen ? activeBg : "transparent", color: colorOpen ? barTextActive : barText, borderRadius: tokens.radius.sm, marginRight: 6,
            transition: `background ${motion.normal} ${motion.easeInOut}, color ${motion.normal} ${motion.easeInOut}`,
          }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="m19 11-8-8-8.6 8.6a2 2 0 0 0 0 2.8l5.2 5.2c.8.8 2 .8 2.8 0L19 11Z" />
            <path d="m5 2 5 5" />
            <path d="M2 13h15" />
            <path d="M22 20a2 2 0 1 1-4 0c0-1.6 1.7-2.4 2-4 .3 1.6 2 2.4 2 4Z" />
          </svg>
        </button>
        <div style={{ display: "flex", alignItems: "center", gap: colorOpen ? 6 : 0, transition: `gap 0.3s ${EASE}` }}>
          {ACCENT_COLORS.map((c) => {
            const active = accent === c.value;
            const show = colorOpen || active;
            return (
              <button key={c.name} type="button" aria-label={`${c.name} colour scheme`} title={c.name} tabIndex={show ? 0 : -1}
                onClick={() => { if (!colorOpen) setColorOpen(true); else { setAccent(c.value); setColorOpen(false); } }}
                style={{
                  ...interactiveBase, padding: 0, flexShrink: 0, width: show ? 16 : 0, height: 16, borderRadius: 8,
                  background: c.value, overflow: "hidden", opacity: show ? 1 : 0,
                  boxShadow: active && colorOpen ? `0 0 0 2px ${barBg}, 0 0 0 3.5px ${c.value}` : "none",
                  transition: `width 0.3s ${EASE}, opacity 0.2s ease, box-shadow 0.2s ease`,
                }} />
            );
          })}
        </div>
      </div>
      </div>
    </div>
  );
}
