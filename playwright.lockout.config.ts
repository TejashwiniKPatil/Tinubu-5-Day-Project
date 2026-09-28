import { defineConfig } from '@playwright/test';
import baseConfig from './playwright.config';

export default defineConfig({
  ...baseConfig,
  globalSetup: undefined,
  projects: (baseConfig.projects ?? []).filter((project) => project.name === 'login'),
});
