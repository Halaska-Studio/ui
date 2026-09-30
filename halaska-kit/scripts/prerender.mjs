// After `vite build`: writes one static HTML file per route so every URL
// loads directly, and so crawlers and link previews get a real title,
// description and readable outline instead of an empty shell. React replaces
// the outline when it mounts. Also writes sitemap.xml.
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dist = join(root, "dist");
const ORIGIN = "https://ui.halaska.com";
const shell = readFileSync(join(dist, "index.html"), "utf8");
const imp = (p) => import(pathToFileURL(join(root, "src", "site", p)).href);
const registry = JSON.parse(readFileSync(join(root, "src", "site", "generated", "registry.json"), "utf8"));
const { COMPONENTS } = await imp("data/components/index.js");
const { SCREENS } = await imp("data/screens.js");
const { PATTERN_DOCS } = await imp("data/patterns/index.js");

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;");
const patterns = registry.groups.flatMap((g) => g.patterns.map((p) => ({ ...p, group: g.title })));
const pages = [
  { path: "/", title: "Halaska UI: a UI kit for AI products", description: "A single-file React UI kit for AI products, built on shadcn/ui. Screens, AI UX patterns and components for founders building with coding agents.", links: [["/screens", "Screens"], ["/patterns", "Patterns"], ["/components", "Components"], ["/docs/install", "Install"]] },
  { path: "/screens", title: "Screens", description: "Full example screens built only from the kit, annotated with the patterns they use.", links: SCREENS.map((s) => [`/screens/${s.slug}`, s.name]) },
  { path: "/patterns", title: "Patterns", description: `${patterns.length} AI UX patterns grouped by lifecycle: what to reach for, and when.`, links: patterns.map((p) => [`/patterns/${p.id.slice(4)}`, p.title]) },
  { path: "/components", title: "Components", description: `${COMPONENTS.length} components: shadcn/ui parity plus the Halaska additions.`, links: COMPONENTS.map((c) => [`/components/${c.slug}`, c.name]) },
  { path: "/docs/install", title: "Install", description: "Copy one prompt into Claude Code or Cursor and the agent sets up the kit and applies it screen by screen." },
  { path: "/docs/theming", title: "Theming", description: "Colour schemes, tokens, typeface and motion, all switchable at runtime." },
  { path: "/changelog", title: "Changelog", description: "A dated list of what shipped in Halaska UI." },
  ...SCREENS.map((s) => ({ path: `/screens/${s.slug}`, title: `${s.name} screen`, description: s.scenario })),
  ...patterns.map((p) => ({ path: `/patterns/${p.id.slice(4)}`, title: p.title, description: PATTERN_DOCS[p.id]?.useWhen || p.desc, eyebrow: p.group })),
  ...COMPONENTS.map((c) => ({ path: `/components/${c.slug}`, title: c.name, description: c.description, eyebrow: c.group })),
];

for (const page of pages) {
  const fullTitle = page.path === "/" ? page.title : `${page.title} · Halaska UI`;
  const url = ORIGIN + (page.path === "/" ? "/" : page.path);
  const outline = `<main data-prerender style="max-width:720px;margin:80px auto;padding:0 24px;font-family:system-ui,sans-serif">${page.eyebrow ? `<p>${esc(page.eyebrow)}</p>` : ""}<h1>${esc(page.title)}</h1><p>${esc(page.description)}</p>${page.links ? `<ul>${page.links.map(([h, t]) => `<li><a href="${h}">${esc(t)}</a></li>`).join("")}</ul>` : ""}<p><a href="/">Halaska UI</a></p></main>`;
  const html = shell
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(fullTitle)}</title>`)
    .replace(/(<meta name="description" content=")[^"]*(")/, `$1${esc(page.description)}$2`)
    .replace(/(<link rel="canonical" href=")[^"]*(")/, `$1${url}$2`)
    .replace(/(<meta property="og:title" content=")[^"]*(")/, `$1${esc(fullTitle)}$2`)
    .replace(/(<meta property="og:description" content=")[^"]*(")/, `$1${esc(page.description)}$2`)
    .replace(/(<meta property="og:url" content=")[^"]*(")/, `$1${url}$2`)
    .replace(/(<meta name="twitter:title" content=")[^"]*(")/, `$1${esc(fullTitle)}$2`)
    .replace(/(<meta name="twitter:description" content=")[^"]*(")/, `$1${esc(page.description)}$2`)
    .replace(/<div id="root"><\/div>/, `<div id="root">${outline}</div>`);
  const file = page.path === "/" ? join(dist, "index.html") : join(dist, `${page.path.slice(1)}.html`);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, html);
}
writeFileSync(join(dist, "sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${pages.map((p) => `  <url><loc>${ORIGIN}${p.path === "/" ? "/" : p.path}</loc></url>`).join("\n")}\n</urlset>\n`);
console.log(`prerendered ${pages.length} pages + sitemap.xml`);
