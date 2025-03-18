import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path"; // ✅ Ensure compatibility with Node.js

export default defineConfig({
  plugins: [react()],

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"), // ✅ Allows "@/components" imports
    },
  },

  server: {
    port: 5173, // ✅ Change port if needed
    open: true, // ✅ Auto-opens browser on `npm run dev`
    cors: true, // ✅ Enables CORS for API requests

    proxy: {
      "/api": {
        target: "https://acne-ai-backend.onrender.com",
        changeOrigin: true,
        secure: true,
        ws: true, // ✅ Enable WebSocket support if needed
        rewrite: (path) => path.replace(/^\/api/, ""),
        configure: (proxy) => {
          proxy.on("error", (err) => console.error("Proxy Error:", err));
          proxy.on("proxyReq", (proxyReq, req) => {
            console.log(`[Proxy] ${req.method} ${req.url} → ${proxyReq.path}`);
          });
        },
      },
    },

    hmr: true, // ✅ Ensures Hot Module Replacement works correctly
  },

  build: {
    outDir: "dist", // ✅ Defines output directory
    sourcemap: true, // ✅ Enables source maps for debugging
    assetsDir: "assets", // ✅ Ensures assets are stored in `dist/assets/`
  },
});
