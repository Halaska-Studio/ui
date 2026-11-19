import { AgentStatusPattern } from "../../kit";

// @example Working | The pill names each phase as the agent moves through it, then waits on the user.
export function Working() {
  return (
    <AgentStatusPattern
      phases={["Reading new threads…", "Matching to HubSpot…", "Drafting replies…"]}
      phaseMs={2400}
    />
  );
}

// @example Waiting on you | With autoplay off the pill rests in the waiting state, with no timers.
export function Waiting() {
  return (
    <AgentStatusPattern
      autoplay={false}
      waitingLabel="Waiting on you · 2 replies need a look"
    />
  );
}

// @example Your own phases | Each phase can pick its own orb, and every label is a prop.
export function OwnPhases() {
  return (
    <AgentStatusPattern
      phases={[
        { label: "Pulling Stripe renewals…", orb: "globe" },
        { label: "Scoring churn risk…", orb: "sweep" },
        { label: "Writing the renewal list…", orb: "orbit" },
      ]}
      redirectPhases={[{ label: "Narrowing to Enterprise accounts…", orb: "pulse" }]}
      phaseMs={2400}
      waitingLabel="Waiting on you · 7 accounts to review"
      pausedLabel="Stopped · list saved as a draft"
      doneLabel="Done · renewal list sent to Dana Ruiz"
      contextLabel={(step, total) => `Renewal follow-up · step ${step} of ${total}`}
      redirectPlaceholder="Change what Alpha is looking for"
    />
  );
}
