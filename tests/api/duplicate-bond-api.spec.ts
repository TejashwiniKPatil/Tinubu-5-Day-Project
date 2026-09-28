import { test, expect } from '@playwright/test';
import { CreateBondApi } from '../../src/api/CreateBondApi';
import { LoginApi } from '../../src/api/LoginApi';
import { clientId, PASSWORD, USERNAME, grantType } from '../../test-data/constants';


test('TC-047 - Identical create-bond requests do not create duplicate bonds @api @stateful-bond', async ({ request }) => {
  const loginApi = new LoginApi(request);
  const loginResponse = await loginApi.login(USERNAME, PASSWORD, grantType, clientId);
  expect(loginResponse.status()).toBe(200);
  const { access_token: accessToken } = await loginResponse.json();

  const createBondApi = new CreateBondApi(request);
  const firstResponse = await createBondApi.createBond(accessToken);
  expect(firstResponse.status()).toBe(200);

  const secondResponse = await createBondApi.createBond(accessToken);
  expect(secondResponse.status(), 'Duplicate create-bond request should be rejected with 409 Conflict').toBe(409);
});
