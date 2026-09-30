import { useState } from "react";
import { ListItem, Pagination, Stack, Text } from "../../kit";

export const usage = `import { Pagination } from "./halaska-kit";

const [page, setPage] = useState(1);

<Pagination current={page} total={8} onChange={setPage} />`;

// @example Default | A page counter with previous and next.
export function Default() {
  const [page, setPage] = useState(1);
  return (
    <div style={{ width: 320 }}>
      <Pagination current={page} total={8} onChange={setPage} />
    </div>
  );
}

// @example Dots | For short sets such as onboarding steps or a carousel.
export function Dots() {
  const [page, setPage] = useState(2);
  return <Pagination variant="dots" current={page} total={5} onChange={setPage} />;
}

// @example With a list | Slice your data by the current page.
export function WithList() {
  const tickets = [
    { id: "#4821", subject: "Invoice shows the wrong plan", customer: "Acme" },
    { id: "#4822", subject: "Export stuck at 90 percent", customer: "Fjord Health" },
    { id: "#4825", subject: "Seats not updating after upgrade", customer: "Brightline" },
    { id: "#4830", subject: "Refund request", customer: "Lumen Labs" },
    { id: "#4831", subject: "Cannot add a second admin", customer: "Cobalt Dental" },
    { id: "#4834", subject: "Webhook retries failing", customer: "Acme" },
  ];
  const perPage = 2;
  const [page, setPage] = useState(1);
  const visible = tickets.slice((page - 1) * perPage, page * perPage);
  return (
    <div style={{ width: 360 }}>
      {visible.map((ticket) => (
        <ListItem key={ticket.id} title={ticket.subject} subtitle={`${ticket.id}, ${ticket.customer}`} />
      ))}
      <div style={{ marginTop: 12 }}>
        <Pagination current={page} total={tickets.length / perPage} onChange={setPage} />
      </div>
    </div>
  );
}

// @example Dots with content | The active dot stretches to mark the current page.
export function DotsWithContent() {
  const tips = [
    "Alpha triages every new Intercom conversation.",
    "Refunds over $100 wait for your approval.",
    "Runbooks in Notion guide each reply.",
  ];
  const [page, setPage] = useState(1);
  return (
    <Stack gap={16} align="center" style={{ width: 320 }}>
      <Text align="center">{tips[page - 1]}</Text>
      <Pagination variant="dots" current={page} total={tips.length} onChange={setPage} />
    </Stack>
  );
}
