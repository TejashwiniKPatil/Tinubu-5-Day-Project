import { expect, Locator, Page } from '@playwright/test';
import { logoutText, profileName } from '../../test-data/constants';

export class ProfileMenu {
  readonly page: Page;
  readonly profile: Locator;
  readonly logoutMenuItem: Locator;

  constructor(page: Page) {
    this.page = page;
    this.profile = page.getByText(profileName);
    this.logoutMenuItem = page.getByRole('menuitem', { name: logoutText });
  }

  async open(): Promise<void> {
    await this.profile.click();
  }

  async assertLogoutVisible(): Promise<void> {
    await expect(this.logoutMenuItem).toBeVisible();
  }

  async logout(): Promise<void> {
    await this.open();
    await this.logoutMenuItem.click();
  }
}
