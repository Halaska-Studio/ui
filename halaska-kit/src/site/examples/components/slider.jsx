import { useState } from "react";
import { Slider, SpringSlider, Stack, Text } from "../../kit";

export const usage = `import { useState } from "react";
import { Slider } from "./halaska-kit";

const [confidence, setConfidence] = useState(70);

<Slider label="Confidence threshold" value={confidence} onChange={setConfidence} />`;

// @example Default | A native range input with the value shown on the right.
export function Default() {
  const [confidence, setConfidence] = useState(70);
  return (
    <div style={{ width: 320 }}>
      <Slider value={confidence} onChange={setConfidence} />
    </div>
  );
}

// @example With a label | The label sits above the track.
export function WithLabel() {
  const [confidence, setConfidence] = useState(70);
  return (
    <div style={{ width: 320 }}>
      <Slider label="Confidence threshold" value={confidence} onChange={setConfidence} />
    </div>
  );
}

// @example Range | Set the ends of the scale with min and max.
export function Range() {
  const [cap, setCap] = useState(200);
  return (
    <div style={{ width: 320 }}>
      <Slider label="Refund cap (USD)" min={50} max={500} value={cap} onChange={setCap} />
    </div>
  );
}

// @example Spring | SpringSlider has a thumb that grows while dragged and settles with a spring. Mouse only.
export function Spring() {
  const [tickets, setTickets] = useState(12);
  return (
    <div style={{ width: 320 }}>
      <SpringSlider label="Tickets per batch" min={1} max={40} value={tickets} onChange={setTickets} />
    </div>
  );
}

// @example Controlled | The value drives other content as it changes.
export function Controlled() {
  const [confidence, setConfidence] = useState(70);
  const note = confidence >= 85 ? "Alpha sends only when it is very sure. Most drafts wait for review."
    : confidence >= 50 ? "Alpha sends routine replies and holds the rest for review."
    : "Alpha sends most replies without review.";
  return (
    <Stack gap={12} style={{ width: 320 }}>
      <Slider label="Confidence threshold" value={confidence} onChange={setConfidence} />
      <Text size="sm" secondary>{note}</Text>
    </Stack>
  );
}
