import { useState } from "react";
import { Button, Progress, ProgressCircle, Stack, Text } from "../../kit";

export const usage = `import { Progress } from "./halaska-kit";

<Progress value={60} />`;

// @example Default | A bar filled to a value from 0 to 100.
export function Default() {
  return (
    <div style={{ width: 320 }}>
      <Progress value={60} />
    </div>
  );
}

// @example With a label | Say what is in progress and how far along it is.
export function WithLabel() {
  return (
    <Stack gap={8} style={{ width: 320 }}>
      <Stack direction="row" justify="space-between">
        <Text size="sm">Importing Intercom history</Text>
        <Text size="sm" muted>1,840 of 2,300</Text>
      </Stack>
      <Progress value={80} />
    </Stack>
  );
}

// @example Heights | Height is a pixel value.
export function Heights() {
  return (
    <Stack gap={16} style={{ width: 320 }}>
      <Progress value={45} height={2} />
      <Progress value={45} />
      <Progress value={45} height={10} />
    </Stack>
  );
}

// @example Controlled | The bar eases to each new value.
export function Controlled() {
  const [synced, setSynced] = useState(25);
  return (
    <Stack gap={16} align="center" style={{ width: 320 }}>
      <Progress value={synced} />
      <Stack direction="row" gap={8}>
        <Button size="sm" variant="outline" onClick={() => setSynced(Math.max(0, synced - 25))}>Back</Button>
        <Button size="sm" onClick={() => setSynced(Math.min(100, synced + 25))}>Sync next batch</Button>
      </Stack>
    </Stack>
  );
}

// @example Circle | A ring for tight spaces such as a row or a card corner.
export function Circle() {
  return (
    <Stack direction="row" gap={24} align="center" justify="center">
      <ProgressCircle value={25} />
      <ProgressCircle value={60} />
      <ProgressCircle value={100} />
    </Stack>
  );
}

// @example Circle with a label | The label sits in the middle and scales with the ring.
export function CircleWithLabel() {
  return (
    <Stack direction="row" gap={24} align="center" justify="center">
      <ProgressCircle value={72} label="72" />
      <ProgressCircle value={72} label="72%" size={72} stroke={6} />
      <ProgressCircle value={72} label="18/25" size={96} stroke={8} />
    </Stack>
  );
}
