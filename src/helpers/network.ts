import { BrowserContext, Page, Request } from '@playwright/test';

export type NetworkDrop = {
  /** How many matching requests the browser tried to send while the drop was armed. */
  attempts(): number;
  /** Brings the browser back online and stops intercepting. */
  restore(): Promise<void>;
};

export type RequestCounter = {
  count(): number;
  stop(): void;
};

/** Counts the browser requests whose URL contains the path and whose method matches, from now until stop(). */
export function countRequests(page: Page, urlPart: string, method = 'POST'): RequestCounter {
  let count = 0;
  const listener = (request: Request) => {
    if (request.url().includes(urlPart) && request.method() === method) count++;
  };
  page.on('request', listener);
  return { count: () => count, stop: () => page.off('request', listener) };
}

/** Takes the browser offline the moment a matching request is sent, so the request never reaches the server. */
export async function dropNetworkOnRequest(page: Page, context: BrowserContext, urlGlob: string): Promise<NetworkDrop> {
  let attempts = 0;
  await page.route(urlGlob, async (route) => {
    attempts++;
    await context.setOffline(true);
    await route.abort('internetdisconnected');
  });
  return {
    attempts: () => attempts,
    restore: async () => {
      await page.unroute(urlGlob);
      await context.setOffline(false);
    },
  };
}
