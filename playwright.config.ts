import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:4321',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    // Chrome - Chromium
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    // Firefox
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    // Safari (WebKit)
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    // Microsoft Edge (Chromium)
    {
      name: 'edge',
      use: { ...devices['Desktop Edge'] },
    },
    // Accessibility testing with axe-core
    {
      name: 'accessibility',
      use: {
        ...devices['Desktop Chrome'],
        actionTimeout: 0,
      },
      testMatch: /.*a11y.*\.spec\.ts/,
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:4321',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
});