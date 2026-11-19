import { HandoffPattern } from "../../kit";

// @example Handoff | With autoplay off the card opens on the handoff, with the context a person needs to act.
export function Handoff() {
  return (
    <HandoffPattern
      autoplay={false}
      headline="Alpha is handing this to you"
      reason="Refund exceeds your $2,500 approval cap"
      context={[
        { label: "Customer", value: "Acme · Enterprise" },
        { label: "Requested refund", value: "$3,900" },
        { label: "Risk if delayed", value: "Renewal in 6 days" },
      ]}
    />
  );
}

// @example Working, then handing off | The agent works first, reaches its cap, and escalates.
export function WorkingFirst() {
  return (
    <HandoffPattern
      workingLabel="Reviewing Lumen Labs' credit request…"
      workingMs={3000}
      headline="Alpha needs Sam Keller for this one"
      reason="A $900 credit is above the $500 daily cap"
      context={[
        { label: "Customer", value: "Lumen Labs · Growth" },
        { label: "Requested credit", value: "$900" },
        { label: "Ticket", value: "#4821" },
      ]}
      resumeLabel="Raise cap to $1,000 and let Alpha finish"
      resumedText="Done · $900 credit issued to Lumen Labs"
    />
  );
}

// @example Your own copy | Both outcomes are props: what the person sees after taking over, and after letting the agent finish.
export function OwnCopy() {
  return (
    <HandoffPattern
      autoplay={false}
      headline="This refund is yours to decide"
      reason="Cobalt Dental's request is $1,200 over the cap Dana set"
      context={[
        { label: "Customer", value: "Cobalt Dental · Starter" },
        { label: "Requested refund", value: "$3,700" },
        { label: "Owner", value: "Dana Ruiz" },
      ]}
      takeOverLabel="I'll handle it"
      resumeLabel="Approve this one only"
      takenOverText="Assigned to you. Alpha drafted a reply in Intercom."
      resumingLabel="Sending the refund…"
      resumedText="Done · refunded $3,700 to Cobalt Dental"
      resumeMs={2000}
    />
  );
}
