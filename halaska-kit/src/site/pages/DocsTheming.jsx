// Docs: light and dark, colour schemes, the palette, tokens, typeface and motion.
// Everything shown here is read from the kit at runtime, so it cannot drift.
import { useEffect, useState } from "react";
import {
  ACCENT_COLORS, KIT_FONT_PRESETS, ThemeProvider, usePal, tokens, motion, interactiveBase, setKitMotion,
  Button, Badge, Progress, SegmentedControl, SwitchToggle, Stack, Text,
} from "../kit";
import { useSite, usePageMeta } from "../state";
import { PageHeader, Section, DetailLayout, Prose } from "../ui/bits";
import { CodeBlock } from "../ui/CodeBlock";
import { PreviewFrame } from "../ui/PreviewFrame";

const SECTIONS = [
  { id: "light-dark", title: "Light and dark" },
  { id: "colour-schemes", title: "Colour schemes" },
  { id: "palette", title: "Palette" },
  { id: "tokens", title: "Tokens" },
  { id: "typeface", title: "Typeface" },
  { id: "motion", title: "Motion" },
];

const PALETTE_KEYS = [
  { key: "bg", use: "Page background" },
  { key: "bgElevated", use: "Cards, menus and dialogs" },
  { key: "bgSubtle", use: "Quiet panels and hover rows" },
  { key: "bgMuted", use: "Tracks, chips and secondary buttons" },
  { key: "border", use: "Dividers that need to be seen" },
  { key: "borderSubtle", use: "Hairlines around cards and tables" },
  { key: "text", use: "Body text and headings" },
  { key: "textSecondary", use: "Supporting text" },
  { key: "textTertiary", use: "Labels and captions" },
  { key: "textMuted", use: "Placeholders and disabled text" },
  { key: "accent", use: "The one accent: selection, focus, progress" },
  { key: "accentBg", use: "Tint behind accent text" },
  { key: "success", use: "Done, healthy, approved" },
  { key: "warning", use: "Needs attention" },
  { key: "danger", use: "Errors and destructive actions" },
];

const MOTION_MODES = ["Spring", "Smooth", "Instant"];
const MOTION_NOTES = {
  Spring: "The kit as designed: quick, with a small overshoot on toggles and segments.",
  Smooth: "Longer durations and a decelerating curve, with no overshoot.",
  Instant: "50 to 150 milliseconds. For dense tools and reduced-motion settings.",
};

const THEME_CODE = `import { ThemeProvider, Card, Badge, Button, Text } from "./halaska-kit";

// Wrap once. Every kit component inside follows.
<ThemeProvider theme="dark">
  <Card>
    <Badge variant="success">Resolved</Badge>
    <Text>Ticket #4821 · Acme</Text>
    <Button variant="secondary">Open in Intercom</Button>
  </Card>
</ThemeProvider>

// Or set one component on its own.
<Button theme="dark">Reply to Acme</Button>`;

const ACCENT_CODE = `import { AccentContext, ThemeProvider } from "./halaska-kit";

<AccentContext.Provider value="#10b981">
  <ThemeProvider theme="light">
    <App />
  </ThemeProvider>
</AccentContext.Provider>`;

const PAL_CODE = `import { usePal, tokens } from "./halaska-kit";

function TicketRow({ theme }) {
  const pal = usePal(theme); // omit theme to read it from ThemeProvider
  return (
    <div style={{ background: pal.bgElevated, border: \`1px solid \${pal.borderSubtle}\`, borderRadius: tokens.radius.md, padding: tokens.space.md }}>
      <span style={{ ...tokens.type.base, color: pal.text }}>Ticket #4821</span>
      <span style={{ ...tokens.type.sm, color: pal.textSecondary }}>Acme · waiting on Dana Ruiz</span>
    </div>
  );
}`;

