import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { chromium, type FullConfig } from '@playwright/test';
import { LoginPage } from './pages/LoginPage';
import { getBaseUrl, getRequiredEnvironmentVariable } from './utils/environment';

const authFile = path.resolve(__dirname, '../playwright/.auth/user.json');
const sessionStorageFile = path.resolve(__dirname, '../playwright/.auth/session-storage.json');

async function globalSetup(_config: FullConfig): Promise<void> {
  const browser = await chromium.launch();

  try {
    const context = await browser.newContext({
      baseURL: getBaseUrl(),
    });
    const page = await context.newPage();
    const loginPage = new LoginPage(page);

    await loginPage.login(
      getRequiredEnvironmentVariable('TEST_USERNAME'),
      getRequiredEnvironmentVariable('TEST_PASSWORD'),
    );
    await mkdir(path.dirname(authFile), { recursive: true });
    await context.storageState({ path: authFile, indexedDB: true });
    const sessionStorage = await page.evaluate(() => {
      const entries: Record<string, string> = {};
      for (let index = 0; index < window.sessionStorage.length; index += 1) {
        const key = window.sessionStorage.key(index);
        if (key) entries[key] = window.sessionStorage.getItem(key) ?? '';
      }
      return entries;
    });
    await writeFile(sessionStorageFile, JSON.stringify(sessionStorage), 'utf8');
    await context.close();
  } finally {
    await browser.close();
  }
}

export default globalSetup;
