import { useState } from "react";
import { Stack, Tag } from "../../kit";

export const usage = `import { Tag } from "./halaska-kit";

<Tag>Billing</Tag>`;

// @example Default | A pill label for a topic or a category.
export function Default() {
  return (
    <Stack direction="row" gap={8} wrap align="center" justify="center">
      <Tag>Billing</Tag>
      <Tag>Onboarding</Tag>
      <Tag>Bug</Tag>
    </Stack>
  );
}

// @example With a colour dot | A dot in any colour, to tell sources or teams apart.
export function WithColour() {
  return (
    <Stack direction="row" gap={8} wrap align="center" justify="center">
      <Tag color="#3b82f6">Intercom</Tag>
      <Tag color="#8b5cf6">Linear</Tag>
      <Tag color="#16a34a">Stripe</Tag>
      <Tag color="#d97706">Notion</Tag>
    </Stack>
  );
}

// @example Removable | A remove button after the label.
export function Removable() {
  const [customers, setCustomers] = useState(["Acme", "Lumen Labs", "Fjord Health", "Brightline"]);
  const removeCustomer = (name) => setCustomers(customers.filter((customer) => customer !== name));
  return (
    <Stack direction="row" gap={8} wrap align="center" justify="center">
      {customers.map((customer) => (
        <Tag key={customer} removable onRemove={() => removeCustomer(customer)}>
          {customer}
        </Tag>
      ))}
    </Stack>
  );
}
