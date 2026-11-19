import { useState } from "react";
import { AlertDialog, Button, Stack, Text } from "../../kit";

export const usage = `import { AlertDialog, Button } from "./halaska-kit";

const [open, setOpen] = useState(false);

<Button variant="danger" onClick={() => setOpen(true)}>Close ticket</Button>
<AlertDialog
  open={open}
  onClose={() => setOpen(false)}
  title="Close ticket #4821?"
  description="Acme will be told the issue is resolved."
  confirmLabel="Close ticket"
  onConfirm={closeTicket}
/>`;

// @example Default | The danger variant, for actions that cannot be undone.
export function Default() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="danger" onClick={() => setOpen(true)}>Close ticket</Button>
      <AlertDialog
        open={open}
        onClose={() => setOpen(false)}
        title="Close ticket #4821?"
        description="Acme will be told the issue is resolved. Reopening starts a new thread."
        confirmLabel="Close ticket"
      />
    </>
  );
}

// @example Warning | For actions that are reversible but worth a second look.
export function Warning() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="outline" onClick={() => setOpen(true)}>Pause Alpha</Button>
      <AlertDialog
        open={open}
        onClose={() => setOpen(false)}
        variant="warning"
        title="Pause Alpha on the support inbox?"
        description="New Intercom conversations will wait for a person until you resume."
        confirmLabel="Pause"
      />
    </>
  );
}

// @example Info | A neutral confirmation with the accent colour.
export function Info() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="secondary" onClick={() => setOpen(true)}>Sync Linear</Button>
      <AlertDialog
        open={open}
        onClose={() => setOpen(false)}
        variant="info"
        title="Sync 14 issues from Linear?"
        description="Alpha will link each issue to its matching ticket. Nothing is changed in Linear."
        confirmLabel="Sync issues"
        cancelLabel="Not now"
      />
    </>
  );
}

// @example Handling the result | onConfirm runs before the dialog closes. Cancel and the scrim only call onClose.
export function HandlingResult() {
  const [open, setOpen] = useState(false);
  const [refunded, setRefunded] = useState(false);
  return (
    <Stack gap={12} align="center">
      <Button variant="danger" disabled={refunded} onClick={() => setOpen(true)}>Refund $240</Button>
      <Text size="sm" secondary>{refunded ? "Refund sent to Lumen Labs through Stripe." : "No refund issued yet."}</Text>
      <AlertDialog
        open={open}
        onClose={() => setOpen(false)}
        title="Refund $240 to Lumen Labs?"
        description="The refund goes to the card on file in Stripe and cannot be reversed."
        confirmLabel="Send refund"
        onConfirm={() => setRefunded(true)}
      />
    </Stack>
  );
}
