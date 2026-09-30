// The landing page: whole screens first, then patterns, then single
// components, so a visitor sees the three tiers in order. The shell supplies
// the header, footer and floating copy button.
import { useEffect, useState } from "react";
import {
  usePal, tokens, motion,
  Button, TextInput, Select, SwitchToggle, Checkbox, Tabs, Card as KitCard, CardHeader, Stat,
  Avatar, AvatarGroup, Badge, Progress, ProgressCircle, Table, Calendar, Toast, AlertBanner,
  Orb, ThinkingSteps, ConfidenceBar, Snippet, Kbd,
} from "../kit";
import { useSite, usePageMeta } from "../state";
import { GROUPS, COMPONENTS, SCREENS, COUNTS } from "../registry";
import { Link } from "../router";
import { ScreenStage, BeforeAfter, LayoutToggle, useLayout, spotsFor } from "../ui/ScreenStage";
import { LiveThumb } from "../ui/PreviewFrame";
import { Count, TagPill, tagTone, Card } from "../ui/bits";
import { InlineGate, BOOK_URL } from "../email/gate";

const GAP = "clamp(72px, 10vw, 112px)";
const usePalette = () => usePal(useSite().theme);

function Eyebrow({ children }) {
  const pal = usePalette();
  return <div style={{ fontFamily: tokens.font.mono, fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: pal.textTertiary, marginBottom: 12 }}>{children}</div>;
}

function Block({ eyebrow, title, lead, children, id }) {
  const pal = usePalette();
  return (
    <section id={id} style={{ marginTop: GAP, scrollMarginTop: 84 }}>
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      <h2 style={{ ...tokens.type.xl, fontWeight: tokens.weight.semibold, letterSpacing: "-0.02em", color: pal.text, margin: 0 }}>{title}</h2>
      {lead && <p style={{ ...tokens.type.md, color: pal.textSecondary, lineHeight: 1.65, margin: "10px 0 0", maxWidth: 640 }}>{lead}</p>}
      <div style={{ marginTop: 32 }}>{children}</div>
    </section>
  );
}

function ArrowLink({ to, children, strong }) {
  const pal = usePalette();
  return (
    <Link to={to} style={{ display: "inline-flex", alignItems: "center", gap: 6, ...tokens.type.base, fontWeight: tokens.weight.medium, color: strong ? pal.text : pal.textSecondary }}>
      {children}<span aria-hidden="true" style={{ color: pal.textTertiary }}>→</span>
    </Link>
  );
}

// ─── 3. Screens ───────────────────────────────────────────────
function ScreenBlock({ screen, layout }) {
  const pal = usePalette();
  const [spot, setSpot] = useState(null);
  const spots = spotsFor(screen, layout);
  useEffect(() => { setSpot(null); }, [layout]);
  const active = spot != null ? spots[spot] : null;
  return (
    <div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 12, flexWrap: "wrap", marginBottom: 6 }}>
        <Link to={`/screens/${screen.slug}`} style={{ ...tokens.type.lg, fontWeight: tokens.weight.semibold, color: pal.text }}>{screen.name}</Link>
        <span style={{ fontFamily: tokens.font.mono, fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", color: pal.textTertiary }}>{screen.paradigm}</span>
      </div>
      <p style={{ ...tokens.type.base, color: pal.textSecondary, lineHeight: 1.65, margin: "0 0 20px", maxWidth: 640 }}>{screen.description}</p>
      <ScreenStage screen={screen} layout={layout} hotspots activeSpot={spot} onSpot={setSpot} />
      <p aria-live="polite" style={{ ...tokens.type.sm, color: active ? pal.text : pal.textTertiary, minHeight: 44, margin: "14px 0 0", transition: `color ${motion.fast} ${motion.easeOut}` }}>
        {active
          ? <><span style={{ fontFamily: tokens.font.mono, color: pal.accentText, marginRight: 8 }}>{spot + 1}</span>{active.note}</>
          : `${spots.length} patterns on this screen.`}
      </p>
    </div>
  );
}

