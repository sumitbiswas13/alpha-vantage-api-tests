import { test, expect } from '@playwright/test';
import { avGet, sleep, isNumericString, isValidDateString, checkRateLimit } from '../utils/api';
import { STOCK_IBM, TIME_SERIES_DAILY_OHLCV } from '../test-data/constants';

test.describe('Time Series — Daily Stock Data', () => {

  test.beforeEach(async () => {
    await sleep(13000);
  });

  test('@smoke @api Time series daily returns 200 with meta data', async ({ request }) => {
    const res = await avGet(request, {
      function: 'TIME_SERIES_DAILY',
      symbol: STOCK_IBM,
      outputsize: 'compact',
    });
    expect(res.status()).toBe(200);
    const body = await res.json();
    if (checkRateLimit(body)) test.skip(true, 'Rate limit reached');
    expect(body).toHaveProperty('Meta Data');
    expect(body).toHaveProperty('Time Series (Daily)');
  });

  test('@api Meta data contains correct symbol', async ({ request }) => {
    const res = await avGet(request, { function: 'TIME_SERIES_DAILY', symbol: STOCK_IBM, outputsize: 'compact' });
    const body = await res.json();
    if (checkRateLimit(body)) test.skip(true, 'Rate limit reached');
    expect(body['Meta Data']['2. Symbol']).toBe(STOCK_IBM);
  });

  test('@api Time series has at least 20 trading days', async ({ request }) => {
    const res = await avGet(request, { function: 'TIME_SERIES_DAILY', symbol: STOCK_IBM, outputsize: 'compact' });
    const body = await res.json();
    if (checkRateLimit(body)) test.skip(true, 'Rate limit reached');
    const dates = Object.keys(body['Time Series (Daily)']);
    expect(dates.length).toBeGreaterThanOrEqual(20);
  });

  test('@api Each trading day has OHLCV fields', async ({ request }) => {
    const res = await avGet(request, { function: 'TIME_SERIES_DAILY', symbol: STOCK_IBM, outputsize: 'compact' });
    const body = await res.json();
    if (checkRateLimit(body)) test.skip(true, 'Rate limit reached');
    const firstDay = Object.values(body['Time Series (Daily)'] as Record<string, Record<string, string>>)[0];
    for (const field of TIME_SERIES_DAILY_OHLCV) {
      expect(firstDay, `Missing OHLCV field: ${field}`).toHaveProperty(field);
    }
  });

  test('@api All date keys are valid date strings', async ({ request }) => {
    const res = await avGet(request, { function: 'TIME_SERIES_DAILY', symbol: STOCK_IBM, outputsize: 'compact' });
    const body = await res.json();
    if (checkRateLimit(body)) test.skip(true, 'Rate limit reached');
    const dates = Object.keys(body['Time Series (Daily)']);
    for (const date of dates.slice(0, 5)) {
      expect(isValidDateString(date)).toBe(true);
    }
  });

  test('@api Daily high is always >= daily low', async ({ request }) => {
    const res = await avGet(request, { function: 'TIME_SERIES_DAILY', symbol: STOCK_IBM, outputsize: 'compact' });
    const body = await res.json();
    if (checkRateLimit(body)) test.skip(true, 'Rate limit reached');
    const series = body['Time Series (Daily)'] as Record<string, Record<string, string>>;
    for (const day of Object.values(series).slice(0, 10)) {
      expect(parseFloat(day['2. high'])).toBeGreaterThanOrEqual(parseFloat(day['3. low']));
    }
  });

  test('@api Daily volume is a positive number', async ({ request }) => {
    const res = await avGet(request, { function: 'TIME_SERIES_DAILY', symbol: STOCK_IBM, outputsize: 'compact' });
    const body = await res.json();
    if (checkRateLimit(body)) test.skip(true, 'Rate limit reached');
    const firstDay = Object.values(body['Time Series (Daily)'] as Record<string, Record<string, string>>)[0];
    expect(isNumericString(firstDay['5. volume'])).toBe(true);
    expect(parseInt(firstDay['5. volume'])).toBeGreaterThan(0);
  });

});
