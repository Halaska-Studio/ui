import { useState } from "react";
import { Label, TextInput, SwitchToggle, Stack } from "../../kit";

export const usage = `import { Label } from "./halaska-kit";

<Label>Workspace name</Label>`;

// @example Default | A small, medium-weight label for a form control.
export function Default() {
  return <Label>Workspace name</Label>;
}

// @example Required | Adds a red asterisk after the text.
export function Required() {
  return <Label required>Billing email</Label>;
}

// @example With a control | Stack the label above the control with a 4px gap.
export function WithControl() {
  const [email, setEmail] = useState("");
  return (
    <Stack gap={4} style={{ width: 300 }}>
      <Label required>Billing email</Label>
      <TextInput type="email" placeholder="accounts@northwind.com" value={email} onChange={setEmail} />
    </Stack>
  );
}

// @example As a section label | Names a group of related controls.
export function SectionLabel() {
  const [escalations, setEscalations] = useState(true);
  const [digest, setDigest] = useState(false);
  return (
    <Stack gap={12}>
      <Label>Notifications</Label>
      <SwitchToggle checked={escalations} onChange={setEscalations} label="Escalations" />
      <SwitchToggle checked={digest} onChange={setDigest} label="Weekly digest" />
    </Stack>
  );
}

// @example Custom style | The style prop overrides colour and spacing.
export function CustomStyle() {
  return <Label style={{ textTransform: "uppercase", letterSpacing: "0.06em", fontSize: 11 }}>Connected tools</Label>;
}
