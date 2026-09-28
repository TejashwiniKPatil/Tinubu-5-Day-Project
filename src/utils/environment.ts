/** Read a required environment variable without changing or exposing its value. */
export function getRequiredEnvironmentVariable(name: string): string {
  const value = process.env[name];

  if (value === undefined || value.trim().length === 0) {
    throw new Error(`Required environment variable ${name} is not configured.`);
  }

  return value;
}

export function getBaseUrl(): string {
  let value = getRequiredEnvironmentVariable('URL').trim().replace(/^['"]+|['"]+$/g, '').trim();
  if (!/^https?:\/\//i.test(value)) value = `https://${value}`;

  try {
    const url = new URL(value);
    if (!url.hostname.includes('.')) throw new Error('missing domain');
    return url.origin;
  } catch {
    throw new Error('URL is not a valid web address. Set URL in .env (or the CI variable) to the full application address, starting with https://.');
  }
}

/** Read an optional value while preserving its exact configured contents. */
export function getOptionalEnvironmentVariable(name: string): string | undefined {
  const value = process.env[name];
  return value === undefined || value.trim().length === 0 ? undefined : value;
}
