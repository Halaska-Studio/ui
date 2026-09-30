// The action bar: on every page, bottom centre. It holds the things that
// change the page in front of you: the install prompt, light or dark, and the
// colour scheme. On pattern and screen pages the copy label reflects the page
// and copies the scoped prompt.
import { useEffect, useRef, useState } from "react";
import { tokens, motion, interactiveBase, ACCENT_COLORS } from "../kit";
import { useSite } from "../state";
import { promptLabel } from "../email/gate";

function BarButton({ dark, label, onClick, children, wide, expanded }) {
  const [hover, setHover] = useState(false);
  const idle = dark ? "#d8d8d8" : "#444";
  const lit = dark ? "#fff" : "#111";
  return (
    <button type="button" aria-label={wide ? undefined : label} title={wide ? undefined : label} aria-expanded={expanded} onClick={onClick}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        ...interactiveBase, display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8, flexShrink: 0,
        height: 36, minWidth: 36, padding: wide ? "0 14px 0 12px" : 0, borderRadius: tokens.radius.sm + 2, whiteSpace: "nowrap",
        background: hover ? (dark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.06)") : "transparent", color: hover ? lit : idle,
        ...tokens.type.sm, fontWeight: tokens.weight.medium, fontFamily: tokens.font.sans,
        transition: `color ${motion.fast} ${motion.easeOut}, background ${motion.fast} ${motion.easeOut}`,
      }}>{children}</button>
  );
}

export function FloatingCopy({ target }) {
  const { theme, setTheme, accent, setAccent, gate } = useSite();
  const [swatches, setSwatches] = useState(false);
  const rootRef = useRef(null);
  const dark = theme !== "dark"; // the bar inverts against the page
  useEffect(() => {
    if (!swatches) return;
    const onDown = (e) => { if (rootRef.current && !rootRef.current.contains(e.target)) setSwatches(false); };
    const onKey = (e) => { if (e.key === "Escape") setSwatches(false); };
    document.addEventListener("mousedown", onDown);
    window.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("mousedown", onDown); window.removeEventListener("keydown", onKey); };
  }, [swatches]);
  const rule = <span aria-hidden="true" style={{ width: 1, height: 20, margin: "0 4px", flexShrink: 0, background: dark ? "rgba(255,255,255,0.14)" : "rgba(0,0,0,0.12)" }} />;
  return (
    <div ref={rootRef} role="toolbar" aria-label="Page actions" style={{
      position: "fixed", bottom: 20, left: "50%", transform: "translateX(-50%)", zIndex: 800, maxWidth: "calc(100vw - 24px)", boxSizing: "border-box",
      display: "flex", alignItems: "center", gap: 2, padding: 4, borderRadius: tokens.radius.md,
      background: dark ? "rgba(12,12,12,0.9)" : "rgba(250,250,250,0.92)",
      border: `1px solid ${dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"}`,
      backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
      boxShadow: dark ? "0 8px 32px rgba(0,0,0,0.3)" : "0 8px 32px rgba(0,0,0,0.12)",
      transition: `background ${motion.smooth} ${motion.easeInOut}`,
    }}>
      <BarButton dark={dark} wide onClick={() => gate.requestPrompt({ placement: "floating", target })}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="9" y="9" width="11" height="11" rx="2" /><path d="M5 15V6a2 2 0 0 1 2-2h9" /></svg>
        {promptLabel(target)}
      </BarButton>
      {rule}
      <BarButton dark={dark} label={theme === "dark" ? "Switch to light" : "Switch to dark"} onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          {theme === "dark" ? <><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></> : <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />}
        </svg>
      </BarButton>
      <BarButton dark={dark} label="Colour scheme" expanded={swatches} onClick={() => setSwatches((s) => !s)}>
        <span style={{ width: 14, height: 14, borderRadius: 7, background: accent, display: "block", boxShadow: `0 0 0 1.5px ${dark ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.15)"}` }} />
      </BarButton>
      {swatches && (
        <div role="radiogroup" aria-label="Colour scheme" style={{
          position: "absolute", bottom: "calc(100% + 8px)", right: 0, display: "flex", gap: 10, padding: "10px 12px", borderRadius: tokens.radius.md,
          background: dark ? "rgba(12,12,12,0.94)" : "rgba(250,250,250,0.96)", border: `1px solid ${dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"}`,
          backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)", boxShadow: dark ? "0 8px 32px rgba(0,0,0,0.3)" : "0 8px 32px rgba(0,0,0,0.12)",
          animation: `halaska-scale-in ${motion.fast} ${motion.easeOut} both`, transformOrigin: "bottom right",
        }}>
          {ACCENT_COLORS.map((c) => (
            <button key={c.name} type="button" role="radio" aria-checked={accent === c.value} aria-label={c.name} title={c.name}
              onClick={() => { setAccent(c.value); setSwatches(false); }}
              style={{ ...interactiveBase, width: 20, height: 20, padding: 0, borderRadius: 10, background: c.value, flexShrink: 0,
                boxShadow: accent === c.value ? `0 0 0 2px ${dark ? "#0c0c0c" : "#fafafa"}, 0 0 0 3.5px ${c.value}` : "none" }} />
          ))}
        </div>
      )}
    </div>
  );
}
