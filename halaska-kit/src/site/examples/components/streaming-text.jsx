import { useState } from "react";
import { Button, Stack, StreamingText } from "../../kit";

export const usage = `import { StreamingText } from "./halaska-kit";

<StreamingText text="Acme was charged twice for the September invoice." />`;

// @example Default | Types the text out, then hides the cursor.
export function Default() {
  return (
    <div style={{ width: 380, minHeight: 72 }}>
      <StreamingText text="Acme was charged twice for the September invoice. I can refund the duplicate $49 through Stripe." />
    </div>
  );
}

// @example Speed | Milliseconds per character. The default is 30.
export function Speed() {
  return (
    <Stack gap={12} style={{ width: 380 }}>
      <StreamingText speed={12} text="Fast: three tickets from Lumen Labs mention the same export bug." />
      <StreamingText speed={70} text="Slow: three tickets from Lumen Labs mention the same export bug." />
    </Stack>
  );
}

// @example Replay | Remount with a key to play the same text again.
export function Replay() {
  const [run, setRun] = useState(0);
  return (
    <Stack gap={16} align="flex-start" style={{ width: 380, minHeight: 110 }}>
      <StreamingText key={run} text="I filed the export bug in Linear and linked the three Lumen Labs tickets." />
      <Button size="sm" variant="outline" onClick={() => setRun(run + 1)}>Replay</Button>
    </Stack>
  );
}

// @example New text | Streaming restarts whenever the text changes.
export function NewText() {
  const answers = [
    "Fjord Health is on the Team plan and renews on 14 October.",
    "Sam Keller owns the account. The last ticket was solved two days ago.",
  ];
  const [index, setIndex] = useState(0);
  return (
    <Stack gap={16} align="flex-start" style={{ width: 380, minHeight: 110 }}>
      <StreamingText text={answers[index]} />
      <Button size="sm" variant="outline" onClick={() => setIndex((index + 1) % answers.length)}>Ask a follow-up</Button>
    </Stack>
  );
}
