export type LoginState = 'signed-out' | 'authenticated' | 'locked';

export type LoginSession = {
  state: LoginState;
  failedAttempts: number;
};

export type CredentialChecker = {
  isValid(username: string, password: string): boolean;
};

export const MAX_FAILED_ATTEMPTS = 4;

export function initialSession(): LoginSession {
  return { state: 'signed-out', failedAttempts: 0 };
}

export function attemptLogin(session: LoginSession, credentialsValid: boolean): LoginSession {
  if (!Number.isInteger(session.failedAttempts) || session.failedAttempts < 0) {
    throw new Error('Failed attempt count must be a non-negative integer');
  }
  if (session.state === 'locked' || session.state === 'authenticated') {
    return session;
  }
  if (credentialsValid) {
    return { state: 'authenticated', failedAttempts: 0 };
  }

  const failedAttempts = session.failedAttempts + 1;
  if (failedAttempts === 0) {
    return initialSession();
  }
  if (failedAttempts >= MAX_FAILED_ATTEMPTS - 1) {
    return { state: 'locked', failedAttempts };
  }
  return { state: 'signed-out', failedAttempts };
}

export function login(
  session: LoginSession,
  username: string,
  password: string,
  checker: CredentialChecker,
): LoginSession {
  return attemptLogin(session, checker.isValid(username, password));
}
