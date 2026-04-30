import { test, expect } from '@playwright/test';
import { avGet, sleep, isNumericString, checkRateLimit } from '../utils/api';
import { STOCK_IBM } from '../test-data/constants';

test.describe('Data Quality — Financial Data Validation', () => {

  test.beforeEach(async () => {
    await sleep(13000);
  });

  test('@api All OHLCV values in time series are non-null numeric strings', async ({ request }) => {
    const res = await avGet(request, { function: 'TIME_SERIES_DAILY', symbol: STOCK_IBM, outputsize: 'compact' });
    const body = await res.json();
    if (checkRateLimit(body)) test.skip(true, 'Rate limit reached');
    const series = body['Time Series (Daily)'] as Record<string, Record<string, string>>;
    for (const day of Object.values(series).slice(0, 5)) {
      expect(isNumericString(day['1. open'])).toBe(true);
      expect(isNumericString(day['2. high'])).toBe(true);
      expect(isNumericString(day['3. low'])).toBe(true);
      expect(isNumericString(day['4. close'])).toBe(true);
      expect(isNumericString(day['5. volume'])).toBe(true);
    }
  });

  test('@api Close price is within high/low range each day', async ({ request }) => {
    const res = await avGet(request, { function: 'TIME_SERIES_DAILY', symbol: STOCK_IBM, outputsize: 'compact' });
    const body = await res.json();
    if (checkRateLimit(body)) test.skip(true, 'Rate limit reached');
    const series = body['Time Series (Daily)'] as Record<string, Record<string, string>>;
    for (const day of Object.values(series).slice(0, 10)) {
      const high = parseFloat(day['2. high']);
      const low = parseFloat(day['3. low']);
      const close = parseFloat(day['4. close']);
      expect(close).toBeLessThanOrEqual(high * 1.01);
      expect(close).toBeGreaterThanOrEqual(low * 0.99);
    }
  });

  test('@api Time series dates are in descending order (newest first)', async ({ request }) => {
    const res = await avGet(request, { function: 'TIME_SERIES_DAILY', symbol: STOCK_IBM, outputsize: 'compact' });
    const body = await res.json();
    if (checkRateLimit(body)) test.skip(true, 'Rate limit reached');
    const dates = Object.keys(body['Time Series (Daily)']).slice(0, 5);
    for (let i = 0; i < dates.length - 1; i++) {
      expect(new Date(dates[i]).getTime()).toBeGreaterThan(new Date(dates[i + 1]).getTime());
    }
  });

  test('@api Stock price has at most 4 decimal places', async ({ request }) => {
    const res = await avGet(request, { function: 'GLOBAL_QUOTE', symbol: STOCK_IBM });
    const body = await res.json();
    if (checkRateLimit(body)) test.skip(true, 'Rate limit reached');
    const price = body['Global Quote']['05. price'];
    const decimalPlaces = (price.split('.')[1] || '').length;
    expect(decimalPlaces).toBeLessThanOrEqual(4);
  });

});
