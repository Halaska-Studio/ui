import { MediaGeneration } from "../../kit";

export const usage = `import { MediaGeneration } from "./halaska-kit";

<MediaGeneration
  prompt="Hero image for the Northwind status page: a calm control room at dawn."
  status="generating"
  progress={42}
  etaSeconds={9}
  aspect="16:9"
  onRegenerate={() => start()}
/>`;

// @example Queued to done | The default walks queued, generating and done on its own. Regenerate runs it again.
export function QueuedToDone() {
  return <MediaGeneration />;
}

// @example Generating | autoplay={false} pins the state: here, 42 percent with nine seconds left.
export function Generating() {
  return <MediaGeneration autoplay={false} status="generating" progress={42} etaSeconds={9} />;
}

// @example Variations | Four frames when done, each a button that reports its index.
export function Variations() {
  return (
    <MediaGeneration
      autoplay={false}
      status="done"
      aspect="1:1"
      variations={4}
      prompt="Four icon options for the Northwind status page, flat, single colour."
      onVariation={(i) => console.log("variation", i)}
    />
  );
}

// @example Failed | The error reads plainly and Retry fires onRegenerate.
export function Failed() {
  return (
    <MediaGeneration
      autoplay={false}
      status="failed"
      aspect="4:3"
      error="The image service timed out after 60 seconds. Nothing was charged."
    />
  );
}

// @example Portrait | aspect="9:16" keeps a phone-shaped frame at a narrower width.
export function Portrait() {
  return <MediaGeneration autoplay={false} status="generating" progress={68} etaSeconds={4} aspect="9:16" prompt="Story-sized version of the launch visual for Lumen Labs." />;
}
