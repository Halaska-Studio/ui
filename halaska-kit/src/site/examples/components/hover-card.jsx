import { Avatar, Badge, HoverCard, LinkButton, Stack, Text } from "../../kit";

export const usage = `import { HoverCard, LinkButton, Text } from "./halaska-kit";

<HoverCard trigger={<LinkButton>Acme</LinkButton>}>
  <Text size="sm">Team plan, 42 seats</Text>
</HoverCard>`;

// @example Default | A preview of the customer behind a link.
export function Default() {
  return (
    <HoverCard trigger={<LinkButton>Acme</LinkButton>}>
      <Stack gap={4}>
        <Text weight="medium">Acme</Text>
        <Text size="sm" secondary>Team plan, 42 seats</Text>
        <Text size="sm" secondary>3 open tickets, last contact today</Text>
      </Stack>
    </HoverCard>
  );
}

// @example Person | An avatar trigger with a short profile.
export function Person() {
  return (
    <HoverCard trigger={<Avatar name="Dana Ruiz" />}>
      <Stack direction="row" gap={12} align="center">
        <Avatar name="Dana Ruiz" size={40} />
        <Stack gap={2}>
          <Text weight="medium">Dana Ruiz</Text>
          <Text size="sm" secondary>Support lead, on call this week</Text>
        </Stack>
      </Stack>
    </HoverCard>
  );
}

// @example Status detail | Explain a badge without adding text to the row.
export function StatusDetail() {
  return (
    <HoverCard trigger={<Badge variant="warning">Needs approval</Badge>}>
      <Stack gap={4} style={{ width: 240 }}>
        <Text weight="medium">Refund over the $100 cap</Text>
        <Text size="sm" secondary>Alpha drafted a $240 refund for Lumen Labs. Priya Nair can approve it.</Text>
      </Stack>
    </HoverCard>
  );
}
