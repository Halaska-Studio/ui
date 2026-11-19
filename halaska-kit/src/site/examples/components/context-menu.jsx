import { useState } from "react";
import { Badge, Card, ContextMenu, Stack, Text } from "../../kit";

export const usage = `import { ContextMenu } from "./halaska-kit";

<ContextMenu
  items={[
    { label: "Reply", onSelect: reply },
    { label: "Assign to Alpha", onSelect: assignToAlpha },
  ]}
>
  <TicketRow />
</ContextMenu>`;

// @example Default | Right click the ticket to open the menu at the pointer.
export function Default() {
  return (
    <ContextMenu
      items={[
        { label: "Reply" },
        { label: "Assign to Alpha" },
        { label: "Snooze until tomorrow" },
      ]}
    >
      <Card style={{ width: 320 }}>
        <Stack gap={4}>
          <Text weight="medium">#4821 Invoice shows the wrong plan</Text>
          <Text size="sm" secondary>Acme, opened 12 minutes ago</Text>
        </Stack>
      </Card>
    </ContextMenu>
  );
}

// @example Icons and shortcuts | Each item can carry an icon and a keyboard hint.
export function IconsAndShortcuts() {
  return (
    <ContextMenu
      items={[
        { label: "Reply", icon: "↩", shortcut: "R" },
        { label: "Assign", icon: "✦", shortcut: "A" },
        { label: "Copy link", icon: "⧉", shortcut: "⌘L" },
      ]}
    >
      <Card style={{ width: 320 }}>
        <Stack gap={4}>
          <Text weight="medium">#4822 Export stuck at 90 percent</Text>
          <Text size="sm" secondary>Fjord Health, waiting on Sam Keller</Text>
        </Stack>
      </Card>
    </ContextMenu>
  );
}

// @example Separator and danger | Group items with a separator and mark destructive ones.
export function SeparatorAndDanger() {
  return (
    <ContextMenu
      items={[
        { label: "Open in Linear" },
        { label: "Mark as duplicate" },
        { separator: true },
        { label: "Delete draft reply", danger: true },
      ]}
    >
      <Card style={{ width: 320 }}>
        <Stack gap={4}>
          <Text weight="medium">#4825 Seats not updating after upgrade</Text>
          <Text size="sm" secondary>Brightline, draft reply by Alpha</Text>
        </Stack>
      </Card>
    </ContextMenu>
  );
}

// @example Handling selection | onSelect runs, then the menu closes.
export function HandlingSelection() {
  const [status, setStatus] = useState("Open");
  return (
    <ContextMenu
      items={[
        { label: "Mark as open", onSelect: () => setStatus("Open") },
        { label: "Mark as pending", onSelect: () => setStatus("Pending") },
        { label: "Mark as resolved", onSelect: () => setStatus("Resolved") },
      ]}
    >
      <Card style={{ width: 320 }}>
        <Stack direction="row" gap={12} align="center" justify="space-between">
          <Text weight="medium">#4830 Refund request</Text>
          <Badge variant={status === "Resolved" ? "success" : status === "Pending" ? "warning" : "default"}>{status}</Badge>
        </Stack>
      </Card>
    </ContextMenu>
  );
}
