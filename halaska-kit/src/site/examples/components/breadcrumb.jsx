import { useState } from "react";
import { Breadcrumb, Stack, Text } from "../../kit";

export const usage = `import { Breadcrumb } from "./halaska-kit";

<Breadcrumb
  items={[
    { label: "Inbox", onClick: goToInbox },
    { label: "Acme", onClick: goToAcme },
    { label: "#4821" },
  ]}
/>`;

// @example Default | The last item is the current page.
export function Default() {
  return <Breadcrumb items={[{ label: "Inbox" }, { label: "Acme" }, { label: "#4821" }]} />;
}

// @example With a home icon | Set home to lead with the root of the app.
export function WithHome() {
  return <Breadcrumb home items={[{ label: "Customers" }, { label: "Fjord Health" }, { label: "Billing" }]} />;
}

// @example Collapsed | maxVisible keeps the first and last items and folds the rest.
export function Collapsed() {
  return (
    <Breadcrumb
      home
      maxVisible={3}
      items={[
        { label: "Runbooks" },
        { label: "Billing" },
        { label: "Refunds" },
        { label: "Over the cap" },
        { label: "Approval steps" },
      ]}
    />
  );
}

// @example Clickable | Items with an onClick get a pointer cursor.
export function Clickable() {
  const [page, setPage] = useState("#4821");
  return (
    <Stack gap={12} align="center">
      <Breadcrumb
        items={[
          { label: "Inbox", onClick: () => setPage("Inbox") },
          { label: "Lumen Labs", onClick: () => setPage("Lumen Labs") },
          { label: "#4821" },
        ]}
      />
      <Text size="sm" secondary>Viewing: {page}</Text>
    </Stack>
  );
}
