import assert from 'node:assert/strict';
import test from 'node:test';
import { validateQuote, type QuoteInput } from './bond-quote-validator.ts';

const valid: QuoteInput = {
  bondAmount: 10_000,
  maxBondAmount: 40_000_000,
  prePaySelection: 1,
  prePayOptions: [1, 2, 3],
  companies: [{ name: 'NUI1157 DupCo LLC' }],
  people: [],
};

test('a complete quote has no errors', () => {
  assert.deepEqual(validateQuote(valid), []);
});

test('TC-031: missing bond amount is required', () => {
  assert.deepEqual(validateQuote({ ...valid, bondAmount: null }), ['Bond Amount is required.']);
});

test('TC-026/TC-027: $0 is accepted; negative and non-numeric amounts are rejected', () => {
  assert.deepEqual(validateQuote({ ...valid, bondAmount: 0 }), []);
  for (const bondAmount of [-1, Number.NaN]) {
    assert.deepEqual(validateQuote({ ...valid, bondAmount }), ['Bond Amount must be a non-negative number.']);
  }
});

test('TC-028: exactly the maximum bond amount is accepted', () => {
  assert.deepEqual(validateQuote({ ...valid, bondAmount: 40_000_000 }), []);
});

test('TC-029: one dollar above the maximum is rejected', () => {
  assert.deepEqual(validateQuote({ ...valid, bondAmount: 40_000_001 }), ['Penalty must not exceed 40000000.']);
});

test('missing or invalid Pre Pay Selection lists the valid values', () => {
  const message = 'PrePaySelection is required for this bond type. Valid values are 1, 2, 3.';
  assert.deepEqual(validateQuote({ ...valid, prePaySelection: null }), [message]);
  assert.deepEqual(validateQuote({ ...valid, prePaySelection: 4 }), [message]);
});

test('DEF-002: a quote with no person or company is rejected', () => {
  assert.deepEqual(validateQuote({ ...valid, companies: [] }), ['At least one person or company is required.']);
});

test('a quote with only a person is accepted', () => {
  assert.deepEqual(validateQuote({ ...valid, companies: [], people: [{ name: 'john xyz' }] }), []);
});

test('the invalid party count message is never produced', () => {
  for (const companies of [[], [{ name: 'ABC' }]]) {
    assert.ok(!validateQuote({ ...valid, companies }).includes('Party count is invalid.'));
  }
});

test('DEF-006: each company without a name is reported exactly once', () => {
  assert.deepEqual(validateQuote({ ...valid, companies: [{ name: ' ' }, { name: 'ABC' }, { name: '' }] }), [
    'Company 1: Company Name is required.',
    'Company 3: Company Name is required.',
  ]);
});

test('TC-042: Modifier Value boundaries 3% and 90% are accepted', () => {
  for (const modifierPercent of [3, 90]) {
    assert.deepEqual(validateQuote({ ...valid, modifierPercent }), []);
  }
});

test('TC-043: Modifier Values outside 3% to 90% are rejected', () => {
  for (const modifierPercent of [2, 91, Number.NaN]) {
    assert.deepEqual(validateQuote({ ...valid, modifierPercent }), ['Modifier Value must be between 3% and 90%.']);
  }
});

test('TC-044: Special Instructions of any length are accepted', () => {
  for (const length of [500, 501, 5_000]) {
    assert.deepEqual(validateQuote({ ...valid, specialInstructions: 'A'.repeat(length) }), []);
  }
});
