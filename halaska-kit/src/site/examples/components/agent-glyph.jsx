import { AgentGlyph, Stack, Text, ThinkingIndicator } from "../../kit";

export const usage = `import { AgentGlyph } from "./halaska-kit";

<AgentGlyph size={24} />`;

// @example Default | A 24px accent mark. It follows the accent colour.
export function Default() {
  return <AgentGlyph />;
}

// @example Sizes | Any pixel size. The spark scales with it.
export function Sizes() {
  return (
    <Stack direction="row" gap={16} align="center">
      <AgentGlyph size={16} />
      <AgentGlyph size={24} />
      <AgentGlyph size={32} />
      <AgentGlyph size={48} />
    </Stack>
  );
}

// @example With a name | The glyph has no label, so put the agent's name beside it.
export function WithName() {
  return (
    <Stack direction="row" gap={10} align="center">
      <AgentGlyph size={28} />
      <Stack gap={0}>
        <Text size="sm" weight="medium">Alpha</Text>
        <Text size="xs" secondary>Operations agent, Northwind</Text>
      </Stack>
    </Stack>
  );
}

// @example In a message | As the avatar on an agent message.
export function InMessage() {
  return (
    <Stack direction="row" gap={12} align="flex-start" style={{ width: 380 }}>
      <AgentGlyph />
      <Stack gap={4}>
        <Text size="sm" weight="medium">Alpha</Text>
        <Text size="sm" secondary>I found a duplicate charge on Acme's September invoice. Shall I refund $49?</Text>
      </Stack>
    </Stack>
  );
}

// @example While working | Paired with a thinking indicator.
export function WhileWorking() {
  return (
    <Stack direction="row" gap={10} align="center">
      <AgentGlyph />
      <ThinkingIndicator label="Checking the inbox" />
    </Stack>
  );
}
