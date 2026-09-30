// Runtime view of the three tiers, assembled from the kit's own registry
// and the site's data files. One place for lookups, counts and search.
import * as Kit from "./kit";
import { COMPONENTS } from "./data/components/index.js";
import { SCREENS } from "./data/screens.js";
import { PATTERN_DOCS, patternSlug } from "./data/patterns/index.js";
import relations from "./generated/relations.json";

export const GROUPS = Kit.PATTERN_GROUPS.map((g) => ({
  ...g, slug: g.id.replace(/^grp-/, ""),
  patterns: g.patterns.map((p) => ({ ...p, slug: patternSlug(p.id), group: g.title, groupId: g.id, Component: Kit[p.component], docs: PATTERN_DOCS[p.id] || {} })),
}));
export const PATTERNS = GROUPS.flatMap((g) => g.patterns);
export const patternBySlug = (slug) => PATTERNS.find((p) => p.slug === slug);
export const patternById = (id) => PATTERNS.find((p) => p.id === id);
export const screenComponent = (s) => Kit[s.component];
export { COMPONENTS, SCREENS, relations };

export const COUNTS = { screens: SCREENS.length, patterns: PATTERNS.length, components: COMPONENTS.length };

export const SEARCH_INDEX = [
  ...SCREENS.map((s) => ({ kind: "Screen", label: s.name, hint: s.paradigm, to: `/screens/${s.slug}` })),
  ...PATTERNS.map((p) => ({ kind: "Pattern", label: p.title, hint: p.group, to: `/patterns/${p.slug}` })),
  ...COMPONENTS.map((c) => ({ kind: "Component", label: c.name, hint: (c.exports || []).join(", "), to: `/components/${c.slug}` })),
  { kind: "Docs", label: "Install", hint: "The install prompt", to: "/docs/install" },
  { kind: "Docs", label: "Theming", hint: "Colour schemes and tokens", to: "/docs/theming" },
  { kind: "Docs", label: "Changelog", hint: "What shipped", to: "/changelog" },
];
