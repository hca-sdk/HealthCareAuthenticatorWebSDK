import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  publicDir: "public",
  build: {
    rollupOptions: {
      input: {
        index: resolve(__dirname, "index.html"),
        dashboard: resolve(__dirname, "dashboard.html"),
        expired: resolve(__dirname, "expired-link.html"),
      },
    },
  },
  server: {
    port: 8080
  }
});
