/** Read a required environment variable without changing or exposing its value. */
export function getRequiredEnvironmentVariable(name: string): string {
  const value = process.env[name];

  if (value === undefined || value.trim().length === 0) {
    throw new Error(`Required environment variable ${name} is not configured.`);
  }

  return value;
}

/** Read an optional value while preserving its exact configured contents. */
export function getOptionalEnvironmentVariable(name: string): string | undefined {
  const value = process.env[name];
  return value === undefined || value.trim().length === 0 ? undefined : value;
}
