import { Button, Card, EmptyState } from "../../kit";

export const usage = `import { EmptyState } from "./halaska-kit";

<EmptyState
  title="No open tickets"
  description="New conversations from Intercom will show up here."
/>`;

// @example Default | An icon, a title, a description and one action.
export function Default() {
  return (
    <EmptyState
      icon="✉"
      title="No open tickets"
      description="New conversations from Intercom will show up here."
      action={<Button size="sm">Connect Intercom</Button>}
    />
  );
}

// @example Without an action | When there is nothing for the person to do.
export function WithoutAction() {
  return (
    <EmptyState
      icon="✓"
      title="Inbox cleared"
      description="Alpha resolved the last ticket 4 minutes ago."
    />
  );
}

// @example Text only | Title and description with no icon.
export function TextOnly() {
  return (
    <EmptyState
      title="No refunds this week"
      description="Refunds that Alpha sends through Stripe are listed here."
    />
  );
}

// @example No results | After a search or filter that matches nothing.
export function NoResults() {
  return (
    <EmptyState
      icon="⌕"
      title="No tickets match Cobalt Dental"
      description="Try a different customer name or clear the filters."
      action={<Button size="sm" variant="outline">Clear filters</Button>}
    />
  );
}

// @example In a card | Inside the surface that would hold the content.
export function InACard() {
  return (
    <Card padding={0} style={{ width: 360 }}>
      <EmptyState
        title="No runbooks yet"
        description="Add a Notion page and Alpha will follow it."
        action={<Button size="sm" variant="secondary">Add runbook</Button>}
      />
    </Card>
  );
}
