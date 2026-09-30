import { useState } from "react";
import { TextInput, Stack } from "../../kit";

export const usage = `import { useState } from "react";
import { TextInput } from "./halaska-kit"; // also exported as Input

const [subject, setSubject] = useState("");

<TextInput placeholder="Ticket subject" value={subject} onChange={setSubject} />`;

// @example Default | A single-line field. onChange receives the new string.
export function Default() {
  const [subject, setSubject] = useState("");
  return <TextInput placeholder="Ticket subject" value={subject} onChange={setSubject} style={{ width: 320 }} />;
}

// @example With label and caption | The label sits above the field and the caption below.
export function WithLabel() {
  const [name, setName] = useState("Alpha");
  return (
    <TextInput
      label="Agent name"
      caption="Shown to customers in every reply."
      value={name}
      onChange={setName}
      style={{ width: 320 }}
    />
  );
}

// @example Sizes | Three sizes: sm, md and lg.
export function Sizes() {
  const [sm, setSm] = useState("");
  const [md, setMd] = useState("");
  const [lg, setLg] = useState("");
  return (
    <Stack gap={12} style={{ width: 320 }}>
      <TextInput size="sm" placeholder="Filter tickets" value={sm} onChange={setSm} />
      <TextInput size="md" placeholder="Filter tickets" value={md} onChange={setMd} />
      <TextInput size="lg" placeholder="Filter tickets" value={lg} onChange={setLg} />
    </Stack>
  );
}

// @example With an icon | A leading icon inside the field.
export function WithIcon() {
  const [email, setEmail] = useState("");
  return (
    <TextInput icon="@" type="email" placeholder="priya@northwind.com" value={email} onChange={setEmail} style={{ width: 320 }} />
  );
}

// @example Error | Pass a message to error. It replaces the caption.
export function WithError() {
  const [cap, setCap] = useState("2400");
  const error = Number(cap) > 500 ? "Refund caps cannot go above $500." : "";
  return (
    <TextInput
      label="Refund cap (USD)"
      caption="Alpha asks for approval above this amount."
      value={cap}
      onChange={setCap}
      error={error}
      style={{ width: 320 }}
    />
  );
}

// @example Disabled | Dimmed and not editable.
export function Disabled() {
  return <TextInput label="Workspace" value="Northwind" disabled style={{ width: 320 }} />;
}

// @example Types | The type prop passes through to the native input.
export function Types() {
  const [seats, setSeats] = useState("12");
  const [site, setSite] = useState("");
  return (
    <Stack gap={12} style={{ width: 320 }}>
      <TextInput type="number" label="Seats" value={seats} onChange={setSeats} />
      <TextInput type="url" label="Help centre" placeholder="https://help.northwind.com" value={site} onChange={setSite} />
    </Stack>
  );
}
