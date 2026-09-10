import React from "react";
import ReactDOM from "react-dom/client";
import HalaskaKit, { ChatParadigmExample, BeforeAfterSection, ThemeProvider } from "../halaska-kit-v1.3.jsx";

// ?shot=after | ?shot=before-after render one piece on its own, for the
// README screenshots (see scripts/shots.sh). Everything else is the showcase.
const shot = new URLSearchParams(window.location.search).get("shot");
const Shot = () => shot === "after" ? (
  <div style={{ width: 1200, height: 760, position: "relative", overflow: "hidden" }}><ChatParadigmExample theme="light" /></div>
) : (
  <div style={{ width: 900, padding: 40, background: "#fff" }}><ThemeProvider theme="light"><BeforeAfterSection theme="light" /></ThemeProvider></div>
);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {shot ? <Shot /> : <HalaskaKit />}
  </React.StrictMode>
);
