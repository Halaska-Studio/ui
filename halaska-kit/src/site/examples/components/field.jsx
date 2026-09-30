import { useState } from "react";
import { TextInput, TextArea, Select, Label, Caption, SwitchToggle, Stack } from "../../kit";

export const usage = `import { TextInput } from "./halaska-kit";

<TextInput
  label="Reply-to address"
  caption="Customers see this on every reply."
  value={email}
  onChange={setEmail}
  error={emailError}
/>`;

// @example Default | TextInput carries its own label and caption, so no wrapper is needed.
export function Default() {
  const [email, setEmail] = useState("support@northwind.com");
  return (
    <TextInput
      label="Reply-to address"
      caption="Customers see this on every reply."
      value={email}
      onChange={setEmail}
      style={{ width: 320 }}
    />
  );
}

// @example Error | The error message replaces the caption and the border turns red.
export function WithError() {
  const [email, setEmail] = useState("support@northwind");
  const error = /^\S+@\S+\.\S+$/.test(email) ? "" : "Enter a full email address.";
  return (
    <TextInput
      label="Reply-to address"
      caption="Customers see this on every reply."
      value={email}
      onChange={setEmail}
      error={error}
      style={{ width: 320 }}
    />
  );
}

// @example Text area and select | TextArea takes a label and caption. Select takes a label.
export function OtherControls() {
  const [tone, setTone] = useState("Friendly");
  const [signature, setSignature] = useState("Sam Keller\nNorthwind support");
  return (
    <Stack gap={16} style={{ width: 320, height: 330 }}>
      <Select label="Reply tone" value={tone} onChange={setTone} options={["Friendly", "Neutral", "Formal"]} />
      <TextArea label="Signature" caption="Added to the end of every reply." value={signature} onChange={setSignature} rows={2} />
    </Stack>
  );
}

// @example Required | Compose Label with the required marker, then leave the control's own label off.
export function Required() {
  const [name, setName] = useState("");
  return (
    <Stack gap={4} style={{ width: 320 }}>
      <Label required>Workspace name</Label>
      <TextInput placeholder="Northwind" value={name} onChange={setName} />
    </Stack>
  );
}

// @example Custom field | Label and Caption build the same layout around a control that has no caption of its own.
export function CustomField() {
  const [autoClose, setAutoClose] = useState(true);
  return (
    <Stack gap={8} style={{ width: 320 }}>
      <Label>Resolved tickets</Label>
      <SwitchToggle checked={autoClose} onChange={setAutoClose} label="Close after three days" />
      <Caption>Alpha reopens the ticket if the customer replies.</Caption>
    </Stack>
  );
}

// @example Form | Fields stack with a 16px gap.
export function Form() {
  const [name, setName] = useState("Dana Ruiz");
  const [role, setRole] = useState("Admin");
  const [note, setNote] = useState("");
  return (
    <Stack gap={16} style={{ width: 320, height: 380 }}>
      <TextInput label="Name" value={name} onChange={setName} />
      <Select label="Role" value={role} onChange={setRole} options={["Admin", "Agent", "Viewer"]} />
      <TextArea label="Note for the team" placeholder="Covers billing on Fridays" value={note} onChange={setNote} rows={2} />
    </Stack>
  );
}
