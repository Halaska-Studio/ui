import { ReasoningSteps } from "../../kit";

export const usage = `import { ReasoningSteps } from "./halaska-kit";

<ReasoningSteps
  steps={[
    { id: "1", kind: "search", label: "Searched Stripe for charges on 14 October", durationMs: 1300 },
    { id: "2", kind: "read",   label: "Read the refunds runbook", durationMs: 900 },
    { id: "3", kind: "write",  label: "Drafted three replies", durationMs: 800 },
  ]}
  onDone={(seconds) => log(seconds)}
/>`;

// @example Default | Five steps stream in with a live timer, then fold to one line.
export function Default() {
  return <ReasoningSteps />;
}

// @example Finished and folded | No timers. The summary line, closed, as it looks in a transcript.
export function Finished() {
  return <ReasoningSteps autoplay={false} summaryLabel="Thought for 5 seconds" />;
}

// @example Finished and open | The same trace with the steps left visible.
export function FinishedOpen() {
  return (
    <ReasoningSteps
      autoplay={false}
      collapsed={false}
      summaryLabel="Checked 3 accounts in 4 seconds"
      steps={[
        { id: "a", kind: "thought", label: "Fjord Health's renewal is in 12 days",                durationMs: 500 },
        { id: "b", kind: "search",  label: "Searched Intercom for open threads",                   detail: "2 open, both about SSO", durationMs: 1200 },
        { id: "c", kind: "tool",    label: "Pulled their plan and seats from Stripe",              detail: "Team · 48 seats", durationMs: 900 },
        { id: "d", kind: "write",   label: "Drafted a renewal note for Priya Nair",                durationMs: 1400 },
      ]}
    />
  );
}

// @example Custom summary | summaryLabel can be a function of the total seconds.
export function CustomSummary() {
  return (
    <ReasoningSteps
      stepMs={600}
      runningLabel="Looking into it"
      summaryLabel={(s) => `Worked for ${s.toFixed(1)}s across 3 tools`}
      steps={[
        { id: "a", kind: "search", label: "Searched Linear for open billing bugs", detail: "4 issues" },
        { id: "b", kind: "read",   label: "Read the two most recent" },
        { id: "c", kind: "tool",   label: "Checked Stripe for related charges", detail: "None since the fix" },
        { id: "d", kind: "thought", label: "The fix shipped. This is a stale report." },
      ]}
    />
  );
}
