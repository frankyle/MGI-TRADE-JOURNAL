import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  LabelList,
} from 'recharts';

const usdToTshRate = 2500;
const convertUSDToTSH = (usd) => usd * usdToTshRate;

const FundedTradeCharts = ({ trades }) => {
  const sortedTrades = [...trades].sort((a, b) => new Date(a.date) - new Date(b.date));

  const formatLabel = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return `${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getDate().toString().padStart(2, '0')}`;
  };

  // Line chart data
  const lineData = sortedTrades.map((trade) => ({
    date: formatLabel(trade.date),
    'Risk (USD)': trade.riskUSD,
    'Gain (USD)': trade.gainUSD,
  }));

  // Group risk by date
  const riskByDate = {};
  const usdByDate = {};

  sortedTrades.forEach((trade) => {
    const dateKey = formatLabel(trade.date);
    const riskTZS = convertUSDToTSH(trade.riskUSD);
    riskByDate[dateKey] = (riskByDate[dateKey] || 0) + riskTZS;
    usdByDate[dateKey] = (usdByDate[dateKey] || 0) + trade.riskUSD;
  });

  const histogramData = Object.keys(riskByDate).map((date) => ({
    date,
    riskTZS: riskByDate[date],
    usdTotal: usdByDate[date].toFixed(2),
  }));

  return (
    <div className="mt-8 space-y-12 max-w-6xl mx-auto px-4">
      {/* Line Chart */}
      <div>
        <h3 className="text-xl font-semibold mb-2">Risk and Gain Over Time (USD)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={lineData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="Risk (USD)" stroke="#f87171" activeDot={{ r: 6 }} />
            <Line type="monotone" dataKey="Gain (USD)" stroke="#22c55e" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Bar Chart */}
      <div>
        <h3 className="text-xl font-semibold mb-2">Total Risk (TZS) per Date</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={histogramData} layout="vertical" margin={{ top: 20, right: 50, left: 40, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis type="category" dataKey="date" />
            <Tooltip formatter={(value) => `${value.toLocaleString()} TZS`} />
            <Bar dataKey="riskTZS" fill="#22c55e" radius={[0, 5, 5, 0]}>
              {/* ✅ USD label beside each bar */}
              <LabelList
                dataKey="usdTotal"
                position="right"
                formatter={(value) => `${value} USD`}
                style={{ fill: '#374151', fontSize: '12px', fontWeight: 600 }}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default FundedTradeCharts;
