import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: "127.0.0.1",
    // The desktop app assigns a port through PORT when 3000 is taken.
    port: Number(process.env.PORT) || 3000,
    strictPort: false,
    open: true,
  },
});
