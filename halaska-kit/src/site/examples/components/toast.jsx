import { useEffect, useState } from "react";
import { Button, Stack, Toast } from "../../kit";

export const usage = `import { Toast } from "./halaska-kit";

<Toast message="Reply sent to Acme" />`;

// @example Default | A short neutral message.
export function Default() {
  return <Toast message="Reply sent to Acme" />;
}

// @example Variants | Success, warning and danger tint the pill and the text.
export function Variants() {
  return (
    <Stack gap={12} align="center">
      <Toast message="Draft saved" />
      <Toast variant="success" message="Refund of $120 sent" />
      <Toast variant="warning" message="Refund cap almost reached" />
      <Toast variant="danger" message="Linear sync failed" />
    </Stack>
  );
}

// @example With an icon | An icon before the message, in the variant's colour.
export function WithIcon() {
  return (
    <Stack gap={12} align="center">
      <Toast icon="✓" variant="success" message="Ticket #4821 resolved" />
      <Toast icon="⚠" variant="warning" message="Stripe is responding slowly" />
      <Toast icon="✕" variant="danger" message="Could not reach Notion" />
    </Stack>
  );
}

// @example Shown on an action | Toast is a static element, so you decide when it shows and for how long.
export function ShownOnAction() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!visible) return;
    const timer = setTimeout(() => setVisible(false), 2400);
    return () => clearTimeout(timer);
  }, [visible]);

  return (
    <Stack gap={16} align="center" style={{ minHeight: 100 }}>
      <Button onClick={() => setVisible(true)}>Assign to Alpha</Button>
      {visible && <Toast icon="✓" variant="success" message="Ticket #4821 assigned to Alpha" />}
    </Stack>
  );
}
