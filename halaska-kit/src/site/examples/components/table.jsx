import { Avatar, Badge, Stack, Table, Text } from "../../kit";

export const usage = `import { Table } from "./halaska-kit";

<Table
  columns={["Ticket", "Customer", "Status"]}
  rows={[
    ["#4821", "Acme", "Open"],
    ["#4822", "Lumen Labs", "Resolved"],
  ]}
/>`;

// @example Default | Columns are labels and each row is a list of cells.
export function Default() {
  return (
    <div style={{ width: 480 }}>
      <Table
        columns={["Ticket", "Customer", "Subject"]}
        rows={[
          ["#4821", "Acme", "Refund request"],
          ["#4822", "Lumen Labs", "Login loop on mobile"],
          ["#4823", "Fjord Health", "Invoice question"],
        ]}
      />
    </div>
  );
}

// @example Rich cells | A cell can be any element, such as a badge or an avatar.
export function RichCells() {
  return (
    <div style={{ width: 520 }}>
      <Table
        columns={["Ticket", "Owner", "Status"]}
        rows={[
          [
            "#4821",
            <Stack direction="row" gap={8} align="center"><Avatar name="Sam Keller" size={20} /><Text size="sm">Sam Keller</Text></Stack>,
            <Badge variant="warning">Needs approval</Badge>,
          ],
          [
            "#4822",
            <Stack direction="row" gap={8} align="center"><Avatar name="Dana Ruiz" size={20} /><Text size="sm">Dana Ruiz</Text></Stack>,
            <Badge variant="success">Resolved</Badge>,
          ],
          [
            "#4823",
            <Stack direction="row" gap={8} align="center"><Avatar name="Priya Nair" size={20} /><Text size="sm">Priya Nair</Text></Stack>,
            <Badge>Open</Badge>,
          ],
        ]}
      />
    </div>
  );
}

// @example Numbers | Use mono text for figures so the digits line up.
export function Numbers() {
  return (
    <div style={{ width: 440 }}>
      <Table
        columns={["Customer", "Plan", "Refunded"]}
        rows={[
          ["Acme", "Team", <Text size="sm" mono>$120.00</Text>],
          ["Cobalt Dental", "Starter", <Text size="sm" mono>$0.00</Text>],
          ["Brightline", "Team", <Text size="sm" mono>$48.50</Text>],
        ]}
      />
    </div>
  );
}

// @example Empty | With no rows, only the header shows.
export function Empty() {
  return (
    <div style={{ width: 440 }}>
      <Table columns={["Ticket", "Customer", "Subject"]} rows={[]} />
    </div>
  );
}
