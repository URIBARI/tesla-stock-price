'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TrendingUp, TrendingDown, RefreshCw } from 'lucide-react';
import axios from 'axios';
import Link from 'next/link';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';

// ================================
// 🔒 안전 숫자 변환 함수
// ================================
function safeNumber(value: any, digits = 2): string {
  const num = parseFloat(value);
  if (isNaN(num)) return '--';
  return num.toFixed(digits);
}

interface StockQuote {
  symbol: string;
  price: string;
  change: string;
  changePercent: string;
  open: string;
  high: string;
  low: string;
  volume: string;
  latestTradingDay: string;
  previousClose: string;
}

interface StockPrice {
  date: string;
  close: number;
}

export default function Home() {
  const [quote, setQuote] = useState<StockQuote | null>(null);
  const [chartData, setChartData] = useState<StockPrice[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState<string | null>(null); // <-- FIXED location

  // ================================
  // 📊 Quote Fetcher
  // ================================
  const fetchQuote = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get('/api/stock/quote');
      setQuote(response.data.data);
    } catch (err: any) {
      console.error('Error fetching stock quote:', err);
      setError(err.response?.data?.error ?? 'Failed to fetch stock quote');
    } finally {
      setLoading(false);
    }
  };

  // ================================
  // 📈 Chart Fetcher
  // ================================
  const fetchChartData = async () => {
    try {
      const response = await axios.get('/api/stock/price?limit=30');
      const data = response.data.data || [];

      setChartData(
        data
          .map((d: any) => ({
            date: d.date,
            close: isNaN(parseFloat(d.close)) ? 0 : parseFloat(d.close),
          }))
          .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      );
    } catch (error) {
      console.error('Error fetching chart data:', error);
    }
  };

  // ================================
  // 🔄 Sync
  // ================================
  const syncData = async () => {
    try {
      setSyncing(true);
      await axios.get('/api/stock/sync');
      await fetchQuote();
      await fetchChartData();
    } catch (error) {
      console.error('Error syncing stock data:', error);
      setError('Sync failed — try again in a moment');
    } finally {
      setSyncing(false);
    }
  };

  useEffect(() => {
    fetchQuote();
    fetchChartData();
  }, []);

  const change = quote ? parseFloat(quote.change) : 0;
  const changePercent = quote ? parseFloat(quote.changePercent?.replace('%', '') || '0') : 0;
  const isPositive = change >= 0;

  return (
    <div className="container py-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-10">
        <div>
          <h1 className="text-4xl font-bold mb-2 tracking-tight">🚀 Tesla Stock Dashboard</h1>
          <p className="text-gray-500 text-sm">
            Real-time stock information, price trends, and analytics.
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            onClick={syncData}
            disabled={syncing}
            className="mt-4 sm:mt-0 bg-gray-900 text-white hover:bg-gray-800 transition"
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${syncing ? 'animate-spin' : ''}`} />
            {syncing ? 'Syncing...' : 'Sync Data'}
          </Button>
          <Link href="/analysis">
            <Button variant="outline">Go to Analysis</Button>
          </Link>
        </div>
      </div>

      {/* 🔥 Error UI */}
      {error && (
        <div className="border border-red-300 bg-red-50 text-red-700 rounded-md px-4 py-2 text-sm mb-4">
          ⚠ {error}
        </div>
      )}

      {/* Main Content */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      ) : quote ? (
        <>
          {/* Stock Summary Cards */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-10">
            <Card className="transition hover:shadow-lg border-t-4 border-gray-900">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Current Price</CardTitle>
                {isPositive ? (
                  <TrendingUp className="h-4 w-4 text-red-600" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-blue-600" />
                )}
              </CardHeader>
              <CardContent>
                <div
                  className={`flex items-center gap-2 text-3xl font-bold ${
                    isPositive ? 'text-red-600' : 'text-blue-600'
                  }`}
                >
                  {isPositive ? '▲' : '▼'} ${safeNumber(quote?.price)}
                </div>
                <p className={`mt-1 text-xs ${isPositive ? 'text-red-500' : 'text-blue-500'}`}>
                  {isPositive ? '+' : ''}
                  {safeNumber(change)} ({isPositive ? '+' : ''}
                  {safeNumber(changePercent)}%)
                </p>
              </CardContent>
            </Card>

            <Card><CardHeader><CardTitle>Open</CardTitle></CardHeader>
              <CardContent>${safeNumber(quote?.open)}</CardContent></Card>

            <Card><CardHeader><CardTitle>High</CardTitle></CardHeader>
              <CardContent className="text-red-600">${safeNumber(quote?.high)}</CardContent></Card>

            <Card><CardHeader><CardTitle>Low</CardTitle></CardHeader>
              <CardContent className="text-blue-600">${safeNumber(quote?.low)}</CardContent></Card>
          </div>

          {/* Chart */}
          <Card className="hover:shadow-lg transition">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-700">
                📈 Tesla 30-Day Price Trend
              </CardTitle>
            </CardHeader>
            <CardContent>
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                    <YAxis domain={['auto', 'auto']} tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Line type="monotone" dataKey="close" stroke="#2563eb" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-center text-gray-500">No price data available.</p>
              )}
            </CardContent>
          </Card>

          {/* Footer */}
          <p className="text-center mt-10 text-sm text-gray-400">
            Built with <span className="font-semibold">Next.js</span>,{' '}
            <span className="font-semibold">Supabase</span>, and{' '}
            <span className="font-semibold">Alpha Vantage API</span>.
          </p>
        </>
      ) : (
        <Card className="p-10 text-center">
          <p className="text-gray-500">No stock data available. Please sync data first.</p>
        </Card>
      )}
    </div>
  );
}
