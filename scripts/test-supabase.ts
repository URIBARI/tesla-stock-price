/**
 * Supabase 연결 테스트 스크립트
 * 
 * 사용법:
 * 1. .env.local 파일에 Supabase 환경 변수 설정
 * 2. npx tsx scripts/test-supabase.ts 실행
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

// .env.local 파일 로드
dotenv.config({ path: resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseAnonKey || !supabaseServiceRoleKey) {
  console.error('❌ 환경 변수가 설정되지 않았습니다.');
  console.error('필요한 환경 변수:');
  console.error('  - NEXT_PUBLIC_SUPABASE_URL');
  console.error('  - NEXT_PUBLIC_SUPABASE_ANON_KEY');
  console.error('  - SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

async function testSupabaseConnection() {
  console.log('🔍 Supabase 연결 테스트 시작...\n');

  // Anon key로 클라이언트 생성 (읽기 전용 테스트)
  const supabase = createClient(supabaseUrl, supabaseAnonKey);
  
  // Service role key로 클라이언트 생성 (쓰기 테스트)
  const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey);

  try {
    // 1. 연결 테스트
    console.log('1️⃣ 연결 테스트...');
    const { data: healthCheck, error: healthError } = await supabase
      .from('stock_prices')
      .select('count')
      .limit(1);
    
    if (healthError && healthError.code !== 'PGRST116') {
      throw healthError;
    }
    console.log('✅ 연결 성공\n');

    // 2. 테이블 존재 확인
    console.log('2️⃣ 테이블 존재 확인...');
    const tables = ['stock_prices', 'technical_indicators', 'news'];
    
    for (const table of tables) {
      const { error } = await supabase.from(table).select('*').limit(1);
      if (error && error.code !== 'PGRST116') {
        console.error(`❌ 테이블 '${table}' 접근 실패:`, error.message);
      } else {
        console.log(`✅ 테이블 '${table}' 접근 가능`);
      }
    }
    console.log('');

    // 3. 읽기 권한 테스트
    console.log('3️⃣ 읽기 권한 테스트...');
    const { data: readData, error: readError } = await supabase
      .from('stock_prices')
      .select('*')
      .limit(5);
    
    if (readError) {
      console.error('❌ 읽기 권한 오류:', readError.message);
    } else {
      console.log(`✅ 읽기 권한 정상 (${readData?.length || 0}개 레코드)`);
    }
    console.log('');

    // 4. 쓰기 권한 테스트 (서비스 역할 키)
    console.log('4️⃣ 쓰기 권한 테스트 (서비스 역할 키)...');
    const testData = {
      symbol: 'TSLA',
      date: new Date().toISOString().split('T')[0],
      open: 100.0,
      high: 105.0,
      low: 95.0,
      close: 102.0,
      volume: 1000000,
      adjusted_close: 102.0,
    };

    const { data: writeData, error: writeError } = await supabaseAdmin
      .from('stock_prices')
      .upsert(testData, { onConflict: 'symbol,date' })
      .select();

    if (writeError) {
      console.error('❌ 쓰기 권한 오류:', writeError.message);
    } else {
      console.log('✅ 쓰기 권한 정상 (테스트 데이터 저장 완료)');
      
      // 테스트 데이터 삭제
      await supabaseAdmin
        .from('stock_prices')
        .delete()
        .eq('symbol', testData.symbol)
        .eq('date', testData.date);
      console.log('✅ 테스트 데이터 삭제 완료');
    }
    console.log('');

    // 5. 인덱스 확인
    console.log('5️⃣ 인덱스 확인...');
    const { data: indexes, error: indexError } = await supabaseAdmin
      .rpc('pg_indexes', { tablename: 'stock_prices' })
      .select('*');
    
    if (indexError) {
      console.log('⚠️ 인덱스 확인은 수동으로 확인하세요 (SQL Editor에서)');
    } else {
      console.log('✅ 인덱스 확인 완료');
    }
    console.log('');

    console.log('🎉 모든 테스트 완료!');
    console.log('\n다음 단계:');
    console.log('1. Alpha Vantage API 키 설정');
    console.log('2. 데이터 동기화 테스트 (홈 페이지에서 "Sync Data" 버튼 클릭)');

  } catch (error) {
    console.error('❌ 테스트 중 오류 발생:', error);
    process.exit(1);
  }
}

testSupabaseConnection();

