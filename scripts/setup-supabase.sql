-- Supabase 데이터베이스 설정 스크립트
-- 이 파일은 Supabase SQL Editor에서 실행하세요.

-- ============================================
-- 1. UUID 확장 기능 활성화
-- ============================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 2. 기존 테이블 및 정책 삭제 (필요시)
-- ============================================
-- 주의: 이 명령은 기존 데이터를 삭제합니다!
-- DROP TABLE IF EXISTS news CASCADE;
-- DROP TABLE IF EXISTS technical_indicators CASCADE;
-- DROP TABLE IF EXISTS stock_prices CASCADE;
-- DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;

-- ============================================
-- 3. Stock Prices 테이블 생성
-- ============================================
CREATE TABLE IF NOT EXISTS stock_prices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  symbol VARCHAR(10) NOT NULL DEFAULT 'TSLA',
  date DATE NOT NULL,
  open DECIMAL(10, 2) NOT NULL,
  high DECIMAL(10, 2) NOT NULL,
  low DECIMAL(10, 2) NOT NULL,
  close DECIMAL(10, 2) NOT NULL,
  volume BIGINT NOT NULL,
  adjusted_close DECIMAL(10, 2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT unique_symbol_date UNIQUE(symbol, date)
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_stock_prices_symbol_date 
  ON stock_prices(symbol, date DESC);
CREATE INDEX IF NOT EXISTS idx_stock_prices_date 
  ON stock_prices(date DESC);

-- ============================================
-- 4. Technical Indicators 테이블 생성
-- ============================================
CREATE TABLE IF NOT EXISTS technical_indicators (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  symbol VARCHAR(10) NOT NULL DEFAULT 'TSLA',
  date DATE NOT NULL,
  sma_5 DECIMAL(10, 2),
  sma_20 DECIMAL(10, 2),
  sma_50 DECIMAL(10, 2),
  sma_200 DECIMAL(10, 2),
  ema_12 DECIMAL(10, 2),
  ema_26 DECIMAL(10, 2),
  rsi DECIMAL(5, 2),
  macd DECIMAL(10, 4),
  macd_signal DECIMAL(10, 4),
  macd_histogram DECIMAL(10, 4),
  bollinger_upper DECIMAL(10, 2),
  bollinger_middle DECIMAL(10, 2),
  bollinger_lower DECIMAL(10, 2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT unique_technical_indicator_symbol_date UNIQUE(symbol, date)
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_technical_indicators_symbol_date 
  ON technical_indicators(symbol, date DESC);

-- ============================================
-- 5. News 테이블 생성 (선택적)
-- ============================================
CREATE TABLE IF NOT EXISTS news (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  symbol VARCHAR(10) NOT NULL DEFAULT 'TSLA',
  title TEXT NOT NULL,
  url TEXT,
  source VARCHAR(255),
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT unique_news_url UNIQUE(url)
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_news_symbol_published_at 
  ON news(symbol, published_at DESC);

-- ============================================
-- 6. Updated_at 자동 업데이트 함수
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- ============================================
-- 7. 트리거 생성
-- ============================================
-- stock_prices 테이블 트리거
DROP TRIGGER IF EXISTS update_stock_prices_updated_at ON stock_prices;
CREATE TRIGGER update_stock_prices_updated_at 
  BEFORE UPDATE ON stock_prices
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- technical_indicators 테이블 트리거
DROP TRIGGER IF EXISTS update_technical_indicators_updated_at ON technical_indicators;
CREATE TRIGGER update_technical_indicators_updated_at 
  BEFORE UPDATE ON technical_indicators
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 8. Row Level Security (RLS) 활성화
-- ============================================
ALTER TABLE stock_prices ENABLE ROW LEVEL SECURITY;
ALTER TABLE technical_indicators ENABLE ROW LEVEL SECURITY;
ALTER TABLE news ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 9. RLS 정책 생성
-- ============================================

-- stock_prices 테이블 정책
-- 기존 정책 삭제
DROP POLICY IF EXISTS "Allow public read access on stock_prices" ON stock_prices;

-- 공개 읽기 정책 생성
CREATE POLICY "Allow public read access on stock_prices" 
  ON stock_prices
  FOR SELECT 
  USING (true);

-- technical_indicators 테이블 정책
DROP POLICY IF EXISTS "Allow public read access on technical_indicators" ON technical_indicators;

CREATE POLICY "Allow public read access on technical_indicators" 
  ON technical_indicators
  FOR SELECT 
  USING (true);

-- news 테이블 정책
DROP POLICY IF EXISTS "Allow public read access on news" ON news;

CREATE POLICY "Allow public read access on news" 
  ON news
  FOR SELECT 
  USING (true);

-- ============================================
-- 10. 완료 메시지
-- ============================================
-- 모든 작업이 완료되었습니다!
-- 
-- 참고:
-- - 서비스 역할 키는 RLS를 우회하므로 별도의 쓰기 정책이 필요 없습니다
-- - 모든 쓰기 작업은 서버 사이드에서 서비스 역할 키를 사용해야 합니다
-- - 클라이언트는 anon key를 사용하여 읽기만 가능합니다

