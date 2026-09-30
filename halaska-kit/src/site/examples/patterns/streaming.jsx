import { useState } from "react";
import { StreamingAnswerPattern } from "../../kit";

// @example Thinking | Before the first word arrives: a label that says what Alpha is doing.
export function Thinking() {
  return <StreamingAnswerPattern thinkingLabel="Reading Fjord Health's tickets" thinkMs={600000} />;
}

// @example Streaming | The answer arrives behind a caret, and each source chip lands at the claim it supports.
export function Streaming() {
  return (
    <StreamingAnswerPattern
      segments={[
        { t: "Fjord Health has two open tickets, both about invoice exports timing out." },
        { chip: "intercom.com" },
        { t: " Priya has a fix in review, so a reply with the manual export steps will cover them until it ships." },
        { chip: "linear.app" },
      ]}
      sources={[
        { name: "Intercom", domain: "intercom.com" },
        { name: "Linear", domain: "linear.app" },
      ]}
      followups={["Draft the reply to Fjord Health", "When does the fix ship?"]}
      thinkMs={400}
      charsPerTick={1}
      tickMs={45}
    />
  );
}

// @example Complete | The finished answer with its sources and follow-ups, rendered with no animation.
export function Complete() {
  return <StreamingAnswerPattern autoplay={false} />;
}

const ANSWERS = {
  start: {
    segments: [
      { t: "Brightline was charged twice for September." },
      { chip: "stripe.com" },
      { t: " The second charge came from a retry after a card timeout, so one of them should be refunded." },
    ],
    followups: ["Is the refund inside Alpha's limit?"],
  },
  "Is the refund inside Alpha's limit?": {
    segments: [
      { t: "Yes. The duplicate charge is $240 and the runbook lets Alpha refund up to $500 without sign-off." },
      { chip: "notion.so" },
    ],
    followups: [],
  },
};

// @example Your own follow-ups | Pass onFollowup and swap the answer yourself. The stream restarts when the segments change.
export function OwnFollowups() {
  const [key, setKey] = useState("start");
  const answer = ANSWERS[key];
  return (
    <StreamingAnswerPattern
      segments={answer.segments}
      followups={answer.followups}
      sources={[
        { name: "Stripe", domain: "stripe.com" },
        { name: "Notion runbooks", domain: "notion.so" },
      ]}
      thinkingLabel="Checking Stripe"
      followupsLabel="Ask next"
      onFollowup={(text) => setKey(text)}
    />
  );
}
