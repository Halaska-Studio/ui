import { useState } from "react";
import { Avatar, Button, Card, Skeleton, Stack, Text } from "../../kit";

export const usage = `import { Skeleton } from "./halaska-kit";

<Skeleton width={240} />`;

// @example Default | Lines of text that have not loaded yet.
export function Default() {
  return (
    <Stack gap={8} style={{ width: 300 }}>
      <Skeleton />
      <Skeleton />
      <Skeleton width="60%" />
    </Stack>
  );
}

// @example Sizes | Width takes pixels or a percentage. Height is a pixel value.
export function Sizes() {
  return (
    <Stack gap={12} style={{ width: 300 }}>
      <Skeleton width={120} height={10} />
      <Skeleton width={200} />
      <Skeleton height={28} />
      <Skeleton height={64} />
    </Stack>
  );
}

// @example Rounded | Fully rounded ends, for avatars, pills and buttons.
export function Rounded() {
  return (
    <Stack direction="row" gap={12} align="center" justify="center">
      <Skeleton width={40} height={40} rounded />
      <Skeleton width={72} height={24} rounded />
      <Skeleton width={110} height={32} rounded />
    </Stack>
  );
}

// @example List row | Match the shape of the row that will replace it.
export function ListRow() {
  return (
    <Stack gap={16} style={{ width: 320 }}>
      {[0, 1, 2].map((row) => (
        <Stack key={row} direction="row" gap={12} align="center">
          <Skeleton width={32} height={32} rounded />
          <Stack gap={6} style={{ flex: 1 }}>
            <Skeleton width="50%" height={12} />
            <Skeleton width="80%" height={10} />
          </Stack>
        </Stack>
      ))}
    </Stack>
  );
}

// @example Loading to loaded | Swap the skeleton for the content once it arrives.
export function LoadingToLoaded() {
  const [loading, setLoading] = useState(true);
  return (
    <Stack gap={16} align="center">
      <Card style={{ width: 320 }}>
        {loading ? (
          <Stack direction="row" gap={12} align="center">
            <Skeleton width={40} height={40} rounded />
            <Stack gap={6} style={{ flex: 1 }}>
              <Skeleton width="45%" height={12} />
              <Skeleton width="75%" height={10} />
            </Stack>
          </Stack>
        ) : (
          <Stack direction="row" gap={12} align="center">
            <Avatar name="Priya Nair" size={40} />
            <Stack gap={0}>
              <Text weight="medium">Priya Nair</Text>
              <Text size="sm" muted>Assigned ticket #4821 to Alpha</Text>
            </Stack>
          </Stack>
        )}
      </Card>
      <Button size="sm" variant="outline" onClick={() => setLoading(!loading)}>
        {loading ? "Show content" : "Show skeleton"}
      </Button>
    </Stack>
  );
}
