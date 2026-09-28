import { test } from '../../../src/fixtures/qa';

// Logout invalidates the shared storage-state session. With one worker, specs run in
// path order, so this folder must sort after every other authenticated spec folder.

test('TC-016 - Logout from authenticated user session @high-value @smoke @regression @stateful-login', async ({ authenticatedSession, profileMenu, loginPage }) => {
  void authenticatedSession;
  await profileMenu.logout();
  await loginPage.assertFormVisible();
});
