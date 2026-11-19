import { useEffect, useRef, useState } from "react";
import { ChatInput, Stack, Text } from "../../kit";

export const usage = `import { ChatInput } from "./halaska-kit";

<ChatInput
  onSubmit={(text) => ask(text)}
  streaming={isStreaming}
  onStop={() => stop()}
/>`;

const MODELS = [
  { id: "alpha-4-fast", label: "alpha-4 · fast" },
  { id: "alpha-4", label: "alpha-4 · deep" },
  { id: "alpha-mini", label: "alpha-mini" },
];

// @example Default | Suggestions, attachments, a model pill, mic and send; sending streams for three seconds.
export function Default() {
  const [value, setValue] = useState("");
  const [model, setModel] = useState("alpha-4-fast");
  const [attachments, setAttachments] = useState([]);
  const [streaming, setStreaming] = useState(false);
  const timer = useRef(null);
  useEffect(() => () => clearTimeout(timer.current), []);

  const addFile = () => setAttachments((list) => [...list, { id: `f${list.length + 1}`, name: list.length ? `export-${list.length + 1}.csv` : "tickets.csv", kind: "12 KB" }]);
  const send = () => {
    setAttachments([]);
    setStreaming(true);
    timer.current = setTimeout(() => setStreaming(false), 3000);
  };
  const stop = () => { clearTimeout(timer.current); setStreaming(false); };

  return (
    <ChatInput
      value={value} onChange={setValue} onSubmit={send}
      models={MODELS} model={model} onModelChange={setModel}
      attachments={attachments} onAttach={addFile}
      onRemoveAttachment={(id) => setAttachments((list) => list.filter((a) => a.id !== id))}
      onVoice={() => {}}
      streaming={streaming} onStop={stop}
    />
  );
}

// @example Uncontrolled | Leave out value and the field keeps its own state; onSubmit still fires.
export function Uncontrolled() {
  const [sent, setSent] = useState(null);
  return (
    <Stack gap={12} align="center" style={{ width: "100%" }}>
      <ChatInput suggestions={[]} models={[]} placeholder="Ask Alpha anything…" onSubmit={setSent} />
      <Text size="sm" secondary>{sent ? `Sent: ${sent}` : "Nothing sent yet"}</Text>
    </Stack>
  );
}

// @example Streaming | While the agent answers the send button becomes Stop.
export function Streaming() {
  const [streaming, setStreaming] = useState(true);
  return (
    <ChatInput
      suggestions={[]} models={MODELS}
      placeholder="Ask a follow-up…"
      streaming={streaming} onStop={() => setStreaming(false)}
      onSubmit={() => setStreaming(true)}
    />
  );
}

// @example Suggestions that send | onSuggestion makes a chip act instead of filling the field.
export function SuggestionsThatSend() {
  const [log, setLog] = useState([]);
  return (
    <Stack gap={12} align="center" style={{ width: "100%" }}>
      <ChatInput
        models={[]}
        suggestions={["Summarize overnight tickets", "What's open with Acme?", "Who is waiting on Dana?"]}
        onSuggestion={(s) => setLog((l) => [s, ...l].slice(0, 3))}
        onSubmit={(t) => setLog((l) => [t, ...l].slice(0, 3))}
      />
      <Text size="sm" secondary>{log[0] ? `Asked: ${log[0]}` : "Pick a suggestion"}</Text>
    </Stack>
  );
}

// @example Disabled | Every control is off, for example while the agent is paused.
export function Disabled() {
  return (
    <ChatInput disabled value="" onChange={() => {}} models={MODELS} onAttach={() => {}} onVoice={() => {}}
      attachments={[{ id: "a", name: "tickets.csv", kind: "12 KB" }]} placeholder="Alpha is paused" />
  );
}
