import { Card, Spinner, Stack, Text } from "../../kit";

export const usage = `import { Spinner } from "./halaska-kit";

<Spinner />`;

// @example Default | Takes the colour of the text around it.
export function Default() {
  return (
    <Text secondary>
      <Spinner />
    </Text>
  );
}

// @example Sizes | Size is a pixel value.
export function Sizes() {
  return (
    <Text as="div" secondary>
      <Stack direction="row" gap={16} align="center" justify="center">
        <Spinner size={12} />
        <Spinner size={16} />
        <Spinner size={24} />
        <Spinner size={32} />
      </Stack>
    </Text>
  );
}

// @example Colour | Pass a colour to set it directly.
export function Colour() {
  return (
    <Stack direction="row" gap={16} align="center" justify="center">
      <Spinner size={20} color="#8b5cf6" />
      <Spinner size={20} color="#16a34a" />
      <Spinner size={20} color="#d97706" />
    </Stack>
  );
}

// @example With a label | Say what is happening. The spinner alone has no accessible name.
export function WithLabel() {
  return (
    <Text as="div" secondary>
      <Stack direction="row" gap={8} align="center" justify="center">
        <Spinner />
        Syncing the Intercom inbox
      </Stack>
    </Text>
  );
}

// @example In a card | Centred in a surface while its content loads.
export function InACard() {
  return (
    <Card style={{ width: 300 }}>
      <Stack gap={12} align="center">
        <Text muted><Spinner size={20} /></Text>
        <Text size="sm" muted>Alpha is reading ticket #4821</Text>
      </Stack>
    </Card>
  );
}
