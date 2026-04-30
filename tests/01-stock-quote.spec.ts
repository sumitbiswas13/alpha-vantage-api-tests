import { test, expect } from '@playwright/test';
import { avGet, sleep, isNumericString, isValidDateString, checkRateLimit } from '../utils/api';
import { STOCK_IBM } from '../test-data/constants';

test.describe('Finance API — Alpha Vantage', () => {

  test.beforeEach(async () => {
    await sleep(13000);
  });

  test('@smoke @api stock quote returns price and symbol', async ({ request }) => {
    const res = await avGet(request, { function: 'GLOBAL_QUOTE', symbol: STOCK_IBM });
    expect(res.status()).toBe(200);
    const body = await res.json();
    if (checkRateLimit(body)) test.skip(true, 'Rate limit reached');
    const quote = body['Global Quote'];
    expect(quote['01. symbol']).toBe(STOCK_IBM);
    expect(isNumericString(quote['05. price'])).toBe(true);
    expect(parseFloat(quote['05. price'])).toBeGreaterThan(0);
  });

  test('@api high price is >= low price', async ({ request }) => {
    const res = await avGet(request, { function: 'GLOBAL_QUOTE', symbol: STOCK_IBM });
    const body = await res.json();
    if (checkRateLimit(body)) test.skip(true, 'Rate limit reached');
    const quote = body['Global Quote'];
    expect(parseFloat(quote['03. high'])).toBeGreaterThanOrEqual(parseFloat(quote['04. low']));
  });

  test('@api time series has at least 20 trading days of OHLCV data', async ({ request }) => {
    const res = await avGet(request, { function: 'TIME_SERIES_DAILY', symbol: STOCK_IBM, outputsize: 'compact' });
    const body = await res.json();
    if (checkRateLimit(body)) test.skip(true, 'Rate limit reached');
    const series = body['Time Series (Daily)'];
    expect(Object.keys(series).length).toBeGreaterThanOrEqual(20);
    const firstDay = Object.values(series as Record<string, Record<string, string>>)[0];
    expect(isNumericString(firstDay['4. close'])).toBe(true);
  });

  test('@api currency exchange rate USD to EUR is a positive number', async ({ request }) => {
    const res = await avGet(request, { function: 'CURRENCY_EXCHANGE_RATE', from_currency: 'USD', to_currency: 'EUR' });
    const body = await res.json();
    if (checkRateLimit(body)) test.skip(true, 'Rate limit reached');
    const rate = parseFloat(body['Realtime Currency Exchange Rate']['5. Exchange Rate']);
    expect(rate).toBeGreaterThan(0);
    expect(rate).toBeLessThan(10); // USD/EUR is always a small number
  });

  test('@api USD to JPY rate is greater than 1', async ({ request }) => {
    const res = await avGet(request, { function: 'CURRENCY_EXCHANGE_RATE', from_currency: 'USD', to_currency: 'JPY' });
    const body = await res.json();
    if (checkRateLimit(body)) test.skip(true, 'Rate limit reached');
    const rate = parseFloat(body['Realtime Currency Exchange Rate']['5. Exchange Rate']);
    expect(rate).toBeGreaterThan(1);
  });

});
