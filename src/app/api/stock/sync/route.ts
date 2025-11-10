import { NextRequest, NextResponse } from 'next/server';
import { fetchDailyAdjustedStockData } from '@/lib/alpha-vantage';
import { upsertStockPrices } from '@/lib/supabase/stock';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const symbol = body.symbol || 'TSLA';

    // Fetch data from Alpha Vantage
    const stockData = await fetchDailyAdjustedStockData(symbol);

    if (stockData.length === 0) {
      return NextResponse.json(
        { error: 'No stock data received from Alpha Vantage' },
        { status: 400 }
      );
    }

    // Save to database
    const savedData = await upsertStockPrices(stockData);

    return NextResponse.json({
      message: 'Stock data synchronized successfully',
      count: savedData?.length || 0,
      symbol,
    });
  } catch (error) {
    console.error('Error syncing stock data:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to sync stock data',
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const symbol = searchParams.get('symbol') || 'TSLA';

    // Fetch data from Alpha Vantage
    const stockData = await fetchDailyAdjustedStockData(symbol);

    if (stockData.length === 0) {
      return NextResponse.json(
        { error: 'No stock data received from Alpha Vantage' },
        { status: 400 }
      );
    }

    // Save to database
    const savedData = await upsertStockPrices(stockData);

    return NextResponse.json({
      message: 'Stock data synchronized successfully',
      count: savedData?.length || 0,
      symbol,
    });
  } catch (error) {
    console.error('Error syncing stock data:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to sync stock data',
      },
      { status: 500 }
    );
  }
}

