// Guidance for the Conversation core group (grp-conversation).
export default {
  "pat-prompt-input": {
    useWhen: "Use when people start work by typing a request, and need to attach a file, pick a model or stop an answer from the same place.",
    do: [
      "Turn send into stop while the agent is answering. It is the same button, in the same place.",
      "Offer a few starting prompts above the composer. They fill the field and leave the user to press send.",
      "Let the field grow with the text up to a limit, then scroll.",
    ],
    dont: [
      "Don't disable the whole composer while the agent answers. Stopping has to stay one tap away.",
      "Don't hide the model behind settings if the choice changes cost, speed or quality.",
      "Don't send on a suggestion tap. Filling the field lets people edit first.",
    ],
    neighbours: [
      { id: "pat-search", when: "when the input launches commands and jumps to things, not a conversation." },
      { id: "pat-model-context", when: "when choosing the model and watching the context window is the task itself." },
    ],
    states: [
      { name: "Empty", note: "Starting prompts sit above the field, the placeholder shows, and the send button is muted." },
      { name: "Typing", note: "The field takes a focus border and grows with its content. The send button turns to the accent once there is text." },
      { name: "File attached", note: "A file chip with name, size and a remove control appears above the text." },
      { name: "Model menu open", note: "The model pill opens a menu above the composer, each model with a one-line description and capability tags. The current one is ticked." },
      { name: "Answering", note: "The field clears, send becomes a stop square, and the hint line changes to \"Alpha is answering\". Pressing stop returns to empty." },
    ],
    usage: `import { PromptInputPattern } from "./halaska-kit";

<PromptInputPattern />`,
  },

  "pat-message": {
    useWhen: "Use when users will copy, rate or regenerate an answer, and need earlier versions to stay within reach.",
    do: [
      "Keep the actions out of the way until the pointer is on the reply, then show them in one row.",
      "Keep every regenerated version and show a pager, so a retry never destroys the answer before it.",
      "Confirm a copy in place with a tick that clears itself.",
    ],
    dont: [
      "Don't give the agent a bubble. The user's turn is the bubble, the agent's reply is plain text beside its glyph.",
      "Don't ask why on a thumbs down here. Use Feedback capture when you need a reason.",
      "Don't rely on hover alone on touch screens. Show the action row permanently there.",
    ],
    neighbours: [
      { id: "pat-streaming", when: "when the moment that matters is the reply arriving, with sources and follow-ups." },
      { id: "pat-feedback", when: "when a rating should collect a reason, not only a vote." },
    ],
    states: [
      { name: "Resting", note: "The user's message in a bubble with its time, and the agent's reply as plain text beside the agent glyph." },
      { name: "Hovered", note: "An action row appears under the reply: copy, retry, thumbs up, thumbs down, the version pager and the time." },
      { name: "Copied", note: "The copy icon becomes a green tick for a little over a second." },
      { name: "Rated", note: "The chosen thumb stays highlighted. Choosing it again clears the vote." },
      { name: "Another version", note: "Retry or the pager arrows cross-fade to a different reply and the counter updates, for example 2 / 3." },
    ],
    usage: `import { MessageThreadPattern } from "./halaska-kit";

<MessageThreadPattern />`,
  },

  "pat-streaming": {
    useWhen: "Use when an answer takes a few seconds to arrive and users need to see progress, where it came from and what to ask next.",
    do: [
      "Say what the agent is doing while it thinks, such as \"Checking the inbox\", not a bare spinner.",
      "Place each source chip at the claim it supports, as the text reaches it.",
      "Hold the sources row and follow-ups back until the answer is complete.",
    ],
    dont: [
      "Don't stream faster than people can read, or so slowly they wait for the end anyway.",
      "Don't let the block change height as it fills. Reserve room for the answer.",
      "Don't offer more than two or three follow-ups. They are a next step, not a menu.",
    ],
    neighbours: [
      { id: "pat-citations", when: "when readers need to open each source and read the quoted passage." },
      { id: "pat-thinking", when: "when the reasoning steps are worth showing, not only a label while the agent thinks." },
    ],
    states: [
      { name: "Thinking", note: "The agent glyph with animated dots and a label. The answer area is empty but keeps its height." },
      { name: "Streaming", note: "The label becomes \"Answer\", text appears a few characters at a time behind a blinking caret, and source chips pop in where the text reaches them." },
      { name: "Complete", note: "The caret goes. A divider, the sources row with a count, and the follow-up prompts slide in." },
      { name: "Follow-up chosen", note: "The answer resets to thinking and streams the new reply with its own follow-ups." },
    ],
    usage: `import { StreamingAnswerPattern } from "./halaska-kit";

<StreamingAnswerPattern
  segments={[
    { t: "Lumen Labs has 3 open tickets, all about invoice exports." },
    { chip: "intercom.com" },
  ]}
  sources={[{ name: "Intercom", domain: "intercom.com" }]}
  followups={["Who owns the Lumen Labs account?"]}
  onFollowup={ask}
/>`,
  },

  "pat-chat": {
    useWhen: "Use when the agent lives in a side panel next to the product and people ask it questions while they work.",
    do: [
      "Show a one-line reasoning chip above each reply: what the agent checked and how long it took.",
      "Scroll to the newest message when one is sent or arrives.",
      "Block a second send while the agent is still working on the first.",
    ],
    dont: [
      "Don't make the panel the only way to reach the agent's work. Results should also land in the product.",
      "Don't expand the full reasoning inside a narrow panel. A chip is enough here.",
      "Don't open on an empty thread. Seed it with something the agent already knows.",
    ],
    neighbours: [
      { id: "pat-message", when: "when you need one turn in detail, with copy, retry and versions." },
      { id: "pat-taskboard", when: "when the work should be visible as a board, with chat as the secondary surface." },
    ],
    states: [
      { name: "Seeded", note: "The panel opens with one question and one answer, the answer under a reasoning chip." },
      { name: "Composing", note: "Text in the input. Enter or the send button submits it." },
      { name: "Thinking", note: "The user's message joins the thread and a \"Thinking\" indicator shows under it. Sending is blocked." },
      { name: "Replying", note: "A reasoning chip appears and the reply streams in beneath it. The thread scrolls to keep it in view." },
    ],
    usage: `import { AgentChatPattern } from "./halaska-kit";

<AgentChatPattern />`,
  },

  "pat-code": {
    useWhen: "Use when the agent writes code or config the user will read, check and copy.",
    do: [
      "Name the file and the language in the header, so the user knows where the code belongs.",
      "Keep copy available while the code is still arriving.",
      "Mark the end clearly: a footer with the line count and who wrote it.",
    ],
    dont: [
      "Don't wrap long lines. Scroll sideways so indentation stays true.",
      "Don't colour every token. Keywords, strings and comments are enough.",
      "Don't use it for a proposed change to existing code. That needs a before and after.",
    ],
    neighbours: [
      { id: "pat-diff-view", when: "when the agent is changing code that already exists and each change needs a decision." },
      { id: "pat-artifact", when: "when the output is a document the user will preview and revise across versions." },
    ],
    states: [
      { name: "Streaming", note: "Lines appear one at a time with line numbers, a caret on the last line and a small indicator in the header." },
      { name: "Complete", note: "The indicator and caret go, and a footer reads \"10 lines · written by Alpha\"." },
      { name: "Copied", note: "The copy button reads \"Copied ✓\" in green for a second and a half." },
    ],
    usage: `import { CodeBlockPattern } from "./halaska-kit";

<CodeBlockPattern />`,
  },

  "pat-model-context": {
    useWhen: "Use when users choose between models and a long conversation can run out of room without them noticing.",
    do: [
      "Show what each model can do and how much it holds right on the picker row.",
      "Break the meter down by what is using the space: system, files, chat.",
      "Say what will happen when the window is exceeded, in plain words, before it happens.",
    ],
    dont: [
      "Don't show a raw token count without the limit beside it.",
      "Don't style the over-limit state as an error. Nothing is broken, the user has a choice to make.",
      "Don't show the meter to people who cannot act on it. Leave it out of consumer chat.",
    ],
    neighbours: [
      { id: "pat-prompt-input", when: "when the model choice is a small pill inside the composer, not a panel of its own." },
      { id: "pat-comparison", when: "when the user wants to see two models answer the same prompt before choosing." },
    ],
    states: [
      { name: "Within the window", note: "The chosen model with its capability badges and window size, and a meter in the accent colour with used, limit and percentage." },
      { name: "Picker open", note: "A list of models, each with a short note, capability badges and window size. The current one is highlighted." },
      { name: "Over the window", note: "With a smaller model the meter fills and turns to the warning colour, and a line explains that older turns will be compacted." },
    ],
    usage: `import { ModelContextPattern } from "./halaska-kit";

<ModelContextPattern />`,
  },
};
