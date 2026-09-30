import { usePal, tokens, Text } from "../kit";
import { useSite, usePageMeta } from "../state";
import { Link } from "../router";

export function NotFound() {
  const { theme } = useSite(); const pal = usePal(theme);
  usePageMeta("Not found");
  return (
    <div className="site-main"><article className="site-article" style={{ paddingTop: 40 }}>
      <h1 style={{ ...tokens.type.xxl, fontWeight: tokens.weight.bold, color: pal.text, margin: 0 }}>Nothing at this address</h1>
      <p style={{ ...tokens.type.md, color: pal.textSecondary, lineHeight: 1.65 }}>The page may have moved when the site was restructured. Try <Link to="/components" style={{ textDecoration: "underline" }}>components</Link>, <Link to="/patterns" style={{ textDecoration: "underline" }}>patterns</Link> or <Link to="/screens" style={{ textDecoration: "underline" }}>screens</Link>.</p>
    </article></div>
  );
}
