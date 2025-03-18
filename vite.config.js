import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc"; // ✅ Faster React compilation
import path from "node:path";

export default defineConfig(({ mode }) => ({
  plugins: [react()],

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"), // ✅ Allows `@/components` imports
    },
  },

  server: {
    port: 5173,
    open: mode === "development", // ✅ Auto-opens in dev, not in prod
    cors: true,

    proxy: {
      "/api": {
        target: "https://acne-ai-backend-2nmn.onrender.com", // ✅ Your backend URL
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },

  build: {
    outDir: "dist",
    sourcemap: mode === "development", // ✅ Only enable sourcemaps in dev
  },

  define: {
    "process.env": process.env, // ✅ Fix environment variable issues
  },
}));
