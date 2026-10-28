import { useState } from "react";
import { Marker, Text } from "../../kit";

export const usage = `import { Marker } from "./halaska-kit";

<p>
  Refunds up to $100 are approved by Alpha
  <Marker n={1} source={{ name: "Notion · Runbooks", title: "Refund policy", url: "https://notion.so/…", snippet: "Refunds up to $100 are approved by Alpha." }} onOpen={(s) => window.open(s.url)} />.
</p>`;

const MARKER_DEMO_SOURCES = [
  { name: "Notion · Runbooks", title: "Refund policy, updated March 2026", url: "https://notion.so/northwind/refund-policy", snippet: "Refunds up to $100 are approved by Alpha. Larger refunds wait for Priya Nair." },
  { name: "Stripe · Payments", title: "Charge ch_3Qx for Acme, 14 Oct", url: "https://dashboard.stripe.com/payments/ch_3Qx", snippet: "$89.00 · Succeeded · Card ending 4242." },
  { name: "Intercom · Conversation", title: "Acme, Sam Keller, yesterday", url: "https://app.intercom.com/inbox/12041", snippet: "We were charged twice this month, can you look into it?" },
];

// @example In a paragraph | Three numbered markers inside Alpha's answer. Hover or focus previews the source, Enter opens it.
export function InAParagraph() {
  return (
    <Text size="base" as="p" style={{ margin: 0, maxWidth: 400 }}>
      Acme was charged twice on 14 October
      <Marker n={1} source={MARKER_DEMO_SOURCES[1]} />
      , so a refund of $89 falls under Alpha's cap
      <Marker n={2} source={MARKER_DEMO_SOURCES[0]} />
      . Sam Keller raised it yesterday
      <Marker n={3} source={MARKER_DEMO_SOURCES[2]} />
      , and the refund is queued for review.
    </Text>
  );
}

// @example Dot | variant="dot" marks the spot without a number, for dense text.
export function Dot() {
  return (
    <Text size="base" as="p" style={{ margin: 0, maxWidth: 400 }}>
      The refund cap is $100
      <Marker variant="dot" n={1} source={MARKER_DEMO_SOURCES[0]} />
      and the second charge was $89
      <Marker variant="dot" n={2} source={MARKER_DEMO_SOURCES[1]} />
      , so no approval is needed.
    </Text>
  );
}

// @example Name | variant="name" shows the source name in the pill.
export function Name() {
  return (
    <Text size="base" as="p" style={{ margin: 0, maxWidth: 400 }}>
      Larger refunds wait for Priya Nair
      <Marker variant="name" n={1} source={MARKER_DEMO_SOURCES[0]} />
      , which the customer was told in the thread
      <Marker variant="name" n={2} source={MARKER_DEMO_SOURCES[2]} />
      .
    </Text>
  );
}

// @example Open callback | onOpen receives the source on click or Enter.
export function OpenCallback() {
  const [opened, setOpened] = useState(null);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, maxWidth: 400 }}>
      <Text size="base" as="p" style={{ margin: 0 }}>
        Two sources back this answer
        <Marker n={1} source={MARKER_DEMO_SOURCES[0]} onOpen={(s) => setOpened(s.name)} />
        <Marker n={2} source={MARKER_DEMO_SOURCES[1]} onOpen={(s) => setOpened(s.name)} />
        .
      </Text>
      <Text size="sm" secondary>{opened ? `Opened ${opened}.` : "Nothing opened yet."}</Text>
    </div>
  );
}
