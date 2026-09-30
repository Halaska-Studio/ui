import { useState } from "react";
import { DatePicker, Button, Stack, Text } from "../../kit";

export const usage = `import { useState } from "react";
import { DatePicker } from "./halaska-kit";

const [date, setDate] = useState(null);

<DatePicker label="Follow up on" value={date} onChange={setDate} />`;

// @example Default | A field that opens a calendar and closes when a day is picked.
export function Default() {
  const [date, setDate] = useState(null);
  return (
    <div style={{ width: 260, height: 360 }}>
      <DatePicker value={date} onChange={setDate} />
    </div>
  );
}

// @example With a label | The label sits above the field.
export function WithLabel() {
  const [date, setDate] = useState(null);
  return (
    <div style={{ width: 260, height: 380 }}>
      <DatePicker label="Follow up on" value={date} onChange={setDate} />
    </div>
  );
}

// @example Custom placeholder | Say what the date is for when there is no label.
export function CustomPlaceholder() {
  const [date, setDate] = useState(null);
  return (
    <div style={{ width: 260, height: 360 }}>
      <DatePicker placeholder="Snooze until" value={date} onChange={setDate} />
    </div>
  );
}

// @example With a value | A preset date shows in short form, and the calendar opens on its month.
export function WithValue() {
  const [renewal, setRenewal] = useState(new Date(2026, 10, 14));
  return (
    <div style={{ width: 260, height: 380 }}>
      <DatePicker label="Acme renewal" value={renewal} onChange={setRenewal} />
    </div>
  );
}

// @example Controlled | Clear or use the date from outside the field.
export function Controlled() {
  const [due, setDue] = useState(null);
  return (
    <Stack gap={12} style={{ width: 260, height: 400 }}>
      <Stack direction="row" gap={8} align="flex-end">
        <DatePicker label="Refund due" value={due} onChange={setDue} />
        <Button variant="ghost" disabled={!due} onClick={() => setDue(null)}>Clear</Button>
      </Stack>
      <Text size="sm" secondary>{due ? "Alpha will remind Dana Ruiz that morning" : "No reminder set"}</Text>
    </Stack>
  );
}
