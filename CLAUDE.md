# Halaska Kit

UX patterns and styled components for AI products — agents, copilots, and chat — by Halaska Studio.
Built on shadcn/ui foundations. Optimized for Claude artifact prototyping, portable to any React project.

## Project Structure

The kit is a **single self-contained file**: `halaska-kit-v1.3.jsx`. The `src/` folder is just a thin Vite entry that imports it.

```
halaska-kit/
├── CLAUDE.md              # This file — project context for Claude Code
├── package.json           # Vite + React (react + react-dom are the only deps)
├── src/
│   ├── main.jsx           # Vite entry — imports ../halaska-kit-v1.3.jsx
│   ├── tokens.js          # (reference copy of tokens)
│   ├── hooks.js           # (reference copy of hooks)
│   └── components/index.js # Component name index
└── halaska-kit-v1.3.jsx   # THE KIT — tokens, components, patterns, showcase page
```

## Showcase Page Order & Navigation

The page opens with the hero (title row, then Intention / Execution; the "Made for founders building with coding agents." sentence now opens the Intention paragraph, the separate line was folded in 2026-09-10), then **Before and after** (`BeforeAfterSection`: a `CompareSlider` (drag divider, arrow keys, touch; Before left, After right, starts at 50%) over two `LiveStage`s, `ChatParadigmBefore` (a realistic generic Tailwind-style first pass in plain elements) and the real `ChatParadigmExample`; the toggle was replaced 2026-09-10 because Chris felt it would be missed), then **Two UX paradigms** — Chat and Canvas — each a complete example product screen (`ChatParadigmExample`, `CanvasParadigmExample`; registry `UX_PARADIGMS` with `example` names) built only from kit components/patterns in the Alpha narrative. `ParadigmPreview` renders the screen at a 1200×760 stage scaled to the column (non-interactive live thumbnail, "Open full screen" on hover); tapping opens `ParadigmFullscreen`: a windowed layer, not true full screen (24px inset on a blurred scrim, radius xl, hairline border, a ⤡ "Contract" IconButton + Esc, body scroll locked; example fills the window with a 1000px min width). The thumbnail's hover button reads "Expand". Each paradigm section also chips-links its pattern groups (Chat → conversation/trust/control, Canvas → output/ambient/control). Rail has a "Paradigms" cluster (`#paradigm-chat`, `#paradigm-canvas`) above Patterns. The Canvas screen is a workflow builder: no left panel (removed 2026-09-08 for minimalism), Build/Simulate switch, Test/Publish, node cards with a Transition section whose conditions are output ports, orthogonal connectors with a + on the edge, minimap, bottom toolbar, right Global/Node settings accordion. Nodes are 212 wide so Begin + two columns fit beside the 300px settings panel at the 1200×760 stage; the node layer is a fixed 888×760 stage centred both horizontally (in the space left of the panel) and vertically (below the top bar) at any viewport size. `Accordion` gained a `defaultOpen` index prop (default −1) for it; `DotGrid` is now exported. Then the five pattern groups, then UI components. The old "UX patterns for AI products" intro card is gone. Hero title row: "UI / by Halaska" on the left, "More →" + "Copy prompt" on the right; below it the Intention / Execution columns. The hero shows "UI / by Halaska" (every Halaska mention is a `StudioLink` → https://halaska.com, new tab; page <title> is "UI by Halaska"). Neither hero column carries actions now (they moved to the title row). Section navigation is a **bookmark rail** (`BookmarkRail`): a fixed left-edge column of thin horizontal ticks (1px, 1.5px when active; 7px base, 15px grown/hovered) — 2 paradigms + 5 pattern groups + 8 component categories — under tiny Paradigms/Patterns/Components cluster labels. Each tick's width grows up to 8px with scroll proximity to its section (camera-lens/timeline feel; distance is 0 inside a section, gaussian falloff outside), nudging its label right, every tick shows its label at all times (tap a label to jump to that section); the active tick is accent-colored with a bolder label, hover grows any tick. Hidden below 1200px viewport width. One fixed dock (`PageDock`, bottom-right, z 9998) holds the BETA chip (`BetaChip`) and a `RepoPill` (GitHub link). The version chip (2026-09-10) and then the Feedback pill + `FeedbackDialog` modal (2026-09-10, no delivery route yet) were removed at Chris's request; feedback goes through GitHub issues for now. The floating studio note (`StudioCta`, bottom-left, wand pill that opens a short note, re-opens on `halaska:prompt-copied`; its link scrolls to `#studio`) stayed after Chris preferred it to an inline card (2026-09-10). `StudioHookCard` (full-width Card, "Need a hand with yours?", Prototype URL + Email + "Send it over", posts to `/api/submit`, remembers a sent request in `sessionStorage` `halaska:review-sent`) renders only once, at the very end of the page with the Retell AI / Pascal credit line. The post-copy email capture (`UpdatesPanel`) was built and then removed the same day: Chris wants to launch without any email capture. The hero's "More ↓" is a `DropdownMenu` (How to use, Before and after, FAQ, GitHub). The floating action bar keeps only: Copy install prompt (one-click copy with a 2s Copied state), theme toggle, accent picker.

