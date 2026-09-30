// Dated list of what shipped. Newest first. Pure data.
export const VERSION = "1.0.0";
export const CHANGELOG = [
  { date: "2026-09-30", title: "A landing page and a browser", items: [
    "The kit is now called Halaska UI.",
    "The site is now a landing page plus a docs-style browser, with a page for every screen, pattern and component.",
    "Both example screens have a mobile layout. Pass layout=\"mobile\" to use it.",
    "Accessibility pass: dialogs trap focus and close on Escape, checkboxes and radios work from the keyboard, menus, tabs and selects take arrow keys, and status components carry roles.",
    "Every section has its own address, and a copy-link control.",
    "Floating pattern content now sits in a card instead of loose on the stage.",
  ] },
  { date: "2026-09-29", title: "Agentic navigation", items: [
    "New pattern group: Contextual taskbar and Spaces and agents.",
    "The contextual bar resizes to its content and separates agent suggestions from your own actions.",
  ] },
  { date: "2026-09-25", title: "Shorter install prompt", items: [
    "The install prompt is five lines. The detail moved to a hosted guide the agent reads.",
    "Violet is the default accent.",
  ] },
  { date: "2026-09-10", title: "1.0.0", items: [
    "First public release: 38 patterns in five lifecycle groups, two example screens, around 100 components.",
    "Phone layout, runtime typeface and motion switching, and a before and after comparison.",
  ] },
];
