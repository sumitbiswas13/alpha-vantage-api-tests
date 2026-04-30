import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 30000,
  retries: 1,
  workers: 1, // Alpha Vantage free tier: 5 requests/min — run sequentially
  reporter: [
    ['list'],
    ['html', { outputFolder: 'reports/html', open: 'never' }],
  ],
  use: {
    baseURL: 'https://www.alphavantage.co',
    extraHTTPHeaders: {
      'Accept': 'application/json',
    },
  },
});
