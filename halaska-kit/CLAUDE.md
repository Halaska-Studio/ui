# Halaska Kit

UX patterns and styled components for AI products — agents, copilots, and chat — by Halaska Studio.
Built on shadcn/ui foundations. Optimized for Claude artifact prototyping, portable to any React project.

## Project Structure

The kit is a **single self-contained file**: `halaska-kit-v1.3.jsx`. The `src/` folder is just a thin Vite entry that imports it.

```
halaska-kit/
├── CLAUDE.md              # This file — project context for Claude Code
├── package.json           # Vite + React + recharts
├── src/
│   ├── main.jsx           # Vite entry — imports ../halaska-kit-v1.3.jsx
│   ├── tokens.js          # (reference copy of tokens)
│   ├── hooks.js           # (reference copy of hooks)
│   └── components/index.js # Component name index
└── halaska-kit-v1.3.jsx   # THE KIT — tokens, components, patterns, showcase page
```

## Showcase Page Order & Navigation

The page leads with **UX Patterns**, then UI components. The hero shows "Halaska Kit / by Halaska Studio" (every Halaska Studio mention is a `StudioLink` → https://halaskastudio.com, new tab). The hero's How to Use column has "More →" plus a second "Copy Install Prompt" LinkButton; both copy buttons share the `useCopyInstallPrompt` hook. Section navigation is a **bookmark rail** (`BookmarkRail`): a fixed left-edge column of thin horizontal ticks (1px, 1.5px when active) — 5 pattern groups + 8 component categories — under tiny Patterns/Components/Approach cluster labels (Approach → the Design Heuristics section); How to Use lives only in the action bar. Each tick's width grows up to 16px with scroll proximity to its section (camera-lens/timeline feel; distance is 0 inside a section, gaussian falloff outside), nudging its label right, every tick shows its label at all times (tap a label to jump to that section); the active tick is accent-colored with a bolder label, hover grows any tick. Hidden below 1200px viewport width. The floating action bar keeps only: ◆ logo (scroll to top), Copy Install Prompt (copies `INSTALL_PROMPT` — a Claude Code-ready setup prompt with a 2s "Copied" state; update `INSTALL_PROMPT` when the kit gets a real npm package or hosted URL), theme toggle, accent picker.

## UX Patterns (38, in 5 lifecycle groups)

Registered in `PATTERN_GROUPS` (group id/title/blurb + patterns with id, title, desc, component name, optional `replay`/`height`/`align`). `UX_PATTERNS` is the derived flat list — numbering (01…37) is assigned from position, so inserting a pattern renumbers automatically. Rendered by `DemoPatterns` with `PatternGroupHeader` ("Part N") + `PatternHeader` + `ShowcaseCard`. Group anchors are `#grp-*`, pattern anchors `#pat-*`; the nav dropdown shows clickable group headers.

**Part 1 · Conversation core** (`grp-conversation`) — table stakes, craft over coverage:
prompt-input (PromptInputPattern), message (MessageThreadPattern), streaming (StreamingAnswerPattern), chat (AgentChatPattern), code (CodeBlockPattern), model-context (ModelContextPattern)

**Part 2 · Trust & transparency** (`grp-trust`) — why the user should believe the output:
thinking (ThinkingTracePattern), citations (CitationsPattern), context (ContextSourcesPattern), confidence (ConfidencePattern — low confidence is a designed state), recommendation (RecommendationPattern), feedback (FeedbackPattern)

**Part 3 · Agentic control** (`grp-control`) — consent → visibility → accountability; intervention points that don't look like errors:
plan (PlanPreviewPattern — Proceed/Edit/I'll do it myself), approval (ApprovalCardPattern), autonomy (AutonomyPattern — observe→suggest→confirm→autonomous), permissions (PermissionScopePattern), queue (QueuePattern), status (AgentStatusPattern — pause/redirect), tools (ToolStreamPattern), tasks (AgentTasksPattern), handoff (HandoffPattern — escalation, not failure), receipt (ActionReceiptPattern — evidence + timed undo), checkpoints (CheckpointPattern), audit (AuditLogPattern), error-repair (ErrorRepairPattern — acknowledge/fix/recourse, no alarms)

**Part 4 · Output & generative UI** (`grp-output`) — responses that stop being text:
artifact (ArtifactPattern — versioned container), diff-view (DiffViewPattern — per-hunk accept/reject), diff (DiffTablePattern), structured (StructuredDataPattern — card ⇄ JSON), insights (InsightCardsPattern), comparison (ComparisonPattern — two models, pick a winner)

**Part 5 · Ambient & beyond chat** (`grp-ambient`) — the agent outside the thread:
taskboard (TaskboardPattern), inline-assist (InlineAssistPattern), nudge (NudgePattern — with an escape hatch), digest (DigestPattern), notifications (NotificationCenterPattern), search (CommandSearchPattern), agent-setup (AgentSetupPattern)

Patterns with autoplay accept a `key` remount for replay (the ↻ Replay control in `DemoPatterns`). `PATTERN_ROADMAP` lists "coming soon" entries (workflow canvas, voice input, live preview, terminal output, agent memory, conversation history). All new-pattern data constants are prefix-namespaced (PLANPREV_, AUDITLOG_, STRUCT_, …) to avoid collisions in the single file.

## UI Components — section rules & organisation

**Sorting rule**: UI Components are atomic, individually importable things (a button, a rating, a loader, a calendar). Anything composed of multiple components into a surface or flow belongs in UX Patterns instead. When adding a demo card, put it in the category below; when building a composed surface, register it as a pattern.

Component demo categories (`COMPONENT_CATEGORIES`, one scroll anchor each):
- `cat-foundations` **Foundations** — DemoTypography, DemoButtons
- `cat-inputs` **Inputs & Selectors** — DemoFormInputs, DemoTogglesSelections, DemoFormExtras, DemoInputsExtended (slider, spring slider/toggle, toggle group, chips, input group, copy input, combobox, calendar, date picker, rating)
- `cat-navigation` **Navigation & Menus** — DemoNavigation (breadcrumbs, tabs, subtle tabs, stepper, accordion, collapsible, context menu, menubar, command menu)
- `cat-overlays` **Overlays** — DemoOverlays (dialog, drawer, sheet, popover, dropdown, tooltip, hover card, alert/form/card dialogs)
- `cat-feedback` **Feedback & Status** — DemoFeedbackStatus (badges, tags, progress, toast, skeleton), DemoAlerts (alert banners, empty state, progress circle, spinner, status badge)
- `cat-data` **Data Display** — DemoDataDisplay (stat, avatars, list), DemoTable (table, data table, pagination, scroll area)
- `cat-ai` **AI Elements** — DemoAIElements (streaming text, thinking indicator, thinking steps, confidence bar, AI suggestion badge, before/after toggle, zoom control) — atoms only; composed AI flows are patterns
- `cat-dev` **Dev Surfaces** — DemoDevSurfaces (snippet, file tree, browser frame) — framing components for coding-agent products
- `cat-charts` **Charts** — DemoCharts (sparkline, bar, donut, composed, radial, treemap, brush)

## Design Heuristics section

`HeuristicsSection` (anchor `#heuristics`, after Charts, before How to Use) renders `DESIGN_HEURISTICS` — Nielsen's ten usability heuristics restated for AI/agent products, one or two sentences each (visible agent status, plain-language plans, undo over confirm, one status language, consent before consequence, recognition over recall from transcripts, autonomy as a dial, collapse the machinery, graceful error recovery, capability discovery over docs). The rail's "Approach" cluster links here as "Heuristics".

## Deployment

Deployed on Vercel: project **halaska-kit** (team `halaska`) → https://halaska-kit.vercel.app, custom domain **kit.halaskastudio.com** (attached; DNS is external at nameserver.net.au — needs an `A kit → 76.76.21.21` or `CNAME kit → cname.vercel-dns.com` record there before it resolves). Deploy with `vercel deploy --prod --yes` from `halaska-kit/`. The raw kit file is served versionless at `/halaska-kit.jsx` (copied from the source file into `public/` by the `prebuild` script — the public copy MUST NOT share the source file's exact name, or it shadows the Vite dev module URL and the local app renders blank). `INSTALL_PROMPT` curls that URL.

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
- ShowcaseCard: rgba bg + blur(40px) + subtle 1px border
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
StreamingText, ConfidenceBar, AISuggestionBadge, BeforeAfterToggle, ZoomControl

### Geist-inspired (added from a Vercel Geist review)
Choicebox, SearchInput, SplitButton, StatusDot, MiddleTruncate, Snippet, FileTree, BrowserFrame

### Showcase
ShowcaseCard, ShowcasePage, ThemeToggle, ActionBar, BookmarkRail, BarButton

## Key Decisions

- The kit is positioned as a **UI kit for AI products** — the UX Patterns section is the headline, components support it
- Pure React with inline styles (no Tailwind dependency in components)
- All components use interactiveBase for consistent cursor/border/outline/transition
- Accent color flows through AccentContext → usePal hook (no token mutation)
- Demo content is trading-agent themed (agentic AI trading bots) — consistent across components and patterns
- Nav order is UX Patterns → UI Components → How to Use
- Action bar inverts against the page theme for contrast
- All pattern timers/intervals clean up in useEffect returns (replay works by key remount)

## Building for Claude Artifacts

The single-file version (halaska-kit-v1.3.jsx) contains everything:
- All tokens, hooks, components, UX patterns, demos, action bar, and page wrapper
- Imports: React (useState, useRef, useEffect, useCallback, createContext, useContext) and recharts (charts in DemoExtended + InsightCardsPattern)
- Geist font loads via Google Fonts CDN
- Copy-paste ready for the Claude artifact runtime (recharts is available there)
