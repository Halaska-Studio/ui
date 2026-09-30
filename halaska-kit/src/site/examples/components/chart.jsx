import { Card, Sparkline, Stack, Stat, Text } from "../../kit";

export const usage = `import { Sparkline } from "./halaska-kit";

<Sparkline data={[12, 18, 14, 22, 19, 27, 31]} />`;

// @example Default | A trend line with an area fill and a dot on the latest value.
export function Default() {
  return <Sparkline data={[12, 18, 14, 22, 19, 27, 31]} />;
}

// @example Line only | Turn the fill off for a lighter mark.
export function LineOnly() {
  return <Sparkline data={[42, 38, 40, 33, 35, 29, 24]} fill={false} />;
}

// @example Colour | Pass a colour when the trend has a meaning, such as a rising backlog.
export function Colour() {
  return (
    <Stack direction="row" gap={32} align="center" justify="center">
      <Sparkline data={[8, 11, 10, 15, 17, 21, 26]} color="#16a34a" width={160} height={56} />
      <Sparkline data={[5, 6, 9, 8, 14, 19, 23]} color="#dc2626" width={160} height={56} />
    </Stack>
  );
}

// @example Sizes | Width and height take pixels or a percentage of the parent.
export function Sizes() {
  return (
    <Stack direction="row" gap={32} align="center" justify="center">
      <Sparkline data={[3, 5, 4, 7, 6, 9]} width={80} height={28} />
      <Sparkline data={[3, 5, 4, 7, 6, 9]} width={160} height={48} />
      <Sparkline data={[3, 5, 4, 7, 6, 9]} width={240} height={72} />
    </Stack>
  );
}

// @example Objects as data | Points can be objects with a value field.
export function ObjectData() {
  const tickets = [
    { day: "Mon", value: 34 },
    { day: "Tue", value: 41 },
    { day: "Wed", value: 38 },
    { day: "Thu", value: 52 },
    { day: "Fri", value: 47 },
  ];
  return <Sparkline data={tickets} />;
}

// @example In a card | Beside a stat, so the number and its trend read together.
export function InACard() {
  return (
    <Card style={{ width: 320 }}>
      <Stack direction="row" align="flex-end" justify="space-between" gap={16}>
        <Stat label="Tickets resolved" value="284" change="12%" />
        <Sparkline data={[180, 196, 210, 204, 238, 251, 284]} width={120} height={44} />
      </Stack>
      <Text size="sm" muted>Last 7 days</Text>
    </Card>
  );
}
