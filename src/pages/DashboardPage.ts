import { expect, Locator, Page } from '@playwright/test';
import { Language, languageLabel, startBondButtonText } from '../../test-data/constants';

export class DashboardPage {
  readonly page: Page;
  readonly startNewBondButton: Locator;
  readonly bondSearchPage: Locator;
  readonly languageSelect: Locator;
  readonly quickSearch: Locator;

  constructor(page: Page) {
    this.page = page;
    this.startNewBondButton = page.getByTestId('dashboard-start-bond-button');
    this.bondSearchPage = page.getByTestId('new-bond-search-page-root');
    // The navbar language select has no data-testid, and its aria-label is translated when the
    // language changes. It is the navbar's only read-only listbox input (Quick Search is editable).
    this.languageSelect = page.getByTestId('app-navbar').locator('input[readonly][aria-haspopup="listbox"]');
    this.quickSearch = page.getByTestId('app-quick-search-query-input');
  }

  /** Alpha's dashboard can take longer than the default 5 s to render on a slow network. */
  async assertDashboardReady(): Promise<void> {
    await expect(this.startNewBondButton).toBeVisible({ timeout: 15_000 });
  }

  async assertStartBondLabel(): Promise<void> {
    await expect(this.startNewBondButton).toContainText(startBondButtonText);
  }

  async assertLanguageSelectLabelled(): Promise<void> {
    await expect(this.languageSelect).toHaveAccessibleName(languageLabel);
  }

  /** Changes the UI language and checks the page's html lang attribute follows. */
  async changeLanguage(language: Language): Promise<void> {
    await expect(this.languageSelect).toHaveCount(1);
    await this.languageSelect.click();
    await this.page.getByRole('option', { name: language.option, exact: true }).click();
    await expect(this.languageSelect).toHaveValue(language.option);
    await expect(this.page.locator('html')).toHaveAttribute('lang', language.htmlLang);
  }

  /** Opens a bond from the navbar quick search by its bond number. */
  async openBondByNumber(bondNumber: string): Promise<void> {
    await this.quickSearch.fill(bondNumber);
    const result = this.page
      .locator('[data-testid^="app-quick-search-result-row-bond-"]')
      .filter({ hasText: bondNumber });
    await expect(result).toHaveCount(1);
    await result.click();
    await expect(this.page).toHaveURL(/\/bonds\/\d+$/);
  }

  async openBondCreation(): Promise<void> {
    await this.startNewBondButton.click();
    await expect(this.bondSearchPage).toBeVisible();
  }
}
