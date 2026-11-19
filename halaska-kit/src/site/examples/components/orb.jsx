import { useEffect, useState } from "react";
import { Orb, Stack, Text } from "../../kit";

export const usage = `import { Orb } from "./halaska-kit";

<Orb variant="orbit" pill label="Searching Intercom" />`;

// @example Default | The pulse variant: a small lattice that swells from the centre.
export function Default() {
  return <Orb size={32} />;
}

// @example Variants | Five variants, each tied to what the agent is doing.
export function Variants() {
  return (
    <Stack direction="row" gap={32} align="center">
      <Stack gap={10} align="center">
        <Orb variant="pulse" size={28} />
        <Text size="xs" mono secondary>pulse</Text>
      </Stack>
      <Stack gap={10} align="center">
        <Orb variant="orbit" size={28} />
        <Text size="xs" mono secondary>orbit</Text>
      </Stack>
      <Stack gap={10} align="center">
        <Orb variant="sweep" size={28} />
        <Text size="xs" mono secondary>sweep</Text>
      </Stack>
      <Stack gap={10} align="center">
        <Orb variant="globe" size={28} />
        <Text size="xs" mono secondary>globe</Text>
      </Stack>
      <Stack gap={10} align="center">
        <Orb variant="spark" size={28} />
        <Text size="xs" mono secondary>spark</Text>
      </Stack>
    </Stack>
  );
}

// @example Sizes | Any pixel size. The default is 20.
export function Sizes() {
  return (
    <Stack direction="row" gap={24} align="center">
      <Orb variant="orbit" size={14} />
      <Orb variant="orbit" />
      <Orb variant="orbit" size={32} />
      <Orb variant="orbit" size={48} />
    </Stack>
  );
}

// @example Pill | Wraps the glyph in a status pill. Without a label it names the variant's task.
export function Pill() {
  return (
    <Stack direction="row" gap={12} wrap align="center" justify="center">
      <Orb pill />
      <Orb variant="orbit" pill />
      <Orb variant="sweep" pill />
      <Orb variant="globe" pill />
      <Orb variant="spark" pill />
    </Stack>
  );
}

// @example Pill with a label | Say what the agent is working on.
export function PillWithLabel() {
  return (
    <Stack gap={12} align="center">
      <Orb variant="orbit" pill label="Searching Intercom" />
      <Orb variant="sweep" pill label="Drafting a reply to Acme" />
      <Orb variant="spark" pill label="Waiting for Dana Ruiz" />
    </Stack>
  );
}

// @example Custom colour | Any CSS colour. The default follows the secondary text colour.
export function CustomColour() {
  return (
    <Stack direction="row" gap={24} align="center">
      <Orb size={28} color="#8b5cf6" />
      <Orb variant="orbit" size={28} color="#10b981" />
      <Orb variant="globe" size={28} color="#f59e0b" />
      <Orb variant="sweep" pill color="#8b5cf6" label="Writing the summary" />
    </Stack>
  );
}

// @example Following a run | Swap the variant and label as the agent moves between tasks.
export function FollowingRun() {
  const stages = [
    { variant: "orbit", label: "Searching Intercom" },
    { variant: "pulse", label: "Checking the Stripe invoice" },
    { variant: "globe", label: "Planning the refund" },
    { variant: "sweep", label: "Drafting a reply to Acme" },
  ];
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => setIndex((i) => (i + 1) % stages.length), 2200);
    return () => clearInterval(timer);
  }, [stages.length]);
  return <Orb pill variant={stages[index].variant} label={stages[index].label} />;
}
