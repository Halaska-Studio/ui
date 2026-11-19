import { Badge, Button, Stack, Text } from "../../kit";

export const usage = `import { Stack } from "./halaska-kit";

<Stack gap="sm">
  <Text weight="medium">Refund request</Text>
  <Text secondary>Acme, ticket #4821</Text>
</Stack>`;

// @example Default | A column with the md gap (16px).
export function Default() {
  return (
    <Stack>
      <Badge variant="accent">Billing</Badge>
      <Text weight="medium">Refund request from Acme</Text>
      <Text size="sm" secondary>Ticket #4821, opened by Priya Nair</Text>
    </Stack>
  );
}

// @example Row | Set direction to row for a horizontal layout.
export function Row() {
  return (
    <Stack direction="row" gap="sm" align="center">
      <Button>Approve refund</Button>
      <Button variant="outline">Edit amount</Button>
      <Button variant="ghost">Decline</Button>
    </Stack>
  );
}

// @example Gap | A token name from the spacing scale (xs 4, sm 8, md 16, lg 32) or any number.
export function Gap() {
  return (
    <Stack direction="row" gap="lg" align="flex-start">
      <Stack gap="xs">
        <Text size="xs" mono secondary>xs</Text>
        <Badge>Intercom</Badge>
        <Badge>Linear</Badge>
        <Badge>Stripe</Badge>
      </Stack>
      <Stack gap="sm">
        <Text size="xs" mono secondary>sm</Text>
        <Badge>Intercom</Badge>
        <Badge>Linear</Badge>
        <Badge>Stripe</Badge>
      </Stack>
      <Stack gap="md">
        <Text size="xs" mono secondary>md</Text>
        <Badge>Intercom</Badge>
        <Badge>Linear</Badge>
        <Badge>Stripe</Badge>
      </Stack>
      <Stack gap={24}>
        <Text size="xs" mono secondary>24</Text>
        <Badge>Intercom</Badge>
        <Badge>Linear</Badge>
        <Badge>Stripe</Badge>
      </Stack>
    </Stack>
  );
}

// @example Align and justify | Passed straight to align-items and justify-content.
export function AlignJustify() {
  return (
    <Stack direction="row" align="center" justify="space-between" style={{ width: 360 }}>
      <Stack gap={2}>
        <Text weight="medium">Lumen Labs</Text>
        <Text size="sm" secondary>3 open tickets</Text>
      </Stack>
      <Button size="sm" variant="outline">View</Button>
    </Stack>
  );
}

// @example Wrap | Rows wrap onto new lines when they run out of room.
export function Wrap() {
  return (
    <Stack direction="row" gap="sm" wrap style={{ width: 260 }}>
      <Badge>Acme</Badge>
      <Badge>Lumen Labs</Badge>
      <Badge>Fjord Health</Badge>
      <Badge>Brightline</Badge>
      <Badge>Cobalt Dental</Badge>
    </Stack>
  );
}
