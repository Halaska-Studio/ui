import { useState } from "react";
import { Toggle, Stack, Text } from "../../kit";

export const usage = `import { useState } from "react";
import { Toggle } from "./halaska-kit";

const [unread, setUnread] = useState(false);

<Toggle pressed={unread} onPress={setUnread}>Unread only</Toggle>`;

// @example Default | A button that stays pressed. onPress receives the next state.
export function Default() {
  const [unread, setUnread] = useState(false);
  return <Toggle pressed={unread} onPress={setUnread}>Unread only</Toggle>;
}

// @example Pressed | The pressed state takes a filled background and a border.
export function Pressed() {
  const [mine, setMine] = useState(true);
  return <Toggle pressed={mine} onPress={setMine}>Assigned to me</Toggle>;
}

// @example With an icon | Put the icon in the children, before the label.
export function WithIcon() {
  const [starred, setStarred] = useState(false);
  return <Toggle pressed={starred} onPress={setStarred}>{starred ? "★" : "☆"} Starred</Toggle>;
}

// @example Filter bar | Independent toggles side by side, each with its own state.
export function FilterBar() {
  const [filters, setFilters] = useState({ Urgent: true, Billing: false, Unassigned: false });
  const active = Object.keys(filters).filter((name) => filters[name]);
  return (
    <Stack gap={12} align="center">
      <Stack direction="row" gap={4}>
        {Object.keys(filters).map((name) => (
          <Toggle key={name} pressed={filters[name]} onPress={(next) => setFilters({ ...filters, [name]: next })}>
            {name}
          </Toggle>
        ))}
      </Stack>
      <Text size="sm" secondary>{active.length ? `Showing ${active.join(", ").toLowerCase()} tickets` : "Showing all tickets"}</Text>
    </Stack>
  );
}
