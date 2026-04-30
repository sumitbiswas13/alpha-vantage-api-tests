import { test, expect } from '@playwright/test';
import { avGet, sleep, isNumericString, isValidDateString, checkRateLimit } from '../utils/api';
import { FROM_CURRENCY, TO_CURRENCY, CURRENCY_EXCHANGE_FIELDS } from '../test-data/constants';

test.describe('Currency Exchange — Forex Rates', () => {

  test.beforeEach(async () => {
    await sleep(13000);
  });

  test('@smoke @api Currency exchange rate returns 200', async ({ request }) => {
    const res = await avGet(request, { function: 'CURRENCY_EXCHANGE_RATE', from_currency: FROM_CURRENCY, to_currency: TO_CURRENCY });
    expect(res.status()).toBe(200);
    const body = await res.json();
    if (checkRateLimit(body)) test.skip(true, 'Rate limit reached');
    expect(body).toHaveProperty('Realtime Currency Exchange Rate');
  });

  test('@api Exchange rate response has all required fields', async ({ request }) => {
    const res = await avGet(request, { function: 'CURRENCY_EXCHANGE_RATE', from_currency: FROM_CURRENCY, to_currency: TO_CURRENCY });
    const body = await res.json();
    if (checkRateLimit(body)) test.skip(true, 'Rate limit reached');
    const rate = body['Realtime Currency Exchange Rate'];
    for (const field of CURRENCY_EXCHANGE_FIELDS) {
      expect(rate, `Missing field: ${field}`).toHaveProperty(field);
    }
  });

  test('@api From and To currency codes match request', async ({ request }) => {
    const res = await avGet(request, { function: 'CURRENCY_EXCHANGE_RATE', from_currency: FROM_CURRENCY, to_currency: TO_CURRENCY });
    const body = await res.json();
    if (checkRateLimit(body)) test.skip(true, 'Rate limit reached');
    const rate = body['Realtime Currency Exchange Rate'];
    expect(rate['1. From_Currency Code']).toBe(FROM_CURRENCY);
    expect(rate['3. To_Currency Code']).toBe(TO_CURRENCY);
  });

  test('@api Exchange rate is a positive number', async ({ request }) => {
    const res = await avGet(request, { function: 'CURRENCY_EXCHANGE_RATE', from_currency: FROM_CURRENCY, to_currency: TO_CURRENCY });
    const body = await res.json();
    if (checkRateLimit(body)) test.skip(true, 'Rate limit reached');
    const exchangeRate = body['Realtime Currency Exchange Rate']['5. Exchange Rate'];
    expect(isNumericString(exchangeRate)).toBe(true);
    expect(parseFloat(exchangeRate)).toBeGreaterThan(0);
  });

  test('@api Bid price is less than or equal to ask price', async ({ request }) => {
    const res = await avGet(request, { function: 'CURRENCY_EXCHANGE_RATE', from_currency: FROM_CURRENCY, to_currency: TO_CURRENCY });
    const body = await res.json();
    if (checkRateLimit(body)) test.skip(true, 'Rate limit reached');
    const rate = body['Realtime Currency Exchange Rate'];
    expect(parseFloat(rate['8. Bid Price'])).toBeLessThanOrEqual(parseFloat(rate['9. Ask Price']));
  });

  test('@api Last refreshed is a valid datetime', async ({ request }) => {
    const res = await avGet(request, { function: 'CURRENCY_EXCHANGE_RATE', from_currency: FROM_CURRENCY, to_currency: TO_CURRENCY });
    const body = await res.json();
    if (checkRateLimit(body)) test.skip(true, 'Rate limit reached');
    expect(isValidDateString(body['Realtime Currency Exchange Rate']['6. Last Refreshed'])).toBe(true);
  });

  test('@api USD to JPY rate is greater than 1', async ({ request }) => {
    const res = await avGet(request, { function: 'CURRENCY_EXCHANGE_RATE', from_currency: 'USD', to_currency: 'JPY' });
    const body = await res.json();
    if (checkRateLimit(body)) test.skip(true, 'Rate limit reached');
    const rate = parseFloat(body['Realtime Currency Exchange Rate']['5. Exchange Rate']);
    expect(rate).toBeGreaterThan(1);
  });

});
