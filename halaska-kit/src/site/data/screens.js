// The Screens tier. Each entry is a full example screen built only from the
// kit. Hotspots are percentages of the stage (1200×760 on desktop, 390×780
// on mobile) and point at the pattern used in that region. Pure data.
export const SCREENS = [
  {
    slug: "chat", name: "Chat", component: "ChatParadigmExample", paradigm: "Conversation",
    scenario: "Alpha, a support operations agent, answers a question about an outage, shows its working, and asks before it replies to the customer.",
    description: "The thread is the product. You talk to the agent; it thinks, answers, asks, and acts in the flow of the conversation.",
    // Placed on the screen's resting state: the thread has scrolled to the approval.
    hotspots: [
      { x: 45, y: 6, pattern: "pat-model-context", note: "Model choice and the context meter sit in the top bar." },
      { x: 86, y: 6, pattern: "pat-status", note: "A live status pill says what the agent is doing, or that it is waiting on you." },
      { x: 17, y: 15, pattern: "pat-search", note: "Search and the thread list: recognition over digging through transcripts." },
      { x: 53, y: 16, pattern: "pat-streaming", note: "The streamed answer ends in follow-ups; picking one continues the thread." },
      { x: 60, y: 44, pattern: "pat-approval", note: "Before replying to the customer, the agent stops and asks." },
      { x: 60, y: 87, pattern: "pat-prompt-input", note: "The composer carries suggestions, attachments and the model picker." },
    ],
    // The phone layout (390×780): same patterns, different places.
    hotspotsMobile: [
      { x: 20, y: 8.5, pattern: "pat-model-context", note: "Model choice and the context meter move to a second row under the title." },
      { x: 78, y: 8.5, pattern: "pat-status", note: "The status pill stays in view, with a shorter label." },
      { x: 6.5, y: 3.4, pattern: "pat-search", note: "Search and the thread list open as a drawer from the menu button." },
      { x: 86, y: 40, pattern: "pat-streaming", note: "The streamed answer uses the full width and ends in follow-ups." },
      { x: 86, y: 56, pattern: "pat-approval", note: "Before replying to the customer, the agent stops and asks." },
      { x: 50, y: 90, pattern: "pat-prompt-input", note: "The composer is pinned to the bottom, with suggestions above it." },
    ],
  },
  {
    slug: "board", name: "Board", component: "BoardParadigmExample", paradigm: "Workspace",
    scenario: "Alpha's weekly review for a support team, laid out as a board: what needs a person, what it is drafting, the signals behind it, and what is already done.",
    description: "The work is the product. The agent lays its output out on a shared surface, and you act on it where it sits.",
    hotspots: [
      { x: 29, y: 18, pattern: "pat-approval", note: "Anything over the agent's limit waits in one place, with the decision on the card." },
      { x: 49, y: 16, pattern: "pat-artifact", note: "Drafts are objects with versions, not messages in a thread." },
      { x: 60, y: 22, pattern: "pat-streaming", note: "A new draft appears while the agent writes it, marked with its cursor." },
      { x: 94, y: 16, pattern: "pat-insights", note: "Signals sit beside the work they explain." },
      { x: 62, y: 53, pattern: "pat-receipt", note: "Finished actions stay visible as receipts." },
      { x: 72, y: 3.5, pattern: "pat-status", note: "A status pill says what the agent is doing, or how much is waiting on you." },
      { x: 50, y: 86, pattern: "pat-prompt-input", note: "The composer floats over the board, so asking never leaves the work." },
    ],
    hotspotsMobile: [
      { x: 84, y: 14, pattern: "pat-approval", note: "Anything over the agent's limit comes first, with the decision on the card." },
      { x: 84, y: 60, pattern: "pat-artifact", note: "Drafts are objects with versions. On a phone the groups stack." },
      { x: 62, y: 3.4, pattern: "pat-status", note: "The status pill stays in view, with a shorter label." },
      { x: 50, y: 93, pattern: "pat-prompt-input", note: "The composer is pinned to the bottom." },
    ],
  },
];
export const screenBySlug = (slug) => SCREENS.find((s) => s.slug === slug);
