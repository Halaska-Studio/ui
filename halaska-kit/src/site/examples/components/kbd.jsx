import { Kbd, Stack, Text } from "../../kit";

export const usage = `import { Kbd } from "./halaska-kit";

<Kbd>⌘</Kbd> <Kbd>K</Kbd>`;

// @example Default | A single key.
export function Default() {
  return <Kbd>K</Kbd>;
}

// @example Shortcut | One keycap per key, side by side.
export function Shortcut() {
  return (
    <Stack direction="row" gap={4} align="center" justify="center">
      <Kbd>⌘</Kbd>
      <Kbd>Shift</Kbd>
      <Kbd>P</Kbd>
    </Stack>
  );
}

// @example In a sentence | Inline with the text that explains the shortcut.
export function InASentence() {
  return (
    <Stack direction="row" gap={6} align="center" justify="center">
      <Text secondary>Press</Text>
      <Kbd>⌘</Kbd>
      <Kbd>K</Kbd>
      <Text secondary>to ask Alpha anything.</Text>
    </Stack>
  );
}

// @example Shortcut list | Beside each action in a menu or a help panel.
export function ShortcutList() {
  const shortcuts = [
    { action: "Reply to ticket", keys: ["R"] },
    { action: "Assign to me", keys: ["⌘", "I"] },
    { action: "Close ticket", keys: ["⌘", "Enter"] },
  ];
  return (
    <Stack gap={12} style={{ width: 260 }}>
      {shortcuts.map((shortcut) => (
        <Stack key={shortcut.action} direction="row" align="center" justify="space-between">
          <Text>{shortcut.action}</Text>
          <Stack direction="row" gap={4}>
            {shortcut.keys.map((key) => <Kbd key={key}>{key}</Kbd>)}
          </Stack>
        </Stack>
      ))}
    </Stack>
  );
}
