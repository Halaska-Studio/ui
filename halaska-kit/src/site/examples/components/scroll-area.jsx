import { ListItem, ScrollArea, Text } from "../../kit";

export const usage = `import { ScrollArea } from "./halaska-kit";

<ScrollArea maxHeight={200}>
  <ActivityLog />
</ScrollArea>`;

// @example Default | Content taller than 200px scrolls inside the area.
export function Default() {
  const customers = ["Acme", "Lumen Labs", "Fjord Health", "Brightline", "Cobalt Dental", "Acme (sandbox)", "Lumen Labs (EU)"];
  return (
    <div style={{ width: 320 }}>
      <ScrollArea>
        {customers.map((customer) => (
          <ListItem key={customer} title={customer} />
        ))}
      </ScrollArea>
    </div>
  );
}

// @example Custom height | Set maxHeight to fit the space you have.
export function CustomHeight() {
  const events = [
    { time: "09:02", text: "Alpha tagged #4821 as billing" },
    { time: "09:03", text: "Alpha read the Stripe invoice for Acme" },
    { time: "09:04", text: "Alpha drafted a $120 credit" },
    { time: "09:10", text: "Dana Ruiz approved the credit" },
    { time: "09:11", text: "Alpha replied in Intercom" },
    { time: "09:30", text: "Acme confirmed the fix" },
  ];
  return (
    <div style={{ width: 360 }}>
      <ScrollArea maxHeight={120}>
        {events.map((event) => (
          <ListItem key={event.time} title={event.text} right={<Text size="sm" mono muted>{event.time}</Text>} />
        ))}
      </ScrollArea>
    </div>
  );
}

// @example Long text | Works for prose as well as lists.
export function LongText() {
  return (
    <div style={{ width: 360 }}>
      <ScrollArea maxHeight={140}>
        <Text size="sm" secondary as="p" style={{ margin: 0 }}>
          Refund runbook. Check the Stripe subscription before anything else. If the customer was charged for a plan
          they had already left, credit the difference. Credits up to $100 can go out straight away. Anything larger
          waits for Priya Nair. Always reply in the original Intercom conversation, and link the Linear issue if the
          cause is a bug. Close the ticket only after the customer confirms the invoice looks right. If they do not
          reply within three days, send one reminder and then mark the ticket as resolved.
        </Text>
      </ScrollArea>
    </div>
  );
}
