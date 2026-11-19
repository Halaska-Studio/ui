import { useState } from "react";
import { Stack, SubtleTabs, Tabs, Text } from "../../kit";

export const usage = `import { Tabs } from "./halaska-kit";

const [tab, setTab] = useState("Open");

<Tabs tabs={["Open", "Pending", "Resolved"]} value={tab} onChange={setTab} />`;

// @example Default | An underlined row. The indicator slides to the active tab.
export function Default() {
  const [tab, setTab] = useState("Open");
  return (
    <div style={{ width: 360 }}>
      <Tabs tabs={["Open", "Pending", "Resolved"]} value={tab} onChange={setTab} />
    </div>
  );
}

// @example With content | Render the panel for the active value yourself.
export function WithContent() {
  const [tab, setTab] = useState("Conversation");
  const panels = {
    Conversation: "Acme asked why the invoice shows the Team plan after downgrading.",
    Activity: "Alpha checked Stripe, found the proration error and drafted a $120 credit.",
    Notes: "Dana Ruiz: approve the credit, then link the Linear issue.",
  };
  return (
    <Stack gap={16} style={{ width: 380 }}>
      <Tabs tabs={["Conversation", "Activity", "Notes"]} value={tab} onChange={setTab} />
      <Text size="sm" secondary>{panels[tab]}</Text>
    </Stack>
  );
}

// @example Subtle tabs | A compact pill group for switching views inside a panel.
export function Subtle() {
  const [range, setRange] = useState("Week");
  return <SubtleTabs tabs={["Day", "Week", "Month"]} value={range} onChange={setRange} />;
}

// @example Subtle tabs with content | The same value and onChange contract as Tabs.
export function SubtleWithContent() {
  const [range, setRange] = useState("Week");
  const resolved = { Day: "38 tickets resolved, 31 by Alpha", Week: "214 tickets resolved, 172 by Alpha", Month: "902 tickets resolved, 701 by Alpha" };
  return (
    <Stack gap={16} align="center">
      <SubtleTabs tabs={["Day", "Week", "Month"]} value={range} onChange={setRange} />
      <Text size="sm" secondary>{resolved[range]}</Text>
    </Stack>
  );
}
