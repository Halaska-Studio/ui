// Generates the data the docs site derives from the kit source, so nothing
// is written twice:
//   src/site/generated/registry.json   pattern groups and patterns (from PATTERN_GROUPS)
//   src/site/generated/api.json        props per export (signatures + @prop docblocks)
//   src/site/generated/relations.json  which patterns use which components, and
//                                      which screens use which patterns
// Runs on prebuild after extract-source.mjs (it reads public/source-map.json).
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const src = readFileSync(join(root, "halaska-kit-v1.0.jsx"), "utf8");
const outDir = join(root, "src", "site", "generated");
mkdirSync(outDir, { recursive: true });

// ── registry ────────────────────────────────────────────────────
const gi = src.indexOf("const PATTERN_GROUPS = [");
const gj = src.indexOf("\n];", gi);
const groups = new Function(`return ${src.slice(gi + "const PATTERN_GROUPS = ".length, gj + 2)}`)();
const registry = { groups: groups.map((g) => ({
  id: g.id, title: g.title, blurb: g.blurb,
  patterns: g.patterns.map((p) => ({ id: p.id, title: p.title, desc: p.desc, component: p.component, height: p.height, replay: !!p.replay, housed: !!p.housed })),
})) };
writeFileSync(join(outDir, "registry.json"), JSON.stringify(registry, null, 1));

// ── exports ─────────────────────────────────────────────────────
const exportBlock = src.slice(src.lastIndexOf("export {"));
const exportNames = new Set([...exportBlock.split("\n").filter((l) => !l.trim().startsWith("//")).join("\n").matchAll(/\b([A-Za-z_$][\w$]*)\b/g)].map((m) => m[1]).filter((n) => n !== "export"));

