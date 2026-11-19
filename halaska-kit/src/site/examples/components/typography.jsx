import { Caption, Code, Heading, Stack, Text } from "../../kit";

export const usage = `import { Heading, Text } from "./halaska-kit";

<Heading level={2}>Support inbox</Heading>
<Text secondary>Alpha replied to 8 tickets today.</Text>`;

// @example Default | A heading, body text and a caption together.
export function Default() {
  return (
    <Stack gap={8} style={{ width: 380 }}>
      <Heading level={3}>Support inbox</Heading>
      <Text secondary>Alpha replied to 8 tickets today and left 4 for the team.</Text>
      <Caption>Updated 2 minutes ago</Caption>
    </Stack>
  );
}

// @example Headings | Six levels, each rendered as the matching heading element.
export function Headings() {
  return (
    <Stack gap={8}>
      <Heading level={1}>Northwind operations</Heading>
      <Heading level={2}>Support inbox</Heading>
      <Heading level={3}>Refund requests</Heading>
      <Heading level={4}>Ticket #4821</Heading>
      <Heading level={5}>Customer notes</Heading>
      <Heading level={6}>Activity</Heading>
    </Stack>
  );
}

// @example Text sizes | The type scale, from xs to xxl.
export function TextSizes() {
  return (
    <Stack gap={4}>
      <Text size="xs">Ticket #4821, xs</Text>
      <Text size="sm">Ticket #4821, sm</Text>
      <Text size="base">Ticket #4821, base</Text>
      <Text size="md">Ticket #4821, md</Text>
      <Text size="lg">Ticket #4821, lg</Text>
      <Text size="xl">Ticket #4821, xl</Text>
      <Text size="xxl">Ticket #4821, xxl</Text>
    </Stack>
  );
}

// @example Weights | Four weights.
export function Weights() {
  return (
    <Stack direction="row" gap={16} wrap align="center" justify="center">
      <Text weight="regular">Regular</Text>
      <Text weight="medium">Medium</Text>
      <Text weight="semibold">Semibold</Text>
      <Text weight="bold">Bold</Text>
    </Stack>
  );
}

// @example Tones | Default, secondary and muted text for a clear order of importance.
export function Tones() {
  return (
    <Stack gap={4}>
      <Text>Acme asked for a refund on their last invoice.</Text>
      <Text secondary>Alpha drafted a $120 refund in Stripe.</Text>
      <Text muted>Waiting for approval from Sam Keller.</Text>
    </Stack>
  );
}

// @example Mono and truncate | Mono for ids and figures. Truncate cuts a long line with an ellipsis.
export function MonoAndTruncate() {
  return (
    <Stack gap={8} style={{ width: 260 }}>
      <Text mono>re_3PqL82Kx4821</Text>
      <Text as="div" truncate>
        Acme wrote in about a duplicate charge on the March invoice and asked for it back.
      </Text>
    </Stack>
  );
}

// @example Inline code | For identifiers, fields and short commands inside a sentence.
export function InlineCode() {
  return (
    <Text>
      Alpha reads the <Code>refund_cap</Code> setting before it touches Stripe.
    </Text>
  );
}
