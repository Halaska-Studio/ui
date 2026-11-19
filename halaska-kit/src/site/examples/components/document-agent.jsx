import { useState } from "react";
import { DocumentAgent, Text } from "../../kit";

export const usage = `import { DocumentAgent } from "./halaska-kit";

<DocumentAgent
  title="Refund policy · runbook"
  blocks={[
    { id: "b1", type: "h1", text: "Refund policy" },
    { id: "b2", type: "p", text: "Northwind refunds any plan within 14 days of the charge." },
  ]}
  edits={[
    { id: "e1", blockId: "b2", kind: "replace", text: "Northwind refunds any plan within 30 days of the charge.", reason: "The runbook moved to 30 days." },
  ]}
  onAccept={(edit) => console.log("accepted", edit.id)}
/>`;

// @example Edits arriving | The default: Alpha's four edits arrive one by one. Accept or reject each, or accept all.
export function EditsArriving() {
  return <DocumentAgent />;
}

// @example All at once | autoplay={false} shows every edit immediately, with no timers.
export function AllAtOnce() {
  return <DocumentAgent autoplay={false} />;
}

// @example One replace | A single edit on a short document.
export function OneReplace() {
  return (
    <DocumentAgent
      title="Escalation policy"
      autoplay={false}
      blocks={[
        { id: "h", type: "h1", text: "Escalation policy" },
        { id: "p1", type: "p", text: "Tickets open for more than four hours go to Dana Ruiz." },
        { id: "p2", type: "p", text: "Contract accounts such as Fjord Health go to Sam Keller the same day." },
      ]}
      edits={[
        { id: "e1", blockId: "p1", kind: "replace", text: "Tickets open for more than two hours go to Dana Ruiz.", reason: "Matches the new SLA for Acme and Brightline." },
      ]}
    />
  );
}

// @example Callbacks | onAccept, onReject and onAcceptAll report each decision.
export function Callbacks() {
  const [log, setLog] = useState([]);
  const add = (line) => setLog((l) => [line, ...l].slice(0, 3));
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <DocumentAgent
        autoplay={false}
        onAccept={(e) => add(`Accepted ${e.id}`)}
        onReject={(e) => add(`Rejected ${e.id}`)}
        onAcceptAll={() => add("Accepted everything that was pending")}
      />
      <Text size="sm" secondary>{log.length ? log.join(" · ") : "No decisions yet."}</Text>
    </div>
  );
}