const FONT_CODE = `import { setKitFont } from "./halaska-kit";

setKitFont("Inter");          // a preset
setKitFont("Space Grotesk");  // any Google Font name, loaded on demand`;

const MOTION_CODE = `import { setKitMotion } from "./halaska-kit";

setKitMotion("smooth"); // "spring" | "smooth" | "instant"`;

// A panel that takes its surface from whichever ThemeProvider it sits in.
function ThemedPanel({ label }) {
  const pal = usePal();
  return (
    <div style={{
      width: 232, maxWidth: "100%", padding: 16, borderRadius: tokens.radius.md, background: pal.bg, border: `1px solid ${pal.borderSubtle}`,
      display: "flex", flexDirection: "column", gap: 12, alignItems: "flex-start",
    }}>
      <span style={{ ...tokens.type.xs, fontFamily: tokens.font.mono, color: pal.textTertiary }}>{label}</span>
      <Badge variant="success">Resolved</Badge>
      <Text size="base">Ticket #4821 · Acme</Text>
      <Button variant="secondary" size="sm">Open in Intercom</Button>
    </div>
  );
}

function MotionDemo() {
  const [on, setOn] = useState(true);
  return (
    <Stack gap={16} style={{ width: 280, maxWidth: "100%" }}>
      <SwitchToggle checked={on} onChange={setOn} label="Auto-reply to billing questions" />
      <Progress value={on ? 78 : 24} />
    </Stack>
  );
}

function Swatch({ colour, pal, size = 20 }) {
  return <span aria-hidden="true" style={{ display: "inline-block", width: size, height: size, borderRadius: 6, background: colour, boxShadow: `inset 0 0 0 1px ${pal.border}`, verticalAlign: "middle", flexShrink: 0 }} />;
}

