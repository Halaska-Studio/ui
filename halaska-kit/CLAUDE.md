# Halaska UI

The public name is **Halaska UI** (renamed from "UI by Halaska" on 2026-09-30 at Chris's request). Use it everywhere user-facing. The folder and file names (`halaska-kit/`, `halaska-kit-v1.0.jsx`) are unchanged.

UX patterns and styled components for AI products — agents, copilots, and chat — by Halaska Studio.
Built on shadcn/ui foundations. Optimized for Claude artifact prototyping, portable to any React project.

## Project Structure

The kit is a **single self-contained file**: `halaska-kit-v1.0.jsx`. The `src/` folder is just a thin Vite entry that imports it.

```
halaska-kit/
├── CLAUDE.md              # This file — project context for Claude Code
├── package.json           # Vite + React (react + react-dom are the only deps)
├── src/
│   ├── main.jsx           # Vite entry — imports ../halaska-kit-v1.0.jsx
│   ├── tokens.js          # (reference copy of tokens)
│   ├── hooks.js           # (reference copy of hooks)
│   └── components/index.js # Component name index
└── halaska-kit-v1.0.jsx   # THE KIT — tokens, components, patterns, showcase page
```

## Site architecture (restructure branch, from 2026-09-30)

**Working rule: nothing goes live unless Chris says so.** The restructure lives on the local `restructure` branch. Do not deploy, merge to `main`, or push. Working notes (briefs, audits, process) live in `docs/internal/`, which is git-ignored: the repo is public and Chris wants only the public-facing material in it, never how the work was planned.

The site is now a landing page plus a docs-style browser, and ALL site code lives in `src/site/` (the kit file stays one file with react and react-dom only; the site imports it through `src/site/kit.js`). The old single-page showcase is still the kit file's default export but the site no longer renders it (everything under "Showcase Page Order & Navigation" below describes that old page).

- **Routes** (`src/site/router.jsx`, a small history router, no dependency): `/`, `/screens`, `/screens/<slug>`, `/patterns`, `/patterns/<slug>`, `/components`, `/components/<slug>`, `/docs/install`, `/docs/theming`, `/changelog`. `vercel.json` rewrites unknown paths to `index.html`; `scripts/prerender.mjs` (run by `npm run build` after `vite build`) writes a static HTML file per route with its own title, description, canonical and a readable outline, plus `sitemap.xml`. Old hash links (`#pat-plan`, `#grp-control`) redirect to the new routes.
- **Shell** (`App.jsx`, `site.css`, `chrome/`): global `Header` (name, Screens / Patterns / Components / Docs, Cmd+K `Search`, GitHub, and a "Copy prompt" button top-right, which Chris wants there as well as in the bar), `SideNav` on browser routes (Get started, Screens, Patterns as collapsible lifecycle groups with counts, Components alphabetical with tags; becomes a drawer under 900px; collapses to a thin strip from a button at its top, remembered in localStorage `halaska:nav`), an "On this page" rail on wide screens, `Footer`, and the bottom action bar on every page (`chrome/FloatingCopy.jsx`, styled like the original showcase bar: grey "Copy install prompt" text with no icon, a sliding sun/moon toggle, and a paint-bucket button whose swatches expand inline; Chris asked for the bar back on 2026-09-30 because it keeps the page controls prominent; the copy label and prompt are scoped on pattern and screen pages). The theme follows the system setting until the visitor picks one; the choice and the accent persist in localStorage. No screen count is shown anywhere (there are only two screens).
- **Three templates, no exceptions**: `pages/ComponentPage.jsx` (header, hero preview, usage, examples, props, accessibility, used in, previous/next), `pages/PatternPage.jsx` (header with "Use when", hero preview, states, guidance, built from, code, seen in), `pages/ScreenPage.jsx` (header, full preview with a Desktop / Mobile toggle and full screen, anatomy with numbered hotspots, built from, code). Index pages are in `pages/indexes.jsx`.
- **One preview frame**: `ui/PreviewFrame.jsx` (`PreviewFrame`: canvas, Preview/Code tabs, per-frame theme and colour scheme, copy, lazy mount; `LiveThumb`: small scaled live preview). `ui/CodeBlock.jsx` highlights code. `ui/ScreenStage.jsx` renders a screen scaled with hotspots in either layout, and holds `LayoutToggle`, `useLayout` (phones start on mobile) and the site's `BeforeAfter`. The preview frame toolbar also has a phone-width toggle for components.
- **Data, stored once**: `data/components/*.js` is the catalogue (slug, name, exports, group, shadcn equivalent, status, tags, description, a11y, gaps). `data/patterns/*.js` holds per-pattern guidance keyed by `pat-*` id (useWhen, do, dont, neighbours, states, usage) and `groups.js` the group intros. `data/screens.js` holds screens and hotspots. `data/parity.js` is the shadcn/ui audit table. `data/changelog.js` holds `VERSION` and entries. All pure JS so build scripts can import them.
- **Examples are real files**: `examples/components/<slug>.jsx` and `examples/patterns/<slug>.jsx` export a `usage` string and components marked `// @example Title | description`. `ui/examples.js` lazy-loads the module to render and the raw text to show, so the code shown is the code that ran. Examples never pass `theme`; the frame provides it through context.
- **Generated** (`scripts/generate-site-data.mjs`, on prebuild and predev): `generated/registry.json` (from `PATTERN_GROUPS`), `generated/api.json` (props from function signatures and `@prop` docblocks: this feeds the Props tables), `generated/relations.json` (pattern → components and screen → patterns, by tracing the kit source; feeds every "Built from", "Used in" and "Seen in" chip).
- **Email gate** (`email/gate.jsx`): the install prompt is the only gated thing, on first use. Entry points: hero inline field, the action bar, the "Add this to your project" block at the foot of every detail page, How it works, and the lighter updates-only offer in the footer and changelog. After one sign-up a localStorage flag makes every copy instant. Pattern and screen pages copy a scoped prompt (`promptFor`). After delivery the modal shows the prompt, the next step and a book-a-call link. Sign-ups post ONLY the email address to the Kit form (Chris does not want custom fields in Kit; the optional "What are you building?" question was removed for the same reason). GA events `kit_signup` and `kit_prompt_copy` carry the placement.
- **Kit additions for the site** (additive only): exports `INSTALL_PROMPT`, `ACCENT_COLORS`, `PARADIGM_STAGE`, `PARADIGM_STAGE_MOBILE`, and shadcn-name aliases `Input`, `Textarea`, `Switch`, `Separator`, `Alert`, `Empty`, `Item`, `Command`.
- **Mobile screens (2026-09-30)**: `ChatParadigmExample`, `CanvasParadigmExample` and `ChatParadigmBefore` take `layout="mobile"` (390×780 stage). Chat: the thread list becomes a drawer behind a menu button and the top bar splits into two rows. Canvas: the flow runs top to bottom with labelled branches (`CanvasXBranch`), no minimap, and settings open as a bottom sheet. `data/screens.js` carries `hotspotsMobile` beside `hotspots`.
- **Accessibility pass (2026-09-30)**: helpers near `interactiveBase` (`useModalFocus`, `arrowNav`, `focusFirstItem`, `pressable`, `withPopupState`, `useUid`, `labelText`). Dialogs, Sheet and CommandMenu trap focus, close on Escape and return focus; Checkbox and Radio are real buttons with roles; Select, menus, tabs and segmented controls take arrow keys; tooltips and hover cards open on focus; status, progress and alert components carry roles. `Button` keeps the browser's default `type` (do not default it to "button": that would change form behaviour for existing users). The React import list now also includes `cloneElement` and `isValidElement`.
- **Copy and positioning (2026-09-30)**: the hero carries a "Built on shadcn/ui" pill and says so in the lead, because Chris sees it as the main trust signal. The sign-up copy says emails cover new components and patterns plus other offers and services from the studio; never promise "no selling". The layout toggle is icons only. `ChatParadigmBefore` has a dark version (its palette is CSS variables, `CHATB_DARK` overrides them).
- **Adding things**: a component page = one catalogue entry + one examples file. A pattern page appears automatically from `PATTERN_GROUPS`; add its guidance entry. A screen = an entry in `data/screens.js`.

## Showcase Page Order & Navigation

The page opens with the hero (title row, then Intention / Execution; the "Made for founders building with coding agents." sentence now opens the Intention paragraph, the separate line was folded in 2026-09-10), then **Before and after** (`BeforeAfterSection`: a `CompareSlider` (drag divider, arrow keys, touch; Before left, After right, starts at 50%; idles with a slow 9s eased drift between 42% and 58% until the first interaction, honours prefers-reduced-motion) over two `LiveStage`s, `ChatParadigmBefore` (a realistic generic Tailwind-style first pass in plain elements) and the real `ChatParadigmExample`; the toggle was replaced 2026-09-10 because Chris felt it would be missed), then **Two UX paradigms** — Chat and Canvas — each a complete example product screen (`ChatParadigmExample`, `CanvasParadigmExample`; registry `UX_PARADIGMS` with `example` names) built only from kit components/patterns in the Alpha narrative. `ParadigmPreview` renders the screen at a 1200×760 stage scaled to the column (non-interactive live thumbnail, "Open full screen" on hover); tapping opens `ParadigmFullscreen`: a windowed layer, not true full screen (24px inset on a blurred scrim, radius xl, hairline border; since 2026-09-25 there is no header bar, just a floating ✕ Close IconButton top-right + Esc; body scroll locked; example fills the window with a 1000px min width). The thumbnail's hover button reads "Expand". Each paradigm section also chips-links its pattern groups (Chat → conversation/trust/control, Canvas → output/ambient/control). Rail has a "Paradigms" cluster (`#paradigm-chat`, `#paradigm-canvas`) above Patterns. The Canvas screen is a workflow builder: no left panel (removed 2026-09-08 for minimalism), Build/Simulate switch, Test/Publish, node cards with a Transition section whose conditions are output ports, orthogonal connectors with a + on the edge, minimap, bottom toolbar, right Global/Node settings accordion. Nodes are 212 wide so Begin + two columns fit beside the 300px settings panel at the 1200×760 stage; the node layer is a fixed 888×760 stage centred both horizontally (in the space left of the panel) and vertically (below the top bar) at any viewport size. `Accordion` gained a `defaultOpen` index prop (default −1) for it; `DotGrid` is now exported. Then the five pattern groups, then UI components. The old "UX patterns for AI products" intro card is gone. Hero title row: "UI / by Halaska" on the left, "More →" + "Copy prompt" on the right; below it the Intention / Execution columns. The hero shows "UI / by Halaska" (every Halaska mention is a `StudioLink` → https://halaska.com, new tab; page <title> is "UI by Halaska"). Neither hero column carries actions now (they moved to the title row). Section navigation is a **bookmark rail** (`BookmarkRail`): a fixed left-edge column of thin horizontal ticks (1px, 1.5px when active; 7px base, 15px grown/hovered) — 2 paradigms + 5 pattern groups + 8 component categories — under tiny Paradigms/Patterns/Components cluster labels. Each tick's width grows up to 8px with scroll proximity to its section (camera-lens/timeline feel; distance is 0 inside a section, gaussian falloff outside), nudging its label right, every tick shows its label at all times (tap a label to jump to that section); the active tick is accent-colored with a bolder label, hover grows any tick. Hidden below 1200px viewport width. One fixed dock (`PageDock`, bottom-right, z 9998) holds the BETA chip (`BetaChip`) and a `RepoPill` (GitHub link). The public version is **1.0.0** (finalised 2026-09-10; the earlier 1.3 numbering was internal, the file is now `halaska-kit-v1.0.jsx` and the GitHub release is v1.0.0). The version chip (2026-09-10) and then the Feedback pill + `FeedbackDialog` modal (2026-09-10, no delivery route yet) were removed at Chris's request; feedback goes through GitHub issues for now. The floating studio note (`StudioCta`, bottom-left, wand pill that opens a short note, re-opens on `halaska:prompt-copied`; its "Book a call ↗" link opens the studio booking page) stayed after Chris preferred it to an inline card (2026-09-10). `StudioHookCard` (full-width Card, "Need a hand with yours?", a primary "Book a call ↗" Button to `STUDIO_BOOK_URL` = https://halaska.com/book) renders only once (the Retell AI / Pascal credit line and the closing tertiary line were removed 2026-09-10), at the very end of the page; the floating note's link goes to the same booking page. The prototype-URL + email form, `api/submit.js` and the Vite dev shim were removed 2026-09-10 (no delivery route; Chris chose the booking form instead). The post-copy email capture (`UpdatesPanel`) was built and then removed the same day: Chris wants to launch without any email capture. The hero's "More ↓" is a `DropdownMenu` (How to use, Before and after, FAQ, GitHub). The floating action bar keeps only: Copy install prompt (one-click copy with a 2s Copied state), theme toggle, accent picker.

## UX Patterns (40, in 6 groups)

Registered in `PATTERN_GROUPS` (group id/title/blurb + patterns with id, title, desc, component name, optional `replay`/`height`/`align`). `UX_PATTERNS` is the derived flat list — numbering (01…37) is assigned from position, so inserting a pattern renumbers automatically. Rendered by `DemoPatterns` with `PatternGroupHeader` (group title + one stroked `PatternDot` per pattern instead of a count; the "Part N" labels were removed 2026-09-10) + `PatternHeader` (a `PatternDot`, then the title and the description on two separate lines) + `ShowcaseCard`. **Stage rule (2026-09-09):** every pattern stage is top-aligned (`align="top"`, 56px top padding) with a FIXED height from the registry, so expanding/collapsing content grows downward and nothing re-centres or shifts; the ↻ Replay control sits top-right of the stage. When adding a pattern, set `height` generously and check the stage never overflows (a DOM check comparing inner scrollHeight + padding against the box height is the quick test). Group anchors are `#grp-*`, pattern anchors `#pat-*`; the nav dropdown shows clickable group headers.

**Agentic navigation** (`grp-agentic-nav`, added 2026-09-25 from Chris's brief) — moving between what the agent can do and between agents:
context-bar (ContextBarPattern — a floating pill bar, like the site's own action bar, that changes with the on-screen context Thread / Doc / Calendar. Revised 2026-09-29 per Chris: the bar's width eases to fit its content (measured, `motion.smooth`), every item is a filled rounded button, and two kinds are distinguished: agent suggestions (accent-tinted fill with a ✦ spark, e.g. "Summarize this") and one user action (solid fill after a divider, e.g. "Send", "Save draft", "Send invites"). Agent items show "Alpha is on it: …"; the user action just confirms ("✓ Sent to Priya"). Further revised 2026-09-29: icon actions join the bar (round 30px buttons: edit, check, clock, share via `CtxBarIcon`, per context), the Thread/Doc/Calendar tabs were replaced by a heading that changes with the context (`CTXBAR_TITLES`), and it ALWAYS autoplays, pausing only while a status line shows), space-deck (SpaceDeckPattern — revised 2026-09-29 to Chris's sketch: ONE fixed focus frame in the middle of the panel and a 3×4 grid of agent cards sliding behind it on both axes, like the account switcher in Gmail on mobile. Rows are spaces (Personal amber, Studio accent, Side project green), columns are agents; drag with axis lock, swipe, or arrow keys; edges rubber-band, no wrap; `SPACEDECK_EASE` cubic-bezier(0.22, 1, 0.36, 1) at 460ms for smooth-but-snappy; the frame's ring takes the current space's colour; the dot rows were replaced 2026-09-29 by ONE combined indicator below the panel, `SpaceDeckCross`: since a later pass the same day a small always-visible 3×3 grid of dots with one accent dot that glides to the current cell (no arrows; Chris found them redundant). The grid is 3 spaces × 3 agents to match. Each card carries a space chip top-right, an "Agent" eyebrow above its name, a scheduled count and a recurring count (clock and repeat icons), and its Online/Idle status at the bottom. The focused card scales from 0.9 to 1 when it lands and eases back to 0.9 the moment a swipe starts. The top-left space/agent pill is gone; the 3×3 indicator sits inside the panel on a faded plate just under the focus frame, which is lifted 26px above centre (`SPACEDECK_LIFT`). Caption: "Swipe left and right for agents, up and down for spaces." The context bar cycles every 2.4s, uses the site bar's shadow, sits 28px above the panel's bottom edge, and has no caption. Since 2026-09-30 the group is FIRST in `PATTERN_GROUPS` (Chris moved it to the start of the patterns section); the bar's resize duration scales with the distance (`CTXBAR_RESIZE_*`: 240ms + 1.6ms per px, capped at 760ms) on a softer curve; the animated orb was removed and a microphone button (Dictate, shows "Listening") always sits first in the bar.) Prefixes CTXBAR_ / SPACEDECK_.

**Conversation core** (`grp-conversation`) — table stakes, craft over coverage:
prompt-input (PromptInputPattern), message (MessageThreadPattern), streaming (StreamingAnswerPattern), chat (AgentChatPattern), code (CodeBlockPattern), model-context (ModelContextPattern)

**Trust & transparency** (`grp-trust`) — why the user should believe the output:
thinking (ThinkingTracePattern), citations (CitationsPattern), context (ContextSourcesPattern), confidence (ConfidencePattern — low confidence is a designed state), recommendation (RecommendationPattern), feedback (FeedbackPattern)

**Agentic control** (`grp-control`) — consent → visibility → accountability; intervention points that don't look like errors:
plan (PlanPreviewPattern — Proceed/Edit/I'll do it myself), approval (ApprovalCardPattern), autonomy (AutonomyPattern — observe→suggest→confirm→autonomous), permissions (PermissionScopePattern), queue (QueuePattern), status (AgentStatusPattern — stop/redirect, controls docked right), tools (ToolStreamPattern), tasks (AgentTasksPattern), handoff (HandoffPattern — escalation, not failure), receipt (ActionReceiptPattern — evidence + timed undo), checkpoints (CheckpointPattern), audit (AuditLogPattern), error-repair (ErrorRepairPattern — acknowledge/fix/recourse, no alarms)

**Output & generative UI** (`grp-output`) — responses that stop being text:
artifact (ArtifactPattern — versioned container), diff-view (DiffViewPattern — per-hunk accept/reject), diff (DiffTablePattern), structured (StructuredDataPattern — card ⇄ JSON), insights (InsightCardsPattern), comparison (ComparisonPattern — two models, pick a winner)

**Ambient & beyond chat** (`grp-ambient`) — the agent outside the thread:
taskboard (TaskboardPattern), inline-assist (InlineAssistPattern), nudge (NudgePattern — with an escape hatch), digest (DigestPattern), notifications (NotificationCenterPattern), search (CommandSearchPattern), agent-setup (AgentSetupPattern)

Patterns with autoplay accept a `key` remount for replay (the ↻ Replay control in `DemoPatterns`). `PATTERN_ROADMAP` lists "coming soon" entries (workflow canvas, voice input, live preview, terminal output, agent memory, conversation history). All new-pattern data constants are prefix-namespaced (PLANPREV_, AUDITLOG_, STRUCT_, …) to avoid collisions in the single file.

## UI Components — section rules & organisation

**Sorting rule**: UI Components are atomic, individually importable things (a button, a rating, a loader, a calendar). Anything composed of multiple components into a surface or flow belongs in UX Patterns instead. When adding a demo card, put it in the category below; when building a composed surface, register it as a pattern.

Component demo categories (`COMPONENT_CATEGORIES`, one scroll anchor each):
- `cat-foundations` **Foundations** — DemoTypography (typeface picker: `KIT_FONT_PRESETS` Select + "+" custom Google Font input, calls `setKitFont`), DemoMotion (spring / smooth / instant via `setKitMotion`, applies to the whole page), DemoButtons (rows grouped by priority: Primary, Secondary, Ghost, Destructive, Sizes, Icon)
- `cat-inputs` **Inputs & Selectors** — DemoFormInputs, DemoTogglesSelections, DemoFormExtras, DemoInputsExtended. Similar inputs are merged into single cards with a switch (2026-09-10): one Slider card with a "Spring" toggle, one Chips card (toggle + dismissible), text-input variants behind a SegmentedControl, the Calendar shown inside the Date Picker card (no separate Calendar card).
- `cat-navigation` **Navigation & Menus** — DemoNavigation (breadcrumbs with `home` icon + truncated row in one card, tabs, subtle tabs, stepper with "Advance →", one Accordion & Collapsible card, context menu (also opens on left click), menubar, command menu)
- `cat-overlays` **Overlays** — DemoOverlays (Drawer demo lives inside a `PhoneFrame`; one "Popover, Dropdown & Hover card" card with three triggers; one "Dialogs" card whose buttons open the dialog / alert / form / card / sheet variants; tooltip)
- `cat-feedback` **Feedback & Status** — DemoFeedbackStatus (badges, tags, progress, toast, skeleton), DemoAlerts (alert banners, empty state, progress circle, spinner, one "Status" card with status badges + `StatusDot`s)
- `cat-data` **Data Display** — DemoDataDisplay (stat, avatars, list), DemoTable (one Table card with a Simple / Data table switch, Pagination numbers + `variant="dots"`, scroll area, sparkline — pure SVG)
- `cat-ai` **AI Elements** — DemoAIElements (streaming text, thinking indicator, thinking steps, orbs (demo shows only Lattice = `pulse` and Ring = `orbit`), confidence bar, AI suggestion badge, before/after toggle (both states share one grid cell, crossfade, no height change), zoom control) — atoms only; composed AI flows are patterns
- `cat-dev` **Dev Surfaces** — DemoDevSurfaces (snippet, file tree, browser frame) — framing components for coding-agent products. `PhoneFrame({ width 300, height 560 })` is the mobile sibling of `BrowserFrame` (added 2026-09-10; its screen is a containing block so fixed overlays stay inside).

**Deep links and housed stages (2026-09-30).** Every stage has an anchor: patterns use their `pat-*` id, labelled demo cards get `c-<label-slug>` (`showcaseSlug`, e.g. `#c-buttons`, `#c-text-input`), groups keep `grp-*`. `ShowcaseCard` shows a `ShareLinkButton` top-right on hover (always on touch widths) that copies `origin + path + #id`, flips to a tick, and updates the address bar. `HalaskaKit` scrolls to `location.hash` after render (at 300ms and again at 1400ms) and on `hashchange`. `ShowcaseCard` also takes `housed`: instead of floating on the stage, the content sits in a large `pal.bgElevated` card that hangs from the stage's top edge (no top border or radius, hairline sides and bottom, `radius.lg` bottom corners, soft shadow, 40px gap at the bottom). Set per pattern with `housed: true` in `PATTERN_GROUPS`; currently message, streaming, thinking, citations, context, queue, status, tools, tasks, checkpoints, audit, structured, comparison, taskboard, digest (the ones whose content had no surface of its own; their registry heights went up 16px to keep the same room). Patterns that are already a card are NOT housed. Chris's note: no coloured left-edge strokes on cards (removed from ErrorRepair, Taskboard, Handoff, calendar events: "looks tacky, feels AI-generated"); approval options use `pal.bgElevated` with a hairline ring, not a grey fill.

**Stage rule applies to demo cards too** (2026-09-10): any card whose content changes height with state has a fixed `height` + `align="top"` sized for the tallest state. `ShowcaseCard` no longer uses `backdrop-filter` (it created a containing block that trapped `position: fixed` menus and dialogs opened from inside demos; the context menu "not working" was this).

## Responsive layout (2026-09-10)

`useViewport()` (one shared resize listener; `KIT_BP = { mobile: 720, rail: 1200 }`) drives three tiers. **Desktop (≥1200):** rail + both docks. **Compact (<1200):** the rail hides and the action bar gains a ≡ "Sections" button that opens `SectionMenu` above the bar (every rail row, active section highlighted, closes on pick / outside tap / Esc). **Mobile (<720):** page padding 16, tighter hero/section gaps, `h1` drops to xxl, steps stack; the BETA chip and Feedback pill move into the section menu's footer and the studio note only appears (above the bar) after the prompt is copied; the bar shortens its labels ("Copy prompt"). `ShowcaseCard` on mobile: padding 44/16/28, and if the content doesn't reflow to the column it is measured and scaled down (transform, floor 0.5, two measurement passes) with the box height following the scaled content or the scaled fixed stage height, so the stage rule survives. Most stages reflow on their own (9 of 88 scale at 375px). `ParadigmFullscreen` on mobile shows the whole 1200×760 screen scaled to the window width instead of a 1000px scrolling stage; `ParadigmPreview` shows its Expand button permanently on touch widths. Global CSS hides horizontal overflow below 720px.

## Design Heuristics (data only)

The on-page heuristics section and its rail entry were removed 2026-09-09 (the audience is founders, not designers). `DESIGN_HEURISTICS` and `HeuristicsSection` remain in the file and the data is still exported and referenced by the install prompt/llms.txt. It rendered `DESIGN_HEURISTICS` — Nielsen's ten usability heuristics restated for AI/agent products, one or two sentences each (visible agent status, plain-language plans, undo over confirm, one status language, consent before consequence, recognition over recall from transcripts, autonomy as a dial, collapse the machinery, graceful error recovery, capability discovery over docs). The rail's "Approach" cluster links here as "Heuristics".

## Deployment

**Security posture (2026-09-10 pass):** no secrets in the working tree, the deployed files, or git history (the baseline commit's `.claude/settings.local.json` and zip were purged from history with filter-branch and force-pushed). GitHub secret scanning and push protection are enabled on the repo. `.claude/`, `.vercel/`, `.env*`, zips and generated `public/` files are ignored. No email addresses, endpoints, or credentials remain in the repo; the site is static.

There is no server code: the site is static. `src/main.jsx` renders a single piece when `?shot=after` or `?shot=before-after` is in the URL, for the README screenshots (headless Chrome, see the pre-launch PR).

Source is public at **https://github.com/Halaska-Studio/ui** (org `Halaska-Studio`, branch `main`, MIT; created 2026-09-10). The repo root holds README/LICENSE and this `halaska-kit/` folder; `.claude/`, zips, and the generated `public/` files are git-ignored. The bottom-right dock (and the phone section menu) carries the GitHub pill (`REPO_URL`) and the FAQ points there. Push after each deploy so the repo tracks the live site.

`index.html` carries the page title ("UI by Halaska: a UI kit for AI products"), meta description, canonical, theme-color, Open Graph + Twitter card tags pointing at `/og.png` (Chris's own AI-UI artwork supplied 2026-09-24, cropped to 2000×1047 for the 1.91:1 card ratio; the earlier generated card and the `?shot=og` mode in `src/main.jsx` are no longer used for it), light/dark favicons taken from halaska.com's Framer site (`public/favicon-32.png`, `favicon-dark.png`, `apple-touch-icon.png`), and the Google Analytics tag `G-CS1TRYYYC2` (added 2026-09-10 at Chris's request). The showcase is served at **https://ui.halaska.com** from a static Vite build (`npm run build` in `halaska-kit/`). The raw kit file is served versionless at `/halaska-kit.jsx` (copied from the source file into `public/` by the `prebuild` script — the public copy MUST NOT share the source file's exact name, or it shadows the Vite dev module URL and the local app renders blank). `INSTALL_PROMPT` curls that URL.

## Library mode & distribution (founder install flow)

The kit is a library, not just a showcase. `halaska-kit-v1.0.jsx` starts with `"use client"`, self-injects fonts/keyframes on import (SSR-guarded), ends with a full **named-export block** (~150 exports: foundations, every component, all 38 patterns, registries) and carries an MIT header. Keyboard focus is visible via a global `:focus-visible` rule on buttons/links/tabindex elements only (text fields are excluded: they carry their own focus border, and the blue ring on inputs was removed 2026-09-09 at Chris's request). **No chart library** (removed 2026-09-07 to simplify install to react + react-dom only): recharts and the seven chart components are gone; `Sparkline` is a dependency-free SVG (also used by InsightCardsPattern). Verified end-to-end: a fresh Vite app that follows the install prompt builds (kit alone: ~354 KB minified) and renders patterns with Geist + animation outside the showcase.

Generated on `prebuild` (`scripts/generate-api.mjs`, `scripts/extract-source.mjs`): `public/llms.txt` (API reference with real prop signatures, for coding agents), `public/halaska-kit.d.ts` (permissive TS shim), `public/source-map.json` (per-declaration source blocks for future per-component code pages — UI not built yet), plus the versionless `public/halaska-kit.jsx` copy.

**Install prompt** (`INSTALL_PROMPT`) was cut to five short lines on 2026-09-25 (Chris: too long to copy-paste, especially from an email): download the file, read `https://ui.halaska.com/install.md` and follow it, restyle one screen at a time. The detail (setup, usage, theming, the retrofit steps, the AI-moment → pattern map, the export inventory, the heuristics) lives in `public/install.md`, a hand-written static file that agents fetch; it links llms.txt for props. Keep install.md in step with the export list when components are added.

**Install-prompt copy (email gate, reintroduced 2026-09-25):** both "Copy prompt" buttons (hero title row, action bar) open `InstallPromptModal`. First visit: an email field plus "Get the prompt"; the address is posted straight to the studio's Kit (ConvertKit) form (`KIT_FORM_URL` = form 9960761, plain `email_address` FormData, CORS allowed, no Kit script loaded), then the prompt is copied to the clipboard and the modal switches to the prompt view (scrollable text, "Copy again", Done). The browser stores only a `halaska:subscribed` flag in localStorage; returning visitors get the copy + prompt view immediately. Invalid addresses show Kit's own message inline. The action bar reaches the modal through a `halaska:open-prompt` window event; `useCopyPrompt` still fires `halaska:prompt-copied` so the studio note re-opens. The old below-hero reveal panel is gone. The FAQ explains why the email is asked for. Chris's earlier "no capture for launch" stance was reversed by him on 2026-09-25.

**Prop-driven lifecycle patterns** (2026-08-21): ThinkingTracePattern, StreamingAnswerPattern, PlanPreviewPattern, ApprovalCardPattern, AgentStatusPattern, HandoffPattern, ActionReceiptPattern, ErrorRepairPattern accept props with demo defaults (zero props = identical showcase). Shared vocabulary: content props default to the demo constants, `…Label` strings, `on<Verb>(payload)` callbacks, `autoplay` (false = resting state, no timers), `…Ms`/`…Seconds` durations. Each has a `/** @prop */` docblock above the function; `generate-api.mjs` emits those lines into llms.txt. Effects key on content (lengths, JSON keys), never array identity, so re-rendering parents don't restart animations. Refactor tooling: `scripts/splice-unit.mjs <MainPattern> <new.jsx>` replaces a pattern's contiguous source unit (via source-map.json; run `extract-source.mjs` first). Verified with a prop-driven consumer app.

Known gaps: remaining 30 patterns are demo-driven (copy-and-adapt); no before/after proof on the site; no analytics on copies; not on npm; per-component code pages unbuilt.

## Design System

### Typography
- Font: Geist (sans) + Geist Mono (mono) from Vercel
- Loaded via Google Fonts CDN
- Body text uses letter-spacing 0.01em and line-height 1.6
- Headings use letter-spacing -0.02em (h1/h2) or 0em (h3+)

### Icons
- Lucide icons at 1px stroke weight (not default 1.5px)

### Spacing Scale (base-8)
```
xs: 4, sm: 8, md: 16, lg: 32, xl: 40, xxl: 80, xxxl: 160, xxxxl: 240
```

### Radius Scale (iOS-rounded)
```
xs: 4, sm: 8, md: 16, lg: 24, xl: 32, pill: 999
```

### Color System
- Single neutral grey theme with light + dark mode
- Default accent is violet (#8b5cf6 light / #a78bfa dark, since 2026-09-25 at Chris's request; was blue). Swappable via AccentContext (Violet, Blue, Emerald, Rose, Amber, Neutral); the showcase starts on Violet
- usePal(theme) hook returns palette with accent overrides applied
- Components read from pal.accent, pal.accentText, pal.accentBg, pal.accentHover

### Motion (Material Design 3 aligned)
Since 2026-09-10 `motion.*` and `tokens.font.sans/mono` read CSS variables (`--halaska-t-*`, `--halaska-e-*`, `--halaska-sans`, `--halaska-mono`) with these values as fallbacks, so the whole kit can be re-tuned at runtime: `setKitMotion("spring" | "smooth" | "instant")` (`KIT_MOTION_PRESETS`; spring = the values below, smooth = longer + decelerating, instant = 50–150ms) and `setKitFont(name)` (`KIT_FONT_PRESETS` = Geist, Inter, IBM Plex Sans, Manrope; any Google Font name works, loaded on demand). Both exported.
Durations:
```
fast: 0.15s    — micro-interactions, state changes
normal: 0.25s  — most UI transitions
smooth: 0.35s  — expanding panels, color transitions
spring: 0.4s   — bouncy elements (radio, segmented)
slow: 0.5s     — page-level transitions
```

Easing curves:
```
easeInOut: cubic-bezier(0.4, 0, 0.2, 1)      — Standard, on-screen movement
easeOut: cubic-bezier(0.0, 0, 0.2, 1)         — Deceleration, entering elements
easeIn: cubic-bezier(0.4, 0, 1, 1)            — Acceleration, exiting elements
emphasized: cubic-bezier(0.2, 0, 0, 1)        — Dramatic deceleration, landing feel
springCurve: cubic-bezier(0.34, 1.56, 0.64, 1) — Apple-style overshoot bounce
```

### Glass Effects
- ShowcaseCard: rgba bg + subtle 1px border (no blur: it must not become a containing block)
- Card: rgba bg + blur(16px)
- SegmentedControl: rgba bg + blur(8px); every segment has 6px 14px padding (standardised 2026-09-29, labels used to touch when the control hugged its content)
- Action bar: rgba(12,12,12,0.88) + blur(20px)
- Overlays (Dialog, Drawer, Sheet, Popover): rgba + blur(16-20px)

## Component Pattern

Every component follows this pattern:
```jsx
function ComponentName({ prop1, prop2, theme: tp, style: sp }) {
  const ctx = useThemeContext();
  const theme = tp || ctx;
  const pal = usePal(theme);  // Returns palette with accent overrides
  // ... component logic
  return (
    <element style={{
      ...tokens.type.base,
      color: pal.text,
      transition: `color ${motion.smooth} ${motion.easeInOut}`,
      ...sp,
    }}>
      {children}
    </element>
  );
}
```

## Component List (43 total)

### Core (from shadcn)
Button, IconButton, LinkButton, ButtonGroup, TextInput, TextArea, Select,
Checkbox, Radio, RadioGroup, SwitchToggle, Slider, Card, CardHeader, Badge,
Tag, Label, Caption, Code, Text, Heading, Progress, Skeleton, Spinner,
Divider, Stack, Avatar, AvatarGroup, Toast, Pagination, ListItem, Stat

### Navigation & Structure
Accordion, Tabs, Breadcrumb, Collapsible, Table, ScrollArea, SegmentedControl

### Overlays
Dialog, Drawer, Sheet, Popover, DropdownMenu, Tooltip, HoverCard

### Form Extras
InputOTP, Toggle, ToggleGroup, Kbd

### Feedback
AlertBanner, EmptyState

### AI-Specific
StreamingText, Orb, ConfidenceBar, AISuggestionBadge, BeforeAfterToggle, CompareSlider, ZoomControl

### Geist-inspired (added from a Vercel Geist review)
Choicebox, SearchInput, SplitButton, StatusDot, MiddleTruncate, Snippet, FileTree, BrowserFrame

### Showcase
ShowcaseCard, ShowcasePage, ThemeToggle, ActionBar, BookmarkRail, BarButton

## Key Decisions

- The kit is positioned as a **UI kit for AI products** — the UX Patterns section is the headline, components support it
- Pure React with inline styles (no Tailwind dependency in components)
- All components use interactiveBase for consistent cursor/border/outline/transition
- Accent color flows through AccentContext → usePal hook (no token mutation)
- Demo narrative (rewritten 2026-09-07 away from crypto): **Alpha**, an AI operations agent for Northwind, a small SaaS team — support inbox (Intercom), issues (Linear), billing/refunds (Stripe), runbooks (Notion); customers Acme, Lumen Labs, Fjord Health, Brightline, Cobalt Dental; people Sam Keller, Dana Ruiz, Priya Nair. Money appears as refund/credit caps. No crypto/Web3 vocabulary anywhere — the banned list lives in the narrative brief used for the rewrite
- Nav order is UX Patterns → UI Components → How to Use
- Action bar inverts against the page theme for contrast
- All pattern timers/intervals clean up in useEffect returns (replay works by key remount)

## Building for Claude Artifacts

The single-file version (halaska-kit-v1.0.jsx) contains everything:
- All tokens, hooks, components, UX patterns, demos, action bar, and page wrapper
- Imports: React only (useState, useRef, useEffect, useCallback, createContext, useContext, Fragment) — no chart library
- Geist font loads via Google Fonts CDN
- Copy-paste ready for the Claude artifact runtime


## Copy rules

- No instruction captions for the obvious (Chris, 2026-09-29): don't tell people to tap, hover, drag, or that something "applies to the page". A sweep removed these from the Motion, Typography, Breadcrumbs, Context menu, Table, Citations, Contextual taskbar, Before/after and paradigm intro copy. Keep a line only when it carries information the UI can't (the deck keeps "Swipe left and right for agents, up and down for spaces.", which Chris asked for).

- How to Use is four steps (copy the prompt, paste it into your AI tool, that's it, keep building) and the FAQ covers tools, install, retrofit, look, shadcn, licence. Keep it that plain.
- No em dashes anywhere in user-facing copy (swept 2026-09-09; use a period, colon, comma, or a middle dot in data labels). Professional, clear, product-expert tone.
- "More ↓" in the hero points down because it scrolls to How to Use.
