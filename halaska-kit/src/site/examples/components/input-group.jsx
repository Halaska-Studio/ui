import { useState } from "react";
import { InputGroup, Stack } from "../../kit";

export const usage = `import { useState } from "react";
import { InputGroup } from "./halaska-kit";

const [cap, setCap] = useState("200");

<InputGroup prefix="$" suffix="USD" value={cap} onChange={setCap} />`;

// @example Default | A prefix and a suffix around one field.
export function Default() {
  const [cap, setCap] = useState("200");
  return (
    <div style={{ width: 280 }}>
      <InputGroup prefix="$" suffix="USD" value={cap} onChange={setCap} />
    </div>
  );
}

// @example Prefix | Fixed text before the value, such as a protocol or a currency sign.
export function Prefix() {
  const [site, setSite] = useState("");
  return (
    <div style={{ width: 320 }}>
      <InputGroup prefix="https://" placeholder="help.northwind.com" value={site} onChange={setSite} />
    </div>
  );
}

// @example Suffix | Fixed text after the value, such as a unit or a domain.
export function Suffix() {
  const [handle, setHandle] = useState("support");
  return (
    <div style={{ width: 320 }}>
      <InputGroup suffix="@northwind.com" value={handle} onChange={setHandle} />
    </div>
  );
}

// @example With a label | The label sits above the group.
export function WithLabel() {
  const [hours, setHours] = useState("4");
  return (
    <div style={{ width: 280 }}>
      <InputGroup label="First response target" suffix="hours" value={hours} onChange={setHours} />
    </div>
  );
}

// @example In a form | Groups line up with each other when they share a width.
export function InForm() {
  const [credit, setCredit] = useState("50");
  const [discount, setDiscount] = useState("10");
  return (
    <Stack gap={16} style={{ width: 280 }}>
      <InputGroup label="Credit cap" prefix="$" value={credit} onChange={setCredit} />
      <InputGroup label="Renewal discount" suffix="%" value={discount} onChange={setDiscount} />
    </Stack>
  );
}
