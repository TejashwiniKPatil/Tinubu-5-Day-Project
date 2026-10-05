import { BrowserContext, Page } from '@playwright/test';

export type NetworkDrop = {
  /** How many matching requests the browser tried to send while the drop was armed. */
  attempts(): number;
  /** Brings the browser back online and stops intercepting. */
  restore(): Promise<void>;
};

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
