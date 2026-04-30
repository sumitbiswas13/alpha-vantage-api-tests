// Well-known, highly liquid stocks — reliable data from Alpha Vantage
export const STOCK_IBM = 'IBM';       // Alpha Vantage's own example symbol
export const STOCK_AAPL = 'AAPL';     // Apple
export const STOCK_MSFT = 'MSFT';     // Microsoft

// Currency pairs
export const FROM_CURRENCY = 'USD';
export const TO_CURRENCY = 'EUR';
export const CRYPTO_SYMBOL = 'BTC';
export const CRYPTO_MARKET = 'USD';

// Expected schema keys for quote endpoint
export const GLOBAL_QUOTE_FIELDS = [
  '01. symbol',
  '02. open',
  '03. high',
  '04. low',
  '05. price',
  '06. volume',
  '07. latest trading day',
  '08. previous close',
  '09. change',
  '10. change percent',
];

// Expected top-level keys for time series daily
export const TIME_SERIES_META_FIELDS = [
  'Information' // present on rate limit
];

export const TIME_SERIES_DAILY_OHLCV = [
  '1. open',
  '2. high',
  '3. low',
  '4. close',
  '5. volume',
];

export const CURRENCY_EXCHANGE_FIELDS = [
  '1. From_Currency Code',
  '2. From_Currency Name',
  '3. To_Currency Code',
  '4. To_Currency Name',
  '5. Exchange Rate',
  '6. Last Refreshed',
  '7. Time Zone',
  '8. Bid Price',
  '9. Ask Price',
];
