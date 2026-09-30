import { useState } from "react";
import { Checkbox, Stack, Text } from "../../kit";

export const usage = `import { useState } from "react";
import { Checkbox } from "./halaska-kit";

const [notify, setNotify] = useState(true);

<Checkbox checked={notify} onChange={setNotify} label="Notify me when Alpha escalates a ticket" />`;

// @example Default | A single option with a label.
export function Default() {
  const [notify, setNotify] = useState(true);
  return <Checkbox checked={notify} onChange={setNotify} label="Notify me when Alpha escalates a ticket" />;
}

// @example Unchecked and checked | The tick draws in when the box is checked.
export function States() {
  const [drafts, setDrafts] = useState(false);
  const [refunds, setRefunds] = useState(true);
  return (
    <Stack gap={12}>
      <Checkbox checked={drafts} onChange={setDrafts} label="Send drafts without review" />
      <Checkbox checked={refunds} onChange={setRefunds} label="Ask before issuing refunds" />
    </Stack>
  );
}

// @example Disabled | Dimmed and inert, checked or not.
export function Disabled() {
  return (
    <Stack gap={12}>
      <Checkbox checked={false} disabled label="Close tickets automatically" />
      <Checkbox checked disabled label="Log every action to the audit trail" />
    </Stack>
  );
}

// @example Without a label | For table rows and lists where the row itself names the option.
export function WithoutLabel() {
  const [selected, setSelected] = useState(true);
  return (
    <Stack direction="row" gap={12} align="center">
      <Checkbox checked={selected} onChange={setSelected} aria-label="Select ticket #4821" />
      <Text size="sm" secondary>#4821 · Acme · Invoice charged twice</Text>
    </Stack>
  );
}

// @example Group | Several checkboxes writing to one list in state.
export function Group() {
  const [sources, setSources] = useState(["Intercom", "Stripe"]);
  const toggle = (name) => (on) =>
    setSources(on ? [...sources, name] : sources.filter((s) => s !== name));
  return (
    <Stack gap={12}>
      {["Intercom", "Linear", "Stripe", "Notion"].map((name) => (
        <Checkbox key={name} checked={sources.includes(name)} onChange={toggle(name)} label={name} />
      ))}
      <Text size="sm" secondary>Alpha can read from {sources.length} of 4 tools</Text>
    </Stack>
  );
}
