// Slices halaska-kit-v1.0.jsx into named top-level source blocks and writes
// public/source-map.json. The site's code pages assemble per-component
// copyable source from these blocks at runtime (dependency closure), so the
// pages can never drift from the shipped file. Runs as part of `prebuild`.

import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const SRC = join(root, "halaska-kit-v1.0.jsx");
const OUT = join(root, "public", "source-map.json");

const src = readFileSync(SRC, "utf8");
const lines = src.split("\n");

// Region boundaries by section marker. Blocks get tagged so the runtime can
// decide what to inline (pattern/demo helpers) vs. list as a dependency
// (core kit components) vs. ignore (site chrome).
const markers = [
  { at: "─── 1. TOKENS", region: "infra" },
  { at: "─── 2. TYPOGRAPHY", region: "core" },
  { at: "─── 11. SHOWCASE WRAPPERS", region: "site" },
  { at: "─── 12. DEMOS", region: "demo" },
  { at: "─── PATTERNS ──", region: "pattern" },
  { at: "─── ACTION BAR", region: "site" },
];

function regionAt(lineIdx) {
  let region = "header";
  for (const m of markers) {
    const mi = lines.findIndex(l => l.includes(m.at));
    if (mi !== -1 && lineIdx >= mi) region = m.region;
  }
  return region;
}

// Pre-resolve marker line numbers once (findIndex above is O(n) per call).
const markerLines = markers
  .map(m => ({ line: lines.findIndex(l => l.includes(m.at)), region: m.region }))
  .filter(m => m.line !== -1)
  .sort((a, b) => a.line - b.line);

function regionFor(lineIdx) {
  let region = "header";
  for (const m of markerLines) if (lineIdx >= m.line) region = m.region;
  return region;
}

// Top-level declarations start at column 0. A block runs to the line before
// the next top-level declaration or section banner.
const declRe = /^(?:export default )?(?:function|const|let) ([A-Za-z_$][\w$]*)/;
const starts = [];
lines.forEach((l, i) => {
  const m = l.match(declRe);
  if (m) starts.push({ name: m[1], line: i });
});

const blocks = {};
const meta = {};
starts.forEach((s, i) => {
  const end = i + 1 < starts.length ? starts[i + 1].line : lines.length;
  // Trim trailing blank lines and any comment lines — those belong to the
  // NEXT block (captured below as its leading comments), so blocks never
  // overlap and splicing one never eats its neighbour's header.
  let stop = end;
  while (stop > s.line && (lines[stop - 1].trim() === "" || lines[stop - 1].trim().startsWith("//"))) stop--;
  // Pull in the comment lines directly above the declaration.
  let from = s.line;
  while (from > 0 && lines[from - 1].trim().startsWith("//")) from--;
  blocks[s.name] = lines.slice(from, stop).join("\n");
  meta[s.name] = {
    region: regionFor(s.line),
    component: /^[A-Z]/.test(s.name) && !/^[A-Z0-9_]+$/.test(s.name),
  };
});

mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, JSON.stringify({ generated: "halaska-kit-v1.0", blocks, meta }));
const kb = Math.round(JSON.stringify({ blocks, meta }).length / 1024);
console.log(`source-map.json written: ${Object.keys(blocks).length} blocks, ${kb} KB`);
