import { supabaseAdmin } from './server';
import type { StockPrice, TechnicalIndicators } from '@/types/stock';

/**
 * Insert or update stock prices in the database
 */
export async function upsertStockPrices(prices: StockPrice[]) {
  const { data, error } = await supabaseAdmin
    .from('stock_prices')
    .upsert(prices, {
      onConflict: 'symbol,date',
      ignoreDuplicates: false,
    })
    .select();

  if (error) {
    throw new Error(`Failed to upsert stock prices: ${error.message}`);
  }

  return data;
}

/**
 * Get stock prices from the database
 */
export async function getStockPrices(
  symbol: string = 'TSLA',
  limit: number = 100,
  startDate?: string,
  endDate?: string
): Promise<StockPrice[]> {
  let query = supabaseAdmin
    .from('stock_prices')
    .select('*')
    .eq('symbol', symbol)
    .order('date', { ascending: false })
    .limit(limit);

  if (startDate) {
    query = query.gte('date', startDate);
  }

  if (endDate) {
    query = query.lte('date', endDate);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(`Failed to fetch stock prices: ${error.message}`);
  }

  return (data || []) as StockPrice[];
}

/**
 * Get latest stock price
 */
export async function getLatestStockPrice(symbol: string = 'TSLA'): Promise<StockPrice | null> {
  const { data, error } = await supabaseAdmin
    .from('stock_prices')
    .select('*')
    .eq('symbol', symbol)
    .order('date', { ascending: false })
    .limit(1)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null; // No data found
    }
    throw new Error(`Failed to fetch latest stock price: ${error.message}`);
  }

  return data as StockPrice;
}

/**
 * Insert or update technical indicators
 */
export async function upsertTechnicalIndicators(indicators: TechnicalIndicators[]) {
  const { data, error } = await supabaseAdmin
    .from('technical_indicators')
    .upsert(indicators, {
      onConflict: 'symbol,date',
      ignoreDuplicates: false,
    })
    .select();

  if (error) {
    throw new Error(`Failed to upsert technical indicators: ${error.message}`);
  }

  return data;
}

/**
 * Get technical indicators from the database
 */
export async function getTechnicalIndicators(
  symbol: string = 'TSLA',
  limit: number = 100,
  startDate?: string,
  endDate?: string
): Promise<TechnicalIndicators[]> {
  let query = supabaseAdmin
    .from('technical_indicators')
    .select('*')
    .eq('symbol', symbol)
    .order('date', { ascending: false })
    .limit(limit);

  if (startDate) {
    query = query.gte('date', startDate);
  }

  if (endDate) {
    query = query.lte('date', endDate);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(`Failed to fetch technical indicators: ${error.message}`);
  }

  return (data || []) as TechnicalIndicators[];
}

