import { defineConfig } from "@playwright/test"

const isLiveChatRun = Boolean(process.env.VITE_CHAT_API_URL?.trim())
const previewPort = isLiveChatRun ? 4174 : 4173
const previewUrl = `http://127.0.0.1:${previewPort}`

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  reporter: "list",
  retries: 0,
  use: {
    baseURL: previewUrl,
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
  webServer: {
    command: `pnpm build && pnpm preview --host 127.0.0.1 --port ${previewPort}`,
    url: previewUrl,
    reuseExistingServer: !isLiveChatRun,
    timeout: 120_000,
  },
})
