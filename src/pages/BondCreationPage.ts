import { expect, Locator, Page } from '@playwright/test';

/** Interactions for the inspected Bond Selection and Start your Quote screens. */
export class BondCreationPage {
  readonly page: Page;
  readonly agencySelector: Locator;
  readonly agencySearch: Locator;
  readonly bondTypeSearch: Locator;
  readonly principalSearch: Locator;
  readonly bondFormCards: Locator;
  readonly bondForm: Locator;

  constructor(page: Page) {
    this.page = page;
    this.agencySelector = page.getByTestId('new-bond-search-filter-agency-select');
    this.agencySearch = page.getByTestId('new-bond-search-filter-agency-search');
    this.bondTypeSearch = page.getByTestId('new-bond-search-filter-bond-search');
    this.principalSearch = page.getByTestId('principal-search-input');
    this.bondFormCards = page.locator(
      '[data-testid^="new-bond-form-card-bond-form-"][data-testid$="-row"]',
    );
    this.bondForm = page.getByTestId('new-bond-main-content');
  }

  async assertAgencySelectorReady(): Promise<void> {
    await expect(this.agencySelector).toBeVisible();
    await expect(this.agencySelector).toBeEnabled();
  }

  async openAgencySelector(): Promise<void> {
    await this.agencySelector.click();
    await expect(this.agencySearch).toBeVisible();
  }

  async searchAndSelectAgency(name: string): Promise<void> {
    await this.openAgencySelector();
    await this.agencySearch.fill(name);
    await this.selectAgencyOption(name);
  }

  async selectAgencyDirectly(name: string): Promise<void> {
    await this.openAgencySelector();
    await this.selectAgencyOption(name);
  }

  async selectCommercialFamily(): Promise<void> {
    await this.page.getByTestId('new-bond-search-segment-commercial').click();
    await expect(this.bondFormCards.first()).toBeVisible();
  }

  async searchAndSelectBond(formName: string, quoteTitle: string): Promise<void> {
    await this.bondTypeSearch.fill(formName);
    const card = this.bondFormCards.filter({ hasText: formName });
    await expect(card).toHaveCount(1);
    await card.getByRole('button', { name: 'Select', exact: true }).click();
    await this.assertQuoteFormVisible(quoteTitle);
  }

  async assertQuoteFormVisible(bondType: string): Promise<void> {
    await expect(this.page.getByRole('heading', { name: 'Start your Quote' })).toBeVisible();
    await expect(this.page.getByText(bondType, { exact: true }).last()).toBeVisible();
  }

  /** Checks each header item by its label, because values such as the bond type also appear in the page title. */
  async assertQuoteContext(items: Record<string, string>): Promise<void> {
    for (const [label, value] of Object.entries(items)) {
      const headerItem = this.bondForm.getByText(label, { exact: true }).locator('..');
      await expect(headerItem).toContainText(value);
    }
  }

  async searchAndSelectPrincipal(name: string): Promise<void> {
    await this.principalSearch.fill(name);
    const result = this.page.getByText(name, { exact: true }).last();
    await expect(result).toBeVisible();
    await result.click();
    await expect(this.page.getByText(name, { exact: true }).last()).toBeVisible();
  }

  async assertPrincipalVisible(name: string): Promise<void> {
    await expect(this.page.getByText(name, { exact: true }).last()).toBeVisible();
  }

  async assertSurchargesVisible(): Promise<void> {
    await expect(this.page.getByRole('heading', { name: 'Surcharges & Discounts', exact: true })).toBeVisible();
  }

  async checkProofOfInsurance(): Promise<void> {
    await this.page.getByLabel('Contractor Has Proof Of Insurance', { exact: true }).check();
  }

  async assertStartNewBondVisible(): Promise<void> {
    await expect(this.page.getByRole('button', { name: 'Start New Bond', exact: true })).toBeVisible();
  }

  async fillField(label: string, value: string): Promise<void> {
    await this.field(label).fill(value);
  }

  async blurField(label: string): Promise<void> {
    await this.field(label).press('Tab');
  }

  async fieldValue(label: string): Promise<string> {
    return this.field(label).inputValue();
  }

