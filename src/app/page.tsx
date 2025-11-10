'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TrendingUp, TrendingDown, RefreshCw } from 'lucide-react';
import axios from 'axios';

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

export default function Home() {
  const [quote, setQuote] = useState<StockQuote | null>(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);

  const fetchQuote = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/stock/quote');
      setQuote(response.data.data);
    } catch (error) {
      console.error('Error fetching stock quote:', error);
    } finally {
      setLoading(false);
    }
  };

  const syncData = async () => {
    try {
      setSyncing(true);
      await axios.get('/api/stock/sync');
      await fetchQuote();
    } catch (error) {
      console.error('Error syncing stock data:', error);
    } finally {
      setSyncing(false);
    }
  };

  useEffect(() => {
    fetchQuote();
  }, []);

  const change = quote ? parseFloat(quote.change) : 0;
  const changePercent = quote ? parseFloat(quote.changePercent.replace('%', '')) : 0;
  const isPositive = change >= 0;

  return (
    <div className="container py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">Tesla Stock Analysis</h1>
          <p className="text-muted-foreground">
            Real-time stock price information and analysis
          </p>
        </div>
        <Button onClick={syncData} disabled={syncing}>
          <RefreshCw className={`mr-2 h-4 w-4 ${syncing ? 'animate-spin' : ''}`} />
          {syncing ? 'Syncing...' : 'Sync Data'}
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : quote ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Current Price</CardTitle>
              {isPositive ? (
                <TrendingUp className="h-4 w-4 text-green-600" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-600" />
              )}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${parseFloat(quote.price).toFixed(2)}</div>
              <p
                className={`text-xs ${
                  isPositive ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {isPositive ? '+' : ''}
                {change.toFixed(2)} ({isPositive ? '+' : ''}
                {changePercent.toFixed(2)}%)
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Open</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${parseFloat(quote.open).toFixed(2)}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">High</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                ${parseFloat(quote.high).toFixed(2)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Low</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                ${parseFloat(quote.low).toFixed(2)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Volume</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {parseInt(quote.volume, 10).toLocaleString()}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Previous Close</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${parseFloat(quote.previousClose).toFixed(2)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Latest Trading Day</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{quote.latestTradingDay}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Symbol</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{quote.symbol}</div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              No stock data available. Please sync data first.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
