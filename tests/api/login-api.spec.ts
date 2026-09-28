import {test, expect} from '@playwright/test';
import { LoginApi } from '../../src/api/LoginApi';
import { clientId, PASSWORD, USERNAME, grantType } from '../../test-data/constants';


test('API-001 - Login API Test @api @high-value @regression', async ({ request }) => {
  const loginApi = new LoginApi(request);
  const response = await loginApi.login(USERNAME, PASSWORD, grantType, clientId);

  expect(response.status()).toBe(200); // good to assert status too

  const body = await response.json();
  expect(body).toMatchObject({
    access_token: expect.any(String),
    refresh_token: expect.any(String),
  });
  
});