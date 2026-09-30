import { useState } from "react";
import { SwitchToggle, SpringToggle, Stack, Text } from "../../kit";

export const usage = `import { useState } from "react";
import { SwitchToggle } from "./halaska-kit"; // also exported as Switch

const [autoReply, setAutoReply] = useState(true);

<SwitchToggle checked={autoReply} onChange={setAutoReply} label="Auto-reply to routine tickets" />`;

// @example Default | A setting that takes effect at once.
export function Default() {
  const [autoReply, setAutoReply] = useState(true);
  return <SwitchToggle checked={autoReply} onChange={setAutoReply} label="Auto-reply to routine tickets" />;
}

// @example Off and on | The thumb slides across with a spring curve.
export function States() {
  const [refunds, setRefunds] = useState(false);
  const [drafts, setDrafts] = useState(true);
  return (
    <Stack gap={12}>
      <SwitchToggle checked={refunds} onChange={setRefunds} label="Issue refunds without approval" />
      <SwitchToggle checked={drafts} onChange={setDrafts} label="Draft replies in Intercom" />
    </Stack>
  );
}

// @example Without a label | For rows where nearby text already names the setting.
export function WithoutLabel() {
  const [connected, setConnected] = useState(true);
  return (
    <Stack direction="row" gap={32} align="center" justify="space-between" style={{ width: 280 }}>
      <Stack gap={0}>
        <Text weight="medium">Linear</Text>
        <Text size="sm" secondary>Create issues from bug reports</Text>
      </Stack>
      <SwitchToggle checked={connected} onChange={setConnected} />
    </Stack>
  );
}

// @example Spring | SpringToggle stretches its thumb while pressed.
export function Spring() {
  const [digest, setDigest] = useState(true);
  return <SpringToggle checked={digest} onChange={setDigest} label="Weekly digest" />;
}

// @example Controlled | The value drives other content.
export function Controlled() {
  const [paused, setPaused] = useState(false);
  return (
    <Stack gap={12}>
      <SwitchToggle checked={paused} onChange={setPaused} label="Pause Alpha" />
      <Text size="sm" secondary>{paused ? "Alpha is paused. New tickets wait in the inbox." : "Alpha is working through the inbox."}</Text>
    </Stack>
  );
}
