import { useState } from "react";
import { Select, Stack, Text } from "../../kit";

export const usage = `import { useState } from "react";
import { Select } from "./halaska-kit";

const [priority, setPriority] = useState("");

<Select
  label="Priority"
  placeholder="Choose a priority"
  options={["Low", "Normal", "Urgent"]}
  value={priority}
  onChange={setPriority}
/>`;

// @example Default | One value from a short list of strings.
export function Default() {
  const [priority, setPriority] = useState("");
  return (
    <div style={{ width: 260, height: 190 }}>
      <Select placeholder="Choose a priority" options={["Low", "Normal", "Urgent"]} value={priority} onChange={setPriority} />
    </div>
  );
}

// @example With a label | The label sits above the trigger.
export function WithLabel() {
  const [owner, setOwner] = useState("Dana Ruiz");
  return (
    <div style={{ width: 260, height: 210 }}>
      <Select label="Ticket owner" options={["Sam Keller", "Dana Ruiz", "Priya Nair"]} value={owner} onChange={setOwner} />
    </div>
  );
}

// @example Value and label pairs | Keep a short value in state and show a longer label.
export function ValueLabelPairs() {
  const [source, setSource] = useState("intercom");
  return (
    <div style={{ width: 260, height: 250 }}>
      <Select
        label="Inbox source"
        value={source}
        onChange={setSource}
        options={[
          { value: "intercom", label: "Intercom inbox" },
          { value: "linear", label: "Linear issues" },
          { value: "stripe", label: "Stripe disputes" },
          { value: "notion", label: "Notion requests" },
        ]}
      />
    </div>
  );
}

// @example Sizes | Three sizes that line up with TextInput and Button.
export function Sizes() {
  const [range, setRange] = useState("Last 7 days");
  const options = ["Today", "Last 7 days", "Last 30 days"];
  return (
    <Stack gap={12} style={{ width: 260, height: 290 }}>
      <Select size="sm" options={options} value={range} onChange={setRange} />
      <Select size="md" options={options} value={range} onChange={setRange} />
      <Select size="lg" options={options} value={range} onChange={setRange} />
    </Stack>
  );
}

// @example Disabled | Dimmed, and the list does not open.
export function Disabled() {
  return (
    <div style={{ width: 260 }}>
      <Select label="Plan" options={["Starter", "Team", "Scale"]} value="Team" disabled />
    </div>
  );
}

// @example Controlled | The selected value drives other content.
export function Controlled() {
  const [customer, setCustomer] = useState("Acme");
  const open = { Acme: 3, "Lumen Labs": 1, "Fjord Health": 0 };
  return (
    <Stack gap={12} style={{ width: 260, height: 230 }}>
      <Select label="Customer" options={Object.keys(open)} value={customer} onChange={setCustomer} />
      <Text size="sm" secondary>{open[customer]} open tickets for {customer}</Text>
    </Stack>
  );
}
