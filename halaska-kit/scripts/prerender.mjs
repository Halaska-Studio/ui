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

const esc = (s) => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;");
const api = JSON.parse(readFileSync(join(root, "src", "site", "generated", "api.json"), "utf8"));
const relations = JSON.parse(readFileSync(join(root, "src", "site", "generated", "relations.json"), "utf8"));
const { FAQ, HOW } = await imp("data/site.js");
const { GROUP_INTROS } = await imp("data/patterns/groups.js");
const { CHANGELOG, VERSION } = await imp("data/changelog.js");
const { PARITY_SUMMARY } = await imp("data/parity.js");
const TODAY = new Date().toISOString().slice(0, 10);
const LAST = CHANGELOG[0]?.date || TODAY;
const patterns = registry.groups.flatMap((g) => g.patterns.map((p) => ({ ...p, group: g.title, groupId: g.id })));
const compBySlug = Object.fromEntries(COMPONENTS.map((c) => [c.slug, c]));
const patById = Object.fromEntries(patterns.map((p) => [p.id, p]));
const pslug = (p) => p.id.slice(4);
const link = (href, text) => `<a href="${esc(href)}">${esc(text)}</a>`;
const list = (items) => items.length ? `<ul>${items.map((i) => `<li>${i}</li>`).join("")}</ul>` : "";
const props = (name) => (api[name] || []).filter((x) => x.name !== "theme");
const propList = (names) => names.map((n) => props(n).length ? `<h3>${esc(n)} props</h3><ul>${props(n).map((x) => `<li><code>${esc(x.name)}</code> <code>${esc(x.type || "")}</code>${x.default ? ` (default ${esc(x.default)})` : ""}: ${esc(x.description || "")}</li>`).join("")}</ul>` : "").join("");

// The site's one-paragraph identity, repeated where crawlers look first.
const ABOUT = `Halaska UI is a single-file React UI kit for AI products: ${patterns.length} AI UX patterns and ${COMPONENTS.length} styled components, built on the shadcn/ui base, with inline styles and no dependencies beyond react and react-dom. It is MIT licensed and installed by pasting one prompt into a coding agent such as Claude Code or Cursor. Made by Chris Halaska and Halaska Studio.`;

// ── Page bodies: real text, so an answer engine can quote the page ────
const bodyLanding = () => `
<p>${esc(ABOUT)}</p>
<h2>What is inside</h2>
<ul>
  <li>${link("/screens", `${SCREENS.length} example screens`)}: ${SCREENS.map((s) => esc(s.name)).join(", ")}, each built only from the kit.</li>
  <li>${link("/patterns", `${patterns.length} AI UX patterns`)} in ${registry.groups.length} lifecycle groups: ${registry.groups.map((g) => link(`/patterns#${g.id}`, g.title)).join(", ")}.</li>
  <li>${link("/components", `${COMPONENTS.length} components`)}: ${esc(PARITY_SUMMARY)}</li>
