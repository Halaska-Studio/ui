import React from "react";
import ReactDOM from "react-dom/client";
import HalaskaKit, { ChatParadigmExample, BeforeAfterSection, ThemeProvider } from "../halaska-kit-v1.0.jsx";

// ?shot=after | ?shot=before-after | ?shot=og render one piece on its own, for the
// README screenshots (see scripts/shots.sh). Everything else is the showcase.
const shot = new URLSearchParams(window.location.search).get("shot");
// Open Graph card, 1200x630: wordmark and one line on the left, the Chat
// screen rendered live on the right. Captured to public/og.png.
const OgCard = () => (
  <div style={{ width: 1200, height: 630, position: "relative", overflow: "hidden", background: "linear-gradient(180deg, #ffffff 0%, #f4f4f4 100%)", fontFamily: "'Geist', -apple-system, system-ui, sans-serif", color: "#1a1a1a" }}>
    <div style={{ position: "absolute", left: 72, top: 96, width: 430 }}>
      <div style={{ fontSize: 96, fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1 }}>UI</div>
      <div style={{ fontSize: 22, color: "#8a8a8a", marginTop: 18 }}>by Halaska · built on top of shadcn/ui</div>
      <div style={{ fontSize: 26, lineHeight: 1.4, marginTop: 44, color: "#3d3d3d", letterSpacing: "-0.01em" }}>
        A UI kit for AI products. 38 UX patterns, around 100 components, one file.
      </div>
      <div style={{ fontSize: 20, lineHeight: 1.5, marginTop: 22, color: "#8a8a8a" }}>
        For founders building with coding agents. Copy one prompt and your prototype looks designed.
      </div>
      <div style={{ display: "inline-flex", alignItems: "center", gap: 8, marginTop: 40, padding: "6px 12px", borderRadius: 999, boxShadow: "0 0 0 1px rgba(0,0,0,0.08)", background: "#fff", fontFamily: "'Geist Mono', ui-monospace, monospace", fontSize: 13, letterSpacing: "0.12em", color: "#6a6a6a" }}>
        <span style={{ width: 6, height: 6, borderRadius: 3, background: "#3b82f6" }} /> BETA · ui.halaska.com
      </div>
    </div>
    <div style={{ position: "absolute", left: 560, top: 64, width: 760, height: 600, borderRadius: 20, overflow: "hidden", background: "#fff", boxShadow: "0 0 0 1px rgba(0,0,0,0.06), 0 30px 80px rgba(0,0,0,0.16)" }}>
      <div style={{ position: "absolute", top: 0, left: 0, width: 1200, height: 760, transform: "scale(0.79)", transformOrigin: "top left", pointerEvents: "none" }}>
        <ChatParadigmExample theme="light" />
      </div>
    </div>
  </div>
);

const Shot = () => shot === "og" ? <OgCard /> : shot === "after" ? (
  <div style={{ width: 1200, height: 760, position: "relative", overflow: "hidden" }}><ChatParadigmExample theme="light" /></div>
) : (
  <div style={{ width: 900, padding: 40, background: "#fff" }}><ThemeProvider theme="light"><BeforeAfterSection theme="light" /></ThemeProvider></div>
);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {shot ? <Shot /> : <HalaskaKit />}
  </React.StrictMode>
);
