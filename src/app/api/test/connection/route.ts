import { NextResponse } from 'next/server';
import { getStockPrices } from '@/lib/supabase/stock';

/**
 * Supabase 연결 테스트 API
 * GET /api/test/connection
 */
export async function GET() {
  try {
    // 환경 변수 확인
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    const missingVars: string[] = [];
    if (!supabaseUrl) missingVars.push('NEXT_PUBLIC_SUPABASE_URL');
    if (!supabaseAnonKey) missingVars.push('NEXT_PUBLIC_SUPABASE_ANON_KEY');
    if (!supabaseServiceRoleKey) missingVars.push('SUPABASE_SERVICE_ROLE_KEY');

    if (missingVars.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing environment variables',
          missing: missingVars,
        },
        { status: 500 }
      );
    }

    // 데이터베이스 연결 테스트
    try {
      const prices = await getStockPrices('TSLA', 1);
      return NextResponse.json({
        success: true,
        message: 'Supabase connection successful',
        environment: {
          supabaseUrl: supabaseUrl ? '✓ Set' : '✗ Missing',
          supabaseAnonKey: supabaseAnonKey ? '✓ Set' : '✗ Missing',
          supabaseServiceRoleKey: supabaseServiceRoleKey ? '✓ Set' : '✗ Missing',
        },
        database: {
          connected: true,
          recordsFound: prices.length,
        },
      });
    } catch (dbError) {
      return NextResponse.json(
        {
          success: false,
          error: 'Database connection failed',
          message: dbError instanceof Error ? dbError.message : 'Unknown error',
          environment: {
            supabaseUrl: supabaseUrl ? '✓ Set' : '✗ Missing',
            supabaseAnonKey: supabaseAnonKey ? '✓ Set' : '✗ Missing',
            supabaseServiceRoleKey: supabaseServiceRoleKey ? '✓ Set' : '✗ Missing',
          },
        },
        { status: 500 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: 'Test failed',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

