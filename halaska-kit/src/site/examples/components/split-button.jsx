import { useState } from "react";
import { SplitButton, Stack, Text } from "../../kit";

export const usage = `import { SplitButton } from "./halaska-kit";

<SplitButton
  onClick={sendReply}
  items={[
    { label: "Send and close ticket", onClick: sendAndClose },
    { label: "Schedule for 9:00", onClick: scheduleReply },
  ]}
>
  Send reply
</SplitButton>`;

// @example Default | The main action on the left, related actions behind the chevron.
export function Default() {
  return (
    <div style={{ height: 180 }}>
      <SplitButton
        items={[
          { label: "Send and close ticket" },
          { label: "Send and snooze" },
          { label: "Schedule for 9:00" },
        ]}
      >
        Send reply
      </SplitButton>
    </div>
  );
}

// @example Variants | Takes the same variants as Button.
export function Variants() {
  const items = [{ label: "Deploy to staging" }, { label: "Deploy to production" }];
  return (
    <Stack direction="row" gap={12} wrap justify="center" style={{ height: 150 }}>
      <SplitButton variant="primary" items={items}>Deploy</SplitButton>
      <SplitButton variant="accent" items={items}>Deploy</SplitButton>
      <SplitButton variant="secondary" items={items}>Deploy</SplitButton>
    </Stack>
  );
}

// @example Sizes | Takes the same sizes as Button.
export function Sizes() {
  const items = [{ label: "Assign to Dana Ruiz" }, { label: "Assign to Sam Keller" }];
  return (
    <Stack direction="row" gap={12} wrap justify="center" align="flex-start" style={{ height: 150 }}>
      <SplitButton size="sm" variant="secondary" items={items}>Assign</SplitButton>
      <SplitButton size="md" variant="secondary" items={items}>Assign</SplitButton>
      <SplitButton size="lg" variant="secondary" items={items}>Assign</SplitButton>
    </Stack>
  );
}

// @example With meta and a destructive item | An item can carry a short meta label, and danger marks a destructive one.
export function WithMeta() {
  return (
    <div style={{ height: 190 }}>
      <SplitButton
        variant="secondary"
        items={[
          { label: "Refund in full", meta: "$240" },
          { label: "Refund last invoice", meta: "$80" },
          { label: "Cancel subscription", danger: true },
        ]}
      >
        Issue refund
      </SplitButton>
    </div>
  );
}

// @example With handlers | The main button and each item call their own handler.
export function WithHandlers() {
  const [status, setStatus] = useState("Draft ready for Lumen Labs");
  return (
    <Stack gap={12} align="center" style={{ height: 190 }}>
      <Text size="sm" secondary>{status}</Text>
      <SplitButton
        onClick={() => setStatus("Reply sent")}
        items={[
          { label: "Send and close ticket", onClick: () => setStatus("Reply sent, ticket #4821 closed") },
          { label: "Schedule for 9:00", onClick: () => setStatus("Reply scheduled for 9:00") },
        ]}
      >
        Send reply
      </SplitButton>
    </Stack>
  );
}
