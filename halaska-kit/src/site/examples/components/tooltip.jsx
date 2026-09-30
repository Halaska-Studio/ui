import { Badge, Button, IconButton, Stack, Tooltip } from "../../kit";

export const usage = `import { Button, Tooltip } from "./halaska-kit";

<Tooltip text="Alpha drafts, you approve">
  <Button variant="outline">Draft reply</Button>
</Tooltip>`;

// @example Default | A short label above the element.
export function Default() {
  return (
    <Tooltip text="Alpha drafts, you approve">
      <Button variant="outline">Draft reply</Button>
    </Tooltip>
  );
}

// @example Icon buttons | Name the action behind an icon. Keep the label prop for screen readers.
export function IconButtons() {
  return (
    <Stack direction="row" gap={8} align="center" justify="center">
      <Tooltip text="Snooze">
        <IconButton icon="◷" label="Snooze" variant="secondary" />
      </Tooltip>
      <Tooltip text="Assign">
        <IconButton icon="✦" label="Assign" variant="secondary" />
      </Tooltip>
      <Tooltip text="Close ticket">
        <IconButton icon="✕" label="Close ticket" variant="secondary" />
      </Tooltip>
    </Stack>
  );
}

// @example On a badge | Works on any inline element.
export function OnBadge() {
  return (
    <Tooltip text="Refund cap is $100 per ticket">
      <Badge variant="warning">Over cap</Badge>
    </Tooltip>
  );
}
