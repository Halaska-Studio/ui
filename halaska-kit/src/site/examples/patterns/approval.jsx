import { ApprovalCardPattern } from "../../kit";

// @example Paused | The agent has stopped and asks one question. Approve stays disabled until an option is chosen.
export function Paused() {
  return (
    <ApprovalCardPattern
      question="How should I reply to Acme's outage complaint?"
      options={[
        { id: "workaround", title: "Reply now with a workaround", sub: "Unblocks Acme today, fix ships later" },
        { id: "wait", title: "Wait for the fix to ship", sub: "Priya's patch lands Thursday" },
        { id: "escalate", title: "Escalate to Priya", sub: "Loops engineering in on the thread" },
      ]}
    />
  );
}

// @example Two options | A yes or no decision with short options and no second line.
export function TwoOptions() {
  return (
    <ApprovalCardPattern
      eyebrow="Refund request"
      badgeLabel="Waiting"
      question="Lumen Labs asked for a $340 refund on ticket #4821. Send it?"
      options={[
        { id: "refund", title: "Refund $340 in Stripe" },
        { id: "credit", title: "Offer a $340 credit on the next invoice" },
      ]}
      approveLabel="Send"
      skipLabel="Hold"
    />
  );
}

// @example Resolved copy | The approved and skipped lines are yours to write.
export function ResolvedCopy() {
  return (
    <ApprovalCardPattern
      eyebrow="Before I close these"
      question="Close 14 Brightline tickets with no reply in 30 days?"
      options={[
        { id: "close", title: "Close all 14", sub: "Each one reopens if the customer replies" },
        { id: "nudge", title: "Send one last follow-up first", sub: "Closes in 7 days if there is still no reply" },
      ]}
      approvedText={(option) => (option.id === "close" ? "Closing 14 tickets" : "Follow-up sent to 14 threads")}
      skippedText="Left open · Alpha will ask again tomorrow"
    />
  );
}
