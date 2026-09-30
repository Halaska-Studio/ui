// The component catalogue: one entry per component page. Pure data, no JSX,
// so build scripts can import it too. Entries are split across four files by
// area; add a component by adding an entry and a matching examples file at
// src/site/examples/components/<slug>.jsx.
import forms from "./forms.js";
import overlaysNav from "./overlays-nav.js";
import dataFeedback from "./data-feedback.js";
import halaska from "./halaska.js";

export const COMPONENT_GROUPS = [
  "Forms and inputs", "Overlays", "Navigation", "Data display", "Feedback and status", "Layout and utility", "AI elements", "Dev surfaces",
];

export const COMPONENTS = [...forms, ...overlaysNav, ...dataFeedback, ...halaska]
  .slice()
  .sort((a, b) => a.name.localeCompare(b.name));

export const componentBySlug = (slug) => COMPONENTS.find((c) => c.slug === slug);

// kit export name → component page slug. A page's first export is its
// primary one and wins; other listings only fill names nobody claims first.
export const EXPORT_TO_SLUG = (() => {
  const map = {};
  COMPONENTS.forEach((c) => { const primary = (c.exports || [])[0]; if (primary && !map[primary]) map[primary] = c.slug; });
  COMPONENTS.forEach((c) => (c.exports || []).forEach((name) => { if (!map[name]) map[name] = c.slug; }));
  return map;
})();
