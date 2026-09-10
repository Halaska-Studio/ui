// Applies rewritten copy from narrative/*.out.json to the kit: each key is a
// top-level block name; the old block text (from source-map.json) is replaced
// verbatim with the new text. Usage: node scripts/splice-narrative.mjs <out.json>…
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const KIT = join(root, "halaska-kit-v1.3.jsx");
const { blocks } = JSON.parse(readFileSync(join(root, "public", "source-map.json"), "utf8"));
let src = readFileSync(KIT, "utf8");
let replaced = 0, skipped = [];
for (const file of process.argv.slice(2)) {
  const out = JSON.parse(readFileSync(file, "utf8"));
  const fresh = [];
  for (const [name, text] of Object.entries(out)) {
    const old = blocks[name];
    if (!old) { fresh.push([name, text]); continue; }
    if (text === old) continue;
    const i = src.indexOf(old);
    if (i === -1) { skipped.push(`${name} (old text not found)`); continue; }
    src = src.slice(0, i) + text.trimEnd() + src.slice(i + old.length);
    replaced++;
  }
  // Unknown names are new top-level blocks: insert them before the first
  // known block of this file (in source order) so helpers precede their users.
  if (fresh.length) {
    const known = Object.keys(out).filter(n => blocks[n]).map(n => src.indexOf(out[n].trimEnd())).filter(i => i >= 0);
    if (!known.length) { skipped.push(...fresh.map(([n]) => `${n} (new block, no anchor)`)); continue; }
    const at = Math.min(...known);
    src = src.slice(0, at) + fresh.map(([, t]) => t.trimEnd()).join("\n\n") + "\n\n" + src.slice(at);
    replaced += fresh.length;
  }
}
writeFileSync(KIT, src);
console.log(`replaced ${replaced} blocks${skipped.length ? "; skipped: " + skipped.join(", ") : ""}`);