export function DocsTheming() {
  usePageMeta("Theming", "Light and dark themes, six colour schemes, the palette, spacing, radius and type tokens, typeface and motion in Halaska UI.");
  const { theme, accent, setAccent } = useSite();
  const pal = usePal(theme);
  const [mode, setMode] = useState("Spring");
  // Motion is global, so put it back when the visitor leaves the page.
  useEffect(() => () => setKitMotion("spring"), []);
  const pickMode = (m) => { setMode(m); setKitMotion(m.toLowerCase()); };

  const mono = { fontFamily: tokens.font.mono, fontSize: 12 };
  const h3 = { ...tokens.type.base, fontWeight: tokens.weight.medium, color: pal.text, margin: "24px 0 10px" };
  const code = { ...mono, color: pal.text, background: pal.bgMuted, padding: "1px 5px", borderRadius: 4 };

  return (
    <DetailLayout sections={SECTIONS}>
      <PageHeader eyebrow="Docs" title="Theming"
        lead="One neutral palette in light and dark, one accent you can swap, and a small set of tokens. Everything is plain JavaScript, so there is no config file and no CSS to override." />

      <Section id="light-dark" title="Light and dark"
        lead="Every component takes a theme prop. Wrap your app in ThemeProvider and you only set it once.">
        <PreviewFrame code={THEME_CODE} minHeight={260}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 16, justifyContent: "center" }}>
            <ThemeProvider theme="light"><ThemedPanel label='theme="light"' /></ThemeProvider>
            <ThemeProvider theme="dark"><ThemedPanel label='theme="dark"' /></ThemeProvider>
          </div>
        </PreviewFrame>
      </Section>

      <Section id="colour-schemes" title="Colour schemes"
        lead="The kit uses one accent colour. Violet is the default. Any hex value works, and the hover and tint shades are derived from it.">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: 10, marginBottom: 16 }}>
          {ACCENT_COLORS.map((c) => {
            const current = accent === c.value;
            return (
              <button key={c.name} type="button" aria-pressed={current} onClick={() => setAccent(c.value)} style={{
                ...interactiveBase, display: "flex", alignItems: "center", gap: 10, padding: 10, textAlign: "left",
                borderRadius: tokens.radius.md, background: pal.bgElevated,
                border: `1px solid ${current ? pal.text : pal.borderSubtle}`,
                transition: `border-color ${motion.normal} ${motion.easeInOut}`,
              }}>
                <span aria-hidden="true" style={{ width: 28, height: 28, borderRadius: 8, background: c.value, flexShrink: 0 }} />
                <span style={{ display: "flex", flexDirection: "column", minWidth: 0 }}>
                  <span style={{ ...tokens.type.sm, fontWeight: tokens.weight.medium, color: pal.text }}>{c.name}{c.name === "Violet" ? " · default" : ""}</span>
                  <span style={{ ...mono, color: pal.textTertiary }}>{c.value}</span>
                </span>
              </button>
            );
          })}
        </div>
        <CodeBlock code={ACCENT_CODE} />
      </Section>

      <Section id="palette" title="Palette"
        lead="usePal(theme) returns the colours for the current theme with the accent applied. Build your own surfaces from these keys and they follow theme and accent changes.">
        <div className="table-wrap" style={{ marginBottom: 16 }}>
          <table>
            <thead><tr><th>Key</th><th>Value</th><th>Used for</th></tr></thead>
            <tbody>
              {PALETTE_KEYS.map(({ key, use }) => (
                <tr key={key}>
                  <td style={{ whiteSpace: "nowrap" }}>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
                      <Swatch colour={pal[key]} pal={pal} />
                      <span style={{ ...mono, color: pal.text }}>pal.{key}</span>
                    </span>
                  </td>
                  <td style={{ ...mono, color: pal.textTertiary, whiteSpace: "nowrap" }}>{pal[key]}</td>
                  <td style={{ color: pal.textSecondary }}>{use}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Prose>
          <p style={{ margin: "0 0 12px" }}>Success, warning and danger each have a tint for backgrounds: <span style={code}>successBg</span>, <span style={code}>warningBg</span> and <span style={code}>dangerBg</span>.</p>
        </Prose>
        <CodeBlock code={PAL_CODE} />
      </Section>

      <Section id="tokens" title="Tokens" lead="Spacing, radius and type scales live on the tokens object. The values below are read from the kit.">
        <h3 style={{ ...h3, marginTop: 0 }}>Spacing</h3>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Token</th><th>Pixels</th><th style={{ width: "50%" }}>Size</th></tr></thead>
            <tbody>
              {Object.entries(tokens.space).map(([name, px]) => (
                <tr key={name}>
                  <td style={{ ...mono, color: pal.text, whiteSpace: "nowrap" }}>tokens.space.{name}</td>
                  <td style={{ ...mono, color: pal.textTertiary }}>{px}</td>
                  <td><span aria-hidden="true" style={{ display: "block", height: 8, width: Math.min(px, 240), maxWidth: "100%", borderRadius: 2, background: pal.accent }} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h3 style={h3}>Radius</h3>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Token</th><th>Pixels</th><th>Shape</th></tr></thead>
            <tbody>
              {Object.entries(tokens.radius).map(([name, px]) => (
                <tr key={name}>
                  <td style={{ ...mono, color: pal.text, whiteSpace: "nowrap" }}>tokens.radius.{name}</td>
                  <td style={{ ...mono, color: pal.textTertiary }}>{px}</td>
                  <td><span aria-hidden="true" style={{ display: "block", width: 72, height: 40, borderRadius: Math.min(px, 20), background: pal.bgMuted, border: `1px solid ${pal.border}` }} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h3 style={h3}>Type</h3>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Token</th><th>Size</th><th>Line height</th><th>Sample</th></tr></thead>
            <tbody>
              {Object.entries(tokens.type).map(([name, t]) => (
                <tr key={name}>
                  <td style={{ ...mono, color: pal.text, whiteSpace: "nowrap" }}>tokens.type.{name}</td>
                  <td style={{ ...mono, color: pal.textTertiary }}>{t.fontSize}</td>
                  <td style={{ ...mono, color: pal.textTertiary }}>{t.lineHeight}</td>
                  <td style={{ ...t, color: pal.text, whiteSpace: "nowrap" }}>Refund approved</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h3 style={h3}>Weight</h3>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Token</th><th>Value</th><th>Sample</th></tr></thead>
            <tbody>
              {Object.entries(tokens.weight).map(([name, w]) => (
                <tr key={name}>
                  <td style={{ ...mono, color: pal.text, whiteSpace: "nowrap" }}>tokens.weight.{name}</td>
                  <td style={{ ...mono, color: pal.textTertiary }}>{w}</td>
                  <td style={{ ...tokens.type.md, fontWeight: w, color: pal.text }}>Refund approved</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section id="typeface" title="Typeface"
        lead="The kit ships with Geist and Geist Mono. setKitFont(name) swaps the sans typeface for the whole kit at runtime.">
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 16 }}>
          {KIT_FONT_PRESETS.map((f) => (
            <span key={f} style={{
              display: "inline-flex", alignItems: "center", height: 28, padding: "0 11px", borderRadius: tokens.radius.pill,
              background: pal.bgSubtle, boxShadow: `inset 0 0 0 1px ${pal.borderSubtle}`, color: pal.textSecondary, ...tokens.type.sm,
            }}>{f}{f === "Geist" ? " · default" : ""}</span>
          ))}
        </div>
        <CodeBlock code={FONT_CODE} />
        <Prose>
          <p style={{ margin: "12px 0 0" }}>The presets are in <span style={code}>KIT_FONT_PRESETS</span>. Other names are fetched from Google Fonts the first time they are used. Code and labels stay in <span style={code}>tokens.font.mono</span>.</p>
        </Prose>
      </Section>

      <Section id="motion" title="Motion"
        lead="Durations and easing curves are shared by every component. setKitMotion switches all of them at once.">
        <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap", marginBottom: 14 }}>
          <SegmentedControl options={MOTION_MODES} value={mode} onChange={pickMode} />
          <span style={{ ...tokens.type.sm, color: pal.textSecondary }}>{MOTION_NOTES[mode]}</span>
        </div>
        <PreviewFrame code={MOTION_CODE} minHeight={180}>
          <MotionDemo />
        </PreviewFrame>
        <div className="table-wrap" style={{ marginTop: 16 }}>
          <table>
            <thead><tr><th>Token</th><th>Spring value</th><th>Used for</th></tr></thead>
            <tbody>
              {[
                ["motion.fast", "0.15s", "Micro-interactions and state changes"],
                ["motion.normal", "0.25s", "Most transitions"],
                ["motion.smooth", "0.35s", "Expanding panels and colour changes"],
                ["motion.spring", "0.4s", "Toggles, radios and segments"],
                ["motion.slow", "0.5s", "Page-level transitions"],
                ["motion.easeInOut", "cubic-bezier(0.4, 0, 0.2, 1)", "Movement that stays on screen"],
                ["motion.easeOut", "cubic-bezier(0, 0, 0.2, 1)", "Elements entering"],
                ["motion.easeIn", "cubic-bezier(0.4, 0, 1, 1)", "Elements leaving"],
                ["motion.emphasized", "cubic-bezier(0.2, 0, 0, 1)", "A strong landing"],
                ["motion.springCurve", "cubic-bezier(0.34, 1.56, 0.64, 1)", "Overshoot"],
              ].map(([name, value, use]) => (
                <tr key={name}>
                  <td style={{ ...mono, color: pal.text, whiteSpace: "nowrap" }}>{name}</td>
                  <td style={{ ...mono, color: pal.textTertiary, whiteSpace: "nowrap" }}>{value}</td>
                  <td style={{ color: pal.textSecondary }}>{use}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>
    </DetailLayout>
  );
}
