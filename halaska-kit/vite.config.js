import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

// In development, serve the site's one server function (api/feedback.js)
// the way the host does in production.
const devApi = () => ({
  name: "dev-api",
  configureServer(server) {
    const env = loadEnv("development", process.cwd(), "");
    if (env.FEEDBACK_WEBHOOK_URL && !process.env.FEEDBACK_WEBHOOK_URL) process.env.FEEDBACK_WEBHOOK_URL = env.FEEDBACK_WEBHOOK_URL;
    server.middlewares.use("/api/feedback", async (req, res) => {
      try {
        const mod = await server.ssrLoadModule("/api/feedback.js");
        await mod.default(req, res);
      } catch (e) {
        res.statusCode = 500;
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify({ ok: false, error: "Couldn't send that just now." }));
      }
    });
  },
});

export default defineConfig({
  plugins: [react(), devApi()],
  server: {
    host: "127.0.0.1",
    // The desktop app assigns a port through PORT when 3000 is taken.
    port: Number(process.env.PORT) || 3000,
    strictPort: false,
    open: true,
  },
});
