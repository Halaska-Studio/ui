// Dated list of what shipped. Newest first. Pure data.
export const VERSION = "1.1.0";
export const CHANGELOG = [
  {
    date: "2026-11-10", title: "Styles: the kit in your brand",
    items: [
      "BrandProvider restyles every component inside it from three settings: a colour, a headline style and a corner style.",
      "A brand colour becomes the primary action and is spread into a tonal scale from 0 to 100. Every grey takes a trace of its hue, in light and dark. Greyscale stays the default.",
      "Three headline styles (Clean, Editorial, Technical) and three corner styles (Sharp, Soft, Round).",
      "Round is now the default corner style, in the kit and on this site: buttons and inputs are pills and cards take a larger corner. Pass radius=\"soft\" to BrandProvider for the earlier corners.",
      "Light mode container and input fills are a touch lighter.",
      "The bar at the foot of the site sets all three for every preview, with a custom hex field. The new Styles page shows the scale and the roles on it.",
    ],
  },
  { date: "2026-11-04", title: "Tighter frames, one pattern at a time", items: [
      "Button, icon button, input and toggle corners now follow the control's height: a third of it, rounded to an even number. A 30px button gets 10px corners, a 48px one gets 16px, so small and large controls read as one shape.",
    "Preview frames, tiles and stage frames take a 12px corner, so the frame no longer crowds the controls inside it. Dialogs and the kit's own cards keep theirs.",
    "The before and after slider's handle and divider take the accent colour.",
    "The patterns section on the landing page shows one pattern at full size and cycles through the six groups, instead of six cards of small thumbnails. Hovering pauses it; the tabs jump.",
    "Text links across the site gain a hover state: the underline draws in from the left and retracts the same way. Pill links and the details links also have a pressed state.",
  ] },
  { date: "2026-11-03", title: "A darker dark mode", items: [
    "Dark mode starts from near black. Containers sit on the page as tonal layers, each one step lighter, with hairlines close to their surface instead of outlines.",
    "Type is white on black, with a mid-grey secondary tone. Light mode is the reverse: a white page, grey stages, white cards and near-black type.",
    "Cards, dialogs, menus, popovers and toasts share the new elevated tone. Cards take a slightly tighter corner.",
  ] },
  { date: "2026-10-28", title: "Agent surfaces and generative UI", items: [
    "Thirteen new components, all prop-driven: Task List, Question Card, Reasoning Steps, Trace Waterfall, Chat Input, Message, Conversation, Chat History, Result Cards, Document Agent, Media Generation, Attachment and Marker.",
    "The components index is grouped by how an AI product is built: Agents, Generative UI, Content, then the base layer.",
    "New and Updated badges in the sidebar.",
    "The index previews adapt to narrow widths.",
  ] },
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
