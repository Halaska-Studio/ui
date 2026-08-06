// ─── HALASKA KIT COMPONENTS ──────────────────────────────────
//
// This is the component index for the modular version.
// For Claude artifacts, use halaska-kit-v1.1.jsx (single file).
//
// To split into individual files, extract each component from
// the single file and import tokens + hooks:
//
//   import { tokens, motion, interactiveBase } from "../tokens";
//   import { usePal, useThemeContext } from "../hooks";
//
// All components follow the same pattern — see CLAUDE.md.

// For now, re-export everything from the single file.
// When splitting, replace this with individual imports:
//
// export { Button } from "./Button";
// export { TextInput } from "./TextInput";
// export { Card } from "./Card";
// ... etc

export const COMPONENT_LIST = [
  // Core
  "Button", "IconButton", "LinkButton", "ButtonGroup",
  "TextInput", "TextArea", "Select",
  "Checkbox", "Radio", "RadioGroup", "SwitchToggle", "Slider",
  "Card", "CardHeader", "Badge", "Tag",
  "Label", "Caption", "Code", "Text", "Heading",
  "Progress", "Skeleton", "Spinner", "Divider", "Stack",
  "Avatar", "AvatarGroup", "Toast", "Pagination", "ListItem", "Stat",

  // Navigation & Structure
  "Accordion", "Tabs", "Breadcrumb", "Collapsible",
  "Table", "ScrollArea", "SegmentedControl",

  // Overlays
  "Dialog", "Drawer", "Sheet", "Popover",
  "DropdownMenu", "Tooltip", "HoverCard",

  // Form Extras
  "InputOTP", "Toggle", "ToggleGroup", "Kbd",

  // Feedback
  "AlertBanner", "EmptyState",

  // AI-Specific
  "StreamingText", "ConfidenceBar", "AISuggestionBadge",
  "BeforeAfterToggle", "ZoomControl",

  // Showcase
  "ShowcaseCard", "ShowcasePage", "ThemeToggle",
  "ActionBar", "NavItem", "BarButton",
];