  async selectOption(label: string, value: string): Promise<void> {
    await this.field(label).click();
    await this.page.getByRole('option', { name: value, exact: true }).click();
  }

  async assertCheckboxChecked(): Promise<void> {
    await expect(this.page.getByTestId('new-bond-dynamic-field-q-500077-checkbox')).toBeChecked();
  }

  async assertFieldsBlank(labels: string[]): Promise<void> {
    for (const label of labels) {
      await expect(this.field(label)).toHaveValue('');
    }
  }

  async submitQuote(): Promise<void> {
    await this.page.getByTestId('new-bond-submit-button').click();
  }

  async submitQuoteSuccessfully(): Promise<void> {
    const responsePromise = this.page.waitForResponse((response) => response.url().includes('/execute'));
    await this.submitQuote();
    const response = await responsePromise;
    expect(response.ok(), `Quote execution returned HTTP ${response.status()}`).toBeTruthy();
  }

  async submitQuoteWithInvalidAmount(label: string): Promise<void> {
    const responsePromise = this.page
      .waitForResponse((response) => response.url().includes('/execute'), { timeout: 7000 })
      .catch(() => undefined);
    await this.submitQuote();

    if (!(await this.field(label).evaluate((element: HTMLInputElement) => element.validity.valid))) {
      return;
    }

    const response = await responsePromise;
    if (response) {
      expect(response.ok(), `Invalid amount reached quote execution: HTTP ${response.status()}`).toBeFalsy();
      return;
    }

    await expect(this.page.getByRole('alert')).toBeVisible();
  }

  async cancelQuote(): Promise<void> {
    await this.page.getByTestId('new-bond-cancel-button').click();
    const confirmation = this.page.getByRole('dialog');
    await expect(confirmation).toContainText('You have unsaved changes. Are you sure you want to leave without saving?');
    await confirmation.getByRole('button', { name: 'Yes, continue', exact: true }).click();
    await expect(this.page).toHaveURL(/\/bonds(?:\?.*)?$/);
  }

  async startAnotherBondFromNavigation(): Promise<void> {
    await this.page.getByRole('button', { name: 'Bonds', exact: true }).first().click();
    await this.page.getByRole('button', { name: 'Start New Bond', exact: true }).click();
    await this.assertAgencySelectorReady();
  }

  private field(label: string): Locator {
    const testIds: Record<string, string> = {
      'Bond Amount': 'new-bond-initial-info-penalty-amount-range-input',
      'Pre Pay Selection': 'new-bond-initial-info-pre-pay-select',
      'Existing Bond Number': 'new-bond-initial-info-existing-bond-number-input',
      'Effective Date': 'new-bond-initial-info-effective-date-input',
      'Expiration Date': 'new-bond-initial-info-expiration-date-input',
      'Bond User Version': 'new-bond-initial-info-bond-user-version-input',
      'Contractor License Number': 'new-bond-dynamic-field-q-500073-text-input',
      'Contractor License Effective Date': 'new-bond-dynamic-field-q-500075-date-input',
      'Contractor License Bond Amount': 'new-bond-dynamic-field-q-500076-money-input',
      'Business Structure': 'new-bond-dynamic-field-q-500078-select',
      'State of Incorporation': 'new-bond-dynamic-field-q-500079-state-select',
      'How many years have you held this license?': 'new-bond-dynamic-field-q-500074-number-input',
      'Percentage of business done in state of incorporation': 'new-bond-dynamic-field-q-500080-decimal-input',
      'Value (%)': 'nb-sd-value-1000002',
      'Assigned Underwriter': 'new-bond-team-underwriter-select',
      'Assigned Producer': 'new-bond-team-producer-select',
    };

    if (label === 'Special Instructions') {
      return this.page.getByPlaceholder('Add special instructions (optional)...');
    }

    const testId = testIds[label];
    if (!testId) throw new Error(`No inspected Bond Creation field mapping for "${label}".`);
    return this.page.getByTestId(testId);
  }

  private async selectAgencyOption(name: string): Promise<void> {
    const option = this.page.getByRole('option', { name, exact: true });
    await expect(option).toBeVisible();
    await option.click();
    await expect(this.agencySelector).toContainText(name);
  }
}
