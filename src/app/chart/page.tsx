'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import axios from 'axios';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { StockPrice } from '@/types/stock';

const TIME_RANGES = [
  { label: '1 Month', value: '1M', days: 30 },
  { label: '3 Months', value: '3M', days: 90 },
  { label: '6 Months', value: '6M', days: 180 },
  { label: '1 Year', value: '1Y', days: 365 },
  { label: 'All', value: 'ALL', days: 0 },
];

export default function ChartPage() {
  const [stockData, setStockData] = useState<StockPrice[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('1Y');

  const fetchStockData = async () => {
    try {
      setLoading(true);
      const range = TIME_RANGES.find((r) => r.value === timeRange);
      const limit = range?.days || 1000;

      const response = await axios.get('/api/stock/price', {
        params: { limit },
      });
      setStockData(response.data.data.reverse()); // Reverse to show chronologically
    } catch (error) {
      console.error('Error fetching stock data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStockData();
  }, [timeRange]);

  const chartData = stockData.map((item) => ({
    date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    open: item.open,
    high: item.high,
    low: item.low,
    close: item.close,
    volume: item.volume,
  }));

  return (
    <div className="container py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">Stock Chart</h1>
          <p className="text-muted-foreground">Historical price data visualization</p>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select time range" />
          </SelectTrigger>
          <SelectContent>
            {TIME_RANGES.map((range) => (
              <SelectItem key={range.value} value={range.value}>
                {range.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Loading chart data...</p>
        </div>
      ) : chartData.length > 0 ? (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Price Chart</CardTitle>
              <CardDescription>Daily closing prices</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="close" stroke="#8884d8" name="Close Price" />
                  <Line type="monotone" dataKey="open" stroke="#82ca9d" name="Open Price" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Volume</CardTitle>
              <CardDescription>Trading volume over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="volume" stroke="#ffc658" name="Volume" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      ) : (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">No chart data available.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

