import { useState } from "react";
import { ChatHistory, Stack, Text } from "../../kit";

export const usage = `import { ChatHistory } from "./halaska-kit";

<ChatHistory
  threads={threads}
  activeId={activeId}
  onSelect={setActiveId}
  onNew={() => startThread()}
/>`;

const HOUR = 3600 * 1000;
const ago = (hours) => new Date(Date.now() - hours * HOUR).toISOString();

const THREADS = [
  { id: "t1", title: "Acme outage credit", preview: "Credit queued in Stripe, waiting for approval", time: ago(1.2), pinned: true },
  { id: "t2", title: "Overnight ticket summary", preview: "14 new, 3 need a human", time: ago(3), unread: true },
  { id: "t3", title: "Lumen Labs renewal prep", preview: "Pulled usage and the open Linear issues", time: ago(7) },
  { id: "t4", title: "Fjord Health SSO question", preview: "Runbook found in Notion, reply drafted", time: ago(27) },
  { id: "t5", title: "Brightline refund cap", preview: "Cap is $250 per incident", time: ago(31) },
  { id: "t6", title: "Cobalt Dental onboarding", preview: "Three seats added, invite sent to Priya", time: ago(4 * 24) },
  { id: "t7", title: "Idle tickets over 30 days", preview: "22 closed, 2 kept open", time: ago(9 * 24) },
];

// @example Default | Grouped by day with search and a new-chat button.
export function Default() {
  const [active, setActive] = useState("t1");
  return <ChatHistory threads={THREADS} activeId={active} onSelect={setActive} onNew={() => {}} />;
}

// @example Managed | Rename, pin and delete from the row menu, all wired to state.
export function Managed() {
  const [threads, setThreads] = useState(THREADS);
  const [active, setActive] = useState("t2");
  const update = (id, patch) => setThreads((list) => list.map((t) => (t.id === id ? { ...t, ...patch } : t)));
  const add = () => {
    const id = `t${Date.now()}`;
    setThreads((list) => [{ id, title: "New chat", time: new Date().toISOString() }, ...list]);
    setActive(id);
  };
  return (
    <ChatHistory
      threads={threads} activeId={active}
      onSelect={(id) => { setActive(id); update(id, { unread: false }); }}
      onNew={add}
      onRename={(id, title) => update(id, { title })}
      onPin={(id) => setThreads((list) => list.map((t) => (t.id === id ? { ...t, pinned: !t.pinned } : t)))}
      onDelete={(id) => setThreads((list) => list.filter((t) => t.id !== id))}
    />
  );
}

// @example Flat list | No headings and no search, for a tight sidebar.
export function FlatList() {
  return <ChatHistory threads={THREADS.slice(0, 5)} groupBy="none" search={false} width={240} height={320} />;
}

// @example Selection | onSelect reports the picked thread.
export function Selection() {
  const [active, setActive] = useState("t3");
  const current = THREADS.find((t) => t.id === active);
  return (
    <Stack gap={12} align="center" style={{ width: "100%" }}>
      <ChatHistory threads={THREADS.slice(0, 4)} activeId={active} onSelect={setActive} search={false} height={280} />
      <Text size="sm" secondary>Open: {current?.title}</Text>
    </Stack>
  );
}

// @example Empty | Nothing yet, only the header and the new-chat button.
export function Empty() {
  return <ChatHistory threads={[]} search={false} height={200} onNew={() => {}} />;
}
