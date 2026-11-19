// Guidance for the Trust and transparency group (grp-trust).
export default {
  "pat-thinking": {
    useWhen: "Use when the agent works for more than a couple of seconds before answering and the wait needs to look like progress.",
    do: [
      "Write each step as something the agent did, with the detail that proves it: \"Reading 42 unread threads\".",
      "Collapse the trace once the answer is ready, and leave it one tap away.",
      "Show elapsed time while working and the total once done.",
    ],
    dont: [
      "Don't show raw model reasoning. Summarise it into steps a customer could read.",
      "Don't leave the trace open above the answer. It pushes the thing they asked for down the page.",
      "Don't use it for waits under a second. A plain indicator is enough.",
    ],
    neighbours: [
      { id: "pat-tools", when: "when the steps are real tool calls with results the user may need to open." },
      { id: "pat-status", when: "when the agent runs in the background and the user needs to stop or redirect it." },
    ],
    states: [
      { name: "Thinking", note: "Animated dots, the label and a running timer. Steps appear one by one, the current one marked with the accent." },
      { name: "Done", note: "The header changes to a chevron and \"Thought for 4.4 seconds\". The full trace stays open for a moment." },
      { name: "Collapsed", note: "After a short pause the trace folds away and only the header remains." },
      { name: "Reopened", note: "Pressing the header expands the finished trace again. The header only responds once thinking is done." },
    ],
    usage: `import { ThinkingTracePattern } from "./halaska-kit";

<ThinkingTracePattern
  steps={[
    { label: "Reading ticket #4821", detail: "Intercom · Cobalt Dental" },
    { label: "Checking the runbook", detail: "Notion · reminder delivery" },
  ]}
  onDone={showAnswer}
/>`,
  },

  "pat-citations": {
    useWhen: "Use when an answer makes factual claims from several sources and readers need to check one without leaving the page.",
    do: [
      "Put the numbered chip straight after the claim it supports.",
      "Show the quoted passage in the popover, not only a link. The quote is what gets checked.",
      "Let readers page through every source from the open popover.",
    ],
    dont: [
      "Don't cite a source the answer did not use.",
      "Don't pile every chip at the end of the paragraph. Position is the information.",
      "Don't open sources in a new tab as the first step. Show the evidence in place.",
    ],
    neighbours: [
      { id: "pat-context", when: "when you want to show what was retrieved before the answer, not back up claims inside it." },
      { id: "pat-streaming", when: "when sources only need naming at the end of a streamed reply." },
    ],
    states: [
      { name: "Resting", note: "The answer with small numbered chips after each claim and a caption giving the source count." },
      { name: "Popover open", note: "Pressing a chip highlights it and opens a popover anchored under it with the source name, domain and the quoted passage." },
      { name: "Paging", note: "The popover's arrows step through the sources, with a counter such as 2 / 3, without closing it." },
      { name: "Dismissed", note: "Pressing the same chip again, or anywhere outside, closes the popover." },
    ],
    usage: `import { CitationsPattern } from "./halaska-kit";

<CitationsPattern />`,
  },

  "pat-context": {
    useWhen: "Use when the agent answers from your own documents and data, and users need to see exactly which passages it pulled.",
    do: [
      "Show the passage itself, with the file it came from and its type.",
      "Give the total number of chunks retrieved, even when you only show the top few.",
      "Title each chunk by what it says, not by its file name.",
    ],
    dont: [
      "Don't show similarity scores to people who are not tuning retrieval.",
      "Don't list every chunk. Show the ones that shaped the answer.",
      "Don't paraphrase the passage. Quote the source as it is written.",
    ],
    neighbours: [
      { id: "pat-citations", when: "when each claim in the answer needs its own marker and quote." },
    ],
    states: [
      { name: "Listed", note: "A \"Retrieved context\" caption with the chunk count, then a card per chunk: title, length, the passage, and a file tag with its type." },
      { name: "Hovered", note: "The card under the pointer lifts slightly to show it is the one in focus." },
    ],
    usage: `import { ContextSourcesPattern } from "./halaska-kit";

<ContextSourcesPattern />`,
  },

  "pat-confidence": {
    useWhen: "Use when the agent is sometimes unsure and a confident-sounding wrong answer would cost the user something.",
    do: [
      "Change the wording with the confidence. \"Appears\" and \"may\" are part of the design.",
      "Say what the confidence rests on: how many sources, and how fresh.",
      "Give low confidence a way forward: verify with live data, or see what is missing.",
    ],
    dont: [
      "Don't show a percentage. Three named levels are easier to act on.",
      "Don't hide low-confidence answers. Show them as a hypothesis.",
      "Don't use the error colour for the low-confidence banner. It is a caution, not a failure.",
    ],
    neighbours: [
      { id: "pat-recommendation", when: "when the agent is proposing an action and confidence is one input to the decision." },
      { id: "pat-error-repair", when: "when the agent was wrong and has to acknowledge and fix it." },
    ],
    states: [
      { name: "High", note: "The claim stated plainly, with a green dot and \"High confidence · 3 corroborating sources\"." },
      { name: "Medium", note: "The same claim with a hedged word underlined in dots, an amber dot and a note that one source is stale." },
      { name: "Low", note: "A banner, \"Low confidence: treat as a hypothesis\", dimmed text, a red dot, and two actions: verify with live data and show what's missing." },
      { name: "What's missing", note: "A short list opens under the actions naming the evidence the agent does not have." },
      { name: "Verifying", note: "The verify button shows a loading state and reads \"Checking live data…\"." },
      { name: "Re-rated", note: "When the check returns, the claim moves up to medium confidence and the low-confidence actions go." },
    ],
    usage: `import { ConfidencePattern } from "./halaska-kit";

<ConfidencePattern />`,
  },

  "pat-recommendation": {
    useWhen: "Use when the agent has spotted something and has a specific next step to propose, and a person makes the call.",
    do: [
      "State the recommendation as one sentence with the key values picked out: who, how much, by when.",
      "Show the other options the agent considered and how it rates them.",
      "After accepting, say what happens next and who does it.",
    ],
    dont: [
      "Don't recommend without saying how confident the agent is.",
      "Don't offer several primary actions. One accept, with alternatives as a quieter choice.",
      "Don't carry the action out on accept without saying so. \"Queued for Dana to send\" tells the user where it went.",
    ],
    neighbours: [
      { id: "pat-approval", when: "when the agent is already mid-task and needs a yes or no to continue." },
      { id: "pat-nudge", when: "when the suggestion is small and should sit beside the work, easy to ignore." },
    ],
    states: [
      { name: "Proposed", note: "A card with the issue, an AI suggestion badge, the recommendation, a confidence meter, the other options, and Accept." },
      { name: "Alternatives hidden", note: "The other options collapse and the secondary button reads \"Alternatives\"." },
      { name: "Accepted", note: "The options and buttons give way to a drawn tick, \"Queued for Dana to send\" and a live badge." },
    ],
    usage: `import { RecommendationPattern } from "./halaska-kit";

<RecommendationPattern />`,
  },

  "pat-feedback": {
    useWhen: "Use when you need to learn why an answer missed, not only that it did.",
    do: [
      "Keep a thumbs up to one tap and a quiet \"Thanks\".",
      "On a thumbs down, offer a few reasons to pick from and an optional note.",
      "Close the loop after sending: say the feedback was recorded and what changes.",
    ],
    dont: [
      "Don't open a modal. The follow-up unfolds under the answer.",
      "Don't require a written note. A reason chip is enough to send.",
      "Don't ask for feedback on every message. Save it for answers that did something.",
    ],
    neighbours: [
      { id: "pat-message", when: "when a simple vote in the message's action row is all you need." },
      { id: "pat-error-repair", when: "when the agent already knows it got something wrong and should fix it." },
    ],
    states: [
      { name: "Idle", note: "The answer with two thumb buttons under it." },
      { name: "Positive", note: "The thumbs up flashes, stays highlighted, and \"Thanks\" fades in beside it." },
      { name: "Negative", note: "A panel unfolds asking \"What went wrong?\" with reason chips, an optional note and Send. Send stays disabled until there is a reason or a note. Pressing thumbs down again closes it." },
      { name: "Sent", note: "The panel closes, a confirmation line appears, \"Feedback recorded. Alpha will avoid this.\", and the votes lock." },
    ],
    usage: `import { FeedbackPattern } from "./halaska-kit";

<FeedbackPattern />`,
  },
};
