import AxeBuilder from '@axe-core/playwright';
import { Page } from '@playwright/test';
import { expect, test } from '../../src/fixtures/qa';
import { openConfiguredQuote } from '../../src/helpers/bondCreation';
import { loginTestData } from '../../test-data/loginData';
import { BondField, bondFields } from '../../test-data/constants';

// Automatable checks from test-cases/usability-test-cases.md. Visual findings (USA-001 to USA-005)
// stay manual. Keyboard checks use an unknown username, so they never count toward lockout.
const tags = ['@usability'];

/** Runs axe for WCAG 2.1 AA and reports serious or critical violations by rule and element count. */
async function seriousViolations(page: Page, rules?: string[]): Promise<string[]> {
  let builder = new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']);
  if (rules) builder = builder.withRules(rules);
  const { violations } = await builder.analyze();
  return violations
    .filter((v) => v.impact === 'serious' || v.impact === 'critical')
    .map((v) => `${v.id} (${v.impact}, ${v.nodes.length} element(s)): ${v.help}`);
}

test.describe('Usability checks on Login', () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test('USA-006a - Login page has no serious accessibility violations', { tag: tags }, async ({ page, loginPage }) => {
    await loginPage.open();
    await loginPage.assertFormVisible();
    expect(await seriousViolations(page)).toEqual([]);
  });

  test('USA-007 - Login can be completed with the keyboard only', { tag: tags }, async ({ page, loginPage }) => {
    await loginPage.open();
    await loginPage.usernameInput.focus();
    await page.keyboard.type(loginTestData.invalidUsername);

    await page.keyboard.press('Tab');
    await expect(loginPage.passwordInput).toBeFocused();
    await page.keyboard.type(loginTestData.invalidPassword);

    // Tab forward until Sign In has focus; a show-password toggle may sit in between.
    for (let i = 0; i < 4; i++) {
      if (await loginPage.signInButton.evaluate((el) => el === document.activeElement)) break;
      await page.keyboard.press('Tab');
    }
    await expect(loginPage.signInButton).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(page.getByRole('alert').first()).toBeVisible();
  });

  test('USA-009 - Keyboard focus is visible on Login controls', { tag: tags }, async ({ page, loginPage }) => {
    await loginPage.open();
    await loginPage.assertFormVisible();
    const focusStyle = (el: Element) => {
      const style = getComputedStyle(el);
      const wrapper = getComputedStyle(el.parentElement!);
      return [style.outline, style.boxShadow, style.borderColor, wrapper.outline, wrapper.boxShadow, wrapper.borderColor].join('|');
    };
    const noVisibleFocus: string[] = [];
    for (const [name, control] of [
      ['Username', loginPage.usernameInput],
      ['Password', loginPage.passwordInput],
      ['Sign In', loginPage.signInButton],
    ] as const) {
      await page.locator('body').click({ position: { x: 1, y: 1 } });
      const unfocused = await control.evaluate(focusStyle);
      await control.focus();
      await page.keyboard.press('Shift+Tab');
      await page.keyboard.press('Tab');
      await expect(control).toBeFocused();
      if ((await control.evaluate(focusStyle)) === unfocused) noVisibleFocus.push(name);
    }
    expect(noVisibleFocus, 'Controls with no visible focus indicator').toEqual([]);
  });
});

test.describe('Usability checks on the quote form', () => {
  test('USA-006b - Quote form has no serious accessibility violations', { tag: [...tags, '@bond-creation'] }, async ({
    authenticatedSession,
    dashboardPage,
    bondCreationPage,
  }) => {
    void authenticatedSession;
    await openConfiguredQuote(dashboardPage, bondCreationPage);
    expect(await seriousViolations(bondCreationPage.page)).toEqual([]);
  });

  test('USA-010 - Quote form fields are announced by their labels', { tag: [...tags, '@bond-creation'] }, async ({
    authenticatedSession,
    dashboardPage,
    bondCreationPage,
  }) => {
    void authenticatedSession;
    await openConfiguredQuote(dashboardPage, bondCreationPage);
    const fields: BondField[] = [
      bondFields.bondAmount,
      bondFields.prePay,
      bondFields.effectiveDate,
      bondFields.businessStructure,
      bondFields.stateOfIncorporation,
      bondFields.underwriter,
    ];
    expect(await bondCreationPage.fieldsNotNamedByLabel(fields), 'Fields not announced by their label').toEqual([]);
  });

  test('USA-008 - Cancel dialog takes keyboard focus', { tag: [...tags, '@bond-creation'] }, async ({
    authenticatedSession,
    dashboardPage,
    bondCreationPage,
  }) => {
    void authenticatedSession;
    await openConfiguredQuote(dashboardPage, bondCreationPage);
    // The dialog only appears when the form has unsaved changes.
    await bondCreationPage.fillField(bondFields.specialInstructions, 'QA keyboard focus check');
    await bondCreationPage.cancelButton.focus();
    await bondCreationPage.page.keyboard.press('Enter');
    await bondCreationPage.assertFocusInCancelDialog();
    await bondCreationPage.page.keyboard.press('Tab');
    await bondCreationPage.assertFocusInCancelDialog();
  });
});
