import { useState } from "react";
import { Combobox, Stack, Text } from "../../kit";

export const usage = `import { useState } from "react";
import { Combobox } from "./halaska-kit";

const [customer, setCustomer] = useState("");

<Combobox
  label="Customer"
  placeholder="Select a customer"
  value={customer}
  onChange={setCustomer}
  options={[
    { value: "acme", label: "Acme" },
    { value: "lumen", label: "Lumen Labs" },
  ]}
/>`;

// @example Default | Opens a list with a filter field at the top.
export function Default() {
  const [customer, setCustomer] = useState("");
  return (
    <div style={{ width: 260, height: 320 }}>
      <Combobox
        placeholder="Select a customer"
        value={customer}
        onChange={setCustomer}
        options={[
          { value: "acme", label: "Acme" },
          { value: "lumen", label: "Lumen Labs" },
          { value: "fjord", label: "Fjord Health" },
          { value: "brightline", label: "Brightline" },
          { value: "cobalt", label: "Cobalt Dental" },
        ]}
      />
    </div>
  );
}

// @example With a label | The label sits above the trigger.
export function WithLabel() {
  const [owner, setOwner] = useState("");
  return (
    <div style={{ width: 260, height: 260 }}>
      <Combobox
        label="Ticket owner"
        placeholder="Assign to"
        value={owner}
        onChange={setOwner}
        options={[
          { value: "sam", label: "Sam Keller" },
          { value: "dana", label: "Dana Ruiz" },
          { value: "priya", label: "Priya Nair" },
        ]}
      />
    </div>
  );
}

// @example With a value | A preselected option shows in the trigger and is ticked in the list.
export function WithValue() {
  const [tool, setTool] = useState("linear");
  return (
    <div style={{ width: 260, height: 300 }}>
      <Combobox
        label="Create issues in"
        value={tool}
        onChange={setTool}
        options={[
          { value: "intercom", label: "Intercom" },
          { value: "linear", label: "Linear" },
          { value: "stripe", label: "Stripe" },
          { value: "notion", label: "Notion" },
        ]}
      />
    </div>
  );
}

// @example Controlled | The picked value drives the rest of the form.
export function Controlled() {
  const plans = [
    { value: "starter", label: "Starter", cap: "$50" },
    { value: "team", label: "Team", cap: "$200" },
    { value: "scale", label: "Scale", cap: "$500" },
  ];
  const [plan, setPlan] = useState("team");
  const current = plans.find((p) => p.value === plan);
  return (
    <Stack gap={12} style={{ width: 260, height: 280 }}>
      <Combobox label="Plan" value={plan} onChange={setPlan} options={plans} />
      <Text size="sm" secondary>Alpha can refund up to {current.cap} without approval</Text>
    </Stack>
  );
}
