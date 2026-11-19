import { useState } from "react";
import { Calendar, Stack, Text, Button } from "../../kit";

export const usage = `import { useState } from "react";
import { Calendar } from "./halaska-kit";

const [date, setDate] = useState(new Date());

<Calendar value={date} onChange={setDate} />`;

// @example Default | One month with the selected day filled and today outlined.
export function Default() {
  const [date, setDate] = useState(new Date());
  return <Calendar value={date} onChange={setDate} />;
}

// @example No selection | Without a value the calendar opens on the current month with nothing selected.
export function NoSelection() {
  const [date, setDate] = useState(null);
  return <Calendar value={date} onChange={setDate} />;
}

// @example Starting month | The calendar opens on the month of its value.
export function StartingMonth() {
  const [renewal, setRenewal] = useState(new Date(2027, 0, 15));
  return <Calendar value={renewal} onChange={setRenewal} />;
}

// @example Controlled | Read the picked date from state and clear it from outside.
export function Controlled() {
  const [followUp, setFollowUp] = useState(null);
  return (
    <Stack direction="row" gap={24} align="center">
      <Calendar value={followUp} onChange={setFollowUp} />
      <Stack gap={12} style={{ width: 180 }}>
        <Text size="sm" secondary>
          {followUp ? `Follow up with Acme on ${followUp.toLocaleDateString("en-AU", { day: "numeric", month: "long" })}` : "No follow-up date set"}
        </Text>
        <Button variant="outline" size="sm" disabled={!followUp} onClick={() => setFollowUp(null)}>Clear date</Button>
      </Stack>
    </Stack>
  );
}
