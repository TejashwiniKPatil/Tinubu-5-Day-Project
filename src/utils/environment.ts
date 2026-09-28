/** Read a required environment variable without changing or exposing its value. */
export function getRequiredEnvironmentVariable(name: string): string {
  const value = process.env[name];

  if (value === undefined || value.trim().length === 0) {
    throw new Error(`Required environment variable ${name} is not configured.`);
  }

  return value;
}

/** Read a web address from an environment variable: trims spaces and quotes, adds https:// if missing, returns the origin. */
function getWebAddress(name: string): string {
  let value = getRequiredEnvironmentVariable(name).trim().replace(/^['"]+|['"]+$/g, '').trim();
  if (!/^https?:\/\//i.test(value)) value = `https://${value}`;

  try {
    const url = new URL(value);
    if (!url.hostname.includes('.')) throw new Error('missing domain');
    return url.origin;
  } catch {
    throw new Error(`${name} is not a valid web address. Set ${name} in .env (or the CI variable) to the full address, starting with https://.`);
  }
}

/** The application address, from URL. */
export function getBaseUrl(): string {
  return getWebAddress('URL');
}

/** The API address, from LOGIN_API. */
export function getApiBaseUrl(): string {
  return getWebAddress('LOGIN_API');
}

/** Read an optional value while preserving its exact configured contents. */
export function getOptionalEnvironmentVariable(name: string): string | undefined {
  const value = process.env[name];
  return value === undefined || value.trim().length === 0 ? undefined : value;
}
