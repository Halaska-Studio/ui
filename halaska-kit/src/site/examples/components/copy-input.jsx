import { CopyInput, Stack } from "../../kit";

export const usage = `import { CopyInput } from "./halaska-kit";

<CopyInput label="Webhook URL" value="https://api.northwind.app/hooks/intercom" />`;

// @example Default | A read-only value with a copy button.
export function Default() {
  return <CopyInput value="https://api.northwind.app/hooks/intercom" style={{ width: 360 }} />;
}

// @example With a label | The label sits above the field.
export function WithLabel() {
  return <CopyInput label="Webhook URL" value="https://api.northwind.app/hooks/intercom" style={{ width: 360 }} />;
}

// @example Long values | Values that do not fit are cut with an ellipsis. The full value is copied.
export function LongValue() {
  return (
    <CopyInput
      label="Share link"
      value="https://northwind.app/alpha/runs/4821?view=transcript&from=intercom"
      style={{ width: 280 }}
    />
  );
}

// @example In a form | Stacked fields for an integration screen.
export function InForm() {
  return (
    <Stack gap={16} style={{ width: 360 }}>
      <CopyInput label="Workspace ID" value="ws_northwind_prod" />
      <CopyInput label="Callback URL" value="https://api.northwind.app/oauth/linear" />
    </Stack>
  );
}
