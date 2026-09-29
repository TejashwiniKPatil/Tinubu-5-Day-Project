import { expect, test } from '../../src/fixtures/qa';
import { LoginApi } from '../../src/api/LoginApi';
import { bondCreationData } from '../../test-data/bondCreationData';
import { loginTestData } from '../../test-data/loginData';
import { clientId, grantType, PASSWORD, performanceTargets, USERNAME } from '../../test-data/constants';

// Single-user response-time checks from test-cases/performance-test-cases.md.
// Load tests (PERF-001, PERF-002) run with k6: npm run perf:login.
const tags = ['@performance'];

async function timed(action: () => Promise<unknown>): Promise<number> {
  const start = Date.now();
  await action();
  return Date.now() - start;
}

function record(name: string, ms: number, targetMs: number): void {
  test.info().annotations.push({ type: 'timing', description: `${name}: ${ms} ms (target ${targetMs} ms)` });
}

test.describe('Response times for a signed-out user', () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test('PERF-006 - Login page loads within the target time', { tag: tags }, async ({ page, loginPage }) => {
    await loginPage.open();
    await loginPage.assertFormVisible();
    const domReadyMs = await page.evaluate(() => {
      const [nav] = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[];
      return Math.round(nav.domContentLoadedEventEnd - nav.startTime);
    });
    record('Login page DOM ready', domReadyMs, performanceTargets.loginPageLoadMs);
    expect(domReadyMs).toBeLessThanOrEqual(performanceTargets.loginPageLoadMs);
  });

  test('PERF-003 - Dashboard is ready after Login within the target time', { tag: tags }, async ({ loginPage }) => {
    await loginPage.open();
    await loginPage.assertFormVisible();
    const ms = await timed(() => loginPage.login(loginTestData.validUsername, loginTestData.validPassword));
    record('Sign In to dashboard ready', ms, performanceTargets.dashboardReadyMs);
    expect(ms).toBeLessThanOrEqual(performanceTargets.dashboardReadyMs);
  });

  test('PERF-005 - Login API responds within the target time', { tag: [...tags, '@api'] }, async ({ request }) => {
    const loginApi = new LoginApi(request);
    let status = 0;
    const ms = await timed(async () => {
      status = (await loginApi.login(USERNAME, PASSWORD, grantType, clientId)).status();
    });
    record('Login API', ms, performanceTargets.loginApiMs);
    expect(status).toBe(200);
    expect(ms).toBeLessThanOrEqual(performanceTargets.loginApiMs);
  });
});

test('PERF-004 - Bond search and quote form load within the target time', { tag: [...tags, '@bond-creation'] }, async ({
  authenticatedSession,
  dashboardPage,
  bondCreationPage,
}) => {
  void authenticatedSession;
  const steps: Array<[string, () => Promise<unknown>]> = [
    ['Open bond search', () => dashboardPage.openBondCreation()],
    ['Select agency', () => bondCreationPage.searchAndSelectAgency(bondCreationData.agencyName)],
    ['Show Commercial bond forms', () => bondCreationPage.selectCommercialFamily()],
    [
      'Open quote form',
      () => bondCreationPage.searchAndSelectBond(bondCreationData.bondFormSearch, bondCreationData.bondTypeName),
    ],
  ];

  const slow: string[] = [];
  for (const [name, action] of steps) {
    const ms = await timed(action);
    record(name, ms, performanceTargets.bondStepMs);
    if (ms > performanceTargets.bondStepMs) slow.push(`${name} (${ms} ms)`);
  }
  expect(slow, `Steps slower than ${performanceTargets.bondStepMs} ms`).toEqual([]);
});
