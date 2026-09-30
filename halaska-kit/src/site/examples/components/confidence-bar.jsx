import { useState } from "react";
import { Button, ConfidenceBar, Stack } from "../../kit";

export const usage = `import { ConfidenceBar } from "./halaska-kit";

<ConfidenceBar label="Match" value={92} />`;

// @example Default | A value from 0 to 100, printed beside the bar.
export function Default() {
  return (
    <div style={{ width: 340 }}>
      <ConfidenceBar value={92} />
    </div>
  );
}

// @example With a label | Name what the agent is sure or unsure about.
export function WithLabel() {
  return (
    <div style={{ width: 340 }}>
      <ConfidenceBar label="Duplicate" value={88} />
    </div>
  );
}

// @example Levels | Green above 80, amber above 50, red at 50 and below.
export function Levels() {
  return (
    <Stack gap={12} style={{ width: 340 }}>
      <ConfidenceBar label="Customer" value={96} />
      <ConfidenceBar label="Invoice" value={68} />
      <ConfidenceBar label="Cause" value={34} />
    </Stack>
  );
}

// @example Updating | The bar animates to a new value and changes colour as it crosses a threshold.
export function Updating() {
  const [value, setValue] = useState(42);
  return (
    <Stack gap={16} align="flex-start" style={{ width: 340 }}>
      <ConfidenceBar label="Match" value={value} />
      <Button size="sm" variant="outline" onClick={() => setValue(value === 42 ? 91 : 42)}>
        {value === 42 ? "Add the Stripe invoice" : "Remove the invoice"}
      </Button>
    </Stack>
  );
}
