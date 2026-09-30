import { Badge, StatusBadge, Stack, Text } from "../../kit";

export const usage = `import { Badge } from "./halaska-kit";

<Badge variant="success">Resolved</Badge>`;

// @example Default | A neutral label for a category or a count.
export function Default() {
  return <Badge>Billing</Badge>;
}

// @example Variants | Five colours. Keep each one tied to a single meaning.
export function Variants() {
  return (
    <Stack direction="row" gap={8} wrap align="center" justify="center">
      <Badge>Draft</Badge>
      <Badge variant="accent">Alpha</Badge>
      <Badge variant="success">Resolved</Badge>
      <Badge variant="warning">Waiting</Badge>
      <Badge variant="danger">Overdue</Badge>
    </Stack>
  );
}

// @example In a row | Beside a title, to show the state of the thing it names.
export function InARow() {
  return (
    <Stack direction="row" gap={8} align="center" justify="center">
      <Text weight="medium">#4821 Refund request from Acme</Text>
      <Badge variant="warning">Needs approval</Badge>
    </Stack>
  );
}

// @example Status badge | A pill with a coloured dot for live state.
export function Status() {
  return (
    <Stack direction="row" gap={8} wrap align="center" justify="center">
      <StatusBadge status="online">Online</StatusBadge>
      <StatusBadge status="pending">Queued</StatusBadge>
      <StatusBadge status="error">Failed</StatusBadge>
      <StatusBadge status="offline">Paused</StatusBadge>
      <StatusBadge status="accent">Alpha</StatusBadge>
    </Stack>
  );
}

// @example Pulsing status | The dot pulses while something is running.
export function Pulsing() {
  return <StatusBadge status="online" pulse>Syncing Intercom</StatusBadge>;
}
