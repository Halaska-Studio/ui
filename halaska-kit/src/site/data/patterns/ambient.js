// Guidance for the Ambient and beyond chat group (grp-ambient), keyed by pattern id.
export default {
  "pat-taskboard": {
    useWhen: "Use when the agent works through many tasks in the background and people should only step in where a decision is needed.",
    do: [
      "Give the board a column for work that needs a person.",
      "Move cards on their own as the agent progresses, and update the line under the title.",
      "Show who owns each card, the agent or a named person.",
    ],
    dont: [
      "Don't make people read a transcript to learn the state of the work.",
      "Don't ask for input on cards the agent can finish alone.",
      "Don't move cards without animation. People lose track of where they went.",
    ],
    neighbours: [
      { id: "pat-queue", when: "when the agent works one task at a time and order is what matters." },
      { id: "pat-tasks", when: "when a flat list of statuses is enough and there are no stages." },
    ],
    states: [
      { name: "Initial", note: "Three columns, Queued, Alpha working and Needs you, each with a count. Cards in progress carry a shimmer bar." },
      { name: "Cards moving", note: "Cards that are changing stage collapse out of their column." },
      { name: "Settled", note: "The cards arrive in their new columns with updated status lines, and the counts change." },
    ],
    usage: `import { TaskboardPattern } from "./halaska-kit";

<TaskboardPattern />`,
  },

  "pat-inline-assist": {
    useWhen: "Use when the agent can finish what someone is typing, in the place they are typing it.",
    do: [
      "Show the suggestion as ghost text at the cursor.",
      "Offer one key to accept and one to dismiss, and show both.",
      "Treat a dismissal as a signal and offer something different next.",
    ],
    dont: [
      "Don't insert text without an accept.",
      "Don't open a panel or a chat for a one-line completion.",
      "Don't repeat a suggestion that was just dismissed.",
    ],
    neighbours: [
      { id: "pat-nudge", when: "when the agent is proposing a task, not completing the current line." },
      { id: "pat-prompt-input", when: "when the user is writing a request to the agent, not working in their own document." },
    ],
    states: [
      { name: "Waiting", note: "The typed part of the line with no suggestion yet. Accept and Dismiss are disabled." },
      { name: "Streaming", note: "Ghost text fills in after the cursor, with a caret." },
      { name: "Ready", note: "The full suggestion sits in grey and both buttons are active." },
      { name: "Accepted", note: "The suggestion becomes real text with a brief highlight, and the next line begins." },
      { name: "Dismissed", note: "The ghost text clears, a note says the agent adapts, and a different suggestion streams in. It can only be accepted." },
      { name: "Done", note: "Both lines are committed, the key hints dim and a caption counts the completions." },
    ],
    usage: `import { InlineAssistPattern } from "./halaska-kit";

<InlineAssistPattern />`,
  },

  "pat-nudge": {
    useWhen: "Use when the agent notices something worth acting on and the user has not asked.",
    do: [
      "Open with what the agent noticed, then ask one question.",
      "Offer three exits: do it, not now, and never again.",
      "Leave a small trace after each choice, so the person knows it registered.",
    ],
    dont: [
      "Don't block the screen. A nudge sits beside the work.",
      "Don't bring back a nudge the person has muted.",
      "Don't nudge without a reason the person can check.",
    ],
    neighbours: [
      { id: "pat-recommendation", when: "when the user asked for advice and wants confidence and alternatives." },
      { id: "pat-notifications", when: "when the agent is reporting what happened, not proposing something to do." },
    ],
    states: [
      { name: "Offered", note: "A card with what the agent noticed, the question, and three actions." },
      { name: "Doing", note: "The card is replaced by a spinner and a line saying what is being drafted." },
      { name: "Done", note: "A green dot and a line saying where the draft is and that a receipt was logged." },
      { name: "Snoozed", note: "A small pill reading Snoozed for today, which fades back." },
      { name: "Muted", note: "One line confirming the agent will not raise this again." },
    ],
    usage: `import { NudgePattern } from "./halaska-kit";

<NudgePattern />`,
  },

  "pat-digest": {
    useWhen: "Use when people come back after the agent has worked without them and need to catch up in a minute.",
    do: [
      "Open with one sentence that covers everything that happened.",
      "Give each action a reason and a receipt, one tap away.",
      "Surface what was held for approval, and let people approve it in place.",
    ],
    dont: [
      "Don't replay the transcript. Group the actions.",
      "Don't hide skipped or held work. It is what the person most needs to see.",
      "Don't make every row look the same. Held items should stand out.",
    ],
    neighbours: [
      { id: "pat-audit", when: "when the user needs the full record with filters, not a summary." },
      { id: "pat-notifications", when: "when events should arrive as they happen, not in one summary." },
    ],
    states: [
      { name: "Collapsed", note: "A heading, the time away and action count, a one-sentence summary, and a row per group of actions." },
      { name: "Row open", note: "The row expands to show why the agent acted and a receipt line." },
      { name: "Held", note: "The held row is tinted amber. Opened, it explains the cap that stopped it and offers Approve now." },
      { name: "Approved", note: "The held row turns green, its title and amount update, and a receipt replaces the button." },
    ],
    usage: `import { DigestPattern } from "./halaska-kit";

<DigestPattern />`,
  },

  "pat-notifications": {
    useWhen: "Use when the agent produces events over time and people need one place to see what is new.",
    do: [
      "Mark severity with colour and an icon, and keep the title short.",
      "Show unread with a dot and a count in the header.",
      "Offer mark all read.",
    ],
    dont: [
      "Don't notify for routine work the agent finished without trouble. Put that in a digest.",
      "Don't shift rows when an item is read. The dot fades in a fixed slot.",
      "Don't use the panel for decisions that block the agent. Use an approval card.",
    ],
    neighbours: [
      { id: "pat-digest", when: "when the user has been away and wants one summary, not a list of events." },
      { id: "pat-nudge", when: "when the agent is suggesting an action, not reporting an event." },
    ],
    states: [
      { name: "Unread", note: "Bold titles, an accent dot on each row and an accent count in the header." },
      { name: "Read", note: "A row that has been opened dims and loses its dot, and the count drops." },
      { name: "All read", note: "The count is zero and neutral, and the header control reads All read and is disabled." },
    ],
    usage: `import { NotificationCenterPattern } from "./halaska-kit";

<NotificationCenterPattern />`,
  },

  "pat-search": {
    useWhen: "Use when people need one place to jump to anything or ask the agent, without learning the navigation.",
    do: [
      "Keep it to one input at rest and expand only on focus.",
      "Suggest actions and recent items before anything is typed.",
      "Filter as the person types, and say what to try when nothing matches.",
    ],
    dont: [
      "Don't leave the panel open after a pick.",
      "Don't show a blank panel on no results.",
      "Don't hide the keyboard shortcut.",
    ],
    neighbours: [
      { id: "pat-prompt-input", when: "when the user is writing a full request with attachments, not picking a command." },
      { id: "pat-context-bar", when: "when the actions should follow what is on screen and need no searching." },
    ],
    states: [
      { name: "Condensed", note: "One row: a search icon, a placeholder and the shortcut key." },
      { name: "Expanded", note: "On focus the panel grows downward with Suggested and Recent chips." },
      { name: "Filtered", note: "Typing narrows both groups to matching chips, and empty groups disappear." },
      { name: "No matches", note: "One line naming the query and suggesting a customer, a ticket number or plain language." },
      { name: "Picked", note: "Choosing a chip fills the input with its label and closes the panel." },
    ],
    usage: `import { CommandSearchPattern } from "./halaska-kit";

<CommandSearchPattern />`,
  },

  "pat-agent-setup": {
    useWhen: "Use when someone is creating a new agent and has to give it a job, limits and tools before it goes live.",
    do: [
      "Split setup into short steps and show progress through them.",
      "Keep a live preview beside the form, so every choice shows its effect.",
      "End on a review that states what the agent will do to real customers.",
    ],
    dont: [
      "Don't let people move on from a step that is incomplete.",
      "Don't leave safety rules for a settings page later. Set them before deploy.",
      "Don't deploy without a name, a job and a cap.",
    ],
    neighbours: [
      { id: "pat-permissions", when: "when the agent already exists and the user is adjusting what it can touch." },
      { id: "pat-autonomy", when: "when the only thing to set is how independently the agent acts." },
    ],
    states: [
      { name: "Step in progress", note: "A stepper, the current step's fields, and a preview card that updates as fields change. Next is disabled until the step is complete." },
      { name: "Preview empty", note: "Before tools or safety rules are chosen, the preview says none are selected." },
      { name: "Review", note: "The last step shows a notice that the agent will reply to real customers, and the button reads Deploy agent." },
      { name: "Deployed", note: "The form is replaced by the agent's job, budget and a Running status, with an option to configure another." },
    ],
    usage: `import { AgentSetupPattern } from "./halaska-kit";

<AgentSetupPattern />`,
  },
};
