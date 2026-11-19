// The action bar: on every page, bottom centre. It holds the things that
// change the page in front of you: the install prompt, a light and dark
// toggle, and the brand style of the previews (colour, headline style,
// corners). Each style button opens its options inline. On pattern and
// screen pages the copy label reflects the page and copies the scoped prompt.
import { useEffect, useRef, useState } from "react";
import { tokens, motion, interactiveBase, radiusFor, KIT_TYPE_STYLES, KIT_RADIUS_STYLES, loadKitTypeStyle, rr, rad } from "../kit";
import { useSite } from "../state";
import { promptLabel } from "../email/gate";
import { BRAND_COLORS, DEFAULT_SWATCH, normalHex } from "../ui/Branded";

// A corner drawn at the radius each corner style stands for.
const CORNER_PATHS = { sharp: "M3.5 12.5V5.5a2 2 0 0 1 2-2h7", soft: "M3.5 12.5V8a4.5 4.5 0 0 1 4.5-4.5h4.5", round: "M3.5 12.5a9 9 0 0 1 9-9" };
const CORNER_NAMES = { sharp: "Sharp", soft: "Soft", round: "Round" };
export function CornerIcon({ kind, size = 14 }) {
  return <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={CORNER_PATHS[kind] || CORNER_PATHS.round} /></svg>;
}
const headingFace = (id) => `'${(KIT_TYPE_STYLES[id] || KIT_TYPE_STYLES.clean).heading}', ${tokens.font.sans}`;

const EASE = "cubic-bezier(0.2, 0, 0, 1)";

