import http from 'k6/http';
import { check } from 'k6';
import { Counter, Rate, Trend } from 'k6/metrics';

const baseUrl = String(__ENV.BASE_URL || __ENV.URL || '').replace(/\/$/, '');
const apiUrl = String(__ENV.API_BASE_URL || __ENV.LOGIN_API || '').replace(/\/$/, '');
const loginPath = __ENV.LOGIN_PATH || '/auth/auth/token';
const loginLatency = new Trend('login_latency', true);
const loginSamples = new Counter('login_samples');
const loginStatusSamples = new Counter('login_status_samples');
const loginFailure = new Rate('login_failure');

export const options = {
  scenarios: {
    login_only: {
      executor: 'per-vu-iterations',
      vus: 5,
      iterations: 1,
      maxDuration: '1m',
    },
  },
  thresholds: {
    login_samples: ['count==5'],
    login_latency: ['p(95)<=2000', 'p(99)<=4000'],
    login_failure: ['rate<=0.01'],
    http_req_failed: ['rate<0.01'],
  },
};

function required(name: string): string {
  const value = __ENV[name];
  if (!value) throw new Error(`Required environment variable ${name} is missing.`);
  return value;
}

function getHostname(value: string): string {
  const match = value.match(/^https?:\/\/([^/:?#]+)/i);
  return match ? match[1].toLowerCase() : '';
}

export function setup(): void {
  const approvedUiHost = 'alphanewui.tinubusurety.com';
  const approvedApiHost = 'apim-alpha-dev-eastus-01.azure-api.net';

  if (!baseUrl || getHostname(baseUrl) !== approvedUiHost) {
    throw new Error(`Set URL or BASE_URL to the approved QA UI host ${approvedUiHost}.`);
  }
  if (!apiUrl || getHostname(apiUrl) !== approvedApiHost) {
    throw new Error(`Set API_BASE_URL or LOGIN_API to the approved QA API host ${approvedApiHost}.`);
  }
}

export default function (): void {
  const response = http.post(`${apiUrl}${loginPath}`, {
    grant_type: required('TEST_GRANT_TYPE'),
    username: required('TEST_USERNAME'),
    password: required('TEST_PASSWORD'),
    client_id: required('TEST_CLIENT_ID'),
  }, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    tags: { operation: 'login' },
  });

  loginSamples.add(1);
  loginStatusSamples.add(1, { status: String(response.status) });
  const httpOk = check(response, {
    'login returns 2xx': (r) => r.status >= 200 && r.status < 300,
  });

  let hasAccessToken = false;
  if (response.status >= 200 && response.status < 300 && response.body) {
    try {
      hasAccessToken = Boolean(response.json('access_token'));
    } catch {
      hasAccessToken = false;
    }
  }
  const tokenOk = check(response, {
    'login returns access token': () => hasAccessToken,
  });

  const loginOk = httpOk && tokenOk;
  loginFailure.add(!loginOk);
  if (!httpOk) {
    const reason = String(response.body || response.error || 'no response body').slice(0, 200);
    console.warn(`Login failed: HTTP ${response.status}. ${reason}`);
  }
  if (response.status > 0) loginLatency.add(response.timings.duration);
}
