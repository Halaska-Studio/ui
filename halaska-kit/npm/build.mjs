// Builds the npm package from the kit file next door: a compiled ESM entry
// (so bundlers need no JSX setup), the raw JSX, the type shim, README, LICENSE.
import { build } from "esbuild";
import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
const here = dirname(fileURLToPath(import.meta.url));
const kit = join(here, "..", "halaska-kit-v1.0.jsx");
mkdirSync(join(here, "dist"), { recursive: true });
await build({
  entryPoints: [kit], outfile: join(here, "dist", "index.js"), bundle: true, format: "esm", platform: "browser",
  minify: true, jsx: "automatic", external: ["react", "react-dom", "react/jsx-runtime"], target: "es2020", logLevel: "error",
  banner: { js: '"use client";' },
});
copyFileSync(kit, join(here, "halaska-kit.jsx"));
copyFileSync(join(here, "..", "public", "halaska-kit.d.ts"), join(here, "dist", "index.d.ts"));
copyFileSync(join(here, "..", "..", "LICENSE"), join(here, "LICENSE"));
const readme = readFileSync(join(here, "..", "..", "README.md"), "utf8")
  .replace(/!\[[^\]]*\]\(docs\/[^)]*\)\n*/g, "")
  .replace("## Use it\n", "## Install\n\n```bash\nnpm install halaska-ui\n```\n\n```jsx\nimport { Button, Card, PlanPreviewPattern, TaskList, ChatInput } from \"halaska-ui\";\n```\n\nThe package ships a compiled ESM build and the original single file (`halaska-ui/halaska-kit.jsx`) for anyone who prefers to vendor it.\n\n## Use it with a coding agent\n");
writeFileSync(join(here, "README.md"), readme);
const size = readFileSync(join(here, "dist", "index.js")).length;
console.log(`npm package built: dist/index.js ${(size / 1024).toFixed(0)} KB`);
