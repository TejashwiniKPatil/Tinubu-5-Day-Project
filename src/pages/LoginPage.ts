import { expect, Locator, Page } from '@playwright/test';
import { loginLabels, signInText } from '../../test-data/constants';

export class LoginPage {
  readonly page: Page;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly signInButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.usernameInput = page.getByLabel(loginLabels.username);
    this.passwordInput = page.getByLabel(loginLabels.password);
    this.signInButton = page.getByRole('button', { name: signInText });
  }

  async open(): Promise<void> {
    await this.page.goto('/', { waitUntil: 'domcontentloaded' });
  }

  async assertFormVisible(): Promise<void> {
    await expect(this.usernameInput).toBeVisible();
    await expect(this.passwordInput).toBeVisible();
    await expect(this.signInButton).toBeVisible();
  }

  async submit(username: string, password: string): Promise<void> {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.signInButton.click();
  }

  async login(username: string, password: string): Promise<void> {
    await this.open();
    await this.submit(username, password);
    await this.assertAuthenticated();
  }

  async assertAuthenticated(): Promise<void> {
    const dashboardEntry = this.page.getByTestId('dashboard-start-bond-button');
    const loginAlert = this.page.getByRole('alert');

    await expect(dashboardEntry.or(loginAlert).first()).toBeVisible({ timeout: 15_000 });

    if (await loginAlert.first().isVisible()) {
      const message = (await loginAlert.first().innerText()).trim();
      throw new Error(`Login was rejected: ${message || 'the application displayed an authentication alert.'}`);
    }
  }

  async assertRejected(): Promise<void> {
    await expect(this.usernameInput).toBeVisible();
    await expect(this.passwordInput).toBeVisible();
    await expect(this.signInButton).toBeVisible();
  }

  async assertMessageVisible(text: string): Promise<void> {
    await expect(this.page.getByText(text, { exact: true })).toBeVisible();
  }
}
