import {test, expect} from '@playwright/test';
import { CreateBondApi } from '../../src/api/CreateBondApi';
import { LoginApi } from '../../src/api/LoginApi';
import { clientId, PASSWORD, USERNAME, grantType } from '../../test-data/constants';

test('API-002 - Create Bond API Test @api @high-value @regression', async ({ request }) => {
  const loginApi = new LoginApi(request);
  const loginResponse = await loginApi.login(USERNAME, PASSWORD, grantType, clientId);
  expect(loginResponse.status()).toBe(200);
  const { access_token: accessToken } = await loginResponse.json();

  const createBondApi = new CreateBondApi(request);
  const response = await createBondApi.createBond(accessToken);

  expect(response.status()).toBe(200);
});
