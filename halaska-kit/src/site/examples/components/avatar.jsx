import { Avatar, AvatarGroup, Stack, Text } from "../../kit";

export const usage = `import { Avatar } from "./halaska-kit";

<Avatar name="Sam Keller" />`;

// @example Default | Initials on a colour picked from the name, so each person keeps the same colour.
export function Default() {
  return (
    <Stack direction="row" gap={12} align="center" justify="center">
      <Avatar name="Sam Keller" />
      <Avatar name="Dana Ruiz" />
      <Avatar name="Priya Nair" />
    </Stack>
  );
}

// @example Sizes | Size is a pixel value. The initials scale with it.
export function Sizes() {
  return (
    <Stack direction="row" gap={12} align="center" justify="center">
      <Avatar name="Dana Ruiz" size={24} />
      <Avatar name="Dana Ruiz" size={32} />
      <Avatar name="Dana Ruiz" size={40} />
      <Avatar name="Dana Ruiz" size={56} />
    </Stack>
  );
}

// @example With a name | Put the full name beside the avatar in lists and headers.
export function WithName() {
  return (
    <Stack direction="row" gap={12} align="center" justify="center">
      <Avatar name="Priya Nair" size={40} />
      <Stack gap={0}>
        <Text weight="medium">Priya Nair</Text>
        <Text size="sm" muted>Support lead, Northwind</Text>
      </Stack>
    </Stack>
  );
}

// @example Group | Overlapping avatars for everyone on a ticket.
export function Group() {
  return <AvatarGroup names={["Sam Keller", "Dana Ruiz", "Priya Nair"]} />;
}

// @example Group with overflow | Names past the max collapse into a count. Works for accounts as well as people.
export function GroupOverflow() {
  return (
    <AvatarGroup
      names={["Acme", "Lumen Labs", "Fjord Health", "Brightline", "Cobalt Dental"]}
      max={3}
      size={32}
    />
  );
}
