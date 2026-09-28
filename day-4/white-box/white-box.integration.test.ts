import assert from 'node:assert/strict';
import test from 'node:test';
import { validateQuoteForPrincipal } from './bond-quote-validator.ts';
import { initialSession, login } from './login-lockout.ts';

test('login uses the credential checker stub result', () => {
  const checker = {
    isValid(username: string, password: string) {
      return username === 'qa-user' && password === 'correct-password';
    },
  };

  assert.equal(login(initialSession(), 'qa-user', 'correct-password', checker).state, 'authenticated');
  assert.deepEqual(login(initialSession(), 'qa-user', 'wrong-password', checker), {
    state: 'signed-out',
    failedAttempts: 1,
  });
});

test('quote validation counts the parties returned by the principal directory stub', () => {
  const directory = {
    getParties(principalId: string) {
      assert.equal(principalId, 'NUI-1157');
      return { companies: [{ name: 'NUI1157 DupCo LLC' }], people: [] };
    },
  };

  const errors = validateQuoteForPrincipal(
    { bondAmount: 10_000, maxBondAmount: 40_000_000, prePaySelection: 1, prePayOptions: [1, 2, 3] },
    'NUI-1157',
    directory,
  );
  assert.deepEqual(errors, []);
});
