import { DataTable } from "../../kit";

export const usage = `import { DataTable } from "./halaska-kit";

<DataTable
  columns={["Ticket", "Customer", "Status"]}
  rows={[
    ["#4821", "Acme", "Open"],
    ["#4822", "Lumen Labs", "Resolved"],
  ]}
/>`;

// @example Default | Headers sort the rows and each row has a checkbox.
export function Default() {
  return (
    <div style={{ width: 520 }}>
      <DataTable
        columns={["Ticket", "Customer", "Status", "Owner"]}
        rows={[
          ["#4821", "Acme", "Needs approval", "Alpha"],
          ["#4822", "Lumen Labs", "Resolved", "Sam Keller"],
          ["#4823", "Fjord Health", "Open", "Dana Ruiz"],
          ["#4824", "Brightline", "Waiting", "Alpha"],
        ]}
      />
    </div>
  );
}

// @example Numbers | Numeric cells sort by value when you pass them as numbers.
export function Numbers() {
  return (
    <div style={{ width: 460 }}>
      <DataTable
        columns={["Customer", "Open tickets", "Refunds"]}
        rows={[
          ["Acme", 12, 3],
          ["Cobalt Dental", 4, 0],
          ["Fjord Health", 27, 5],
          ["Lumen Labs", 9, 1],
        ]}
      />
    </div>
  );
}

// @example Empty | With no rows, only the header shows. Pair it with an empty state.
export function Empty() {
  return (
    <div style={{ width: 460 }}>
      <DataTable columns={["Ticket", "Customer", "Status"]} rows={[]} />
    </div>
  );
}
