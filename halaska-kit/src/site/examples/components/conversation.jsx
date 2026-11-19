import { useEffect, useRef, useState } from "react";
import { Button, ChatInput, Conversation, Stack, Text } from "../../kit";

export const usage = `import { Conversation, ChatInput } from "./halaska-kit";

<Conversation messages={messages} typing={waiting} height={360} />
<ChatInput onSubmit={(text) => send(text)} suggestions={[]} />`;

const SEED = [
  { id: "m1", role: "user", text: "Should I refund Acme for Tuesday's outage or offer a credit?", time: "2:46 PM" },
  { id: "m2", role: "agent", time: "2:47 PM",
    text: "I'd offer a credit, not a refund. Acme was down for 3 hours and 12 minutes on Tuesday, still inside the 99.5% uptime floor in their contract. A $180 credit on next month's invoice stays under your approval cap.",
    sources: [{ name: "Acme contract · Notion" }, { name: "Incident 412 · Linear" }] },
  { id: "m3", role: "user", text: "Draft the note to Sam Keller and queue the credit in Stripe.", time: "2:48 PM" },
  { id: "m4", role: "agent", time: "2:48 PM",
    text: "Drafted. The note names the $180 credit and points to the status page. The credit is queued in Stripe and waits for your approval before it posts." },
];

const REPLIES = [
  "Done. I closed 22 tickets that had been idle over 30 days and kept 2 open: both mention a billing dispute, so they go to Dana.",
  "Lumen Labs has 3 open issues in Linear, all tagged SSO. The oldest is 6 days. Nothing is past SLA yet.",
  "Overnight: 14 new tickets, 11 answered from the runbooks, 3 waiting for a human. The three are Fjord Health, Brightline and Cobalt Dental.",
];

// @example Default | A thread of four turns at the default height.
export function Default() {
  return <Conversation messages={SEED} />;
}

// @example With a composer | ChatInput beneath the thread; send a question and Alpha replies.
export function WithComposer() {
  const [messages, setMessages] = useState(SEED);
  const [typing, setTyping] = useState(false);
  const timer = useRef(null);
  const n = useRef(0);
  useEffect(() => () => clearTimeout(timer.current), []);

  const send = (text) => {
    const id = `u${Date.now()}`;
    setMessages((m) => [...m, { id, role: "user", text, status: "sending" }]);
    setTyping(true);
    timer.current = setTimeout(() => {
      const reply = REPLIES[n.current % REPLIES.length];
      n.current += 1;
      setTyping(false);
      setMessages((m) => [...m.map((x) => (x.id === id ? { ...x, status: "sent" } : x)), { id: `a${Date.now()}`, role: "agent", text: reply }]);
    }, 1600);
  };

  return (
    <Stack gap={12} align="center" style={{ width: "100%" }}>
      <Conversation messages={messages} typing={typing} height={320} />
      <ChatInput suggestions={[]} models={[]} placeholder="Ask Alpha…" onSubmit={send} streaming={typing} onStop={() => { clearTimeout(timer.current); setTyping(false); }} />
    </Stack>
  );
}

// @example Jump to latest | Scroll up, add a reply, and the thread offers to jump instead of moving you.
export function JumpToLatest() {
  const [messages, setMessages] = useState(SEED);
  const n = useRef(0);
  const add = () => {
    const reply = REPLIES[n.current % REPLIES.length];
    n.current += 1;
    setMessages((m) => [...m, { id: `a${m.length}`, role: "agent", text: reply }]);
  };
  return (
    <Stack gap={12} align="center" style={{ width: "100%" }}>
      <Conversation messages={messages} height={300} compact />
      <Button variant="secondary" size="sm" onClick={add}>Add a reply</Button>
    </Stack>
  );
}

// @example Thinking | The agent's indicator sits after the last turn while a reply is on its way.
export function Thinking() {
  return <Conversation messages={SEED.slice(0, 3)} typing typingLabel="Alpha is checking Stripe" height={300} />;
}

// @example Empty | No turns yet; pass emptyState to replace the default invitation.
export function Empty() {
  return (
    <Stack gap={12} align="center" style={{ width: "100%" }}>
      <Conversation messages={[]} height={200} />
      <Conversation messages={[]} height={120} emptyState={
        <Stack align="center" justify="center" style={{ height: "100%" }}>
          <Text size="sm" secondary>Pick a thread on the left to start.</Text>
        </Stack>
      } />
    </Stack>
  );
}
