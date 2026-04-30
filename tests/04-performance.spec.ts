import { test, expect } from '@playwright/test';
import { avGet, sleep, checkRateLimit } from '../utils/api';
import { STOCK_IBM, FROM_CURRENCY, TO_CURRENCY } from '../test-data/constants';

test.describe('Performance — Response Time Baselines', () => {

  test.beforeEach(async () => {
    await sleep(13000);
  });

  test('@smoke @api Global quote responds within 10 seconds', async ({ request }) => {
    const start = Date.now();
    const res = await avGet(request, { function: 'GLOBAL_QUOTE', symbol: STOCK_IBM });
    const elapsed = Date.now() - start;
    const body = await res.json();
    if (checkRateLimit(body)) test.skip(true, 'Rate limit reached');
    expect(res.status()).toBe(200);
    expect(elapsed).toBeLessThan(10000);
  });

  test('@api Time series daily responds within 10 seconds', async ({ request }) => {
    const start = Date.now();
    const res = await avGet(request, { function: 'TIME_SERIES_DAILY', symbol: STOCK_IBM, outputsize: 'compact' });
    const elapsed = Date.now() - start;
    const body = await res.json();
    if (checkRateLimit(body)) test.skip(true, 'Rate limit reached');
    expect(res.status()).toBe(200);
    expect(elapsed).toBeLessThan(10000);
  });

  test('@api Currency exchange rate responds within 10 seconds', async ({ request }) => {
    const start = Date.now();
    const res = await avGet(request, { function: 'CURRENCY_EXCHANGE_RATE', from_currency: FROM_CURRENCY, to_currency: TO_CURRENCY });
    const elapsed = Date.now() - start;
    const body = await res.json();
    if (checkRateLimit(body)) test.skip(true, 'Rate limit reached');
    expect(res.status()).toBe(200);
    expect(elapsed).toBeLessThan(10000);
  });

});