## UX Patterns (38, in 5 lifecycle groups)

Registered in `PATTERN_GROUPS` (group id/title/blurb + patterns with id, title, desc, component name, optional `replay`/`height`/`align`). `UX_PATTERNS` is the derived flat list — numbering (01…37) is assigned from position, so inserting a pattern renumbers automatically. Rendered by `DemoPatterns` with `PatternGroupHeader` (group title + one stroked `PatternDot` per pattern instead of a count; the "Part N" labels were removed 2026-09-10) + `PatternHeader` (a `PatternDot`, then the title and the description on two separate lines) + `ShowcaseCard`. **Stage rule (2026-09-09):** every pattern stage is top-aligned (`align="top"`, 56px top padding) with a FIXED height from the registry, so expanding/collapsing content grows downward and nothing re-centres or shifts; the ↻ Replay control sits top-right of the stage. When adding a pattern, set `height` generously and check the stage never overflows (a DOM check comparing inner scrollHeight + padding against the box height is the quick test). Group anchors are `#grp-*`, pattern anchors `#pat-*`; the nav dropdown shows clickable group headers.

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

**Stage rule applies to demo cards too** (2026-09-10): any card whose content changes height with state has a fixed `height` + `align="top"` sized for the tallest state. `ShowcaseCard` no longer uses `backdrop-filter` (it created a containing block that trapped `position: fixed` menus and dialogs opened from inside demos; the context menu "not working" was this).

## Responsive layout (2026-09-10)

`useViewport()` (one shared resize listener; `KIT_BP = { mobile: 720, rail: 1200 }`) drives three tiers. **Desktop (≥1200):** rail + both docks. **Compact (<1200):** the rail hides and the action bar gains a ≡ "Sections" button that opens `SectionMenu` above the bar (every rail row, active section highlighted, closes on pick / outside tap / Esc). **Mobile (<720):** page padding 16, tighter hero/section gaps, `h1` drops to xxl, steps stack; the BETA chip and Feedback pill move into the section menu's footer and the studio note only appears (above the bar) after the prompt is copied; the bar shortens its labels ("Copy prompt"). `ShowcaseCard` on mobile: padding 44/16/28, and if the content doesn't reflow to the column it is measured and scaled down (transform, floor 0.5, two measurement passes) with the box height following the scaled content or the scaled fixed stage height, so the stage rule survives. Most stages reflow on their own (9 of 88 scale at 375px). `ParadigmFullscreen` on mobile shows the whole 1200×760 screen scaled to the window width instead of a 1000px scrolling stage; `ParadigmPreview` shows its Expand button permanently on touch widths. Global CSS hides horizontal overflow below 720px.

## Design Heuristics (data only)

The on-page heuristics section and its rail entry were removed 2026-09-09 (the audience is founders, not designers). `DESIGN_HEURISTICS` and `HeuristicsSection` remain in the file and the data is still exported and referenced by the install prompt/llms.txt. It rendered `DESIGN_HEURISTICS` — Nielsen's ten usability heuristics restated for AI/agent products, one or two sentences each (visible agent status, plain-language plans, undo over confirm, one status language, consent before consequence, recognition over recall from transcripts, autonomy as a dial, collapse the machinery, graceful error recovery, capability discovery over docs). The rail's "Approach" cluster links here as "Heuristics".

## Deployment

