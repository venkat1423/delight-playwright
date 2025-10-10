import { defineConfig, devices } from '@playwright/test';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '.env') });
import * as dotenv from 'dotenv';
dotenv.config();

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  // reporter: 'html',
  reporter: 'allure-playwright',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {

    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    /* Base URL to use in actions like `await page.goto('/')`. */
    // baseURL: 'http://localhost:3000',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
  },

  /* Configure projects for different test types using tags */
  projects: [
    /* Smoke Tests - Critical functionality */
    {
      name: 'smoke',
      testMatch: '**/*.spec.ts',
      use: { ...devices['Desktop Chrome'] },
      retries: 0,
      timeout: 30000,
      grep: /@smoke/,
    },

    /* Regression Tests - All functionality */
    {
      name: 'regression',
      testMatch: '**/*.spec.ts',
      use: { ...devices['Desktop Chrome'] },
      retries: process.env.CI ? 2 : 0,
      timeout: 60000,
      grep: /@regression/,
    },

    /* API Tests - Backend functionality */
    {
      name: 'api',
      testMatch: '**/*.spec.ts',
      use: { ...devices['Desktop Chrome'] },
      retries: 1,
      timeout: 30000,
      grep: /@api/,
    },

    /* Performance Tests - Load and speed */
    {
      name: 'performance',
      testMatch: '**/*.spec.ts',
      use: { ...devices['Desktop Chrome'] },
      retries: 0,
      timeout: 120000,
      grep: /@performance/,
    },

    /* Visual Tests - UI appearance */
    {
      name: 'visual',
      testMatch: '**/*.spec.ts',
      use: { ...devices['Desktop Chrome'] },
      retries: 0,
      timeout: 30000,
      grep: /@visual/,
    },

    /* Cross-browser Tests - Chrome */
    {
      name: 'cross-browser-chrome',
      testMatch: '**/*.spec.ts',
      use: { ...devices['Desktop Chrome'] },
      retries: 1,
      timeout: 60000,
      grep: /@cross-browser/,
    },

    /* Cross-browser Tests - Firefox */
    {
      name: 'cross-browser-firefox',
      testMatch: '**/*.spec.ts',
      use: { ...devices['Desktop Firefox'] },
      retries: 1,
      timeout: 60000,
      grep: /@cross-browser/,
    },

    /* Cross-browser Tests - Safari */
    {
      name: 'cross-browser-safari',
      testMatch: '**/*.spec.ts',
      use: { ...devices['Desktop Safari'] },
      retries: 1,
      timeout: 60000,
      grep: /@cross-browser/,
    },
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  // },

  /* npm run test:smoke        # Runs all @smoke tests
npm run test:regression   # Runs all @regression tests
npm run test:performance  # Runs all @performance tests
npm run test:visual       # Runs all @visual tests
npm run test:auth         # Runs all @auth tests*/
});
