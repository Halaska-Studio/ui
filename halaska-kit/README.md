# Halaska Kit

UX patterns and styled components for **AI products** — agents, copilots, and chat.
Built on shadcn/ui foundations. Optimized for Claude artifact prototyping. Portable to any React project.

**12 UX patterns** · **43 components** · **Geist typography** · **Lucide 1px icons** · **Material Design 3 motion** · **iOS-rounded radius** · **Glass effects** · **Light/dark mode** · **Accent color picker**

---

## Quick Start (Claude Artifacts)

1. Copy `halaska-kit-v1.2.jsx` into a new Claude artifact
2. It renders a full showcase page — UX Patterns first, then all components
3. Use the floating action bar to browse patterns, components, themes, and accents

## Quick Start (React Project)

```bash
# Clone the repo
git clone https://github.com/halaska-studio/halaska-kit.git
cd halaska-kit

# Install dependencies
npm install

# Start dev server
npm run dev
```

## UX Patterns

The moments every AI product has to get right, rebuilt from the kit's components:

| # | Pattern | What it shows |
|---|---------|---------------|
| 01 | Thinking | Expandable reasoning trace with elapsed time, auto-collapses when done |
| 02 | Streaming answer | Streamed reply with inline source chips, sources row, follow-ups |
| 03 | Approval card | Human-in-the-loop question before the agent acts |
| 04 | Tool calls | Edits, commands, and reads as a compact activity feed |
| 05 | Task rows | Live agent task status — running, failed, completed |
| 06 | Recommendation | Agent suggestion with confidence meter and clear actions |
| 07 | Context sources | Retrieved knowledge chunks with provenance |
| 08 | Diff table | AI-proposed edits sweeping through tabular data |
| 09 | Command search | Command palette with live filtering and an empty state |
| 10 | Insight cards | Paged agent insights with live charts |
| 11 | Agent chat | Chat panel with reasoning chips and a working composer |
| 12 | Agent setup | Full multi-step setup flow with live preview |

## Components

### Core
Button, IconButton, LinkButton, ButtonGroup, TextInput, TextArea, Select, Checkbox, Radio, RadioGroup, SwitchToggle, Slider, Card, Badge, Tag, Label, Progress, Skeleton, Spinner, Divider, Stack, Avatar, AvatarGroup, Toast, Pagination, ListItem, Stat

### Navigation & Structure
Accordion, Tabs, Breadcrumb, Collapsible, Table, ScrollArea, SegmentedControl

### Overlays
Dialog, Drawer, Sheet, Popover, DropdownMenu, Tooltip, HoverCard

### Form Extras
InputOTP, Toggle, ToggleGroup, Kbd

### Feedback
AlertBanner, EmptyState

### AI-Specific
StreamingText, ThinkingIndicator, ThinkingSteps, ConfidenceBar, AISuggestionBadge, BeforeAfterToggle, ZoomControl

## Design Tokens

```js
// Spacing (base-8)
space: { xs: 4, sm: 8, md: 16, lg: 32, xl: 40, xxl: 80, xxxl: 160, xxxxl: 240 }

// Radius (iOS-rounded)
radius: { xs: 4, sm: 8, md: 16, lg: 24, xl: 32, pill: 999 }

// Typography
font: { sans: "Geist", mono: "Geist Mono" }

// Motion (Material Design 3)
motion: {
  fast: "0.15s",    // micro-interactions
  normal: "0.25s",  // most transitions
  smooth: "0.35s",  // panels, color changes
  spring: "0.4s",   // bouncy elements
  slow: "0.5s",     // page transitions
}
```

## Customization

Edit the `tokens` object at the top of the file to change:
- Colors (light/dark palettes)
- Spacing scale
- Border radius
- Typography
- Motion timing

The accent color can be changed live via the action bar color picker.

## Built By

[Halaska Studio](https://halaska.studio) — Design consultancy specializing in AI product design.

## License

MIT
