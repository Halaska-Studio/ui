// Cmd+K search across screens, patterns, components and docs.
import { useEffect, useRef, useState } from "react";
import { usePal, tokens, motion, interactiveBase, Kbd, useModalFocus } from "../kit";
import { useSite } from "../state";
import { navigate } from "../router";
import { SEARCH_INDEX } from "../registry";

export function Search() {
  const { theme, search, setSearch } = useSite();
  const pal = usePal(theme);
  const [q, setQ] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef(null);
  const panelRef = useModalFocus(search, () => setSearch(false));
  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); setSearch((s) => !s); }
      if (e.key === "Escape") setSearch(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setSearch]);
  useEffect(() => { if (search) { setQ(""); setActive(0); requestAnimationFrame(() => inputRef.current?.focus()); } }, [search]);
  if (!search) return null;
  const term = q.trim().toLowerCase();
  const results = (term ? SEARCH_INDEX.filter((i) => `${i.label} ${i.hint} ${i.kind}`.toLowerCase().includes(term)) : SEARCH_INDEX).slice(0, 40);
  const go = (item) => { if (!item) return; setSearch(false); navigate(item.to); };
  const onKeyDown = (e) => {
    if (e.key === "ArrowDown") { e.preventDefault(); setActive((a) => Math.min(results.length - 1, a + 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setActive((a) => Math.max(0, a - 1)); }
    else if (e.key === "Enter") { e.preventDefault(); go(results[active]); }
  };
  return (
    <div onClick={() => setSearch(false)} style={{ position: "fixed", inset: 0, zIndex: 1150, background: "rgba(0,0,0,0.45)", backdropFilter: "blur(4px)", WebkitBackdropFilter: "blur(4px)", display: "flex", justifyContent: "center", alignItems: "flex-start", padding: "12vh 16px 16px", animation: `halaska-fade-in ${motion.fast} ${motion.easeOut} both` }}>
      <div ref={panelRef} role="dialog" aria-modal="true" aria-label="Search" onClick={(e) => e.stopPropagation()} style={{
        width: 560, maxWidth: "100%", maxHeight: "70vh", display: "flex", flexDirection: "column", overflow: "hidden",
        background: theme === "dark" ? "rgba(30,30,30,0.98)" : "rgba(255,255,255,0.98)", border: `1px solid ${pal.borderSubtle}`,
        borderRadius: tokens.radius.lg, boxShadow: `0 16px 48px ${pal.shadowLg}`, fontFamily: tokens.font.sans,
        animation: `halaska-scale-in ${motion.normal} ${motion.emphasized} both`,
      }}>
        <input ref={inputRef} value={q} onChange={(e) => { setQ(e.target.value); setActive(0); }} onKeyDown={onKeyDown}
          placeholder="Search screens, patterns and components" aria-label="Search"
          style={{ border: "none", outline: "none", background: "transparent", padding: "16px 18px", ...tokens.type.md, fontFamily: tokens.font.sans, color: pal.text, borderBottom: `1px solid ${pal.borderSubtle}` }} />
        <div role="listbox" style={{ overflowY: "auto", padding: 6 }}>
          {results.length === 0 && <div style={{ padding: "18px 12px", ...tokens.type.sm, color: pal.textTertiary }}>Nothing matches “{q.trim()}”.</div>}
          {results.map((item, i) => (
            <button key={item.to} type="button" role="option" aria-selected={i === active} onMouseEnter={() => setActive(i)} onClick={() => go(item)}
              style={{ ...interactiveBase, width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "9px 12px", borderRadius: tokens.radius.sm, textAlign: "left", background: i === active ? pal.bgMuted : "transparent" }}>
              <span style={{ width: 76, flexShrink: 0, ...tokens.type.xs, fontFamily: tokens.font.mono, color: pal.textTertiary }}>{item.kind}</span>
              <span style={{ ...tokens.type.sm, fontWeight: tokens.weight.medium, color: pal.text }}>{item.label}</span>
              <span style={{ flex: 1, minWidth: 0, ...tokens.type.xs, color: pal.textTertiary, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.hint}</span>
            </button>
          ))}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 14px", borderTop: `1px solid ${pal.borderSubtle}`, ...tokens.type.xs, color: pal.textTertiary }}>
          <Kbd theme={theme}>↑↓</Kbd> to move <Kbd theme={theme}>↵</Kbd> to open <Kbd theme={theme}>Esc</Kbd> to close
        </div>
      </div>
    </div>
  );
}
