import { useState } from "react";
import { TaskList, Stack, Text } from "../../kit";

export const usage = `import { TaskList } from "./halaska-kit";

<TaskList
  title="Clearing the support backlog"
  tasks={[
    { id: "read",  label: "Read the 42 unread threads", status: "done" },
    { id: "draft", label: "Draft replies for the sync threads", status: "running" },
    { id: "issue", label: "Open a Linear issue", status: "todo" },
  ]}
  onChange={(tasks) => save(tasks)}
/>`;

// @example Default | Alpha works through the backlog. One task failed and waits for a retry, one is blocked on a person.
export function Default() {
  return <TaskList />;
}

// @example Resting | No timers. The list shows exactly the statuses you pass.
export function Resting() {
  return (
    <TaskList
      autoplay={false}
      title="Refund sweep · Acme"
      tasks={[
        { id: "find",   label: "Find the duplicate charges",     status: "done",    detail: "Stripe · 3 found" },
        { id: "check",  label: "Check each one against the cap", status: "done",    detail: "All under $50" },
        { id: "refund", label: "Issue the refunds",              status: "running" },
        { id: "notify", label: "Tell Sam Keller",                status: "todo",    detail: "Intercom reply" },
      ]}
    />
  );
}

// @example Collapsible | The header folds the rows away. The count and bar stay.
export function Collapsible() {
  return (
    <TaskList
      collapsible
      defaultOpen={false}
      autoplay={false}
      title="Onboarding Fjord Health"
      tasks={[
        { id: "ws",   label: "Create the workspace",          status: "done" },
        { id: "seed", label: "Import 120 contacts",            status: "done" },
        { id: "sso",  label: "Connect single sign-on",         status: "blocked", detail: "Waiting on their IT lead" },
        { id: "walk", label: "Schedule the walkthrough",       status: "todo" },
      ]}
    />
  );
}

// @example With a change log | onChange fires with the whole list each time a status moves.
export function WithChangeLog() {
  const [log, setLog] = useState([]);
  return (
    <Stack gap={12}>
      <TaskList
        stepMs={1000}
        title="Weekly digest"
        tasks={[
          { id: "pull",  label: "Pull last week's tickets",   status: "running" },
          { id: "rank",  label: "Rank accounts by volume",    status: "todo" },
          { id: "write", label: "Write the digest",           status: "todo" },
        ]}
        onChange={(tasks) => setLog((l) => [`${tasks.filter((t) => t.status === "done").length} done`, ...l].slice(0, 3))}
      />
      <Text size="xs" secondary mono>{log.length ? log.join(" · ") : "No changes yet"}</Text>
    </Stack>
  );
}
