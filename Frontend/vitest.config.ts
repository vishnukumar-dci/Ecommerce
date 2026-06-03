import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "happy-dom",
    setupFiles: ["./__tests__/setup.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      exclude: [
        "node_modules/",
        ".next/",
        "__tests__/",
        "**/*.d.ts",
        "**/*.config.*",
      ],
    },
  },
  resolve: {
    alias: {
      "@hooks": path.resolve(__dirname, "./hooks"),
      "@services": path.resolve(__dirname, "./services"),
      "@utils": path.resolve(__dirname, "./utils"),
      "@types": path.resolve(__dirname, "./types"),
      "@constants": path.resolve(__dirname, "./constants"),
      "@components": path.resolve(__dirname, "./components"),
      "@lib": path.resolve(__dirname, "./lib"),
      "@store": path.resolve(__dirname, "./lib/store"),
    },
  },
});
