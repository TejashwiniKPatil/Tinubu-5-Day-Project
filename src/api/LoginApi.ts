import { APIRequestContext } from '@playwright/test';
import { getApiBaseUrl } from '../utils/environment';

export class LoginApi {
  constructor(private readonly req: APIRequestContext) {}

  login(username: string, password: string, grantType: string, clientId: string) {
    const missing = [
      ['TEST_USERNAME', username],
      ['TEST_PASSWORD', password],
      ['TEST_GRANT_TYPE', grantType],
      ['TEST_CLIENT_ID', clientId],
    ].filter(([, value]) => !value || !value.trim()).map(([name]) => name);
    if (missing.length > 0) {
      throw new Error(`Configure ${missing.join(', ')} before calling the login API (in .env locally, or as CI variables or secrets).`);
    }

    return this.req.post(new URL('/auth/auth/token', getApiBaseUrl()).toString(), {
      form: {
        grant_type: grantType,
        username,
        password,
        client_id: clientId,
      },
    });
  }
}
