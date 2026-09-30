// The changelog: a dated list of what shipped, newest first, read from data.
import { usePal, tokens } from "../kit";
import { useSite, usePageMeta } from "../state";
import { PageHeader, DetailLayout, TagPill } from "../ui/bits";
import { UpdatesInline } from "../email/gate";
import { CHANGELOG, VERSION } from "../data/changelog.js";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
// "2026-09-30" to "30 Sep 2026", without going through Date (no timezone shifts).
const formatDate = (iso) => {
  const [y, m, d] = String(iso).split("-").map(Number);
  return y && m && d ? `${d} ${MONTHS[m - 1]} ${y}` : iso;
};

export function Changelog() {
  usePageMeta("Changelog", `What shipped in Halaska UI, newest first. The current version is ${VERSION}.`);
  const { theme } = useSite();
  const pal = usePal(theme);
  return (
    <DetailLayout>
      <PageHeader eyebrow="Docs" title="Changelog" lead="What shipped, newest first.">
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 14 }}>
          <TagPill tone="accent">v{VERSION}</TagPill>
          <span style={{ ...tokens.type.sm, color: pal.textTertiary }}>Current version</span>
        </div>
      </PageHeader>

      <ol style={{ listStyle: "none", margin: 0, padding: 0 }}>
        {CHANGELOG.map((entry, i) => (
          <li key={`${entry.date}-${entry.title}`} className="stack-sm" style={{
            display: "flex", gap: 24, alignItems: "flex-start", padding: "24px 0",
            borderTop: `1px solid ${pal.borderSubtle}`, borderBottom: i === CHANGELOG.length - 1 ? `1px solid ${pal.borderSubtle}` : "none",
          }}>
            <time dateTime={entry.date} style={{ fontFamily: tokens.font.mono, ...tokens.type.sm, color: pal.textTertiary, width: 104, flexShrink: 0, paddingTop: 2 }}>
              {formatDate(entry.date)}
            </time>
            <div style={{ minWidth: 0, flex: 1 }}>
              <h2 style={{ ...tokens.type.md, fontWeight: tokens.weight.semibold, color: pal.text, margin: 0 }}>{entry.title}</h2>
              <ul style={{ margin: "8px 0 0", padding: "0 0 0 18px", display: "flex", flexDirection: "column", gap: 6 }}>
                {(entry.items || []).map((item) => (
                  <li key={item} style={{ ...tokens.type.base, color: pal.textSecondary, lineHeight: 1.65, maxWidth: 600 }}>{item}</li>
                ))}
              </ul>
            </div>
          </li>
        ))}
      </ol>

      <div style={{
        marginTop: 48, padding: 20, borderRadius: tokens.radius.lg, border: `1px solid ${pal.borderSubtle}`, background: pal.bgSubtle,
        display: "flex", flexDirection: "column", gap: 10,
      }}>
        <span style={{ ...tokens.type.base, fontWeight: tokens.weight.medium, color: pal.text }}>Get new patterns by email</span>
        <span style={{ ...tokens.type.sm, color: pal.textSecondary, lineHeight: 1.6, maxWidth: 480 }}>
          An email when components or patterns ship, plus other offers from Halaska Studio.
        </span>
        <UpdatesInline placement="changelog" />
      </div>
    </DetailLayout>
  );
}