// ── api ─────────────────────────────────────────────────────────
function splitTop(s) {
  const out = []; let depth = 0, cur = "", q = null;
  for (const ch of s) {
    if (q) { cur += ch; if (ch === q) q = null; continue; }
    if (ch === '"' || ch === "'" || ch === "`") { q = ch; cur += ch; continue; }
    if ("([{".includes(ch)) depth++;
    if (")]}".includes(ch)) depth--;
    if (ch === "," && depth === 0) { out.push(cur); cur = ""; continue; }
    cur += ch;
  }
  if (cur.trim()) out.push(cur);
  return out.map((p) => p.trim().replace(/\s+/g, " ")).filter(Boolean);
}
const docs = {};
for (const m of src.matchAll(/\/\*\*([\s\S]*?)\*\/\s*\nfunction ([A-Za-z_$][\w$]*)\(/g)) {
  const lines = m[1].split("\n").map((l) => l.replace(/^\s*\*\s?/, "").trim()).filter((l) => l.startsWith("@prop"));
  docs[m[2]] = {};
  for (const l of lines) {
    const mm = l.match(/^@prop\s+(\w+)\s+\{(.+?)\}\s+(.*)$/);
    if (mm) docs[m[2]][mm[1]] = { type: mm[2], description: mm[3] };
  }
}
const COMMON = {
  theme: ['"light" | "dark"', "Palette override. Defaults to the nearest ThemeProvider."],
  style: ["CSSProperties", "Inline style merged onto the root element."],
  children: ["ReactNode", "Content."],
  onChange: ["(value) => void", "Called with the new value."],
  onClick: ["() => void", "Called on click."],
  onClose: ["() => void", "Called when the overlay should close."],
  value: ["any", "The controlled value."],
  label: ["string", "Visible label."],
  disabled: ["boolean", "Prevents interaction and dims the control."],
  placeholder: ["string", "Hint shown while empty."],
  size: ["string | number", "Size of the control."],
  variant: ["string", "Visual variant."],
  open: ["boolean", "Whether the overlay is shown."],
  title: ["string", "Heading text."],
  description: ["string", "Supporting text."],
  options: ["array", "The choices to offer."],
  items: ["array", "The entries to render."],
  icon: ["ReactNode", "Icon shown before the content."],
  checked: ["boolean", "The controlled checked state."],
  trigger: ["ReactNode", "The element that opens it."],
  caption: ["string", "Helper text under the control."],
  error: ["string", "Error message. Turns the border red and replaces the caption."],
  loading: ["boolean", "Shows a spinner and blocks clicks."],
};
const BOOLS = /^(pill|fill|mono|pulse|multiple|removable|required|readOnly|divider|fullWidth|truncate|muted|secondary|selected|pressed|home|hover|rounded|housed)$/;
const ARRAYS = /^(names|steps|rows|columns|tabs|menus|data|segments|sources|followups|phases|fixes|context|meta)$/;
const NUMBERS = /^(min|max|speed|length|total|current|zoom|rows|width|height|stroke|spacing|tail|maxVisible|maxHeight|level)$/;
const NODES = /^(left|right|prefix|suffix|action|actions|cover|before|after|iconRight)$/;
const STRINGS = /^(color|text|name|src|url|prompt|subtitle|status|message|align|weight|side|direction|gap|justify|wrap|shortcut|change|question|eyebrow|headline|reason)$/;
const guessType = (name, def) => {
  if (def === undefined) {
    if (COMMON[name]) return COMMON[name][0];
    if (/^on[A-Z]/.test(name)) return "function";
    if (BOOLS.test(name)) return "boolean";
    if (ARRAYS.test(name)) return "array";
    if (NUMBERS.test(name)) return "number";
    if (NODES.test(name)) return "ReactNode";
    if (STRINGS.test(name) || /Label$|Text$|Title$/.test(name)) return "string";
    return "any";
  }
  if (/^(true|false)$/.test(def)) return "boolean";
  if (/^-?\d+(\.\d+)?$/.test(def)) return "number";
  if (/^["'`]/.test(def)) return "string";
  if (def.startsWith("[")) return "array";
  if (def.includes("=>")) return "function";
  return COMMON[name]?.[0] || "any";
};
const api = {};
for (const m of src.matchAll(/^function ([A-Za-z_$][\w$]*)\(\{([\s\S]*?)\}\)\s*\{/gm)) {
  const [, name, raw] = m;
  if (!exportNames.has(name)) continue;
  api[name] = splitTop(raw).map((p) => {
    const eq = p.indexOf("=");
    let left = (eq === -1 ? p : p.slice(0, eq)).trim();
    const def = eq === -1 ? undefined : p.slice(eq + 1).trim();
    left = left.replace(/:\s*[A-Za-z_$][\w$]*$/, "").trim(); // theme: tp → theme
    const d = docs[name]?.[left];
    return { name: left, type: d?.type || guessType(left, def), default: def, description: d?.description || COMMON[left]?.[1] || "" };
  });
}
// @prop-documented patterns whose signature is not a destructure on one level
for (const [name, props] of Object.entries(docs)) {
  if (!api[name] && exportNames.has(name)) api[name] = Object.entries(props).map(([n, d]) => ({ name: n, type: d.type, default: undefined, description: d.description }));
}
writeFileSync(join(outDir, "api.json"), JSON.stringify(api, null, 1));

// ── relations ───────────────────────────────────────────────────
const { blocks } = JSON.parse(readFileSync(join(root, "public", "source-map.json"), "utf8"));
const { EXPORT_TO_SLUG } = await import(pathToFileURL(join(root, "src", "site", "data", "components", "index.js")).href);
const { SCREENS } = await import(pathToFileURL(join(root, "src", "site", "data", "screens.js")).href);
const patternComponents = new Map(registry.groups.flatMap((g) => g.patterns.map((p) => [p.component, p.id])));
const blockNames = Object.keys(blocks);

// Everything a top-level block reaches through its own private helpers,
// stopping at anything exported (those are the building blocks we report).
function reach(start) {
  const seen = new Set([start]); const used = new Set(); const stack = [start];
  while (stack.length) {
    const text = blocks[stack.pop()] || "";
    for (const n of blockNames) {
      if (seen.has(n) || !new RegExp(`\\b${n.replace(/\$/g, "\\$")}\\b`).test(text)) continue;
      seen.add(n);
      if (exportNames.has(n)) used.add(n); else stack.push(n);
    }
  }
  return [...used];
}
const relations = { patterns: {}, components: {}, screens: {} };
const link = (slug) => (relations.components[slug] ||= { patterns: [], screens: [] });
for (const [comp, id] of patternComponents) {
  const slugs = [...new Set(reach(comp).map((n) => EXPORT_TO_SLUG[n]).filter(Boolean))].sort();
  relations.patterns[id] = { components: slugs, screens: [] };
  slugs.forEach((s) => link(s).patterns.push(id));
}
for (const screen of SCREENS) {
  const used = reach(screen.component);
  const fromSource = used.filter((n) => patternComponents.has(n)).map((n) => patternComponents.get(n));
  const patterns = [...new Set([...fromSource, ...screen.hotspots.map((h) => h.pattern)])];
  const components = [...new Set(used.map((n) => EXPORT_TO_SLUG[n]).filter(Boolean))].sort();
  relations.screens[screen.slug] = { patterns, components };
  patterns.forEach((id) => relations.patterns[id]?.screens.push(screen.slug));
  components.forEach((s) => link(s).screens.push(screen.slug));
}
writeFileSync(join(outDir, "relations.json"), JSON.stringify(relations, null, 1));
console.log(`site data: ${registry.groups.length} groups, ${patternComponents.size} patterns, ${Object.keys(api).length} documented exports, ${Object.keys(relations.components).length} linked components`);
