import { useState } from "react";
import { Card, DotGrid, Stack, Text, ZoomControl, rad } from "../../kit";

export const usage = `import { ZoomControl } from "./halaska-kit";

const [zoom, setZoom] = useState(100);

<ZoomControl zoom={zoom} onChange={setZoom} />`;

// @example Default | Controlled. Each press steps the value by 10.
export function Default() {
  const [zoom, setZoom] = useState(100);
  return <ZoomControl zoom={zoom} onChange={setZoom} />;
}

// @example Limits | The value stops at 25 and at 200.
export function Limits() {
  const [low, setLow] = useState(25);
  const [high, setHigh] = useState(200);
  return (
    <Stack direction="row" gap={16} align="center">
      <ZoomControl zoom={low} onChange={setLow} />
      <ZoomControl zoom={high} onChange={setHigh} />
    </Stack>
  );
}

// @example Scaling content | Apply the value as a transform on the thing being zoomed.
export function ScalingContent() {
  const [zoom, setZoom] = useState(100);
  return (
    <div style={{ position: "relative", width: 420, height: 220, borderRadius: rad.md, overflow: "hidden" }}>
      <DotGrid />
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ transform: `scale(${zoom / 100})`, transition: "transform 0.25s ease" }}>
          <Card padding={14}>
            <Stack gap={2}>
              <Text size="xs" secondary>Invoice 4821</Text>
              <Text size="sm" weight="medium">Acme · $240.00</Text>
            </Stack>
          </Card>
        </div>
      </div>
      <div style={{ position: "absolute", left: 12, bottom: 12 }}>
        <ZoomControl zoom={zoom} onChange={setZoom} />
      </div>
    </div>
  );
}
