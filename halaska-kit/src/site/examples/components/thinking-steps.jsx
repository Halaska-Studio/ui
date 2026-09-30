import { useEffect, useState } from "react";
import { Button, Stack, ThinkingSteps } from "../../kit";

export const usage = `import { ThinkingSteps } from "./halaska-kit";

<ThinkingSteps
  current={1}
  steps={["Reading the ticket", "Checking the Stripe invoice", "Drafting a reply"]}
/>`;

// @example Default | Steps before current are done, current is active, the rest are upcoming.
export function Default() {
  return (
    <ThinkingSteps
      current={1}
      steps={[
        "Reading ticket #4821",
        "Checking the Stripe invoice",
        "Comparing with the refund policy",
        "Drafting a reply",
      ]}
    />
  );
}

// @example Advancing | Drive current from your agent's progress.
export function Advancing() {
  const steps = ["Reading ticket #4821", "Checking the Stripe invoice", "Comparing with the refund policy", "Drafting a reply"];
  const [current, setCurrent] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => setCurrent((c) => (c + 1) % (steps.length + 1)), 1400);
    return () => clearInterval(timer);
  }, [steps.length]);
  return <ThinkingSteps steps={steps} current={current} />;
}

// @example Just started | With current at 0 only the first step is lit.
export function JustStarted() {
  return (
    <ThinkingSteps
      steps={["Searching Intercom for Lumen Labs", "Grouping tickets by issue", "Filing the bug in Linear"]}
    />
  );
}

// @example Complete | Set current to the number of steps to mark them all done.
export function Complete() {
  return (
    <ThinkingSteps
      current={3}
      steps={["Searching Intercom for Lumen Labs", "Grouping tickets by issue", "Filing the bug in Linear"]}
    />
  );
}

// @example Controlled | Step through by hand.
export function Controlled() {
  const steps = ["Open the runbook in Notion", "Find the outage checklist", "Post the status update"];
  const [current, setCurrent] = useState(0);
  return (
    <Stack gap={20} align="flex-start">
      <ThinkingSteps steps={steps} current={current} />
      <Stack direction="row" gap={8}>
        <Button size="sm" variant="outline" onClick={() => setCurrent(Math.max(0, current - 1))}>Back</Button>
        <Button size="sm" onClick={() => setCurrent(Math.min(steps.length, current + 1))}>Next step</Button>
      </Stack>
    </Stack>
  );
}
