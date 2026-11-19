import { useState } from "react";
import { RadioGroup, Radio, Stack, Text } from "../../kit";

export const usage = `import { useState } from "react";
import { RadioGroup } from "./halaska-kit";

const [mode, setMode] = useState("Suggest");

<RadioGroup
  label="Autonomy"
  options={["Observe", "Suggest", "Act"]}
  value={mode}
  onChange={setMode}
/>`;

// @example Default | One choice from a short list of strings.
export function Default() {
  const [mode, setMode] = useState("Suggest");
  return <RadioGroup options={["Observe", "Suggest", "Act"]} value={mode} onChange={setMode} />;
}

// @example With a label | The label names the whole group.
export function WithLabel() {
  const [priority, setPriority] = useState("Normal");
  return <RadioGroup label="Default priority" options={["Low", "Normal", "Urgent"]} value={priority} onChange={setPriority} />;
}

// @example Value and label pairs | Keep a short value in state and show a longer label.
export function ValueLabelPairs() {
  const [approval, setApproval] = useState("over-cap");
  return (
    <RadioGroup
      label="Refund approval"
      value={approval}
      onChange={setApproval}
      options={[
        { value: "always", label: "Ask before every refund" },
        { value: "over-cap", label: "Ask only above the $200 cap" },
        { value: "never", label: "Never ask" },
      ]}
    />
  );
}

// @example No selection | Nothing is selected until the value matches an option.
export function NoSelection() {
  const [owner, setOwner] = useState(null);
  return <RadioGroup label="Assign ticket #4821 to" options={["Sam Keller", "Dana Ruiz", "Priya Nair"]} value={owner} onChange={setOwner} />;
}

// @example Single radios | Use Radio directly for a custom layout or a disabled option.
export function SingleRadios() {
  const [channel, setChannel] = useState("email");
  return (
    <Stack direction="row" gap={24} align="center">
      <Radio label="Email" checked={channel === "email"} onChange={() => setChannel("email")} />
      <Radio label="Chat" checked={channel === "chat"} onChange={() => setChannel("chat")} />
      <Radio label="Phone" checked={false} disabled />
    </Stack>
  );
}

// @example Controlled | The selected value drives other content.
export function Controlled() {
  const notes = {
    Observe: "Alpha reads tickets and takes no action.",
    Suggest: "Alpha drafts replies for you to send.",
    Act: "Alpha replies and refunds within its caps.",
  };
  const [mode, setMode] = useState("Observe");
  return (
    <Stack gap={16} style={{ width: 280 }}>
      <RadioGroup options={["Observe", "Suggest", "Act"]} value={mode} onChange={setMode} />
      <Text size="sm" secondary>{notes[mode]}</Text>
    </Stack>
  );
}
