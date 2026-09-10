// Replaces a pattern's source unit in halaska-kit-v1.3.jsx with a refactored
// version. A unit = the contiguous span of top-level blocks that belong to one
// pattern (data constants, helpers, main function), located via
// public/source-map.json. Shared helpers (AgentGlyph) are excluded from the span.
//
//   node scripts/splice-unit.mjs PlanPreviewPattern path/to/PlanPreviewPattern.new.jsx

import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const KIT = join(root, "halaska-kit-v1.3.jsx");
const [main, newPath] = process.argv.slice(2);
if (!main || !newPath) { console.error("usage: splice-unit <MainPattern> <new.jsx>"); process.exit(1); }

const { blocks, meta } = JSON.parse(readFileSync(join(root, "public", "source-map.json"), "utf8"));
let src = readFileSync(KIT, "utf8");
const SHARED = new Set(["AgentGlyph"]);

// Same closure as the extractor: pattern-region blocks referenced from main,
// never other *Pattern mains, never shared helpers.
const seen = new Set(); const stack = [main];
while (stack.length) {
  const n = stack.pop();
  if (seen.has(n)) continue;
  seen.add(n);
  for (const other of Object.keys(blocks)) {
    if (other === n || seen.has(other) || SHARED.has(other)) continue;
    if (meta[other].region !== "pattern" || other.endsWith("Pattern")) continue;
    if (new RegExp("\\b" + other.replace(/\$/g, "\\$") + "\\b").test(blocks[n])) stack.push(other);
  }
}
const unit = [...seen].filter(n => !SHARED.has(n));
const positions = unit.map(n => {
  const i = src.indexOf(blocks[n]);
  if (i === -1) throw new Error(`block ${n} not found verbatim in kit file — regenerate source-map first`);
  return { n, start: i, end: i + blocks[n].length };
}).sort((a, b) => a.start - b.start);

// The unit must be contiguous apart from whitespace/comment lines between blocks.
for (let i = 1; i < positions.length; i++) {
  const gap = src.slice(positions[i - 1].end, positions[i].start);
  if (!/^[\s]*(\/\/[^\n]*\n[\s]*)*$/.test(gap)) {
    throw new Error(`unit for ${main} is not contiguous between ${positions[i - 1].n} and ${positions[i].n}:\n${gap.slice(0, 200)}`);
  }
}

const start = positions[0].start;
const end = positions[positions.length - 1].end;
const replacement = readFileSync(newPath, "utf8").trim();
src = src.slice(0, start) + replacement + src.slice(end);
writeFileSync(KIT, src);
console.log(`${main}: replaced ${positions.map(p => p.n).join(", ")} (${end - start} → ${replacement.length} chars)`);
