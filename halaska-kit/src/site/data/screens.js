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
    slug: "canvas", name: "Canvas", component: "CanvasParadigmExample", paradigm: "Workspace",
    scenario: "A workflow builder for the same support team: nodes, conditions and a settings panel, with the agent working alongside.",
    description: "The work is the product. The agent operates on a shared surface and its output is an object you can inspect, edit and publish.",
    hotspots: [
      { x: 38, y: 40, pattern: "pat-agent-setup", note: "Each node is a step the agent is configured to run." },
      { x: 50, y: 6, pattern: "pat-autonomy", note: "Build and Simulate separate editing from running." },
      { x: 86, y: 30, pattern: "pat-permissions", note: "Global and node settings decide what the agent may touch." },
      { x: 60, y: 60, pattern: "pat-plan", note: "Transitions spell out what happens next, before anything runs." },
      { x: 88, y: 6, pattern: "pat-checkpoints", note: "Test and Publish keep a draft separate from what is live." },
      { x: 50, y: 27, pattern: "pat-handoff", note: "A handoff node passes the thread to a person with the context attached." },
      { x: 72, y: 12, pattern: "pat-status", note: "A status pill shows the agent editing alongside you." },
    ],
    hotspotsMobile: [
      { x: 50, y: 34, pattern: "pat-agent-setup", note: "Each node is a step the agent is configured to run. On a phone the flow reads top to bottom." },
      { x: 50, y: 10.5, pattern: "pat-autonomy", note: "Build and Simulate separate editing from running." },
      { x: 30, y: 95, pattern: "pat-permissions", note: "Global and node settings open as a sheet from the bottom bar." },
      { x: 62, y: 53, pattern: "pat-plan", note: "Transitions spell out what happens next, and each branch is labelled." },
      { x: 84, y: 3.4, pattern: "pat-checkpoints", note: "Test and Publish keep a draft separate from what is live." },
      { x: 60, y: 72, pattern: "pat-handoff", note: "A handoff node passes the thread to a person with the context attached." },
      { x: 50, y: 17.5, pattern: "pat-status", note: "A status pill shows the agent editing alongside you." },
    ],
  },
];
export const screenBySlug = (slug) => SCREENS.find((s) => s.slug === slug);
