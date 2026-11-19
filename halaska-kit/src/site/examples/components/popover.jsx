import { useState } from "react";
import { Button, IconButton, Popover, Stack, SwitchToggle, Text, TextInput } from "../../kit";

export const usage = `import { Button, Popover, Text } from "./halaska-kit";

<Popover trigger={<Button variant="outline">Details</Button>}>
  <Text size="sm">Opened by Acme 12 minutes ago.</Text>
</Popover>`;

// @example Default | Short detail anchored under its trigger.
export function Default() {
  return (
    <Popover trigger={<Button variant="outline">Ticket details</Button>}>
      <Stack gap={4} style={{ width: 220 }}>
        <Text weight="medium">#4821 Invoice shows the wrong plan</Text>
        <Text size="sm" secondary>Opened by Acme 12 minutes ago through Intercom.</Text>
      </Stack>
    </Popover>
  );
}

// @example With settings | Controls inside keep working while the panel is open.
export function WithSettings() {
  const [drafts, setDrafts] = useState(true);
  const [refunds, setRefunds] = useState(false);
  return (
    <Popover trigger={<IconButton icon="⚙" label="Alpha settings" variant="secondary" />}>
      <Stack gap={12} style={{ width: 220 }}>
        <Text weight="medium">Alpha on this inbox</Text>
        <SwitchToggle checked={drafts} onChange={setDrafts} label="Draft replies" />
        <SwitchToggle checked={refunds} onChange={setRefunds} label="Issue refunds under $50" />
      </Stack>
    </Popover>
  );
}

// @example With a field | A quick edit without leaving the page.
export function WithField() {
  const [note, setNote] = useState("");
  return (
    <Popover trigger={<Button variant="outline" icon="+">Add note</Button>}>
      <Stack gap={12} style={{ width: 240 }}>
        <TextInput label="Internal note" value={note} onChange={setNote} placeholder="Visible to Northwind only" />
        <Text size="sm" secondary>{note ? `${note.length} characters` : "Saved to ticket #4821."}</Text>
      </Stack>
    </Popover>
  );
}
