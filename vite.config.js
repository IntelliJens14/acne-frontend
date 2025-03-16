import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path"; // ✅ Use `node:path` for compatibility

export default defineConfig({
  plugins: [react()],

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"), // ✅ Allows importing with "@/components"
    },
  },

  server: {
    port: 5173, // ✅ Change port if needed
    open: true, // ✅ Auto-opens browser on `npm run dev`
    cors: true, // ✅ Allow frontend to communicate with APIs

    proxy: {
      "/api": {
        target: "https://acne-ai-backend.onrender.com",
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },

  build: {
    outDir: "dist", // ✅ Ensures correct output directory
    sourcemap: true, // ✅ Useful for debugging
  },

  define: {
    "process.env": {}, // ✅ Ensures environment variables work in Vite
  },
});
