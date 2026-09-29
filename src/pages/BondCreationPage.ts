import { expect, Locator, Page } from '@playwright/test';
import {
  BondField,
  bondFields,
  bondNavText,
  allBondsStartButtonText,
  companiesLabel,
  specialInstructionsPlaceholder,
  surchargesHeading,
  unsavedChangesMessage,
} from '../../test-data/constants';

/** data-testids observed on the quote form; text lives in test-data/constants.ts. */
const fieldTestIds: Partial<Record<BondField, string>> = {
  [bondFields.bondAmount]: 'new-bond-initial-info-penalty-amount-range-input',
  [bondFields.prePay]: 'new-bond-initial-info-pre-pay-select',
  [bondFields.existingBondNumber]: 'new-bond-initial-info-existing-bond-number-input',
  [bondFields.effectiveDate]: 'new-bond-initial-info-effective-date-input',
  [bondFields.expirationDate]: 'new-bond-initial-info-expiration-date-input',
  [bondFields.bondUserVersion]: 'new-bond-initial-info-bond-user-version-input',
  [bondFields.contractorLicenseNumber]: 'new-bond-dynamic-field-q-500073-text-input',
  [bondFields.contractorLicenseEffectiveDate]: 'new-bond-dynamic-field-q-500075-date-input',
  [bondFields.contractorLicenseBondAmount]: 'new-bond-dynamic-field-q-500076-money-input',
  [bondFields.businessStructure]: 'new-bond-dynamic-field-q-500078-select',
  [bondFields.stateOfIncorporation]: 'new-bond-dynamic-field-q-500079-state-select',
  [bondFields.yearsHeldLicense]: 'new-bond-dynamic-field-q-500074-number-input',
  [bondFields.businessPercentage]: 'new-bond-dynamic-field-q-500080-decimal-input',
  [bondFields.modifierValue]: 'nb-sd-value-1000002',
  [bondFields.underwriter]: 'new-bond-team-underwriter-select',
  [bondFields.producer]: 'new-bond-team-producer-select',
};

