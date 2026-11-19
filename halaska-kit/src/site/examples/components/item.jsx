import { useState } from "react";
import { Avatar, Badge, Button, ListItem, SwitchToggle, Text } from "../../kit";

export const usage = `import { ListItem } from "./halaska-kit";

<ListItem title="Refund request from Acme" subtitle="Ticket #4821" />`;

// @example Default | A title and a subtitle.
export function Default() {
  return (
    <div style={{ width: 360 }}>
      <ListItem title="Refund request from Acme" subtitle="Ticket #4821, opened 2 hours ago" divider={false} />
    </div>
  );
}

// @example With media | The left slot takes an avatar or an icon.
export function WithMedia() {
  return (
    <div style={{ width: 360 }}>
      <ListItem left={<Avatar name="Sam Keller" />} title="Sam Keller" subtitle="Billing and refunds" />
      <ListItem left={<Avatar name="Dana Ruiz" />} title="Dana Ruiz" subtitle="Runbooks and escalations" />
      <ListItem left={<Avatar name="Priya Nair" />} title="Priya Nair" subtitle="Support lead" divider={false} />
    </div>
  );
}

// @example With a trailing value | The right slot takes a badge, a value or a timestamp.
export function WithTrailing() {
  return (
    <div style={{ width: 360 }}>
      <ListItem title="Lumen Labs" subtitle="Login loop on mobile" right={<Badge variant="danger">Urgent</Badge>} />
      <ListItem title="Fjord Health" subtitle="Invoice question" right={<Badge variant="success">Resolved</Badge>} />
      <ListItem title="Brightline" subtitle="Export is slow" right={<Text size="sm" muted>3h ago</Text>} divider={false} />
    </div>
  );
}

// @example With an action | A button or switch in the right slot.
export function WithAction() {
  const [autoReply, setAutoReply] = useState(true);
  return (
    <div style={{ width: 360 }}>
      <ListItem title="Intercom" subtitle="Support inbox, connected" right={<Button size="sm" variant="outline">Manage</Button>} />
      <ListItem
        title="Auto reply"
        subtitle="Alpha answers common questions"
        right={<SwitchToggle checked={autoReply} onChange={setAutoReply} aria-label="Auto reply" />}
        divider={false}
      />
    </div>
  );
}

// @example Clickable | With onClick the row shows a pointer and responds to a click.
export function Clickable() {
  const [picked, setPicked] = useState("Acme");
  return (
    <div style={{ width: 360 }}>
      {["Acme", "Cobalt Dental", "Brightline"].map((customer) => (
        <ListItem
          key={customer}
          title={customer}
          right={picked === customer ? <Text size="sm" muted>Selected</Text> : null}
          onClick={() => setPicked(customer)}
        />
      ))}
    </div>
  );
}
