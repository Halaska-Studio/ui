import { useState } from "react";
import { TraceWaterfall, Stack, Text } from "../../kit";

export const usage = `import { TraceWaterfall } from "./halaska-kit";

<TraceWaterfall
  spans={[
    { id: "plan",    name: "Plan the sweep",      kind: "model", startMs: 0,    endMs: 1600, tokens: 1180, costUsd: 0.0059, model: "alpha-4" },
    { id: "charges", name: "stripe.charges.list", kind: "tool",  startMs: 1650, endMs: 2400 },
    { id: "issue",   name: "linear.issues.create", kind: "failed", startMs: 2450, endMs: 3000 },
  ]}
  onSelect={(span) => inspect(span)}
/>`;

// @example Default | A refund sweep: three model calls, four tool calls, a wait for approval, a handoff and one failure.
export function Default() {
  return <TraceWaterfall />;
}

// @example Flat | No nesting. A short run with a single tool call.
export function Flat() {
  return (
    <TraceWaterfall
      title="Reply to Sam Keller · run 9c01"
      spans={[
        { id: "read",  name: "Read the thread",        kind: "model", startMs: 0,    endMs: 900,  tokens: 640, costUsd: 0.0032, model: "alpha-4" },
        { id: "look",  name: "notion.pages.search",    kind: "tool",  startMs: 950,  endMs: 1500 },
        { id: "write", name: "Draft the reply",        kind: "model", startMs: 1550, endMs: 2800, tokens: 1210, costUsd: 0.0061, model: "alpha-4" },
      ]}
    />
  );
}

// @example With selection | onSelect fires with the span. Here the last one picked is echoed under the chart.
export function WithSelection() {
  const [picked, setPicked] = useState(null);
  return (
    <Stack gap={12}>
      <TraceWaterfall onSelect={setPicked} />
      <Text size="xs" secondary mono>{picked ? `${picked.id} · ${picked.kind}` : "Nothing selected"}</Text>
    </Stack>
  );
}

// @example Overridden totals | Pass totals when the run's numbers live elsewhere, for example a cached cost.
export function OverriddenTotals() {
  return (
    <TraceWaterfall
      title="Weekly digest · run 1e77"
      totals={{ costUsd: 0.31, tokens: 48200, llmCalls: 12 }}
      spans={[
        { id: "pull",  name: "Pull last week's tickets", kind: "tool",  startMs: 0,    endMs: 2200 },
        { id: "rank",  name: "Rank accounts",            kind: "model", startMs: 2250, endMs: 5400, tokens: 3900, costUsd: 0.021, model: "alpha-4" },
        { id: "wait",  name: "Rate limit",               kind: "wait",  startMs: 5400, endMs: 7100 },
        { id: "write", name: "Write the digest",         kind: "model", startMs: 7150, endMs: 11800, tokens: 5100, costUsd: 0.028, model: "alpha-4" },
      ]}
    />
  );
}

// @example Narrow | In a 320px column the name column shrinks and the duration column goes.
export function Narrow() {
  return (
    <div style={{ width: 320, maxWidth: "100%" }}>
      <TraceWaterfall />
    </div>
  );
}
