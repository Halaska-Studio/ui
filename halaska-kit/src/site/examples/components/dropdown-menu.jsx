import { useState } from "react";
import { Button, DropdownMenu, IconButton, Stack, Text } from "../../kit";

export const usage = `import { Button, DropdownMenu } from "./halaska-kit";

<DropdownMenu
  trigger={<Button variant="outline">Actions</Button>}
  items={[
    { label: "Assign to Alpha", onClick: assignToAlpha },
    { label: "Snooze", onClick: snooze },
  ]}
/>`;

// @example Default | A list of actions under a button.
export function Default() {
  return (
    <DropdownMenu
      trigger={<Button variant="outline">Actions</Button>}
      items={[
        { label: "Assign to Alpha" },
        { label: "Snooze until tomorrow" },
        { label: "Open in Intercom" },
      ]}
    />
  );
}

// @example With icons | An icon before each label.
export function WithIcons() {
  return (
    <DropdownMenu
      trigger={<Button variant="outline">Share</Button>}
      items={[
        { label: "Copy link", icon: "⧉" },
        { label: "Send to Linear", icon: "→" },
        { label: "Add to Notion runbook", icon: "▤" },
      ]}
    />
  );
}

// @example Separator and danger | Set destructive actions apart at the bottom.
export function SeparatorAndDanger() {
  return (
    <DropdownMenu
      trigger={<Button variant="outline">Ticket #4821</Button>}
      items={[
        { label: "Reassign" },
        { label: "Merge with another ticket" },
        { separator: true },
        { label: "Close ticket", icon: "✕", danger: true },
      ]}
    />
  );
}

// @example Icon trigger | Any element can be the trigger.
export function IconTrigger() {
  return (
    <DropdownMenu
      trigger={<IconButton icon="⋯" label="More actions" variant="secondary" />}
      items={[
        { label: "Mark as unread" },
        { label: "Mute thread" },
        { label: "Print" },
      ]}
    />
  );
}

// @example Handling selection | Each item takes an onClick. The menu closes after it runs.
export function HandlingSelection() {
  const [priority, setPriority] = useState("Normal");
  return (
    <Stack direction="row" gap={12} align="center">
      <Text size="sm" secondary>Priority: {priority}</Text>
      <DropdownMenu
        trigger={<Button variant="outline" size="sm">Change</Button>}
        items={[
          { label: "Low", onClick: () => setPriority("Low") },
          { label: "Normal", onClick: () => setPriority("Normal") },
          { label: "Urgent", onClick: () => setPriority("Urgent") },
        ]}
      />
    </Stack>
  );
}
