import { Card, DotGrid, Stack, Text } from "../../kit";

export const usage = `import { DotGrid } from "./halaska-kit";

<div style={{ position: "relative", height: 240, borderRadius: 16 }}>
  <DotGrid />
</div>`;

// @example Default | Fills its nearest positioned parent and takes on its corner radius.
export function Default() {
  return (
    <div style={{ position: "relative", width: 420, height: 200, borderRadius: 16 }}>
      <DotGrid />
    </div>
  );
}

// @example Spacing | The distance between dots in pixels. The default is 20.
export function Spacing() {
  return (
    <Stack direction="row" gap={16}>
      <div style={{ position: "relative", width: 200, height: 160, borderRadius: 16 }}>
        <DotGrid spacing={12} />
      </div>
      <div style={{ position: "relative", width: 200, height: 160, borderRadius: 16 }}>
        <DotGrid spacing={32} />
      </div>
    </Stack>
  );
}

// @example As a canvas | Content sits on top. The grid ignores pointer events.
export function AsCanvas() {
  return (
    <div style={{ position: "relative", width: 420, height: 200, borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center", gap: 24 }}>
      <DotGrid />
      <Card padding={14} style={{ position: "relative" }}>
        <Stack gap={2}>
          <Text size="xs" secondary>Trigger</Text>
          <Text size="sm" weight="medium">New Intercom ticket</Text>
        </Stack>
      </Card>
      <Card padding={14} style={{ position: "relative" }}>
        <Stack gap={2}>
          <Text size="xs" secondary>Step</Text>
          <Text size="sm" weight="medium">Check Stripe invoice</Text>
        </Stack>
      </Card>
    </div>
  );
}
