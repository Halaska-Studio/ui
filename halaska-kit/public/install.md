# UI by Halaska: install and retrofit guide

You are a coding agent setting up UI by Halaska (halaska-kit.jsx) in a project. Follow this guide end to end. API reference with every export and its props: https://ui.halaska.com/llms.txt

## What it is

A single-file React UI kit for AI products by Halaska (https://halaska.com). One file gives you 40 UX patterns and about 100 styled components with inline styles: no Tailwind, no CSS setup, no config. Dependencies: react and react-dom only. Fonts (Geist) and keyframes self-inject on import. The file starts with "use client", so it is safe in the Next.js app router.

## Setup

1. Download the kit into the source directory (src/ or this framework's equivalent):
   curl -o src/halaska-kit.jsx https://ui.halaska.com/halaska-kit.jsx
   TypeScript project? Also: curl -o src/halaska-kit.d.ts https://ui.halaska.com/halaska-kit.d.ts
   If the URL is unreachable, ask the user to provide the file.
2. Verify: render <Button variant="primary">Test</Button> from a named import. It should be Geist type on a dark, rounded button. Then remove the test.

## Usage

- Named imports for everything: import { Button, Card, Orb, PlanPreviewPattern, usePal, tokens } from "./halaska-kit";
- Theming: every component accepts theme="light" | "dark", or wrap a subtree in <ThemeProvider theme="dark">. Colors come from usePal(theme): pal.bg, pal.text, pal.textSecondary, pal.accent, pal.success, pal.danger and so on. Never hardcode grays or brand colors. Change the accent with <AccentContext.Provider value="#8b5cf6">.
- Layout: <Stack gap={16} direction="row"> plus tokens.space, tokens.radius, tokens.type. Motion: the motion object has durations (fast, normal, smooth, spring, slow) and easings (easeInOut, easeOut, emphasized, springCurve).
- If the project uses Tailwind, keep it for page layout. Kit components carry their own styles and need no classes.

## If the project already has UI (most likely), retrofit it

This is a skin and UX pass, not a rewrite. Keep routing, state, and data. Work one screen at a time and finish each before starting the next.

a. Swap raw or ad-hoc elements for kit equivalents: buttons to Button/IconButton, inputs to TextInput/TextArea/Select/SwitchToggle/Checkbox, cards to Card + CardHeader, labels and tags to Badge/Tag/StatusBadge, tables to Table/DataTable, modals to Dialog/Sheet, menus to DropdownMenu/CommandPalette, loading to Skeleton/Spinner/ThinkingIndicator, empty screens to EmptyState, toasts to Toast/AlertBanner.
b. Replace hardcoded colors, radii, spacing, and fonts with usePal(theme), tokens.radius, tokens.space, tokens.font.
c. Wherever the product has an AI or agent moment, use the matching pattern instead of a spinner or toast: agent thinking → ThinkingTracePattern; streamed reply → StreamingAnswerPattern; chat surface → AgentChatPattern; before the agent acts → PlanPreviewPattern or ApprovalCardPattern; while it works → AgentStatusPattern + ToolStreamPattern; after it acts → ActionReceiptPattern; when it fails → ErrorRepairPattern; handing off to a human → HandoffPattern.
d. The lifecycle patterns take props, so use them directly with the product's copy, data, and callbacks: ThinkingTracePattern, StreamingAnswerPattern, PlanPreviewPattern, ApprovalCardPattern, AgentStatusPattern, HandoffPattern, ActionReceiptPattern, ErrorRepairPattern. Props and shapes are in llms.txt; every prop has a demo default, so start with none and override what matters. The remaining patterns are demo-driven: copy the source out of halaska-kit.jsx, swap the data, keep the structure, states, and motion.
e. When every screen is done, give the user a short summary of what changed per screen.

## What's in the kit (all named exports; props are in llms.txt)

- UX patterns, conversation: PromptInputPattern, MessageThreadPattern, StreamingAnswerPattern, AgentChatPattern, CodeBlockPattern, ModelContextPattern
- UX patterns, trust: ThinkingTracePattern, CitationsPattern, ContextSourcesPattern, ConfidencePattern, RecommendationPattern, FeedbackPattern
- UX patterns, agentic control: PlanPreviewPattern, ApprovalCardPattern, AutonomyPattern, PermissionScopePattern, QueuePattern, AgentStatusPattern, ToolStreamPattern, AgentTasksPattern, HandoffPattern, ActionReceiptPattern, CheckpointPattern, AuditLogPattern, ErrorRepairPattern
- UX patterns, output: ArtifactPattern, DiffViewPattern, DiffTablePattern, StructuredDataPattern, InsightCardsPattern, ComparisonPattern
- UX patterns, ambient: TaskboardPattern, InlineAssistPattern, NudgePattern, DigestPattern, NotificationCenterPattern, CommandSearchPattern, AgentSetupPattern
- UX patterns, agentic navigation: ContextBarPattern (a bar whose suggestions follow the on-screen context), SpaceDeckPattern (a card deck of agents; sideways between agents, up and down between spaces)
- AI elements: Orb (variants pulse, orbit, sweep, globe, spark; pill option), StreamingText, ThinkingIndicator, ThinkingSteps, ConfidenceBar, AISuggestionBadge, BeforeAfterToggle, CompareSlider, ZoomControl, AgentGlyph
- Components: Text, Heading, Label, Caption, Code, Button, IconButton, ButtonGroup, LinkButton, SplitButton, TextInput, TextArea, Select, Checkbox, Radio, RadioGroup, SwitchToggle, Slider, SpringSlider, SpringToggle, SegmentedControl, InputOTP, InputGroup, Combobox, Calendar, DatePicker, Chip, Toggle, ToggleGroup, SearchInput, Choicebox, CopyInput, Rating, Card, CardHeader, Divider, Stack, Badge, Tag, StatusBadge, StatusDot, Avatar, AvatarGroup, ListItem, Stat, Table, DataTable, ScrollArea, Pagination, MiddleTruncate, Kbd, Progress, ProgressCircle, Skeleton, Spinner, Toast, AlertBanner, EmptyState, Stepper, Breadcrumb, Tabs, SubtleTabs, Accordion, Collapsible, ContextMenu, Menubar, CommandPalette, CommandMenu, Dialog, AlertDialog, FormDialog, CardDialog, Sheet, Popover, DropdownMenu, Tooltip, HoverCard, Snippet, FileTree, BrowserFrame, PhoneFrame, Sparkline

## Rules

- Prefer a kit pattern over building a flow from scratch, and a kit component over raw HTML.
- Follow the kit's design heuristics: show what the agent is doing (Orb, AgentStatusPattern); consent before consequential actions (PlanPreviewPattern, ApprovalCardPattern); undo over confirmation dialogs (ActionReceiptPattern); recognition over recall (DigestPattern, AuditLogPattern, not transcript archaeology); calm error recovery (ErrorRepairPattern).
