import { useState } from "react";
import { ToggleGroup, Stack, Text } from "../../kit";

export const usage = `import { useState } from "react";
import { ToggleGroup } from "./halaska-kit";

const [range, setRange] = useState("Week");

<ToggleGroup options={["Day", "Week", "Month"]} value={range} onChange={setRange} />`;

// @example Default | One active option. Pass a string as the value.
export function Default() {
  const [range, setRange] = useState("Week");
  return <ToggleGroup options={["Day", "Week", "Month"]} value={range} onChange={setRange} />;
}

// @example Multiple | Pass an array as the value. onChange gives the clicked option and your handler adds or removes it.
export function Multiple() {
  const [channels, setChannels] = useState(["Email", "Chat"]);
  const toggleChannel = (name) =>
    setChannels(channels.includes(name) ? channels.filter((c) => c !== name) : [...channels, name]);
  return <ToggleGroup options={["Email", "Chat", "Phone", "Slack"]} value={channels} onChange={toggleChannel} />;
}

// @example Can be cleared | Set the value back to null when the active option is clicked again.
export function Clearable() {
  const [status, setStatus] = useState("Open");
  const pick = (next) => setStatus(next === status ? null : next);
  return (
    <Stack gap={12} align="center">
      <ToggleGroup options={["Open", "Pending", "Resolved"]} value={status} onChange={pick} />
      <Text size="sm" secondary>{status ? `Showing ${status.toLowerCase()} tickets` : "Showing all tickets"}</Text>
    </Stack>
  );
}

// @example Controlled | The active option drives other content.
export function Controlled() {
  const counts = { Acme: 3, "Lumen Labs": 1, Brightline: 5 };
  const [customer, setCustomer] = useState("Acme");
  return (
    <Stack gap={12} align="center">
      <ToggleGroup options={Object.keys(counts)} value={customer} onChange={setCustomer} />
      <Text size="sm" secondary>{counts[customer]} open tickets for {customer}</Text>
    </Stack>
  );
}
