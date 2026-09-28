import { test } from '../../../src/fixtures/qa';

test('TC-018 - Verify profile menu contains Log Out option @smoke @regression', async ({ authenticatedSession, profileMenu }) => {
  void authenticatedSession;
  await profileMenu.open();
  await profileMenu.assertLogoutVisible();
});
