import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate, Trend } from 'k6/metrics';

type JsonObject = Record<string, any>;

// Do not run until DevTools confirms the successful Login request URL, body,
// content type, and token/cookie behavior. Keep credentials in environment
// variables; never commit LOGIN_BODY or place it in a report.
const baseUrl = __ENV.BASE_URL || __ENV.URL;
const loginPath = __ENV.LOGIN_PATH;
const loginBody = __ENV.LOGIN_BODY;
const loginContentType = __ENV.LOGIN_CONTENT_TYPE;
const tokenField = __ENV.LOGIN_TOKEN_FIELD;
const listPath = __ENV.LIST_PATH || '/bond/bonds/pending-bonds';

const loginDuration = new Trend('login_duration', true);
const listDuration = new Trend('list_duration', true);
const loginErrors = new Rate('login_error_rate');
const listErrors = new Rate('list_error_rate');

export const options = {
  scenarios: {
    baseline: {
      executor: 'constant-vus',
      vus: Number(__ENV.VUS || 5),
      duration: __ENV.DURATION || '1m',
    },
  },
  thresholds: {
    login_duration: ['p(95)<2000'],
    list_duration: ['p(95)<2000'],
    login_error_rate: ['rate<0.01'],
    list_error_rate: ['rate<0.01'],
    http_req_failed: ['rate<0.01'],
  },
};

export default function (): void {
  if (!baseUrl || !loginPath || !loginBody || !loginContentType) {
    throw new Error('Set BASE_URL, LOGIN_PATH, LOGIN_BODY, and LOGIN_CONTENT_TYPE from an approved DevTools capture.');
  }

  const loginResponse = http.post(`${baseUrl}${loginPath}`, loginBody, {
    headers: { 'Content-Type': loginContentType },
    tags: { operation: 'login' },
  });
  loginDuration.add(loginResponse.timings.duration);
  const loginPassed = check(loginResponse, {
    'login returns 2xx': (response) => response.status >= 200 && response.status < 300,
  });
  loginErrors.add(!loginPassed);

  if (loginPassed) {
    const headers: Record<string, string> = {};
    if (tokenField) {
      const body = loginResponse.json() as JsonObject;
      const token = tokenField.split('.').reduce<any>((value, key) => {
        if (!value || typeof value !== 'object') return undefined;
        return (value as JsonObject)[key];
      }, body);
      if (!token) throw new Error(`Configured token field ${tokenField} was absent from the Login response.`);
      headers.Authorization = `Bearer ${String(token)}`;
    }

    const listResponse = http.get(`${baseUrl}${listPath}`, {
      headers,
      tags: { operation: 'list' },
    });
    listDuration.add(listResponse.timings.duration);
    const listPassed = check(listResponse, {
      'list returns 2xx': (response) => response.status >= 200 && response.status < 300,
    });
    listErrors.add(!listPassed);
  } else {
    listErrors.add(true);
  }

  sleep(1);
}