// ─── 4. Component sampler ─────────────────────────────────────
function Tile({ slug, name, children }) {
  const pal = usePalette();
  return (
    <div style={{ display: "flex", flexDirection: "column", borderRadius: tokens.radius.lg, border: `1px solid ${pal.borderSubtle}`, background: pal.bgElevated, overflow: "hidden", transition: `background ${motion.smooth} ${motion.easeInOut}, border-color ${motion.smooth} ${motion.easeInOut}` }}>
      <div style={{ padding: 20, minWidth: 0 }}>{children}</div>
      <Link to={`/components/${slug}`} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 20px", borderTop: `1px solid ${pal.borderSubtle}`, ...tokens.type.sm, fontWeight: tokens.weight.medium, color: pal.textSecondary }}>
        {name}<span aria-hidden="true" style={{ color: pal.textTertiary }}>→</span>
      </Link>
    </div>
  );
}
const col = (gap = 14) => ({ display: "flex", flexDirection: "column", gap });
const row = (gap = 8) => ({ display: "flex", alignItems: "center", gap, flexWrap: "wrap" });

function ButtonTile() {
  return (
    <Tile slug="button" name="Button">
      <div style={row()}>
        <Button variant="primary">Approve refund</Button>
        <Button variant="secondary">Edit reply</Button>
        <Button variant="outline">Assign</Button>
        <Button variant="ghost">Skip</Button>
        <Button variant="danger" size="sm">Stop agent</Button>
      </div>
    </Tile>
  );
}
function InputTile() {
  const [name, setName] = useState("Alpha");
  const [tool, setTool] = useState("Intercom");
  return (
    <Tile slug="input" name="Input">
      <div style={col(16)}>
        <TextInput label="Agent name" value={name} onChange={setName} placeholder="Name your agent" caption="Shown to customers in every reply." />
        <Select label="Inbox" value={tool} onChange={setTool} options={["Intercom", "Linear", "Stripe", "Notion"]} />
      </div>
    </Tile>
  );
}
function SwitchTile() {
  const [s, setS] = useState({ draft: true, refund: false, notify: true, log: true });
  const set = (k) => (v) => setS((prev) => ({ ...prev, [k]: v }));
  return (
    <Tile slug="switch" name="Switch">
      <div style={col(14)}>
        <SwitchToggle checked={s.draft} onChange={set("draft")} label="Draft replies automatically" />
        <SwitchToggle checked={s.refund} onChange={set("refund")} label="Refund without approval" />
        <Checkbox checked={s.notify} onChange={set("notify")} label="Notify Sam on escalation" />
        <Checkbox checked={s.log} onChange={set("log")} label="Log every action to Notion" />
      </div>
    </Tile>
  );
}
const TAB_COPY = {
  Inbox: "12 open conversations. Three are waiting on a reply from Alpha.",
  Issues: "Four Linear issues are linked to open tickets this week.",
  Billing: "Two refunds are pending approval, both under the $200 cap.",
};
function TabsTile() {
  const pal = usePalette();
  const [tab, setTab] = useState("Inbox");
  return (
    <Tile slug="tabs" name="Tabs">
      <Tabs tabs={Object.keys(TAB_COPY)} value={tab} onChange={setTab} />
      <p style={{ ...tokens.type.sm, color: pal.textSecondary, lineHeight: 1.6, margin: "14px 0 0", minHeight: 42 }}>{TAB_COPY[tab]}</p>
    </Tile>
  );
}
function CardTile() {
  return (
    <Tile slug="card" name="Card">
      <KitCard padding={20}>
        <CardHeader title="Resolved by Alpha" subtitle="Last 7 days" action={<Badge variant="success">On track</Badge>} />
        <Stat label="Tickets closed" value="184" change="+12%" />
      </KitCard>
    </Tile>
  );
}
function AvatarTile() {
  return (
    <Tile slug="avatar" name="Avatar">
      <div style={col(16)}>
        <div style={row(12)}>
          <Avatar name="Sam Keller" size={36} />
          <AvatarGroup names={["Dana Ruiz", "Priya Nair", "Sam Keller", "Alpha Agent", "Acme Support"]} max={3} />
        </div>
        <div style={row(6)}>
          <Badge>Draft</Badge><Badge variant="accent">Alpha</Badge><Badge variant="success">Resolved</Badge><Badge variant="warning">Waiting</Badge><Badge variant="danger">Overdue</Badge>
        </div>
      </div>
    </Tile>
  );
}
function ProgressTile() {
  const pal = usePalette();
  const [done, setDone] = useState(3);
  const pct = Math.round((done / 5) * 100);
  return (
    <Tile slug="progress" name="Progress">
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <ProgressCircle value={pct} size={56} label={`${pct}%`} />
        <div style={{ flex: 1, minWidth: 0, ...col(8) }}>
          <span style={{ ...tokens.type.sm, color: pal.textSecondary }}>Backlog sweep, step {done} of 5</span>
          <Progress value={pct} />
        </div>
      </div>
      <div style={{ marginTop: 16 }}>
        <Button variant="secondary" size="sm" onClick={() => setDone((d) => (d >= 5 ? 1 : d + 1))}>{done >= 5 ? "Start again" : "Run next step"}</Button>
      </div>
    </Tile>
  );
}
function TableTile() {
  return (
    <Tile slug="table" name="Table">
      <Table columns={["Ticket", "Customer", "Status"]} rows={[
        ["#4821", "Acme", <Badge key="a" variant="warning">Waiting</Badge>],
        ["#4822", "Lumen Labs", <Badge key="b" variant="accent">Drafted</Badge>],
        ["#4823", "Fjord Health", <Badge key="c" variant="success">Resolved</Badge>],
        ["#4824", "Cobalt Dental", <Badge key="d">New</Badge>],
      ]} />
    </Tile>
  );
}
function CalendarTile() {
  const [date, setDate] = useState(() => new Date());
  return <Tile slug="calendar" name="Calendar"><Calendar value={date} onChange={setDate} /></Tile>;
}
function AlertTile() {
  const [sent, setSent] = useState(false);
  return (
    <Tile slug="alert" name="Alert">
      <div style={col(14)}>
        <AlertBanner variant="warning" title="Refund over the cap" description="Brightline asked for $340. Alpha can approve up to $200." />
        <div style={{ ...row(10), minHeight: 46 }}>
          {sent
            ? <Toast variant="success" icon="✓" message="Sent to Dana for approval" />
            : <Button variant="secondary" size="sm" onClick={() => setSent(true)}>Ask Dana to approve</Button>}
        </div>
      </div>
    </Tile>
  );
}
function OrbTile() {
  return (
    <Tile slug="orb" name="Orb">
      <div style={col(12)}>
        <div><Orb variant="pulse" pill label="Reading ticket #4821" /></div>
        <div><Orb variant="orbit" pill label="Searching Notion runbooks" /></div>
      </div>
    </Tile>
  );
}
const STEPS = ["Read the Acme thread", "Check the Stripe invoice", "Find the refund runbook", "Draft a reply"];
function ThinkingTile() {
  const [current, setCurrent] = useState(1);
  useEffect(() => {
    const t = setInterval(() => setCurrent((c) => (c + 1) % (STEPS.length + 1)), 1600);
    return () => clearInterval(t);
  }, []);
  return <Tile slug="thinking-steps" name="Thinking steps"><ThinkingSteps steps={STEPS} current={current} /></Tile>;
}
function ConfidenceTile() {
  return (
    <Tile slug="confidence-bar" name="Confidence bar">
      <div style={col(14)}>
        <ConfidenceBar value={92} label="Duplicate of #4790" />
        <ConfidenceBar value={68} label="Billing issue" />
        <ConfidenceBar value={34} label="Churn risk" />
      </div>
    </Tile>
  );
}
function SnippetTile() {
  const pal = usePalette();
  return (
    <Tile slug="snippet" name="Snippet">
      <div style={col(14)}>
        <Snippet text="curl -O https://ui.halaska.com/halaska-kit.jsx" style={{ maxWidth: "100%" }} />
        <div style={{ ...row(6), ...tokens.type.sm, color: pal.textSecondary }}>
          <Kbd>⌘</Kbd><Kbd>K</Kbd><span>opens search</span>
        </div>
      </div>
    </Tile>
  );
}