**Security posture (2026-09-10 pass):** no secrets in the working tree, the deployed files, or git history (the baseline commit's `.claude/settings.local.json` and zip were purged from history with filter-branch and force-pushed). GitHub secret scanning and push protection are enabled on the repo. `.claude/`, `.vercel/`, `.env*`, zips and generated `public/` files are ignored. The only email in the repo is the intended form recipient (chris@halaska.com) in `api/submit.js` and the README; it can move to the `SUBMIT_TO` env var if it should not be public. Delivery credentials live only in Vercel env vars (none set yet).

`api/submit.js` is a Vercel serverless function for the studio review form (`kind: "review"`; a `kind: "feedback"` branch remains for when the Feedback modal returns); it emails via Resend (`RESEND_API_KEY`) or forwards to `SUBMIT_WEBHOOK_URL`, and returns 503 when neither is set. No delivery is configured yet (Chris removed the Zapier hook entirely on 2026-09-10; he doesn't use that Zap). Until `RESEND_API_KEY` (or another webhook) is set on Vercel, the studio form shows the inline "Couldn't send" error in production. `vite.config.js` shims `/api/submit` in dev (logs to the terminal). `src/main.jsx` renders a single piece when `?shot=after` or `?shot=before-after` is in the URL, for the README screenshots (headless Chrome, see the pre-launch PR).

Source is public at **https://github.com/Halaska-Studio/ui** (org `Halaska-Studio`, branch `main`, MIT; created 2026-09-10). The repo root holds README/LICENSE and this `halaska-kit/` folder; `.claude/`, zips, and the generated `public/` files are git-ignored. The bottom-right dock (and the phone section menu) carries the GitHub pill (`REPO_URL`) and the FAQ points there. Push after each deploy so the repo tracks the live site.

`index.html` carries the page title ("UI by Halaska: a UI kit for AI products"), meta description, canonical, theme-color, Open Graph + Twitter card tags pointing at `/og.png` (2400×1260, generated from `?shot=og` in `src/main.jsx` with headless Chrome: wordmark + one line on the left, the live Chat screen on the right), light/dark favicons taken from halaska.com's Framer site (`public/favicon-32.png`, `favicon-dark.png`, `apple-touch-icon.png`), and the Google Analytics tag `G-CS1TRYYYC2` (added 2026-09-10 at Chris's request). The showcase is served at **https://ui.halaska.com** from a static Vite build (`npm run build` in `halaska-kit/`). The raw kit file is served versionless at `/halaska-kit.jsx` (copied from the source file into `public/` by the `prebuild` script — the public copy MUST NOT share the source file's exact name, or it shadows the Vite dev module URL and the local app renders blank). `INSTALL_PROMPT` curls that URL.

## Library mode & distribution (founder install flow)

The kit is a library, not just a showcase. `halaska-kit-v1.3.jsx` starts with `"use client"`, self-injects fonts/keyframes on import (SSR-guarded), ends with a full **named-export block** (~150 exports: foundations, every component, all 38 patterns, registries) and carries an MIT header. Keyboard focus is visible via a global `:focus-visible` rule on buttons/links/tabindex elements only (text fields are excluded: they carry their own focus border, and the blue ring on inputs was removed 2026-09-09 at Chris's request). **No chart library** (removed 2026-09-07 to simplify install to react + react-dom only): recharts and the seven chart components are gone; `Sparkline` is a dependency-free SVG (also used by InsightCardsPattern). Verified end-to-end: a fresh Vite app that follows the install prompt builds (kit alone: ~354 KB minified) and renders patterns with Geist + animation outside the showcase.

Generated on `prebuild` (`scripts/generate-api.mjs`, `scripts/extract-source.mjs`): `public/llms.txt` (API reference with real prop signatures, for coding agents), `public/halaska-kit.d.ts` (permissive TS shim), `public/source-map.json` (per-declaration source blocks for future per-component code pages — UI not built yet), plus the versionless `public/halaska-kit.jsx` copy.

**Install prompt** (`INSTALL_PROMPT`) is retrofit-aware: setup → usage → "if this project already has UI, retrofit it screen by screen" (component swap map, token replacement, AI-moment → pattern map, copy-and-adapt demo data) → export inventory → heuristics. Points agents at /llms.txt.

**Install-prompt copy** (no email gate — Chris dropped the lead-magnet idea 2026-09-07; it's a publicity piece): the hero's primary "Copy install prompt" button copies `INSTALL_PROMPT` immediately (`useCopyPrompt`, 2s Copied state) and reveals the prompt text in a full-width panel under the hero columns with **Copy again** and **Hide**. The action bar's "Copy install prompt" copies directly. No localStorage, no webhook.

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
- Accent color is swappable via AccentContext (Blue, Violet, Emerald, Rose, Amber, Neutral)
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
- SegmentedControl: rgba bg + blur(8px)
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

The single-file version (halaska-kit-v1.3.jsx) contains everything:
- All tokens, hooks, components, UX patterns, demos, action bar, and page wrapper
- Imports: React only (useState, useRef, useEffect, useCallback, createContext, useContext, Fragment) — no chart library
- Geist font loads via Google Fonts CDN
- Copy-paste ready for the Claude artifact runtime


## Copy rules

- How to Use is four steps (copy the prompt, paste it into your AI tool, that's it, keep building) and the FAQ covers tools, install, retrofit, look, shadcn, licence. Keep it that plain.
- No em dashes anywhere in user-facing copy (swept 2026-09-09; use a period, colon, comma, or a middle dot in data labels). Professional, clear, product-expert tone.
- "More ↓" in the hero points down because it scrolls to How to Use.
