import { Badge, BrowserFrame, Button, ListItem, Stack, Stat, Text } from "../../kit";

export const usage = `import { BrowserFrame } from "./halaska-kit";

<BrowserFrame url="northwind.app/inbox">
  <YourPage />
</BrowserFrame>`;

// @example Default | Wraps any content in browser chrome with an address bar.
export function Default() {
  return (
    <BrowserFrame url="northwind.app/inbox" style={{ width: 460 }}>
      <Stack gap={4}>
        <Text size="sm" weight="medium">Support inbox</Text>
        <ListItem title="Refund for duplicate charge" subtitle="Acme, #4821" right={<Badge variant="warning">Waiting</Badge>} />
        <ListItem title="SSO login loop" subtitle="Fjord Health, #4822" right={<Badge variant="accent">Alpha</Badge>} />
        <ListItem title="Invoice address change" subtitle="Cobalt Dental, #4823" right={<Badge variant="success">Solved</Badge>} divider={false} />
      </Stack>
    </BrowserFrame>
  );
}

// @example Local preview | The address defaults to localhost:3000, for pages an agent has just built.
export function LocalPreview() {
  return (
    <BrowserFrame style={{ width: 420 }}>
      <Stack gap={12} align="flex-start">
        <Text size="lg" weight="semibold">Alpha for Northwind</Text>
        <Text size="sm" secondary>Triage the support inbox, file issues and handle refunds.</Text>
        <Button size="sm">Connect Intercom</Button>
      </Stack>
    </BrowserFrame>
  );
}

// @example Dashboard | Stats and other kit components sit inside like any page.
export function Dashboard() {
  return (
    <BrowserFrame url="northwind.app/alpha/overview" style={{ width: 480 }}>
      <Stack direction="row" gap={32}>
        <Stat label="Tickets solved" value="128" change="+12%" />
        <Stat label="Auto-resolved" value="64%" change="+8%" />
        <Stat label="Refunds issued" value="$1,240" />
      </Stack>
    </BrowserFrame>
  );
}

// @example Long address | Addresses that do not fit are cut with an ellipsis.
export function LongAddress() {
  return (
    <BrowserFrame url="northwind.app/alpha/runs/4821/transcript?from=intercom" style={{ width: 360 }}>
      <Stack gap={4}>
        <Text size="sm" weight="medium">Run #4821</Text>
        <Text size="sm" secondary>Alpha refunded $49 to Acme and replied to Priya Nair.</Text>
      </Stack>
    </BrowserFrame>
  );
}
