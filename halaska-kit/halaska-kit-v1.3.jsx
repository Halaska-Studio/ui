"use client";

/*!
 * Halaska Kit v1.3: UX patterns & components for AI products
 * (c) Halaska · https://ui.halaska.com · MIT License
 * Single-file React kit: import { Button, Orb, PlanPreviewPattern } from "./halaska-kit"
 */

import { useState, useRef, useEffect, useCallback, createContext, useContext, Fragment } from "react";

// shadcn/ui components available in Claude artifacts:
// Badge, Button, Card, Checkbox, Input, Label, Progress, RadioGroup,
// Select, Separator, Skeleton, Switch, Tabs, Textarea
// Halaska Kit provides styled versions of all the above.

// ═══════════════════════════════════════════════════════════════
//  HALASKA KIT v1.3: UX patterns & components for AI products
//  shadcn/ui foundations · Geist · Lucide 1px
//  AI interface patterns · Animated selections · Trading-agent theme
// ═══════════════════════════════════════════════════════════════

// ─── GLOBAL STYLES (injected once) ────────────────────────────

const GLOBAL_STYLES = `
  @media (max-width: 719px) { html, body { overflow-x: hidden; } }
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

/* Orb: compact agent-activity indicators. One shared keyframe per family;
   per-dot negative delays turn identical animations into wavefronts,
   comets, and orbits. */
@keyframes halaska-orb-swell {
  0%, 60%, 100% { transform: scale(0.4); opacity: 0.25; }
  25% { transform: scale(1); opacity: 1; }
}
@keyframes halaska-orb-globe {
  0%    { transform: translate(9px, 0) scale(1); opacity: 0.9; }
  12.5% { transform: translate(6.4px, 3.2px) scale(0.95); opacity: 0.75; }
  25%   { transform: translate(0, 4.5px) scale(0.85); opacity: 0.55; }
  37.5% { transform: translate(-6.4px, 3.2px) scale(0.76); opacity: 0.4; }
  50%   { transform: translate(-9px, 0) scale(0.7); opacity: 0.3; }
  62.5% { transform: translate(-6.4px, -3.2px) scale(0.76); opacity: 0.4; }
  75%   { transform: translate(0, -4.5px) scale(0.85); opacity: 0.55; }
  87.5% { transform: translate(6.4px, -3.2px) scale(0.95); opacity: 0.75; }
  100%  { transform: translate(9px, 0) scale(1); opacity: 0.9; }
}
@keyframes halaska-orb-spark {
  0%, 100% { transform: rotate(0deg) scale(1); opacity: 0.9; }
  50% { transform: rotate(90deg) scale(0.7); opacity: 0.5; }
}
@media (prefers-reduced-motion: reduce) {
  [data-halaska-orb] span { animation: none !important; opacity: 0.6 !important; transform: none !important; }
}

/* Keyboard focus is always visible. Components set outline:none inline for
   pointer users; :focus-visible restores a ring for keyboard users only. */
button:focus-visible, a:focus-visible, [tabindex]:focus-visible {
  outline: 2px solid #3b82f6 !important;
  outline-offset: 2px !important;
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

// Fonts + keyframes inject as soon as the module loads (SSR-safe guard), so
// individually imported components animate and render in Geist without the
// showcase page ever mounting.
if (typeof document !== "undefined") injectStyles();

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
    // CSS variables so the whole kit can switch typeface at runtime (setKitFont)
    sans: "var(--halaska-sans, 'Geist'), -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    mono: "var(--halaska-mono, 'Geist Mono'), 'SF Mono', 'Fira Code', monospace",
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

// Durations (Material Design 3 aligned) and easings, exposed as CSS variables
// so the whole kit can switch motion mode at runtime (setKitMotion).
const motion = {
  fast: "var(--halaska-t-fast, 0.15s)",      // micro-interactions, state changes
  normal: "var(--halaska-t-normal, 0.25s)",  // most UI transitions
  smooth: "var(--halaska-t-smooth, 0.35s)",  // expanding panels, color transitions
  spring: "var(--halaska-t-spring, 0.4s)",   // bouncy elements (radio, segmented)
  slow: "var(--halaska-t-slow, 0.5s)",       // page-level transitions

  easeInOut: "var(--halaska-e-inout, cubic-bezier(0.4, 0, 0.2, 1))",   // standard, on-screen movement
  easeOut: "var(--halaska-e-out, cubic-bezier(0.0, 0, 0.2, 1))",       // deceleration, entering elements
  easeIn: "var(--halaska-e-in, cubic-bezier(0.4, 0, 1, 1))",           // acceleration, exiting elements
  emphasized: "var(--halaska-e-emph, cubic-bezier(0.2, 0, 0, 1))",     // dramatic deceleration
  springCurve: "var(--halaska-e-spring, cubic-bezier(0.34, 1.56, 0.64, 1))", // Apple-style overshoot
};

// Motion modes: spring is the kit as designed; smooth is generous and fluid;
// instant is near-immediate with a hint of transition.
const KIT_MOTION_PRESETS = {
  spring: {},
  smooth: {
    "--halaska-t-fast": "0.22s", "--halaska-t-normal": "0.4s", "--halaska-t-smooth": "0.55s", "--halaska-t-spring": "0.6s", "--halaska-t-slow": "0.8s",
    "--halaska-e-inout": "cubic-bezier(0.2, 0, 0, 1)", "--halaska-e-out": "cubic-bezier(0.2, 0, 0, 1)", "--halaska-e-emph": "cubic-bezier(0.16, 1, 0.3, 1)",
    "--halaska-e-spring": "cubic-bezier(0.2, 0, 0, 1)",
  },
  instant: {
    "--halaska-t-fast": "0.05s", "--halaska-t-normal": "0.08s", "--halaska-t-smooth": "0.1s", "--halaska-t-spring": "0.1s", "--halaska-t-slow": "0.15s",
    "--halaska-e-inout": "cubic-bezier(0.2, 0, 0, 1)", "--halaska-e-out": "cubic-bezier(0.2, 0, 0, 1)", "--halaska-e-emph": "cubic-bezier(0.2, 0, 0, 1)",
    "--halaska-e-spring": "cubic-bezier(0.2, 0, 0, 1)",
  },
};
const KIT_MOTION_VARS = Object.keys(KIT_MOTION_PRESETS.smooth);

function setKitMotion(mode = "spring") {
  if (typeof document === "undefined") return;
  const root = document.documentElement.style;
  KIT_MOTION_VARS.forEach(v => root.removeProperty(v));
  Object.entries(KIT_MOTION_PRESETS[mode] || {}).forEach(([k, v]) => root.setProperty(k, v));
}

// Typeface presets (all on Google Fonts). Any other Google Font name works too.
const KIT_FONT_PRESETS = ["Geist", "Inter", "IBM Plex Sans", "Manrope"];
const kitFontsLoaded = new Set(["Geist"]);
function setKitFont(name = "Geist") {
  if (typeof document === "undefined") return;
  if (!kitFontsLoaded.has(name)) {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(name).replace(/%20/g, "+")}:wght@400;500;600;700&display=swap`;
    document.head.appendChild(link);
    kitFontsLoaded.add(name);
  }
  document.documentElement.style.setProperty("--halaska-sans", `'${name}'`);
}

const ThemeContext = createContext("light");
function ThemeProvider({ theme = "light", children }) {
  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>;
}
function useThemeContext() { return useContext(ThemeContext); }

// Accent color context: allows live accent swapping
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
// Deterministic palette from name hash: soft, muted tones

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

// Rolodex: vertical flip: text rolls out and back in

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

  // Inner shadow color: darker tint of the button's own background
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
      {/* Icons: each centered in its half */}
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
      {/* Both states share one grid cell, so the box is always as tall as the taller one and never jumps. */}
      <div style={{ display: "grid", borderRadius: tokens.radius.lg, overflow: "hidden" }}>
        <div style={{ gridArea: "1 / 1", transition: `opacity ${motion.smooth} ${motion.easeInOut}`, opacity: showAfter ? 0 : 1, pointerEvents: showAfter ? "none" : "auto" }}>{before}</div>
        <div style={{ gridArea: "1 / 1", transition: `opacity ${motion.smooth} ${motion.easeInOut}`, opacity: showAfter ? 1 : 0, pointerEvents: showAfter ? "auto" : "none" }}>{after}</div>
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

function Pagination({ current, total, onChange, variant = "numbers", theme: tp }) {
  const ctx = useThemeContext(); const theme = tp || ctx; const pal = usePal(theme);
  if (variant === "dots") {
    return (
      <div role="group" aria-label={`Page ${current} of ${total}`} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
        {Array.from({ length: total }, (_, i) => {
          const active = i + 1 === current;
          return (
            <button key={i} onClick={() => onChange(i + 1)} aria-label={`Page ${i + 1}`} aria-current={active ? "page" : undefined}
              style={{
                ...interactiveBase, padding: 0, height: 6, width: active ? 18 : 6, borderRadius: 3,
                background: active ? pal.text : pal.textMuted,
                transition: `width ${motion.normal} ${motion.emphasized}, background ${motion.normal} ${motion.easeInOut}`,
              }} />
          );
        })}
      </div>
    );
  }
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

// ─── Orb: compact agent-activity indicators ──────────────────
// Discrete monochrome glyphs that signal what the agent is doing without
// blocking the thread. Five variants keyed to agent tasks; geometry lives
// on a 24px stage scaled to `size`. Renders bare or as a status pill.

const ORB_STAGE = 24;

const ORB_TASKS = {
  pulse: "Thinking",
  orbit: "Searching",
  sweep: "Writing",
  globe: "Planning",
  spark: "Waiting",
};

const ORB_LATTICE = (() => {
  const cells = [];
  for (let y = 0; y < 3; y++) for (let x = 0; x < 3; x++) cells.push({ x, y });
  return cells;
})();

const ORB_RING = Array.from({ length: 8 }, (_, i) => i);

function Orb({ variant = "pulse", size = 20, label, pill, color, theme: tp, style: sp }) {
  const ctx = useThemeContext(); const theme = tp || ctx; const pal = usePal(theme);
  const text = label || `${ORB_TASKS[variant] || "Working"}…`;

  let cells = null;
  if (variant === "pulse" || variant === "sweep") {
    // 3×3 lattice: radial wavefront (pulse) or left-to-right band (sweep).
    cells = ORB_LATTICE.map(({ x, y }) => {
      const delay = variant === "pulse" ? Math.hypot(x - 1, y - 1) * 260 : x * 220;
      return (
        <span key={`${x}${y}`} style={{
          position: "absolute", left: x * 8 + 2, top: y * 8 + 2, width: 4, height: 4,
          borderRadius: 2, background: "currentColor", opacity: 0.25, transform: "scale(0.4)",
          animation: `halaska-orb-swell 1.6s ${motion.easeInOut} ${Math.round(delay)}ms infinite`,
        }} />
      );
    });
  } else if (variant === "orbit") {
    // Ring of 8: negative delays turn one swell into a comet chase.
    cells = ORB_RING.map(i => {
      const a = (i / 8) * Math.PI * 2;
      return (
        <span key={i} style={{
          position: "absolute", width: 3.5, height: 3.5, borderRadius: 2,
          left: 12 + Math.cos(a) * 9 - 1.75, top: 12 + Math.sin(a) * 9 - 1.75,
          background: "currentColor", opacity: 0.2, transform: "scale(0.5)",
          animation: `halaska-orb-swell 1.4s ${motion.easeInOut} ${-(i / 8) * 1.4}s infinite`,
        }} />
      );
    });
  } else if (variant === "globe") {
    // Dots share one elliptical track, spaced by negative delay: reads as
    // a flattened globe spinning, with scale + opacity as the depth cue.
    cells = ORB_RING.map(i => (
      <span key={i} style={{
        position: "absolute", left: 12 - 1.75, top: 12 - 1.75,
        width: 3.5, height: 3.5, borderRadius: 2, background: "currentColor",
        animation: `halaska-orb-globe 3.2s linear ${-(i / 8) * 3.2}s infinite`,
      }} />
    ));
  } else if (variant === "spark") {
    // The kit's ✦ glyph, breathing: with a soft echo bursting outward.
    cells = (
      <>
        <span style={{
          position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 15, lineHeight: 1, animation: `halaska-orb-spark 2.4s ${motion.easeInOut} infinite`,
        }}>✦</span>
        <span style={{
          position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 15, lineHeight: 1, opacity: 0, animation: "halaska-star-burst 2.4s ease-out infinite",
        }}>✦</span>
      </>
    );
  }

  const glyph = (
    <span data-halaska-orb="" role={pill ? undefined : "img"} aria-label={pill ? undefined : text}
      aria-hidden={pill ? true : undefined}
      style={{
        position: "relative", display: "inline-block", width: size, height: size, flexShrink: 0,
        color: color || pal.textSecondary,
        transition: `color ${motion.smooth} ${motion.easeInOut}`,
        ...(pill ? undefined : sp),
      }}>
      <span style={{
        position: "absolute", left: 0, top: 0, width: ORB_STAGE, height: ORB_STAGE,
        transform: `scale(${size / ORB_STAGE})`, transformOrigin: "top left",
      }}>{cells}</span>
    </span>
  );

  if (!pill) return glyph;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 7,
      height: 30, padding: "0 12px 0 6px", borderRadius: tokens.radius.pill,
      background: pal.bgElevated,
      boxShadow: `0 0 0 1px ${pal.borderSubtle}, 0 1px 2px ${pal.shadow}`,
      fontFamily: tokens.font.sans,
      transition: `background ${motion.smooth} ${motion.easeInOut}, box-shadow ${motion.smooth} ${motion.easeInOut}`,
      ...sp,
    }}>
      {glyph}
      <span style={{
        ...tokens.type.sm, color: pal.textSecondary, whiteSpace: "nowrap",
        transition: `color ${motion.smooth} ${motion.easeInOut}`,
      }}>{text}</span>
    </span>
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

// Inline command palette panel: renders the search + result list without a
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

function Sparkline({ data = [], width = 240, height = 72, color, fill = true, theme: tp, style: sp }) {
  const ctx = useThemeContext(); const theme = tp || ctx; const pal = usePal(theme);
  if (!data.length) return null;
  const values = typeof data[0] === "number" ? data : data.map(d => d.value);
  const stroke = color || pal.accent;
  // Fixed internal stage; the SVG stretches to `width`/`height` (numbers or
  // "100%") with a non-scaling stroke, so no chart library is needed.
  const W = 240, H = 72, PAD = 6;
  const min = Math.min(...values), max = Math.max(...values), span = max - min || 1;
  const pts = values.map((v, i) => [
    PAD + (i / Math.max(values.length - 1, 1)) * (W - PAD * 2),
    PAD + (1 - (v - min) / span) * (H - PAD * 2),
  ]);
  // Smooth path: cubic segments with tangents from neighbouring points.
  let d = `M ${pts[0][0]} ${pts[0][1]}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2;
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C ${c1[0]} ${c1[1]}, ${c2[0]} ${c2[1]}, ${p2[0]} ${p2[1]}`;
  }
  const area = `${d} L ${pts[pts.length - 1][0]} ${H} L ${pts[0][0]} ${H} Z`;
  const gradId = `halaska-spark-${stroke.replace(/[^a-z0-9]/gi, "")}`;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" aria-hidden="true"
      style={{ width, height, display: "block", overflow: "visible", animation: `halaska-fade-in ${motion.smooth} ${motion.easeOut} both`, ...sp }}>
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={stroke} stopOpacity={0.28} />
          <stop offset="100%" stopColor={stroke} stopOpacity={0} />
        </linearGradient>
      </defs>
      {fill && <path d={area} fill={`url(#${gradId})`} />}
      <path d={d} fill="none" stroke={stroke} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"
        vectorEffect="non-scaling-stroke" style={{ transition: `stroke ${motion.smooth} ${motion.easeInOut}` }} />
      <circle cx={pts[pts.length - 1][0]} cy={pts[pts.length - 1][1]} r={3} fill={stroke} stroke={pal.bgElevated} strokeWidth={1.5}
        vectorEffect="non-scaling-stroke" />
    </svg>
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

function Accordion({ items, defaultOpen = -1, theme: tp }) {
  const ctx = useThemeContext(); const theme = tp || ctx; const pal = usePal(theme);
  const [openIdx, setOpenIdx] = useState(defaultOpen);
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

function Breadcrumb({ items, maxVisible, home, theme: tp }) {
  const ctx = useThemeContext(); const theme = tp || ctx; const pal = usePal(theme);
  const [hover, setHover] = useState(false);
  const homeIcon = home ? (
    <span aria-label="Home" style={{ display: "inline-flex", color: pal.textTertiary, marginRight: 2 }}>
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 10.5 12 3l9 7.5" /><path d="M5 9.5V21h14V9.5" /><path d="M10 21v-6h4v6" />
      </svg>
    </span>
  ) : null;
  const truncated = maxVisible && items.length > maxVisible;
  // Always show first + last, "..." between for truncation
  const visible = truncated
    ? [items[0], { ellipsis: true, hidden: items.slice(1, -1) }, items[items.length - 1]]
    : items;
  return (
    <nav style={{ display: "flex", alignItems: "center", gap: 6, fontFamily: tokens.font.sans }}>
      {homeIcon}
      {visible.map((item, i) => {
        const isLast = i === visible.length - 1;
        const sep = (i > 0 || home) && <span style={{ ...tokens.type.sm, color: pal.textMuted }}>/</span>;
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

// Keeps the start and end of long identifiers (ids, hashes, keys,
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

// Browser chrome mockup: frame agent-built pages and live previews.
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

// Phone frame: a minimal handset bezel for mobile surfaces (drawers, sheets).
function PhoneFrame({ children, width = 300, height = 560, theme: tp, style: sp }) {
  const ctx = useThemeContext(); const theme = tp || ctx; const pal = usePal(theme);
  return (
    <div style={{
      width, height, borderRadius: 40, padding: 10, boxSizing: "border-box",
      background: theme === "dark" ? "#0d0d0d" : "#1a1a1a",
      boxShadow: `0 0 0 1px ${theme === "dark" ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.25)"}, 0 24px 48px ${pal.shadowLg}`,
      position: "relative", ...sp,
    }}>
      <div style={{
        width: "100%", height: "100%", borderRadius: 31, overflow: "hidden", position: "relative",
        background: pal.bg, transition: `background ${motion.smooth} ${motion.easeInOut}`,
      }}>
        <div style={{ position: "absolute", top: 8, left: "50%", transform: "translateX(-50%)", width: 84, height: 22, borderRadius: 11, background: theme === "dark" ? "#0d0d0d" : "#1a1a1a", zIndex: 2 }} />
        {children}
      </div>
    </div>
  );
}

// ─── DESIGN HEURISTICS ────────────────────────────────────────
// Nielsen's ten usability heuristics: the most-cited rules in
// interface design: restated for products where an agent does the
// work. Rendered as its own section after the component showcase.

const DESIGN_HEURISTICS = [
  {
    title: "Visibility of system status",
    body: "An agent that goes quiet reads as broken. Stream the thinking, show tool calls as they run, and keep a glanceable status for everything happening off-screen.",
  },
  {
    title: "Match the real world",
    body: "Plans, permissions, and results in the user's language: \u201cClose 14 stale tickets,\u201d not tool names and JSON. Translate the machinery, don't expose it.",
  },
  {
    title: "User control and freedom",
    body: "Pause, redirect, and undo beat confirmation dialogs. Delegating to an agent should never cost you the emergency exit.",
  },
  {
    title: "Consistency and standards",
    body: "One status language everywhere. The same state looks the same in the thread, the board, and the log. Borrow conventions people already know.",
  },
  {
    title: "Error prevention",
    body: "Consent before consequence: plan previews, approval gates, and autonomy caps catch mistakes upstream, styled as normal states, never as alarms.",
  },
  {
    title: "Recognition over recall",
    body: "Never make people reconstruct what happened from a scrolling transcript. Receipts, boards, and digests keep the state of work visible.",
  },
  {
    title: "Flexibility and efficiency",
    body: "Autonomy is a dial, not a switch. New users watch and confirm; experts let the agent run. The same surface serves both without forking the product.",
  },
  {
    title: "Minimalist by default",
    body: "Focused, not sparse: every element earns its place. Collapse the machinery (traces, tool calls, sources) once it has done its job.",
  },
  {
    title: "Recover from errors gracefully",
    body: "When the agent is wrong: acknowledge in plain words, show the correction it made, offer a human. What went wrong, why, what's next. No codes, no cheer.",
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

// Viewport width shared by the showcase chrome: one resize listener feeds
// every subscriber. Below `mobile` the page tightens and stages scale to fit;
// below `rail` the bookmark rail hides and the section menu takes over.
const KIT_BP = { mobile: 720, rail: 1200 };
const kitViewport = { w: typeof window !== "undefined" ? window.innerWidth : 1280, subs: new Set(), bound: false };
function useViewport() {
  const [w, setW] = useState(kitViewport.w);
  useEffect(() => {
    if (!kitViewport.bound && typeof window !== "undefined") {
      kitViewport.bound = true;
      window.addEventListener("resize", () => {
        kitViewport.w = window.innerWidth;
        kitViewport.subs.forEach(fn => fn(kitViewport.w));
      }, { passive: true });
    }
    kitViewport.subs.add(setW);
    setW(kitViewport.w);
    return () => { kitViewport.subs.delete(setW); };
  }, []);
  return { width: w, isMobile: w < KIT_BP.mobile, compact: w < KIT_BP.rail };
}

function ShowcaseCard({ children, controls, label, theme = "light", height, align = "center", style: sp }) {
  const pal = usePal(theme);
  const { isMobile } = useViewport();
  const justify = align === "top" ? "flex-start" : "center";
  // Mobile: stages keep their desktop layout and scale down to the column
  // width when they don't reflow on their own. Measured, not guessed: the
  // wrapper is laid out at avail / scale so scaled content lands exactly on
  // the column edge; the box height follows the scaled content (or the fixed
  // stage height, scaled, so the stage rule still holds).
  const innerRef = useRef(null);
  const [fit, setFit] = useState({ s: 1, w: 0, h: 0 });
  useEffect(() => {
    const el = innerRef.current;
    if (!isMobile || !el) { setFit({ s: 1, w: 0, h: 0 }); return; }
    const measure = () => {
      el.style.width = "100%"; el.style.transform = "none";
      const avail = el.clientWidth; let need = el.scrollWidth;
      let sc = need > avail + 1 ? Math.max(0.5, avail / need) : 1;
      let w = sc < 1 ? Math.round(avail / sc) : 0;
      if (w) {
        // Second pass: shrinkable rows reveal their real width once the
        // wrapper is wide enough for them, so measure again at that width.
        el.style.width = w + "px";
        need = el.scrollWidth;
        if (need > w + 1) { sc = Math.max(0.5, avail / need); w = Math.round(avail / sc); el.style.width = w + "px"; }
      }
      const h = el.scrollHeight;
      el.style.transform = sc < 1 ? `scale(${sc})` : "none";
      setFit(f => (f.s === sc && f.w === w && f.h === h) ? f : { s: sc, w, h });
    };
    measure();
    const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(measure) : null;
    if (ro) { ro.observe(el); ro.observe(el.parentElement); }
    window.addEventListener("resize", measure);
    return () => { if (ro) ro.disconnect(); window.removeEventListener("resize", measure); };
  }, [isMobile]);
  const padT = isMobile ? 44 : align === "top" ? 56 : 88;
  const padB = isMobile ? 28 : align === "top" ? 48 : 88;
  const padX = isMobile ? 16 : align === "top" ? 48 : 88;
  const stageH = height ? height - 104 : 0; // desktop stage height inside the paddings
  const mobileH = isMobile ? padT + Math.max(Math.round(fit.h * fit.s), Math.round(stageH * fit.s)) + padB + 4 : 0;
  return (
    <ThemeProvider theme={theme}>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {label && <span style={{ ...tokens.type.base, color: theme === "dark" ? "#555" : "#bbb", fontFamily: tokens.font.sans, paddingLeft: 8 }}>{label}</span>}
        <div style={{
          background: theme === "dark" ? "rgba(26,26,26,0.85)" : "rgba(250,250,250,0.75)",
          borderRadius: isMobile ? tokens.radius.lg : tokens.radius.xl,
          border: theme === "dark" ? "1px solid rgba(255,255,255,0.06)" : "1px solid rgba(0,0,0,0.04)",
          padding: `${padT}px ${padX}px ${padB}px`,
          height: isMobile ? (fit.h ? mobileH : undefined) : (height || undefined),
          minHeight: isMobile ? undefined : (height ? undefined : 532),
          display: "flex", flexDirection: "column",
          alignItems: isMobile ? "flex-start" : "center", justifyContent: isMobile ? "flex-start" : justify, position: "relative",
          transition: `all ${motion.smooth} ${motion.easeInOut}`, overflow: "hidden", ...sp,
        }}>
          <div ref={innerRef} style={{
            flex: align === "top" || isMobile ? "0 0 auto" : 1, display: "flex",
            alignItems: align === "top" || isMobile ? "flex-start" : "center",
            justifyContent: isMobile && fit.s < 1 ? "flex-start" : "center",
            width: isMobile && fit.w ? fit.w : "100%",
            transform: isMobile && fit.s < 1 ? `scale(${fit.s})` : "none", transformOrigin: "top left",
          }}>
            {children}
          </div>
          {controls && (
            <div style={{ position: "absolute", top: 14, right: 14, display: "flex", alignItems: "center", gap: 8 }}>
              {controls}
            </div>
          )}
        </div>
      </div>
    </ThemeProvider>
  );
}

const STUDIO_URL = "https://halaska.com";
const REPO_URL = "https://github.com/Halaska-Studio/ui";

// Quiet inline link for "Halaska" mentions: inherits the surrounding
// text color, underlines subtly, and brightens on hover.
function StudioLink({ theme, href = STUDIO_URL, children = "Halaska", style: sp }) {
  const isDark = theme === "dark";
  const [hover, setHover] = useState(false);
  return (
    <a href={href} target="_blank" rel="noreferrer"
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        color: hover ? (isDark ? "#d8d8d8" : "#3d3d3d") : "inherit",
        textDecoration: "underline", textUnderlineOffset: 3,
        textDecorationColor: hover ? "currentColor" : (isDark ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.2)"),
        transition: "color 0.25s ease, text-decoration-color 0.25s ease",
        ...sp,
      }}>{children}</a>
  );
}

// ─── Install prompt copy ───────────────────────────────────────
function writeClipboard(text, onDone) {
  const fallbackCopy = () => {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed"; ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand("copy"); onDone(); } catch (e) { /* clipboard unavailable */ }
    document.body.removeChild(ta);
  };
  if (navigator.clipboard?.writeText) {
    navigator.clipboard.writeText(text).then(onDone).catch(fallbackCopy);
  } else {
    fallbackCopy();
  }
}

// Clipboard action with a 2s "copied" state.
function useCopyPrompt() {
  const [copied, setCopied] = useState(false);
  const timer = useRef(null);
  useEffect(() => () => clearTimeout(timer.current), []);
  const copy = useCallback(() => {
    writeClipboard(INSTALL_PROMPT, () => {
      setCopied(true);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 2000);
      try { window.dispatchEvent(new CustomEvent("halaska:prompt-copied")); } catch (e) { /* no-op */ }
    });
  }, []);
  return { copied, copy };
}

function ShowcasePage({ children, title, subtitle, pageTheme = "light" }) {
  const isDark = pageTheme === "dark";
  const pal = usePal(pageTheme);
  const { isMobile } = useViewport();
  const { copied: installCopied, copy: copyInstallPrompt } = useCopyPrompt();
  // Install prompt: one click copies it and reveals the text below the hero.
  const [installStage, setInstallStage] = useState("idle");
  const copyAndReveal = () => { copyInstallPrompt(); setInstallStage("revealed"); };
  const jump = (id, offset = 32) => { const el = document.getElementById(id); if (el) { const y = el.getBoundingClientRect().top + window.scrollY - offset; window.scrollTo({ top: y, behavior: "smooth" }); } };

  const installPanel = installStage === "revealed" ? (
    <div style={{ marginTop: 28, animation: `halaska-step-in 0.4s ${motion.emphasized} both` }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 10, flexWrap: "wrap" }}>
        <Text size="sm" weight="medium" theme={pageTheme}>Your install prompt</Text>
        <Stack direction="row" gap={8}>
          <Button theme={pageTheme} variant="ghost" size="sm" onClick={() => setInstallStage("idle")}>Hide</Button>
          <Button theme={pageTheme} variant="secondary" size="sm" icon={installCopied ? "✓" : "⧉"} onClick={copyInstallPrompt}>
            {installCopied ? "Copied" : "Copy again"}
          </Button>
        </Stack>
      </div>
      <pre style={{
        margin: 0, maxHeight: 260, overflow: "auto", padding: 16,
        borderRadius: tokens.radius.md, background: pal.bgSubtle, border: `1px solid ${pal.borderSubtle}`,
        ...tokens.type.xs, fontFamily: tokens.font.mono, color: pal.textSecondary,
        whiteSpace: "pre-wrap", lineHeight: 1.6,
        transition: `background ${motion.smooth} ${motion.easeInOut}, border-color ${motion.smooth} ${motion.easeInOut}`,
      }}>{INSTALL_PROMPT}</pre>
      <Text size="xs" theme={pageTheme} style={{ color: pal.textTertiary, display: "block", marginTop: 8 }}>
        It's on your clipboard. Paste it as the first message to Claude Code or Cursor: it downloads the kit, wires it in, and applies it to what you've already built.
      </Text>
    </div>
  ) : null;
  const bg = isDark
    ? "linear-gradient(180deg, #111 0%, #0a0a0a 50%, #111 100%)"
    : "linear-gradient(180deg, #ffffff 0%, #f5f5f5 50%, #ffffff 100%)";
  const textColor = isDark ? "#d8d8d8" : "#3d3d3d";
  const dimColor = isDark ? "#666" : "#999";
  const mutedColor = isDark ? "#555" : "#aaa";
  const t = (prop) => `${prop} 0.35s ease`;
  return (
    <div style={{ minHeight: "100vh", background: bg, padding: isMobile ? "40px 16px 150px" : "64px 32px 120px", fontFamily: tokens.font.sans, transition: "background 0.5s ease", overflowX: "hidden" }}>
      <div style={{ maxWidth: 784, margin: "0 auto" }}>
        {/* Hero */}
        {title && (
          <div style={{ marginBottom: isMobile ? 72 : 128, paddingLeft: 4 }}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 24, flexWrap: "wrap" }}>
              <div>
                <h1 style={{ ...(isMobile ? tokens.type.xxl : tokens.type.xxxl), fontWeight: tokens.weight.bold, color: textColor, margin: 0, letterSpacing: "-0.02em", transition: t("color") }}>{title}</h1>
                <p style={{ ...tokens.type.md, color: dimColor, margin: "10px 0 0", transition: t("color") }}>by <StudioLink theme={pageTheme} /> · built on top of <StudioLink theme={pageTheme} href="https://ui.shadcn.com">shadcn/ui</StudioLink></p>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 20, paddingTop: 8 }}>
                <DropdownMenu theme={pageTheme} trigger={<LinkButton theme={pageTheme} size="sm" iconRight="↓">More</LinkButton>} items={[
                  { label: "How to use", onClick: () => jump("how-to-use") },
                  { label: "Before and after", onClick: () => jump("before-after") },
                  { label: "FAQ", onClick: () => jump("faq") },
                  { separator: true },
                  { label: "GitHub", onClick: () => window.open(REPO_URL, "_blank", "noopener") },
                ]} />
                <Button theme={pageTheme} variant="primary" size="sm" icon={installCopied ? "✓" : "⧉"} onClick={copyAndReveal}>
                  {installCopied ? "Copied" : "Copy prompt"}
                </Button>
              </div>
            </div>

            {/* Two-column bio: stacks below ~600px */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: isMobile ? 28 : 40, marginTop: isMobile ? 36 : 48 }}>
              <div style={{ flex: "1 1 260px" }}>
                <h3 style={{ ...tokens.type.base, fontWeight: tokens.weight.semibold, color: textColor, margin: "0 0 8px", transition: t("color") }}>Intention</h3>
                <p style={{ ...tokens.type.sm, color: dimColor, margin: 0, lineHeight: 1.65, transition: t("color") }}>
                  Made for founders building with coding agents. Prototyping tools ship with defaults which look like a designer never touched them. This kit gets you 85% of the way there: considered UI components and UX patterns built for AI products.</p>
              </div>
              <div style={{ flex: "1 1 260px" }}>
                <h3 style={{ ...tokens.type.base, fontWeight: tokens.weight.semibold, color: textColor, margin: "0 0 8px", transition: t("color") }}>Execution</h3>
                <p style={{ ...tokens.type.sm, color: dimColor, margin: 0, lineHeight: 1.65, transition: t("color") }}>
                  Copy the install prompt, paste it into Claude Code or Cursor, and your project picks up the kit plus the rules for using it on what you've already built. It's an evolving resource: new patterns and components land as the work does.</p>
              </div>
            </div>
            {installPanel}
          </div>
        )}
        <div style={{ display: "flex", flexDirection: "column", gap: isMobile ? 72 : 112 }}>{children}</div>

        {/* How to Use (steps + about + FAQ merged) */}
        <div id="how-to-use" style={{ marginTop: isMobile ? 96 : 144, paddingLeft: 4 }}>
          <h2 style={{ ...tokens.type.xxl, fontWeight: tokens.weight.bold, color: textColor, margin: "0 0 16px", letterSpacing: "-0.02em", transition: t("color") }}>How to Use</h2>

          <p style={{ ...tokens.type.md, color: dimColor, margin: "0 0 12px", lineHeight: 1.7, transition: t("color") }}>
            The kit is one React file plus a prompt that teaches your coding agent how to use it. You don't install anything by hand and you don't read the file. You copy the prompt, paste it into the tool you're already building with, and the agent does the rest.
          </p>
          <p style={{ ...tokens.type.md, color: dimColor, margin: "0 0 32px", lineHeight: 1.7, transition: t("color") }}>
            Inside are 38 UX patterns for the moments every AI product has to get right (thinking, streaming, approvals, tool activity, receipts, recovery) and around 100 styled components underneath them. Geist type, 1px icons, an 8px spacing scale, and motion that stays out of the way.
          </p>

          <h3 style={{ ...tokens.type.lg, fontWeight: tokens.weight.semibold, color: textColor, margin: "0 0 16px", transition: t("color") }}>Get started</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {[
              { step: "1", title: "Copy the prompt", desc: "Use the Copy prompt button at the top of this page." },
              { step: "2", title: "Paste it into your AI tool", desc: "Claude Code, Cursor, Codex, Windsurf, or any agent that can fetch a file. Send it as the first message in the project you want to improve." },
              { step: "3", title: "That's it", desc: "The agent downloads the kit, wires it in, and applies it to what you've already built, screen by screen. If your project is new, it starts from the kit instead." },
              { step: "4", title: "Keep building", desc: "Ask for components and patterns by name (Button, PlanPreviewPattern, Orb). The agent already has the full API reference." },
            ].map(s => (
              <div key={s.step} style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                <span style={{ ...tokens.type.sm, fontWeight: tokens.weight.semibold, color: isDark ? "#444" : "#ccc", fontFamily: tokens.font.mono, minWidth: 20, transition: t("color") }}>{s.step}.</span>
                <div>
                  <span style={{ ...tokens.type.base, fontWeight: tokens.weight.semibold, color: textColor, transition: t("color"), display: isMobile ? "block" : "inline" }}>{s.title}</span>
                  <span style={{ ...tokens.type.base, color: dimColor, marginLeft: isMobile ? 0 : 8, transition: t("color"), display: isMobile ? "block" : "inline", marginTop: isMobile ? 2 : 0 }}>{s.desc}</span>
                </div>
              </div>
            ))}
          </div>

          <h3 id="faq" style={{ ...tokens.type.lg, fontWeight: tokens.weight.semibold, color: textColor, margin: "48px 0 20px", transition: t("color") }}>Frequently Asked Questions</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 20, paddingBottom: 40 }}>
            {[
              { q: "Which tools does this work with?", a: "Any coding agent that can fetch a file and edit your project: Claude Code, Cursor, Codex, Windsurf, and similar. For browser builders like Lovable or Bolt, paste the prompt and, if the tool can't fetch, upload the kit file from the link in the prompt." },
              { q: "Do I need to install anything?", a: "No. The kit is a single file with inline styles. It needs react and react-dom, which your project already has. No Tailwind, no CSS setup, no chart library." },
              { q: "Will it work on a project that already has a UI?", a: "Yes, that's the main use. The prompt tells the agent to keep your routing, state, and data, and to swap screens over to the kit one at a time." },
              { q: "Can I change the look?", a: "Accent, typeface, and motion are all switchable at runtime: pick an accent in the bar below, a typeface in Foundations, and a motion mode there too. Everything else is a token at the top of the file." },
              { q: "Is this the same as shadcn/ui?", a: "It's built on the same foundations and the same component vocabulary, so it feels familiar. The AI patterns on top, the trading of confirm dialogs for undo, and the opinionated styling are the difference." },
              { q: "Can I use this commercially?", a: "Yes. MIT licensed, use it in anything." },
              { q: "Where's the source?", a: "On GitHub at github.com/Halaska-Studio/ui. Star it, or open an issue there (the Feedback button does the same)." },
            ].map((item, i) => (
              <div key={i}>
                <div style={{ ...tokens.type.base, fontWeight: tokens.weight.semibold, color: textColor, marginBottom: 4, transition: t("color") }}>{item.q}</div>
                <div style={{ ...tokens.type.sm, color: dimColor, lineHeight: 1.65, transition: t("color") }}>{item.a}</div>
              </div>
            ))}
          </div>
        </div>

        {/* The page ends on the studio hook, not on a component group */}
        <div id="studio" style={{ marginTop: isMobile ? 48 : 64 }}>
          <StudioHookCard theme={pageTheme} credit />
        </div>
      </div>
    </div>
  );
}

// ─── 12. DEMOS ────────────────────────────────────────────────

// Text input variants shown in the merged "Text Input" card (DemoFormInputs).
const DEMOFORM_TEXT_VARIANTS = ["Default", "With icon", "Error", "Input group", "Copy input", "Search"];

function DemoButtons({ theme }) {
  const pal = usePal(theme);
  const [loading, setLoading] = useState(false);
  const loadTimer = useRef(null);
  useEffect(() => () => clearTimeout(loadTimer.current), []);
  const startLoading = () => {
    setLoading(true);
    clearTimeout(loadTimer.current);
    loadTimer.current = setTimeout(() => setLoading(false), 2000);
  };
  // One labelled row per group: fixed-width Caption on the left, buttons on the right.
  const row = (label, nodes) => (
    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
      <Caption theme={theme} style={{ width: 96, flexShrink: 0, color: pal.textTertiary }}>{label}</Caption>
      <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>{nodes}</div>
    </div>
  );
  return (
    <ShowcaseCard theme={theme} label="Buttons" height={500} align="top">
      <Stack gap={20} style={{ width: "100%", maxWidth: 720 }}>
        {row("Primary", <>
          <Button theme={theme} variant="primary">Send reply</Button>
          <Button theme={theme} variant="primary" icon="✦">AI triage</Button>
          <Button theme={theme} variant="primary" loading={loading} onClick={startLoading} style={{ width: 116 }}>
            {loading ? "Syncing" : "Sync inbox"}
          </Button>
          <Button theme={theme} variant="accent">Deploy agent</Button>
          <Button theme={theme} variant="primary" disabled>Paused</Button>
        </>)}
        {row("Secondary", <>
          <Button theme={theme} variant="secondary">Snooze</Button>
          <Button theme={theme} variant="outline">Set reminder</Button>
          <Button theme={theme} variant="outline" iconRight="→">View ticket</Button>
          <Button theme={theme} variant="secondary" disabled>Archived</Button>
        </>)}
        {row("Ghost", <>
          <Button theme={theme} variant="ghost">Dismiss</Button>
          <LinkButton theme={theme}>View runbook</LinkButton>
          <LinkButton theme={theme} iconRight="→">API docs</LinkButton>
          <LinkButton theme={theme} size="sm">Privacy policy</LinkButton>
        </>)}
        {row("Destructive", <>
          <Button theme={theme} variant="danger">Close ticket</Button>
          <Button theme={theme} variant="danger" icon="✕">Delete agent</Button>
          <Button theme={theme} variant="danger" disabled>Revoke access</Button>
        </>)}
        {row("Sizes", <>
          <Button theme={theme} variant="primary" size="sm">Reply</Button>
          <Button theme={theme} variant="primary" size="md">Assign</Button>
          <Button theme={theme} variant="primary" size="lg">Escalate</Button>
          <Button theme={theme} variant="primary" size="xl">Connect Intercom</Button>
        </>)}
        {row("Icon", <>
          <IconButton theme={theme} icon="⚙" variant="secondary" label="Settings" />
          <IconButton theme={theme} icon="✕" variant="ghost" label="Close" />
          <ButtonGroup theme={theme}>
            <Button theme={theme} variant="ghost" size="sm" style={{ borderRadius: 0 }}>Inbox</Button>
            <Button theme={theme} variant="ghost" size="sm" style={{ borderRadius: 0 }}>Issues</Button>
            <Button theme={theme} variant="ghost" size="sm" style={{ borderRadius: 0 }}>Renewals</Button>
          </ButtonGroup>
          <SplitButton theme={theme} variant="primary"
            items={[
              { label: "Run as dry run", meta: "safe" },
              { label: "Run live" },
              { label: "Schedule for tonight", meta: "9pm" },
            ]}>Run triage</SplitButton>
        </>)}
      </Stack>
    </ShowcaseCard>
  );
}

// Motion mode for the whole kit: spring (as designed), smooth, or instant.
function DemoMotion({ theme }) {
  const pal = usePal(theme);
  const [mode, setMode] = useState("spring");
  const [demo, setDemo] = useState(false);
  const pick = (m) => { setMode(m); setKitMotion(m); };
  return (
    <ShowcaseCard theme={theme} label="Motion" height={392} align="top">
      <Stack gap={24} align="center" style={{ width: 360 }}>
        <SegmentedControl theme={theme} options={["spring", "smooth", "instant"]} value={mode} onChange={pick} />
        <Text size="sm" theme={theme} style={{ color: pal.textSecondary, textAlign: "center", display: "block" }}>
          {mode === "spring" ? "As designed. A little play in the easing, durations tuned per interaction."
            : mode === "smooth" ? "Generous durations and a fluid, decelerating curve. Calm and unhurried."
            : "Near-immediate. A hint of transition so state changes still read as changes."}
        </Text>
        <Card theme={theme} padding={16} style={{ width: "100%" }}>
          <Stack direction="row" gap={12} align="center" justify="space-between">
            <Text size="sm" theme={theme}>Try it</Text>
            <SwitchToggle theme={theme} checked={demo} onChange={setDemo} label={demo ? "On" : "Off"} />
          </Stack>
          <div style={{
            marginTop: 12, height: 6, borderRadius: 3, background: pal.bgMuted, overflow: "hidden",
          }}>
            <div style={{ height: "100%", width: demo ? "100%" : "24%", background: pal.accent, borderRadius: 3, transition: `width ${motion.smooth} ${motion.emphasized}` }} />
          </div>
        </Card>
        <Caption theme={theme}>Applies to every component on this page. setKitMotion(mode) does the same in your project.</Caption>
      </Stack>
    </ShowcaseCard>
  );
}

function DemoTypography({ theme }) {
  const [fonts, setFonts] = useState(KIT_FONT_PRESETS);
  const [font, setFont] = useState("Geist");
  const [customOpen, setCustomOpen] = useState(false);
  const [custom, setCustom] = useState("");
  const pick = (name) => { setFont(name); setKitFont(name); };
  const applyCustom = () => {
    const name = custom.trim();
    if (!name) return;
    if (!fonts.includes(name)) setFonts([...fonts, name]);
    pick(name);
    setCustom("");
    setCustomOpen(false);
  };
  return (
    <ShowcaseCard theme={theme} label={`Typography · ${font}`} height={680} align="top">
      <Stack gap={32} style={{ width: 360 }}>
        {/* Typeface picker. The custom-font row lives in a reserved 38px slot
            below it, so revealing it never moves the specimen. */}
        <Stack gap={12}>
          <Stack direction="row" gap={8} align="center">
            <div style={{ flex: 1, minWidth: 0 }}>
              <Select theme={theme} value={font} onChange={pick}
                options={fonts.map(f => ({ value: f, label: f === "Geist" ? "Geist (default)" : f }))} />
            </div>
            <IconButton theme={theme} variant="secondary" icon="+" size={38}
              label={customOpen ? "Hide custom font" : "Add any Google Font"}
              onClick={() => setCustomOpen(o => !o)}
              style={{ flexShrink: 0, transform: customOpen ? "rotate(45deg)" : "rotate(0deg)", transition: `transform ${motion.normal} ${motion.emphasized}, background ${motion.normal} ${motion.easeInOut}` }} />
          </Stack>
          <form onSubmit={(e) => { e.preventDefault(); applyCustom(); }}
            aria-hidden={!customOpen}
            style={{
              height: 38, display: "flex", alignItems: "center", gap: 8, margin: 0,
              opacity: customOpen ? 1 : 0,
              transform: customOpen ? "translateY(0)" : "translateY(-4px)",
              pointerEvents: customOpen ? "auto" : "none",
              transition: `opacity ${motion.normal} ${motion.easeOut}, transform ${motion.normal} ${motion.emphasized}`,
            }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <TextInput theme={theme} value={custom} onChange={setCustom} placeholder="Any Google Font, e.g. Sora" disabled={!customOpen} />
            </div>
            <Button theme={theme} variant="secondary" disabled={!custom.trim()}>Apply</Button>
          </form>
        </Stack>
        <Stack gap={24}>
          <Heading level={1} theme={theme}>Operations overview</Heading>
          <Heading level={2} theme={theme}>Active workflows</Heading>
          <Heading level={3} theme={theme}>Agent performance</Heading>
          <Heading level={4} theme={theme}>Activity history</Heading>
          <Text size="md" theme={theme} as="p" style={{ margin: 0 }}>Alpha resolved 14 tickets across 3 queues in the last 24 hours, holding median first response at 6 minutes against a target of 15.</Text>
          <Text size="base" secondary theme={theme} as="p" style={{ margin: 0 }}>Last synced 4m ago · Next digest in 22m</Text>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <Code theme={theme}>TKT-4821</Code>
            <Text size="sm" mono theme={theme}>Acme · Enterprise</Text>
            <Caption theme={theme}>CSAT 4.8</Caption>
          </div>
          <Caption theme={theme}>Applies to every component on this page. setKitFont(name) does the same in your project.</Caption>
        </Stack>
      </Stack>
    </ShowcaseCard>
  );
}

function DemoFormInputs({ theme }) {
  const [variant, setVariant] = useState(DEMOFORM_TEXT_VARIANTS[0]);
  const [amount, setAmount] = useState("2,500.00");
  const [email, setEmail] = useState("");
  const [handle, setHandle] = useState("alpha-support");
  const [search, setSearch] = useState("");
  const [tool, setTool] = useState("");
  const [account, setAccount] = useState("acme");
  const [memo, setMemo] = useState("");

  // Every variant renders in the same fixed-height slot so switching never moves the control.
  const textVariant = {
    "Default": <TextInput theme={theme} label="Credit amount (USD)" value={amount} onChange={setAmount} caption="Remaining credit budget: 12,840.00 USD" />,
    "With icon": <TextInput theme={theme} label="Customer email" placeholder="name@company.com" value={email} onChange={setEmail} icon="◆" />,
    "Error": <TextInput theme={theme} label="Webhook URL" placeholder="https://" value="" onChange={() => {}} error="Connection timed out" />,
    "Input group": <InputGroup theme={theme} label="Agent handle" prefix="@" suffix=".halaska" value={handle} onChange={setHandle} />,
    "Copy input": <CopyInput theme={theme} label="Webhook URL" value="https://hooks.northwind.app/alpha/9f3a2c7d4e1b8a6f" />,
    "Search": (
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <Label theme={theme}>Search tickets</Label>
        <SearchInput theme={theme} value={search} onChange={setSearch} placeholder="Search tickets…" />
      </div>
    ),
  }[variant];

  return (
    <Stack gap={24}>
      <ShowcaseCard theme={theme} label="Text Input" height={280} align="top">
        <Stack gap={24} style={{ width: 480 }}>
          <SegmentedControl theme={theme} options={DEMOFORM_TEXT_VARIANTS} value={variant} onChange={setVariant} />
          <div style={{ height: 84 }}>
            <div key={variant} style={{ animation: `halaska-tab-fade ${motion.normal} ${motion.easeOut} both` }}>
              {textVariant}
            </div>
          </div>
        </Stack>
      </ShowcaseCard>

      <ShowcaseCard theme={theme} label="Select & Combobox" height={420} align="top">
        <div style={{ display: "flex", gap: 24, width: 480, alignItems: "flex-start" }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <Select theme={theme} label="Integration" placeholder="Select tool..." value={tool} onChange={setTool}
              options={[{ value: "intercom", label: "Intercom" }, { value: "linear", label: "Linear" }, { value: "github", label: "GitHub" }, { value: "slack", label: "Slack" }]} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <Combobox theme={theme} label="Account" value={account} onChange={setAccount}
              options={[
                { value: "acme", label: "Acme" },
                { value: "lumen", label: "Lumen Labs" },
                { value: "fjord", label: "Fjord Health" },
                { value: "brightline", label: "Brightline" },
                { value: "cobalt", label: "Cobalt Dental" },
                { value: "northwind", label: "Northwind (internal)" },
              ]} />
          </div>
        </div>
      </ShowcaseCard>

      <ShowcaseCard theme={theme} label="Text Area" height={320} align="top">
        <div style={{ width: 320 }}>
          <TextArea theme={theme} label="Agent notes" placeholder="Describe how Alpha should handle refunds..." value={memo} onChange={setMemo} rows={3} caption="Visible to your agent only" />
        </div>
      </ShowcaseCard>
    </Stack>
  );
}

function DemoTogglesSelections({ theme }) {
  const [sw1, setSw1] = useState(true);
  const [sw2, setSw2] = useState(false);
  const [c1, setC1] = useState(true);
  const [c2, setC2] = useState(false);
  const [c3, setC3] = useState(true);
  const [radio, setRadio] = useState("moderate");
  const [tab, setTab] = useState("Inbox");
  return (
    <ShowcaseCard theme={theme} label="Toggles & Selections" height={720} align="top">
      <Stack gap={28} style={{ width: 340 }}>
        <Card theme={theme} padding={20}>
          <CardHeader title="Agent settings" theme={theme} />
          <Stack gap={14}>
            <SwitchToggle checked={sw1} onChange={setSw1} label="Auto-reply to known issues" theme={theme} />
            <SwitchToggle checked={sw2} onChange={setSw2} label="Escalation guardrails" theme={theme} />
          </Stack>
        </Card>
        <Card theme={theme} padding={20}>
          <CardHeader title="Notifications" theme={theme} />
          <Stack gap={14}>
            <Checkbox checked={c1} onChange={setC1} label="Replies sent" theme={theme} />
            <Checkbox checked={c2} onChange={setC2} label="SLA breach warnings" theme={theme} />
            <Checkbox checked={c3} onChange={setC3} label="Weekly CSAT report" theme={theme} />
          </Stack>
        </Card>
        <Card theme={theme} padding={20}>
          <CardHeader title="Autonomy level" theme={theme} />
          <RadioGroup theme={theme} options={[{ value: "conservative", label: "Suggest only" }, { value: "moderate", label: "Confirm first" }, { value: "aggressive", label: "Autonomous" }]} value={radio} onChange={setRadio} />
        </Card>
        <SegmentedControl theme={theme} options={["Inbox", "Issues", "Renewals"]} value={tab} onChange={setTab} />
      </Stack>
    </ShowcaseCard>
  );
}

const DEMOTBL_COLUMNS = ["Account", "Plan", "MRR", "Change"];

const DEMOTBL_ROWS = [
  ["Acme", "Enterprise", "$2,500", "+$142"],
  ["Lumen Labs", "Growth", "$1,200", "-$38"],
  ["Fjord Health", "Enterprise", "$5,000", "+$891"],
  ["Brightline", "Starter", "$800", "+$24"],
];

const DEMOTBL_VIEWS = ["Simple", "Data table"];

// Drawer demo: a bottom drawer that slides up inside a PhoneFrame. The
// screen wrapper carries transform: translateZ(0) so any fixed-position
// child is contained by the phone, never the page; the scrim and panel
// are positioned against that wrapper. Starts open so the drawer is the
// first thing the visitor sees; Done or the scrim dismisses it.
function DrawerPhonePreview({ theme }) {
  const pal = usePal(theme);
  const [open, setOpen] = useState(true);
  const tickets = [
    ["#4821", "Acme · Calendar sync failing", "warning", "Open"],
    ["#4819", "Lumen Labs · Invoice copy request", "accent", "Queued"],
    ["#4802", "Fjord Health · SSO login loop", "default", "Waiting"],
  ];
  return (
    <PhoneFrame theme={theme} width={300} height={560}>
      <div style={{ position: "absolute", inset: 0, transform: "translateZ(0)", fontFamily: tokens.font.sans }}>
        <div style={{ position: "absolute", inset: 0, padding: "52px 14px 16px", display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", padding: "0 6px" }}>
            <Text size="lg" weight="semibold" theme={theme}>Inbox</Text>
            <Caption theme={theme}>3 open</Caption>
          </div>
          <Card theme={theme} padding={0}>
            {tickets.map(([id, title, variant, state], i) => (
              <ListItem key={id} theme={theme} title={title} subtitle={id}
                right={<Badge theme={theme} variant={variant}>{state}</Badge>}
                divider={i < tickets.length - 1} onClick={() => setOpen(true)} />
            ))}
          </Card>
          <Button theme={theme} variant="primary" size="sm" fullWidth onClick={() => setOpen(true)}>Open ticket</Button>
        </div>

        <div onClick={() => setOpen(false)} style={{
          position: "absolute", inset: 0, background: "rgba(0,0,0,0.35)",
          opacity: open ? 1 : 0, pointerEvents: open ? "auto" : "none",
          transition: `opacity ${motion.smooth} ${motion.easeInOut}`,
        }} />

        <div style={{
          position: "absolute", left: 0, right: 0, bottom: 0,
          transform: open ? "translateY(0)" : "translateY(100%)",
          transition: `transform ${motion.smooth} ${motion.emphasized}`,
        }}>
          <InlinePanelPreview theme={theme} title="Ticket #4821" shape="drawer"
            actions={<Button theme={theme} variant="primary" size="sm" fullWidth onClick={() => setOpen(false)}>Done</Button>}>
            Acme reports calendar sync failing for two admins. Known issue LIN-302, fixed in 2.14. Reply with the workaround and a $180 credit.
          </InlinePanelPreview>
        </div>
      </div>
    </PhoneFrame>
  );
}

function DemoFeedbackStatus({ theme }) {
  const pal = usePal(theme);
  return (
    <ShowcaseCard theme={theme} label="Feedback & Status" height={800} align="top">
      <Stack gap={28} style={{ width: 360 }}>
        <Stack gap={10}>
          <Caption theme={theme}>Badges</Caption>
          <Stack direction="row" gap={12} wrap>
            <Badge theme={theme}>Pending</Badge>
            <Badge theme={theme} variant="accent">Processing</Badge>
            <Badge theme={theme} variant="success">Resolved</Badge>
            <Badge theme={theme} variant="warning">Waiting</Badge>
            <Badge theme={theme} variant="danger">Failed</Badge>
          </Stack>
        </Stack>
        <Stack gap={10}>
          <Caption theme={theme}>Tags</Caption>
          <Stack direction="row" gap={12} wrap>
            <Tag theme={theme} color={pal.accent}>Acme · Enterprise</Tag>
            <Tag theme={theme} color={pal.success}>Resolved</Tag>
            <Tag theme={theme} removable onRemove={() => {}}>Auto-reply on</Tag>
          </Stack>
        </Stack>
        <Stack gap={10}>
          <Caption theme={theme}>Progress</Caption>
          <Card theme={theme} padding={16}>
            <CardHeader title="Syncing Intercom" subtitle="1,373 of 2,019 threads" theme={theme} />
            <Progress value={68} theme={theme} />
          </Card>
        </Stack>
        <Stack gap={10}>
          <Caption theme={theme}>Toasts</Caption>
          <Stack gap={12} align="flex-start">
            <Toast theme={theme} message="Reply sent · Ticket #4821 to Acme" variant="success" icon="✓" />
            <Toast theme={theme} message="Intercom connection dropped" variant="danger" icon="!" />
          </Stack>
        </Stack>
        <Stack gap={10}>
          <Caption theme={theme}>Skeleton</Caption>
          <Stack gap="sm">
            <Skeleton theme={theme} width="60%" height={14} />
            <Skeleton theme={theme} width="100%" height={14} />
            <Skeleton theme={theme} width="80%" height={14} />
            <Skeleton theme={theme} width={40} height={40} rounded />
          </Stack>
        </Stack>
      </Stack>
    </ShowcaseCard>
  );
}

function DemoDataDisplay({ theme }) {
  return (
    <ShowcaseCard theme={theme} label="Data Display" height={760} align="top">
      <Stack gap={28} style={{ width: 380 }}>
        <Stack gap={10}>
          <Caption theme={theme}>Stats</Caption>
          <Stack direction="row" gap={28}>
            <Stat theme={theme} label="MRR" value="$142.8k" change="+8.2%" />
            <Stat theme={theme} label="Credits issued" value="$3,412" change="-1.4%" />
            <Stat theme={theme} label="Resolved by Alpha" value="72%" change="+3.1%" />
          </Stack>
        </Stack>
        <Stack gap={10}>
          <Caption theme={theme}>Avatar group</Caption>
          <Stack direction="row" gap={12} align="center">
            <AvatarGroup theme={theme} names={["Alpha", "Triage bot", "Renewal watcher", "Release notes", "Onboarding guide", "Research scout"]} />
            <Text size="sm" secondary theme={theme}>6 active agents</Text>
          </Stack>
        </Stack>
        <Stack gap={10}>
          <Caption theme={theme}>List</Caption>
          <Card theme={theme} padding={0}>
            <ListItem theme={theme} left={<Avatar name="Alpha" size={36} theme={theme} />} title="Alpha" subtitle="Support inbox · Triage" right={<Badge theme={theme} variant="success">Running</Badge>} />
            <ListItem theme={theme} left={<Avatar name="Renewal watcher" size={36} theme={theme} />} title="Renewal watcher" subtitle="HubSpot · Weekly check-in" right={<Badge theme={theme} variant="accent">Queued</Badge>} />
            <ListItem theme={theme} left={<Avatar name="Release notes" size={36} theme={theme} />} title="Release notes" subtitle="GitHub · Changelog draft" right={<Badge theme={theme}>Paused</Badge>} divider={false} />
          </Card>
        </Stack>
        <Stack gap={10}>
          <Caption theme={theme}>Middle truncate · identifiers keep their tail</Caption>
          <Stack gap={10}>
            {[280, 200, 140].map(w => (
              <div key={w} style={{ width: w, padding: "6px 10px", borderRadius: tokens.radius.sm, background: theme === "dark" ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.025)" }}>
                <MiddleTruncate theme={theme} text="conv_9f3a2c7d4e1b8a6f5c2d9e0b7a4c1f8e3d2b1a" />
              </div>
            ))}
          </Stack>
        </Stack>
      </Stack>
    </ShowcaseCard>
  );
}

// ─── AI ELEMENTS: atomic AI-specific components ──────────────
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
      <ShowcaseCard theme={theme} label="Streaming Text" height={280} align="top" controls={
        <Button theme={theme} variant="ghost" size="sm" onClick={() => setStreamKey(k => k + 1)}>↻ Replay</Button>
      }>
        <div key={streamKey} style={{ width: 360 }}>
          <StreamingText text="Acme's usage dropped 40% this week and two of their admins opened tickets about calendar sync. I'd recommend replying now with the workaround and flagging the account to Dana for a check-in before renewal." speed={22} theme={theme} />
        </div>
      </ShowcaseCard>

      <ShowcaseCard theme={theme} label="Thinking Indicator" height={180} align="top">
        <ThinkingIndicator theme={theme} label="Streaming" />
      </ShowcaseCard>

      <ShowcaseCard theme={theme} label="Thinking Steps" height={260} align="top" controls={
        <Button theme={theme} variant="ghost" size="sm" onClick={() => setStepKey(k => k + 1)}>↻ Replay</Button>
      }>
        <div key={stepKey} style={{ width: 300 }}>
          <ThinkingSteps theme={theme} current={step} steps={[
            "Scanning the Intercom inbox",
            "Matching against known issues",
            "Checking the refund cap",
            "Drafting the reply",
          ]} />
        </div>
      </ShowcaseCard>

      <ShowcaseCard theme={theme} label="Orbs" height={220} align="top">
        <Stack direction="row" gap={56} align="flex-start" justify="center">
          {[["pulse", "Lattice"], ["orbit", "Ring"]].map(([variant, label]) => (
            <Stack key={variant} gap={14} align="center">
              <Orb variant={variant} size={32} color={pal.accent} theme={theme} />
              <Caption theme={theme}>{label}</Caption>
            </Stack>
          ))}
        </Stack>
      </ShowcaseCard>

      <ShowcaseCard theme={theme} label="Confidence Bar" height={240} align="top">
        <Stack gap={14} style={{ width: 300 }}>
          <ConfidenceBar value={94} label="Known issue" theme={theme} />
          <ConfidenceBar value={72} label="Root cause" theme={theme} />
          <ConfidenceBar value={38} label="Churn risk" theme={theme} />
        </Stack>
      </ShowcaseCard>

      <ShowcaseCard theme={theme} label="AI Suggestion Badge" height={180} align="top">
        <AISuggestionBadge theme={theme} />
      </ShowcaseCard>

      <ShowcaseCard theme={theme} label="Before / After Toggle" height={340} align="top">
        <div style={{ width: 320 }}>
          <BeforeAfterToggle theme={theme}
            before={
              <Card theme={theme} padding={16}>
                <Stack gap={4}>
                  <Caption theme={theme}>Original</Caption>
                  <Text size="sm" theme={theme}>Sorry for the trouble, we're looking into it and will get back to you soon.</Text>
                </Stack>
              </Card>
            }
            after={
              <Card theme={theme} padding={16}>
                <Stack gap={4}>
                  <Caption theme={theme}>Agent rewrite</Caption>
                  <Text size="sm" theme={theme}>The calendar sync bug is fixed in 2.14, shipping Thursday. Here's the workaround until then, plus a $180 credit for the outage.</Text>
                </Stack>
              </Card>
            } />
        </div>
      </ShowcaseCard>

      <ShowcaseCard theme={theme} label="Zoom Control" height={180} align="top">
        <ZoomControl theme={theme} zoom={zoom} onChange={setZoom} />
      </ShowcaseCard>
    </Stack>
  );
}


// Inline panel preview: renders dialog or drawer chrome inline so a demo can
// show the panel without covering the page. The drawer shape is used by
// DrawerPhonePreview, docked to the bottom of a PhoneFrame screen.
function InlinePanelPreview({ title, children, actions, theme, shape = "dialog" }) {
  const pal = usePal(theme);
  const isSheet = shape === "sheet";
  const isDrawer = shape === "drawer";
  return (
    <div style={{
      width: isSheet ? 320 : 400, maxWidth: "100%", boxSizing: "border-box",
      background: theme === "dark" ? "rgba(30,30,30,0.95)" : "rgba(255,255,255,0.95)",
      backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
      borderTop: `1px solid ${pal.borderSubtle}`, borderLeft: `1px solid ${pal.borderSubtle}`, borderRight: `1px solid ${pal.borderSubtle}`,
      borderBottom: isDrawer ? "none" : `1px solid ${pal.borderSubtle}`,
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
  const [dialogOpen, setDialogOpen] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [cardOpen, setCardOpen] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [formName, setFormName] = useState("");
  return (
    <Stack gap={24}>
      <ShowcaseCard theme={theme} label="Drawer" height={700} align="top">
        <DrawerPhonePreview theme={theme} />
      </ShowcaseCard>

      <ShowcaseCard theme={theme} label="Popover, Dropdown & Hover card" height={360} align="top">
        <Stack direction="row" gap={16} align="center" wrap justify="center">
          <TriggerPopover theme={theme} />
          <TriggerDropdown theme={theme} />
          <HoverCard theme={theme}
            trigger={
              <div style={{ display: "inline-flex", alignItems: "center", gap: 8, height: 30, padding: "0 4px", cursor: "default" }}>
                <Avatar name="Alpha" size={24} theme={theme} />
                <Text size="sm" weight="medium" theme={theme}>Hover me</Text>
              </div>
            }>
            <Stack gap={8}>
              <Stack direction="row" gap={10} align="center">
                <Avatar name="Alpha" size={32} theme={theme} />
                <div>
                  <Text size="sm" weight="semibold" theme={theme} style={{ display: "block" }}>Alpha</Text>
                  <Text size="xs" secondary theme={theme}>Support inbox · Triage</Text>
                </div>
              </Stack>
              <Text size="xs" secondary theme={theme}>Running for 42 days · 72% resolved solo · 6m median first response.</Text>
            </Stack>
          </HoverCard>
        </Stack>
      </ShowcaseCard>

      <ShowcaseCard theme={theme} label="Dialogs" height={220} align="top">
        <Stack gap={16} align="center">
          <Stack direction="row" gap={8} wrap justify="center">
            <Button theme={theme} variant="outline" size="sm" onClick={() => setDialogOpen(true)}>Dialog</Button>
            <Button theme={theme} variant="outline" size="sm" onClick={() => setAlertOpen(true)}>Alert</Button>
            <Button theme={theme} variant="outline" size="sm" onClick={() => setFormOpen(true)}>Form</Button>
            <Button theme={theme} variant="outline" size="sm" onClick={() => setCardOpen(true)}>Card</Button>
            <Button theme={theme} variant="outline" size="sm" onClick={() => setSheetOpen(true)}>Sheet</Button>
          </Stack>
          <Caption theme={theme}>Each button opens the real overlay above the page.</Caption>
        </Stack>

        <Dialog theme={theme} open={dialogOpen} onClose={() => setDialogOpen(false)} title="Confirm credit">
          Issue a $180 credit to Acme for the outage? This posts to Stripe and cannot be undone.
        </Dialog>
        <AlertDialog theme={theme} open={alertOpen} onClose={() => setAlertOpen(false)}
          title="Close ticket?" description="This will close Ticket #4821 for Acme and notify the customer. This cannot be undone."
          confirmLabel="Close ticket" variant="danger" />
        <FormDialog theme={theme} open={formOpen} onClose={() => setFormOpen(false)}
          title="Create workflow" description="Name your workflow and set a refund cap."
          onSubmit={() => {}}>
          <TextInput theme={theme} label="Workflow name" value={formName} onChange={setFormName} placeholder="Refund triage" />
          <TextInput theme={theme} label="Refund cap (USD)" placeholder="2,500" />
        </FormDialog>
        <CardDialog theme={theme} open={cardOpen} onClose={() => setCardOpen(false)}
          cover="◆" title="Alpha Pro upgrade"
          description="Unlock unlimited workflows, HubSpot sync, and priority support."
          actions={<>
            <Button theme={theme} variant="ghost" size="sm" onClick={() => setCardOpen(false)}>Later</Button>
            <Button theme={theme} variant="primary" size="sm" onClick={() => setCardOpen(false)}>Upgrade</Button>
          </>}
        />
        <Sheet theme={theme} open={sheetOpen} onClose={() => setSheetOpen(false)} title="Ticket details">
          <Stack gap={12}>
            <Text size="sm" theme={theme}>View the full thread history and account context in this side panel.</Text>
            <Divider theme={theme} />
            <Stat theme={theme} label="Account" value="Acme" />
            <Stat theme={theme} label="CSAT" value="4.8" change="+4.4%" />
            <Stat theme={theme} label="Open tickets" value="3" />
            <Button theme={theme} variant="primary" size="sm" fullWidth onClick={() => setSheetOpen(false)}>Close ticket</Button>
          </Stack>
        </Sheet>
      </ShowcaseCard>

      <ShowcaseCard theme={theme} label="Tooltip" height={200} align="top">
        <Tooltip theme={theme} text="Copy ticket link">
          <Button theme={theme} variant="ghost" size="sm">Hover me</Button>
        </Tooltip>
      </ShowcaseCard>
    </Stack>
  );
}

function TriggerPopover({ theme }) {
  return (
    <Popover theme={theme} trigger={<Button theme={theme} variant="outline" size="sm">Popover</Button>}>
      <Stack gap={6} style={{ width: 220 }}>
        <Text size="sm" weight="semibold" theme={theme}>Refund cap</Text>
        <Text size="sm" secondary theme={theme}>Alpha can issue credits up to $250 per ticket on its own. Anything larger routes to Dana for approval.</Text>
      </Stack>
    </Popover>
  );
}

function TriggerDropdown({ theme }) {
  return (
    <DropdownMenu theme={theme} trigger={<Button theme={theme} variant="outline" size="sm">Menu</Button>}
      items={[
        { label: "Edit ticket", icon: "✎" },
        { label: "Duplicate", icon: "⧉" },
        { separator: true },
        { label: "Close ticket", icon: "✕", danger: true },
      ]} />
  );
}

function DemoNavigation({ theme }) {
  const pal = usePal(theme);
  const [tab, setTab] = useState("Overview");
  const [subtleTab, setSubtleTab] = useState("Inbox");
  const [step, setStep] = useState(1);
  const nextStep = () => setStep(s => Math.min(s + 1, 3));
  const resetStep = () => setStep(0);
  // Left-click fallback for the context menu surface: re-dispatch the click as a
  // native contextmenu event at the pointer once the click has finished propagating.
  const ctxTimer = useRef(null);
  useEffect(() => () => clearTimeout(ctxTimer.current), []);
  const openContextMenu = (e) => {
    const target = e.currentTarget;
    const rect = target.getBoundingClientRect();
    // Keyboard activation has no pointer: open at the surface's centre instead.
    const clientX = e.clientX ?? rect.left + rect.width / 2;
    const clientY = e.clientY ?? rect.top + rect.height / 2;
    clearTimeout(ctxTimer.current);
    ctxTimer.current = setTimeout(() => {
      target.dispatchEvent(new MouseEvent("contextmenu", { bubbles: true, cancelable: true, clientX, clientY }));
    }, 0);
  };
  const tabContent = {
    Overview: {
      stat: [{ label: "MRR", value: "$142.8k", change: "+8.2%" }, { label: "Credits issued", value: "$3,412", change: "-1.4%" }],
      blurb: "Alpha resolved 14 tickets across 3 queues in the last 24 hours. Median first response: 6 minutes.",
    },
    Tickets: {
      stat: [{ label: "Open", value: "7" }, { label: "Resolved today", value: "14" }],
      blurb: "Most recent: Ticket #4821 for Acme, replied 4m ago. Next digest in 22m.",
    },
    Settings: {
      stat: [{ label: "Autonomy", value: "Confirm first" }, { label: "Refund cap", value: "$2,500" }],
      blurb: "Auto-reply is on for known issues. Anything over the refund cap waits for your approval.",
    },
  }[tab];
  // Labelled row: fixed-width Caption on the left, content on the right.
  const row = (label, nodes) => (
    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
      <Caption theme={theme} style={{ width: 96, flexShrink: 0, color: pal.textTertiary }}>{label}</Caption>
      <div style={{ flex: 1, minWidth: 0 }}>{nodes}</div>
    </div>
  );
  return (
    <Stack gap={24}>
      <ShowcaseCard theme={theme} label="Breadcrumbs" height={280} align="top">
        <Stack gap={24} style={{ width: 480 }}>
          {row("Default", (
            <Breadcrumb theme={theme} home items={[
              { label: "Workspace" }, { label: "Agents" }, { label: "Alpha" },
            ]} />
          ))}
          {row("Truncated", (
            <Breadcrumb theme={theme} maxVisible={3} items={[
              { label: "Northwind" }, { label: "Workspace" }, { label: "Agents" },
              { label: "Alpha" }, { label: "Settings" }, { label: "Guardrails" },
            ]} />
          ))}
          {row("", <Caption theme={theme}>Hover the … to reveal the full path.</Caption>)}
        </Stack>
      </ShowcaseCard>

      <ShowcaseCard theme={theme} label="Tabs">
        <Stack gap={20} style={{ width: 340 }}>
          <Tabs theme={theme} tabs={["Overview", "Tickets", "Settings"]} value={tab} onChange={setTab} />
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
        <SubtleTabs theme={theme} tabs={["Inbox", "Issues", "Renewals"]} value={subtleTab} onChange={setSubtleTab} />
      </ShowcaseCard>

      <ShowcaseCard theme={theme} label="Stepper" controls={<>
        <Button theme={theme} variant="ghost" size="sm" onClick={resetStep}>Reset</Button>
        <Button theme={theme} variant="ghost" size="sm" iconRight="→" onClick={nextStep}>Advance</Button>
      </>}>
        <div style={{ width: 320 }}>
          <Stepper theme={theme} current={step} steps={["Connect", "Configure", "Review", "Deploy"]} />
        </div>
      </ShowcaseCard>

      <ShowcaseCard theme={theme} label="Accordion & Collapsible" height={460} align="top">
        <Stack gap={32} style={{ width: 340 }}>
          <Accordion theme={theme} items={[
            { title: "What does auto-reply do?", content: "Alpha answers tickets that match a known issue in the changelog or runbooks, and leaves everything else for you." },
            { title: "How are credits capped?", content: "Credits over $2,500 wait for your approval. Replies are never capped." },
            { title: "Can I pause Alpha?", content: "Yes. Use the pause switch in Agent Settings to stop all active workflows immediately." },
          ]} />
          <Collapsible theme={theme} title="Advanced settings">
            <Stack gap={8} style={{ paddingBottom: 8 }}>
              <Text size="sm" theme={theme} secondary>Configure SLA rules, escalation contacts, and custom webhook endpoints.</Text>
            </Stack>
          </Collapsible>
        </Stack>
      </ShowcaseCard>

      <ShowcaseCard theme={theme} label="Context Menu">
        <ContextMenu theme={theme} items={[
          { label: "Edit ticket", icon: "✎", shortcut: "⌘E" },
          { label: "Duplicate", icon: "⧉", shortcut: "⌘D" },
          { separator: true },
          { label: "Close ticket", icon: "✕", danger: true },
        ]}>
          <div onClick={openContextMenu} role="button" tabIndex={0}
            onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openContextMenu(e); } }}
            style={{
              width: 320, padding: "28px 32px", cursor: "context-menu", userSelect: "none",
              background: pal.bgSubtle, border: `1px dashed ${pal.borderInput}`, borderRadius: tokens.radius.md,
              fontFamily: tokens.font.sans, textAlign: "center",
              transition: `background ${motion.smooth} ${motion.easeInOut}, border-color ${motion.smooth} ${motion.easeInOut}`,
            }}>
            <Text size="sm" weight="medium" theme={theme} style={{ color: pal.textSecondary, display: "block" }}>Right-click here</Text>
            <Caption theme={theme} style={{ display: "block", marginTop: 4 }}>A normal click opens the same menu</Caption>
          </div>
        </ContextMenu>
      </ShowcaseCard>

      <ShowcaseCard theme={theme} label="Menubar">
        <Menubar theme={theme} menus={[
          { label: "File", items: [{ label: "New ticket", shortcut: "⌘N" }, { label: "Open…", shortcut: "⌘O" }, { separator: true }, { label: "Save", shortcut: "⌘S" }] },
          { label: "Edit", items: [{ label: "Undo", shortcut: "⌘Z" }, { label: "Redo", shortcut: "⇧⌘Z" }] },
          { label: "View", items: [{ label: "Toggle sidebar" }, { label: "Toggle DevTools" }] },
        ]} />
      </ShowcaseCard>

      <ShowcaseCard theme={theme} label="Command Menu">
        <CommandPalette theme={theme} items={[
          { label: "New ticket", icon: "+", shortcut: "T" },
          { label: "Issue credit", icon: "$", shortcut: "D" },
          { label: "View open tickets", icon: "◧" },
          { label: "Open workflow builder", icon: "✦", shortcut: "S" },
          { label: "Sync inbox", icon: "⟳" },
        ]} />
      </ShowcaseCard>
    </Stack>
  );
}

function DemoTable({ theme }) {
  const [view, setView] = useState(DEMOTBL_VIEWS[0]);
  const [page, setPage] = useState(1);
  const [dotPage, setDotPage] = useState(2);
  return (
    <Stack gap={24}>
      <ShowcaseCard theme={theme} label="Table" height={400} align="top" controls={
        <div style={{ width: 200 }}>
          <SegmentedControl theme={theme} options={DEMOTBL_VIEWS} value={view} onChange={setView} />
        </div>
      }>
        <Stack gap={12} style={{ width: 460 }}>
          {/* Fixed-height slot: switching views never moves the control or the caption. */}
          <div style={{ height: 220 }}>
            {view === "Simple"
              ? <Table theme={theme} columns={DEMOTBL_COLUMNS} rows={DEMOTBL_ROWS} />
              : <DataTable theme={theme} columns={DEMOTBL_COLUMNS} rows={DEMOTBL_ROWS} />}
          </div>
          <Caption theme={theme}>
            {view === "Simple" ? "Plain rows with hover." : "Adds row selection and sortable column headers."}
          </Caption>
        </Stack>
      </ShowcaseCard>

      <ShowcaseCard theme={theme} label="Pagination" height={260} align="top">
        <Stack gap={28} style={{ width: 320 }}>
          <Stack gap={10}>
            <Caption theme={theme}>Numbers</Caption>
            <Pagination theme={theme} current={page} total={8} onChange={setPage} />
          </Stack>
          <Stack gap={10}>
            <Caption theme={theme}>Dots</Caption>
            <Pagination theme={theme} variant="dots" current={dotPage} total={5} onChange={setDotPage} />
          </Stack>
        </Stack>
      </ShowcaseCard>

      <ShowcaseCard theme={theme} label="Scroll Area" height={320} align="top">
        <div style={{ width: 320 }}>
          <ScrollArea theme={theme} maxHeight={180}>
            <Stack gap={0}>
              {[
                ["14:36:41", "Reply sent · Ticket #4821 to Acme"],
                ["14:32:05", "Reply sent · Ticket #4819 to Lumen Labs"],
                ["14:18:52", "Credit issued · $180 to Acme"],
                ["13:57:20", "Signal · Acme usage down 40% this week"],
                ["13:41:03", "Triage · 12 tickets tagged and routed"],
                ["13:22:48", "Issue filed · LIN-302 calendar sync"],
                ["12:58:31", "Escalated · Ticket #4802 to Priya"],
                ["12:40:07", "Inbox synced · 2,500 threads"],
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

      <ShowcaseCard theme={theme} label="Sparkline" height={240} align="top">
        <Stack gap={12} align="center">
          <Sparkline theme={theme} data={[12, 18, 14, 22, 19, 26, 24, 31, 28, 35, 33, 40]} width={220} height={56} />
          <Caption theme={theme}>Tickets resolved · 30d · +22% · pure SVG, no chart library</Caption>
        </Stack>
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
      <ShowcaseCard theme={theme} label="Alert Banners" height={520} align="top">
        <Stack gap={20} style={{ width: 400 }}>
          <AlertBanner theme={theme} variant="default" title="Sync complete" description="All Intercom threads have been updated." />
          <AlertBanner theme={theme} variant="success" title="Reply sent" description="Ticket #4821 answered with the calendar sync workaround." />
          <AlertBanner theme={theme} variant="warning" title="SLA at risk" description="3 tickets are within 15 minutes of breaching first response." />
          <AlertBanner theme={theme} variant="danger" title="Churn risk" description="Acme's usage dropped 40% this week." />
        </Stack>
      </ShowcaseCard>

      <ShowcaseCard theme={theme} label="Empty State" height={400} align="top">
        <EmptyState theme={theme} icon="◇" title="No open tickets"
          description="Sync your inbox or deploy an agent to get started."
          action={<Button theme={theme} variant="primary" size="sm">Sync inbox</Button>} />
      </ShowcaseCard>

      <ShowcaseCard theme={theme} label="Progress Circle" height={240} align="top">
        <ProgressCircle theme={theme} value={progress} label={`${progress}%`} size={64} />
      </ShowcaseCard>

      <ShowcaseCard theme={theme} label="Spinner" height={200} align="top">
        <Stack direction="row" gap={24} align="center">
          <Spinner size={14} />
          <Spinner size={20} />
          <Spinner size={28} />
        </Stack>
      </ShowcaseCard>

      <ShowcaseCard theme={theme} label="Status" height={300} align="top">
        <Stack gap={28} style={{ width: 360 }}>
          <Stack gap={10}>
            <Caption theme={theme}>Badges</Caption>
            <Stack gap={10} direction="row" wrap align="center">
              <StatusBadge theme={theme} status="online" pulse>Live</StatusBadge>
              <StatusBadge theme={theme} status="pending">Pending</StatusBadge>
              <StatusBadge theme={theme} status="error">Failed</StatusBadge>
              <StatusBadge theme={theme} status="accent">Beta</StatusBadge>
              <StatusBadge theme={theme} status="offline">Idle</StatusBadge>
            </Stack>
          </Stack>
          <Stack gap={10}>
            <Caption theme={theme}>Dots</Caption>
            <Stack gap={20} direction="row" wrap align="center">
              {[
                ["online", "Live", true],
                ["busy", "Degraded", false],
                ["error", "Down", false],
                ["offline", "Idle", false],
                ["accent", "Beta", false],
              ].map(([status, label, pulse]) => (
                <Stack key={status} direction="row" gap={7} align="center">
                  <StatusDot theme={theme} status={status} pulse={pulse} />
                  <Text size="sm" secondary theme={theme}>{label}</Text>
                </Stack>
              ))}
            </Stack>
          </Stack>
        </Stack>
      </ShowcaseCard>
    </Stack>
  );
}

// Stop: a small square, 1px stroke with a light fill (12px, currentColor).
function AgentStatusStopIcon({ size = 12 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1" strokeLinejoin="round" aria-hidden="true">
      <rect x="2.5" y="2.5" width="7" height="7" rx="1.5" fill="currentColor" fillOpacity="0.18" />
    </svg>
  );
}

// Resume: a small play triangle to pair with the stop square.
function AgentStatusResumeIcon({ size = 12 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1" strokeLinejoin="round" aria-hidden="true">
      <path d="M3.5 2.5 L9.5 6 L3.5 9.5 Z" fill="currentColor" fillOpacity="0.18" />
    </svg>
  );
}

// Redirect: a git-branch shape, two nodes joined by a curve (13px, 1px stroke).
function AgentStatusBranchIcon({ size = 13 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="3.5" cy="9.75" r="1.75" />
      <circle cx="9.5" cy="3.25" r="1.75" />
      <path d="M3.5 8 C3.5 5.25 9.5 7.5 9.5 5" />
      <path d="M3.5 8 V4.5" />
    </svg>
  );
}

// Pairs a hunk's unified lines into aligned side-by-side rows: context lines
// sit on both sides, each run of removals lines up with the run of additions
// that follows it, and the longer run leaves empty cells on the other side.
// Line numbers come from the hunk header ("@@ -old,n +new,n @@").
function diffviewRows(hunk) {
  const m = /@@ -(\d+)(?:,\d+)? \+(\d+)/.exec(hunk.header) || [];
  let oldN = Number(m[1]) || 1;
  let newN = Number(m[2]) || 1;
  const rows = [];
  const lines = hunk.lines;
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (line.t === "ctx") {
      rows.push({
        left: { n: oldN++, code: line.code, t: "ctx" },
        right: { n: newN++, code: line.code, t: "ctx" },
      });
      i += 1;
      continue;
    }
    const dels = [];
    const adds = [];
    while (i < lines.length && lines[i].t === "del") dels.push(lines[i++]);
    while (i < lines.length && lines[i].t === "add") adds.push(lines[i++]);
    const len = Math.max(dels.length, adds.length);
    for (let k = 0; k < len; k++) {
      rows.push({
        left: dels[k] ? { n: oldN++, code: dels[k].code, t: "del" } : null,
        right: adds[k] ? { n: newN++, code: adds[k].code, t: "add" } : null,
      });
    }
  }
  return rows;
}

// Notification center: seed events. `tone` maps to a palette colour inside the
// component; `read` seeds the initial read state.
const NOTIFICATIONS_ITEMS = [
  { id: "n1", icon: "✓", tone: "success", title: "Reply sent", body: "Ticket #4821 · Acme · calendar sync workaround", time: "2m" },
  { id: "n2", icon: "!", tone: "warning", title: "Refund needs approval", body: "Lumen Labs asked for $3,200, over your $2,500 cap. Review before sending.", time: "14m" },
  { id: "n3", icon: "✦", tone: "accent", title: "New signal from Alpha", body: "Acme's usage dropped 40% this week.", time: "42m" },
  { id: "n4", icon: "✕", tone: "danger", title: "Intercom connection dropped", body: "Reconnecting to the inbox…", time: "1h" },
  { id: "n5", icon: "⧗", tone: "muted", title: "Daily digest sent", body: "14 tickets resolved, 3 escalated to Priya.", time: "3h", read: true },
];

const COMMAND_RECENT = [
  { icon: "↺", label: "Escalate #4821 to Priya" },
  { icon: "↺", label: "Refund status for Lumen Labs" },
];

// Suggestion chip: pill button on the subtle surface with a hairline ring; hover
// raises it. mousedown is swallowed so the input keeps focus until the click lands.
function CommandSearchChip({ icon, label, onPick, theme }) {
  const pal = usePal(theme);
  const [hover, setHover] = useState(false);
  return (
    <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={onPick}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        ...interactiveBase, display: "inline-flex", alignItems: "center", gap: 6,
        padding: "5px 11px", borderRadius: tokens.radius.pill,
        background: hover ? pal.bgMuted : pal.bgSubtle,
        border: `1px solid ${hover ? pal.border : pal.borderSubtle}`,
        color: hover ? pal.text : pal.textSecondary,
        ...tokens.type.sm, fontWeight: tokens.weight.medium, whiteSpace: "nowrap",
        transform: hover ? "translateY(-1px)" : "translateY(0)",
        boxShadow: hover ? `0 4px 12px ${pal.shadowLg}` : "0 0 0 transparent",
      }}>
      <span style={{ fontSize: 11, color: pal.textTertiary, transition: `color ${motion.smooth} ${motion.easeInOut}` }}>{icon}</span>
      {label}
    </button>
  );
}

// Notification center panel: registered as an ambient UX pattern (it's a
// composed surface, not an atomic component). Read state is real: tapping an
// item marks it read, "Mark all read" clears every unread dot and the badge.
function NotificationsDemo({ theme }) {
  const pal = usePal(theme);
  const [readIds, setReadIds] = useState(() => NOTIFICATIONS_ITEMS.filter(n => n.read).map(n => n.id));
  const [hoverId, setHoverId] = useState(null);
  const [hoverAll, setHoverAll] = useState(false);
  const tones = { success: pal.success, warning: pal.warning, accent: pal.accent, danger: pal.danger, muted: pal.textSecondary };
  const unread = NOTIFICATIONS_ITEMS.filter(n => !readIds.includes(n.id)).length;
  const markRead = (id) => setReadIds(ids => ids.includes(id) ? ids : [...ids, id]);
  const markAll = () => setReadIds(NOTIFICATIONS_ITEMS.map(n => n.id));

  return (
    <div style={{ width: 400, maxWidth: "100%", display: "flex", flexDirection: "column", background: pal.bgElevated, borderRadius: tokens.radius.md, border: `1px solid ${pal.borderSubtle}`, overflow: "hidden", transition: `all ${motion.smooth} ${motion.easeInOut}` }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 16px", borderBottom: `1px solid ${pal.borderSubtle}` }}>
        <Text size="sm" weight="semibold" theme={theme}>Notifications</Text>
        <Badge theme={theme} variant={unread > 0 ? "accent" : "default"} style={{ fontVariantNumeric: "tabular-nums", minWidth: 22, justifyContent: "center" }}>{unread}</Badge>
        <button onClick={markAll} disabled={unread === 0}
          onMouseEnter={() => setHoverAll(true)} onMouseLeave={() => setHoverAll(false)}
          style={{
            ...interactiveBase, marginLeft: "auto", padding: "2px 0", background: "transparent",
            ...tokens.type.xs, fontWeight: tokens.weight.medium,
            color: unread === 0 ? pal.textMuted : hoverAll ? pal.text : pal.textSecondary,
            cursor: unread === 0 ? "default" : "pointer",
          }}>{unread === 0 ? "All read" : "Mark all read"}</button>
      </div>
      {NOTIFICATIONS_ITEMS.map((n, i) => {
        const read = readIds.includes(n.id);
        const color = tones[n.tone] || pal.textSecondary;
        const hovered = hoverId === n.id && !read;
        return (
          <div key={n.id} role={read ? undefined : "button"} tabIndex={read ? undefined : 0}
            onClick={() => markRead(n.id)}
            onKeyDown={(e) => { if (!read && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); markRead(n.id); } }}
            onMouseEnter={() => setHoverId(n.id)} onMouseLeave={() => setHoverId(null)}
            style={{
              display: "flex", gap: 12, padding: "12px 16px", outline: "none",
              borderBottom: i < NOTIFICATIONS_ITEMS.length - 1 ? `1px solid ${pal.borderSubtle}` : "none",
              background: read ? "transparent"
                : hovered ? pal.bgSubtle
                : (theme === "dark" ? "rgba(255,255,255,0.015)" : "rgba(0,0,0,0.015)"),
              cursor: read ? "default" : "pointer",
              transition: `background ${motion.normal} ${motion.easeInOut}`,
            }}>
            <div style={{
              width: 28, height: 28, borderRadius: 14, flexShrink: 0,
              background: `${color}22`, color,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 13, fontWeight: tokens.weight.semibold,
              opacity: read ? 0.55 : 1,
              transition: `all ${motion.smooth} ${motion.easeInOut}`,
            }}>{n.icon}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 8 }}>
                <Text size="sm" weight={read ? "medium" : "semibold"} theme={theme} style={{ color: read ? pal.textSecondary : pal.text }}>{n.title}</Text>
                <Text size="xs" theme={theme} style={{ color: pal.textTertiary, flexShrink: 0 }}>{n.time}</Text>
              </div>
              <Text size="xs" theme={theme} style={{ color: read ? pal.textTertiary : pal.textSecondary, marginTop: 2, lineHeight: 1.5 }}>{n.body}</Text>
            </div>
            {/* Fixed slot so the dot's disappearance never shifts the row */}
            <div style={{
              width: 6, height: 6, borderRadius: 3, background: pal.accent, alignSelf: "center", flexShrink: 0,
              opacity: read ? 0 : 1, transform: read ? "scale(0.4)" : "scale(1)",
              transition: `all ${motion.smooth} ${motion.easeInOut}`,
            }} />
          </div>
        );
      })}
    </div>
  );
}

function NotificationCenterPattern({ theme }) {
  return <NotificationsDemo theme={theme} />;
}

function DismissibleChipsDemo({ theme }) {
  const all = ["Acme · Enterprise", "Calendar sync", "Priority: high", "Assigned: Dana"];
  const [tags, setTags] = useState(all);
  return (
    <Stack gap={8} direction="row" wrap align="center">
      {tags.map((t, i) => (
        <Chip key={t} theme={theme} selected
          onRemove={() => setTags(tags.filter((_, j) => j !== i))}>
          {t}
        </Chip>
      ))}
      {tags.length === 0 && (
        <>
          <Text size="sm" theme={theme} secondary>All dismissed.</Text>
          <LinkButton theme={theme} size="sm" onClick={() => setTags(all)}>Restore</LinkButton>
        </>
      )}
    </Stack>
  );
}

function DemoInputsExtended({ theme }) {
  const pal = usePal(theme);
  const [chips, setChips] = useState(new Set(["Open"]));
  const [date, setDate] = useState(new Date());
  const [slider, setSlider] = useState(35);
  const [spring, setSpring] = useState(false);
  const [springToggle, setSpringToggle] = useState(true);
  const [togglePressed, setTogglePressed] = useState(true);
  const [toggleGroupVal, setToggleGroupVal] = useState("1h");
  const [rating, setRating] = useState(4);
  const [orderType, setOrderType] = useState("confirm");

  const toggleChip = (c) => {
    const s = new Set(chips);
    s.has(c) ? s.delete(c) : s.add(c);
    setChips(s);
  };

  // Labelled row: fixed-width Caption on the left, content on the right.
  const row = (label, nodes) => (
    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
      <Caption theme={theme} style={{ width: 88, flexShrink: 0, color: pal.textTertiary }}>{label}</Caption>
      <div style={{ flex: 1, minWidth: 0 }}>{nodes}</div>
    </div>
  );

  return (
    <Stack gap={24}>
      <ShowcaseCard theme={theme} label="Slider" height={240} align="top">
        <Stack gap={20} style={{ width: 300 }}>
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <SwitchToggle theme={theme} checked={spring} onChange={setSpring} label="Spring" />
          </div>
          <div style={{ height: 52 }}>
            {spring
              ? <SpringSlider theme={theme} label="Refund cap" value={slider} onChange={setSlider} />
              : <Slider theme={theme} label="Refund cap" value={slider} onChange={setSlider} />}
          </div>
        </Stack>
      </ShowcaseCard>

      <ShowcaseCard theme={theme} label="Spring Toggle">
        <SpringToggle theme={theme} checked={springToggle} onChange={setSpringToggle} label="Auto-reply" />
      </ShowcaseCard>

      <ShowcaseCard theme={theme} label="Toggle & Toggle Group">
        <Stack gap={16} align="center">
          <Toggle theme={theme} pressed={togglePressed} onPress={setTogglePressed}>SLA alerts</Toggle>
          <ToggleGroup theme={theme} options={["15m", "1h", "4h", "1d"]} value={toggleGroupVal} onChange={setToggleGroupVal} />
        </Stack>
      </ShowcaseCard>

      <ShowcaseCard theme={theme} label="Choicebox">
        <div style={{ width: 340 }}>
          <Choicebox theme={theme} value={orderType} onChange={setOrderType}
            options={[
              { id: "auto",    title: "Auto-reply",    description: "Send the reply as soon as it matches a known issue.", meta: "instant" },
              { id: "confirm", title: "Confirm first", description: "Draft the reply and wait for your approval.", meta: "review" },
              { id: "batch",   title: "Batch",         description: "Bundle replies into a digest every 30 minutes.", meta: "30m" },
            ]} />
        </div>
      </ShowcaseCard>

      <ShowcaseCard theme={theme} label="Chips" height={240} align="top">
        <Stack gap={20} style={{ width: 520 }}>
          {row("Toggle", (
            <Stack gap={8} direction="row" wrap align="center">
              {["Open", "Waiting", "Escalated", "Resolved", "Snoozed"].map(c => (
                <Chip key={c} theme={theme} selected={chips.has(c)} onToggle={() => toggleChip(c)}>{c}</Chip>
              ))}
            </Stack>
          ))}
          {row("Dismissible", <DismissibleChipsDemo theme={theme} />)}
        </Stack>
      </ShowcaseCard>

      <ShowcaseCard theme={theme} label="Date Picker" height={480} align="top">
        {/* The calendar stays open under the input. The picker's own popover
            lands on the same spot, so either surface selects the date. */}
        <div style={{ width: 260 }}>
          <DatePicker theme={theme} label="Renewal date" value={date} onChange={setDate} />
          <div style={{ marginTop: 4 }}>
            <Calendar theme={theme} value={date} onChange={setDate} />
          </div>
        </div>
      </ShowcaseCard>

      <ShowcaseCard theme={theme} label="Rating">
        <Rating theme={theme} value={rating} onChange={setRating} size={22} />
      </ShowcaseCard>
    </Stack>
  );
}

// Dev surfaces: the framing components coding agents live inside.
function DemoDevSurfaces({ theme }) {
  const pal = usePal(theme);
  return (
    <Stack gap={24}>
      <ShowcaseCard theme={theme} label="Snippet">
        <div style={{ width: 340 }}>
          <Snippet theme={theme} text="alpha deploy --workflow triage --dry-run" />
        </div>
      </ShowcaseCard>

      <ShowcaseCard theme={theme} label="File Tree" align="top">
        <div style={{ width: 300, paddingTop: 8 }}>
          <FileTree theme={theme} data={[
            {
              name: "workflows", children: [
                { name: "triage.config.ts", badge: "editing" },
                { name: "escalation.config.ts" },
                { name: "sla.rules.ts" },
              ],
            },
            {
              name: "releases", defaultOpen: false, children: [
                { name: "release-notes.md" },
                { name: "onboarding-email.ts" },
              ],
            },
            { name: "alpha.config.ts" },
            { name: "README.md" },
          ]} />
        </div>
      </ShowcaseCard>

      <ShowcaseCard theme={theme} label="Browser Frame">
        <div style={{ width: 400, maxWidth: "100%" }}>
          <BrowserFrame theme={theme} url="alpha.northwind.app/dashboard">
            <Stack gap={12}>
              <Stack direction="row" gap={24}>
                <Stat theme={theme} label="MRR" value="$142.8k" change="+8.2%" />
                <Stat theme={theme} label="Resolved by Alpha" value="72%" change="+3.1%" />
              </Stack>
              <Text size="xs" theme={theme} style={{ color: pal.textTertiary }}>
                The page Alpha is building, framed for previews and demos.
              </Text>
            </Stack>
          </BrowserFrame>
        </div>
      </ShowcaseCard>
    </Stack>
  );
}

// ─── PATTERNS ────────────────────────────────────────────────

const FAKE_WALLET = { address: "northwind.app", name: "Alpha" };

const WIZARD_STEPS = ["Identity", "Job", "Autonomy", "Budget", "Tools", "Safety", "Review"];

const AGENT_VISUALS = ["◆", "✦", "◉", "▲", "⬡", "◈", "⚡", "☾"];

const STRATEGY_OPTIONS = [
  { id: "triage",   icon: "✉", title: "Support triage", subtitle: "Reply, tag, and route incoming tickets" },
  { id: "release",  icon: "⊕", title: "Release notes",  subtitle: "Draft the changelog from merged pull requests" },
  { id: "renewals", icon: "↻", title: "Renewals",       subtitle: "Flag churn risk and draft check-ins before renewal" },
  { id: "research", icon: "≋", title: "Research",       subtitle: "Summarize customer calls and product analytics" },
];

const RISK_TIERS = [
  { id: "conservative", label: "Supervised", drawdown: 10, weight: 0.5 },
  { id: "moderate",     label: "Balanced",   drawdown: 40, weight: 1   },
  { id: "aggressive",   label: "Autonomous", drawdown: 85, weight: 1.6 },
];

const PAIR_OPTIONS = [
  { value: "All customers", label: "All customers" },
  { value: "Enterprise",    label: "Enterprise" },
  { value: "Intercom",      label: "Intercom" },
  { value: "Linear",        label: "Linear" },
  { value: "GitHub",        label: "GitHub" },
  { value: "Slack",         label: "Slack" },
  { value: "HubSpot",       label: "HubSpot" },
  { value: "Stripe",        label: "Stripe" },
];

const ALLOWED_PAIR_CHIPS = ["Intercom", "Linear", "GitHub", "Slack", "HubSpot", "Stripe"];

// Registry for the UX Patterns section: organised by the agent lifecycle:
// converse → trust → control (consent · visibility · accountability) →
// output → ambient. Numbering is derived from position, so inserting a
// pattern renumbers everything after it automatically. Components are
// referenced by name (function declarations hoist).
const PATTERN_GROUPS = [
  {
    id: "grp-conversation",
    title: "Conversation core",
    blurb: "The baseline chat surface. Every AI product ships these, so the play here is craft, not coverage.",
    patterns: [
      { id: "pat-prompt-input",   title: "Prompt input",     desc: "The composer: attachments, model pill, and a stop-while-streaming state.", component: "PromptInputPattern",                   height: 380 },
      { id: "pat-message",        title: "Message thread",   desc: "User and assistant turns with hover actions and response branches.",        component: "MessageThreadPattern",                 height: 420 },
      { id: "pat-streaming",      title: "Streaming answer", desc: "Streamed reply with inline sources and follow-ups.",                        component: "StreamingAnswerPattern", replay: true, height: 580 },
      { id: "pat-chat",           title: "Agent chat",       desc: "Chat panel with reasoning chips and a composer.",                           component: "AgentChatPattern",       replay: true, height: 640 },
      { id: "pat-code",           title: "Code block",       desc: "Agent-written code streaming in line by line with syntax tint.",            component: "CodeBlockPattern",       replay: true, height: 460 },
      { id: "pat-model-context",  title: "Model & context",  desc: "Model picker with capability badges and a live context-window meter.",      component: "ModelContextPattern",                  height: 480 },
    ],
  },
  {
    id: "grp-trust",
    title: "Trust & transparency",
    blurb: "Why the user should believe the output: reasoning made visible, sources attached, confidence stated honestly.",
    patterns: [
      { id: "pat-thinking",       title: "Thinking",         desc: "Expandable reasoning trace while the agent works.",                         component: "ThinkingTracePattern",   replay: true, height: 460 },
      { id: "pat-citations",      title: "Inline citations", desc: "Numbered source chips with an anchored popover pager.",                     component: "CitationsPattern",                     height: 480 },
      { id: "pat-context",        title: "Context sources",  desc: "Retrieved knowledge chunks with their sources.",                            component: "ContextSourcesPattern",                height: 500 },
      { id: "pat-confidence",     title: "Confidence states", desc: "One claim rendered at three confidence levels. Low is a designed state.", component: "ConfidencePattern",                    height: 520 },
      { id: "pat-recommendation", title: "Recommendation",   desc: "Agent suggestion with confidence and clear actions.",                       component: "RecommendationPattern",  replay: true, height: 580 },
      { id: "pat-feedback",       title: "Feedback capture", desc: "Thumbs with a structured follow-up on negative.",                           component: "FeedbackPattern",                      height: 480 },
    ],
  },
  {
    id: "grp-control",
    title: "Agentic control",
    blurb: "The delegation lifecycle: consent before the agent acts, visibility while it works, accountability after. Intervention points that don't look like errors.",
    patterns: [
      { id: "pat-plan",           title: "Plan preview",     desc: "The agent states its plan in plain language. Proceed, edit, or take over.", component: "PlanPreviewPattern",    replay: true, height: 540 },
      { id: "pat-approval",       title: "Approval card",    desc: "Human-in-the-loop question before the agent acts.",                         component: "ApprovalCardPattern",    replay: true, height: 540 },
      { id: "pat-autonomy",       title: "Autonomy levels",  desc: "Per-task dial for how much the agent may do, observe through autonomous.",  component: "AutonomyPattern",                      height: 620 },
      { id: "pat-permissions",    title: "Permission scope", desc: "Tools, data, and limits the agent can touch, summarised in plain language.", component: "PermissionScopePattern",             height: 740 },
      { id: "pat-queue",          title: "Task queue",       desc: "What the agent will work through. Reorder, remove, watch it clear.",       component: "QueuePattern",           replay: true, height: 560 },
      { id: "pat-status",         title: "Agent status",     desc: "Live status pill with rolling phases, a stop control, and a mid-run redirect.",      component: "AgentStatusPattern",     replay: true, height: 340 },
      { id: "pat-tools",          title: "Tool calls",       desc: "Edits, commands, and reads as a compact activity feed.",                    component: "ToolStreamPattern",      replay: true, height: 600 },
      { id: "pat-tasks",          title: "Task rows",        desc: "Live agent task status: running, failed, completed.",                      component: "AgentTasksPattern",      replay: true, height: 600 },
      { id: "pat-handoff",        title: "Handoff",          desc: "The agent escalates to a human with prepared context. Calm, not a failure.", component: "HandoffPattern",       replay: true, height: 480 },
      { id: "pat-receipt",        title: "Action receipt",   desc: "Evidence of what changed, under whose authority, with a time-limited undo.", component: "ActionReceiptPattern", replay: true, height: 500 },
      { id: "pat-checkpoints",    title: "Checkpoints",      desc: "Named restore points. Confirm inline and roll back with re-verification.", component: "CheckpointPattern",      replay: true, height: 460 },
      { id: "pat-audit",          title: "Audit log",        desc: "The filterable record of agent actions, with inline receipts.",             component: "AuditLogPattern",                      height: 620 },
      { id: "pat-error-repair",   title: "Error repair",     desc: "The structured mistake: acknowledge, show the fix, offer recourse.",       component: "ErrorRepairPattern",     replay: true, height: 500 },
    ],
  },
  {
    id: "grp-output",
    title: "Output & generative UI",
    blurb: "Where responses stop being text: proposed edits, structured objects, artifacts, and charts.",
    patterns: [
      { id: "pat-artifact",       title: "Artifact",         desc: "Generated content in a versioned container with preview and raw views.",    component: "ArtifactPattern",                      height: 540 },
      { id: "pat-diff-view",      title: "Diff view",        desc: "Proposed code edits side by side with per-hunk accept and reject.",    component: "DiffViewPattern",        replay: true, height: 560 },
      { id: "pat-diff",           title: "Diff table",       desc: "AI-proposed edits sweeping through tabular data.",                          component: "DiffTablePattern",       replay: true, height: 540 },
      { id: "pat-structured",     title: "Structured data",  desc: "Schema output rendered as a readable card, raw JSON one toggle away.",      component: "StructuredDataPattern",                height: 520 },
      { id: "pat-insights",       title: "Insight cards",    desc: "Paged agent insights with live charts.",                                    component: "InsightCardsPattern",                  height: 620 },
      { id: "pat-comparison",     title: "Comparison",       desc: "Two models stream the same prompt side by side. Pick a winner.",           component: "ComparisonPattern",      replay: true, height: 500 },
    ],
  },
  {
    id: "grp-ambient",
    title: "Ambient & beyond chat",
    blurb: "The agent outside the thread: boards, nudges, digests, and inline assists that don't make you scroll a transcript to reconstruct state.",
    patterns: [
      { id: "pat-taskboard",      title: "Taskboard",        desc: "The board is primary, chat is secondary. Work moves when decisions are needed.", component: "TaskboardPattern", replay: true, height: 440 },
      { id: "pat-inline-assist",  title: "Inline assist",    desc: "Ghost-text completions. Accept, dismiss, and watch the agent adapt.",      component: "InlineAssistPattern",    replay: true, height: 380 },
      { id: "pat-nudge",          title: "Nudge",            desc: "A proactive, non-blocking suggestion with a real escape hatch.",            component: "NudgePattern",           replay: true, height: 320 },
      { id: "pat-digest",         title: "Digest",           desc: "While-you-were-away summary with rationale and receipts per action.",       component: "DigestPattern",                        height: 560 },
      { id: "pat-notifications",  title: "Notification center", desc: "The classic panel: agent events with severity, read state, and actions.", component: "NotificationCenterPattern",          height: 560 },
      { id: "pat-search",         title: "Command search",   desc: "Command palette with live filtering and an empty state.",                   component: "CommandSearchPattern",                 height: 540 },
      { id: "pat-agent-setup",    title: "Agent setup",      desc: "Full multi-step setup flow with live preview.",                             component: "AgentSetupPattern",                    height: 760, align: "top" },
    ],
  },
];

// Flat list with derived continuous numbering (01, 02, …) across groups.
const UX_PATTERNS = PATTERN_GROUPS.flatMap(g => g.patterns);
UX_PATTERNS.forEach((p, i) => { p.n = String(i + 1).padStart(2, "0"); });

// The two UX paradigms the pattern groups sit under. Agentic control
// spans both: consent and accountability matter wherever the agent acts.
const UX_PARADIGMS = [
  {
    id: "chat", title: "Chat",
    body: "The thread is the product. You talk to the agent; it thinks, answers, asks, and acts in the flow of the conversation.",
    groups: ["grp-conversation", "grp-trust", "grp-control"],
    example: "ChatParadigmExample",
  },
  {
    id: "canvas", title: "Canvas",
    body: "The agent works on something outside the thread: a document, a board, a diff, a screen. Chat becomes the secondary channel.",
    groups: ["grp-output", "grp-ambient", "grp-control"],
    example: "CanvasParadigmExample",
  },
];

const PATTERN_ROADMAP = [
  { id: "canvas",   icon: "⬡", title: "Workflow canvas",       desc: "Node-and-edge view of multi-agent pipelines" },
  { id: "voice",    icon: "◉", title: "Voice input",           desc: "Push-to-talk capture with live transcription states" },
  { id: "preview",  icon: "⧉", title: "Live preview",          desc: "Embedded view of what the agent is building" },
  { id: "terminal", icon: "▤", title: "Terminal output",       desc: "Streamed command output for coding agents" },
  { id: "memory",   icon: "☰", title: "Agent memory",          desc: "What the agent knows about you, editable and revocable" },
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
                  {strategyObj.title}{hasRisk && ` · ${riskObj.label} tier`}
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

        {/* Budget row */}
        {hasCapital && (
          <div key={`cap-${budgetNum}-${state.allocPct}`} style={fadeIn}>
            <Divider theme={theme} />
            <div style={{ height: 12 }} />
            <Stack direction="row" gap={32}>
              <Stat theme={theme} label="Budget" value={`$${budgetNum.toLocaleString()} · ${state.basePair}`} />
              <Stat theme={theme} label="Auto-approve" value={`${state.allocPct}%`} />
            </Stack>
          </div>
        )}

        {/* Tools row */}
        {hasMarkets && (
          <div key={`pairs-${state.allowedPairs.join(",")}`} style={fadeIn}>
            <Stack gap={6}>
              <Caption theme={theme}>Tools</Caption>
              <Stack direction="row" gap={6} wrap>
                {state.allowedPairs.length === 0 ? (
                  <Text size="xs" theme={theme} style={{ color: pal.textTertiary }}>None selected</Text>
                ) : state.allowedPairs.map(p => (
                  <Tag key={p} theme={theme}>{p} · {state.basePair}</Tag>
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
                {state.stopLoss   && <StatusBadge theme={theme} status="online">Escalation</StatusBadge>}
                {state.takeProfit && <StatusBadge theme={theme} status="online">Human handoff</StatusBadge>}
                {!state.stopLoss && !state.takeProfit && (
                  <Text size="xs" theme={theme} style={{ color: pal.textTertiary }}>No escalation rules</Text>
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
    basePair: "All customers",
    allowedPairs: ["Intercom", "Linear"],
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
    !!state.strategy,                      // 1 Job
    true,                                  // 2 Autonomy (has default)
    budgetNum > 0,                         // 3 Budget
    state.allowedPairs.length > 0,         // 4 Tools
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
        placeholder="Alpha"
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
      <Label theme={theme}>Choose a job</Label>
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
      <Label theme={theme}>Autonomy tier</Label>
      <SegmentedControl theme={theme}
        options={RISK_TIERS.map(r => r.label)}
        value={riskObj?.label || "Balanced"}
        onChange={(label) => set({ risk: RISK_TIERS.find(r => r.label === label).id })}
      />
      <Caption theme={theme}>Resolves ≈ {riskObj?.drawdown}% of tickets without asking · the rest wait for you.</Caption>
    </Stack>
  );

  const StepCapital = () => (
    <Stack gap={20}>
      <TextInput theme={theme}
        label="Refund cap"
        placeholder="2,500"
        icon="$"
        value={state.budgetUsdc}
        onChange={(v) => set({ budgetUsdc: v.replace(/[^0-9.,]/g, "") })}
        caption="The most Alpha can refund or credit each month without you. Change it any time."
      />
      <SpringSlider theme={theme}
        label={`Auto-approve up to ${state.allocPct}% of the cap per refund`}
        value={state.allocPct} onChange={(v) => set({ allocPct: v })}
        min={0} max={100}
      />
      <Card theme={theme} padding={14}>
        <Stack gap={10}>
          <Stack direction="row" align="center" justify="space-between">
            <Text size="sm" weight="semibold" theme={theme}>Oversight score</Text>
            <Text size="sm" theme={theme} style={{ fontFamily: tokens.font.mono, color: pal.text }}>{confidenceScore}%</Text>
          </Stack>
          <ConfidenceBar value={confidenceScore} theme={theme} />
          <Caption theme={theme}>{confidenceScore >= 70 ? "Supervised posture: most actions wait for you." : confidenceScore >= 40 ? "Balanced posture: routine work runs, exceptions wait." : "Autonomous posture: Alpha acts first, reports after."}</Caption>
        </Stack>
      </Card>
    </Stack>
  );

  const StepMarkets = () => (
    <Stack gap={20}>
      <Combobox theme={theme} label="Customer segment"
        options={PAIR_OPTIONS.filter(o => ["All customers", "Enterprise"].includes(o.value))}
        value={state.basePair} onChange={(v) => set({ basePair: v })}
      />
      <Stack gap={8}>
        <Label theme={theme}>Connected tools</Label>
        <Stack direction="row" gap={8} wrap>
          {ALLOWED_PAIR_CHIPS.map(p => (
            <Chip key={p} theme={theme}
              selected={state.allowedPairs.includes(p)}
              onToggle={() => togglePair(p)}>{p} · {state.basePair}</Chip>
          ))}
        </Stack>
        <Caption theme={theme}>Alpha only acts inside these tools. Everything else stays read-only.</Caption>
      </Stack>
    </Stack>
  );

  const StepSafety = () => (
    <Stack gap={20}>
      <Label theme={theme}>Safety controls</Label>
      <Stack gap={12}>
        <SwitchToggle theme={theme} checked={state.stopLoss}   onChange={(v) => set({ stopLoss: v })}   label="Escalate angry or legal tickets to Dana" />
        <SwitchToggle theme={theme} checked={state.takeProfit} onChange={(v) => set({ takeProfit: v })} label="Hand off when a customer asks for a human" />
      </Stack>
      <Caption theme={theme}>Alpha hands off automatically when these rules fire.</Caption>
    </Stack>
  );

  const StepReview = () => (
    <Stack gap={16}>
      <Text size="sm" theme={theme} style={{ color: pal.textSecondary, lineHeight: 1.6 }}>
        Your agent is ready. Review the summary above and deploy when you're happy.
      </Text>
      <AlertBanner theme={theme} variant="warning"
        title="Alpha replies to real customers"
        description="You can pause or stop Alpha at any time from Agent Settings." />
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
          <Stat theme={theme} label="Job"      value={strategyObj?.title || "Not set"} />
          <Stat theme={theme} label="Budget"   value={`$${budgetNum.toLocaleString()} · ${state.basePair}`} />
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

// 01 · Thinking: elapsed trace that auto-collapses when done
const THINKING_TRACE_STEPS = [
  { label: "Reading 42 unread threads",  detail: "Intercom · 3 inboxes" },
  { label: "Matching senders to HubSpot", detail: "plan, owner, renewal date" },
  { label: "Checking the changelog",     detail: "last 2 releases, open issues" },
  { label: "Drafting replies",           detail: "workaround, tone, next step" },
];

/**
 * ThinkingTracePattern: elapsed thinking trace that auto-collapses when done.
 * @prop steps {{ label: string, detail?: string }[]} Reasoning steps, revealed one per `stepMs` (default: THINKING_TRACE_STEPS)
 * @prop stepMs {number} Milliseconds per step; total think time = steps.length × stepMs (default: 1100)
 * @prop thinkingLabel {string} Label shown while thinking (default: "Thinking")
 * @prop doneLabel {(seconds: number) => string} Header label once done (default: `Thought for ${seconds.toFixed(1)} seconds`)
 * @prop collapseDelayMs {number} Pause after done before the trace collapses (default: 1000)
 * @prop autoCollapse {boolean} Collapse the trace automatically after done (default: true)
 * @prop autoplay {boolean} Run the timed trace on mount; false renders the finished, collapsed state with no timers (default: true)
 * @prop defaultOpen {boolean} Initial expanded state of the trace (default: autoplay)
 * @prop onDone {(seconds: number) => void} Fires when thinking completes (autoplay only)
 * @prop onToggle {(open: boolean) => void} Fires when the trace expands/collapses, by user click or auto-collapse
 */
function ThinkingTracePattern({
  theme,
  steps = THINKING_TRACE_STEPS,
  stepMs = 1100,
  thinkingLabel = "Thinking",
  doneLabel = (seconds) => `Thought for ${seconds.toFixed(1)} seconds`,
  collapseDelayMs = 1000,
  autoCollapse = true,
  autoplay = true,
  defaultOpen = autoplay,
  onDone,
  onToggle,
}) {
  const pal = usePal(theme);
  const total = (steps.length * stepMs) / 1000;
  const [elapsed, setElapsed] = useState(autoplay ? 0 : total);
  const [stepIdx, setStepIdx] = useState(autoplay ? 0 : steps.length - 1);
  const [done, setDone] = useState(!autoplay);
  const [open, setOpen] = useState(defaultOpen);
  const [hover, setHover] = useState(false);
  const cbRef = useRef({ onDone, onToggle });
  cbRef.current = { onDone, onToggle };

  useEffect(() => {
    if (!autoplay) return;
    const t0 = Date.now();
    const stepSec = stepMs / 1000;
    let collapse;
    const iv = setInterval(() => {
      const dt = (Date.now() - t0) / 1000;
      setElapsed(dt);
      setStepIdx(Math.min(steps.length - 1, Math.floor(dt / stepSec)));
      if (dt >= total) {
        clearInterval(iv);
        setElapsed(total); setDone(true);
        cbRef.current.onDone?.(total);
        if (autoCollapse) {
          collapse = setTimeout(() => { setOpen(false); cbRef.current.onToggle?.(false); }, collapseDelayMs);
        }
      }
    }, 100);
    return () => { clearInterval(iv); clearTimeout(collapse); };
  }, [autoplay, steps.length, stepMs, total, autoCollapse, collapseDelayMs]);

  const toggle = () => {
    if (!done) return;
    const next = !open;
    setOpen(next);
    onToggle?.(next);
  };

  return (
    <div style={{ width: 400, maxWidth: "100%", fontFamily: tokens.font.sans }}>
      <button onClick={toggle}
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
            <Text size="sm" weight="medium" secondary theme={theme}>{doneLabel(elapsed)}</Text>
          </>
        ) : (
          <>
            <ThinkingIndicator label="" size="sm" theme={theme} />
            <Text size="sm" weight="medium" secondary theme={theme}>{thinkingLabel}</Text>
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
          {steps.map((s, i) => {
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
                  {i < steps.length - 1 && i < stepIdx && (
                    <span style={{ width: 1, flex: 1, background: pal.borderSubtle, marginTop: 4 }} />
                  )}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <Text size="sm" weight={active ? "medium" : "regular"} theme={theme}
                    style={{ color: active ? pal.text : pal.textSecondary, display: "block" }}>{s.label}</Text>
                  {s.detail && (
                    <Text size="xs" theme={theme} style={{ color: pal.textTertiary, fontFamily: tokens.font.mono }}>{s.detail}</Text>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// 02 · Streaming answer: inline source chip, sources row, follow-ups
const STREAM_ANSWERS = {
  default: {
    segments: [
      { t: "Acme is your busiest account this week: 14 new tickets, all about calendar sync, and none of them escalated yet." },
      { chip: "intercom.com" },
      { t: " The same three users opened all of them, so this is one workflow breaking, not a wider outage." },
    ],
    followups: ["Which accounts drove the last three spikes?", "Is Acme's renewal at risk?"],
  },
  followup: {
    segments: [
      { t: "Acme renews in 19 days and their usage is down 40% since the sync issue started." },
      { chip: "stripe.com" },
      { t: " That mix usually turns into a churn call rather than a renewal, so loop Dana in before the invoice goes out." },
    ],
    followups: ["Show Acme's usage over 30 days", "Draft a check-in note for Dana to send"],
  },
};

const STREAM_SOURCES = [
  { name: "Intercom",        domain: "intercom.com" },
  { name: "Stripe",          domain: "stripe.com" },
  { name: "Notion runbooks", domain: "notion.so" },
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

/**
 * StreamingAnswerPattern: the agent thinks, then streams an answer with inline source chips, a sources row and follow-up prompts.
 * @prop theme {"light" | "dark"} Palette override (defaults to ThemeProvider context)
 * @prop segments {({ t: string } | { chip: string })[]} The answer as text runs and inline source chips, in order; streaming restarts whenever it changes (default: the Acme ticket demo answer)
 * @prop sources {{ name: string, domain: string }[]} Sources row shown once streaming completes (default: STREAM_SOURCES)
 * @prop followups {string[]} Follow-up prompts listed under the answer (default: the demo follow-ups)
 * @prop thinkingLabel {string} Label beside the dots while thinking (default: "Checking the inbox")
 * @prop answerLabel {string} Caption that replaces the thinking indicator once streaming starts (default: "Answer")
 * @prop sourcesLabel {(n: number) => string} Caption above the sources row, given the source count (default: n => `${n} sources`)
 * @prop followupsLabel {string} Caption above the follow-up list (default: "Follow-ups")
 * @prop thinkMs {number} Thinking duration before the first character appears (default: 700)
 * @prop charsPerTick {number} Characters revealed per tick (default: 2)
 * @prop tickMs {number} Milliseconds between ticks (default: 18)
 * @prop autoplay {boolean} Think → stream on mount; false renders the finished answer immediately with no timers (default: true)
 * @prop onFollowup {(text: string) => void} Fires when a follow-up is clicked; the parent then swaps `segments`/`followups`. When omitted, the demo toggles to its built-in second answer
 * @prop onDone {() => void} Fires when streaming completes (not fired when autoplay is false)
 */
function StreamingAnswerPattern({
  theme,
  segments = STREAM_ANSWERS.default.segments,
  sources = STREAM_SOURCES,
  followups = STREAM_ANSWERS.default.followups,
  thinkingLabel = "Checking the inbox",
  answerLabel = "Answer",
  sourcesLabel = n => `${n} sources`,
  followupsLabel = "Follow-ups",
  thinkMs = 700,
  charsPerTick = 2,
  tickMs = 18,
  autoplay = true,
  onFollowup,
  onDone,
}) {
  const pal = usePal(theme);
  // Demo-only fallback: with no onFollowup, clicking a follow-up swaps to the built-in second answer and back.
  const [demoKey, setDemoKey] = useState(null); // null (props / default answer) | "followup"
  const activeSegments = demoKey ? STREAM_ANSWERS[demoKey].segments : segments;
  const activeFollowups = demoKey ? STREAM_ANSWERS[demoKey].followups : followups;
  const totalChars = activeSegments.reduce((n, s) => n + (s.t ? s.t.length : 0), 0);
  // Content fingerprint so streaming restarts when the answer changes, not when the array identity does.
  const segKey = activeSegments.map(s => (s.chip ? ` ${s.chip}` : s.t)).join("");
  const [count, setCount] = useState(autoplay ? 0 : totalChars);
  const [phase, setPhase] = useState(autoplay ? "thinking" : "done"); // thinking | streaming | done
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;

  useEffect(() => {
    if (!autoplay) { setCount(totalChars); setPhase("done"); return; }
    setCount(0); setPhase("thinking");
    let iv;
    const think = setTimeout(() => {
      setPhase("streaming");
      iv = setInterval(() => {
        setCount(c => {
          if (c + charsPerTick >= totalChars) { clearInterval(iv); setPhase("done"); return totalChars; }
          return c + charsPerTick;
        });
      }, tickMs);
    }, thinkMs);
    return () => { clearTimeout(think); clearInterval(iv); };
  }, [segKey, totalChars, autoplay, thinkMs, charsPerTick, tickMs]);

  useEffect(() => {
    if (phase === "done" && autoplay) onDoneRef.current?.();
  }, [phase, segKey]);

  const handleFollowup = (text) => {
    if (onFollowup) onFollowup(text);
    else setDemoKey(k => (k === "followup" ? null : "followup"));
  };

  // Render segments up to the current char count
  let used = 0;
  const rendered = activeSegments.map((s, i) => {
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
            ? <ThinkingIndicator label={thinkingLabel} size="sm" theme={theme} />
            : <Caption theme={theme}>{answerLabel}</Caption>}
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
              <Caption theme={theme}>{sourcesLabel(sources.length)}</Caption>
              <Stack direction="row" gap={8} wrap>
                {sources.map(s => (
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
              <Caption theme={theme}>{followupsLabel}</Caption>
              <Stack gap={6}>
                {activeFollowups.map(f => (
                  <FollowupRow key={f} label={f} theme={theme} onClick={() => handleFollowup(f)} />
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
// 03 · Approval card: the agent asks before acting
const APPROVAL_OPTIONS = [
  { id: "scale", title: "Reply now with a workaround", sub: "Unblocks Acme today, fix ships later" },
  { id: "now",   title: "Wait for the fix to ship",   sub: "Priya's patch lands Thursday" },
  { id: "wait",  title: "Escalate to Priya",          sub: "Loops engineering in on the thread" },
];

const APPROVAL_APPROVED_TEXT = (option) => `Approved · ${option.title.toLowerCase()}`;
const APPROVAL_SKIPPED_TEXT = "Skipped · nothing was changed";

/**
 * ApprovalCardPattern: the agent pauses and asks the user to pick a path before acting.
 * @prop theme {"light"|"dark"} Palette override (defaults to ThemeContext)
 * @prop eyebrow {string} Small caption beside the agent glyph (default: "Needs your call")
 * @prop badgeLabel {string} Status badge text while paused (default: "Paused")
 * @prop question {string} The question the agent is asking (default: "How should I reply to Acme's outage complaint?")
 * @prop options {{ id: string, title: string, sub?: string }[]} Radio-row choices (default: APPROVAL_OPTIONS)
 * @prop approveLabel {string} Primary button label (default: "Approve")
 * @prop skipLabel {string} Ghost button label (default: "Skip")
 * @prop approvedText {string | ((option) => string)} Headline of the approved state; a function receives the chosen option (default: `Approved · ${option.title}`)
 * @prop skippedText {string} Headline of the skipped state (default: "Skipped · nothing was changed")
 * @prop onSelect {(option) => void} Fires when a radio row is picked
 * @prop onApprove {(option) => void} Fires when Approve is clicked, with the chosen option
 * @prop onSkip {() => void} Fires when Skip is clicked
 */
function ApprovalCardPattern({
  theme,
  eyebrow = "Needs your call",
  badgeLabel = "Paused",
  question = "How should I reply to Acme's outage complaint?",
  options = APPROVAL_OPTIONS,
  approveLabel = "Approve",
  skipLabel = "Skip",
  approvedText = APPROVAL_APPROVED_TEXT,
  skippedText = APPROVAL_SKIPPED_TEXT,
  onSelect,
  onApprove,
  onSkip,
}) {
  const pal = usePal(theme);
  const [choice, setChoice] = useState(null);
  const [resolved, setResolved] = useState(null); // null | "approved" | "skipped"
  const chosen = options.find(o => o.id === choice);
  const resolveText = (t, o) => (typeof t === "function" ? t(o) : t);

  const select = (o) => { setChoice(o.id); onSelect?.(o); };
  const approve = () => { if (!chosen) return; setResolved("approved"); onApprove?.(chosen); };
  const skip = () => { setResolved("skipped"); onSkip?.(); };

  if (resolved === "approved") {
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
              <Text size="base" weight="semibold" theme={theme} style={{ display: "block" }}>{resolveText(approvedText, chosen)}</Text>
              <Text size="sm" secondary theme={theme}>The agent picked up where it left off.</Text>
            </div>
            <StatusBadge theme={theme} status="online" pulse>Resumed</StatusBadge>
          </Stack>
        </Card>
      </div>
    );
  }

  if (resolved === "skipped") {
    return (
      <div style={{ width: 420, maxWidth: "100%", animation: `halaska-scale-in 0.3s ${motion.easeOut} both` }}>
        <Card theme={theme} padding={20}>
          <Stack direction="row" gap={12} align="center">
            <span style={{
              width: 28, height: 28, borderRadius: 14, background: pal.bgSubtle,
              display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
            }}>
              <svg viewBox="0 0 12 12" width="12" height="12" fill="none" stroke={pal.textSecondary} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="6" x2="9" y2="6" style={{ strokeDasharray: 6, strokeDashoffset: 6, animation: `halaska-check-draw 0.3s ${motion.easeOut} 0.1s forwards` }} />
              </svg>
            </span>
            <div style={{ flex: 1 }}>
              <Text size="base" weight="semibold" theme={theme} style={{ display: "block" }}>{resolveText(skippedText, chosen)}</Text>
              <Text size="sm" secondary theme={theme}>The agent is holding until you decide.</Text>
            </div>
            <StatusBadge theme={theme} status="default">On hold</StatusBadge>
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
              <Caption theme={theme}>{eyebrow}</Caption>
            </div>
            <StatusBadge theme={theme} status="pending">{badgeLabel}</StatusBadge>
          </Stack>
          <Text size="md" weight="semibold" theme={theme}>{question}</Text>
          <Stack gap={8}>
            {options.map(o => {
              const active = choice === o.id;
              return (
                <button key={o.id} onClick={() => select(o)}
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
                    {o.sub && <Text size="sm" theme={theme} style={{ color: pal.textTertiary }}>{o.sub}</Text>}
                  </div>
                </button>
              );
            })}
          </Stack>
          <Stack direction="row" gap={8} justify="flex-end">
            <Button theme={theme} variant="ghost" size="sm" onClick={skip}>{skipLabel}</Button>
            <Button theme={theme} variant="accent" size="sm" disabled={!choice} onClick={approve}>{approveLabel}</Button>
          </Stack>
        </Stack>
      </Card>
    </div>
  );
}
// 04 · Tool calls: agent activity as a compact feed
const TOOL_EVENTS = [
  { kind: "thinking", lines: [
    "Three of the new threads describe the same login error, so they route to one Linear issue.",
    "Anything from an Enterprise account with a billing keyword goes to Dana first.",
  ]},
  { kind: "write", file: "triage.config.ts", meta: "Write · 204 lines", lines: [
    { sign: "+", code: 'const urgent = threads.filter(t => t.plan === "enterprise")' },
    { sign: "+", code: 'return route(urgent, { owner: "dana", sla: "4h" })' },
  ]},
  { kind: "run", cmd: "npm run check-sla", out: ["✓ built in 1.2s", "✓ 34 checks passed"] },
  { kind: "read", file: "acme-error.png", meta: "1280 × 720 · screenshot, Acme ticket #4821", note: "The error is the expired-session bug from last week's release." },
];

const TOOL_FILE_CHIPS = [
  { file: "triage.config.ts",     add: 74, del: 41 },
  { file: "sla.rules.ts",         add: 8,  del: 2 },
  { file: "escalation.config.ts", add: 13, del: 0 },
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

// 05 · Task rows: live agent task status
const AGENT_TASKS = [
  { title: "Verified customer records", meta: "12 accounts", status: "done",
    subs: [{ t: "Matched Intercom to HubSpot", v: "12/12" }, { t: "Flagged missing owners", v: "0" }] },
  { title: "Build the renewal follow-up list", meta: "7 accounts", status: "running",
    subs: [{ t: "Reading Stripe renewals export", v: "3 files" }, { t: "Scoring churn risk", v: "live" }] },
  { title: "Draft outage emails", meta: "2 messages", status: "failed",
    subs: [{ t: "Acme · service credit note", v: "draft" }, { t: "Fjord Health · status update", v: "draft" }] },
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

// 06 · Recommendation: suggestion with confidence and actions
const RECO_ALTERNATIVES = [
  { title: "Waive the overage fees instead", status: "pending", label: "Needs review" },
  { title: "Book a pricing call with Sam", status: "offline", label: "Last resort" },
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
            <Text size="sm" weight="semibold" theme={theme}>Renewal at risk</Text>
            <div style={{ marginLeft: "auto" }}><AISuggestionBadge theme={theme} /></div>
          </Stack>
          <Text size="md" theme={theme} as="p" style={{ margin: 0, lineHeight: 1.7 }}>
            Offer <Code theme={theme}>Acme</Code> a <Code theme={theme}>3-month</Code> credit before renewal on <Code theme={theme}>Oct 14</Code>, capped at <Code theme={theme}>$1,800</Code>.
          </Text>
          <Stack gap={8}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <Caption theme={theme}>Confidence</Caption>
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
                <Text size="base" weight="medium" theme={theme}>Queued for Dana to send</Text>
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

// 07 · Context sources: retrieved chunks with provenance
const CONTEXT_CHUNKS = [
  { title: "Credit policy rule", chars: "290 characters", kind: "PDF", src: "Runbook.pdf",
    body: "Credits up to $500 per account can go out without sign-off; anything above needs Sam's approval before Alpha sends it." },
  { title: "Usage export row", chars: "1,250 characters", kind: "CSV", src: "Usage export.csv",
    body: "Weekly active seats: Acme 38 → 23, Lumen Labs 41 → 44, Fjord Health 12 → 12. Accounts down 30% or more get a check-in draft." },
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

// 08 · Diff table: proposed edits with accept/reject
const DIFF_ROWS = [
  { pair: "Acme",          strategy: { v: "Enterprise" },                  alloc: { was: "Unassigned", v: "Dana" } },
  { pair: "Lumen Labs",    strategy: { was: "Starter", v: "Growth" },       alloc: { v: "Dana" } },
  { pair: "Fjord Health",  strategy: { v: "Growth" },                      alloc: { was: "Priya", v: "Dana" } },
  { pair: "Cobalt Dental", strategy: { v: "Starter" },                     alloc: { v: "Dana" }, added: true },
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
          <Text size="sm" weight="semibold" theme={theme}>Proposed record cleanup</Text>
          {applied
            ? <StatusBadge theme={theme} status="online">Applied</StatusBadge>
            : <Caption theme={theme}>3 edits · 1 addition</Caption>}
        </div>
        <div style={{ borderRadius: tokens.radius.md, border: `1px solid ${pal.borderSubtle}`, overflow: "hidden", transition: `border-color ${motion.smooth} ${motion.easeInOut}` }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: pal.bgSubtle, transition: `background ${motion.smooth} ${motion.easeInOut}` }}>
                {["Customer", "Plan", "Owner"].map(h => (
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

// · Command search: a condensed input that expands downward into suggestion chips
const COMMAND_ITEMS = [
  { icon: "✉", label: "New reply" },
  { icon: "◎", label: "Open Acme's account" },
  { icon: "⊕", label: "Draft release notes" },
  { icon: "✦", label: "Check SLA status" },
  { icon: "≋", label: "Summarize this week's tickets" },
];

function CommandSearchPattern({ theme }) {
  const pal = usePal(theme);
  const inputRef = useRef(null);
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);   // panel expands under the input while it has focus

  const needle = q.trim().toLowerCase();
  const match = (list) => list.filter(c => c.label.toLowerCase().includes(needle));
  const groups = [
    { label: "Suggested", items: match(COMMAND_ITEMS) },
    { label: "Recent", items: match(COMMAND_RECENT) },
  ].filter(g => g.items.length > 0);

  const close = () => { setOpen(false); inputRef.current?.blur(); };
  const pick = (label) => { setQ(label); close(); };

  return (
    <div style={{
      width: 440, maxWidth: "100%", fontFamily: tokens.font.sans,
      background: theme === "dark" ? "rgba(30,30,30,0.95)" : "rgba(255,255,255,0.95)",
      backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
      border: `1px solid ${pal.borderSubtle}`, borderRadius: tokens.radius.lg,
      boxShadow: `0 16px 48px ${pal.shadowLg}`, overflow: "hidden",
      transition: `all ${motion.smooth} ${motion.easeInOut}`,
    }}>
      {/* Condensed state: only this row is visible */}
      <div style={{
        display: "flex", alignItems: "center", gap: 10, padding: "14px 16px",
        borderBottom: `1px solid ${open ? pal.borderSubtle : "transparent"}`,
        transition: `border-color ${motion.smooth} ${motion.easeInOut}`,
      }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={pal.textTertiary} strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
          <circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" />
        </svg>
        <input ref={inputRef} value={q}
          onChange={(e) => { setQ(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          onClick={() => setOpen(true)}
          onBlur={() => setOpen(false)}
          onKeyDown={(e) => { if (e.key === "Escape") close(); }}
          placeholder="Ask the agent anything."
          style={{
            ...tokens.type.md, flex: 1, minWidth: 0, background: "transparent",
            border: "none", outline: "none", color: pal.text, fontFamily: tokens.font.sans,
          }} />
        <Kbd theme={theme}>⌘K</Kbd>
      </div>

      {/* Expanded state: suggestion chips grow downward under the input */}
      {open && (
        <div style={{ padding: "10px 16px 16px", animation: `halaska-step-in 0.3s ${motion.emphasized} both` }}>
          {groups.length > 0 ? groups.map((g, gi) => (
            <div key={g.label} style={{ marginTop: gi === 0 ? 0 : 12 }}>
              <Caption theme={theme} style={{ ...tokens.type.xs, textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: tokens.weight.medium }}>{g.label}</Caption>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 6 }}>
                {g.items.map(c => (
                  <CommandSearchChip key={c.label} icon={c.icon} label={c.label} theme={theme} onPick={() => pick(c.label)} />
                ))}
              </div>
            </div>
          )) : (
            <Caption theme={theme}>No matches for “{q.trim()}”. Try a customer, a ticket number, or ask in plain language.</Caption>
          )}
        </div>
      )}
    </div>
  );
}

// 10 · Insight cards: paged insights with a live chart
const INSIGHTS = [
  {
    text: <>Usage at <strong>Acme</strong> is falling fastest: down 6.2% this week, with $2,410 of MRR at risk.</>,
    stats: [{ label: "Acme", pct: "−6.2%", usd: "−$2,410", neg: true }, { label: "Brightline", pct: "−1.8%", usd: "−$540", neg: true }],
    data: [42, 44, 41, 39, 40, 36, 34, 33, 30, 31, 28, 26],
  },
  {
    text: <>Seat growth at <strong>Lumen Labs</strong> is accelerating: <strong>+9.4%</strong> this week, worth $3,120 in new MRR.</>,
    stats: [{ label: "Lumen Labs", pct: "+9.4%", usd: "+$3,120" }, { label: "Fjord Health", pct: "+4.1%", usd: "+$610" }],
    data: [20, 22, 21, 25, 24, 28, 30, 29, 33, 36, 38, 42],
  },
  {
    text: <>Refunds and credits cost <strong>0.8%</strong> of MRR last week, almost all of it outage credits.</>,
    stats: [{ label: "Outage credits", pct: "−0.6%", usd: "−$890", neg: true }, { label: "Goodwill refunds", pct: "−0.2%", usd: "−$260", neg: true }],
    data: [30, 28, 31, 27, 29, 25, 27, 24, 26, 23, 25, 22],
  },
];

function InsightCardsPattern({ theme }) {
  const pal = usePal(theme);
  const [page, setPage] = useState(1);
  const insight = INSIGHTS[page - 1];

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
            <Sparkline key={page} data={insight.data} width="100%" height={120} theme={theme} />
          </div>
          <Divider theme={theme} />
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
            <span style={{ whiteSpace: "nowrap", flexShrink: 0 }}>
              <LinkButton theme={theme} size="sm" iconRight="→">What should I do next?</LinkButton>
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

// 11 · Agent chat: reasoning chips, streamed reply, live composer
const CHAT_SEED = [
  { role: "user", text: "Compare this week's ticket spike to March" },
  { role: "agent", chip: "Pulled 90 days of Intercom threads · 4s", text: "This spike is bigger than March: 61 new tickets against 38, and 80% of them trace to one calendar sync bug." },
];
const CHAT_REPLIES = [
  { chip: "Cross-checked Linear and GitHub · 2s", text: "Engineering confirms it. Priya has the fix in review, so a workaround reply now should hold most accounts until it ships." },
  { chip: "Checked renewal dates in HubSpot · 3s", text: "Three affected accounts renew within 30 days. A $180 credit each keeps you well inside your $2,500 cap." },
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
  const [tab, setTab] = useState("Inbox");
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
        <SubtleTabs tabs={["Inbox", "Agents"]} value={tab} onChange={setTab} theme={theme} />
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
            placeholder="Ask about your customers…"
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

// · Prompt input: the composer: attachments, model pill, mic, stream-stop
const PROMPTIN_MODELS = [
  { id: "alpha-4-fast", label: "alpha-4 · fast", desc: "Quick replies, everyday triage",    tags: ["200K", "◇ vision"] },
  { id: "alpha-4",      label: "alpha-4 · deep", desc: "Slower, reasons through edge cases", tags: ["200K", "✦ reasoning"] },
  { id: "alpha-mini",   label: "alpha-mini",     desc: "Cheapest, fine for summaries",       tags: ["32K"] },
];

// Composer model pill: opens a menu above the pill (the composer sits at the
// bottom of a screen, so the menu drops upward).
function PromptinModelPill({ index, onSelect, theme }) {
  const pal = usePal(theme);
  const [hover, setHover] = useState(false);
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);
  useEffect(() => {
    if (!open) return;
    const onDown = (e) => { if (rootRef.current && !rootRef.current.contains(e.target)) setOpen(false); };
    const onKey = (e) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", onDown);
    window.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("mousedown", onDown); window.removeEventListener("keydown", onKey); };
  }, [open]);
  return (
    <div ref={rootRef} style={{ position: "relative", display: "inline-flex" }}>
      <button onClick={() => setOpen(o => !o)} aria-label="Change model" aria-haspopup="menu" aria-expanded={open}
        onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
        style={{
          ...interactiveBase, display: "inline-flex", alignItems: "center", gap: 6,
          padding: "4px 10px", borderRadius: tokens.radius.pill,
          background: open || hover ? pal.bgMuted : pal.bgSubtle,
          border: `1px solid ${open ? pal.border : pal.borderSubtle}`,
        }}>
        <span key={index} style={{
          ...tokens.type.xs, fontFamily: tokens.font.mono, color: pal.textSecondary, whiteSpace: "nowrap",
          animation: `halaska-tab-fade 0.25s ${motion.easeOut} both`,
        }}>{PROMPTIN_MODELS[index].label}</span>
        <ChevronIcon size={9} direction={open ? "down" : "up"} style={{ color: pal.textTertiary }} />
      </button>
      {open && (
        <div role="menu" style={{
          position: "absolute", bottom: "calc(100% + 6px)", left: 0, zIndex: 20, minWidth: 300,
          padding: 6, borderRadius: tokens.radius.md,
          background: theme === "dark" ? "rgba(30,30,30,0.96)" : "rgba(255,255,255,0.96)",
          backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)",
          border: `1px solid ${pal.borderSubtle}`, boxShadow: `0 12px 32px ${pal.shadowLg}`,
          animation: `halaska-scale-in ${motion.normal} ${motion.emphasized} both`, transformOrigin: "bottom left",
        }}>
          {PROMPTIN_MODELS.map((m, i) => (
            <PromptinModelOption key={m.id} model={m} active={i === index} theme={theme}
              onPick={() => { onSelect?.(i); setOpen(false); }} />
          ))}
        </div>
      )}
    </div>
  );
}

function PromptinModelOption({ model, active, onPick, theme }) {
  const pal = usePal(theme);
  const [hover, setHover] = useState(false);
  return (
    <button role="menuitemradio" aria-checked={active} onClick={onPick}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        ...interactiveBase, display: "flex", alignItems: "center", gap: 10, width: "100%",
        padding: "8px 10px", borderRadius: tokens.radius.sm, textAlign: "left",
        background: hover ? pal.bgSubtle : "transparent",
      }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ ...tokens.type.sm, fontFamily: tokens.font.mono, color: pal.text, whiteSpace: "nowrap" }}>{model.label}</span>
          {model.tags.map(t => (
            <span key={t} style={{ ...tokens.type.xxs, fontFamily: tokens.font.mono, color: pal.textTertiary, padding: "1px 6px", borderRadius: tokens.radius.pill, background: pal.bgSubtle, whiteSpace: "nowrap", flexShrink: 0 }}>{t}</span>
          ))}
        </div>
        <span style={{ ...tokens.type.xs, color: pal.textSecondary, display: "block", marginTop: 2 }}>{model.desc}</span>
      </div>
      <span style={{ width: 14, textAlign: "center", ...tokens.type.sm, color: active ? pal.accent : "transparent" }}>✓</span>
    </button>
  );
}

const PROMPTIN_SUGGESTIONS = [
  "What's open with Acme?",
  "Close tickets idle over 30 days",
  "Summarize overnight tickets",
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
          transition: `all ${motion.normal} ${motion.easeInOut}`,
          /* no overflow:hidden: the model menu drops out of the surface */
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
                <span style={{ ...tokens.type.xs, fontFamily: tokens.font.mono, color: pal.textSecondary }}>tickets.csv</span>
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
            placeholder="Ask Alpha about your inbox…"
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

            <PromptinModelPill index={modelIdx} onSelect={setModelIdx} theme={theme} />

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

// · Message thread: user turn + assistant turn with hover actions and branches
const MSGTHREAD_USER_MSG = "Should I refund Acme for Tuesday's outage or offer a credit?";

const MSGTHREAD_REPLIES = [
  "I'd offer a credit, not a refund. Acme was down for 3 hours and 12 minutes on Tuesday, still inside the 99.5% monthly uptime floor in their contract, so a refund isn't owed. A $180 credit on next month's invoice matches what you gave Fjord Health in June and stays under your approval cap. A refund also creates a Stripe reversal that Dana would have to explain on the renewal call.",
  "Yes, but split it. Issue a $180 credit now to close the ticket while it's fresh, and revisit a partial refund only if the calendar sync bug recurs before their renewal. You keep the account warm without setting a precedent for cash back on every incident.",
  "A refund costs roughly $420 plus a Stripe reversal fee. Offer a $180 credit instead: same goodwill, no cash out the door.",
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

// · Code block: agent-written TypeScript streaming in line by line
// Token colors: k = keyword (accent), s = string (success), c = comment (tertiary), p = plain
const CODEBLK_LINES = [
  [{ t: "// Route overdue tickets by severity and SLA tier", c: "c" }],
  [{ t: "import", c: "k" }, { t: " { getTickets, assign } ", c: "p" }, { t: "from", c: "k" }, { t: " ", c: "p" }, { t: '"./intercom"', c: "s" }, { t: ";", c: "p" }],
  [],
  [{ t: "const", c: "k" }, { t: " SLA_HOURS = { enterprise: 1, growth: 4, starter: 24 };", c: "p" }],
  [{ t: "export async function", c: "k" }, { t: " triage(inbox: ", c: "p" }, { t: "string", c: "k" }, { t: ") {", c: "p" }],
  [{ t: "  ", c: "p" }, { t: "const", c: "k" }, { t: " tickets = ", c: "p" }, { t: "await", c: "k" }, { t: " getTickets(inbox);", c: "p" }],
  [{ t: "  ", c: "p" }, { t: "const", c: "k" }, { t: " overdue = tickets.olderThan(SLA_HOURS);", c: "p" }],
  [{ t: "  ", c: "p" }, { t: "const", c: "k" }, { t: " urgent = overdue.filter(t => t.severity !== \"low\");", c: "p" }],
  [{ t: "  ", c: "p" }, { t: "return", c: "k" }, { t: " assign(urgent, { owner: ", c: "p" }, { t: '"dana"', c: "s" }, { t: " });", c: "p" }],
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
          <span style={{ ...tokens.type.sm, fontFamily: tokens.font.mono, color: pal.text, transition: `color ${motion.smooth} ${motion.easeInOut}` }}>triage.config.ts</span>
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

        {/* Footer: resolved state */}
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

// · Model & context: capability-aware model picker + context window meter
const MODELCTX_MODELS = [
  { id: "alpha-4",      name: "alpha-4",        note: "Best judgment, slower",  window: 200, caps: ["vision", "reasoning"] },
  { id: "alpha-4-fast", name: "alpha-4 · fast", note: "Low-latency replies",    window: 150, caps: ["vision"] },
  { id: "alpha-mini",   name: "alpha-mini",     note: "Cheap bulk triage",      window: 32,  caps: [] },
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

          {/* Meter: stacked usage segments, warning tint on overflow */}
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
                Conversation exceeds window. Older turns will be compacted.
              </Text>
            </div>
          )}
        </Stack>
      </div>
    </div>
  );
}

// ─── UX PATTERNS · Trust & transparency (new) ──────────────

// · Citations: numbered inline chips with an anchored source popover
const CITE_SOURCES = [
  { name: "Intercom · #4821", domain: "intercom.io",     tone: "accent",
    quote: "Our appointment reminders stopped going out on Monday. Nothing changed on our side." },
  { name: "Changelog · v2.14", domain: "northwind.app",  tone: "success",
    quote: "Reminder delivery now respects clinic time zones. Existing schedules were migrated on release." },
  { name: "Notion runbook",   domain: "notion.so",       tone: "warning",
    quote: "Migrated schedules need a manual re-save if the clinic had no time zone set before v2.14." },
];

const CITE_SEGMENTS = [
  { t: "Acme's appointment reminders stopped sending after the v2.14 release" },
  { cite: 0 },
  { t: ", and the release notes say schedules were migrated, so this is a settings gap, not a delivery bug" },
  { cite: 1 },
  { t: ". The runbook covers exactly this case" },
  { cite: 2 },
  { t: ", so reply with the re-save steps and offer to do it for them." },
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
        ...interactiveBase, display: "inline-flex", alignItems: "center", justifyContent: "center",
        minWidth: 18, padding: "1px 6px", margin: "0 2px", borderRadius: tokens.radius.pill,
        background: active ? pal.accentBg : hover ? pal.bgMuted : pal.bgSubtle,
        border: `1px solid ${active ? `${pal.accent}55` : pal.borderSubtle}`,
        ...tokens.type.xs, lineHeight: 1.4, fontFamily: tokens.font.sans,
        fontVariantNumeric: "tabular-nums",
        color: active ? pal.accentText : pal.textSecondary,
        verticalAlign: "super", position: "relative", top: -1,
      }}>
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

// · Confidence: one claim rendered at three confidence levels
const CONF_LEVELS = ["High", "Medium", "Low"];

const CONF_STATES = {
  High: {
    tone: "success",
    meta: "High confidence · 3 corroborating sources",
    segments: [
      { t: "Acme's churn risk rose because usage dropped 40% after the pricing change. Product analytics, Stripe and three Intercom threads all point the same way, and 9 of the last 10 accounts with a drop this size churned within 90 days." },
    ],
  },
  Medium: {
    tone: "warning",
    meta: "Medium confidence · 2 sources, 1 stale",
    segments: [
      { t: "Acme's churn risk " },
      { hedge: "appears" },
      { t: " to have risen because usage dropped ~40% after the pricing change. Stripe and the Intercom threads agree, but the analytics export is 40 minutes stale." },
    ],
  },
  Low: {
    tone: "danger",
    dim: true,
    banner: "Low confidence: treat as a hypothesis",
    meta: "Low confidence · 1 weak source",
    segments: [
      { t: "Acme's churn risk " },
      { hedge: "may" },
      { t: " have risen after the pricing change. The only signal is a usage export from 6 hours ago, and a holiday week would explain the drop just as well." },
    ],
  },
};

const CONF_MISSING = [
  "Product analytics from the last 6 hours",
  "A second source confirming the usage drop",
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
                    {verifying ? "Checking live data…" : "Verify with live data"}
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

// · Feedback: thumbs with a structured follow-up on negative
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
        Closed 14 stale tickets older than 30 days and sent each requester a short check-in. Two replied within the hour; both were already resolved on their side.
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
          <Text size="sm" secondary theme={theme}>Feedback recorded. Alpha will avoid this.</Text>
        </div>
      )}
    </div>
  );
}

// ─── UX PATTERNS · Agentic control: consent (new) ─────────

// ─── AGENTIC CONTROL · pre-action consent ─────────────────────
// Intervention points that must not look like errors: the agent
// states its plan, exposes its autonomy dial, scopes its
// permissions, and shows its queue: all on calm, neutral surfaces.

// · Plan preview: the agent states its plan in plain language before acting
const PLANPREV_STEPS = [
  "Close 14 stale tickets older than 30 days",
  "Reply to the 6 open Acme threads with the outage workaround",
  "Issue a $180 credit to Acme for the outage",
  "Open a Linear issue for the calendar sync bug",
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

/**
 * PlanPreviewPattern: the agent states its plan before acting.
 * @prop title {string} Card headline (default: "Alpha wants to clear the support backlog")
 * @prop subtitle {string} Line under the headline while reviewing (default: "Nothing runs until you say so.")
 * @prop steps {string[]} Plain-language steps, shown numbered; copied into state on mount so edits never mutate the prop
 * @prop badgeLabel {string} Status badge text in the review/edit phases (default: "Proposed")
 * @prop proceedLabel {string} Primary action label (default: "Proceed")
 * @prop editLabel {string} Secondary action label (default: "Edit plan")
 * @prop handoffLabel {string} Ghost action label that hands the plan back to the user (default: "I'll do it myself")
 * @prop lockLabel {string} Label of the button that locks an edited plan (default: "Lock plan")
 * @prop doneText {string | (count: number) => string} Footer text once every step has run; default renders "Done · N actions taken · view receipt"
 * @prop handoffText {string} Line shown after the user takes the plan over (default: "Plan handed off. Alpha is standing by.")
 * @prop stepDelayMs {number} Interval between steps checking off while executing (default: 700)
 * @prop onProceed {(steps: string[]) => void} Fires when Proceed is clicked, with the kept (possibly edited) steps
 * @prop onComplete {(steps: string[]) => void} Fires when the last kept step checks off
 * @prop onEdit {(steps: string[]) => void} Fires when the plan is locked after editing, with the kept steps
 * @prop onHandoff {() => void} Fires when the user chooses to do it themselves
 */
function PlanPreviewPattern({
  theme,
  title = "Alpha wants to clear the support backlog",
  subtitle = "Nothing runs until you say so.",
  steps = PLANPREV_STEPS,
  badgeLabel = "Proposed",
  proceedLabel = "Proceed",
  editLabel = "Edit plan",
  handoffLabel = "I'll do it myself",
  lockLabel = "Lock plan",
  doneText,
  handoffText = "Plan handed off. Alpha is standing by.",
  stepDelayMs = 700,
  onProceed,
  onComplete,
  onEdit,
  onHandoff,
}) {
  const pal = usePal(theme);
  const [items] = useState(() => steps.slice()); // prop-derived list, captured on mount
  const [phase, setPhase] = useState("review"); // review | edit | running | done | handoff
  const [removed, setRemoved] = useState([]);
  const [checkedCount, setCheckedCount] = useState(0);

  // Latest callbacks live in a ref so the run effect never re-arms on identity change
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  const activeIdx = items.map((_, i) => i).filter(i => !removed.includes(i));
  const activeSteps = activeIdx.map(i => items[i]);

  // Check the steps off one by one, then land on the receipt footer
  useEffect(() => {
    if (phase !== "running") return;
    const kept = items.filter((_, i) => !removed.includes(i));
    const total = kept.length;
    let n = 0;
    let finish;
    const iv = setInterval(() => {
      n += 1;
      setCheckedCount(n);
      if (n >= total) {
        clearInterval(iv);
        onCompleteRef.current?.(kept);
        finish = setTimeout(() => setPhase("done"), 800);
      }
    }, stepDelayMs);
    return () => { clearInterval(iv); clearTimeout(finish); };
  }, [phase, removed, items, stepDelayMs]);

  if (phase === "handoff") {
    return (
      <div style={{ width: 440, maxWidth: "100%", fontFamily: tokens.font.sans, animation: `halaska-scale-in 0.3s ${motion.easeOut} both` }}>
        <Stack direction="row" gap={10} align="center" style={{ padding: "12px 4px" }}>
          <AgentGlyph size={20} theme={theme} />
          <Text size="sm" secondary theme={theme} style={{ flex: 1 }}>{handoffText}</Text>
          <StatusBadge theme={theme} status="default">Standing by</StatusBadge>
        </Stack>
      </div>
    );
  }

  const resolvedDoneText = typeof doneText === "function" ? doneText(activeIdx.length) : doneText;

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
              {phase === "running" ? "Executing" : phase === "done" ? "Done" : badgeLabel}
            </StatusBadge>
          </Stack>

          <div>
            <Text size="md" weight="semibold" theme={theme} style={{ display: "block" }}>{title}</Text>
            <Text size="sm" theme={theme} style={{ color: pal.textTertiary }}>
              {phase === "edit" ? "Tap × to drop a step. Nothing runs until you lock it." : subtitle}
            </Text>
          </div>

          <Stack gap={2}>
            {items.map((label, i) => {
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
              <Button theme={theme} variant="ghost" size="sm" onClick={() => { onHandoff?.(); setPhase("handoff"); }}>{handoffLabel}</Button>
              <Button theme={theme} variant="secondary" size="sm" onClick={() => setPhase("edit")}>{editLabel}</Button>
              <Button theme={theme} variant="accent" size="sm" disabled={activeIdx.length === 0}
                onClick={() => { onProceed?.(activeSteps); setPhase("running"); }}>{proceedLabel}</Button>
            </Stack>
          )}
          {phase === "edit" && (
            <Stack direction="row" gap={8} justify="flex-end" align="center">
              <Caption theme={theme}>{activeIdx.length} of {items.length} steps kept</Caption>
              <Button theme={theme} variant="accent" size="sm" onClick={() => { onEdit?.(activeSteps); setPhase("review"); }}>{lockLabel}</Button>
            </Stack>
          )}
          {phase === "running" && (
            <Stack direction="row" gap={10} align="center" style={{ minHeight: 30 }}>
              <ThinkingIndicator label="" size="sm" theme={theme} />
              <Text size="sm" secondary theme={theme}>Executing · {checkedCount} of {activeIdx.length}</Text>
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
                {resolvedDoneText != null
                  ? resolvedDoneText
                  : <>Done · {activeIdx.length} actions taken · <span style={{ color: pal.accentText, cursor: "pointer" }}>view receipt</span></>}
              </Text>
            </Stack>
          )}
        </Stack>
      </Card>
    </div>
  );
}
// · Autonomy: per-task control over how much the agent may do
const AUTONOMY_LEVELS = [
  { id: "observe", title: "Observe", sub: "Watches, never acts", status: "default", badge: "Watching", pulse: false,
    caps: ["Reads tickets, issues, and product analytics", "Flags what needs you in the daily digest"] },
  { id: "suggest", title: "Suggest", sub: "Proposes, you send", status: "default", badge: "Suggest only", pulse: false,
    caps: ["Drafts replies, credits, and issue reports", "You send every reply yourself"] },
  { id: "confirm", title: "Confirm", sub: "Acts after your OK", status: "accent", badge: "Asks first", pulse: false,
    caps: ["Can reply to tickets, with confirmation", "Refund cap $500/day", "One tap approves, one dismisses"] },
  { id: "autonomous", title: "Autonomous", sub: "Acts, reports after", status: "online", badge: "Acting solo", pulse: true,
    caps: ["Replies, refunds, and files issues solo", "Refund cap $500/day still applies", "Receipt posted after every action"] },
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

// · Permission scope: tools, data, and limits the agent can touch
const PERMSCOPE_TOOLS = [
  { id: "orders",    label: "Intercom replies", sub: "Send and close support threads" },
  { id: "transfers", label: "Stripe refunds",   sub: "Move money back to a customer" },
  { id: "market",    label: "Linear issues",    sub: "File and update engineering tickets" },
];

const PERMSCOPE_DATA = [
  { id: "history", label: "Ticket history",   sub: "Threads, replies, CSAT scores" },
  { id: "exports", label: "Customer records", sub: "Plans, seats, and billing status from HubSpot" },
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
    ? `Alpha can reply in Intercom, with refunds capped at $${cap.toLocaleString()}/day.`
    : "Alpha can read tickets but can't reply.");
  if (!on.transfers) summaryParts.push("Stripe refunds stay off.");
  else if (transferMode === "every") summaryParts.push("Refunds need your approval every time.");
  else if (transferMode === "once") summaryParts.push("One refund approved, then it locks again.");
  else summaryParts.push("Refunds are on. Choose an approval rule.");
  const summary = summaryParts.join(" ");

  return (
    <div style={{ width: 460, maxWidth: "100%", fontFamily: tokens.font.sans }}>
      <Card theme={theme} padding={20}>
        <Stack gap={18}>
          <Stack direction="row" gap={10} align="center">
            <AgentGlyph size={24} theme={theme} />
            <div style={{ flex: 1 }}>
              <Text size="base" weight="semibold" theme={theme} style={{ display: "block" }}>What Alpha can touch</Text>
              <Text size="sm" theme={theme} style={{ color: pal.textTertiary }}>Scoped per agent · changes apply instantly</Text>
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
              <Text size="sm" theme={theme} style={{ color: pal.text }}>Refunds let Alpha send money back to customers. Require approval each time?</Text>
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
              <Text size="base" theme={theme}>Daily refund cap</Text>
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

// · Task queue: what the agent will work through, one task at a time
const QUEUE_ROW_H = 60;
const QUEUE_TASK_SECONDS = 4;
const QUEUE_TASKS = [
  { id: "q0", title: "Triage overnight tickets",         meta: "23 tickets · Intercom" },
  { id: "q1", title: "Follow up with Fjord Health",      meta: "2 replies · ~2 min" },
  { id: "q2", title: "Draft release notes for 2.4",      meta: "GitHub → changelog · ~4 min" },
  { id: "q3", title: "Refresh the churn-risk scan",      meta: "HubSpot · read-only" },
  { id: "q4", title: "Write the daily support summary",  meta: "report · no replies" },
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
            <Text size="base" weight="medium" theme={theme}>All caught up · {doneCount} tasks done</Text>
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

// ─── UX PATTERNS · Agentic control: visibility (new) ──────

// · Agent status: persistent "what is it doing" pill with stop + redirect
const AGENTSTATUS_MAIN_PHASES = [
  "Reading new threads…",
  "Matching to HubSpot…",
  "Drafting replies…",
];

const AGENTSTATUS_REDIRECT_PHASES = [
  "Re-planning…",
  "Working on your change…",
];

// Demo orb variant per phase index (the pill's Orb tracks what the agent is doing).
const AGENTSTATUS_MAIN_ORBS = ["orbit", "pulse", "sweep"];
const AGENTSTATUS_REDIRECT_ORBS = ["pulse", "sweep"];

function agentstatusClock(s) {
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}

// Accepts string[] or { label, orb }[]; strings pick up the demo orb at that index, then "pulse".
function agentstatusPhases(list, fallbackOrbs) {
  return (list || []).map((p, i) => typeof p === "string"
    ? { label: p, orb: fallbackOrbs[i] || "pulse" }
    : { label: p.label, orb: p.orb || fallbackOrbs[i] || "pulse" });
}

function agentstatusContextLabel(step, total) {
  return `Alpha · step ${step} of ${total}`;
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

/**
 * AgentStatusPattern: persistent "what is it doing" pill with stop + redirect.
 * @prop theme {"light" | "dark"} Palette override (defaults to ThemeContext)
 * @prop phases {(string | { label: string, orb?: "pulse" | "orbit" | "sweep" | "globe" | "spark" })[]} Main working phases, shown in order (default: AGENTSTATUS_MAIN_PHASES with orbit → globe → sweep orbs)
 * @prop redirectPhases {(string | { label: string, orb?: "pulse" | "orbit" | "sweep" | "globe" | "spark" })[]} Phases run after a redirect note is sent (default: AGENTSTATUS_REDIRECT_PHASES with globe → sweep orbs)
 * @prop waitingLabel {string} Pill text once the main cycle ends and the agent needs the user (default: "Waiting on you · 2 replies need a look")
 * @prop pausedLabel {string} Pill text while stopped (default: "Stopped · progress kept")
 * @prop doneLabel {string} Pill text once the redirect cycle finishes (default: "Done · replies redrafted to your note")
 * @prop phaseMs {number} Milliseconds per phase (default: 1800)
 * @prop contextLabel {string | ((step: number, total: number) => string)} Footer line under the pill (default: (step, total) => `Alpha · step ${step} of ${total}`)
 * @prop redirectPlaceholder {string} Placeholder for the redirect note input (default: "Tell Alpha what to do instead…")
 * @prop autoplay {boolean} Cycle phases on mount; false renders the waiting state immediately and a redirect jumps straight to done (default: true)
 * @prop onPause {() => void} Fires when the user stops the run (the control reads Stop)
 * @prop onResume {() => void} Fires when the user resumes
 * @prop onRedirect {(note: string) => void} Fires with the trimmed note when the user sends a redirect
 * @prop onWaiting {() => void} Fires when the main cycle ends and the agent needs the user
 * @prop onDone {() => void} Fires when the redirect cycle finishes
 */
function AgentStatusPattern({
  theme,
  phases = AGENTSTATUS_MAIN_PHASES,
  redirectPhases = AGENTSTATUS_REDIRECT_PHASES,
  waitingLabel = "Waiting on you · 2 replies need a look",
  pausedLabel = "Stopped · progress kept",
  doneLabel = "Done · replies redrafted to your note",
  phaseMs = 1800,
  contextLabel = agentstatusContextLabel,
  redirectPlaceholder = "Tell Alpha what to do instead…",
  autoplay = true,
  onPause, onResume, onRedirect, onWaiting, onDone,
}) {
  const pal = usePal(theme);
  const mainList = agentstatusPhases(phases, AGENTSTATUS_MAIN_ORBS);
  const redirectList = agentstatusPhases(redirectPhases, AGENTSTATUS_REDIRECT_ORBS);

  const [mode, setMode] = useState("main");        // main | redirect
  const [phaseIdx, setPhaseIdx] = useState(autoplay ? 0 : mainList.length); // index into the active phase list
  const [paused, setPaused] = useState(false);
  const [redirectOpen, setRedirectOpen] = useState(false);
  const [note, setNote] = useState("");
  const [elapsed, setElapsed] = useState(0);

  // Latest callbacks in a ref so the transition effects only depend on state.
  const cb = useRef({});
  cb.current = { onWaiting, onDone };

  const active = mode === "main" ? mainList : redirectList;
  const working = phaseIdx < active.length;
  const waiting = mode === "main" && !working;     // main cycle ended → needs approval
  const done = mode === "redirect" && !working;    // redirect cycle ended → finished

  // Advance one phase every ~1.8s while running (stop keeps the index)
  useEffect(() => {
    if (!autoplay || paused || phaseIdx >= active.length) return;
    const t = setTimeout(() => setPhaseIdx(i => i + 1), phaseMs);
    return () => clearTimeout(t);
  }, [autoplay, paused, mode, phaseIdx, active.length, phaseMs]);

  // Elapsed clock ticks only while actually working
  useEffect(() => {
    if (paused || !working) return;
    const iv = setInterval(() => setElapsed(e => e + 1), 1000);
    return () => clearInterval(iv);
  }, [paused, working]);

  useEffect(() => { if (waiting) cb.current.onWaiting?.(); }, [waiting]);
  useEffect(() => { if (done) cb.current.onDone?.(); }, [done]);

  const dot = done ? { color: pal.success, pulse: false }
    : paused ? { color: pal.textMuted, pulse: false }
    : waiting ? { color: pal.warning, pulse: false }
    : { color: pal.accent, pulse: true };

  const label = done ? doneLabel
    : paused ? pausedLabel
    : waiting ? waitingLabel
    : active[phaseIdx].label;

  // Stop keeps the phase index; Resume picks up where it left off (callback names are the API).
  const togglePause = () => {
    setPaused(p => !p);
    if (paused) onResume?.(); else onPause?.();
  };

  const sendRedirect = () => {
    const text = note.trim();
    if (!text) return;
    setMode("redirect"); setPhaseIdx(autoplay ? 0 : redirectList.length);
    setRedirectOpen(false); setNote(""); setPaused(false);
    onRedirect?.(text);
  };

  const step = Math.min(phaseIdx + 1, active.length);
  const context = typeof contextLabel === "function" ? contextLabel(step, active.length) : contextLabel;

  return (
    <div style={{ width: 460, maxWidth: "100%", fontFamily: tokens.font.sans }}>
      <Stack gap={10}>
        {/* Status row: the pill takes the flexible left area, the controls are docked right at a fixed width. */}
        <div style={{ display: "flex", gap: 8, alignItems: "center", animation: `halaska-step-in 0.4s ${motion.emphasized} both` }}>
          <div style={{
            display: "flex", alignItems: "center", gap: 10, padding: "9px 14px",
            borderRadius: tokens.radius.pill, background: pal.bgSubtle,
            border: `1px solid ${pal.borderSubtle}`, flex: 1, minWidth: 0,
            transition: `all ${motion.smooth} ${motion.easeInOut}`,
          }}>
            {working && !paused ? (
              // The orb variant tracks what the agent is actually doing.
              <Orb size={16} color={pal.accent} theme={theme}
                variant={active[phaseIdx].orb || "pulse"} />
            ) : waiting && !paused ? (
              <Orb size={16} variant="spark" color={pal.warning} theme={theme} />
            ) : (
              <AgentStatusDot color={dot.color} pulse={dot.pulse} />
            )}
            <span key={label} style={{
              ...tokens.type.sm, fontWeight: tokens.weight.medium, color: pal.text,
              flex: 1, minWidth: 0,
              whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
              animation: `halaska-tab-fade 0.25s ${motion.easeOut} both`,
              transition: `color ${motion.smooth} ${motion.easeInOut}`,
            }}>{label}</span>
          </div>
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 6,
            width: 62, flexShrink: 0, marginLeft: "auto",
          }}>
            {!done && (
              <>
                <IconButton theme={theme} size={28} style={{ minWidth: 28, flexShrink: 0 }}
                  icon={paused ? <AgentStatusResumeIcon /> : <AgentStatusStopIcon />}
                  label={paused ? "Resume" : "Stop"} onClick={togglePause} />
                <IconButton theme={theme} size={28} style={{ minWidth: 28, flexShrink: 0 }}
                  icon={<AgentStatusBranchIcon />} label="Redirect"
                  onClick={() => setRedirectOpen(o => !o)} />
              </>
            )}
          </div>
        </div>
        {redirectOpen && !done && (
          <div style={{ display: "flex", gap: 8, alignItems: "flex-start", animation: `halaska-step-in 0.35s ${motion.emphasized} both` }}>
            <TextInput theme={theme} size="sm" value={note} onChange={setNote}
              placeholder={redirectPlaceholder} style={{ flex: 1 }} />
            <Button theme={theme} variant="accent" size="sm" disabled={!note.trim()} onClick={sendRedirect}>Send</Button>
          </div>
        )}
        <div style={{
          display: "flex", gap: 6, alignItems: "baseline", paddingLeft: 14,
          animation: `halaska-step-in 0.4s ${motion.emphasized} 0.08s both`,
        }}>
          <Text size="xs" theme={theme} style={{ color: pal.textTertiary }}>
            {context}
          </Text>
          <Text size="xs" mono theme={theme} style={{ color: pal.textTertiary, fontVariantNumeric: "tabular-nums" }}>
            · {agentstatusClock(elapsed)} elapsed
          </Text>
        </div>
      </Stack>
    </div>
  );
}
// · Handoff: the agent escalates to a human with prepared context, calmly
const HANDOFF_CONTEXT_ROWS = [
  { label: "Customer",         value: "Acme · Enterprise" },
  { label: "Requested refund", value: "$3,900" },
  { label: "Risk if delayed",  value: "Renewal in 6 days" },
];

// Default resolved line keeps the refund amount in mono; pass a plain string to override.
const HANDOFF_RESUMED_TEXT = <>Done · refunded <span style={{ fontFamily: tokens.font.mono }}>$3,900</span> to Acme</>;

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

/**
 * HandoffPattern: the agent hits its autonomy cap and hands off to a human with context, as an escalation (accent rail), never an error.
 * @prop theme {"light" | "dark"} Palette override; falls back to ThemeContext
 * @prop workingLabel {string} ThinkingIndicator label while the agent is still working (default: "Reviewing Acme's refund request…")
 * @prop workingMs {number} How long the working beat lasts before the handoff card appears (default: 2000)
 * @prop headline {string} Handoff headline on the accent rail (default: "Alpha is handing this to you")
 * @prop reason {string} Because-line under the headline (default: "Refund exceeds your $2,500 approval cap")
 * @prop context {{ label: string, value: string }[]} Prepared context rows the human inherits (value renders mono)
 * @prop takeOverLabel {string} Primary action label (default: "Take over")
 * @prop resumeLabel {string} Secondary action label that raises the cap and lets the agent finish (default: "Raise cap to $5,000 & let Alpha finish")
 * @prop takenOverText {string} Confirmation line after Take over (default: "You have control. Alpha left notes in the thread.")
 * @prop resumingLabel {string} ThinkingIndicator label while the agent resumes (default: "Resuming with new cap…")
 * @prop resumedText {ReactNode} Resolved line after the agent finishes (default: "Done · refunded $3,900 to Acme", amount in mono)
 * @prop resumeMs {number} How long the resuming beat lasts before it resolves (default: 1500)
 * @prop autoplay {boolean} Play the working beat on mount; false shows the handoff card immediately (default: true)
 * @prop onTakeOver {() => void} Fires when the user clicks Take over
 * @prop onResume {() => void} Fires when the user clicks the raise-cap action
 * @prop onResumed {() => void} Fires when the resumed run resolves (after resumeMs)
 */
function HandoffPattern({
  theme,
  workingLabel = "Reviewing Acme's refund request…",
  workingMs = 2000,
  headline = "Alpha is handing this to you",
  reason = "Refund exceeds your $2,500 approval cap",
  context = HANDOFF_CONTEXT_ROWS,
  takeOverLabel = "Take over",
  resumeLabel = "Raise cap to $5,000 & let Alpha finish",
  takenOverText = "You have control. Alpha left notes in the thread.",
  resumingLabel = "Resuming with new cap…",
  resumedText = HANDOFF_RESUMED_TEXT,
  resumeMs = 1500,
  autoplay = true,
  onTakeOver,
  onResume,
  onResumed,
}) {
  const pal = usePal(theme);
  const [stage, setStage] = useState(autoplay ? "working" : "handoff"); // working | handoff | taken | raising | raised

  // Autoplay: agent works for ~2s, then hands off
  useEffect(() => {
    if (!autoplay) return;
    const t = setTimeout(() => setStage("handoff"), workingMs);
    return () => clearTimeout(t);
  }, []);

  // Raising the cap briefly resumes, then resolves
  useEffect(() => {
    if (stage !== "raising") return;
    const t = setTimeout(() => { setStage("raised"); onResumed?.(); }, resumeMs);
    return () => clearTimeout(t);
  }, [stage]);

  return (
    <div style={{ width: 440, maxWidth: "100%", fontFamily: tokens.font.sans }}>
      <Card theme={theme} padding={20}>
        {stage === "working" ? (
          <Stack direction="row" gap={12} align="center" style={{ minHeight: 28 }}>
            <AgentGlyph size={24} theme={theme} />
            <ThinkingIndicator label={workingLabel} size="sm" theme={theme} />
          </Stack>
        ) : (
          <div style={{ animation: `halaska-tab-fade 0.3s ${motion.easeOut} both` }}>
            <Stack gap={16}>
              <Stack direction="row" gap={10} align="center">
                <AgentGlyph size={24} theme={theme} />
                <div style={{ flex: 1 }}>
                  <Caption theme={theme}>Approval cap reached</Caption>
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
                <Text size="md" weight="semibold" theme={theme} style={{ display: "block" }}>{headline}</Text>
                <Text size="sm" secondary theme={theme}>{reason}</Text>
              </div>
              <div style={{
                borderRadius: tokens.radius.md, background: pal.bgSubtle,
                border: `1px solid ${pal.borderSubtle}`, padding: "4px 14px",
                transition: `all ${motion.smooth} ${motion.easeInOut}`,
              }}>
                {context.map((r, i) => (
                  <div key={r.label} style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    gap: 12, padding: "9px 0",
                    borderBottom: i < context.length - 1 ? `1px solid ${pal.borderSubtle}` : "none",
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
                    <Button theme={theme} variant="primary" size="sm" onClick={() => { setStage("taken"); onTakeOver?.(); }}>{takeOverLabel}</Button>
                    <Button theme={theme} variant="secondary" size="sm" onClick={() => { setStage("raising"); onResume?.(); }}>{resumeLabel}</Button>
                  </Stack>
                )}
                {stage === "taken" && (
                  <Stack direction="row" gap={10} align="center">
                    <HandoffCheckIcon color={pal.success} bg={pal.successBg} />
                    <Text size="sm" secondary theme={theme}>{takenOverText}</Text>
                  </Stack>
                )}
                {stage === "raising" && (
                  <div style={{ minHeight: 22, display: "flex", alignItems: "center" }}>
                    <ThinkingIndicator label={resumingLabel} size="sm" theme={theme} />
                  </div>
                )}
                {stage === "raised" && (
                  <Stack direction="row" gap={10} align="center">
                    <HandoffCheckIcon color={pal.success} bg={pal.successBg} />
                    <Text size="sm" weight="medium" theme={theme}>{resumedText}</Text>
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
// · Action receipt: evidence of what changed, with a time-limited undo
const RECEIPT_UNDO_SECONDS = 10;

const RECEIPT_META = [
  { label: "What",      value: "Issued a $180 credit to Acme" },
  { label: "Where",     value: "Stripe · Acme" },
  { label: "Authority", value: "Within your $500 refund cap, no approval needed" },
];

const RECEIPT_META_REVERSED = [
  { label: "What",      value: "Reversed the $180 credit to Acme" },
  { label: "Where",     value: "Stripe · Acme" },
  { label: "Net",       value: "−$180 · Acme's balance fully restored" },
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

function ReceiptBeforeAfter({ before, after, delta, deltaColor, unit, decimals = 0, label = "Acme credit", theme }) {
  const pal = usePal(theme);
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 10, padding: "10px 14px",
      borderRadius: tokens.radius.md, background: pal.bgSubtle,
      transition: `background ${motion.smooth} ${motion.easeInOut}`,
    }}>
      <span style={{ ...tokens.type.xs, color: pal.textTertiary, textTransform: "uppercase", letterSpacing: 0.5, fontFamily: tokens.font.sans, transition: `color ${motion.smooth} ${motion.easeInOut}` }}>{label}</span>
      <span style={{ ...tokens.type.sm, fontFamily: tokens.font.mono, color: pal.textTertiary, fontVariantNumeric: "tabular-nums", transition: `color ${motion.smooth} ${motion.easeInOut}` }}>{before.toFixed(decimals)}</span>
      <span style={{ ...tokens.type.sm, color: pal.textMuted, transition: `color ${motion.smooth} ${motion.easeInOut}` }}>→</span>
      <span style={{ ...tokens.type.sm, fontFamily: tokens.font.mono, fontWeight: tokens.weight.semibold, color: pal.text, fontVariantNumeric: "tabular-nums", transition: `color ${motion.smooth} ${motion.easeInOut}` }}>
        {after.toFixed(decimals)}{unit ? ` ${unit}` : ""}
      </span>
      <span style={{
        ...tokens.type.xs, fontFamily: tokens.font.mono, fontWeight: tokens.weight.medium,
        color: deltaColor, marginLeft: "auto", fontVariantNumeric: "tabular-nums",
        transition: `color ${motion.smooth} ${motion.easeInOut}`,
      }}>{delta}</span>
    </div>
  );
}

/**
 * ActionReceiptPattern: evidence of what the agent changed, with a time-limited undo.
 * @prop title {string} Headline while the action stands (default: "Credit issued")
 * @prop reversedTitle {string} Headline after undo (default: "Reversed")
 * @prop timestamp {string} Mono timestamp shown top-right (default: "14:32:07 UTC")
 * @prop reversedTimestamp {string} Timestamp shown after undo (default: "14:32:19 UTC")
 * @prop meta {{ label: string, value: string }[]} What / Where / Authority rows (default: RECEIPT_META)
 * @prop reversedMeta {{ label: string, value: string }[]} Rows shown after undo (default: RECEIPT_META_REVERSED)
 * @prop before {number} Credit balance before the action (default: 0)
 * @prop after {number} Credit balance after the action; counts up on mount (default: 180)
 * @prop unit {string} Unit suffix on the strip and delta (default: "USD")
 * @prop decimals {number} Decimal places for before/after/delta (default: 0)
 * @prop stripLabel {string} Label at the left of the before → after strip (default: "Acme credit")
 * @prop undoSeconds {number} Length of the undo window; drives the ring and countdown (default: 10)
 * @prop undoLabel {string} Undo button text (default: "Undo")
 * @prop expiredLabel {string} Caption once the window closes (default: "Undo window closed")
 * @prop reversedLabel {string} Caption after undo (default: "Reversal logged · nothing else was affected")
 * @prop auditLabel {string} Audit link text in the expired and reversed states (default: "View in audit log")
 * @prop autoplay {boolean} Run the countdown + count-up on mount; false renders the expired state with no timers (default: true)
 * @prop onUndo {() => void} Fires when the user clicks Undo inside the window
 * @prop onExpire {() => void} Fires when the undo window closes untouched
 * @prop onAudit {() => void} Fires when the user clicks the audit link
 */
function ActionReceiptPattern({
  theme,
  title = "Credit issued",
  reversedTitle = "Reversed",
  timestamp = "14:32:07 UTC",
  reversedTimestamp = "14:32:19 UTC",
  meta = RECEIPT_META,
  reversedMeta = RECEIPT_META_REVERSED,
  before = 0,
  after = 180,
  unit = "USD",
  decimals = 0,
  stripLabel = "Acme credit",
  undoSeconds = RECEIPT_UNDO_SECONDS,
  undoLabel = "Undo",
  expiredLabel = "Undo window closed",
  reversedLabel = "Reversal logged · nothing else was affected",
  auditLabel = "View in audit log",
  autoplay = true,
  onUndo,
  onExpire,
  onAudit,
}) {
  const pal = usePal(theme);
  const [phase, setPhase] = useState(autoplay ? "active" : "expired"); // active | expired | reversed
  const [secondsLeft, setSecondsLeft] = useState(autoplay ? undoSeconds : 0);
  const [afterVal, setAfterVal] = useState(autoplay ? before : after);
  const [undoHover, setUndoHover] = useState(false);
  const [linkHover, setLinkHover] = useState(false);
  const undoneRef = useRef(false);
  const onExpireRef = useRef(onExpire);
  onExpireRef.current = onExpire;

  // Countdown: ticks the undo window down, then quietly closes it
  useEffect(() => {
    if (!autoplay) return;
    const t0 = Date.now();
    const iv = setInterval(() => {
      if (undoneRef.current) { clearInterval(iv); return; }
      const left = Math.max(0, undoSeconds - (Date.now() - t0) / 1000);
      setSecondsLeft(left);
      if (left <= 0) { clearInterval(iv); setPhase("expired"); onExpireRef.current?.(); }
    }, 100);
    return () => clearInterval(iv);
  }, [autoplay, undoSeconds]);

  // Count-up: the "after" number settles into place on mount
  useEffect(() => {
    if (!autoplay) { setAfterVal(after); return; }
    let iv;
    const start = setTimeout(() => {
      const t0 = Date.now(); const dur = 900;
      iv = setInterval(() => {
        const t = Math.min(1, (Date.now() - t0) / dur);
        const eased = 1 - Math.pow(1 - t, 3);
        setAfterVal(before + (after - before) * eased);
        if (t >= 1) clearInterval(iv);
      }, 30);
    }, 350);
    return () => { clearTimeout(start); clearInterval(iv); };
  }, [autoplay, before, after]);

  const handleUndo = () => {
    if (phase !== "active") return;
    undoneRef.current = true;
    setPhase("reversed");
    onUndo?.();
  };

  // Signed delta string for the balance strip: "+180 USD" / "−180 USD"
  const receiptDelta = (from, to) => {
    const diff = to - from;
    return `${diff < 0 ? "−" : "+"}${Math.abs(diff).toFixed(decimals)}${unit ? ` ${unit}` : ""}`;
  };

  const reversed = phase === "reversed";
  const ringC = 2 * Math.PI * 5.5;
  const timeLabel = `0:${String(Math.ceil(secondsLeft)).padStart(2, "0")}`;

  return (
    <div style={{ width: 440, maxWidth: "100%", fontFamily: tokens.font.sans }}>
      <Card theme={theme} padding={20}>
        <Stack gap={16}>
          {/* Header: status dot, title, timestamp */}
          <div key={phase === "reversed" ? "rev" : "fwd"} style={{ display: "flex", alignItems: "center", gap: 10, animation: `halaska-step-in 0.4s ${motion.emphasized} both` }}>
            <span style={{ position: "relative", width: 8, height: 8, borderRadius: 4, background: reversed ? pal.textTertiary : pal.success, flexShrink: 0, transition: `background ${motion.smooth} ${motion.easeInOut}` }}>
              {!reversed && phase === "active" && (
                <span style={{ position: "absolute", inset: 0, borderRadius: 4, background: pal.success, animation: `halaska-live-pulse 1.4s ${motion.easeOut} infinite` }} />
              )}
            </span>
            <Text size="base" weight="semibold" theme={theme}>{reversed ? reversedTitle : title}</Text>
            <span style={{ ...tokens.type.xs, fontFamily: tokens.font.mono, color: pal.textTertiary, marginLeft: "auto", fontVariantNumeric: "tabular-nums", transition: `color ${motion.smooth} ${motion.easeInOut}` }}>
              {reversed ? reversedTimestamp : timestamp}
            </span>
          </div>

          {/* What / where / authority */}
          <Stack gap={8}>
            {(reversed ? reversedMeta : meta).map((r, i) => (
              <div key={`${reversed ? "r" : "f"}-${r.label}`} style={{ animation: `halaska-step-in 0.35s ${motion.emphasized} ${i * 0.06}s both` }}>
                <ReceiptMetaRow label={r.label} value={r.value} theme={theme} />
              </div>
            ))}
          </Stack>

          {/* Before → after strip */}
          {reversed ? (
            <div style={{ animation: `halaska-step-in 0.4s ${motion.emphasized} 0.15s both` }}>
              <ReceiptBeforeAfter before={after} after={before} delta={receiptDelta(after, before)} deltaColor={pal.textSecondary} unit={unit} decimals={decimals} label={stripLabel} theme={theme} />
            </div>
          ) : (
            <ReceiptBeforeAfter before={before} after={afterVal} delta={receiptDelta(before, after)} deltaColor={pal.success} unit={unit} decimals={decimals} label={stripLabel} theme={theme} />
          )}

          <Divider theme={theme} spacing={0} />

          {/* Footer: time-limited undo, then a quiet audit link */}
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
                    strokeDasharray={ringC} strokeDashoffset={ringC * (1 - secondsLeft / undoSeconds)}
                    transform="rotate(-90 7 7)" style={{ transition: "stroke-dashoffset 0.1s linear" }} />
                </svg>
                {undoLabel}
                <span style={{ fontFamily: tokens.font.mono, ...tokens.type.xs, color: pal.textSecondary, fontVariantNumeric: "tabular-nums" }}>{timeLabel}</span>
              </button>
              <Caption theme={theme}>Reversible for {undoSeconds} seconds</Caption>
            </div>
          )}
          {phase === "expired" && (
            <div style={{ display: "flex", alignItems: "center", gap: 12, animation: `halaska-fade-in 0.35s ${motion.easeOut} both` }}>
              <button onClick={() => onAudit?.()}
                onMouseEnter={() => setLinkHover(true)} onMouseLeave={() => setLinkHover(false)}
                style={{
                  ...interactiveBase, background: "transparent", padding: "4px 0",
                  ...tokens.type.sm, fontWeight: tokens.weight.medium,
                  color: linkHover ? pal.text : pal.textSecondary,
                  textDecoration: "underline", textUnderlineOffset: 3,
                  textDecorationColor: linkHover ? pal.textSecondary : pal.borderSubtle,
                }}>
                {auditLabel}
              </button>
              <Caption theme={theme}>{expiredLabel}</Caption>
            </div>
          )}
          {phase === "reversed" && (
            <div style={{ display: "flex", alignItems: "center", gap: 12, animation: `halaska-step-in 0.4s ${motion.emphasized} 0.25s both` }}>
              <button onClick={() => onAudit?.()}
                onMouseEnter={() => setLinkHover(true)} onMouseLeave={() => setLinkHover(false)}
                style={{
                  ...interactiveBase, background: "transparent", padding: "4px 0",
                  ...tokens.type.sm, fontWeight: tokens.weight.medium,
                  color: linkHover ? pal.text : pal.textSecondary,
                  textDecoration: "underline", textUnderlineOffset: 3,
                  textDecorationColor: linkHover ? pal.textSecondary : pal.borderSubtle,
                }}>
                {auditLabel}
              </button>
              <Caption theme={theme}>{reversedLabel}</Caption>
            </div>
          )}
        </Stack>
      </Card>
    </div>
  );
}

// · Checkpoints: named restore points in an agent session
const CKPT_ITEMS = [
  { id: "ckpt-1", name: "Before triage",      time: "13:58", delta: "42 open" },
  { id: "ckpt-2", name: "After Acme replies", time: "14:21", delta: "19 open" },
  { id: "ckpt-3", name: "Current",            time: "14:32", delta: "8 open" },
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

  // Restore: brief verification pass, then the target becomes Current
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
                  {/* Rail: dot and connecting line */}
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
                        <Caption theme={theme}>Restored · {reversedCount} action{reversedCount === 1 ? "" : "s"} reversed</Caption>
                      </div>
                    )}
                    {/* Inline confirm strip: neutral, not a modal */}
                    {confirmIdx === i && (
                      <div style={{
                        marginTop: 8, padding: "10px 12px", borderRadius: tokens.radius.md,
                        background: pal.bgSubtle, boxShadow: `inset 0 0 0 1px ${pal.borderSubtle}`,
                        animation: `halaska-step-in 0.35s ${motion.emphasized} both`,
                        transition: `all ${motion.smooth} ${motion.easeInOut}`,
                      }}>
                        <Text size="sm" secondary theme={theme} style={{ display: "block", marginBottom: 8 }}>
                          Roll back {currentIdx - i} action{currentIdx - i === 1 ? "" : "s"}? Alpha will re-check ticket states first.
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
            <ThinkingIndicator label="Verifying ticket states" size="sm" theme={theme} />
          </div>
        )}
      </Stack>
    </div>
  );
}

// · Audit log: the filterable record of what the agent did
const AUDITLOG_ROWS = [
  { id: "al-1", time: "14:32", title: "Issued a $180 credit to Acme",      status: "done",   authority: "Within $500 refund cap", detail: "Stripe · Acme · applied to the next invoice" },
  { id: "al-2", time: "14:21", title: "Closed 14 stale tickets",           status: "done",   authority: "Standing rule · no reply in 30 days", detail: "Intercom · 14 threads closed · reopen on reply" },
  { id: "al-3", time: "14:05", title: "Restored the Stripe payout notice", status: "review", authority: "Corrective action · mis-archived as a newsletter", detail: "Moved from Archive back to Sam's inbox" },
  { id: "al-4", time: "13:58", title: "Reassigned 6 tickets to Dana",      status: "done",   authority: "Within Enterprise routing policy", detail: "Intercom · billing keywords on Enterprise plans" },
  { id: "al-5", time: "13:44", title: "Raised Fjord Health's SLA tier",    status: "undone", authority: "Reversed by you at 13:51", detail: "First-response target returned to 4h" },
  { id: "al-6", time: "13:20", title: "Read new support threads",          status: "done",   authority: "Read-only · no approval required", detail: "Intercom · 31 threads · 3 tagged urgent" },
  { id: "al-7", time: "12:55", title: "Adjusted escalation thresholds",    status: "review", authority: "Touched escalation rules · flagged for you", detail: "Urgent tag on threads idle 2h → 1h" },
  { id: "al-8", time: "12:38", title: "Synced HubSpot accounts",           status: "done",   authority: "Read-only · no approval required", detail: "HubSpot + Stripe · 84 accounts matched" },
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
      {/* Inline detail: one row open at a time */}
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

// · Error repair: acknowledge, correct, offer recourse (no alarm)
const REPAIR_FIXES = [
  "Restored the notice to your inbox, unread",
  "Added Stripe to the never-archive sender list",
];

const REPAIR_DIFF = { label: "billing@stripe.com", before: "Newsletter", after: "Never archive" };

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

/**
 * ErrorRepairPattern: the agent owns a mistake in three calm beats: acknowledge, correct, offer recourse.
 * @prop theme {"light" | "dark"} Palette override (defaults to ThemeProvider context)
 * @prop headline {string} Plain-language admission (default: "Alpha got this one wrong")
 * @prop acknowledgment {string} One sentence on what went wrong, no blame (default: the archived-payout-notice line)
 * @prop fixesTitle {string} Eyebrow above the fix list (default: "What Alpha did about it")
 * @prop fixes {string[]} Corrective actions taken, each drawn in with a check (default: REPAIR_FIXES)
 * @prop diff {{ label: string, before: string, after: string } | null} Before/after line revealed by Review; null hides the Review button and the diff (default: REPAIR_DIFF)
 * @prop reviewLabel {string} Toggle-diff button label (default: "Review the fix")
 * @prop flagLabel {string} Escalation button label (default: "Flag for a human")
 * @prop footer {string} Quiet audit note under the actions; empty string hides it (default: "Logged to audit · nothing else was affected.")
 * @prop beatMs {number} Delay between the three beats when autoplaying (default: 1200)
 * @prop autoplay {boolean} Reveal beats on a timer; false shows all three at once, no timers (default: true)
 * @prop onReview {() => void} Fires when the user toggles the diff open or closed
 * @prop onFlag {() => void} Fires when the user asks for a human
 */
function ErrorRepairPattern({
  theme,
  headline = "Alpha got this one wrong",
  acknowledgment = "Alpha archived the Stripe payout notice as a newsletter. It matched the sender rule and never reached your inbox.",
  fixesTitle = "What Alpha did about it",
  fixes = REPAIR_FIXES,
  diff = REPAIR_DIFF,
  reviewLabel = "Review the fix",
  flagLabel = "Flag for a human",
  footer = "Logged to audit · nothing else was affected.",
  beatMs = 1200,
  autoplay = true,
  onReview,
  onFlag,
}) {
  const pal = usePal(theme);
  const [beat, setBeat] = useState(autoplay ? 1 : 3); // 1 acknowledge · 2 correction · 3 recourse
  const [diffOpen, setDiffOpen] = useState(false);

  useEffect(() => {
    if (!autoplay) return undefined;
    const iv = setInterval(() => {
      setBeat(b => {
        if (b >= 3) { clearInterval(iv); return b; }
        return b + 1;
      });
    }, beatMs);
    return () => clearInterval(iv);
  }, [autoplay, beatMs]);

  const handleReview = () => {
    setDiffOpen(o => !o);
    onReview?.();
  };

  return (
    <div style={{ width: 440, maxWidth: "100%", fontFamily: tokens.font.sans }}>
      <Card theme={theme} padding={20} style={{ position: "relative", overflow: "hidden" }}>
        {/* Warning-tinted rail: the only raised voice in the card */}
        <span style={{
          position: "absolute", left: 0, top: 18, bottom: 18, width: 3,
          borderRadius: 2, background: pal.warning,
          transition: `background ${motion.smooth} ${motion.easeInOut}`,
        }} />
        <Stack gap={16} style={{ paddingLeft: 10 }}>
          {/* Beat 1: acknowledge, plainly */}
          <div style={{ animation: `halaska-step-in 0.45s ${motion.emphasized} both` }}>
            <Stack direction="row" gap={10} align="center" style={{ marginBottom: 6 }}>
              <AgentGlyph size={24} theme={theme} />
              <Text size="md" weight="semibold" theme={theme}>{headline}</Text>
            </Stack>
            <Text size="sm" secondary theme={theme} style={{ display: "block", lineHeight: 1.6 }}>
              {acknowledgment}
            </Text>
          </div>

          {/* Beat 2: what was done about it */}
          {beat >= 2 && (
            <div style={{ animation: `halaska-step-in 0.45s ${motion.emphasized} both` }}>
              <Caption theme={theme} style={{ display: "block", marginBottom: 10, textTransform: "uppercase", letterSpacing: 0.5, ...tokens.type.xs, fontWeight: tokens.weight.medium }}>
                {fixesTitle}
              </Caption>
              <Stack gap={8}>
                {fixes.map((f, i) => (
                  <RepairCheckRow key={`${i}-${f}`} label={f} delay={i * 0.25} theme={theme} />
                ))}
              </Stack>
            </div>
          )}

          {/* Beat 3: recourse, quietly */}
          {beat >= 3 && (
            <div style={{ animation: `halaska-step-in 0.45s ${motion.emphasized} both` }}>
              <Divider theme={theme} spacing={0} />
              <div style={{ height: 14 }} />
              <Stack direction="row" gap={8} align="center">
                {diff && (
                  <Button theme={theme} variant="secondary" size="sm" onClick={handleReview}>{reviewLabel}</Button>
                )}
                <Button theme={theme} variant="ghost" size="sm" onClick={() => onFlag?.()}>{flagLabel}</Button>
              </Stack>
              {/* Before/after diff: expands on review */}
              {diff && (
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
                    <span style={{ color: pal.textTertiary, transition: `color ${motion.smooth} ${motion.easeInOut}` }}>{diff.label}</span>
                    <span style={{ color: pal.danger, textDecoration: "line-through", textDecorationColor: `${pal.danger}88`, transition: `color ${motion.smooth} ${motion.easeInOut}` }}>{diff.before}</span>
                    <span style={{ color: pal.textMuted, transition: `color ${motion.smooth} ${motion.easeInOut}` }}>→</span>
                    <span style={{ color: pal.success, fontWeight: tokens.weight.semibold, transition: `color ${motion.smooth} ${motion.easeInOut}` }}>{diff.after}</span>
                  </div>
                </div>
              )}
              {footer && (
                <>
                  <div style={{ height: 12 }} />
                  <Caption theme={theme}>{footer}</Caption>
                </>
              )}
            </div>
          )}
        </Stack>
      </Card>
    </div>
  );
}
// · Artifact: versioned generated-content container with preview/markdown
const ARTIFACT_VERSIONS = [
  {
    note: "First pass, thesis only",
    headline: "Some thoughts on customer health for Q3",
    paras: [
      "Support volume is flat but the shape has changed. Three enterprise accounts now generate half of all escalations, and every week we wait the renewal conversation gets harder.",
    ],
    list: null,
  },
  {
    note: "Added the at-risk account list",
    headline: "Some thoughts on customer health for Q3",
    paras: [
      "Support volume is flat but the shape has changed. Three enterprise accounts now generate half of all escalations, and every week we wait the renewal conversation gets harder.",
      "Outreach stays personal. Dana owns the three calls, Alpha drafts the recaps, and nothing goes out without a named owner.",
    ],
    list: [
      "Acme · health 82 → 61",
      "Fjord Health · health 74 → 66",
      "Brightline · health 58 → 49",
    ],
  },
  {
    note: "Tightened the headline and thesis",
    headline: "Q3 customer health: three accounts need a call this month",
    paras: [
      "Three accounts carry half the escalations and $18k of Q3 renewals. Getting ahead of them is the whole quarter.",
      "Outreach stays personal. Dana owns the three calls, Alpha drafts the recaps, and nothing goes out without a named owner.",
    ],
    list: [
      "Acme · health 82 → 61",
      "Fjord Health · health 74 → 66",
      "Brightline · health 58 → 49",
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
          <Text size="base" weight="semibold" theme={theme} truncate style={{ flex: 1, minWidth: 0 }}>Q3 customer health memo</Text>
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

        {/* Body: keyed by version + tab so both swaps animate */}
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

// · Diff view: side-by-side diff (Before | After) with per-hunk accept/reject
const DIFFVIEW_HUNKS = [
  {
    id: "h1", header: "@@ -12,4 +12,4 @@",
    lines: [
      { t: "ctx", code: "const rules = buildRules(tiers, {" },
      { t: "del", code: '  firstResponseMins: 240,' },
      { t: "add", code: '  firstResponseMins: 60,' },
      { t: "del", code: '  escalateTo: "support",' },
      { t: "add", code: '  escalateTo: "priya",' },
      { t: "ctx", code: "});" },
    ],
  },
  {
    id: "h2", header: "@@ -31,3 +31,4 @@",
    lines: [
      { t: "ctx", code: 'if (ticket.tier === "enterprise") {' },
      { t: "del", code: "  return queueNormal(ticket);" },
      { t: "add", code: "  return queuePriority(ticket);" },
      { t: "add", code: "  // and page Dana after 30 min" },
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

  // A changed cell is tinted until the hunk is decided. The winning side then
  // settles to plain; the losing side keeps its text but dims, so the row count
  // (and the stage height) never changes.
  const cellStyle = (side, verdict, isLeft) => {
    const changed = !!side && side.t !== "ctx";
    const lost = changed && (
      (verdict === "accepted" && side.t === "del") ||
      (verdict === "rejected" && side.t === "add")
    );
    const tint = !changed || verdict ? "transparent"
      : side.t === "del" ? pal.dangerBg : pal.successBg;
    return {
      flex: 1, minWidth: 0, display: "flex", alignItems: "center", gap: 8,
      height: 24, padding: "0 10px", boxSizing: "border-box",
      background: tint, opacity: lost ? 0.4 : 1,
      borderRight: isLeft ? `1px solid ${pal.borderSubtle}` : "none",
      transition: `all ${motion.smooth} ${motion.easeInOut}`,
    };
  };

  const renderCell = (side, verdict, isLeft) => (
    <div style={cellStyle(side, verdict, isLeft)}>
      <span style={{
        width: 22, flexShrink: 0, textAlign: "right", userSelect: "none",
        color: pal.textMuted, fontVariantNumeric: "tabular-nums",
        transition: `color ${motion.smooth} ${motion.easeInOut}`,
      }}>{side ? side.n : ""}</span>
      <span style={{
        flex: 1, minWidth: 0, whiteSpace: "pre", overflow: "hidden", textOverflow: "ellipsis",
        color: !side ? "transparent" : side.t === "ctx" ? pal.textSecondary : pal.text,
        transition: `color ${motion.smooth} ${motion.easeInOut}`,
      }}>{side ? side.code : " "}</span>
    </div>
  );

  const columnHead = (text, isLeft) => (
    <div style={{
      flex: 1, minWidth: 0, padding: "6px 10px",
      borderRight: isLeft ? `1px solid ${pal.borderSubtle}` : "none",
      transition: `border-color ${motion.smooth} ${motion.easeInOut}`,
    }}>
      <Caption theme={theme} style={{ ...tokens.type.xs, textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: tokens.weight.medium }}>{text}</Caption>
    </div>
  );

  return (
    <div style={{ width: 600, maxWidth: "100%", fontFamily: tokens.font.sans }}>
      <Stack gap={12}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
          <Text size="sm" weight="medium" theme={theme} style={{ flex: 1, minWidth: 0 }}>
            <span style={{ fontFamily: tokens.font.mono }}>sla.rules.ts</span>
            <span style={{ color: pal.textSecondary, fontWeight: tokens.weight.regular }}> · Alpha proposes 2 changes</span>
          </Text>
          <Caption theme={theme} style={{ fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap" }}>
            {resolvedCount} of {DIFFVIEW_HUNKS.length} reviewed
          </Caption>
        </div>

        {/* Diff block: Before | After */}
        <div style={{
          border: `1px solid ${pal.border}`, borderRadius: tokens.radius.md,
          background: pal.bgElevated, overflow: "hidden",
          transition: `all ${motion.smooth} ${motion.easeInOut}`,
        }}>
          <div style={{ display: "flex", borderBottom: `1px solid ${pal.borderSubtle}`, transition: `border-color ${motion.smooth} ${motion.easeInOut}` }}>
            {columnHead("Before", true)}
            {columnHead("After", false)}
          </div>
          {DIFFVIEW_HUNKS.map((hunk, hi) => {
            const verdict = resolved[hunk.id];
            const rows = diffviewRows(hunk);
            return (
              <div key={hunk.id} style={{ borderTop: hi > 0 ? `1px solid ${pal.borderSubtle}` : "none", transition: `border-color ${motion.smooth} ${motion.easeInOut}` }}>
                {/* Hunk header with the accept / reject controls */}
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
                {/* Aligned rows */}
                <div style={{ padding: "6px 0", ...tokens.type.sm, fontFamily: tokens.font.mono }}>
                  {rows.map((row, ri) => (
                    <div key={ri} style={{ display: "flex" }}>
                      {renderCell(row.left, verdict, true)}
                      {renderCell(row.right, verdict, false)}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer: appears once everything is reviewed */}
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

// · Structured data: schema output as a readable card, JSON on demand
const STRUCT_FIELDS = [
  { label: "Ticket",      value: "#4821" },
  { label: "Status",      badge: "APPROVED" },
  { label: "Customer",    value: "Acme" },
  { label: "Plan",        value: "Enterprise" },
  { label: "Amount",      value: "$180.00" },
  { label: "SLA",         value: "4h · on track" },
];

const STRUCT_FILLS = [
  { time: "14:32:05", size: "Opened", price: "Intercom" },
  { time: "14:36:41", size: "Credit issued", price: "Alpha" },
];

// Token stream for the JSON view: k key · s string · n number · p punctuation
const STRUCT_JSON_LINES = [
  [{ t: "p", v: "{" }],
  [{ t: "p", v: "  " }, { t: "k", v: '"ticket"' }, { t: "p", v: ": " }, { t: "n", v: "4821" }, { t: "p", v: "," }],
  [{ t: "p", v: "  " }, { t: "k", v: '"status"' }, { t: "p", v: ": " }, { t: "s", v: '"approved"' }, { t: "p", v: "," }],
  [{ t: "p", v: "  " }, { t: "k", v: '"customer"' }, { t: "p", v: ": " }, { t: "s", v: '"Acme"' }, { t: "p", v: "," }],
  [{ t: "p", v: "  " }, { t: "k", v: '"plan"' }, { t: "p", v: ": " }, { t: "s", v: '"enterprise"' }, { t: "p", v: "," }],
  [{ t: "p", v: "  " }, { t: "k", v: '"amount"' }, { t: "p", v: ": " }, { t: "n", v: "180.00" }, { t: "p", v: "," }],
  [{ t: "p", v: "  " }, { t: "k", v: '"sla_hours"' }, { t: "p", v: ": " }, { t: "n", v: "4" }, { t: "p", v: "," }],
  [{ t: "p", v: "  " }, { t: "k", v: '"events"' }, { t: "p", v: ": [" }],
  [{ t: "p", v: "    { " }, { t: "k", v: '"time"' }, { t: "p", v: ": " }, { t: "s", v: '"14:32:05"' }, { t: "p", v: ", " }, { t: "k", v: '"event"' }, { t: "p", v: ": " }, { t: "s", v: '"opened"' }, { t: "p", v: ", " }, { t: "k", v: '"by"' }, { t: "p", v: ": " }, { t: "s", v: '"intercom"' }, { t: "p", v: " }," }],
  [{ t: "p", v: "    { " }, { t: "k", v: '"time"' }, { t: "p", v: ": " }, { t: "s", v: '"14:36:41"' }, { t: "p", v: ", " }, { t: "k", v: '"event"' }, { t: "p", v: ": " }, { t: "s", v: '"credit_issued"' }, { t: "p", v: ", " }, { t: "k", v: '"by"' }, { t: "p", v: ": " }, { t: "s", v: '"alpha"' }, { t: "p", v: " }" }],
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
          <Text size="sm" weight="medium" theme={theme} style={{ flex: 1 }}>Credit issued</Text>
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
                <Caption theme={theme} style={{ ...tokens.type.xs, textTransform: "uppercase", letterSpacing: 0.4 }}>Events</Caption>
                <div style={{
                  borderRadius: tokens.radius.sm, background: pal.bgSubtle, padding: "8px 12px",
                  transition: `background ${motion.smooth} ${motion.easeInOut}`,
                }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", rowGap: 6 }}>
                    {["Time", "Event", "By"].map(h => (
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

        <Caption theme={theme} style={{ ...tokens.type.xs }}>Rendered from tool output · refund.schema.json</Caption>
      </Stack>
    </div>
  );
}

// · Comparison: same prompt, two models streaming side by side
const COMPARE_MODELS = [
  {
    id: "alpha-4", name: "alpha-4", cps: 2,
    text: "212 tickets resolved, median first response down to 41 minutes. Acme drove most of the escalations, so the outage credits are out and the postmortem lands Friday.",
  },
  {
    id: "alpha-mini", name: "alpha-mini", cps: 3,
    text: "212 tickets closed. Acme was the loud one; everything else was quiet.",
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
            <Code theme={theme} style={{ color: pal.textSecondary }}>Summarize support this week in 2 lines</Code>
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
                ? `Preference saved. Routing more like this to ${winnerName}.`
                : "Marked as a tie. No routing change."}
            </Text>
          </div>
        )}
      </Stack>
    </div>
  );
}

// ─── UX PATTERNS · Ambient & beyond chat (new) ─────────────

// ─── AMBIENT & BEYOND-CHAT · the agent outside the thread ─────

// · Taskboard: the board is primary; chat is the secondary channel
const TASKBOARD_COLUMNS = [
  { id: "queued",  label: "Queued" },
  { id: "working", label: "Alpha working" },
  { id: "needs",   label: "Needs you" },
];

const TASKBOARD_TASKS = [
  { id: "t1", title: "Draft release notes for v2.4",       owner: "agent",      meta: "runs after tonight's deploy" },
  { id: "t2", title: "Update the refund runbook",          owner: "Sam Keller", meta: "queued 14m" },
  { id: "t3", title: "Clear the Acme ticket backlog",      owner: "agent",      meta: "3 of 5 replies sent" },
  { id: "t4", title: "Issue a $340 credit to Fjord Health", owner: "agent",      meta: "1 decision pending" },
];

const TASKBOARD_BEFORE = { t1: "queued", t2: "queued", t3: "working", t4: "needs" };
const TASKBOARD_AFTER  = { t1: "working", t2: "queued", t3: "needs",  t4: "needs" };
const TASKBOARD_AFTER_META  = { t3: "2 replies await approval", t1: "running · reading merged PRs" };
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
        <Caption theme={theme}>Alpha keeps working. You only see what needs a decision.</Caption>
      </div>
    </div>
  );
}

// · Inline assist: ghost-text completion with accept / dismiss
const ASSIST_LINES = [
  { typed: "const escalateAfter = ", ghost: "sla.firstResponse * 2;",                          alt: "firstResponse * 2;" },
  { typed: "const escalateTo = ",    ghost: "ticket.plan === 'enterprise' ? 'dana' : 'queue';", alt: "isEnterprise ? 'dana' : 'queue';" },
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
            escalation.config.ts
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
            <Caption theme={theme}>Suggestion dismissed. Alpha adapts.</Caption>
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

// · Nudge: proactive suggestion with a real escape hatch
const NUDGE_BECAUSE = "Noticed: Acme's usage dropped 40% this week";
const NUDGE_ASK = "Want me to draft a check-in to their admin before the renewal call?";

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
          <Text size="sm" secondary theme={theme}>Drafting the check-in…</Text>
        </div>
      )}
      {stage === "done" && (
        <div style={{ display: "flex", alignItems: "center", gap: 9, padding: "10px 2px", animation: `halaska-step-in 0.45s ${motion.emphasized} both` }}>
          <span style={{ width: 7, height: 7, borderRadius: 4, background: pal.success, flexShrink: 0, transition: `background ${motion.smooth} ${motion.easeInOut}` }} />
          <Text size="sm" theme={theme}>Draft ready in Intercom. Receipt in the log.</Text>
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
          <Caption theme={theme}>Got it. Alpha won't bring this up again.</Caption>
        </div>
      )}
    </div>
  );
}

// · Digest: "while you were away", grouped actions with rationale
const DIGEST_ROWS = [
  {
    id: "d1", tone: "success", title: "Replied to 3 tickets", value: "3 sent",
    why: "Why: all three matched the password-reset runbook",
    receipt: "#4821 · #4822 · #4826 · Intercom · 09:42",
  },
  {
    id: "d2", tone: "default", title: "Drafted release notes for v2.4", value: "1 draft",
    why: "Why: 6 pull requests merged since the last release, all tagged shipped",
    receipt: "release-notes.md · GitHub · 10:05",
  },
  {
    id: "d3", tone: "warning", title: "Skipped: refund needed your approval", value: "Held",
    why: "Why: a $3,100 refund exceeds your $2,500 approval cap",
    receipt: null, approvable: true,
    approvedReceipt: "Refunded $3,100 to Lumen Labs · Stripe · just now",
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
          {approved ? "Refunded Lumen Labs" : row.title}
        </Text>
        <span style={{
          ...tokens.type.sm, fontFamily: tokens.font.mono, fontVariantNumeric: "tabular-nums",
          color: approved ? pal.success : row.tone === "success" ? pal.success : pal.textSecondary,
          transition: `color ${motion.smooth} ${motion.easeInOut}`, flexShrink: 0,
        }}>{approved ? "$3,100" : row.value}</span>
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
        Alpha replied to three tickets, drafted the release notes, closed a stale one, and held a refund for you.
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

// ─── PARADIGM EXAMPLE SCREENS ─────────────────────────────────
// Two complete product screens built only from kit components: the proof
// that the kit produces finished AI products. Each renders as a live
// scaled thumbnail on the page and full-screen when tapped.

// ─── EXAMPLE · Chat paradigm: the thread is the product ─────────
// One full Alpha screen composed only from kit exports: sidebar of past
// threads, a top bar with model + context + live status, the thread itself
// (user turn → thinking trace → streamed answer → approval card), and the
// prompt composer docked at the bottom. Designed at 1200×760; stretches.

const CHATX_THREADS = [
  { id: "acme-outage",  title: "Acme outage follow-up",     time: "2m" },
  { id: "lumen-onb",    title: "Lumen Labs onboarding",     time: "1h" },
  { id: "fjord-refund", title: "Fjord Health refund",       time: "3h" },
  { id: "release-214",  title: "Release notes · v2.14",     time: "Yesterday" },
  { id: "brightline",   title: "Brightline renewal risk",   time: "Yesterday" },
  { id: "cobalt-sso",   title: "Cobalt Dental SSO setup",   time: "Mon" },
  { id: "digest",       title: "Weekly support digest",     time: "Sun" },
];

const CHATX_MODELS = [
  { id: "alpha-4-fast", label: "alpha-4 · fast", desc: "Quick replies, everyday triage",   tags: ["200K", "◇ vision"] },
  { id: "alpha-4-deep", label: "alpha-4 · deep", desc: "Slower, reasons through edge cases", tags: ["200K", "✦ reasoning"] },
  { id: "alpha-mini",   label: "alpha-mini",     desc: "Cheapest, fine for summaries",      tags: ["32K"] },
];

const CHATX_USER_MSG = "What happened with Acme's outage complaint and what should I do?";

const CHATX_THINK_STEPS = [
  { label: "Reading the Intercom thread",    detail: "Acme · ticket #4821" },
  { label: "Checking the changelog",         detail: "last 2 releases" },
  { label: "Pulling Stripe account status",  detail: "Enterprise · renews in 19 days" },
];

const CHATX_ANSWER_SEGMENTS = [
  { t: "Acme's outage started after Tuesday's release: calendar sync stopped for three of their users and the complaint landed in Intercom at 9:14." },
  { chip: "intercom.com" },
  { t: " The fix is already in Priya's branch and ships Thursday. The account is healthy and no credit has gone out yet, so a workaround plus a short note today keeps the thread calm." },
  { chip: "notion.so" },
];

const CHATX_ANSWER_SOURCES = [
  { name: "Intercom thread", domain: "intercom.com" },
  { name: "Changelog",       domain: "northwind.app" },
  { name: "Stripe",          domain: "stripe.com" },
];

const CHATX_ANSWER_FOLLOWUPS = [
  "Draft the workaround note for Acme",
  "Show Acme's tickets this month",
];

const CHATX_APPROVAL_OPTIONS = [
  { id: "workaround", title: "Reply now with a workaround",       sub: "Unblocks Acme today, fix ships later" },
  { id: "wait",       title: "Wait for the fix to ship Thursday", sub: "Priya's patch is already in review" },
  { id: "escalate",   title: "Escalate to Priya",                 sub: "Loops engineering in on the thread" },
];

// Compact sidebar row: title + relative time, plain button in the kit idiom.
function ChatXThreadRow({ title, time, active, onClick, theme }) {
  const pal = usePal(theme);
  const [hover, setHover] = useState(false);
  return (
    <button onClick={onClick}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        ...interactiveBase, display: "flex", alignItems: "center", gap: 10,
        width: "100%", padding: "8px 10px", borderRadius: tokens.radius.sm, textAlign: "left",
        background: active ? pal.bgMuted : hover ? pal.bgHover : "transparent",
      }}>
      <span style={{
        flex: 1, minWidth: 0, ...tokens.type.sm, fontFamily: tokens.font.sans,
        fontWeight: active ? tokens.weight.medium : tokens.weight.regular,
        color: active || hover ? pal.text : pal.textSecondary,
        overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
        transition: `color ${motion.smooth} ${motion.easeInOut}`,
      }}>{title}</span>
      <span style={{
        ...tokens.type.xs, fontFamily: tokens.font.mono, color: pal.textTertiary, flexShrink: 0,
        transition: `color ${motion.smooth} ${motion.easeInOut}`,
      }}>{time}</span>
    </button>
  );
}

// Top-bar model pill: opens a small menu to pick the model.
function ChatXModelPill({ index, onSelect, theme }) {
  const pal = usePal(theme);
  const [hover, setHover] = useState(false);
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);
  useEffect(() => {
    if (!open) return;
    const onDown = (e) => { if (rootRef.current && !rootRef.current.contains(e.target)) setOpen(false); };
    const onKey = (e) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", onDown);
    window.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("mousedown", onDown); window.removeEventListener("keydown", onKey); };
  }, [open]);
  return (
    <div ref={rootRef} style={{ position: "relative", display: "inline-flex" }}>
      <button onClick={() => setOpen(o => !o)} aria-label="Change model" aria-haspopup="menu" aria-expanded={open}
        onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
        style={{
          ...interactiveBase, display: "inline-flex", alignItems: "center", gap: 6,
          height: 28, padding: "0 10px", borderRadius: tokens.radius.pill,
          background: open || hover ? pal.bgMuted : pal.bgSubtle,
          border: `1px solid ${open ? pal.border : pal.borderSubtle}`,
        }}>
        <span key={index} style={{
          ...tokens.type.xs, fontFamily: tokens.font.mono, color: pal.textSecondary, whiteSpace: "nowrap",
          animation: `halaska-tab-fade 0.25s ${motion.easeOut} both`,
        }}>{CHATX_MODELS[index].label}</span>
        <ChevronIcon size={9} direction={open ? "up" : "down"} style={{ color: pal.textTertiary }} />
      </button>
      {open && (
        <div role="menu" style={{
          position: "absolute", top: "calc(100% + 6px)", left: 0, zIndex: 20, minWidth: 300,
          padding: 6, borderRadius: tokens.radius.md,
          background: theme === "dark" ? "rgba(30,30,30,0.96)" : "rgba(255,255,255,0.96)",
          backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)",
          border: `1px solid ${pal.borderSubtle}`, boxShadow: `0 12px 32px ${pal.shadowLg}`,
          animation: `halaska-scale-in ${motion.normal} ${motion.emphasized} both`, transformOrigin: "top left",
        }}>
          {CHATX_MODELS.map((m, i) => (
            <ChatXModelOption key={m.id} model={m} active={i === index} theme={theme}
              onPick={() => { onSelect?.(i); setOpen(false); }} />
          ))}
        </div>
      )}
    </div>
  );
}

function ChatXModelOption({ model, active, onPick, theme }) {
  const pal = usePal(theme);
  const [hover, setHover] = useState(false);
  return (
    <button role="menuitemradio" aria-checked={active} onClick={onPick}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        ...interactiveBase, display: "flex", alignItems: "center", gap: 10, width: "100%",
        padding: "8px 10px", borderRadius: tokens.radius.sm, textAlign: "left",
        background: hover ? pal.bgSubtle : "transparent",
      }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ ...tokens.type.sm, fontFamily: tokens.font.mono, color: pal.text, whiteSpace: "nowrap" }}>{model.label}</span>
          {model.tags.map(t => (
            <span key={t} style={{ ...tokens.type.xxs, fontFamily: tokens.font.mono, color: pal.textTertiary, padding: "1px 6px", borderRadius: tokens.radius.pill, background: pal.bgSubtle, whiteSpace: "nowrap", flexShrink: 0 }}>{t}</span>
          ))}
        </div>
        <span style={{ ...tokens.type.xs, color: pal.textSecondary, display: "block", marginTop: 2 }}>{model.desc}</span>
      </div>
      <span style={{ width: 14, textAlign: "center", ...tokens.type.sm, color: active ? pal.accent : "transparent" }}>✓</span>
    </button>
  );
}

function ChatParadigmExample({ theme }) {
  const pal = usePal(theme);
  const [search, setSearch] = useState("");
  const [activeThread, setActiveThread] = useState(CHATX_THREADS[0].id);
  const [modelIdx, setModelIdx] = useState(0);
  const [waiting, setWaiting] = useState(false);       // orb: reading → waiting on you
  const [stage, setStage] = useState(0);               // 0 thinking · 1 answer · 2 approval
  const threadRef = useRef(null);

  // Live status flips from "reading" to "waiting" once the answer has landed.
  useEffect(() => {
    const t = setTimeout(() => setWaiting(true), 3000);
    return () => clearTimeout(t);
  }, []);

  // Keep the newest turn in view as the thread grows.
  useEffect(() => {
    const el = threadRef.current;
    if (!el) return;
    const raf = requestAnimationFrame(() => {
      el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
    });
    return () => cancelAnimationFrame(raf);
  }, [stage]);

  const surface = `background ${motion.smooth} ${motion.easeInOut}, border-color ${motion.smooth} ${motion.easeInOut}`;
  const visibleThreads = CHATX_THREADS.filter(t => t.title.toLowerCase().includes(search.trim().toLowerCase()));
  const activeTitle = (CHATX_THREADS.find(t => t.id === activeThread) || CHATX_THREADS[0]).title;

  return (
    <div style={{
      position: "relative", width: "100%", height: "100%", overflow: "hidden",
      background: pal.bg, fontFamily: tokens.font.sans, color: pal.text,
      display: "flex", transition: surface,
    }}>
      {/* ── Sidebar ─────────────────────────────────────────────── */}
      <aside style={{
        width: 240, flexShrink: 0, display: "flex", flexDirection: "column",
        background: pal.bgSubtle, borderRight: `1px solid ${pal.borderSubtle}`,
        transition: surface,
      }}>
        <div style={{ padding: "16px 16px 8px", display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "0 4px", height: 24 }}>
            <AgentGlyph size={24} theme={theme} />
            <Text size="md" weight="semibold" theme={theme} style={{ flex: 1, letterSpacing: "-0.01em" }}>Alpha</Text>
            <StatusDot status="online" theme={theme} />
          </div>
          <SearchInput value={search} onChange={setSearch} placeholder="Search threads…" shortcut="⌘K" theme={theme} />
          <Button variant="primary" size="sm" fullWidth theme={theme} onClick={() => {}}>New thread</Button>
        </div>

        <div style={{ flex: 1, minHeight: 0, overflowY: "auto", padding: "8px 8px 8px" }}>
          <div style={{ padding: "4px 10px 8px" }}>
            <Caption theme={theme} style={{ ...tokens.type.xs, textTransform: "uppercase", letterSpacing: 0.4 }}>Recent</Caption>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {visibleThreads.map(t => (
              <ChatXThreadRow key={t.id} title={t.title} time={t.time} theme={theme}
                active={t.id === activeThread} onClick={() => setActiveThread(t.id)} />
            ))}
          </div>
        </div>

        <div style={{
          display: "flex", alignItems: "center", gap: 10, padding: "12px 16px",
          borderTop: `1px solid ${pal.borderSubtle}`, transition: surface,
        }}>
          <Avatar name="Sam Keller" size={28} theme={theme} />
          <Text size="sm" weight="medium" theme={theme} truncate style={{ flex: 1, minWidth: 0 }}>Sam Keller</Text>
          <Badge theme={theme}>Team</Badge>
        </div>
      </aside>

      {/* ── Main column ─────────────────────────────────────────── */}
      <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>
        {/* Top bar */}
        <header style={{
          height: 56, flexShrink: 0, display: "flex", alignItems: "center", gap: 16,
          padding: "0 24px", borderBottom: `1px solid ${pal.borderSubtle}`, transition: surface,
        }}>
          <Text size="md" weight="semibold" theme={theme} truncate style={{ letterSpacing: "-0.01em", maxWidth: 280 }}>{activeTitle}</Text>
          <ChatXModelPill index={modelIdx} theme={theme} onSelect={setModelIdx} />
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 72 }}><Progress value={66} height={4} theme={theme} /></div>
            <Caption theme={theme} style={{ ...tokens.type.xs, fontFamily: tokens.font.mono, whiteSpace: "nowrap" }}>132K / 200K</Caption>
          </div>
          <div style={{ flex: 1 }} />
          <Orb pill theme={theme} size={20}
            variant={waiting ? "spark" : "orbit"}
            label={waiting ? "Waiting on you" : "Reading Acme's thread…"} />
          <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
            <IconButton icon="⤴" size={32} label="Share thread" theme={theme} onClick={() => {}} />
            <IconButton icon="⋯" size={32} label="More" theme={theme} onClick={() => {}} />
          </div>
        </header>

        {/* Thread */}
        <div ref={threadRef} style={{ flex: 1, minHeight: 0, overflowY: "auto", padding: "32px 24px" }}>
          <div style={{ maxWidth: 640, margin: "0 auto", display: "flex", flexDirection: "column", gap: 24 }}>
            {/* User turn */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4, animation: `halaska-step-in 0.4s ${motion.emphasized} both` }}>
              <div style={{
                maxWidth: "78%", padding: "10px 14px",
                background: pal.bgSubtle, border: `1px solid ${pal.borderSubtle}`,
                borderRadius: `${tokens.radius.md}px ${tokens.radius.md}px ${tokens.radius.xs}px ${tokens.radius.md}px`,
                transition: `all ${motion.smooth} ${motion.easeInOut}`,
              }}>
                <Text size="base" theme={theme}>{CHATX_USER_MSG}</Text>
              </div>
              <span style={{ ...tokens.type.xs, color: pal.textTertiary, paddingRight: 4, transition: `color ${motion.smooth} ${motion.easeInOut}` }}>9:41 AM</span>
            </div>

            {/* Alpha thinks, then answers, then asks */}
            <ThinkingTracePattern theme={theme}
              steps={CHATX_THINK_STEPS} stepMs={900}
              thinkingLabel="Reading Acme's thread"
              onDone={() => setStage(s => Math.max(s, 1))} />

            {stage >= 1 && (
              <div style={{ animation: `halaska-step-in 0.4s ${motion.emphasized} both` }}>
                <StreamingAnswerPattern theme={theme}
                  segments={CHATX_ANSWER_SEGMENTS}
                  sources={CHATX_ANSWER_SOURCES}
                  followups={CHATX_ANSWER_FOLLOWUPS}
                  thinkingLabel="Putting it together"
                  thinkMs={300}
                  onFollowup={() => {}}
                  onDone={() => setStage(s => Math.max(s, 2))} />
              </div>
            )}

            {stage >= 2 && (
              <div style={{ animation: `halaska-step-in 0.4s ${motion.emphasized} both` }}>
                <ApprovalCardPattern theme={theme}
                  question="How should I reply to Acme?"
                  options={CHATX_APPROVAL_OPTIONS} />
              </div>
            )}
          </div>
        </div>

        {/* Composer */}
        <div style={{
          flexShrink: 0, display: "flex", justifyContent: "center",
          padding: "16px 24px 20px", borderTop: `1px solid ${pal.borderSubtle}`,
          background: pal.bg, transition: surface,
        }}>
          <PromptInputPattern theme={theme} />
        </div>
      </div>
    </div>
  );
}
// EXAMPLE: ChatParadigmExample

// ─── CANVAS PARADIGM EXAMPLE ──────────────────────────────────
// Alpha's workflow builder for Northwind support triage. A top bar,
// a node palette on the left, the flow on an open canvas, and global
// settings on the right. Designed for a 1200×760 stage; positions are
// fixed in stage coordinates. Panels float 12px inside the stage; the
// canvas is the 576px column between them (x 312–888).

const CANVASX_TOPBAR_H = 52;
const CANVASX_INSET = 12;
const CANVASX_PANEL_W = 300;
const CANVASX_CANVAS_L = 0;                                        // no left panel
const CANVASX_CANVAS_R = 1200 - CANVASX_INSET - CANVASX_PANEL_W;   // 888
const CANVASX_NODE_W = 212;
const CANVASX_NODE_PAD = 14;
const CANVASX_MINIMAP = { w: 200, h: 110 };

const CANVASX_SETTINGS = [
  { title: "Agent",          content: "alpha-4 · deep · temperature 0.3" },
  { title: "Knowledge base", content: "Notion runbooks · 142 pages, synced 2h ago" },
  { title: "Tone",           content: "Match the customer's tone; plain language; no promised dates" },
  { title: "Tools",          content: "Intercom, Linear, Stripe (read-only)" },
  { title: "Memory",         content: "Save resolved threads to HubSpot" },
  { title: "Escalation",     content: "Refunds over $500 → human" },
  { title: "Security",       content: "PII redacted before logging" },
  { title: "Webhook",        content: "POST to /alpha/events" },
];

const CANVASX_PUBLISH_ITEMS = [
  { label: "Publish to staging" },
  { label: "Publish to production" },
  { label: "Schedule" },
];

// Stage positions. Column 1 sits right of the Begin pill; column 2 ends
// 16px short of the right panel so nothing hides under it.
const CANVASX_NODES = {
  begin:   { x: 176, y: 333, w: 56, h: 32 },
  conv1:   { x: 260, y: 243, w: CANVASX_NODE_W, h: 307, tint: "accent",  title: "Conversation" },
  handoff: { x: 512, y: 163, w: CANVASX_NODE_W, h: 177, tint: "warning", title: "Handoff" },
  conv2:   { x: 512, y: 405, w: CANVASX_NODE_W, h: 244, tint: "accent",  title: "Conversation" },
};

// Fallback port offsets (from the conv1 card top) until the DOM is measured
const CANVASX_PORT_FALLBACK = [248, 278];

const CANVASX_MINIMAP_SCALE = 0.14;

function CANVASX_alpha(hex, a) {
  const r = parseInt(hex.slice(1, 3), 16), g = parseInt(hex.slice(3, 5), 16), b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${a})`;
}

// Orthogonal connector with rounded elbows: out, across, in
function CANVASX_ortho(a, b, r = 10) {
  const midX = (a.x + b.x) / 2;
  const dy = b.y - a.y;
  if (Math.abs(dy) < 1) return `M${a.x},${a.y} L${b.x},${b.y}`;
  const s = Math.sign(dy);
  const rr = Math.min(r, Math.abs(dy) / 2, midX - a.x);
  return `M${a.x},${a.y} H${midX - rr} Q${midX},${a.y} ${midX},${a.y + s * rr} V${b.y - s * rr} Q${midX},${b.y} ${midX + rr},${b.y} H${b.x}`;
}

function CANVASX_tint(pal, tint) {
  return { accent: pal.accent, success: pal.success, warning: pal.warning, danger: pal.danger }[tint] || pal.textSecondary;
}

// Floating panel: elevated surface with a hairline ring
function CanvasXPanel({ theme, children, style: sp }) {
  const pal = usePal(theme);
  return (
    <div style={{
      position: "absolute", display: "flex", flexDirection: "column", overflow: "hidden",
      background: pal.bgElevated, borderRadius: tokens.radius.lg,
      boxShadow: `0 0 0 1px ${pal.borderSubtle}, 0 4px 16px ${pal.shadow}`,
      transition: `background ${motion.smooth} ${motion.easeInOut}, box-shadow ${motion.smooth} ${motion.easeInOut}`,
      ...sp,
    }}>{children}</div>
  );
}

// Floating chrome: the action-bar glass treatment, cut to size
function CanvasXGlass({ theme, children, style: sp }) {
  const pal = usePal(theme);
  return (
    <div style={{
      display: "flex", alignItems: "center",
      background: CANVASX_alpha(pal.bgElevated, 0.85),
      backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
      borderRadius: tokens.radius.md,
      boxShadow: `0 0 0 1px ${pal.borderSubtle}, 0 4px 16px ${pal.shadow}`,
      transition: `background ${motion.smooth} ${motion.easeInOut}, box-shadow ${motion.smooth} ${motion.easeInOut}`,
      ...sp,
    }}>{children}</div>
  );
}

// Rounded icon tile used by the palette and node headers
function CanvasXTile({ glyph, tint, size = 32, theme }) {
  const pal = usePal(theme);
  return (
    <span style={{
      width: size, height: size, borderRadius: tokens.radius.sm, flexShrink: 0,
      display: "inline-flex", alignItems: "center", justifyContent: "center",
      background: pal.bgSubtle, color: CANVASX_tint(pal, tint), fontSize: Math.round(size * 0.42), lineHeight: 1,
      transition: `all ${motion.smooth} ${motion.easeInOut}`,
    }}>{glyph}</span>
  );
}

function CanvasXPort({ theme, offset = 0, style: sp }) {
  const pal = usePal(theme);
  return (
    <span style={{
      position: "absolute", right: -(offset + 5), top: "50%", marginTop: -5,
      width: 10, height: 10, borderRadius: 5, boxSizing: "border-box",
      background: pal.bgElevated, border: `1.5px solid ${pal.accent}`,
      transition: `all ${motion.smooth} ${motion.easeInOut}`, ...sp,
    }} />
  );
}

function CanvasXTransitionRow({ label, checked, onPick, rowRef, theme }) {
  return (
    <div ref={rowRef} style={{ position: "relative", display: "flex", alignItems: "center", height: 30 }}>
      <Radio checked={checked} onChange={onPick} label={label} theme={theme} />
      <CanvasXPort offset={CANVASX_NODE_PAD} theme={theme} />
    </div>
  );
}

// A node card: header tile + title + run/collapse, then the body
function CanvasXNode({ node, selected, onSelect, cardRef, children, theme }) {
  const pal = usePal(theme);
  return (
    <div onClick={onSelect} style={{ position: "absolute", left: node.x, top: node.y, width: node.w, zIndex: selected ? 2 : 1, cursor: "pointer" }}>
      {selected && (
        <div aria-hidden style={{
          position: "absolute", inset: -6, borderRadius: tokens.radius.lg + 6, pointerEvents: "none",
          border: `1.5px dashed ${pal.accent}`, transition: `border-color ${motion.smooth} ${motion.easeInOut}`,
        }} />
      )}
      <div ref={cardRef} style={{
        position: "relative", padding: CANVASX_NODE_PAD, borderRadius: tokens.radius.lg,
        background: pal.bgElevated,
        boxShadow: `0 0 0 1px ${pal.borderSubtle}, 0 2px 8px ${pal.shadow}`,
        transition: `background ${motion.smooth} ${motion.easeInOut}, box-shadow ${motion.smooth} ${motion.easeInOut}`,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, height: 28 }}>
          <CanvasXTile glyph={node.tint === "warning" ? "⇢" : "◔"} tint={node.tint} size={28} theme={theme} />
          <Text size="base" weight="semibold" theme={theme} truncate style={{ flex: 1, minWidth: 0 }}>{node.title}</Text>
          <IconButton icon="▷" size={24} theme={theme} label="Run from here" style={{ fontSize: 10 }} />
          <IconButton icon="⌃" size={24} theme={theme} label="Collapse" style={{ fontSize: 12 }} />
        </div>
        {children}
      </div>
    </div>
  );
}

function CanvasXBody({ text, theme }) {
  const pal = usePal(theme);
  return (
    <div style={{
      marginTop: 10, padding: "8px 10px", borderRadius: tokens.radius.md, background: pal.bgSubtle,
      transition: `background ${motion.smooth} ${motion.easeInOut}`,
    }}>
      <Text as="div" size="base" theme={theme}>{text}</Text>
    </div>
  );
}

function CanvasXTransition({ rows, picked, onPick, rowRefs, theme }) {
  return (
    <div style={{ marginTop: 12 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 24 }}>
        <Caption theme={theme}>Transition</Caption>
        <IconButton icon="+" size={20} theme={theme} label="Add transition" style={{ fontSize: 13 }} />
      </div>
      <div style={{ marginTop: 4 }}>
        {rows.map((label, i) => (
          <CanvasXTransitionRow key={label} label={label} checked={picked === i}
            onPick={() => onPick(i)} rowRef={rowRefs ? el => { rowRefs.current[i] = el; } : undefined} theme={theme} />
        ))}
      </div>
    </div>
  );
}

function CanvasParadigmExample({ theme }) {
  const pal = usePal(theme);
  const [mode, setMode] = useState("Build");
  const [rightTab, setRightTab] = useState("Global settings");
  const [zoom, setZoom] = useState(100);
  const [selected, setSelected] = useState("conv1");
  const [busy, setBusy] = useState(true);
  const [picked, setPicked] = useState({ conv1: 0, conv2: 0 });
  const [geom, setGeom] = useState(null);
  const cardRefs = useRef({});
  const portRefs = useRef([]);

  // Alpha finishes its edit after a beat; the pill settles on "Ready to test"
  useEffect(() => {
    const t = setTimeout(() => setBusy(false), 3000);
    return () => clearTimeout(t);
  }, []);

  // Measure card heights + port rows so connectors land on the ports.
  // Re-measures when web fonts arrive (ResizeObserver) and once after a beat.
  useEffect(() => {
    const measure = () => {
      const h = {};
      Object.keys(cardRefs.current).forEach(id => { const el = cardRefs.current[id]; if (el) h[id] = el.offsetHeight; });
      const ports = portRefs.current.map((el, i) => el ? el.offsetTop + el.offsetHeight / 2 : CANVASX_PORT_FALLBACK[i]);
      setGeom(prev => {
        const next = { h, ports };
        return prev && JSON.stringify(prev) === JSON.stringify(next) ? prev : next;
      });
    };
    measure();
    const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(measure) : null;
    if (ro) Object.values(cardRefs.current).forEach(el => el && ro.observe(el));
    const t = setTimeout(measure, 800);
    return () => { if (ro) ro.disconnect(); clearTimeout(t); };
  }, []);

  const nodeH = id => geom?.h[id] ?? CANVASX_NODES[id].h;
  const inputOf = id => ({ x: CANVASX_NODES[id].x, y: CANVASX_NODES[id].y + nodeH(id) / 2 });
  const portOf = i => ({ x: CANVASX_NODES.conv1.x + CANVASX_NODES.conv1.w, y: CANVASX_NODES.conv1.y + (geom?.ports[i] ?? CANVASX_PORT_FALLBACK[i]) });

  const begin = CANVASX_NODES.begin;
  const beginPort = { x: begin.x + begin.w, y: begin.y + begin.h / 2 };
  const edges = [
    { from: beginPort, to: inputOf("conv1") },
    { from: portOf(0), to: inputOf("handoff") },
    { from: portOf(1), to: inputOf("conv2") },
  ];
  const plus = { x: (edges[0].from.x + edges[0].to.x) / 2, y: (edges[0].from.y + edges[0].to.y) / 2 };

  const canvasW = CANVASX_CANVAS_R - CANVASX_CANVAS_L;
  const canvasH = 760 - CANVASX_TOPBAR_H;
  const miniInner = { w: canvasW * CANVASX_MINIMAP_SCALE, h: canvasH * CANVASX_MINIMAP_SCALE };
  const miniOff = { x: (CANVASX_MINIMAP.w - miniInner.w) / 2, y: (CANVASX_MINIMAP.h - miniInner.h) / 2 };
  const mini = (n) => ({
    left: miniOff.x + (n.x - CANVASX_CANVAS_L) * CANVASX_MINIMAP_SCALE,
    top: miniOff.y + (n.y - CANVASX_TOPBAR_H) * CANVASX_MINIMAP_SCALE,
    width: n.w * CANVASX_MINIMAP_SCALE, height: n.h * CANVASX_MINIMAP_SCALE,
  });

  const hairline = `1px solid ${pal.borderSubtle}`;
  const hairlineT = `border-color ${motion.smooth} ${motion.easeInOut}`;

  return (
    <div style={{
      position: "relative", width: "100%", height: "100%", overflow: "hidden",
      background: pal.bg, fontFamily: tokens.font.sans, color: pal.text,
      transition: `background ${motion.smooth} ${motion.easeInOut}, color ${motion.smooth} ${motion.easeInOut}`,
    }}>
      {/* Canvas ground: fills everything under the top bar */}
      <div style={{
        position: "absolute", left: 0, right: 0, top: CANVASX_TOPBAR_H, bottom: 0,
        background: pal.bgSubtle, transition: `background ${motion.smooth} ${motion.easeInOut}`,
      }}>
        <DotGrid theme={theme} spacing={20} />
      </div>

      {/* Canvas layer: connectors under nodes; zoom scales the whole layer.
          Fixed stage width, centred in the space left of the settings panel so
          the flow sits in the middle at any viewport width. */}
      <div style={{
        position: "absolute", height: 760, width: CANVASX_CANVAS_R,
        top: `calc((100% - ${CANVASX_TOPBAR_H}px) / 2 - ${(760 - CANVASX_TOPBAR_H) / 2}px)`,
        left: `calc((100% - ${CANVASX_PANEL_W + CANVASX_INSET}px) / 2 - ${CANVASX_CANVAS_R / 2}px)`,
        transform: `scale(${zoom / 100})`,
        transformOrigin: `${(CANVASX_CANVAS_L + CANVASX_CANVAS_R) / 2}px ${CANVASX_TOPBAR_H + canvasH / 2}px`,
        transition: `transform ${motion.smooth} ${motion.emphasized}`,
      }}>
        <svg width="100%" height="100%" style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "visible" }}>
          {edges.map((e, i) => (
            <path key={i} d={CANVASX_ortho(e.from, e.to)} fill="none"
              stroke={`${pal.accent}99`} strokeWidth={1.5} strokeLinejoin="round" strokeLinecap="round"
              style={{ transition: `stroke ${motion.smooth} ${motion.easeInOut}` }} />
          ))}
        </svg>

        {/* Begin */}
        <div onClick={() => setSelected("begin")} style={{
          position: "absolute", left: begin.x, top: begin.y, width: begin.w, height: begin.h, boxSizing: "border-box",
          display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
          borderRadius: tokens.radius.pill, background: pal.accentBg,
          boxShadow: selected === "begin" ? `0 0 0 1.5px ${pal.accent}` : "none",
          transition: `all ${motion.smooth} ${motion.easeInOut}`,
        }}>
          <Text size="sm" weight="semibold" color={pal.accentText} theme={theme}>Begin</Text>
          <CanvasXPort theme={theme} />
        </div>

        {/* Insert-a-node handle on the first edge */}
        <IconButton icon="+" size={24} theme={theme} label="Insert node" style={{
          position: "absolute", left: plus.x - 12, top: plus.y - 12, zIndex: 3, fontSize: 14,
          borderRadius: tokens.radius.pill, background: pal.bgElevated,
          boxShadow: `0 0 0 1px ${pal.borderSubtle}, 0 1px 3px ${pal.shadow}`,
        }} />

        {/* Conversation: the selected node */}
        <CanvasXNode node={CANVASX_NODES.conv1} selected={selected === "conv1"} onSelect={() => setSelected("conv1")}
          cardRef={el => { cardRefs.current.conv1 = el; }} theme={theme}>
          <CanvasXBody theme={theme} text="Hi, this is Alpha from Northwind support. I've read your ticket about the calendar sync. Can I confirm which clinic this is for?" />
          <CanvasXTransition rows={["If ticket is urgent", "Otherwise"]} picked={picked.conv1}
            onPick={i => setPicked(p => ({ ...p, conv1: i }))} rowRefs={portRefs} theme={theme} />
        </CanvasXNode>

        {/* Handoff */}
        <CanvasXNode node={CANVASX_NODES.handoff} selected={selected === "handoff"} onSelect={() => setSelected("handoff")}
          cardRef={el => { cardRefs.current.handoff = el; }} theme={theme}>
          <CanvasXBody theme={theme} text="Escalate to Priya with the thread summary and account status." />
          <div style={{ marginTop: 10 }}><Badge theme={theme}>Human in the loop</Badge></div>
        </CanvasXNode>

        {/* Conversation: the workaround branch */}
        <CanvasXNode node={CANVASX_NODES.conv2} selected={selected === "conv2"} onSelect={() => setSelected("conv2")}
          cardRef={el => { cardRefs.current.conv2 = el; }} theme={theme}>
          <CanvasXBody theme={theme} text="Here's the workaround while the fix ships Thursday…" />
          <CanvasXTransition rows={["If resolved", "If not resolved"]} picked={picked.conv2}
            onPick={i => setPicked(p => ({ ...p, conv2: i }))} theme={theme} />
        </CanvasXNode>
      </div>

      {/* Alpha's status: top-right of the canvas */}
      <Orb pill variant={busy ? "pulse" : "spark"} label={busy ? "Alpha is editing…" : "Ready to test"} theme={theme}
        style={{ position: "absolute", top: CANVASX_TOPBAR_H + CANVASX_INSET, right: 1200 - CANVASX_CANVAS_R + 16, zIndex: 4 }} />

      {/* Bottom toolbar: centred in the space left of the minimap */}
      <div style={{
        position: "absolute", bottom: 16, left: 0, right: 1200 - CANVASX_CANVAS_R + 16 + CANVASX_MINIMAP.w + 12,
        display: "flex", justifyContent: "center", pointerEvents: "none", zIndex: 4,
      }}>
        <CanvasXGlass theme={theme} style={{ padding: 4, gap: 2, pointerEvents: "auto" }}>
          <IconButton icon="↖" size={32} variant="secondary" theme={theme} label="Select" style={{ fontSize: 13, color: pal.text }} />
          <IconButton icon="✋︎" size={32} theme={theme} label="Pan" style={{ fontSize: 13 }} />
          <IconButton icon="▦" size={32} theme={theme} label="Fit to view" style={{ fontSize: 13 }} />
          <div style={{ width: 1, height: 20, margin: "0 6px", background: pal.borderSubtle, transition: `background ${motion.smooth} ${motion.easeInOut}` }} />
          <ZoomControl zoom={zoom} onChange={setZoom} theme={theme} />
        </CanvasXGlass>
      </div>

      {/* Minimap: bottom-right of the canvas */}
      <div style={{
        position: "absolute", bottom: 16, right: 1200 - CANVASX_CANVAS_R + 16, width: CANVASX_MINIMAP.w, height: CANVASX_MINIMAP.h,
        borderRadius: tokens.radius.md, background: pal.bgElevated, overflow: "hidden", zIndex: 4,
        boxShadow: `0 0 0 1px ${pal.borderSubtle}, 0 4px 16px ${pal.shadow}`,
        transition: `background ${motion.smooth} ${motion.easeInOut}, box-shadow ${motion.smooth} ${motion.easeInOut}`,
      }}>
        {Object.keys(CANVASX_NODES).map(id => (
          <div key={id} style={{
            position: "absolute", ...mini({ ...CANVASX_NODES[id], h: nodeH(id) }), borderRadius: 2,
            background: id === selected ? pal.accentBg : pal.bgMuted,
            boxShadow: `0 0 0 1px ${id === selected ? pal.accent : pal.border}`,
            transition: `background ${motion.smooth} ${motion.easeInOut}, box-shadow ${motion.smooth} ${motion.easeInOut}`,
          }} />
        ))}
        <div style={{
          position: "absolute", left: miniOff.x, top: miniOff.y, width: miniInner.w, height: miniInner.h, boxSizing: "border-box",
          border: `1px solid ${pal.accent}`, borderRadius: 3, transition: hairlineT,
        }} />
      </div>

      {/* Top bar */}
      <div style={{
        position: "absolute", left: 0, right: 0, top: 0, height: CANVASX_TOPBAR_H, boxSizing: "border-box",
        display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 12px 0 8px",
        background: pal.bgElevated, borderBottom: hairline, zIndex: 6,
        transition: `background ${motion.smooth} ${motion.easeInOut}, ${hairlineT}`,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <IconButton icon="←" size={32} theme={theme} label="Back" style={{ fontSize: 15 }} />
          <Text size="base" weight="semibold" theme={theme}>Support triage</Text>
          <Badge theme={theme} style={{ marginLeft: 4 }}><StatusDot status="busy" size={6} theme={theme} />Environment · Staging</Badge>
        </div>
        <div style={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%, -50%)", width: 200 }}>
          <SegmentedControl options={["Build", "Simulate"]} value={mode} onChange={setMode} theme={theme} />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Button variant="secondary" size="sm" icon="▷" theme={theme}>Test</Button>
          <SplitButton size="sm" theme={theme} items={CANVASX_PUBLISH_ITEMS}>Publish</SplitButton>
        </div>
      </div>

      {/* Right panel: global settings */}
      <CanvasXPanel theme={theme} style={{ right: CANVASX_INSET, top: CANVASX_TOPBAR_H + CANVASX_INSET, bottom: CANVASX_INSET, width: CANVASX_PANEL_W, zIndex: 5 }}>
        <div style={{ padding: "4px 8px 0" }}>
          <Tabs tabs={["Global settings", "Node settings"]} value={rightTab} onChange={setRightTab} theme={theme} />
        </div>
        <div style={{ flex: 1, minHeight: 0, padding: "0 16px", overflow: "hidden" }}>
          <Accordion defaultOpen={0} items={CANVASX_SETTINGS} theme={theme} />
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", borderTop: hairline, transition: hairlineT }}>
          <Text size="xs" mono secondary theme={theme}>$0.03 / run</Text>
          <Text size="xs" mono secondary theme={theme}>1.2s to 1.8s</Text>
          <Text size="xs" mono secondary theme={theme}>2.3k to 3.2k tokens</Text>
        </div>
      </CanvasXPanel>
    </div>
  );
}
// EXAMPLE: CanvasParadigmExample

const PARADIGM_STAGE = { w: 1200, h: 760 };

const PARADIGM_EXAMPLE_COMPONENTS = { ChatParadigmExample, CanvasParadigmExample };

// Live thumbnail: the full screen rendered at stage size and scaled to fit
// the column. Non-interactive; tapping opens it full-screen.
function ParadigmPreview({ paradigm, theme, onOpen }) {
  const pal = usePal(theme);
  const { isMobile } = useViewport();
  const ref = useRef(null);
  const [scale, setScale] = useState(0.5);
  const [hover, setHover] = useState(false);
  useEffect(() => {
    const measure = () => { if (ref.current) setScale(ref.current.clientWidth / PARADIGM_STAGE.w); };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);
  const Example = PARADIGM_EXAMPLE_COMPONENTS[paradigm.example];
  return (
    <div ref={ref} role="button" tabIndex={0} aria-label={`Expand the ${paradigm.title} example`}
      onClick={onOpen} onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onOpen(); } }}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        position: "relative", width: "100%", height: Math.round(PARADIGM_STAGE.h * scale),
        borderRadius: tokens.radius.lg, overflow: "hidden", cursor: "zoom-in",
        border: `1px solid ${pal.borderSubtle}`, background: pal.bgSubtle,
        boxShadow: hover ? `0 16px 48px ${pal.shadowLg}` : `0 2px 8px ${pal.shadow}`,
        transform: hover ? "translateY(-2px)" : "translateY(0)",
        transition: `box-shadow ${motion.smooth} ${motion.emphasized}, transform ${motion.smooth} ${motion.emphasized}, border-color ${motion.smooth} ${motion.easeInOut}`,
      }}>
      <div style={{
        position: "absolute", top: 0, left: 0, width: PARADIGM_STAGE.w, height: PARADIGM_STAGE.h,
        transform: `scale(${scale})`, transformOrigin: "top left", pointerEvents: "none",
      }}>
        {Example && <Example theme={theme} />}
      </div>
      <div style={{
        position: "absolute", right: 14, bottom: 14,
        opacity: hover || isMobile ? 1 : 0, transform: hover || isMobile ? "translateY(0)" : "translateY(4px)",
        transition: `opacity ${motion.normal} ${motion.easeOut}, transform ${motion.normal} ${motion.emphasized}`,
      }}>
        <Button theme={theme} variant="primary" size="sm" icon="⤢">Expand</Button>
      </div>
    </div>
  );
}

// Full-screen layer for an example screen. Esc or Close returns to the page.
function ParadigmFullscreen({ paradigm, theme, onClose }) {
  const pal = usePal(theme);
  const { isMobile, width } = useViewport();
  // Phones: the whole 1200×760 screen scaled to the window width (zoomed-out,
  // fully visible) instead of a 1000px-wide horizontally scrolling stage.
  const fitScale = isMobile ? Math.max(0.2, (width - 18) / PARADIGM_STAGE.w) : 1;
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", onKey); document.body.style.overflow = prev; };
  }, [onClose]);
  const Example = PARADIGM_EXAMPLE_COMPONENTS[paradigm.example];
  return (
    <div onClick={onClose} style={{
      position: "fixed", inset: 0, zIndex: 10002, padding: isMobile ? 8 : 24,
      background: "rgba(0,0,0,0.45)", backdropFilter: "blur(6px)", WebkitBackdropFilter: "blur(6px)",
      display: "flex", fontFamily: tokens.font.sans,
      animation: `halaska-fade-in ${motion.normal} ${motion.easeOut} both`,
    }}>
      <div role="dialog" aria-modal="true" aria-label={`${paradigm.title} example`} onClick={(e) => e.stopPropagation()} style={{
        flex: 1, minWidth: 0, display: "flex", flexDirection: "column", overflow: "hidden",
        background: pal.bg, borderRadius: tokens.radius.xl,
        border: `1px solid ${theme === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)"}`,
        boxShadow: `0 24px 80px rgba(0,0,0,0.35)`,
        animation: `halaska-scale-in ${motion.smooth} ${motion.emphasized} both`,
      }}>
        <div style={{
          height: 48, flexShrink: 0, display: "flex", alignItems: "center", gap: 14, padding: "0 12px 0 16px",
          background: pal.bgElevated, borderBottom: `1px solid ${pal.borderSubtle}`,
          transition: `all ${motion.smooth} ${motion.easeInOut}`,
        }}>
          <Text size="sm" weight="semibold" theme={theme}>{paradigm.title}</Text>
          {!isMobile && <Text size="sm" theme={theme} style={{ color: pal.textSecondary, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", flex: 1 }}>{paradigm.body}</Text>}
          {isMobile && <span style={{ flex: 1 }} />}
          {!isMobile && <Caption theme={theme}>Built entirely from the kit</Caption>}
          {!isMobile && <Kbd theme={theme}>Esc</Kbd>}
          <IconButton theme={theme} icon="⤡" size={32} variant="secondary" label="Contract" onClick={onClose} style={{ fontSize: 15 }} />
        </div>
        <div style={{ flex: 1, minHeight: 0, overflow: "auto", background: pal.bgSubtle }}>
          {isMobile ? (
            <div style={{ width: PARADIGM_STAGE.w * fitScale, height: PARADIGM_STAGE.h * fitScale, position: "relative", margin: "0 auto" }}>
              <div style={{ position: "absolute", top: 0, left: 0, width: PARADIGM_STAGE.w, height: PARADIGM_STAGE.h, transform: `scale(${fitScale})`, transformOrigin: "top left" }}>
                {Example && <Example theme={theme} />}
              </div>
            </div>
          ) : (
            <div style={{ minWidth: 1000, height: "100%", position: "relative" }}>
              {Example && <Example theme={theme} />}
            </div>
          )}
        </div>
      </div>
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
  // Agentic control: consent
  PlanPreviewPattern,
  ApprovalCardPattern,
  AutonomyPattern,
  PermissionScopePattern,
  QueuePattern,
  // Agentic control: visibility
  AgentStatusPattern,
  ToolStreamPattern,
  AgentTasksPattern,
  HandoffPattern,
  // Agentic control: accountability
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

// The pattern mark: a small stroked circle. One per pattern in group headers,
// one in front of each pattern title.
function PatternDot({ theme, style: sp }) {
  const pal = usePal(theme);
  return (
    <span aria-hidden="true" style={{
      width: 8, height: 8, borderRadius: 4, flexShrink: 0, display: "inline-block",
      border: `1px solid ${pal.textTertiary}`, transition: `border-color ${motion.smooth} ${motion.easeInOut}`, ...sp,
    }} />
  );
}

function PatternHeader({ n, title, desc, theme }) {
  const pal = usePal(theme);
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: 14, paddingLeft: 8, fontFamily: tokens.font.sans }}>
      <PatternDot theme={theme} style={{ marginTop: 6 }} />
      <div>
        <span style={{ ...tokens.type.base, fontWeight: tokens.weight.semibold, color: theme === "dark" ? "#888" : "#777", display: "block", transition: `color ${motion.smooth} ${motion.easeInOut}` }}>{title}</span>
        <span style={{ ...tokens.type.sm, color: theme === "dark" ? "#555" : "#bbb", display: "block", marginTop: 2, transition: `color ${motion.smooth} ${motion.easeInOut}` }}>{desc}</span>
      </div>
    </div>
  );
}

function PatternGroupHeader({ index, title, blurb, count, theme }) {
  const pal = usePal(theme);
  const { isMobile } = useViewport();
  return (
    <div style={{ paddingLeft: 8, paddingTop: isMobile ? 32 : 64, fontFamily: tokens.font.sans }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
        <Heading level={4} theme={theme} style={{ margin: 0 }}>{title}</Heading>
        <span aria-label={`${count} patterns`} style={{ display: "inline-flex", gap: 4, alignItems: "center" }}>
          {Array.from({ length: count }, (_, i) => <PatternDot key={i} theme={theme} />)}
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
  const { isMobile } = useViewport();
  const [replayKeys, setReplayKeys] = useState({});
  const [openParadigm, setOpenParadigm] = useState(null);
  const closeParadigm = useCallback(() => setOpenParadigm(null), []);
  const bump = (id) => setReplayKeys(k => ({ ...k, [id]: (k[id] || 0) + 1 }));
  return (
    <Stack gap={isMobile ? 48 : 64}>
      <BeforeAfterSection theme={theme} />

      {/* Two UX paradigms: each a complete example screen built from the kit */}
      <div style={{ paddingLeft: 8 }}>
        <Caption theme={theme}>Two UX paradigms</Caption>
        <Text size="sm" theme={theme} style={{ color: pal.textSecondary, display: "block", marginTop: 6, maxWidth: 560 }}>
          Most AI products end up as one of these, or both. Each example below is a complete screen built only from the components and patterns on this page. Tap one to expand it.
        </Text>
      </div>
      {UX_PARADIGMS.map(p => (
        <div key={p.id} id={`paradigm-${p.id}`} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ paddingLeft: 8, display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 24, flexWrap: "wrap" }}>
            <div style={{ maxWidth: 520 }}>
              <Heading level={3} theme={theme} style={{ margin: 0 }}>{p.title}</Heading>
              <Text size="sm" theme={theme} style={{ color: pal.textSecondary, display: "block", marginTop: 6, lineHeight: 1.65 }}>{p.body}</Text>
            </div>
            <Stack direction="row" gap={6} wrap>
              {p.groups.map(gid => {
                const g = PATTERN_GROUPS.find(x => x.id === gid);
                return g ? (
                  <Chip key={gid} theme={theme} onToggle={() => { const el = document.getElementById(gid); if (el) { const y = el.getBoundingClientRect().top + window.scrollY - 32; window.scrollTo({ top: y, behavior: "smooth" }); } }}>
                    {g.title}
                  </Chip>
                ) : null;
              })}
            </Stack>
          </div>
          <ParadigmPreview paradigm={p} theme={theme} onOpen={() => setOpenParadigm(p)} />
        </div>
      ))}
      {openParadigm && <ParadigmFullscreen paradigm={openParadigm} theme={theme} onClose={closeParadigm} />}

      {PATTERN_GROUPS.map((group, gi) => (
        <div key={group.id} id={group.id} style={{ display: "flex", flexDirection: "column", gap: isMobile ? 40 : 56 }}>
          <PatternGroupHeader index={gi} title={group.title} blurb={group.blurb} count={group.patterns.length} theme={theme} />
          {group.patterns.map(pat => {
            const Component = PATTERN_COMPONENTS[pat.component];
            return (
              <div key={pat.id} id={pat.id} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <PatternHeader n={pat.n} title={pat.title} desc={pat.desc} theme={theme} />
                <ShowcaseCard theme={theme} height={pat.height} align="top"
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
      <ShowcaseCard theme={theme} label="Roadmap" align="top">
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
  { id: "cat-foundations", label: "Foundations",        demos: ["DemoTypography", "DemoMotion", "DemoButtons"] },
  { id: "cat-inputs",      label: "Inputs & Selectors", demos: ["DemoFormInputs", "DemoTogglesSelections", "DemoFormExtras", "DemoInputsExtended"] },
  { id: "cat-navigation",  label: "Navigation & Menus", demos: ["DemoNavigation"] },
  { id: "cat-overlays",    label: "Overlays",           demos: ["DemoOverlays"] },
  { id: "cat-feedback",    label: "Feedback & Status",  demos: ["DemoFeedbackStatus", "DemoAlerts"] },
  { id: "cat-data",        label: "Data Display",       demos: ["DemoDataDisplay", "DemoTable"] },
  { id: "cat-ai",          label: "AI Elements",        demos: ["DemoAIElements"] },
  { id: "cat-dev",         label: "Dev Surfaces",       demos: ["DemoDevSurfaces"] },
];

const COMPONENT_GROUPS = COMPONENT_CATEGORIES;

// The text behind the "Copy Install Prompt" buttons: paste it into
// Claude Code (or any coding agent) to wire the kit into a project.
// The raw kit file is served from the deployed site (public/ copy, kept
// in sync by the prebuild script in package.json).
const INSTALL_PROMPT = `Set up Halaska Kit in this project and use it for all UI from now on.

Halaska Kit is a single-file React UI kit for AI products by Halaska (https://halaska.com). One file gives you 38 UX patterns + ~100 styled components with inline styles: no Tailwind, no CSS setup, no config. Deps: react and react-dom only, no chart library. Fonts (Geist) and keyframes self-inject on import. The file starts with "use client", so it's safe in Next.js app router.

Before writing code, read the API reference: https://ui.halaska.com/llms.txt

SETUP
1. Download the kit into the source directory (src/ or this framework's equivalent):
   curl -o src/halaska-kit.jsx https://ui.halaska.com/halaska-kit.jsx
   TypeScript project? Also: curl -o src/halaska-kit.d.ts https://ui.halaska.com/halaska-kit.d.ts
   (If the URL is unreachable, ask me to provide the file.)
2. Verify: render <Button variant="primary">Test</Button> from a named import. It should be Geist type on a dark, rounded button. Then remove the test.

USAGE
- Named imports for everything: import { Button, Card, Orb, PlanPreviewPattern, usePal, tokens } from "./halaska-kit";
- Theming: every component accepts theme="light" | "dark", or wrap a subtree in <ThemeProvider theme="dark">. Colors come from usePal(theme) (pal.bg, pal.text, pal.textSecondary, pal.accent, pal.success, pal.danger…). Never hardcode grays or brand colors. Change the accent with <AccentContext.Provider value="#8b5cf6">.
- Layout: <Stack gap={16} direction="row"> plus tokens.space / tokens.radius / tokens.type. Motion: the motion object has durations (fast/normal/smooth/spring/slow) and easings (easeInOut/easeOut/emphasized/springCurve).
- If the project uses Tailwind, keep it for page layout. Kit components carry their own styles and need no classes.

IF THIS PROJECT ALREADY HAS UI (most likely), RETROFIT IT
This is a skin and UX pass, not a rewrite. Keep routing, state, and data. Work one screen at a time and finish each before starting the next:
a. Swap raw or ad-hoc elements for kit equivalents: buttons → Button/IconButton, inputs → TextInput/TextArea/Select/SwitchToggle/Checkbox, cards → Card + CardHeader, labels/tags → Badge/Tag/StatusBadge, tables → Table/DataTable, modals → Dialog/Sheet, menus → DropdownMenu/CommandPalette, loading → Skeleton/Spinner/ThinkingIndicator, empty screens → EmptyState, toasts → Toast/AlertBanner.
b. Replace hardcoded colors, radii, spacing, and fonts with usePal(theme), tokens.radius, tokens.space, tokens.font.
c. Wherever the product has an AI or agent moment, use the matching pattern instead of a spinner or toast: agent thinking → ThinkingTracePattern, streamed reply → StreamingAnswerPattern, chat surface → AgentChatPattern, before the agent acts → PlanPreviewPattern or ApprovalCardPattern, while it works → AgentStatusPattern + ToolStreamPattern, after it acts → ActionReceiptPattern, when it fails → ErrorRepairPattern, handing off to a human → HandoffPattern.
d. The lifecycle patterns take props, so use them directly with this product's copy, data, and callbacks: ThinkingTracePattern, StreamingAnswerPattern, PlanPreviewPattern, ApprovalCardPattern, AgentStatusPattern, HandoffPattern, ActionReceiptPattern, ErrorRepairPattern (props and shapes are in llms.txt; every prop has a demo default, so start with none and override what matters). The remaining patterns are demo-driven: copy the source out of halaska-kit.jsx, swap the data, keep the structure, states, and motion.
e. When every screen is done, give me a short summary of what changed per screen.

WHAT'S IN THE KIT (all named exports; props are in llms.txt)
- UX patterns, conversation: PromptInputPattern, MessageThreadPattern, StreamingAnswerPattern, AgentChatPattern, CodeBlockPattern, ModelContextPattern
- UX patterns, trust: ThinkingTracePattern, CitationsPattern, ContextSourcesPattern, ConfidencePattern, RecommendationPattern, FeedbackPattern
- UX patterns, agentic control: PlanPreviewPattern, ApprovalCardPattern, AutonomyPattern, PermissionScopePattern, QueuePattern, AgentStatusPattern, ToolStreamPattern, AgentTasksPattern, HandoffPattern, ActionReceiptPattern, CheckpointPattern, AuditLogPattern, ErrorRepairPattern
- UX patterns, output: ArtifactPattern, DiffViewPattern, DiffTablePattern, StructuredDataPattern, InsightCardsPattern, ComparisonPattern
- UX patterns, ambient: TaskboardPattern, InlineAssistPattern, NudgePattern, DigestPattern, NotificationCenterPattern, CommandSearchPattern, AgentSetupPattern
- AI elements: Orb (variants pulse/orbit/sweep/globe/spark, pill option), StreamingText, ThinkingIndicator, ThinkingSteps, ConfidenceBar, AISuggestionBadge, BeforeAfterToggle, ZoomControl, AgentGlyph
- Components: Text, Heading, Label, Caption, Code, Button, IconButton, ButtonGroup, LinkButton, SplitButton, TextInput, TextArea, Select, Checkbox, Radio, RadioGroup, SwitchToggle, Slider, SpringSlider, SpringToggle, SegmentedControl, InputOTP, InputGroup, Combobox, Calendar, DatePicker, Chip, Toggle, ToggleGroup, SearchInput, Choicebox, CopyInput, Rating, Card, CardHeader, Divider, Stack, Badge, Tag, StatusBadge, StatusDot, Avatar, AvatarGroup, ListItem, Stat, Table, DataTable, ScrollArea, Pagination, MiddleTruncate, Kbd, Progress, ProgressCircle, Skeleton, Spinner, Toast, AlertBanner, EmptyState, Stepper, Breadcrumb, Tabs, SubtleTabs, Accordion, Collapsible, ContextMenu, Menubar, CommandPalette, CommandMenu, Dialog, AlertDialog, FormDialog, CardDialog, Sheet, Popover, DropdownMenu, Tooltip, HoverCard, Snippet, FileTree, BrowserFrame, Sparkline

RULES
- Prefer a kit pattern over building a flow from scratch, and a kit component over raw HTML.
- Follow the kit's design heuristics: show what the agent is doing (Orb, AgentStatusPattern); consent before consequential actions (PlanPreviewPattern, ApprovalCardPattern); undo over confirmation dialogs (ActionReceiptPattern); recognition over recall (DigestPattern, AuditLogPattern, not transcript archaeology); calm error recovery (ErrorRepairPattern). Full list: https://ui.halaska.com`;

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
// grows as the viewport approaches it: a camera-lens / timeline feel.
// Replaces the old action-bar dropdowns for UX Patterns and UI Components.

const RAIL_ROWS = [
  { type: "label", text: "Paradigms" },
  ...UX_PARADIGMS.map(p => ({ type: "tick", id: `paradigm-${p.id}`, label: p.title })),
  { type: "label", text: "Patterns" },
  ...PATTERN_GROUPS.map(g => ({ type: "tick", id: g.id, label: g.title })),
  { type: "label", text: "Components" },
  ...COMPONENT_CATEGORIES.map(c => ({ type: "tick", id: c.id, label: c.label })),
];

const RAIL_TICKS = RAIL_ROWS.filter(r => r.type === "tick");

// ─── BOTTOM-LEFT DOCK ─────────────────────────────────────────
// BETA chip + Feedback pill above the studio note. The note starts condensed
// and re-opens whenever the install prompt is copied.

const SUBMIT_ENDPOINT = "/api/submit";
const REVIEW_KEY = "halaska:review-sent";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Showcase-only session memory (never in the kit's components).
const kitSession = {
  get(k) { try { return window.sessionStorage.getItem(k); } catch (e) { return null; } },
  set(k, v) { try { window.sessionStorage.setItem(k, v); } catch (e) { /* private mode */ } },
};
async function kitSubmit(payload) {
  const r = await fetch(SUBMIT_ENDPOINT, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
  if (!r.ok) throw new Error(`submit ${r.status}`);
  return r.json().catch(() => ({}));
}

// Studio hook: a calm card with a two-field form. Appears after the
// paradigms and again at the very end of the page (with the credit line).
function StudioHookCard({ theme, credit }) {
  const pal = usePal(theme);
  const { isMobile } = useViewport();
  const [url, setUrl] = useState("");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({});
  const [state, setState] = useState(() => (kitSession.get(REVIEW_KEY) ? "done" : "idle"));
  const submit = async () => {
    const next = {};
    let link = url.trim();
    if (link && !/^https?:\/\//i.test(link)) link = `https://${link}`;
    if (!link || !/^https?:\/\/[^\s.]+\.[^\s]+$/i.test(link)) next.url = "Enter the link to your prototype.";
    if (!EMAIL_RE.test(email.trim())) next.email = "Enter a valid email.";
    setErrors(next);
    if (Object.keys(next).length) return;
    setState("sending");
    try {
      await kitSubmit({ kind: "review", url: link, email: email.trim(), page: window.location.href });
      kitSession.set(REVIEW_KEY, "1");
      setState("done");
    } catch (e) {
      setState("idle");
      setErrors({ email: "Couldn't send just now. Try again, or email the studio directly." });
    }
  };
  return (
    <Card theme={theme} padding={isMobile ? 20 : 32} style={{ width: "100%" }}>
      <Stack gap={isMobile ? 16 : 20}>
        <div>
          <Heading level={3} theme={theme} style={{ margin: 0 }}>Need a hand with yours?</Heading>
          <Text size="base" theme={theme} style={{ color: pal.textSecondary, display: "block", marginTop: 8, lineHeight: 1.65, maxWidth: 620 }}>
            If you'd rather have a designer take it from here, that's what <StudioLink theme={theme}>Halaska Studio</StudioLink> does. Send us a link to your prototype and we'll reply with the three things we'd change first.
          </Text>
        </div>
        {credit && (
          <Text size="sm" theme={theme} style={{ color: pal.textTertiary, display: "block" }}>From the team behind product design at Retell AI and Pascal.</Text>
        )}
        {state === "done" ? (
          <Text size="base" theme={theme} style={{ display: "block" }}>Got it. We'll reply within two working days.</Text>
        ) : (
          <div style={{ display: "flex", gap: 12, flexDirection: isMobile ? "column" : "row", alignItems: isMobile ? "stretch" : "flex-end" }}>
            <TextInput theme={theme} label="Prototype URL" placeholder="https://your-prototype.vercel.app" value={url}
              onChange={(v) => { setUrl(v); setErrors(e => ({ ...e, url: undefined })); }} error={errors.url} style={{ flex: "1.4 1 0" }} />
            <TextInput theme={theme} label="Email" type="email" placeholder="you@company.com" value={email}
              onChange={(v) => { setEmail(v); setErrors(e => ({ ...e, email: undefined })); }} error={errors.email} style={{ flex: "1 1 0" }} />
            <Button theme={theme} variant="primary" loading={state === "sending"} onClick={submit}
              style={{ flexShrink: 0, marginBottom: errors.url || errors.email ? 22 : 0 }}>Send it over</Button>
          </div>
        )}
        <Text size="sm" theme={theme} style={{ color: pal.textTertiary, display: "block" }}>
          Reviewed by the studio, not an agent. No newsletter, no sales call unless you ask for one.
        </Text>
      </Stack>
    </Card>
  );
}

// Before/after comparison: both views fill one box, the After is clipped to
// the right of a divider you drag. Pointer, touch, and arrow keys.
function CompareSlider({ before, after, theme: tp, initial = 0.5, labels = ["Before", "After"], style: sp }) {
  const ctx = useThemeContext(); const theme = tp || ctx; const pal = usePal(theme);
  const ref = useRef(null);
  const [pos, setPos] = useState(initial);
  const [dragging, setDragging] = useState(false);
  const setFromX = useCallback((clientX) => {
    const r = ref.current ? ref.current.getBoundingClientRect() : null;
    if (r && r.width) setPos(Math.min(1, Math.max(0, (clientX - r.left) / r.width)));
  }, []);
  // Listeners attach in the down handler itself (not in an effect) so the
  // first move after the press is never missed; they detach on release.
  const stopRef = useRef(null);
  const startDrag = useCallback((clientX) => {
    setDragging(true); setFromX(clientX);
    const move = (e) => setFromX(e.touches ? e.touches[0].clientX : e.clientX);
    const up = () => { setDragging(false); stop(); };
    const stop = () => {
      window.removeEventListener("mousemove", move); window.removeEventListener("mouseup", up);
      window.removeEventListener("touchmove", move); window.removeEventListener("touchend", up);
      stopRef.current = null;
    };
    window.addEventListener("mousemove", move); window.addEventListener("mouseup", up);
    window.addEventListener("touchmove", move, { passive: true }); window.addEventListener("touchend", up);
    stopRef.current = stop;
  }, [setFromX]);
  useEffect(() => () => { if (stopRef.current) stopRef.current(); }, []);
  const onKey = (e) => {
    if (e.key === "ArrowLeft") { e.preventDefault(); setPos(p => Math.max(0, p - 0.05)); }
    else if (e.key === "ArrowRight") { e.preventDefault(); setPos(p => Math.min(1, p + 0.05)); }
    else if (e.key === "Home") { e.preventDefault(); setPos(0); }
    else if (e.key === "End") { e.preventDefault(); setPos(1); }
  };
  const pct = pos * 100;
  const isDark = theme === "dark";
  const tag = (text, side, visible) => (
    <span aria-hidden="true" style={{
      position: "absolute", top: 12, [side]: 12, zIndex: 3, pointerEvents: "none",
      padding: "4px 10px", borderRadius: tokens.radius.pill,
      background: isDark ? "rgba(20,20,20,0.8)" : "rgba(255,255,255,0.88)",
      backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)",
      boxShadow: `0 0 0 1px ${pal.borderSubtle}`,
      fontFamily: tokens.font.mono, fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase",
      color: pal.textSecondary, opacity: visible ? 1 : 0,
      transition: `opacity ${motion.normal} ${motion.easeInOut}`,
    }}>{text}</span>
  );
  return (
    <div ref={ref}
      onMouseDown={(e) => { e.preventDefault(); startDrag(e.clientX); }}
      onTouchStart={(e) => startDrag(e.touches[0].clientX)}
      style={{
        position: "relative", width: "100%", borderRadius: tokens.radius.lg, overflow: "hidden",
        cursor: dragging ? "grabbing" : "col-resize", userSelect: "none", WebkitUserSelect: "none", touchAction: "pan-y",
        fontFamily: tokens.font.sans, ...sp,
      }}>
      <div style={{ position: "relative" }}>{before}</div>
      <div style={{
        position: "absolute", inset: 0, clipPath: `inset(0 0 0 ${pct}%)`,
        transition: dragging ? "none" : `clip-path ${motion.fast} ${motion.easeOut}`,
      }}>{after}</div>
      {tag(labels[0], "left", pos > 0.14)}
      {tag(labels[1], "right", pos < 0.86)}
      {/* Divider + handle */}
      <div style={{
        position: "absolute", top: 0, bottom: 0, left: `${pct}%`, width: 2, marginLeft: -1, zIndex: 2,
        background: isDark ? "rgba(255,255,255,0.85)" : "#fff",
        boxShadow: "0 0 0 1px rgba(0,0,0,0.15), 0 0 12px rgba(0,0,0,0.25)",
        transition: dragging ? "none" : `left ${motion.fast} ${motion.easeOut}`,
      }} />
      <button role="slider" aria-label={`Compare ${labels[0]} and ${labels[1]}`} aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(pct)}
        onKeyDown={onKey}
        style={{
          ...interactiveBase, position: "absolute", top: "50%", left: `${pct}%`, zIndex: 3,
          width: 40, height: 40, marginLeft: -20, marginTop: -20, borderRadius: 20, padding: 0,
          background: isDark ? "#1c1c1c" : "#fff", color: pal.text,
          boxShadow: "0 0 0 1px rgba(0,0,0,0.12), 0 6px 16px rgba(0,0,0,0.25)",
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: dragging ? "grabbing" : "grab",
          transform: dragging ? "scale(1.06)" : "scale(1)",
          transition: dragging ? "transform 0.1s ease" : `left ${motion.fast} ${motion.easeOut}, transform ${motion.fast} ${motion.easeOut}`,
        }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M9 7l-5 5 5 5" /><path d="M15 7l5 5-5 5" />
        </svg>
      </button>
    </div>
  );
}

// A 1200×760 example screen scaled to the column, non-interactive.
function LiveStage({ scale, theme, children }) {
  const pal = usePal(theme);
  return (
    <div style={{ position: "relative", width: "100%", height: Math.round(PARADIGM_STAGE.h * scale), overflow: "hidden", background: pal.bgSubtle, border: `1px solid ${pal.borderSubtle}` }}>
      <div style={{ position: "absolute", top: 0, left: 0, width: PARADIGM_STAGE.w, height: PARADIGM_STAGE.h, transform: `scale(${scale})`, transformOrigin: "top left", pointerEvents: "none" }}>
        {children}
      </div>
    </div>
  );
}

// Before and after: the Chat screen as an agent left it, then with the kit.
function BeforeAfterSection({ theme }) {
  const pal = usePal(theme);
  const ref = useRef(null);
  const [scale, setScale] = useState(0.5);
  useEffect(() => {
    const measure = () => { if (ref.current) setScale(ref.current.clientWidth / PARADIGM_STAGE.w); };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);
  return (
    <div id="before-after" style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ paddingLeft: 8 }}>
        <Caption theme={theme}>Before and after</Caption>
        <Text size="sm" theme={theme} style={{ color: pal.textSecondary, display: "block", marginTop: 6, maxWidth: 560 }}>
          The same screen as a coding agent left it, and after the kit was applied.
        </Text>
      </div>
      <div ref={ref}>
        <CompareSlider theme={theme}
          before={<LiveStage scale={scale} theme={theme}><ChatParadigmBefore theme={theme} /></LiveStage>}
          after={<LiveStage scale={scale} theme={theme}><ChatParadigmExample theme={theme} /></LiveStage>} />
      </div>
      <Text size="sm" theme={theme} style={{ color: pal.textTertiary, display: "block", textAlign: "center" }}>
        Drag the handle. Same components, same data. Only the kit changed.
      </Text>
    </div>
  );
}

// ─── Chat paradigm · BEFORE (first-pass agent build, no design kit) ─────────
// Same content and regions as ChatParadigmExample, rendered with plain HTML
// and browser defaults. Reuses the CHATX_* constants so the copy is identical.

const CHATB_FONT = "Inter, ui-sans-serif, system-ui, -apple-system, sans-serif";

// Tailwind default palette, as an AI first pass would reach for it.
const CHATB_C = {
  white: "#ffffff",
  gray50: "#f9fafb", gray100: "#f3f4f6", gray200: "#e5e7eb", gray300: "#d1d5db",
  gray400: "#9ca3af", gray500: "#6b7280", gray700: "#374151", gray900: "#111827",
  blue50: "#eff6ff", blue500: "#3b82f6", blue600: "#2563eb",
  green500: "#22c55e", yellow100: "#fef9c3", yellow800: "#854d0e",
};

const CHATB_SHADOW = "0 1px 2px rgba(0,0,0,0.05)";

const CHATB_SUGGESTIONS = [
  "What's open with Acme?",
  "Close tickets idle over 30 days",
  "Summarize overnight tickets",
];

const CHATB_BTN = {
  fontFamily: CHATB_FONT, fontSize: 14, fontWeight: 500, lineHeight: "20px",
  padding: "8px 16px", borderRadius: 6, cursor: "pointer", whiteSpace: "nowrap",
};
const CHATB_BTN_PRIMARY = { ...CHATB_BTN, background: CHATB_C.blue500, color: CHATB_C.white, border: "1px solid " + CHATB_C.blue500 };
const CHATB_BTN_SECONDARY = { ...CHATB_BTN, background: CHATB_C.white, color: CHATB_C.gray700, border: "1px solid " + CHATB_C.gray300 };

const CHATB_FIELD = {
  fontFamily: CHATB_FONT, fontSize: 14, lineHeight: "20px", color: CHATB_C.gray900,
  background: CHATB_C.white, border: "1px solid " + CHATB_C.gray300, borderRadius: 6,
  padding: "8px 12px", boxSizing: "border-box",
};

const CHATB_PILL = {
  display: "inline-block", fontFamily: CHATB_FONT, fontSize: 12, lineHeight: "16px",
  padding: "4px 10px", borderRadius: 9999, background: CHATB_C.gray100,
  border: "1px solid " + CHATB_C.gray200, color: CHATB_C.gray700, whiteSpace: "nowrap",
};

function ChatBButton({ variant, onClick, style, children }) {
  const base = variant === "primary" ? CHATB_BTN_PRIMARY : CHATB_BTN_SECONDARY;
  return <button type="button" onClick={onClick} style={{ ...base, ...style }}>{children}</button>;
}

function ChatBModelSelect({ value, onChange, style }) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)} style={{ ...CHATB_FIELD, cursor: "pointer", ...style }}>
      {CHATX_MODELS.map(m => <option key={m.id} value={m.id}>{m.label}</option>)}
    </select>
  );
}

function ChatBSectionLabel({ children, style }) {
  return (
    <div style={{ fontSize: 12, fontWeight: 500, color: CHATB_C.gray500, textTransform: "uppercase", letterSpacing: "0.05em", ...style }}>
      {children}
    </div>
  );
}

function ChatParadigmBefore({ theme }) {
  const [activeThread, setActiveThread] = useState(CHATX_THREADS[0].id);
  const [model, setModel] = useState(CHATX_MODELS[0].id);
  const [search, setSearch] = useState("");
  const [draft, setDraft] = useState("");
  const [choice, setChoice] = useState("");
  const activeTitle = (CHATX_THREADS.find(t => t.id === activeThread) || CHATX_THREADS[0]).title;
  const visibleThreads = CHATX_THREADS.filter(t => t.title.toLowerCase().includes(search.trim().toLowerCase()));

  return (
    <div style={{
      position: "relative", width: "100%", height: "100%", overflow: "hidden",
      background: CHATB_C.white, color: CHATB_C.gray900, fontFamily: CHATB_FONT, fontSize: 14, lineHeight: "20px",
      display: "flex",
    }}>
      {/* Sidebar */}
      <div style={{
        width: 260, flexShrink: 0, display: "flex", flexDirection: "column",
        background: CHATB_C.gray50, borderRight: "1px solid " + CHATB_C.gray200, boxSizing: "border-box",
      }}>
        <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ fontSize: 16, fontWeight: 600, lineHeight: "24px" }}>✨ Alpha</div>
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search threads" style={{ ...CHATB_FIELD, width: "100%" }} />
          <ChatBButton variant="primary" onClick={() => {}} style={{ width: "100%" }}>New thread</ChatBButton>
        </div>

        <div style={{ flex: 1, minHeight: 0, overflow: "auto", padding: "0 8px 8px" }}>
          <ChatBSectionLabel style={{ padding: "8px 8px 4px" }}>Recent</ChatBSectionLabel>
          {visibleThreads.map(t => {
            const active = t.id === activeThread;
            return (
              <button key={t.id} type="button" onClick={() => setActiveThread(t.id)}
                style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8,
                  width: "100%", padding: "8px 12px", borderRadius: 6, border: "none", cursor: "pointer", textAlign: "left",
                  background: active ? CHATB_C.gray100 : "transparent",
                  fontFamily: CHATB_FONT, fontSize: 14, lineHeight: "20px",
                  color: active ? CHATB_C.gray900 : CHATB_C.gray700, fontWeight: active ? 500 : 400,
                }}>
                <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{t.title}</span>
                <span style={{ fontSize: 12, color: CHATB_C.gray400, flexShrink: 0 }}>{t.time}</span>
              </button>
            );
          })}
        </div>

        <div style={{
          display: "flex", alignItems: "center", gap: 12, padding: "12px 16px",
          borderTop: "1px solid " + CHATB_C.gray200,
        }}>
          <div style={{
            width: 32, height: 32, borderRadius: 9999, background: CHATB_C.gray300, color: CHATB_C.gray700,
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 500, flexShrink: 0,
          }}>SK</div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>Sam Keller</div>
            <div style={{ fontSize: 12, color: CHATB_C.gray500 }}>Team</div>
          </div>
        </div>
      </div>

      {/* Main column */}
      <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>
        {/* Top bar */}
        <div style={{
          display: "flex", alignItems: "center", gap: 16, padding: "12px 24px", flexShrink: 0,
          background: CHATB_C.white, borderBottom: "1px solid " + CHATB_C.gray200,
        }}>
          <div style={{ fontSize: 18, fontWeight: 600, lineHeight: "28px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", minWidth: 0 }}>{activeTitle}</div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
            <span style={{ color: CHATB_C.gray500 }}>Model:</span>
            <ChatBModelSelect value={model} onChange={setModel} />
          </div>
          <span style={{ color: CHATB_C.gray500, whiteSpace: "nowrap", flexShrink: 0 }}>Context: 132K / 200K</span>
          <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
            <span style={{ width: 8, height: 8, borderRadius: 9999, background: CHATB_C.green500, display: "inline-block" }} />
            <span>Online</span>
          </div>
          <div style={{ flex: 1 }} />
          <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
            <ChatBButton onClick={() => {}}>Share</ChatBButton>
            <ChatBButton onClick={() => {}}>More</ChatBButton>
          </div>
        </div>

        {/* Thread */}
        <div style={{ flex: 1, minHeight: 0, overflow: "auto", padding: 24, background: CHATB_C.white }}>
          <div style={{ maxWidth: 720, margin: "0 auto", display: "flex", flexDirection: "column", gap: 16 }}>
            {/* User message */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
              <div style={{ fontSize: 12, color: CHATB_C.gray500, marginBottom: 4 }}>You</div>
              <div style={{
                maxWidth: "75%", padding: "12px 16px", borderRadius: 8,
                background: CHATB_C.blue50, border: "1px solid " + CHATB_C.gray200,
              }}>{CHATX_USER_MSG}</div>
              <div style={{ fontSize: 12, color: CHATB_C.gray400, marginTop: 4 }}>9:41 AM</div>
            </div>

            {/* Assistant message */}
            <div style={{ display: "flex", gap: 12 }}>
              <div style={{
                width: 32, height: 32, borderRadius: 9999, background: CHATB_C.blue500, color: CHATB_C.white,
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 600, flexShrink: 0,
              }}>A</div>
              <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 12 }}>
                <div style={{ fontSize: 12, color: CHATB_C.gray500, marginBottom: -8 }}>Alpha</div>

                {/* Thinking */}
                <div style={{ background: CHATB_C.gray50, border: "1px solid " + CHATB_C.gray200, borderRadius: 8, padding: "12px 16px" }}>
                  <div style={{ fontWeight: 600, marginBottom: 8 }}>Thinking...</div>
                  <ul style={{ margin: 0, paddingLeft: 20, color: CHATB_C.gray700 }}>
                    {CHATX_THINK_STEPS.map((s, i) => (
                      <li key={i} style={{ marginBottom: 4 }}>{s.label} ({s.detail})</li>
                    ))}
                  </ul>
                </div>

                {/* Answer bubble */}
                <div style={{ background: CHATB_C.gray100, borderRadius: 8, padding: "12px 16px" }}>
                  <p style={{ margin: 0 }}>
                    {CHATX_ANSWER_SEGMENTS.map((seg, i) => {
                      if (seg.chip) {
                        return (
                          <span key={i} style={{
                            display: "inline-block", fontSize: 12, lineHeight: "16px", padding: "1px 8px", marginLeft: 4,
                            borderRadius: 9999, background: CHATB_C.gray200, color: CHATB_C.gray700, verticalAlign: "middle",
                          }}>{seg.chip}</span>
                        );
                      }
                      return <span key={i}>{seg.t || seg.text}</span>;
                    })}
                  </p>
                </div>

                {/* Sources */}
                <div>
                  <div style={{ fontSize: 12, fontWeight: 500, color: CHATB_C.gray500, marginBottom: 6 }}>Sources</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {CHATX_ANSWER_SOURCES.map(s => (
                      <span key={s.name} style={CHATB_PILL}>{s.name}</span>
                    ))}
                  </div>
                </div>

                {/* Follow-ups */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {CHATX_ANSWER_FOLLOWUPS.map(f => (
                    <button key={f} type="button" onClick={() => setDraft(f)} style={{
                      fontFamily: CHATB_FONT, fontSize: 14, lineHeight: "20px", padding: "6px 12px", borderRadius: 9999,
                      background: CHATB_C.white, border: "1px solid " + CHATB_C.blue600, color: CHATB_C.blue600, cursor: "pointer",
                    }}>{f}</button>
                  ))}
                </div>

                {/* Approval card */}
                <div style={{
                  background: CHATB_C.white, border: "1px solid " + CHATB_C.gray200, borderRadius: 8,
                  boxShadow: CHATB_SHADOW, padding: 16,
                }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, marginBottom: 4 }}>
                    <div style={{ fontSize: 16, fontWeight: 600, lineHeight: "24px" }}>How should I reply to Acme?</div>
                    <span style={{
                      fontSize: 12, lineHeight: "16px", fontWeight: 500, padding: "2px 8px", borderRadius: 9999,
                      background: CHATB_C.yellow100, color: CHATB_C.yellow800, whiteSpace: "nowrap",
                    }}>Paused</span>
                  </div>
                  <div style={{ color: CHATB_C.gray500, marginBottom: 12 }}>Needs your call before Alpha continues.</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 12 }}>
                    {CHATX_APPROVAL_OPTIONS.map(o => (
                      <label key={o.id} style={{ display: "flex", alignItems: "flex-start", gap: 8, cursor: "pointer" }}>
                        <input type="radio" name="chatb-approval" value={o.id}
                          checked={choice === o.id} onChange={() => setChoice(o.id)} style={{ marginTop: 3 }} />
                        <span>
                          <span style={{ display: "block", fontWeight: 500 }}>{o.title}</span>
                          <span style={{ display: "block", fontSize: 12, color: CHATB_C.gray500 }}>{o.sub}</span>
                        </span>
                      </label>
                    ))}
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <ChatBButton variant="primary" onClick={() => {}}>Confirm</ChatBButton>
                    <ChatBButton onClick={() => {}}>Skip</ChatBButton>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Composer */}
        <div style={{ flexShrink: 0, padding: "16px 24px", background: CHATB_C.white, borderTop: "1px solid " + CHATB_C.gray200 }}>
          <div style={{ maxWidth: 720, margin: "0 auto" }}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 8 }}>
              {CHATB_SUGGESTIONS.map(s => (
                <button key={s} type="button" onClick={() => setDraft(s)} style={{ ...CHATB_PILL, cursor: "pointer" }}>{s}</button>
              ))}
            </div>
            <textarea rows={3} value={draft} onChange={(e) => setDraft(e.target.value)}
              placeholder="Ask Alpha about your inbox..."
              style={{ ...CHATB_FIELD, width: "100%", resize: "none", display: "block" }} />
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 8 }}>
              <ChatBButton onClick={() => {}}>📎 Attach</ChatBButton>
              <ChatBModelSelect value={model} onChange={setModel} />
              <div style={{ flex: 1 }} />
              <ChatBButton onClick={() => {}}>🎤</ChatBButton>
              <ChatBButton variant="primary" onClick={() => {}}>Send</ChatBButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function BetaChip({ pageTheme }) {
  const pal = usePal(pageTheme);
  const isDark = pageTheme === "dark";
  return (
    <div aria-label="Beta" style={{
      display: "inline-flex", alignItems: "center", gap: 6,
      padding: "4px 10px", borderRadius: tokens.radius.pill,
      background: isDark ? "rgba(30,30,30,0.85)" : "rgba(255,255,255,0.85)",
      backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)",
      boxShadow: `0 0 0 1px ${pal.borderSubtle}`,
      fontFamily: tokens.font.mono, fontSize: 10, letterSpacing: "0.12em",
      color: pal.textSecondary, userSelect: "none",
      transition: `background ${motion.smooth} ${motion.easeInOut}, color ${motion.smooth} ${motion.easeInOut}, box-shadow ${motion.smooth} ${motion.easeInOut}`,
    }}>
      <span style={{ width: 5, height: 5, borderRadius: 3, background: pal.accent, transition: `background ${motion.smooth} ${motion.easeInOut}` }} />
      BETA
    </div>
  );
}

// Source link: same pill idiom as Feedback, opens the public repo.
function RepoPill({ pageTheme, surface }) {
  const pal = usePal(pageTheme);
  const [hover, setHover] = useState(false);
  return (
    <a href={REPO_URL} target="_blank" rel="noreferrer" aria-label="Source on GitHub"
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        ...interactiveBase, display: "inline-flex", alignItems: "center", gap: 6, textDecoration: "none",
        padding: "4px 10px 4px 8px", borderRadius: tokens.radius.pill, ...surface,
        fontFamily: tokens.font.mono, fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase",
        color: hover ? pal.text : pal.textSecondary,
      }}>
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M16 18l6-6-6-6" /><path d="M8 6l-6 6 6 6" />
      </svg>
      GitHub
    </a>
  );
}

// Feedback: a small modal with one text box (and an optional email for a
// reply). Posts to the site endpoint, which emails the studio.
function FeedbackDialog({ open, onClose, pageTheme }) {
  const pal = usePal(pageTheme);
  const { isMobile } = useViewport();
  const [text, setText] = useState("");
  const [email, setEmail] = useState("");
  const [state, setState] = useState("idle");
  const [error, setError] = useState("");
  const timer = useRef(null);
  useEffect(() => () => clearTimeout(timer.current), []);
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);
  if (!open) return null;
  const send = async () => {
    const note = text.trim();
    if (note.length < 2) { setError("Write a line first."); return; }
    if (email.trim() && !EMAIL_RE.test(email.trim())) { setError("That email doesn't look right."); return; }
    setState("sending"); setError("");
    try {
      await kitSubmit({ kind: "feedback", text: note, email: email.trim(), page: window.location.href });
      setState("done"); setText(""); setEmail("");
      timer.current = setTimeout(() => { setState("idle"); onClose(); }, 1600);
    } catch (e) {
      setState("idle");
      setError("Couldn't send just now. Try again, or open an issue on GitHub.");
    }
  };
  return (
    <div onClick={onClose} style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)", WebkitBackdropFilter: "blur(4px)",
      display: "flex", alignItems: "center", justifyContent: "center", zIndex: 10003, padding: 16,
      animation: `halaska-fade-in ${motion.fast} ${motion.easeOut} both`,
    }}>
      <div role="dialog" aria-modal="true" aria-label="Feedback" onClick={(e) => e.stopPropagation()} style={{
        width: 440, maxWidth: "100%",
        background: pageTheme === "dark" ? "rgba(30,30,30,0.95)" : "rgba(255,255,255,0.95)",
        backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
        borderRadius: tokens.radius.lg, padding: isMobile ? 20 : 24,
        border: `1px solid ${pal.borderSubtle}`, boxShadow: `0 16px 48px ${pal.shadowLg}`, fontFamily: tokens.font.sans,
        animation: `halaska-scale-in ${motion.normal} ${motion.emphasized} both`,
      }}>
        <div style={{ ...tokens.type.lg, fontWeight: tokens.weight.semibold, color: pal.text, marginBottom: 6 }}>Feedback</div>
        {state === "done" ? (
          <Text size="base" theme={pageTheme} style={{ color: pal.textSecondary, display: "block", padding: "8px 0 4px" }}>Thanks, got it.</Text>
        ) : (
          <Stack gap={12}>
            <Text size="sm" theme={pageTheme} style={{ color: pal.textSecondary, display: "block" }}>What's missing, or what broke? A line is plenty.</Text>
            <TextArea theme={pageTheme} rows={4} placeholder="The stepper skips a step on mobile…" value={text} onChange={(v) => { setText(v); setError(""); }} />
            <TextInput theme={pageTheme} type="email" size="sm" placeholder="Email, if you'd like a reply (optional)" value={email} onChange={(v) => { setEmail(v); setError(""); }} error={error || undefined} />
            <Stack direction="row" gap={8} justify="flex-end">
              <Button theme={pageTheme} variant="ghost" size="sm" onClick={onClose}>Cancel</Button>
              <Button theme={pageTheme} variant="primary" size="sm" loading={state === "sending"} onClick={send}>Send</Button>
            </Stack>
          </Stack>
        )}
      </div>
    </div>
  );
}

// The Feedback pill. Opens the dialog itself, or hands off through `onOpen`
// when it sits inside a transformed container (the phone section menu).
function FeedbackPill({ pageTheme, surface, onOpen }) {
  const pal = usePal(pageTheme);
  const [hover, setHover] = useState(false);
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);
  return (
    <>
      <button onClick={() => (onOpen ? onOpen() : setOpen(true))} aria-label="Send feedback"
        onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
        style={{
          ...interactiveBase, display: "inline-flex", alignItems: "center", gap: 6,
          padding: "4px 10px 4px 8px", borderRadius: tokens.radius.pill, ...surface,
          fontFamily: tokens.font.mono, fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase",
          color: hover ? pal.text : pal.textSecondary,
        }}>
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
        Feedback
      </button>
      {!onOpen && <FeedbackDialog open={open} onClose={close} pageTheme={pageTheme} />}
    </>
  );
}

// Lucide-style wand at 1px stroke, in a soft accent tile.
function StudioWandIcon({ size = 22, theme }) {
  const pal = usePal(theme);
  return (
    <span aria-hidden="true" style={{
      width: size, height: size, borderRadius: size / 2, flexShrink: 0,
      display: "inline-flex", alignItems: "center", justifyContent: "center",
      background: pal.accentBg, color: pal.accent,
      transition: `background ${motion.smooth} ${motion.easeInOut}, color ${motion.smooth} ${motion.easeInOut}`,
    }}>
      <svg width={Math.round(size * 0.6)} height={Math.round(size * 0.6)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 21l9.5-9.5" /><path d="M14.5 7.5 16.5 9.5" />
        <path d="M15 3v2" /><path d="M15 12v2" /><path d="M10.5 8.5h2" /><path d="M19.5 8.5h2" />
        <path d="M18.2 5.3 19.5 4" /><path d="M18.2 11.7 19.5 13" />
      </svg>
    </span>
  );
}

// Floating studio note, bottom-left: starts as a condensed pill, opens to a
// short note, re-opens whenever the install prompt is copied. Its action
// scrolls to the studio card at the end of the page.
function StudioCta({ pageTheme }) {
  const pal = usePal(pageTheme);
  const isDark = pageTheme === "dark";
  const { isMobile } = useViewport();
  const [open, setOpen] = useState(false);
  const [hover, setHover] = useState(false);
  useEffect(() => {
    const reopen = () => setOpen(true);
    window.addEventListener("halaska:prompt-copied", reopen);
    return () => window.removeEventListener("halaska:prompt-copied", reopen);
  }, []);
  const surface = {
    background: isDark ? "rgba(30,30,30,0.92)" : "rgba(255,255,255,0.92)",
    backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)",
    boxShadow: `0 0 0 1px ${pal.borderSubtle}, 0 12px 32px ${pal.shadowLg}`,
    transition: `background ${motion.smooth} ${motion.easeInOut}, box-shadow ${motion.smooth} ${motion.easeInOut}`,
  };
  const goToCard = () => {
    const el = document.getElementById("studio");
    if (el) { const y = el.getBoundingClientRect().top + window.scrollY - 48; window.scrollTo({ top: y, behavior: "smooth" }); }
    setOpen(false);
  };
  const note = !open ? (
    <button onClick={() => setOpen(true)} aria-label="Open studio note"
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        ...interactiveBase, display: "inline-flex", alignItems: "center", gap: 8, padding: "8px 12px 8px 10px",
        borderRadius: tokens.radius.pill, ...surface,
        ...tokens.type.sm, fontWeight: tokens.weight.medium, color: hover ? pal.text : pal.textSecondary,
        animation: `halaska-scale-in ${motion.normal} ${motion.emphasized} both`,
      }}>
      <StudioWandIcon size={18} theme={pageTheme} />
      Need a hand with yours?
    </button>
  ) : (
    <div role="complementary" aria-label="Studio note" style={{
      width: 300, maxWidth: "calc(100vw - 40px)",
      padding: 16, borderRadius: tokens.radius.lg, ...surface, fontFamily: tokens.font.sans,
      animation: `halaska-step-in 0.4s ${motion.emphasized} both`,
    }}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
        <StudioWandIcon size={22} theme={pageTheme} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <Text size="sm" weight="semibold" theme={pageTheme} style={{ display: "block" }}>Need a hand with yours?</Text>
          <Text size="sm" theme={pageTheme} style={{ color: pal.textSecondary, display: "block", marginTop: 4, lineHeight: 1.6 }}>
            If you'd rather have a designer take it from here, that's what <StudioLink theme={pageTheme}>Halaska Studio</StudioLink> does.
          </Text>
          <LinkButton theme={pageTheme} size="sm" iconRight="↓" onClick={goToCard} style={{ marginTop: 8 }}>Send your prototype over</LinkButton>
        </div>
        <IconButton icon="–" size={24} theme={pageTheme} label="Minimise" onClick={() => setOpen(false)} style={{ marginTop: -4, marginRight: -6 }} />
      </div>
    </div>
  );
  // Phones: the note only appears above the bar once the prompt has been copied.
  if (isMobile) {
    return open ? (
      <div style={{ position: "fixed", bottom: 84, left: 16, right: 16, zIndex: 9998, display: "flex", justifyContent: "center" }}>{note}</div>
    ) : null;
  }
  return <div style={{ position: "fixed", bottom: 20, left: 20, zIndex: 9998 }}>{note}</div>;
}

// Fixed bottom-right dock: BETA, version, GitHub, Feedback. Phones get the
// same pills inside the section menu instead.
function PageDock({ pageTheme }) {
  const pal = usePal(pageTheme);
  const isDark = pageTheme === "dark";
  const { isMobile } = useViewport();
  const surface = {
    background: isDark ? "rgba(30,30,30,0.92)" : "rgba(255,255,255,0.92)",
    backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)",
    boxShadow: `0 0 0 1px ${pal.borderSubtle}, 0 12px 32px ${pal.shadowLg}`,
    transition: `background ${motion.smooth} ${motion.easeInOut}, box-shadow ${motion.smooth} ${motion.easeInOut}`,
  };
  if (isMobile) return null;
  return (
    <div style={{ position: "fixed", bottom: 20, right: 20, zIndex: 9998, display: "flex", alignItems: "center", gap: 6 }}>
      <BetaChip pageTheme={pageTheme} />
      <RepoPill pageTheme={pageTheme} surface={surface} />
      <FeedbackPill pageTheme={pageTheme} surface={surface} />
    </div>
  );
}

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
        // Distance to the section's nearest edge: 0 while inside it, so the
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
        const width = hovered ? 15 : 7 + p * 8;
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
            {/* Always-visible label, in flow right after the tick: a growing
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
// Section menu for viewports without the bookmark rail: a ≡ button in the
// bar opens a compact list of every section above it. Phones also get the
// BETA chip and Feedback here so nothing else floats over the content.
function SectionMenu({ open, onClose, scrollTo, pageTheme, bar, onFeedback }) {
  const { isMobile } = useViewport();
  const pal = usePal(pageTheme);
  const [activeId, setActiveId] = useState(null);
  const ref = useRef(null);
  useEffect(() => {
    if (!open) return;
    const probe = window.scrollY + window.innerHeight * 0.32;
    let best = null, bestD = Infinity;
    RAIL_TICKS.forEach(t => {
      const el = document.getElementById(t.id);
      if (!el) return;
      const r = el.getBoundingClientRect();
      const top = r.top + window.scrollY, bottom = top + r.height;
      const d = probe < top ? top - probe : probe > bottom ? probe - bottom : 0;
      if (d < bestD) { bestD = d; best = t.id; }
    });
    setActiveId(best);
    const onDown = (e) => { if (ref.current && !ref.current.contains(e.target)) onClose(); };
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    const id = setTimeout(() => { document.addEventListener("mousedown", onDown); document.addEventListener("touchstart", onDown); }, 0);
    window.addEventListener("keydown", onKey);
    return () => { clearTimeout(id); document.removeEventListener("mousedown", onDown); document.removeEventListener("touchstart", onDown); window.removeEventListener("keydown", onKey); };
  }, [open, onClose]);
  if (!open) return null;
  const surface = {
    background: pageTheme === "dark" ? "rgba(30,30,30,0.92)" : "rgba(255,255,255,0.92)",
    backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)",
    boxShadow: `0 0 0 1px ${pal.borderSubtle}, 0 12px 32px ${pal.shadowLg}`,
  };
  return (
    <div ref={ref} role="menu" aria-label="Sections" style={{
      position: "fixed", bottom: 76, left: "50%", transform: "translateX(-50%)",
      width: isMobile ? "calc(100vw - 32px)" : 320, maxHeight: "min(64vh, 560px)", overflowY: "auto",
      zIndex: 9999, padding: isMobile ? "10px 8px 0" : "10px 8px", borderRadius: tokens.radius.lg,
      background: bar.bg, backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
      border: `1px solid ${bar.border}`, boxShadow: bar.shadow, fontFamily: tokens.font.sans,
      animation: `halaska-step-in ${motion.normal} ${motion.emphasized} both`,
    }}>
      {RAIL_ROWS.map((row, i) => row.type === "label" ? (
        <div key={`label-${i}`} style={{
          fontSize: 9, fontWeight: tokens.weight.medium, textTransform: "uppercase", letterSpacing: "0.12em",
          color: bar.text, opacity: 0.7, padding: `${i === 0 ? 4 : 14}px 10px 6px`,
        }}>{row.text}</div>
      ) : (
        <button key={row.id} role="menuitem" onClick={() => { scrollTo(row.id); onClose(); }} style={{
          ...interactiveBase, display: "flex", alignItems: "center", gap: 10, width: "100%", textAlign: "left",
          padding: "8px 10px", borderRadius: tokens.radius.sm, ...tokens.type.sm,
          fontWeight: activeId === row.id ? tokens.weight.semibold : tokens.weight.regular,
          color: activeId === row.id ? bar.textActive : bar.text,
          background: activeId === row.id ? bar.activeBg : "transparent",
        }}>
          <span style={{ width: activeId === row.id ? 12 : 6, height: 1, background: activeId === row.id ? pal.accent : bar.text, opacity: activeId === row.id ? 1 : 0.5, flexShrink: 0, transition: `width ${motion.normal} ${motion.emphasized}` }} />
          {row.label}
        </button>
      ))}
      {isMobile && (
        <div style={{
          position: "sticky", bottom: 0, display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap",
          padding: "12px 6px 10px", marginTop: 6, borderTop: `1px solid ${bar.border}`,
          background: bar.bg, backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
        }}>
          <BetaChip pageTheme={pageTheme} />
          <RepoPill pageTheme={pageTheme} surface={surface} />
          <FeedbackPill pageTheme={pageTheme} surface={surface} onOpen={onFeedback} />
        </div>
      )}
    </div>
  );
}

function ActionBar({ scrollTo, pageTheme, onThemeChange, accentColor, onAccentChange }) {
  const [colorOpen, setColorOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const closeMenu = useCallback(() => setMenuOpen(false), []);
  const closeFeedback = useCallback(() => setFeedbackOpen(false), []);
  const openFeedback = useCallback(() => { setMenuOpen(false); setFeedbackOpen(true); }, []);
  const { isMobile, compact } = useViewport();
  const { copied: installCopied, copy: copyInstallPrompt } = useCopyPrompt();
  const isDark = pageTheme === "dark";
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
    <>
    <FeedbackDialog open={feedbackOpen} onClose={closeFeedback} pageTheme={pageTheme} />
    {compact && <SectionMenu open={menuOpen} onClose={closeMenu} scrollTo={scrollTo} pageTheme={pageTheme} onFeedback={openFeedback}
      bar={{ bg: barBg, border: barBorder, text: barText, textActive: barTextActive, activeBg: barActiveBg, shadow }} />}
    <div style={{
      position: "fixed", bottom: 20, left: "50%", transform: "translateX(-50%)",
      maxWidth: "calc(100vw - 24px)",
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
        {/* Sections: only where the bookmark rail is hidden */}
        {compact && (
          <>
            <button onClick={() => { setColorOpen(false); setMenuOpen(o => !o); }} aria-label="Sections" aria-expanded={menuOpen}
              style={{
                ...interactiveBase, width: 32, height: 32, padding: 0, flexShrink: 0,
                display: "flex", alignItems: "center", justifyContent: "center",
                background: menuOpen ? barActiveBg : "transparent",
                color: menuOpen ? barTextActive : barText, borderRadius: tokens.radius.sm,
                transition: `background ${motion.normal} ${motion.easeInOut}, color ${motion.normal} ${motion.easeInOut}`,
              }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
                <path d="M4 7h16M4 12h10M4 17h13" />
              </svg>
            </button>
            <div style={{ width: 1, height: 20, background: barBorder, margin: "0 4px", flexShrink: 0 }} />
          </>
        )}
        {/* Copy install prompt: one click, straight to the clipboard.
            Section nav lives in the bookmark rail (or the ≡ menu). */}
        <BarButton onClick={() => { setColorOpen(false); setMenuOpen(false); copyInstallPrompt(); }} active={installCopied}
          barText={barText} barTextActive={barTextActive}
          barHoverBg={barBarButtonHoverBg} barActiveBg={barBarButtonActiveBg}
          style={isMobile ? { padding: "8px 12px" } : undefined}>
          {installCopied ? (isMobile ? "Copied ✓" : "Copied · paste into Claude Code ✓") : (isMobile ? "Copy prompt" : "Copy install prompt")}
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

        {/* Accent color: paint bucket icon + inline expanding dots */}
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
    </>
  );
}



// ─── MAIN EXPORT ──────────────────────────────────────────────

export default function HalaskaKit() {
  const [pageTheme, setPageTheme] = useState("light");
  const [accentColor, setAccentColor] = useState("#555555");

  useEffect(() => { injectStyles(); }, []);
  const { isMobile } = useViewport();
  const gap = isMobile ? 40 : 64;

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 32;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  return (
    <AccentContext.Provider value={accentColor}>
      <ShowcasePage title="UI" pageTheme={pageTheme}>
        {/* UX Patterns: the AI-interface patterns lead the page */}
        <div id="patterns" style={{ display: "flex", flexDirection: "column", gap }}>
          <DemoPatterns theme={pageTheme} />
        </div>

        {/* Foundations */}
        <div id="cat-foundations" style={{ display: "flex", flexDirection: "column", gap }}>
          <DemoTypography theme={pageTheme} />
          <DemoMotion theme={pageTheme} />
          <DemoButtons theme={pageTheme} />
        </div>

        {/* Inputs & Selectors */}
        <div id="cat-inputs" style={{ display: "flex", flexDirection: "column", gap }}>
          <DemoFormInputs theme={pageTheme} />
          <DemoTogglesSelections theme={pageTheme} />
          <DemoFormExtras theme={pageTheme} />
          <DemoInputsExtended theme={pageTheme} />
        </div>

        {/* Navigation & Menus */}
        <div id="cat-navigation" style={{ display: "flex", flexDirection: "column", gap }}>
          <DemoNavigation theme={pageTheme} />
        </div>

        {/* Overlays */}
        <div id="cat-overlays" style={{ display: "flex", flexDirection: "column", gap }}>
          <DemoOverlays theme={pageTheme} />
        </div>

        {/* Feedback & Status */}
        <div id="cat-feedback" style={{ display: "flex", flexDirection: "column", gap }}>
          <DemoFeedbackStatus theme={pageTheme} />
          <DemoAlerts theme={pageTheme} />
        </div>

        {/* Data Display */}
        <div id="cat-data" style={{ display: "flex", flexDirection: "column", gap }}>
          <DemoDataDisplay theme={pageTheme} />
          <DemoTable theme={pageTheme} />
        </div>

        {/* AI Elements */}
        <div id="cat-ai" style={{ display: "flex", flexDirection: "column", gap }}>
          <DemoAIElements theme={pageTheme} />
        </div>

        {/* Dev Surfaces */}
        <div id="cat-dev" style={{ display: "flex", flexDirection: "column", gap }}>
          <DemoDevSurfaces theme={pageTheme} />
        </div>



      </ShowcasePage>
      <StudioCta pageTheme={pageTheme} />
      <PageDock pageTheme={pageTheme} />
      <BookmarkRail pageTheme={pageTheme} scrollTo={scrollTo} />
      <ActionBar
        scrollTo={scrollTo}
        pageTheme={pageTheme} onThemeChange={setPageTheme}
        accentColor={accentColor} onAccentChange={setAccentColor}
      />
    </AccentContext.Provider>
  );
}

// ─── PUBLIC API ───────────────────────────────────────────────
// Named exports so the kit works as a library, not just a showcase:
//   import { Button, Orb, PlanPreviewPattern, usePal } from "./halaska-kit";
// The default export remains the full showcase page.

export {
  // Foundations
  tokens, motion, interactiveBase,
  usePal, useThemeContext, ThemeProvider, AccentContext, useAccent,
  injectStyles, getAvatarColor, setKitMotion, setKitFont, KIT_MOTION_PRESETS, KIT_FONT_PRESETS,
  // Typography
  Text, Heading, Label, Caption, Code,
  // Buttons
  Button, IconButton, ButtonGroup, LinkButton, SplitButton,
  // Inputs & selectors
  TextInput, TextArea, Select, Checkbox, Radio, RadioGroup, SwitchToggle,
  Slider, SpringSlider, SpringToggle, SegmentedControl, InputOTP, InputGroup,
  Combobox, Calendar, DatePicker, Chip, Toggle, ToggleGroup, SearchInput,
  Choicebox, CopyInput, Rating,
  // Layout & data display
  Card, CardHeader, Divider, Stack, Badge, Tag, StatusBadge, StatusDot,
  Avatar, AvatarGroup, ListItem, Stat, Table, DataTable, ScrollArea,
  Pagination, MiddleTruncate, Kbd, Sparkline, DotGrid,
  // Feedback & status
  Progress, ProgressCircle, Skeleton, Spinner, Toast, AlertBanner,
  EmptyState, Stepper,
  // Navigation & menus
  Breadcrumb, Tabs, SubtleTabs, Accordion, Collapsible, ContextMenu, Menubar,
  CommandPalette, CommandMenu,
  // Overlays
  Dialog, AlertDialog, FormDialog, CardDialog, Sheet, Popover, DropdownMenu,
  Tooltip, HoverCard, ChevronIcon,
  // Dev surfaces
  Snippet, FileTree, BrowserFrame, PhoneFrame,
  // AI elements
  Orb, StreamingText, ThinkingIndicator, ThinkingSteps, ConfidenceBar,
  AISuggestionBadge, BeforeAfterToggle, CompareSlider, ZoomControl, AgentGlyph,
  // UX patterns: conversation core
  PromptInputPattern, MessageThreadPattern, StreamingAnswerPattern,
  AgentChatPattern, CodeBlockPattern, ModelContextPattern,
  // UX patterns: trust & transparency
  ThinkingTracePattern, CitationsPattern, ContextSourcesPattern,
  ConfidencePattern, RecommendationPattern, FeedbackPattern,
  // UX patterns: agentic control
  PlanPreviewPattern, ApprovalCardPattern, AutonomyPattern,
  PermissionScopePattern, QueuePattern, AgentStatusPattern, ToolStreamPattern,
  AgentTasksPattern, HandoffPattern, ActionReceiptPattern, CheckpointPattern,
  AuditLogPattern, ErrorRepairPattern,
  // UX patterns: output & generative UI
  ArtifactPattern, DiffViewPattern, DiffTablePattern, StructuredDataPattern,
  InsightCardsPattern, ComparisonPattern,
  // UX patterns: ambient & beyond chat
  TaskboardPattern, InlineAssistPattern, NudgePattern, DigestPattern,
  NotificationCenterPattern, CommandSearchPattern, AgentSetupPattern,
  // Example screens (one per UX paradigm)
  ChatParadigmExample, CanvasParadigmExample, ChatParadigmBefore, BeforeAfterSection,
  // Registries (for building indexes and docs)
  PATTERN_GROUPS, UX_PATTERNS, DESIGN_HEURISTICS,
};
