import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), svgr()],
  server: {
    host: true,
    strictPort: true,
    port: 5173,
    // proxy: {
    //   "/api/v1": {
    //     target: "http://127.0.0.1:8000",
    //     changeOrigin: true,
    //     secure: false,
    //   },
    // },
  },
});
