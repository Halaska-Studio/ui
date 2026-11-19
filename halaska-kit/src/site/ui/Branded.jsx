// The brand style the visitor picked (colour, headline style, corners),
// applied to kit components inside a preview. The site's own chrome sits
// outside it and never changes.
import { BrandProvider, ACCENT_COLORS } from "../kit";
import { useSite } from "../state";

// The colour themes on offer: three common product colours. No colour at
// all is the greyscale default, and any other colour goes in as a hex code.
const OFFERED = ["Violet", "Blue", "Emerald"];
export const BRAND_COLORS = ACCENT_COLORS.filter((c) => OFFERED.includes(c.name));
export const BRAND_DEFAULT = { color: null, type: "clean", radius: "round" };
// How the default theme is drawn as a swatch: half dark grey, half light grey.
export const DEFAULT_SWATCH = "linear-gradient(135deg, #3a3a3a 50%, #c9c9c9 50%)";

export const normalHex = (v) => {
  let h = String(v || "").trim().replace(/^#/, "").toLowerCase();
  if (!/^([0-9a-f]{3}|[0-9a-f]{6})$/.test(h)) return null;
  if (h.length === 3) h = h.split("").map((x) => x + x).join("");
  return `#${h}`;
};

// `color` overrides the site-wide colour for one frame: a hex, or null for the default.
export function Branded({ color, children }) {
  const { brand } = useSite();
  return <BrandProvider color={color === undefined ? brand.color : color} type={brand.type} radius={brand.radius}>{children}</BrandProvider>;
}
