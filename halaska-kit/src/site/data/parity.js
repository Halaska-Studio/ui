// shadcn/ui parity: one row for each of shadcn's 65 components (as of
// 30 September 2026), judged against the kit source. Pure data.
//
// status: "match"   the kit has an equivalent with comparable variants
//         "partial" the kit has it, but variants or states are missing (see note)
//         "missing" no equivalent yet
//         "planned" recorded, not scheduled
//         "mapped"  a shadcn conversation component covered by a Halaska pattern

export const PARITY_SUMMARY = "Of shadcn/ui's 65 components, the kit matches 13, partly matches 37, maps 6 conversation pieces to its own patterns, and has 8 still to build. It adds 27 of its own.";

export const PARITY = [
  { shadcn: "Accordion", group: "Layout and utility", status: "partial", slug: "accordion", kit: "Accordion", note: "One item open at a time, no multiple mode" },
  { shadcn: "Alert", group: "Feedback and status", status: "match", slug: "alert", kit: "AlertBanner (alias Alert)", note: "" },
  { shadcn: "Alert Dialog", group: "Overlays", status: "match", slug: "alert-dialog", kit: "AlertDialog", note: "" },
  { shadcn: "Aspect Ratio", group: "Layout and utility", status: "missing", kit: "", note: "No ratio wrapper" },
  { shadcn: "Attachment", group: "Conversation", status: "mapped", slug: "prompt-input", to: "/patterns/prompt-input", kit: "Prompt input", note: "Attached files show as chips in the composer" },
  { shadcn: "Avatar", group: "Data display", status: "partial", slug: "avatar", kit: "Avatar, AvatarGroup", note: "No square or rounded shape option, and no status badge on the avatar" },
  { shadcn: "Badge", group: "Data display", status: "match", slug: "badge", kit: "Badge", note: "" },
  { shadcn: "Breadcrumb", group: "Navigation", status: "partial", slug: "breadcrumb", kit: "Breadcrumb", note: "The separator is always a slash" },
  { shadcn: "Bubble", group: "Conversation", status: "mapped", slug: "message", to: "/patterns/message", kit: "Message thread", note: "User and assistant bubbles are part of the thread" },
  { shadcn: "Button", group: "Forms and inputs", status: "match", slug: "button", kit: "Button, IconButton, LinkButton", note: "" },
  { shadcn: "Button Group", group: "Forms and inputs", status: "partial", slug: "button-group", kit: "ButtonGroup", note: "Horizontal only, no vertical orientation or text segments" },
  { shadcn: "Calendar", group: "Forms and inputs", status: "partial", slug: "calendar", kit: "Calendar", note: "Single date only, no range, multiple months or disabled dates" },
  { shadcn: "Card", group: "Data display", status: "partial", slug: "card", kit: "Card, CardHeader", note: "No CardFooter part, and no separate CardTitle, CardDescription or CardContent parts: CardHeader takes them as props and the body is children" },
  { shadcn: "Carousel", group: "Data display", status: "missing", kit: "", note: "No carousel" },
  { shadcn: "Chart", group: "Data display", status: "partial", slug: "chart", kit: "Sparkline", note: "Sparkline only, no bar, line, area or pie charts, no tooltip or legend" },
  { shadcn: "Checkbox", group: "Forms and inputs", status: "partial", slug: "checkbox", kit: "Checkbox", note: "No indeterminate state" },
  { shadcn: "Collapsible", group: "Layout and utility", status: "match", slug: "collapsible", kit: "Collapsible", note: "" },
  { shadcn: "Combobox", group: "Forms and inputs", status: "partial", slug: "combobox", kit: "Combobox", note: "Single selection only" },
  { shadcn: "Command", group: "Overlays", status: "partial", slug: "command", kit: "CommandPalette (alias Command), CommandMenu", note: "Flat list, no groups or separators" },
  { shadcn: "Context Menu", group: "Overlays", status: "partial", slug: "context-menu", kit: "ContextMenu", note: "No submenus, checkbox items or radio items" },
  { shadcn: "Data Table", group: "Data display", status: "partial", slug: "data-table", kit: "DataTable", note: "Sorting and row selection only, no filtering, pagination or column visibility" },
  { shadcn: "Date Picker", group: "Forms and inputs", status: "partial", slug: "date-picker", kit: "DatePicker", note: "Single date only, no range or presets" },
  { shadcn: "Dialog", group: "Overlays", status: "partial", slug: "dialog", kit: "Dialog, FormDialog, CardDialog", note: "No composable parts (header, footer, close button). Each variant has a fixed layout" },
  { shadcn: "Direction", group: "Layout and utility", status: "planned", kit: "", note: "Not planned unless a client needs right-to-left" },
  { shadcn: "Drawer", group: "Overlays", status: "missing", kit: "", note: "No bottom drawer, Sheet only opens left or right" },
  { shadcn: "Dropdown Menu", group: "Overlays", status: "partial", slug: "dropdown-menu", kit: "DropdownMenu", note: "No submenus, checkbox or radio items, shortcuts or group labels" },
  { shadcn: "Empty", group: "Feedback and status", status: "match", slug: "empty", kit: "EmptyState (alias Empty)", note: "" },
  { shadcn: "Field", group: "Forms and inputs", status: "partial", slug: "field", kit: "TextInput, Label, Caption", note: "No Field wrapper, TextInput carries label, caption and error itself" },
  { shadcn: "Hover Card", group: "Overlays", status: "match", slug: "hover-card", kit: "HoverCard", note: "" },
  { shadcn: "Input", group: "Forms and inputs", status: "match", slug: "input", kit: "TextInput (alias Input)", note: "" },
  { shadcn: "Input Group", group: "Forms and inputs", status: "partial", slug: "input-group", kit: "InputGroup", note: "Prefix and suffix only, no button add-ons, textarea or disabled state" },
  { shadcn: "Input OTP", group: "Forms and inputs", status: "partial", slug: "input-otp", kit: "InputOTP", note: "No separator or grouped slots" },
  { shadcn: "Item", group: "Data display", status: "partial", slug: "item", kit: "ListItem (alias Item)", note: "No outline or muted variants and no size option" },
  { shadcn: "Kbd", group: "Data display", status: "match", slug: "kbd", kit: "Kbd", note: "" },
  { shadcn: "Label", group: "Forms and inputs", status: "partial", slug: "label", kit: "Label", note: "No disabled styling that follows the control" },
  { shadcn: "Marker", group: "Conversation", status: "mapped", slug: "citations", to: "/patterns/citations", kit: "Inline citations", note: "Numbered markers in the text that open their source" },
  { shadcn: "Menubar", group: "Navigation", status: "partial", slug: "menubar", kit: "Menubar", note: "No submenus, checkbox items or radio items" },
  { shadcn: "Message", group: "Conversation", status: "mapped", slug: "message", to: "/patterns/message", kit: "Message thread", note: "Turns with hover actions and response branches" },
  { shadcn: "Message Scroller", group: "Conversation", status: "mapped", slug: "chat", to: "/patterns/chat", kit: "Agent chat", note: "A scrolling thread with the composer docked below" },
  { shadcn: "Native Select", group: "Forms and inputs", status: "missing", kit: "", note: "Select is custom, there is no native select" },
  { shadcn: "Navigation Menu", group: "Navigation", status: "missing", kit: "", note: "No navigation menu" },
  { shadcn: "Pagination", group: "Navigation", status: "partial", slug: "pagination", kit: "Pagination", note: "No numbered page links" },
  { shadcn: "Popover", group: "Overlays", status: "partial", slug: "popover", kit: "Popover", note: "Open state is internal. There is no open or onOpenChange prop" },
  { shadcn: "Progress", group: "Feedback and status", status: "match", slug: "progress", kit: "Progress, ProgressCircle", note: "" },
  { shadcn: "Questionnaire", group: "Conversation", status: "mapped", slug: "approval", to: "/patterns/approval", kit: "Approval card", note: "The agent asks a question with options before it acts" },
  { shadcn: "Radio Group", group: "Forms and inputs", status: "partial", slug: "radio-group", kit: "RadioGroup, Radio", note: "No horizontal orientation" },
  { shadcn: "Resizable", group: "Layout and utility", status: "missing", kit: "", note: "No resizable panels" },
  { shadcn: "Scroll Area", group: "Layout and utility", status: "match", slug: "scroll-area", kit: "ScrollArea", note: "" },
  { shadcn: "Select", group: "Forms and inputs", status: "partial", slug: "select", kit: "Select", note: "No option groups or separators" },
  { shadcn: "Separator", group: "Layout and utility", status: "partial", slug: "separator", kit: "Divider (alias Separator)", note: "Horizontal only, no vertical" },
  { shadcn: "Sheet", group: "Overlays", status: "partial", slug: "sheet", kit: "Sheet", note: "Left and right only, no top or bottom" },
  { shadcn: "Sidebar", group: "Navigation", status: "missing", kit: "", note: "No sidebar, the example screens build their own" },
  { shadcn: "Skeleton", group: "Feedback and status", status: "match", slug: "skeleton", kit: "Skeleton", note: "" },
  { shadcn: "Slider", group: "Forms and inputs", status: "partial", slug: "slider", kit: "Slider, SpringSlider", note: "One thumb only, no range, step, vertical or disabled state" },
  { shadcn: "Sonner", group: "Feedback and status", status: "missing", kit: "", note: "No toast queue, Toast is a static element" },
  { shadcn: "Spinner", group: "Feedback and status", status: "match", slug: "spinner", kit: "Spinner", note: "" },
  { shadcn: "Switch", group: "Forms and inputs", status: "partial", slug: "switch", kit: "SwitchToggle (alias Switch), SpringToggle", note: "No disabled state or sizes" },
  { shadcn: "Table", group: "Data display", status: "partial", slug: "table", kit: "Table", note: "Data driven only: no composable TableRow and TableCell parts" },
  { shadcn: "Tabs", group: "Navigation", status: "partial", slug: "tabs", kit: "Tabs, SubtleTabs", note: "Only the tab list is provided. You render the panel for the active value yourself" },
  { shadcn: "Textarea", group: "Forms and inputs", status: "partial", slug: "textarea", kit: "TextArea (alias Textarea)", note: "No error state" },
  { shadcn: "Toast", group: "Feedback and status", status: "partial", slug: "toast", kit: "Toast", note: "Static element, no queue, timer, action or dismiss" },
  { shadcn: "Toggle", group: "Forms and inputs", status: "partial", slug: "toggle", kit: "Toggle", note: "No outline variant, and one size" },
  { shadcn: "Toggle Group", group: "Forms and inputs", status: "partial", slug: "toggle-group", kit: "ToggleGroup", note: "Text options only, no icons, outline variant or sizes" },
  { shadcn: "Tooltip", group: "Overlays", status: "partial", slug: "tooltip", kit: "Tooltip", note: "Always sits above the trigger. No side or align options" },
  { shadcn: "Typography", group: "Data display", status: "partial", slug: "typography", kit: "Text, Heading, Caption, Code", note: "No blockquote or list styles" },
];

// shadcn's six conversation components, each pointed at the Halaska pattern
// that covers the same ground.
export const CONVERSATION_MAP = [
  { shadcn: "Attachment", to: "/patterns/prompt-input", kit: "Prompt input", note: "Files attached to a message appear as chips in the composer, beside the model pill." },
  { shadcn: "Bubble", to: "/patterns/message", kit: "Message thread", note: "The user and assistant bubbles are the building block of the thread." },
  { shadcn: "Marker", to: "/patterns/citations", kit: "Inline citations", note: "Numbered markers sit in the answer and open the source they point to." },
  { shadcn: "Message", to: "/patterns/message", kit: "Message thread", note: "A full turn, with hover actions and response branches." },
  { shadcn: "Message Scroller", to: "/patterns/chat", kit: "Agent chat", note: "A scrolling thread with reasoning chips and the composer docked below." },
  { shadcn: "Questionnaire", to: "/patterns/approval", kit: "Approval card", note: "The agent stops and asks a question with options before it acts." },
];
