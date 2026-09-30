// Guidance for the Agentic navigation group (grp-agentic-nav).
export default {
  "pat-context-bar": {
    useWhen: "Use when the agent can help on many different screens and users should not have to open a chat to find out how.",
    do: [
      "Keep the bar to two agent suggestions and one action of the user's own, so the choice stays quick.",
      "Make agent suggestions and user actions look different. Here suggestions are tinted with a spark and the user's action is solid, after a divider.",
      "Replace the items with a status line while something runs, so the bar says what is happening in the same place the user tapped.",
    ],
    dont: [
      "Don't show the same suggestions on every screen. If the items never change, it is a toolbar.",
      "Don't let the bar jump between widths. Ease it, and take longer for bigger changes.",
      "Don't put destructive or irreversible actions in the bar. They need a confirmation it has no room for.",
    ],
    neighbours: [
      { id: "pat-search", when: "when the user already knows what they want and will type it." },
      { id: "pat-inline-assist", when: "when the help belongs inside the text being written, not beside it." },
    ],
    states: [
      { name: "Resting", note: "A microphone, two tinted agent suggestions, a divider, one solid user action and two icon actions. The bar is exactly as wide as its items." },
      { name: "Context change", note: "The heading and content swap, the old items leave, the new ones enter one after another, and the bar eases to its new width. Bigger changes take longer." },
      { name: "Agent working", note: "After an agent suggestion is chosen the items give way to a status line, \"Alpha is on it: Draft a reply\", then return." },
      { name: "Action confirmed", note: "After the user's own action or an icon action, a tick and a short confirmation such as \"Sent to Priya\" show briefly." },
      { name: "Listening", note: "The microphone fills with the accent and the bar shows a pulsing dot beside \"Listening\"." },
    ],
    usage: `import { ContextBarPattern } from "./halaska-kit";

<ContextBarPattern />`,
  },

  "pat-space-deck": {
    useWhen: "Use when one person runs several agents across separate parts of their life or work, and switching between them has to take one gesture.",
    do: [
      "Keep the focus frame still and move the cards behind it, so the eye never has to find the selection.",
      "Give each space its own colour and carry it onto the frame, so a change of space is felt as well as read.",
      "Show position with one small indicator for both axes. It answers \"where am I\" without arrows.",
    ],
    dont: [
      "Don't wrap at the edges. Let the grid resist and settle back, so the ends are clear.",
      "Don't use the deck for a single list of agents. One axis of choice is a row of tabs or a menu.",
      "Don't pack the cards with detail. Name, role, schedule counts and status are enough to choose by.",
    ],
    neighbours: [
      { id: "pat-agent-setup", when: "when the job is creating a new agent, not choosing between the ones you have." },
      { id: "pat-taskboard", when: "when people need to see the work each agent is doing, not pick an agent." },
    ],
    states: [
      { name: "Settled", note: "One agent card sits at full size inside the fixed frame. The frame's ring takes the space's colour and the dot indicator marks the current cell." },
      { name: "Dragging", note: "The drag locks to one axis after a few pixels. The focused card eases back to 0.9 scale and the grid follows the pointer." },
      { name: "Landing", note: "On release past the commit distance the grid glides one cell, the new card grows to full size and the indicator dot moves with it. A shorter drag snaps back." },
      { name: "At an edge", note: "Dragging past the first or last row or column moves the grid at a third of the distance, then it settles back. Nothing wraps." },
      { name: "Agent status", note: "Each card shows Online or Idle at the bottom, with its scheduled and recurring counts above." },
    ],
    usage: `import { SpaceDeckPattern } from "./halaska-kit";

<SpaceDeckPattern />`,
  },
};