/** Interactions for the inspected Bond Selection and Start your Quote screens. */
export class BondCreationPage {
  readonly page: Page;
  readonly agencySelector: Locator;
  readonly agencySearch: Locator;
  readonly bondTypeSearch: Locator;
  readonly principalSearch: Locator;
  readonly bondFormCards: Locator;
  readonly bondForm: Locator;
  readonly proofOfInsuranceCheckbox: Locator;
  readonly submitButton: Locator;
  readonly cancelButton: Locator;
  readonly validationBanner: Locator;
  readonly allBondsStartButton: Locator;
  readonly companiesCount: Locator;
  readonly firstCompanyPrincipalButton: Locator;

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
    this.proofOfInsuranceCheckbox = page.getByTestId('new-bond-dynamic-field-q-500077-checkbox');
    this.submitButton = page.getByTestId('new-bond-submit-button');
    this.cancelButton = page.getByTestId('new-bond-cancel-button');
    this.validationBanner = page.getByTestId('new-bond-validation-error-banner');
    this.allBondsStartButton = page.getByTestId('all-bonds-start-bond-button');
    const principalSection = page.getByTestId('principal-indemnitor-principal-indemnitors-section');
    this.companiesCount = principalSection.getByText(companiesLabel, { exact: true }).locator('..');
    this.firstCompanyPrincipalButton = principalSection
      .locator('[data-testid^="principal-indemnitor-account-company-"][data-testid$="-principal-button"]:enabled')
      .first();
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
    await card.locator('[data-testid$="-select-button"]').click();
    await this.assertQuoteFormVisible(quoteTitle);
  }

  async assertQuoteFormVisible(bondType: string): Promise<void> {
    await expect(this.submitButton).toBeVisible();
    await expect(this.page.getByText(bondType, { exact: true }).last()).toBeVisible();
  }

  /** Checks each header item by its label, because values such as the bond type also appear in the page title. */
  async assertQuoteContext(items: Record<string, string>): Promise<void> {
    for (const [label, value] of Object.entries(items)) {
      const headerItem = this.bondForm.getByText(label, { exact: true }).locator('..');
      await expect(headerItem).toContainText(value);
    }
  }

  /** Selects the first search result after checking it is available, not disabled. */
  async searchAndSelectPrincipal(searchText: string): Promise<void> {
    await this.principalSearch.fill(searchText);
    const results = this.page.getByTestId('principal-search-dropdown');
    const firstResult = results.getByTestId('principal-search-result').first();
    await expect(firstResult).toBeVisible();
    await expect(firstResult).toBeEnabled();
    await firstResult.click();
    await expect(results).toBeHidden();
    await this.assignFirstCompanyAsPrincipal();
  }

  /** Submit shows "At least one person or company is required" until the Companies count is (1). */
  async assignFirstCompanyAsPrincipal(): Promise<void> {
    await expect(this.firstCompanyPrincipalButton).toBeVisible();
    // Clicking an active Principal button unassigns it, so click only when the app has not assigned one.
    const assigned = await expect(this.companiesCount)
      .toContainText('(1)', { timeout: 5_000 })
      .then(() => true, () => false);
    if (!assigned) await this.firstCompanyPrincipalButton.click();
    await expect(this.companiesCount).toContainText('(1)');
  }

  async assertPrincipalVisible(searchText: string): Promise<void> {
    await expect(this.principalSearch).toHaveValue(new RegExp(searchText, 'i'));
  }

  async assertSurchargesVisible(): Promise<void> {
    await expect(this.page.getByRole('heading', { name: surchargesHeading, exact: true })).toBeVisible();
  }

  async checkProofOfInsurance(): Promise<void> {
    await this.proofOfInsuranceCheckbox.check();
  }

  async assertStartNewBondVisible(): Promise<void> {
    await expect(this.allBondsStartButton).toContainText(allBondsStartButtonText);
  }

  async fillField(label: BondField, value: string): Promise<void> {
    await this.field(label).fill(value);
  }

  async blurField(label: BondField): Promise<void> {
    await this.field(label).press('Tab');
  }

  async fieldValue(label: BondField): Promise<string> {
    return this.field(label).inputValue();
  }

  async selectOption(label: BondField, value: string): Promise<void> {
    await this.field(label).click();
    await this.page.getByRole('option', { name: value, exact: true }).click();
  }

  async assertCheckboxChecked(): Promise<void> {
    await expect(this.proofOfInsuranceCheckbox).toBeChecked();
  }

  async assertFieldsBlank(labels: BondField[]): Promise<void> {
    for (const label of labels) {
      await expect(this.field(label)).toHaveValue('');
    }
  }

  async submitQuote(): Promise<void> {
    await this.submitButton.click();
  }

  async submitQuoteSuccessfully(): Promise<void> {
    const responsePromise = this.page.waitForResponse((response) => response.url().includes('/execute'));
    await this.submitQuote();
    // Fail fast with the app's own message when client validation blocks submission.
    const outcome = await Promise.race([
      responsePromise,
      this.validationBanner.waitFor().then(() => undefined),
    ]);
    if (!outcome) {
      const message = (await this.validationBanner.innerText()).replace(/\s+/g, ' ').trim();
      throw new Error(`Submit was blocked by validation: "${message}"`);
    }
    expect(outcome.ok(), `Quote execution returned HTTP ${outcome.status()}`).toBeTruthy();
  }

  async submitQuoteWithInvalidAmount(label: BondField): Promise<void> {
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

  async openCancelDialog(): Promise<Locator> {
    await this.cancelButton.click();
    const confirmation = this.page.getByTestId('confirmation-modal-modal-root');
    await expect(confirmation).toContainText(unsavedChangesMessage);
    return confirmation;
  }

  /** Checks that keyboard focus has moved inside the open Cancel dialog. */
  async assertFocusInCancelDialog(): Promise<void> {
    const confirmation = this.page.getByTestId('confirmation-modal-modal-root');
    await expect
      .poll(() => confirmation.evaluate((root) => root.contains(document.activeElement)), {
        message: 'Keyboard focus should move into the Cancel dialog',
      })
      .toBe(true);
  }

  /** The field's accessible name should include its visible label, so screen readers announce it. */
  async fieldsNotNamedByLabel(labels: BondField[]): Promise<string[]> {
    const mismatches: string[] = [];
    for (const label of labels) {
      const field = this.field(label);
      await expect(field).toBeVisible();
      const snapshot = await field.ariaSnapshot();
      const announced = /"(.*)"/.exec(snapshot)?.at(1) ?? '';
      if (!announced.toLowerCase().includes(label.toLowerCase())) {
        mismatches.push(`${label}: announced as "${announced}"`);
      }
    }
    return mismatches;
  }

  async cancelQuote(): Promise<void> {
    await this.openCancelDialog();
    await this.page.getByTestId('confirmation-modal-submit-button').click();
    await expect(this.page).toHaveURL(/\/bonds(?:\?.*)?$/);
  }

  async startAnotherBondFromNavigation(): Promise<void> {
    // The navbar Bonds button has no data-testid, so it is found by its text inside the navbar.
    await this.page.getByTestId('app-navbar').getByRole('button', { name: bondNavText, exact: true }).click();
    await this.allBondsStartButton.click();
    await this.assertAgencySelectorReady();
  }

  private field(label: BondField): Locator {
    // The Special Instructions textarea has no data-testid.
    if (label === bondFields.specialInstructions) {
      return this.page.getByPlaceholder(specialInstructionsPlaceholder);
    }

    const testId = fieldTestIds[label];
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