// ─── 5. Patterns by lifecycle ─────────────────────────────────
const oneLine = (s = "") => s.split(/(?<=\.)\s/)[0];

function GroupCard({ group }) {
  const pal = usePalette();
  return (
    <Card to={`/patterns#${group.id}`} style={{ padding: 20, gap: 16 }}>
      <div>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 12 }}>
          <span style={{ ...tokens.type.md, fontWeight: tokens.weight.semibold, color: pal.text }}>{group.title}</span>
          <span style={{ fontFamily: tokens.font.mono, fontSize: 12, color: pal.textTertiary, whiteSpace: "nowrap" }}>{group.patterns.length} patterns</span>
        </div>
        <p style={{ ...tokens.type.sm, color: pal.textSecondary, margin: "4px 0 0", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{oneLine(group.blurb)}</p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 8 }}>
        {group.patterns.slice(0, 3).map((p) => (
          <LiveThumb key={p.id} width={640} height={Math.min(420, (p.height || 480) - 60)} scale={0.3} housed={p.housed}>
            {p.Component ? <p.Component /> : null}
          </LiveThumb>
        ))}
      </div>
    </Card>
  );
}

// ─── 7. How it works ──────────────────────────────────────────
const HOW = [
  ["Copy the prompt", "Five short lines. They tell your coding agent where the kit is and how to use it."],
  ["Paste it into Claude Code or Cursor", "The agent downloads one React file. There is nothing else to install."],
  ["The agent applies the kit", "It restyles your prototype one screen at a time, so you can check each change."],
];

