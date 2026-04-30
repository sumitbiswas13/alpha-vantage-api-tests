# 📈 Alpha Vantage Finance API Tests

![Finance API Tests](https://github.com/sumitbiswas13/alpha-vantage-api-tests/actions/workflows/tests.yml/badge.svg)

Automated API test suite for Alpha Vantage financial data — validating real-time stock quotes, historical time series, and live currency exchange rates.

## 📊 APIs Under Test

| API | Function | Description |
|-----|----------|-------------|
| Global Quote | `GLOBAL_QUOTE` | Real-time stock price, volume, change |
| Time Series Daily | `TIME_SERIES_DAILY` | Historical OHLCV data |
| Currency Exchange | `CURRENCY_EXCHANGE_RATE` | Live forex rates (USD/EUR, USD/JPY) |

## 🧪 Test Coverage

| File | Tests | Focus |
|------|-------|-------|
| `01-stock-quote.spec.ts` | 8 | Quote schema, price validation, symbol match, date format |
| `02-time-series.spec.ts` | 7 | OHLCV fields, date ordering, high >= low validation |
| `03-currency-exchange.spec.ts` | 7 | Exchange rate schema, bid/ask spread, currency codes |
| `04-performance.spec.ts` | 3 | Response time baselines for all endpoints |
| `05-data-quality.spec.ts` | 4 | Numeric precision, price range, date ordering |
| **Total** | **29** | |

## 🛠 Tech Stack

- **Playwright** — API request engine + test runner
- **TypeScript** — strict typing throughout
- **GitHub Actions** — CI/CD running on weekday market hours
- **Alpha Vantage** — free tier financial data API

## 🚀 Running Locally

```bash
npm install
npm run test:smoke      # 2 quick smoke tests
npm test                # full 29-test suite
npm run report          # open HTML report
```

> ⚠️ Free tier limit: 25 requests/day. Tests include 13s delays between calls to stay within the 5 req/min rate limit.

## 📊 Skills Demonstrated

- REST API testing with financial domain data
- Numeric precision validation (price, volume, rates)
- Data integrity checks (high >= low, bid <= ask, close within range)
- Date format and ordering validation
- Rate limit handling with sequential workers
- CI/CD scheduled for market hours (Mon–Fri 9am UTC)
