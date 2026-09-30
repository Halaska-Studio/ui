import { useState } from "react";
import { TextArea, Button, Stack, Text } from "../../kit";

export const usage = `import { useState } from "react";
import { TextArea } from "./halaska-kit"; // also exported as Textarea

const [note, setNote] = useState("");

<TextArea placeholder="Add an internal note" value={note} onChange={setNote} />`;

// @example Default | A multi-line field, three rows tall, that resizes vertically.
export function Default() {
  const [note, setNote] = useState("");
  return <TextArea placeholder="Add an internal note" value={note} onChange={setNote} style={{ width: 340 }} />;
}

// @example With label and caption | The label sits above the field and the caption below.
export function WithLabel() {
  const [instructions, setInstructions] = useState("Keep replies under 120 words. Link the runbook when a refund is involved.");
  return (
    <TextArea
      label="Instructions for Alpha"
      caption="Applied to every reply Alpha drafts."
      value={instructions}
      onChange={setInstructions}
      style={{ width: 340 }}
    />
  );
}

// @example Rows | Set the starting height with rows.
export function Rows() {
  const [reply, setReply] = useState("");
  return (
    <TextArea
      label="Reply to Fjord Health"
      placeholder="Hi Priya, thanks for flagging this."
      rows={6}
      value={reply}
      onChange={setReply}
      style={{ width: 340 }}
    />
  );
}

// @example Disabled | Dimmed and not editable.
export function Disabled() {
  return (
    <TextArea
      label="Escalation note"
      value="Locked while Dana Ruiz reviews ticket #4821."
      disabled
      style={{ width: 340 }}
    />
  );
}

// @example With a character count | Read the value from state to show a limit and gate the action.
export function WithCount() {
  const limit = 160;
  const [summary, setSummary] = useState("Acme was charged twice for March. Refund issued through Stripe.");
  const over = summary.length > limit;
  return (
    <Stack gap={8} style={{ width: 340 }}>
      <TextArea label="Ticket summary" value={summary} onChange={setSummary} />
      <Stack direction="row" align="center" justify="space-between">
        <Text size="sm" secondary>{summary.length} of {limit} characters</Text>
        <Button size="sm" disabled={over || !summary}>Save summary</Button>
      </Stack>
    </Stack>
  );
}
