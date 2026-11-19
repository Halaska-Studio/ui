import { useState } from "react";
import { QuestionCard, Stack, Text } from "../../kit";

export const usage = `import { QuestionCard } from "./halaska-kit";

<QuestionCard
  questions={[
    {
      id: "scope",
      question: "Which duplicate charges should I refund?",
      options: [
        { id: "all", label: "All three" },
        { id: "cap", label: "Only the ones under the $50 cap" },
      ],
      allowOther: true,
    },
  ]}
  onComplete={(answers) => continueRun(answers)}
/>`;

// @example Default | Three questions before a refund sweep. The first one allows a free-text answer.
export function Default() {
  return <QuestionCard />;
}

// @example One question | A single decision. The primary action reads Continue straight away.
export function OneQuestion() {
  return (
    <QuestionCard
      title="One thing before I reply"
      questions={[
        {
          id: "credit",
          question: "Brightline asked for a credit. How much?",
          context: "Their plan is $240 a month. The outage lasted four hours.",
          options: [
            { id: "day",   label: "One day",   sub: "$8" },
            { id: "week",  label: "One week",  sub: "$56, under the cap" },
            { id: "month", label: "One month", sub: "$240, needs Priya Nair's sign-off" },
          ],
        },
      ]}
    />
  );
}

// @example With answers | onAnswer fires on each pick and onComplete once at the end.
export function WithAnswers() {
  const [last, setLast] = useState("");
  const [result, setResult] = useState(null);
  return (
    <Stack gap={12}>
      <QuestionCard
        questions={[
          {
            id: "owner",
            question: "Who should own the Linear issue?",
            options: [
              { id: "dana",  label: "Dana Ruiz",  sub: "Billing this sprint" },
              { id: "sam",   label: "Sam Keller", sub: "On call today" },
            ],
          },
          {
            id: "priority",
            question: "Priority?",
            options: [
              { id: "urgent", label: "Urgent", sub: "Customers are being charged twice" },
              { id: "high",   label: "High" },
              { id: "normal", label: "Normal" },
            ],
          },
        ]}
        onAnswer={(q, o) => setLast(`${q}: ${o}`)}
        onComplete={(answers) => setResult(Object.values(answers).map((a) => a.label).join(", "))}
      />
      <Text size="xs" secondary mono>{result ? `Done: ${result}` : last || "Nothing picked yet"}</Text>
    </Stack>
  );
}

// @example Custom labels | Skip, next and done copy are yours.
export function CustomLabels() {
  return (
    <QuestionCard
      title="Alpha has two questions"
      skipLabel="Decide for me"
      nextLabel="Next question"
      doneLabel="Start the run"
      questions={[
        {
          id: "window",
          question: "When should the digest go out?",
          options: [
            { id: "now",     label: "Now" },
            { id: "morning", label: "Tomorrow at 9", sub: "Northwind's usual time" },
          ],
        },
        {
          id: "who",
          question: "Who gets it?",
          options: [
            { id: "team",  label: "The whole team" },
            { id: "leads", label: "Leads only", sub: "Dana, Priya, Sam" },
          ],
          allowOther: true,
        },
      ]}
    />
  );
}
