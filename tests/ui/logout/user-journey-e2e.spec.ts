import { test } from '../../../src/fixtures/qa';
import { bondCreationData } from '../../../test-data/bondCreationData';
import { languages } from '../../../test-data/constants';
import { loginTestData } from '../../../test-data/loginData';

test.use({ storageState: { cookies: [], origins: [] } });

test(
  'TC-073 - End-to-end: login, change language, drag and drop an attachment, logout, and see the Tinubu logo',
  { tag: ['@e2e', '@stateful-login', '@stateful-bond'] },
  async ({ loginPage, dashboardPage, bondDetailPage, profileMenu }) => {
    const fileName = `qa-e2e-${Date.now()}.txt`;

    await test.step('Log in with the QA account', async () => {
      await loginPage.login(loginTestData.validUsername, loginTestData.validPassword);
      await dashboardPage.assertDashboardReady();
    });

    await test.step('Change the language to Italiano and back to English', async () => {
      await dashboardPage.assertLanguageSelectLabelled();
      try {
        await dashboardPage.changeLanguage(languages.italian);
      } finally {
        // The choice persists for the account, so always restore English for the other specs.
        await dashboardPage.changeLanguage(languages.english);
      }
    });

    await test.step('Drag and drop an attachment onto the QA bond', async () => {
      await dashboardPage.openBondByNumber(bondCreationData.attachmentBondNumber);
      await bondDetailPage.openAddAttachment();
      await bondDetailPage.dropFile(fileName, 'Tinubu QA end-to-end attachment');
      await bondDetailPage.saveAttachment();
      await bondDetailPage.assertAttachmentListed(fileName);
    });

    await test.step('Log out and see the Tinubu logo on the Sign In page', async () => {
      await profileMenu.logout();
      await loginPage.assertFormVisible();
      await loginPage.assertTinubuBrandingVisible();
    });
  },
);
