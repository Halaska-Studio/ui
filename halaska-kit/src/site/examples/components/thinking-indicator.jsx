import { AgentGlyph, Stack, ThinkingIndicator } from "../../kit";

export const usage = `import { ThinkingIndicator } from "./halaska-kit";

<ThinkingIndicator label="Checking the inbox" />`;

// @example Default | The label reads Thinking unless you pass one.
export function Default() {
  return <ThinkingIndicator />;
}

// @example Custom label | Say what the agent is doing.
export function CustomLabel() {
  return (
    <Stack gap={12} align="flex-start">
      <ThinkingIndicator label="Checking the inbox" />
      <ThinkingIndicator label="Looking up the Stripe invoice" />
    </Stack>
  );
}

// @example Sizes | Two sizes: md and sm.
export function Sizes() {
  return (
    <Stack direction="row" gap={32} align="center">
      <ThinkingIndicator size="md" />
      <ThinkingIndicator size="sm" />
    </Stack>
  );
}

// @example Dots only | Pass an empty label when the context already says who is working.
export function DotsOnly() {
  return (
    <Stack direction="row" gap={10} align="center">
      <AgentGlyph />
      <ThinkingIndicator label="" />
    </Stack>
  );
}
