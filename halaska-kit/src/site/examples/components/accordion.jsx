import { Accordion, Badge, Stack, Text } from "../../kit";

export const usage = `import { Accordion } from "./halaska-kit";

<Accordion
  items={[
    { title: "What can Alpha do on its own?", content: "Triage, tag and draft replies." },
    { title: "When does it ask first?", content: "Before any refund over $100." },
  ]}
/>`;

// @example Default | All sections start closed. Opening one closes the other.
export function Default() {
  return (
    <div style={{ width: 380 }}>
      <Accordion
        items={[
          { title: "What can Alpha do on its own?", content: "Triage new conversations, tag them and draft replies for review." },
          { title: "When does it ask first?", content: "Before any refund over $100 and before closing a ticket." },
          { title: "Which tools does it use?", content: "Intercom, Linear, Stripe and Notion." },
        ]}
      />
    </div>
  );
}

// @example Open by default | defaultOpen takes the index of the section to start open.
export function OpenByDefault() {
  return (
    <div style={{ width: 380 }}>
      <Accordion
        defaultOpen={0}
        items={[
          { title: "Refund policy", content: "Refunds up to $100 are automatic. Larger refunds go to Priya Nair." },
          { title: "Escalation policy", content: "Tickets open for more than four hours go to Dana Ruiz." },
        ]}
      />
    </div>
  );
}

// @example Rich content | Titles and content accept any node.
export function RichContent() {
  return (
    <div style={{ width: 380 }}>
      <Accordion
        defaultOpen={0}
        items={[
          {
            title: "Stripe",
            content: (
              <Stack direction="row" gap={8} align="center">
                <Badge variant="success">Connected</Badge>
                <Text size="sm" secondary>Refunds and credits, capped at $100</Text>
              </Stack>
            ),
          },
          {
            title: "Linear",
            content: (
              <Stack direction="row" gap={8} align="center">
                <Badge variant="warning">Read only</Badge>
                <Text size="sm" secondary>Alpha can link issues but not create them</Text>
              </Stack>
            ),
          },
        ]}
      />
    </div>
  );
}
