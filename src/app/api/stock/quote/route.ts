import { NextRequest, NextResponse } from 'next/server';
import { fetchStockQuote } from '@/lib/alpha-vantage';
import { getLatestStockPrice } from '@/lib/supabase/stock';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const symbol = searchParams.get('symbol') || 'TSLA';
    const useCache = searchParams.get('useCache') !== 'false';

    // Try to get from database first if useCache is true
    if (useCache) {
      try {
        const latestPrice = await getLatestStockPrice(symbol);
        if (latestPrice) {
          // Check if data is from today
          const today = new Date().toISOString().split('T')[0];
          if (latestPrice.date === today) {
            return NextResponse.json({ data: latestPrice, source: 'database' });
          }
        }
      } catch (error) {
        console.warn('Failed to fetch from database, falling back to API:', error);
      }
    }

    // Fetch from Alpha Vantage API
    const quote = await fetchStockQuote(symbol);

    return NextResponse.json({ data: quote, source: 'api' });
  } catch (error) {
    console.error('Error fetching stock quote:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch stock quote' },
      { status: 500 }
    );
  }
}

