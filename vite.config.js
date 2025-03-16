import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"), // ✅ Allows importing with "@/"
    },
  },

  server: {
    port: 5173, // ✅ Change if needed
    open: true, // ✅ Opens browser on `npm run dev`
    cors: true, // ✅ Prevent CORS issues
  },

  build: {
    outDir: "dist", // ✅ Ensure correct build folder
    sourcemap: true, // ✅ Helps debugging
  },

  define: {
    "process.env": {}, // ✅ Ensures compatibility with env variables
  },
});
