import axios from 'axios';
import type { AlphaVantageResponse, StockPrice } from '@/types/stock';

const API_KEY = process.env.ALPHA_VANTAGE_API_KEY;
const BASE_URL = 'https://www.alphavantage.co/query';

if (!API_KEY) {
  console.warn('⚠️ ALPHA_VANTAGE_API_KEY is not set. Alpha Vantage API will not work.');
}

/**
 * Fetch daily stock price history (free tier compatible)
 */
export async function fetchDailyAdjustedStockData(
  symbol: string = 'TSLA'
): Promise<StockPrice[]> {
  if (!API_KEY) {
    throw new Error('MISSING_API_KEY');
  }

  try {
    const response = await axios.get<AlphaVantageResponse>(BASE_URL, {
      params: {
        function: 'TIME_SERIES_DAILY', // free tier only (no adjusted close field!)
        symbol,
        apikey: API_KEY,
        outputsize: 'compact',
      },
    });

    // Rate limit / quota
    if (response.data.Note || response.data.Information) {
      throw new Error('RATE_LIMIT');
    }

    // API format error
    if (response.data['Error Message']) {
      throw new Error('INVALID_SYMBOL');
    }

    const timeSeries = response.data['Time Series (Daily)'];
    if (!timeSeries) {
      throw new Error('NO_DATA');
    }

    const stockPrices: StockPrice[] = Object.entries(timeSeries).map(
      ([date, data]: any) => ({
        symbol,
        date,
        open: parseFloat(data['1. open']),
        high: parseFloat(data['2. high']),
        low: parseFloat(data['3. low']),
        close: parseFloat(data['4. close']),
        volume: parseInt(data['5. volume'], 10),
        adjusted_close: parseFloat(data['4. close']), // free tier has no adjusted close → use close
      })
    );

    return stockPrices.sort((a, b) => a.date.localeCompare(b.date));
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(`AXIOS_ERROR`);
    }
    throw error;
  }
}

/**
 * Fetch real-time stock quote
 */
export async function fetchStockQuote(symbol: string = 'TSLA') {
  if (!API_KEY) {
    throw new Error('MISSING_API_KEY');
  }

  try {
    const response = await axios.get<AlphaVantageResponse>(BASE_URL, {
      params: {
        function: 'GLOBAL_QUOTE',
        symbol,
        apikey: API_KEY,
      },
    });

    if (response.data.Note || response.data.Information) {
      throw new Error('RATE_LIMIT');
    }

    if (response.data['Error Message']) {
      throw new Error('INVALID_SYMBOL');
    }

    const q = response.data['Global Quote'];
    if (!q) {
      throw new Error('NO_DATA');
    }

    return {
      symbol: q['01. symbol'],
      open: q['02. open'],
      high: q['03. high'],
      low: q['04. low'],
      price: q['05. price'],
      volume: q['06. volume'],
      latestTradingDay: q['07. latest trading day'],
      previousClose: q['08. previous close'],
      change: q['09. change'],
      changePercent: q['10. change percent'],
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(`AXIOS_ERROR`);
    }
    throw error;
  }
}

/* ───────────────────────────────
   Technical Indicators
────────────────────────────── */

export function calculateSMA(prices: number[], period: number): number[] {
  const sma: number[] = [];
  for (let i = 0; i < prices.length; i++) {
    if (i < period - 1) {
      sma.push(NaN);
    } else {
      const sum = prices.slice(i - period + 1, i + 1).reduce((a, b) => a + b, 0);
      sma.push(sum / period);
    }
  }
  return sma;
}

export function calculateEMA(prices: number[], period: number): number[] {
  const ema: number[] = [];
  const multiplier = 2 / (period + 1);

  for (let i = 0; i < prices.length; i++) {
    if (i === 0) {
      ema.push(prices[i]);
    } else {
      ema.push((prices[i] - ema[i - 1]) * multiplier + ema[i - 1]);
    }
  }
  return ema;
}

export function calculateRSI(prices: number[], period: number = 14): number[] {
  const rsi: number[] = [];
  const gains: number[] = [];
  const losses: number[] = [];

  for (let i = 1; i < prices.length; i++) {
    const change = prices[i] - prices[i - 1];
    gains.push(change > 0 ? change : 0);
    losses.push(change < 0 ? Math.abs(change) : 0);
  }

  for (let i = 0; i < prices.length; i++) {
    if (i < period) {
      rsi.push(NaN);
    } else {
      const avgGain = gains.slice(i - period, i).reduce((a, b) => a + b, 0) / period;
      const avgLoss = losses.slice(i - period, i).reduce((a, b) => a + b, 0) / period;

      if (avgLoss === 0) {
        rsi.push(100);
      } else {
        const rs = avgGain / avgLoss;
        rsi.push(100 - 100 / (1 + rs));
      }
    }
  }
  return rsi;
}

export function calculateMACD(
  prices: number[],
  fastPeriod: number = 12,
  slowPeriod: number = 26,
  signalPeriod: number = 9
): { macd: number[]; signal: number[]; histogram: number[] } {
  const ema12 = calculateEMA(prices, fastPeriod);
  const ema26 = calculateEMA(prices, slowPeriod);

  const macd = ema12.map((value, index) => value - ema26[index]);
  const signal = calculateEMA(macd.filter((v) => !isNaN(v)), signalPeriod);

  const alignedSignal: number[] = [];
  const macdValidStart = macd.findIndex((v) => !isNaN(v));
  for (let i = 0; i < macd.length; i++) {
    if (i < macdValidStart + signalPeriod - 1) {
      alignedSignal.push(NaN);
    } else {
      alignedSignal.push(signal[i - macdValidStart - signalPeriod + 1]);
    }
  }

  const histogram = macd.map((value, index) => value - alignedSignal[index]);

  return { macd, signal: alignedSignal, histogram };
}

export function calculateBollingerBands(
  prices: number[],
  period: number = 20,
  stdDev: number = 2
): { upper: number[]; middle: number[]; lower: number[] } {
  const sma = calculateSMA(prices, period);
  const upper: number[] = [];
  const middle = sma;
  const lower: number[] = [];

  for (let i = 0; i < prices.length; i++) {
    if (i < period - 1) {
      upper.push(NaN);
      lower.push(NaN);
    } else {
      const slice = prices.slice(i - period + 1, i + 1);
      const mean = sma[i];
      const variance =
        slice.reduce((sum, price) => sum + Math.pow(price - mean, 2), 0) / period;
      const standardDeviation = Math.sqrt(variance);

      upper.push(mean + stdDev * standardDeviation);
      lower.push(mean - stdDev * standardDeviation);
    }
  }

  return { upper, middle, lower };
}