</ul>
<h2>How it works</h2>
<ol>${HOW.map(([h, b]) => `<li><strong>${esc(h)}.</strong> ${esc(b)}</li>`).join("")}</ol>
<h2>Patterns by group</h2>
${registry.groups.map((g) => `<h3>${link(`/patterns#${g.id}`, g.title)}</h3><p>${esc(GROUP_INTROS[g.id] || g.blurb || "")}</p>${list(g.patterns.map((p) => `${link(`/patterns/${pslug(p)}`, p.title)}: ${esc(PATTERN_DOCS[p.id]?.useWhen || p.desc)}`))}`).join("")}
<h2>Components</h2>
${list(COMPONENTS.map((c) => `${link(`/components/${c.slug}`, c.name)}: ${esc(c.description)}`))}
<h2>Questions people ask</h2>
${FAQ.map(([q, a]) => `<h3>${esc(q)}</h3><p>${esc(a)}</p>`).join("")}
<h2>Links</h2>
${list([link("/docs/install", "Install"), link("/styles", "Styles"), link("/docs/theming", "Theming"), link("/changelog", `Changelog (version ${VERSION})`), link("/llms.txt", "llms.txt, the API reference for coding agents"), link("https://github.com/Halaska-Studio/ui", "Source on GitHub"), link("https://chrishalaska.com", "Chris Halaska"), link("https://halaska.com", "Halaska Studio")])}`;

const bodyPattern = (p) => {
  const d = PATTERN_DOCS[p.id] || {};
  const rel = relations.patterns[p.id] || {};
  return `
<p>${esc(d.useWhen || p.desc)}</p>
<p>${esc(p.desc)}</p>
<p>Part of ${link(`/patterns#${p.groupId}`, p.group)}. ${esc(GROUP_INTROS[p.groupId] || "")}</p>
${d.do?.length ? `<h2>Do</h2>${list(d.do.map(esc))}` : ""}
${d.dont?.length ? `<h2>Don't</h2>${list(d.dont.map(esc))}` : ""}
${d.states?.length ? `<h2>States</h2>${list(d.states.map((s) => typeof s === "string" ? esc(s) : `<strong>${esc(s.name || s.title || "")}</strong>: ${esc(s.note || s.desc || s.description || s.text || "")}`))}` : ""}
${d.usage ? `<h2>Usage</h2><pre><code>${esc(d.usage)}</code></pre>` : `<h2>Usage</h2><pre><code>import { ${esc(p.component)} } from "./halaska-kit";\n\n&lt;${esc(p.component)} /&gt;</code></pre>`}
${propList([p.component])}
${rel.components?.length ? `<h2>Built from</h2><p>${rel.components.map((s) => compBySlug[s] ? link(`/components/${s}`, compBySlug[s].name) : esc(s)).join(", ")}</p>` : ""}
${d.neighbours?.length ? `<h2>Related patterns</h2><p>${d.neighbours.map((n) => patById[n.id] ? link(`/patterns/${pslug(patById[n.id])}`, patById[n.id].title) : esc(n.id)).join(", ")}</p>` : ""}`;
};

const bodyComponent = (c) => {
  const rel = relations.components[c.slug] || {};
  return `
<p>${esc(c.description)}</p>
<p>Group: ${link(`/components#${c.slug}`, c.group)}. Exports: ${(c.exports || []).map((e) => `<code>${esc(e)}</code>`).join(", ")}. ${c.shadcn ? `shadcn/ui equivalent: ${esc(c.shadcn)} (${esc(c.status === "match" ? "matches" : c.status === "partial" ? "partial parity" : c.status)}).` : "Halaska addition with no shadcn/ui equivalent."}</p>
<h2>Usage</h2><pre><code>import { ${esc((c.exports || [c.name])[0])} } from "./halaska-kit";</code></pre>
${propList(c.exports || [])}
${c.a11y?.length ? `<h2>Accessibility</h2>${list(c.a11y.map(esc))}` : ""}
${c.gaps?.length ? `<h2>Known gaps</h2>${list(c.gaps.map(esc))}` : ""}
${rel.patterns?.length || rel.screens?.length ? `<h2>Used in</h2><p>${[...(rel.screens || []).map((s) => link(`/screens/${s}`, `${s} screen`)), ...(rel.patterns || []).map((id) => patById[id] ? link(`/patterns/${pslug(patById[id])}`, patById[id].title) : esc(id))].join(", ")}</p>` : ""}`;
};

const bodyScreen = (s) => {
  const rel = relations.screens[s.slug] || {};
  return `<p>${esc(s.scenario)}</p><p>${esc(s.description)}</p>
<h2>Patterns on this screen</h2>${list((s.hotspots || []).map((h) => patById[h.pattern] ? `${link(`/patterns/${pslug(patById[h.pattern])}`, patById[h.pattern].title)}: ${esc(h.note)}` : esc(h.note)))}
${rel.components?.length ? `<h2>Built from</h2><p>${rel.components.map((x) => compBySlug[x] ? link(`/components/${x}`, compBySlug[x].name) : esc(x)).join(", ")}</p>` : ""}`;
};

const bodyChangelog = () => CHANGELOG.map((e) => `<h2>${esc(e.date)}: ${esc(e.title)}</h2>${list(e.items.map(esc))}`).join("");
const bodyIndex = (links, intro) => `<p>${esc(intro)}</p>${list(links.map(([href, text, line]) => `${link(href, text)}${line ? `: ${esc(line)}` : ""}`))}`;

const pages = [
  { path: "/", title: "Halaska UI: a UI kit for AI products", description: ABOUT, body: bodyLanding(), schema: "site" },
  { path: "/screens", title: "Screens", description: "Full example screens built only from the kit, annotated with the patterns they use.", body: bodyIndex(SCREENS.map((s) => [`/screens/${s.slug}`, `${s.name} screen`, s.description]), "Whole product screens built only from the kit's patterns and components.") },
  { path: "/patterns", title: "Patterns", description: `${patterns.length} AI UX patterns grouped by lifecycle: what to reach for, and when.`, body: registry.groups.map((g) => `<h2 id="${esc(g.id)}">${esc(g.title)}</h2><p>${esc(GROUP_INTROS[g.id] || g.blurb || "")}</p>${list(g.patterns.map((p) => `${link(`/patterns/${pslug(p)}`, p.title)}: ${esc(PATTERN_DOCS[p.id]?.useWhen || p.desc)}`))}`).join("") },
  { path: "/components", title: "Components", description: `${COMPONENTS.length} components: shadcn/ui parity plus the Halaska additions.`, body: `<p>${esc(PARITY_SUMMARY)}</p>` + [...new Set(COMPONENTS.map((c) => c.group))].map((g) => `<h2>${esc(g)}</h2>${list(COMPONENTS.filter((c) => c.group === g).map((c) => `${link(`/components/${c.slug}`, c.name)}: ${esc(c.description)}`))}`).join("") },
  { path: "/docs/install", title: "Install", description: "Copy one prompt into Claude Code or Cursor and the agent sets up the kit and applies it screen by screen. Or add the file by hand.", body: `<ol>${HOW.map(([h, b]) => `<li><strong>${esc(h)}.</strong> ${esc(b)}</li>`).join("")}</ol><h2>By hand</h2><pre><code>curl -o src/halaska-kit.jsx https://ui.halaska.com/halaska-kit.jsx</code></pre><p>Then <code>import { Button, PlanPreviewPattern } from "./halaska-kit"</code>. Dependencies: react and react-dom. The agent guide is at ${link("/install.md", "/install.md")} and the API reference at ${link("/llms.txt", "/llms.txt")}.</p>` },
  { path: "/styles", title: "Styles", description: "Preview Halaska UI in your brand: a colour turned into a tonal scale, three headline styles and three corner styles, applied to every preview.", body: `<p>Three settings restyle the kit to a brand, on this site and in your project through BrandProvider.</p><h2>Colour</h2><p>Greyscale is the default, with a dark primary action and one violet accent. Give the kit any hex colour and it becomes the primary action, and every grey takes a trace of its hue. The colour is spread into a tonal scale from 0, black, to 100, white, the way Material Design builds colour systems: a tone is a measured lightness, so the same tone has the same contrast in any hue. Surfaces, borders and text take fixed tones from a near-grey scale in the same hue, in light and in dark.</p><h2>Headlines</h2><p>Three headline styles: Clean (Geist), Editorial (Instrument Serif) and Technical (Geist Mono). Body text stays in the sans face.</p><h2>Corners</h2><p>Three corner styles: Sharp, Soft and Round. Round is the default. Every corner radius in the kit scales with the choice, and Sharp keeps a slight radius.</p><h2>Use it</h2><pre>&lt;BrandProvider color="#2563eb" type="editorial" radius="round"&gt;…&lt;/BrandProvider&gt;</pre>` },
  { path: "/docs/theming", title: "Theming", description: "Light and dark themes, brand colour, the palette, spacing, radius and type tokens, typeface and motion, all switchable at runtime.", body: `<p>Every component takes a theme prop or reads the nearest ThemeProvider. Greyscale is the default with one violet accent; BrandProvider takes a brand colour, a headline style and a corner style, and AccentContext swaps the accent alone. Tokens: an 8px spacing scale, iOS-style radii, Geist type. setKitFont and setKitMotion switch the typeface and the motion preset at runtime.</p>` },
  { path: "/changelog", title: "Changelog", description: `A dated list of what shipped in Halaska UI. Current version ${VERSION}.`, body: bodyChangelog() },
  ...SCREENS.map((s) => ({ path: `/screens/${s.slug}`, title: `${s.name} screen`, description: s.scenario, body: bodyScreen(s), eyebrow: "Screen", schema: "article" })),
  ...patterns.map((p) => ({ path: `/patterns/${pslug(p)}`, title: p.title, description: PATTERN_DOCS[p.id]?.useWhen || p.desc, eyebrow: p.group, body: bodyPattern(p), schema: "article", section: ["Patterns", "/patterns"] })),
  ...COMPONENTS.map((c) => ({ path: `/components/${c.slug}`, title: c.name, description: c.description, eyebrow: c.group, body: bodyComponent(c), schema: "article", section: ["Components", "/components"], added: c.added })),
];

// ── Structured data ───────────────────────────────────────────────
const ORG = { "@type": "Organization", "@id": `${ORIGIN}/#org`, name: "Halaska Studio", url: "https://halaska.com", founder: { "@type": "Person", "@id": "https://chrishalaska.com/#me", name: "Chris Halaska", url: "https://chrishalaska.com", sameAs: ["https://x.com/chalaska", "https://www.linkedin.com/in/chrishalaska"] } };
const jsonld = (page, url) => {
  const graph = [ORG];
  if (page.schema === "site") {
    graph.push({ "@type": "WebSite", "@id": `${ORIGIN}/#site`, url: `${ORIGIN}/`, name: "Halaska UI", description: ABOUT, publisher: { "@id": `${ORIGIN}/#org` } });
    graph.push({ "@type": "SoftwareSourceCode", "@id": `${ORIGIN}/#kit`, name: "Halaska UI", description: ABOUT, url: `${ORIGIN}/`, codeRepository: "https://github.com/Halaska-Studio/ui", programmingLanguage: "JavaScript", runtimePlatform: "React", license: "https://opensource.org/licenses/MIT", version: VERSION, dateModified: LAST, author: { "@id": "https://chrishalaska.com/#me" }, publisher: { "@id": `${ORIGIN}/#org` }, keywords: "React UI kit, AI UI components, agent UI patterns, generative UI, shadcn/ui, chat interface components, AI UX patterns" });
    graph.push({ "@type": "FAQPage", mainEntity: FAQ.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })) });
  } else {
    graph.push({ "@type": "TechArticle", headline: `${page.title} · Halaska UI`, description: page.description, url, isPartOf: { "@id": `${ORIGIN}/#site` }, about: { "@id": `${ORIGIN}/#kit` }, author: { "@id": "https://chrishalaska.com/#me" }, publisher: { "@id": `${ORIGIN}/#org` }, dateModified: page.added || LAST, inLanguage: "en" });
    if (page.section) graph.push({ "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Halaska UI", item: `${ORIGIN}/` }, { "@type": "ListItem", position: 2, name: page.section[0], item: ORIGIN + page.section[1] }, { "@type": "ListItem", position: 3, name: page.title, item: url }] });
  }
  return `<script type="application/ld+json">${JSON.stringify({ "@context": "https://schema.org", "@graph": graph })}</script>`;
};

