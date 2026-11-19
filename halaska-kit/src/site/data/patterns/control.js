// Guidance for the Agentic control group (grp-control), keyed by pattern id.
export default {
  "pat-plan": {
    useWhen: "Use when the agent is about to take several steps the user has not seen yet.",
    do: [
      "Write each step as a plain sentence with real numbers, such as which tickets, which customer, how much.",
      "Let people drop a step before the run starts, and run only the steps they kept.",
      "End on a receipt, so the finished plan links to evidence of what happened.",
    ],
    dont: [
      "Don't start any step before Proceed. The subtitle promises nothing runs until the user says so.",
      "Don't show a plan for a single reversible action. Do it and show a receipt.",
      "Don't treat \"I'll do it myself\" as a failure. The agent stands by, it does not argue.",
    ],
    neighbours: [
      { id: "pat-approval", when: "when there is one decision to make, not a plan to review." },
      { id: "pat-queue", when: "when the work is already agreed and the user only needs to reorder or remove tasks." },
    ],
    states: [
      { name: "Proposed", note: "Numbered steps with a Proposed badge and three actions: proceed, edit the plan, or do it yourself." },
      { name: "Editing", note: "Each step gains a remove control. Dropped steps are struck through and can be restored. A count shows how many steps are kept, and Lock plan returns to the proposal." },
      { name: "Executing", note: "The badge pulses, steps check off one by one, and a line counts progress, such as 2 of 4." },
      { name: "Done", note: "Every kept step is checked. The footer reports how many actions were taken and links to the receipt." },
      { name: "Handed off", note: "The card collapses to one quiet line saying the plan was handed back and the agent is standing by." },
    ],
    usage: `import { PlanPreviewPattern } from "./halaska-kit";

<PlanPreviewPattern
  title="Alpha wants to clear the support backlog"
  steps={[
    "Reply to the 14 password reset tickets with the runbook answer",
    "Issue a $180 credit to Acme for Tuesday's outage",
    "File one Linear issue for the calendar sync bug",
  ]}
  onProceed={(steps) => runPlan(steps)}
  onHandoff={() => assignToMe()}
/>`,
  },

  "pat-approval": {
    useWhen: "Use when the agent has stopped at a fork and needs the user to pick one path before it continues.",
    do: [
      "Ask one question and offer two to four options the agent can carry out straight away.",
      "Give each option a second line with its consequence, so the choice is informed.",
      "Keep Skip available. Holding is a valid answer.",
    ],
    dont: [
      "Don't preselect an option. Approve stays disabled until the user chooses.",
      "Don't style the pause as a warning or an error. The agent is waiting, nothing is broken.",
      "Don't stack several approval cards. Batch the decisions into a plan.",
    ],
    neighbours: [
      { id: "pat-plan", when: "when the user should review a sequence of steps, not choose between options." },
      { id: "pat-handoff", when: "when the agent has hit a limit and the person should take the work over." },
    ],
    states: [
      { name: "Paused", note: "The question, the options, and a Paused badge. Approve is disabled until an option is chosen." },
      { name: "Option selected", note: "The chosen row takes the accent ring and Approve becomes active." },
      { name: "Approved", note: "The card collapses to a confirmation naming the chosen option, with a Resumed badge." },
      { name: "Skipped", note: "The card collapses to a neutral line saying nothing was changed, with an On hold badge." },
    ],
    usage: `import { ApprovalCardPattern } from "./halaska-kit";

<ApprovalCardPattern
  question="How should I reply to Acme's outage complaint?"
  options={[
    { id: "workaround", title: "Reply now with a workaround", sub: "Unblocks Acme today" },
    { id: "wait", title: "Wait for the fix to ship", sub: "Priya's patch lands Thursday" },
  ]}
  onApprove={(option) => resume(option.id)}
  onSkip={() => hold()}
/>`,
  },

  "pat-autonomy": {
    useWhen: "Use when people need to set how far the agent can go on a task, from watching to acting alone.",
    do: [
      "Describe each level by what the agent will do, in one short line.",
      "List the concrete capabilities and caps of the selected level, such as the daily refund cap.",
      "Show the current level as a badge wherever the agent acts, so the setting is never hidden.",
    ],
    dont: [
      "Don't offer a bare on and off switch. Most teams want something between the two.",
      "Don't let the agent raise its own level. Only a person moves the dial up.",
      "Don't reuse one setting for every task. Replying and refunding deserve different levels.",
    ],
    neighbours: [
      { id: "pat-permissions", when: "when the question is which tools and data the agent can touch, not how independently it acts." },
    ],
    states: [
      { name: "Observe", note: "The agent reads and flags, never acts. Badge reads Watching." },
      { name: "Suggest", note: "The agent drafts and the person sends. Badge reads Suggest only." },
      { name: "Confirm", note: "The default. The agent acts after an OK, inside a refund cap. Badge reads Asks first." },
      { name: "Autonomous", note: "The agent acts alone and posts a receipt after each action. The badge pulses and reads Acting solo." },
    ],
    usage: `import { AutonomyPattern } from "./halaska-kit";

<AutonomyPattern />`,
  },

  "pat-permissions": {
    useWhen: "Use when people need to see and change which tools, data and spending limits the agent has.",
    do: [
      "Group the scope into tools, data and limits, each with a one-line description.",
      "Restate the whole scope as one plain sentence that updates as settings change.",
      "Ask for an approval rule the moment a risky tool, such as refunds, is switched on.",
    ],
    dont: [
      "Don't list raw API scopes. Say what the agent can do with each one.",
      "Don't defer changes behind a save button without saying so. Here they apply instantly.",
      "Don't leave money-moving tools on by default.",
    ],
    neighbours: [
      { id: "pat-autonomy", when: "when the tools are settled and the question is how much the agent does without asking." },
      { id: "pat-agent-setup", when: "when the agent does not exist yet and scope is one step of creating it." },
    ],
    states: [
      { name: "Default scope", note: "Replies and issues on, refunds off. The summary says refunds stay off." },
      { name: "Rule needed", note: "Turning refunds on opens a warning strip asking whether to require approval every time or just once." },
      { name: "Approval every time", note: "The strip closes and the summary says refunds need approval each time." },
      { name: "Approved once", note: "The summary says one refund is approved, then the tool locks again." },
      { name: "Replies off", note: "The summary changes to say the agent can read tickets but cannot reply." },
      { name: "Cap adjusted", note: "Moving the slider updates the daily refund cap in the limit row and in the summary." },
    ],
    usage: `import { PermissionScopePattern } from "./halaska-kit";

<PermissionScopePattern />`,
  },

  "pat-queue": {
    useWhen: "Use when the agent has a backlog of tasks and people want to see and change what it does next.",
    do: [
      "Separate the task in progress from the tasks that are waiting.",
      "Let people reorder and remove queued tasks without stopping the current one.",
      "Say when the queue is empty, and count what was finished.",
    ],
    dont: [
      "Don't let the list jump when a task completes. Rows slide up into place.",
      "Don't show tasks running in parallel if the agent works one at a time.",
      "Don't hide finished work. Keep a running count of tasks done.",
    ],
    neighbours: [
      { id: "pat-tasks", when: "when the tasks are already running and the user needs status, not ordering." },
      { id: "pat-taskboard", when: "when several people and the agent share the work across stages." },
    ],
    states: [
      { name: "Working", note: "The current task sits on top with a live timer. Queued tasks are numbered below and the first is tagged Up next." },
      { name: "Row hovered", note: "Move up, move down and remove controls appear on the row." },
      { name: "Task removed", note: "The row fades out and the rows below close the gap." },
      { name: "Task finished", note: "The next task is promoted to the top and the done count goes up by one." },
      { name: "Queue clear", note: "The top row reads All caught up with the number of tasks done, and the caption says the agent is standing by." },
    ],
    usage: `import { QueuePattern } from "./halaska-kit";

<QueuePattern />`,
  },

  "pat-status": {
    useWhen: "Use when the agent runs for more than a few seconds and people need to know what it is doing and how to stop or steer it.",
    do: [
      "Name the current phase in words the user would use, such as Drafting replies.",
      "Keep Stop and Redirect beside the status at all times during a run.",
      "Keep progress when the run is stopped, and say so.",
    ],
    dont: [
      "Don't show a bare spinner. A status with no words tells the user nothing.",
      "Don't make redirecting mean starting again. A note should re-plan from where the agent is.",
      "Don't leave the pill animating once the agent is waiting on the user.",
    ],
    neighbours: [
      { id: "pat-thinking", when: "when the user wants the reasoning behind one answer, not the status of a long run." },
      { id: "pat-tools", when: "when the user needs each action listed, not a one-line summary." },
    ],
    states: [
      { name: "Working", note: "An animated orb, the current phase, a step count and an elapsed clock. Stop and Redirect sit to the right." },
      { name: "Stopped", note: "A grey dot and a line saying progress was kept. The clock pauses and Stop becomes Resume." },
      { name: "Redirecting", note: "A note field opens under the pill. Send is disabled until something is typed." },
      { name: "Re-planning", note: "After a note is sent, the pill runs the redirect phases with a new step count." },
      { name: "Waiting on you", note: "An amber spark and a line saying what needs a look. The clock stops." },
      { name: "Done", note: "A green dot and a line saying what was finished. The controls are removed." },
    ],
    usage: `import { AgentStatusPattern } from "./halaska-kit";

<AgentStatusPattern
  phases={["Reading new threads…", "Matching to HubSpot…", "Drafting replies…"]}
  waitingLabel="Waiting on you · 2 replies need a look"
  onPause={() => agent.pause()}
  onResume={() => agent.resume()}
  onRedirect={(note) => agent.redirect(note)}
/>`,
  },

  "pat-tools": {
    useWhen: "Use when the agent edits files, runs commands or reads documents, and people want to follow each action as it happens.",
    do: [
      "Give each kind of action its own compact block: a reasoning note, a file write, a command, a read.",
      "Show the evidence in the block, such as the changed lines or the command output.",
      "Finish with a summary of the files touched and how many lines changed.",
    ],
    dont: [
      "Don't dump raw tool JSON. Show the file name, the command and the result.",
      "Don't leave the activity indicator running after the last event.",
      "Don't mix the feed into the answer text. Keep actions and prose apart.",
    ],
    neighbours: [
      { id: "pat-thinking", when: "when the agent is reasoning, not acting, and a collapsible trace is enough." },
      { id: "pat-audit", when: "when the record is read after the fact and needs filtering." },
    ],
    states: [
      { name: "Streaming", note: "Events arrive one at a time under a header, with a thinking indicator on the right." },
      { name: "Thinking note", note: "Two lines of reasoning in plain text, with no container." },
      { name: "File write", note: "A block with the file name, the line count and the added lines in green." },
      { name: "Command run", note: "The command and its passing output." },
      { name: "File read", note: "The file name, its details and one line on what the agent learned from it." },
      { name: "Complete", note: "The indicator goes and a row of file chips shows lines added and removed." },
    ],
    usage: `import { ToolStreamPattern } from "./halaska-kit";

<ToolStreamPattern />`,
  },

  "pat-tasks": {
    useWhen: "Use when the agent runs several tasks at once and people need the status of each at a glance.",
    do: [
      "Use one status language across every row: completed, running, failed.",
      "Show sub-steps with their own values, so a row explains itself.",
      "Put the recovery action on the failed row.",
    ],
    dont: [
      "Don't show a percentage unless it is real progress.",
      "Don't collapse a failure into a red icon. Say what failed and offer a retry.",
      "Don't reorder rows as their status changes.",
    ],
    neighbours: [
      { id: "pat-queue", when: "when the tasks have not started and the user wants to reorder them." },
      { id: "pat-status", when: "when there is one run to follow, not several." },
    ],
    states: [
      { name: "Completed", note: "A green tick, a Completed badge and the finished sub-steps with their counts." },
      { name: "Running", note: "A spinner, a live percentage, a progress bar and a pulsing Running badge." },
      { name: "Failed", note: "A red mark, a Failed badge and a link to retry the failed items." },
    ],
    usage: `import { AgentTasksPattern } from "./halaska-kit";

<AgentTasksPattern />`,
  },

  "pat-handoff": {
    useWhen: "Use when the agent reaches the edge of what it is allowed to do and a person has to take the work or widen the limit.",
    do: [
      "Say why the agent stopped in one line, naming the limit it reached.",
      "Hand over the context a person needs to act: customer, amount, what is at risk.",
      "Offer two ways forward: take over, or raise the limit and let the agent finish.",
    ],
    dont: [
      "Don't use error colours or alarm icons. This is an escalation, not a failure.",
      "Don't make the person rebuild the context from the transcript.",
      "Don't raise a cap without saying what the new cap is.",
    ],
    neighbours: [
      { id: "pat-approval", when: "when the agent can continue on its own once the user picks an option." },
      { id: "pat-error-repair", when: "when the agent made a mistake, not when it reached a limit." },
    ],
    states: [
      { name: "Working", note: "A thinking indicator with what the agent is reviewing." },
      { name: "Handoff", note: "A Your turn badge, the headline and reason on an accent panel, the context rows, and two actions." },
      { name: "Taken over", note: "The actions are replaced by a tick and a line saying the person has control and notes are in the thread." },
      { name: "Resuming", note: "After the cap is raised, a thinking indicator says the agent is resuming." },
      { name: "Resumed", note: "A tick and the outcome, such as the refund amount and customer." },
    ],
    usage: `import { HandoffPattern } from "./halaska-kit";

<HandoffPattern
  headline="Alpha is handing this to you"
  reason="Refund exceeds your $2,500 approval cap"
  context={[
    { label: "Customer", value: "Acme · Enterprise" },
    { label: "Requested refund", value: "$3,900" },
  ]}
  onTakeOver={() => assignToMe()}
  onResume={() => raiseCap(5000)}
/>`,
  },

  "pat-receipt": {
    useWhen: "Use when the agent has just changed something real and people need proof of what changed, plus a short window to undo it.",
    do: [
      "State what changed, where, and under which rule the agent was allowed to do it.",
      "Show the value before and after, with the difference.",
      "Count the undo window down, and link to the audit log once it closes.",
    ],
    dont: [
      "Don't ask for confirmation first when the action can be reversed. Act, then offer undo.",
      "Don't remove the receipt when the window closes. It becomes the record.",
      "Don't offer undo for something that cannot be reversed.",
    ],
    neighbours: [
      { id: "pat-audit", when: "when people need the full history of actions, not the one that just happened." },
      { id: "pat-checkpoints", when: "when the user wants to roll back a run of actions, not one." },
    ],
    states: [
      { name: "Undo window open", note: "A pulsing green dot, the what, where and authority rows, the before and after strip, and an Undo button with a countdown ring." },
      { name: "Window closed", note: "The Undo button is replaced by a link to the audit log and a caption saying the window has closed." },
      { name: "Reversed", note: "The title, timestamp and rows switch to the reversal, the strip runs backwards, and the caption confirms nothing else was affected." },
    ],
    usage: `import { ActionReceiptPattern } from "./halaska-kit";

<ActionReceiptPattern
  title="Credit issued"
  timestamp="14:32:07 UTC"
  meta={[
    { label: "What", value: "Issued a $180 credit to Acme" },
    { label: "Where", value: "Stripe · Acme" },
    { label: "Authority", value: "Within your $500 refund cap" },
  ]}
  before={0}
  after={180}
  unit="USD"
  onUndo={() => reverseCredit()}
  onAudit={() => openAuditLog()}
/>`,
  },

  "pat-checkpoints": {
    useWhen: "Use when a long agent session changes a lot and people want a safe point to roll back to.",
    do: [
      "Name checkpoints after what happened, such as After Acme replies, with a time and a measure of state.",
      "Confirm inline, saying how many actions will be rolled back.",
      "Re-check the live state before restoring, and say that the agent is doing it.",
    ],
    dont: [
      "Don't open a modal to confirm. The strip under the row is enough.",
      "Don't offer Restore on the current checkpoint.",
      "Don't restore silently. Report how many actions were reversed.",
    ],
    neighbours: [
      { id: "pat-receipt", when: "when there is one recent action to undo, not a session to rewind." },
      { id: "pat-artifact", when: "when the thing being versioned is a document, not the state of a session." },
    ],
    states: [
      { name: "Idle", note: "A timeline of named checkpoints. The current one has a pulsing accent dot." },
      { name: "Restore offered", note: "Hovering an earlier checkpoint shows a Restore button on that row." },
      { name: "Confirming", note: "A neutral strip opens under the row with the number of actions to roll back, and Restore or Keep going." },
      { name: "Verifying", note: "Later checkpoints collapse and a thinking indicator says the agent is verifying ticket states." },
      { name: "Restored", note: "The chosen checkpoint becomes current, with a caption saying how many actions were reversed." },
    ],
    usage: `import { CheckpointPattern } from "./halaska-kit";

<CheckpointPattern />`,
  },

  "pat-audit": {
    useWhen: "Use when someone needs to look back over everything the agent did and find the actions that need a second look.",
    do: [
      "Filter by outcome, with a count on each filter.",
      "Record the authority for every action: the rule, cap or person that allowed it.",
      "Link each row to its receipt.",
    ],
    dont: [
      "Don't log only the writes. Reads belong in the record too.",
      "Don't open several rows at once. One detail panel keeps the list scannable.",
      "Don't delete undone actions. Mark them as undone and keep them.",
    ],
    neighbours: [
      { id: "pat-digest", when: "when the user wants a short summary of a period, not the full record." },
      { id: "pat-receipt", when: "when the user needs evidence for one action at the moment it happens." },
    ],
    states: [
      { name: "All", note: "Every action today, newest first, each with a time and a Done, Review or Undone badge." },
      { name: "Filtered", note: "Picking a filter narrows the list to one outcome and the rows re-enter in sequence." },
      { name: "Row expanded", note: "The row opens to show the authority, the detail and a link to the receipt. Opening another closes it." },
    ],
    usage: `import { AuditLogPattern } from "./halaska-kit";

<AuditLogPattern />`,
  },

  "pat-error-repair": {
    useWhen: "Use when the agent got something wrong and has to own it, show the fix, and give people a way to take it further.",
    do: [
      "Admit the mistake in one plain sentence that says what happened.",
      "List what the agent has already done to correct it.",
      "Offer a way to inspect the fix and a way to reach a person.",
    ],
    dont: [
      "Don't use red banners, warning icons or alarm language. Stay calm and specific.",
      "Don't blame the user, the data or the rule.",
      "Don't hide the mistake in the log. Surface it where the person will see it.",
    ],
    neighbours: [
      { id: "pat-handoff", when: "when the agent has not made a mistake and is stopping at a limit." },
      { id: "pat-receipt", when: "when the action was correct and the user only needs the option to undo it." },
    ],
    states: [
      { name: "Acknowledged", note: "The headline and one sentence on what went wrong." },
      { name: "Corrected", note: "A list of fixes, each drawn in with a tick." },
      { name: "Recourse", note: "Two actions, review the fix or flag it for a person, with a quiet note that it was logged to audit." },
      { name: "Fix reviewed", note: "A before and after line opens under the actions, showing the rule that changed." },
    ],
    usage: `import { ErrorRepairPattern } from "./halaska-kit";

<ErrorRepairPattern
  headline="Alpha got this one wrong"
  acknowledgment="Alpha archived the Stripe payout notice as a newsletter."
  fixes={[
    "Restored the notice to your inbox, unread",
    "Added Stripe to the never-archive sender list",
  ]}
  diff={{ label: "billing@stripe.com", before: "Newsletter", after: "Never archive" }}
  onFlag={() => escalateTo("Dana Ruiz")}
/>`,
  },
};
