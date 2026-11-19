import { PlanPreviewPattern } from "../../kit";

// @example Proposed | The resting state. Nothing has run and every step can still be dropped.
export function Proposed() {
  return (
    <PlanPreviewPattern
      title="Alpha wants to clear the support backlog"
      steps={[
        "Reply to the 14 password reset tickets with the runbook answer",
        "Issue a $180 credit to Acme for Tuesday's outage",
        "File one Linear issue for the calendar sync bug",
        "Send Dana Ruiz a summary of what is left",
      ]}
    />
  );
}

// @example Running to done | Proceed checks the steps off, then the footer reports what was done.
export function RunningToDone() {
  return (
    <PlanPreviewPattern
      title="Alpha wants to close stale tickets"
      subtitle="Two steps, both reversible."
      steps={[
        "Close 9 Intercom threads with no reply in 30 days",
        "Post the list of closed threads in the support channel",
      ]}
      proceedLabel="Run plan"
      stepDelayMs={1200}
      doneText={(count) => `Done · ${count} steps finished · 9 threads closed`}
    />
  );
}

// @example Your own labels | The same card for a billing job, with every label replaced.
export function OwnLabels() {
  return (
    <PlanPreviewPattern
      title="Alpha wants to refund Fjord Health"
      subtitle="Waiting for Sam Keller to sign off."
      badgeLabel="Draft"
      steps={[
        "Refund $340 to Fjord Health in Stripe",
        "Reply on ticket #4821 with the refund confirmation",
        "Add a note to the refund runbook in Notion",
      ]}
      proceedLabel="Approve and run"
      editLabel="Change steps"
      lockLabel="Save steps"
      handoffLabel="Sam will handle it"
      handoffText="Handed to Sam Keller. Alpha is standing by."
    />
  );
}
