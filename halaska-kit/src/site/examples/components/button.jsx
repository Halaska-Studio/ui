import { useState } from "react";
import { Button, IconButton, LinkButton, Stack } from "../../kit";

export const usage = `import { Button } from "./halaska-kit";

<Button variant="primary" onClick={sendReply}>Send reply</Button>`;

// @example Default | The primary action on a surface. One per view.
export function Default() {
  return <Button>Send reply</Button>;
}

// @example Variants | Six variants, from the main action down to a quiet ghost.
export function Variants() {
  return (
    <Stack direction="row" gap={12} wrap align="center" justify="center">
      <Button variant="primary">Send reply</Button>
      <Button variant="accent">Deploy agent</Button>
      <Button variant="secondary">Snooze</Button>
      <Button variant="outline">Set reminder</Button>
      <Button variant="ghost">Dismiss</Button>
      <Button variant="danger">Close ticket</Button>
    </Stack>
  );
}

// @example Sizes | Four sizes. Use md by default, sm in toolbars and dense rows.
export function Sizes() {
  return (
    <Stack direction="row" gap={12} wrap align="center" justify="center">
      <Button size="sm">Reply</Button>
      <Button size="md">Assign</Button>
      <Button size="lg">Escalate</Button>
      <Button size="xl">Connect Intercom</Button>
    </Stack>
  );
}

// @example With an icon | An icon before or after the label.
export function WithIcon() {
  return (
    <Stack direction="row" gap={12} wrap align="center" justify="center">
      <Button icon="✦">AI triage</Button>
      <Button variant="outline" iconRight="→">View ticket</Button>
    </Stack>
  );
}

// @example Loading | Shows a spinner and blocks clicks until the work is done.
export function Loading() {
  const [loading, setLoading] = useState(false);
  const sync = () => { setLoading(true); setTimeout(() => setLoading(false), 1800); };
  return <Button loading={loading} onClick={sync}>Sync inbox</Button>;
}

// @example Disabled | Dimmed and inert. Say why nearby if it is not obvious.
export function Disabled() {
  return (
    <Stack direction="row" gap={12} wrap align="center" justify="center">
      <Button disabled>Paused</Button>
      <Button variant="outline" disabled>Archived</Button>
    </Stack>
  );
}

// @example Icon button | Icon only. Always pass a label for screen readers.
export function IconOnly() {
  return (
    <Stack direction="row" gap={8} align="center" justify="center">
      <IconButton icon="⚙" label="Settings" variant="secondary" />
      <IconButton icon="✕" label="Close" />
    </Stack>
  );
}

// @example Link button | For navigation that should read as text.
export function Links() {
  return (
    <Stack direction="row" gap={16} align="center" justify="center">
      <LinkButton>View runbook</LinkButton>
      <LinkButton iconRight="→">API docs</LinkButton>
    </Stack>
  );
}
