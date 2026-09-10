import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Local stand-in for the Vercel function in api/submit.js: accepts the
// showcase forms, logs them, and answers ok so the flows can be exercised
// without any delivery credentials.
function submitShim() {
  return {
    name: "halaska-submit-shim",
    configureServer(server) {
      server.middlewares.use("/api/submit", (req, res) => {
        let raw = "";
        req.on("data", (c) => { raw += c; });
        req.on("end", () => {
          let body = {};
          try { body = JSON.parse(raw || "{}"); } catch (e) { /* ignore */ }
          console.log(`[submit] ${body.kind || "?"}`, JSON.stringify(body));
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify({ ok: true, dev: true }));
        });
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), submitShim()],
  server: {
    host: "127.0.0.1",
    port: 3000,
    open: true,
  },
});
