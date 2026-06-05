import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  resolve: {
    alias: {
      "@config": path.resolve(__dirname, "src/config"),
      "@components": path.resolve(__dirname, "src/components"),
      "@layouts": path.resolve(__dirname, "src/layouts"),
      "@utils": path.resolve(__dirname, "src/utils"),
    },
  },
  test: {
    environment: "happy-dom",
    include: ["src/**/*.{test,spec}.{ts,js}"],
    exclude: ["e2e/**", "node_modules/**"],
  },
});
