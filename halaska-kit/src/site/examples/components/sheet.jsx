import { useState } from "react";
import { Badge, Button, Sheet, Stack, Text, TextInput } from "../../kit";

export const usage = `import { Button, Sheet } from "./halaska-kit";

const [open, setOpen] = useState(false);

<Button onClick={() => setOpen(true)}>Open ticket</Button>
<Sheet open={open} onClose={() => setOpen(false)} title="Ticket #4821">
  Acme was billed for the Team plan after downgrading.
</Sheet>`;

// @example Default | Slides in from the right with a title and a close button.
export function Default() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="outline" onClick={() => setOpen(true)}>Open ticket</Button>
      <Sheet open={open} onClose={() => setOpen(false)} title="Ticket #4821">
        Acme was billed for the Team plan after downgrading to Starter. Alpha drafted a reply and a $120 credit.
      </Sheet>
    </>
  );
}

// @example Left side | Set side to left for navigation and filters.
export function LeftSide() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="outline" onClick={() => setOpen(true)}>Show inboxes</Button>
      <Sheet open={open} onClose={() => setOpen(false)} title="Inboxes" side="left">
        <Stack gap={12}>
          <Stack direction="row" justify="space-between" align="center">
            <Text>Support</Text>
            <Badge>18</Badge>
          </Stack>
          <Stack direction="row" justify="space-between" align="center">
            <Text>Billing</Text>
            <Badge>6</Badge>
          </Stack>
          <Stack direction="row" justify="space-between" align="center">
            <Text>Escalations</Text>
            <Badge variant="warning">2</Badge>
          </Stack>
        </Stack>
      </Sheet>
    </>
  );
}

// @example With a form | Edit a record beside the page it belongs to.
export function WithForm() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("Cobalt Dental");
  const [contact, setContact] = useState("Priya Nair");
  return (
    <>
      <Button onClick={() => setOpen(true)}>Edit customer</Button>
      <Sheet open={open} onClose={() => setOpen(false)} title="Edit customer">
        <Stack gap={16}>
          <TextInput label="Customer" value={name} onChange={setName} />
          <TextInput label="Account owner" value={contact} onChange={setContact} />
          <Button fullWidth onClick={() => setOpen(false)}>Save changes</Button>
        </Stack>
      </Sheet>
    </>
  );
}
