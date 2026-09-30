import { Snippet, Stack } from "../../kit";

export const usage = `import { Snippet } from "./halaska-kit";

<Snippet text="npx northwind deploy alpha" />`;

// @example Default | A command with a dollar prompt and a copy button.
export function Default() {
  return <Snippet text="npx northwind deploy alpha" style={{ width: 340 }} />;
}

// @example Custom prompt | Any character in place of the dollar sign.
export function CustomPrompt() {
  return (
    <Stack gap={8} style={{ width: 340 }}>
      <Snippet prompt=">" text="alpha status --inbox support" />
      <Snippet prompt="#" text="systemctl restart alpha-worker" />
    </Stack>
  );
}

// @example No prompt | Pass an empty prompt for values that are not commands.
export function NoPrompt() {
  return <Snippet prompt="" text="NORTHWIND_WORKSPACE=ws_northwind_prod" style={{ width: 340 }} />;
}

// @example Long commands | Text that does not fit is cut with an ellipsis. The full command is copied.
export function LongCommand() {
  return (
    <Snippet
      text="curl -X POST https://api.northwind.app/v1/agents/alpha/runs -d ticket=4821"
      style={{ width: 340 }}
    />
  );
}

// @example Steps | Several commands in order.
export function Steps() {
  return (
    <Stack gap={8} style={{ width: 340 }}>
      <Snippet text="npm install" />
      <Snippet text="npx northwind login" />
      <Snippet text="npx northwind deploy alpha" />
    </Stack>
  );
}
