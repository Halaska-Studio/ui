import { AISuggestionBadge, Button, Card, Stack, Text } from "../../kit";

export const usage = `import { AISuggestionBadge } from "./halaska-kit";

<AISuggestionBadge />`;

// @example Default | A fixed accent badge. It takes no props.
export function Default() {
  return <AISuggestionBadge />;
}

// @example Beside a heading | Marks a field or a value the agent filled in.
export function BesideHeading() {
  return (
    <Stack gap={6} style={{ width: 340 }}>
      <Stack direction="row" gap={8} align="center">
        <Text size="sm" weight="medium">Priority</Text>
        <AISuggestionBadge />
      </Stack>
      <Text size="sm" secondary>High. Acme has two open tickets about the same charge.</Text>
    </Stack>
  );
}

// @example On a card | Labels a drafted reply so nobody mistakes it for a sent one.
export function OnCard() {
  return (
    <Card padding={16} style={{ width: 360 }}>
      <Stack gap={12} align="flex-start">
        <AISuggestionBadge />
        <Text size="sm">Hi Priya, you were charged twice for September. I have refunded the duplicate $49 and it should arrive in 3 to 5 days.</Text>
        <Stack direction="row" gap={8}>
          <Button size="sm">Send reply</Button>
          <Button size="sm" variant="ghost">Edit</Button>
        </Stack>
      </Stack>
    </Card>
  );
}
