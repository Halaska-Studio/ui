import { AlertBanner, Stack } from "../../kit";

export const usage = `import { AlertBanner } from "./halaska-kit";

<AlertBanner title="Intercom is connected" description="Alpha can now read the support inbox." />`;

// @example Default | A neutral note with a title and a description.
export function Default() {
  return (
    <div style={{ width: 400 }}>
      <AlertBanner
        title="Alpha is in suggest mode"
        description="It drafts replies and waits for you to send them."
      />
    </div>
  );
}

// @example Success | Confirms that something worked.
export function Success() {
  return (
    <div style={{ width: 400 }}>
      <AlertBanner
        variant="success"
        title="Refund sent"
        description="Acme was refunded $120 through Stripe for ticket #4821."
      />
    </div>
  );
}

// @example Warning | Something needs attention soon but nothing is broken.
export function Warning() {
  return (
    <div style={{ width: 400 }}>
      <AlertBanner
        variant="warning"
        title="Refund cap almost reached"
        description="Alpha has used $460 of its $500 weekly refund cap."
      />
    </div>
  );
}

// @example Danger | A failure, with what happened and what to do next.
export function Danger() {
  return (
    <div style={{ width: 400 }}>
      <AlertBanner
        variant="danger"
        title="Linear sync failed"
        description="The token expired. Reconnect Linear to keep filing issues."
      />
    </div>
  );
}

// @example Title only | A single line when no detail is needed.
export function TitleOnly() {
  return (
    <Stack gap={8} style={{ width: 400 }}>
      <AlertBanner title="Notion runbooks were updated today." />
      <AlertBanner variant="success" title="All 12 tickets are assigned." />
    </Stack>
  );
}
