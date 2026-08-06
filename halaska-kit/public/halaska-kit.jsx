import { useState, useRef, useEffect, useCallback, createContext, useContext, Fragment } from "react";
import {
  ResponsiveContainer,
  LineChart, Line, Area, AreaChart,
  BarChart as RechartsBarChart, Bar,
  PieChart, Pie, Cell, Sector,
  ComposedChart,
  RadialBarChart, RadialBar,
  Treemap,
  XAxis, YAxis, CartesianGrid,
  Brush, ReferenceLine,
  Tooltip as RechartsTooltip,
} from "recharts";

// Shared Recharts tooltip styled to match the kit's Card/Popover look
function ChartTooltip({ active, payload, label, coordinate, viewBox, labelFormatter, valueFormatter, flipOnEdges, theme }) {
  if (!active || !payload || !payload.length) return null;
  const pal = usePal(theme);
  // When flipOnEdges, decide whether to render above or below the active dot
  const aboveDot = flipOnEdges && coordinate && viewBox && coordinate.y > viewBox.height / 2;
  return (
    <div style={{
      background: theme === "dark" ? "rgba(30,30,30,0.95)" : "rgba(255,255,255,0.95)",
      backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)",
      border: `1px solid ${pal.borderSubtle}`, borderRadius: tokens.radius.md,
      padding: "8px 12px", fontFamily: tokens.font.sans,
      boxShadow: `0 8px 24px ${pal.shadowLg}`,
      transform: aboveDot ? "translateY(-100%) translateY(-12px)" : "translateY(12px)",
    }}>
      {label != null && (
        <div style={{ ...tokens.type.xs, color: pal.textTertiary, marginBottom: 4, textTransform: "uppercase", letterSpacing: 0.3 }}>
          {labelFormatter ? labelFormatter(label) : label}
        </div>
      )}
      {payload.map((p, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, ...tokens.type.sm, color: pal.text }}>
          <span style={{ width: 8, height: 8, borderRadius: 4, background: p.color || p.fill, flexShrink: 0 }} />
          <span style={{ color: pal.textSecondary }}>{p.name}</span>
          <span style={{ fontVariantNumeric: "tabular-nums", fontWeight: tokens.weight.medium, marginLeft: "auto" }}>
            {valueFormatter ? valueFormatter(p.value) : p.value}
          </span>
        </div>
      ))}
    </div>
  );
}

// shadcn/ui components available in Claude artifacts:
// Badge, Button, Card, Checkbox, Input, Label, Progress, RadioGroup,
// Select, Separator, Skeleton, Switch, Tabs, Textarea
// Halaska Kit provides styled versions of all the above.

// ═══════════════════════════════════════════════════════════════
//  HALASKA KIT v1.3 — UX patterns & components for AI products
//  shadcn/ui foundations · Geist · Lucide 1px
//  AI interface patterns · Animated selections · Trading-agent theme
// ═══════════════════════════════════════════════════════════════

// ─── GLOBAL STYLES (injected once) ────────────────────────────

const GLOBAL_STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&family=Geist+Mono:wght@400;500&display=swap');

@keyframes halaska-blink { 0%,100% { opacity:1 } 50% { opacity:0 } }
@keyframes halaska-spin { to { transform: rotate(360deg) } }
@keyframes halaska-shimmer { 0% { background-position: 200% 0 } 100% { background-position: -200% 0 } }
@keyframes halaska-fade-in { from { opacity: 0 } to { opacity: 1 } }
@keyframes halaska-scale-in { from { opacity: 0; transform: scale(0.95) } to { opacity: 1; transform: scale(1) } }

@keyframes halaska-check-draw {
  0% { stroke-dashoffset: 14; }
  100% { stroke-dashoffset: 0; }
}

@keyframes halaska-radio-dot-in {
  0% { transform: scale(0); }
  45% { transform: scale(1.45); }
  70% { transform: scale(0.9); }
  100% { transform: scale(1); }
}
@keyframes halaska-radio-dot-out {
  0% { transform: scale(1); }
  100% { transform: scale(0); }
}
@keyframes halaska-radio-ring-in {
  0% { border-color: var(--ring-idle); }
  100% { border-color: var(--ring-active); }
}

@keyframes halaska-rolodex-out {
  0% { transform: translateY(0); opacity: 1; }
  100% { transform: translateY(-40%); opacity: 0; }
}
@keyframes halaska-rolodex-in {
  0% { transform: translateY(40%); opacity: 0; }
  100% { transform: translateY(0); opacity: 1; }
}
@keyframes halaska-blur-out {
  0% { filter: blur(0); opacity: 1; transform: translateY(0); }
  100% { filter: blur(3px); opacity: 0; transform: translateY(-30%); }
}
@keyframes halaska-blur-in {
  0% { filter: blur(3px); opacity: 0; transform: translateY(30%); }
  100% { filter: blur(0); opacity: 1; transform: translateY(0); }
}
@keyframes halaska-dropdown-expand {
  0% { opacity: 0; transform: scaleY(0.6) translateY(-4px); }
  100% { opacity: 1; transform: scaleY(1) translateY(0); }
}

@keyframes halaska-thinking-dot {
  0%, 80%, 100% { transform: scale(0.55); opacity: 0.35; }
  40% { transform: scale(1); opacity: 1; }
}
@keyframes halaska-thinking-pulse {
  0% { transform: scale(0.4); opacity: 0.9; }
  40% { opacity: 0.5; }
  100% { transform: scale(3.4); opacity: 0; }
}
@keyframes halaska-live-pulse {
  0% { transform: scale(0.5); opacity: 0.7; }
  70% { opacity: 0.2; }
  100% { transform: scale(2.4); opacity: 0; }
}
@keyframes halaska-star-burst {
  0% { transform: scale(1); opacity: 0.9; }
  60% { opacity: 0.4; }
  100% { transform: scale(1.6); opacity: 0; }
}
@keyframes halaska-bar-bounce {
  0% { transform: scaleY(1); }
  40% { transform: scaleY(1.08); }
  70% { transform: scaleY(0.97); }
  100% { transform: scaleY(1); }
}
@keyframes halaska-tab-fade {
  from { opacity: 0; transform: translateY(4px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes halaska-step-in {
  0% { opacity: 0; transform: translateY(6px); filter: blur(2px); }
  100% { opacity: 1; transform: translateY(0); filter: blur(0); }
}

input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 14px; height: 14px; border-radius: 7px;
  background: #1a1a1a; border: none; cursor: pointer;
}

textarea::-webkit-resizer {
  display: none;
}
`;

let stylesInjected = false;
function injectStyles() {
  if (stylesInjected) return;
  stylesInjected = true;
  const el = document.createElement("style");
  el.textContent = GLOBAL_STYLES;
  document.head.appendChild(el);
}

// ─── 1. TOKENS ─────────────────────────────────────────────────

const tokens = {
  space: { xs: 4, sm: 8, md: 16, lg: 32, xl: 40, xxl: 80, xxxl: 160, xxxxl: 240 },
  radius: { xs: 4, sm: 8, md: 16, lg: 24, xl: 32, pill: 999 },
  type: {
    xxs: { fontSize: 9, lineHeight: 1.3 },
    xs: { fontSize: 10, lineHeight: 1.45 },
    sm: { fontSize: 12, lineHeight: 1.55, letterSpacing: "0.01em" },
    base: { fontSize: 13, lineHeight: 1.6, letterSpacing: "0.01em" },
    md: { fontSize: 14, lineHeight: 1.6, letterSpacing: "0.005em" },
    lg: { fontSize: 16, lineHeight: 1.5 },
    xl: { fontSize: 20, lineHeight: 1.35 },
    xxl: { fontSize: 24, lineHeight: 1.3 },
    xxxl: { fontSize: 32, lineHeight: 1.2 },
    display: { fontSize: 40, lineHeight: 1.15 },
  },
  font: {
    sans: "'Geist', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    mono: "'Geist Mono', 'SF Mono', 'Fira Code', monospace",
  },
  weight: { regular: 400, medium: 500, semibold: 600, bold: 700 },
  light: {
    bg: "#fafafa",
    bgElevated: "#ffffff",
    bgSubtle: "#f3f3f3",
    bgMuted: "#eeeeee",
    bgHover: "#e8e8e8",
    bgInput: "#f0f0f0",
    border: "#e5e5e5",
    borderSubtle: "#eeeeee",
    borderInput: "rgba(0,0,0,0.06)",
    borderFocus: "#444444",
    text: "#3d3d3d",
    textSecondary: "#888888",
    textTertiary: "#aaaaaa",
    textMuted: "#cccccc",
    textInverse: "#ffffff",
    shadow: "rgba(0,0,0,0.04)",
    shadowMd: "rgba(0,0,0,0.06)",
    shadowLg: "rgba(0,0,0,0.1)",
    accent: "#3b82f6",
    accentHover: "#2563eb",
    accentBg: "#eff6ff",
    accentText: "#3b82f6",
    success: "#22c55e",
    successHover: "#16a34a",
    successBg: "#f0fdf4",
    warning: "#f59e0b",
    warningHover: "#d97706",
    warningBg: "#fffbeb",
    danger: "#ef4444",
    dangerHover: "#dc2626",
    dangerBg: "#fef2f2",
  },
  dark: {
    bg: "#1a1a1a",
    bgElevated: "#2a2a2a",
    bgSubtle: "#222222",
    bgMuted: "#333333",
    bgHover: "#3d3d3d",
    bgInput: "#252525",
    border: "#3a3a3a",
    borderSubtle: "#2f2f2f",
    borderInput: "rgba(255,255,255,0.06)",
    borderFocus: "#cccccc",
    text: "#d8d8d8",
    textSecondary: "#999999",
    textTertiary: "#6a6a6a",
    textMuted: "#4a4a4a",
    textInverse: "#1a1a1a",
    shadow: "rgba(0,0,0,0.2)",
    shadowMd: "rgba(0,0,0,0.3)",
    shadowLg: "rgba(0,0,0,0.4)",
    accent: "#60a5fa",
    accentHover: "#3b82f6",
    accentBg: "rgba(96,165,250,0.12)",
    accentText: "#60a5fa",
    success: "#4ade80",
    successHover: "#22c55e",
    successBg: "rgba(74,222,128,0.1)",
    warning: "#fbbf24",
    warningHover: "#f59e0b",
    warningBg: "rgba(251,191,36,0.1)",
    danger: "#f87171",
    dangerHover: "#ef4444",
    dangerBg: "rgba(248,113,113,0.1)",
  },
};

const motion = {
  // Durations aligned with Material Design 3
  fast: "0.15s",      // Short 3 — micro-interactions, state changes
  normal: "0.25s",    // Medium 1 — most UI transitions
  smooth: "0.35s",    // Medium 3 — expanding panels, color transitions
  spring: "0.4s",     // Medium 4 — bouncy elements (radio, segmented)
  slow: "0.5s",       // Long 2 — page-level transitions

  // Easing curves — Material Design standard set
  easeInOut: "cubic-bezier(0.4, 0, 0.2, 1)",   // Standard — on-screen movement
  easeOut: "cubic-bezier(0.0, 0, 0.2, 1)",      // Deceleration — entering elements
  easeIn: "cubic-bezier(0.4, 0, 1, 1)",         // Acceleration — exiting elements
  emphasized: "cubic-bezier(0.2, 0, 0, 1)",     // Emphasized — dramatic deceleration
  springCurve: "cubic-bezier(0.34, 1.56, 0.64, 1)", // Apple-style overshoot bounce
};

const ThemeContext = createContext("light");
function ThemeProvider({ theme = "light", children }) {
  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>;
}
function useThemeContext() { return useContext(ThemeContext); }

// Accent color context — allows live accent swapping
const AccentContext = createContext(null);
function useAccent() { return useContext(AccentContext); }

function p(theme) {
  const base = theme === "dark" ? tokens.dark : tokens.light;
  return base;
}

// Hook that returns palette with accent overrides applied
function usePal(themeProp) {
  const ctxTheme = useThemeContext();
  const theme = themeProp || ctxTheme;
  const accent = useAccent();
  const base = p(theme);
  if (!accent || accent === base.accent) return base;
  // Generate variants from the accent hex
  const hex = accent;
  const r = parseInt(hex.slice(1,3), 16), g = parseInt(hex.slice(3,5), 16), b = parseInt(hex.slice(5,7), 16);
  const hR = Math.max(0, r - 30), hG = Math.max(0, g - 30), hB = Math.max(0, b - 30);
  const hoverHex = `#${hR.toString(16).padStart(2,'0')}${hG.toString(16).padStart(2,'0')}${hB.toString(16).padStart(2,'0')}`;
  const bgAlpha = theme === "dark" ? 0.12 : 0.08;
  return {
    ...base,
    accent: hex,
    accentText: hex,
    accentHover: hoverHex,
    accentBg: `rgba(${r},${g},${b},${bgAlpha})`,
  };
}

const interactiveBase = {
  fontFamily: tokens.font.sans,
  cursor: "pointer",
  border: "none",
  outline: "none",
  transition: `all ${motion.normal} ${motion.easeInOut}`,
};

// ─── AVATAR COLORS ────────────────────────────────────────────
// Deterministic palette from name hash — soft, muted tones

const AVATAR_COLORS = [
  { bg: "#fee2e2", text: "#b91c1c" },  // red
  { bg: "#fef3c7", text: "#92400e" },  // amber
  { bg: "#d1fae5", text: "#065f46" },  // emerald
  { bg: "#dbeafe", text: "#1e40af" },  // blue
  { bg: "#ede9fe", text: "#5b21b6" },  // violet
  { bg: "#fce7f3", text: "#9d174d" },  // pink
  { bg: "#e0f2fe", text: "#075985" },  // sky
  { bg: "#fef9c3", text: "#854d0e" },  // yellow
  { bg: "#f0fdf4", text: "#166534" },  // green
  { bg: "#f5f3ff", text: "#6d28d9" },  // purple
];

function getAvatarColor(name) {
  let hash = 0;
  for (let i = 0; i < (name || "").length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

// ─── TEXT ANIMATION UTILITIES ─────────────────────────────────
// Available for headings, labels, or custom components.
// Not used by Button (which uses inner bottom stroke instead).

// Rolodex: vertical flip — text rolls out and back in

function useRolodex(text, active) {
  const [animClass, setAnimClass] = useState("");
  const timeoutRef = useRef(null);
  const animatingRef = useRef(false);

  useEffect(() => {
    if (!active || !text || animatingRef.current) return;

    animatingRef.current = true;
    setAnimClass("halaska-rolodex-out");

    timeoutRef.current = setTimeout(() => {
      setAnimClass("halaska-rolodex-in");
      timeoutRef.current = setTimeout(() => {
        setAnimClass("");
        animatingRef.current = false;
      }, 120);
    }, 100);

    return () => { if (timeoutRef.current) clearTimeout(timeoutRef.current); };
  }, [active]);

  return animClass;
}

// Blur swap: text blurs out and resolves back in

function useBlurSwap(text, active) {
  const [animClass, setAnimClass] = useState("");
  const timeoutRef = useRef(null);
  const animatingRef = useRef(false);

  useEffect(() => {
    if (!active || !text || animatingRef.current) return;

    animatingRef.current = true;
    setAnimClass("halaska-blur-out");

    timeoutRef.current = setTimeout(() => {
      setAnimClass("halaska-blur-in");
      timeoutRef.current = setTimeout(() => {
        setAnimClass("");
        animatingRef.current = false;
      }, 140);
    }, 110);

    return () => { if (timeoutRef.current) clearTimeout(timeoutRef.current); };
  }, [active]);

  return animClass;
}

// ─── 2. TYPOGRAPHY ────────────────────────────────────────────

function Text({
  children, size = "base", weight = "regular", color, mono, muted, secondary,
  align, truncate, theme: tp, style: sp, as: C = "span",
}) {
  const ctx = useThemeContext();
  const theme = tp || ctx;
  const pal = usePal(theme);
  let c = pal.text;
  if (color) c = color;
  else if (muted) c = pal.textMuted;
  else if (secondary) c = pal.textSecondary;

  return (
    <C style={{
      ...tokens.type[size], fontWeight: tokens.weight[weight],
      fontFamily: mono ? tokens.font.mono : tokens.font.sans,
      color: c, textAlign: align, transition: `color ${motion.smooth} ${motion.easeInOut}`,
      ...(truncate && { overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }),
      ...sp,
    }}>{children}</C>
  );
}

function Heading({ children, level = 1, theme: tp, style: sp }) {
  const ctx = useThemeContext(); const theme = tp || ctx; const pal = usePal(theme);
  const sizes = { 1: "xxxl", 2: "xxl", 3: "xl", 4: "lg", 5: "md", 6: "base" };
  const Tag = `h${level}`;
  return (
    <Tag style={{
      ...tokens.type[sizes[level]], fontWeight: level <= 2 ? tokens.weight.bold : tokens.weight.semibold,
      fontFamily: tokens.font.sans, color: pal.text, margin: 0,
      letterSpacing: level <= 2 ? "-0.02em" : "0em", transition: `color ${motion.smooth} ${motion.easeInOut}`, ...sp,
    }}>{children}</Tag>
  );
}

function Label({ children, required, theme: tp, style: sp }) {
  const ctx = useThemeContext(); const theme = tp || ctx; const pal = usePal(theme);
  return (
    <label style={{
      ...tokens.type.sm, fontWeight: tokens.weight.medium, fontFamily: tokens.font.sans,
      color: pal.textSecondary, display: "flex", alignItems: "center",
      gap: 4, transition: `color ${motion.smooth} ${motion.easeInOut}`, ...sp,
    }}>{children}{required && <span style={{ color: pal.danger }}>*</span>}</label>
  );
}

function Caption({ children, theme: tp, style: sp }) {
  const ctx = useThemeContext(); const theme = tp || ctx; const pal = usePal(theme);
  return <span style={{ ...tokens.type.sm, color: pal.textTertiary, fontFamily: tokens.font.sans, transition: `color ${motion.smooth} ${motion.easeInOut}`, ...sp }}>{children}</span>;
}

function Code({ children, theme: tp, style: sp }) {
  const ctx = useThemeContext(); const theme = tp || ctx; const pal = usePal(theme);
  return (
    <code style={{
      ...tokens.type.sm, fontFamily: tokens.font.mono, background: pal.bgMuted,
      color: pal.accentText, padding: `${2}px ${8}px`,
      borderRadius: tokens.radius.xs, transition: `all ${motion.smooth} ${motion.easeInOut}`, ...sp,
    }}>{children}</code>
  );
}

// ─── 3. BUTTONS (inner bottom stroke on hover) ───────────────

function Button({
  children, variant = "primary", size = "md", icon, iconRight,
  disabled, loading, fullWidth, onClick, theme: tp, style: sp,
}) {
  const ctx = useThemeContext(); const theme = tp || ctx; const pal = usePal(theme);
  const [hover, setHover] = useState(false);
  const [pressed, setPressed] = useState(false);

  const sizes = {
    sm: { padding: `${8 - 1}px ${12}px`, ...tokens.type.sm, height: 30 },
    md: { padding: `${8}px ${16}px`, ...tokens.type.base, height: 36 },
    lg: { padding: `${12}px ${24}px`, ...tokens.type.md, height: 42 },
    xl: { padding: `${16}px ${32}px`, ...tokens.type.lg, height: 48 },
  };

  // Inner shadow color — darker tint of the button's own background
  const shadowColors = {
    primary: "inset 0 -2px 0 0 rgba(0,0,0,0.35)",
    secondary: "inset 0 -2px 0 0 rgba(0,0,0,0.05)",
    outline: "inset 0 -2px 0 0 rgba(0,0,0,0.08)",
    ghost: "inset 0 -2px 0 0 rgba(0,0,0,0.06)",
    accent: "inset 0 -2px 0 0 rgba(0,0,0,0.3)",
    danger: "inset 0 -2px 0 0 rgba(0,0,0,0.3)",
  };

  // Brightness lift per variant
  const brightnessMap = {
    primary: 1.15,
    secondary: 1.04,
    outline: 1.12,
    ghost: 1.12,
    accent: 1.06,
    danger: 1.06,
  };

  const variants = {
    primary: {
      background: disabled ? pal.bgMuted : pal.text,
      color: disabled ? pal.textMuted : pal.textInverse,
    },
    secondary: {
      background: disabled ? "transparent" : pal.bgMuted,
      color: disabled ? pal.textMuted : pal.text,
    },
    outline: {
      background: disabled ? "transparent" : "transparent",
      color: disabled ? pal.textMuted : pal.text,
      border: `1.5px solid ${disabled ? pal.borderSubtle : pal.borderInput}`,
    },
    ghost: {
      background: disabled ? "transparent" : "transparent",
      color: disabled ? pal.textMuted : pal.textSecondary,
    },
    accent: {
      background: disabled ? pal.bgMuted : pal.accent,
      color: disabled ? pal.textMuted : "#ffffff",
    },
    danger: {
      background: disabled ? pal.bgMuted : pal.danger,
      color: disabled ? pal.textMuted : "#ffffff",
    },
  };

  const s = sizes[size]; const v = variants[variant] || variants.primary;
  const isHover = hover && !disabled && !loading;
  const shadow = shadowColors[variant] || shadowColors.primary;
  const brightness = brightnessMap[variant] || 1.12;

  return (
    <button
      onClick={disabled || loading ? undefined : onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => { setHover(false); setPressed(false); }}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      disabled={disabled}
      style={{
        ...interactiveBase, ...s, border: "none", ...v,
        fontWeight: tokens.weight.medium, borderRadius: tokens.radius.md,
        display: "inline-flex", alignItems: "center", justifyContent: "center",
        gap: 8, width: fullWidth ? "100%" : "auto",
        transform: pressed && !disabled ? "scale(0.97)" : "scale(1)",
        opacity: loading ? 0.7 : 1, pointerEvents: disabled || loading ? "none" : "auto",
        letterSpacing: "-0.01em",
        boxShadow: isHover ? shadow : "none",
        filter: isHover ? `brightness(${brightness})` : "brightness(1)",
        transition: `all ${motion.normal} ${motion.easeInOut}, box-shadow ${motion.fast} ${motion.easeOut}, filter ${motion.fast} ${motion.easeOut}`,
        ...sp,
      }}
    >
      {loading && <Spinner size={s.fontSize} color={v.color} />}
      {!loading && icon && <span style={{ fontSize: s.fontSize + 2, lineHeight: 1, display: "flex" }}>{icon}</span>}
      <span style={{ fontFamily: tokens.font.sans, fontWeight: tokens.weight.medium }}>
        {children}
      </span>
      {iconRight && <span style={{ fontSize: s.fontSize + 2, lineHeight: 1, display: "flex" }}>{iconRight}</span>}
    </button>
  );
}

function IconButton({ icon, size = 36, variant = "ghost", onClick, theme: tp, label: ariaLabel, style: sp }) {
  const ctx = useThemeContext(); const theme = tp || ctx; const pal = usePal(theme);
  const [hover, setHover] = useState(false);
  const bgMap = {
    ghost: hover ? pal.bgSubtle : "transparent",
    secondary: hover ? pal.bgHover : pal.bgMuted,
    outline: hover ? pal.bgSubtle : "transparent",
  };
  return (
    <button onClick={onClick} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      aria-label={ariaLabel} style={{
        ...interactiveBase, width: size, height: size, borderRadius: tokens.radius.md,
        background: bgMap[variant] || bgMap.ghost, color: pal.textSecondary,
        display: "flex", alignItems: "center", justifyContent: "center", fontSize: size * 0.45,
        transform: hover ? "scale(1.12)" : "scale(1)",
        ...sp,
      }}>{icon}</button>
  );
}

function ButtonGroup({ children, theme: tp }) {
  const ctx = useThemeContext(); const theme = tp || ctx; const pal = usePal(theme);
  return (
    <div style={{ display: "inline-flex", borderRadius: tokens.radius.md, overflow: "hidden", border: `1px solid ${pal.borderInput}`, transition: `border-color ${motion.smooth} ${motion.easeInOut}` }}>
      {Array.isArray(children) ? children.map((child, i) => (
        <div key={i} style={{ borderRight: i < children.length - 1 ? `1px solid ${pal.borderInput}` : "none" }}>{child}</div>
      )) : children}
    </div>
  );
}

function LinkButton({ children, onClick, icon, iconRight, size = "md", theme: tp, style: sp }) {
  const ctx = useThemeContext(); const theme = tp || ctx; const pal = usePal(theme);
  const [hover, setHover] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const sizes = {
    sm: tokens.type.sm,
    md: tokens.type.base,
    lg: tokens.type.md,
  };
  const s = sizes[size];
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => { setLeaving(false); setHover(true); }}
      onMouseLeave={() => { setLeaving(true); setHover(false); }}
      onTransitionEnd={() => { if (leaving) setLeaving(false); }}
      style={{
        ...interactiveBase, ...s, background: "transparent", color: pal.textSecondary,
        fontWeight: tokens.weight.medium, display: "inline-flex", alignItems: "center",
        gap: 4, padding: 0, textDecoration: "none",
        position: "relative", overflow: "hidden", paddingBottom: 3,
        ...sp,
      }}
    >
      {icon && <span style={{ display: "flex", lineHeight: 1 }}>{icon}</span>}
      {children}
      {iconRight && <span style={{ display: "flex", lineHeight: 1 }}>{iconRight}</span>}
      <span style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        width: "100%",
        height: 1,
        background: pal.textTertiary,
        transformOrigin: hover ? "left center" : "right center",
        transform: hover ? "scaleX(1)" : leaving ? "scaleX(0)" : "scaleX(0)",
        transition: `transform ${motion.normal} ${motion.emphasized}`,
      }} />
    </button>
  );
}

// ─── 4. FORM INPUTS (soft background, minimal stroke) ─────────

function TextInput({
  value, onChange, placeholder, label, caption, error, icon, disabled,
  type = "text", size = "md", theme: tp, style: sp,
}) {
  const ctx = useThemeContext(); const theme = tp || ctx; const pal = usePal(theme);
  const [focused, setFocused] = useState(false);
  const [hover, setHover] = useState(false);

  const sizes = {
    sm: { paddingTop: 8, paddingBottom: 8, paddingLeft: 16, paddingRight: 16, ...tokens.type.sm, height: 32 },
    md: { paddingTop: 10, paddingBottom: 10, paddingLeft: 16, paddingRight: 16, ...tokens.type.base, height: 38 },
    lg: { paddingTop: 12, paddingBottom: 12, paddingLeft: 16, paddingRight: 16, ...tokens.type.md, height: 44 },
  };
  const s = sizes[size];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4, ...sp }}>
      {label && <Label theme={theme}>{label}</Label>}
      <div style={{ position: "relative" }}
        onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
        {icon && (
          <span style={{
            position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)",
            color: pal.textTertiary, fontSize: s.fontSize + 2, pointerEvents: "none", display: "flex",
          }}>{icon}</span>
        )}
        <input
          type={type} value={value} onChange={(e) => onChange?.(e.target.value)}
          placeholder={placeholder} disabled={disabled}
          onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
          style={{
            ...s, width: "100%", boxSizing: "border-box", fontFamily: tokens.font.sans,
            color: disabled ? pal.textMuted : pal.text,
            background: disabled ? pal.bgSubtle : pal.bgInput,
            border: error ? `1.5px solid ${pal.danger}`
              : focused ? `1.5px solid ${pal.borderFocus}`
              : hover && !disabled ? `1.5px solid ${pal.borderSubtle}`
              : "1.5px solid transparent",
            borderRadius: tokens.radius.md, outline: "none",
            transition: `all ${motion.normal} ${motion.easeInOut}`,
            paddingLeft: icon ? 42 : 16,
          }}
        />
      </div>
      {(caption || error) && (
        <Caption theme={theme} style={error ? { color: pal.danger } : undefined}>{error || caption}</Caption>
      )}
    </div>
  );
}

function TextArea({ value, onChange, placeholder, label, caption, rows = 3, disabled, theme: tp, style: sp }) {
  const ctx = useThemeContext(); const theme = tp || ctx; const pal = usePal(theme);
  const [focused, setFocused] = useState(false);
  const [hover, setHover] = useState(false);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4, ...sp }}>
      {label && <Label theme={theme}>{label}</Label>}
      <div style={{ position: "relative" }}
        onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
        <textarea value={value} onChange={(e) => onChange?.(e.target.value)}
          placeholder={placeholder} rows={rows} disabled={disabled}
          onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
          style={{
            ...tokens.type.base, width: "100%", boxSizing: "border-box", fontFamily: tokens.font.sans,
            color: disabled ? pal.textMuted : pal.text, background: disabled ? pal.bgSubtle : pal.bgInput,
            border: focused ? `1.5px solid ${pal.borderFocus}` : hover && !disabled ? `1.5px solid ${pal.borderSubtle}` : "1.5px solid transparent",
            borderRadius: tokens.radius.md, padding: `${12}px ${16}px`,
            outline: "none", resize: "vertical", transition: `all ${motion.normal} ${motion.easeInOut}`,
          }} />
        <div style={{
          position: "absolute", bottom: 6, right: 8, pointerEvents: "none",
          display: "flex", flexDirection: "column", gap: 2, opacity: 0.25,
        }}>
          <div style={{ width: 8, height: 1, background: pal.textTertiary, borderRadius: 1, alignSelf: "flex-end" }} />
          <div style={{ width: 12, height: 1, background: pal.textTertiary, borderRadius: 1, alignSelf: "flex-end" }} />
        </div>
      </div>
      {caption && <Caption theme={theme}>{caption}</Caption>}
    </div>
  );
}

function Select({ value, onChange, options, placeholder, label, disabled, size = "md", theme: tp, style: sp }) {
  const ctx = useThemeContext(); const theme = tp || ctx; const pal = usePal(theme);
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const [hoverIdx, setHoverIdx] = useState(-1);

  useEffect(() => {
    function handleClick(e) { if (ref.current && !ref.current.contains(e.target)) setOpen(false); }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const sizes = {
    sm: { ...tokens.type.sm, height: 32, px: 12 },
    md: { ...tokens.type.base, height: 38, px: 16 },
    lg: { ...tokens.type.md, height: 44, px: 16 },
  };
  const s = sizes[size];

  const selectedLabel = options.reduce((acc, opt) => {
    const val = typeof opt === "string" ? opt : opt.value;
    const lab = typeof opt === "string" ? opt : opt.label;
    return val === value ? lab : acc;
  }, null);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4, ...sp }}>
      {label && <Label theme={theme}>{label}</Label>}
      <div ref={ref} style={{ position: "relative" }}>
        <button
          onClick={() => !disabled && setOpen(!open)}
          style={{
            ...interactiveBase, ...s, width: "100%", boxSizing: "border-box",
            textAlign: "left", display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: `0 ${s.px}px`,
            color: !value ? pal.textMuted : pal.text,
            background: disabled ? pal.bgSubtle : pal.bgInput,
            border: open ? `1.5px solid ${pal.borderFocus}` : "1.5px solid transparent",
            borderRadius: tokens.radius.md,
          }}
        >
          <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {selectedLabel || placeholder || "Select..."}
          </span>
          <span style={{ color: pal.textTertiary, display: "inline-flex" }}>
            <ChevronIcon size={12} direction={open ? "up" : "down"} />
          </span>
        </button>
        {open && (
          <div style={{
            position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0, zIndex: 50,
            background: pal.bgElevated, borderRadius: tokens.radius.md,
            boxShadow: `0 4px 20px ${pal.shadowLg}`, padding: 4,
            maxHeight: 200, overflowY: "auto",
            transformOrigin: "top center",
            animation: `halaska-dropdown-expand ${motion.fast} ${motion.easeOut} both`,
          }}>
            {options.map((opt, i) => {
              const val = typeof opt === "string" ? opt : opt.value;
              const lab = typeof opt === "string" ? opt : opt.label;
              const isActive = val === value;
              const isHover = hoverIdx === i;
              return (
                <button key={val}
                  onMouseEnter={() => setHoverIdx(i)} onMouseLeave={() => setHoverIdx(-1)}
                  onClick={() => { onChange?.(val); setOpen(false); }}
                  style={{
                    ...interactiveBase, width: "100%", textAlign: "left",
                    padding: `${8 + 1}px ${12}px`,
                    ...tokens.type.base, borderRadius: tokens.radius.sm,
                    color: isActive ? pal.text : pal.textSecondary,
                    fontWeight: isActive ? tokens.weight.medium : tokens.weight.regular,
                    background: isHover ? pal.bgSubtle : "transparent",
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    transition: `background ${motion.normal} ${motion.easeInOut}, color ${motion.normal} ${motion.easeInOut}`,
                  }}
                >
                  {lab}
                  {isActive && <span style={{ fontSize: 12, color: pal.textTertiary }}>✓</span>}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── 5. TOGGLES & SELECTIONS (animated) ──────────────────────

function Checkbox({ checked, onChange, label, disabled, theme: tp }) {
  const ctx = useThemeContext(); const theme = tp || ctx; const pal = usePal(theme);

  return (
    <label style={{ display: "flex", alignItems: "center", gap: 12, cursor: disabled ? "default" : "pointer", opacity: disabled ? 0.5 : 1 }}>
      <div onClick={(e) => { e.preventDefault(); if (!disabled) onChange?.(!checked); }}
        style={{
          width: 18, height: 18, borderRadius: tokens.radius.xs,
          background: checked ? pal.accent : pal.bgInput,
          border: checked ? "none" : "none",
          display: "flex", alignItems: "center", justifyContent: "center",
          transition: `background ${motion.fast} ${motion.easeInOut}`, flexShrink: 0,
        }}>
        {checked && (
          <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
            <path d="M1 4L3.5 6.5L9 1" stroke={pal.textInverse} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
              style={{ strokeDasharray: 14, strokeDashoffset: 0, animation: "halaska-check-draw 0.3s ease forwards" }} />
          </svg>
        )}
      </div>
      {label && <Text size="base" theme={theme} style={{ color: disabled ? pal.textMuted : pal.text }}>{label}</Text>}
    </label>
  );
}

function Radio({ checked, onChange, label, disabled, theme: tp }) {
  const ctx = useThemeContext(); const theme = tp || ctx; const pal = usePal(theme);
  return (
    <label style={{ display: "flex", alignItems: "center", gap: 12, cursor: disabled ? "default" : "pointer", opacity: disabled ? 0.5 : 1 }}>
      <div onClick={(e) => { e.preventDefault(); if (!disabled) onChange?.(); }}
        style={{
          width: 18, height: 18, borderRadius: 9,
          background: pal.bgInput,
          border: `1.5px solid ${checked ? pal.accent : "transparent"}`,
          display: "flex", alignItems: "center", justifyContent: "center",
          transition: `border-color ${motion.smooth} ${motion.easeInOut}`,
          transitionDelay: checked ? "0.15s" : "0s",
          flexShrink: 0,
        }}>
        <div style={{
          width: 8, height: 8, borderRadius: 4, background: pal.accent,
          animation: checked ? `halaska-radio-dot-in ${motion.spring} ${motion.springCurve} forwards` : `halaska-radio-dot-out ${motion.fast} ${motion.easeIn} forwards`,
        }} />
      </div>
      {label && <Text size="base" theme={theme} style={{ color: disabled ? pal.textMuted : pal.text }}>{label}</Text>}
    </label>
  );
}

function RadioGroup({ options, value, onChange, label, theme: tp }) {
  const ctx = useThemeContext(); const theme = tp || ctx;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {label && <Label theme={theme}>{label}</Label>}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {options.map((opt) => {
          const val = typeof opt === "string" ? opt : opt.value;
          const lab = typeof opt === "string" ? opt : opt.label;
          return <Radio key={val} checked={value === val} onChange={() => onChange?.(val)} label={lab} theme={theme} />;
        })}
      </div>
    </div>
  );
}

function SwitchToggle({ checked, onChange, label, theme: tp }) {
  const ctx = useThemeContext(); const theme = tp || ctx; const pal = usePal(theme);
  return (
    <label style={{ display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }}>
      <button onClick={() => onChange?.(!checked)} role="switch" aria-checked={checked}
        style={{
          ...interactiveBase, width: 44, height: 24, borderRadius: 12,
          background: checked ? pal.accent : pal.bgMuted, position: "relative", padding: 0, flexShrink: 0,
        }}>
        <div style={{
          width: 20, height: 20, borderRadius: 10,
          background: checked ? "#fff" : pal.bgElevated,
          position: "absolute", top: 2, left: checked ? 22 : 2,
          transition: `left ${motion.spring} ${motion.springCurve}`, boxShadow: "0 1px 3px rgba(0,0,0,0.15)",
        }} />
      </button>
      {label && <Text size="base" theme={theme}>{label}</Text>}
    </label>
  );
}

function ThemeToggle({ theme, onChange, size = 32 }) {
  const isDark = theme === "dark";
  const pad = 3;
  const trackW = size * 2 + pad * 2;
  const trackH = size + pad * 2;
  const lightPal = tokens.light;
  const darkPal = tokens.dark;
  const trackBg = isDark ? darkPal.bgMuted : lightPal.bgMuted;
  const thumbBg = isDark ? darkPal.bgHover : "#fff";
  const thumbShadow = isDark ? "0 1px 3px rgba(0,0,0,0.3)" : "0 1px 3px rgba(0,0,0,0.1)";

  return (
    <button
      onClick={() => onChange(isDark ? "light" : "dark")}
      style={{
        ...interactiveBase,
        width: trackW, height: trackH, borderRadius: tokens.radius.pill,
        background: trackBg, position: "relative",
        display: "flex", alignItems: "center", padding: 0,
        transition: `background ${motion.smooth} ${motion.easeInOut}`,
      }}
    >
      {/* Sliding thumb */}
      <div style={{
        position: "absolute",
        width: size, height: size, borderRadius: size / 2,
        background: thumbBg, boxShadow: thumbShadow,
        left: isDark ? pad + size : pad,
        top: pad,
        transition: `left ${motion.smooth} ${motion.emphasized}, background ${motion.smooth} ${motion.easeInOut}, box-shadow ${motion.smooth} ${motion.easeInOut}`,
      }} />
      {/* Icons — each centered in its half */}
      <div style={{
        width: size + pad, height: trackH, display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: size * 0.42, color: !isDark ? lightPal.text : darkPal.textTertiary,
        position: "relative", zIndex: 1,
        transition: `color ${motion.normal} ${motion.easeInOut}`,
      }}>☀</div>
      <div style={{
        width: size + pad, height: trackH, display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: size * 0.42, color: isDark ? darkPal.text : lightPal.textTertiary,
        position: "relative", zIndex: 1,
        transition: `color ${motion.normal} ${motion.easeInOut}`,
      }}>☾</div>
    </button>
  );
}

function SegmentedControl({ options, value, onChange, theme: tp }) {
  const ctx = useThemeContext(); const theme = tp || ctx; const pal = usePal(theme);
  const [indicator, setIndicator] = useState({});
  const containerRef = useRef(null);
  const btnRefs = useRef({});

  const update = useCallback(() => {
    const btn = btnRefs.current[value]; const container = containerRef.current;
    if (btn && container) {
      const cR = container.getBoundingClientRect(); const bR = btn.getBoundingClientRect();
      setIndicator({ left: bR.left - cR.left, width: bR.width });
    }
  }, [value]);

  useEffect(() => { update(); window.addEventListener("resize", update); return () => window.removeEventListener("resize", update); }, [update]);

  return (
    <div ref={containerRef} style={{
      display: "flex", alignItems: "center",
      background: theme === "dark" ? "rgba(51,51,51,0.5)" : "rgba(238,238,238,0.6)",
      backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)",
      borderRadius: tokens.radius.md, padding: 3, position: "relative", transition: `all ${motion.smooth} ${motion.easeInOut}`,
    }}>
      <div style={{
        position: "absolute", top: 3, height: "calc(100% - 6px)", background: pal.bgElevated,
        borderRadius: tokens.radius.sm + 2, boxShadow: `0 1px 3px ${pal.shadow}`,
        transition: `left ${motion.smooth} ${motion.emphasized}, width ${motion.normal} ${motion.easeInOut}, background ${motion.smooth} ${motion.easeInOut}`,
        ...indicator,
      }} />
      {options.map((opt) => (
        <button key={opt} ref={(el) => (btnRefs.current[opt] = el)} onClick={() => onChange(opt)} style={{
          ...interactiveBase, position: "relative", zIndex: 1, padding: `6px 0`,
          background: "transparent", ...tokens.type.sm, flex: 1,
          fontWeight: value === opt ? tokens.weight.medium : tokens.weight.regular,
          color: value === opt ? pal.text : pal.textTertiary, borderRadius: tokens.radius.sm + 2, whiteSpace: "nowrap",
          textAlign: "center",
        }}>{opt}</button>
      ))}
    </div>
  );
}

// ─── 6. LAYOUT & CARDS ────────────────────────────────────────

function Card({ children, theme: tp, padding, hover, onClick, style: sp }) {
  const ctx = useThemeContext(); const theme = tp || ctx; const pal = usePal(theme);
  const [hovered, setHovered] = useState(false);
  return (
    <div onClick={onClick} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{
        background: theme === "dark" ? "rgba(42,42,42,0.7)" : "rgba(255,255,255,0.8)",
        backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)",
        border: `1px solid ${theme === "dark" ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)"}`,
        borderRadius: tokens.radius.lg, padding: padding ?? 24,
        boxShadow: hovered && hover ? `0 4px 16px ${pal.shadowMd}` : `0 1px 4px ${pal.shadow}`,
        transition: `all ${motion.normal} ${motion.easeInOut}`, fontFamily: tokens.font.sans,
        cursor: onClick ? "pointer" : "default", ...sp,
      }}>{children}</div>
  );
}

function CardHeader({ title, subtitle, action, theme: tp }) {
  const ctx = useThemeContext(); const theme = tp || ctx; const pal = usePal(theme);
  return (
    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 16 }}>
      <div>
        <div style={{ ...tokens.type.md, fontWeight: tokens.weight.semibold, color: pal.text, fontFamily: tokens.font.sans, transition: `color ${motion.smooth} ${motion.easeInOut}` }}>{title}</div>
        {subtitle && <div style={{ ...tokens.type.sm, color: pal.textTertiary, fontFamily: tokens.font.sans, marginTop: 2, transition: `color ${motion.smooth} ${motion.easeInOut}` }}>{subtitle}</div>}
      </div>
      {action}
    </div>
  );
}

function Divider({ theme: tp, spacing }) {
  const ctx = useThemeContext(); const theme = tp || ctx; const pal = usePal(theme);
  return <div style={{ height: 1, background: pal.borderSubtle, margin: `${spacing ?? 16}px 0`, transition: `background ${motion.smooth} ${motion.easeInOut}` }} />;
}

function Stack({ children, gap = "md", direction = "column", align, justify, wrap, style: sp }) {
  return (
    <div style={{
      display: "flex", flexDirection: direction === "row" ? "row" : "column",
      gap: tokens.space[gap] ?? gap, alignItems: align, justifyContent: justify,
      flexWrap: wrap ? "wrap" : undefined, ...sp,
    }}>{children}</div>
  );
}

function DotGrid({ theme: tp, spacing = 20 }) {
  const ctx = useThemeContext(); const theme = tp || ctx;
  return (
    <div style={{
      position: "absolute", inset: 0,
      backgroundImage: `radial-gradient(circle, ${theme === "light" ? "#d4d4d4" : "#333"} 1px, transparent 1px)`,
      backgroundSize: `${spacing}px ${spacing}px`, borderRadius: "inherit", pointerEvents: "none",
    }} />
  );
}

// ─── 7. FEEDBACK & STATUS ─────────────────────────────────────

function Badge({ children, variant = "default", theme: tp, style: sp }) {
  const ctx = useThemeContext(); const theme = tp || ctx; const pal = usePal(theme);
  const v = {
    default: { bg: pal.bgMuted, color: pal.textSecondary },
    accent: { bg: pal.accentBg, color: pal.accentText },
    success: { bg: pal.successBg, color: pal.success },
    warning: { bg: pal.warningBg, color: pal.warning },
    danger: { bg: pal.dangerBg, color: pal.danger },
  }[variant] || { bg: pal.bgMuted, color: pal.textSecondary };
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 4,
      ...tokens.type.xs, fontWeight: tokens.weight.medium, color: v.color, background: v.bg,
      padding: `3px ${8}px`, borderRadius: tokens.radius.sm,
      letterSpacing: 0.3, textTransform: "uppercase", fontFamily: tokens.font.sans,
      transition: `all ${motion.smooth} ${motion.easeInOut}`, ...sp,
    }}>{children}</span>
  );
}

function Tag({ children, color, removable, onRemove, theme: tp }) {
  const ctx = useThemeContext(); const theme = tp || ctx; const pal = usePal(theme);
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      ...tokens.type.sm, fontWeight: tokens.weight.medium, color: pal.text,
      background: pal.bgSubtle, padding: `${4}px ${12}px`,
      borderRadius: tokens.radius.pill, fontFamily: tokens.font.sans, transition: `all ${motion.smooth} ${motion.easeInOut}`,
    }}>
      {color && <span style={{ width: 7, height: 7, borderRadius: "50%", background: color, flexShrink: 0 }} />}
      {children}
      {removable && (
        <button onClick={onRemove} style={{ ...interactiveBase, background: "transparent", color: pal.textMuted, fontSize: 12, padding: 0, marginLeft: 2, display: "flex" }}>×</button>
      )}
    </span>
  );
}

function Spinner({ size = 16, color }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" style={{ animation: "halaska-spin 0.8s linear infinite" }}>
      <circle cx="8" cy="8" r="6" fill="none" stroke={color || "currentColor"} strokeWidth="2" strokeLinecap="round" strokeDasharray="28" strokeDashoffset="8" opacity="0.8" />
    </svg>
  );
}

function Progress({ value, theme: tp, height = 6 }) {
  const ctx = useThemeContext(); const theme = tp || ctx; const pal = usePal(theme);
  return (
    <div style={{ width: "100%", height, background: pal.bgMuted, borderRadius: height / 2, overflow: "hidden", transition: `background ${motion.smooth} ${motion.easeInOut}` }}>
      <div style={{ width: `${Math.min(100, Math.max(0, value))}%`, height: "100%", background: pal.accent, borderRadius: height / 2, transition: `width 0.6s cubic-bezier(0.34,1.56,0.64,1), background ${motion.smooth} ${motion.easeInOut}` }} />
    </div>
  );
}

function Skeleton({ width, height = 16, rounded, theme: tp }) {
  const ctx = useThemeContext(); const theme = tp || ctx; const pal = usePal(theme);
  return (
    <div style={{
      width: width || "100%", height, borderRadius: rounded ? height / 2 : tokens.radius.sm,
      background: `linear-gradient(90deg, ${pal.bgMuted} 25%, ${pal.bgSubtle} 50%, ${pal.bgMuted} 75%) 0 0 / 200% 100%`,
      animation: "halaska-shimmer 1.5s ease-in-out infinite",
    }} />
  );
}

function Toast({ message, variant = "default", icon, theme: tp }) {
  const ctx = useThemeContext(); const theme = tp || ctx; const pal = usePal(theme);
  const bgMap = { default: pal.bgElevated, success: pal.successBg, warning: pal.warningBg, danger: pal.dangerBg };
  const colorMap = { default: pal.text, success: pal.success, warning: pal.warning, danger: pal.danger };
  return (
    <div style={{
      display: "inline-flex", alignItems: "center", gap: 12,
      padding: `${12}px ${16}px`, background: bgMap[variant],
      borderRadius: tokens.radius.lg, boxShadow: `0 2px 8px ${pal.shadow}`,
      fontFamily: tokens.font.sans, transition: `all ${motion.smooth} ${motion.easeInOut}`,
    }}>
      {icon && <span style={{ fontSize: 16, color: colorMap[variant] }}>{icon}</span>}
      <Text size="base" theme={theme} style={{ color: colorMap[variant] }}>{message}</Text>
    </div>
  );
}

// ─── 8. DATA DISPLAY (colored avatars, no strokes) ────────────

function Avatar({ name, src, size = 32, theme: tp }) {
  const ctx = useThemeContext(); const theme = tp || ctx;
  const colors = getAvatarColor(name);
  const initials = name ? name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase() : "?";
  return (
    <div style={{
      width: size, height: size, borderRadius: size / 2,
      background: src ? "transparent" : colors.bg,
      display: "flex", alignItems: "center", justifyContent: "center",
      overflow: "hidden", flexShrink: 0, transition: `all ${motion.smooth} ${motion.easeInOut}`,
    }}>
      {src ? (
        <img src={src} alt={name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      ) : (
        <span style={{
          fontFamily: tokens.font.sans, fontWeight: tokens.weight.semibold,
          color: colors.text, fontSize: size * 0.36, letterSpacing: "-0.02em",
        }}>{initials}</span>
      )}
    </div>
  );
}

function AvatarGroup({ names, max = 4, size = 28, theme: tp }) {
  const ctx = useThemeContext(); const theme = tp || ctx; const pal = usePal(theme);
  const visible = names.slice(0, max);
  const overflow = names.length - max;
  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      {visible.map((name, i) => (
        <div key={i} style={{ marginLeft: i > 0 ? -8 : 0, position: "relative", zIndex: max - i,
          borderRadius: size / 2, border: `2px solid ${pal.bgElevated}` }}>
          <Avatar name={name} size={size} theme={theme} />
        </div>
      ))}
      {overflow > 0 && (
        <div style={{
          width: size, height: size, borderRadius: size / 2, background: pal.bgMuted,
          display: "flex", alignItems: "center", justifyContent: "center",
          marginLeft: -8, position: "relative", zIndex: 0,
          border: `2px solid ${pal.bgElevated}`,
        }}>
          <span style={{ ...tokens.type.xs, color: pal.textTertiary, fontWeight: tokens.weight.medium, fontSize: size * 0.32 }}>+{overflow}</span>
        </div>
      )}
    </div>
  );
}

function ListItem({ title, subtitle, left, right, divider = true, onClick, theme: tp }) {
  const ctx = useThemeContext(); const theme = tp || ctx; const pal = usePal(theme);
  const [hover, setHover] = useState(false);
  return (
    <div onClick={onClick} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        display: "flex", alignItems: "center", gap: 12,
        padding: `${12}px ${16}px`,
        background: hover ? pal.bgSubtle : "transparent",
        borderBottom: divider ? `1px solid ${pal.borderSubtle}` : "none",
        borderRadius: tokens.radius.sm,
        cursor: onClick ? "pointer" : "default", transition: `background ${motion.normal} ${motion.easeInOut}`,
      }}>
      {left}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ ...tokens.type.base, fontWeight: tokens.weight.medium, color: pal.text, fontFamily: tokens.font.sans, transition: `color ${motion.smooth} ${motion.easeInOut}` }}>{title}</div>
        {subtitle && <div style={{ ...tokens.type.sm, color: pal.textTertiary, fontFamily: tokens.font.sans, marginTop: 1, transition: `color ${motion.smooth} ${motion.easeInOut}` }}>{subtitle}</div>}
      </div>
      {right}
    </div>
  );
}

function Stat({ label, value, change, theme: tp }) {
  const ctx = useThemeContext(); const theme = tp || ctx; const pal = usePal(theme);
  const isPositive = change && !change.startsWith("-");
  return (
    <div>
      <div style={{ ...tokens.type.sm, color: pal.textTertiary, fontFamily: tokens.font.sans, marginBottom: 4, transition: `color ${motion.smooth} ${motion.easeInOut}` }}>{label}</div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
        <span style={{ ...tokens.type.xxl, fontWeight: tokens.weight.bold, color: pal.text, fontFamily: tokens.font.sans, fontVariantNumeric: "tabular-nums", transition: `color ${motion.smooth} ${motion.easeInOut}` }}>{value}</span>
        {change && <span style={{ ...tokens.type.sm, fontWeight: tokens.weight.medium, color: isPositive ? pal.success : pal.danger, fontFamily: tokens.font.sans }}>{isPositive ? "↑" : "↓"} {change.replace("-", "")}</span>}
      </div>
    </div>
  );
}

// ─── 9. AI PATTERNS ───────────────────────────────────────────

function AISuggestionBadge({ theme: tp }) { return <Badge variant="accent" theme={tp}>✦ AI Suggestion</Badge>; }

function StreamingText({ text, speed = 30, theme: tp }) {
  const ctx = useThemeContext(); const theme = tp || ctx; const pal = usePal(theme);
  const [displayed, setDisplayed] = useState("");
  const [cursor, setCursor] = useState(true);
  useEffect(() => {
    setDisplayed(""); setCursor(true); let i = 0;
    const interval = setInterval(() => {
      if (i < text.length) { setDisplayed(text.slice(0, i + 1)); i++; }
      else { clearInterval(interval); setTimeout(() => setCursor(false), 800); }
    }, speed);
    return () => clearInterval(interval);
  }, [text, speed]);
  return (
    <span style={{ ...tokens.type.base, color: pal.text, fontFamily: tokens.font.sans, transition: `color ${motion.smooth} ${motion.easeInOut}` }}>
      {displayed}
      {cursor && <span style={{ display: "inline-block", width: 2, height: "1.1em", background: pal.accent, marginLeft: 1, verticalAlign: "text-bottom", animation: "halaska-blink 1s step-end infinite" }} />}
    </span>
  );
}

function ConfidenceBar({ value, label, theme: tp }) {
  const ctx = useThemeContext(); const theme = tp || ctx; const pal = usePal(theme);
  const color = value > 80 ? pal.success : value > 50 ? pal.warning : pal.danger;
  const [hover, setHover] = useState(false);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, width: "100%" }}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
      {label && <span style={{ ...tokens.type.sm, color: pal.textSecondary, fontFamily: tokens.font.sans, minWidth: 60 }}>{label}</span>}
      <div style={{ flex: 1, height: 6, background: pal.bgMuted, borderRadius: 3, overflow: "hidden", transition: `background ${motion.smooth} ${motion.easeInOut}` }}>
        <div style={{
          width: `${value}%`, height: "100%", background: color, borderRadius: 3,
          transition: `width 0.6s cubic-bezier(0.34,1.56,0.64,1), background ${motion.normal} ${motion.easeInOut}, transform ${motion.normal} ${motion.easeInOut}`,
          transform: hover ? "scaleY(1.6)" : "scaleY(1)", transformOrigin: "center",
        }} />
      </div>
      <span style={{ ...tokens.type.sm, color: pal.textTertiary, fontFamily: tokens.font.mono, fontVariantNumeric: "tabular-nums", minWidth: 36, textAlign: "right" }}>{value}%</span>
    </div>
  );
}

function BeforeAfterToggle({ before, after, theme: tp }) {
  const [showAfter, setShowAfter] = useState(false);
  const ctx = useThemeContext(); const theme = tp || ctx; const pal = usePal(theme);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, width: "100%" }}>
      <div style={{ position: "relative", overflow: "hidden", borderRadius: tokens.radius.lg }}>
        <div style={{ transition: `opacity ${motion.smooth} ${motion.easeInOut}`, opacity: showAfter ? 0 : 1, position: showAfter ? "absolute" : "relative", inset: showAfter ? 0 : "auto" }}>{before}</div>
        <div style={{ transition: `opacity ${motion.smooth} ${motion.easeInOut}`, opacity: showAfter ? 1 : 0, position: showAfter ? "relative" : "absolute", inset: showAfter ? "auto" : 0 }}>{after}</div>
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12 }}>
        <Text size="sm" weight="medium" theme={theme} style={{ color: !showAfter ? pal.text : pal.textMuted }}>Before</Text>
        <SwitchToggle checked={showAfter} onChange={setShowAfter} theme={theme} />
        <Text size="sm" weight="medium" theme={theme} style={{ color: showAfter ? pal.text : pal.textMuted }}>After</Text>
      </div>
    </div>
  );
}

// ─── 10. CONTROLS ─────────────────────────────────────────────

function ZoomControl({ zoom, onChange, theme: tp }) {
  const ctx = useThemeContext(); const theme = tp || ctx; const pal = usePal(theme);
  return (
    <div style={{ display: "flex", alignItems: "center", background: pal.bgSubtle, borderRadius: tokens.radius.md, padding: 4, transition: `background ${motion.smooth} ${motion.easeInOut}` }}>
      <button onClick={() => onChange(Math.max(25, zoom - 10))} style={{ ...interactiveBase, width: 36, height: 32, background: "transparent", ...tokens.type.lg, color: pal.textSecondary, borderRadius: tokens.radius.sm, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: tokens.font.mono }}>−</button>
      <span style={{ minWidth: 48, textAlign: "center", ...tokens.type.base, color: pal.textSecondary, fontFamily: tokens.font.sans, fontVariantNumeric: "tabular-nums" }}>{zoom}%</span>
      <button onClick={() => onChange(Math.min(200, zoom + 10))} style={{ ...interactiveBase, width: 36, height: 32, background: "transparent", ...tokens.type.lg, color: pal.textSecondary, borderRadius: tokens.radius.sm, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: tokens.font.mono }}>+</button>
    </div>
  );
}

function Pagination({ current, total, onChange, theme: tp }) {
  const ctx = useThemeContext(); const theme = tp || ctx; const pal = usePal(theme);
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", padding: `0 ${4}px` }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <button onClick={() => current > 1 && onChange(current - 1)} style={{ ...interactiveBase, background: "transparent", ...tokens.type.md, color: current > 1 ? pal.textTertiary : pal.textMuted, padding: `${4}px ${8}px` }}>‹</button>
        <span style={{ ...tokens.type.base, color: pal.textTertiary, fontFamily: tokens.font.sans, fontVariantNumeric: "tabular-nums" }}>{current}/{total}</span>
        <button onClick={() => current < total && onChange(current + 1)} style={{ ...interactiveBase, background: "transparent", ...tokens.type.md, color: current < total ? pal.textTertiary : pal.textMuted, padding: `${4}px ${8}px` }}>›</button>
      </div>
      <button onClick={() => current < total && onChange(current + 1)} style={{ ...interactiveBase, background: "transparent", ...tokens.type.base, color: current < total ? pal.textSecondary : pal.textMuted, fontWeight: tokens.weight.medium, padding: `${4}px ${8}px` }}>Next</button>
    </div>
  );
}

function Slider({ value, onChange, min = 0, max = 100, label, theme: tp }) {
  const ctx = useThemeContext(); const theme = tp || ctx; const pal = usePal(theme);
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {label && <Label theme={theme}>{label}</Label>}
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <input type="range" min={min} max={max} value={value} onChange={(e) => onChange(Number(e.target.value))}
          style={{ flex: 1, height: 4, appearance: "none", background: `linear-gradient(to right, ${pal.accent} ${pct}%, ${pal.bgMuted} ${pct}%)`, borderRadius: 2, outline: "none", cursor: "pointer" }} />
        <span style={{ ...tokens.type.sm, color: pal.textTertiary, fontFamily: tokens.font.mono, fontVariantNumeric: "tabular-nums", minWidth: 32, textAlign: "right" }}>{value}</span>
      </div>
    </div>
  );
}

// ─── Fluid Motion (Fluid Functionalism-inspired) ─────────────

function ThinkingIndicator({ label = "Thinking", size = "md", theme: tp }) {
  const ctx = useThemeContext(); const theme = tp || ctx; const pal = usePal(theme);
  const dot = size === "sm" ? 4 : 6;
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 10, fontFamily: tokens.font.sans }}>
      {label && <span style={{ ...tokens.type.sm, color: pal.textSecondary, letterSpacing: "0.01em", transition: `color ${motion.smooth} ${motion.easeInOut}` }}>{label}</span>}
      <span style={{ display: "inline-flex", gap: 4, alignItems: "center", height: dot * 1.8 }}>
        {[0, 1, 2].map(i => (
          <span key={i} style={{
            width: dot, height: dot, borderRadius: dot, background: pal.text, display: "inline-block",
            animation: `halaska-thinking-dot 1.2s ${motion.easeInOut} ${i * 0.15}s infinite both`,
            transition: `background ${motion.smooth} ${motion.easeInOut}`,
          }} />
        ))}
      </span>
    </div>
  );
}

function ThinkingSteps({ steps, current = 0, theme: tp }) {
  const ctx = useThemeContext(); const theme = tp || ctx; const pal = usePal(theme);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10, fontFamily: tokens.font.sans }}>
      {steps.map((s, i) => {
        const done = i < current;
        const active = i === current;
        const reached = i <= current;
        return (
          <div key={i} style={{
            display: "flex", alignItems: "center", gap: 12,
            opacity: reached ? 1 : 0.45,
            animation: reached ? `halaska-step-in 0.4s ${motion.emphasized} both` : "none",
            transition: `opacity ${motion.smooth} ${motion.easeInOut}`,
          }}>
            <span style={{ position: "relative", width: 14, height: 14, display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <span style={{
                width: active ? 10 : done ? 8 : 6, height: active ? 10 : done ? 8 : 6, borderRadius: 10,
                background: done || active ? pal.accent : "transparent",
                border: done || active ? "none" : `1px solid ${pal.border}`,
                transition: `all ${motion.spring} ${motion.springCurve}`,
              }} />
              {active && (
                <span style={{
                  position: "absolute", width: 14, height: 14, borderRadius: 14,
                  border: `1.5px solid ${pal.accent}`,
                  animation: `halaska-thinking-pulse 1.4s ${motion.easeOut} infinite`,
                }} />
              )}
            </span>
            <span style={{
              ...tokens.type.sm,
              fontWeight: active ? tokens.weight.medium : tokens.weight.regular,
              color: done ? pal.textSecondary : active ? pal.text : pal.textTertiary,
              transition: `color ${motion.smooth} ${motion.easeInOut}, font-weight ${motion.normal} ${motion.easeInOut}`,
            }}>{s}</span>
          </div>
        );
      })}
    </div>
  );
}

function SpringToggle({ checked, onChange, label, theme: tp }) {
  const ctx = useThemeContext(); const theme = tp || ctx; const pal = usePal(theme);
  const [press, setPress] = useState(false);
  const thumbW = press ? 24 : 20;
  return (
    <label style={{ display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }}>
      <button onClick={() => onChange?.(!checked)}
        onMouseDown={() => setPress(true)}
        onMouseUp={() => setPress(false)}
        onMouseLeave={() => setPress(false)}
        role="switch" aria-checked={checked}
        style={{
          ...interactiveBase, width: 44, height: 24, borderRadius: 12,
          background: checked ? pal.accent : pal.bgMuted, position: "relative", padding: 0, flexShrink: 0,
          transition: `background ${motion.normal} ${motion.easeInOut}`,
        }}>
        <div style={{
          width: thumbW, height: 20, borderRadius: 10,
          background: checked ? "#fff" : pal.bgElevated,
          position: "absolute", top: 2,
          left: checked ? (44 - thumbW - 2) : 2,
          transition: `left ${motion.spring} ${motion.springCurve}, width ${motion.fast} ${motion.easeOut}, background ${motion.smooth} ${motion.easeInOut}`,
          boxShadow: "0 1px 3px rgba(0,0,0,0.15)",
        }} />
      </button>
      {label && <Text size="base" theme={theme}>{label}</Text>}
    </label>
  );
}

function SpringSlider({ value, onChange, min = 0, max = 100, label, theme: tp }) {
  const ctx = useThemeContext(); const theme = tp || ctx; const pal = usePal(theme);
  const [dragging, setDragging] = useState(false);
  const [hover, setHover] = useState(false);
  const trackRef = useRef(null);
  const pct = ((value - min) / (max - min)) * 100;

  const applyEvent = (clientX) => {
    const rect = trackRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    onChange?.(Math.round(min + x * (max - min)));
  };

  useEffect(() => {
    if (!dragging) return;
    const m = (e) => applyEvent(e.clientX);
    const u = () => setDragging(false);
    window.addEventListener("mousemove", m);
    window.addEventListener("mouseup", u);
    return () => { window.removeEventListener("mousemove", m); window.removeEventListener("mouseup", u); };
  }, [dragging]);

  const thumbScale = dragging ? 1.3 : hover ? 1.12 : 1;
  const thumbTrans = dragging
    ? `transform ${motion.fast} ${motion.easeOut}, box-shadow ${motion.normal} ${motion.easeOut}`
    : `transform ${motion.spring} ${motion.springCurve}, box-shadow ${motion.normal} ${motion.easeOut}, left ${motion.spring} ${motion.springCurve}`;
  const fillTrans = dragging ? "none" : `width ${motion.spring} ${motion.springCurve}`;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {label && <Label theme={theme}>{label}</Label>}
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div ref={trackRef}
          onMouseDown={(e) => { setDragging(true); applyEvent(e.clientX); }}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          style={{
            position: "relative", flex: 1, height: 20, cursor: "pointer",
            display: "flex", alignItems: "center",
          }}>
          <div style={{
            position: "absolute", left: 0, right: 0, height: 4, borderRadius: 2, background: pal.bgMuted,
            transition: `background ${motion.smooth} ${motion.easeInOut}`,
          }} />
          <div style={{
            position: "absolute", left: 0, height: 4, width: `${pct}%`, borderRadius: 2, background: pal.accent,
            transition: fillTrans,
          }} />
          <div style={{
            position: "absolute", left: `${pct}%`,
            transform: `translate(-50%, 0) scale(${thumbScale})`,
            width: 14, height: 14, borderRadius: 7, background: "#fff",
            border: `1.5px solid ${pal.accent}`,
            boxShadow: dragging ? `0 0 0 6px ${pal.accent}22, 0 1px 3px rgba(0,0,0,0.18)` : "0 1px 3px rgba(0,0,0,0.15)",
            transition: thumbTrans,
          }} />
        </div>
        <span style={{ ...tokens.type.sm, color: pal.textTertiary, fontFamily: tokens.font.mono, fontVariantNumeric: "tabular-nums", minWidth: 32, textAlign: "right" }}>{value}</span>
      </div>
    </div>
  );
}

function CopyInput({ value, label, theme: tp, style: sp }) {
  const ctx = useThemeContext(); const theme = tp || ctx; const pal = usePal(theme);
  const [copied, setCopied] = useState(false);
  const [focused, setFocused] = useState(false);
  const [hover, setHover] = useState(false);
  const copy = async () => {
    try { await navigator.clipboard?.writeText(value); } catch {}
    setCopied(true);
    setTimeout(() => setCopied(false), 1400);
  };
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4, ...sp }}>
      {label && <Label theme={theme}>{label}</Label>}
      <div
        onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
        style={{
        position: "relative", display: "flex", alignItems: "center",
        background: pal.bgInput, borderRadius: tokens.radius.md,
        border: focused ? `1.5px solid ${pal.borderFocus}` : hover ? `1.5px solid ${pal.borderSubtle}` : "1.5px solid transparent",
        transition: `border-color ${motion.normal} ${motion.easeInOut}, background ${motion.smooth} ${motion.easeInOut}`,
      }}>
        <input readOnly value={value}
          onFocus={(e) => { e.target.select(); setFocused(true); }}
          onBlur={() => setFocused(false)}
          style={{
            ...tokens.type.base, flex: 1, minWidth: 0, padding: "10px 8px 10px 16px",
            background: "transparent", border: "none", outline: "none",
            color: pal.text, fontFamily: tokens.font.mono, textOverflow: "ellipsis",
          }} />
        <button onClick={copy} style={{
          ...interactiveBase, display: "inline-flex", alignItems: "center", gap: 6,
          padding: "6px 12px", margin: 4, borderRadius: tokens.radius.sm,
          background: copied ? pal.accentBg : "transparent",
          color: copied ? pal.accent : pal.textSecondary,
          ...tokens.type.xs, fontWeight: tokens.weight.medium, fontFamily: tokens.font.sans,
          transition: `background ${motion.normal} ${motion.easeInOut}, color ${motion.normal} ${motion.easeInOut}`,
        }}>
          <span style={{
            display: "inline-flex", width: 12, height: 12,
            transform: copied ? "scale(1.15)" : "scale(1)",
            transition: `transform ${motion.spring} ${motion.springCurve}`,
          }}>
            {copied ? (
              <svg viewBox="0 0 12 12" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="2,6 5,9 10,3" style={{ strokeDasharray: 14, strokeDashoffset: 14, animation: `halaska-check-draw 0.3s ${motion.easeOut} forwards` }} />
              </svg>
            ) : (
              <svg viewBox="0 0 12 12" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3.5" y="3.5" width="7" height="7" rx="1.5" />
                <path d="M2 7.5V3a1.5 1.5 0 0 1 1.5-1.5H8" />
              </svg>
            )}
          </span>
          <span style={{ transition: `opacity ${motion.fast} ${motion.easeInOut}` }}>{copied ? "Copied" : "Copy"}</span>
        </button>
      </div>
    </div>
  );
}

function SubtleTabs({ tabs, value, onChange, theme: tp }) {
  const ctx = useThemeContext(); const theme = tp || ctx; const pal = usePal(theme);
  const containerRef = useRef(null);
  const [rect, setRect] = useState({ left: 0, width: 0 });
  const [ready, setReady] = useState(false);
  useEffect(() => {
    if (!containerRef.current) return;
    const measure = () => {
      const btn = containerRef.current?.querySelector(`[data-subtle-tab="${value}"]`);
      if (btn) {
        const p = containerRef.current.getBoundingClientRect();
        const r = btn.getBoundingClientRect();
        setRect({ left: r.left - p.left, width: r.width });
        setReady(true);
      }
    };
    measure();
    const raf = requestAnimationFrame(measure);
    window.addEventListener("resize", measure);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", measure); };
  }, [value, tabs]);
  return (
    <div ref={containerRef} style={{
      position: "relative", display: "inline-flex", gap: 2, padding: 4,
      borderRadius: tokens.radius.md, background: pal.bgSubtle,
      transition: `background ${motion.smooth} ${motion.easeInOut}`,
    }}>
      <div aria-hidden style={{
        position: "absolute", top: 4, bottom: 4,
        left: rect.left, width: rect.width,
        background: pal.bgElevated, borderRadius: tokens.radius.sm,
        boxShadow: `0 1px 2px ${pal.shadow}, 0 0 0 1px ${pal.borderSubtle}`,
        opacity: ready ? 1 : 0, pointerEvents: "none",
        transition: `left ${motion.spring} ${motion.springCurve}, width ${motion.spring} ${motion.springCurve}, opacity ${motion.fast} ${motion.easeOut}, background ${motion.smooth} ${motion.easeInOut}, box-shadow ${motion.smooth} ${motion.easeInOut}`,
      }} />
      {tabs.map(t => (
        <button key={t} data-subtle-tab={t} onClick={() => onChange(t)}
          style={{
            ...interactiveBase, ...tokens.type.sm, fontFamily: tokens.font.sans,
            fontWeight: value === t ? tokens.weight.semibold : tokens.weight.medium,
            color: value === t ? pal.text : pal.textSecondary,
            padding: "8px 16px", background: "transparent",
            position: "relative", zIndex: 1,
            transition: `color ${motion.normal} ${motion.easeInOut}, font-weight ${motion.normal} ${motion.easeInOut}`,
          }}>{t}</button>
      ))}
    </div>
  );
}

// ─── AlignUI Parity ──────────────────────────────────────────

function ProgressCircle({ value = 0, size = 48, stroke = 4, label, theme: tp }) {
  const ctx = useThemeContext(); const theme = tp || ctx; const pal = usePal(theme);
  const clamped = Math.max(0, Math.min(100, value));
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const off = c - (clamped / 100) * c;
  return (
    <div style={{ position: "relative", width: size, height: size, display: "inline-flex", alignItems: "center", justifyContent: "center", fontFamily: tokens.font.sans }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={pal.bgMuted} strokeWidth={stroke} style={{ transition: `stroke ${motion.smooth} ${motion.easeInOut}` }} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={pal.accent} strokeWidth={stroke}
          strokeDasharray={c} strokeDashoffset={off} strokeLinecap="round"
          style={{ transition: `stroke-dashoffset ${motion.smooth} ${motion.emphasized}, stroke ${motion.smooth} ${motion.easeInOut}` }} />
      </svg>
      {label != null && (
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: Math.round(size * 0.28), fontWeight: tokens.weight.semibold, color: pal.text, fontVariantNumeric: "tabular-nums", letterSpacing: "-0.02em" }}>{label}</div>
      )}
    </div>
  );
}

function Rating({ value = 0, onChange, max = 5, size = 18, readOnly, theme: tp }) {
  const ctx = useThemeContext(); const theme = tp || ctx; const pal = usePal(theme);
  const [hover, setHover] = useState(0);
  const [burst, setBurst] = useState(-1);
  const click = (n) => {
    if (readOnly) return;
    onChange?.(n);
    setBurst(n - 1);
    setTimeout(() => setBurst(-1), 500);
  };
  return (
    <div style={{ display: "inline-flex", gap: 4, alignItems: "center" }} onMouseLeave={() => setHover(0)}>
      {Array.from({ length: max }).map((_, i) => {
        const isCurrent = i < value;
        const isPreview = hover > 0 && i < hover;
        let color, opacity;
        if (isPreview && !isCurrent) { color = pal.warning; opacity = 0.45; }
        else if (isCurrent) { color = pal.warning; opacity = 1; }
        else { color = pal.bgMuted; opacity = 1; }
        return (
          <button key={i} disabled={readOnly} onClick={() => click(i + 1)} onMouseEnter={() => !readOnly && setHover(i + 1)}
            style={{
              ...interactiveBase, background: "transparent", padding: 0, lineHeight: 1,
              color, opacity, fontSize: size, position: "relative",
              transform: hover === i + 1 ? "scale(1.15)" : "scale(1)",
              transition: `color ${motion.fast} ${motion.easeInOut}, opacity ${motion.fast} ${motion.easeInOut}, transform ${motion.spring} ${motion.springCurve}`,
              cursor: readOnly ? "default" : "pointer",
            }}>
            ★
            {burst === i && (
              <span aria-hidden style={{
                position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center",
                color: pal.warning, fontSize: size, pointerEvents: "none",
                animation: `halaska-star-burst 0.5s ${motion.easeOut} forwards`,
              }}>★</span>
            )}
          </button>
        );
      })}
    </div>
  );
}

function StatusBadge({ status = "default", children, pulse, theme: tp }) {
  const ctx = useThemeContext(); const theme = tp || ctx; const pal = usePal(theme);
  const colorMap = {
    default: pal.textSecondary,
    online: pal.success,
    offline: pal.textTertiary,
    pending: pal.warning,
    error: pal.danger,
    accent: pal.accent,
  };
  const color = colorMap[status] || colorMap.default;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 6,
      padding: "3px 10px", borderRadius: tokens.radius.pill,
      background: pal.bgSubtle, ...tokens.type.xs, fontWeight: tokens.weight.medium,
      color: pal.text, fontFamily: tokens.font.sans,
      letterSpacing: 0.3, textTransform: "uppercase",
      transition: `all ${motion.smooth} ${motion.easeInOut}`,
    }}>
      <span style={{ position: "relative", width: 6, height: 6, borderRadius: 3, background: color, flexShrink: 0, transition: `background ${motion.smooth} ${motion.easeInOut}` }}>
        {pulse && <span style={{ position: "absolute", inset: 0, borderRadius: 3, background: color, animation: `halaska-live-pulse 1.4s ${motion.easeOut} infinite` }} />}
      </span>
      {children}
    </span>
  );
}

function Stepper({ steps, current = 0, theme: tp }) {
  const ctx = useThemeContext(); const theme = tp || ctx; const pal = usePal(theme);
  return (
    <div style={{ display: "flex", width: "100%", fontFamily: tokens.font.sans }}>
      {steps.map((s, i) => {
        const done = i < current;
        const active = i === current;
        const nextReached = i + 1 <= current;
        const last = i === steps.length - 1;
        return (
          <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", position: "relative", minWidth: 0 }}>
            {!last && (
              <div style={{
                position: "absolute", top: 11, left: "50%", right: "-50%", height: 2,
                background: nextReached ? pal.accent : pal.bgMuted,
                transition: `background ${motion.smooth} ${motion.easeInOut}`,
                zIndex: 0,
              }} />
            )}
            <div style={{
              position: "relative", zIndex: 1,
              width: active ? 24 : 16, height: active ? 24 : 16, borderRadius: active ? 12 : 8,
              background: done ? pal.accent : active ? pal.bgElevated : pal.bgMuted,
              border: active ? `2px solid ${pal.accent}` : "none",
              color: done ? "#fff" : active ? pal.accent : pal.textTertiary,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: active ? 11 : 9, fontWeight: tokens.weight.semibold, fontFamily: tokens.font.sans,
              marginTop: active ? 0 : 4,
              transition: `all ${motion.spring} ${motion.springCurve}`,
            }}>{done ? "✓" : i + 1}</div>
            <div style={{
              marginTop: 6, ...tokens.type.xs, textAlign: "center",
              color: active ? pal.text : pal.textTertiary,
              fontWeight: active ? tokens.weight.medium : tokens.weight.regular,
              transition: `color ${motion.smooth} ${motion.easeInOut}, font-weight ${motion.normal} ${motion.easeInOut}`,
              padding: "0 4px",
            }}>{s}</div>
          </div>
        );
      })}
    </div>
  );
}

// Inline command palette panel — renders the search + result list without a
// modal overlay. Use inside any container.
function CommandPalette({ items = [], placeholder = "Type a command or search…", theme: tp }) {
  const ctx = useThemeContext(); const theme = tp || ctx; const pal = usePal(theme);
  const [query, setQuery] = useState("");
  const [idx, setIdx] = useState(0);
  const filtered = items.filter(i => i.label.toLowerCase().includes(query.toLowerCase()));
  useEffect(() => { setIdx(0); }, [query]);
  return (
    <div style={{
      width: 420, maxWidth: "100%", fontFamily: tokens.font.sans,
      background: theme === "dark" ? "rgba(30,30,30,0.95)" : "rgba(255,255,255,0.95)",
      backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
      border: `1px solid ${pal.borderSubtle}`, borderRadius: tokens.radius.lg,
      boxShadow: `0 16px 48px ${pal.shadowLg}`,
      overflow: "hidden",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", borderBottom: `1px solid ${pal.borderSubtle}` }}>
        <span style={{ color: pal.textTertiary, fontSize: 14, display: "inline-flex" }}>⌕</span>
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={placeholder}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") { e.preventDefault(); setIdx(i => Math.min(i + 1, filtered.length - 1)); }
            else if (e.key === "ArrowUp") { e.preventDefault(); setIdx(i => Math.max(i - 1, 0)); }
            else if (e.key === "Enter") { e.preventDefault(); filtered[idx]?.onSelect?.(); }
          }}
          style={{ flex: 1, background: "transparent", border: "none", outline: "none", color: pal.text, fontFamily: tokens.font.sans, ...tokens.type.base }} />
        <Kbd theme={theme}>⌘K</Kbd>
      </div>
      <div style={{ maxHeight: 240, overflowY: "auto", padding: 8 }}>
        {filtered.length === 0 ? (
          <div style={{ padding: "24px 16px", textAlign: "center", color: pal.textTertiary, ...tokens.type.sm }}>No results for "{query}"</div>
        ) : filtered.map((item, i) => (
          <button key={i} onClick={() => item.onSelect?.()} onMouseEnter={() => setIdx(i)}
            style={{
              ...interactiveBase, width: "100%", padding: "8px 12px", borderRadius: tokens.radius.sm,
              display: "flex", alignItems: "center", gap: 12,
              background: idx === i ? pal.bgSubtle : "transparent",
              color: pal.text, ...tokens.type.sm, fontFamily: tokens.font.sans,
              textAlign: "left", border: "none",
              transition: `background ${motion.fast} ${motion.easeInOut}`,
            }}>
            {item.icon && <span style={{ color: idx === i ? pal.text : pal.textSecondary, width: 18, display: "inline-flex", justifyContent: "center" }}>{item.icon}</span>}
            <span style={{ flex: 1 }}>{item.label}</span>
            {item.shortcut && <Kbd theme={theme}>{item.shortcut}</Kbd>}
          </button>
        ))}
      </div>
    </div>
  );
}

function CommandMenu({ open, onClose, items = [], placeholder = "Type a command or search…", theme: tp }) {
  const ctx = useThemeContext(); const theme = tp || ctx; const pal = usePal(theme);
  const [query, setQuery] = useState("");
  const [idx, setIdx] = useState(0);
  const filtered = items.filter(i => i.label.toLowerCase().includes(query.toLowerCase()));
  useEffect(() => { if (open) { setQuery(""); setIdx(0); } }, [open]);
  useEffect(() => { setIdx(0); }, [query]);
  useEffect(() => {
    if (!open) return;
    const h = (e) => {
      if (e.key === "Escape") { e.preventDefault(); onClose?.(); }
      else if (e.key === "ArrowDown") { e.preventDefault(); setIdx(i => Math.min(i + 1, filtered.length - 1)); }
      else if (e.key === "ArrowUp") { e.preventDefault(); setIdx(i => Math.max(i - 1, 0)); }
      else if (e.key === "Enter") { e.preventDefault(); filtered[idx]?.onSelect?.(); onClose?.(); }
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [open, filtered, idx, onClose]);
  if (!open) return null;
  return (
    <div onClick={onClose} style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)",
      backdropFilter: "blur(4px)", WebkitBackdropFilter: "blur(4px)",
      zIndex: 10000, display: "flex", alignItems: "flex-start", justifyContent: "center",
      paddingTop: "14vh", animation: `halaska-fade-in ${motion.fast} ${motion.easeOut} both`,
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        width: 520, maxWidth: "92vw", fontFamily: tokens.font.sans,
        background: theme === "dark" ? "rgba(30,30,30,0.95)" : "rgba(255,255,255,0.95)",
        backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
        border: `1px solid ${pal.borderSubtle}`, borderRadius: tokens.radius.lg,
        boxShadow: `0 16px 48px ${pal.shadowLg}`,
        animation: `halaska-scale-in ${motion.normal} ${motion.emphasized} both`,
        overflow: "hidden",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", borderBottom: `1px solid ${pal.borderSubtle}` }}>
          <span style={{ color: pal.textTertiary, fontSize: 14, display: "inline-flex" }}>⌕</span>
          <input autoFocus value={query} onChange={(e) => setQuery(e.target.value)} placeholder={placeholder}
            style={{
              flex: 1, background: "transparent", border: "none", outline: "none",
              color: pal.text, fontFamily: tokens.font.sans, ...tokens.type.base,
            }} />
          <Kbd theme={theme}>Esc</Kbd>
        </div>
        <div style={{ maxHeight: 320, overflowY: "auto", padding: 8 }}>
          {filtered.length === 0 ? (
            <div style={{ padding: "24px 16px", textAlign: "center", color: pal.textTertiary, ...tokens.type.sm }}>No results for "{query}"</div>
          ) : filtered.map((item, i) => (
            <button key={i} onClick={() => { item.onSelect?.(); onClose?.(); }} onMouseEnter={() => setIdx(i)}
              style={{
                ...interactiveBase, width: "100%", padding: "8px 12px", borderRadius: tokens.radius.sm,
                display: "flex", alignItems: "center", gap: 12,
                background: idx === i ? pal.bgSubtle : "transparent",
                color: pal.text, ...tokens.type.sm, fontFamily: tokens.font.sans,
                textAlign: "left", border: "none",
                transition: `background ${motion.fast} ${motion.easeInOut}`,
              }}>
              {item.icon && <span style={{ color: idx === i ? pal.text : pal.textSecondary, width: 18, display: "inline-flex", justifyContent: "center", transition: `color ${motion.fast} ${motion.easeInOut}` }}>{item.icon}</span>}
              <span style={{ flex: 1 }}>{item.label}</span>
              {item.shortcut && <Kbd theme={theme}>{item.shortcut}</Kbd>}
            </button>
          ))}
        </div>
        <div style={{ padding: "8px 16px", borderTop: `1px solid ${pal.borderSubtle}`, background: pal.bgSubtle, ...tokens.type.xs, color: pal.textTertiary, display: "flex", gap: 16, transition: `background ${motion.smooth} ${motion.easeInOut}, border-color ${motion.smooth} ${motion.easeInOut}` }}>
          <span>↑↓ navigate</span>
          <span>↵ select</span>
          <span>esc close</span>
        </div>
      </div>
    </div>
  );
}

// ─── Extended (Form / Nav / Data Viz) ────────────────────────

function Chip({ children, selected, onToggle, onRemove, icon, theme: tp }) {
  const ctx = useThemeContext(); const theme = tp || ctx; const pal = usePal(theme);
  const [hover, setHover] = useState(false);
  return (
    <button onClick={onToggle}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        ...interactiveBase, display: "inline-flex", alignItems: "center", gap: 6,
        padding: "4px 10px", borderRadius: tokens.radius.pill,
        background: selected ? pal.accentBg : hover ? pal.bgMuted : pal.bgSubtle,
        color: selected ? pal.accent : pal.text,
        border: `1px solid ${selected ? pal.accent + "55" : "transparent"}`,
        ...tokens.type.xs, fontWeight: tokens.weight.medium, fontFamily: tokens.font.sans,
        letterSpacing: "0.01em",
        transition: `all ${motion.normal} ${motion.easeInOut}`,
      }}>
      {icon && <span style={{ display: "inline-flex" }}>{icon}</span>}
      {children}
      {onRemove && (
        <span role="button" onClick={(e) => { e.stopPropagation(); onRemove(); }}
          style={{ marginLeft: 2, color: pal.textTertiary, fontSize: 12, lineHeight: 1, cursor: "pointer" }}>×</span>
      )}
    </button>
  );
}

function InputGroup({ prefix, suffix, value, onChange, placeholder, label, theme: tp, style: sp }) {
  const ctx = useThemeContext(); const theme = tp || ctx; const pal = usePal(theme);
  const [focused, setFocused] = useState(false);
  const [hover, setHover] = useState(false);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      {label && <Label theme={theme}>{label}</Label>}
      <div
        onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
        style={{
        display: "flex", alignItems: "stretch", height: 38,
        background: pal.bgInput, borderRadius: tokens.radius.md,
        border: focused ? `1.5px solid ${pal.borderFocus}` : hover ? `1.5px solid ${pal.borderSubtle}` : "1.5px solid transparent",
        transition: `border-color ${motion.normal} ${motion.easeInOut}, background ${motion.smooth} ${motion.easeInOut}`,
        overflow: "hidden", ...sp,
      }}>
        {prefix != null && (
          <div style={{ display: "flex", alignItems: "center", padding: "0 12px", color: pal.textTertiary, ...tokens.type.sm, fontFamily: tokens.font.sans, borderRight: `1px solid ${pal.borderSubtle}`, background: pal.bgSubtle, transition: `all ${motion.smooth} ${motion.easeInOut}` }}>{prefix}</div>
        )}
        <input value={value} onChange={(e) => onChange?.(e.target.value)} placeholder={placeholder}
          onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
          style={{ flex: 1, minWidth: 0, padding: "0 16px", border: "none", outline: "none", background: "transparent", color: pal.text, fontFamily: tokens.font.sans, ...tokens.type.base }} />
        {suffix != null && (
          <div style={{ display: "flex", alignItems: "center", padding: "0 12px", color: pal.textTertiary, ...tokens.type.sm, fontFamily: tokens.font.sans, borderLeft: `1px solid ${pal.borderSubtle}`, background: pal.bgSubtle, transition: `all ${motion.smooth} ${motion.easeInOut}` }}>{suffix}</div>
        )}
      </div>
    </div>
  );
}

function Combobox({ options = [], value, onChange, placeholder = "Select…", label, theme: tp }) {
  const ctx = useThemeContext(); const theme = tp || ctx; const pal = usePal(theme);
  const [open, setOpen] = useState(false);
  const [hover, setHover] = useState(false);
  const [query, setQuery] = useState("");
  const [idx, setIdx] = useState(0);
  const ref = useRef(null);
  const filtered = options.filter(o => o.label.toLowerCase().includes(query.toLowerCase()));
  const selected = options.find(o => o.value === value);
  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);
  return (
    <div ref={ref} style={{ position: "relative", display: "flex", flexDirection: "column", gap: 4, minWidth: 220 }}>
      {label && <Label theme={theme}>{label}</Label>}
      <button onClick={() => setOpen(o => !o)}
        onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
        style={{
        ...interactiveBase, display: "flex", alignItems: "center", justifyContent: "space-between", height: 38,
        padding: "0 16px", background: pal.bgInput, borderRadius: tokens.radius.md,
        border: open ? `1.5px solid ${pal.borderFocus}` : hover ? `1.5px solid ${pal.borderSubtle}` : "1.5px solid transparent",
        color: selected ? pal.text : pal.textTertiary, ...tokens.type.base, fontFamily: tokens.font.sans,
        transition: `border-color ${motion.normal} ${motion.easeInOut}`,
      }}>
        <span>{selected ? selected.label : placeholder}</span>
        <span style={{ color: pal.textTertiary, display: "inline-flex" }}>
          <ChevronIcon size={12} direction={open ? "up" : "down"} />
        </span>
      </button>
      {open && (
        <div style={{
          position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0, zIndex: 100,
          background: theme === "dark" ? "rgba(30,30,30,0.95)" : "rgba(255,255,255,0.95)",
          backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)",
          border: `1px solid ${pal.borderSubtle}`, borderRadius: tokens.radius.md,
          boxShadow: `0 8px 24px ${pal.shadowLg}`,
          animation: `halaska-scale-in ${motion.normal} ${motion.emphasized} both`, overflow: "hidden",
        }}>
          <input autoFocus value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Filter…"
            onKeyDown={(e) => {
              if (e.key === "ArrowDown") { e.preventDefault(); setIdx(i => Math.min(i + 1, filtered.length - 1)); }
              else if (e.key === "ArrowUp") { e.preventDefault(); setIdx(i => Math.max(i - 1, 0)); }
              else if (e.key === "Enter") { e.preventDefault(); if (filtered[idx]) { onChange?.(filtered[idx].value); setOpen(false); } }
              else if (e.key === "Escape") setOpen(false);
            }}
            style={{ width: "100%", padding: "10px 16px", background: "transparent", border: "none", outline: "none", borderBottom: `1px solid ${pal.borderSubtle}`, color: pal.text, fontFamily: tokens.font.sans, ...tokens.type.sm, boxSizing: "border-box" }} />
          <div style={{ maxHeight: 200, overflowY: "auto", padding: 4 }}>
            {filtered.length === 0 ? (
              <div style={{ padding: 12, textAlign: "center", color: pal.textTertiary, ...tokens.type.sm }}>No results</div>
            ) : filtered.map((o, i) => (
              <button key={o.value} onClick={() => { onChange?.(o.value); setOpen(false); }} onMouseEnter={() => setIdx(i)}
                style={{
                  ...interactiveBase, width: "100%", padding: "8px 12px", borderRadius: tokens.radius.sm,
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  background: idx === i ? pal.bgSubtle : "transparent",
                  color: pal.text, ...tokens.type.sm, textAlign: "left", fontFamily: tokens.font.sans,
                  transition: `background ${motion.fast} ${motion.easeInOut}`,
                }}>
                <span>{o.label}</span>
                {o.value === value && <span style={{ color: pal.accent, fontSize: 12 }}>✓</span>}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function Calendar({ value, onChange, theme: tp }) {
  const ctx = useThemeContext(); const theme = tp || ctx; const pal = usePal(theme);
  const today = new Date();
  const [view, setView] = useState(value || today);
  const year = view.getFullYear();
  const month = view.getMonth();
  const first = new Date(year, month, 1);
  const startDay = first.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < startDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  const monthName = first.toLocaleString("default", { month: "long" });
  const sameDate = (a, b) => a && b && a.getDate() === b.getDate() && a.getMonth() === b.getMonth() && a.getFullYear() === b.getFullYear();
  return (
    <div style={{ width: 260, padding: 16, background: pal.bgElevated, borderRadius: tokens.radius.md, border: `1px solid ${pal.borderSubtle}`, fontFamily: tokens.font.sans, transition: `all ${motion.smooth} ${motion.easeInOut}` }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
        <button onClick={() => setView(new Date(year, month - 1, 1))} style={{ ...interactiveBase, background: "transparent", padding: "4px 8px", color: pal.textSecondary, borderRadius: tokens.radius.sm, ...tokens.type.base }}>‹</button>
        <div style={{ ...tokens.type.sm, fontWeight: tokens.weight.medium, color: pal.text }}>{monthName} {year}</div>
        <button onClick={() => setView(new Date(year, month + 1, 1))} style={{ ...interactiveBase, background: "transparent", padding: "4px 8px", color: pal.textSecondary, borderRadius: tokens.radius.sm, ...tokens.type.base }}>›</button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 2 }}>
        {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
          <div key={i} style={{ ...tokens.type.xxs, color: pal.textTertiary, textAlign: "center", padding: "6px 0", textTransform: "uppercase", letterSpacing: 0.5 }}>{d}</div>
        ))}
        {cells.map((d, i) => {
          const date = d ? new Date(year, month, d) : null;
          const isToday = sameDate(date, today);
          const isSelected = sameDate(date, value);
          return (
            <button key={i} disabled={!d} onClick={() => d && onChange?.(date)}
              style={{
                ...interactiveBase, padding: "6px 0", borderRadius: tokens.radius.sm,
                background: isSelected ? pal.accent : "transparent",
                color: !d ? "transparent" : isSelected ? "#fff" : isToday ? pal.accent : pal.text,
                fontWeight: isToday || isSelected ? tokens.weight.semibold : tokens.weight.regular,
                ...tokens.type.sm, border: isToday && !isSelected ? `1px solid ${pal.accent}` : "1px solid transparent",
                transition: `all ${motion.fast} ${motion.easeInOut}`,
              }}>{d || ""}</button>
          );
        })}
      </div>
    </div>
  );
}

function DatePicker({ value, onChange, label, placeholder = "Pick a date", theme: tp }) {
  const ctx = useThemeContext(); const theme = tp || ctx; const pal = usePal(theme);
  const [open, setOpen] = useState(false);
  const [hover, setHover] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);
  const formatted = value ? value.toLocaleDateString("default", { year: "numeric", month: "short", day: "numeric" }) : null;
  return (
    <div ref={ref} style={{ position: "relative", display: "flex", flexDirection: "column", gap: 4, minWidth: 220 }}>
      {label && <Label theme={theme}>{label}</Label>}
      <button onClick={() => setOpen(o => !o)}
        onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
        style={{
        ...interactiveBase, display: "flex", alignItems: "center", gap: 10, height: 38,
        padding: "0 16px", background: pal.bgInput, borderRadius: tokens.radius.md,
        border: open ? `1.5px solid ${pal.borderFocus}` : hover ? `1.5px solid ${pal.borderSubtle}` : "1.5px solid transparent",
        color: formatted ? pal.text : pal.textTertiary, ...tokens.type.base, fontFamily: tokens.font.sans,
        transition: `border-color ${motion.normal} ${motion.easeInOut}`, textAlign: "left",
      }}>
        <span style={{ color: pal.textTertiary, fontSize: 14, display: "inline-flex" }}>⌯</span>
        <span style={{ flex: 1 }}>{formatted || placeholder}</span>
      </button>
      {open && (
        <div style={{ position: "absolute", top: "calc(100% + 4px)", left: 0, zIndex: 100 }}>
          <Calendar theme={theme} value={value} onChange={(d) => { onChange?.(d); setOpen(false); }} />
        </div>
      )}
    </div>
  );
}

function ContextMenu({ items, children, theme: tp }) {
  const ctx = useThemeContext(); const theme = tp || ctx; const pal = usePal(theme);
  const [menu, setMenu] = useState(null);
  const handle = (e) => { e.preventDefault(); setMenu({ x: e.clientX, y: e.clientY }); };
  useEffect(() => {
    if (!menu) return;
    const close = () => setMenu(null);
    document.addEventListener("click", close);
    document.addEventListener("contextmenu", close);
    return () => { document.removeEventListener("click", close); document.removeEventListener("contextmenu", close); };
  }, [menu]);
  return (
    <>
      <div onContextMenu={handle}>{children}</div>
      {menu && (
        <div onClick={(e) => e.stopPropagation()} style={{
          position: "fixed", top: menu.y, left: menu.x, zIndex: 10000,
          background: theme === "dark" ? "rgba(30,30,30,0.95)" : "rgba(255,255,255,0.95)",
          backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)",
          border: `1px solid ${pal.borderSubtle}`, borderRadius: tokens.radius.md,
          padding: 4, minWidth: 180, boxShadow: `0 8px 24px ${pal.shadowLg}`, fontFamily: tokens.font.sans,
          animation: `halaska-scale-in ${motion.fast} ${motion.emphasized} both`, transformOrigin: "top left",
        }}>
          {items.map((it, i) => it.separator ? (
            <div key={i} style={{ height: 1, background: pal.borderSubtle, margin: "4px 0" }} />
          ) : (
            <button key={i} onClick={() => { it.onSelect?.(); setMenu(null); }}
              onMouseEnter={(e) => e.currentTarget.style.background = pal.bgSubtle}
              onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
              style={{
                ...interactiveBase, width: "100%", padding: "7px 10px", borderRadius: tokens.radius.sm,
                display: "flex", alignItems: "center", gap: 10,
                background: "transparent", color: it.danger ? pal.danger : pal.text,
                ...tokens.type.sm, textAlign: "left",
                transition: `background ${motion.fast} ${motion.easeInOut}`,
              }}>
              {it.icon && <span style={{ color: pal.textSecondary, width: 14, display: "inline-flex" }}>{it.icon}</span>}
              <span style={{ flex: 1 }}>{it.label}</span>
              {it.shortcut && <Kbd theme={theme}>{it.shortcut}</Kbd>}
            </button>
          ))}
        </div>
      )}
    </>
  );
}

function Menubar({ menus, theme: tp }) {
  const ctx = useThemeContext(); const theme = tp || ctx; const pal = usePal(theme);
  const [open, setOpen] = useState(null);
  return (
    <div style={{ display: "inline-flex", gap: 2, padding: 4, background: pal.bgSubtle, borderRadius: tokens.radius.md, fontFamily: tokens.font.sans, position: "relative", transition: `background ${motion.smooth} ${motion.easeInOut}` }}>
      {menus.map((m, i) => (
        <div key={m.label} style={{ position: "relative" }}>
          <button onClick={() => setOpen(o => o === i ? null : i)} onMouseEnter={() => { if (open !== null) setOpen(i); }}
            style={{
              ...interactiveBase, padding: "6px 12px", borderRadius: tokens.radius.sm,
              background: open === i ? pal.bgElevated : "transparent",
              color: pal.text, ...tokens.type.sm, fontWeight: tokens.weight.medium,
              transition: `background ${motion.fast} ${motion.easeInOut}`,
            }}>{m.label}</button>
          {open === i && (
            <>
              <div onClick={() => setOpen(null)} style={{ position: "fixed", inset: 0, zIndex: 99 }} />
              <div style={{
                position: "absolute", top: "calc(100% + 4px)", left: 0, zIndex: 100,
                background: theme === "dark" ? "rgba(30,30,30,0.95)" : "rgba(255,255,255,0.95)",
                backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)",
                border: `1px solid ${pal.borderSubtle}`, borderRadius: tokens.radius.md, padding: 4, minWidth: 180,
                boxShadow: `0 8px 24px ${pal.shadowLg}`,
                animation: `halaska-scale-in ${motion.fast} ${motion.emphasized} both`,
              }}>
                {m.items.map((it, j) => it.separator ? (
                  <div key={j} style={{ height: 1, background: pal.borderSubtle, margin: "4px 0" }} />
                ) : (
                  <button key={j} onClick={() => { it.onSelect?.(); setOpen(null); }}
                    onMouseEnter={(e) => e.currentTarget.style.background = pal.bgSubtle}
                    onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                    style={{
                      ...interactiveBase, width: "100%", padding: "7px 10px", borderRadius: tokens.radius.sm,
                      display: "flex", alignItems: "center", gap: 10, color: it.danger ? pal.danger : pal.text,
                      background: "transparent", ...tokens.type.sm, textAlign: "left",
                      transition: `background ${motion.fast} ${motion.easeInOut}`,
                    }}>
                    <span style={{ flex: 1 }}>{it.label}</span>
                    {it.shortcut && <Kbd theme={theme}>{it.shortcut}</Kbd>}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
}

function Sparkline({ data = [], width = 240, height = 72, color, fill = true, theme: tp }) {
  const ctx = useThemeContext(); const theme = tp || ctx; const pal = usePal(theme);
  if (!data.length) return null;
  const points = typeof data[0] === "number"
    ? data.map((v, i) => ({ i, value: v }))
    : data.map((d, i) => ({ i, value: d.value, label: d.label }));
  const stroke = color || pal.accent;
  const gradId = `spark-${stroke.replace(/[^a-z0-9]/gi, "")}`;
  return (
    <div style={{ width, height }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={points} margin={{ top: 6, right: 6, bottom: 6, left: 6 }}>
          <defs>
            <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={stroke} stopOpacity={0.28} />
              <stop offset="100%" stopColor={stroke} stopOpacity={0} />
            </linearGradient>
          </defs>
          <RechartsTooltip
            cursor={{ stroke: pal.borderSubtle, strokeWidth: 1 }}
            allowEscapeViewBox={{ x: false, y: true }}
            offset={16}
            content={<ChartTooltip theme={theme} labelFormatter={(l) => `Point ${l + 1}`} flipOnEdges />}
          />
          <Area type="monotone" dataKey="value" stroke={stroke} strokeWidth={1.5}
            fill={fill ? `url(#${gradId})` : "none"}
            activeDot={{ r: 4, fill: stroke, stroke: pal.bgElevated, strokeWidth: 2 }}
            animationDuration={600} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

function BouncyActiveBar(props) {
  const { x, y, width, height, fill, hoverFill } = props;
  return (
    <g style={{ transformOrigin: `${x + width / 2}px ${y + height}px`, animation: `halaska-bar-bounce 0.45s cubic-bezier(0.34, 1.56, 0.64, 1) both` }}>
      <rect x={x} y={y - 3} width={width} height={height + 3} rx={4} fill={hoverFill || fill} />
    </g>
  );
}

function BarChart({ data = [], width = 320, height = 180, xKey = "label", yKey = "value", target, theme: tp }) {
  const ctx = useThemeContext(); const theme = tp || ctx; const pal = usePal(theme);
  const rows = typeof data[0] === "number"
    ? data.map((v, i) => ({ label: `D${i + 1}`, value: v }))
    : data.map((d, i) => ({ label: d.label ?? `D${i + 1}`, value: d.value }));
  const [active, setActive] = useState(null);
  return (
    <div style={{ width, height }}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsBarChart data={rows} margin={{ top: 8, right: 8, bottom: 0, left: -24 }}
          onMouseMove={(s) => setActive(s?.activeTooltipIndex ?? null)}
          onMouseLeave={() => setActive(null)}>
          <CartesianGrid stroke={pal.borderSubtle} strokeDasharray="2 4" vertical={false} />
          <XAxis dataKey={xKey} stroke={pal.textTertiary} tick={{ fontSize: 10, fill: pal.textTertiary, fontFamily: tokens.font.sans }} tickLine={false} axisLine={{ stroke: pal.borderSubtle }} />
          <YAxis stroke={pal.textTertiary} tick={{ fontSize: 10, fill: pal.textTertiary, fontFamily: tokens.font.sans }} tickLine={false} axisLine={false} width={40} />
          <RechartsTooltip
            cursor={{ fill: pal.bgSubtle }}
            content={<ChartTooltip theme={theme} />}
          />
          {target != null && (
            <ReferenceLine y={target} stroke={pal.warning} strokeDasharray="4 4" strokeWidth={1}
              label={{ value: `target ${target}`, position: "insideTopRight", fill: pal.warning, fontSize: 10, fontFamily: tokens.font.sans }} />
          )}
          <Bar dataKey={yKey} radius={[4, 4, 0, 0]} animationDuration={700}
            activeBar={<BouncyActiveBar hoverFill={pal.accentHover} />}>
            {rows.map((_, i) => (
              <Cell key={i} fill={active === i ? pal.accentHover : pal.accent} cursor="pointer" />
            ))}
          </Bar>
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  );
}

function ComposedChartCombo({ data = [], width = 360, height = 200, theme: tp }) {
  const ctx = useThemeContext(); const theme = tp || ctx; const pal = usePal(theme);
  return (
    <div style={{ width, height }}>
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -24 }}>
          <CartesianGrid stroke={pal.borderSubtle} strokeDasharray="2 4" vertical={false} />
          <XAxis dataKey="label" stroke={pal.textTertiary} tick={{ fontSize: 10, fill: pal.textTertiary, fontFamily: tokens.font.sans }} tickLine={false} axisLine={{ stroke: pal.borderSubtle }} />
          <YAxis yAxisId="left" stroke={pal.textTertiary} tick={{ fontSize: 10, fill: pal.textTertiary, fontFamily: tokens.font.sans }} tickLine={false} axisLine={false} width={36} />
          <YAxis yAxisId="right" orientation="right" stroke={pal.textTertiary} tick={{ fontSize: 10, fill: pal.textTertiary, fontFamily: tokens.font.sans }} tickLine={false} axisLine={false} width={36} />
          <RechartsTooltip cursor={{ fill: pal.bgSubtle }} content={<ChartTooltip theme={theme} />} />
          <Bar yAxisId="left" dataKey="volume" fill={pal.bgMuted} radius={[3, 3, 0, 0]} animationDuration={700} />
          <Line yAxisId="right" type="monotone" dataKey="price" stroke={pal.accent} strokeWidth={1.75} dot={false} activeDot={{ r: 4, fill: pal.accent, stroke: pal.bgElevated, strokeWidth: 2 }} animationDuration={700} />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}

function RadialBarRing({ data = [], width = 220, height = 220, theme: tp }) {
  const ctx = useThemeContext(); const theme = tp || ctx; const pal = usePal(theme);
  const palette = [pal.accent, pal.success, pal.warning, pal.danger];
  const colored = data.map((d, i) => ({ ...d, fill: d.color || palette[i % palette.length] }));
  return (
    <div style={{ width, height }}>
      <ResponsiveContainer width="100%" height="100%">
        <RadialBarChart innerRadius="32%" outerRadius="100%" data={colored} startAngle={90} endAngle={-270} barSize={12}>
          <RadialBar dataKey="value" cornerRadius={6} background={{ fill: pal.bgMuted }} animationDuration={700} />
          <RechartsTooltip content={<ChartTooltip theme={theme} valueFormatter={(v) => `${v}%`} />} />
        </RadialBarChart>
      </ResponsiveContainer>
    </div>
  );
}

function TreemapHeat({ data = [], width = 360, height = 220, theme: tp }) {
  const ctx = useThemeContext(); const theme = tp || ctx; const pal = usePal(theme);
  const palette = [pal.accent, pal.success, pal.warning, pal.danger, pal.textSecondary];
  const colored = data.map((d, i) => ({ ...d, fill: d.color || palette[i % palette.length] }));
  return (
    <div style={{ width, height }}>
      <ResponsiveContainer width="100%" height="100%">
        <Treemap data={colored} dataKey="value" stroke={pal.bg} strokeWidth={2} animationDuration={700}
          content={<TreemapTile />} />
      </ResponsiveContainer>
    </div>
  );
}

function TreemapTile(props) {
  const { x, y, width, height, name, value, fill } = props;
  if (width < 1 || height < 1) return null;
  return (
    <g>
      <rect x={x} y={y} width={width} height={height} fill={fill} style={{ transition: "fill 0.25s ease" }} />
      {width > 50 && height > 32 && (
        <>
          <text x={x + 10} y={y + 20} fill="#fff" stroke="none" fontSize={11} fontWeight={600} fontFamily="Geist, sans-serif">{name}</text>
          <text x={x + 10} y={y + 34} fill="rgba(255,255,255,0.8)" stroke="none" fontSize={10} fontFamily="Geist, sans-serif">{value}</text>
        </>
      )}
    </g>
  );
}

function BrushChart({ data = [], width = 480, height = 240, theme: tp }) {
  const ctx = useThemeContext(); const theme = tp || ctx; const pal = usePal(theme);
  return (
    <div style={{ width, maxWidth: "100%", height }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -24 }}>
          <defs>
            <linearGradient id="brush-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={pal.accent} stopOpacity={0.32} />
              <stop offset="100%" stopColor={pal.accent} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke={pal.borderSubtle} strokeDasharray="2 4" vertical={false} />
          <XAxis dataKey="label" stroke={pal.textTertiary} tick={{ fontSize: 9, fill: pal.textTertiary, fontFamily: tokens.font.sans }} tickLine={false} axisLine={{ stroke: pal.borderSubtle }} interval={Math.floor(data.length / 8)} />
          <YAxis stroke={pal.textTertiary} tick={{ fontSize: 10, fill: pal.textTertiary, fontFamily: tokens.font.sans }} tickLine={false} axisLine={false} width={36} />
          <RechartsTooltip content={<ChartTooltip theme={theme} />} cursor={{ stroke: pal.borderSubtle }} />
          <ReferenceLine y={120} stroke={pal.warning} strokeDasharray="4 4" label={{ value: "target", position: "insideTopRight", fill: pal.warning, fontSize: 10, fontFamily: tokens.font.sans }} />
          <Area type="monotone" dataKey="value" stroke={pal.accent} strokeWidth={1.5} fill="url(#brush-grad)" animationDuration={700} />
          <Brush dataKey="label" height={20} stroke={pal.accent} fill={pal.bgSubtle} travellerWidth={8}
            startIndex={Math.max(0, data.length - 30)} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

function DonutChart({ data = [], size = 180, thickness = 22, theme: tp }) {
  const ctx = useThemeContext(); const theme = tp || ctx; const pal = usePal(theme);
  const palette = [pal.accent, pal.success, pal.warning, pal.danger, pal.textSecondary];
  const colored = data.map((d, i) => ({ ...d, color: d.color || palette[i % palette.length] }));
  const total = colored.reduce((s, d) => s + d.value, 0) || 1;
  const outerR = size / 2;
  const innerR = outerR - thickness;
  const [active, setActive] = useState(null);
  const activeData = active != null ? colored[active] : null;

  const renderActiveShape = (props) => {
    const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = props;
    return (
      <g>
        <Sector cx={cx} cy={cy} innerRadius={innerRadius} outerRadius={outerRadius + 6}
          startAngle={startAngle} endAngle={endAngle} fill={fill} />
        <Sector cx={cx} cy={cy} innerRadius={outerRadius + 8} outerRadius={outerRadius + 10}
          startAngle={startAngle} endAngle={endAngle} fill={fill} opacity={0.25} />
      </g>
    );
  };

  return (
    <div style={{ position: "relative", width: size + 24, height: size + 24 }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={colored} dataKey="value" innerRadius={innerR} outerRadius={outerR}
            stroke="none" startAngle={90} endAngle={-270}
            activeIndex={active ?? undefined}
            activeShape={renderActiveShape}
            onMouseEnter={(_, i) => setActive(i)}
            onMouseLeave={() => setActive(null)}
            animationDuration={700}>
            {colored.map((d, i) => <Cell key={i} fill={d.color} cursor="pointer" />)}
          </Pie>
          <RechartsTooltip wrapperStyle={{ zIndex: 10 }} content={<ChartTooltip theme={theme} valueFormatter={(v) => `${v} (${Math.round((v / total) * 100)}%)`} />} />
        </PieChart>
      </ResponsiveContainer>
      <div style={{
        position: "absolute", inset: 0, display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center", pointerEvents: "none",
        fontFamily: tokens.font.sans, zIndex: 1,
      }}>
        <div style={{ ...tokens.type.xs, color: pal.textTertiary, textTransform: "uppercase", letterSpacing: 0.4 }}>
          {activeData ? (activeData.label || "Share") : "Total"}
        </div>
        <div style={{ ...tokens.type.xxl, fontWeight: tokens.weight.semibold, color: activeData ? activeData.color : pal.text, fontVariantNumeric: "tabular-nums", transition: `color ${motion.fast} ${motion.easeInOut}` }}>
          {activeData ? activeData.value : total}
        </div>
      </div>
    </div>
  );
}

function DataTable({ columns, rows, theme: tp }) {
  const ctx = useThemeContext(); const theme = tp || ctx; const pal = usePal(theme);
  const [sort, setSort] = useState({ key: null, dir: "asc" });
  const [selected, setSelected] = useState(new Set());
  const [hoverRow, setHoverRow] = useState(-1);
  const sortedRows = sort.key != null
    ? [...rows].sort((a, b) => {
        const av = a[sort.key]; const bv = b[sort.key];
        const sign = sort.dir === "asc" ? 1 : -1;
        return av > bv ? sign : av < bv ? -sign : 0;
      })
    : rows;
  const toggleAll = () => {
    if (selected.size === rows.length) setSelected(new Set());
    else setSelected(new Set(rows.map((_, i) => i)));
  };
  const toggleRow = (i) => {
    const s = new Set(selected);
    s.has(i) ? s.delete(i) : s.add(i);
    setSelected(s);
  };
  const toggleSort = (i) => {
    if (sort.key === i) setSort({ key: i, dir: sort.dir === "asc" ? "desc" : "asc" });
    else setSort({ key: i, dir: "asc" });
  };
  return (
    <div style={{ width: "100%", overflow: "auto", borderRadius: tokens.radius.md, border: `1px solid ${pal.borderSubtle}`, transition: `border-color ${motion.smooth} ${motion.easeInOut}` }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: tokens.font.sans }}>
        <thead>
          <tr style={{ borderBottom: `1px solid ${pal.borderSubtle}` }}>
            <th style={{ padding: "10px 14px", width: 24 }}>
              <Checkbox theme={theme} checked={selected.size === rows.length && rows.length > 0} onChange={toggleAll} />
            </th>
            {columns.map((col, i) => (
              <th key={i} onClick={() => toggleSort(i)} style={{ ...tokens.type.xs, fontWeight: tokens.weight.semibold, color: pal.textTertiary, textAlign: "left", padding: "10px 14px", textTransform: "uppercase", letterSpacing: "0.05em", cursor: "pointer", userSelect: "none", transition: `color ${motion.smooth} ${motion.easeInOut}` }}>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>{col}
                  {sort.key === i && <span style={{ color: pal.text }}>{sort.dir === "asc" ? "↑" : "↓"}</span>}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedRows.map((row, ri) => (
            <tr key={ri} onMouseEnter={() => setHoverRow(ri)} onMouseLeave={() => setHoverRow(-1)}
              style={{ borderBottom: ri < sortedRows.length - 1 ? `1px solid ${pal.borderSubtle}` : "none", background: selected.has(ri) ? pal.accentBg : hoverRow === ri ? pal.bgSubtle : "transparent", transition: `background ${motion.normal} ${motion.easeInOut}` }}>
              <td style={{ padding: "10px 14px" }}>
                <Checkbox theme={theme} checked={selected.has(ri)} onChange={() => toggleRow(ri)} />
              </td>
              {row.map((cell, ci) => (
                <td key={ci} style={{ ...tokens.type.sm, color: pal.text, padding: "10px 14px", transition: `color ${motion.smooth} ${motion.easeInOut}` }}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function AlertDialog({ open, onClose, title, description, variant = "danger", confirmLabel = "Confirm", cancelLabel = "Cancel", onConfirm, theme: tp }) {
  const ctx = useThemeContext(); const theme = tp || ctx; const pal = usePal(theme);
  if (!open) return null;
  const iconColor = variant === "danger" ? pal.danger : variant === "warning" ? pal.warning : pal.accent;
  const iconBg = variant === "danger" ? pal.dangerBg : variant === "warning" ? pal.warningBg : pal.accentBg;
  const icon = variant === "danger" ? "!" : variant === "warning" ? "⚠" : "ℹ";
  return (
    <div onClick={onClose} style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)", WebkitBackdropFilter: "blur(4px)",
      display: "flex", alignItems: "center", justifyContent: "center", zIndex: 10000,
      animation: `halaska-fade-in ${motion.fast} ${motion.easeOut} both`,
    }}>
      <div onClick={(e) => e.stopPropagation()} style={{
        background: theme === "dark" ? "rgba(30,30,30,0.95)" : "rgba(255,255,255,0.95)",
        backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
        borderRadius: tokens.radius.lg, padding: 24, minWidth: 320, maxWidth: 420,
        border: `1px solid ${pal.borderSubtle}`, boxShadow: `0 16px 48px ${pal.shadowLg}`,
        animation: `halaska-scale-in ${motion.normal} ${motion.emphasized} both`, fontFamily: tokens.font.sans,
      }}>
        <div style={{ display: "flex", gap: 16, marginBottom: 16 }}>
          <div style={{ width: 40, height: 40, borderRadius: 20, background: iconBg, color: iconColor, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: tokens.weight.bold, flexShrink: 0 }}>{icon}</div>
          <div>
            {title && <div style={{ ...tokens.type.lg, fontWeight: tokens.weight.semibold, color: pal.text, marginBottom: 6 }}>{title}</div>}
            {description && <div style={{ ...tokens.type.sm, color: pal.textSecondary, lineHeight: 1.6 }}>{description}</div>}
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
          <Button theme={theme} variant="ghost" size="sm" onClick={onClose}>{cancelLabel}</Button>
          <Button theme={theme} variant={variant === "danger" ? "danger" : "primary"} size="sm" onClick={() => { onConfirm?.(); onClose?.(); }}>{confirmLabel}</Button>
        </div>
      </div>
    </div>
  );
}

function FormDialog({ open, onClose, title, description, children, submitLabel = "Save", onSubmit, theme: tp }) {
  const ctx = useThemeContext(); const theme = tp || ctx; const pal = usePal(theme);
  if (!open) return null;
  return (
    <div onClick={onClose} style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)", WebkitBackdropFilter: "blur(4px)",
      display: "flex", alignItems: "center", justifyContent: "center", zIndex: 10000,
      animation: `halaska-fade-in ${motion.fast} ${motion.easeOut} both`,
    }}>
      <div onClick={(e) => e.stopPropagation()} style={{
        background: theme === "dark" ? "rgba(30,30,30,0.95)" : "rgba(255,255,255,0.95)",
        backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
        borderRadius: tokens.radius.lg, padding: 24, minWidth: 360, maxWidth: 480,
        border: `1px solid ${pal.borderSubtle}`, boxShadow: `0 16px 48px ${pal.shadowLg}`,
        animation: `halaska-scale-in ${motion.normal} ${motion.emphasized} both`, fontFamily: tokens.font.sans,
      }}>
        {title && <div style={{ ...tokens.type.lg, fontWeight: tokens.weight.semibold, color: pal.text, marginBottom: description ? 4 : 16 }}>{title}</div>}
        {description && <div style={{ ...tokens.type.sm, color: pal.textSecondary, marginBottom: 16, lineHeight: 1.6 }}>{description}</div>}
        <form onSubmit={(e) => { e.preventDefault(); onSubmit?.(); onClose?.(); }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>{children}</div>
          <div style={{ marginTop: 20, display: "flex", justifyContent: "flex-end", gap: 8 }}>
            <Button theme={theme} variant="ghost" size="sm" onClick={onClose}>Cancel</Button>
            <Button theme={theme} variant="primary" size="sm">{submitLabel}</Button>
          </div>
        </form>
      </div>
    </div>
  );
}

function CardDialog({ open, onClose, cover, title, description, children, actions, theme: tp }) {
  const ctx = useThemeContext(); const theme = tp || ctx; const pal = usePal(theme);
  if (!open) return null;
  return (
    <div onClick={onClose} style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)", WebkitBackdropFilter: "blur(4px)",
      display: "flex", alignItems: "center", justifyContent: "center", zIndex: 10000,
      animation: `halaska-fade-in ${motion.fast} ${motion.easeOut} both`,
    }}>
      <div onClick={(e) => e.stopPropagation()} style={{
        background: theme === "dark" ? "rgba(30,30,30,0.95)" : "rgba(255,255,255,0.95)",
        backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
        borderRadius: tokens.radius.lg, overflow: "hidden", minWidth: 360, maxWidth: 480,
        border: `1px solid ${pal.borderSubtle}`, boxShadow: `0 16px 48px ${pal.shadowLg}`,
        animation: `halaska-scale-in ${motion.normal} ${motion.emphasized} both`, fontFamily: tokens.font.sans,
      }}>
        {cover && (
          <div style={{ height: 140, background: `linear-gradient(135deg, ${pal.accent}, ${pal.accentHover})`, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 32, transition: `background ${motion.smooth} ${motion.easeInOut}` }}>{cover}</div>
        )}
        <div style={{ padding: 24 }}>
          {title && <div style={{ ...tokens.type.lg, fontWeight: tokens.weight.semibold, color: pal.text, marginBottom: 4 }}>{title}</div>}
          {description && <div style={{ ...tokens.type.sm, color: pal.textSecondary, marginBottom: 16, lineHeight: 1.6 }}>{description}</div>}
          {children && <div style={{ marginBottom: 16 }}>{children}</div>}
          {actions && <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>{actions}</div>}
        </div>
      </div>
    </div>
  );
}

// ─── 10. ADDITIONAL COMPONENTS (shadcn parity) ───────────────

function Accordion({ items, theme: tp }) {
  const ctx = useThemeContext(); const theme = tp || ctx; const pal = usePal(theme);
  const [openIdx, setOpenIdx] = useState(-1);
  return (
    <div style={{ width: "100%" }}>
      {items.map((item, i) => (
        <div key={i} style={{ borderBottom: `1px solid ${pal.borderSubtle}`, transition: `border-color ${motion.smooth} ${motion.easeInOut}` }}>
          <button onClick={() => setOpenIdx(openIdx === i ? -1 : i)} style={{
            ...interactiveBase, width: "100%", textAlign: "left", padding: "14px 0",
            display: "flex", justifyContent: "space-between", alignItems: "center",
            ...tokens.type.base, fontWeight: tokens.weight.medium, color: pal.text,
            background: "transparent", transition: `color ${motion.normal} ${motion.easeInOut}`,
          }}>
            {item.title}
            <span style={{ color: pal.textTertiary, display: "inline-flex" }}>
              <ChevronIcon size={12} direction={openIdx === i ? "up" : "down"} />
            </span>
          </button>
          <div style={{
            maxHeight: openIdx === i ? 200 : 0, overflow: "hidden", opacity: openIdx === i ? 1 : 0,
            transition: `max-height ${motion.smooth} ${motion.emphasized}, opacity ${motion.normal} ${motion.easeInOut}`,
          }}>
            <div style={{ ...tokens.type.sm, color: pal.textSecondary, paddingBottom: 14, lineHeight: 1.6, transition: `color ${motion.smooth} ${motion.easeInOut}` }}>{item.content}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

function Dialog({ open, onClose, title, children, theme: tp }) {
  const ctx = useThemeContext(); const theme = tp || ctx; const pal = usePal(theme);
  if (!open) return null;
  return (
    <div onClick={onClose} style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)", WebkitBackdropFilter: "blur(4px)",
      display: "flex", alignItems: "center", justifyContent: "center", zIndex: 10000,
      animation: `halaska-fade-in ${motion.fast} ${motion.easeOut} both`,
    }}>
      <div onClick={(e) => e.stopPropagation()} style={{
        background: theme === "dark" ? "rgba(30,30,30,0.95)" : "rgba(255,255,255,0.95)",
        backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
        borderRadius: tokens.radius.lg, padding: 24, minWidth: 320, maxWidth: 480,
        border: `1px solid ${pal.borderSubtle}`, boxShadow: `0 16px 48px ${pal.shadowLg}`,
        animation: `halaska-scale-in ${motion.normal} ${motion.emphasized} both`,
      }}>
        {title && <div style={{ ...tokens.type.lg, fontWeight: tokens.weight.semibold, color: pal.text, marginBottom: 12, fontFamily: tokens.font.sans }}>{title}</div>}
        <div style={{ ...tokens.type.base, color: pal.textSecondary, lineHeight: 1.6, fontFamily: tokens.font.sans }}>{children}</div>
        <div style={{ marginTop: 20, display: "flex", justifyContent: "flex-end", gap: 8 }}>
          <Button theme={theme} variant="ghost" size="sm" onClick={onClose}>Cancel</Button>
          <Button theme={theme} variant="primary" size="sm" onClick={onClose}>Confirm</Button>
        </div>
      </div>
    </div>
  );
}

function Tooltip({ children, text, theme: tp }) {
  const ctx = useThemeContext(); const theme = tp || ctx; const pal = usePal(theme);
  const [show, setShow] = useState(false);
  return (
    <div style={{ position: "relative", display: "inline-flex" }}
      onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
      {children}
      <div style={{
        position: "absolute", bottom: "100%", left: "50%", transform: "translateX(-50%)",
        marginBottom: 6, padding: "5px 10px", borderRadius: tokens.radius.sm,
        background: theme === "dark" ? "#fff" : "#222", color: theme === "dark" ? "#222" : "#fff",
        ...tokens.type.xs, fontFamily: tokens.font.sans, whiteSpace: "nowrap",
        opacity: show ? 1 : 0, pointerEvents: "none",
        transition: `opacity ${motion.fast} ${motion.easeInOut}`,
      }}>{text}</div>
    </div>
  );
}

function Popover({ trigger, children, theme: tp }) {
  const ctx = useThemeContext(); const theme = tp || ctx; const pal = usePal(theme);
  const [open, setOpen] = useState(false);
  return (
    <div style={{ position: "relative", display: "inline-flex" }}>
      <div onClick={() => setOpen(!open)}>{trigger}</div>
      {open && <div onClick={() => setOpen(false)} style={{ position: "fixed", inset: 0, zIndex: 9999 }} />}
      <div style={{
        position: "absolute", top: "100%", left: 0, marginTop: 8, zIndex: 10000,
        background: theme === "dark" ? "rgba(30,30,30,0.95)" : "rgba(255,255,255,0.95)",
        backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)",
        border: `1px solid ${pal.borderSubtle}`, borderRadius: tokens.radius.md,
        padding: 16, minWidth: 200, boxShadow: `0 8px 24px ${pal.shadowLg}`,
        opacity: open ? 1 : 0, transform: open ? "translateY(0)" : "translateY(-4px)",
        pointerEvents: open ? "auto" : "none",
        transition: `opacity ${motion.fast} ${motion.easeOut}, transform ${motion.normal} ${motion.emphasized}`,
      }}>{children}</div>
    </div>
  );
}

function Sheet({ open, onClose, title, children, side = "right", theme: tp }) {
  const ctx = useThemeContext(); const theme = tp || ctx; const pal = usePal(theme);
  const isRight = side === "right";
  return (
    <>
      {open && <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 10000, animation: `halaska-fade-in ${motion.fast} ${motion.easeOut} both` }} />}
      <div style={{
        position: "fixed", top: 0, bottom: 0, [isRight ? "right" : "left"]: 0,
        width: 320, zIndex: 10001,
        background: theme === "dark" ? "rgba(26,26,26,0.95)" : "rgba(255,255,255,0.95)",
        backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
        border: `1px solid ${pal.borderSubtle}`, padding: 24,
        transform: open ? "translateX(0)" : `translateX(${isRight ? "100%" : "-100%"})`,
        transition: `transform ${motion.smooth} ${motion.emphasized}`,
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          {title && <div style={{ ...tokens.type.lg, fontWeight: tokens.weight.semibold, color: pal.text, fontFamily: tokens.font.sans }}>{title}</div>}
          <button onClick={onClose} style={{ ...interactiveBase, background: "transparent", ...tokens.type.lg, color: pal.textTertiary, padding: 4 }}>✕</button>
        </div>
        <div style={{ ...tokens.type.base, color: pal.textSecondary, lineHeight: 1.6, fontFamily: tokens.font.sans }}>{children}</div>
      </div>
    </>
  );
}

function Table({ columns, rows, theme: tp }) {
  const ctx = useThemeContext(); const theme = tp || ctx; const pal = usePal(theme);
  const [hoverRow, setHoverRow] = useState(-1);
  return (
    <div style={{ width: "100%", overflow: "auto", borderRadius: tokens.radius.md, border: `1px solid ${pal.borderSubtle}`, transition: `border-color ${motion.smooth} ${motion.easeInOut}` }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: tokens.font.sans }}>
        <thead>
          <tr style={{ borderBottom: `1px solid ${pal.borderSubtle}` }}>
            {columns.map((col, i) => (
              <th key={i} style={{ ...tokens.type.xs, fontWeight: tokens.weight.semibold, color: pal.textTertiary, textAlign: "left", padding: "10px 14px", textTransform: "uppercase", letterSpacing: "0.05em", transition: `color ${motion.smooth} ${motion.easeInOut}` }}>{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr key={ri} onMouseEnter={() => setHoverRow(ri)} onMouseLeave={() => setHoverRow(-1)}
              style={{ borderBottom: ri < rows.length - 1 ? `1px solid ${pal.borderSubtle}` : "none", background: hoverRow === ri ? pal.bgSubtle : "transparent", transition: `background ${motion.normal} ${motion.easeInOut}` }}>
              {row.map((cell, ci) => (
                <td key={ci} style={{ ...tokens.type.sm, color: pal.text, padding: "10px 14px", transition: `color ${motion.smooth} ${motion.easeInOut}` }}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Tabs({ tabs, value, onChange, theme: tp }) {
  const ctx = useThemeContext(); const theme = tp || ctx; const pal = usePal(theme);
  const [hover, setHover] = useState(null);
  const containerRef = useRef(null);
  const [rect, setRect] = useState({ left: 0, width: 0 });
  const [ready, setReady] = useState(false);
  useEffect(() => {
    if (!containerRef.current) return;
    const measure = () => {
      const btn = containerRef.current?.querySelector(`[data-tab="${value}"]`);
      if (btn) {
        const p = containerRef.current.getBoundingClientRect();
        const r = btn.getBoundingClientRect();
        setRect({ left: r.left - p.left, width: r.width });
        setReady(true);
      }
    };
    measure();
    const raf = requestAnimationFrame(measure);
    window.addEventListener("resize", measure);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", measure); };
  }, [value, tabs]);
  return (
    <div ref={containerRef} style={{ position: "relative", display: "flex", borderBottom: `1px solid ${pal.borderSubtle}`, gap: 0, transition: `border-color ${motion.smooth} ${motion.easeInOut}` }}>
      {tabs.map(t => (
        <button key={t} data-tab={t} onClick={() => onChange(t)}
          onMouseEnter={() => setHover(t)} onMouseLeave={() => setHover(null)}
          style={{
            ...interactiveBase, ...tokens.type.sm, fontWeight: value === t ? tokens.weight.medium : tokens.weight.regular,
            color: value === t ? pal.text : hover === t ? pal.text : pal.textTertiary,
            padding: "10px 16px", background: "transparent", border: "none",
            transition: `color ${motion.normal} ${motion.easeInOut}, font-weight ${motion.normal} ${motion.easeInOut}`,
          }}>{t}</button>
      ))}
      <div aria-hidden style={{
        position: "absolute", bottom: -1, height: 2, background: pal.accent,
        left: rect.left, width: rect.width, opacity: ready ? 1 : 0,
        transition: `left ${motion.spring} ${motion.springCurve}, width ${motion.spring} ${motion.springCurve}, opacity ${motion.fast} ${motion.easeOut}, background ${motion.smooth} ${motion.easeInOut}`,
        pointerEvents: "none",
      }} />
    </div>
  );
}

function Collapsible({ title, children, defaultOpen = false, theme: tp }) {
  const ctx = useThemeContext(); const theme = tp || ctx; const pal = usePal(theme);
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div>
      <button onClick={() => setOpen(!open)} style={{
        ...interactiveBase, width: "100%", textAlign: "left", padding: "10px 0",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        ...tokens.type.base, fontWeight: tokens.weight.medium, color: pal.text, background: "transparent",
        transition: `color ${motion.normal} ${motion.easeInOut}`,
      }}>
        {title}
        <span style={{ color: pal.textTertiary, display: "inline-flex" }}>
          <ChevronIcon size={12} direction={open ? "down" : "right"} />
        </span>
      </button>
      <div style={{ maxHeight: open ? 500 : 0, overflow: "hidden", opacity: open ? 1 : 0, transition: `max-height ${motion.smooth} ${motion.emphasized}, opacity ${motion.normal} ${motion.easeInOut}` }}>
        {children}
      </div>
    </div>
  );
}

function Toggle({ pressed, onPress, children, theme: tp }) {
  const ctx = useThemeContext(); const theme = tp || ctx; const pal = usePal(theme);
  const [hover, setHover] = useState(false);
  return (
    <button onClick={() => onPress?.(!pressed)}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        ...interactiveBase, ...tokens.type.sm, fontWeight: tokens.weight.medium,
        padding: "8px 14px", borderRadius: tokens.radius.md,
        color: pressed ? pal.text : pal.textTertiary,
        background: pressed ? pal.bgMuted : hover ? pal.bgSubtle : "transparent",
        border: `1px solid ${pressed ? pal.border : "transparent"}`,
        transition: `all ${motion.normal} ${motion.easeInOut}`,
      }}>{children}</button>
  );
}

function ToggleGroup({ options, value, onChange, theme: tp }) {
  const ctx = useThemeContext(); const theme = tp || ctx; const pal = usePal(theme);
  return (
    <div style={{ display: "inline-flex", borderRadius: tokens.radius.md, border: `1px solid ${pal.borderSubtle}`, overflow: "hidden", transition: `border-color ${motion.smooth} ${motion.easeInOut}` }}>
      {options.map((opt, i) => {
        const active = Array.isArray(value) ? value.includes(opt) : value === opt;
        return (
          <button key={opt} onClick={() => onChange(opt)} style={{
            ...interactiveBase, ...tokens.type.sm, fontWeight: active ? tokens.weight.medium : tokens.weight.regular,
            padding: "8px 14px", color: active ? pal.text : pal.textTertiary,
            background: active ? pal.bgMuted : "transparent",
            borderRight: i < options.length - 1 ? `1px solid ${pal.borderSubtle}` : "none",
            transition: `all ${motion.normal} ${motion.easeInOut}`,
          }}>{opt}</button>
        );
      })}
    </div>
  );
}

function Breadcrumb({ items, maxVisible, theme: tp }) {
  const ctx = useThemeContext(); const theme = tp || ctx; const pal = usePal(theme);
  const [hover, setHover] = useState(false);
  const truncated = maxVisible && items.length > maxVisible;
  // Always show first + last, "..." between for truncation
  const visible = truncated
    ? [items[0], { ellipsis: true, hidden: items.slice(1, -1) }, items[items.length - 1]]
    : items;
  return (
    <nav style={{ display: "flex", alignItems: "center", gap: 6, fontFamily: tokens.font.sans }}>
      {visible.map((item, i) => {
        const isLast = i === visible.length - 1;
        const sep = i > 0 && <span style={{ ...tokens.type.sm, color: pal.textMuted }}>/</span>;
        if (item.ellipsis) {
          return (
            <div key={`ell-${i}`} style={{ position: "relative", display: "flex", alignItems: "center", gap: 6 }}
              onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
              {sep}
              <span style={{
                ...tokens.type.sm, color: hover ? pal.text : pal.textTertiary,
                cursor: "default", padding: "2px 6px", borderRadius: tokens.radius.sm,
                background: hover ? pal.bgSubtle : "transparent",
                transition: `all ${motion.fast} ${motion.easeInOut}`,
              }}>…</span>
              <div style={{
                position: "absolute", top: "calc(100% + 6px)", left: "50%", transform: "translateX(-50%)",
                background: theme === "dark" ? "rgba(30,30,30,0.95)" : "rgba(255,255,255,0.95)",
                backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)",
                border: `1px solid ${pal.borderSubtle}`, borderRadius: tokens.radius.md,
                padding: "8px 10px", boxShadow: `0 8px 24px ${pal.shadowLg}`,
                opacity: hover ? 1 : 0, pointerEvents: hover ? "auto" : "none",
                transition: `opacity ${motion.fast} ${motion.easeOut}, transform ${motion.normal} ${motion.emphasized}`,
                whiteSpace: "nowrap", zIndex: 10,
                ...tokens.type.xs, color: pal.text,
              }}>
                <Stack gap={4}>
                  {item.hidden.map((h, j) => (
                    <div key={j} style={{ color: pal.textSecondary }}>{h.label}</div>
                  ))}
                </Stack>
              </div>
            </div>
          );
        }
        return (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            {sep}
            <span onClick={item.onClick} style={{
              ...tokens.type.sm, color: isLast ? pal.text : pal.textTertiary,
              fontWeight: isLast ? tokens.weight.medium : tokens.weight.regular,
              cursor: item.onClick ? "pointer" : "default",
              transition: `color ${motion.normal} ${motion.easeInOut}`,
            }}>{item.label}</span>
          </div>
        );
      })}
    </nav>
  );
}

function HoverCard({ trigger, children, theme: tp }) {
  const ctx = useThemeContext(); const theme = tp || ctx; const pal = usePal(theme);
  const [show, setShow] = useState(false);
  return (
    <div style={{ position: "relative", display: "inline-flex" }}
      onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
      {trigger}
      <div style={{
        position: "absolute", top: "100%", left: 0, marginTop: 8, zIndex: 100,
        background: theme === "dark" ? "rgba(30,30,30,0.95)" : "rgba(255,255,255,0.95)",
        backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)",
        border: `1px solid ${pal.borderSubtle}`, borderRadius: tokens.radius.md,
        padding: 16, minWidth: 240, boxShadow: `0 8px 24px ${pal.shadowLg}`,
        opacity: show ? 1 : 0, transform: show ? "translateY(0)" : "translateY(-4px)",
        pointerEvents: show ? "auto" : "none",
        transition: `opacity ${motion.normal} ${motion.easeOut}, transform ${motion.normal} ${motion.emphasized}`,
      }}>{children}</div>
    </div>
  );
}

function ChevronIcon({ size = 12, direction = "right", style }) {
  const rot = { right: 0, down: 90, left: 180, up: -90 }[direction] ?? 0;
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none"
      stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"
      style={{ display: "inline-block", flexShrink: 0, transform: `rotate(${rot}deg)`, transition: `transform ${motion.normal} ${motion.easeInOut}`, ...style }}>
      <polyline points="6,3 11,8 6,13" />
    </svg>
  );
}

function InputOTP({ length = 6, value = "", onChange, theme: tp }) {
  const ctx = useThemeContext(); const theme = tp || ctx; const pal = usePal(theme);
  const refs = useRef([]);
  const digits = value.split("").concat(Array(length - value.length).fill(""));
  const allFilled = value.length === length;
  const handleChange = (i, v) => {
    if (v.length > 1) v = v[v.length - 1];
    const arr = [...digits]; arr[i] = v;
    const next = arr.join("").slice(0, length);
    onChange?.(next);
    if (v && i < length - 1) refs.current[i + 1]?.focus();
  };
  const handleKey = (i, e) => { if (e.key === "Backspace" && !digits[i] && i > 0) refs.current[i - 1]?.focus(); };
  return (
    <div style={{ display: "flex", gap: 8 }}>
      {digits.map((d, i) => (
        <input key={i} ref={el => refs.current[i] = el} value={d}
          onChange={(e) => handleChange(i, e.target.value)} onKeyDown={(e) => handleKey(i, e)}
          maxLength={2} style={{
            ...interactiveBase, width: 40, height: 48, textAlign: "center",
            ...tokens.type.lg, fontWeight: tokens.weight.semibold, fontFamily: tokens.font.mono,
            color: pal.text, background: pal.bgInput, borderRadius: tokens.radius.md,
            border: `1.5px solid ${allFilled ? pal.borderFocus : d ? pal.border : "transparent"}`,
            outline: "none", transition: `border-color ${motion.normal} ${motion.easeInOut}`,
          }} />
      ))}
    </div>
  );
}

function Kbd({ children, theme: tp }) {
  const ctx = useThemeContext(); const theme = tp || ctx; const pal = usePal(theme);
  return (
    <kbd style={{
      display: "inline-flex", alignItems: "center", justifyContent: "center",
      ...tokens.type.xs, fontFamily: tokens.font.mono, fontWeight: tokens.weight.medium,
      color: pal.textSecondary, background: pal.bgSubtle,
      border: `1px solid ${pal.borderSubtle}`, borderRadius: tokens.radius.xs,
      padding: "2px 6px", minWidth: 20, lineHeight: 1.4,
      boxShadow: `0 1px 0 ${pal.border}`,
      transition: `all ${motion.smooth} ${motion.easeInOut}`,
    }}>{children}</kbd>
  );
}

function EmptyState({ icon, title, description, action, theme: tp }) {
  const ctx = useThemeContext(); const theme = tp || ctx; const pal = usePal(theme);
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: 40, textAlign: "center" }}>
      {icon && <div style={{ fontSize: 32, color: pal.textMuted, marginBottom: 16, transition: `color ${motion.smooth} ${motion.easeInOut}` }}>{icon}</div>}
      {title && <div style={{ ...tokens.type.base, fontWeight: tokens.weight.semibold, color: pal.text, marginBottom: 4, fontFamily: tokens.font.sans, transition: `color ${motion.smooth} ${motion.easeInOut}` }}>{title}</div>}
      {description && <div style={{ ...tokens.type.sm, color: pal.textTertiary, maxWidth: 280, lineHeight: 1.6, fontFamily: tokens.font.sans, transition: `color ${motion.smooth} ${motion.easeInOut}` }}>{description}</div>}
      {action && <div style={{ marginTop: 16 }}>{action}</div>}
    </div>
  );
}

function AlertBanner({ title, description, variant = "default", theme: tp }) {
  const ctx = useThemeContext(); const theme = tp || ctx; const pal = usePal(theme);
  const styles = {
    default: { bg: pal.bgSubtle, border: pal.border, icon: "ℹ", color: pal.text },
    success: { bg: pal.successBg, border: pal.success, icon: "✓", color: pal.success },
    warning: { bg: pal.warningBg, border: pal.warning, icon: "⚠", color: pal.warning },
    danger: { bg: pal.dangerBg, border: pal.danger, icon: "✕", color: pal.danger },
  }[variant] || { bg: pal.bgSubtle, border: pal.border, icon: "ℹ", color: pal.text };
  return (
    <div style={{
      display: "flex", gap: 12, padding: "12px 16px", borderRadius: tokens.radius.md,
      background: styles.bg, border: `1px solid ${styles.border}`,
      transition: `all ${motion.smooth} ${motion.easeInOut}`,
    }}>
      <span style={{ fontSize: 14, color: styles.color, flexShrink: 0, marginTop: 1 }}>{styles.icon}</span>
      <div>
        {title && <div style={{ ...tokens.type.sm, fontWeight: tokens.weight.semibold, color: pal.text, fontFamily: tokens.font.sans, transition: `color ${motion.smooth} ${motion.easeInOut}` }}>{title}</div>}
        {description && <div style={{ ...tokens.type.sm, color: pal.textSecondary, marginTop: 2, lineHeight: 1.5, fontFamily: tokens.font.sans, transition: `color ${motion.smooth} ${motion.easeInOut}` }}>{description}</div>}
      </div>
    </div>
  );
}

function DropdownMenu({ trigger, items, theme: tp }) {
  const ctx = useThemeContext(); const theme = tp || ctx; const pal = usePal(theme);
  const [open, setOpen] = useState(false);
  const [hoverIdx, setHoverIdx] = useState(-1);
  return (
    <div style={{ position: "relative", display: "inline-flex" }}>
      <div onClick={() => setOpen(!open)}>{trigger}</div>
      {open && <div onClick={() => setOpen(false)} style={{ position: "fixed", inset: 0, zIndex: 9999 }} />}
      <div style={{
        position: "absolute", top: "100%", right: 0, marginTop: 6, zIndex: 10000,
        background: theme === "dark" ? "rgba(30,30,30,0.95)" : "rgba(255,255,255,0.95)",
        backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)",
        border: `1px solid ${pal.borderSubtle}`, borderRadius: tokens.radius.md,
        padding: 4, minWidth: 180, boxShadow: `0 8px 24px ${pal.shadowLg}`,
        opacity: open ? 1 : 0, transform: open ? "translateY(0) scale(1)" : "translateY(-4px) scale(0.97)",
        pointerEvents: open ? "auto" : "none",
        transition: `opacity ${motion.fast} ${motion.easeOut}, transform ${motion.normal} ${motion.emphasized}`,
      }}>
        {items.map((item, i) => item.separator ? (
          <div key={i} style={{ height: 1, background: pal.borderSubtle, margin: "4px 0" }} />
        ) : (
          <button key={i} onClick={() => { item.onClick?.(); setOpen(false); }}
            onMouseEnter={() => setHoverIdx(i)} onMouseLeave={() => setHoverIdx(-1)}
            style={{
              ...interactiveBase, width: "100%", textAlign: "left", ...tokens.type.sm,
              padding: "8px 12px", borderRadius: tokens.radius.sm,
              color: item.danger ? pal.danger : pal.text,
              background: hoverIdx === i ? pal.bgSubtle : "transparent",
              display: "flex", alignItems: "center", gap: 8,
              transition: `background ${motion.normal} ${motion.easeInOut}, color ${motion.normal} ${motion.easeInOut}`,
            }}>
            {item.icon && <span style={{ fontSize: 13, color: item.danger ? pal.danger : pal.textTertiary }}>{item.icon}</span>}
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function ScrollArea({ children, maxHeight = 200, theme: tp }) {
  const ctx = useThemeContext(); const theme = tp || ctx; const pal = usePal(theme);
  return (
    <div style={{
      maxHeight, overflow: "auto", borderRadius: tokens.radius.sm,
      scrollbarWidth: "thin", scrollbarColor: `${pal.bgMuted} transparent`,
    }}>{children}</div>
  );
}

// ─── GEIST-INSPIRED ADDITIONS ─────────────────────────────────
// Atomic components borrowed in spirit from Vercel's Geist system,
// rebuilt in the kit's idiom: Choicebox, SearchInput, SplitButton,
// StatusDot, MiddleTruncate, Snippet, FileTree, BrowserFrame.

function Choicebox({ options, value, onChange, multiple, theme: tp }) {
  const ctx = useThemeContext(); const theme = tp || ctx; const pal = usePal(theme);
  const isSelected = (id) => multiple ? (value || []).includes(id) : value === id;
  const pick = (id) => {
    if (!multiple) return onChange(id);
    const set = new Set(value || []);
    set.has(id) ? set.delete(id) : set.add(id);
    onChange([...set]);
  };
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {options.map(opt => {
        const selected = isSelected(opt.id);
        return (
          <button key={opt.id} onClick={() => pick(opt.id)} style={{
            ...interactiveBase, display: "flex", alignItems: "flex-start", gap: 12,
            padding: "12px 14px", borderRadius: tokens.radius.md, textAlign: "left",
            background: selected ? pal.accentBg : pal.bgSubtle,
            border: `1px solid ${selected ? pal.accent : "transparent"}`,
            transition: `all ${motion.normal} ${motion.easeInOut}`,
          }}>
            <span style={{
              width: 16, height: 16, borderRadius: multiple ? 5 : 8, flexShrink: 0, marginTop: 1,
              border: `1.5px solid ${selected ? pal.accent : pal.textMuted}`,
              background: selected ? pal.accent : "transparent",
              display: "flex", alignItems: "center", justifyContent: "center",
              transition: `all ${motion.normal} ${motion.easeInOut}`,
            }}>
              {selected && (multiple ? (
                <svg width="9" height="9" viewBox="0 0 10 10" fill="none">
                  <path d="M1.5 5.5 4 8 8.5 2.5" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ) : (
                <span style={{ width: 6, height: 6, borderRadius: 3, background: "#fff", animation: `halaska-scale-in 0.2s ${motion.easeOut} both` }} />
              ))}
            </span>
            <span style={{ flex: 1, minWidth: 0 }}>
              <span style={{ ...tokens.type.sm, fontWeight: tokens.weight.medium, color: pal.text, display: "block", transition: `color ${motion.smooth} ${motion.easeInOut}` }}>{opt.title}</span>
              {opt.description && (
                <span style={{ ...tokens.type.xs, color: pal.textSecondary, display: "block", marginTop: 2, lineHeight: 1.5, transition: `color ${motion.smooth} ${motion.easeInOut}` }}>{opt.description}</span>
              )}
            </span>
            {opt.meta && (
              <span style={{ ...tokens.type.xs, color: pal.textTertiary, fontFamily: tokens.font.mono, flexShrink: 0, transition: `color ${motion.smooth} ${motion.easeInOut}` }}>{opt.meta}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}

function SearchInput({ value, onChange, placeholder = "Search…", shortcut = "⌘K", theme: tp, style: sp }) {
  const ctx = useThemeContext(); const theme = tp || ctx; const pal = usePal(theme);
  const [focus, setFocus] = useState(false);
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 8, padding: "0 10px",
      height: 36, borderRadius: tokens.radius.sm, background: pal.bgInput,
      border: `1px solid ${focus ? pal.borderFocus : pal.borderInput}`,
      transition: `all ${motion.normal} ${motion.easeInOut}`, ...sp,
    }}>
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={pal.textTertiary} strokeWidth="1.5" strokeLinecap="round" style={{ flexShrink: 0, transition: `stroke ${motion.smooth} ${motion.easeInOut}` }}>
        <circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" />
      </svg>
      <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
        style={{
          flex: 1, minWidth: 0, border: "none", outline: "none", background: "transparent",
          ...tokens.type.sm, color: pal.text, fontFamily: tokens.font.sans,
        }} />
      {value ? (
        <button onClick={() => onChange("")} aria-label="Clear search" style={{
          ...interactiveBase, width: 16, height: 16, borderRadius: 8, padding: 0, flexShrink: 0,
          background: pal.bgMuted, color: pal.textSecondary, fontSize: 9, lineHeight: 1,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>✕</button>
      ) : shortcut ? (
        <Kbd theme={theme}>{shortcut}</Kbd>
      ) : null}
    </div>
  );
}

function SplitButton({ children, onClick, items = [], variant = "primary", size = "md", theme: tp }) {
  const ctx = useThemeContext(); const theme = tp || ctx; const pal = usePal(theme);
  const [open, setOpen] = useState(false);
  return (
    <div style={{ position: "relative", display: "inline-flex" }}>
      <div style={{ display: "inline-flex" }}>
        <Button theme={theme} variant={variant} size={size} onClick={onClick}
          style={{ borderTopRightRadius: 0, borderBottomRightRadius: 0 }}>{children}</Button>
        <Button theme={theme} variant={variant} size={size} onClick={() => setOpen(o => !o)}
          style={{
            borderTopLeftRadius: 0, borderBottomLeftRadius: 0,
            padding: "0 10px", marginLeft: 1,
          }}>
          <ChevronIcon size={11} direction={open ? "up" : "down"} />
        </Button>
      </div>
      {open && (
        <>
          <div onClick={() => setOpen(false)} style={{ position: "fixed", inset: 0, zIndex: 90 }} />
          <div style={{
            position: "absolute", top: "calc(100% + 6px)", right: 0, zIndex: 91, minWidth: 200,
            background: theme === "dark" ? "rgba(30,30,30,0.95)" : "rgba(255,255,255,0.95)",
            backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)",
            border: `1px solid ${pal.borderSubtle}`, borderRadius: tokens.radius.md,
            padding: 4, boxShadow: `0 8px 24px ${pal.shadowLg}`,
            animation: `halaska-scale-in 0.15s ${motion.easeOut} both`, transformOrigin: "top right",
          }}>
            {items.map((item, i) => (
              <SplitButtonItem key={i} item={item} theme={theme} onPick={() => { setOpen(false); item.onClick?.(); }} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function SplitButtonItem({ item, onPick, theme }) {
  const pal = usePal(theme);
  const [hover, setHover] = useState(false);
  return (
    <button onClick={onPick}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        ...interactiveBase, display: "flex", alignItems: "center", justifyContent: "space-between",
        gap: 12, width: "100%", padding: "8px 10px", borderRadius: tokens.radius.sm, textAlign: "left",
        ...tokens.type.sm, color: item.danger ? pal.danger : hover ? pal.text : pal.textSecondary,
        background: hover ? pal.bgSubtle : "transparent",
      }}>
      {item.label}
      {item.meta && <span style={{ ...tokens.type.xs, color: pal.textTertiary, fontFamily: tokens.font.mono }}>{item.meta}</span>}
    </button>
  );
}

function StatusDot({ status = "online", pulse, size = 8, theme: tp }) {
  const ctx = useThemeContext(); const theme = tp || ctx; const pal = usePal(theme);
  const color = {
    online: pal.success, busy: pal.warning, error: pal.danger,
    offline: pal.textMuted, accent: pal.accent,
  }[status] || pal.textMuted;
  return (
    <span style={{ position: "relative", display: "inline-flex", width: size, height: size, flexShrink: 0 }}>
      {pulse && (
        <span style={{
          position: "absolute", inset: 0, borderRadius: size / 2, background: color,
          animation: "halaska-live-pulse 2s ease-out infinite",
        }} />
      )}
      <span style={{ position: "relative", width: size, height: size, borderRadius: size / 2, background: color, transition: `background ${motion.smooth} ${motion.easeInOut}` }} />
    </span>
  );
}

// Keeps the start and end of long identifiers (wallet addresses, hashes,
// deployment ids) visible while the middle ellipsizes responsively.
function MiddleTruncate({ text, tail = 6, mono = true, theme: tp, style: sp }) {
  const ctx = useThemeContext(); const theme = tp || ctx; const pal = usePal(theme);
  const head = text.slice(0, Math.max(0, text.length - tail));
  const end = text.slice(Math.max(0, text.length - tail));
  return (
    <span style={{
      display: "inline-flex", minWidth: 0, maxWidth: "100%", whiteSpace: "nowrap",
      ...tokens.type.sm, color: pal.textSecondary,
      fontFamily: mono ? tokens.font.mono : tokens.font.sans,
      transition: `color ${motion.smooth} ${motion.easeInOut}`, ...sp,
    }}>
      <span style={{ overflow: "hidden", textOverflow: "ellipsis", minWidth: 0 }}>{head}</span>
      <span style={{ flexShrink: 0 }}>{end}</span>
    </span>
  );
}

function Snippet({ text, prompt = "$", theme: tp, style: sp }) {
  const ctx = useThemeContext(); const theme = tp || ctx; const pal = usePal(theme);
  const [copied, setCopied] = useState(false);
  const timer = useRef(null);
  useEffect(() => () => clearTimeout(timer.current), []);
  const copy = () => {
    try { navigator.clipboard?.writeText(text); } catch (e) { /* no-op in sandboxed frames */ }
    setCopied(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), 1500);
  };
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 10, padding: "10px 8px 10px 14px",
      borderRadius: tokens.radius.sm, background: pal.bgSubtle,
      border: `1px solid ${pal.borderSubtle}`,
      transition: `all ${motion.smooth} ${motion.easeInOut}`, ...sp,
    }}>
      <span style={{ ...tokens.type.sm, fontFamily: tokens.font.mono, color: pal.textTertiary, flexShrink: 0, userSelect: "none", transition: `color ${motion.smooth} ${motion.easeInOut}` }}>{prompt}</span>
      <span style={{ flex: 1, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", ...tokens.type.sm, fontFamily: tokens.font.mono, color: pal.text, transition: `color ${motion.smooth} ${motion.easeInOut}` }}>{text}</span>
      <button onClick={copy} aria-label="Copy command" style={{
        ...interactiveBase, width: 26, height: 26, borderRadius: tokens.radius.xs, padding: 0, flexShrink: 0,
        display: "flex", alignItems: "center", justifyContent: "center",
        background: "transparent", color: copied ? pal.success : pal.textTertiary,
      }}>
        {copied ? (
          <svg width="12" height="12" viewBox="0 0 14 14" fill="none"><path d="M2.5 7.5 5.5 10.5 11.5 3.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
        ) : (
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="12" height="12" rx="2" /><path d="M5 15V5a2 2 0 0 1 2-2h10" /></svg>
        )}
      </button>
    </div>
  );
}

// ── File tree ──

function FileTreeFolderIcon({ open, color }) {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
      {open
        ? <path d="m6 14 1.5-2.9A2 2 0 0 1 9.24 10H20a2 2 0 0 1 1.94 2.5l-1.54 6a2 2 0 0 1-1.95 1.5H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H18a2 2 0 0 1 2 2v2" />
        : <path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z" />}
    </svg>
  );
}

function FileTreeFileIcon({ color }) {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" /><path d="M14 2v4a2 2 0 0 0 2 2h4" />
    </svg>
  );
}

function FileTreeNode({ node, depth, theme }) {
  const pal = usePal(theme);
  const [open, setOpen] = useState(node.defaultOpen ?? true);
  const [hover, setHover] = useState(false);
  const isFolder = !!node.children;
  return (
    <div>
      <button
        onClick={() => isFolder && setOpen(o => !o)}
        onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
        style={{
          ...interactiveBase, display: "flex", alignItems: "center", gap: 7, width: "100%",
          padding: "4px 8px", paddingLeft: 8 + depth * 16, borderRadius: tokens.radius.xs,
          background: hover ? pal.bgSubtle : "transparent", textAlign: "left",
          cursor: isFolder ? "pointer" : "default",
        }}>
        {isFolder ? (
          <ChevronIcon size={9} direction={open ? "down" : "right"} style={{ color: pal.textTertiary, flexShrink: 0 }} />
        ) : (
          <span style={{ width: 9, flexShrink: 0 }} />
        )}
        {isFolder
          ? <FileTreeFolderIcon open={open} color={pal.textSecondary} />
          : <FileTreeFileIcon color={pal.textTertiary} />}
        <span style={{ ...tokens.type.sm, fontFamily: tokens.font.mono, color: isFolder ? pal.text : pal.textSecondary, transition: `color ${motion.smooth} ${motion.easeInOut}`, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {node.name}
        </span>
        {node.badge && (
          <span style={{ ...tokens.type.xxs, fontFamily: tokens.font.mono, color: pal.accentText, background: pal.accentBg, padding: "1px 6px", borderRadius: tokens.radius.pill, marginLeft: "auto", flexShrink: 0, transition: `all ${motion.smooth} ${motion.easeInOut}` }}>{node.badge}</span>
        )}
      </button>
      {isFolder && (
        <div style={{
          overflow: "hidden", maxHeight: open ? node.children.length * 200 : 0, opacity: open ? 1 : 0,
          transition: `max-height 0.35s ${motion.emphasized}, opacity ${motion.normal} ${motion.easeInOut}`,
        }}>
          {node.children.map((child, i) => (
            <FileTreeNode key={child.name + i} node={child} depth={depth + 1} theme={theme} />
          ))}
        </div>
      )}
    </div>
  );
}

function FileTree({ data = [], theme: tp, style: sp }) {
  const ctx = useThemeContext(); const theme = tp || ctx;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 1, fontFamily: tokens.font.sans, ...sp }}>
      {data.map((node, i) => <FileTreeNode key={node.name + i} node={node} depth={0} theme={theme} />)}
    </div>
  );
}

// Browser chrome mockup — frame agent-built pages and live previews.
function BrowserFrame({ url = "localhost:3000", children, theme: tp, style: sp }) {
  const ctx = useThemeContext(); const theme = tp || ctx; const pal = usePal(theme);
  return (
    <div style={{
      borderRadius: tokens.radius.md, border: `1px solid ${pal.borderSubtle}`,
      background: pal.bgElevated, overflow: "hidden",
      transition: `all ${motion.smooth} ${motion.easeInOut}`, ...sp,
    }}>
      <div style={{
        display: "flex", alignItems: "center", gap: 10, padding: "9px 12px",
        borderBottom: `1px solid ${pal.borderSubtle}`, background: pal.bgSubtle,
        transition: `all ${motion.smooth} ${motion.easeInOut}`,
      }}>
        <span style={{ display: "flex", gap: 5, flexShrink: 0 }}>
          {[0, 1, 2].map(i => (
            <span key={i} style={{ width: 8, height: 8, borderRadius: 4, background: pal.bgMuted, transition: `background ${motion.smooth} ${motion.easeInOut}` }} />
          ))}
        </span>
        <span style={{
          flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
          padding: "3px 10px", borderRadius: tokens.radius.pill, background: pal.bgInput,
          ...tokens.type.xs, fontFamily: tokens.font.mono, color: pal.textSecondary,
          maxWidth: 260, margin: "0 auto", overflow: "hidden",
          transition: `all ${motion.smooth} ${motion.easeInOut}`,
        }}>
          <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
          <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{url}</span>
        </span>
        <span style={{ width: 34, flexShrink: 0 }} />
      </div>
      <div style={{ padding: 16 }}>{children}</div>
    </div>
  );
}

// ─── DESIGN HEURISTICS ────────────────────────────────────────
// Nielsen's ten usability heuristics — the most-cited rules in
// interface design — restated for products where an agent does the
// work. Rendered as its own section after the component showcase.

const DESIGN_HEURISTICS = [
  {
    title: "Visibility of system status",
    body: "An agent that goes quiet reads as broken. Stream the thinking, show tool calls as they run, and keep a glanceable status for everything happening off-screen.",
  },
  {
    title: "Match the real world",
    body: "Plans, permissions, and results in the user's language — \u201cClose the losing ARB short,\u201d not tool names and JSON. Translate the machinery, don't expose it.",
  },
  {
    title: "User control and freedom",
    body: "Pause, redirect, and undo beat confirmation dialogs. Delegating to an agent should never cost you the emergency exit.",
  },
  {
    title: "Consistency and standards",
    body: "One status language everywhere — the same state looks the same in the thread, the board, and the log. Borrow conventions people already know.",
  },
  {
    title: "Error prevention",
    body: "Consent before consequence: plan previews, approval gates, and autonomy caps catch mistakes upstream — styled as normal states, never as alarms.",
  },
  {
    title: "Recognition over recall",
    body: "Never make people reconstruct what happened from a scrolling transcript. Receipts, boards, and digests keep the state of work visible.",
  },
  {
    title: "Flexibility and efficiency",
    body: "Autonomy is a dial, not a switch. New users watch and confirm; experts let the agent run — the same surface serves both without forking the product.",
  },
  {
    title: "Minimalist by default",
    body: "Focused, not sparse — every element earns its place. Collapse the machinery (traces, tool calls, sources) once it has done its job.",
  },
  {
    title: "Recover from errors gracefully",
    body: "When the agent is wrong: acknowledge in plain words, show the correction it made, offer a human. What went wrong, why, what's next — no codes, no cheer.",
  },
  {
    title: "Capability discovery over documentation",
    body: "Nobody reads the manual for an agent. Empty states that show what it can do, suggestions in context, and scope declared up front do the teaching.",
  },
];

function HeuristicsSection({ theme }) {
  const pal = usePal(theme);
  return (
    <div style={{ paddingLeft: 4, fontFamily: tokens.font.sans }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 8 }}>
        <Heading level={3} theme={theme} style={{ margin: 0 }}>Design Heuristics</Heading>
      </div>
      <Text size="sm" theme={theme} style={{ color: pal.textSecondary, display: "block", maxWidth: 560, marginBottom: 32 }}>
        The ten classic usability heuristics, restated for products where an agent does the work. Every pattern in the kit is an answer to one of these.
      </Text>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "28px 40px" }}>
        {DESIGN_HEURISTICS.map((p, i) => (
          <div key={p.title}>
            <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 6 }}>
              <span style={{ ...tokens.type.xs, fontFamily: tokens.font.mono, color: pal.accent, transition: `color ${motion.smooth} ${motion.easeInOut}` }}>
                {String(i + 1).padStart(2, "0")}
              </span>
              <Text size="base" weight="semibold" theme={theme}>{p.title}</Text>
            </div>
            <Text size="sm" theme={theme} style={{ color: pal.textSecondary, display: "block", lineHeight: 1.65, paddingLeft: 26 }}>
              {p.body}
            </Text>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── 11. SHOWCASE WRAPPERS ────────────────────────────────────

function ShowcaseCard({ children, controls, label, theme = "light", height, align = "center", style: sp }) {
  const pal = usePal(theme);
  const justify = align === "top" ? "flex-start" : "center";
  return (
    <ThemeProvider theme={theme}>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {label && <span style={{ ...tokens.type.base, color: theme === "dark" ? "#555" : "#bbb", fontFamily: tokens.font.sans, paddingLeft: 8 }}>{label}</span>}
        <div style={{
          background: theme === "dark" ? "rgba(26,26,26,0.85)" : "rgba(250,250,250,0.75)",
          backdropFilter: "blur(40px)", WebkitBackdropFilter: "blur(40px)",
          borderRadius: tokens.radius.xl,
          border: theme === "dark" ? "1px solid rgba(255,255,255,0.06)" : "1px solid rgba(0,0,0,0.04)",
          padding: controls ? "88px 88px 136px" : 88,
          minHeight: height || 532, display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: justify, position: "relative",
          transition: `all ${motion.smooth} ${motion.easeInOut}`, overflow: "hidden", ...sp,
        }}>
          <div style={{ flex: align === "top" ? "0 0 auto" : 1, display: "flex", alignItems: align === "top" ? "flex-start" : "center", justifyContent: "center", width: "100%" }}>
            {children}
          </div>
          {controls && (
            <div style={{ position: "absolute", bottom: 32, left: "50%", transform: "translateX(-50%)", display: "flex", alignItems: "center", gap: 12 }}>
              {controls}
            </div>
          )}
        </div>
      </div>
    </ThemeProvider>
  );
}

const STUDIO_URL = "https://halaskastudio.com";

// Quiet inline link for "Halaska Studio" mentions — inherits the surrounding
// text color, underlines subtly, and brightens on hover.
function StudioLink({ theme, style: sp }) {
  const isDark = theme === "dark";
  const [hover, setHover] = useState(false);
  return (
    <a href={STUDIO_URL} target="_blank" rel="noreferrer"
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        color: hover ? (isDark ? "#d8d8d8" : "#3d3d3d") : "inherit",
        textDecoration: "underline", textUnderlineOffset: 3,
        textDecorationColor: hover ? "currentColor" : (isDark ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.2)"),
        transition: "color 0.25s ease, text-decoration-color 0.25s ease",
        ...sp,
      }}>Halaska Studio</a>
  );
}

// Shared clipboard action behind every "Copy Install Prompt" button.
function useCopyInstallPrompt() {
  const [copied, setCopied] = useState(false);
  const timer = useRef(null);
  useEffect(() => () => clearTimeout(timer.current), []);
  const copy = useCallback(() => {
    const done = () => {
      setCopied(true);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 2000);
    };
    const fallbackCopy = () => {
      const ta = document.createElement("textarea");
      ta.value = INSTALL_PROMPT;
      ta.style.position = "fixed"; ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand("copy"); done(); } catch (e) { /* clipboard unavailable */ }
      document.body.removeChild(ta);
    };
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(INSTALL_PROMPT).then(done).catch(fallbackCopy);
    } else {
      fallbackCopy();
    }
  }, []);
  return { copied, copy };
}

function ShowcasePage({ children, title, subtitle, pageTheme = "light" }) {
  const isDark = pageTheme === "dark";
  const { copied: installCopied, copy: copyInstallPrompt } = useCopyInstallPrompt();
  const bg = isDark
    ? "linear-gradient(180deg, #111 0%, #0a0a0a 50%, #111 100%)"
    : "linear-gradient(180deg, #ffffff 0%, #f5f5f5 50%, #ffffff 100%)";
  const textColor = isDark ? "#d8d8d8" : "#3d3d3d";
  const dimColor = isDark ? "#666" : "#999";
  const mutedColor = isDark ? "#555" : "#aaa";
  const t = (prop) => `${prop} 0.35s ease`;
  return (
    <div style={{ minHeight: "100vh", background: bg, padding: "64px 32px 120px", fontFamily: tokens.font.sans, transition: "background 0.5s ease" }}>
      <div style={{ maxWidth: 784, margin: "0 auto" }}>
        {/* Hero */}
        {title && (
          <div style={{ marginBottom: 80, paddingLeft: 4 }}>
            <h1 style={{ ...tokens.type.xxxl, fontWeight: tokens.weight.bold, color: textColor, margin: 0, letterSpacing: "-0.02em", transition: t("color") }}>{title}</h1>
            <p style={{ ...tokens.type.md, color: dimColor, margin: "10px 0 0", transition: t("color") }}>by <StudioLink theme={pageTheme} /></p>

            {/* Two-column bio */}
            <div style={{ display: "flex", gap: 40, marginTop: 48 }}>
              <div style={{ flex: 1 }}>
                <h3 style={{ ...tokens.type.base, fontWeight: tokens.weight.semibold, color: textColor, margin: "0 0 8px", transition: t("color") }}>Built for AI products</h3>
                <p style={{ ...tokens.type.sm, color: dimColor, margin: 0, lineHeight: 1.65, transition: t("color") }}>
                  UX patterns and styled components for AI-native interfaces — agents, copilots, and chat. Built on shadcn/ui foundations, portable to any React project.</p>
                <div style={{ marginTop: 12 }}><LinkButton theme={pageTheme} size="sm" iconRight="→" onClick={() => (() => { const el = document.getElementById("how-to-use"); if (el) { const y = el.getBoundingClientRect().top + window.scrollY - 32; window.scrollTo({ top: y, behavior: "smooth" }); } })()}>More</LinkButton></div>
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{ ...tokens.type.base, fontWeight: tokens.weight.semibold, color: textColor, margin: "0 0 8px", transition: t("color") }}>How to Use</h3>
                <p style={{ ...tokens.type.sm, color: dimColor, margin: 0, lineHeight: 1.65, transition: t("color") }}>
                  Paste the kit into a Claude artifact to prototype with AI-ready patterns and components. Jump between sections with the bookmark rail on the left; theme and accent live in the bar below.</p>
                <div style={{ marginTop: 12, display: "flex", alignItems: "center", gap: 20 }}>
                  <LinkButton theme={pageTheme} size="sm" iconRight="→" onClick={() => (() => { const el = document.getElementById("how-to-use"); if (el) { const y = el.getBoundingClientRect().top + window.scrollY - 32; window.scrollTo({ top: y, behavior: "smooth" }); } })()}>More</LinkButton>
                  <LinkButton theme={pageTheme} size="sm" icon={installCopied ? "✓" : "⧉"} onClick={copyInstallPrompt}>
                    {installCopied ? "Copied — paste into Claude Code" : "Copy Install Prompt"}
                  </LinkButton>
                </div>
              </div>
            </div>
          </div>
        )}
        <div style={{ display: "flex", flexDirection: "column", gap: 48 }}>{children}</div>

        {/* How to Use (steps + about + FAQ merged) */}
        <div id="how-to-use" style={{ marginTop: 80, paddingLeft: 4 }}>
          <h2 style={{ ...tokens.type.xxl, fontWeight: tokens.weight.bold, color: textColor, margin: "0 0 16px", letterSpacing: "-0.02em", transition: t("color") }}>How to Use</h2>

          <p style={{ ...tokens.type.md, color: dimColor, margin: "0 0 12px", lineHeight: 1.7, transition: t("color") }}>
            Halaska Kit is a UX pattern and component library for AI products, built by Halaska Studio on shadcn/ui foundations — designed to make prototypes of agents, copilots, and AI workflows look and feel like real products, not generic output.
          </p>
          <p style={{ ...tokens.type.md, color: dimColor, margin: "0 0 32px", lineHeight: 1.7, transition: t("color") }}>
            The UX Patterns cover the moments every AI interface has to get right — thinking, streaming, approvals, tool activity, grounding. Every component uses Geist typography, Lucide icons at 1px stroke weight, Material Design 3 motion tokens, and an iOS-inspired radius system.
          </p>

          <h3 style={{ ...tokens.type.lg, fontWeight: tokens.weight.semibold, color: textColor, margin: "0 0 16px", transition: t("color") }}>Get started</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {[
              { step: "1", title: "Copy the kit", desc: "Paste the full halaska-kit-v1.3.jsx file into a new Claude artifact — or hit Copy Install Prompt in the bar below and paste it into Claude Code." },
              { step: "2", title: "Import components", desc: "Use any pattern or component — ThinkingTracePattern, Button, Card — directly; they're all self-contained with inline styles." },
              { step: "3", title: "Customize tokens", desc: "Edit the tokens object at the top to change colors, spacing, radius, and typography to match your brand." },
              { step: "4", title: "Ship or prototype", desc: "Use as a rapid prototype for client demos, or extract components into your production codebase." },
            ].map(s => (
              <div key={s.step} style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                <span style={{ ...tokens.type.sm, fontWeight: tokens.weight.semibold, color: isDark ? "#444" : "#ccc", fontFamily: tokens.font.mono, minWidth: 20, transition: t("color") }}>{s.step}.</span>
                <div>
                  <span style={{ ...tokens.type.base, fontWeight: tokens.weight.semibold, color: textColor, transition: t("color") }}>{s.title}</span>
                  <span style={{ ...tokens.type.base, color: dimColor, marginLeft: 8, transition: t("color") }}>{s.desc}</span>
                </div>
              </div>
            ))}
          </div>

          <h3 style={{ ...tokens.type.lg, fontWeight: tokens.weight.semibold, color: textColor, margin: "48px 0 20px", transition: t("color") }}>Frequently Asked Questions</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 20, paddingBottom: 40 }}>
            {[
              { q: "Does this work outside Claude artifacts?", a: "Yes. The components are standard React with inline styles — no build step required. Copy them into any React project." },
              { q: "Can I use my own colors?", a: "Edit tokens.light and tokens.dark at the top of the file, or use the color picker in the action bar to preview different accents." },
              { q: "Is this the same as shadcn/ui?", a: "It's built on the same foundations — Radix primitives, component patterns, token naming. But the visual styling, animations, and components are custom." },
              { q: "Can I use this commercially?", a: "Yes. Halaska Kit is designed for professional prototyping and production use." },
              { q: "What font does it use?", a: "Geist and Geist Mono from Vercel, loaded via Google Fonts CDN. Lucide icons at 1px stroke weight." },
            ].map((item, i) => (
              <div key={i}>
                <div style={{ ...tokens.type.base, fontWeight: tokens.weight.semibold, color: textColor, marginBottom: 4, transition: t("color") }}>{item.q}</div>
                <div style={{ ...tokens.type.sm, color: dimColor, lineHeight: 1.65, transition: t("color") }}>{item.a}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── 12. DEMOS ────────────────────────────────────────────────

function DemoButtons({ theme }) {
  const [loading, setLoading] = useState(false);
  return (
    <ShowcaseCard theme={theme} label="Buttons">
      <Stack gap={32} align="center">
        <Stack direction="row" gap={12} wrap>
          <Button theme={theme} variant="primary">Execute trade</Button>
          <Button theme={theme} variant="secondary">Cancel order</Button>
          <Button theme={theme} variant="outline">Set alert</Button>
          <Button theme={theme} variant="ghost">Dismiss</Button>
        </Stack>
        <Stack direction="row" gap={12} wrap>
          <Button theme={theme} variant="accent">Deploy agent</Button>
          <Button theme={theme} variant="danger">Liquidate</Button>
          <Button theme={theme} variant="primary" disabled>Paused</Button>
          <Button theme={theme} variant="primary" loading={loading} onClick={() => { setLoading(true); setTimeout(() => setLoading(false), 2000); }}>
            {loading ? "Syncing" : "Sync wallet"}
          </Button>
        </Stack>
        <Stack direction="row" gap={12} wrap>
          <Button theme={theme} variant="primary" size="sm">Swap</Button>
          <Button theme={theme} variant="primary" size="md">Bridge</Button>
          <Button theme={theme} variant="primary" size="lg">Stake SOL</Button>
          <Button theme={theme} variant="primary" size="xl">Connect wallet</Button>
        </Stack>
        <Stack direction="row" gap={12} wrap>
          <Button theme={theme} variant="primary" icon="✦">AI rebalance</Button>
          <Button theme={theme} variant="outline" iconRight="→">View position</Button>
          <IconButton theme={theme} icon="⚙" variant="secondary" />
          <IconButton theme={theme} icon="✕" variant="ghost" />
        </Stack>
        <Stack direction="row" gap={12} wrap align="center">
          <SplitButton theme={theme} variant="primary"
            items={[
              { label: "Run on paper trading", meta: "safe" },
              { label: "Run live" },
              { label: "Schedule for next epoch", meta: "22m" },
            ]}>Run backtest</SplitButton>
          <SplitButton theme={theme} variant="secondary"
            items={[
              { label: "Export as CSV" },
              { label: "Export as JSON" },
              { label: "Delete report", danger: true },
            ]}>Export</SplitButton>
        </Stack>
        <Stack direction="row" gap={24} wrap>
          <LinkButton theme={theme}>View strategy</LinkButton>
          <LinkButton theme={theme} iconRight="→">API docs</LinkButton>
          <LinkButton theme={theme} size="sm">Risk disclaimer</LinkButton>
        </Stack>
      </Stack>
    </ShowcaseCard>
  );
}

function DemoTypography({ theme }) {
  return (
    <ShowcaseCard theme={theme} label="Typography · Geist" height={480}>
      <Stack gap={24} style={{ width: 360 }}>
        <Heading level={1} theme={theme}>Portfolio overview</Heading>
        <Heading level={2} theme={theme}>Active strategies</Heading>
        <Heading level={3} theme={theme}>Agent performance</Heading>
        <Heading level={4} theme={theme}>Trade history</Heading>
        <Text size="md" theme={theme} as="p" style={{ margin: 0 }}>Your agent executed 14 trades across 3 pairs in the last 24 hours, capturing a net yield of 2.4% against a target of 1.8%.</Text>
        <Text size="base" secondary theme={theme} as="p" style={{ margin: 0 }}>Last rebalanced 4m ago · Next scheduled epoch in 22m</Text>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <Code theme={theme}>0x7a3f...e9b2</Code>
          <Text size="sm" mono theme={theme}>SOL/USDC</Text>
          <Caption theme={theme}>Slippage 0.3%</Caption>
        </div>
      </Stack>
    </ShowcaseCard>
  );
}

function DemoFormInputs({ theme }) {
  const [wallet, setWallet] = useState("");
  const [amount, setAmount] = useState("2,500.00");
  const [memo, setMemo] = useState("");
  const [chain, setChain] = useState("");
  return (
    <ShowcaseCard theme={theme} label="Form Inputs" height={560}>
      <Stack gap={24} style={{ width: 320 }}>
        <TextInput theme={theme} label="Wallet address" placeholder="0x..." value={wallet} onChange={setWallet} icon="◆" />
        <TextInput theme={theme} label="Amount (USDC)" value={amount} onChange={setAmount} type="text" caption="Available balance: 12,840.00 USDC" />
        <TextInput theme={theme} label="RPC endpoint" placeholder="https://" value="" onChange={() => {}} error="Connection timed out" />
        <Select theme={theme} label="Network" placeholder="Select chain..." value={chain} onChange={setChain}
          options={[{ value: "solana", label: "Solana" }, { value: "ethereum", label: "Ethereum" }, { value: "base", label: "Base" }, { value: "arbitrum", label: "Arbitrum" }]} />
        <TextArea theme={theme} label="Strategy notes" placeholder="Describe your trading parameters..." value={memo} onChange={setMemo} rows={3} caption="Visible to your agent only" />
      </Stack>
    </ShowcaseCard>
  );
}

function DemoTogglesSelections({ theme }) {
  const [sw1, setSw1] = useState(true);
  const [sw2, setSw2] = useState(false);
  const [c1, setC1] = useState(true);
  const [c2, setC2] = useState(false);
  const [c3, setC3] = useState(true);
  const [radio, setRadio] = useState("moderate");
  const [tab, setTab] = useState("Spot");
  return (
    <ShowcaseCard theme={theme} label="Toggles & Selections" height={580}>
      <Stack gap={24} style={{ width: 320 }}>
        <Card theme={theme} padding={16}>
          <CardHeader title="Agent settings" theme={theme} />
          <Stack gap={12}>
            <SwitchToggle checked={sw1} onChange={setSw1} label="Auto-rebalance" theme={theme} />
            <SwitchToggle checked={sw2} onChange={setSw2} label="Stop-loss protection" theme={theme} />
          </Stack>
        </Card>
        <Card theme={theme} padding={16}>
          <CardHeader title="Notifications" theme={theme} />
          <Stack gap={12}>
            <Checkbox checked={c1} onChange={setC1} label="Trade executions" theme={theme} />
            <Checkbox checked={c2} onChange={setC2} label="Liquidation warnings" theme={theme} />
            <Checkbox checked={c3} onChange={setC3} label="Weekly P&L report" theme={theme} />
          </Stack>
        </Card>
        <Card theme={theme} padding={16}>
          <CardHeader title="Risk tolerance" theme={theme} />
          <RadioGroup theme={theme} options={[{ value: "conservative", label: "Conservative" }, { value: "moderate", label: "Moderate" }, { value: "aggressive", label: "Aggressive" }]} value={radio} onChange={setRadio} />
        </Card>
        <SegmentedControl theme={theme} options={["Spot", "Perps", "Yield"]} value={tab} onChange={setTab} />
      </Stack>
    </ShowcaseCard>
  );
}

function DemoFeedbackStatus({ theme }) {
  const pal = usePal(theme);
  return (
    <ShowcaseCard theme={theme} label="Feedback & Status" height={540}>
      <Stack gap={24} style={{ width: 340 }}>
        <Stack direction="row" gap={12} wrap>
          <Badge theme={theme}>Pending</Badge>
          <Badge theme={theme} variant="accent">Processing</Badge>
          <Badge theme={theme} variant="success">Filled</Badge>
          <Badge theme={theme} variant="warning">Partial</Badge>
          <Badge theme={theme} variant="danger">Failed</Badge>
        </Stack>
        <Stack direction="row" gap={12} wrap>
          <Tag theme={theme} color={pal.accent}>SOL/USDC</Tag>
          <Tag theme={theme} color={pal.success}>Long</Tag>
          <Tag theme={theme} removable onRemove={() => {}}>DCA active</Tag>
        </Stack>
        <Card theme={theme} padding={16}>
          <CardHeader title="Syncing on-chain data" subtitle="Block 284,019,337" theme={theme} />
          <Progress value={68} theme={theme} />
        </Card>
        <Stack gap={12}>
          <Toast theme={theme} message="Order filled — 2.4 SOL @ $142.80" variant="success" icon="✓" />
          <Toast theme={theme} message="RPC connection dropped" variant="danger" icon="!" />
        </Stack>
        <Stack gap="sm">
          <Skeleton theme={theme} width="60%" height={14} />
          <Skeleton theme={theme} width="100%" height={14} />
          <Skeleton theme={theme} width="80%" height={14} />
          <Skeleton theme={theme} width={40} height={40} rounded />
        </Stack>
      </Stack>
    </ShowcaseCard>
  );
}

function DemoDataDisplay({ theme }) {
  const pal = usePal(theme);
  return (
    <ShowcaseCard theme={theme} label="Data Display" height={540}>
      <Stack gap={24} style={{ width: 340 }}>
        <Stack direction="row" gap={24}>
          <Stat theme={theme} label="Portfolio" value="$142.8k" change="+8.2%" />
          <Stat theme={theme} label="24h P&L" value="$3,412" change="-1.4%" />
          <Stat theme={theme} label="Win rate" value="72%" change="+3.1%" />
        </Stack>
        <Stack direction="row" gap={12} align="center">
          <AvatarGroup theme={theme} names={["Alpha Agent", "DCA Bot", "Grid Maker", "Sniper v2", "Arb Scout", "Yield Farmer"]} />
          <Caption theme={theme}>6 active agents</Caption>
        </Stack>
        <Card theme={theme} padding={0}>
          <ListItem theme={theme} left={<Avatar name="Alpha Agent" size={36} theme={theme} />} title="Alpha Agent" subtitle="SOL/USDC · Momentum" right={<Badge theme={theme} variant="success">Running</Badge>} />
          <ListItem theme={theme} left={<Avatar name="DCA Bot" size={36} theme={theme} />} title="DCA Bot" subtitle="ETH · Weekly accumulate" right={<Badge theme={theme} variant="accent">Queued</Badge>} />
          <ListItem theme={theme} left={<Avatar name="Grid Maker" size={36} theme={theme} />} title="Grid Maker" subtitle="BTC/USDT · Range bound" right={<Badge theme={theme}>Paused</Badge>} divider={false} />
        </Card>
        <Stack gap={10}>
          <Caption theme={theme}>Middle truncate — identifiers keep their tail</Caption>
          {[280, 200, 140].map(w => (
            <div key={w} style={{ width: w, padding: "6px 10px", borderRadius: tokens.radius.sm, background: theme === "dark" ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.025)" }}>
              <MiddleTruncate theme={theme} text="0x742d35Cc6aF4C5C3A9b8dF3C2A1e7F39b4D1C6e2" />
            </div>
          ))}
        </Stack>
      </Stack>
    </ShowcaseCard>
  );
}

// ─── AI ELEMENTS — atomic AI-specific components ──────────────
// Composed AI flows (chat, streaming answers, tool feeds…) live in the
// UX Patterns section; these cards demo the individual building blocks.

function DemoAIElements({ theme }) {
  const pal = usePal(theme);
  const [streamKey, setStreamKey] = useState(0);
  const [stepKey, setStepKey] = useState(0);
  const [step, setStep] = useState(0);
  const [zoom, setZoom] = useState(100);

  useEffect(() => {
    setStep(0);
    const timers = [1, 2, 3, 4].map((n) => setTimeout(() => setStep(n), n * 900));
    return () => timers.forEach(clearTimeout);
  }, [stepKey]);

  return (
    <Stack gap={24}>
      <ShowcaseCard theme={theme} label="Streaming Text" controls={
        <Button theme={theme} variant="ghost" size="sm" onClick={() => setStreamKey(k => k + 1)}>↻ Replay</Button>
      }>
        <div key={streamKey} style={{ width: 340 }}>
          <StreamingText text="SOL is approaching the $148 resistance level with rising volume. I'd recommend scaling into a 60% position now and setting a limit order for the remaining 40% at $144.20." speed={22} theme={theme} />
        </div>
      </ShowcaseCard>

      <ShowcaseCard theme={theme} label="Thinking Indicator">
        <ThinkingIndicator theme={theme} label="Streaming" />
      </ShowcaseCard>

      <ShowcaseCard theme={theme} label="Thinking Steps" controls={
        <Button theme={theme} variant="ghost" size="sm" onClick={() => setStepKey(k => k + 1)}>↻ Replay</Button>
      }>
        <div key={stepKey} style={{ width: 300 }}>
          <ThinkingSteps theme={theme} current={step} steps={[
            "Scanning SOL/USDC order book",
            "Cross-referencing 4h trend",
            "Sizing position vs. risk budget",
            "Placing limit order",
          ]} />
        </div>
      </ShowcaseCard>

      <ShowcaseCard theme={theme} label="Confidence Bar">
        <Stack gap={12} style={{ width: 300 }}>
          <ConfidenceBar value={94} label="Trend" theme={theme} />
          <ConfidenceBar value={72} label="Volume" theme={theme} />
          <ConfidenceBar value={38} label="Volatility" theme={theme} />
        </Stack>
      </ShowcaseCard>

      <ShowcaseCard theme={theme} label="AI Suggestion Badge">
        <AISuggestionBadge theme={theme} />
      </ShowcaseCard>

      <ShowcaseCard theme={theme} label="Before / After Toggle">
        <div style={{ width: 320 }}>
          <BeforeAfterToggle theme={theme}
            before={
              <Card theme={theme} padding={16}>
                <Stack gap={4}>
                  <Caption theme={theme}>Original</Caption>
                  <Text size="sm" theme={theme}>Buy 12 SOL at market and hope the breakout holds through the weekend.</Text>
                </Stack>
              </Card>
            }
            after={
              <Card theme={theme} padding={16}>
                <Stack gap={4}>
                  <Caption theme={theme}>Agent rewrite</Caption>
                  <Text size="sm" theme={theme}>Scale into 12 SOL across three limit orders, invalidation at $144.20.</Text>
                </Stack>
              </Card>
            } />
        </div>
      </ShowcaseCard>

      <ShowcaseCard theme={theme} label="Zoom Control">
        <ZoomControl theme={theme} zoom={zoom} onChange={setZoom} />
      </ShowcaseCard>
    </Stack>
  );
}


// Inline panel preview for Dialog/Drawer/Sheet — renders the panel chrome inline
// inside a ShowcaseCard so the user can see it without covering the whole page.
function InlinePanelPreview({ title, children, actions, theme, shape = "dialog" }) {
  const pal = usePal(theme);
  const isSheet = shape === "sheet";
  const isDrawer = shape === "drawer";
  return (
    <div style={{
      width: isSheet ? 320 : 400, maxWidth: "100%",
      background: theme === "dark" ? "rgba(30,30,30,0.95)" : "rgba(255,255,255,0.95)",
      backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
      border: `1px solid ${pal.borderSubtle}`,
      borderRadius: isDrawer ? `${tokens.radius.lg}px ${tokens.radius.lg}px 0 0` : tokens.radius.lg,
      padding: 24, boxShadow: `0 16px 48px ${pal.shadowLg}`,
      fontFamily: tokens.font.sans,
    }}>
      {isDrawer && <div style={{ width: 32, height: 4, borderRadius: 2, background: pal.bgMuted, margin: "0 auto 16px" }} />}
      {title && <div style={{ ...tokens.type.lg, fontWeight: tokens.weight.semibold, color: pal.text, marginBottom: 12 }}>{title}</div>}
      <div style={{ ...tokens.type.base, color: pal.textSecondary, lineHeight: 1.6 }}>{children}</div>
      {actions && <div style={{ marginTop: 20, display: "flex", justifyContent: "flex-end", gap: 8 }}>{actions}</div>}
    </div>
  );
}

function DemoOverlays({ theme }) {
  const [alertOpen, setAlertOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [cardOpen, setCardOpen] = useState(false);
  const [formName, setFormName] = useState("");
  return (
    <Stack gap={24}>
      <ShowcaseCard theme={theme} label="Dialog">
        <InlinePanelPreview theme={theme} title="Confirm transaction" shape="dialog"
          actions={<>
            <Button theme={theme} variant="ghost" size="sm">Cancel</Button>
            <Button theme={theme} variant="primary" size="sm">Confirm</Button>
          </>}>
          Are you sure you want to execute this trade? This action cannot be undone.
        </InlinePanelPreview>
      </ShowcaseCard>

      <ShowcaseCard theme={theme} label="Drawer">
        <InlinePanelPreview theme={theme} title="Order details" shape="drawer"
          actions={<Button theme={theme} variant="primary" size="sm" fullWidth>Done</Button>}>
          Bottom drawer for quick confirmations and compact detail views on mobile.
        </InlinePanelPreview>
      </ShowcaseCard>

      <ShowcaseCard theme={theme} label="Sheet" style={{ padding: 0, overflow: "hidden" }}>
        <DockedSheetPreview theme={theme} />
      </ShowcaseCard>

      <ShowcaseCard theme={theme} label="Popover">
        <TriggerPopover theme={theme} />
      </ShowcaseCard>

      <ShowcaseCard theme={theme} label="Dropdown Menu">
        <TriggerDropdown theme={theme} />
      </ShowcaseCard>

      <ShowcaseCard theme={theme} label="Tooltip">
        <Tooltip theme={theme} text="Copy wallet address">
          <Button theme={theme} variant="ghost" size="sm">Hover me</Button>
        </Tooltip>
      </ShowcaseCard>

      <ShowcaseCard theme={theme} label="Hover Card">
        <HoverCard theme={theme}
          trigger={<LinkButton theme={theme}>@alpha-agent</LinkButton>}>
          <Stack gap={8}>
            <Stack direction="row" gap={10} align="center">
              <Avatar name="Alpha Agent" size={32} theme={theme} />
              <div>
                <Text size="sm" weight="semibold" theme={theme} style={{ display: "block" }}>Alpha Agent</Text>
                <Text size="xs" secondary theme={theme}>Momentum · SOL/USDC</Text>
              </div>
            </Stack>
            <Text size="xs" secondary theme={theme}>Running for 42 days · 72% win rate · +$3,412 this month.</Text>
          </Stack>
        </HoverCard>
      </ShowcaseCard>

      <ShowcaseCard theme={theme} label="Alert Dialog">
        <Button theme={theme} variant="danger" size="sm" onClick={() => setAlertOpen(true)}>Delete position</Button>
        <AlertDialog theme={theme} open={alertOpen} onClose={() => setAlertOpen(false)}
          title="Close position?" description="This will close your SOL/USDC long at market. This cannot be undone."
          confirmLabel="Close position" variant="danger" />
      </ShowcaseCard>

      <ShowcaseCard theme={theme} label="Form Dialog">
        <Button theme={theme} variant="primary" size="sm" onClick={() => setFormOpen(true)}>New strategy</Button>
        <FormDialog theme={theme} open={formOpen} onClose={() => setFormOpen(false)}
          title="Create strategy" description="Name your strategy and set a risk budget."
          onSubmit={() => {}}>
          <TextInput theme={theme} label="Strategy name" value={formName} onChange={setFormName} placeholder="Alpha Agent" />
          <TextInput theme={theme} label="Risk budget (USDC)" placeholder="1,000" />
        </FormDialog>
      </ShowcaseCard>

      <ShowcaseCard theme={theme} label="Card Dialog">
        <Button theme={theme} variant="outline" size="sm" onClick={() => setCardOpen(true)}>Open card</Button>
        <CardDialog theme={theme} open={cardOpen} onClose={() => setCardOpen(false)}
          cover="◆" title="Agent Pro upgrade"
          description="Unlock unlimited backtests, premium signals, and priority execution."
          actions={<>
            <Button theme={theme} variant="ghost" size="sm" onClick={() => setCardOpen(false)}>Later</Button>
            <Button theme={theme} variant="primary" size="sm" onClick={() => setCardOpen(false)}>Upgrade</Button>
          </>}
        />
      </ShowcaseCard>
    </Stack>
  );
}

// Docked Sheet preview — occupies the full height of its ShowcaseCard, flush right
function DockedSheetPreview({ theme }) {
  const pal = usePal(theme);
  return (
    <div style={{
      position: "absolute", top: 0, right: 0, bottom: 0, width: 320,
      background: theme === "dark" ? "rgba(30,30,30,0.95)" : "rgba(255,255,255,0.95)",
      backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
      borderLeft: `1px solid ${pal.borderSubtle}`,
      padding: 24, fontFamily: tokens.font.sans, zIndex: 1,
      display: "flex", flexDirection: "column", gap: 16,
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ ...tokens.type.lg, fontWeight: tokens.weight.semibold, color: pal.text }}>Position details</div>
        <button style={{ ...interactiveBase, background: "transparent", color: pal.textTertiary, padding: 4, fontSize: 14 }}>✕</button>
      </div>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 12 }}>
        <Text size="sm" theme={theme}>View full position history and P&L breakdown in this side panel.</Text>
        <Divider theme={theme} />
        <Stat theme={theme} label="Entry price" value="$142.30" />
        <Stat theme={theme} label="Current" value="$148.60" change="+4.4%" />
        <Stat theme={theme} label="24h high" value="$149.12" />
      </div>
      <Button theme={theme} variant="primary" size="sm" fullWidth>Close position</Button>
    </div>
  );
}

function TriggerPopover({ theme }) {
  return (
    <Popover theme={theme} trigger={<Button theme={theme} variant="outline" size="sm">Open popover</Button>}>
      <Text size="sm" theme={theme}>Popover content — any components can live here.</Text>
    </Popover>
  );
}

function TriggerDropdown({ theme }) {
  return (
    <DropdownMenu theme={theme} trigger={<Button theme={theme} variant="outline" size="sm">Open menu</Button>}
      items={[
        { label: "Edit position", icon: "✎" },
        { label: "Duplicate", icon: "⧉" },
        { separator: true },
        { label: "Close trade", icon: "✕", danger: true },
      ]} />
  );
}

function DemoNavigation({ theme }) {
  const pal = usePal(theme);
  const [tab, setTab] = useState("Overview");
  const [subtleTab, setSubtleTab] = useState("Signals");
  const [step, setStep] = useState(1);
  const nextStep = () => setStep(s => (s + 1) % 4);
  const tabContent = {
    Overview: {
      stat: [{ label: "Portfolio", value: "$142.8k", change: "+8.2%" }, { label: "24h P&L", value: "$3,412", change: "-1.4%" }],
      blurb: "Your agent executed 14 trades across 3 pairs in the last 24 hours — a net yield of 2.4%.",
    },
    Trades: {
      stat: [{ label: "Open", value: "7" }, { label: "Filled today", value: "14" }],
      blurb: "Most recent fill: SOL/USDC long @ $148.20, 4m ago. Next epoch in 22m.",
    },
    Settings: {
      stat: [{ label: "Risk tier", value: "Moderate" }, { label: "Slippage cap", value: "0.5%" }],
      blurb: "Auto-rebalance is on. Stop-loss triggers at -6% drawdown per position.",
    },
  }[tab];
  return (
    <Stack gap={24}>
      <ShowcaseCard theme={theme} label="Breadcrumbs">
        <div style={{ width: 340 }}>
          <Breadcrumb theme={theme} items={[
            { label: "Portfolio" }, { label: "Strategies" }, { label: "Alpha Agent" },
          ]} />
        </div>
      </ShowcaseCard>

      <ShowcaseCard theme={theme} label="Breadcrumbs — Truncated">
        <Stack gap={20} align="center" style={{ width: 360 }}>
          <Breadcrumb theme={theme} maxVisible={3} items={[
            { label: "Workspace" }, { label: "Portfolio" }, { label: "Strategies" },
            { label: "Alpha Agent" }, { label: "Settings" }, { label: "Risk" },
          ]} />
          <Caption theme={theme}>Hover the … to reveal the full path.</Caption>
        </Stack>
      </ShowcaseCard>

      <ShowcaseCard theme={theme} label="Tabs">
        <Stack gap={20} style={{ width: 340 }}>
          <Tabs theme={theme} tabs={["Overview", "Trades", "Settings"]} value={tab} onChange={setTab} />
          <div key={tab} style={{ animation: `halaska-tab-fade 0.25s ${motion.easeOut} both` }}>
            <Stack gap={12}>
              <Stack direction="row" gap={24}>
                {tabContent.stat.map((s, i) => (
                  <Stat key={i} theme={theme} label={s.label} value={s.value} change={s.change} />
                ))}
              </Stack>
              <Text size="sm" theme={theme} style={{ color: pal.textSecondary, lineHeight: 1.6 }}>
                {tabContent.blurb}
              </Text>
            </Stack>
          </div>
        </Stack>
      </ShowcaseCard>

      <ShowcaseCard theme={theme} label="Subtle Tabs">
        <SubtleTabs theme={theme} tabs={["Signals", "Positions", "Orders"]} value={subtleTab} onChange={setSubtleTab} />
      </ShowcaseCard>

      <ShowcaseCard theme={theme} label="Stepper" controls={
        <Button theme={theme} variant="ghost" size="sm" onClick={nextStep}>↻ Advance</Button>
      }>
        <div style={{ width: 320 }}>
          <Stepper theme={theme} current={step} steps={["Connect", "Deposit", "Trade", "Withdraw"]} />
        </div>
      </ShowcaseCard>

      <ShowcaseCard theme={theme} label="Accordion" align="top">
        <div style={{ width: 340 }}>
          <Accordion theme={theme} items={[
            { title: "What is auto-rebalancing?", content: "The agent automatically adjusts your portfolio allocations based on market conditions and your risk parameters." },
            { title: "How are fees calculated?", content: "Trading fees are 0.1% per swap. No management fees on the base tier." },
            { title: "Can I pause my agent?", content: "Yes. Use the kill switch in Agent Settings to pause all active strategies immediately." },
          ]} />
        </div>
      </ShowcaseCard>

      <ShowcaseCard theme={theme} label="Collapsible" align="top">
        <div style={{ width: 340 }}>
          <Collapsible theme={theme} title="Advanced settings">
            <Stack gap={8} style={{ paddingBottom: 8 }}>
              <Text size="sm" theme={theme} secondary>Configure gas limits, MEV protection, and custom RPC endpoints.</Text>
            </Stack>
          </Collapsible>
        </div>
      </ShowcaseCard>

      <ShowcaseCard theme={theme} label="Context Menu">
        <ContextMenu theme={theme} items={[
          { label: "Edit position", icon: "✎", shortcut: "⌘E" },
          { label: "Duplicate", icon: "⧉", shortcut: "⌘D" },
          { separator: true },
          { label: "Close trade", icon: "✕", danger: true },
        ]}>
          <div style={{ padding: "24px 32px", background: theme === "dark" ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)", border: `1px dashed ${theme === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}`, borderRadius: 16, color: theme === "dark" ? "#888" : "#888", fontFamily: tokens.font.sans, fontSize: 13, textAlign: "center" }}>
            Right-click anywhere inside this area
          </div>
        </ContextMenu>
      </ShowcaseCard>

      <ShowcaseCard theme={theme} label="Menubar">
        <Menubar theme={theme} menus={[
          { label: "File", items: [{ label: "New trade", shortcut: "⌘N" }, { label: "Open…", shortcut: "⌘O" }, { separator: true }, { label: "Save", shortcut: "⌘S" }] },
          { label: "Edit", items: [{ label: "Undo", shortcut: "⌘Z" }, { label: "Redo", shortcut: "⇧⌘Z" }] },
          { label: "View", items: [{ label: "Toggle sidebar" }, { label: "Toggle DevTools" }] },
        ]} />
      </ShowcaseCard>

      <ShowcaseCard theme={theme} label="Command Menu">
        <CommandPalette theme={theme} items={[
          { label: "New trade", icon: "+", shortcut: "T" },
          { label: "Deposit USDC", icon: "$", shortcut: "D" },
          { label: "View positions", icon: "◧" },
          { label: "Open strategy builder", icon: "✦", shortcut: "S" },
          { label: "Sync wallet", icon: "⟳" },
        ]} />
      </ShowcaseCard>
    </Stack>
  );
}

function DemoTable({ theme }) {
  const [page, setPage] = useState(1);
  return (
    <Stack gap={24}>
      <ShowcaseCard theme={theme} label="Table">
        <div style={{ width: 380 }}>
          <Table theme={theme}
            columns={["Pair", "Side", "Amount", "PnL"]}
            rows={[
              ["SOL/USDC", "Long", "2,500", "+$142"],
              ["ETH/USDT", "Short", "1,200", "-$38"],
              ["BTC/USDC", "Long", "5,000", "+$891"],
              ["ARB/USDC", "Long", "800", "+$24"],
            ]} />
        </div>
      </ShowcaseCard>

      <ShowcaseCard theme={theme} label="Data Table">
        <div style={{ width: 420 }}>
          <DataTable theme={theme} columns={["Pair", "Side", "PnL"]}
            rows={[
              ["SOL/USDC", "Long", "+$142"],
              ["ETH/USDT", "Short", "-$38"],
              ["BTC/USDC", "Long", "+$891"],
              ["ARB/USDC", "Long", "+$24"],
            ]} />
        </div>
      </ShowcaseCard>

      <ShowcaseCard theme={theme} label="Pagination">
        <div style={{ width: 320 }}>
          <Pagination theme={theme} current={page} total={8} onChange={setPage} />
        </div>
      </ShowcaseCard>

      <ShowcaseCard theme={theme} label="Scroll Area">
        <div style={{ width: 320 }}>
          <ScrollArea theme={theme} maxHeight={180}>
            <Stack gap={0}>
              {[
                ["14:36:41", "Fill · 450 SOL @ $151.62"],
                ["14:32:05", "Fill · 800 SOL @ $151.28"],
                ["14:18:52", "Order placed · 1,250 SOL limit"],
                ["13:57:20", "Signal · momentum breakout 4h"],
                ["13:41:03", "Rebalance · weights realigned"],
                ["13:22:48", "Fill · 120 ARB @ $0.94"],
                ["12:58:31", "Stop moved · ETH $2,395"],
                ["12:40:07", "Deposit · 2,500 USDC"],
              ].map(([time, event], i) => (
                <div key={i} style={{ display: "flex", gap: 12, padding: "8px 4px", alignItems: "baseline" }}>
                  <Text size="xs" mono secondary theme={theme}>{time}</Text>
                  <Text size="sm" theme={theme}>{event}</Text>
                </div>
              ))}
            </Stack>
          </ScrollArea>
        </div>
      </ShowcaseCard>
    </Stack>
  );
}

function DemoFormExtras({ theme }) {
  const [otp, setOtp] = useState("");
  return (
    <ShowcaseCard theme={theme} label="Form Extras">
      <Stack gap={24} style={{ width: 320 }}>
        <div>
          <Label theme={theme}>Verification code</Label>
          <div style={{ marginTop: 8 }}><InputOTP theme={theme} length={6} value={otp} onChange={setOtp} /></div>
        </div>
        <div>
          <Label theme={theme}>Keyboard shortcuts</Label>
          <Stack direction="row" gap={6} style={{ marginTop: 8, flexWrap: "wrap" }}>
            <Kbd theme={theme}>⌘</Kbd><Kbd theme={theme}>K</Kbd>
            <span style={{ ...tokens.type.sm, color: "inherit", opacity: 0.4, margin: "0 4px" }}>·</span>
            <Kbd theme={theme}>⇧</Kbd><Kbd theme={theme}>Enter</Kbd>
          </Stack>
        </div>
      </Stack>
    </ShowcaseCard>
  );
}

function DemoAlerts({ theme }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setProgress(p => (p >= 100 ? 0 : p + 4));
    }, 120);
    return () => clearInterval(id);
  }, []);

  return (
    <Stack gap={24}>
      <ShowcaseCard theme={theme} label="Alert Banners">
        <Stack gap={16} style={{ width: 360 }}>
          <AlertBanner theme={theme} variant="default" title="Sync complete" description="All on-chain data has been updated." />
          <AlertBanner theme={theme} variant="success" title="Trade executed" description="SOL/USDC long filled at $148.20." />
          <AlertBanner theme={theme} variant="warning" title="High slippage" description="Estimated slippage exceeds 1.5%." />
          <AlertBanner theme={theme} variant="danger" title="Liquidation risk" description="Margin ratio below maintenance threshold." />
        </Stack>
      </ShowcaseCard>

      <ShowcaseCard theme={theme} label="Empty State">
        <EmptyState theme={theme} icon="◇" title="No open positions"
          description="Start a new trade or deploy an agent to get started."
          action={<Button theme={theme} variant="primary" size="sm">New trade</Button>} />
      </ShowcaseCard>

      <ShowcaseCard theme={theme} label="Progress Circle">
        <ProgressCircle theme={theme} value={progress} label={`${progress}%`} size={64} />
      </ShowcaseCard>

      <ShowcaseCard theme={theme} label="Spinner">
        <Stack direction="row" gap={20} align="center">
          <Spinner size={14} />
          <Spinner size={20} />
          <Spinner size={28} />
        </Stack>
      </ShowcaseCard>

      <ShowcaseCard theme={theme} label="Status Badge">
        <Stack gap={10} direction="row" wrap justify="center">
          <StatusBadge theme={theme} status="online" pulse>Live</StatusBadge>
          <StatusBadge theme={theme} status="pending">Pending</StatusBadge>
          <StatusBadge theme={theme} status="error">Failed</StatusBadge>
          <StatusBadge theme={theme} status="accent">Beta</StatusBadge>
        </Stack>
      </ShowcaseCard>

      <ShowcaseCard theme={theme} label="Status Dot">
        <Stack gap={16} direction="row" wrap justify="center" align="center">
          {[
            ["online", "Live", true],
            ["busy", "Degraded", false],
            ["error", "Down", false],
            ["offline", "Idle", false],
          ].map(([status, label, pulse]) => (
            <Stack key={status} direction="row" gap={7} align="center">
              <StatusDot theme={theme} status={status} pulse={pulse} />
              <Text size="sm" secondary theme={theme}>{label}</Text>
            </Stack>
          ))}
        </Stack>
      </ShowcaseCard>
    </Stack>
  );
}

// Notification center panel — registered as an ambient UX pattern (it's a
// composed surface, not an atomic component).
function NotificationsDemo({ theme }) {
  const pal = usePal(theme);
  const items = [
    { icon: "✓", color: pal.success, title: "Order filled", body: "SOL/USDC long · 2.4 SOL @ $148.20", time: "2m" },
    { icon: "!", color: pal.warning, title: "High slippage warning", body: "ETH/USDT swap exceeds 1.5% — review before confirming.", time: "14m" },
    { icon: "✦", color: pal.accent, title: "New agent signal", body: "Alpha Agent detected a breakout on ARB/USDC.", time: "42m" },
    { icon: "✕", color: pal.danger, title: "RPC connection dropped", body: "Reconnecting to backup endpoint…", time: "1h" },
    { icon: "⧗", color: pal.textSecondary, title: "Epoch rebalanced", body: "Portfolio realigned to target weights.", time: "3h", read: true },
  ];
  return (
    <div style={{ width: 400, maxWidth: "100%", display: "flex", flexDirection: "column", background: pal.bgElevated, borderRadius: tokens.radius.md, border: `1px solid ${pal.borderSubtle}`, overflow: "hidden", transition: `all ${motion.smooth} ${motion.easeInOut}` }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", borderBottom: `1px solid ${pal.borderSubtle}` }}>
        <Text size="sm" weight="semibold" theme={theme}>Notifications</Text>
        <Text size="xs" theme={theme} style={{ color: pal.textSecondary, cursor: "pointer" }}>Mark all read</Text>
      </div>
      {items.map((n, i) => (
        <div key={i} style={{
          display: "flex", gap: 12, padding: "12px 16px",
          borderBottom: i < items.length - 1 ? `1px solid ${pal.borderSubtle}` : "none",
          background: n.read ? "transparent" : (theme === "dark" ? "rgba(255,255,255,0.015)" : "rgba(0,0,0,0.015)"),
          transition: `background ${motion.normal} ${motion.easeInOut}`,
        }}>
          <div style={{
            width: 28, height: 28, borderRadius: 14, flexShrink: 0,
            background: `${n.color}22`, color: n.color,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 13, fontWeight: tokens.weight.semibold,
          }}>{n.icon}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 8 }}>
              <Text size="sm" weight="semibold" theme={theme}>{n.title}</Text>
              <Text size="xs" theme={theme} style={{ color: pal.textTertiary, flexShrink: 0 }}>{n.time}</Text>
            </div>
            <Text size="xs" theme={theme} style={{ color: pal.textSecondary, marginTop: 2, lineHeight: 1.5 }}>{n.body}</Text>
          </div>
          {!n.read && (
            <div style={{ width: 6, height: 6, borderRadius: 3, background: pal.accent, alignSelf: "center", flexShrink: 0 }} />
          )}
        </div>
      ))}
    </div>
  );
}

function NotificationCenterPattern({ theme }) {
  return <NotificationsDemo theme={theme} />;
}

function DismissibleChipsDemo({ theme }) {
  const [tags, setTags] = useState(["SOL/USDC", "Momentum", "4h", "Risk: moderate"]);
  return (
    <Stack gap={8} direction="row" wrap justify="center">
      {tags.map((t, i) => (
        <Chip key={t} theme={theme} selected
          onRemove={() => setTags(tags.filter((_, j) => j !== i))}>
          {t}
        </Chip>
      ))}
      {tags.length === 0 && (
        <Text size="sm" theme={theme} style={{ opacity: 0.6 }}>All dismissed.</Text>
      )}
    </Stack>
  );
}

function DemoInputsExtended({ theme }) {
  const [chips, setChips] = useState(new Set(["Long"]));
  const [inputA, setInputA] = useState("alpha-strategy");
  const [combo, setCombo] = useState("sol");
  const [date, setDate] = useState(new Date());
  const [slider, setSlider] = useState(35);
  const [springSlider, setSpringSlider] = useState(42);
  const [springToggle, setSpringToggle] = useState(true);
  const [togglePressed, setTogglePressed] = useState(true);
  const [toggleGroupVal, setToggleGroupVal] = useState("1h");
  const [rating, setRating] = useState(4);
  const [orderType, setOrderType] = useState("limit");
  const [search, setSearch] = useState("");

  const toggleChip = (c) => {
    const s = new Set(chips);
    s.has(c) ? s.delete(c) : s.add(c);
    setChips(s);
  };

  return (
    <Stack gap={24}>
      <ShowcaseCard theme={theme} label="Slider">
        <div style={{ width: 300 }}>
          <Slider theme={theme} label="Position size" value={slider} onChange={setSlider} />
        </div>
      </ShowcaseCard>

      <ShowcaseCard theme={theme} label="Spring Slider">
        <div style={{ width: 300 }}>
          <SpringSlider theme={theme} label="Risk allocation" value={springSlider} onChange={setSpringSlider} />
        </div>
      </ShowcaseCard>

      <ShowcaseCard theme={theme} label="Spring Toggle">
        <SpringToggle theme={theme} checked={springToggle} onChange={setSpringToggle} label="Auto-rebalance" />
      </ShowcaseCard>

      <ShowcaseCard theme={theme} label="Toggle & Toggle Group">
        <Stack gap={16} align="center">
          <Toggle theme={theme} pressed={togglePressed} onPress={setTogglePressed}>MEV protection</Toggle>
          <ToggleGroup theme={theme} options={["15m", "1h", "4h", "1d"]} value={toggleGroupVal} onChange={setToggleGroupVal} />
        </Stack>
      </ShowcaseCard>

      <ShowcaseCard theme={theme} label="Choicebox">
        <div style={{ width: 340 }}>
          <Choicebox theme={theme} value={orderType} onChange={setOrderType}
            options={[
              { id: "market", title: "Market order", description: "Fill immediately at the best available price.", meta: "instant" },
              { id: "limit",  title: "Limit order",  description: "Fill only at your price or better.", meta: "maker" },
              { id: "twap",   title: "TWAP",         description: "Slice the order across 30 minutes to reduce impact.", meta: "30m" },
            ]} />
        </div>
      </ShowcaseCard>

      <ShowcaseCard theme={theme} label="Search Input">
        <div style={{ width: 300 }}>
          <SearchInput theme={theme} value={search} onChange={setSearch} placeholder="Search pairs…" />
        </div>
      </ShowcaseCard>

      <ShowcaseCard theme={theme} label="Chip — Toggle">
        <Stack gap={8} direction="row" wrap justify="center">
          {["Long", "Short", "Spot", "Perp", "Options"].map(c => (
            <Chip key={c} theme={theme} selected={chips.has(c)} onToggle={() => toggleChip(c)}>{c}</Chip>
          ))}
        </Stack>
      </ShowcaseCard>

      <ShowcaseCard theme={theme} label="Chip — Dismissible">
        <DismissibleChipsDemo theme={theme} />
      </ShowcaseCard>

      <ShowcaseCard theme={theme} label="Input Group">
        <div style={{ width: 320 }}>
          <InputGroup theme={theme} label="Strategy handle" prefix="@" suffix=".halaska" value={inputA} onChange={setInputA} />
        </div>
      </ShowcaseCard>

      <ShowcaseCard theme={theme} label="Copy Input">
        <div style={{ width: 300 }}>
          <CopyInput theme={theme} label="Wallet address" value="0x742d35Cc6aF4C5C3A9b8dF3C2A1e7F39b4D1C6e2" />
        </div>
      </ShowcaseCard>

      <ShowcaseCard theme={theme} label="Combobox">
        <Combobox theme={theme} label="Pair" value={combo} onChange={setCombo}
          options={[
            { value: "sol", label: "SOL / USDC" },
            { value: "eth", label: "ETH / USDT" },
            { value: "btc", label: "BTC / USDC" },
            { value: "arb", label: "ARB / USDC" },
            { value: "op", label: "OP / USDC" },
            { value: "avax", label: "AVAX / USDC" },
          ]} />
      </ShowcaseCard>

      <ShowcaseCard theme={theme} label="Calendar">
        <Calendar theme={theme} value={date} onChange={setDate} />
      </ShowcaseCard>

      <ShowcaseCard theme={theme} label="Date Picker">
        <DatePicker theme={theme} label="Settlement date" value={date} onChange={setDate} />
      </ShowcaseCard>

      <ShowcaseCard theme={theme} label="Rating">
        <Rating theme={theme} value={rating} onChange={setRating} size={22} />
      </ShowcaseCard>
    </Stack>
  );
}

// Dev surfaces — the framing components coding agents live inside.
function DemoDevSurfaces({ theme }) {
  const pal = usePal(theme);
  return (
    <Stack gap={24}>
      <ShowcaseCard theme={theme} label="Snippet">
        <div style={{ width: 340 }}>
          <Snippet theme={theme} text="alpha deploy --strategy momentum --paper" />
        </div>
      </ShowcaseCard>

      <ShowcaseCard theme={theme} label="File Tree" align="top">
        <div style={{ width: 300, paddingTop: 8 }}>
          <FileTree theme={theme} data={[
            {
              name: "strategies", children: [
                { name: "momentum.ts", badge: "editing" },
                { name: "dca.ts" },
                { name: "grid.ts" },
              ],
            },
            {
              name: "backtests", defaultOpen: false, children: [
                { name: "2026-q2.json" },
                { name: "2026-q3.json" },
              ],
            },
            { name: "risk.config.ts" },
            { name: "README.md" },
          ]} />
        </div>
      </ShowcaseCard>

      <ShowcaseCard theme={theme} label="Browser Frame">
        <div style={{ width: 400, maxWidth: "100%" }}>
          <BrowserFrame theme={theme} url="alpha.halaska.app/dashboard">
            <Stack gap={12}>
              <Stack direction="row" gap={24}>
                <Stat theme={theme} label="Portfolio" value="$142.8k" change="+8.2%" />
                <Stat theme={theme} label="Win rate" value="72%" change="+3.1%" />
              </Stack>
              <Text size="xs" theme={theme} style={{ color: pal.textTertiary }}>
                The page Alpha is building — framed for previews and demos.
              </Text>
            </Stack>
          </BrowserFrame>
        </div>
      </ShowcaseCard>
    </Stack>
  );
}

function DemoCharts({ theme }) {
  const barData = [
    { label: "Mon", value: 24 }, { label: "Tue", value: 38 }, { label: "Wed", value: 15 },
    { label: "Thu", value: 52 }, { label: "Fri", value: 31 }, { label: "Sat", value: 47 },
    { label: "Sun", value: 29 },
  ];
  const donutData = [
    { label: "SOL", value: 45 }, { label: "ETH", value: 25 },
    { label: "BTC", value: 18 }, { label: "ARB", value: 12 },
  ];
  const sparklineData = [12, 18, 14, 22, 19, 26, 24, 31, 28, 35, 33, 40];
  const composedData = [
    { label: "Mon", price: 142, volume: 320 }, { label: "Tue", price: 145, volume: 410 },
    { label: "Wed", price: 144, volume: 280 }, { label: "Thu", price: 149, volume: 520 },
    { label: "Fri", price: 152, volume: 460 }, { label: "Sat", price: 151, volume: 230 },
    { label: "Sun", price: 154, volume: 380 },
  ];
  const radialData = [
    { name: "Trend", value: 86 }, { name: "Volume", value: 64 },
    { name: "Momentum", value: 48 }, { name: "Volatility", value: 32 },
  ];
  const treemapData = [
    { name: "SOL", value: 4500 }, { name: "ETH", value: 2500 },
    { name: "BTC", value: 3200 }, { name: "ARB", value: 1100 },
    { name: "OP", value: 800 }, { name: "AVAX", value: 600 },
  ];
  const longTimeSeries = Array.from({ length: 60 }, (_, i) => ({
    label: `T${i + 1}`,
    value: 100 + Math.sin(i / 4) * 18 + Math.cos(i / 9) * 10 + i * 0.4,
  }));

  return (
    <Stack gap={24}>
      <ShowcaseCard theme={theme} label="Sparkline">
        <Stack gap={12} align="center">
          <Sparkline theme={theme} data={sparklineData} width={220} height={56} />
          <Caption theme={theme}>SOL · 24h · +22%</Caption>
        </Stack>
      </ShowcaseCard>

      <ShowcaseCard theme={theme} label="Bar Chart">
        <BarChart theme={theme} data={barData} target={40} />
      </ShowcaseCard>

      <ShowcaseCard theme={theme} label="Donut Chart">
        <DonutChart theme={theme} data={donutData} />
      </ShowcaseCard>

      <ShowcaseCard theme={theme} label="Composed Chart">
        <ComposedChartCombo theme={theme} data={composedData} />
      </ShowcaseCard>

      <ShowcaseCard theme={theme} label="Radial Bar">
        <RadialBarRing theme={theme} data={radialData} />
      </ShowcaseCard>

      <ShowcaseCard theme={theme} label="Treemap">
        <TreemapHeat theme={theme} data={treemapData} />
      </ShowcaseCard>

      <ShowcaseCard theme={theme} label="Time-series + Brush">
        <BrushChart theme={theme} data={longTimeSeries} />
      </ShowcaseCard>
    </Stack>
  );
}

// ─── PATTERNS ────────────────────────────────────────────────

const FAKE_WALLET = { address: "0x7A2f…9c1B", name: "Alpha" };

const WIZARD_STEPS = ["Identity", "Strategy", "Risk", "Capital", "Markets", "Safety", "Review"];

const AGENT_VISUALS = ["◆", "✦", "◉", "▲", "⬡", "◈", "⚡", "☾"];

const STRATEGY_OPTIONS = [
  { id: "momentum", icon: "↗", title: "Momentum", subtitle: "Follow multi-timeframe trend breakouts" },
  { id: "dca",      icon: "⊕", title: "DCA",      subtitle: "Scheduled accumulation across market conditions" },
  { id: "grid",     icon: "▦", title: "Grid",     subtitle: "Range-bound market-making with preset levels" },
  { id: "mm",       icon: "≋", title: "Market-maker", subtitle: "Tight spreads on high-volume pairs" },
];

const RISK_TIERS = [
  { id: "conservative", label: "Conservative", drawdown: 1.5, weight: 0.5 },
  { id: "moderate",     label: "Moderate",     drawdown: 5,   weight: 1   },
  { id: "aggressive",   label: "Aggressive",   drawdown: 12,  weight: 1.6 },
];

const PAIR_OPTIONS = [
  { value: "USDC", label: "USDC" },
  { value: "USDT", label: "USDT" },
  { value: "ETH",  label: "ETH" },
  { value: "SOL",  label: "SOL" },
  { value: "BTC",  label: "BTC" },
  { value: "ARB",  label: "ARB" },
  { value: "OP",   label: "OP" },
  { value: "AVAX", label: "AVAX" },
];

const ALLOWED_PAIR_CHIPS = ["ETH", "SOL", "BTC", "ARB", "OP", "AVAX"];

// Registry for the UX Patterns section — organised by the agent lifecycle:
// converse → trust → control (consent · visibility · accountability) →
// output → ambient. Numbering is derived from position, so inserting a
// pattern renumbers everything after it automatically. Components are
// referenced by name (function declarations hoist).
const PATTERN_GROUPS = [
  {
    id: "grp-conversation",
    title: "Conversation core",
    blurb: "The baseline chat surface. Every AI product ships these — so the play here is craft, not coverage.",
    patterns: [
      { id: "pat-prompt-input",   title: "Prompt input",     desc: "The composer — attachments, model pill, and a stop-while-streaming state.", component: "PromptInputPattern",                   height: 380 },
      { id: "pat-message",        title: "Message thread",   desc: "User and assistant turns with hover actions and response branches.",        component: "MessageThreadPattern",                 height: 420 },
      { id: "pat-streaming",      title: "Streaming answer", desc: "Streamed reply with inline sources and follow-ups.",                        component: "StreamingAnswerPattern", replay: true, height: 520 },
      { id: "pat-chat",           title: "Agent chat",       desc: "Chat panel with reasoning chips and a composer.",                           component: "AgentChatPattern",       replay: true, height: 640 },
      { id: "pat-code",           title: "Code block",       desc: "Agent-written code streaming in line by line with syntax tint.",            component: "CodeBlockPattern",       replay: true, height: 460 },
      { id: "pat-model-context",  title: "Model & context",  desc: "Model picker with capability badges and a live context-window meter.",      component: "ModelContextPattern",                  height: 480 },
    ],
  },
  {
    id: "grp-trust",
    title: "Trust & transparency",
    blurb: "Why the user should believe the output — reasoning made visible, sources attached, confidence stated honestly.",
    patterns: [
      { id: "pat-thinking",       title: "Thinking",         desc: "Expandable reasoning trace while the agent works.",                         component: "ThinkingTracePattern",   replay: true, height: 460 },
      { id: "pat-citations",      title: "Inline citations", desc: "Numbered source chips with an anchored popover pager.",                     component: "CitationsPattern",                     height: 480 },
      { id: "pat-context",        title: "Context sources",  desc: "Retrieved knowledge chunks with their sources.",                            component: "ContextSourcesPattern",                height: 500 },
      { id: "pat-confidence",     title: "Confidence states", desc: "One claim rendered at three confidence levels — low is a designed state.", component: "ConfidencePattern",                    height: 520 },
      { id: "pat-recommendation", title: "Recommendation",   desc: "Agent suggestion with confidence and clear actions.",                       component: "RecommendationPattern",  replay: true, height: 580 },
      { id: "pat-feedback",       title: "Feedback capture", desc: "Thumbs with a structured follow-up on negative.",                           component: "FeedbackPattern",                      height: 480 },
    ],
  },
  {
    id: "grp-control",
    title: "Agentic control",
    blurb: "The delegation lifecycle — consent before the agent acts, visibility while it works, accountability after. Intervention points that don't look like errors.",
    patterns: [
      { id: "pat-plan",           title: "Plan preview",     desc: "The agent states its plan in plain language — proceed, edit, or take over.", component: "PlanPreviewPattern",    replay: true, height: 540 },
      { id: "pat-approval",       title: "Approval card",    desc: "Human-in-the-loop question before the agent acts.",                         component: "ApprovalCardPattern",    replay: true, height: 540 },
      { id: "pat-autonomy",       title: "Autonomy levels",  desc: "Per-task dial for how much the agent may do, observe through autonomous.",  component: "AutonomyPattern",                      height: 560 },
      { id: "pat-permissions",    title: "Permission scope", desc: "Tools, data, and limits the agent can touch — summarised in plain language.", component: "PermissionScopePattern",             height: 680 },
      { id: "pat-queue",          title: "Task queue",       desc: "What the agent will work through — reorder, remove, watch it clear.",       component: "QueuePattern",           replay: true, height: 560 },
      { id: "pat-status",         title: "Agent status",     desc: "Live status pill with rolling phases, pause, and a mid-run redirect.",      component: "AgentStatusPattern",     replay: true, height: 340 },
      { id: "pat-tools",          title: "Tool calls",       desc: "Edits, commands, and reads as a compact activity feed.",                    component: "ToolStreamPattern",      replay: true, height: 600 },
      { id: "pat-tasks",          title: "Task rows",        desc: "Live agent task status — running, failed, completed.",                      component: "AgentTasksPattern",      replay: true, height: 600 },
      { id: "pat-handoff",        title: "Handoff",          desc: "The agent escalates to a human with prepared context — calm, not a failure.", component: "HandoffPattern",       replay: true, height: 480 },
      { id: "pat-receipt",        title: "Action receipt",   desc: "Evidence of what changed, under whose authority — with a time-limited undo.", component: "ActionReceiptPattern", replay: true, height: 500 },
      { id: "pat-checkpoints",    title: "Checkpoints",      desc: "Named restore points — confirm inline and roll back with re-verification.", component: "CheckpointPattern",      replay: true, height: 460 },
      { id: "pat-audit",          title: "Audit log",        desc: "The filterable record of agent actions, with inline receipts.",             component: "AuditLogPattern",                      height: 620 },
      { id: "pat-error-repair",   title: "Error repair",     desc: "The structured mistake — acknowledge, show the fix, offer recourse.",       component: "ErrorRepairPattern",     replay: true, height: 500 },
    ],
  },
  {
    id: "grp-output",
    title: "Output & generative UI",
    blurb: "Where responses stop being text — proposed edits, structured objects, artifacts, and charts.",
    patterns: [
      { id: "pat-artifact",       title: "Artifact",         desc: "Generated content in a versioned container with preview and raw views.",    component: "ArtifactPattern",                      height: 540 },
      { id: "pat-diff-view",      title: "Diff view",        desc: "Proposed code edits as a unified diff with per-hunk accept and reject.",    component: "DiffViewPattern",        replay: true, height: 560 },
      { id: "pat-diff",           title: "Diff table",       desc: "AI-proposed edits sweeping through tabular data.",                          component: "DiffTablePattern",       replay: true, height: 540 },
      { id: "pat-structured",     title: "Structured data",  desc: "Schema output rendered as a readable card, raw JSON one toggle away.",      component: "StructuredDataPattern",                height: 520 },
      { id: "pat-insights",       title: "Insight cards",    desc: "Paged agent insights with live charts.",                                    component: "InsightCardsPattern",                  height: 620 },
      { id: "pat-comparison",     title: "Comparison",       desc: "Two models stream the same prompt side by side — pick a winner.",           component: "ComparisonPattern",      replay: true, height: 500 },
    ],
  },
  {
    id: "grp-ambient",
    title: "Ambient & beyond chat",
    blurb: "The agent outside the thread — boards, nudges, digests, and inline assists that don't make you scroll a transcript to reconstruct state.",
    patterns: [
      { id: "pat-taskboard",      title: "Taskboard",        desc: "The board is primary, chat is secondary — work moves when decisions are needed.", component: "TaskboardPattern", replay: true, height: 440 },
      { id: "pat-inline-assist",  title: "Inline assist",    desc: "Ghost-text completions — accept, dismiss, and watch the agent adapt.",      component: "InlineAssistPattern",    replay: true, height: 380 },
      { id: "pat-nudge",          title: "Nudge",            desc: "A proactive, non-blocking suggestion with a real escape hatch.",            component: "NudgePattern",           replay: true, height: 320 },
      { id: "pat-digest",         title: "Digest",           desc: "While-you-were-away summary with rationale and receipts per action.",       component: "DigestPattern",                        height: 560 },
      { id: "pat-notifications",  title: "Notification center", desc: "The classic panel — agent events with severity, read state, and actions.", component: "NotificationCenterPattern",          height: 560 },
      { id: "pat-search",         title: "Command search",   desc: "Command palette with live filtering and an empty state.",                   component: "CommandSearchPattern",                 height: 540 },
      { id: "pat-agent-setup",    title: "Agent setup",      desc: "Full multi-step setup flow with live preview.",                             component: "AgentSetupPattern",                    height: 760, align: "top" },
    ],
  },
];

// Flat list with derived continuous numbering (01, 02, …) across groups.
const UX_PATTERNS = PATTERN_GROUPS.flatMap(g => g.patterns);
UX_PATTERNS.forEach((p, i) => { p.n = String(i + 1).padStart(2, "0"); });

const PATTERN_ROADMAP = [
  { id: "canvas",   icon: "⬡", title: "Workflow canvas",       desc: "Node-and-edge view of multi-agent pipelines" },
  { id: "voice",    icon: "◉", title: "Voice input",           desc: "Push-to-talk capture with live transcription states" },
  { id: "preview",  icon: "⧉", title: "Live preview",          desc: "Embedded view of what the agent is building" },
  { id: "terminal", icon: "▤", title: "Terminal output",       desc: "Streamed command output for coding agents" },
  { id: "memory",   icon: "☰", title: "Agent memory",          desc: "What the agent knows about you — editable and revocable" },
  { id: "history",  icon: "≡", title: "Conversation history",  desc: "Past sessions with search, pin, and rename" },
];

function ConnectedWalletPill({ theme }) {
  const pal = usePal(theme);
  return (
    <div style={{
      display: "inline-flex", alignItems: "center", gap: 8,
      padding: "4px 10px 4px 4px", borderRadius: tokens.radius.pill,
      background: pal.bgSubtle, border: `1px solid ${pal.borderSubtle}`,
      fontFamily: tokens.font.sans,
      transition: `all ${motion.smooth} ${motion.easeInOut}`,
    }}>
      <Avatar name={FAKE_WALLET.name} size={20} theme={theme} />
      <span style={{ ...tokens.type.xs, color: pal.textSecondary, fontFamily: tokens.font.mono }}>{FAKE_WALLET.address}</span>
      <StatusBadge theme={theme} status="online" pulse>Live</StatusBadge>
    </div>
  );
}

function AgentVisualAvatar({ visual, size = 72, theme }) {
  const pal = usePal(theme);
  return (
    <div style={{
      width: size, height: size, borderRadius: size / 2,
      background: visual ? `linear-gradient(135deg, ${pal.accent}, ${pal.accentHover})` : pal.bgMuted,
      border: `1px solid ${visual ? "transparent" : pal.borderSubtle}`,
      color: "#fff",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: size * 0.42, flexShrink: 0,
      boxShadow: visual ? `0 4px 14px ${pal.accent}33` : "none",
      transition: `all ${motion.smooth} ${motion.easeInOut}`,
      fontFamily: tokens.font.sans,
    }}>{visual || <span style={{ color: pal.textTertiary, fontSize: size * 0.3 }}>?</span>}</div>
  );
}

function AgentPreviewCard({ state, strategyObj, riskObj, budgetNum, theme }) {
  const pal = usePal(theme);
  const hasIdentity = !!(state.name.trim() || state.visual);
  const hasStrategy = !!state.strategy;
  const hasRisk = state.step >= 2;
  const hasCapital = state.step >= 3 && budgetNum > 0;
  const hasMarkets = state.step >= 4;
  const hasSafety = state.step >= 5;
  const anyBuilt = hasIdentity || hasStrategy;

  const fadeIn = { animation: `halaska-fade-in ${motion.smooth} ${motion.easeOut} both` };

  return (
    <div style={{
      padding: 18,
      borderRadius: tokens.radius.lg,
      background: anyBuilt ? (theme === "dark" ? "rgba(42,42,42,0.5)" : "rgba(255,255,255,0.6)") : "transparent",
      border: anyBuilt ? `1px solid ${pal.borderSubtle}` : `1.5px dashed ${pal.borderSubtle}`,
      transition: `all ${motion.smooth} ${motion.easeInOut}`,
      fontFamily: tokens.font.sans,
    }}>
      <Stack gap={14}>
        {/* Identity header */}
        <Stack direction="row" gap={12} align="center">
          <AgentVisualAvatar visual={state.visual} size={44} theme={theme} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <Text size="base" weight="semibold" theme={theme}
              style={{ color: state.name.trim() ? pal.text : pal.textTertiary }}>
              {state.name.trim() || "New agent"}
            </Text>
            <div key={`strat-${state.strategy}-${hasRisk}`} style={fadeIn}>
              {hasStrategy ? (
                <Text size="xs" theme={theme} style={{ color: pal.textSecondary }}>
                  {strategyObj.title}{hasRisk && ` · ${riskObj.label} risk`}
                </Text>
              ) : (
                <Text size="xs" theme={theme} style={{ color: pal.textTertiary }}>
                  Waiting for details…
                </Text>
              )}
            </div>
          </div>
          {hasStrategy && hasRisk && (
            <div key={`badge-${state.risk}`} style={fadeIn}>
              <StatusBadge theme={theme} status={state.risk === "aggressive" ? "error" : state.risk === "moderate" ? "accent" : "online"}>
                {riskObj.label}
              </StatusBadge>
            </div>
          )}
        </Stack>

        {/* Capital row */}
        {hasCapital && (
          <div key={`cap-${budgetNum}-${state.allocPct}`} style={fadeIn}>
            <Divider theme={theme} />
            <div style={{ height: 12 }} />
            <Stack direction="row" gap={32}>
              <Stat theme={theme} label="Budget" value={`${budgetNum.toLocaleString()} ${state.basePair}`} />
              <Stat theme={theme} label="Allocation" value={`${state.allocPct}%`} />
            </Stack>
          </div>
        )}

        {/* Markets row */}
        {hasMarkets && (
          <div key={`pairs-${state.allowedPairs.join(",")}`} style={fadeIn}>
            <Stack gap={6}>
              <Caption theme={theme}>Pairs</Caption>
              <Stack direction="row" gap={6} wrap>
                {state.allowedPairs.length === 0 ? (
                  <Text size="xs" theme={theme} style={{ color: pal.textTertiary }}>None selected</Text>
                ) : state.allowedPairs.map(p => (
                  <Tag key={p} theme={theme}>{p}/{state.basePair}</Tag>
                ))}
              </Stack>
            </Stack>
          </div>
        )}

        {/* Safety badges */}
        {hasSafety && (
          <div key={`safe-${state.stopLoss}-${state.takeProfit}`} style={fadeIn}>
            <Stack gap={6}>
              <Caption theme={theme}>Safety</Caption>
              <Stack direction="row" gap={6} wrap>
                {state.stopLoss   && <StatusBadge theme={theme} status="online">Stop-loss</StatusBadge>}
                {state.takeProfit && <StatusBadge theme={theme} status="online">Take-profit</StatusBadge>}
                {!state.stopLoss && !state.takeProfit && (
                  <Text size="xs" theme={theme} style={{ color: pal.textTertiary }}>No safety rules</Text>
                )}
              </Stack>
            </Stack>
          </div>
        )}
      </Stack>
    </div>
  );
}

function AgentSetupPattern({ theme }) {
  const pal = usePal(theme);
  const initial = {
    step: 0,
    name: "",
    visual: null,
    strategy: null,
    risk: "moderate",
    budgetUsdc: "",
    allocPct: 25,
    basePair: "USDC",
    allowedPairs: ["ETH", "SOL"],
    stopLoss: true,
    takeProfit: true,
    deployed: false,
    agentId: null,
  };
  const [state, setState] = useState(initial);
  const set = (patch) => setState(s => ({ ...s, ...patch }));

  // Derived
  const strategyObj = STRATEGY_OPTIONS.find(s => s.id === state.strategy);
  const riskObj = RISK_TIERS.find(r => r.id === state.risk);
  const budgetNum = Number(String(state.budgetUsdc).replace(/[^0-9.]/g, "")) || 0;
  const confidenceScore = Math.max(5, Math.min(99,
    Math.round(95 - (riskObj?.weight || 1) * 18 - state.allocPct * 0.35)
  ));
  const canAdvance = [
    !!state.name.trim() && !!state.visual, // 0 Identity
    !!state.strategy,                      // 1 Strategy
    true,                                  // 2 Risk (has default)
    budgetNum > 0,                         // 3 Capital
    state.allowedPairs.length > 0,         // 4 Markets
    true,                                  // 5 Safety (has defaults)
    true,                                  // 6 Review
  ];

  const next = () => {
    if (state.step < WIZARD_STEPS.length - 1) set({ step: state.step + 1 });
    else deploy();
  };
  const back = () => state.step > 0 && set({ step: state.step - 1 });
  const deploy = () => {
    const id = "agt_" + Math.random().toString(16).slice(2, 8);
    set({ deployed: true, agentId: id });
  };
  const reset = () => setState(initial);

  const togglePair = (p) => {
    const has = state.allowedPairs.includes(p);
    set({ allowedPairs: has ? state.allowedPairs.filter(x => x !== p) : [...state.allowedPairs, p] });
  };

  // ── Step bodies ──────────────────────────────────────────
  const StepIdentity = () => (
    <Stack gap={20}>
      <TextInput theme={theme}
        label="Name your agent"
        placeholder="Alpha Agent"
        value={state.name}
        onChange={(v) => set({ name: v })}
      />
      <Stack gap={8}>
        <Label theme={theme}>Choose a visual</Label>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(8, 1fr)", gap: 8 }}>
          {AGENT_VISUALS.map(g => {
            const selected = state.visual === g;
            return (
              <button key={g} onClick={() => set({ visual: g })}
                style={{
                  ...interactiveBase, aspectRatio: "1 / 1",
                  borderRadius: tokens.radius.md,
                  background: selected ? pal.accentBg : pal.bgSubtle,
                  border: `1.5px solid ${selected ? pal.accent : "transparent"}`,
                  color: selected ? pal.accent : pal.textSecondary,
                  fontSize: 20, display: "flex", alignItems: "center", justifyContent: "center",
                  fontFamily: tokens.font.sans,
                  transition: `all ${motion.normal} ${motion.easeInOut}`,
                }}>{g}</button>
            );
          })}
        </div>
      </Stack>
    </Stack>
  );

  const StepStrategy = () => (
    <Stack gap={8}>
      <Label theme={theme}>Choose a strategy</Label>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        {STRATEGY_OPTIONS.map(s => {
          const selected = state.strategy === s.id;
          return (
            <Card key={s.id} theme={theme} padding={14} onClick={() => set({ strategy: s.id })}
              style={{
                cursor: "pointer",
                border: `1.5px solid ${selected ? pal.accent : pal.borderSubtle}`,
                background: selected ? pal.accentBg : undefined,
                transition: `all ${motion.normal} ${motion.easeInOut}`,
              }}>
              <Stack gap={6}>
                <Stack direction="row" gap={8} align="center">
                  <div style={{
                    width: 28, height: 28, borderRadius: 14,
                    background: selected ? pal.accent : pal.bgMuted,
                    color: selected ? "#fff" : pal.textSecondary,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 13, flexShrink: 0,
                    transition: `all ${motion.normal} ${motion.easeInOut}`,
                  }}>{s.icon}</div>
                  <Text size="base" weight="semibold" theme={theme}>{s.title}</Text>
                </Stack>
                <Text size="xs" theme={theme} style={{ color: pal.textSecondary, lineHeight: 1.5 }}>{s.subtitle}</Text>
              </Stack>
            </Card>
          );
        })}
      </div>
    </Stack>
  );

  const StepRisk = () => (
    <Stack gap={12}>
      <Label theme={theme}>Risk tier</Label>
      <SegmentedControl theme={theme}
        options={RISK_TIERS.map(r => r.label)}
        value={riskObj?.label || "Moderate"}
        onChange={(label) => set({ risk: RISK_TIERS.find(r => r.label === label).id })}
      />
      <Caption theme={theme}>Max drawdown ≈ {riskObj?.drawdown}% · determines stop-loss bands and position sizing.</Caption>
    </Stack>
  );

  const StepCapital = () => (
    <Stack gap={20}>
      <TextInput theme={theme}
        label="Budget (USDC)"
        placeholder="1,000"
        icon="$"
        value={state.budgetUsdc}
        onChange={(v) => set({ budgetUsdc: v.replace(/[^0-9.,]/g, "") })}
        caption="The max capital this agent can take on. You can withdraw at any time."
      />
      <SpringSlider theme={theme}
        label={`Allocate ${state.allocPct}% of wallet`}
        value={state.allocPct} onChange={(v) => set({ allocPct: v })}
        min={0} max={100}
      />
      <Card theme={theme} padding={14}>
        <Stack gap={10}>
          <Stack direction="row" align="center" justify="space-between">
            <Text size="sm" weight="semibold" theme={theme}>Risk score</Text>
            <Text size="sm" theme={theme} style={{ fontFamily: tokens.font.mono, color: pal.text }}>{confidenceScore}%</Text>
          </Stack>
          <ConfidenceBar value={confidenceScore} theme={theme} />
          <Caption theme={theme}>{confidenceScore >= 70 ? "Conservative posture — steady compounding." : confidenceScore >= 40 ? "Balanced posture — moderate drawdowns." : "Aggressive posture — higher volatility."}</Caption>
        </Stack>
      </Card>
    </Stack>
  );

  const StepMarkets = () => (
    <Stack gap={20}>
      <Combobox theme={theme} label="Base currency"
        options={PAIR_OPTIONS.filter(o => ["USDC", "USDT"].includes(o.value))}
        value={state.basePair} onChange={(v) => set({ basePair: v })}
      />
      <Stack gap={8}>
        <Label theme={theme}>Allowed pairs</Label>
        <Stack direction="row" gap={8} wrap>
          {ALLOWED_PAIR_CHIPS.map(p => (
            <Chip key={p} theme={theme}
              selected={state.allowedPairs.includes(p)}
              onToggle={() => togglePair(p)}>{p}/{state.basePair}</Chip>
          ))}
        </Stack>
        <Caption theme={theme}>Agent will only execute trades on these pairs.</Caption>
      </Stack>
    </Stack>
  );

  const StepSafety = () => (
    <Stack gap={20}>
      <Label theme={theme}>Safety controls</Label>
      <Stack gap={12}>
        <SwitchToggle theme={theme} checked={state.stopLoss}   onChange={(v) => set({ stopLoss: v })}   label="Enforce stop-loss" />
        <SwitchToggle theme={theme} checked={state.takeProfit} onChange={(v) => set({ takeProfit: v })} label="Auto take-profit" />
      </Stack>
      <Caption theme={theme}>Agent will exit positions automatically based on these rules.</Caption>
    </Stack>
  );

  const StepReview = () => (
    <Stack gap={16}>
      <Text size="sm" theme={theme} style={{ color: pal.textSecondary, lineHeight: 1.6 }}>
        Your agent is ready. Review the summary above and deploy when you're happy.
      </Text>
      <AlertBanner theme={theme} variant="warning"
        title="Agents trade with real capital"
        description="You can pause or kill your agent at any time from Agent Settings." />
    </Stack>
  );

  const StepBody = [StepIdentity, StepStrategy, StepRisk, StepCapital, StepMarkets, StepSafety, StepReview][state.step];

  // ── Deployed success ─────────────────────────────────────
  if (state.deployed) {
    return (
      <Stack gap={24} style={{ width: 520, maxWidth: "100%", alignItems: "center", textAlign: "center" }}>
        <AgentVisualAvatar visual={state.visual} size={72} theme={theme} />
        <Stack gap={4} align="center">
          <Heading level={4} theme={theme}>{state.name || "Agent"} deployed</Heading>
          <Text size="sm" theme={theme} style={{ color: pal.textSecondary, fontFamily: tokens.font.mono }}>{state.agentId}</Text>
        </Stack>
        <Stack direction="row" gap={32} justify="center">
          <Stat theme={theme} label="Strategy" value={strategyObj?.title || "—"} />
          <Stat theme={theme} label="Budget"   value={`${budgetNum.toLocaleString()} ${state.basePair}`} />
          <Stat theme={theme} label="Status"   value="Running" change="+live" />
        </Stack>
        <Button theme={theme} variant="outline" size="sm" onClick={reset}>Configure another</Button>
      </Stack>
    );
  }

  // ── Wizard ──────────────────────────────────────────────
  return (
    <Stack gap={20} style={{ width: 520, maxWidth: "100%" }}>
      <Stepper theme={theme} steps={WIZARD_STEPS} current={state.step} />
      <ConnectedWalletPill theme={theme} />
      <AgentPreviewCard state={state} strategyObj={strategyObj} riskObj={riskObj} budgetNum={budgetNum} theme={theme} />
      <Divider theme={theme} />
      <div style={{ minHeight: 240 }}>
        <StepBody />
      </div>
      <Divider theme={theme} />
      <Stack direction="row" align="center" justify="space-between">
        <Button theme={theme} variant="ghost" size="sm" disabled={state.step === 0} onClick={back}>← Back</Button>
        {state.step < WIZARD_STEPS.length - 1 ? (
          <Button theme={theme} variant="primary" size="sm" disabled={!canAdvance[state.step]} onClick={next}>Next →</Button>
        ) : (
          <Button theme={theme} variant="primary" size="sm" disabled={!canAdvance[state.step] || !state.strategy || budgetNum <= 0 || !state.visual || !state.name.trim()} onClick={deploy}>Deploy agent</Button>
        )}
      </Stack>
    </Stack>
  );
}

// ─── UX PATTERNS · AI interface patterns ─────────────────────
// Recreated from scratch for AI-native products: reasoning traces,
// streamed answers, approvals, tool activity, live tasks, grounding,
// proposed edits, command search, insights, and agent chat.

function AgentGlyph({ size = 24, theme }) {
  const pal = usePal(theme);
  return (
    <div style={{
      width: size, height: size, borderRadius: size / 2, flexShrink: 0,
      background: `linear-gradient(135deg, ${pal.accent}, ${pal.accentHover})`,
      color: "#fff", display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: Math.round(size * 0.46),
      transition: `all ${motion.smooth} ${motion.easeInOut}`,
    }}>✦</div>
  );
}

// 01 · Thinking — elapsed trace that auto-collapses when done
const THINKING_TRACE_STEPS = [
  { label: "Reading 24h order flow",     detail: "SOL/USDC · 3 venues" },
  { label: "Scanning funding rates",     detail: "perps vs. spot basis" },
  { label: "Comparing momentum signals", detail: "4h and 1d timeframes" },
  { label: "Writing the trade plan",     detail: "entry, size, invalidation" },
];

function ThinkingTracePattern({ theme }) {
  const pal = usePal(theme);
  const [elapsed, setElapsed] = useState(0);
  const [stepIdx, setStepIdx] = useState(0);
  const [done, setDone] = useState(false);
  const [open, setOpen] = useState(true);
  const [hover, setHover] = useState(false);

  useEffect(() => {
    const t0 = Date.now();
    let collapse;
    const iv = setInterval(() => {
      const dt = (Date.now() - t0) / 1000;
      setElapsed(dt);
      setStepIdx(Math.min(THINKING_TRACE_STEPS.length - 1, Math.floor(dt / 1.1)));
      if (dt >= 4.4) {
        clearInterval(iv);
        setElapsed(4.4); setDone(true);
        collapse = setTimeout(() => setOpen(false), 1000);
      }
    }, 100);
    return () => { clearInterval(iv); clearTimeout(collapse); };
  }, []);

  return (
    <div style={{ width: 400, maxWidth: "100%", fontFamily: tokens.font.sans }}>
      <button onClick={() => done && setOpen(o => !o)}
        onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
        style={{
          ...interactiveBase, display: "flex", alignItems: "center", gap: 10,
          width: "100%", padding: "10px 12px", borderRadius: tokens.radius.md,
          background: hover && done ? pal.bgSubtle : "transparent",
          cursor: done ? "pointer" : "default", textAlign: "left",
        }}>
        {done ? (
          <>
            <ChevronIcon size={12} direction={open ? "down" : "right"} style={{ color: pal.textTertiary }} />
            <Text size="sm" weight="medium" secondary theme={theme}>Thought for 4.4 seconds</Text>
          </>
        ) : (
          <>
            <ThinkingIndicator label="" size="sm" theme={theme} />
            <Text size="sm" weight="medium" secondary theme={theme}>Thinking</Text>
            <span style={{ ...tokens.type.sm, color: pal.textTertiary, fontFamily: tokens.font.mono, fontVariantNumeric: "tabular-nums", marginLeft: "auto" }}>
              {elapsed.toFixed(1)}s
            </span>
          </>
        )}
      </button>
      <div style={{
        overflow: "hidden", maxHeight: open ? 320 : 0, opacity: open ? 1 : 0,
        transition: `max-height 0.45s ${motion.emphasized}, opacity ${motion.smooth} ${motion.easeInOut}`,
      }}>
        <div style={{ padding: "8px 12px 12px 17px", display: "flex", flexDirection: "column", gap: 0 }}>
          {THINKING_TRACE_STEPS.map((s, i) => {
            const reached = i <= stepIdx;
            const active = i === stepIdx && !done;
            if (!reached) return null;
            return (
              <div key={i} style={{
                display: "flex", gap: 12, position: "relative", paddingBottom: 14,
                animation: `halaska-step-in 0.4s ${motion.emphasized} both`,
              }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 8 }}>
                  <span style={{
                    width: 7, height: 7, borderRadius: 4, marginTop: 5, flexShrink: 0,
                    background: active ? pal.accent : pal.textMuted,
                    transition: `background ${motion.smooth} ${motion.easeInOut}`,
                  }} />
                  {i < THINKING_TRACE_STEPS.length - 1 && i < stepIdx && (
                    <span style={{ width: 1, flex: 1, background: pal.borderSubtle, marginTop: 4 }} />
                  )}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <Text size="sm" weight={active ? "medium" : "regular"} theme={theme}
                    style={{ color: active ? pal.text : pal.textSecondary, display: "block" }}>{s.label}</Text>
                  <Text size="xs" theme={theme} style={{ color: pal.textTertiary, fontFamily: tokens.font.mono }}>{s.detail}</Text>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// 02 · Streaming answer — inline source chip, sources row, follow-ups
const STREAM_ANSWERS = {
  default: {
    segments: [
      { t: "SOL is your strongest momentum pair this week — up 9.4% with funding still neutral, which usually precedes continuation." },
      { chip: "coinglass.com" },
      { t: " Perp open interest is climbing in the same range, so the move has real positioning behind it." },
    ],
    followups: ["Which pairs led the last three rallies?", "Compare SOL and ETH funding curves"],
  },
  followup: {
    segments: [
      { t: "ETH funding has stayed pinned near zero while SOL's is drifting positive." },
      { chip: "kaiko.com" },
      { t: " That spread usually resolves with SOL longs paying up — worth watching if you're sizing both." },
    ],
    followups: ["Show the funding spread over 30 days", "Which venue has the cheapest SOL perps?"],
  },
};

const STREAM_SOURCES = [
  { name: "Coinglass",      domain: "coinglass.com" },
  { name: "Kaiko Research", domain: "kaiko.com" },
  { name: "Birdeye",        domain: "birdeye.so" },
];

function InlineSourceChip({ domain, theme }) {
  const pal = usePal(theme);
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5, verticalAlign: "baseline",
      padding: "1px 8px", margin: "0 3px", borderRadius: tokens.radius.pill,
      background: pal.bgSubtle, border: `1px solid ${pal.borderSubtle}`,
      ...tokens.type.xs, color: pal.textSecondary, fontFamily: tokens.font.sans,
      animation: `halaska-scale-in 0.25s ${motion.easeOut} both`,
      transition: `all ${motion.smooth} ${motion.easeInOut}`, whiteSpace: "nowrap",
    }}>
      <span style={{ width: 5, height: 5, borderRadius: 3, background: pal.accent }} />
      {domain}
    </span>
  );
}

function StreamingAnswerPattern({ theme }) {
  const pal = usePal(theme);
  const [answerKey, setAnswerKey] = useState("default");
  const [count, setCount] = useState(0);
  const [phase, setPhase] = useState("thinking"); // thinking | streaming | done
  const answer = STREAM_ANSWERS[answerKey];
  const totalChars = answer.segments.reduce((n, s) => n + (s.t ? s.t.length : 0), 0);

  useEffect(() => {
    setCount(0); setPhase("thinking");
    let iv;
    const think = setTimeout(() => {
      setPhase("streaming");
      iv = setInterval(() => {
        setCount(c => {
          if (c + 2 >= totalChars) { clearInterval(iv); setPhase("done"); return totalChars; }
          return c + 2;
        });
      }, 18);
    }, 700);
    return () => { clearTimeout(think); clearInterval(iv); };
  }, [answerKey, totalChars]);

  // Render segments up to the current char count
  let used = 0;
  const rendered = answer.segments.map((s, i) => {
    if (s.chip) return used <= count ? <InlineSourceChip key={i} domain={s.chip} theme={theme} /> : null;
    const remaining = Math.max(0, count - used);
    const shown = s.t.slice(0, remaining);
    used += s.t.length;
    return <span key={i}>{shown}</span>;
  });

  return (
    <div style={{ width: 440, maxWidth: "100%", fontFamily: tokens.font.sans }}>
      <Stack gap={16}>
        <Stack direction="row" gap={10} align="center">
          <AgentGlyph size={24} theme={theme} />
          {phase === "thinking"
            ? <ThinkingIndicator label="Checking market structure" size="sm" theme={theme} />
            : <Caption theme={theme}>Answer</Caption>}
        </Stack>
        <div style={{ ...tokens.type.md, color: pal.text, lineHeight: 1.7, minHeight: 96, transition: `color ${motion.smooth} ${motion.easeInOut}` }}>
          {phase !== "thinking" && rendered}
          {phase === "streaming" && (
            <span style={{ display: "inline-block", width: 2, height: "1.05em", background: pal.accent, marginLeft: 1, verticalAlign: "text-bottom", animation: "halaska-blink 1s step-end infinite" }} />
          )}
        </div>
        {phase === "done" && (
          <div style={{ animation: `halaska-step-in 0.4s ${motion.emphasized} both` }}>
            <Divider theme={theme} />
            <div style={{ height: 14 }} />
            <Stack gap={10}>
              <Caption theme={theme}>{STREAM_SOURCES.length} sources</Caption>
              <Stack direction="row" gap={8} wrap>
                {STREAM_SOURCES.map(s => (
                  <span key={s.domain} style={{
                    display: "inline-flex", alignItems: "center", gap: 7, padding: "5px 12px",
                    borderRadius: tokens.radius.pill, background: pal.bgSubtle,
                    border: `1px solid ${pal.borderSubtle}`, ...tokens.type.sm, color: pal.textSecondary,
                    transition: `all ${motion.smooth} ${motion.easeInOut}`,
                  }}>
                    <span style={{ width: 6, height: 6, borderRadius: 3, background: pal.accent }} />
                    {s.name}
                    <span style={{ color: pal.textTertiary, fontFamily: tokens.font.mono, ...tokens.type.xs }}>{s.domain}</span>
                  </span>
                ))}
              </Stack>
            </Stack>
            <div style={{ height: 18 }} />
            <Stack gap={8}>
              <Caption theme={theme}>Follow-ups</Caption>
              <Stack gap={6}>
                {answer.followups.map(f => (
                  <FollowupRow key={f} label={f} theme={theme}
                    onClick={() => setAnswerKey(k => k === "default" ? "followup" : "default")} />
                ))}
              </Stack>
            </Stack>
          </div>
        )}
      </Stack>
    </div>
  );
}

function FollowupRow({ label, onClick, theme }) {
  const pal = usePal(theme);
  const [hover, setHover] = useState(false);
  return (
    <button onClick={onClick}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        ...interactiveBase, display: "flex", alignItems: "center", justifyContent: "space-between",
        gap: 12, width: "100%", padding: "9px 12px", borderRadius: tokens.radius.md,
        background: hover ? pal.bgSubtle : "transparent", textAlign: "left",
        ...tokens.type.sm, color: hover ? pal.text : pal.textSecondary, fontFamily: tokens.font.sans,
      }}>
      {label}
      <ChevronIcon size={11} direction="right" style={{ color: pal.textTertiary, opacity: hover ? 1 : 0.5 }} />
    </button>
  );
}

// 03 · Approval card — the agent asks before acting
const APPROVAL_OPTIONS = [
  { id: "scale", title: "Scale in over 3 days",  sub: "Lower slippage, slower exposure" },
  { id: "now",   title: "Full size now",         sub: "Immediate exposure at market" },
  { id: "wait",  title: "Wait for the retest",   sub: "Only act if $148 holds as support" },
];

function ApprovalCardPattern({ theme }) {
  const pal = usePal(theme);
  const [choice, setChoice] = useState(null);
  const [approved, setApproved] = useState(false);
  const chosen = APPROVAL_OPTIONS.find(o => o.id === choice);

  if (approved) {
    return (
      <div style={{ width: 420, maxWidth: "100%", animation: `halaska-scale-in 0.3s ${motion.easeOut} both` }}>
        <Card theme={theme} padding={20}>
          <Stack direction="row" gap={12} align="center">
            <span style={{
              width: 28, height: 28, borderRadius: 14, background: pal.successBg,
              display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
            }}>
              <svg viewBox="0 0 12 12" width="12" height="12" fill="none" stroke={pal.success} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="2,6 5,9 10,3" style={{ strokeDasharray: 14, strokeDashoffset: 14, animation: `halaska-check-draw 0.3s ${motion.easeOut} 0.1s forwards` }} />
              </svg>
            </span>
            <div style={{ flex: 1 }}>
              <Text size="base" weight="semibold" theme={theme} style={{ display: "block" }}>Approved — {chosen.title.toLowerCase()}</Text>
              <Text size="sm" secondary theme={theme}>The agent picked up where it left off.</Text>
            </div>
            <StatusBadge theme={theme} status="online" pulse>Resumed</StatusBadge>
          </Stack>
        </Card>
      </div>
    );
  }

  return (
    <div style={{ width: 420, maxWidth: "100%" }}>
      <Card theme={theme} padding={20}>
        <Stack gap={16}>
          <Stack direction="row" gap={10} align="center">
            <AgentGlyph size={24} theme={theme} />
            <div style={{ flex: 1 }}>
              <Caption theme={theme}>Needs your call</Caption>
            </div>
            <StatusBadge theme={theme} status="pending">Paused</StatusBadge>
          </Stack>
          <Text size="md" weight="semibold" theme={theme}>How should I enter the SOL position?</Text>
          <Stack gap={8}>
            {APPROVAL_OPTIONS.map(o => {
              const active = choice === o.id;
              return (
                <button key={o.id} onClick={() => setChoice(o.id)}
                  style={{
                    ...interactiveBase, display: "flex", alignItems: "center", gap: 12,
                    width: "100%", padding: "12px 14px", textAlign: "left",
                    borderRadius: tokens.radius.md,
                    background: active ? pal.accentBg : pal.bgSubtle,
                    boxShadow: active ? `inset 0 0 0 1.5px ${pal.accent}` : `inset 0 0 0 1px ${pal.borderSubtle}`,
                  }}>
                  <span style={{
                    width: 14, height: 14, borderRadius: 7, flexShrink: 0,
                    border: active ? "none" : `1.5px solid ${pal.border}`,
                    background: active ? pal.accent : "transparent",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    transition: `all ${motion.spring} ${motion.springCurve}`,
                  }}>
                    {active && <span style={{ width: 5, height: 5, borderRadius: 3, background: "#fff", animation: `halaska-radio-dot-in 0.35s ${motion.springCurve} both` }} />}
                  </span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <Text size="base" weight="medium" theme={theme} style={{ display: "block" }}>{o.title}</Text>
                    <Text size="sm" theme={theme} style={{ color: pal.textTertiary }}>{o.sub}</Text>
                  </div>
                </button>
              );
            })}
          </Stack>
          <Stack direction="row" gap={8} justify="flex-end">
            <Button theme={theme} variant="ghost" size="sm">Skip</Button>
            <Button theme={theme} variant="accent" size="sm" disabled={!choice} onClick={() => setApproved(true)}>Approve</Button>
          </Stack>
        </Stack>
      </Card>
    </div>
  );
}

// 04 · Tool calls — agent activity as a compact feed
const TOOL_EVENTS = [
  { kind: "thinking", lines: [
    "Funding flips positive after the close, so the entry window is tonight.",
    "Sizing the position against a 12% drawdown budget.",
  ]},
  { kind: "write", file: "strategy.ts", meta: "Write · 204 lines", lines: [
    { sign: "+", code: 'const window = candles.filter(c => c.vol > p95)' },
    { sign: "+", code: 'return plan(window, { pair: "SOL/USDC" })' },
  ]},
  { kind: "run", cmd: "npm run backtest", out: ["✓ built in 1.2s", "✓ 34 checks passed"] },
  { kind: "read", file: "sol-4h.png", meta: "1280 × 720 · candles, 3 months", note: "Momentum holds above the 20-EMA through July." },
];

const TOOL_FILE_CHIPS = [
  { file: "strategy.ts", add: 74, del: 41 },
  { file: "risk.ts",     add: 8,  del: 2 },
  { file: "pairs.json",  add: 13, del: 0 },
];

function ToolStreamPattern({ theme }) {
  const pal = usePal(theme);
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const iv = setInterval(() => {
      setIdx(i => {
        if (i >= TOOL_EVENTS.length) { clearInterval(iv); return i; }
        return i + 1;
      });
    }, 950);
    return () => clearInterval(iv);
  }, []);

  const finished = idx >= TOOL_EVENTS.length;
  const monoXs = { ...tokens.type.xs, fontFamily: tokens.font.mono };

  return (
    <div style={{ width: 440, maxWidth: "100%", fontFamily: tokens.font.sans }}>
      <Stack gap={14}>
        <Stack direction="row" gap={10} align="center">
          <AgentGlyph size={24} theme={theme} />
          <Text size="sm" weight="medium" secondary theme={theme}>4 tool calls, 2 messages</Text>
          {!finished && <div style={{ marginLeft: "auto" }}><ThinkingIndicator label="" size="sm" theme={theme} /></div>}
        </Stack>
        <Stack gap={8}>
          {TOOL_EVENTS.slice(0, idx).map((e, i) => (
            <div key={i} style={{ animation: `halaska-step-in 0.4s ${motion.emphasized} both` }}>
              {e.kind === "thinking" && (
                <div style={{ padding: "4px 2px" }}>
                  <Caption theme={theme} style={{ display: "block", marginBottom: 4 }}>Thinking</Caption>
                  {e.lines.map((l, j) => (
                    <Text key={j} size="sm" secondary theme={theme} style={{ display: "block", lineHeight: 1.6 }}>{l}</Text>
                  ))}
                </div>
              )}
              {e.kind === "write" && (
                <div style={{ borderRadius: tokens.radius.md, background: pal.bgSubtle, border: `1px solid ${pal.borderSubtle}`, overflow: "hidden", transition: `all ${motion.smooth} ${motion.easeInOut}` }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", borderBottom: `1px solid ${pal.borderSubtle}` }}>
                    <Text size="sm" weight="medium" theme={theme} mono>{e.file}</Text>
                    <span style={{ ...monoXs, color: pal.textTertiary, marginLeft: "auto" }}>{e.meta}</span>
                  </div>
                  <div style={{ padding: "8px 12px" }}>
                    {e.lines.map((l, j) => (
                      <div key={j} style={{ ...monoXs, lineHeight: 1.9, color: pal.success, whiteSpace: "pre", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {l.sign} {l.code}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {e.kind === "run" && (
                <div style={{ borderRadius: tokens.radius.md, background: pal.bgSubtle, border: `1px solid ${pal.borderSubtle}`, padding: "8px 12px", transition: `all ${motion.smooth} ${motion.easeInOut}` }}>
                  <Text size="sm" mono theme={theme} style={{ display: "block", marginBottom: 4 }}>$ {e.cmd}</Text>
                  {e.out.map((o, j) => (
                    <span key={j} style={{ ...monoXs, color: pal.success, display: "block", lineHeight: 1.8 }}>{o}</span>
                  ))}
                </div>
              )}
              {e.kind === "read" && (
                <div style={{ borderRadius: tokens.radius.md, background: pal.bgSubtle, border: `1px solid ${pal.borderSubtle}`, padding: "8px 12px", transition: `all ${motion.smooth} ${motion.easeInOut}` }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <Text size="sm" weight="medium" mono theme={theme}>{e.file}</Text>
                    <span style={{ ...monoXs, color: pal.textTertiary, marginLeft: "auto" }}>{e.meta}</span>
                  </div>
                  <Text size="sm" secondary theme={theme} style={{ display: "block", marginTop: 4 }}>{e.note}</Text>
                </div>
              )}
            </div>
          ))}
        </Stack>
        {finished && (
          <div style={{ animation: `halaska-step-in 0.4s ${motion.emphasized} both` }}>
            <Stack direction="row" gap={6} wrap>
              {TOOL_FILE_CHIPS.map(c => (
                <span key={c.file} style={{
                  display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 10px",
                  borderRadius: tokens.radius.pill, background: pal.bgSubtle,
                  border: `1px solid ${pal.borderSubtle}`, ...monoXs, color: pal.textSecondary,
                  transition: `all ${motion.smooth} ${motion.easeInOut}`,
                }}>
                  {c.file}
                  <span style={{ color: pal.success }}>+{c.add}</span>
                  {c.del > 0 && <span style={{ color: pal.danger }}>−{c.del}</span>}
                </span>
              ))}
            </Stack>
          </div>
        )}
      </Stack>
    </div>
  );
}

// 05 · Task rows — live agent task status
const AGENT_TASKS = [
  { title: "Verify price feeds", meta: "12 pairs", status: "done",
    subs: [{ t: "Matched oracle and DEX quotes", v: "12/12" }, { t: "Flagged stale feeds", v: "0" }] },
  { title: "Build rebalance queue", meta: "7 positions", status: "running",
    subs: [{ t: "Reading fills export", v: "3 files" }, { t: "Scoring liquidation risk", v: "live" }] },
  { title: "Draft exchange support tickets", meta: "2 messages", status: "failed",
    subs: [{ t: "Withdrawal limit increase", v: "draft" }, { t: "API key rotation", v: "draft" }] },
];

function TaskStatusIcon({ status, theme }) {
  const pal = usePal(theme);
  if (status === "done") return (
    <span style={{ width: 20, height: 20, borderRadius: 10, background: pal.successBg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
      <svg viewBox="0 0 12 12" width="10" height="10" fill="none" stroke={pal.success} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="2,6 5,9 10,3" /></svg>
    </span>
  );
  if (status === "failed") return (
    <span style={{ width: 20, height: 20, borderRadius: 10, background: pal.dangerBg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, ...tokens.type.xs, color: pal.danger, fontWeight: tokens.weight.semibold }}>!</span>
  );
  return <span style={{ width: 20, height: 20, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><Spinner size={14} color={pal.accent} /></span>;
}

function AgentTasksPattern({ theme }) {
  const pal = usePal(theme);
  const [pct, setPct] = useState(34);

  useEffect(() => {
    const iv = setInterval(() => setPct(v => (v >= 96 ? 34 : v + 1)), 120);
    return () => clearInterval(iv);
  }, []);

  const badge = { done: ["online", "Completed"], running: ["accent", "Running"], failed: ["error", "Failed"] };

  return (
    <div style={{ width: 460, maxWidth: "100%", fontFamily: tokens.font.sans }}>
      <Stack gap={10}>
        {AGENT_TASKS.map((task, i) => (
          <Card key={i} theme={theme} padding={16}>
            <Stack direction="row" gap={12} align="center">
              <TaskStatusIcon status={task.status} theme={theme} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <Text size="base" weight="medium" theme={theme} truncate style={{ display: "block" }}>{task.title}</Text>
                <Text size="sm" theme={theme} style={{ color: pal.textTertiary }}>{task.meta}</Text>
              </div>
              {task.status === "running" && (
                <span style={{ ...tokens.type.sm, fontFamily: tokens.font.mono, color: pal.textSecondary, fontVariantNumeric: "tabular-nums" }}>{pct}%</span>
              )}
              <StatusBadge theme={theme} status={badge[task.status][0]} pulse={task.status === "running"}>{badge[task.status][1]}</StatusBadge>
            </Stack>
            {task.status === "running" && (
              <div style={{ marginTop: 12 }}><Progress value={pct} theme={theme} height={4} /></div>
            )}
            <div style={{ marginTop: 12, paddingLeft: 32, display: "flex", flexDirection: "column", gap: 6 }}>
              {task.subs.map((s, j) => (
                <div key={j} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
                  <Text size="sm" secondary theme={theme}>{s.t}</Text>
                  <span style={{ ...tokens.type.xs, fontFamily: tokens.font.mono, color: pal.textTertiary, fontVariantNumeric: "tabular-nums" }}>
                    {task.status === "running" && s.v === "live" ? `${pct}%` : s.v}
                  </span>
                </div>
              ))}
              {task.status === "failed" && (
                <div style={{ marginTop: 4 }}>
                  <LinkButton theme={theme} size="sm">Retry both drafts</LinkButton>
                </div>
              )}
            </div>
          </Card>
        ))}
      </Stack>
    </div>
  );
}

// 06 · Recommendation — suggestion with confidence and actions
const RECO_ALTERNATIVES = [
  { title: "Rotate into ETH instead", status: "pending", label: "Needs review" },
  { title: "Full rebalance across all pairs", status: "offline", label: "No signal" },
];

function RecommendationPattern({ theme }) {
  const pal = usePal(theme);
  const [accepted, setAccepted] = useState(false);
  const [showAlts, setShowAlts] = useState(true);

  return (
    <div style={{ width: 440, maxWidth: "100%", fontFamily: tokens.font.sans }}>
      <Card theme={theme} padding={20}>
        <Stack gap={16}>
          <Stack direction="row" gap={10} align="center">
            <AgentGlyph size={24} theme={theme} />
            <Text size="sm" weight="semibold" theme={theme}>Smart rebalance</Text>
            <div style={{ marginLeft: "auto" }}><AISuggestionBadge theme={theme} /></div>
          </Stack>
          <Text size="md" theme={theme} as="p" style={{ margin: 0, lineHeight: 1.7 }}>
            Rotate 15% of <Code theme={theme}>ETH</Code> into <Code theme={theme}>SOL</Code> with entry below <Code theme={theme}>$146</Code> and invalidation at <Code theme={theme}>$139</Code>.
          </Text>
          <Stack gap={8}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <Caption theme={theme}>Signal confidence</Caption>
              <Text size="sm" weight="medium" theme={theme} style={{ color: pal.success }}>High</Text>
            </div>
            <div style={{ display: "flex", gap: 4 }}>
              {[0, 1, 2, 3, 4].map(i => (
                <span key={i} style={{
                  flex: 1, height: 5, borderRadius: 3,
                  background: i < 4 ? pal.success : pal.bgMuted,
                  transition: `background ${motion.smooth} ${motion.easeInOut}`,
                }} />
              ))}
            </div>
          </Stack>
          {showAlts && !accepted && (
            <Stack gap={8}>
              <Caption theme={theme}>Other options</Caption>
              {RECO_ALTERNATIVES.map((a, i) => (
                <div key={i} style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12,
                  padding: "10px 12px", borderRadius: tokens.radius.md, background: pal.bgSubtle,
                  transition: `background ${motion.smooth} ${motion.easeInOut}`,
                }}>
                  <Text size="sm" theme={theme}>{a.title}</Text>
                  <StatusBadge theme={theme} status={a.status}>{a.label}</StatusBadge>
                </div>
              ))}
            </Stack>
          )}
          {accepted ? (
            <div style={{ animation: `halaska-scale-in 0.3s ${motion.easeOut} both` }}>
              <Stack direction="row" gap={10} align="center">
                <span style={{ width: 24, height: 24, borderRadius: 12, background: pal.successBg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg viewBox="0 0 12 12" width="11" height="11" fill="none" stroke={pal.success} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="2,6 5,9 10,3" style={{ strokeDasharray: 14, strokeDashoffset: 14, animation: `halaska-check-draw 0.3s ${motion.easeOut} 0.1s forwards` }} />
                  </svg>
                </span>
                <Text size="base" weight="medium" theme={theme}>Queued for execution</Text>
                <span style={{ marginLeft: "auto" }}><StatusBadge theme={theme} status="online" pulse>Live</StatusBadge></span>
              </Stack>
            </div>
          ) : (
            <Stack direction="row" gap={8} justify="flex-end">
              <Button theme={theme} variant="ghost" size="sm" onClick={() => setShowAlts(s => !s)}>{showAlts ? "Hide alternatives" : "Alternatives"}</Button>
              <Button theme={theme} variant="accent" size="sm" onClick={() => setAccepted(true)}>Accept</Button>
            </Stack>
          )}
        </Stack>
      </Card>
    </div>
  );
}

// 07 · Context sources — retrieved chunks with provenance
const CONTEXT_CHUNKS = [
  { title: "Risk mandate rule", chars: "290 characters", kind: "PDF", src: "Risk Mandate v3.pdf",
    body: "Max single-pair allocation is 25% of portfolio equity; anything above requires manual approval before the agent executes." },
  { title: "Funding snapshot row", chars: "1,250 characters", kind: "CSV", src: "Funding Export.csv",
    body: "8h funding: SOL +0.004%, ETH +0.001%, ARB −0.012%. Negative-funding pairs are excluded from momentum entries." },
];

function ContextChunkCard({ chunk, theme }) {
  const pal = usePal(theme);
  const [hover, setHover] = useState(false);
  return (
    <div onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        padding: 16, borderRadius: tokens.radius.md,
        background: theme === "dark" ? "rgba(42,42,42,0.6)" : "rgba(255,255,255,0.7)",
        border: `1px solid ${hover ? pal.border : pal.borderSubtle}`,
        transform: hover ? "translateY(-1px)" : "none",
        boxShadow: hover ? `0 4px 16px ${pal.shadowMd}` : "none",
        transition: `all ${motion.normal} ${motion.easeInOut}`, cursor: "default",
      }}>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 12, marginBottom: 6 }}>
        <Text size="base" weight="semibold" theme={theme}>{chunk.title}</Text>
        <span style={{ ...tokens.type.xs, fontFamily: tokens.font.mono, color: pal.textTertiary, whiteSpace: "nowrap" }}>{chunk.chars}</span>
      </div>
      <Text size="sm" secondary theme={theme} as="p" style={{ margin: "0 0 12px", lineHeight: 1.65 }}>{chunk.body}</Text>
      <span style={{
        display: "inline-flex", alignItems: "center", gap: 7, padding: "4px 10px 4px 5px",
        borderRadius: tokens.radius.pill, background: pal.bgSubtle, border: `1px solid ${pal.borderSubtle}`,
        transition: `all ${motion.smooth} ${motion.easeInOut}`,
      }}>
        <span style={{
          ...tokens.type.xxs, fontWeight: tokens.weight.semibold, fontFamily: tokens.font.sans,
          padding: "2px 5px", borderRadius: tokens.radius.xs, background: pal.accentBg, color: pal.accent,
          letterSpacing: 0.4,
        }}>{chunk.kind}</span>
        <span style={{ ...tokens.type.xs, color: pal.textSecondary, fontFamily: tokens.font.sans }}>{chunk.src}</span>
      </span>
    </div>
  );
}

function ContextSourcesPattern({ theme }) {
  return (
    <div style={{ width: 440, maxWidth: "100%", fontFamily: tokens.font.sans }}>
      <Stack gap={12}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Caption theme={theme}>Retrieved context</Caption>
          <Badge theme={theme}>32 chunks</Badge>
        </div>
        {CONTEXT_CHUNKS.map(c => <ContextChunkCard key={c.title} chunk={c} theme={theme} />)}
      </Stack>
    </div>
  );
}

// 08 · Diff table — proposed edits with accept/reject
const DIFF_ROWS = [
  { pair: "SOL/USDC",  strategy: { v: "Momentum" },               alloc: { was: "18%", v: "25%" } },
  { pair: "ETH/USDC",  strategy: { was: "Momentum", v: "DCA" },   alloc: { was: "30%", v: "22%" } },
  { pair: "ARB/USDC",  strategy: { v: "Grid" },                   alloc: { was: "12%", v: "8%" } },
  { pair: "AVAX/USDC", strategy: { v: "Momentum" },               alloc: { v: "6%" }, added: true },
];

function DiffCell({ cell, applied, theme }) {
  const pal = usePal(theme);
  if (!cell.was || applied) {
    return <Text size="sm" theme={theme} mono>{cell.v}</Text>;
  }
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 6, whiteSpace: "nowrap" }}>
      <span style={{ ...tokens.type.sm, fontFamily: tokens.font.mono, color: pal.danger, textDecoration: "line-through", opacity: 0.7 }}>{cell.was}</span>
      <span style={{ color: pal.textTertiary, fontSize: 10 }}>→</span>
      <span style={{ ...tokens.type.sm, fontFamily: tokens.font.mono, color: pal.success, background: pal.successBg, padding: "1px 6px", borderRadius: tokens.radius.xs }}>{cell.v}</span>
    </span>
  );
}

function DiffTablePattern({ theme }) {
  const pal = usePal(theme);
  const [applied, setApplied] = useState(false);
  const cellPad = "10px 14px";

  return (
    <div style={{ width: 460, maxWidth: "100%", fontFamily: tokens.font.sans }}>
      <Stack gap={12}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Text size="sm" weight="semibold" theme={theme}>Proposed allocation update</Text>
          {applied
            ? <StatusBadge theme={theme} status="online">Applied</StatusBadge>
            : <Caption theme={theme}>3 edits · 1 addition</Caption>}
        </div>
        <div style={{ borderRadius: tokens.radius.md, border: `1px solid ${pal.borderSubtle}`, overflow: "hidden", transition: `border-color ${motion.smooth} ${motion.easeInOut}` }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: pal.bgSubtle, transition: `background ${motion.smooth} ${motion.easeInOut}` }}>
                {["Pair", "Strategy", "Allocation"].map(h => (
                  <th key={h} style={{ ...tokens.type.xs, fontFamily: tokens.font.sans, fontWeight: tokens.weight.medium, color: pal.textTertiary, textAlign: "left", padding: cellPad, textTransform: "uppercase", letterSpacing: 0.4 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {DIFF_ROWS.map((r, i) => (
                <tr key={r.pair} style={{
                  borderTop: `1px solid ${pal.borderSubtle}`,
                  background: r.added && !applied ? pal.successBg : "transparent",
                  transition: `background ${motion.smooth} ${motion.easeInOut}`,
                }}>
                  <td style={{ padding: cellPad }}>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                      <Text size="sm" weight="medium" theme={theme} mono>{r.pair}</Text>
                      {r.added && !applied && <span style={{ ...tokens.type.xxs, fontWeight: tokens.weight.semibold, color: pal.success, letterSpacing: 0.4 }}>NEW</span>}
                    </span>
                  </td>
                  <td style={{ padding: cellPad }}><DiffCell cell={r.strategy} applied={applied} theme={theme} /></td>
                  <td style={{ padding: cellPad }}><DiffCell cell={r.alloc} applied={applied} theme={theme} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!applied && (
          <Stack direction="row" gap={8} justify="flex-end">
            <Button theme={theme} variant="ghost" size="sm">Reject</Button>
            <Button theme={theme} variant="accent" size="sm" onClick={() => setApplied(true)}>Apply edits</Button>
          </Stack>
        )}
      </Stack>
    </div>
  );
}

// 09 · Command search — palette with live filtering
const COMMAND_ITEMS = [
  { icon: "↗", label: "Forecast weekend volume" },
  { icon: "≋", label: "Find funding arbitrage pairs" },
  { icon: "▦", label: "Compare momentum vs. DCA returns" },
  { icon: "✦", label: "Draft a rebalance plan" },
  { icon: "⚙", label: "Check oracle health" },
];

function CommandSearchPattern({ theme }) {
  const pal = usePal(theme);
  const [q, setQ] = useState("");
  const [hoverIdx, setHoverIdx] = useState(-1);
  const results = COMMAND_ITEMS.filter(c => c.label.toLowerCase().includes(q.trim().toLowerCase()));

  return (
    <div style={{
      width: 440, maxWidth: "100%", fontFamily: tokens.font.sans,
      background: theme === "dark" ? "rgba(30,30,30,0.95)" : "rgba(255,255,255,0.95)",
      backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
      border: `1px solid ${pal.borderSubtle}`, borderRadius: tokens.radius.lg,
      boxShadow: `0 16px 48px ${pal.shadowLg}`, overflow: "hidden",
      transition: `all ${motion.smooth} ${motion.easeInOut}`,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 16px", borderBottom: `1px solid ${pal.borderSubtle}` }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={pal.textTertiary} strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
          <circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" />
        </svg>
        <input value={q} onChange={e => { setQ(e.target.value); setHoverIdx(-1); }}
          placeholder="Ask the agent anything…"
          style={{
            ...tokens.type.md, flex: 1, minWidth: 0, background: "transparent",
            border: "none", outline: "none", color: pal.text, fontFamily: tokens.font.sans,
          }} />
        <Kbd theme={theme}>⌘K</Kbd>
      </div>
      <div style={{ padding: 8, minHeight: 230 }}>
        {results.length > 0 ? (
          <>
            <div style={{ padding: "6px 10px 4px" }}><Caption theme={theme}>Suggested</Caption></div>
            {results.map((c, i) => (
              <button key={c.label} onClick={() => setQ("")}
                onMouseEnter={() => setHoverIdx(i)} onMouseLeave={() => setHoverIdx(-1)}
                style={{
                  ...interactiveBase, display: "flex", alignItems: "center", gap: 12,
                  width: "100%", padding: "10px 12px", borderRadius: tokens.radius.sm,
                  background: hoverIdx === i ? pal.bgSubtle : "transparent", textAlign: "left",
                }}>
                <span style={{ width: 24, height: 24, borderRadius: tokens.radius.sm, background: pal.bgSubtle, color: pal.textSecondary, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, flexShrink: 0, transition: `all ${motion.smooth} ${motion.easeInOut}` }}>{c.icon}</span>
                <span style={{ ...tokens.type.base, color: hoverIdx === i ? pal.text : pal.textSecondary, flex: 1, transition: `color ${motion.fast} ${motion.easeInOut}` }}>{c.label}</span>
                {hoverIdx === i && <Kbd theme={theme}>↵</Kbd>}
              </button>
            ))}
          </>
        ) : (
          <EmptyState theme={theme} icon="◎" title={`No matches for “${q.trim()}”`}
            description="Try a pair, a strategy, or ask in plain language."
            action={<Button theme={theme} variant="outline" size="sm" onClick={() => setQ("")}>Clear search</Button>} />
        )}
      </div>
    </div>
  );
}

// 10 · Insight cards — paged insights with a live chart
const INSIGHTS = [
  {
    text: <>The worst performer in your portfolio is <strong>ARB</strong> — down −6.2% or −$2,410 this week.</>,
    stats: [{ label: "ARB", pct: "−6.2%", usd: "−$2,410", neg: true }, { label: "OP", pct: "−1.8%", usd: "−$540", neg: true }],
    data: [42, 44, 41, 39, 40, 36, 34, 33, 30, 31, 28, 26],
  },
  {
    text: <>SOL momentum is accelerating — <strong>+9.4%</strong> with open interest up 12% in the same window.</>,
    stats: [{ label: "SOL", pct: "+9.4%", usd: "+$3,120" }, { label: "BONK", pct: "+4.1%", usd: "+$610" }],
    data: [20, 22, 21, 25, 24, 28, 30, 29, 33, 36, 38, 42],
  },
  {
    text: <>Funding costs ate <strong>0.8%</strong> of returns last week — almost all of it on ETH perps.</>,
    stats: [{ label: "ETH perps", pct: "−0.6%", usd: "−$890", neg: true }, { label: "SOL perps", pct: "−0.2%", usd: "−$260", neg: true }],
    data: [30, 28, 31, 27, 29, 25, 27, 24, 26, 23, 25, 22],
  },
];

function InsightCardsPattern({ theme }) {
  const pal = usePal(theme);
  const [page, setPage] = useState(1);
  const insight = INSIGHTS[page - 1];
  const chartData = insight.data.map((v, i) => ({ i, v }));
  const gradId = `halaska-insight-grad-${page}`;

  return (
    <div style={{ width: 440, maxWidth: "100%", fontFamily: tokens.font.sans }}>
      <Card theme={theme} padding={20}>
        <Stack gap={16}>
          <Stack direction="row" gap={10} align="center">
            <AgentGlyph size={24} theme={theme} />
            <Text size="sm" weight="semibold" theme={theme}>Insights</Text>
            <Badge theme={theme}>{INSIGHTS.length}</Badge>
          </Stack>
          <div key={page} style={{ animation: `halaska-tab-fade 0.3s ${motion.easeOut} both` }}>
            <Text size="md" theme={theme} as="p" style={{ margin: "0 0 16px", lineHeight: 1.7 }}>{insight.text}</Text>
            <Stack direction="row" gap={24} style={{ marginBottom: 16 }}>
              {insight.stats.map(s => (
                <div key={s.label}>
                  <Text size="sm" secondary theme={theme} style={{ display: "block", marginBottom: 2 }}>{s.label}</Text>
                  <span style={{ ...tokens.type.base, fontWeight: tokens.weight.semibold, fontFamily: tokens.font.mono, color: s.neg ? pal.danger : pal.success, fontVariantNumeric: "tabular-nums" }}>{s.pct}</span>
                  <span style={{ ...tokens.type.sm, fontFamily: tokens.font.mono, color: pal.textTertiary, marginLeft: 8, fontVariantNumeric: "tabular-nums" }}>{s.usd}</span>
                </div>
              ))}
            </Stack>
            <div style={{ width: "100%", height: 120 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 4, right: 0, bottom: 0, left: 0 }}>
                  <defs>
                    <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={pal.accent} stopOpacity={0.25} />
                      <stop offset="100%" stopColor={pal.accent} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Area type="monotone" dataKey="v" stroke={pal.accent} strokeWidth={1.5} fill={`url(#${gradId})`} isAnimationActive={true} animationDuration={600} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
          <Divider theme={theme} />
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
            <span style={{ whiteSpace: "nowrap", flexShrink: 0 }}>
              <LinkButton theme={theme} size="sm" iconRight="→">Should I rebalance?</LinkButton>
            </span>
            <div style={{ width: 180, flexShrink: 0 }}>
              <Pagination current={page} total={INSIGHTS.length} onChange={setPage} theme={theme} />
            </div>
          </div>
        </Stack>
      </Card>
    </div>
  );
}

// 11 · Agent chat — reasoning chips, streamed reply, live composer
const CHAT_SEED = [
  { role: "user", text: "Compare SOL momentum to the March run" },
  { role: "agent", chip: "Pulled 90 days of SOL candles · 4s", text: "This move is stronger than March — +9.4% with rising open interest, where March topped out at +6.1% on flat OI." },
];
const CHAT_REPLIES = [
  { chip: "Cross-checked 3 venues · 2s", text: "Volume confirms it — weekend depth is 1.8× the March average, so slippage on entries should stay low." },
  { chip: "Ran the risk model · 3s", text: "At current volatility a 25% allocation keeps worst-case drawdown inside your 12% budget." },
];

function ChatReasoningChip({ label, theme }) {
  const pal = usePal(theme);
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 6, padding: "3px 10px",
      borderRadius: tokens.radius.pill, background: pal.bgSubtle,
      border: `1px solid ${pal.borderSubtle}`, ...tokens.type.xs, color: pal.textTertiary,
      fontFamily: tokens.font.sans, transition: `all ${motion.smooth} ${motion.easeInOut}`,
    }}>
      <span style={{ color: pal.accent, fontSize: 9 }}>✦</span>{label}
    </span>
  );
}

function AgentChatPattern({ theme }) {
  const pal = usePal(theme);
  const [tab, setTab] = useState("Markets");
  const [messages, setMessages] = useState(CHAT_SEED);
  const [draft, setDraft] = useState("");
  const [busy, setBusy] = useState(false);
  const replyIdx = useRef(0);
  const scrollRef = useRef(null);
  const timers = useRef([]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [messages, busy]);

  const send = () => {
    const text = draft.trim();
    if (!text || busy) return;
    setDraft("");
    setMessages(m => [...m, { role: "user", text }]);
    setBusy(true);
    timers.current.push(setTimeout(() => {
      const reply = CHAT_REPLIES[replyIdx.current % CHAT_REPLIES.length];
      replyIdx.current += 1;
      setBusy(false);
      setMessages(m => [...m, { role: "agent", chip: reply.chip, text: reply.text, stream: true }]);
    }, 1400));
  };

  return (
    <div style={{
      width: 440, maxWidth: "100%", fontFamily: tokens.font.sans,
      background: theme === "dark" ? "rgba(30,30,30,0.9)" : "rgba(255,255,255,0.9)",
      border: `1px solid ${pal.borderSubtle}`, borderRadius: tokens.radius.lg,
      display: "flex", flexDirection: "column", overflow: "hidden",
      transition: `all ${motion.smooth} ${motion.easeInOut}`,
    }}>
      <div style={{ padding: "12px 16px", borderBottom: `1px solid ${pal.borderSubtle}` }}>
        <SubtleTabs tabs={["Markets", "Agents"]} value={tab} onChange={setTab} theme={theme} />
      </div>
      <div ref={scrollRef} style={{ height: 320, overflowY: "auto", padding: 16, display: "flex", flexDirection: "column", gap: 16 }}>
        {messages.map((m, i) => m.role === "user" ? (
          <div key={i} style={{ alignSelf: "flex-end", maxWidth: "80%", animation: `halaska-step-in 0.3s ${motion.emphasized} both` }}>
            <div style={{
              padding: "9px 14px", borderRadius: `${tokens.radius.md}px ${tokens.radius.md}px 4px ${tokens.radius.md}px`,
              background: pal.accent, color: "#fff", ...tokens.type.base, lineHeight: 1.55,
              transition: `background ${motion.smooth} ${motion.easeInOut}`,
            }}>{m.text}</div>
          </div>
        ) : (
          <div key={i} style={{ alignSelf: "flex-start", maxWidth: "88%", animation: `halaska-step-in 0.3s ${motion.emphasized} both` }}>
            <Stack gap={8}>
              {m.chip && <ChatReasoningChip label={m.chip} theme={theme} />}
              <div style={{ ...tokens.type.base, color: pal.text, lineHeight: 1.65, transition: `color ${motion.smooth} ${motion.easeInOut}` }}>
                {m.stream ? <StreamingText text={m.text} speed={16} theme={theme} /> : m.text}
              </div>
            </Stack>
          </div>
        ))}
        {busy && (
          <div style={{ alignSelf: "flex-start", animation: `halaska-fade-in 0.3s ease both` }}>
            <ThinkingIndicator label="Thinking" size="sm" theme={theme} />
          </div>
        )}
      </div>
      <div style={{ padding: 12, borderTop: `1px solid ${pal.borderSubtle}` }}>
        <div style={{
          display: "flex", alignItems: "center", gap: 8, padding: "4px 4px 4px 14px",
          borderRadius: tokens.radius.pill, background: pal.bgInput,
          transition: `background ${motion.smooth} ${motion.easeInOut}`,
        }}>
          <input value={draft} onChange={e => setDraft(e.target.value)}
            onKeyDown={e => e.key === "Enter" && send()}
            placeholder="Ask about your portfolio…"
            style={{ ...tokens.type.base, flex: 1, minWidth: 0, background: "transparent", border: "none", outline: "none", color: pal.text, fontFamily: tokens.font.sans }} />
          <button onClick={send} aria-label="Send"
            style={{
              ...interactiveBase, width: 32, height: 32, borderRadius: 16, flexShrink: 0,
              background: draft.trim() ? pal.accent : pal.bgMuted,
              color: draft.trim() ? "#fff" : pal.textTertiary,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 19V5" /><path d="m5 12 7-7 7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

function PatternsRoadmap({ theme, items }) {
  const pal = usePal(theme);
  return (
    <Stack gap={8}>
      {items.map(p => (
        <Card theme={theme} padding={16} key={p.id}>
          <Stack direction="row" gap={14} align="center">
            <div style={{
              width: 36, height: 36, borderRadius: tokens.radius.md,
              background: pal.accentBg, color: pal.accent,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 16, flexShrink: 0,
              transition: `all ${motion.smooth} ${motion.easeInOut}`,
            }}>{p.icon}</div>
            <div style={{ flex: 1 }}>
              <Text size="base" weight="semibold" theme={theme}>{p.title}</Text>
              <Text size="sm" theme={theme} style={{ color: pal.textSecondary, marginTop: 2 }}>{p.desc}</Text>
            </div>
            <StatusBadge theme={theme} status="pending">Soon</StatusBadge>
          </Stack>
        </Card>
      ))}
    </Stack>
  );
}

// ─── UX PATTERNS · Conversation core (new) ─────────────────

// · Prompt input — the composer: attachments, model pill, mic, stream-stop
const PROMPTIN_MODELS = [
  { id: "alpha-4-fast", label: "alpha-4 · fast" },
  { id: "alpha-4",      label: "alpha-4 · deep" },
  { id: "alpha-mini",   label: "alpha-mini" },
];

const PROMPTIN_SUGGESTIONS = [
  "What's my SOL exposure?",
  "Trim losers over 5%",
  "Summarize overnight funding",
];

function PromptinIconBtn({ children, onClick, label, theme }) {
  const pal = usePal(theme);
  const [hover, setHover] = useState(false);
  return (
    <button onClick={onClick} aria-label={label}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        ...interactiveBase, width: 28, height: 28, borderRadius: tokens.radius.sm,
        display: "flex", alignItems: "center", justifyContent: "center", padding: 0,
        background: hover ? pal.bgMuted : "transparent",
        color: hover ? pal.text : pal.textTertiary,
      }}>
      {children}
    </button>
  );
}

function PromptInputPattern({ theme }) {
  const pal = usePal(theme);
  const [value, setValue] = useState("");
  const [modelIdx, setModelIdx] = useState(0);
  const [streaming, setStreaming] = useState(false);
  const [attached, setAttached] = useState(false);
  const [focused, setFocused] = useState(false);
  const [pillHover, setPillHover] = useState(false);
  const [sendHover, setSendHover] = useState(false);
  const taRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => () => clearTimeout(timerRef.current), []);

  // Auto-grow the textarea to fit its content
  useEffect(() => {
    const ta = taRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = Math.min(132, ta.scrollHeight) + "px";
  }, [value]);

  const canSend = value.trim().length > 0;

  const handleSubmit = () => {
    if (streaming) { clearTimeout(timerRef.current); setStreaming(false); return; }
    if (!canSend) return;
    setValue(""); setAttached(false); setStreaming(true);
    timerRef.current = setTimeout(() => setStreaming(false), 3000);
  };

  return (
    <div style={{ width: 480, maxWidth: "100%", fontFamily: tokens.font.sans }}>
      <Stack gap={12}>
        <Stack direction="row" gap={8} wrap>
          {PROMPTIN_SUGGESTIONS.map((s, i) => (
            <PromptinChip key={s} label={s} theme={theme} delay={i * 0.06}
              onClick={() => { setValue(s); taRef.current?.focus(); }} />
          ))}
        </Stack>

        <div style={{
          position: "relative", background: pal.bgInput, borderRadius: tokens.radius.lg,
          border: `1.5px solid ${focused ? pal.borderFocus : "transparent"}`,
          transition: `all ${motion.normal} ${motion.easeInOut}`, overflow: "hidden",
        }}>
          {streaming && (
            <div style={{
              position: "absolute", top: 0, left: 12, right: 12, height: 2, borderRadius: 1,
              backgroundImage: `linear-gradient(90deg, transparent 25%, ${pal.accent} 50%, transparent 75%)`,
              backgroundSize: "200% 100%", animation: "halaska-shimmer 1.4s ease-in-out infinite",
            }} />
          )}

          {attached && (
            <div style={{ padding: "12px 12px 0" }}>
              <span style={{
                display: "inline-flex", alignItems: "center", gap: 8, padding: "5px 6px 5px 10px",
                borderRadius: tokens.radius.sm, background: pal.bgElevated,
                border: `1px solid ${pal.borderSubtle}`,
                animation: `halaska-scale-in 0.25s ${motion.easeOut} both`,
                transition: `all ${motion.smooth} ${motion.easeInOut}`,
              }}>
                <span style={{ ...tokens.type.xs, fontFamily: tokens.font.mono, color: pal.textSecondary }}>positions.csv</span>
                <span style={{ ...tokens.type.xs, color: pal.textTertiary }}>12 KB</span>
                <button onClick={() => setAttached(false)} aria-label="Remove attachment"
                  style={{
                    ...interactiveBase, width: 16, height: 16, padding: 0, borderRadius: 8,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    background: "transparent", color: pal.textTertiary, fontSize: 11, lineHeight: 1,
                  }}>×</button>
              </span>
            </div>
          )}

          <textarea ref={taRef} value={value} rows={1}
            onChange={(e) => setValue(e.target.value)}
            onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSubmit(); } }}
            placeholder="Ask Alpha about your book…"
            style={{
              ...tokens.type.base, display: "block", width: "100%", boxSizing: "border-box",
              fontFamily: tokens.font.sans, color: pal.text, background: "transparent",
              border: "none", outline: "none", resize: "none",
              padding: "14px 16px 4px", transition: `color ${motion.smooth} ${motion.easeInOut}`,
            }} />

          <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 10px 10px" }}>
            <PromptinIconBtn label="Attach file" theme={theme} onClick={() => setAttached(true)}>
              <svg viewBox="0 0 16 16" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round">
                <line x1="8" y1="3.5" x2="8" y2="12.5" /><line x1="3.5" y1="8" x2="12.5" y2="8" />
              </svg>
            </PromptinIconBtn>

            <button onClick={() => setModelIdx(i => (i + 1) % PROMPTIN_MODELS.length)}
              onMouseEnter={() => setPillHover(true)} onMouseLeave={() => setPillHover(false)}
              style={{
                ...interactiveBase, display: "inline-flex", alignItems: "center", gap: 6,
                padding: "4px 10px", borderRadius: tokens.radius.pill,
                background: pillHover ? pal.bgMuted : pal.bgSubtle,
                border: `1px solid ${pal.borderSubtle}`,
              }}>
              <span key={modelIdx} style={{
                ...tokens.type.xs, fontFamily: tokens.font.mono, color: pal.textSecondary,
                animation: `halaska-tab-fade 0.25s ${motion.easeOut} both`,
              }}>{PROMPTIN_MODELS[modelIdx].label}</span>
              <ChevronIcon size={9} direction="down" style={{ color: pal.textTertiary }} />
            </button>

            <div style={{ flex: 1 }} />

            <PromptinIconBtn label="Voice input" theme={theme} onClick={() => {}}>
              <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round">
                <rect x="6" y="1.5" width="4" height="7.5" rx="2" />
                <path d="M3.5 7.5a4.5 4.5 0 0 0 9 0" />
                <line x1="8" y1="12" x2="8" y2="14.5" />
              </svg>
            </PromptinIconBtn>

            <button onClick={handleSubmit} aria-label={streaming ? "Stop" : "Send"}
              onMouseEnter={() => setSendHover(true)} onMouseLeave={() => setSendHover(false)}
              style={{
                ...interactiveBase, width: 30, height: 30, borderRadius: 15, padding: 0,
                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                background: streaming || canSend
                  ? (sendHover ? pal.accentHover : pal.accent)
                  : pal.bgMuted,
                color: streaming || canSend ? "#fff" : pal.textMuted,
                cursor: streaming || canSend ? "pointer" : "default",
              }}>
              {streaming ? (
                <span style={{ width: 9, height: 9, borderRadius: 2, background: "#fff", animation: `halaska-scale-in 0.2s ${motion.easeOut} both` }} />
              ) : (
                <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="8" y1="12.5" x2="8" y2="3.5" /><polyline points="4,7.5 8,3.5 12,7.5" />
                </svg>
              )}
            </button>
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "center", gap: 6, alignItems: "center", minHeight: 18 }}>
          {streaming
            ? <ThinkingIndicator label="Alpha is answering" size="sm" theme={theme} />
            : <Caption theme={theme} style={{ ...tokens.type.xs }}>Enter to send · Shift+Enter for a new line</Caption>}
        </div>
      </Stack>
    </div>
  );
}

function PromptinChip({ label, onClick, delay = 0, theme }) {
  const pal = usePal(theme);
  const [hover, setHover] = useState(false);
  return (
    <button onClick={onClick}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        ...interactiveBase, padding: "5px 12px", borderRadius: tokens.radius.pill,
        background: hover ? pal.bgSubtle : "transparent",
        border: `1px solid ${hover ? pal.border : pal.borderSubtle}`,
        ...tokens.type.sm, color: hover ? pal.text : pal.textSecondary,
        animation: `halaska-step-in 0.4s ${motion.emphasized} ${delay}s both`,
      }}>
      {label}
    </button>
  );
}

// · Message thread — user turn + assistant turn with hover actions and branches
const MSGTHREAD_USER_MSG = "Should I roll my SOL position into the December expiry?";

const MSGTHREAD_REPLIES = [
  "I wouldn't roll yet. December SOL futures are trading at a 6.1% annualized premium — the richest since March — so you'd be paying up for carry. Funding on the near expiry is still neutral, which means holding costs you almost nothing. Keep the current expiry and revisit after the next funding print.",
  "Yes, but stagger it. Roll half into December now while the spread is tight, and the rest after Thursday's CPI print. You lock in most of the carry while keeping room to react if vol spikes.",
  "Rolling now costs roughly 0.8% in spread plus the December premium. Hold the near expiry — same delta, no roll cost.",
];

function MsgthreadActionBtn({ children, onClick, active, label, theme }) {
  const pal = usePal(theme);
  const [hover, setHover] = useState(false);
  return (
    <button onClick={onClick} aria-label={label}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        ...interactiveBase, width: 26, height: 26, borderRadius: tokens.radius.sm,
        display: "flex", alignItems: "center", justifyContent: "center", padding: 0,
        background: active ? pal.accentBg : hover ? pal.bgSubtle : "transparent",
        color: active ? pal.accentText : hover ? pal.text : pal.textTertiary,
      }}>
      {children}
    </button>
  );
}

function MessageThreadPattern({ theme }) {
  const pal = usePal(theme);
  const [branch, setBranch] = useState(0);
  const [hover, setHover] = useState(false);
  const [copied, setCopied] = useState(false);
  const [vote, setVote] = useState(null); // null | "up" | "down"
  const copyTimer = useRef(null);

  useEffect(() => () => clearTimeout(copyTimer.current), []);

  const handleCopy = () => {
    try { navigator.clipboard?.writeText(MSGTHREAD_REPLIES[branch]); } catch (e) { /* no-op */ }
    setCopied(true);
    clearTimeout(copyTimer.current);
    copyTimer.current = setTimeout(() => setCopied(false), 1200);
  };

  const nextBranch = () => setBranch(b => (b + 1) % MSGTHREAD_REPLIES.length);
  const prevBranch = () => setBranch(b => (b + MSGTHREAD_REPLIES.length - 1) % MSGTHREAD_REPLIES.length);

  const thumbPath = "M5 7.2 7.6 2.6c.9 0 1.6.7 1.6 1.6L8.7 6.7h3.3c.9 0 1.6.9 1.3 1.8l-1.2 4c-.2.6-.7 1-1.3 1H5M5 7.2H2.8v6.3H5M5 7.2v6.3";

  return (
    <div style={{ width: 460, maxWidth: "100%", fontFamily: tokens.font.sans }}>
      <Stack gap={6}>
        {/* User turn */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4, animation: `halaska-step-in 0.4s ${motion.emphasized} both` }}>
          <div style={{
            maxWidth: "82%", padding: "10px 14px",
            background: pal.bgSubtle, border: `1px solid ${pal.borderSubtle}`,
            borderRadius: `${tokens.radius.md}px ${tokens.radius.md}px ${tokens.radius.xs}px ${tokens.radius.md}px`,
            transition: `all ${motion.smooth} ${motion.easeInOut}`,
          }}>
            <Text size="base" theme={theme}>{MSGTHREAD_USER_MSG}</Text>
          </div>
          <span style={{ ...tokens.type.xs, color: pal.textTertiary, paddingRight: 4, transition: `color ${motion.smooth} ${motion.easeInOut}` }}>2:46 PM</span>
        </div>

        {/* Assistant turn */}
        <div onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
          style={{ display: "flex", gap: 10, animation: `halaska-step-in 0.4s ${motion.emphasized} 0.12s both` }}>
          <AgentGlyph size={24} theme={theme} />
          <div style={{ flex: 1, minWidth: 0, paddingTop: 2 }}>
            <div key={branch} style={{ animation: `halaska-tab-fade 0.3s ${motion.easeOut} both` }}>
              <Text size="base" theme={theme} style={{ display: "block", lineHeight: 1.65 }}>
                {MSGTHREAD_REPLIES[branch]}
              </Text>
            </div>

            {/* Hover action row */}
            <div style={{
              display: "flex", alignItems: "center", gap: 2, marginTop: 10,
              opacity: hover || copied || vote ? 1 : 0,
              transition: `opacity ${motion.normal} ${motion.easeInOut}`,
            }}>
              <MsgthreadActionBtn label="Copy" theme={theme} onClick={handleCopy}>
                {copied ? (
                  <svg viewBox="0 0 16 16" width="13" height="13" fill="none" stroke={pal.success} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ animation: `halaska-scale-in 0.2s ${motion.easeOut} both` }}>
                    <polyline points="3,8.5 6.5,12 13,4" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 16 16" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="5.5" y="5.5" width="8" height="8" rx="1.5" />
                    <path d="M10.5 5.5v-1a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h1" />
                  </svg>
                )}
              </MsgthreadActionBtn>

              <MsgthreadActionBtn label="Retry" theme={theme} onClick={nextBranch}>
                <svg viewBox="0 0 16 16" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M13.5 8a5.5 5.5 0 1 1-1.7-4" />
                  <polyline points="13.6,1.8 13.6,5 10.4,5" />
                </svg>
              </MsgthreadActionBtn>

              <MsgthreadActionBtn label="Good response" theme={theme} active={vote === "up"}
                onClick={() => setVote(v => v === "up" ? null : "up")}>
                <svg viewBox="0 0 16 16" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round">
                  <path d={thumbPath} />
                </svg>
              </MsgthreadActionBtn>

              <MsgthreadActionBtn label="Bad response" theme={theme} active={vote === "down"}
                onClick={() => setVote(v => v === "down" ? null : "down")}>
                <svg viewBox="0 0 16 16" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" style={{ transform: "rotate(180deg)" }}>
                  <path d={thumbPath} />
                </svg>
              </MsgthreadActionBtn>

              {/* Branch pager */}
              <div style={{ display: "flex", alignItems: "center", gap: 2, marginLeft: 6 }}>
                <MsgthreadActionBtn label="Previous version" theme={theme} onClick={prevBranch}>
                  <ChevronIcon size={11} direction="left" />
                </MsgthreadActionBtn>
                <span style={{
                  ...tokens.type.xs, fontFamily: tokens.font.mono, fontVariantNumeric: "tabular-nums",
                  color: pal.textTertiary, transition: `color ${motion.smooth} ${motion.easeInOut}`,
                }}>{branch + 1} / {MSGTHREAD_REPLIES.length}</span>
                <MsgthreadActionBtn label="Next version" theme={theme} onClick={nextBranch}>
                  <ChevronIcon size={11} direction="right" />
                </MsgthreadActionBtn>
              </div>

              <span style={{ ...tokens.type.xs, color: pal.textTertiary, marginLeft: "auto", transition: `color ${motion.smooth} ${motion.easeInOut}` }}>2:47 PM</span>
            </div>
          </div>
        </div>
      </Stack>
    </div>
  );
}

// · Code block — agent-written TypeScript streaming in line by line
// Token colors: k = keyword (accent), s = string (success), c = comment (tertiary), p = plain
const CODEBLK_LINES = [
  [{ t: "// Rebalance the book toward target weights", c: "c" }],
  [{ t: "import", c: "k" }, { t: " { getBook, execute } ", c: "p" }, { t: "from", c: "k" }, { t: " ", c: "p" }, { t: '"./positions"', c: "s" }, { t: ";", c: "p" }],
  [],
  [{ t: "const", c: "k" }, { t: " TARGETS = { SOL: 0.42, ETH: 0.38, USDC: 0.20 };", c: "p" }],
  [{ t: "export async function", c: "k" }, { t: " rebalance(wallet: ", c: "p" }, { t: "string", c: "k" }, { t: ") {", c: "p" }],
  [{ t: "  ", c: "p" }, { t: "const", c: "k" }, { t: " book = ", c: "p" }, { t: "await", c: "k" }, { t: " getBook(wallet);", c: "p" }],
  [{ t: "  ", c: "p" }, { t: "const", c: "k" }, { t: " drift = book.weights().diff(TARGETS);", c: "p" }],
  [{ t: "  ", c: "p" }, { t: "const", c: "k" }, { t: " orders = drift.filter(d => Math.abs(d.pct) > 0.02);", c: "p" }],
  [{ t: "  ", c: "p" }, { t: "return", c: "k" }, { t: " execute(orders, { venue: ", c: "p" }, { t: '"hyperliquid"', c: "s" }, { t: " });", c: "p" }],
  [{ t: "}", c: "p" }],
];

function CodeBlockPattern({ theme }) {
  const pal = usePal(theme);
  const [shown, setShown] = useState(0);
  const [copied, setCopied] = useState(false);
  const [copyHover, setCopyHover] = useState(false);
  const copyTimer = useRef(null);

  useEffect(() => {
    const iv = setInterval(() => {
      setShown(n => {
        if (n >= CODEBLK_LINES.length) { clearInterval(iv); return n; }
        return n + 1;
      });
    }, 380);
    return () => { clearInterval(iv); clearTimeout(copyTimer.current); };
  }, []);

  const done = shown >= CODEBLK_LINES.length;
  const tokenColor = { k: pal.accent, s: pal.success, c: pal.textTertiary, p: pal.text };

  const handleCopy = () => {
    const src = CODEBLK_LINES.map(l => l.map(t => t.t).join("")).join("\n");
    try { navigator.clipboard?.writeText(src); } catch (e) { /* no-op */ }
    setCopied(true);
    clearTimeout(copyTimer.current);
    copyTimer.current = setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div style={{ width: 500, maxWidth: "100%", fontFamily: tokens.font.sans }}>
      <div style={{
        borderRadius: tokens.radius.md, border: `1px solid ${pal.borderSubtle}`,
        background: pal.bgSubtle, overflow: "hidden",
        transition: `all ${motion.smooth} ${motion.easeInOut}`,
      }}>
        {/* Header */}
        <div style={{
          display: "flex", alignItems: "center", gap: 10, padding: "9px 14px",
          borderBottom: `1px solid ${pal.borderSubtle}`,
          transition: `border-color ${motion.smooth} ${motion.easeInOut}`,
        }}>
          <span style={{ ...tokens.type.sm, fontFamily: tokens.font.mono, color: pal.text, transition: `color ${motion.smooth} ${motion.easeInOut}` }}>rebalance.ts</span>
          <span style={{
            ...tokens.type.xs, color: pal.textTertiary, padding: "1px 8px",
            borderRadius: tokens.radius.pill, border: `1px solid ${pal.borderSubtle}`,
            transition: `all ${motion.smooth} ${motion.easeInOut}`,
          }}>TypeScript</span>
          <div style={{ flex: 1 }} />
          {!done && <ThinkingIndicator label="" size="sm" theme={theme} />}
          <button onClick={handleCopy}
            onMouseEnter={() => setCopyHover(true)} onMouseLeave={() => setCopyHover(false)}
            style={{
              ...interactiveBase, display: "inline-flex", alignItems: "center", gap: 6,
              padding: "3px 10px", borderRadius: tokens.radius.sm,
              background: copyHover ? pal.bgMuted : "transparent",
              ...tokens.type.xs, color: copied ? pal.success : copyHover ? pal.text : pal.textSecondary,
            }}>
            {copied ? "Copied ✓" : "Copy"}
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: "12px 0", overflowX: "auto" }}>
          {CODEBLK_LINES.slice(0, shown).map((line, i) => {
            const isLast = i === shown - 1;
            return (
              <div key={i} style={{
                display: "flex", alignItems: "baseline", padding: "1.5px 14px",
                animation: `halaska-step-in 0.3s ${motion.emphasized} both`,
              }}>
                <span style={{
                  ...tokens.type.sm, fontFamily: tokens.font.mono, color: pal.textMuted,
                  width: 22, flexShrink: 0, textAlign: "right", marginRight: 14, userSelect: "none",
                  fontVariantNumeric: "tabular-nums", transition: `color ${motion.smooth} ${motion.easeInOut}`,
                }}>{i + 1}</span>
                <span style={{ ...tokens.type.sm, fontFamily: tokens.font.mono, whiteSpace: "pre" }}>
                  {line.length === 0 && !isLast && " "}
                  {line.map((tok, j) => (
                    <span key={j} style={{ color: tokenColor[tok.c], transition: `color ${motion.smooth} ${motion.easeInOut}` }}>{tok.t}</span>
                  ))}
                  {isLast && !done && (
                    <span style={{
                      display: "inline-block", width: 7, height: "0.95em", marginLeft: 1,
                      background: pal.accent, verticalAlign: "text-bottom",
                      animation: "halaska-blink 1s step-end infinite",
                    }} />
                  )}
                </span>
              </div>
            );
          })}
        </div>

        {/* Footer — resolved state */}
        {done && (
          <div style={{
            display: "flex", alignItems: "center", gap: 8, padding: "8px 14px",
            borderTop: `1px solid ${pal.borderSubtle}`,
            animation: `halaska-step-in 0.4s ${motion.emphasized} both`,
            transition: `border-color ${motion.smooth} ${motion.easeInOut}`,
          }}>
            <AgentGlyph size={16} theme={theme} />
            <Caption theme={theme} style={{ ...tokens.type.xs }}>10 lines · written by Alpha</Caption>
          </div>
        )}
      </div>
    </div>
  );
}

// · Model & context — capability-aware model picker + context window meter
const MODELCTX_MODELS = [
  { id: "alpha-4",      name: "alpha-4",        note: "Best judgment, slower",  window: 200, caps: ["vision", "reasoning"] },
  { id: "alpha-4-fast", name: "alpha-4 · fast", note: "Low-latency execution",  window: 150, caps: ["vision"] },
  { id: "alpha-mini",   name: "alpha-mini",     note: "Cheap bulk analysis",    window: 32,  caps: [] },
];

const MODELCTX_USAGE = [
  { label: "system", k: 8 },
  { label: "files",  k: 61 },
  { label: "chat",   k: 63 },
];

const MODELCTX_CAP_GLYPHS = { vision: "◇ vision", reasoning: "✦ reasoning" };

function ModelctxBadge({ children, theme }) {
  const pal = usePal(theme);
  return (
    <span style={{
      ...tokens.type.xs, fontFamily: tokens.font.mono, color: pal.textTertiary,
      padding: "1px 7px", borderRadius: tokens.radius.pill,
      background: pal.bgSubtle, border: `1px solid ${pal.borderSubtle}`,
      whiteSpace: "nowrap", transition: `all ${motion.smooth} ${motion.easeInOut}`,
    }}>{children}</span>
  );
}

function ModelctxRow({ model, active, onClick, theme }) {
  const pal = usePal(theme);
  const [hover, setHover] = useState(false);
  return (
    <button onClick={onClick}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        ...interactiveBase, display: "flex", alignItems: "center", gap: 10,
        width: "100%", padding: "9px 10px", textAlign: "left", borderRadius: tokens.radius.sm,
        background: active ? pal.accentBg : hover ? pal.bgSubtle : "transparent",
      }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <Text size="sm" weight="medium" theme={theme} style={{ display: "block", color: active ? pal.accentText : pal.text }}>{model.name}</Text>
        <Text size="xs" theme={theme} style={{ color: pal.textTertiary }}>{model.note}</Text>
      </div>
      <span style={{ display: "inline-flex", gap: 4 }}>
        {model.caps.map(c => <ModelctxBadge key={c} theme={theme}>{MODELCTX_CAP_GLYPHS[c]}</ModelctxBadge>)}
        <ModelctxBadge theme={theme}>{model.window}K</ModelctxBadge>
      </span>
    </button>
  );
}

function ModelContextPattern({ theme }) {
  const pal = usePal(theme);
  const [modelId, setModelId] = useState("alpha-4");
  const [open, setOpen] = useState(false);
  const [triggerHover, setTriggerHover] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handleClick(e) { if (ref.current && !ref.current.contains(e.target)) setOpen(false); }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const model = MODELCTX_MODELS.find(m => m.id === modelId);
  const used = MODELCTX_USAGE.reduce((n, s) => n + s.k, 0); // 132K
  const overflow = used > model.window;
  const pct = Math.min(100, (used / model.window) * 100);
  const segColors = overflow
    ? [pal.warning, `${pal.warning}B3`, `${pal.warning}66`]
    : [pal.accent, `${pal.accent}B3`, `${pal.accent}66`];

  return (
    <div style={{ width: 420, maxWidth: "100%", fontFamily: tokens.font.sans }}>
      <div style={{
        borderRadius: tokens.radius.lg, border: `1px solid ${pal.borderSubtle}`,
        background: pal.bgElevated, padding: 16,
        transition: `all ${motion.smooth} ${motion.easeInOut}`,
      }}>
        <Stack gap={8}>
          <Caption theme={theme}>Model</Caption>
          <div ref={ref} style={{ position: "relative" }}>
            <button onClick={() => setOpen(o => !o)}
              onMouseEnter={() => setTriggerHover(true)} onMouseLeave={() => setTriggerHover(false)}
              style={{
                ...interactiveBase, display: "flex", alignItems: "center", gap: 10,
                width: "100%", boxSizing: "border-box", padding: "9px 12px", textAlign: "left",
                background: pal.bgInput, borderRadius: tokens.radius.md,
                border: `1.5px solid ${open ? pal.borderFocus : triggerHover ? pal.borderSubtle : "transparent"}`,
              }}>
              <span key={model.id} style={{
                display: "flex", alignItems: "center", gap: 8, flex: 1, minWidth: 0,
                animation: `halaska-tab-fade 0.25s ${motion.easeOut} both`,
              }}>
                <Text size="base" weight="medium" theme={theme}>{model.name}</Text>
                <span style={{ display: "inline-flex", gap: 4 }}>
                  {model.caps.map(c => <ModelctxBadge key={c} theme={theme}>{MODELCTX_CAP_GLYPHS[c]}</ModelctxBadge>)}
                  <ModelctxBadge theme={theme}>{model.window}K</ModelctxBadge>
                </span>
              </span>
              <ChevronIcon size={12} direction={open ? "up" : "down"} style={{ color: pal.textTertiary }} />
            </button>

            {open && (
              <div style={{
                position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0, zIndex: 50,
                background: pal.bgElevated, borderRadius: tokens.radius.md, padding: 4,
                border: `1px solid ${pal.borderSubtle}`, boxShadow: `0 4px 20px ${pal.shadowLg}`,
                transformOrigin: "top center",
                animation: `halaska-scale-in ${motion.fast} ${motion.easeOut} both`,
              }}>
                {MODELCTX_MODELS.map(m => (
                  <ModelctxRow key={m.id} model={m} active={m.id === modelId} theme={theme}
                    onClick={() => { setModelId(m.id); setOpen(false); }} />
                ))}
              </div>
            )}
          </div>

          <Divider theme={theme} spacing={8} />

          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
            <Caption theme={theme}>Context</Caption>
            <span style={{
              ...tokens.type.xs, fontFamily: tokens.font.mono, fontVariantNumeric: "tabular-nums",
              color: overflow ? pal.warning : pal.textTertiary,
              transition: `color ${motion.smooth} ${motion.easeInOut}`,
            }}>{used}K / {model.window}K · {Math.round((used / model.window) * 100)}%</span>
          </div>

          {/* Meter — stacked usage segments, warning tint on overflow */}
          <div style={{
            width: "100%", height: 8, borderRadius: 4, background: pal.bgMuted, overflow: "hidden",
            transition: `background ${motion.smooth} ${motion.easeInOut}`,
          }}>
            <div style={{
              display: "flex", height: "100%", width: `${pct}%`, borderRadius: 4,
              transition: `width 0.6s ${motion.springCurve}`,
            }}>
              {MODELCTX_USAGE.map((seg, i) => (
                <div key={seg.label} style={{
                  flex: seg.k, height: "100%", background: segColors[i],
                  transition: `background ${motion.smooth} ${motion.easeInOut}`,
                }} />
              ))}
            </div>
          </div>

          {/* Breakdown legend */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
            {MODELCTX_USAGE.map((seg, i) => (
              <span key={seg.label} style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
                <span style={{ width: 6, height: 6, borderRadius: 3, background: segColors[i], transition: `background ${motion.smooth} ${motion.easeInOut}` }} />
                <span style={{ ...tokens.type.xs, color: pal.textTertiary, transition: `color ${motion.smooth} ${motion.easeInOut}` }}>{seg.label} {seg.k}K</span>
              </span>
            ))}
          </div>

          {overflow && (
            <div style={{
              display: "flex", alignItems: "center", gap: 7,
              animation: `halaska-step-in 0.4s ${motion.emphasized} both`,
            }}>
              <span style={{ color: pal.warning, fontSize: 11, lineHeight: 1, transition: `color ${motion.smooth} ${motion.easeInOut}` }}>▲</span>
              <Text size="xs" theme={theme} style={{ color: pal.textSecondary }}>
                Conversation exceeds window — older turns will be compacted.
              </Text>
            </div>
          )}
        </Stack>
      </div>
    </div>
  );
}

// ─── UX PATTERNS · Trust & transparency (new) ──────────────

// · Citations — numbered inline chips with an anchored source popover
const CITE_SOURCES = [
  { name: "Coinglass",       domain: "coinglass.com",   tone: "accent",
    quote: "Aggregated SOL perp funding turned positive at 04:00 UTC across Binance, Bybit and OKX." },
  { name: "Kaiko Research",  domain: "kaiko.com",       tone: "success",
    quote: "Spot volumes were flat week-over-week while derivatives volumes rose 18%." },
  { name: "Hyperliquid docs", domain: "hyperliquid.xyz", tone: "warning",
    quote: "Funding is exchanged peer-to-peer every hour, proportional to open position size." },
];

const CITE_SEGMENTS = [
  { t: "SOL perp funding flipped positive across the three largest venues overnight" },
  { cite: 0 },
  { t: ", while spot volume held flat — this move is leverage-led, not demand-led" },
  { cite: 1 },
  { t: ". Longs are now paying every hour to stay in" },
  { cite: 2 },
  { t: ", so size entries down until funding cools." },
];

const CITE_W = 460;
const CITE_POP_W = 250;

function CiteChip({ n, active, onClick, theme }) {
  const pal = usePal(theme);
  const [hover, setHover] = useState(false);
  return (
    <button onClick={onClick}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        ...interactiveBase, display: "inline-flex", alignItems: "center", gap: 4,
        padding: "1px 7px", margin: "0 2px", borderRadius: tokens.radius.pill,
        background: active ? pal.accentBg : hover ? pal.bgMuted : pal.bgSubtle,
        border: `1px solid ${active ? `${pal.accent}55` : pal.borderSubtle}`,
        ...tokens.type.xs, lineHeight: 1.4, fontFamily: tokens.font.sans,
        color: active ? pal.accentText : pal.textSecondary,
        verticalAlign: "super", position: "relative", top: -1,
      }}>
      <span style={{ width: 4, height: 4, borderRadius: 2, background: pal.accent, transition: `background ${motion.smooth} ${motion.easeInOut}` }} />
      {n}
    </button>
  );
}

function CitePagerBtn({ direction, onClick, theme }) {
  const pal = usePal(theme);
  const [hover, setHover] = useState(false);
  return (
    <button onClick={onClick}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        ...interactiveBase, display: "flex", alignItems: "center", justifyContent: "center",
        padding: "4px 8px", borderRadius: tokens.radius.sm,
        background: hover ? pal.bgSubtle : "transparent",
        color: hover ? pal.text : pal.textTertiary,
      }}>
      <ChevronIcon size={11} direction={direction} />
    </button>
  );
}

function CitePopover({ srcIdx, left, top, onPrev, onNext, theme }) {
  const pal = usePal(theme);
  const src = CITE_SOURCES[srcIdx];
  const toneColor = { accent: pal.accent, success: pal.success, warning: pal.warning }[src.tone];
  return (
    <div style={{
      position: "absolute", top: top + 8, left, width: CITE_POP_W, zIndex: 5,
      background: pal.bgElevated, border: `1px solid ${pal.border}`,
      borderRadius: tokens.radius.md, padding: 14, boxSizing: "border-box",
      boxShadow: `0 12px 32px ${pal.shadowLg}`, transformOrigin: "top center",
      animation: `halaska-scale-in 0.2s ${motion.easeOut} both`,
      transition: `background ${motion.smooth} ${motion.easeInOut}, border ${motion.smooth} ${motion.easeInOut}`,
    }}>
      <div key={srcIdx} style={{ animation: `halaska-tab-fade 0.25s ${motion.easeOut} both` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ width: 8, height: 8, borderRadius: 4, flexShrink: 0, background: toneColor, transition: `background ${motion.smooth} ${motion.easeInOut}` }} />
          <Text size="sm" weight="medium" theme={theme} truncate>{src.name}</Text>
          <Text size="xs" mono theme={theme} style={{ color: pal.textTertiary, marginLeft: "auto", flexShrink: 0 }}>{src.domain}</Text>
        </div>
        <div style={{
          marginTop: 10, paddingLeft: 10, borderLeft: `2px solid ${pal.borderSubtle}`,
          ...tokens.type.sm, color: pal.textSecondary, fontFamily: tokens.font.sans,
          transition: `color ${motion.smooth} ${motion.easeInOut}, border-color ${motion.smooth} ${motion.easeInOut}`,
        }}>
          “{src.quote}”
        </div>
      </div>
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        marginTop: 12, paddingTop: 10, borderTop: `1px solid ${pal.borderSubtle}`,
        transition: `border-color ${motion.smooth} ${motion.easeInOut}`,
      }}>
        <CitePagerBtn direction="left" onClick={onPrev} theme={theme} />
        <span style={{ ...tokens.type.xs, fontFamily: tokens.font.mono, fontVariantNumeric: "tabular-nums", color: pal.textTertiary, transition: `color ${motion.smooth} ${motion.easeInOut}` }}>
          {srcIdx + 1} / {CITE_SOURCES.length}
        </span>
        <CitePagerBtn direction="right" onClick={onNext} theme={theme} />
      </div>
    </div>
  );
}

function CitationsPattern({ theme }) {
  const pal = usePal(theme);
  const rootRef = useRef(null);
  const [openChip, setOpenChip] = useState(null);   // segment index of the chip that opened the popover
  const [srcIdx, setSrcIdx] = useState(0);          // which source the popover shows (pager can move it)
  const [anchor, setAnchor] = useState({ left: 0, top: 0 });

  // Click outside closes
  useEffect(() => {
    if (openChip === null) return;
    const onDoc = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) setOpenChip(null);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [openChip]);

  const handleChip = (segIdx, cite) => (e) => {
    if (openChip === segIdx) { setOpenChip(null); return; }
    const r = e.currentTarget.getBoundingClientRect();
    const rootR = rootRef.current.getBoundingClientRect();
    const cx = r.left - rootR.left + r.width / 2;
    setAnchor({
      left: Math.max(0, Math.min(cx - CITE_POP_W / 2, rootR.width - CITE_POP_W)),
      top: r.bottom - rootR.top,
    });
    setSrcIdx(cite);
    setOpenChip(segIdx);
  };

  return (
    <div ref={rootRef} style={{ width: CITE_W, maxWidth: "100%", fontFamily: tokens.font.sans, position: "relative" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, animation: `halaska-step-in 0.4s ${motion.emphasized} both` }}>
        <AgentGlyph size={24} theme={theme} />
        <Caption theme={theme}>Answer · {CITE_SOURCES.length} sources</Caption>
      </div>
      <div style={{
        marginTop: 14, ...tokens.type.md, lineHeight: 1.85, color: pal.text,
        transition: `color ${motion.smooth} ${motion.easeInOut}`,
        animation: `halaska-step-in 0.4s ${motion.emphasized} 0.08s both`,
      }}>
        {CITE_SEGMENTS.map((s, i) =>
          s.t !== undefined
            ? <span key={i}>{s.t}</span>
            : <CiteChip key={i} n={s.cite + 1} active={openChip === i}
                onClick={handleChip(i, s.cite)} theme={theme} />
        )}
      </div>
      <div style={{ marginTop: 10, animation: `halaska-step-in 0.4s ${motion.emphasized} 0.16s both` }}>
        <Caption theme={theme}>Tap a citation to inspect its source</Caption>
      </div>
      {openChip !== null && (
        <CitePopover srcIdx={srcIdx} left={anchor.left} top={anchor.top}
          onPrev={() => setSrcIdx(k => (k + CITE_SOURCES.length - 1) % CITE_SOURCES.length)}
          onNext={() => setSrcIdx(k => (k + 1) % CITE_SOURCES.length)}
          theme={theme} />
      )}
    </div>
  );
}

// · Confidence — one claim rendered at three confidence levels
const CONF_LEVELS = ["High", "Medium", "Low"];

const CONF_STATES = {
  High: {
    tone: "success",
    meta: "High confidence · 3 corroborating sources",
    segments: [
      { t: "SOL perp funding is running 14 bps higher on Hyperliquid than on Binance. A divergence this wide has closed within 48 hours in 9 of the last 10 occurrences — the spread favors fading the rich leg." },
    ],
  },
  Medium: {
    tone: "warning",
    meta: "Medium confidence · 2 sources, 1 stale",
    segments: [
      { t: "SOL perp funding " },
      { hedge: "appears" },
      { t: " to be running ~14 bps higher on Hyperliquid than on Binance. Divergences this wide have closed within 48 hours before, but one funding feed is 40 minutes stale." },
    ],
  },
  Low: {
    tone: "danger",
    dim: true,
    banner: "Low confidence — treat as a hypothesis",
    meta: "Low confidence · 1 weak source",
    segments: [
      { t: "SOL perp funding " },
      { hedge: "may" },
      { t: " be diverging between Hyperliquid and Binance. The only confirming feed is 6 hours old — this could be stale data rather than a real spread." },
    ],
  },
};

const CONF_MISSING = [
  "Binance funding print from the last 6 hours",
  "A second venue confirming the Hyperliquid side",
];

function ConfidencePattern({ theme }) {
  const pal = usePal(theme);
  const [level, setLevel] = useState("High");
  const [verifying, setVerifying] = useState(false);
  const [missingOpen, setMissingOpen] = useState(false);
  const verifyTimer = useRef(null);

  useEffect(() => () => clearTimeout(verifyTimer.current), []);

  const state = CONF_STATES[level];
  const toneColor = { success: pal.success, warning: pal.warning, danger: pal.danger }[state.tone];

  const changeLevel = (l) => {
    clearTimeout(verifyTimer.current);
    setVerifying(false); setMissingOpen(false); setLevel(l);
  };

  const verify = () => {
    if (verifying) return;
    setVerifying(true);
    verifyTimer.current = setTimeout(() => { setVerifying(false); setMissingOpen(false); setLevel("Medium"); }, 1400);
  };

  return (
    <div style={{ width: 460, maxWidth: "100%", fontFamily: tokens.font.sans }}>
      <div style={{ animation: `halaska-step-in 0.4s ${motion.emphasized} both` }}>
        <SegmentedControl options={CONF_LEVELS} value={level} onChange={changeLevel} theme={theme} />
      </div>
      <div style={{
        marginTop: 14, borderRadius: tokens.radius.lg, overflow: "hidden",
        background: pal.bgElevated, border: `1px solid ${pal.border}`,
        boxShadow: `0 1px 4px ${pal.shadow}`,
        transition: `all ${motion.smooth} ${motion.easeInOut}`,
        animation: `halaska-step-in 0.4s ${motion.emphasized} 0.08s both`,
      }}>
        <div key={level} style={{ animation: `halaska-tab-fade 0.3s ${motion.easeOut} both` }}>
          {state.banner && (
            <div style={{
              display: "flex", alignItems: "center", gap: 8, padding: "9px 18px",
              background: pal.warningBg, borderBottom: `1px solid ${pal.borderSubtle}`,
              transition: `all ${motion.smooth} ${motion.easeInOut}`,
            }}>
              <span style={{ width: 6, height: 6, borderRadius: 3, flexShrink: 0, background: pal.warning }} />
              <Text size="sm" weight="medium" theme={theme} style={{ color: pal.warning }}>{state.banner}</Text>
            </div>
          )}
          <div style={{ padding: 18 }}>
            <div style={{
              ...tokens.type.md, lineHeight: 1.7,
              color: state.dim ? pal.textSecondary : pal.text,
              transition: `color ${motion.smooth} ${motion.easeInOut}`,
            }}>
              {state.segments.map((s, i) =>
                s.hedge
                  ? <span key={i} style={{
                      textDecoration: "underline dotted", textDecorationColor: pal.warning,
                      textUnderlineOffset: 3,
                    }}>{s.hedge}</span>
                  : <span key={i}>{s.t}</span>
              )}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 7, marginTop: 14 }}>
              <span style={{ width: 7, height: 7, borderRadius: 4, flexShrink: 0, background: toneColor, transition: `background ${motion.smooth} ${motion.easeInOut}` }} />
              <Caption theme={theme}>{state.meta}</Caption>
            </div>
            {level === "Low" && (
              <>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 14 }}>
                  <Button variant="secondary" size="sm" theme={theme} loading={verifying} onClick={verify}>
                    {verifying ? "Checking live feeds…" : "Verify with live data"}
                  </Button>
                  <Button variant="ghost" size="sm" theme={theme} onClick={() => setMissingOpen(o => !o)}>
                    Show what's missing
                  </Button>
                </div>
                <div style={{
                  overflow: "hidden", maxHeight: missingOpen ? 96 : 0, opacity: missingOpen ? 1 : 0,
                  transition: `max-height 0.45s ${motion.emphasized}, opacity ${motion.smooth} ${motion.easeInOut}`,
                }}>
                  <div style={{ paddingTop: 12, display: "flex", flexDirection: "column", gap: 6 }}>
                    {CONF_MISSING.map((m, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ width: 5, height: 5, borderRadius: 3, flexShrink: 0, background: pal.textMuted, transition: `background ${motion.smooth} ${motion.easeInOut}` }} />
                        <Text size="sm" secondary theme={theme}>{m}</Text>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// · Feedback — thumbs with a structured follow-up on negative
const FDBK_REASONS = ["Inaccurate", "Too vague", "Wrong data", "Other"];

function FdbkThumbIcon({ size = 14, down, style }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
      style={{ display: "block", flexShrink: 0, transform: down ? "rotate(180deg)" : "none", ...style }}>
      <path d="M7 10v12" />
      <path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2a3.13 3.13 0 0 1 3 3.88Z" />
    </svg>
  );
}

function FdbkVoteBtn({ down, active, flash, onClick, theme }) {
  const pal = usePal(theme);
  const [hover, setHover] = useState(false);
  return (
    <button onClick={onClick}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      aria-label={down ? "Not helpful" : "Helpful"}
      style={{
        ...interactiveBase, display: "flex", alignItems: "center", justifyContent: "center",
        padding: "7px 12px", borderRadius: tokens.radius.pill,
        background: flash ? pal.accent : active ? pal.accentBg : hover ? pal.bgSubtle : "transparent",
        border: `1px solid ${active || flash ? `${pal.accent}55` : pal.borderSubtle}`,
        color: flash ? "#fff" : active ? pal.accentText : hover ? pal.textSecondary : pal.textTertiary,
      }}>
      <FdbkThumbIcon size={13} down={down} />
    </button>
  );
}

function FdbkReasonChip({ label, selected, onClick, theme }) {
  const pal = usePal(theme);
  const [hover, setHover] = useState(false);
  return (
    <button onClick={onClick}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        ...interactiveBase, padding: "5px 12px", borderRadius: tokens.radius.pill,
        background: selected ? pal.accentBg : hover ? pal.bgMuted : pal.bgSubtle,
        border: `1px solid ${selected ? `${pal.accent}55` : pal.borderSubtle}`,
        ...tokens.type.sm, fontFamily: tokens.font.sans,
        fontWeight: selected ? tokens.weight.medium : tokens.weight.regular,
        color: selected ? pal.accentText : pal.textSecondary, whiteSpace: "nowrap",
      }}>{label}</button>
  );
}

function FeedbackPattern({ theme }) {
  const pal = usePal(theme);
  const [vote, setVote] = useState(null);       // null | "up" | "down"
  const [upFlash, setUpFlash] = useState(false);
  const [reasons, setReasons] = useState([]);
  const [note, setNote] = useState("");
  const [sent, setSent] = useState(false);
  const flashTimer = useRef(null);

  useEffect(() => () => clearTimeout(flashTimer.current), []);

  const voteUp = () => {
    if (sent) return;
    setVote("up");
    setUpFlash(true);
    clearTimeout(flashTimer.current);
    flashTimer.current = setTimeout(() => setUpFlash(false), 650);
  };

  const voteDown = () => {
    if (sent) return;
    setUpFlash(false);
    setVote(v => v === "down" ? null : "down");
  };

  const toggleReason = (r) =>
    setReasons(rs => rs.includes(r) ? rs.filter(x => x !== r) : [...rs, r]);

  const send = () => setSent(true);
  const panelOpen = vote === "down" && !sent;

  return (
    <div style={{ width: 440, maxWidth: "100%", fontFamily: tokens.font.sans }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, animation: `halaska-step-in 0.4s ${motion.emphasized} both` }}>
        <AgentGlyph size={24} theme={theme} />
        <Caption theme={theme}>Answer</Caption>
      </div>
      <div style={{
        marginTop: 14, ...tokens.type.md, lineHeight: 1.7, color: pal.text,
        transition: `color ${motion.smooth} ${motion.easeInOut}`,
        animation: `halaska-step-in 0.4s ${motion.emphasized} 0.08s both`,
      }}>
        Closed the ETH/USDC grid — realized +$212 over 6 days. Funding costs ate 9% of gross, most of it during Tuesday's spike.
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 14, animation: `halaska-step-in 0.4s ${motion.emphasized} 0.16s both` }}>
        <FdbkVoteBtn active={vote === "up"} flash={upFlash} onClick={voteUp} theme={theme} />
        <FdbkVoteBtn down active={vote === "down"} onClick={voteDown} theme={theme} />
        {vote === "up" && !upFlash && (
          <span style={{ animation: `halaska-fade-in 0.35s ${motion.easeOut} both` }}>
            <Caption theme={theme}>Thanks</Caption>
          </span>
        )}
      </div>
      <div style={{
        overflow: "hidden", maxHeight: panelOpen ? 240 : 0, opacity: panelOpen ? 1 : 0,
        transition: `max-height 0.45s ${motion.emphasized}, opacity ${motion.smooth} ${motion.easeInOut}`,
      }}>
        <div style={{
          marginTop: 12, padding: 16, borderRadius: tokens.radius.md,
          background: pal.bgSubtle, border: `1px solid ${pal.borderSubtle}`,
          transition: `all ${motion.smooth} ${motion.easeInOut}`,
        }}>
          <Text size="sm" weight="medium" theme={theme}>What went wrong?</Text>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 10 }}>
            {FDBK_REASONS.map(r => (
              <FdbkReasonChip key={r} label={r} selected={reasons.includes(r)}
                onClick={() => toggleReason(r)} theme={theme} />
            ))}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 12 }}>
            <TextInput value={note} onChange={setNote} placeholder="Add a note (optional)"
              size="sm" theme={theme} style={{ flex: 1 }} />
            <Button variant="primary" size="sm" theme={theme}
              disabled={reasons.length === 0 && !note.trim()} onClick={send}>Send</Button>
          </div>
        </div>
      </div>
      {sent && (
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 12, animation: `halaska-step-in 0.4s ${motion.emphasized} both` }}>
          <span style={{ width: 7, height: 7, borderRadius: 4, flexShrink: 0, background: pal.success, transition: `background ${motion.smooth} ${motion.easeInOut}` }} />
          <Text size="sm" secondary theme={theme}>Feedback recorded — Alpha will avoid this.</Text>
        </div>
      )}
    </div>
  );
}

// ─── UX PATTERNS · Agentic control — consent (new) ─────────

// ─── AGENTIC CONTROL · pre-action consent ─────────────────────
// Intervention points that must not look like errors: the agent
// states its plan, exposes its autonomy dial, scopes its
// permissions, and shows its queue — all on calm, neutral surfaces.

// · Plan preview — the agent states its plan in plain language before acting
const PLANPREV_STEPS = [
  "Close the losing ARB short (−$120)",
  "Trim SOL longs back to a 30% book weight",
  "Rotate $1,800 into the ETH/USDC basis trade",
  "Reset invalidation alerts at −8% per position",
];

function PlanPrevCheckMark({ pal }) {
  return (
    <svg viewBox="0 0 12 12" width="11" height="11" fill="none" stroke={pal.success} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="2,6 5,9 10,3" style={{ strokeDasharray: 14, strokeDashoffset: 14, animation: `halaska-check-draw 0.3s ${motion.easeOut} 0.05s forwards` }} />
    </svg>
  );
}

function PlanPrevStepRow({ index, displayNum, label, checked, editing, removed, onToggleRemove, theme }) {
  const pal = usePal(theme);
  const [hover, setHover] = useState(false);
  const [xHover, setXHover] = useState(false);
  return (
    <div onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        display: "flex", alignItems: "center", gap: 12, padding: "8px 10px",
        borderRadius: tokens.radius.md,
        background: hover && editing ? pal.bgSubtle : "transparent",
        opacity: removed ? 0.55 : 1,
        animation: `halaska-step-in 0.4s ${motion.emphasized} both`,
        animationDelay: `${index * 0.07}s`,
        transition: `background ${motion.normal} ${motion.easeInOut}, opacity ${motion.smooth} ${motion.easeInOut}`,
      }}>
      <span style={{
        width: 22, height: 22, borderRadius: 11, flexShrink: 0,
        display: "flex", alignItems: "center", justifyContent: "center",
        background: checked ? pal.successBg : pal.bgSubtle,
        color: pal.textSecondary, ...tokens.type.xs, fontFamily: tokens.font.mono,
        fontVariantNumeric: "tabular-nums",
        transition: `all ${motion.smooth} ${motion.easeInOut}`,
      }}>
        {checked ? <PlanPrevCheckMark pal={pal} /> : removed ? "·" : displayNum}
      </span>
      <Text size="base" theme={theme} style={{
        flex: 1, minWidth: 0,
        color: removed ? pal.textMuted : checked ? pal.textSecondary : pal.text,
        textDecoration: removed ? "line-through" : "none",
        transition: `color ${motion.smooth} ${motion.easeInOut}`,
      }}>{label}</Text>
      {editing && (
        <button onClick={onToggleRemove}
          onMouseEnter={() => setXHover(true)} onMouseLeave={() => setXHover(false)}
          aria-label={removed ? "Restore step" : "Remove step"}
          style={{
            ...interactiveBase, width: 22, height: 22, borderRadius: tokens.radius.sm,
            display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
            background: xHover ? pal.bgMuted : "transparent",
            color: xHover ? pal.text : pal.textTertiary,
            ...tokens.type.sm, padding: 0,
            animation: `halaska-scale-in 0.2s ${motion.easeOut} both`,
          }}>
          {removed ? "↺" : "×"}
        </button>
      )}
    </div>
  );
}

function PlanPreviewPattern({ theme }) {
  const pal = usePal(theme);
  const [phase, setPhase] = useState("review"); // review | edit | running | done | handoff
  const [removed, setRemoved] = useState([]);
  const [checkedCount, setCheckedCount] = useState(0);

  const activeIdx = PLANPREV_STEPS.map((_, i) => i).filter(i => !removed.includes(i));

  // Check the steps off one by one, then land on the receipt footer
  useEffect(() => {
    if (phase !== "running") return;
    const total = PLANPREV_STEPS.filter((_, i) => !removed.includes(i)).length;
    let n = 0;
    let finish;
    const iv = setInterval(() => {
      n += 1;
      setCheckedCount(n);
      if (n >= total) {
        clearInterval(iv);
        finish = setTimeout(() => setPhase("done"), 800);
      }
    }, 700);
    return () => { clearInterval(iv); clearTimeout(finish); };
  }, [phase, removed]);

  if (phase === "handoff") {
    return (
      <div style={{ width: 440, maxWidth: "100%", fontFamily: tokens.font.sans, animation: `halaska-scale-in 0.3s ${motion.easeOut} both` }}>
        <Stack direction="row" gap={10} align="center" style={{ padding: "12px 4px" }}>
          <AgentGlyph size={20} theme={theme} />
          <Text size="sm" secondary theme={theme} style={{ flex: 1 }}>Plan handed off — Alpha is standing by.</Text>
          <StatusBadge theme={theme} status="default">Standing by</StatusBadge>
        </Stack>
      </div>
    );
  }

  return (
    <div style={{ width: 440, maxWidth: "100%", fontFamily: tokens.font.sans }}>
      <Card theme={theme} padding={20}>
        <Stack gap={16}>
          <Stack direction="row" gap={10} align="center">
            <AgentGlyph size={24} theme={theme} />
            <div style={{ flex: 1 }}>
              <Caption theme={theme}>{phase === "edit" ? "Editing plan" : "Plan preview"}</Caption>
            </div>
            <StatusBadge theme={theme}
              status={phase === "running" ? "accent" : phase === "done" ? "online" : "default"}
              pulse={phase === "running"}>
              {phase === "running" ? "Executing" : phase === "done" ? "Done" : "Proposed"}
            </StatusBadge>
          </Stack>

          <div>
            <Text size="md" weight="semibold" theme={theme} style={{ display: "block" }}>Alpha wants to rebalance your book</Text>
            <Text size="sm" theme={theme} style={{ color: pal.textTertiary }}>
              {phase === "edit" ? "Tap × to drop a step — nothing runs until you lock it." : "Nothing runs until you say so."}
            </Text>
          </div>

          <Stack gap={2}>
            {PLANPREV_STEPS.map((label, i) => {
              const isRemoved = removed.includes(i);
              const pos = activeIdx.indexOf(i);
              return (
                <PlanPrevStepRow key={i} index={i} displayNum={pos + 1} label={label}
                  checked={!isRemoved && pos > -1 && pos < checkedCount}
                  editing={phase === "edit"} removed={isRemoved}
                  onToggleRemove={() => setRemoved(r => r.includes(i) ? r.filter(x => x !== i) : [...r, i])}
                  theme={theme} />
              );
            })}
          </Stack>

          {phase === "review" && (
            <Stack direction="row" gap={8} justify="flex-end">
              <Button theme={theme} variant="ghost" size="sm" onClick={() => setPhase("handoff")}>I'll do it myself</Button>
              <Button theme={theme} variant="secondary" size="sm" onClick={() => setPhase("edit")}>Edit plan</Button>
              <Button theme={theme} variant="accent" size="sm" disabled={activeIdx.length === 0} onClick={() => setPhase("running")}>Proceed</Button>
            </Stack>
          )}
          {phase === "edit" && (
            <Stack direction="row" gap={8} justify="flex-end" align="center">
              <Caption theme={theme}>{activeIdx.length} of {PLANPREV_STEPS.length} steps kept</Caption>
              <Button theme={theme} variant="accent" size="sm" onClick={() => setPhase("review")}>Lock plan</Button>
            </Stack>
          )}
          {phase === "running" && (
            <Stack direction="row" gap={10} align="center" style={{ minHeight: 30 }}>
              <ThinkingIndicator label="" size="sm" theme={theme} />
              <Text size="sm" secondary theme={theme}>Executing — {checkedCount} of {activeIdx.length}</Text>
            </Stack>
          )}
          {phase === "done" && (
            <Stack direction="row" gap={10} align="center" style={{ minHeight: 30, animation: `halaska-step-in 0.4s ${motion.emphasized} both` }}>
              <span style={{
                width: 22, height: 22, borderRadius: 11, background: pal.successBg, flexShrink: 0,
                display: "flex", alignItems: "center", justifyContent: "center",
                transition: `background ${motion.smooth} ${motion.easeInOut}`,
              }}>
                <PlanPrevCheckMark pal={pal} />
              </span>
              <Text size="sm" theme={theme} style={{ color: pal.textSecondary }}>
                Done — {activeIdx.length} actions taken · <span style={{ color: pal.accentText, cursor: "pointer" }}>view receipt</span>
              </Text>
            </Stack>
          )}
        </Stack>
      </Card>
    </div>
  );
}

// · Autonomy — per-task control over how much the agent may do
const AUTONOMY_LEVELS = [
  { id: "observe", title: "Observe", sub: "Watches, never acts", status: "default", badge: "Watching", pulse: false,
    caps: ["Reads positions and market structure", "Flags setups in your daily digest"] },
  { id: "suggest", title: "Suggest", sub: "Proposes, you execute", status: "default", badge: "Suggest only", pulse: false,
    caps: ["Drafts orders with size, entry, and exit", "You place every trade yourself"] },
  { id: "confirm", title: "Confirm", sub: "Acts after your OK", status: "accent", badge: "Asks first", pulse: false,
    caps: ["Can place orders — with confirmation", "Daily cap $2,500", "One tap approves, one dismisses"] },
  { id: "autonomous", title: "Autonomous", sub: "Acts, reports after", status: "online", badge: "Acting solo", pulse: true,
    caps: ["Places and manages orders solo", "Daily cap $2,500 still applies", "Receipt posted after every action"] },
];

function AutonomyLevelRow({ level, selected, onSelect, theme }) {
  const pal = usePal(theme);
  const [hover, setHover] = useState(false);
  return (
    <button onClick={onSelect}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        ...interactiveBase, display: "flex", alignItems: "flex-start", gap: 12,
        width: "100%", padding: "12px 14px", textAlign: "left",
        borderRadius: tokens.radius.md,
        background: selected ? pal.accentBg : hover ? pal.bgMuted : pal.bgSubtle,
        boxShadow: selected ? `inset 0 0 0 1.5px ${pal.accent}` : `inset 0 0 0 1px ${pal.borderSubtle}`,
      }}>
      <span style={{
        width: 14, height: 14, borderRadius: 7, flexShrink: 0, marginTop: 3,
        border: selected ? "none" : `1.5px solid ${pal.border}`,
        background: selected ? pal.accent : "transparent",
        display: "flex", alignItems: "center", justifyContent: "center",
        transition: `all ${motion.spring} ${motion.springCurve}`,
      }}>
        {selected && <span style={{ width: 5, height: 5, borderRadius: 3, background: "#fff", animation: `halaska-radio-dot-in 0.35s ${motion.springCurve} both` }} />}
      </span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <Text size="base" weight="medium" theme={theme} style={{ display: "block" }}>{level.title}</Text>
        <Text size="sm" theme={theme} style={{ color: pal.textTertiary }}>{level.sub}</Text>
        <div style={{
          overflow: "hidden", maxHeight: selected ? 110 : 0, opacity: selected ? 1 : 0,
          transition: `max-height 0.4s ${motion.emphasized}, opacity ${motion.smooth} ${motion.easeInOut}`,
        }}>
          <div style={{ paddingTop: 10, display: "flex", flexDirection: "column", gap: 6 }}>
            {selected && level.caps.map((c, i) => (
              <div key={c} style={{
                display: "flex", alignItems: "center", gap: 8,
                animation: `halaska-step-in 0.35s ${motion.emphasized} both`,
                animationDelay: `${i * 0.05}s`,
              }}>
                <span style={{ width: 5, height: 5, borderRadius: 3, background: pal.accent, flexShrink: 0, transition: `background ${motion.smooth} ${motion.easeInOut}` }} />
                <Text size="sm" secondary theme={theme}>{c}</Text>
              </div>
            ))}
          </div>
        </div>
      </div>
    </button>
  );
}

function AutonomyPattern({ theme }) {
  const pal = usePal(theme);
  const [levelId, setLevelId] = useState("confirm");
  const level = AUTONOMY_LEVELS.find(l => l.id === levelId);

  return (
    <div style={{ width: 420, maxWidth: "100%", fontFamily: tokens.font.sans }}>
      <Card theme={theme} padding={20}>
        <Stack gap={16}>
          <Stack direction="row" gap={10} align="center">
            <AgentGlyph size={24} theme={theme} />
            <div style={{ flex: 1 }}>
              <Text size="base" weight="semibold" theme={theme} style={{ display: "block" }}>Autonomy</Text>
              <Text size="sm" theme={theme} style={{ color: pal.textTertiary }}>How much can Alpha do on this task?</Text>
            </div>
            <span key={levelId} style={{ display: "inline-flex", animation: `halaska-scale-in 0.25s ${motion.easeOut} both` }}>
              <StatusBadge theme={theme} status={level.status} pulse={level.pulse}>{level.badge}</StatusBadge>
            </span>
          </Stack>
          <Stack gap={8}>
            {AUTONOMY_LEVELS.map(l => (
              <AutonomyLevelRow key={l.id} level={l} selected={l.id === levelId}
                onSelect={() => setLevelId(l.id)} theme={theme} />
            ))}
          </Stack>
        </Stack>
      </Card>
    </div>
  );
}

// · Permission scope — tools, data, and limits the agent can touch
const PERMSCOPE_TOOLS = [
  { id: "orders",    label: "Hyperliquid orders", sub: "Place and cancel perps" },
  { id: "transfers", label: "Wallet transfers",   sub: "Move funds out of 0x7A2f…9c1B" },
  { id: "market",    label: "Market data",        sub: "Coinglass, Kaiko, Birdeye" },
];

const PERMSCOPE_DATA = [
  { id: "history", label: "Position history", sub: "Fills, balances, funding paid" },
  { id: "exports", label: "P&L exports",      sub: "Writes CSV reports to your drive" },
];

function PermScopeRow({ label, sub, checked, onChange, theme }) {
  const pal = usePal(theme);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <Text size="base" theme={theme} style={{ display: "block" }}>{label}</Text>
        <Text size="sm" theme={theme} style={{ color: pal.textTertiary }}>{sub}</Text>
      </div>
      <SwitchToggle checked={checked} onChange={onChange} theme={theme} />
    </div>
  );
}

function PermScopeChip({ label, onClick, theme }) {
  const pal = usePal(theme);
  const [hover, setHover] = useState(false);
  return (
    <button onClick={onClick}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        ...interactiveBase, padding: "5px 12px", borderRadius: tokens.radius.pill,
        background: hover ? pal.bgHover : pal.bgElevated,
        boxShadow: `inset 0 0 0 1px ${pal.border}`,
        ...tokens.type.sm, fontWeight: tokens.weight.medium, color: pal.text,
      }}>
      {label}
    </button>
  );
}

function PermissionScopePattern({ theme }) {
  const pal = usePal(theme);
  const [on, setOn] = useState({ orders: true, transfers: false, market: true, history: true, exports: true });
  const [cap, setCap] = useState(500);
  const [transferMode, setTransferMode] = useState(null); // null | "every" | "once"

  const toggle = (id) => (next) => {
    setOn(o => ({ ...o, [id]: next }));
    if (id === "transfers" && !next) setTransferMode(null);
  };
  const showStrip = on.transfers && !transferMode;
  const capPct = (cap / 5000) * 100;

  // Live summary sentence, recomposed from state
  const summaryParts = [];
  summaryParts.push(on.orders
    ? `Alpha can trade on Hyperliquid up to $${cap.toLocaleString()}/day.`
    : "Alpha can read markets but can't place orders.");
  if (!on.transfers) summaryParts.push("Transfers stay off.");
  else if (transferMode === "every") summaryParts.push("Transfers need your approval every time.");
  else if (transferMode === "once") summaryParts.push("One transfer approved — then it locks again.");
  else summaryParts.push("Transfers are on — choose an approval rule.");
  const summary = summaryParts.join(" ");

  return (
    <div style={{ width: 460, maxWidth: "100%", fontFamily: tokens.font.sans }}>
      <Card theme={theme} padding={20}>
        <Stack gap={18}>
          <Stack direction="row" gap={10} align="center">
            <AgentGlyph size={24} theme={theme} />
            <div style={{ flex: 1 }}>
              <Text size="base" weight="semibold" theme={theme} style={{ display: "block" }}>What Alpha can touch</Text>
              <Text size="sm" theme={theme} style={{ color: pal.textTertiary }}>Scoped per agent — changes apply instantly</Text>
            </div>
          </Stack>

          <Stack gap={12}>
            <Caption theme={theme} style={{ textTransform: "uppercase", letterSpacing: 0.5, ...tokens.type.xs, fontWeight: tokens.weight.medium }}>Tools</Caption>
            {PERMSCOPE_TOOLS.map(t => (
              <PermScopeRow key={t.id} label={t.label} sub={t.sub} checked={on[t.id]} onChange={toggle(t.id)} theme={theme} />
            ))}
          </Stack>

          <div style={{
            overflow: "hidden", maxHeight: showStrip ? 110 : 0, opacity: showStrip ? 1 : 0,
            marginTop: showStrip ? 0 : -18,
            transition: `max-height 0.4s ${motion.emphasized}, opacity ${motion.smooth} ${motion.easeInOut}, margin-top 0.4s ${motion.emphasized}`,
          }}>
            <div style={{
              background: pal.warningBg, borderRadius: tokens.radius.md, padding: "12px 14px",
              display: "flex", flexDirection: "column", gap: 10,
              transition: `background ${motion.smooth} ${motion.easeInOut}`,
            }}>
              <Text size="sm" theme={theme} style={{ color: pal.text }}>Transfers let Alpha move funds out — require approval each time?</Text>
              <Stack direction="row" gap={8}>
                <PermScopeChip label="Every time" onClick={() => setTransferMode("every")} theme={theme} />
                <PermScopeChip label="Just once" onClick={() => setTransferMode("once")} theme={theme} />
              </Stack>
            </div>
          </div>

          <Stack gap={12}>
            <Caption theme={theme} style={{ textTransform: "uppercase", letterSpacing: 0.5, ...tokens.type.xs, fontWeight: tokens.weight.medium }}>Data</Caption>
            {PERMSCOPE_DATA.map(d => (
              <PermScopeRow key={d.id} label={d.label} sub={d.sub} checked={on[d.id]} onChange={toggle(d.id)} theme={theme} />
            ))}
          </Stack>

          <Stack gap={10}>
            <Caption theme={theme} style={{ textTransform: "uppercase", letterSpacing: 0.5, ...tokens.type.xs, fontWeight: tokens.weight.medium }}>Limits</Caption>
            <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 12 }}>
              <Text size="base" theme={theme}>Daily spend cap</Text>
              <span style={{
                ...tokens.type.sm, fontFamily: tokens.font.mono, fontVariantNumeric: "tabular-nums",
                color: pal.accentText, transition: `color ${motion.smooth} ${motion.easeInOut}`,
              }}>${cap.toLocaleString()}/day</span>
            </div>
            <input type="range" min={0} max={5000} step={50} value={cap}
              onChange={(e) => setCap(Number(e.target.value))}
              style={{
                width: "100%", height: 4, appearance: "none", WebkitAppearance: "none",
                background: `linear-gradient(to right, ${pal.accent} ${capPct}%, ${pal.bgMuted} ${capPct}%)`,
                borderRadius: 2, outline: "none", cursor: "pointer", border: "none",
              }} />
          </Stack>

          <Divider theme={theme} spacing={0} />
          <div key={summary} style={{ animation: `halaska-fade-in 0.3s ${motion.easeOut} both` }}>
            <Text size="sm" secondary theme={theme}>{summary}</Text>
          </div>
        </Stack>
      </Card>
    </div>
  );
}

// · Task queue — what the agent will work through, one task at a time
const QUEUE_ROW_H = 60;
const QUEUE_TASK_SECONDS = 4;
const QUEUE_TASKS = [
  { id: "q0", title: "Close the losing ARB short",  meta: "2 orders · Hyperliquid" },
  { id: "q1", title: "Rebalance SOL exposure",      meta: "3 orders · ~2 min" },
  { id: "q2", title: "Roll the ETH basis position", meta: "perps → spot · ~4 min" },
  { id: "q3", title: "Refresh funding-rate scan",   meta: "Coinglass · read-only" },
  { id: "q4", title: "Write the daily P&L note",    meta: "report · no orders" },
];

function QueueCtlButton({ glyph, disabled, onClick, label, theme }) {
  const pal = usePal(theme);
  const [hover, setHover] = useState(false);
  return (
    <button onClick={disabled ? undefined : onClick} aria-label={label}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        ...interactiveBase, width: 22, height: 22, borderRadius: tokens.radius.sm,
        display: "flex", alignItems: "center", justifyContent: "center", padding: 0,
        background: hover && !disabled ? pal.bgMuted : "transparent",
        color: disabled ? pal.textMuted : hover ? pal.text : pal.textTertiary,
        ...tokens.type.sm, fontFamily: tokens.font.mono,
        cursor: disabled ? "default" : "pointer",
      }}>
      {glyph}
    </button>
  );
}

function QueueTaskRow({ task, index, count, removing, onMoveUp, onMoveDown, onRemove, theme }) {
  const pal = usePal(theme);
  const [hover, setHover] = useState(false);
  return (
    <div onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        position: "absolute", left: 0, right: 0, top: index * QUEUE_ROW_H, height: QUEUE_ROW_H - 6,
        display: "flex", alignItems: "center", gap: 12, padding: "0 12px",
        borderRadius: tokens.radius.md,
        background: hover ? pal.bgSubtle : "transparent",
        boxShadow: `inset 0 0 0 1px ${pal.borderSubtle}`,
        opacity: removing ? 0 : 1,
        transform: removing ? "scale(0.97)" : "scale(1)",
        transition: `top 0.35s ${motion.emphasized}, opacity ${motion.normal} ${motion.easeInOut}, transform ${motion.normal} ${motion.easeInOut}, background ${motion.normal} ${motion.easeInOut}, box-shadow ${motion.smooth} ${motion.easeInOut}`,
      }}>
      <span style={{
        width: 20, height: 20, borderRadius: 10, flexShrink: 0,
        display: "flex", alignItems: "center", justifyContent: "center",
        background: pal.bgMuted, color: pal.textSecondary,
        ...tokens.type.xs, fontFamily: tokens.font.mono, fontVariantNumeric: "tabular-nums",
        transition: `all ${motion.smooth} ${motion.easeInOut}`,
      }}>{index + 1}</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Text size="base" weight="medium" theme={theme} truncate style={{ display: "block" }}>{task.title}</Text>
          {index === 0 && (
            <span style={{
              ...tokens.type.xxs, fontWeight: tokens.weight.medium, flexShrink: 0,
              color: pal.accentText, background: pal.accentBg, padding: "1px 6px",
              borderRadius: tokens.radius.pill, textTransform: "uppercase", letterSpacing: 0.4,
              transition: `all ${motion.smooth} ${motion.easeInOut}`,
            }}>Up next</span>
          )}
        </div>
        <Text size="xs" theme={theme} style={{ color: pal.textTertiary, fontFamily: tokens.font.mono }}>{task.meta}</Text>
      </div>
      <div style={{
        display: "flex", gap: 2, flexShrink: 0,
        opacity: hover ? 1 : 0, transition: `opacity ${motion.normal} ${motion.easeInOut}`,
        pointerEvents: hover ? "auto" : "none",
      }}>
        <QueueCtlButton glyph="↑" label="Move up" disabled={index === 0} onClick={onMoveUp} theme={theme} />
        <QueueCtlButton glyph="↓" label="Move down" disabled={index === count - 1} onClick={onMoveDown} theme={theme} />
        <QueueCtlButton glyph="×" label="Remove" onClick={onRemove} theme={theme} />
      </div>
    </div>
  );
}

function QueuePattern({ theme }) {
  const pal = usePal(theme);
  const [current, setCurrent] = useState(QUEUE_TASKS[0]);
  const [queue, setQueue] = useState(QUEUE_TASKS.slice(1));
  const [doneCount, setDoneCount] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [removing, setRemoving] = useState(null);
  const t0 = useRef(Date.now());
  const removeT = useRef(null);

  // Tick the elapsed timer while a task is running
  useEffect(() => {
    if (!current) return;
    const iv = setInterval(() => setElapsed((Date.now() - t0.current) / 1000), 100);
    return () => clearInterval(iv);
  }, [current]);

  // Complete the current task, promote the next one, restart the clock
  useEffect(() => {
    if (!current || elapsed < QUEUE_TASK_SECONDS) return;
    setDoneCount(d => d + 1);
    setCurrent(queue[0] || null);
    setQueue(q => q.slice(1));
    t0.current = Date.now();
    setElapsed(0);
  }, [elapsed, current, queue]);

  useEffect(() => () => clearTimeout(removeT.current), []);

  const moveTask = (i, dir) => setQueue(q => {
    const j = i + dir;
    if (j < 0 || j >= q.length) return q;
    const next = [...q];
    [next[i], next[j]] = [next[j], next[i]];
    return next;
  });

  const removeTask = (id) => {
    setRemoving(id);
    clearTimeout(removeT.current);
    removeT.current = setTimeout(() => {
      setQueue(q => q.filter(t => t.id !== id));
      setRemoving(null);
    }, 250);
  };

  return (
    <div style={{ width: 460, maxWidth: "100%", fontFamily: tokens.font.sans }}>
      <Stack gap={12}>
        <Stack direction="row" gap={10} align="center">
          <AgentGlyph size={24} theme={theme} />
          <div style={{ flex: 1 }}>
            <Caption theme={theme}>Working now</Caption>
          </div>
          {doneCount > 0 && (
            <span key={doneCount} style={{ display: "inline-flex", animation: `halaska-scale-in 0.3s ${motion.springCurve} both` }}>
              <Badge variant="success" theme={theme}>{doneCount} done</Badge>
            </span>
          )}
        </Stack>

        {current ? (
          <div key={current.id} style={{
            display: "flex", alignItems: "center", gap: 12, padding: "12px 14px",
            borderRadius: tokens.radius.md, background: pal.bgSubtle,
            boxShadow: `inset 0 0 0 1px ${pal.borderSubtle}`,
            animation: `halaska-step-in 0.4s ${motion.emphasized} both`,
            transition: `all ${motion.smooth} ${motion.easeInOut}`,
          }}>
            <ThinkingIndicator label="" size="sm" theme={theme} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <Text size="base" weight="medium" theme={theme} truncate style={{ display: "block" }}>{current.title}</Text>
              <Text size="xs" theme={theme} style={{ color: pal.textTertiary, fontFamily: tokens.font.mono }}>{current.meta}</Text>
            </div>
            <span style={{
              ...tokens.type.sm, fontFamily: tokens.font.mono, fontVariantNumeric: "tabular-nums",
              color: pal.textTertiary, flexShrink: 0, transition: `color ${motion.smooth} ${motion.easeInOut}`,
            }}>{elapsed.toFixed(1)}s</span>
          </div>
        ) : (
          <div style={{
            display: "flex", alignItems: "center", gap: 12, padding: "12px 14px",
            borderRadius: tokens.radius.md, background: pal.bgSubtle,
            boxShadow: `inset 0 0 0 1px ${pal.borderSubtle}`,
            animation: `halaska-scale-in 0.3s ${motion.easeOut} both`,
            transition: `all ${motion.smooth} ${motion.easeInOut}`,
          }}>
            <span style={{
              width: 22, height: 22, borderRadius: 11, background: pal.successBg, flexShrink: 0,
              display: "flex", alignItems: "center", justifyContent: "center",
              transition: `background ${motion.smooth} ${motion.easeInOut}`,
            }}>
              <svg viewBox="0 0 12 12" width="11" height="11" fill="none" stroke={pal.success} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="2,6 5,9 10,3" style={{ strokeDasharray: 14, strokeDashoffset: 14, animation: `halaska-check-draw 0.3s ${motion.easeOut} 0.1s forwards` }} />
              </svg>
            </span>
            <Text size="base" weight="medium" theme={theme}>All caught up — {doneCount} tasks done</Text>
          </div>
        )}

        <div style={{
          position: "relative", height: queue.length * QUEUE_ROW_H,
          transition: `height 0.35s ${motion.emphasized}`,
        }}>
          {queue.map((t, i) => (
            <QueueTaskRow key={t.id} task={t} index={i} count={queue.length}
              removing={removing === t.id}
              onMoveUp={() => moveTask(i, -1)}
              onMoveDown={() => moveTask(i, 1)}
              onRemove={() => removeTask(t.id)}
              theme={theme} />
          ))}
        </div>

        <Caption theme={theme}>
          {queue.length > 0 ? `${queue.length} queued · Alpha works one at a time` : "Queue clear · Alpha is standing by"}
        </Caption>
      </Stack>
    </div>
  );
}

// ─── UX PATTERNS · Agentic control — visibility (new) ──────

// · Agent status — persistent "what is it doing" pill with pause + redirect
const AGENTSTATUS_MAIN_PHASES = [
  "Scanning funding rates…",
  "Comparing venues…",
  "Drafting orders…",
];
const AGENTSTATUS_REDIRECT_PHASES = [
  "Re-planning…",
  "Working on your change…",
];

function agentstatusClock(s) {
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}

function AgentStatusDot({ color, pulse }) {
  return (
    <span style={{ position: "relative", width: 7, height: 7, flexShrink: 0 }}>
      <span style={{
        position: "absolute", inset: 0, borderRadius: 4, background: color,
        transition: `background ${motion.smooth} ${motion.easeInOut}`,
      }} />
      {pulse && (
        <span style={{
          position: "absolute", inset: 0, borderRadius: 4, background: color,
          animation: `halaska-live-pulse 1.4s ${motion.easeOut} infinite`,
        }} />
      )}
    </span>
  );
}

function AgentStatusPattern({ theme }) {
  const pal = usePal(theme);
  const [mode, setMode] = useState("main");        // main | redirect
  const [phaseIdx, setPhaseIdx] = useState(0);     // index into the active phase list
  const [paused, setPaused] = useState(false);
  const [redirectOpen, setRedirectOpen] = useState(false);
  const [note, setNote] = useState("");
  const [elapsed, setElapsed] = useState(0);

  const phases = mode === "main" ? AGENTSTATUS_MAIN_PHASES : AGENTSTATUS_REDIRECT_PHASES;
  const working = phaseIdx < phases.length;
  const waiting = mode === "main" && !working;     // main cycle ended → needs approval
  const done = mode === "redirect" && !working;    // redirect cycle ended → finished

  // Advance one phase every ~1.8s while running (pause keeps the index)
  useEffect(() => {
    if (paused || phaseIdx >= phases.length) return;
    const t = setTimeout(() => setPhaseIdx(i => i + 1), 1800);
    return () => clearTimeout(t);
  }, [paused, mode, phaseIdx, phases.length]);

  // Elapsed clock ticks only while actually working
  useEffect(() => {
    if (paused || !working) return;
    const iv = setInterval(() => setElapsed(e => e + 1), 1000);
    return () => clearInterval(iv);
  }, [paused, working]);

  const dot = done ? { color: pal.success, pulse: false }
    : paused ? { color: pal.textMuted, pulse: false }
    : waiting ? { color: pal.warning, pulse: false }
    : { color: pal.accent, pulse: true };

  const label = done ? "Done — orders redrafted to your note"
    : paused ? "Paused — progress kept"
    : waiting ? "Waiting on you — 2 orders need approval"
    : phases[phaseIdx];

  const sendRedirect = () => {
    if (!note.trim()) return;
    setMode("redirect"); setPhaseIdx(0);
    setRedirectOpen(false); setNote(""); setPaused(false);
  };

  return (
    <div style={{ width: 460, maxWidth: "100%", fontFamily: tokens.font.sans }}>
      <Stack gap={10}>
        <div style={{ display: "flex", gap: 8, alignItems: "center", animation: `halaska-step-in 0.4s ${motion.emphasized} both` }}>
          <div style={{
            display: "flex", alignItems: "center", gap: 10, padding: "9px 14px",
            borderRadius: tokens.radius.pill, background: pal.bgSubtle,
            border: `1px solid ${pal.borderSubtle}`, minWidth: 0,
            transition: `all ${motion.smooth} ${motion.easeInOut}`,
          }}>
            <AgentStatusDot color={dot.color} pulse={dot.pulse} />
            <span key={label} style={{
              ...tokens.type.sm, fontWeight: tokens.weight.medium, color: pal.text,
              whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
              animation: `halaska-tab-fade 0.25s ${motion.easeOut} both`,
              transition: `color ${motion.smooth} ${motion.easeInOut}`,
            }}>{label}</span>
          </div>
          {!done && (
            <>
              <IconButton theme={theme} size={28} icon={paused ? "▶" : "‖"}
                label={paused ? "Resume" : "Pause"} onClick={() => setPaused(p => !p)} />
              <IconButton theme={theme} size={28} icon="⤳" label="Redirect"
                onClick={() => setRedirectOpen(o => !o)} />
            </>
          )}
        </div>
        {redirectOpen && !done && (
          <div style={{ display: "flex", gap: 8, alignItems: "flex-start", animation: `halaska-step-in 0.35s ${motion.emphasized} both` }}>
            <TextInput theme={theme} size="sm" value={note} onChange={setNote}
              placeholder="Tell Alpha what to do instead…" style={{ flex: 1 }} />
            <Button theme={theme} variant="accent" size="sm" disabled={!note.trim()} onClick={sendRedirect}>Send</Button>
          </div>
        )}
        <div style={{
          display: "flex", gap: 6, alignItems: "baseline", paddingLeft: 14,
          animation: `halaska-step-in 0.4s ${motion.emphasized} 0.08s both`,
        }}>
          <Text size="xs" theme={theme} style={{ color: pal.textTertiary }}>
            Alpha · step {Math.min(phaseIdx + 1, phases.length)} of {phases.length}
          </Text>
          <Text size="xs" mono theme={theme} style={{ color: pal.textTertiary, fontVariantNumeric: "tabular-nums" }}>
            · {agentstatusClock(elapsed)} elapsed
          </Text>
        </div>
      </Stack>
    </div>
  );
}

// · Handoff — the agent escalates to a human with prepared context, calmly
const HANDOFF_CONTEXT_ROWS = [
  { label: "Position",        value: "SOL/USDC perp · long" },
  { label: "Proposed size",   value: "$3,900 notional" },
  { label: "Risk if delayed", value: "≈ $38/day funding" },
];

function HandoffCheckIcon({ color, bg }) {
  return (
    <span style={{
      width: 22, height: 22, borderRadius: 11, background: bg, flexShrink: 0,
      display: "flex", alignItems: "center", justifyContent: "center",
      transition: `background ${motion.smooth} ${motion.easeInOut}`,
    }}>
      <svg viewBox="0 0 12 12" width="10" height="10" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="2,6 5,9 10,3" style={{ strokeDasharray: 14, strokeDashoffset: 14, animation: `halaska-check-draw 0.3s ${motion.easeOut} 0.1s forwards` }} />
      </svg>
    </span>
  );
}

function HandoffPattern({ theme }) {
  const pal = usePal(theme);
  const [stage, setStage] = useState("working"); // working | handoff | taken | raising | raised

  // Autoplay: agent works for ~2s, then hands off
  useEffect(() => {
    const t = setTimeout(() => setStage("handoff"), 2000);
    return () => clearTimeout(t);
  }, []);

  // Raising the cap briefly resumes, then resolves
  useEffect(() => {
    if (stage !== "raising") return;
    const t = setTimeout(() => setStage("raised"), 1500);
    return () => clearTimeout(t);
  }, [stage]);

  return (
    <div style={{ width: 440, maxWidth: "100%", fontFamily: tokens.font.sans }}>
      <Card theme={theme} padding={20}>
        {stage === "working" ? (
          <Stack direction="row" gap={12} align="center" style={{ minHeight: 28 }}>
            <AgentGlyph size={24} theme={theme} />
            <ThinkingIndicator label="Sizing the December roll…" size="sm" theme={theme} />
          </Stack>
        ) : (
          <div style={{ animation: `halaska-tab-fade 0.3s ${motion.easeOut} both` }}>
            <Stack gap={16}>
              <Stack direction="row" gap={10} align="center">
                <AgentGlyph size={24} theme={theme} />
                <div style={{ flex: 1 }}>
                  <Caption theme={theme}>Autonomy cap reached</Caption>
                </div>
                <Badge theme={theme} variant="accent">Your turn</Badge>
              </Stack>
              <div style={{
                borderLeft: `2px solid ${pal.accent}`, background: pal.accentBg,
                borderRadius: `0 ${tokens.radius.sm}px ${tokens.radius.sm}px 0`,
                padding: "12px 14px",
                animation: `halaska-step-in 0.4s ${motion.emphasized} 0.05s both`,
                transition: `all ${motion.smooth} ${motion.easeInOut}`,
              }}>
                <Text size="md" weight="semibold" theme={theme} style={{ display: "block" }}>Alpha is handing this to you</Text>
                <Text size="sm" secondary theme={theme}>Order size exceeds your $2,500 autonomy cap</Text>
              </div>
              <div style={{
                borderRadius: tokens.radius.md, background: pal.bgSubtle,
                border: `1px solid ${pal.borderSubtle}`, padding: "4px 14px",
                transition: `all ${motion.smooth} ${motion.easeInOut}`,
              }}>
                {HANDOFF_CONTEXT_ROWS.map((r, i) => (
                  <div key={r.label} style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    gap: 12, padding: "9px 0",
                    borderBottom: i < HANDOFF_CONTEXT_ROWS.length - 1 ? `1px solid ${pal.borderSubtle}` : "none",
                    animation: `halaska-step-in 0.4s ${motion.emphasized} ${0.15 + i * 0.09}s both`,
                    transition: `border-color ${motion.smooth} ${motion.easeInOut}`,
                  }}>
                    <Text size="sm" secondary theme={theme}>{r.label}</Text>
                    <Text size="sm" mono theme={theme} style={{ fontVariantNumeric: "tabular-nums" }}>{r.value}</Text>
                  </div>
                ))}
              </div>
              <div key={stage} style={{ animation: `halaska-tab-fade 0.3s ${motion.easeOut} ${stage === "handoff" ? "0.42s" : "0s"} both` }}>
                {stage === "handoff" && (
                  <Stack direction="row" gap={8} wrap>
                    <Button theme={theme} variant="primary" size="sm" onClick={() => setStage("taken")}>Take over</Button>
                    <Button theme={theme} variant="secondary" size="sm" onClick={() => setStage("raising")}>Raise cap to $5,000 &amp; let Alpha finish</Button>
                  </Stack>
                )}
                {stage === "taken" && (
                  <Stack direction="row" gap={10} align="center">
                    <HandoffCheckIcon color={pal.success} bg={pal.successBg} />
                    <Text size="sm" secondary theme={theme}>You have control — Alpha left notes in the thread.</Text>
                  </Stack>
                )}
                {stage === "raising" && (
                  <div style={{ minHeight: 22, display: "flex", alignItems: "center" }}>
                    <ThinkingIndicator label="Resuming with new cap…" size="sm" theme={theme} />
                  </div>
                )}
                {stage === "raised" && (
                  <Stack direction="row" gap={10} align="center">
                    <HandoffCheckIcon color={pal.success} bg={pal.successBg} />
                    <Text size="sm" weight="medium" theme={theme}>Done — filled at <span style={{ fontFamily: tokens.font.mono }}>$148.20</span></Text>
                  </Stack>
                )}
              </div>
            </Stack>
          </div>
        )}
      </Card>
    </div>
  );
}

// ─── UX PATTERNS · Agentic control — accountability (new) ───

// ─── Agentic control · post-action accountability ────────────
// Evidence over cheerfulness: receipts, restore points, audit
// trails, and structured mistake messages.

// · Action receipt — evidence of what changed, with a time-limited undo
const RECEIPT_UNDO_SECONDS = 10;

const RECEIPT_META = [
  { label: "What",      value: "Bought 12.4 SOL @ $151.02" },
  { label: "Where",     value: "Hyperliquid · SOL/USDC" },
  { label: "Authority", value: "Within your $2,500 cap — no approval needed" },
];

const RECEIPT_META_REVERSED = [
  { label: "What",      value: "Sold 12.4 SOL @ $150.98" },
  { label: "Where",     value: "Hyperliquid · SOL/USDC" },
  { label: "Net",       value: "−$0.50 slippage · position fully restored" },
];

function ReceiptMetaRow({ label, value, theme }) {
  const pal = usePal(theme);
  return (
    <div style={{ display: "flex", gap: 12, alignItems: "baseline" }}>
      <span style={{
        ...tokens.type.xs, fontFamily: tokens.font.mono, color: pal.textTertiary,
        textTransform: "uppercase", letterSpacing: 0.5, width: 66, flexShrink: 0,
        transition: `color ${motion.smooth} ${motion.easeInOut}`,
      }}>{label}</span>
      <span style={{
        ...tokens.type.sm, fontFamily: tokens.font.mono, color: pal.textSecondary,
        transition: `color ${motion.smooth} ${motion.easeInOut}`,
      }}>{value}</span>
    </div>
  );
}

function ReceiptBeforeAfter({ before, after, delta, deltaColor, unit, theme }) {
  const pal = usePal(theme);
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 10, padding: "10px 14px",
      borderRadius: tokens.radius.md, background: pal.bgSubtle,
      transition: `background ${motion.smooth} ${motion.easeInOut}`,
    }}>
      <span style={{ ...tokens.type.xs, color: pal.textTertiary, textTransform: "uppercase", letterSpacing: 0.5, fontFamily: tokens.font.sans, transition: `color ${motion.smooth} ${motion.easeInOut}` }}>Position</span>
      <span style={{ ...tokens.type.sm, fontFamily: tokens.font.mono, color: pal.textTertiary, fontVariantNumeric: "tabular-nums", transition: `color ${motion.smooth} ${motion.easeInOut}` }}>{before.toFixed(1)}</span>
      <span style={{ ...tokens.type.sm, color: pal.textMuted, transition: `color ${motion.smooth} ${motion.easeInOut}` }}>→</span>
      <span style={{ ...tokens.type.sm, fontFamily: tokens.font.mono, fontWeight: tokens.weight.semibold, color: pal.text, fontVariantNumeric: "tabular-nums", transition: `color ${motion.smooth} ${motion.easeInOut}` }}>
        {after.toFixed(1)} {unit}
      </span>
      <span style={{
        ...tokens.type.xs, fontFamily: tokens.font.mono, fontWeight: tokens.weight.medium,
        color: deltaColor, marginLeft: "auto", fontVariantNumeric: "tabular-nums",
        transition: `color ${motion.smooth} ${motion.easeInOut}`,
      }}>{delta}</span>
    </div>
  );
}

function ActionReceiptPattern({ theme }) {
  const pal = usePal(theme);
  const [phase, setPhase] = useState("active"); // active | expired | reversed
  const [secondsLeft, setSecondsLeft] = useState(RECEIPT_UNDO_SECONDS);
  const [afterVal, setAfterVal] = useState(48.2);
  const [undoHover, setUndoHover] = useState(false);
  const [linkHover, setLinkHover] = useState(false);
  const undoneRef = useRef(false);

  // Countdown — ticks the undo window down, then quietly closes it
  useEffect(() => {
    const t0 = Date.now();
    const iv = setInterval(() => {
      if (undoneRef.current) { clearInterval(iv); return; }
      const left = Math.max(0, RECEIPT_UNDO_SECONDS - (Date.now() - t0) / 1000);
      setSecondsLeft(left);
      if (left <= 0) { clearInterval(iv); setPhase("expired"); }
    }, 100);
    return () => clearInterval(iv);
  }, []);

  // Count-up — the "after" number settles into place on mount
  useEffect(() => {
    let iv;
    const start = setTimeout(() => {
      const t0 = Date.now(); const dur = 900;
      iv = setInterval(() => {
        const t = Math.min(1, (Date.now() - t0) / dur);
        const eased = 1 - Math.pow(1 - t, 3);
        setAfterVal(48.2 + 12.4 * eased);
        if (t >= 1) clearInterval(iv);
      }, 30);
    }, 350);
    return () => { clearTimeout(start); clearInterval(iv); };
  }, []);

  const handleUndo = () => {
    if (phase !== "active") return;
    undoneRef.current = true;
    setPhase("reversed");
  };

  const reversed = phase === "reversed";
  const ringC = 2 * Math.PI * 5.5;
  const timeLabel = `0:${String(Math.ceil(secondsLeft)).padStart(2, "0")}`;

  return (
    <div style={{ width: 440, maxWidth: "100%", fontFamily: tokens.font.sans }}>
      <Card theme={theme} padding={20}>
        <Stack gap={16}>
          {/* Header — status dot, title, timestamp */}
          <div key={phase === "reversed" ? "rev" : "fwd"} style={{ display: "flex", alignItems: "center", gap: 10, animation: `halaska-step-in 0.4s ${motion.emphasized} both` }}>
            <span style={{ position: "relative", width: 8, height: 8, borderRadius: 4, background: reversed ? pal.textTertiary : pal.success, flexShrink: 0, transition: `background ${motion.smooth} ${motion.easeInOut}` }}>
              {!reversed && phase === "active" && (
                <span style={{ position: "absolute", inset: 0, borderRadius: 4, background: pal.success, animation: `halaska-live-pulse 1.4s ${motion.easeOut} infinite` }} />
              )}
            </span>
            <Text size="base" weight="semibold" theme={theme}>{reversed ? "Reversed" : "Order placed"}</Text>
            <span style={{ ...tokens.type.xs, fontFamily: tokens.font.mono, color: pal.textTertiary, marginLeft: "auto", fontVariantNumeric: "tabular-nums", transition: `color ${motion.smooth} ${motion.easeInOut}` }}>
              {reversed ? "14:32:19 UTC" : "14:32:07 UTC"}
            </span>
          </div>

          {/* What / where / authority */}
          <Stack gap={8}>
            {(reversed ? RECEIPT_META_REVERSED : RECEIPT_META).map((r, i) => (
              <div key={`${reversed ? "r" : "f"}-${r.label}`} style={{ animation: `halaska-step-in 0.35s ${motion.emphasized} ${i * 0.06}s both` }}>
                <ReceiptMetaRow label={r.label} value={r.value} theme={theme} />
              </div>
            ))}
          </Stack>

          {/* Before → after strip */}
          {reversed ? (
            <div style={{ animation: `halaska-step-in 0.4s ${motion.emphasized} 0.15s both` }}>
              <ReceiptBeforeAfter before={60.6} after={48.2} delta="−12.4 SOL" deltaColor={pal.textSecondary} unit="SOL" theme={theme} />
            </div>
          ) : (
            <ReceiptBeforeAfter before={48.2} after={afterVal} delta="+12.4 SOL" deltaColor={pal.success} unit="SOL" theme={theme} />
          )}

          <Divider theme={theme} spacing={0} />

          {/* Footer — time-limited undo, then a quiet audit link */}
          {phase === "active" && (
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <button onClick={handleUndo}
                onMouseEnter={() => setUndoHover(true)} onMouseLeave={() => setUndoHover(false)}
                style={{
                  ...interactiveBase, display: "inline-flex", alignItems: "center", gap: 8,
                  padding: "7px 14px", borderRadius: tokens.radius.md,
                  background: pal.bgMuted, color: pal.text,
                  ...tokens.type.sm, fontWeight: tokens.weight.medium,
                  filter: undoHover ? "brightness(1.06)" : "brightness(1)",
                  boxShadow: undoHover ? "inset 0 -2px 0 0 rgba(0,0,0,0.05)" : "none",
                }}>
                <svg width="14" height="14" viewBox="0 0 14 14" style={{ flexShrink: 0 }}>
                  <circle cx="7" cy="7" r="5.5" fill="none" stroke={pal.borderSubtle} strokeWidth="1.5" />
                  <circle cx="7" cy="7" r="5.5" fill="none" stroke={pal.text} strokeWidth="1.5" strokeLinecap="round"
                    strokeDasharray={ringC} strokeDashoffset={ringC * (1 - secondsLeft / RECEIPT_UNDO_SECONDS)}
                    transform="rotate(-90 7 7)" style={{ transition: "stroke-dashoffset 0.1s linear" }} />
                </svg>
                Undo
                <span style={{ fontFamily: tokens.font.mono, ...tokens.type.xs, color: pal.textSecondary, fontVariantNumeric: "tabular-nums" }}>{timeLabel}</span>
              </button>
              <Caption theme={theme}>Reversible for {RECEIPT_UNDO_SECONDS} seconds</Caption>
            </div>
          )}
          {phase === "expired" && (
            <div style={{ display: "flex", alignItems: "center", gap: 12, animation: `halaska-fade-in 0.35s ${motion.easeOut} both` }}>
              <button
                onMouseEnter={() => setLinkHover(true)} onMouseLeave={() => setLinkHover(false)}
                style={{
                  ...interactiveBase, background: "transparent", padding: "4px 0",
                  ...tokens.type.sm, fontWeight: tokens.weight.medium,
                  color: linkHover ? pal.text : pal.textSecondary,
                  textDecoration: "underline", textUnderlineOffset: 3,
                  textDecorationColor: linkHover ? pal.textSecondary : pal.borderSubtle,
                }}>
                View in audit log
              </button>
              <Caption theme={theme}>Undo window closed</Caption>
            </div>
          )}
          {phase === "reversed" && (
            <div style={{ display: "flex", alignItems: "center", gap: 12, animation: `halaska-step-in 0.4s ${motion.emphasized} 0.25s both` }}>
              <button
                onMouseEnter={() => setLinkHover(true)} onMouseLeave={() => setLinkHover(false)}
                style={{
                  ...interactiveBase, background: "transparent", padding: "4px 0",
                  ...tokens.type.sm, fontWeight: tokens.weight.medium,
                  color: linkHover ? pal.text : pal.textSecondary,
                  textDecoration: "underline", textUnderlineOffset: 3,
                  textDecorationColor: linkHover ? pal.textSecondary : pal.borderSubtle,
                }}>
                View in audit log
              </button>
              <Caption theme={theme}>Reversal logged · nothing else was affected</Caption>
            </div>
          )}
        </Stack>
      </Card>
    </div>
  );
}

// · Checkpoints — named restore points in an agent session
const CKPT_ITEMS = [
  { id: "ckpt-1", name: "Before rebalance", time: "13:58", delta: "PnL +$86" },
  { id: "ckpt-2", name: "After ARB close",  time: "14:21", delta: "PnL +$129" },
  { id: "ckpt-3", name: "Current",          time: "14:32", delta: "PnL +$142" },
];

function CkptRestoreButton({ visible, onClick, theme }) {
  const pal = usePal(theme);
  const [hover, setHover] = useState(false);
  return (
    <button onClick={onClick} tabIndex={visible ? 0 : -1}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        ...interactiveBase, padding: "5px 12px", borderRadius: tokens.radius.sm,
        background: pal.bgMuted, color: pal.text,
        ...tokens.type.xs, fontWeight: tokens.weight.medium,
        opacity: visible ? 1 : 0, transform: visible ? "translateX(0)" : "translateX(4px)",
        pointerEvents: visible ? "auto" : "none",
        filter: hover ? "brightness(1.06)" : "brightness(1)",
      }}>
      Restore
    </button>
  );
}

function CheckpointPattern({ theme }) {
  const pal = usePal(theme);
  const [currentIdx, setCurrentIdx] = useState(CKPT_ITEMS.length - 1);
  const [confirmIdx, setConfirmIdx] = useState(null);
  const [phase, setPhase] = useState("idle"); // idle | verifying | restored
  const [targetIdx, setTargetIdx] = useState(null);
  const [reversedCount, setReversedCount] = useState(0);
  const [hoverIdx, setHoverIdx] = useState(null);

  // Restore — brief verification pass, then the target becomes Current
  useEffect(() => {
    if (phase !== "verifying") return;
    const t = setTimeout(() => {
      setCurrentIdx(targetIdx);
      setPhase("restored");
    }, 1500);
    return () => clearTimeout(t);
  }, [phase, targetIdx]);

  const beginRestore = (idx) => {
    setReversedCount(currentIdx - idx);
    setTargetIdx(idx);
    setConfirmIdx(null);
    setPhase("verifying");
  };

  const collapsed = (idx) => (phase === "verifying" || phase === "restored") && idx > targetIdx;

  return (
    <div style={{ width: 420, maxWidth: "100%", fontFamily: tokens.font.sans }}>
      <Stack gap={14}>
        <Stack direction="row" gap={10} align="center">
          <AgentGlyph size={24} theme={theme} />
          <Caption theme={theme}>Session checkpoints</Caption>
        </Stack>
        <div>
          {CKPT_ITEMS.map((c, i) => {
            const isCurrent = i === currentIdx && phase !== "verifying";
            const isPast = i < currentIdx && phase === "idle";
            const lastVisible = collapsed(i + 1) || i === CKPT_ITEMS.length - 1;
            return (
              <div key={c.id} style={{
                overflow: "hidden",
                maxHeight: collapsed(i) ? 0 : 120,
                opacity: collapsed(i) ? 0 : 1,
                transition: `max-height 0.45s ${motion.emphasized}, opacity ${motion.smooth} ${motion.easeIn}`,
              }}>
                <div
                  onMouseEnter={() => setHoverIdx(i)} onMouseLeave={() => setHoverIdx(null)}
                  style={{ display: "flex", gap: 12, position: "relative", animation: `halaska-step-in 0.4s ${motion.emphasized} ${i * 0.08}s both` }}>
                  {/* Rail — dot and connecting line */}
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 10 }}>
                    <span style={{
                      position: "relative", width: isCurrent ? 9 : 7, height: isCurrent ? 9 : 7,
                      borderRadius: 5, marginTop: 6, flexShrink: 0,
                      background: isCurrent ? pal.accent : pal.textMuted,
                      transition: `all ${motion.spring} ${motion.springCurve}`,
                    }}>
                      {isCurrent && (
                        <span style={{ position: "absolute", inset: 0, borderRadius: 5, background: pal.accent, animation: `halaska-live-pulse 1.4s ${motion.easeOut} infinite` }} />
                      )}
                    </span>
                    {!lastVisible && (
                      <span style={{ width: 1, flex: 1, background: pal.borderSubtle, marginTop: 4, transition: `background ${motion.smooth} ${motion.easeInOut}` }} />
                    )}
                  </div>
                  {/* Body */}
                  <div style={{ flex: 1, minWidth: 0, paddingBottom: lastVisible ? 0 : 18 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, minHeight: 26 }}>
                      <Text size="base" weight={isCurrent ? "semibold" : "medium"} theme={theme}
                        style={{ color: isCurrent ? pal.text : pal.textSecondary }}>{c.name}</Text>
                      <span style={{ ...tokens.type.xs, fontFamily: tokens.font.mono, color: pal.textTertiary, fontVariantNumeric: "tabular-nums", transition: `color ${motion.smooth} ${motion.easeInOut}` }}>{c.time}</span>
                      <span style={{ ...tokens.type.xs, fontFamily: tokens.font.mono, color: pal.textTertiary, marginLeft: "auto", fontVariantNumeric: "tabular-nums", transition: `color ${motion.smooth} ${motion.easeInOut}` }}>{c.delta}</span>
                      <CkptRestoreButton theme={theme}
                        visible={isPast && hoverIdx === i && confirmIdx === null}
                        onClick={() => setConfirmIdx(i)} />
                    </div>
                    {isCurrent && phase === "restored" && (
                      <div style={{ animation: `halaska-step-in 0.4s ${motion.emphasized} 0.1s both`, marginTop: 2 }}>
                        <Caption theme={theme}>Restored — {reversedCount} action{reversedCount === 1 ? "" : "s"} reversed</Caption>
                      </div>
                    )}
                    {/* Inline confirm strip — neutral, not a modal */}
                    {confirmIdx === i && (
                      <div style={{
                        marginTop: 8, padding: "10px 12px", borderRadius: tokens.radius.md,
                        background: pal.bgSubtle, boxShadow: `inset 0 0 0 1px ${pal.borderSubtle}`,
                        animation: `halaska-step-in 0.35s ${motion.emphasized} both`,
                        transition: `all ${motion.smooth} ${motion.easeInOut}`,
                      }}>
                        <Text size="sm" secondary theme={theme} style={{ display: "block", marginBottom: 8 }}>
                          Roll back {currentIdx - i} action{currentIdx - i === 1 ? "" : "s"}? Alpha will re-verify positions first.
                        </Text>
                        <Stack direction="row" gap={6}>
                          <Button theme={theme} variant="secondary" size="sm" onClick={() => beginRestore(i)}>Restore</Button>
                          <Button theme={theme} variant="ghost" size="sm" onClick={() => setConfirmIdx(null)}>Keep going</Button>
                        </Stack>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        {phase === "verifying" && (
          <div style={{ animation: `halaska-step-in 0.35s ${motion.emphasized} both` }}>
            <ThinkingIndicator label="Verifying positions" size="sm" theme={theme} />
          </div>
        )}
      </Stack>
    </div>
  );
}

// · Audit log — the filterable record of what the agent did
const AUDITLOG_ROWS = [
  { id: "al-1", time: "14:32", title: "Bought 12.4 SOL @ $151.02",   status: "done",   authority: "Within $2,500 session cap", detail: "Hyperliquid · SOL/USDC · filled in 1.8s" },
  { id: "al-2", time: "14:21", title: "Closed ARB position",          status: "done",   authority: "Standing exit rule · −8% invalidation", detail: "Hyperliquid · ARB/USDC · +$129 realized" },
  { id: "al-3", time: "14:05", title: "Moved ETH stop to $2,395",     status: "review", authority: "Corrective action — stale feed repair", detail: "Stop was set from a stale Kaiko price" },
  { id: "al-4", time: "13:58", title: "Rebalanced USDC reserve",      status: "done",   authority: "Within 20% reserve floor policy", detail: "Moved $410 from margin to reserve" },
  { id: "al-5", time: "13:44", title: "Raised SOL take-profit",       status: "undone", authority: "Reversed by you at 13:51", detail: "Take-profit returned to $158.00" },
  { id: "al-6", time: "13:20", title: "Scanned funding rates",        status: "done",   authority: "Read-only — no approval required", detail: "Coinglass · 14 pairs · perps vs. spot basis" },
  { id: "al-7", time: "12:55", title: "Adjusted position sizing",     status: "review", authority: "Touched drawdown budget — flagged for you", detail: "Max size per entry 6% → 8% of equity" },
  { id: "al-8", time: "12:38", title: "Synced venue balances",        status: "done",   authority: "Read-only — no approval required", detail: "Hyperliquid + Birdeye · wallet 0x7A2f…9c1B" },
];

const AUDITLOG_FILTERS = [
  { id: "all",    label: "All" },
  { id: "done",   label: "Done" },
  { id: "review", label: "Needs review" },
  { id: "undone", label: "Undone" },
];

const AUDITLOG_BADGE = {
  done:   { variant: "success", label: "Done" },
  review: { variant: "warning", label: "Review" },
  undone: { variant: "default", label: "Undone" },
};

function AuditFilterChip({ label, count, active, onClick, theme }) {
  const pal = usePal(theme);
  const [hover, setHover] = useState(false);
  return (
    <button onClick={onClick}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        ...interactiveBase, display: "inline-flex", alignItems: "center", gap: 6,
        padding: "5px 12px", borderRadius: tokens.radius.pill,
        background: active ? pal.accentBg : hover ? pal.bgSubtle : "transparent",
        boxShadow: active ? `inset 0 0 0 1px ${pal.accent}55` : `inset 0 0 0 1px ${pal.borderSubtle}`,
        ...tokens.type.sm, fontWeight: tokens.weight.medium,
        color: active ? pal.accentText : pal.textSecondary,
      }}>
      {label}
      <span style={{ ...tokens.type.xs, fontFamily: tokens.font.mono, color: active ? pal.accentText : pal.textTertiary, fontVariantNumeric: "tabular-nums", transition: `color ${motion.smooth} ${motion.easeInOut}` }}>{count}</span>
    </button>
  );
}

function AuditLogRow({ row, expanded, onToggle, index, theme }) {
  const pal = usePal(theme);
  const [hover, setHover] = useState(false);
  const [linkHover, setLinkHover] = useState(false);
  const badge = AUDITLOG_BADGE[row.status];
  return (
    <div style={{ animation: `halaska-fade-in 0.35s ${motion.easeOut} ${index * 0.04}s both` }}>
      <button onClick={onToggle}
        onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
        style={{
          ...interactiveBase, display: "flex", alignItems: "center", gap: 12,
          width: "100%", padding: "9px 12px", borderRadius: tokens.radius.md,
          background: expanded ? pal.bgSubtle : hover ? pal.bgSubtle : "transparent",
          textAlign: "left",
        }}>
        <span style={{ ...tokens.type.xs, fontFamily: tokens.font.mono, color: pal.textTertiary, width: 40, flexShrink: 0, fontVariantNumeric: "tabular-nums", transition: `color ${motion.smooth} ${motion.easeInOut}` }}>{row.time}</span>
        <Text size="sm" weight="medium" theme={theme} style={{ flex: 1, minWidth: 0, color: hover || expanded ? pal.text : pal.textSecondary }} truncate>{row.title}</Text>
        <Badge theme={theme} variant={badge.variant}>{badge.label}</Badge>
        <ChevronIcon size={11} direction={expanded ? "down" : "right"} style={{ color: pal.textTertiary, opacity: hover || expanded ? 1 : 0.4 }} />
      </button>
      {/* Inline detail — one row open at a time */}
      <div style={{
        overflow: "hidden", maxHeight: expanded ? 120 : 0, opacity: expanded ? 1 : 0,
        transition: `max-height 0.4s ${motion.emphasized}, opacity ${motion.smooth} ${motion.easeInOut}`,
      }}>
        <div style={{ padding: "6px 12px 12px 64px", display: "flex", flexDirection: "column", gap: 5 }}>
          <span style={{ ...tokens.type.xs, fontFamily: tokens.font.mono, color: pal.textSecondary, transition: `color ${motion.smooth} ${motion.easeInOut}` }}>
            <span style={{ color: pal.textTertiary }}>Authority · </span>{row.authority}
          </span>
          <span style={{ ...tokens.type.xs, fontFamily: tokens.font.mono, color: pal.textSecondary, transition: `color ${motion.smooth} ${motion.easeInOut}` }}>
            <span style={{ color: pal.textTertiary }}>Detail · </span>{row.detail}
          </span>
          <button
            onMouseEnter={() => setLinkHover(true)} onMouseLeave={() => setLinkHover(false)}
            style={{
              ...interactiveBase, background: "transparent", padding: 0, marginTop: 3,
              alignSelf: "flex-start", ...tokens.type.xs, fontWeight: tokens.weight.medium,
              color: linkHover ? pal.text : pal.textSecondary,
              textDecoration: "underline", textUnderlineOffset: 3,
              textDecorationColor: linkHover ? pal.textSecondary : pal.borderSubtle,
            }}>
            View receipt
          </button>
        </div>
      </div>
    </div>
  );
}

function AuditLogPattern({ theme }) {
  const [filter, setFilter] = useState("all");
  const [expandedId, setExpandedId] = useState(null);

  const rows = filter === "all" ? AUDITLOG_ROWS : AUDITLOG_ROWS.filter(r => r.status === filter);
  const countFor = (id) => id === "all" ? AUDITLOG_ROWS.length : AUDITLOG_ROWS.filter(r => r.status === id).length;

  return (
    <div style={{ width: 480, maxWidth: "100%", fontFamily: tokens.font.sans }}>
      <Stack gap={12}>
        <Stack direction="row" gap={10} align="center">
          <AgentGlyph size={24} theme={theme} />
          <Caption theme={theme}>Audit log · today</Caption>
        </Stack>
        <Stack direction="row" gap={6} wrap>
          {AUDITLOG_FILTERS.map(f => (
            <AuditFilterChip key={f.id} label={f.label} count={countFor(f.id)} active={filter === f.id} theme={theme}
              onClick={() => { setFilter(f.id); setExpandedId(null); }} />
          ))}
        </Stack>
        {/* Re-keyed by filter so rows re-enter with a stagger */}
        <div key={filter} style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {rows.map((r, i) => (
            <AuditLogRow key={r.id} row={r} index={i} theme={theme}
              expanded={expandedId === r.id}
              onToggle={() => setExpandedId(id => id === r.id ? null : r.id)} />
          ))}
        </div>
      </Stack>
    </div>
  );
}

// · Error repair — acknowledge, correct, offer recourse (no alarm)
const REPAIR_FIXES = [
  "Re-fetched live pricing from 3 venues",
  "Moved the stop from $2,210 → $2,395",
];

function RepairCheckRow({ label, delay, theme }) {
  const pal = usePal(theme);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, animation: `halaska-step-in 0.4s ${motion.emphasized} ${delay}s both` }}>
      <span style={{
        width: 20, height: 20, borderRadius: 10, background: pal.successBg,
        display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
        transition: `background ${motion.smooth} ${motion.easeInOut}`,
      }}>
        <svg viewBox="0 0 12 12" width="10" height="10" fill="none" stroke={pal.success} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="2,6 5,9 10,3" style={{ strokeDasharray: 14, strokeDashoffset: 14, animation: `halaska-check-draw 0.3s ${motion.easeOut} ${delay + 0.2}s forwards` }} />
        </svg>
      </span>
      <Text size="sm" theme={theme} style={{ color: pal.text }}>{label}</Text>
    </div>
  );
}

function ErrorRepairPattern({ theme }) {
  const pal = usePal(theme);
  const [beat, setBeat] = useState(1); // 1 acknowledge · 2 correction · 3 recourse
  const [diffOpen, setDiffOpen] = useState(false);

  useEffect(() => {
    const iv = setInterval(() => {
      setBeat(b => {
        if (b >= 3) { clearInterval(iv); return b; }
        return b + 1;
      });
    }, 1200);
    return () => clearInterval(iv);
  }, []);

  return (
    <div style={{ width: 440, maxWidth: "100%", fontFamily: tokens.font.sans }}>
      <Card theme={theme} padding={20} style={{ position: "relative", overflow: "hidden" }}>
        {/* Warning-tinted rail — the only raised voice in the card */}
        <span style={{
          position: "absolute", left: 0, top: 18, bottom: 18, width: 3,
          borderRadius: 2, background: pal.warning,
          transition: `background ${motion.smooth} ${motion.easeInOut}`,
        }} />
        <Stack gap={16} style={{ paddingLeft: 10 }}>
          {/* Beat 1 — acknowledge, plainly */}
          <div style={{ animation: `halaska-step-in 0.45s ${motion.emphasized} both` }}>
            <Stack direction="row" gap={10} align="center" style={{ marginBottom: 6 }}>
              <AgentGlyph size={24} theme={theme} />
              <Text size="md" weight="semibold" theme={theme}>Alpha got this one wrong</Text>
            </Stack>
            <Text size="sm" secondary theme={theme} style={{ display: "block", lineHeight: 1.6 }}>
              The stop-loss on your ETH position was set from a stale price feed.
            </Text>
          </div>

          {/* Beat 2 — what was done about it */}
          {beat >= 2 && (
            <div style={{ animation: `halaska-step-in 0.45s ${motion.emphasized} both` }}>
              <Caption theme={theme} style={{ display: "block", marginBottom: 10, textTransform: "uppercase", letterSpacing: 0.5, ...tokens.type.xs, fontWeight: tokens.weight.medium }}>
                What Alpha did about it
              </Caption>
              <Stack gap={8}>
                {REPAIR_FIXES.map((f, i) => (
                  <RepairCheckRow key={f} label={f} delay={i * 0.25} theme={theme} />
                ))}
              </Stack>
            </div>
          )}

          {/* Beat 3 — recourse, quietly */}
          {beat >= 3 && (
            <div style={{ animation: `halaska-step-in 0.45s ${motion.emphasized} both` }}>
              <Divider theme={theme} spacing={0} />
              <div style={{ height: 14 }} />
              <Stack direction="row" gap={8} align="center">
                <Button theme={theme} variant="secondary" size="sm" onClick={() => setDiffOpen(o => !o)}>Review the fix</Button>
                <Button theme={theme} variant="ghost" size="sm">Flag for a human</Button>
              </Stack>
              {/* Before/after diff — expands on review */}
              <div style={{
                overflow: "hidden", maxHeight: diffOpen ? 60 : 0, opacity: diffOpen ? 1 : 0,
                transition: `max-height 0.4s ${motion.emphasized}, opacity ${motion.smooth} ${motion.easeInOut}`,
              }}>
                <div style={{
                  marginTop: 12, padding: "8px 12px", borderRadius: tokens.radius.md,
                  background: pal.bgSubtle, display: "flex", alignItems: "center", gap: 8,
                  ...tokens.type.sm, fontFamily: tokens.font.mono, fontVariantNumeric: "tabular-nums",
                  transition: `background ${motion.smooth} ${motion.easeInOut}`,
                }}>
                  <span style={{ color: pal.textTertiary, transition: `color ${motion.smooth} ${motion.easeInOut}` }}>ETH stop-loss</span>
                  <span style={{ color: pal.danger, textDecoration: "line-through", textDecorationColor: `${pal.danger}88`, transition: `color ${motion.smooth} ${motion.easeInOut}` }}>$2,210</span>
                  <span style={{ color: pal.textMuted, transition: `color ${motion.smooth} ${motion.easeInOut}` }}>→</span>
                  <span style={{ color: pal.success, fontWeight: tokens.weight.semibold, transition: `color ${motion.smooth} ${motion.easeInOut}` }}>$2,395</span>
                </div>
              </div>
              <div style={{ height: 12 }} />
              <Caption theme={theme}>Logged to audit · nothing else was affected.</Caption>
            </div>
          )}
        </Stack>
      </Card>
    </div>
  );
}

// ─── UX PATTERNS · Output & generative UI (new) ────────────

// ─── OUTPUT & GENERATIVE UI PATTERNS ─────────────────────────
// Where responses stop being text: artifacts, diffs, structured
// data, and side-by-side model comparison.

// · Artifact — versioned generated-content container with preview/markdown
const ARTIFACT_VERSIONS = [
  {
    note: "First pass — thesis only",
    headline: "Some thoughts on rebalancing for Q3",
    paras: [
      "Momentum has rotated back into SOL while ETH funding sits flat. The book is overweight stables relative to the signal, and the gap widens every session we wait.",
    ],
    list: null,
  },
  {
    note: "Added the target allocation list",
    headline: "Some thoughts on rebalancing for Q3",
    paras: [
      "Momentum has rotated back into SOL while ETH funding sits flat. The book is overweight stables relative to the signal, and the gap widens every session we wait.",
      "Execution stays passive — TWAP over three sessions on Hyperliquid keeps slippage under 10 bps at current depth.",
    ],
    list: [
      "SOL/USDC — 42% → 48%",
      "ETH/USDC — 31% → 28%",
      "USDC reserve — 27% → 24%",
    ],
  },
  {
    note: "Tightened the headline and thesis",
    headline: "Q3 rebalance: rotate 6% from stables into SOL",
    paras: [
      "SOL has the momentum; the book has the stables. Closing that gap is the whole trade this quarter.",
      "Execution stays passive — TWAP over three sessions on Hyperliquid keeps slippage under 10 bps at current depth.",
    ],
    list: [
      "SOL/USDC — 42% → 48%",
      "ETH/USDC — 31% → 28%",
      "USDC reserve — 27% → 24%",
    ],
  },
];

function ArtifactIconAction({ icon, onClick, label, active, theme }) {
  const pal = usePal(theme);
  const [hover, setHover] = useState(false);
  return (
    <button onClick={onClick} aria-label={label}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        ...interactiveBase, width: 26, height: 26, borderRadius: tokens.radius.sm,
        background: hover ? pal.bgSubtle : "transparent",
        color: active ? pal.success : pal.textTertiary,
        display: "flex", alignItems: "center", justifyContent: "center", padding: 0,
      }}>{icon}</button>
  );
}

function ArtifactStepBtn({ dir, disabled, onClick, theme }) {
  const pal = usePal(theme);
  const [hover, setHover] = useState(false);
  return (
    <button onClick={disabled ? undefined : onClick} aria-label={dir === "prev" ? "Previous version" : "Next version"}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        ...interactiveBase, width: 20, height: 20, borderRadius: tokens.radius.xs,
        background: hover && !disabled ? pal.bgSubtle : "transparent",
        color: disabled ? pal.textMuted : pal.textSecondary,
        cursor: disabled ? "default" : "pointer",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 13, lineHeight: 1, padding: 0,
      }}>{dir === "prev" ? "‹" : "›"}</button>
  );
}

function ArtifactPattern({ theme }) {
  const pal = usePal(theme);
  const [vIdx, setVIdx] = useState(ARTIFACT_VERSIONS.length - 1);
  const [tab, setTab] = useState("preview");
  const [copied, setCopied] = useState(false);
  const copyTimer = useRef(null);
  const v = ARTIFACT_VERSIONS[vIdx];

  useEffect(() => () => clearTimeout(copyTimer.current), []);

  const handleCopy = () => {
    setCopied(true);
    clearTimeout(copyTimer.current);
    copyTimer.current = setTimeout(() => setCopied(false), 1200);
  };

  const md = `# ${v.headline}\n\n${v.paras.join("\n\n")}`
    + (v.list ? `\n\n${v.list.map(i => `- ${i}`).join("\n")}` : "");

  return (
    <div style={{ width: 480, maxWidth: "100%", fontFamily: tokens.font.sans }}>
      <div style={{
        background: pal.bgElevated, border: `1px solid ${pal.border}`,
        borderRadius: tokens.radius.lg, overflow: "hidden",
        transition: `all ${motion.smooth} ${motion.easeInOut}`,
      }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 16px 0 18px" }}>
          <svg viewBox="0 0 14 14" width="14" height="14" fill="none" stroke={pal.textSecondary} strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, transition: `stroke ${motion.smooth} ${motion.easeInOut}` }}>
            <path d="M3 1.5h5.5L11.5 4.5v8a.5.5 0 0 1-.5.5H3a.5.5 0 0 1-.5-.5v-10a.5.5 0 0 1 .5-.5z" />
            <path d="M8.5 1.5v3h3" />
          </svg>
          <Text size="base" weight="semibold" theme={theme} truncate style={{ flex: 1, minWidth: 0 }}>Q3 rebalance memo</Text>
          <div style={{
            display: "flex", alignItems: "center", gap: 2, padding: "2px 4px",
            borderRadius: tokens.radius.sm, background: pal.bgSubtle,
            transition: `background ${motion.smooth} ${motion.easeInOut}`,
          }}>
            <ArtifactStepBtn dir="prev" disabled={vIdx === 0} onClick={() => setVIdx(i => i - 1)} theme={theme} />
            <span style={{ ...tokens.type.xs, fontFamily: tokens.font.mono, color: pal.textSecondary, minWidth: 18, textAlign: "center", fontVariantNumeric: "tabular-nums" }}>v{vIdx + 1}</span>
            <ArtifactStepBtn dir="next" disabled={vIdx === ARTIFACT_VERSIONS.length - 1} onClick={() => setVIdx(i => i + 1)} theme={theme} />
          </div>
          <ArtifactIconAction theme={theme} label="Copy" active={copied} onClick={handleCopy}
            icon={copied ? (
              <svg viewBox="0 0 12 12" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ animation: `halaska-scale-in 0.25s ${motion.springCurve} both` }}>
                <polyline points="2,6 5,9 10,3" />
              </svg>
            ) : (
              <svg viewBox="0 0 12 12" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                <rect x="4" y="4" width="7" height="7" rx="1" />
                <path d="M8 1.5H2.5a1 1 0 0 0-1 1V8" />
              </svg>
            )} />
          <ArtifactIconAction theme={theme} label="Download"
            icon={
              <svg viewBox="0 0 12 12" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 1.5v6.5M3 5.5L6 8.5l3-3" />
                <path d="M1.5 10.5h9" />
              </svg>
            } />
        </div>

        {/* What changed */}
        <div key={vIdx} style={{ padding: "6px 18px 0 42px", animation: `halaska-tab-fade 0.25s ${motion.easeOut} both` }}>
          <Caption theme={theme} style={{ ...tokens.type.xs }}>
            What changed · {v.note}
          </Caption>
        </div>

        {/* Tabs */}
        <div style={{
          display: "flex", gap: 4, padding: "10px 18px 0",
          borderBottom: `1px solid ${pal.borderSubtle}`,
          transition: `border-color ${motion.smooth} ${motion.easeInOut}`,
        }}>
          {[["preview", "Preview"], ["markdown", "Markdown"]].map(([id, label]) => {
            const active = tab === id;
            return (
              <button key={id} onClick={() => setTab(id)} style={{
                ...interactiveBase, background: "transparent", padding: "6px 10px 9px",
                ...tokens.type.sm, fontWeight: tokens.weight.medium,
                color: active ? pal.text : pal.textTertiary, position: "relative",
              }}>
                {label}
                <span style={{
                  position: "absolute", left: 10, right: 10, bottom: -1, height: 2,
                  borderRadius: 1, background: pal.accent,
                  opacity: active ? 1 : 0, transform: active ? "scaleX(1)" : "scaleX(0.4)",
                  transition: `all ${motion.normal} ${motion.easeInOut}`,
                }} />
              </button>
            );
          })}
        </div>

        {/* Body — keyed by version + tab so both swaps animate */}
        <div key={`${vIdx}-${tab}`} style={{ padding: "16px 18px 18px", minHeight: 168, animation: `halaska-tab-fade 0.25s ${motion.easeOut} both` }}>
          {tab === "preview" ? (
            <Stack gap={12}>
              <Text size="md" weight="semibold" theme={theme} style={{ display: "block", letterSpacing: "-0.01em" }}>{v.headline}</Text>
              {v.paras.map((para, i) => (
                <Text key={i} size="sm" theme={theme} style={{ color: pal.textSecondary, display: "block", lineHeight: 1.65 }}>{para}</Text>
              ))}
              {v.list && (
                <Stack gap={6}>
                  {v.list.map(item => (
                    <div key={item} style={{ display: "flex", alignItems: "center", gap: 9 }}>
                      <span style={{ width: 5, height: 5, borderRadius: 3, background: pal.accent, flexShrink: 0, transition: `background ${motion.smooth} ${motion.easeInOut}` }} />
                      <Text size="sm" mono theme={theme} style={{ color: pal.textSecondary }}>{item}</Text>
                    </div>
                  ))}
                </Stack>
              )}
            </Stack>
          ) : (
            <pre style={{
              margin: 0, padding: "12px 14px", borderRadius: tokens.radius.sm,
              background: pal.bgSubtle, ...tokens.type.sm, fontFamily: tokens.font.mono,
              color: pal.textSecondary, whiteSpace: "pre-wrap", wordBreak: "break-word",
              lineHeight: 1.7, transition: `all ${motion.smooth} ${motion.easeInOut}`,
            }}>{md}</pre>
          )}
        </div>
      </div>
    </div>
  );
}

// · Diff view — unified diff with per-hunk accept/reject
const DIFFVIEW_HUNKS = [
  {
    id: "h1", header: "@@ -12,4 +12,4 @@",
    lines: [
      { t: "ctx", code: "const plan = buildPlan(signals, {" },
      { t: "del", code: '  maxSlippageBps: 25,' },
      { t: "add", code: '  maxSlippageBps: 10,' },
      { t: "del", code: '  venue: "binance",' },
      { t: "add", code: '  venue: "hyperliquid",' },
      { t: "ctx", code: "});" },
    ],
  },
  {
    id: "h2", header: "@@ -31,3 +31,4 @@",
    lines: [
      { t: "ctx", code: "if (funding > 0.01) {" },
      { t: "del", code: "  return enterFull(plan);" },
      { t: "add", code: "  return scaleIn(plan, { days: 3 });" },
      { t: "add", code: "  // cap exposure while funding is hot" },
      { t: "ctx", code: "}" },
    ],
  },
];

function DiffViewHunkAction({ kind, onClick, theme }) {
  const pal = usePal(theme);
  const [hover, setHover] = useState(false);
  const color = kind === "accept" ? pal.success : pal.danger;
  return (
    <button onClick={onClick} aria-label={kind === "accept" ? "Accept hunk" : "Reject hunk"}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        ...interactiveBase, width: 22, height: 22, borderRadius: tokens.radius.sm,
        background: hover ? (kind === "accept" ? pal.successBg : pal.dangerBg) : pal.bgElevated,
        border: `1px solid ${hover ? color : pal.borderSubtle}`,
        color, display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 12, lineHeight: 1, padding: 0,
        transform: hover ? "scale(1.08)" : "scale(1)",
      }}>{kind === "accept" ? "✓" : "×"}</button>
  );
}

function DiffViewPattern({ theme }) {
  const pal = usePal(theme);
  const [resolved, setResolved] = useState({}); // id → "accepted" | "rejected"
  const [applied, setApplied] = useState(false);
  const resolvedCount = Object.keys(resolved).length;
  const allResolved = resolvedCount === DIFFVIEW_HUNKS.length;

  const lineStyle = (line, verdict) => {
    // A line collapses when its side lost; settles to plain when its side won.
    const collapsed =
      (verdict === "accepted" && line.t === "del") ||
      (verdict === "rejected" && line.t === "add");
    const settled = verdict && !collapsed;
    const tint = line.t === "del" ? pal.dangerBg : line.t === "add" ? pal.successBg : "transparent";
    return {
      display: "flex", gap: 4, padding: collapsed ? "0 10px" : "2px 10px",
      maxHeight: collapsed ? 0 : 24, opacity: collapsed ? 0 : 1, overflow: "hidden",
      background: settled ? "transparent" : tint,
      transition: `all ${motion.smooth} ${motion.easeInOut}`,
    };
  };

  return (
    <div style={{ width: 480, maxWidth: "100%", fontFamily: tokens.font.sans }}>
      <Stack gap={12}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
          <Text size="sm" weight="medium" theme={theme} style={{ flex: 1, minWidth: 0 }}>
            <span style={{ fontFamily: tokens.font.mono }}>rebalance.ts</span>
            <span style={{ color: pal.textSecondary, fontWeight: tokens.weight.regular }}> — Alpha proposes 2 changes</span>
          </Text>
          <Caption theme={theme} style={{ fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap" }}>
            {resolvedCount} of {DIFFVIEW_HUNKS.length} reviewed
          </Caption>
        </div>

        {/* Diff block */}
        <div style={{
          border: `1px solid ${pal.border}`, borderRadius: tokens.radius.md,
          background: pal.bgElevated, overflow: "hidden",
          transition: `all ${motion.smooth} ${motion.easeInOut}`,
        }}>
          {DIFFVIEW_HUNKS.map((hunk, hi) => {
            const verdict = resolved[hunk.id];
            return (
              <div key={hunk.id} style={{ borderTop: hi > 0 ? `1px solid ${pal.borderSubtle}` : "none", transition: `border-color ${motion.smooth} ${motion.easeInOut}` }}>
                {/* Hunk header with floating actions */}
                <div style={{
                  display: "flex", alignItems: "center", gap: 8, padding: "7px 10px",
                  background: pal.bgSubtle, transition: `background ${motion.smooth} ${motion.easeInOut}`,
                }}>
                  <span style={{ ...tokens.type.xs, fontFamily: tokens.font.mono, color: pal.textTertiary, flex: 1 }}>{hunk.header}</span>
                  {verdict ? (
                    <span style={{
                      ...tokens.type.xs, fontWeight: tokens.weight.medium,
                      color: verdict === "accepted" ? pal.success : pal.textTertiary,
                      animation: `halaska-scale-in 0.25s ${motion.springCurve} both`,
                    }}>{verdict === "accepted" ? "✓ Accepted" : "× Rejected"}</span>
                  ) : (
                    <div style={{ display: "flex", gap: 6 }}>
                      <DiffViewHunkAction kind="accept" theme={theme} onClick={() => setResolved(r => ({ ...r, [hunk.id]: "accepted" }))} />
                      <DiffViewHunkAction kind="reject" theme={theme} onClick={() => setResolved(r => ({ ...r, [hunk.id]: "rejected" }))} />
                    </div>
                  )}
                </div>
                {/* Lines */}
                <div style={{ padding: "6px 0", ...tokens.type.sm, fontFamily: tokens.font.mono }}>
                  {hunk.lines.map((line, li) => {
                    const collapsedGone =
                      (verdict === "accepted" && line.t === "del") ||
                      (verdict === "rejected" && line.t === "add");
                    return (
                      <div key={li} style={lineStyle(line, verdict)}>
                        <span style={{
                          width: 16, flexShrink: 0, textAlign: "center", userSelect: "none",
                          color: line.t === "del" ? pal.danger : line.t === "add" ? pal.success : pal.textMuted,
                          opacity: verdict && !collapsedGone ? 0 : 1,
                          transition: `all ${motion.smooth} ${motion.easeInOut}`,
                        }}>{line.t === "del" ? "−" : line.t === "add" ? "+" : " "}</span>
                        <span style={{ color: line.t === "ctx" ? pal.textSecondary : pal.text, whiteSpace: "pre", transition: `color ${motion.smooth} ${motion.easeInOut}` }}>{line.code}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer — appears once everything is reviewed */}
        {allResolved && (
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12,
            animation: `halaska-step-in 0.4s ${motion.emphasized} both`,
          }}>
            <Text size="sm" secondary theme={theme}>All changes reviewed</Text>
            <Button theme={theme} variant="primary" size="sm"
              onClick={() => setApplied(true)}
              style={applied ? { background: pal.success, color: "#fff", pointerEvents: "none" } : undefined}>
              {applied ? "Applied ✓" : "Apply"}
            </Button>
          </div>
        )}
      </Stack>
    </div>
  );
}

// · Structured data — schema output as a readable card, JSON on demand
const STRUCT_FIELDS = [
  { label: "Pair",        value: "SOL/USDC" },
  { label: "Side",        badge: "LONG" },
  { label: "Size",        value: "1,250 SOL" },
  { label: "Entry",       value: "$151.40" },
  { label: "Stop",        value: "$142.30" },
  { label: "Take-profit", value: "$168.00" },
];

const STRUCT_FILLS = [
  { time: "14:32:05", size: "800 SOL", price: "$151.28" },
  { time: "14:36:41", size: "450 SOL", price: "$151.62" },
];

// Token stream for the JSON view — k key · s string · n number · p punctuation
const STRUCT_JSON_LINES = [
  [{ t: "p", v: "{" }],
  [{ t: "p", v: "  " }, { t: "k", v: '"pair"' }, { t: "p", v: ": " }, { t: "s", v: '"SOL/USDC"' }, { t: "p", v: "," }],
  [{ t: "p", v: "  " }, { t: "k", v: '"side"' }, { t: "p", v: ": " }, { t: "s", v: '"long"' }, { t: "p", v: "," }],
  [{ t: "p", v: "  " }, { t: "k", v: '"size"' }, { t: "p", v: ": " }, { t: "n", v: "1250" }, { t: "p", v: "," }],
  [{ t: "p", v: "  " }, { t: "k", v: '"entry"' }, { t: "p", v: ": " }, { t: "n", v: "151.40" }, { t: "p", v: "," }],
  [{ t: "p", v: "  " }, { t: "k", v: '"stop"' }, { t: "p", v: ": " }, { t: "n", v: "142.30" }, { t: "p", v: "," }],
  [{ t: "p", v: "  " }, { t: "k", v: '"take_profit"' }, { t: "p", v: ": " }, { t: "n", v: "168.00" }, { t: "p", v: "," }],
  [{ t: "p", v: "  " }, { t: "k", v: '"fills"' }, { t: "p", v: ": [" }],
  [{ t: "p", v: "    { " }, { t: "k", v: '"time"' }, { t: "p", v: ": " }, { t: "s", v: '"14:32:05"' }, { t: "p", v: ", " }, { t: "k", v: '"size"' }, { t: "p", v: ": " }, { t: "n", v: "800" }, { t: "p", v: ", " }, { t: "k", v: '"price"' }, { t: "p", v: ": " }, { t: "n", v: "151.28" }, { t: "p", v: " }," }],
  [{ t: "p", v: "    { " }, { t: "k", v: '"time"' }, { t: "p", v: ": " }, { t: "s", v: '"14:36:41"' }, { t: "p", v: ", " }, { t: "k", v: '"size"' }, { t: "p", v: ": " }, { t: "n", v: "450" }, { t: "p", v: ", " }, { t: "k", v: '"price"' }, { t: "p", v: ": " }, { t: "n", v: "151.62" }, { t: "p", v: " }" }],
  [{ t: "p", v: "  ]" }],
  [{ t: "p", v: "}" }],
];

function StructuredDataPattern({ theme }) {
  const pal = usePal(theme);
  const [view, setView] = useState("card");
  const tokenColor = { k: pal.accentText, s: pal.success, n: pal.text, p: pal.textTertiary };

  return (
    <div style={{ width: 440, maxWidth: "100%", fontFamily: tokens.font.sans }}>
      <Stack gap={12}>
        {/* Header with view toggle */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Text size="sm" weight="medium" theme={theme} style={{ flex: 1 }}>Order placed</Text>
          <div style={{
            display: "inline-flex", gap: 2, padding: 2, borderRadius: tokens.radius.pill,
            background: pal.bgSubtle, transition: `background ${motion.smooth} ${motion.easeInOut}`,
          }}>
            {[["card", "Card"], ["json", "JSON"]].map(([id, label]) => {
              const active = view === id;
              return (
                <button key={id} onClick={() => setView(id)} style={{
                  ...interactiveBase, padding: "3px 12px", borderRadius: tokens.radius.pill,
                  ...tokens.type.xs, fontWeight: tokens.weight.medium,
                  background: active ? pal.bgElevated : "transparent",
                  color: active ? pal.text : pal.textTertiary,
                  boxShadow: active ? `0 1px 2px ${pal.shadow}` : "none",
                }}>{label}</button>
              );
            })}
          </div>
        </div>

        {/* Body */}
        <div key={view} style={{ animation: `halaska-tab-fade 0.25s ${motion.easeOut} both` }}>
          {view === "card" ? (
            <div style={{
              border: `1px solid ${pal.border}`, borderRadius: tokens.radius.md,
              background: pal.bgElevated, padding: 16,
              transition: `all ${motion.smooth} ${motion.easeInOut}`,
            }}>
              <div style={{ display: "grid", gridTemplateColumns: "104px 1fr", rowGap: 10, alignItems: "center" }}>
                {STRUCT_FIELDS.map(f => (
                  <Fragment key={f.label}>
                    <Text size="sm" theme={theme} style={{ color: pal.textTertiary }}>{f.label}</Text>
                    {f.badge
                      ? <span><Badge theme={theme} variant="success">{f.badge}</Badge></span>
                      : <Text size="sm" mono theme={theme} style={{ fontVariantNumeric: "tabular-nums" }}>{f.value}</Text>}
                  </Fragment>
                ))}
              </div>
              <Divider theme={theme} spacing={14} />
              <Stack gap={8}>
                <Caption theme={theme} style={{ ...tokens.type.xs, textTransform: "uppercase", letterSpacing: 0.4 }}>Fills</Caption>
                <div style={{
                  borderRadius: tokens.radius.sm, background: pal.bgSubtle, padding: "8px 12px",
                  transition: `background ${motion.smooth} ${motion.easeInOut}`,
                }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", rowGap: 6 }}>
                    {["Time", "Size", "Price"].map(h => (
                      <span key={h} style={{ ...tokens.type.xxs, textTransform: "uppercase", letterSpacing: 0.5, color: pal.textMuted, fontWeight: tokens.weight.medium }}>{h}</span>
                    ))}
                    {STRUCT_FILLS.map(fill => (
                      <Fragment key={fill.time}>
                        <Text size="sm" mono theme={theme} style={{ color: pal.textSecondary, fontVariantNumeric: "tabular-nums" }}>{fill.time}</Text>
                        <Text size="sm" mono theme={theme} style={{ color: pal.textSecondary, fontVariantNumeric: "tabular-nums" }}>{fill.size}</Text>
                        <Text size="sm" mono theme={theme} style={{ fontVariantNumeric: "tabular-nums" }}>{fill.price}</Text>
                      </Fragment>
                    ))}
                  </div>
                </div>
              </Stack>
            </div>
          ) : (
            <pre style={{
              margin: 0, padding: "14px 16px", borderRadius: tokens.radius.md,
              background: pal.bgSubtle, ...tokens.type.sm, fontFamily: tokens.font.mono,
              lineHeight: 1.75, overflowX: "auto",
              transition: `background ${motion.smooth} ${motion.easeInOut}`,
            }}>
              {STRUCT_JSON_LINES.map((line, li) => (
                <div key={li}>
                  {line.map((tok, ti) => (
                    <span key={ti} style={{ color: tokenColor[tok.t], transition: `color ${motion.smooth} ${motion.easeInOut}` }}>{tok.v}</span>
                  ))}
                </div>
              ))}
            </pre>
          )}
        </div>

        <Caption theme={theme} style={{ ...tokens.type.xs }}>Rendered from tool output · order.schema.json</Caption>
      </Stack>
    </div>
  );
}

// · Comparison — same prompt, two models streaming side by side
const COMPARE_MODELS = [
  {
    id: "alpha-4", name: "alpha-4", cps: 2,
    text: "Up 4.2% on the week — SOL momentum carried the book while ETH chopped sideways. Funding stayed cheap, so the scale-in plan is still on track for Friday.",
  },
  {
    id: "alpha-mini", name: "alpha-mini", cps: 3,
    text: "Portfolio up 4.2%. SOL did the work; ETH went nowhere.",
  },
];

function CompareVoteBtn({ children, onClick, theme }) {
  const pal = usePal(theme);
  const [hover, setHover] = useState(false);
  return (
    <button onClick={onClick}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        ...interactiveBase, padding: "6px 14px", borderRadius: tokens.radius.pill,
        background: hover ? pal.bgMuted : pal.bgSubtle,
        border: `1px solid ${hover ? pal.border : pal.borderSubtle}`,
        ...tokens.type.sm, fontWeight: tokens.weight.medium,
        color: hover ? pal.text : pal.textSecondary,
      }}>{children}</button>
  );
}

function ComparisonPattern({ theme }) {
  const pal = usePal(theme);
  const [tick, setTick] = useState(0);
  const [voteVisible, setVoteVisible] = useState(false);
  const [winner, setWinner] = useState(null); // model id | "tie"

  const maxTicks = Math.max(...COMPARE_MODELS.map(m => Math.ceil(m.text.length / m.cps)));

  useEffect(() => {
    let iv, reveal;
    const start = setTimeout(() => {
      iv = setInterval(() => {
        setTick(c => {
          if (c + 1 >= maxTicks) {
            clearInterval(iv);
            reveal = setTimeout(() => setVoteVisible(true), 400);
            return maxTicks;
          }
          return c + 1;
        });
      }, 28);
    }, 400);
    return () => { clearTimeout(start); clearInterval(iv); clearTimeout(reveal); };
  }, [maxTicks]);

  const winnerName = winner && winner !== "tie" ? winner : null;

  return (
    <div style={{ width: 520, maxWidth: "100%", fontFamily: tokens.font.sans }}>
      <Stack gap={14}>
        {/* Header */}
        <Stack gap={8}>
          <Text size="sm" weight="medium" theme={theme}>Same prompt, two models</Text>
          <div>
            <Code theme={theme} style={{ color: pal.textSecondary }}>Summarize my week in 2 lines</Code>
          </div>
        </Stack>

        {/* Columns */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {COMPARE_MODELS.map(m => {
            const shown = Math.min(m.text.length, tick * m.cps);
            const streaming = tick > 0 && shown < m.text.length;
            const settled = shown >= m.text.length;
            const preferred = winner === m.id;
            return (
              <div key={m.id} style={{
                border: `1px solid ${pal.border}`, borderRadius: tokens.radius.md,
                background: pal.bgElevated, padding: 14, minHeight: 148,
                boxShadow: preferred ? `inset 0 0 0 1.5px ${pal.accent}` : "none",
                transition: `all ${motion.smooth} ${motion.easeInOut}`,
              }}>
                <Stack gap={10}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{
                      display: "inline-flex", alignItems: "center", gap: 6, padding: "2px 10px",
                      borderRadius: tokens.radius.pill, background: pal.bgSubtle,
                      border: `1px solid ${pal.borderSubtle}`, ...tokens.type.xs,
                      fontFamily: tokens.font.mono, color: pal.textSecondary,
                      transition: `all ${motion.smooth} ${motion.easeInOut}`,
                    }}>
                      <span style={{
                        width: 5, height: 5, borderRadius: 3, flexShrink: 0,
                        background: settled ? pal.success : pal.accent,
                        transition: `background ${motion.smooth} ${motion.easeInOut}`,
                      }} />
                      {m.name}
                    </span>
                    {preferred && (
                      <span style={{ animation: `halaska-scale-in 0.3s ${motion.springCurve} both` }}>
                        <Badge theme={theme} variant="accent">Preferred</Badge>
                      </span>
                    )}
                  </div>
                  <div style={{ ...tokens.type.sm, color: pal.text, lineHeight: 1.65, transition: `color ${motion.smooth} ${motion.easeInOut}` }}>
                    {m.text.slice(0, shown)}
                    {streaming && (
                      <span style={{ display: "inline-block", width: 2, height: "1.05em", background: pal.accent, marginLeft: 1, verticalAlign: "text-bottom", animation: "halaska-blink 1s step-end infinite" }} />
                    )}
                  </div>
                </Stack>
              </div>
            );
          })}
        </div>

        {/* Vote row → saved confirmation */}
        {voteVisible && !winner && (
          <Stack gap={8} align="center" style={{ animation: `halaska-step-in 0.4s ${motion.emphasized} both` }}>
            <Text size="sm" theme={theme} style={{ color: pal.textTertiary }}>Which is better?</Text>
            <Stack direction="row" gap={8} justify="center">
              <CompareVoteBtn theme={theme} onClick={() => setWinner("alpha-4")}>← This one</CompareVoteBtn>
              <CompareVoteBtn theme={theme} onClick={() => setWinner("tie")}>Tie</CompareVoteBtn>
              <CompareVoteBtn theme={theme} onClick={() => setWinner("alpha-mini")}>This one →</CompareVoteBtn>
            </Stack>
          </Stack>
        )}
        {winner && (
          <div style={{ display: "flex", alignItems: "center", gap: 8, justifyContent: "center", animation: `halaska-step-in 0.4s ${motion.emphasized} both` }}>
            <span style={{ width: 5, height: 5, borderRadius: 3, background: pal.success, flexShrink: 0 }} />
            <Text size="sm" secondary theme={theme}>
              {winnerName
                ? `Preference saved — routing more like this to ${winnerName}.`
                : "Marked as a tie — no routing change."}
            </Text>
          </div>
        )}
      </Stack>
    </div>
  );
}

// ─── UX PATTERNS · Ambient & beyond chat (new) ─────────────

// ─── AMBIENT & BEYOND-CHAT · the agent outside the thread ─────

// · Taskboard — the board is primary; chat is the secondary channel
const TASKBOARD_COLUMNS = [
  { id: "queued",  label: "Queued" },
  { id: "working", label: "Alpha working" },
  { id: "needs",   label: "Needs you" },
];

const TASKBOARD_TASKS = [
  { id: "t1", title: "Backtest funding-spread entry", owner: "agent",      meta: "runs after open fills" },
  { id: "t2", title: "Refresh venue fee tiers",       owner: "Sam Keller", meta: "queued 14m" },
  { id: "t3", title: "Scale into SOL/USDC",           owner: "agent",      meta: "3 of 5 orders filled" },
  { id: "t4", title: "Raise stop on ETH long",        owner: "agent",      meta: "1 decision pending" },
];

const TASKBOARD_BEFORE = { t1: "queued", t2: "queued", t3: "working", t4: "needs" };
const TASKBOARD_AFTER  = { t1: "working", t2: "queued", t3: "needs",  t4: "needs" };
const TASKBOARD_AFTER_META  = { t3: "2 orders await approval", t1: "running · placing first order" };
const TASKBOARD_MOVED_IDS   = ["t1", "t3"];

function TaskboardCard({ task, col, meta, collapsing, entering, theme }) {
  const pal = usePal(theme);
  const agent = task.owner === "agent";
  const working = col === "working";
  const needs = col === "needs";
  return (
    <div style={{
      overflow: "hidden",
      maxHeight: collapsing ? 0 : 140,
      opacity: collapsing ? 0 : 1,
      marginBottom: collapsing ? 0 : 8,
      transition: `max-height 0.3s ${motion.easeIn}, opacity 0.22s ${motion.easeIn}, margin-bottom 0.3s ${motion.easeIn}`,
      animation: entering ? `halaska-scale-in 0.3s ${motion.easeOut} both` : undefined,
    }}>
      <div style={{
        background: pal.bgElevated, border: `1px solid ${pal.borderSubtle}`,
        borderRadius: tokens.radius.md, padding: "10px 12px",
        boxShadow: needs ? `inset 3px 0 0 0 ${pal.accent}` : "none",
        transition: `all ${motion.smooth} ${motion.easeInOut}`,
      }}>
        <Text size="sm" weight="medium" theme={theme} style={{ display: "block", marginBottom: 7 }}>{task.title}</Text>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 5 }}>
          {agent ? <AgentGlyph size={16} theme={theme} /> : <Avatar name={task.owner} size={16} theme={theme} />}
          <span style={{ ...tokens.type.xs, color: pal.textSecondary, fontFamily: tokens.font.sans, transition: `color ${motion.smooth} ${motion.easeInOut}` }}>
            {agent ? "Alpha" : task.owner}
          </span>
        </div>
        <span style={{ ...tokens.type.xs, color: pal.textTertiary, fontFamily: tokens.font.mono, transition: `color ${motion.smooth} ${motion.easeInOut}` }}>
          {meta}
        </span>
        {working && (
          <div style={{
            height: 3, borderRadius: 2, marginTop: 9, overflow: "hidden",
            backgroundImage: `linear-gradient(90deg, ${pal.accent}22 25%, ${pal.accent}77 50%, ${pal.accent}22 75%)`,
            backgroundSize: "200% 100%", animation: "halaska-shimmer 1.5s ease-in-out infinite",
          }} />
        )}
      </div>
    </div>
  );
}

function TaskboardPattern({ theme }) {
  const pal = usePal(theme);
  const [phase, setPhase] = useState(0); // 0 initial · 1 old cards collapse · 2 moved + settled

  useEffect(() => {
    const a = setTimeout(() => setPhase(1), 2500);
    const b = setTimeout(() => setPhase(2), 2860);
    return () => { clearTimeout(a); clearTimeout(b); };
  }, []);

  const layout = phase === 2 ? TASKBOARD_AFTER : TASKBOARD_BEFORE;

  return (
    <div style={{ width: 520, maxWidth: "100%", fontFamily: tokens.font.sans }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
        {TASKBOARD_COLUMNS.map(col => {
          const cards = TASKBOARD_TASKS.filter(t => layout[t.id] === col.id);
          return (
            <div key={col.id} style={{ minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "0 2px", marginBottom: 10 }}>
                <span style={{
                  ...tokens.type.xs, fontWeight: tokens.weight.medium, textTransform: "uppercase",
                  letterSpacing: 0.4, color: pal.textTertiary, whiteSpace: "nowrap",
                  overflow: "hidden", textOverflow: "ellipsis",
                  transition: `color ${motion.smooth} ${motion.easeInOut}`,
                }}>{col.label}</span>
                <span style={{
                  ...tokens.type.xxs, fontFamily: tokens.font.mono, fontWeight: tokens.weight.medium,
                  color: pal.textSecondary, background: pal.bgMuted, borderRadius: tokens.radius.pill,
                  padding: "1px 7px", flexShrink: 0,
                  transition: `all ${motion.smooth} ${motion.easeInOut}`,
                }}>{cards.length}</span>
              </div>
              {cards.map(t => (
                <TaskboardCard key={t.id} task={t} col={col.id}
                  meta={(phase === 2 && TASKBOARD_AFTER_META[t.id]) || t.meta}
                  collapsing={phase === 1 && TASKBOARD_MOVED_IDS.includes(t.id)}
                  entering={phase === 2 && TASKBOARD_MOVED_IDS.includes(t.id)}
                  theme={theme} />
              ))}
            </div>
          );
        })}
      </div>
      <div style={{ marginTop: 6, animation: `halaska-fade-in 0.5s ${motion.easeOut} 0.6s both` }}>
        <Caption theme={theme}>Alpha keeps working — you only see what needs a decision.</Caption>
      </div>
    </div>
  );
}

// · Inline assist — ghost-text completion with accept / dismiss
const ASSIST_LINES = [
  { typed: "const maxDrawdown = ",   ghost: "portfolio.riskBudget * 0.25;", alt: "riskBudget * 0.25;" },
  { typed: "const hedgeNotional = ", ghost: "solBook.exposure * 0.30;",     alt: "exposure * 0.30;" },
];

function InlineAssistPattern({ theme }) {
  const pal = usePal(theme);
  const [committed, setCommitted] = useState([]); // { typed, code, flash }
  const [cur, setCur] = useState(0);              // index into ASSIST_LINES, null when settled
  const [ghost, setGhost] = useState("");
  const [shown, setShown] = useState(0);
  const [phase, setPhase] = useState("waiting");  // waiting | streaming | ready | done
  const [altMode, setAltMode] = useState(false);
  const [note, setNote] = useState(false);
  const cancels = useRef([]);

  useEffect(() => () => cancels.current.forEach(fn => fn()), []);
  const later = useCallback((fn, ms) => {
    const t = setTimeout(fn, ms);
    cancels.current.push(() => clearTimeout(t));
  }, []);

  const stream = useCallback((text) => {
    setGhost(text); setShown(0); setPhase("streaming");
    const iv = setInterval(() => {
      setShown(s => {
        if (s + 1 >= text.length) { clearInterval(iv); setPhase("ready"); return text.length; }
        return s + 1;
      });
    }, 26);
    cancels.current.push(() => clearInterval(iv));
  }, []);

  useEffect(() => {
    const t = setTimeout(() => stream(ASSIST_LINES[0].ghost), 600);
    return () => clearTimeout(t);
  }, [stream]);

  const accept = () => {
    if (phase !== "ready") return;
    const line = ASSIST_LINES[cur];
    const idx = committed.length;
    setCommitted(c => [...c, { typed: line.typed, code: ghost, flash: true }]);
    setNote(false); setAltMode(false); setGhost(""); setShown(0);
    later(() => setCommitted(c => c.map((l, i) => i === idx ? { ...l, flash: false } : l)), 550);
    if (cur === 0) {
      setPhase("waiting"); setCur(1);
      later(() => stream(ASSIST_LINES[1].ghost), 750);
    } else {
      setCur(null); setPhase("done");
    }
  };

  const dismiss = () => {
    if (phase !== "ready" || altMode) return;
    setGhost(""); setShown(0); setPhase("waiting"); setNote(true);
    later(() => { setAltMode(true); stream(ASSIST_LINES[cur].alt); }, 900);
  };

  const line = cur !== null ? ASSIST_LINES[cur] : null;
  const settled = phase === "done";

  return (
    <div style={{ width: 460, maxWidth: "100%", fontFamily: tokens.font.sans }}>
      <div style={{
        background: pal.bgInput, border: `1px solid ${pal.borderSubtle}`,
        borderRadius: tokens.radius.md, overflow: "hidden",
        transition: `all ${motion.smooth} ${motion.easeInOut}`,
      }}>
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "8px 14px", borderBottom: `1px solid ${pal.borderSubtle}`,
          transition: `border-color ${motion.smooth} ${motion.easeInOut}`,
        }}>
          <span style={{ ...tokens.type.xs, fontFamily: tokens.font.mono, color: pal.textTertiary, transition: `color ${motion.smooth} ${motion.easeInOut}` }}>
            risk.config.ts
          </span>
          <span style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            opacity: settled ? 0.45 : 1, transition: `opacity ${motion.smooth} ${motion.easeInOut}`,
          }}>
            <Kbd theme={theme}>Tab</Kbd>
            <span style={{ ...tokens.type.xs, color: pal.textTertiary }}>accept</span>
            <span style={{ ...tokens.type.xs, color: pal.textMuted }}>·</span>
            <Kbd theme={theme}>Esc</Kbd>
            <span style={{ ...tokens.type.xs, color: pal.textTertiary }}>dismiss</span>
          </span>
        </div>
        <div style={{ padding: "12px 14px", fontFamily: tokens.font.mono, ...tokens.type.sm, lineHeight: 2 }}>
          {committed.map((l, i) => (
            <div key={i} style={{ whiteSpace: "pre" }}>
              <span style={{ color: pal.text, transition: `color ${motion.smooth} ${motion.easeInOut}` }}>{l.typed}</span>
              <span style={{
                color: pal.text, borderRadius: 3, padding: "1px 2px", margin: "-1px -2px",
                background: l.flash ? pal.accentBg : "transparent",
                transition: `background ${motion.smooth} ${motion.easeInOut}, color ${motion.smooth} ${motion.easeInOut}`,
              }}>{l.code}</span>
            </div>
          ))}
          {line && (
            <div style={{ whiteSpace: "pre" }}>
              <span style={{ color: pal.text, transition: `color ${motion.smooth} ${motion.easeInOut}` }}>{line.typed}</span>
              <span style={{ color: pal.textTertiary, transition: `color ${motion.smooth} ${motion.easeInOut}` }}>{ghost.slice(0, shown)}</span>
              {phase === "streaming" && (
                <span style={{ display: "inline-block", width: 2, height: "1.05em", background: pal.accent, marginLeft: 1, verticalAlign: "text-bottom", animation: "halaska-blink 1s step-end infinite" }} />
              )}
            </div>
          )}
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 12 }}>
        <Button size="sm" variant="primary" disabled={phase !== "ready"} onClick={accept} theme={theme}>Accept</Button>
        <Button size="sm" variant="ghost" disabled={phase !== "ready" || altMode} onClick={dismiss} theme={theme}>Dismiss</Button>
        {note && (
          <span style={{ animation: `halaska-fade-in 0.35s ${motion.easeOut} both` }}>
            <Caption theme={theme}>Suggestion dismissed — Alpha adapts.</Caption>
          </span>
        )}
        {settled && (
          <span style={{ marginLeft: "auto", animation: `halaska-fade-in 0.35s ${motion.easeOut} both` }}>
            <Caption theme={theme}>2 completions in</Caption>
          </span>
        )}
      </div>
    </div>
  );
}

// · Nudge — proactive suggestion with a real escape hatch
const NUDGE_BECAUSE = "Noticed: funding flipped negative on your largest position";
const NUDGE_ASK = "Want me to hedge 30% of the SOL book while funding is paid to shorts?";

function NudgePattern({ theme }) {
  const pal = usePal(theme);
  const [stage, setStage] = useState("in"); // in | doing | done | snoozed | muted
  const [faded, setFaded] = useState(false);
  const cancels = useRef([]);

  useEffect(() => () => cancels.current.forEach(fn => fn()), []);
  const later = useCallback((fn, ms) => {
    const t = setTimeout(fn, ms);
    cancels.current.push(() => clearTimeout(t));
  }, []);

  const doIt = () => {
    setStage("doing");
    later(() => setStage("done"), 1100);
  };
  const notNow = () => {
    setStage("snoozed");
    later(() => setFaded(true), 700);
  };

  return (
    <div style={{ width: 420, maxWidth: "100%", fontFamily: tokens.font.sans }}>
      {stage === "in" && (
        <div style={{
          background: pal.bgElevated, border: `1px solid ${pal.borderSubtle}`,
          borderRadius: tokens.radius.lg, padding: 16,
          animation: `halaska-step-in 0.5s ${motion.emphasized} 0.25s both`,
          transition: `all ${motion.smooth} ${motion.easeInOut}`,
        }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 10 }}>
            <AgentGlyph size={20} theme={theme} />
            <Caption theme={theme} style={{ paddingTop: 2 }}>{NUDGE_BECAUSE}</Caption>
          </div>
          <Text size="base" theme={theme} style={{ display: "block", marginBottom: 14 }}>{NUDGE_ASK}</Text>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Button size="sm" variant="primary" onClick={doIt} theme={theme}>Do it</Button>
            <Button size="sm" variant="ghost" onClick={notNow} theme={theme}>Not now</Button>
            <Button size="sm" variant="ghost" onClick={() => setStage("muted")} theme={theme}
              style={{ marginLeft: "auto", color: pal.textTertiary }}>Don't suggest this again</Button>
          </div>
        </div>
      )}
      {stage === "doing" && (
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 2px", animation: `halaska-fade-in 0.3s ${motion.easeOut} both` }}>
          <Spinner size={14} color={pal.textTertiary} />
          <Text size="sm" secondary theme={theme}>Hedging 18 SOL…</Text>
        </div>
      )}
      {stage === "done" && (
        <div style={{ display: "flex", alignItems: "center", gap: 9, padding: "10px 2px", animation: `halaska-step-in 0.45s ${motion.emphasized} both` }}>
          <span style={{ width: 7, height: 7, borderRadius: 4, background: pal.success, flexShrink: 0, transition: `background ${motion.smooth} ${motion.easeInOut}` }} />
          <Text size="sm" theme={theme}>Hedged 18 SOL — receipt in the log.</Text>
        </div>
      )}
      {stage === "snoozed" && (
        <span style={{
          display: "inline-flex", alignItems: "center", gap: 7, padding: "5px 12px",
          borderRadius: tokens.radius.pill, background: pal.bgSubtle,
          border: `1px solid ${pal.borderSubtle}`, ...tokens.type.sm, color: pal.textSecondary,
          animation: `halaska-scale-in 0.3s ${motion.easeOut} both`,
          opacity: faded ? 0.6 : 1,
          transition: `opacity 0.6s ${motion.easeInOut}, background ${motion.smooth} ${motion.easeInOut}, border-color ${motion.smooth} ${motion.easeInOut}, color ${motion.smooth} ${motion.easeInOut}`,
        }}>
          Snoozed for today
        </span>
      )}
      {stage === "muted" && (
        <div style={{ padding: "10px 2px", animation: `halaska-fade-in 0.35s ${motion.easeOut} both` }}>
          <Caption theme={theme}>Got it — Alpha won't bring this up again.</Caption>
        </div>
      )}
    </div>
  );
}

// · Digest — "while you were away", grouped actions with rationale
const DIGEST_ROWS = [
  {
    id: "d1", tone: "success", title: "Closed SOL funding arb", value: "+$212",
    why: "Why: funding spread crossed your 0.03% threshold",
    receipt: "40 SOL @ $151.20 · Hyperliquid · 09:42",
  },
  {
    id: "d2", tone: "default", title: "Rolled ETH hedge to next expiry", value: "-$8.40",
    why: "Why: expiry inside 24h — delta held within ±2% through the roll",
    receipt: "12 ETH-PERP · Hyperliquid · 10:05",
  },
  {
    id: "d3", tone: "warning", title: "Skipped: rebalance — needed your approval", value: "—",
    why: "Why: order size $6.2k exceeds your $5k auto-limit",
    receipt: null, approvable: true,
    approvedReceipt: "Rebalanced 60/40 → 55/45 · $6.2k rotated · just now",
  },
];

function DigestRow({ row, open, onToggle, approved, onApprove, delay, theme }) {
  const pal = usePal(theme);
  const [hover, setHover] = useState(false);
  const warning = row.tone === "warning" && !approved;
  const dotColor = approved || row.tone === "success" ? pal.success
    : warning ? pal.warning : pal.textMuted;
  const receipt = approved ? row.approvedReceipt : row.receipt;
  return (
    <div style={{ animation: `halaska-step-in 0.45s ${motion.emphasized} ${delay}s both` }}>
      <button onClick={onToggle}
        onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
        style={{
          ...interactiveBase, display: "flex", alignItems: "center", gap: 10,
          width: "100%", padding: "10px 12px", borderRadius: tokens.radius.md,
          background: warning ? pal.warningBg : hover ? pal.bgSubtle : "transparent",
          textAlign: "left",
        }}>
        <span style={{ width: 7, height: 7, borderRadius: 4, background: dotColor, flexShrink: 0, transition: `background ${motion.smooth} ${motion.easeInOut}` }} />
        <Text size="sm" weight="medium" theme={theme} style={{ flex: 1, minWidth: 0 }} truncate>
          {approved ? "Rebalanced portfolio" : row.title}
        </Text>
        <span style={{
          ...tokens.type.sm, fontFamily: tokens.font.mono, fontVariantNumeric: "tabular-nums",
          color: approved ? pal.success : row.tone === "success" ? pal.success : pal.textSecondary,
          transition: `color ${motion.smooth} ${motion.easeInOut}`, flexShrink: 0,
        }}>{approved ? "$6.2k" : row.value}</span>
        <ChevronIcon size={11} direction={open ? "down" : "right"} style={{ color: pal.textTertiary }} />
      </button>
      <div style={{
        overflow: "hidden", maxHeight: open ? 160 : 0, opacity: open ? 1 : 0,
        transition: `max-height 0.4s ${motion.emphasized}, opacity ${motion.smooth} ${motion.easeInOut}`,
      }}>
        <div style={{ padding: "4px 12px 12px 29px", display: "flex", flexDirection: "column", gap: 8 }}>
          <Text size="sm" secondary theme={theme}>{row.why}</Text>
          {receipt && (
            <span key={approved ? "after" : "before"} style={{
              ...tokens.type.xs, fontFamily: tokens.font.mono, color: pal.textTertiary,
              animation: `halaska-fade-in 0.35s ${motion.easeOut} both`,
              transition: `color ${motion.smooth} ${motion.easeInOut}`,
            }}>{receipt}</span>
          )}
          {row.approvable && !approved && (
            <div style={{ marginTop: 2 }}>
              <Button size="sm" variant="secondary" onClick={onApprove} theme={theme}>Approve now</Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function DigestPattern({ theme }) {
  const pal = usePal(theme);
  const [openIds, setOpenIds] = useState({});
  const [approved, setApproved] = useState(false);

  return (
    <div style={{ width: 460, maxWidth: "100%", fontFamily: tokens.font.sans }}>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 12, marginBottom: 6 }}>
        <Text size="md" weight="semibold" theme={theme}>While you were away</Text>
        <span style={{ ...tokens.type.xs, fontFamily: tokens.font.mono, color: pal.textTertiary, transition: `color ${motion.smooth} ${motion.easeInOut}` }}>
          2h 14m · 6 actions
        </span>
      </div>
      <Text size="sm" secondary theme={theme} style={{ display: "block", marginBottom: 14 }}>
        Alpha closed two positions, rolled a hedge, and held one action for you.
      </Text>
      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {DIGEST_ROWS.map((row, i) => (
          <DigestRow key={row.id} row={row} theme={theme}
            open={!!openIds[row.id]}
            onToggle={() => setOpenIds(o => ({ ...o, [row.id]: !o[row.id] }))}
            approved={row.approvable ? approved : false}
            onApprove={() => setApproved(true)}
            delay={0.08 + i * 0.12} />
        ))}
      </div>
      <Divider theme={theme} spacing={12} />
      <Button size="sm" variant="ghost" theme={theme}>Open full audit log</Button>
    </div>
  );
}

const PATTERN_COMPONENTS = {
  // Conversation core
  PromptInputPattern,
  MessageThreadPattern,
  StreamingAnswerPattern,
  AgentChatPattern,
  CodeBlockPattern,
  ModelContextPattern,
  // Trust & transparency
  ThinkingTracePattern,
  CitationsPattern,
  ContextSourcesPattern,
  ConfidencePattern,
  RecommendationPattern,
  FeedbackPattern,
  // Agentic control — consent
  PlanPreviewPattern,
  ApprovalCardPattern,
  AutonomyPattern,
  PermissionScopePattern,
  QueuePattern,
  // Agentic control — visibility
  AgentStatusPattern,
  ToolStreamPattern,
  AgentTasksPattern,
  HandoffPattern,
  // Agentic control — accountability
  ActionReceiptPattern,
  CheckpointPattern,
  AuditLogPattern,
  ErrorRepairPattern,
  // Output & generative UI
  ArtifactPattern,
  DiffViewPattern,
  DiffTablePattern,
  StructuredDataPattern,
  InsightCardsPattern,
  ComparisonPattern,
  // Ambient & beyond chat
  TaskboardPattern,
  InlineAssistPattern,
  NudgePattern,
  DigestPattern,
  NotificationCenterPattern,
  CommandSearchPattern,
  AgentSetupPattern,
};

function PatternHeader({ n, title, desc, theme }) {
  const pal = usePal(theme);
  return (
    <div style={{ display: "flex", alignItems: "baseline", gap: 14, paddingLeft: 8, fontFamily: tokens.font.sans }}>
      <span style={{ ...tokens.type.sm, fontFamily: tokens.font.mono, color: pal.textMuted, transition: `color ${motion.smooth} ${motion.easeInOut}` }}>{n}</span>
      <span style={{ ...tokens.type.base, fontWeight: tokens.weight.semibold, color: theme === "dark" ? "#888" : "#777", transition: `color ${motion.smooth} ${motion.easeInOut}` }}>{title}</span>
      <span style={{ ...tokens.type.sm, color: theme === "dark" ? "#555" : "#bbb", transition: `color ${motion.smooth} ${motion.easeInOut}` }}>{desc}</span>
    </div>
  );
}

function PatternGroupHeader({ index, title, blurb, count, theme }) {
  const pal = usePal(theme);
  return (
    <div style={{ paddingLeft: 8, paddingTop: 24, fontFamily: tokens.font.sans }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
        <span style={{ ...tokens.type.sm, fontFamily: tokens.font.mono, color: pal.accent, transition: `color ${motion.smooth} ${motion.easeInOut}` }}>
          Part {index + 1}
        </span>
        <Heading level={4} theme={theme} style={{ margin: 0 }}>{title}</Heading>
        <span style={{ ...tokens.type.sm, fontFamily: tokens.font.mono, color: pal.textMuted, transition: `color ${motion.smooth} ${motion.easeInOut}` }}>
          {count} {count === 1 ? "pattern" : "patterns"}
        </span>
      </div>
      <Text size="sm" theme={theme} style={{ color: pal.textSecondary, maxWidth: 560, display: "block", marginTop: 6 }}>
        {blurb}
      </Text>
    </div>
  );
}

function DemoPatterns({ theme }) {
  const pal = usePal(theme);
  const [replayKeys, setReplayKeys] = useState({});
  const bump = (id) => setReplayKeys(k => ({ ...k, [id]: (k[id] || 0) + 1 }));
  return (
    <Stack gap={40}>
      {/* Hero */}
      <ShowcaseCard theme={theme} label="UX Patterns" height={280}>
        <Stack gap={8} align="center" style={{ width: 560, maxWidth: "100%", textAlign: "center" }}>
          <Heading level={3} theme={theme}>UX patterns for AI products</Heading>
          <Text size="sm" theme={theme} style={{ color: pal.textSecondary, maxWidth: 480 }}>
            The full lifecycle of working with an agent — converse, trust, consent, watch, verify, recover — as {UX_PATTERNS.length} working patterns rebuilt from the kit's components. Fork any of them as a starting point.
          </Text>
        </Stack>
      </ShowcaseCard>

      {PATTERN_GROUPS.map((group, gi) => (
        <div key={group.id} id={group.id} style={{ display: "flex", flexDirection: "column", gap: 40 }}>
          <PatternGroupHeader index={gi} title={group.title} blurb={group.blurb} count={group.patterns.length} theme={theme} />
          {group.patterns.map(pat => {
            const Component = PATTERN_COMPONENTS[pat.component];
            return (
              <div key={pat.id} id={pat.id} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <PatternHeader n={pat.n} title={pat.title} desc={pat.desc} theme={theme} />
                <ShowcaseCard theme={theme} height={pat.height} align={pat.align}
                  controls={pat.replay
                    ? <Button theme={theme} variant="ghost" size="sm" onClick={() => bump(pat.id)}>↻ Replay</Button>
                    : undefined}>
                  <Component key={replayKeys[pat.id] || 0} theme={theme} />
                </ShowcaseCard>
              </div>
            );
          })}
        </div>
      ))}

      {/* Coming soon */}
      <ShowcaseCard theme={theme} label="Roadmap" height={420}>
        <Stack gap={16} style={{ width: 520, maxWidth: "100%" }}>
          <Caption theme={theme}>Coming soon</Caption>
          <PatternsRoadmap theme={theme} items={PATTERN_ROADMAP} />
        </Stack>
      </ShowcaseCard>
    </Stack>
  );
}

// ─── ACTION BAR ──────────────────────────────────────────────

// User-facing UI categories. Each category is a scroll target whose section
// wraps the demos that belong to it.
const COMPONENT_CATEGORIES = [
  { id: "cat-foundations", label: "Foundations",        demos: ["DemoTypography", "DemoButtons"] },
  { id: "cat-inputs",      label: "Inputs & Selectors", demos: ["DemoFormInputs", "DemoTogglesSelections", "DemoFormExtras", "DemoInputsExtended"] },
  { id: "cat-navigation",  label: "Navigation & Menus", demos: ["DemoNavigation"] },
  { id: "cat-overlays",    label: "Overlays",           demos: ["DemoOverlays"] },
  { id: "cat-feedback",    label: "Feedback & Status",  demos: ["DemoFeedbackStatus", "DemoAlerts"] },
  { id: "cat-data",        label: "Data Display",       demos: ["DemoDataDisplay", "DemoTable"] },
  { id: "cat-ai",          label: "AI Elements",        demos: ["DemoAIElements"] },
  { id: "cat-dev",         label: "Dev Surfaces",       demos: ["DemoDevSurfaces"] },
  { id: "cat-charts",      label: "Charts",             demos: ["DemoCharts"] },
];

const COMPONENT_GROUPS = COMPONENT_CATEGORIES;

// The text behind the "Copy Install Prompt" buttons — paste it into
// Claude Code (or any coding agent) to wire the kit into a project.
// The raw kit file is served from the deployed site (public/ copy, kept
// in sync by the prebuild script in package.json).
const INSTALL_PROMPT = `Set up Halaska Kit in this project.

Halaska Kit is a single-file React UI kit for AI products by Halaska Studio (https://halaskastudio.com) — 38 UX patterns (thinking, streaming, approvals, plan previews, tool calls, action receipts, audit logs…) plus 50+ styled components, all defined in halaska-kit-v1.3.jsx with inline styles (no CSS or Tailwind setup). Peer deps: react, react-dom, recharts. Geist + Geist Mono load via Google Fonts at runtime.

1. Download the kit into src/: curl -o src/halaska-kit-v1.3.jsx https://kit.halaskastudio.com/halaska-kit-v1.3.jsx (ask me for the file if the URL is unreachable).
2. Install recharts if it isn't already: npm install recharts
3. To browse everything, render the default export — it's the full showcase page.
4. When building screens, reuse the components and patterns defined in that file instead of writing new ones — and match its design system: tokens.space / tokens.radius / tokens.type, motion durations + easings, and theme colors via usePal(theme). Accent is swappable through AccentContext.
5. Keep new UI consistent with the kit's design heuristics: visible agent status, consent before consequence, undo over confirm, recognition over recall, graceful error recovery.`;

const ACCENT_COLORS = [
  { name: "Blue", value: "#3b82f6" },
  { name: "Violet", value: "#8b5cf6" },
  { name: "Emerald", value: "#10b981" },
  { name: "Rose", value: "#f43f5e" },
  { name: "Amber", value: "#f59e0b" },
  { name: "Neutral", value: "#555555" },
];

// ─── BOOKMARK RAIL ───────────────────────────────────────────
// Fixed left-edge section index: one thin horizontal line per section that
// grows as the viewport approaches it — a camera-lens / timeline feel.
// Replaces the old action-bar dropdowns for UX Patterns and UI Components.

const RAIL_ROWS = [
  { type: "label", text: "Patterns" },
  ...PATTERN_GROUPS.map(g => ({ type: "tick", id: g.id, label: g.title })),
  { type: "label", text: "Components" },
  ...COMPONENT_CATEGORIES.map(c => ({ type: "tick", id: c.id, label: c.label })),
  { type: "label", text: "Approach" },
  { type: "tick", id: "heuristics", label: "Heuristics" },
];

const RAIL_TICKS = RAIL_ROWS.filter(r => r.type === "tick");

function BookmarkRail({ pageTheme, scrollTo }) {
  const pal = usePal(pageTheme);
  const isDark = pageTheme === "dark";
  const [prox, setProx] = useState(() => RAIL_TICKS.map(() => 0));
  const [activeId, setActiveId] = useState(null);
  const [hoverId, setHoverId] = useState(null);
  const [visible, setVisible] = useState(false);
  const rafRef = useRef(null);

  useEffect(() => {
    const measure = () => {
      rafRef.current = null;
      const probe = window.scrollY + window.innerHeight * 0.32;
      let best = null, bestD = Infinity;
      const next = RAIL_TICKS.map(t => {
        const el = document.getElementById(t.id);
        if (!el) return 0;
        const r = el.getBoundingClientRect();
        const top = r.top + window.scrollY;
        const bottom = top + r.height;
        // Distance to the section's nearest edge — 0 while inside it, so the
        // line stays fully grown for the whole section, then eases off.
        const d = probe < top ? top - probe : probe > bottom ? probe - bottom : 0;
        if (d < bestD) { bestD = d; best = t.id; }
        return Math.exp(-(d * d) / (2 * 420 * 420));
      });
      setProx(next);
      setActiveId(best);
    };
    const onScroll = () => { if (!rafRef.current) rafRef.current = requestAnimationFrame(measure); };
    const onResize = () => { setVisible(window.innerWidth >= 1200); onScroll(); };
    onResize();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      if (rafRef.current) { cancelAnimationFrame(rafRef.current); rafRef.current = null; }
    };
  }, []);

  if (!visible) return null;

  const lineBase = isDark ? "#3a3a3a" : "#d4d4d4";
  const lineNear = isDark ? "#999" : "#666";
  const labelDim = isDark ? "#555" : "#b3b3b3";
  const textDim = isDark ? "#666" : "#a3a3a3";
  const textHover = isDark ? "#bbb" : "#555";
  const textActive = isDark ? "#d8d8d8" : "#3d3d3d";

  let tickIdx = -1;
  return (
    <nav aria-label="Sections" style={{
      position: "fixed", left: 20, top: "50%", transform: "translateY(-50%)",
      zIndex: 9998, display: "flex", flexDirection: "column",
      fontFamily: tokens.font.sans,
    }}>
      {RAIL_ROWS.map((row, i) => {
        if (row.type === "label") {
          return (
            <div key={`label-${i}`} style={{
              fontSize: 9, fontWeight: tokens.weight.medium, textTransform: "uppercase",
              letterSpacing: "0.12em", color: labelDim,
              margin: `${i === 0 ? 0 : 16}px 0 6px`,
              transition: "color 0.35s ease",
            }}>{row.text}</div>
          );
        }
        tickIdx += 1;
        const p = prox[tickIdx] || 0;
        const hovered = hoverId === row.id;
        const active = activeId === row.id;
        const width = hovered ? 30 : 14 + p * 16;
        return (
          <button key={row.id}
            onClick={() => scrollTo(row.id)}
            onMouseEnter={() => setHoverId(row.id)}
            onMouseLeave={() => setHoverId(null)}
            aria-label={row.label}
            style={{
              ...interactiveBase, display: "flex", alignItems: "center",
              height: 15, padding: 0, background: "transparent", textAlign: "left",
              transition: "none",
            }}>
            <span style={{
              display: "block", height: active ? 1.5 : 1, width, borderRadius: 1, flexShrink: 0,
              background: active ? pal.accent : hovered || p > 0.6 ? lineNear : lineBase,
              transition: "width 0.3s cubic-bezier(0.2, 0, 0, 1), background 0.25s ease, height 0.25s ease",
            }} />
            {/* Always-visible label, in flow right after the tick — a growing
                tick nudges its label ≤16px, so the active row reads as indented. */}
            <span style={{
              marginLeft: 8, whiteSpace: "nowrap",
              ...tokens.type.xs,
              fontWeight: active ? tokens.weight.semibold : tokens.weight.regular,
              color: active ? textActive : hovered ? textHover : textDim,
              transition: "color 0.25s ease",
            }}>{row.label}</span>
          </button>
        );
      })}
    </nav>
  );
}

function BarButton({ children, onClick, active, barText, barTextActive, barHoverBg, barActiveBg, style: sp }) {
  const [hover, setHover] = useState(false);
  return (
    <button onClick={onClick}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        ...interactiveBase, fontFamily: tokens.font.sans,
        ...tokens.type.sm, fontWeight: tokens.weight.medium,
        padding: "8px 16px", borderRadius: tokens.radius.md,
        color: active || hover ? barTextActive : barText,
        background: active ? barActiveBg : hover ? barHoverBg : "transparent",
        transition: `background ${motion.normal} ${motion.easeInOut}, color ${motion.normal} ${motion.easeInOut}`,
        whiteSpace: "nowrap", letterSpacing: "-0.01em",
        ...sp,
      }}
    >{children}</button>
  );
}

// Nav menus, in display order: UX Patterns first, then UI Components.
// Pattern entries are grouped under clickable section headers.
function ActionBar({ scrollTo, pageTheme, onThemeChange, accentColor, onAccentChange }) {
  const [colorOpen, setColorOpen] = useState(false);
  const { copied: installCopied, copy: copyPrompt } = useCopyInstallPrompt();
  const isDark = pageTheme === "dark";

  const copyInstallPrompt = () => { setColorOpen(false); copyPrompt(); };
  // Bar inverts vs page for contrast: dark page → light bar, light page → dark bar
  const barIsDark = !isDark;
  const barBg = barIsDark ? "rgba(12,12,12,0.88)" : "rgba(250,250,250,0.88)";
  const barBorder = barIsDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)";
  const barText = barIsDark ? "#999" : "#666";
  const barTextActive = barIsDark ? "#fff" : "#111";
  const barActiveBg = barIsDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)";
  const barBarButtonActiveBg = barIsDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)";
  const barBarButtonHoverBg = barIsDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)";
  const toggleTrackBg = barIsDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)";
  const toggleThumbBg = barIsDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.08)";
  const shadow = barIsDark ? "0 8px 32px rgba(0,0,0,0.3)" : "0 8px 32px rgba(0,0,0,0.12)";

  const thumbSize = 22;
  const togglePad = 2;
  const toggleW = thumbSize * 2 + togglePad * 2;
  const toggleH = thumbSize + togglePad * 2;

  return (
    <div style={{
      position: "fixed", bottom: 20, left: "50%", transform: "translateX(-50%)",
      background: barBg, backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
      border: `1px solid ${barBorder}`,
      borderRadius: tokens.radius.md, padding: "0 6px 6px",
      display: "flex", flexDirection: "column",
      zIndex: 9999, boxShadow: shadow,
      overflow: "hidden",
      transition: "background 0.35s cubic-bezier(0.2, 0, 0, 1), border-color 0.35s cubic-bezier(0.2, 0, 0, 1), box-shadow 0.35s cubic-bezier(0.2, 0, 0, 1)",
    }}>
      {/* Controls row */}
      <div style={{ display: "flex", alignItems: "center", gap: 4, padding: "6px 0 0" }}>
        {/* Logo — scrolls to top */}
        <button onClick={() => { window.scrollTo({ top: 0, behavior: "smooth" }); setColorOpen(false); }}
          style={{
            ...interactiveBase, width: 32, height: 32, padding: 0, background: "transparent",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 14, color: barTextActive, flexShrink: 0, marginLeft: 2,
          }}>◆</button>

        {/* Divider */}
        <div style={{ width: 1, height: 20, background: barBorder, margin: "0 4px", flexShrink: 0 }} />

        {/* Copy Install Prompt — copies a Claude Code-ready setup prompt.
            Section nav lives in the bookmark rail; How to Use stays on-page. */}
        <BarButton onClick={copyInstallPrompt} active={installCopied}
          barText={barText} barTextActive={barTextActive}
          barHoverBg={barBarButtonHoverBg} barActiveBg={barBarButtonActiveBg}>
          {installCopied ? "Copied — paste into Claude Code ✓" : "Copy Install Prompt"}
        </BarButton>

        {/* Divider */}
        <div style={{ width: 1, height: 20, background: barBorder, margin: "0 4px", flexShrink: 0 }} />

        {/* Light/Dark sliding toggle */}
        <button onClick={() => onThemeChange(isDark ? "light" : "dark")}
          style={{
            ...interactiveBase, width: toggleW, height: toggleH, borderRadius: 999,
            background: toggleTrackBg, position: "relative", padding: 0,
            display: "flex", alignItems: "center",
            transition: `background ${motion.smooth} ${motion.emphasized}`,
          }}>
          <div style={{
            position: "absolute", width: thumbSize, height: thumbSize, borderRadius: thumbSize / 2,
            background: toggleThumbBg, left: isDark ? togglePad + thumbSize : togglePad, top: togglePad,
            transition: `left 0.35s cubic-bezier(0.2, 0, 0, 1), background ${motion.smooth} ${motion.emphasized}`,
          }} />
          <div style={{ width: thumbSize + togglePad, height: toggleH, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: !isDark ? barTextActive : barText, position: "relative", zIndex: 1, transition: "color 0.2s ease" }}>&#9728;</div>
          <div style={{ width: thumbSize + togglePad, height: toggleH, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: isDark ? barTextActive : barText, position: "relative", zIndex: 1, transition: "color 0.2s ease" }}>&#9790;</div>
        </button>

        {/* Divider */}
        <div style={{ width: 1, height: 20, background: barBorder, margin: "0 4px", flexShrink: 0 }} />

        {/* Accent color — paint bucket icon + inline expanding dots */}
        <div style={{ display: "flex", alignItems: "center", padding: "0 4px" }}>
          <button
            onClick={() => setColorOpen(o => !o)}
            aria-label="Toggle accent color"
            style={{
              ...interactiveBase, width: 28, height: 28, padding: 0, flexShrink: 0,
              display: "flex", alignItems: "center", justifyContent: "center",
              background: colorOpen ? barActiveBg : "transparent",
              color: colorOpen ? barTextActive : barText,
              borderRadius: tokens.radius.sm,
              marginRight: 6,
              transition: `background ${motion.normal} ${motion.easeInOut}, color ${motion.normal} ${motion.easeInOut}`,
            }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
              <path d="m19 11-8-8-8.6 8.6a2 2 0 0 0 0 2.8l5.2 5.2c.8.8 2 .8 2.8 0L19 11Z"/>
              <path d="m5 2 5 5"/>
              <path d="M2 13h15"/>
              <path d="M22 20a2 2 0 1 1-4 0c0-1.6 1.7-2.4 2-4 .3 1.6 2 2.4 2 4Z"/>
            </svg>
          </button>
          <div style={{
            display: "flex", alignItems: "center",
            gap: colorOpen ? 6 : 0,
            transition: "gap 0.3s cubic-bezier(0.2, 0, 0, 1)",
          }}>
          {ACCENT_COLORS.map((c) => {
            const isActive = accentColor === c.value;
            const show = colorOpen || isActive;
            return (
              <button key={c.name}
                onClick={() => { if (!colorOpen) { setColorOpen(true); } else { onAccentChange(c.value); setColorOpen(false); } }}
                style={{
                  ...interactiveBase, padding: 0, flexShrink: 0,
                  width: show ? 16 : 0, height: 16, borderRadius: 8,
                  background: c.value, overflow: "hidden",
                  opacity: show ? 1 : 0,
                  boxShadow: isActive && colorOpen ? `0 0 0 2px ${barBg}, 0 0 0 3.5px ${c.value}` : "none",
                  transition: "width 0.3s cubic-bezier(0.2, 0, 0, 1), opacity 0.2s ease, box-shadow 0.2s ease",
                }} />
            );
          })}
          </div>
        </div>
      </div>
    </div>
  );
}



// ─── MAIN EXPORT ──────────────────────────────────────────────

export default function HalaskaKit() {
  const [pageTheme, setPageTheme] = useState("light");
  const [accentColor, setAccentColor] = useState("#555555");

  useEffect(() => { injectStyles(); }, []);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 32;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  return (
    <AccentContext.Provider value={accentColor}>
      <ShowcasePage title="Halaska Kit" pageTheme={pageTheme}>
        {/* UX Patterns — the AI-interface patterns lead the page */}
        <div id="patterns" style={{ display: "flex", flexDirection: "column", gap: 48 }}>
          <DemoPatterns theme={pageTheme} />
        </div>

        {/* Foundations */}
        <div id="cat-foundations" style={{ display: "flex", flexDirection: "column", gap: 48 }}>
          <DemoTypography theme={pageTheme} />
          <DemoButtons theme={pageTheme} />
        </div>

        {/* Inputs & Selectors */}
        <div id="cat-inputs" style={{ display: "flex", flexDirection: "column", gap: 48 }}>
          <DemoFormInputs theme={pageTheme} />
          <DemoTogglesSelections theme={pageTheme} />
          <DemoFormExtras theme={pageTheme} />
          <DemoInputsExtended theme={pageTheme} />
        </div>

        {/* Navigation & Menus */}
        <div id="cat-navigation" style={{ display: "flex", flexDirection: "column", gap: 48 }}>
          <DemoNavigation theme={pageTheme} />
        </div>

        {/* Overlays */}
        <div id="cat-overlays" style={{ display: "flex", flexDirection: "column", gap: 48 }}>
          <DemoOverlays theme={pageTheme} />
        </div>

        {/* Feedback & Status */}
        <div id="cat-feedback" style={{ display: "flex", flexDirection: "column", gap: 48 }}>
          <DemoFeedbackStatus theme={pageTheme} />
          <DemoAlerts theme={pageTheme} />
        </div>

        {/* Data Display */}
        <div id="cat-data" style={{ display: "flex", flexDirection: "column", gap: 48 }}>
          <DemoDataDisplay theme={pageTheme} />
          <DemoTable theme={pageTheme} />
        </div>

        {/* AI Elements */}
        <div id="cat-ai" style={{ display: "flex", flexDirection: "column", gap: 48 }}>
          <DemoAIElements theme={pageTheme} />
        </div>

        {/* Dev Surfaces */}
        <div id="cat-dev" style={{ display: "flex", flexDirection: "column", gap: 48 }}>
          <DemoDevSurfaces theme={pageTheme} />
        </div>

        {/* Charts */}
        <div id="cat-charts" style={{ display: "flex", flexDirection: "column", gap: 48 }}>
          <DemoCharts theme={pageTheme} />
        </div>

        {/* Design heuristics — the classics, restated for AI */}
        <div id="heuristics" style={{ marginTop: 48 }}>
          <HeuristicsSection theme={pageTheme} />
        </div>

      </ShowcasePage>
      <BookmarkRail pageTheme={pageTheme} scrollTo={scrollTo} />
      <ActionBar
        scrollTo={scrollTo}
        pageTheme={pageTheme} onThemeChange={setPageTheme}
        accentColor={accentColor} onAccentChange={setAccentColor}
      />
    </AccentContext.Provider>
  );
}
