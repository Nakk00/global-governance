import { defineConfig } from "@playwright/test"

export default defineConfig({
  testDir: "../e2e",
  fullyParallel: true,
  reporter: "list",
  retries: 0,
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL ?? "http://localhost:5173",
    trace: "retain-on-failure",
  },
  projects: [
    {
      name: "chrome",
      use: {
        channel: "chrome",
      },
    },
  ],
})
