import { APIRequestContext } from '@playwright/test';
import { getApiBaseUrl } from '../utils/environment';

export class LoginApi {
  constructor(private readonly req: APIRequestContext) {}

  login(username: string, password: string, grantType: string, clientId: string) {
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
