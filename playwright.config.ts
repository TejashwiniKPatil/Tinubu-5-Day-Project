import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import { env } from 'node:process';
import path from 'path';
import { getBaseUrl } from './src/utils/environment';

dotenv.config({ path: path.resolve(__dirname, '.env') });
const baseURL = getBaseUrl();
const authFile = path.resolve(__dirname, 'playwright/.auth/user.json');

export default defineConfig({
  testDir: './tests',
  globalSetup: './src/global-setup.ts',
  outputDir: 'test-results',
  // The current QA environment shares one mutable login account across specs.
  // Run sequentially to avoid concurrent failed logins locking that account.
  fullyParallel: false,
  workers: 1,
  forbidOnly: !!env.CI,
  retries: env.CI ? 2 : 0,
  reporter: [['html', { open: 'never' }]],
  use: {
    baseURL,
    testIdAttribute: 'data-testid',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      testIgnore: ['**/login-cases.spec.ts', '**/lockout.spec.ts'],
      use: { ...devices['Desktop Chrome'], storageState: authFile },
    },
    {
      name: 'login',
      testMatch: ['**/login-cases.spec.ts', '**/lockout.spec.ts'],
      use: { ...devices['Desktop Chrome'], storageState: { cookies: [], origins: [] } },
    },
  ],
});
