import axios from 'axios';
import type { AlphaVantageResponse, StockPrice, TimeSeriesData } from '@/types/stock';

const ALPHA_VANTAGE_API_KEY = process.env.ALPHA_VANTAGE_API_KEY;
const BASE_URL = 'https://www.alphavantage.co/query';

if (!ALPHA_VANTAGE_API_KEY) {
  console.warn('ALPHA_VANTAGE_API_KEY is not set. Alpha Vantage API will not work.');
}

/**
 * Fetch daily adjusted stock data from Alpha Vantage
 */
export async function fetchDailyAdjustedStockData(
  symbol: string = 'TSLA'
): Promise<StockPrice[]> {
  if (!ALPHA_VANTAGE_API_KEY) {
    throw new Error('ALPHA_VANTAGE_API_KEY is not configured');
  }

  try {
    const response = await axios.get<AlphaVantageResponse>(BASE_URL, {
      params: {
        function: 'TIME_SERIES_DAILY_ADJUSTED',
        symbol,
        apikey: ALPHA_VANTAGE_API_KEY,
        outputsize: 'full',
      },
    });

    if (response.data.Note) {
      throw new Error('API call frequency limit reached. Please try again later.');
    }

    if (response.data['Error Message']) {
      throw new Error(response.data['Error Message']);
    }

    const timeSeries = response.data['Time Series (Daily Adjusted)'];
    if (!timeSeries) {
      throw new Error('No time series data found in response');
    }

    const stockPrices: StockPrice[] = Object.entries(timeSeries).map(
      ([date, data]) => ({
        symbol,
        date,
        open: parseFloat(data['1. open']),
        high: parseFloat(data['2. high']),
        low: parseFloat(data['3. low']),
        close: parseFloat(data['4. close']),
        volume: parseInt(data['5. volume'], 10),
        adjusted_close: parseFloat(data['5. adjusted close'] || data['4. close']),
      })
    );

    // Sort by date ascending
    return stockPrices.sort((a, b) => a.date.localeCompare(b.date));
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(`Alpha Vantage API error: ${error.message}`);
    }
    throw error;
  }
}

/**
 * Fetch current stock quote from Alpha Vantage
 */
export async function fetchStockQuote(symbol: string = 'TSLA') {
  if (!ALPHA_VANTAGE_API_KEY) {
    throw new Error('ALPHA_VANTAGE_API_KEY is not configured');
  }

  try {
    const response = await axios.get<AlphaVantageResponse>(BASE_URL, {
      params: {
        function: 'GLOBAL_QUOTE',
        symbol,
        apikey: ALPHA_VANTAGE_API_KEY,
      },
    });

    if (response.data.Note) {
      throw new Error('API call frequency limit reached. Please try again later.');
    }

    if (response.data['Error Message']) {
      throw new Error(response.data['Error Message']);
    }

    const globalQuote = response.data['Global Quote'];
    if (!globalQuote) {
      throw new Error('No quote data found in response');
    }

    return {
      symbol: globalQuote['01. symbol'],
      open: globalQuote['02. open'],
      high: globalQuote['03. high'],
      low: globalQuote['04. low'],
      price: globalQuote['05. price'],
      volume: globalQuote['06. volume'],
      latestTradingDay: globalQuote['07. latest trading day'],
      previousClose: globalQuote['08. previous close'],
      change: globalQuote['09. change'],
      changePercent: globalQuote['10. change percent'],
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(`Alpha Vantage API error: ${error.message}`);
    }
    throw error;
  }
}

/**
 * Calculate Simple Moving Average (SMA)
 */
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

/**
 * Calculate Exponential Moving Average (EMA)
 */
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

/**
 * Calculate RSI (Relative Strength Index)
 */
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

/**
 * Calculate MACD (Moving Average Convergence Divergence)
 */
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

  // Align signal array with MACD array
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

/**
 * Calculate Bollinger Bands
 */
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

