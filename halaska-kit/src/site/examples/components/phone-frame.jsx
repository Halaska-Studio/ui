import { AgentGlyph, Badge, Button, ListItem, PhoneFrame, Stack, Text } from "../../kit";

export const usage = `import { PhoneFrame } from "./halaska-kit";

<PhoneFrame width={260} height={460}>
  <YourScreen />
</PhoneFrame>`;

// @example Default | A handset bezel around a mobile screen. Leave room at the top for the notch.
export function Default() {
  return (
    <PhoneFrame width={270} height={440}>
      <Stack gap={4} style={{ padding: "44px 16px 16px" }}>
        <Text size="lg" weight="semibold">Inbox</Text>
        <ListItem title="Duplicate charge" subtitle="Acme, #4821" right={<Badge variant="warning">Waiting</Badge>} />
        <ListItem title="SSO login loop" subtitle="Fjord Health, #4822" right={<Badge variant="accent">Alpha</Badge>} />
        <ListItem title="Address change" subtitle="Cobalt Dental, #4823" right={<Badge variant="success">Solved</Badge>} />
        <ListItem title="Export to CSV" subtitle="Brightline, #4824" divider={false} />
      </Stack>
    </PhoneFrame>
  );
}

// @example Compact | Width and height are props, so the frame can shrink for thumbnails.
export function Compact() {
  return (
    <PhoneFrame width={190} height={330}>
      <Stack gap={12} align="center" justify="center" style={{ height: "100%", padding: 16, boxSizing: "border-box" }}>
        <AgentGlyph size={40} />
        <Text weight="medium">Alpha</Text>
        <Text size="sm" secondary align="center">3 tickets need your approval.</Text>
      </Stack>
    </PhoneFrame>
  );
}

// @example Approval screen | Content pinned to the bottom of the screen, like a sheet.
export function ApprovalScreen() {
  return (
    <PhoneFrame width={270} height={440}>
      <Stack justify="space-between" style={{ height: "100%", padding: "44px 16px 20px", boxSizing: "border-box" }}>
        <Stack gap={8}>
          <Text size="xs" secondary>Ticket #4821</Text>
          <Text size="lg" weight="semibold">Refund $49 to Acme?</Text>
          <Text size="sm" secondary>Stripe shows two charges for the same invoice on 12 September.</Text>
        </Stack>
        <Stack gap={8}>
          <Button>Approve refund</Button>
          <Button variant="ghost">Decline</Button>
        </Stack>
      </Stack>
    </PhoneFrame>
  );
}

// @example Scrolling content | The screen clips its content. Add a scroll container for long screens.
export function Scrolling() {
  const customers = ["Acme", "Lumen Labs", "Fjord Health", "Brightline", "Cobalt Dental"];
  return (
    <PhoneFrame width={240} height={360}>
      <div style={{ height: "100%", overflowY: "auto", padding: "44px 16px 16px", boxSizing: "border-box" }}>
        <Text size="lg" weight="semibold">Customers</Text>
        {customers.map((name) => (
          <ListItem key={name} title={name} subtitle="Open tickets and billing" />
        ))}
        {customers.map((name) => (
          <ListItem key={`${name}-archived`} title={name} subtitle="Archived conversations" />
        ))}
      </div>
    </PhoneFrame>
  );
}