for (const page of pages) {
  const fullTitle = page.path === "/" ? page.title : `${page.title} · Halaska UI`;
  const url = ORIGIN + (page.path === "/" ? "/" : page.path);
  const outline = `<main data-prerender style="max-width:720px;margin:80px auto;padding:0 24px;font-family:system-ui,sans-serif;line-height:1.6">${page.eyebrow ? `<p>${esc(page.eyebrow)}</p>` : ""}<h1>${esc(page.title)}</h1>${page.body || `<p>${esc(page.description)}</p>`}<p>${link("/", "Halaska UI")} · ${link("/components", "Components")} · ${link("/patterns", "Patterns")} · ${link("/screens", "Screens")} · ${link("/docs/install", "Install")}</p></main>`;
  const html = shell
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(fullTitle)}</title>`)
    .replace(/(<meta name="description" content=")[^"]*(")/, `$1${esc(page.description)}$2`)
    .replace(/(<link rel="canonical" href=")[^"]*(")/, `$1${url}$2`)
    .replace(/(<meta property="og:title" content=")[^"]*(")/, `$1${esc(fullTitle)}$2`)
    .replace(/(<meta property="og:description" content=")[^"]*(")/, `$1${esc(page.description)}$2`)
    .replace(/(<meta property="og:url" content=")[^"]*(")/, `$1${url}$2`)
    .replace(/(<meta name="twitter:title" content=")[^"]*(")/, `$1${esc(fullTitle)}$2`)
    .replace(/(<meta name="twitter:description" content=")[^"]*(")/, `$1${esc(page.description)}$2`)
    .replace("</head>", `  <meta name="author" content="Chris Halaska, Halaska Studio" />\n  <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large" />\n  ${jsonld(page, url)}\n</head>`)
    .replace(/<div id="root"><\/div>/, `<div id="root">${outline}</div>`);
  const file = page.path === "/" ? join(dist, "index.html") : join(dist, `${page.path.slice(1)}.html`);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, html);
}
writeFileSync(join(dist, "sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${pages.map((p) => `  <url><loc>${ORIGIN}${p.path === "/" ? "/" : p.path}</loc><lastmod>${p.added || LAST}</lastmod></url>`).join("\n")}\n</urlset>\n`);

// ── llms-full.txt: every page as plain text, then the API reference ──
const strip = (h) => h.replace(/<li>/g, "\n- ").replace(/<h2[^>]*>/g, "\n\n## ").replace(/<h3>/g, "\n\n### ").replace(/<pre><code>/g, "\n```\n").replace(/<\/code><\/pre>/g, "\n```\n").replace(/<[^>]+>/g, "").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/\n{3,}/g, "\n\n").trim();
const full = [`# Halaska UI\n\n> ${ABOUT}\n\nSite: ${ORIGIN} · Source: https://github.com/Halaska-Studio/ui · Kit file: ${ORIGIN}/halaska-kit.jsx · Agent guide: ${ORIGIN}/install.md · API reference: ${ORIGIN}/llms.txt`,
  ...pages.map((p) => `# ${p.title}\n${ORIGIN}${p.path === "/" ? "/" : p.path}\n\n${strip(p.body || p.description)}`)].join("\n\n---\n\n");
writeFileSync(join(dist, "llms-full.txt"), full + "\n\n---\n\n" + readFileSync(join(dist, "llms.txt"), "utf8"));
console.log(`prerendered ${pages.length} pages + sitemap.xml + llms-full.txt`);
