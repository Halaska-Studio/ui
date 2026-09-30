// Guidance for the Output and generative UI group (grp-output), keyed by pattern id.
export default {
  "pat-artifact": {
    useWhen: "Use when the agent produces a document people will read, revise and take elsewhere, not a reply to scroll past.",
    do: [
      "Give the output a title and its own container, separate from the thread.",
      "Keep every version and say what changed in each one.",
      "Offer the raw source beside the preview, plus copy and download.",
    ],
    dont: [
      "Don't overwrite the previous version when the agent revises.",
      "Don't put short answers in an artifact. A two-line reply belongs in the thread.",
      "Don't hide the raw text. People paste it into other tools.",
    ],
    neighbours: [
      { id: "pat-structured", when: "when the output is a record with fields, not a document." },
      { id: "pat-diff-view", when: "when the agent is changing an existing file and each change needs a decision." },
    ],
    states: [
      { name: "Latest version", note: "The preview tab shows the newest version, with a note on what changed. The next-version control is disabled." },
      { name: "Earlier version", note: "Stepping back swaps the body and the change note. At the first version the previous control is disabled." },
      { name: "Markdown", note: "The second tab shows the same version as raw markdown in a mono block." },
      { name: "Copied", note: "The copy icon becomes a green tick for a moment." },
    ],
    usage: `import { ArtifactPattern } from "./halaska-kit";

<ArtifactPattern />`,
  },

  "pat-diff-view": {
    useWhen: "Use when the agent proposes edits to code or config and people need to accept or reject each change on its own.",
    do: [
      "Put before and after side by side with aligned rows and line numbers.",
      "Let each hunk be accepted or rejected separately.",
      "Keep the rejected side visible but dimmed, so the layout does not jump.",
    ],
    dont: [
      "Don't apply anything until every hunk has a decision.",
      "Don't offer only accept all. Partial acceptance is the point.",
      "Don't show a diff for prose. Use an artifact with versions.",
    ],
    neighbours: [
      { id: "pat-diff", when: "when the edits are to rows of data, not lines of code." },
      { id: "pat-code", when: "when the agent is writing new code and there is nothing to compare against." },
    ],
    states: [
      { name: "Unreviewed", note: "Removed lines are tinted red on the left, added lines green on the right. Each hunk has accept and reject controls and the header counts 0 of 2 reviewed." },
      { name: "Hunk accepted", note: "The controls become an Accepted label, the tint clears and the old lines dim." },
      { name: "Hunk rejected", note: "The controls become a Rejected label, the tint clears and the new lines dim." },
      { name: "All reviewed", note: "A footer appears saying all changes are reviewed, with an Apply button." },
      { name: "Applied", note: "The button turns green and reads Applied." },
    ],
    usage: `import { DiffViewPattern } from "./halaska-kit";

<DiffViewPattern />`,
  },

  "pat-diff": {
    useWhen: "Use when the agent wants to change several records at once and people need to see every edit before it lands.",
    do: [
      "Show the old value struck through beside the new one, in the cell where it changes.",
      "Mark new rows as new.",
      "Summarise the batch in the header, such as 3 edits and 1 addition.",
    ],
    dont: [
      "Don't write to the records before Apply.",
      "Don't describe the edits in a paragraph. Show them in the table they affect.",
      "Don't highlight cells that are not changing.",
    ],
    neighbours: [
      { id: "pat-diff-view", when: "when the change is to code or text and each part needs its own decision." },
      { id: "pat-plan", when: "when the change is a sequence of actions, not edits to data." },
    ],
    states: [
      { name: "Proposed", note: "Changed cells show the old value struck through and the new one in green. New rows are tinted and tagged NEW. Reject and Apply edits sit below." },
      { name: "Applied", note: "Every cell settles to its new value, the highlights clear, the actions go and the header shows an Applied badge." },
    ],
    usage: `import { DiffTablePattern } from "./halaska-kit";

<DiffTablePattern />`,
  },

  "pat-structured": {
    useWhen: "Use when the agent returns data in a schema and people need to read it without parsing JSON.",
    do: [
      "Render the fields as a labelled card, with status as a badge and numbers in mono.",
      "Keep the raw JSON one toggle away.",
      "Say where the data came from, such as the tool and schema.",
    ],
    dont: [
      "Don't show JSON by default to people who are not developers.",
      "Don't drop fields from the card that exist in the JSON.",
      "Don't reword values. The card and the JSON must agree.",
    ],
    neighbours: [
      { id: "pat-artifact", when: "when the output is a document to revise, not a record to read." },
      { id: "pat-receipt", when: "when the record is proof of an action and needs an undo." },
    ],
    states: [
      { name: "Card", note: "A readable card with labelled fields, a status badge and a small events table." },
      { name: "JSON", note: "The same record as syntax-tinted JSON in a mono block." },
    ],
    usage: `import { StructuredDataPattern } from "./halaska-kit";

<StructuredDataPattern />`,
  },

  "pat-insights": {
    useWhen: "Use when the agent has found a few things worth knowing in the data and each one needs a number and a chart to back it.",
    do: [
      "Lead with one sentence that states the finding and bolds the subject.",
      "Back it with two or three figures and one chart.",
      "Offer a next step from the insight.",
    ],
    dont: [
      "Don't show more than a handful. Page through them one at a time.",
      "Don't show a chart without a sentence that says what it means.",
      "Don't round away the numbers people will act on.",
    ],
    neighbours: [
      { id: "pat-digest", when: "when the content is what the agent did, not what it found in the data." },
      { id: "pat-recommendation", when: "when there is one suggested action and the user should accept or decline it." },
    ],
    states: [
      { name: "Insight shown", note: "One finding with its figures, coloured by direction, and a chart. A badge counts the insights." },
      { name: "Paged", note: "Moving to another page fades in the next finding and redraws the chart." },
    ],
    usage: `import { InsightCardsPattern } from "./halaska-kit";

<InsightCardsPattern />`,
  },

  "pat-comparison": {
    useWhen: "Use when people need to judge two models or two drafts against the same prompt and record which is better.",
    do: [
      "Show the prompt once, above both answers.",
      "Stream both at their real speed, so pace is part of the comparison.",
      "Hold the vote until both have finished, and allow a tie.",
    ],
    dont: [
      "Don't ask for a vote while either answer is still streaming.",
      "Don't hide which model is which unless the test is meant to be blind.",
      "Don't compare more than two side by side.",
    ],
    neighbours: [
      { id: "pat-message", when: "when the alternatives are branches of one reply inside a thread." },
      { id: "pat-model-context", when: "when the user is choosing a model up front, not judging outputs." },
    ],
    states: [
      { name: "Streaming", note: "Two columns fill at different speeds, each with a caret and an accent dot beside the model name." },
      { name: "Settled", note: "Both dots turn green and a vote row appears: this one, tie, or the other one." },
      { name: "Preferred", note: "The winning column takes an accent ring and a Preferred badge, and a line confirms the preference was saved." },
      { name: "Tie", note: "No column is marked and a line says there is no routing change." },
    ],
    usage: `import { ComparisonPattern } from "./halaska-kit";

<ComparisonPattern />`,
  },
};
