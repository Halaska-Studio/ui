import { ListItem, MiddleTruncate, Stack, Text } from "../../kit";

export const usage = `import { MiddleTruncate } from "./halaska-kit";

<div style={{ width: 200 }}>
  <MiddleTruncate text="re_3PqL82KxT9vB4nW7cZ1mH6dF4821" />
</div>`;

// @example Default | The middle gives way when the container is narrower than the text.
export function Default() {
  return (
    <div style={{ width: 200 }}>
      <MiddleTruncate text="re_3PqL82KxT9vB4nW7cZ1mH6dF4821" />
    </div>
  );
}

// @example Tail length | Tail sets how many characters stay visible at the end.
export function TailLength() {
  return (
    <Stack gap={8} style={{ width: 220 }}>
      <MiddleTruncate text="cus_Nw8Lk2Qp5Rt7Yx3Vb9Acme2026" tail={4} />
      <MiddleTruncate text="cus_Nw8Lk2Qp5Rt7Yx3Vb9Acme2026" tail={8} />
      <MiddleTruncate text="cus_Nw8Lk2Qp5Rt7Yx3Vb9Acme2026" tail={12} />
    </Stack>
  );
}

// @example Sans text | Turn mono off for file names and titles. A longer tail keeps the extension.
export function SansText() {
  return (
    <div style={{ width: 220 }}>
      <MiddleTruncate text="northwind-refund-policy-and-escalation-runbook.pdf" mono={false} tail={10} />
    </div>
  );
}

// @example Widths | The same id at three widths. With enough room it shows in full.
export function Widths() {
  return (
    <Stack gap={8}>
      {[140, 220, 320].map((width) => (
        <div key={width} style={{ width }}>
          <MiddleTruncate text="in_1Qx7Lm2Np4Rs6Tv8Wz0Bd4821" />
        </div>
      ))}
    </Stack>
  );
}

// @example In a row | Keeps a long id readable inside a narrow column.
export function InARow() {
  return (
    <div style={{ width: 340 }}>
      <ListItem
        title="Refund to Acme"
        subtitle="Stripe, ticket #4821"
        right={
          <div style={{ width: 120 }}>
            <MiddleTruncate text="re_3PqL82KxT9vB4nW7cZ1mH6dF4821" />
          </div>
        }
        divider={false}
      />
      <Text size="sm" muted style={{ display: "block", padding: "0 16px" }}>Sent by Alpha, approved by Sam Keller</Text>
    </div>
  );
}
