import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    // Keep hashed app assets under /app so they stay clear of /data and friends.
    assetsDir: "app",
    // mapbox-gl alone is ~1.8 MB. It already loads lazily, so the default
    // 500 kB warning has nothing left to tell us.
    chunkSizeWarningLimit: 2000,
  },
});
