import { test } from '../../../src/fixtures/qa';
import { loginTestData } from '../../../test-data/loginData';
import { protectedPath } from '../../../test-data/constants';

// Signs in with its own session and logs out, so it lives with the other logout specs,
// which run last because logging out can end the shared saved session.
test.use({ storageState: { cookies: [], origins: [] } });

test('SEC-001 - Session is invalidated on logout @security @stateful-login', async ({
  page,
  loginPage,
  bondCreationPage,
  profileMenu,
}) => {
  await loginPage.login(loginTestData.validUsername, loginTestData.validPassword);
  await page.goto(protectedPath);
  await bondCreationPage.assertStartNewBondVisible();

  await profileMenu.logout();
  await loginPage.assertFormVisible();

  await page.goto(protectedPath);
  await loginPage.assertFormVisible();
});
