import { ActionReceiptPattern } from "../../kit";

// @example Undo window open | The action has happened. The ring counts down the time left to reverse it.
export function UndoOpen() {
  return (
    <ActionReceiptPattern
      title="Credit issued"
      timestamp="14:32:07 UTC"
      meta={[
        { label: "What", value: "Issued a $180 credit to Acme" },
        { label: "Where", value: "Stripe · Acme" },
        { label: "Authority", value: "Within your $500 refund cap, no approval needed" },
      ]}
      before={0}
      after={180}
      unit="USD"
      stripLabel="Acme credit"
      undoSeconds={30}
    />
  );
}

// @example Window closed | With autoplay off the receipt rests as a record, with a link to the audit log.
export function WindowClosed() {
  return <ActionReceiptPattern autoplay={false} />;
}

// @example A different action | The strip takes any number. Here it counts open tickets, not dollars.
export function DifferentAction() {
  return (
    <ActionReceiptPattern
      title="Stale tickets closed"
      reversedTitle="Tickets reopened"
      timestamp="14:21:40 UTC"
      reversedTimestamp="14:21:52 UTC"
      meta={[
        { label: "What", value: "Closed 14 threads with no reply in 30 days" },
        { label: "Where", value: "Intercom · Brightline" },
        { label: "Authority", value: "Standing rule set by Dana Ruiz" },
      ]}
      reversedMeta={[
        { label: "What", value: "Reopened the 14 closed threads" },
        { label: "Where", value: "Intercom · Brightline" },
        { label: "Net", value: "Queue back to 42 open" },
      ]}
      before={42}
      after={28}
      unit="open"
      stripLabel="Brightline queue"
      undoSeconds={20}
      undoLabel="Reopen"
      expiredLabel="Reopen window closed"
      reversedLabel="Reopened · no replies were sent"
    />
  );
}
