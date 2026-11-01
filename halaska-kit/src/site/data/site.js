// Landing copy that the prerender also reads, so crawlers see the same words. Pure data.

export const FAQ = [
  ["What is Halaska UI?", "A single-file React UI kit for AI products: 40 UX patterns for the moments an agent product has to get right (thinking, plans, approvals, tool activity, receipts, recovery) and 90 styled components, built on the shadcn/ui base. One file, react and react-dom only, MIT licensed, installed by pasting one prompt into a coding agent."],
  ["Which tools does this work with?", "Any coding agent that can fetch a file and edit your project: Claude Code, Cursor, Codex, Windsurf and similar. For browser builders like Lovable or Bolt, paste the prompt and, if the tool can't fetch, upload the kit file from the link in the prompt."],
  ["Why do you ask for an email?", "So you hear when new components and patterns land, along with other offers and services from Halaska Studio. The prompt is copied the moment you submit, and you can unsubscribe from any email."],
  ["Do I need to install anything?", "No. The kit is a single file with inline styles. It needs react and react-dom, which your project already has. No Tailwind, no CSS setup, no chart library."],
  ["Will it work on a project that already has a UI?", "Yes, that's the main use. The prompt tells the agent to keep your routing, state and data, and to swap screens over to the kit one at a time."],
  ["Can I change the look?", "Yes. Light or dark, the colour scheme, the typeface and the motion are all switchable. Try the first two in the bar at the bottom of this page. The rest is on the Theming page."],
  ["Is this the same as shadcn/ui?", "It starts from the shadcn/ui base, so the foundations and the component names are the ones you already know. On top of that we have added our own adaptations for AI interfaces, the patterns for thinking, approvals and agent activity, and our own styling, so the look is already decided for you."],
  ["Can I use this commercially?", "Yes. MIT licensed, use it in anything."],
  ["Where's the source?", "On GitHub at github.com/Halaska-Studio/ui. Open an issue there if something is missing or broken."],
];

export const HOW = [
  ["Copy the prompt", "Five short lines. They tell your coding agent where the kit is and how to use it."],
  ["Paste it into Claude Code or Cursor", "The agent downloads one React file. There is nothing else to install."],
  ["The agent applies the kit", "It restyles your prototype one screen at a time, so you can check each change."],
];
