// Docs: the install prompt, what it does, and how to use the kit with a
// coding agent. The prompt itself is the one gated thing on the site.
import { INSTALL_PROMPT, usePal, tokens } from "../kit";
import { useSite, usePageMeta } from "../state";
import { PageHeader, Section, DetailLayout, Prose, ChipLink } from "../ui/bits";
import { CodeBlock } from "../ui/CodeBlock";
import { InlineGate } from "../email/gate";
import { Link } from "../router";

const SECTIONS = [
  { id: "prompt", title: "The prompt" },
  { id: "what-it-does", title: "What it does" },
  { id: "tools", title: "Which tools" },
  { id: "by-hand", title: "By hand" },
  { id: "for-agents", title: "For agents" },
  { id: "by-name", title: "Asking for things by name" },
];

const STEPS = [
  { title: "Downloads one file", body: "The agent saves the kit to src/halaska-kit.jsx. Nothing is added to package.json." },
  { title: "Reads the install guide", body: "It fetches https://ui.halaska.com/install.md, which covers setup, usage, theming and the map from each AI moment to a pattern." },
  { title: "Restyles one screen at a time", body: "If the project already has UI, the agent swaps it for kit components and patterns a screen at a time, so each change is small enough to review." },
  { title: "Keeps routing, state and data", body: "Only the presentation changes. Your routes, stores, queries and handlers stay as they are." },
];

const TOOLS = [
  { name: "Claude Code", how: "Paste the prompt as the first message in the project." },
  { name: "Cursor", how: "Paste it into the agent chat." },
  { name: "Codex", how: "Paste it as the task." },
  { name: "Windsurf", how: "Paste it into Cascade." },
  { name: "Any agent that can fetch a file", how: "The prompt only needs curl and a URL fetch." },
  { name: "Lovable or Bolt", how: "Download halaska-kit.jsx, upload it to the project, then paste the prompt." },
];

const FACTS = [
  "One React file",
  "react and react-dom only",
  "Inline styles",
  "No Tailwind or CSS setup",
  'Starts with "use client"',
  "MIT licence",
];

const CURL = "curl -o src/halaska-kit.jsx https://ui.halaska.com/halaska-kit.jsx";
const CURL_TS = "curl -o src/halaska-kit.d.ts https://ui.halaska.com/halaska-kit.d.ts";

const IMPORT_EXAMPLE = `import { useState } from "react";
import { ThemeProvider, Card, CardHeader, Button, Stack, ApprovalCardPattern } from "./halaska-kit";

export default function RefundReview() {
  const [decision, setDecision] = useState(null);
  return (
    <ThemeProvider theme="light">
      <Stack gap={16}>
        <Card>
          <CardHeader title="Ticket #4821" subtitle="Acme · refund request" />
          <Button variant="secondary" onClick={() => setDecision(null)}>Reopen</Button>
        </Card>
        <ApprovalCardPattern
          question="Refund Acme for the outage on 12 September?"
          onApprove={(option) => setDecision(option.id)}
          onSkip={() => setDecision("skipped")}
        />
      </Stack>
    </ThemeProvider>
  );
}`;

const NAME_PROMPT = `Rebuild the refund review screen with the kit.

- Use PlanPreviewPattern for the steps Alpha proposes before it touches Stripe.
- Use ApprovalCardPattern where Alpha asks how to reply to Acme.
- Show the result with ActionReceiptPattern and keep the undo window.
- Put ticket #4821 in a Card with a StatusBadge, and use DataTable for the invoice lines.

Keep the existing routes and data calls. Check props in https://ui.halaska.com/llms.txt before you write anything.`;

const AGENT_FILES = [
  { href: "/llms.txt", name: "llms.txt", note: "Every export with its real props, written for coding agents." },
  { href: "/install.md", name: "install.md", note: "The guide the prompt points to: setup, usage, theming and the retrofit steps." },
  { href: "/halaska-kit.d.ts", name: "halaska-kit.d.ts", note: "A TypeScript shim, so imports type-check in TypeScript projects." },
];

