import { NextRequest, NextResponse } from 'next/server';
import { fetchStockQuote } from '@/lib/alpha-vantage';
import { getLatestStockPrice } from '@/lib/supabase/stock';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const symbol = searchParams.get('symbol') || 'TSLA';
  const useCache = searchParams.get('useCache') !== 'false';

  try {
    // 🔹 1. Check DB cache
    if (useCache) {
      try {
        const latestPrice = await getLatestStockPrice(symbol);
        if (latestPrice) {
          const today = new Date().toISOString().split('T')[0];
          if (latestPrice.date === today) {
            return NextResponse.json({
              data: latestPrice,
              source: 'database',
            });
          }
        }
      } catch (error) {
        console.warn('⚠️ DB lookup failed, falling back to API');
      }
    }

    // 🔹 2. Fetch from Alpha Vantage
    const quote = await fetchStockQuote(symbol);

    return NextResponse.json({
      data: quote,
      source: 'api',
    });

  } catch (error: any) {
    console.error('❌ Quote API error:', error.message);

    // 🔹 3. Error handling by type
    let status = 500;
    let message = 'Unexpected error';

    if (error.message === 'RATE_LIMIT') {
      status = 429; // Too Many Requests
      message = 'Alpha Vantage API rate limit reached. Try again later.';
    } else if (error.message === 'INVALID_SYMBOL') {
      status = 400;
      message = `Invalid stock symbol: ${symbol}`;
    } else if (error.message === 'NO_DATA') {
      status = 404;
      message = 'No quote data available at this time.';
    } else if (error.message === 'MISSING_API_KEY') {
      status = 500;
      message = 'Alpha Vantage API key is not configured on the server.';
    } else if (error.message === 'AXIOS_ERROR') {
      status = 502;
      message = 'External API request failed.';
    }

    return NextResponse.json({ error: message }, { status });
  }
}
