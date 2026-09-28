import { test } from '../../../src/fixtures/qa';
import { loginCases } from '../../../src/fixtures/loginCases';
import { resolveLoginValue } from '../../../test-data/loginCases';

test.use({ storageState: { cookies: [], origins: [] } });

test.describe('Login equivalence and boundary cases', () => {
  for (const loginCase of loginCases) {
    test(`${loginCase.id} - ${loginCase.name}`, { tag: loginCase.tags }, async ({ loginPage }) => {
      await loginPage.open();

      if (loginCase.kind === 'form') {
        await loginPage.assertFormVisible();
        return;
      }

      await loginPage.submit(
        resolveLoginValue(loginCase.username, 'username'),
        resolveLoginValue(loginCase.password, 'password'),
      );

      if (loginCase.kind === 'valid') {
        await loginPage.assertAuthenticated();
        return;
      }

      await loginPage.assertRejected();
    });
  }
});
