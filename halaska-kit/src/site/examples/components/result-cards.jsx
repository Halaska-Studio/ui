import { useState } from "react";
import { ResultCards, Text } from "../../kit";

export const usage = `import { ResultCards } from "./halaska-kit";

<ResultCards
  intro="Four support tools fit Northwind's stack."
  items={[
    { id: "helpdesk", title: "Helpdesk Pro", subtitle: "Shared inbox with routing rules.", meta: "$49 per seat", badge: "Best fit" },
    { id: "replyboard", title: "Replyboard", subtitle: "Light inbox with a strong Linear sync.", meta: "$29 per seat" },
  ]}
  onSelect={(item) => console.log(item.id)}
/>`;

// @example Row | The default: Alpha's sentence, then a horizontal row with snap points.
export function Row() {
  return <ResultCards />;
}

// @example Grid | layout="grid" wraps the cards into columns; narrow frames collapse to one.
export function Grid() {
  return (
    <ResultCards
      layout="grid"
      columns={2}
      intro="Two tools handle refunds inside the thread."
      items={[
        { id: "tidewater", title: "Tidewater", subtitle: "Ticketing with a Stripe refund panel built in.", meta: "$39 per seat", badge: "Refunds" },
        { id: "helpdesk", title: "Helpdesk Pro", subtitle: "Shared inbox with routing rules and SLA timers.", meta: "$49 per seat" },
      ]}
    />
  );
}

// @example People | The same shape carries people: meta becomes a role, the action a verb.
export function People() {
  return (
    <ResultCards
      intro="Three people can approve a refund over $100."
      actionLabel="Assign"
      selectedLabel="Assigned"
      items={[
        { id: "priya", title: "Priya Nair", subtitle: "Owns billing. Approves most large refunds.", meta: "Finance" },
        { id: "dana", title: "Dana Ruiz", subtitle: "Backup approver when Priya is out.", meta: "Support lead" },
        { id: "sam", title: "Sam Keller", subtitle: "Founder. Last resort for contract accounts.", meta: "Founder" },
      ]}
    />
  );
}

// @example Documents with links | An href turns the title into a link that opens in a new tab.
export function Documents() {
  return (
    <ResultCards
      intro="Two runbooks cover this case."
      actionLabel="Use"
      items={[
        { id: "refund", title: "Refund policy", subtitle: "Caps, approvers and the Stripe steps.", meta: "Notion · updated Mar", href: "https://example.com/refund-policy" },
        { id: "escalate", title: "Escalation policy", subtitle: "Who hears about tickets older than four hours.", meta: "Notion · updated Jan", href: "https://example.com/escalation" },
      ]}
    />
  );
}

// @example Selection callback | onSelect receives the item; the chosen card stays marked.
export function SelectionCallback() {
  const [picked, setPicked] = useState(null);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <ResultCards intro="Pick the tool to trial for two weeks." onSelect={(item) => setPicked(item)} />
      <Text size="sm" secondary>{picked ? `Trialing ${picked.title} at ${picked.meta}.` : "Nothing chosen yet."}</Text>
    </div>
  );
}
