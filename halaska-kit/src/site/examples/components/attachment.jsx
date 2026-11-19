import { Attachment, Stack } from "../../kit";

export const usage = `import { Attachment } from "./halaska-kit";

<Attachment name="refund-policy.pdf" kind="pdf" size="1.2 MB" onRemove={() => remove(id)} />`;

// @example Chips | One line each, for a composer. Every kind has its own glyph and tint.
export function Chips() {
  return (
    <Stack direction="row" gap={8} wrap>
      <Attachment name="refund-policy.pdf" kind="pdf" size="1.2 MB" onRemove={() => {}} />
      <Attachment name="acme-renewal-notes.docx" kind="doc" size="48 KB" onRemove={() => {}} />
      <Attachment name="refunds-q3.csv" kind="sheet" size="310 KB" onRemove={() => {}} />
      <Attachment name="webhook-handler.js" kind="code" size="4 KB" onRemove={() => {}} />
      <Attachment name="call-with-fjord.wav" kind="audio" size="18 MB" onRemove={() => {}} />
    </Stack>
  );
}

// @example Uploading | status="uploading" swaps the glyph for a progress ring and writes the percentage.
export function Uploading() {
  return (
    <Stack direction="row" gap={8} wrap>
      <Attachment name="brightline-invoice.pdf" kind="pdf" size="2.4 MB" status="uploading" progress={64} onRemove={() => {}} />
      <Attachment name="dashboard.png" kind="image" size="860 KB" status="uploading" progress={22} onRemove={() => {}} />
    </Stack>
  );
}

// @example Cards | variant="card" adds a second line and a progress bar, for a message body or a file list.
export function Cards() {
  return (
    <Stack gap={8}>
      <Attachment variant="card" name="refund-policy.pdf" kind="pdf" size="1.2 MB" onOpen={() => {}} onRemove={() => {}} />
      <Attachment variant="card" name="cobalt-dental-export.csv" kind="sheet" size="3.1 MB" status="uploading" progress={41} onRemove={() => {}} />
      <Attachment variant="card" name="runbook-recording.wav" kind="audio" size="26 MB" status="failed" onRemove={() => {}} />
    </Stack>
  );
}

// @example Read only | Without onRemove there is no remove button; with onOpen the name is a button.
export function ReadOnly() {
  return (
    <Stack direction="row" gap={8} wrap>
      <Attachment name="escalation-policy.docx" kind="doc" size="52 KB" onOpen={() => {}} />
      <Attachment name="handoff.txt" kind="file" size="2 KB" />
    </Stack>
  );
}
