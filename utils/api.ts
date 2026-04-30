import { APIRequestContext } from '@playwright/test';

export const AV_API_KEY = process.env.AV_API_KEY || 'Q3NXJEG8YATOQOLD';
export const BASE_URL = 'https://www.alphavantage.co';

export async function avGet(
  request: APIRequestContext,
  params: Record<string, string>
) {
  const query = new URLSearchParams({ ...params, apikey: AV_API_KEY });
  const response = await request.get(`${BASE_URL}/query?${query}`);
  return response;
}

// Alpha Vantage free tier: 25 requests/day, 5/min — add delay between calls
export async function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function isNumericString(value: string): boolean {
  return !isNaN(parseFloat(value)) && isFinite(Number(value));
}

export function isValidDateString(value: string): boolean {
  return !isNaN(new Date(value).getTime());
}

// Skip test gracefully if Alpha Vantage daily rate limit is hit
export function checkRateLimit(body: Record<string, unknown>): boolean {
  return 'Information' in body || 'Note' in body;
}
