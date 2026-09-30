import { useState } from "react";
import { InputOTP, Label, Button, Stack, Text } from "../../kit";

export const usage = `import { useState } from "react";
import { InputOTP } from "./halaska-kit";

const [code, setCode] = useState("");

<InputOTP value={code} onChange={setCode} />`;

// @example Default | Six boxes. Focus moves forward as each one fills.
export function Default() {
  const [code, setCode] = useState("");
  return <InputOTP value={code} onChange={setCode} />;
}

// @example Length | Set the number of boxes with length.
export function Length() {
  const [pin, setPin] = useState("");
  return <InputOTP length={4} value={pin} onChange={setPin} />;
}

// @example Complete | Every box takes the focus border once the code is full.
export function Complete() {
  const [code, setCode] = useState("482106");
  return <InputOTP value={code} onChange={setCode} />;
}

// @example With a label | The boxes have no labels of their own, so put one above the row.
export function WithLabel() {
  const [code, setCode] = useState("");
  return (
    <Stack gap={8}>
      <Label>Code from your authenticator app</Label>
      <InputOTP value={code} onChange={setCode} />
    </Stack>
  );
}

// @example Verify | Enable the action once the value reaches the full length.
export function Verify() {
  const [code, setCode] = useState("");
  const [verified, setVerified] = useState(false);
  const change = (next) => { setCode(next); setVerified(false); };
  return (
    <Stack gap={16} align="center">
      <InputOTP value={code} onChange={change} />
      <Button disabled={code.length < 6} onClick={() => setVerified(true)}>Connect Stripe</Button>
      <Text size="sm" secondary>{verified ? "Stripe connected" : "Enter the six-character code Stripe sent to Sam Keller"}</Text>
    </Stack>
  );
}
