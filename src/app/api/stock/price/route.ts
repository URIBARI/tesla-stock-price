import { NextRequest, NextResponse } from 'next/server';
import { getStockPrices } from '@/lib/supabase/stock';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const symbol = searchParams.get('symbol') || 'TSLA';
    const limit = parseInt(searchParams.get('limit') || '100', 10);
    const startDate = searchParams.get('startDate') || undefined;
    const endDate = searchParams.get('endDate') || undefined;

    const prices = await getStockPrices(symbol, limit, startDate, endDate);

    return NextResponse.json({ data: prices });
  } catch (error) {
    console.error('Error fetching stock prices:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch stock prices' },
      { status: 500 }
    );
  }
}

