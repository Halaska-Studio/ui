// Footer: links into the browser, the quiet email offer, the studio and Dash.
import { usePal, tokens, Text } from "../kit";
import { useSite } from "../state";
import { Link } from "../router";
import { UpdatesInline } from "../email/gate";
import { VERSION } from "../data/changelog.js";
import { REPO_URL } from "./Header";

export function Footer() {
  const { theme } = useSite();
  const pal = usePal(theme);
  const col = (title, links) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 8, minWidth: 130 }}>
      <span style={{ ...tokens.type.xs, fontFamily: tokens.font.mono, letterSpacing: "0.08em", textTransform: "uppercase", color: pal.textTertiary }}>{title}</span>
      {links.map(([label, to]) => <Link key={label} to={to} style={{ ...tokens.type.sm, color: pal.textSecondary }}>{label}</Link>)}
    </div>
  );
  return (
    <footer style={{ borderTop: `1px solid ${pal.borderSubtle}`, padding: "48px 32px 120px", fontFamily: tokens.font.sans }}>
      <div style={{ maxWidth: 1120, margin: "0 auto", display: "flex", gap: 48, flexWrap: "wrap", justifyContent: "space-between" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 12, maxWidth: 380 }}>
          <Text size="base" weight="semibold" theme={theme}>Get new patterns by email</Text>
          <Text size="sm" theme={theme} style={{ color: pal.textSecondary, lineHeight: 1.6 }}>New patterns and components land roughly monthly. One email when they do.</Text>
          <UpdatesInline placement="footer" />
          <Link to="/changelog" style={{ ...tokens.type.xs, fontFamily: tokens.font.mono, color: pal.textTertiary, marginTop: 8 }}>v{VERSION} · MIT · react and react-dom only</Link>
        </div>
        <div style={{ display: "flex", gap: 48, flexWrap: "wrap" }}>
          {col("Browse", [["Screens", "/screens"], ["Patterns", "/patterns"], ["Components", "/components"]])}
          {col("Docs", [["Install", "/docs/install"], ["Theming", "/docs/theming"], ["Changelog", "/changelog"], ["llms.txt", "https://ui.halaska.com/llms.txt"]])}
          {col("More", [["GitHub", REPO_URL], ["Halaska Studio", "https://halaska.com"], ["Dash", "https://dash.halaska.com"], ["Book a call", "https://halaska.com/book"]])}
        </div>
      </div>
    </footer>
  );
}
