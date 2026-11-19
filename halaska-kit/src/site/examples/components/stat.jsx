import { Card, Stack, Stat } from "../../kit";

export const usage = `import { Stat } from "./halaska-kit";

<Stat label="Tickets resolved" value="284" change="12%" />`;

// @example Default | A label, a value and the change since last period.
export function Default() {
  return <Stat label="Tickets resolved" value="284" change="12%" />;
}

// @example Falling | A change that starts with a minus sign shows a down arrow in the danger colour.
export function Falling() {
  return <Stat label="Customer satisfaction" value="91%" change="-3%" />;
}

// @example Without a change | Just the label and the value.
export function WithoutChange() {
  return <Stat label="Open tickets" value="12" />;
}

// @example Row of stats | Side by side for a summary strip.
export function Row() {
  return (
    <Stack direction="row" gap={40} justify="center">
      <Stat label="Resolved by Alpha" value="196" change="18%" />
      <Stat label="Median reply time" value="4m" change="-22%" />
      <Stat label="Refunds sent" value="$460" />
    </Stack>
  );
}

// @example In cards | One stat per card on a dashboard.
export function InCards() {
  return (
    <Stack direction="row" gap={12} justify="center">
      <Card style={{ width: 180 }}>
        <Stat label="Escalations" value="7" change="-30%" />
      </Card>
      <Card style={{ width: 180 }}>
        <Stat label="Issues filed" value="23" change="9%" />
      </Card>
    </Stack>
  );
}
