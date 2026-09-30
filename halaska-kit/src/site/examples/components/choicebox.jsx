import { useState } from "react";
import { Choicebox } from "../../kit";

export const usage = `import { Choicebox } from "./halaska-kit";

const [mode, setMode] = useState("confirm");

<Choicebox
  value={mode}
  onChange={setMode}
  options={[
    { id: "suggest", title: "Suggest", description: "Alpha drafts, you send." },
    { id: "confirm", title: "Confirm", description: "Alpha asks before it acts." },
  ]}
/>`;

// @example Default | One choice from a short list, each with a line of explanation.
export function Default() {
  const [mode, setMode] = useState("confirm");
  return (
    <div style={{ width: 360 }}>
      <Choicebox
        value={mode}
        onChange={setMode}
        options={[
          { id: "suggest", title: "Suggest", description: "Alpha drafts replies. You send them." },
          { id: "confirm", title: "Confirm", description: "Alpha asks before it sends or refunds." },
          { id: "auto", title: "Autonomous", description: "Alpha acts and reports back." },
        ]}
      />
    </div>
  );
}

// @example Multiple | Pass multiple and an array value. The marker becomes a checkbox.
export function Multiple() {
  const [tools, setTools] = useState(["intercom", "linear"]);
  return (
    <div style={{ width: 360 }}>
      <Choicebox
        multiple
        value={tools}
        onChange={setTools}
        options={[
          { id: "intercom", title: "Intercom", description: "Read and reply to the support inbox." },
          { id: "linear", title: "Linear", description: "Create and update issues." },
          { id: "stripe", title: "Stripe", description: "Look up invoices and issue refunds." },
        ]}
      />
    </div>
  );
}

// @example With meta | A short mono label on the right for a price, a limit or a count.
export function WithMeta() {
  const [cap, setCap] = useState("50");
  return (
    <div style={{ width: 360 }}>
      <Choicebox
        value={cap}
        onChange={setCap}
        options={[
          { id: "50", title: "Small refunds", description: "No approval needed.", meta: "$50" },
          { id: "200", title: "Standard refunds", description: "Sam Keller is notified.", meta: "$200" },
          { id: "500", title: "Large refunds", description: "Dana Ruiz approves each one.", meta: "$500" },
        ]}
      />
    </div>
  );
}

// @example Titles only | Leave out the description for a denser list.
export function TitlesOnly() {
  const [inbox, setInbox] = useState("support");
  return (
    <div style={{ width: 280 }}>
      <Choicebox
        value={inbox}
        onChange={setInbox}
        options={[
          { id: "support", title: "Support", meta: "42" },
          { id: "billing", title: "Billing", meta: "9" },
          { id: "sales", title: "Sales", meta: "3" },
        ]}
      />
    </div>
  );
}
