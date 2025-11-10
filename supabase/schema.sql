-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Stock Prices Table
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
  UNIQUE(symbol, date)
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_stock_prices_symbol_date ON stock_prices(symbol, date DESC);
CREATE INDEX IF NOT EXISTS idx_stock_prices_date ON stock_prices(date DESC);

-- Technical Indicators Table
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
  UNIQUE(symbol, date)
);

-- Create index for technical indicators
CREATE INDEX IF NOT EXISTS idx_technical_indicators_symbol_date ON technical_indicators(symbol, date DESC);

-- News Table (Optional)
CREATE TABLE IF NOT EXISTS news (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  symbol VARCHAR(10) NOT NULL DEFAULT 'TSLA',
  title TEXT NOT NULL,
  url TEXT,
  source VARCHAR(255),
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(url)
);

-- Create index for news
CREATE INDEX IF NOT EXISTS idx_news_symbol_published_at ON news(symbol, published_at DESC);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger for stock_prices
CREATE TRIGGER update_stock_prices_updated_at BEFORE UPDATE ON stock_prices
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger for technical_indicators
CREATE TRIGGER update_technical_indicators_updated_at BEFORE UPDATE ON technical_indicators
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) Policies
ALTER TABLE stock_prices ENABLE ROW LEVEL SECURITY;
ALTER TABLE technical_indicators ENABLE ROW LEVEL SECURITY;
ALTER TABLE news ENABLE ROW LEVEL SECURITY;

-- Policy: Allow anyone to read stock_prices
CREATE POLICY "Allow public read access on stock_prices" ON stock_prices
    FOR SELECT USING (true);

-- Policy: Allow anyone to read technical_indicators
CREATE POLICY "Allow public read access on technical_indicators" ON technical_indicators
    FOR SELECT USING (true);

-- Policy: Allow anyone to read news
CREATE POLICY "Allow public read access on news" ON news
    FOR SELECT USING (true);

-- Note: Service role key bypasses RLS, so no separate policy is needed for write operations
-- All write operations should be done server-side using the service role key