export function Landing() {
  usePageMeta(null, "A UI kit for AI products. Screens, AI UX patterns and components in one React file, made for founders building with coding agents.");
  const { theme } = useSite();
  const pal = usePal(theme);
  const textLink = { color: pal.text, textDecoration: "underline", textDecorationColor: pal.border, textUnderlineOffset: 3 };
  // One layout choice drives the comparison and both screens.
  const [layout, setLayout] = useLayout();

  return (
    <div className="site-landing">
      {/* 1. Hero */}
      <section style={{ paddingTop: 88 }}>
        <div style={{ maxWidth: 640 }}>
          <h1 style={{ fontSize: "clamp(34px, 6.4vw, 56px)", lineHeight: 1.06, fontWeight: tokens.weight.bold, letterSpacing: "-0.03em", color: pal.text, margin: 0 }}>
            Make your AI prototype look designed.
          </h1>
          <p style={{ ...tokens.type.md, color: pal.textSecondary, lineHeight: 1.65, margin: "20px 0 28px" }}>
            Made for founders building with coding agents. Screens, AI UX patterns and components in one React file.
          </p>
          <InlineGate placement="hero" size="lg" />
          <div style={{ marginTop: 18 }}><ArrowLink to="/components">Browse components</ArrowLink></div>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "12px 32px", marginTop: 40, paddingTop: 20, borderTop: `1px solid ${pal.borderSubtle}` }}>
          <Link to="/patterns"><Count n={COUNTS.patterns} label="patterns" /></Link>
          <Link to="/components"><Count n={COUNTS.components} label="components" /></Link>
        </div>
      </section>

      {/* 2. Before and after */}
      <section style={{ marginTop: GAP }}>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 16, flexWrap: "wrap", marginBottom: 24 }}>
          <div style={{ flex: "1 1 320px", minWidth: 0 }}>
            <Eyebrow>Before and after</Eyebrow>
            <h2 style={{ ...tokens.type.xl, fontWeight: tokens.weight.semibold, letterSpacing: "-0.02em", color: pal.text, margin: 0 }}>The same screen, with the kit applied</h2>
            <p style={{ ...tokens.type.md, color: pal.textSecondary, lineHeight: 1.65, margin: "10px 0 0", maxWidth: 640 }}>
              On the left, a chat screen as a coding agent left it. On the right, the same content and data built from the kit.
            </p>
          </div>
          <LayoutToggle value={layout} onChange={setLayout} />
        </div>
        <BeforeAfter layout={layout} />
      </section>

      {/* 3. Screens */}
      <Block eyebrow="Screens" title="Complete screens, built only from the kit" lead="Each marker names the pattern used in that part of the screen.">
        <div style={{ marginBottom: 28 }}><LayoutToggle value={layout} onChange={setLayout} /></div>
        <div className={layout === "mobile" ? "screens-mobile" : undefined} style={{ display: "flex", flexDirection: "column", gap: 56 }}>
          {SCREENS.map((s) => <ScreenBlock key={s.slug} screen={s} layout={layout} />)}
        </div>
        <div style={{ marginTop: 20 }}><ArrowLink to="/screens" strong>View all screens</ArrowLink></div>
      </Block>

      {/* 4. Component sampler */}
      <Block eyebrow="Components" title="Components, from buttons to agents" lead="The base set you expect, plus the parts an AI product needs.">
        <div className="masonry">
          <ButtonTile /><CalendarTile /><OrbTile /><InputTile /><ThinkingTile /><CardTile /><TableTile />
          <ConfidenceTile /><SwitchTile /><AlertTile /><TabsTile /><AvatarTile /><ProgressTile /><SnippetTile />
        </div>
      </Block>

      {/* 5. Patterns by lifecycle */}
      <Block eyebrow="Patterns" title="Patterns for every stage of an agent's work" lead={`${COUNTS.patterns} patterns in ${GROUPS.length} groups, from the first prompt to the audit log.`}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 420px), 1fr))", gap: 16 }}>
          {GROUPS.map((g) => <GroupCard key={g.id} group={g} />)}
        </div>
      </Block>

      {/* 6. Components index */}
      <Block eyebrow="Index" title="Every component" lead={`Follows the shadcn/ui component list, with Halaska additions tagged. ${COUNTS.components} components in total.`}>
        <div className="grid-names">
          {COMPONENTS.map((c) => (
            <Link key={c.slug} to={`/components/${c.slug}`} style={{ display: "flex", alignItems: "center", gap: 8, padding: "7px 0", minWidth: 0, ...tokens.type.base, color: pal.textSecondary }}>
              <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.name}</span>
              {(c.tags || []).map((t) => <TagPill key={t} tone={tagTone(t)}>{t}</TagPill>)}
            </Link>
          ))}
        </div>
      </Block>

      {/* 7. How it works */}
      <Block eyebrow="How it works" title="Three steps, no setup">
        <ol style={{ listStyle: "none", padding: 0, margin: "0 0 32px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 240px), 1fr))", gap: 24 }}>
          {HOW.map(([title, body], i) => (
            <li key={title} style={{ paddingTop: 16, borderTop: `1px solid ${pal.borderSubtle}` }}>
              <div style={{ fontFamily: tokens.font.mono, fontSize: 12, color: pal.accentText, marginBottom: 10 }}>{`0${i + 1}`}</div>
              <div style={{ ...tokens.type.md, fontWeight: tokens.weight.semibold, color: pal.text }}>{title}</div>
              <p style={{ ...tokens.type.sm, color: pal.textSecondary, lineHeight: 1.65, margin: "6px 0 0" }}>{body}</p>
            </li>
          ))}
        </ol>
        <InlineGate placement="how-it-works" />
      </Block>

      {/* 8. Built by a studio */}
      <Block eyebrow="Studio" title="Built by a studio">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 320px), 1fr))", gap: 24, alignItems: "start" }}>
          <p style={{ ...tokens.type.md, color: pal.textSecondary, lineHeight: 1.7, margin: 0, maxWidth: 520 }}>
            Halaska UI is made by <Link to="https://halaska.com" style={textLink}>Halaska Studio</Link>, a product design studio.
            It is the kit behind <Link to="https://dash.halaska.com" style={textLink}>Dash</Link>, where we take a founder's prototype and make it look designed.
          </p>
          <Card style={{ padding: 24, gap: 8 }}>
            <div style={{ ...tokens.type.md, fontWeight: tokens.weight.semibold, color: pal.text }}>Need a hand with yours?</div>
            <p style={{ ...tokens.type.sm, color: pal.textSecondary, lineHeight: 1.65, margin: "0 0 10px" }}>
              We design and build AI product interfaces with founders. Tell us what you are making.
            </p>
            <div><Button variant="primary" iconRight="↗" onClick={() => window.open(BOOK_URL, "_blank", "noopener,noreferrer")}>Book a call</Button></div>
          </Card>
        </div>
      </Block>
    </div>
  );
}
