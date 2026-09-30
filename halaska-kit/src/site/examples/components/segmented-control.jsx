import { useState } from "react";
import { SegmentedControl, Stack, Text } from "../../kit";

export const usage = `import { useState } from "react";
import { SegmentedControl } from "./halaska-kit";

const [view, setView] = useState("Inbox");

<SegmentedControl options={["Inbox", "Assigned", "Resolved"]} value={view} onChange={setView} />`;

// @example Default | A thumb slides to the active segment.
export function Default() {
  const [view, setView] = useState("Inbox");
  return <SegmentedControl options={["Inbox", "Assigned", "Resolved"]} value={view} onChange={setView} />;
}

// @example Two segments | A compact switch between two modes.
export function TwoSegments() {
  const [mode, setMode] = useState("Build");
  return <SegmentedControl options={["Build", "Simulate"]} value={mode} onChange={setMode} />;
}

// @example Full width | The control is a flex row, so segments share the width of their container.
export function FullWidth() {
  const [range, setRange] = useState("7 days");
  return (
    <div style={{ width: 360 }}>
      <SegmentedControl options={["Today", "7 days", "30 days", "All time"]} value={range} onChange={setRange} />
    </div>
  );
}

// @example Switching content | The value picks which content to show below.
export function SwitchingContent() {
  const summaries = {
    Card: "Refund of $240 to Acme, approved by Dana Ruiz.",
    JSON: '{ "customer": "Acme", "refund": 240, "approvedBy": "Dana Ruiz" }',
  };
  const [format, setFormat] = useState("Card");
  return (
    <Stack gap={16} align="center" style={{ width: 360 }}>
      <SegmentedControl options={["Card", "JSON"]} value={format} onChange={setFormat} />
      <Text size="sm" secondary mono={format === "JSON"}>{summaries[format]}</Text>
    </Stack>
  );
}
