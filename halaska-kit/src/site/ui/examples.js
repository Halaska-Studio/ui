// Example files are plain JSX modules with `// @example Title | description`
// markers above each exported component. The page imports the module to
// render the examples and the raw text to show their code, so the code on
// screen is always the code that ran.
const componentModules = import.meta.glob("../examples/components/*.jsx");
const componentRaw = import.meta.glob("../examples/components/*.jsx", { query: "?raw", import: "default" });
const patternModules = import.meta.glob("../examples/patterns/*.jsx");
const patternRaw = import.meta.glob("../examples/patterns/*.jsx", { query: "?raw", import: "default" });

export function parseExamples(raw, mod) {
  const parts = String(raw).split(/^\/\/ @example /m).slice(1);
  return parts.map((chunk) => {
    const nl = chunk.indexOf("\n");
    const [title, description = ""] = chunk.slice(0, nl).split(" | ").map((s) => s.trim());
    const code = chunk.slice(nl + 1).replace(/^export /gm, "").trim();
    const name = (code.match(/function (\w+)/) || [])[1];
    return { title, description, code, name, Component: mod[name] };
  }).filter((e) => e.Component);
}

async function load(modules, raws, dir, slug) {
  const key = `../examples/${dir}/${slug}.jsx`;
  if (!modules[key]) return null;
  const [mod, raw] = await Promise.all([modules[key](), raws[key]()]);
  return { usage: mod.usage || "", examples: parseExamples(raw, mod) };
}
export const loadComponentExamples = (slug) => load(componentModules, componentRaw, "components", slug);
export const loadPatternExamples = (slug) => load(patternModules, patternRaw, "patterns", slug);
export const hasComponentExamples = (slug) => !!componentModules[`../examples/components/${slug}.jsx`];