export function DocsInstall() {
  usePageMeta("Install", "The install prompt for Halaska UI: what it does, which coding agents it works with, and how to add the kit by hand.");
  const { theme, gate } = useSite();
  const pal = usePal(theme);
  const link = { color: pal.text, textDecoration: "underline", textUnderlineOffset: 3 };
  const mono = { fontFamily: tokens.font.mono, fontSize: 12, color: pal.text };

  return (
    <DetailLayout sections={SECTIONS}>
      <PageHeader eyebrow="Docs" title="Install"
        lead="The kit installs with one prompt. Paste it into a coding agent and the agent downloads the file, reads the guide, and rebuilds your UI with the kit one screen at a time.">
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 16 }}>
          {FACTS.map((f) => (
            <span key={f} style={{
              display: "inline-flex", alignItems: "center", height: 26, padding: "0 10px", borderRadius: tokens.radius.pill,
              background: pal.bgSubtle, boxShadow: `inset 0 0 0 1px ${pal.borderSubtle}`, color: pal.textSecondary, ...tokens.type.sm,
            }}>{f}</span>
          ))}
        </div>
      </PageHeader>

      <Section id="prompt" title="The prompt"
        lead={gate.subscribed
          ? "Paste this as the first message in the project you want to improve."
          : "Enter your email to get the prompt. You get it straight away, plus updates on new components and patterns, and other offers from Halaska Studio."}>
        {gate.subscribed ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 12, alignItems: "flex-start" }}>
            <CodeBlock code={INSTALL_PROMPT} style={{ width: "100%" }} />
            <InlineGate placement="docs-install" />
          </div>
        ) : (
          <div style={{
            padding: 20, borderRadius: tokens.radius.lg, border: `1px solid ${pal.borderSubtle}`, background: pal.bgSubtle,
            display: "flex", flexDirection: "column", gap: 10,
          }}>
            <InlineGate placement="docs-install" />
            <span style={{ ...tokens.type.xs, color: pal.textTertiary }}>
              The prompt is the only thing behind the email. Every page, preview and code snippet is open.
            </span>
          </div>
        )}
      </Section>

      <Section id="what-it-does" title="What it does" lead="The prompt is five lines. It gives the agent four jobs.">
        <ol style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 2 }}>
          {STEPS.map((s, i) => (
            <li key={s.title} style={{ display: "flex", gap: 14, padding: "12px 0", borderBottom: i < STEPS.length - 1 ? `1px solid ${pal.borderSubtle}` : "none" }}>
              <span style={{ fontFamily: tokens.font.mono, ...tokens.type.sm, color: pal.textTertiary, width: 20, flexShrink: 0, paddingTop: 1 }}>{String(i + 1).padStart(2, "0")}</span>
              <div style={{ minWidth: 0 }}>
                <div style={{ ...tokens.type.base, fontWeight: tokens.weight.medium, color: pal.text }}>{s.title}</div>
                <div style={{ ...tokens.type.sm, color: pal.textSecondary, lineHeight: 1.65, marginTop: 2, maxWidth: 580, overflowWrap: "anywhere" }}>{s.body}</div>
              </div>
            </li>
          ))}
        </ol>
      </Section>

      <Section id="tools" title="Which tools" lead="Any coding agent that can run a command and fetch a URL can follow the prompt.">
        <div className="table-wrap">
          <table>
            <thead><tr><th>Tool</th><th>How</th></tr></thead>
            <tbody>
              {TOOLS.map((t) => (
                <tr key={t.name}>
                  <td style={{ color: pal.text, whiteSpace: "nowrap" }}>{t.name}</td>
                  <td style={{ color: pal.textSecondary }}>{t.how}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section id="by-hand" title="By hand" lead="No agent needed. Download the file and import from it.">
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <CodeBlock code={CURL} />
          <Prose>TypeScript projects can add the type shim beside it.</Prose>
          <CodeBlock code={CURL_TS} />
          <Prose>Then import what you need. Fonts and keyframes load themselves on import, so there is no CSS file to add and no config to change.</Prose>
          <CodeBlock code={IMPORT_EXAMPLE} />
          <Prose>
            Colour schemes, tokens, typeface and motion are covered in <Link to="/docs/theming" style={link}>Theming</Link>.
          </Prose>
        </div>
      </Section>

      <Section id="for-agents" title="For agents" lead="Three plain files describe the kit to a coding agent. They are regenerated on every build.">
        <div className="table-wrap">
          <table>
            <thead><tr><th>File</th><th>What it holds</th></tr></thead>
            <tbody>
              {AGENT_FILES.map((f) => (
                <tr key={f.href}>
                  <td style={{ whiteSpace: "nowrap" }}><a href={f.href} target="_blank" rel="noreferrer" style={{ ...mono, ...link }}>{f.name}</a></td>
                  <td style={{ color: pal.textSecondary }}>{f.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section id="by-name" title="Asking for things by name"
        lead="Once the kit is in the project, name the pattern or component you want. The agent finds it in the file and checks its props in llms.txt.">
        <CodeBlock code={NAME_PROMPT} />
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 16 }}>
          <ChipLink to="/patterns">Browse patterns</ChipLink>
          <ChipLink to="/components">Browse components</ChipLink>
          <ChipLink to="/screens">Browse screens</ChipLink>
        </div>
      </Section>
    </DetailLayout>
  );
}
