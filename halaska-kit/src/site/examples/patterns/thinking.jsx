import { ThinkingTracePattern } from "../../kit";

const STEPS = [
  { label: "Reading ticket #4821", detail: "Intercom · Cobalt Dental" },
  { label: "Checking the changelog", detail: "v2.14 · reminder delivery" },
  { label: "Finding the runbook", detail: "Notion · migrated schedules" },
  { label: "Drafting a reply", detail: "re-save steps, offer to do it" },
];

// @example Thinking | Steps appear as Alpha works, with a running timer. The trace folds away a moment after it finishes.
export function Thinking() {
  return <ThinkingTracePattern steps={STEPS} stepMs={1400} />;
}

// @example Done and collapsed | The resting state once the answer is ready: one line with the total time.
export function Collapsed() {
  return <ThinkingTracePattern steps={STEPS} autoplay={false} />;
}

// @example Done and open | The finished trace, expanded, for a reader who wants to check the steps.
export function Open() {
  return <ThinkingTracePattern steps={STEPS} autoplay={false} defaultOpen />;
}

// @example Your own labels | A quicker run that stays open when it ends, with the header wording changed.
export function OwnLabels() {
  return (
    <ThinkingTracePattern
      steps={[
        { label: "Pulling Lumen Labs' invoices", detail: "Stripe · last 3 months" },
        { label: "Comparing seats to usage", detail: "44 active of 50 paid" },
      ]}
      stepMs={900}
      thinkingLabel="Checking billing"
      doneLabel={(seconds) => `Checked billing in ${seconds.toFixed(1)}s`}
      autoCollapse={false}
    />
  );
}
