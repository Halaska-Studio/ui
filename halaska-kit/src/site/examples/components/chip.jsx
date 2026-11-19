import { useState } from "react";
import { Chip, Stack } from "../../kit";

export const usage = `import { Chip } from "./halaska-kit";

<Chip selected={urgentOnly} onToggle={() => setUrgentOnly(!urgentOnly)}>Urgent</Chip>`;

// @example Default | A compact pill that turns on and off.
export function Default() {
  const [urgentOnly, setUrgentOnly] = useState(false);
  return (
    <Chip selected={urgentOnly} onToggle={() => setUrgentOnly(!urgentOnly)}>
      Urgent
    </Chip>
  );
}

// @example Selected | The selected chip takes the accent colour.
export function Selected() {
  return (
    <Stack direction="row" gap={8} align="center" justify="center">
      <Chip>Open</Chip>
      <Chip selected>Waiting</Chip>
      <Chip>Resolved</Chip>
    </Stack>
  );
}

// @example Filter group | Several chips as a multi-select filter.
export function FilterGroup() {
  const [sources, setSources] = useState(["Intercom"]);
  const toggleSource = (source) =>
    setSources(sources.includes(source) ? sources.filter((s) => s !== source) : [...sources, source]);
  return (
    <Stack direction="row" gap={8} wrap align="center" justify="center">
      {["Intercom", "Linear", "Stripe", "Notion"].map((source) => (
        <Chip key={source} selected={sources.includes(source)} onToggle={() => toggleSource(source)}>
          {source}
        </Chip>
      ))}
    </Stack>
  );
}

// @example With an icon | An icon before the label.
export function WithIcon() {
  const [mine, setMine] = useState(true);
  return (
    <Stack direction="row" gap={8} align="center" justify="center">
      <Chip icon="✦" selected={mine} onToggle={() => setMine(!mine)}>Handled by Alpha</Chip>
      <Chip icon="⚑">Flagged</Chip>
    </Stack>
  );
}

// @example Dismissible | Pass onRemove to add a remove control.
export function Dismissible() {
  const [customers, setCustomers] = useState(["Acme", "Cobalt Dental", "Brightline"]);
  const removeCustomer = (name) => setCustomers(customers.filter((customer) => customer !== name));
  return (
    <Stack direction="row" gap={8} wrap align="center" justify="center">
      {customers.map((customer) => (
        <Chip key={customer} onRemove={() => removeCustomer(customer)}>
          {customer}
        </Chip>
      ))}
    </Stack>
  );
}
