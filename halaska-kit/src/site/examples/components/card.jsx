import { useState } from "react";
import { Badge, Button, Card, CardHeader, Stack, Text } from "../../kit";

export const usage = `import { Card, CardHeader } from "./halaska-kit";

<Card>
  <CardHeader title="Support inbox" subtitle="12 open tickets" />
  Alpha replied to 8 tickets today.
</Card>`;

// @example Default | A surface with a header and body text.
export function Default() {
  return (
    <Card style={{ width: 340 }}>
      <CardHeader title="Support inbox" subtitle="12 open tickets" />
      <Text secondary>Alpha replied to 8 tickets today and left 4 for the team.</Text>
    </Card>
  );
}

// @example Header action | The action slot sits at the right of the header.
export function HeaderAction() {
  return (
    <Card style={{ width: 340 }}>
      <CardHeader
        title="Refund for Acme"
        subtitle="Ticket #4821"
        action={<Badge variant="warning">Needs approval</Badge>}
      />
      <Text secondary>Alpha drafted a $120 refund in Stripe and is waiting for a yes.</Text>
    </Card>
  );
}

// @example With actions | Buttons at the end of the body.
export function WithActions() {
  return (
    <Card style={{ width: 340 }}>
      <CardHeader title="Connect Linear" subtitle="Let Alpha file issues from tickets" />
      <Stack direction="row" gap={8}>
        <Button size="sm">Connect</Button>
        <Button size="sm" variant="ghost">Not now</Button>
      </Stack>
    </Card>
  );
}

// @example Clickable | With hover and onClick the whole card lifts and responds.
export function Clickable() {
  const [opened, setOpened] = useState(0);
  return (
    <Card hover onClick={() => setOpened(opened + 1)} style={{ width: 340 }}>
      <CardHeader title="Escalation runbook" subtitle="Notion, updated by Dana Ruiz" />
      <Text secondary>{opened === 0 ? "Not opened yet." : `Opened ${opened} times.`}</Text>
    </Card>
  );
}

// @example Padding | Set padding for tighter or flush content.
export function Padding() {
  return (
    <Stack direction="row" gap={12} align="center" justify="center">
      <Card padding={12}><Text>Compact</Text></Card>
      <Card><Text>Default</Text></Card>
      <Card padding={40}><Text>Roomy</Text></Card>
    </Stack>
  );
}