export function FloatingCopy({ target }) {
  const { theme, setTheme, brand, setBrand, gate, setSearch, menuOpen, setMenuOpen } = useSite();
  // Which style group is open: "color", "type", "radius" or none.
  const [open, setOpen] = useState(null);
  const colorOpen = open === "color";
  const setColorOpen = (v) => setOpen(v ? "color" : null);
  const toggle = (id) => setOpen((o) => (o === id ? null : id));
  const isPreset = !brand.color || BRAND_COLORS.some((c) => c.value === brand.color);
  const [hex, setHex] = useState(isPreset ? "" : brand.color.slice(1));
  // The headline faces are fetched when the menu first opens, so each option shows in its own face.
  useEffect(() => { if (open === "type") Object.values(KIT_TYPE_STYLES).forEach(loadKitTypeStyle); }, [open]);
  // When the menu opens the bar collapses towards its left edge, so the close
  // control lands exactly where the menu button was.
  // The anchor is applied without a transition, so the bar never moves: it
  // only shrinks from the right while open, and grows back before re-centring.
  const [anchor, setAnchor] = useState(null);
  const openMenu = () => { setColorOpen(false); setAnchor(rootRef.current ? Math.round(rootRef.current.getBoundingClientRect().left) : null); setMenuOpen(true); };
  useEffect(() => {
    if (menuOpen || anchor == null) return;
    const t = setTimeout(() => setAnchor(null), 380);
    return () => clearTimeout(t);
  }, [menuOpen, anchor]);
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
    if (!open) return;
    const onDown = (e) => { if (rootRef.current && !rootRef.current.contains(e.target)) setOpen(null); };
    const onKey = (e) => { if (e.key === "Escape") setOpen(null); };
    document.addEventListener("mousedown", onDown);
    window.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("mousedown", onDown); window.removeEventListener("keydown", onKey); };
  }, [open]);

  // A style button: 28px, lit while its options are open.
  const styleBtn = (on) => ({
    ...interactiveBase, width: 28, height: 28, padding: 0, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center",
    background: on ? activeBg : "transparent", color: on ? barTextActive : barText, borderRadius: rr(radiusFor(28)),
    transition: `background ${motion.normal} ${motion.easeInOut}, color ${motion.normal} ${motion.easeInOut}, width 0.3s ${EASE}, opacity 0.2s ease`,
  });
  // On narrow screens the other two style buttons step aside while one is open.
  const aside = (id) => ({ className: "bar-other", "data-collapsed": open != null && open !== id });
  // The options beside a style button: they slide open, and close to nothing.
  const tray = (on, width) => ({
    display: "flex", alignItems: "center", gap: 4, overflowX: on ? "auto" : "hidden", overflowY: "hidden", flex: "0 1 auto", minWidth: 0,
    maxWidth: on ? width : 0, opacity: on ? 1 : 0, marginLeft: on ? 4 : 0, padding: on ? "4px 2px" : "4px 0",
    transition: `max-width 0.35s ${EASE}, opacity 0.2s ease, margin 0.35s ${EASE}`,
  });
  const option = (on) => ({
    ...interactiveBase, height: 26, minWidth: 28, padding: "0 7px", flexShrink: 0, display: "inline-flex", alignItems: "center", justifyContent: "center",
    borderRadius: rr(radiusFor(26)), background: on ? activeBg : "transparent", color: on ? barTextActive : barText,
    transition: `background ${motion.fast} ${motion.easeOut}, color ${motion.fast} ${motion.easeOut}`,
  });
  const pickColor = (value) => { setBrand({ color: value }); setHex(""); setOpen(null); };
  const typeHex = (v) => {
    const clean = v.replace(/[^0-9a-fA-F]/g, "").slice(0, 6);
    setHex(clean);
    const full = clean.length === 6 || clean.length === 3 ? normalHex(clean) : null;
    if (full) setBrand({ color: full });
  };

  const iconBtn = { ...interactiveBase, width: 32, height: 32, padding: 0, flexShrink: 0, display: "inline-flex", alignItems: "center", justifyContent: "center", background: "transparent", color: barText, borderRadius: rr(radiusFor(32)) };
  const divider = <div aria-hidden="true" style={{ width: 1, height: 20, background: barBorder, margin: "0 4px", flexShrink: 0 }} />;
  const half = (on) => ({ width: thumb + pad, height: thumb + pad * 2, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: on ? barTextActive : barText, position: "relative", zIndex: 1, transition: "color 0.2s ease" });

  return (
    <div ref={rootRef} role="toolbar" aria-label="Page actions" style={{
      position: "fixed", bottom: 20, zIndex: 800, maxWidth: "calc(100vw - 24px)", boxSizing: "border-box",
      left: anchor != null ? anchor : "50%", transform: anchor != null ? "none" : "translateX(-50%)",
      display: "flex", alignItems: "center", gap: 0, padding: 6, borderRadius: menuOpen ? 999 : rad.md,
      background: barBg, border: `1px solid ${barBorder}`, backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
      boxShadow: barIsDark ? "0 8px 32px rgba(0,0,0,0.3)" : "0 8px 32px rgba(0,0,0,0.12)",
      transition: `background 0.35s ${EASE}, border-color 0.35s ${EASE}, box-shadow 0.35s ${EASE}, border-radius 0.35s ${EASE}`,
    }}>
      {/* While the menu is open the bar shrinks to a single close control. */}
      <button type="button" aria-label="Close menu" onClick={() => setMenuOpen(false)} tabIndex={menuOpen ? 0 : -1} aria-hidden={!menuOpen}
        style={{ ...iconBtn, width: menuOpen ? 32 : 0, height: 32, borderRadius: 16, opacity: menuOpen ? 1 : 0, overflow: "hidden", padding: 0,
          transition: `width 0.35s ${EASE}, opacity 0.2s ease ${menuOpen ? "0.15s" : "0s"}` }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" /></svg>
      </button>
      <div aria-hidden={menuOpen} style={{
        display: "flex", alignItems: "center", gap: 4, overflow: "hidden", whiteSpace: "nowrap", minWidth: 0,
        maxWidth: menuOpen ? 0 : 860, opacity: menuOpen ? 0 : 1,
        transition: `max-width 0.35s ${EASE}, opacity 0.2s ease ${menuOpen ? "0s" : "0.1s"}`,
      }}>
      <button type="button" className="bar-sm" aria-label="Menu" tabIndex={menuOpen ? -1 : 0} onClick={openMenu} style={iconBtn}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16" /></svg>
      </button>
      {/* On narrow screens these step aside while a style group is open. */}
      <div className="bar-rest" data-collapsed={open != null} style={{ display: "flex", alignItems: "center", gap: 4 }}>
      <button type="button" onClick={() => { setColorOpen(false); gate.requestPrompt({ placement: "floating", target }); }}
        onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
        style={{
          ...interactiveBase, fontFamily: tokens.font.sans, ...tokens.type.sm, fontWeight: tokens.weight.medium,
          padding: "8px 12px", borderRadius: rr(radiusFor(34)), whiteSpace: "nowrap", letterSpacing: "-0.01em",
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

      </div>

      {/* Brand style of the previews. Each button opens its options beside it. */}
      <div style={{ display: "flex", alignItems: "center", padding: "0 2px", minWidth: 0, flex: "0 1 auto" }}>
        {/* Colour */}
        <button type="button" {...aside("color")} onClick={() => toggle("color")} aria-label="Colour" title="Colour" aria-expanded={colorOpen} style={styleBtn(colorOpen)}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="m19 11-8-8-8.6 8.6a2 2 0 0 0 0 2.8l5.2 5.2c.8.8 2 .8 2.8 0L19 11Z" />
            <path d="m5 2 5 5" />
            <path d="M2 13h15" />
            <path d="M22 20a2 2 0 1 1-4 0c0-1.6 1.7-2.4 2-4 .3 1.6 2 2.4 2 4Z" />
          </svg>
        </button>
        {/* The colour in use shows beside the bucket while the tray is closed. */}
        <button type="button" {...aside("color")} aria-label="Colour" tabIndex={-1} onClick={() => toggle("color")}
          style={{ ...interactiveBase, padding: 0, flexShrink: 0, width: colorOpen ? 0 : 16, height: 16, borderRadius: 8, marginLeft: colorOpen ? 0 : 4, marginRight: colorOpen ? 0 : 6,
            background: brand.color || DEFAULT_SWATCH, opacity: colorOpen ? 0 : 1, overflow: "hidden", transition: `width 0.3s ${EASE}, margin 0.3s ${EASE}, opacity 0.2s ease` }} />
        <div className="bar-tray" style={{ ...tray(colorOpen, 270), gap: 7, paddingLeft: colorOpen ? 4 : 0, paddingRight: colorOpen ? 4 : 0 }}>
          {[{ name: "Default", value: null }, ...BRAND_COLORS].map((c) => {
            const active = isPreset && brand.color === c.value;
            return (
              <button key={c.name} type="button" aria-label={`${c.name} colour`} aria-pressed={active} title={c.name === "Default" ? "Default: greyscale" : c.name} tabIndex={colorOpen ? 0 : -1}
                onClick={() => pickColor(c.value)}
                style={{
                  ...interactiveBase, padding: 0, flexShrink: 0, width: 16, height: 16, borderRadius: 8, background: c.value || DEFAULT_SWATCH,
                  boxShadow: active ? `0 0 0 2px ${barIsDark ? "#0c0c0c" : "#fafafa"}, 0 0 0 3.5px ${c.value || barText}` : "none",
                  transition: "box-shadow 0.2s ease",
                }} />
            );
          })}
          {/* Custom: a hex field, with the system colour picker on the well. */}
          <label title="Custom colour" style={{
            display: "inline-flex", alignItems: "center", gap: 5, height: 24, padding: "0 7px 0 4px", marginLeft: 2, flexShrink: 0, borderRadius: rr(radiusFor(24)),
            background: activeBg, boxShadow: !isPreset ? `0 0 0 1px ${brand.color}` : "none", cursor: "text", transition: "box-shadow 0.2s ease",
          }}>
            <span style={{ position: "relative", width: 16, height: 16, borderRadius: 8, flexShrink: 0, overflow: "hidden", cursor: "pointer",
              background: !isPreset ? brand.color : "conic-gradient(#f43f5e, #f59e0b, #10b981, #3b82f6, #8b5cf6, #f43f5e)" }}>
              <input type="color" aria-label="Pick a custom colour" tabIndex={colorOpen ? 0 : -1} value={!isPreset ? brand.color : "#3b82f6"}
                onChange={(e) => { setBrand({ color: e.target.value }); setHex(e.target.value.slice(1)); }}
                style={{ position: "absolute", inset: -4, width: 24, height: 24, padding: 0, border: "none", opacity: 0, cursor: "pointer" }} />
            </span>
            <span aria-hidden="true" style={{ fontFamily: tokens.font.mono, fontSize: 11, color: barText, marginRight: -3 }}>#</span>
            <input type="text" inputMode="text" spellCheck={false} autoCapitalize="off" autoCorrect="off" aria-label="Custom colour, hex code" placeholder="hex" tabIndex={colorOpen ? 0 : -1}
              value={hex} onChange={(e) => typeHex(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter" && normalHex(hex)) setOpen(null); }}
              style={{ width: 50, padding: 0, border: "none", outline: "none", background: "transparent", color: barTextActive, fontFamily: tokens.font.mono, fontSize: 11, letterSpacing: "0.02em" }} />
          </label>
        </div>

        {/* Headline style */}
        <button type="button" {...aside("type")} onClick={() => toggle("type")} aria-label="Headline style" title="Headline style" aria-expanded={open === "type"}
          style={{ ...styleBtn(open === "type"), fontFamily: headingFace(brand.type), fontSize: 13, fontWeight: 500, letterSpacing: "-0.02em" }}>Aa</button>
        <div className="bar-tray" role="radiogroup" aria-label="Headline style" style={tray(open === "type", 240)}>
          {Object.entries(KIT_TYPE_STYLES).map(([id, st]) => {
            const on = brand.type === id;
            return (
              <button key={id} type="button" role="radio" aria-checked={on} title={`${st.name}: ${st.heading}`} tabIndex={open === "type" ? 0 : -1}
                onClick={() => setBrand({ type: id })}
                style={{ ...option(on), fontFamily: headingFace(id), fontSize: id === "editorial" ? 14 : 12, fontWeight: st.weight && st.weight < 500 ? 400 : 500 }}>{st.name}</button>
            );
          })}
        </div>

        {/* Corners */}
        <button type="button" {...aside("radius")} onClick={() => toggle("radius")} aria-label="Corners" title="Corners" aria-expanded={open === "radius"} style={{ ...styleBtn(open === "radius"), marginLeft: 2 }}>
          <CornerIcon kind={brand.radius} />
        </button>
        <div className="bar-tray" role="radiogroup" aria-label="Corners" style={tray(open === "radius", 220)}>
          {Object.keys(KIT_RADIUS_STYLES).map((id) => {
            const on = brand.radius === id;
            return (
              <button key={id} type="button" role="radio" aria-checked={on} title={CORNER_NAMES[id]} tabIndex={open === "radius" ? 0 : -1}
                onClick={() => setBrand({ radius: id })}
                style={{ ...option(on), gap: 5, ...tokens.type.sm, fontFamily: tokens.font.sans }}><CornerIcon kind={id} size={13} />{CORNER_NAMES[id]}</button>
            );
          })}
        </div>
      </div>
      </div>
    </div>
  );
}
