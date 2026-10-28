import { useEffect, useRef, useState } from "react";
import { Message, Stack } from "../../kit";

export const usage = `import { Message } from "./halaska-kit";

<Message role="user" text="Should I refund Acme or offer a credit?" time="2:46 PM" />
<Message
  role="agent"
  text="I'd offer a credit, not a refund."
  time="2:47 PM"
  sources={[{ name: "Acme contract · Notion" }]}
  actions={[{ label: "Copy", icon: "copy", onClick: copy }]}
/>`;

// @example Agent turn | Left aligned beside the agent's mark, with sources and hover actions.
export function AgentTurn() {
  const [copied, setCopied] = useState(false);
  const [vote, setVote] = useState(null);
  const timer = useRef(null);
  useEffect(() => () => clearTimeout(timer.current), []);
  const copy = () => { setCopied(true); clearTimeout(timer.current); timer.current = setTimeout(() => setCopied(false), 1200); };
  return (
    <Message
      role="agent" time="2:47 PM"
      text="I'd offer a credit, not a refund. Acme was down for 3 hours and 12 minutes on Tuesday, still inside the 99.5% uptime floor in their contract. A $180 credit on next month's invoice stays under your approval cap."
      sources={[{ name: "Acme contract · Notion" }, { name: "Incident 412 · Linear" }]}
      actions={[
        { label: copied ? "Copied" : "Copy", icon: copied ? "check" : "copy", onClick: copy },
        { label: "Retry", icon: "retry", onClick: () => {} },
        { label: "Good response", icon: "up", active: vote === "up", onClick: () => setVote((v) => (v === "up" ? null : "up")) },
        { label: "Bad response", icon: "down", active: vote === "down", onClick: () => setVote((v) => (v === "down" ? null : "down")) },
      ]}
    />
  );
}

// @example User turn | Right aligned in a bubble, with the sender's avatar and a time.
export function UserTurn() {
  return (
    <Stack gap={12} style={{ width: "100%", alignItems: "flex-end" }}>
      <Message role="user" name="Dana Ruiz" time="2:46 PM" text="Should I refund Acme for Tuesday's outage or offer a credit?" />
      <Message role="user" name="Dana Ruiz" avatar={null} time="2:48 PM" text="Draft the note to Sam Keller and queue the credit in Stripe." />
    </Stack>
  );
}

// @example Delivery status | Sending, then sent, then a failed turn that keeps Retry visible.
export function DeliveryStatus() {
  const [status, setStatus] = useState("failed");
  const timer = useRef(null);
  useEffect(() => () => clearTimeout(timer.current), []);
  const retry = () => {
    setStatus("sending");
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setStatus("sent"), 1400);
  };
  return (
    <Stack gap={12} style={{ width: "100%" }}>
      <Message role="user" name="Dana Ruiz" status="sending" text="Queue the $180 credit for Acme." />
      <Message role="user" name="Dana Ruiz" status={status} time={status === "sent" ? "2:49 PM" : undefined}
        text="And close the Linear issue once Stripe confirms."
        actions={status === "failed" ? [{ label: "Retry", icon: "retry", onClick: retry }] : []} />
    </Stack>
  );
}

// @example Streaming | A caret sits at the end while the reply arrives.
export function Streaming() {
  const full = "Pulling Acme's uptime for October from the status page and checking the credit cap in Notion before I draft anything.";
  const [shown, setShown] = useState(0);
  useEffect(() => {
    const iv = setInterval(() => setShown((n) => (n >= full.length ? 0 : n + 3)), 60);
    return () => clearInterval(iv);
  }, [full.length]);
  return <Message role="agent" name="Alpha" streaming text={full.slice(0, shown)} />;
}

// @example System and compact | A quiet centred system line, then two compact turns.
export function SystemAndCompact() {
  return (
    <Stack gap={8} style={{ width: "100%" }}>
      <Message role="system" text="Alpha joined the thread" time="2:45 PM" />
      <Message role="user" compact avatar={null} text="Who is waiting on Dana right now?" />
      <Message role="agent" compact text="Two customers: Lumen Labs on the SSO question and Brightline on the refund cap. Both inside their SLA for another 40 minutes." />
    </Stack>
  );
}
