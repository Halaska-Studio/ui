// Styles: see the kit in your brand. Three settings (a colour, a headline
// style, a corner feel) restyle every preview on the site, and the same
// three work in a project through BrandProvider. The page also shows what
// the colour turns into: a tonal scale from 0 to 100 and the roles on it.
import { useEffect, useState } from "react";
import {
  usePal, tokens, motion, interactiveBase, radiusFor, brandPalette, tonalPalette, neutralPalette, toneOf,
  KIT_TONES, KIT_TYPE_STYLES, KIT_RADIUS_STYLES, loadKitTypeStyle,
  Card, CardHeader, Heading, Text, Badge, Button, TextInput, SwitchToggle, Progress, Stat, Avatar, Tabs, Checkbox, AlertBanner,
} from "../kit";
import { useSite, usePageMeta } from "../state";
import { PageHeader, Section, DetailLayout, Prose, FRAME_RADIUS } from "../ui/bits";
import { CodeBlock } from "../ui/CodeBlock";
import { PreviewFrame } from "../ui/PreviewFrame";
import { BRAND_COLORS, BRAND_DEFAULT, DEFAULT_SWATCH, normalHex } from "../ui/Branded";
import { CornerIcon } from "../chrome/FloatingCopy";

const SECTIONS = [
  { id: "style", title: "Your style" },
  { id: "preview", title: "Preview" },
  { id: "scale", title: "Tonal scale" },
  { id: "roles", title: "Roles" },
  { id: "use", title: "Use it" },
];

const CORNERS = {
  sharp: { name: "Sharp", note: "Precise, with a slight ease." },
  soft: { name: "Soft", note: "A quieter, middle corner." },
  round: { name: "Round", note: "The kit as designed. Close to iOS." },
};
const TYPE_NOTES = {
  clean: "Neutral and quiet. The kit as designed.",
  editorial: "A display serif for a considered, magazine feel.",
  technical: "Monospace titles for developer tools.",
};
// What each role is used for, and where it sits on which scale.
const ROLES = [
  { key: "bg", name: "Page", scale: "Neutral" },
  { key: "bgSubtle", name: "Container", scale: "Neutral" },
  { key: "bgElevated", name: "Card", scale: "Neutral" },
  { key: "border", name: "Border", scale: "Neutral" },
  { key: "textSecondary", name: "Supporting text", scale: "Neutral" },
  { key: "text", name: "Text", scale: "Neutral" },
  { key: "primary", name: "Primary action", scale: "Primary" },
  { key: "onPrimary", name: "On primary", scale: "Primary" },
];

function OptionCard({ on, onClick, children, label }) {
  const pal = usePal(useSite().theme);
  return (
    <button type="button" role="radio" aria-checked={on} aria-label={label} onClick={onClick} style={{
      ...interactiveBase, display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 8, padding: 12, textAlign: "left", minWidth: 0,
      borderRadius: FRAME_RADIUS, background: pal.bgElevated, border: `1px solid ${on ? pal.text : pal.borderSubtle}`,
      transition: `border-color ${motion.normal} ${motion.easeInOut}, background ${motion.smooth} ${motion.easeInOut}`,
    }}>{children}</button>
  );
}

// The sample the settings are judged on: a small slice of a product screen.
function Sample() {
  const [tab, setTab] = useState("Open");
  const [auto, setAuto] = useState(true);
  const [note, setNote] = useState("");
  const [agree, setAgree] = useState(true);
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16, width: 760, maxWidth: "100%", alignItems: "start" }}>
      <Card>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Badge variant="accent">Needs review</Badge>
            <Text size="sm" secondary>Ticket 4821</Text>
          </div>
          <Heading level={3}>Refund request from Acme</Heading>
          <Text secondary style={{ lineHeight: 1.6 }}>Alpha checked the Stripe invoice and the outage log. The charge falls inside the credit window, so a full refund is within policy.</Text>
          <TextInput label="Note to the customer" placeholder="Add a line to the reply" value={note} onChange={setNote} />
          <Checkbox checked={agree} onChange={setAgree} label="Send the reply once approved" />
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <Button variant="primary">Approve refund</Button>
            <Button variant="secondary">Edit reply</Button>
            <Button variant="ghost">Skip</Button>
          </div>
        </div>
      </Card>
      <div style={{ display: "flex", flexDirection: "column", gap: 16, minWidth: 0 }}>
        <Card>
          <CardHeader title="Support inbox" subtitle="Last 7 days" />
          <div style={{ display: "flex", gap: 24, margin: "14px 0 16px", flexWrap: "wrap" }}>
            <Stat label="Resolved by Alpha" value="412" change="+18%" />
            <Stat label="Median reply" value="2m 40s" />
          </div>
          <Progress value={72} />
          <div style={{ marginTop: 14 }}><Tabs tabs={["Open", "Snoozed", "Closed"]} value={tab} onChange={setTab} /></div>
        </Card>
        <Card>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Avatar name="Dana Ruiz" size={32} />
            <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>
              <Text weight="medium">Dana Ruiz</Text>
              <Text size="sm" secondary>Approves refunds over $200</Text>
            </div>
            <SwitchToggle checked={auto} onChange={setAuto} aria-label="Ask Dana first" />
          </div>
        </Card>
        <AlertBanner title="Alpha is waiting on you" description="Two replies are drafted and ready to send." />
      </div>
    </div>
  );
}

