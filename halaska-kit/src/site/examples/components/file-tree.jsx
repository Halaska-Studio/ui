import { Card, FileTree } from "../../kit";

export const usage = `import { FileTree } from "./halaska-kit";

<FileTree
  data={[
    { name: "agents", children: [{ name: "alpha.config.ts" }] },
    { name: "package.json" },
  ]}
/>`;

// @example Default | Folders have children. Files do not.
export function Default() {
  return (
    <FileTree
      style={{ width: 280 }}
      data={[
        {
          name: "agents",
          children: [
            { name: "alpha.config.ts" },
            { name: "refund-policy.md" },
          ],
        },
        {
          name: "integrations",
          children: [
            { name: "intercom.ts" },
            { name: "stripe.ts" },
          ],
        },
        { name: "package.json" },
      ]}
    />
  );
}

// @example Badges | Mark the files an agent added or changed.
export function Badges() {
  return (
    <FileTree
      style={{ width: 280 }}
      data={[
        {
          name: "integrations",
          children: [
            { name: "intercom.ts", badge: "M" },
            { name: "linear.ts", badge: "New" },
            { name: "stripe.ts" },
          ],
        },
        { name: "README.md", badge: "M" },
      ]}
    />
  );
}

// @example Collapsed folders | Set defaultOpen to false on a folder to start it closed.
export function Collapsed() {
  return (
    <FileTree
      style={{ width: 280 }}
      data={[
        {
          name: "runbooks",
          children: [
            { name: "refunds.md" },
            { name: "outages.md" },
          ],
        },
        {
          name: "node_modules",
          defaultOpen: false,
          children: [{ name: "react" }, { name: "react-dom" }],
        },
        {
          name: "tests",
          defaultOpen: false,
          children: [{ name: "refunds.test.ts" }],
        },
      ]}
    />
  );
}

// @example Nested | Folders nest to any depth.
export function Nested() {
  return (
    <FileTree
      style={{ width: 280 }}
      data={[
        {
          name: "src",
          children: [
            {
              name: "agents",
              children: [
                {
                  name: "alpha",
                  children: [
                    { name: "plan.ts" },
                    { name: "tools.ts", badge: "M" },
                  ],
                },
              ],
            },
            { name: "index.ts" },
          ],
        },
      ]}
    />
  );
}

// @example In a card | Framed as the list of files changed in a run.
export function InCard() {
  return (
    <Card padding={12} style={{ width: 300 }}>
      <FileTree
        data={[
          {
            name: "integrations",
            children: [
              { name: "stripe.ts", badge: "M" },
              { name: "stripe.test.ts", badge: "New" },
            ],
          },
          { name: "CHANGELOG.md", badge: "M" },
        ]}
      />
    </Card>
  );
}
