import { createContext, useContext } from "react";
import { tokens, p } from "./tokens";

// ─── THEME CONTEXT ───────────────────────────────────────────

export const ThemeContext = createContext("light");

export function ThemeProvider({ theme = "light", children }) {
  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>;
}

export function useThemeContext() {
  return useContext(ThemeContext);
}

// ─── ACCENT COLOR CONTEXT ────────────────────────────────────

export const AccentContext = createContext(null);

export function useAccent() {
  return useContext(AccentContext);
}

// ─── PALETTE HOOK ────────────────────────────────────────────
// Returns the color palette for the current theme with accent overrides applied.
// Every component should use this instead of calling p() directly.

export function usePal(themeProp) {
  const ctxTheme = useThemeContext();
  const theme = themeProp || ctxTheme;
  const accent = useAccent();
  const base = p(theme);

  if (!accent || accent === base.accent) return base;

  // Generate variants from the accent hex
  const hex = accent;
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const hR = Math.max(0, r - 30);
  const hG = Math.max(0, g - 30);
  const hB = Math.max(0, b - 30);
  const hoverHex = `#${hR.toString(16).padStart(2, "0")}${hG.toString(16).padStart(2, "0")}${hB.toString(16).padStart(2, "0")}`;
  const bgAlpha = theme === "dark" ? 0.12 : 0.08;

  return {
    ...base,
    accent: hex,
    accentText: hex,
    accentHover: hoverHex,
    accentBg: `rgba(${r},${g},${b},${bgAlpha})`,
  };
}
