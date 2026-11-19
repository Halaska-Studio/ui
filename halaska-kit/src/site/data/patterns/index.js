// Site-side guidance for each pattern, keyed by the pattern id in the kit's
// PATTERN_GROUPS registry (pat-*). Pure data. Split by lifecycle group.
import navigation from "./navigation.js";
import conversation from "./conversation.js";
import trust from "./trust.js";
import control from "./control.js";
import output from "./output.js";
import ambient from "./ambient.js";

export const PATTERN_DOCS = { ...navigation, ...conversation, ...trust, ...control, ...output, ...ambient };

// Two or three sentences per lifecycle group, keyed by group id (grp-*).
export { GROUP_INTROS } from "./groups.js";

export const patternSlug = (id) => id.replace(/^pat-/, "");
export const groupSlug = (id) => id.replace(/^grp-/, "");
