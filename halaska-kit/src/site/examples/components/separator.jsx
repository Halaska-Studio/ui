import { Card, Divider, Stack, Text } from "../../kit";

export const usage = `import { Divider } from "./halaska-kit";

<Text>Conversation</Text>
<Divider />
<Text>Activity</Text>`;

// @example Default | A hairline with 16px of space above and below.
export function Default() {
  return (
    <div style={{ width: 320 }}>
      <Text weight="medium">Ticket #4821</Text>
      <Divider />
      <Text size="sm" secondary>Acme, opened 12 minutes ago through Intercom.</Text>
    </div>
  );
}

// @example Spacing | The spacing prop sets the margin on both sides in pixels.
export function Spacing() {
  return (
    <div style={{ width: 320 }}>
      <Text size="sm">Tight, 8px</Text>
      <Divider spacing={8} />
      <Text size="sm">Default, 16px</Text>
      <Divider />
      <Text size="sm">Loose, 24px</Text>
      <Divider spacing={24} />
      <Text size="sm">End of list</Text>
    </div>
  );
}

// @example In a card | Split a card into a summary and its detail.
export function InCard() {
  return (
    <Card style={{ width: 320 }}>
      <Stack direction="row" justify="space-between" align="center">
        <Text weight="medium">Credit for Acme</Text>
        <Text weight="medium">$120</Text>
      </Stack>
      <Divider />
      <Text size="sm" secondary>Drafted by Alpha, approved by Dana Ruiz.</Text>
    </Card>
  );
}
