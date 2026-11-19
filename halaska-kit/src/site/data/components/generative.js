// Generative UI and content pieces (added 2026-10-28). Pure data.
export default [
  {
    slug: "attachment",
    name: "Attachment",
    exports: [
      "Attachment"
    ],
    group: "Content",
    shadcn: null,
    status: "halaska",
    tags: [],
    description: "A file chip or card for things attached to a message or a composer, with a tinted letter glyph per file kind and upload progress.",
    a11y: [
      "Each attachment is a group named with the file name and its size or state, for example refund-policy.pdf, 1.2 MB.",
      "The remove button is named with the file, for example Remove refund-policy.pdf.",
      "With onOpen the file name is a real button; without it the name is plain text.",
      "Upload progress is a progressbar with its current value; the failed state is also written out, not only tinted."
    ],
    gaps: [
      "No retry callback in the failed state.",
      "No drag handle or reordering."
    ],
    added: "2026-10-28"
  },
  {
    slug: "document-agent",
    name: "Document Agent",
    exports: [
      "DocumentAgent"
    ],
    group: "Generative UI",
    shadcn: null,
    status: "halaska",
    tags: [
      "AI"
    ],
    description: "A document the agent edits beside you: each suggested change shows the old text struck through and the new text beside it, with Accept and Reject inline.",
    a11y: [
      "Headings render as h1 and h2 elements, paragraphs as p, and list items as real li inside a ul.",
      "Accept and Reject are buttons named with the edit's reason, for example Accept edit: Adds the backup approver.",
      "The header count is a polite live region, so the number of edits to review is announced as they arrive.",
      "Old and new text are told apart by background tint and a strikethrough, so colour alone does not carry the meaning."
    ],
    gaps: [
      "The document is read only: there is no typing into it.",
      "Decisions are internal state; there is no controlled value for accepted edits."
    ],
    added: "2026-10-28"
  },
  {
    slug: "marker",
    name: "Marker",
    exports: [
      "Marker"
    ],
    group: "Content",
    shadcn: null,
    status: "halaska",
    tags: [],
    description: "The small inline citation marker inside a sentence that previews its source on hover or focus and opens it on click.",
    a11y: [
      "The marker is a button named Source N: source name, and Enter or Space fires onOpen like a click.",
      "The source card is linked with aria-describedby and opens on keyboard focus as well as hover.",
      "Escape hides the card; it reappears on the next hover or focus.",
      "The link inside the card is tabbable only while the card is open."
    ],
    gaps: [
      "The card clamps to the viewport, not to a scrolling parent, so it can be clipped by an ancestor with overflow hidden."
    ],
    added: "2026-10-28"
  },
  {
    slug: "media-generation",
    name: "Media Generation",
    exports: [
      "MediaGeneration"
    ],
    group: "Generative UI",
    shadcn: null,
    status: "halaska",
    tags: [
      "AI"
    ],
    description: "The waiting, progress and result states for a generated image or video, in a frame that keeps its aspect ratio throughout.",
    a11y: [
      "A visually hidden polite live region announces each state change: in queue, generating, done, failed.",
      "The progress bar carries the progressbar role with its current value.",
      "Variation frames are buttons named Variation 1, Variation 2 and so on.",
      "The tile shimmer carries data-halaska-calm, so it stops under prefers-reduced-motion."
    ],
    gaps: [
      "No video playback: a video result is shown as its poster image through src.",
      "No cancel control while generating."
    ],
    added: "2026-10-28"
  },
  {
    slug: "result-cards",
    name: "Result Cards",
    exports: [
      "ResultCards"
    ],
    group: "Generative UI",
    shadcn: null,
    status: "halaska",
    tags: [
      "AI"
    ],
    description: "A row or grid of result cards the agent returns inside a reply, one shape for products, places, people and documents.",
    a11y: [
      "The cards are a list named Results, and each card is a list item.",
      "Each title is a real button, or a link when the item has an href, so every card is reachable with Tab.",
      "The action button is named with the item, for example Choose: Helpdesk Pro.",
      "Image tiles are decorative unless the item supplies an image url, which then takes the title as alt text."
    ],
    gaps: [
      "The horizontal row has no previous and next buttons: it relies on native scrolling and the keyboard moving focus between cards.",
      "Selection is single and internal; there is no controlled selected prop."
    ],
    added: "2026-10-28"
  },
];
