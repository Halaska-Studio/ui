// ─── HALASKA KIT TOKENS ──────────────────────────────────────
// Design tokens for spacing, radius, typography, color, and motion.
// Edit these to customize the entire kit.

export const tokens = {
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
};

// ─── COLOR PALETTE ────────────────────────────────────────────

tokens.light = {
  bg: "#fafafa", bgElevated: "#ffffff", bgSubtle: "#f3f3f3", bgMuted: "#eeeeee",
  bgHover: "#e8e8e8", bgInput: "#f0f0f0",
  border: "#e5e5e5", borderSubtle: "#eeeeee", borderInput: "rgba(0,0,0,0.06)", borderFocus: "#444444",
  text: "#3d3d3d", textSecondary: "#888888", textTertiary: "#aaaaaa", textMuted: "#cccccc", textInverse: "#ffffff",
  shadow: "rgba(0,0,0,0.04)", shadowMd: "rgba(0,0,0,0.06)", shadowLg: "rgba(0,0,0,0.1)",
  accent: "#3b82f6", accentHover: "#2563eb", accentBg: "#eff6ff", accentText: "#3b82f6",
  success: "#22c55e", successHover: "#16a34a", successBg: "#f0fdf4",
  warning: "#f59e0b", warningHover: "#d97706", warningBg: "#fffbeb",
  danger: "#ef4444", dangerHover: "#dc2626", dangerBg: "#fef2f2",
};

tokens.dark = {
  bg: "#1a1a1a", bgElevated: "#2a2a2a", bgSubtle: "#222222", bgMuted: "#333333",
  bgHover: "#3d3d3d", bgInput: "#252525",
  border: "#3a3a3a", borderSubtle: "#2f2f2f", borderInput: "rgba(255,255,255,0.06)", borderFocus: "#cccccc",
  text: "#d8d8d8", textSecondary: "#999999", textTertiary: "#6a6a6a", textMuted: "#4a4a4a", textInverse: "#1a1a1a",
  shadow: "rgba(0,0,0,0.2)", shadowMd: "rgba(0,0,0,0.3)", shadowLg: "rgba(0,0,0,0.4)",
  accent: "#60a5fa", accentHover: "#3b82f6", accentBg: "rgba(96,165,250,0.12)", accentText: "#60a5fa",
  success: "#4ade80", successHover: "#22c55e", successBg: "rgba(74,222,128,0.1)",
  warning: "#fbbf24", warningHover: "#f59e0b", warningBg: "rgba(251,191,36,0.1)",
  danger: "#f87171", dangerHover: "#ef4444", dangerBg: "rgba(248,113,113,0.1)",
};

// ─── MOTION TOKENS (Material Design 3 aligned) ──────────────

export const motion = {
  // Durations
  fast: "0.15s",
  normal: "0.25s",
  smooth: "0.35s",
  spring: "0.4s",
  slow: "0.5s",

  // Easing curves
  easeInOut: "cubic-bezier(0.4, 0, 0.2, 1)",
  easeOut: "cubic-bezier(0.0, 0, 0.2, 1)",
  easeIn: "cubic-bezier(0.4, 0, 1, 1)",
  emphasized: "cubic-bezier(0.2, 0, 0, 1)",
  springCurve: "cubic-bezier(0.34, 1.56, 0.64, 1)",
};

// ─── SHARED STYLES ───────────────────────────────────────────

export const interactiveBase = {
  fontFamily: tokens.font.sans,
  cursor: "pointer",
  border: "none",
  outline: "none",
  transition: `all ${motion.normal} ${motion.easeInOut}`,
};

// ─── HELPERS ─────────────────────────────────────────────────

export const p = (theme) => (theme === "dark" ? tokens.dark : tokens.light);

// ─── GLOBAL STYLES (inject once) ─────────────────────────────

export const GLOBAL_STYLES = `
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
  0% { transform: scale(1); opacity: 1; }
  100% { transform: scale(0); opacity: 0; }
}

@keyframes halaska-dropdown-expand {
  from { opacity: 0; transform: translateY(-4px) scale(0.97); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}

* { box-sizing: border-box; -webkit-font-smoothing: antialiased; }
`;

let stylesInjected = false;
export function injectStyles() {
  if (stylesInjected) return;
  stylesInjected = true;
  const el = document.createElement("style");
  el.textContent = GLOBAL_STYLES;
  document.head.appendChild(el);
}