function ToneRow({ name, palette, pal, note }) {
  const mono = { fontFamily: tokens.font.mono, fontSize: 10, color: pal.textTertiary };
  return (
    <div style={{ marginBottom: 22 }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 8 }}>
        <span style={{ ...tokens.type.sm, fontWeight: tokens.weight.medium, color: pal.text }}>{name}</span>
        <span style={{ ...tokens.type.xs, color: pal.textTertiary }}>{note}</span>
      </div>
      <div className="tone-row">
        {KIT_TONES.map((t) => (
          <div key={t} title={`${name} ${t}: ${palette[t]}`} style={{ minWidth: 0 }}>
            <div style={{ height: 40, borderRadius: 6, background: palette[t], boxShadow: `inset 0 0 0 1px ${pal.borderInput}` }} />
            <div style={{ ...mono, textAlign: "center", marginTop: 5 }}>{t}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function RolePanel({ theme, color, chrome }) {
  const p = color ? brandPalette(theme, color) : tokens[theme];
  return (
    <div style={{ borderRadius: FRAME_RADIUS, overflow: "hidden", border: `1px solid ${chrome.borderSubtle}`, background: p.bg, fontFamily: tokens.font.sans }}>
      <div style={{ padding: "10px 14px", ...tokens.type.xs, fontFamily: tokens.font.mono, letterSpacing: "0.06em", textTransform: "uppercase", color: p.textTertiary, borderBottom: `1px solid ${p.borderSubtle}` }}>{theme}</div>
      {ROLES.map((r) => (
        <div key={r.key} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 14px", borderBottom: `1px solid ${p.borderSubtle}` }}>
          <span aria-hidden="true" style={{ width: 22, height: 22, borderRadius: 6, flexShrink: 0, background: p[r.key], boxShadow: `inset 0 0 0 1px ${p.borderInput}` }} />
          <span style={{ flex: 1, minWidth: 0, ...tokens.type.sm, color: p.text }}>{r.name}</span>
          <span style={{ fontFamily: tokens.font.mono, fontSize: 11, color: p.textSecondary }}>{r.scale} {Math.round(toneOf(p[r.key]))}</span>
          <span style={{ fontFamily: tokens.font.mono, fontSize: 11, color: p.textTertiary, width: 58, textAlign: "right" }}>{p[r.key]}</span>
        </div>
      ))}
    </div>
  );
}

export function Styles() {
  usePageMeta("Styles", "Preview Halaska UI in your brand: a colour turned into a tonal scale, three headline styles and three corner styles, applied to every preview.");
  const { theme, brand, setBrand } = useSite();
  const pal = usePal(theme);
  const isPreset = !brand.color || BRAND_COLORS.some((c) => c.value === brand.color);
  const [hex, setHex] = useState(isPreset ? "" : brand.color.slice(1));
  useEffect(() => { Object.values(KIT_TYPE_STYLES).forEach(loadKitTypeStyle); }, []);
  useEffect(() => { if (isPreset) setHex(""); }, [isPreset]);
  const typeHex = (v) => {
    const clean = v.replace(/[^0-9a-fA-F]/g, "").slice(0, 6);
    setHex(clean);
    const full = clean.length === 6 || clean.length === 3 ? normalHex(clean) : null;
    if (full) setBrand({ color: full });
  };
  const source = brand.color || "#8b5cf6";
  const primary = tonalPalette(source);
  const neutral = brand.color ? neutralPalette(brand.color) : tonalPalette("#808080");
  const changed = brand.color !== BRAND_DEFAULT.color || brand.type !== BRAND_DEFAULT.type || brand.radius !== BRAND_DEFAULT.radius;
  const label = { ...tokens.type.sm, fontWeight: tokens.weight.medium, color: pal.text, margin: "0 0 10px" };
  const props = [brand.color && `color="${brand.color}"`, brand.type !== "clean" && `type="${brand.type}"`, brand.radius !== "round" && `radius="${brand.radius}"`].filter(Boolean).join(" ");
  const code = `import { BrandProvider, ThemeProvider } from "./halaska-kit";

// Wrap once. Every kit component inside follows.
<BrandProvider${props ? " " + props : ""}>
  <ThemeProvider theme="${theme}">
    <App />
  </ThemeProvider>
</BrandProvider>`;
  const ask = `Wrap the app in the kit's BrandProvider${props ? ` with ${props.replace(/ /g, ", ")}` : " with our brand colour as color"}.`;

  return (
    <DetailLayout sections={SECTIONS} wide>
      <PageHeader eyebrow="Docs" title="Styles"
        lead="See the kit in your brand. Pick a colour, a headline style and a corner feel. Every preview on this site follows, and the same three settings work in your project." />

      <Section id="style" title="Your style" lead="The same controls sit in the bar at the foot of every page.">
        <p style={label}>Colour</p>
        <div className="style-opts" role="radiogroup" aria-label="Colour">
          {[{ name: "Default", value: null }, ...BRAND_COLORS].map((c) => {
            const on = isPreset && brand.color === c.value;
            return (
              <OptionCard key={c.name} on={on} label={c.name} onClick={() => setBrand({ color: c.value })}>
                <span style={{ display: "flex", alignItems: "center", gap: 10, width: "100%" }}>
                  <span aria-hidden="true" style={{ width: 28, height: 28, borderRadius: 8, background: c.value || DEFAULT_SWATCH, flexShrink: 0 }} />
                  <span style={{ display: "flex", flexDirection: "column", minWidth: 0 }}>
                    <span style={{ ...tokens.type.sm, fontWeight: tokens.weight.medium, color: pal.text }}>{c.name}</span>
                    <span style={{ fontFamily: tokens.font.mono, fontSize: 11, color: pal.textTertiary }}>{c.value || "Greyscale"}</span>
                  </span>
                </span>
              </OptionCard>
            );
          })}
        <label style={{
          display: "flex", alignItems: "center", gap: 10, padding: 12, minWidth: 0, borderRadius: FRAME_RADIUS, cursor: "text",
          background: pal.bgElevated, border: `1px solid ${!isPreset ? pal.text : pal.borderSubtle}`, transition: `border-color ${motion.normal} ${motion.easeInOut}`,
        }}>
          <span style={{ position: "relative", width: 28, height: 28, borderRadius: 8, flexShrink: 0, overflow: "hidden", cursor: "pointer",
            background: !isPreset ? brand.color : "conic-gradient(#f43f5e, #f59e0b, #10b981, #3b82f6, #8b5cf6, #f43f5e)" }}>
            <input type="color" aria-label="Pick a custom colour" value={!isPreset ? brand.color : "#3b82f6"}
              onChange={(e) => { setBrand({ color: e.target.value }); setHex(e.target.value.slice(1)); }}
              style={{ position: "absolute", inset: -6, width: 40, height: 40, padding: 0, border: "none", opacity: 0, cursor: "pointer" }} />
          </span>
          <span style={{ display: "flex", flexDirection: "column", minWidth: 0 }}>
          <span style={{ ...tokens.type.sm, fontWeight: tokens.weight.medium, color: pal.text }}>Custom</span>
          <span style={{ display: "inline-flex", alignItems: "center", fontFamily: tokens.font.mono, fontSize: 11, color: pal.textTertiary }}>
            #<input type="text" spellCheck={false} autoCapitalize="off" autoCorrect="off" aria-label="Custom colour, hex code" placeholder="2563eb"
              value={hex} onChange={(e) => typeHex(e.target.value)}
              style={{ width: 56, padding: 0, marginLeft: 1, border: "none", outline: "none", background: "transparent", color: pal.text, fontFamily: tokens.font.mono, fontSize: 11 }} />
          </span>
          </span>
        </label>
        </div>

        <p style={{ ...label, marginTop: 28 }}>Headlines</p>
        <div className="style-opts" role="radiogroup" aria-label="Headline style">
          {Object.entries(KIT_TYPE_STYLES).map(([id, st]) => (
            <OptionCard key={id} on={brand.type === id} label={st.name} onClick={() => setBrand({ type: id })}>
              <span style={{ fontFamily: `'${st.heading}', ${tokens.font.sans}`, fontSize: 19 * (st.scale || 1), lineHeight: 1.15, whiteSpace: "nowrap",  fontWeight: st.weight || 600, letterSpacing: st.tracking || "-0.02em", color: pal.text }}>Refund approved</span>
              <span style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <span style={{ ...tokens.type.sm, fontWeight: tokens.weight.medium, color: pal.text }}>{st.name} <span style={{ fontWeight: tokens.weight.regular, color: pal.textTertiary }}>· {st.heading}</span></span>
                <span style={{ ...tokens.type.xs, color: pal.textSecondary, lineHeight: 1.5 }}>{TYPE_NOTES[id]}</span>
              </span>
            </OptionCard>
          ))}
        </div>

        <p style={{ ...label, marginTop: 28 }}>Corners</p>
        <div className="style-opts" role="radiogroup" aria-label="Corners">
          {Object.keys(KIT_RADIUS_STYLES).map((id) => (
            <OptionCard key={id} on={brand.radius === id} label={CORNERS[id].name} onClick={() => setBrand({ radius: id })}>
              <span aria-hidden="true" style={{ display: "flex", alignItems: "center", gap: 8, color: pal.textSecondary }}>
                <span style={{ width: 54, height: 34, borderRadius: Math.min(17, 16 * KIT_RADIUS_STYLES[id]), background: pal.bgMuted, boxShadow: `inset 0 0 0 1px ${pal.border}` }} />
                <span style={{ width: 46, height: 22, borderRadius: Math.min(11, radiusFor(22) * KIT_RADIUS_STYLES[id]), background: pal.text }} />
                <CornerIcon kind={id} size={16} />
              </span>
              <span style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <span style={{ ...tokens.type.sm, fontWeight: tokens.weight.medium, color: pal.text }}>{CORNERS[id].name}</span>
                <span style={{ ...tokens.type.xs, color: pal.textSecondary }}>{CORNERS[id].note}</span>
              </span>
            </OptionCard>
          ))}
        </div>
        {changed && (
          <div style={{ marginTop: 16 }}>
            <Button theme={theme} variant="ghost" size="sm" onClick={() => { setBrand(BRAND_DEFAULT); setHex(""); }}>Reset to default</Button>
          </div>
        )}
      </Section>

      <Section id="preview" title="Preview">
        <PreviewFrame minHeight={420} toolbar={false} pad={28}><Sample /></PreviewFrame>
      </Section>

      <Section id="scale" title="Tonal scale"
        lead="Your colour is spread into a scale from 0, black, to 100, white, the way Material Design builds colour systems. A tone is a measured lightness, so tone 40 has the same contrast against white in any hue.">
        <ToneRow name="Primary" palette={primary} pal={pal} note={brand.color ? `From ${brand.color}, tone ${Math.round(toneOf(brand.color))}` : "The default accent, violet"} />
        <ToneRow name="Neutral" palette={neutral} pal={pal} note={brand.color ? "The same hue, almost grey" : "Pure grey by default"} />
        <Prose>
          <p style={{ margin: 0 }}>Surfaces, borders and text come from the neutral scale, so a brand colour tints the whole interface without colouring it. The tint is strongest in the darkest tones and close to nothing in the lightest.</p>
        </Prose>
      </Section>

      <Section id="roles" title="Roles" lead="Each part of the interface takes a fixed tone, in light and in dark. Your colour is kept as the primary action when it has the contrast for it, and moved along its own scale when it does not.">
        <div className="roles">
          <RolePanel theme="light" color={brand.color} chrome={pal} />
          <RolePanel theme="dark" color={brand.color} chrome={pal} />
        </div>
      </Section>

      <Section id="use" title="Use it" lead="The settings above, as code. BrandProvider restyles every kit component inside it and nothing outside it.">
        <CodeBlock code={code} />
        <Prose>
          <p style={{ margin: "14px 0 6px" }}>Or tell your coding agent:</p>
        </Prose>
        <CodeBlock code={ask} />
      </Section>
    </DetailLayout>
  );
}
