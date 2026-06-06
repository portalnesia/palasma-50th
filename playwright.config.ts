import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "e2e",
  timeout: 30_000,
  retries: 0,
  use: {
    baseURL: "http://localhost:4321",
    headless: true,
  },
  projects: [
    {
      name: "no-supabase",
    },
    {
      name: "with-supabase",
    },
  ],
  webServer: [
    {
      command: "bun run dev --host 0.0.0.0 --port 4321",
      port: 4321,
      reuseExistingServer: true,
      timeout: 30_000,
    },
  ],
  reporter: [["list"]],
});
