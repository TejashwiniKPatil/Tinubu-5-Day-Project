import { expect, Locator, Page } from '@playwright/test';
import { bondCreationHeading } from '../../test-data/constants';

export class DashboardPage {
  readonly page: Page;
  readonly startNewBondButton: Locator;
  readonly startBondHeading: Locator;

  constructor(page: Page) {
    this.page = page;
    this.startNewBondButton = page.getByTestId('dashboard-start-bond-button');
    this.startBondHeading = page.getByRole('heading', { name: bondCreationHeading });
  }

  /** Alpha's dashboard can take longer than the default 5 s to render on a slow network. */
  async assertDashboardReady(): Promise<void> {
    await expect(this.startNewBondButton).toBeVisible({ timeout: 15_000 });
  }

  async openBondCreation(): Promise<void> {
    await this.startNewBondButton.click();
    await expect(this.startBondHeading).toBeVisible();
  }
}
