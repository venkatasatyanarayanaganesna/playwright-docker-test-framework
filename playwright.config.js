// @ts-check
const { defineConfig, devices } = require('@playwright/test');
require('dotenv').config();

/**
 * Central configuration for the whole framework.
 * BASE_URL can be swapped per environment via .env (dev/staging/prod).
 */
module.exports = defineConfig({
  testDir: './tests',
  timeout: 30 * 1000,
  expect: {
    timeout: 5000,
    toHaveScreenshot: { maxDiffPixelRatio: 0.02 },
  },

  // Fail the build on CI if someone accidentally left test.only in the code.
  forbidOnly: !!process.env.CI,

  // Retry flaky tests automatically on CI, not locally.
  retries: process.env.CI ? 2 : 0,

  // Parallel workers: fewer on CI to keep it stable, more locally for speed.
  workers: process.env.CI ? 2 : undefined,
  fullyParallel: true,

  reporter: [
    ['html', { open: 'never' }],
    ['list'],
    ['allure-playwright'],
  ],

  use: {
    baseURL: process.env.BASE_URL || 'https://www.saucedemo.com',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 10 * 1000,
  },

  projects: [
    {
      name: 'chromium',
      testDir: './tests',
      testMatch: ['ui/**/*.spec.js', 'visual/**/*.spec.js'],
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      testDir: './tests',
      testMatch: ['ui/**/*.spec.js', 'visual/**/*.spec.js'],
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      testDir: './tests',
      testMatch: ['ui/**/*.spec.js', 'visual/**/*.spec.js'],
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'mobile-chrome',
      testDir: './tests',
      testMatch: ['ui/**/*.spec.js', 'visual/**/*.spec.js'],
      use: { ...devices['Pixel 7'] },
    },
    {
      // Dedicated project for API-only tests — no browser needed, faster.
      name: 'api',
      testDir: './tests/api',
      use: {
        baseURL: process.env.API_BASE_URL || 'https://jsonplaceholder.typicode.com',
      },
    },
  ],
});
