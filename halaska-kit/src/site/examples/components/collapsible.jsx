import { Collapsible, Stack, Text } from "../../kit";

export const usage = `import { Collapsible, Text } from "./halaska-kit";

<Collapsible title="Steps Alpha took">
  <Text size="sm">Checked the Stripe subscription.</Text>
</Collapsible>`;

// @example Default | Starts closed. The chevron turns when it opens.
export function Default() {
  return (
    <div style={{ width: 360 }}>
      <Collapsible title="Steps Alpha took">
        <Text size="sm" secondary>Checked the Stripe subscription, compared it with the invoice and drafted a credit.</Text>
      </Collapsible>
    </div>
  );
}

// @example Open by default | Set defaultOpen when the content matters on first view.
export function OpenByDefault() {
  return (
    <div style={{ width: 360 }}>
      <Collapsible title="Why this needs approval" defaultOpen>
        <Text size="sm" secondary>The $240 refund for Lumen Labs is over the $100 cap.</Text>
      </Collapsible>
    </div>
  );
}

// @example With a list | Any content can sit inside.
export function WithList() {
  return (
    <div style={{ width: 360 }}>
      <Collapsible title="3 sources used" defaultOpen>
        <Stack gap={8}>
          <Text size="sm" secondary>Notion: Refund runbook</Text>
          <Text size="sm" secondary>Stripe: Invoice for Acme, September</Text>
          <Text size="sm" secondary>Intercom: Conversation #4821</Text>
        </Stack>
      </Collapsible>
    </div>
  );
}
