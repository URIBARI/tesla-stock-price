'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RefreshCw } from 'lucide-react';
import axios from 'axios';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from 'recharts';
import {
  calculateRSI,
  calculateMACD,
  calculateBollingerBands,
} from '@/lib/alpha-vantage';

// ✅ 안전 숫자 변환 함수
function safeNumber(value: any, digits = 2): number {
  const num = parseFloat(value);
  if (isNaN(num) || !isFinite(num)) return 0;
  return parseFloat(num.toFixed(digits));
}

interface StockPrice {
  date: string;
  close: number;
}

export default function AnalysisPage() {
  const [chartData, setChartData] = useState<StockPrice[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchChartData = async () => {
    try {
      const response = await axios.get('/api/stock/price?limit=90');
      const data = response.data.data || [];
      const sorted = data
        .map((d: any) => ({
          date: d.date,
          close: isNaN(parseFloat(d.close)) ? 0 : parseFloat(d.close),
        }))
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      setChartData(sorted);
    } catch (error) {
      console.error('Error fetching chart data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChartData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (chartData.length === 0) {
    return <p className="text-center text-gray-500">No data available.</p>;
  }

  // 데이터 추출
  const closes = chartData.map((d) => safeNumber(d.close));

  // ✅ 지표 계산 (NaN 방지 포함)
  const rsi = calculateRSI(closes).map((v) => (isNaN(v) ? 0 : v));
  const { macd, signal, histogram } = calculateMACD(closes);
  const { upper, middle, lower } = calculateBollingerBands(closes);

  // ✅ 데이터 병합 (그래프용, NaN 방지)
  const combined = chartData.map((d, i) => ({
    ...d,
    rsi: safeNumber(rsi[i]),
    macd: safeNumber(macd[i]),
    signal: safeNumber(signal[i]),
    histogram: safeNumber(histogram[i]),
    upper: safeNumber(upper[i]),
    middle: safeNumber(middle[i]),
    lower: safeNumber(lower[i]),
  }));

  return (
    <div className="container py-10">
      <h1 className="text-4xl font-bold mb-6 tracking-tight">📈 Technical Analysis</h1>

      {/* Bollinger Bands */}
      <Card className="mb-8 hover:shadow-lg transition">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-700">
            Bollinger Bands (20-day)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={combined}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis domain={['auto', 'auto']} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="close" stroke="#2563eb" strokeWidth={2} dot={false} name="Close" />
              <Line type="monotone" dataKey="upper" stroke="#f87171" dot={false} name="Upper Band" />
              <Line type="monotone" dataKey="middle" stroke="#9ca3af" dot={false} name="Middle Band" />
              <Line type="monotone" dataKey="lower" stroke="#60a5fa" dot={false} name="Lower Band" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* MACD */}
      <Card className="mb-8 hover:shadow-lg transition">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-700">MACD (12,26,9)</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={combined}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis domain={['auto', 'auto']} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="macd" stroke="#2563eb" strokeWidth={2} dot={false} name="MACD" />
              <Line type="monotone" dataKey="signal" stroke="#f87171" strokeWidth={1.5} dot={false} name="Signal" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* RSI */}
      <Card className="hover:shadow-lg transition">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-700">RSI (14)</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={combined.filter(d => d.rsi > 0)}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="rsi" stroke="#16a34a" strokeWidth={2} dot={false} />
              {/* RSI 기준선 */}
              <Line dataKey={() => 70} stroke="#f87171" strokeDasharray="4 4" />
              <Line dataKey={() => 30} stroke="#60a5fa" strokeDasharray="4 4" />
            </LineChart>
          </ResponsiveContainer>
          <p className="text-xs text-gray-500 mt-2">
            RSI 기준선: 70 (과매수), 30 (과매도)
          </p>
        </CardContent>
      </Card>

      <p className="text-center mt-10 text-sm text-gray-400">
        Built with <span className="font-semibold">Next.js</span>,{' '}
        <span className="font-semibold">Recharts</span>, and{' '}
        <span className="font-semibold">Alpha Vantage</span>.
      </p>
    </div>
  );
}
