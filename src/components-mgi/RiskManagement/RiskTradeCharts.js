import React from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  Legend,
} from "recharts";

// Format date for X-axis
const formatDate = (dateStr) => {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return `${d.getMonth() + 1}/${d.getDate()}`;
};

function RiskTradeCharts({ trades }) {
  if (!trades || trades.length === 0) {
    return (
      <p className="text-center text-gray-500 mt-6">
        No chart data available. Add trades to see visualization.
      </p>
    );
  }

  // Prepare base chart data
  const sortedTrades = [...trades].sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );

  let cumulative = 0;
  const chartData = sortedTrades.map((t) => {
    const netUSD = t.gain_usd - t.risk_usd;
    cumulative += netUSD;
    return {
      date: formatDate(t.date),
      risk_usd: t.risk_usd,
      gain_usd: t.gain_usd,
      risk_pips: t.risk_pips,
      gain_pips: t.gain_pips,
      net_usd: netUSD,
      cumulative_usd: cumulative,
    };
  });

  return (
    <div className="mt-10 space-y-10">
      {/* USD Risk vs Gain Line Chart */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Risk vs Gain (USD)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="risk_usd"
              stroke="#ef4444"
              name="Risk (USD)"
            />
            <Line
              type="monotone"
              dataKey="gain_usd"
              stroke="#22c55e"
              name="Gain (USD)"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Pips Risk vs Gain Bar Chart */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Risk vs Gain (Pips)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="risk_pips" fill="#f97316" name="Risk (Pips)" />
            <Bar dataKey="gain_pips" fill="#3b82f6" name="Gain (Pips)" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Cumulative P/L Line Chart */}
      <div>
        <h3 className="text-lg font-semibold mb-4">
          Cumulative Profit/Loss (USD)
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="cumulative_usd"
              stroke="#3b82f6"
              name="Cumulative P/L (USD)"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default RiskTradeCharts;
