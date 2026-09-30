// Highlighted code with a copy button. Line wrapping is off; long lines scroll.
import { useState } from "react";
import { usePal, tokens, motion, interactiveBase, useThemeContext } from "../kit";
import { copyText } from "../email/gate";

const TOKEN = /(\/\/[^\n]*|\/\*[\s\S]*?\*\/)|("(?:[^"\\\n]|\\.)*"|'(?:[^'\\\n]|\\.)*'|`(?:[^`\\]|\\.)*`)|(<\/?)([A-Z][\w.]*|[a-z][\w-]*)|\b(import|from|export|default|function|return|const|let|if|else|new|async|await|true|false|null|undefined)\b|\b(\d+(?:\.\d+)?)\b/g;

export function highlight(code, pal) {
  const out = []; let last = 0; let k = 0;
  for (const m of code.matchAll(TOKEN)) {
    if (m.index > last) out.push(code.slice(last, m.index));
    const [all, comment, str, open, tag, kw, num] = m;
    if (comment) out.push(<span key={k++} style={{ color: pal.textMuted }}>{all}</span>);
    else if (str) out.push(<span key={k++} style={{ color: pal.success }}>{all}</span>);
    else if (tag) out.push(<span key={k++}><span style={{ color: pal.textTertiary }}>{open}</span><span style={{ color: pal.accent }}>{tag}</span></span>);
    else if (kw) out.push(<span key={k++} style={{ color: pal.textTertiary }}>{all}</span>);
    else if (num) out.push(<span key={k++} style={{ color: pal.warning }}>{all}</span>);
    last = m.index + all.length;
  }
  if (last < code.length) out.push(code.slice(last));
  return out;
}

export function CopyButton({ text, label = "Copy", theme: tp }) {
  const ctx = useThemeContext(); const theme = tp || ctx; const pal = usePal(theme);
  const [done, setDone] = useState(false);
  const [hover, setHover] = useState(false);
  return (
    <button type="button" aria-label={done ? "Copied" : label} title={done ? "Copied" : label}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      onClick={() => { copyText(text); setDone(true); setTimeout(() => setDone(false), 1600); }}
      style={{
        ...interactiveBase, width: 28, height: 28, padding: 0, borderRadius: tokens.radius.sm, flexShrink: 0,
        display: "inline-flex", alignItems: "center", justifyContent: "center",
        background: hover ? pal.bgMuted : "transparent", color: done ? pal.success : pal.textTertiary,
        transition: `background ${motion.fast} ${motion.easeOut}, color ${motion.normal} ${motion.easeInOut}`,
      }}>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        {done ? <path d="M20 6 9 17l-5-5" /> : <><rect x="9" y="9" width="11" height="11" rx="2" /><path d="M5 15V6a2 2 0 0 1 2-2h9" /></>}
      </svg>
    </button>
  );
}

export function CodeBlock({ code, theme: tp, maxHeight = 420, bare, style: sp }) {
  const ctx = useThemeContext(); const theme = tp || ctx; const pal = usePal(theme);
  const text = String(code || "").replace(/\s+$/, "");
  return (
    <div style={{
      position: "relative", borderRadius: bare ? 0 : tokens.radius.md, border: bare ? "none" : `1px solid ${pal.borderSubtle}`,
      background: pal.bgSubtle, transition: `background ${motion.smooth} ${motion.easeInOut}, border-color ${motion.smooth} ${motion.easeInOut}`, ...sp,
    }}>
      <pre style={{
        margin: 0, padding: "16px 48px 16px 18px", overflow: "auto", maxHeight, whiteSpace: "pre", tabSize: 2,
        fontFamily: tokens.font.mono, fontSize: 12.5, lineHeight: 1.7, color: pal.textSecondary,
      }}><code>{highlight(text, pal)}</code></pre>
      <div style={{ position: "absolute", top: 8, right: 8 }}><CopyButton text={text} label="Copy code" theme={theme} /></div>
    </div>
  );
}
