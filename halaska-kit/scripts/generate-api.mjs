// Generates two consumer-facing files from the kit source, so coding agents
// and TypeScript projects never need to read the 10k-line file to use it:
//   public/llms.txt          : API reference: every export with its props
//   public/halaska-kit.d.ts  : permissive type shim for TS projects
// Runs as part of `prebuild`.

import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const src = readFileSync(join(root, "halaska-kit-v1.3.jsx"), "utf8");

// ── Exports ─────────────────────────────────────────────────────
const exportBlock = src.slice(src.lastIndexOf("export {"));
// Only identifier lines count; comment headers ("// Buttons") are group labels.
const exportNames = [...exportBlock.split("\n")
  .filter(l => !l.trim().startsWith("//"))
  .join("\n")
  .matchAll(/\b([A-Za-z_$][\w$]*)\b/g)]
  .map(m => m[1])
  .filter(n => n !== "export");
const exportSet = new Set(exportNames);

// ── Signatures: function Name({ a, b = 1, c: alias }) → props list ──
const sigRe = /^function ([A-Za-z_$][\w$]*)\(\{([^)]*)\}/gm;
const props = {};
for (const m of src.matchAll(sigRe)) {
  const [, name, raw] = m;
  props[name] = raw
    .split(",")
    .map(p => p.trim().replace(/\s+/g, " "))
    .filter(Boolean)
    .map(p => p.replace(/:\s*[A-Za-z_$][\w$]*/, "")) // drop renames (theme: tp → theme)
    .join(", ");
}

// ── Group exports by the comment headers in the export block ────
const groups = [];
let current = null;
for (const line of exportBlock.split("\n")) {
  const h = line.match(/^\s*\/\/\s*(.+)$/);
  if (h) { current = { title: h[1].trim(), names: [] }; groups.push(current); continue; }
  if (!current) continue;
  for (const m of line.matchAll(/\b([A-Za-z_$][\w$]*)\b/g)) {
    if (m[1] !== "export" && exportSet.has(m[1])) current.names.push(m[1]);
  }
}

const NON_COMPONENT = new Set(["tokens", "motion", "interactiveBase", "usePal", "useThemeContext",
  "AccentContext", "useAccent", "injectStyles", "getAvatarColor", "PATTERN_GROUPS", "UX_PATTERNS", "DESIGN_HEURISTICS"]);

// ── llms.txt ───────────────────────────────────────────────────
let out = `# Halaska Kit: API reference for coding agents
# https://ui.halaska.com · file: halaska-kit.jsx · by Halaska

Halaska Kit is a single-file React UI kit for AI products: 38 UX patterns + ~100 styled
components, inline styles, no CSS/Tailwind setup. Deps: react and react-dom only (no chart library).
Fonts (Geist) and keyframes self-inject on import. File begins with "use client" (Next.js-safe).

INSTALL
  curl -o src/halaska-kit.jsx https://ui.halaska.com/halaska-kit.jsx
  # TypeScript projects: curl -o src/halaska-kit.d.ts https://ui.halaska.com/halaska-kit.d.ts

USAGE
  import { Button, Card, Orb, PlanPreviewPattern, usePal, tokens } from "./halaska-kit";
  Every component accepts theme="light" | "dark" (or wrap in <ThemeProvider theme="dark">).
  Colors: const pal = usePal(theme) → pal.bg, bgElevated, bgSubtle, bgMuted, border, borderSubtle,
    text, textSecondary, textTertiary, textMuted, accent, accentBg, success, warning, danger (+ *Bg tints).
  Accent: <AccentContext.Provider value="#8b5cf6">. Every accent-colored element follows.
  Layout: <Stack gap={16} direction="row" align="center">; tokens.space {xs 4, sm 8, md 16, lg 32, xl 40};
    tokens.radius {xs 4, sm 8, md 16, lg 24, xl 32, pill 999}; tokens.type {xs…display}; tokens.font.sans/mono.
  Motion: motion.fast/normal/smooth/spring/slow durations; motion.easeInOut/easeOut/easeIn/emphasized/springCurve.

UX PATTERNS: the lifecycle set is prop-driven with demo defaults. Pass your own copy, data,
and callbacks (see @prop lines below each): ThinkingTracePattern, StreamingAnswerPattern,
PlanPreviewPattern, ApprovalCardPattern, AgentStatusPattern, HandoffPattern, ActionReceiptPattern,
ErrorRepairPattern. The other patterns are working reference implementations with demo data
(an AI operations agent named Alpha running support, releases, and renewals for a small software team): copy the source out of halaska-kit.jsx, swap the data, keep the
structure, states, and motion.

DESIGN HEURISTICS (apply when composing new UI)
  Show what the agent is doing (Orb, AgentStatusPattern) · consent before consequence
  (PlanPreviewPattern, ApprovalCardPattern) · undo over confirm (ActionReceiptPattern) ·
  recognition over recall (DigestPattern, AuditLogPattern) · calm error recovery (ErrorRepairPattern).

EXPORTS
`;

// ── JSDoc @prop lines above a function → indented doc lines ────
const docs = {};
for (const m of src.matchAll(/\/\*\*([\s\S]*?)\*\/\s*\nfunction ([A-Za-z_$][\w$]*)\(/g)) {
  const lines = m[1].split("\n").map(l => l.replace(/^\s*\*\s?/, "").trim()).filter(Boolean);
  const propLines = lines.filter(l => l.startsWith("@prop")).map(l => l.replace(/^@prop\s+/, ""));
  if (propLines.length) docs[m[2]] = { summary: lines[0], props: propLines };
}

for (const g of groups) {
  out += `\n## ${g.title}\n`;
  for (const n of g.names) {
    if (NON_COMPONENT.has(n)) { out += `  ${n}\n`; continue; }
    out += props[n] !== undefined ? `  ${n}({ ${props[n]} })\n` : `  ${n}\n`;
    if (docs[n]) for (const p of docs[n].props) out += `      ${p}\n`;
  }
}

mkdirSync(join(root, "public"), { recursive: true });
writeFileSync(join(root, "public", "llms.txt"), out);

// ── halaska-kit.d.ts ───────────────────────────────────────────
let dts = `// Type shim for Halaska Kit (permissive). Generated, do not edit.
// Drop next to halaska-kit.jsx so TypeScript projects can import it.
import type { ComponentType, Context } from "react";
declare const _any: any;
`;
for (const n of exportNames) {
  if (n === "AccentContext") dts += `export declare const AccentContext: Context<string | null>;\n`;
  else if (n === "ThemeProvider") dts += `export declare const ThemeProvider: ComponentType<{ theme?: "light" | "dark"; children?: any }>;\n`;
  else if (NON_COMPONENT.has(n)) dts += `export declare const ${n}: any;\n`;
  else dts += `export declare const ${n}: ComponentType<any>;\n`;
}
dts += `declare const HalaskaKit: ComponentType<{}>;\nexport default HalaskaKit;\n`;
writeFileSync(join(root, "public", "halaska-kit.d.ts"), dts);

console.log(`llms.txt: ${exportNames.length} exports across ${groups.length} groups · d.ts written`);
