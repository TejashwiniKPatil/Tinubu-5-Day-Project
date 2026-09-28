import { test } from '../../../src/fixtures/qa';
import { loginTestData } from '../../../test-data/loginData';
import {
  firstFailedLoginAttemptMessage,
  secondFailedLoginAttemptMessage,
  accountLockedMessage,
} from '../../../test-data/constants';
import { getOptionalEnvironmentVariable } from '../../../src/utils/environment';

const lockoutUsername = getOptionalEnvironmentVariable('LOCKOUT_TEST_USERNAME');
const lockoutPassword = getOptionalEnvironmentVariable('LOCKOUT_TEST_PASSWORD');

test.use({ storageState: { cookies: [], origins: [] } });

if (Boolean(lockoutUsername) !== Boolean(lockoutPassword)) {
  throw new Error('Configure both LOCKOUT_TEST_USERNAME and LOCKOUT_TEST_PASSWORD, or leave both unset.');
}

if (lockoutPassword === loginTestData.invalidPassword) {
  throw new Error('LOCKOUT_TEST_PASSWORD must be valid and different from the test invalid-password value.');
}

test.describe('Login lockout state transitions', () => {
  test.describe.configure({ mode: 'serial' });
  // High-value cases must pass or fail, never skip: a missing lockout account fails each test.
  test.beforeEach(() => {
    if (!lockoutUsername || !lockoutPassword) {
      throw new Error('Configure LOCKOUT_TEST_USERNAME and LOCKOUT_TEST_PASSWORD with a dedicated, resettable account.');
    }
  });

  test('TC-011 - Login reaches first failed-attempt state @high-value @regression @stateful-login @lockout', async ({ loginPage }) => {
    await loginPage.open();
    await loginPage.submit(lockoutUsername!, loginTestData.invalidPassword);
    await loginPage.assertMessageVisible(firstFailedLoginAttemptMessage);
  });

  test('TC-012 - Login reaches second failed-attempt state @high-value @regression @stateful-login @lockout', async ({ loginPage }) => {
    await loginPage.open();
    await loginPage.submit(lockoutUsername!, loginTestData.invalidPassword);
    await loginPage.assertMessageVisible(secondFailedLoginAttemptMessage);
  });

  test('TC-013 - Account is locked after third failed login attempt @high-value @regression @stateful-login @lockout', async ({ loginPage }) => {
    await loginPage.open();
    await loginPage.submit(lockoutUsername!, loginTestData.invalidPassword);
    await loginPage.assertMessageVisible(accountLockedMessage);
  });

  test('TC-014 - Verify login cannot proceed after account reaches locked state @high-value @regression @stateful-login @lockout', async ({ loginPage }) => {
    await loginPage.open();
    await loginPage.submit(lockoutUsername!, lockoutPassword!);
    await loginPage.assertMessageVisible(accountLockedMessage);
  });
});
