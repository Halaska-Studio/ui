import { ErrorRepairPattern } from "../../kit";

// @example Full repair | With autoplay off all three parts show at once: the admission, the fixes, and the recourse.
export function FullRepair() {
  return (
    <ErrorRepairPattern
      autoplay={false}
      headline="Alpha got this one wrong"
      acknowledgment="Alpha archived the Stripe payout notice as a newsletter. It matched the sender rule and never reached your inbox."
      fixes={[
        "Restored the notice to your inbox, unread",
        "Added Stripe to the never-archive sender list",
      ]}
      diff={{ label: "billing@stripe.com", before: "Newsletter", after: "Never archive" }}
    />
  );
}

// @example In three beats | Played in order, the admission comes first, then the fixes, then the actions.
export function ThreeBeats() {
  return (
    <ErrorRepairPattern
      beatMs={1800}
      headline="Alpha sent the wrong reply"
      acknowledgment="Fjord Health asked about SSO on ticket #4821 and got the password reset answer. The two runbook entries share a title."
      fixesTitle="Already corrected"
      fixes={[
        "Sent Fjord Health the SSO setup steps with an apology",
        "Renamed the two runbook entries in Notion",
        "Rechecked the 6 other replies sent from that entry",
      ]}
      diff={{ label: "Runbook match", before: "Password reset", after: "SSO setup" }}
      reviewLabel="See what changed"
      flagLabel="Send to Dana Ruiz"
    />
  );
}

// @example Nothing to review | Pass no diff when there is no before and after to show. The review action goes with it.
export function NothingToReview() {
  return (
    <ErrorRepairPattern
      autoplay={false}
      headline="Alpha missed a follow-up"
      acknowledgment="The check-in with Cobalt Dental was due on Monday and did not go out. The reminder was set for the wrong week."
      fixes={["Sent the check-in this morning", "Moved the reminder to the right week"]}
      diff={null}
      footer=""
    />
  );
}
