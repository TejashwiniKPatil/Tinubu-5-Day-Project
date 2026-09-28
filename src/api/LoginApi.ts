import { APIRequestContext } from '@playwright/test';

const apiUrl = process.env.LOGIN_API ?? '';

export class LoginApi {
  constructor(private readonly req: APIRequestContext) {}

  login(username: string, password: string, grantType: string, clientId: string) {
    return this.req.post(new URL('/auth/auth/token', apiUrl).toString(), {
      form: {
        grant_type: grantType,
        username,
        password,
        client_id: clientId,
      },
    });
  }
}
