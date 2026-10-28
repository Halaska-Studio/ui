// Agent surfaces as prop-driven components (added 2026-10-28). Pure data.
export default [
  {
    slug: "chat-history",
    name: "Chat History",
    exports: [
      "ChatHistory"
    ],
    group: "Agents",
    shadcn: null,
    status: "halaska",
    tags: [
      "AI"
    ],
    description: "The sidebar list of past threads, grouped under Pinned, Today, Yesterday and Earlier, with search, a new-chat button and a quiet per-row menu to rename, pin or delete.",
    a11y: [
      "Rows are buttons inside a named list; the open thread carries aria-current and arrow keys move between rows.",
      "The row menu is a labelled button that appears on hover and focus, opens a menu that takes arrow keys, closes on Escape and returns focus.",
      "Rename is a real text field: Enter saves, Escape cancels, leaving the field saves.",
      "Unread threads carry visually hidden Unread text beside the dot, and the pin is a named image."
    ],
    gaps: [
      "No drag to reorder and no folders.",
      "Times are formatted in the browser's locale-free short form, not with Intl."
    ],
    added: "2026-10-28"
  },
  {
    slug: "chat-input",
    name: "Chat Input",
    exports: [
      "ChatInput"
    ],
    group: "Agents",
    shadcn: null,
    status: "halaska",
    tags: [
      "AI"
    ],
    description: "The composer for an agent conversation: a growing text field with suggestion chips, removable attachments, a model pill, a mic button and a send button that becomes Stop while the agent streams.",
    a11y: [
      "The field is a real textarea named by its placeholder; Enter sends and Shift+Enter adds a line.",
      "Every control is a labelled button: Attach file, Change model, Voice input, Send or Stop, and Remove plus the file name on each attachment.",
      "The model pill opens a menu of menuitemradio options that take arrow keys, close on Escape and return focus to the pill.",
      "Suggestions and attachments are exposed as named lists, and the send button is disabled until there is text."
    ],
    gaps: [
      "No slash commands, mentions or inline formatting.",
      "Attachments are display only: the component fires onAttach and leaves the file picker to the app."
    ],
    added: "2026-10-28"
  },
  {
    slug: "conversation",
    name: "Conversation",
    exports: [
      "Conversation"
    ],
    group: "Agents",
    shadcn: null,
    status: "halaska",
    tags: [
      "AI"
    ],
    description: "The scrolling thread of an agent chat, built from Message: it follows new turns until the reader scrolls up, then offers a Jump to latest pill, and shows the agent's thinking indicator while a reply is on its way.",
    a11y: [
      "The thread is a focusable region with the log role and aria-live polite, so new turns are announced without interrupting.",
      "While the agent is typing the log is marked aria-busy and the indicator carries the status role.",
      "Jump to latest is a real button; the reader's scroll position is never moved while they are reading above the end.",
      "Every turn keeps the Message accessibility behaviour, including hover and focus actions."
    ],
    gaps: [
      "No virtualisation: very long threads render every turn.",
      "No day separators between turns; pass a system message for that."
    ],
    added: "2026-10-28"
  },
  {
    slug: "message",
    name: "Message",
    exports: [
      "Message"
    ],
    group: "Agents",
    shadcn: null,
    status: "halaska",
    tags: [
      "AI"
    ],
    description: "One turn in an agent conversation: user turns sit right in a bubble, agent turns sit left beside the agent's mark with sources and quiet actions, system turns are a centred line.",
    a11y: [
      "Actions are labelled buttons that appear on hover and on keyboard focus, and stay visible on a failed turn so Retry is reachable.",
      "A streaming turn is marked aria-busy and its caret is decorative.",
      "Sending and Not sent states are exposed with the status role; the default avatars are named images.",
      "Sources render as a named list; a source with an href is a real link that opens in a new tab."
    ],
    gaps: [
      "No Markdown rendering: pass rich content as children.",
      "No edit-in-place for user turns."
    ],
    added: "2026-10-28"
  },
  {
    slug: "question-card",
    name: "Question Card",
    exports: [
      "QuestionCard"
    ],
    group: "Agents",
    shadcn: null,
    status: "halaska",
    tags: [
      "AI"
    ],
    description: "The agent asks several questions before it continues: one at a time with a count, lettered options, an optional free-text answer and a summary at the end.",
    a11y: [
      "Each question's options form a radiogroup labelled by the question. Every option is a native button with the radio role and aria-checked.",
      "Arrow keys move between options and select them. Typing an option's letter picks it. The letters are shown as keyboard hints.",
      "Questions that are not on screen are hidden from assistive technology and from Tab. The count is a polite live region.",
      "The free-text field is a labelled input that receives focus when Other is picked."
    ],
    gaps: [],
    added: "2026-10-28"
  },
  {
    slug: "reasoning-steps",
    name: "Reasoning Steps",
    exports: [
      "ReasoningSteps"
    ],
    group: "Agents",
    shadcn: null,
    status: "halaska",
    tags: [
      "AI"
    ],
    description: "A dense trace of what the agent did, with a glyph per kind of step and a duration on each. Open while it runs, folded to one summary line when done.",
    a11y: [
      "The header is a native button with aria-expanded and aria-controls. It only toggles once the trace is done, and the cursor says so.",
      "The steps render as a list inside a polite live region, so each one is announced as it arrives. Each kind glyph is an image named with its kind.",
      "Steps that have not arrived yet are hidden from assistive technology. The active step sets aria-current.",
      "Durations are text, not colour, so they read the same in every theme."
    ],
    gaps: [],
    added: "2026-10-28"
  },
  {
    slug: "task-list",
    name: "Task List",
    exports: [
      "TaskList"
    ],
    group: "Agents",
    shadcn: null,
    status: "halaska",
    tags: [
      "AI"
    ],
    description: "The agent's running to-do list for one job: a count, a slim progress bar and one row per task with to do, running, done, failed and blocked states.",
    a11y: [
      "The tasks render as a list labelled with the title. Each status glyph is an image with its status as the name, and the running task sets aria-current.",
      "The count is a polite live region, so a screen reader hears each task finishing without the rows re-announcing.",
      "The progress bar carries the progressbar role with its value. The retry on a failed task is a native button named with the task.",
      "When collapsible, the header is a native button with aria-expanded and aria-controls pointing at the list."
    ],
    gaps: [],
    added: "2026-10-28"
  },
  {
    slug: "trace-waterfall",
    name: "Trace Waterfall",
    exports: [
      "TraceWaterfall"
    ],
    group: "Agents",
    shadcn: null,
    status: "halaska",
    tags: [
      "AI"
    ],
    description: "An agent run on a timeline: totals for duration, cost, tokens and calls, a legend of span kinds, and one bar per span nested under its parent, with a detail line for the span under the pointer or focus.",
    a11y: [
      "Every span is a native button named with the span, its kind and its duration, so the bars are never the only way to read the run. The selected span sets aria-pressed.",
      "Arrow keys, Home and End move between spans. Focusing a span shows its detail in the footer, which is a polite live region.",
      "The stat row and the detail line are text. Kind colours are backed by the legend and by the name in each button's label.",
      "The gridlines, bars and axis are hidden from assistive technology."
    ],
    gaps: [],
    added: "2026-10-28"
  },
];
