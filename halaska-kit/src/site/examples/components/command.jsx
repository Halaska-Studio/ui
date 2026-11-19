import { useState } from "react";
import { Button, CommandMenu, CommandPalette, Stack, Text } from "../../kit";

export const usage = `import { CommandPalette } from "./halaska-kit";

<CommandPalette
  items={[
    { label: "Assign to Alpha", icon: "✦", shortcut: "A", onSelect: assignToAlpha },
    { label: "Escalate to Dana Ruiz", icon: "↑", onSelect: escalate },
  ]}
/>`;

// @example Default | The inline palette. Type to filter, arrow keys to move, Enter to run.
export function Default() {
  return (
    <CommandPalette
      placeholder="Search actions"
      items={[
        { label: "Assign to Alpha", icon: "✦", shortcut: "A" },
        { label: "Escalate to Dana Ruiz", icon: "↑", shortcut: "E" },
        { label: "Open runbook in Notion", icon: "▤" },
        { label: "Issue refund in Stripe", icon: "$" },
      ]}
    />
  );
}

// @example Modal menu | CommandMenu opens the same list over the page and closes after a pick.
export function ModalMenu() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="outline" onClick={() => setOpen(true)}>Open command menu</Button>
      <CommandMenu
        open={open}
        onClose={() => setOpen(false)}
        placeholder="Search tickets, customers and actions"
        items={[
          { label: "Go to ticket #4821", icon: "#" },
          { label: "Go to Fjord Health", icon: "◎" },
          { label: "Create Linear issue", icon: "+", shortcut: "C" },
          { label: "Snooze until tomorrow", icon: "◷", shortcut: "S" },
          { label: "Pause Alpha", icon: "‖" },
        ]}
      />
    </>
  );
}

// @example Handling selection | Each item takes an onSelect callback.
export function HandlingSelection() {
  const [assignee, setAssignee] = useState("Unassigned");
  return (
    <Stack gap={12} align="center">
      <CommandPalette
        placeholder="Assign ticket #4821"
        items={[
          { label: "Alpha", icon: "✦", onSelect: () => setAssignee("Alpha") },
          { label: "Sam Keller", onSelect: () => setAssignee("Sam Keller") },
          { label: "Dana Ruiz", onSelect: () => setAssignee("Dana Ruiz") },
          { label: "Priya Nair", onSelect: () => setAssignee("Priya Nair") },
        ]}
      />
      <Text size="sm" secondary>Assigned to: {assignee}</Text>
    </Stack>
  );
}

// @example Labels only | Icons and shortcuts are optional.
export function LabelsOnly() {
  return (
    <CommandPalette
      placeholder="Filter by customer"
      items={[
        { label: "Acme" },
        { label: "Lumen Labs" },
        { label: "Fjord Health" },
        { label: "Brightline" },
        { label: "Cobalt Dental" },
      ]}
    />
  );
}
