import { expect, Locator, Page } from '@playwright/test';
import { startBondButtonText } from '../../test-data/constants';

export class DashboardPage {
  readonly page: Page;
  readonly startNewBondButton: Locator;
  readonly bondSearchPage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.startNewBondButton = page.getByTestId('dashboard-start-bond-button');
    this.bondSearchPage = page.getByTestId('new-bond-search-page-root');
  }

  /** Alpha's dashboard can take longer than the default 5 s to render on a slow network. */
  async assertDashboardReady(): Promise<void> {
    await expect(this.startNewBondButton).toBeVisible({ timeout: 15_000 });
  }

  async assertStartBondLabel(): Promise<void> {
    await expect(this.startNewBondButton).toContainText(startBondButtonText);
  }

  async openBondCreation(): Promise<void> {
    await this.startNewBondButton.click();
    await expect(this.bondSearchPage).toBeVisible();
  }
}
