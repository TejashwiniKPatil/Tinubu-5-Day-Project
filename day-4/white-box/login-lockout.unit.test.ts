import assert from 'node:assert/strict';
import test from 'node:test';
import { attemptLogin, initialSession, type LoginSession } from './login-lockout.ts';

function failTimes(count: number): LoginSession {
  let session = initialSession();
  for (let attempt = 0; attempt < count; attempt += 1) {
    session = attemptLogin(session, false);
  }
  return session;
}

test('a new session is signed out with no failed attempts', () => {
  assert.deepEqual(initialSession(), { state: 'signed-out', failedAttempts: 0 });
});

test('valid credentials authenticate the user', () => {
  assert.deepEqual(attemptLogin(initialSession(), true), { state: 'authenticated', failedAttempts: 0 });
});

test('TC-011: first failed attempt keeps the user signed out', () => {
  assert.deepEqual(failTimes(1), { state: 'signed-out', failedAttempts: 1 });
});

test('TC-012: second failed attempt keeps the user signed out', () => {
  assert.deepEqual(failTimes(2), { state: 'signed-out', failedAttempts: 2 });
});

test('TC-013: third failed attempt keeps the user signed out', () => {
  assert.deepEqual(failTimes(3), { state: 'signed-out', failedAttempts: 3 });
});

test('TC-013: fourth failed attempt locks the account', () => {
  assert.equal(failTimes(4).state, 'locked');
});

test('TC-014: a locked account stays locked with valid credentials', () => {
  const locked: LoginSession = { state: 'locked', failedAttempts: 4 };
  assert.deepEqual(attemptLogin(locked, true), locked);
});

test('a successful login after one failure resets the failed count', () => {
  assert.deepEqual(attemptLogin(failTimes(1), true), { state: 'authenticated', failedAttempts: 0 });
});

test('an authenticated session is unchanged by another attempt', () => {
  const authenticated: LoginSession = { state: 'authenticated', failedAttempts: 0 };
  assert.deepEqual(attemptLogin(authenticated, false), authenticated);
});

test('invalid failed attempt counts are rejected', () => {
  for (const failedAttempts of [-1, 1.5]) {
    assert.throws(() => attemptLogin({ state: 'signed-out', failedAttempts }, false), /non-negative integer/);
  }
});

test('a failed attempt always records at least one failure', () => {
  for (const failedAttempts of [0, 1]) {
    assert.ok(attemptLogin({ state: 'signed-out', failedAttempts }, false).failedAttempts >= 1);
  }
});
