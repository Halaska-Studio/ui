import { useState } from "react";
import { Button, CardDialog, Dialog, FormDialog, Select, Stack, Text, TextInput } from "../../kit";

export const usage = `import { Button, Dialog } from "./halaska-kit";

const [open, setOpen] = useState(false);

<Button onClick={() => setOpen(true)}>View summary</Button>
<Dialog open={open} onClose={() => setOpen(false)} title="Ticket summary">
  Acme was billed for the Team plan after downgrading.
</Dialog>`;

// @example Default | A title, body content and a Cancel and Confirm footer.
export function Default() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>View summary</Button>
      <Dialog open={open} onClose={() => setOpen(false)} title="Ticket #4821 summary">
        Acme was billed for the Team plan after downgrading to Starter. Alpha drafted a reply and a $120 credit for approval.
      </Dialog>
    </>
  );
}

// @example Form dialog | Children sit in a form. Submitting calls onSubmit, then closes.
export function Form() {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("Invoice shows the wrong plan");
  const [team, setTeam] = useState("Billing");
  const [created, setCreated] = useState(false);
  return (
    <Stack gap={12} align="center">
      <Button variant="outline" onClick={() => setOpen(true)}>Create Linear issue</Button>
      <Text size="sm" secondary>{created ? `Issue created for ${team}.` : "No issue linked."}</Text>
      <FormDialog
        open={open}
        onClose={() => setOpen(false)}
        title="Create Linear issue"
        description="Linked to ticket #4821 from Acme."
        submitLabel="Create issue"
        onSubmit={() => setCreated(true)}
      >
        <TextInput label="Title" value={title} onChange={setTitle} />
        <Select label="Team" value={team} onChange={setTeam} options={["Billing", "Platform", "Support"]} />
      </FormDialog>
    </Stack>
  );
}

// @example Card dialog | A cover area on top and your own action buttons below.
export function CardWithCover() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="accent" onClick={() => setOpen(true)}>Meet Alpha</Button>
      <CardDialog
        open={open}
        onClose={() => setOpen(false)}
        cover="✦"
        title="Alpha is ready for the support inbox"
        description="It will triage new Intercom conversations and draft replies for your approval."
        actions={
          <>
            <Button variant="ghost" size="sm" onClick={() => setOpen(false)}>Later</Button>
            <Button size="sm" onClick={() => setOpen(false)}>Turn on</Button>
          </>
        }
      />
    </>
  );
}

// @example Card dialog without a cover | Leave out cover for a plain dialog with custom actions.
export function CardWithoutCover() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="secondary" onClick={() => setOpen(true)}>Review handoff</Button>
      <CardDialog
        open={open}
        onClose={() => setOpen(false)}
        title="Hand ticket #4822 to Sam Keller"
        description="Alpha could not reproduce the export issue for Fjord Health."
        actions={
          <>
            <Button variant="ghost" size="sm" onClick={() => setOpen(false)}>Keep with Alpha</Button>
            <Button size="sm" onClick={() => setOpen(false)}>Hand off</Button>
          </>
        }
      >
        <Text size="sm" secondary>Sam will get the conversation, the logs and the three steps Alpha tried.</Text>
      </CardDialog>
    </>
  );
}
