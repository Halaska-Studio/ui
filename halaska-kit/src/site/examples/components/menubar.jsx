import { useState } from "react";
import { Menubar, Stack, Text } from "../../kit";

export const usage = `import { Menubar } from "./halaska-kit";

<Menubar
  menus={[
    { label: "Ticket", items: [{ label: "New ticket", shortcut: "⌘N", onSelect: createTicket }] },
    { label: "View", items: [{ label: "Show resolved", onSelect: showResolved }] },
  ]}
/>`;

// @example Default | Open one menu, then move across the bar by hovering.
export function Default() {
  return (
    <Menubar
      menus={[
        { label: "Ticket", items: [{ label: "New ticket" }, { label: "Assign to Alpha" }, { label: "Snooze" }] },
        { label: "View", items: [{ label: "Open tickets" }, { label: "Waiting on customer" }, { label: "Resolved" }] },
        { label: "Agent", items: [{ label: "Pause Alpha" }, { label: "View activity" }] },
      ]}
    />
  );
}

// @example Shortcuts and separators | Keyboard hints on the right, separators between groups.
export function ShortcutsAndSeparators() {
  return (
    <Menubar
      menus={[
        {
          label: "Ticket",
          items: [
            { label: "New ticket", shortcut: "⌘N" },
            { label: "Reply", shortcut: "R" },
            { separator: true },
            { label: "Create Linear issue", shortcut: "⌘L" },
          ],
        },
        {
          label: "Edit",
          items: [
            { label: "Undo", shortcut: "⌘Z" },
            { label: "Redo", shortcut: "⇧⌘Z" },
          ],
        },
      ]}
    />
  );
}

// @example Danger item | Mark destructive actions and keep them last.
export function DangerItem() {
  return (
    <Menubar
      menus={[
        {
          label: "Customer",
          items: [
            { label: "Open in Stripe" },
            { label: "Export conversations" },
            { separator: true },
            { label: "Delete customer", danger: true },
          ],
        },
        { label: "Help", items: [{ label: "Runbooks in Notion" }, { label: "Contact Northwind" }] },
      ]}
    />
  );
}

// @example Handling selection | Each item takes an onSelect callback.
export function HandlingSelection() {
  const [view, setView] = useState("Open tickets");
  return (
    <Stack gap={12} align="center">
      <Menubar
        menus={[
          {
            label: "View",
            items: [
              { label: "Open tickets", onSelect: () => setView("Open tickets") },
              { label: "Waiting on customer", onSelect: () => setView("Waiting on customer") },
              { label: "Resolved", onSelect: () => setView("Resolved") },
            ],
          },
        ]}
      />
      <Text size="sm" secondary>Showing: {view}</Text>
    </Stack>
  );
}
