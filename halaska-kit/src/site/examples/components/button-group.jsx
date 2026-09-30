import { useState } from "react";
import { Button, ButtonGroup, Stack, Text } from "../../kit";

export const usage = `import { Button, ButtonGroup } from "./halaska-kit";

<ButtonGroup>
  <Button variant="ghost">Reply</Button>
  <Button variant="ghost">Assign</Button>
  <Button variant="ghost">Snooze</Button>
</ButtonGroup>`;

// @example Default | Related actions on one ticket, joined into a single row.
export function Default() {
  return (
    <ButtonGroup>
      <Button variant="ghost">Reply</Button>
      <Button variant="ghost">Assign</Button>
      <Button variant="ghost">Snooze</Button>
    </ButtonGroup>
  );
}

// @example Sizes | The group takes the size of the buttons inside it.
export function Sizes() {
  return (
    <Stack gap={16} align="center">
      <ButtonGroup>
        <Button variant="ghost" size="sm">Day</Button>
        <Button variant="ghost" size="sm">Week</Button>
        <Button variant="ghost" size="sm">Month</Button>
      </ButtonGroup>
      <ButtonGroup>
        <Button variant="ghost" size="lg">Day</Button>
        <Button variant="ghost" size="lg">Week</Button>
        <Button variant="ghost" size="lg">Month</Button>
      </ButtonGroup>
    </Stack>
  );
}

// @example With icons | Icons sit before each label.
export function WithIcons() {
  return (
    <ButtonGroup>
      <Button variant="ghost" icon="↩">Reply</Button>
      <Button variant="ghost" icon="→">Forward</Button>
      <Button variant="ghost" icon="✓">Resolve</Button>
    </ButtonGroup>
  );
}

// @example With a disabled action | One action can be unavailable while the rest stay live.
export function WithDisabled() {
  return (
    <ButtonGroup>
      <Button variant="ghost">Approve refund</Button>
      <Button variant="ghost">Edit amount</Button>
      <Button variant="ghost" disabled>Undo</Button>
    </ButtonGroup>
  );
}

// @example Controlled | Track the last action in state and respond to it.
export function Controlled() {
  const [action, setAction] = useState("None yet");
  return (
    <Stack gap={12} align="center">
      <ButtonGroup>
        <Button variant="ghost" onClick={() => setAction("Replied to Acme")}>Reply</Button>
        <Button variant="ghost" onClick={() => setAction("Assigned to Dana Ruiz")}>Assign</Button>
        <Button variant="ghost" onClick={() => setAction("Snoozed until Monday")}>Snooze</Button>
      </ButtonGroup>
      <Text size="sm" secondary>Last action: {action}</Text>
    </Stack>
  );
}
