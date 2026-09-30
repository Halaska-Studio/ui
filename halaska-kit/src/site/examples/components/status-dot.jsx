import { Avatar, ListItem, Stack, StatusDot, Text } from "../../kit";

export const usage = `import { StatusDot } from "./halaska-kit";

<StatusDot status="online" />`;

// @example Default | A dot with a label beside it. The dot alone has no text.
export function Default() {
  return (
    <Stack direction="row" gap={8} align="center" justify="center">
      <StatusDot />
      <Text>Alpha is online</Text>
    </Stack>
  );
}

// @example Statuses | Five states.
export function Statuses() {
  const statuses = [
    { status: "online", label: "Online" },
    { status: "busy", label: "Busy" },
    { status: "error", label: "Error" },
    { status: "offline", label: "Offline" },
    { status: "accent", label: "Working" },
  ];
  return (
    <Stack direction="row" gap={20} wrap align="center" justify="center">
      {statuses.map(({ status, label }) => (
        <Stack key={status} direction="row" gap={8} align="center">
          <StatusDot status={status} />
          <Text size="sm">{label}</Text>
        </Stack>
      ))}
    </Stack>
  );
}

// @example Pulse | A pulse for live activity.
export function Pulse() {
  return (
    <Stack direction="row" gap={8} align="center" justify="center">
      <StatusDot status="accent" pulse />
      <Text>Alpha is replying to ticket #4821</Text>
    </Stack>
  );
}

// @example Sizes | Size is a pixel value.
export function Sizes() {
  return (
    <Stack direction="row" gap={16} align="center" justify="center">
      <StatusDot size={6} />
      <StatusDot size={8} />
      <StatusDot size={12} />
      <StatusDot size={16} />
    </Stack>
  );
}

// @example In a list | At the end of a row to show each connection's state.
export function InAList() {
  return (
    <div style={{ width: 340 }}>
      <ListItem left={<Avatar name="Intercom" />} title="Intercom" subtitle="Synced 2 minutes ago" right={<StatusDot status="online" />} />
      <ListItem left={<Avatar name="Linear" />} title="Linear" subtitle="Token expired" right={<StatusDot status="error" />} />
      <ListItem left={<Avatar name="Stripe" />} title="Stripe" subtitle="Rate limited" right={<StatusDot status="busy" />} divider={false} />
    </div>
  );
}
