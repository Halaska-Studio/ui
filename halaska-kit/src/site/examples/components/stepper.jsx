import { useState } from "react";
import { Button, Stack, Stepper } from "../../kit";

export const usage = `import { Stepper } from "./halaska-kit";

<Stepper steps={["Connect", "Permissions", "Test", "Go live"]} current={1} />`;

// @example Default | Steps before current are done, the current step is ringed.
export function Default() {
  return (
    <div style={{ width: 420 }}>
      <Stepper steps={["Connect", "Permissions", "Test", "Go live"]} current={1} />
    </div>
  );
}

// @example Controlled | Drive current from your own state.
export function Controlled() {
  const steps = ["Connect Intercom", "Set refund cap", "Review drafts", "Go live"];
  const [current, setCurrent] = useState(0);
  return (
    <Stack gap={24} align="center" style={{ width: 460 }}>
      <Stepper steps={steps} current={current} />
      <Stack direction="row" gap={8}>
        <Button variant="ghost" size="sm" disabled={current === 0} onClick={() => setCurrent(current - 1)}>Back</Button>
        <Button size="sm" disabled={current === steps.length - 1} onClick={() => setCurrent(current + 1)}>Continue</Button>
      </Stack>
    </Stack>
  );
}

// @example Not started | With current at 0 only the first step is active.
export function NotStarted() {
  return (
    <div style={{ width: 420 }}>
      <Stepper steps={["Triage", "Draft", "Approve", "Send"]} current={0} />
    </div>
  );
}

// @example Complete | Set current to the number of steps to tick every one.
export function Complete() {
  return (
    <div style={{ width: 420 }}>
      <Stepper steps={["Triage", "Draft", "Approve", "Send"]} current={4} />
    </div>
  );
}
