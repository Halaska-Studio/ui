import { useState } from "react";
import { Rating, Stack, Text } from "../../kit";

export const usage = `import { Rating } from "./halaska-kit";

const [score, setScore] = useState(4);

<Rating value={score} onChange={setScore} />`;

// @example Default | Five stars, controlled.
export function Default() {
  const [score, setScore] = useState(4);
  return <Rating value={score} onChange={setScore} />;
}

// @example With a label | Put the score in text beside the stars.
export function WithLabel() {
  const [score, setScore] = useState(3);
  return (
    <Stack direction="row" gap={12} align="center">
      <Text size="sm" secondary>Rate this reply</Text>
      <Rating value={score} onChange={setScore} />
      <Text size="sm" mono secondary>{score}/5</Text>
    </Stack>
  );
}

// @example Read only | Shows a score that cannot be changed.
export function ReadOnly() {
  return (
    <Stack direction="row" gap={12} align="center">
      <Rating value={4} readOnly />
      <Text size="sm" secondary>Acme, ticket #4821</Text>
    </Stack>
  );
}

// @example Sizes | The size prop sets the star size in pixels.
export function Sizes() {
  return (
    <Stack gap={12} align="center">
      <Rating value={3} size={14} readOnly />
      <Rating value={3} readOnly />
      <Rating value={3} size={28} readOnly />
    </Stack>
  );
}

// @example Custom maximum | Any number of stars.
export function CustomMax() {
  const [score, setScore] = useState(7);
  return <Rating value={score} onChange={setScore} max={10} />;
}
