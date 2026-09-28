import { test } from '../../../src/fixtures/qa';

test('Sanity check for Bond Creation entry flow @sanity', async ({ authenticatedSession, dashboardPage, bondCreationPage }) => {
  void authenticatedSession;
  await dashboardPage.openBondCreation();
  await bondCreationPage.assertAgencySelectorReady();
});
