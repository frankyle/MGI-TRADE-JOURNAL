import React, { useState, useEffect } from "react";

const accountBalanceUSD = 100;
const usdToTshRate = 2500;
const convertUSDToTSH = (usd) => usd * usdToTshRate;

function RiskTradeModal({ onClose, onSave, initialData }) {
  const [form, setForm] = useState({
    date: "",
    pair: "",
    signal: "BUY",
    riskPips: "",
    gainPips: "",
    riskUSD: "",
    gainUSD: "",
  });

  // Load initial data on mount (for editing)
  useEffect(() => {
    if (initialData) {
      setForm({
        date: initialData.date || "",
        pair: initialData.pair || "",
        signal: initialData.signal || "BUY",
        riskPips:
          initialData.risk_pips !== null ? initialData.risk_pips : "",
        gainPips:
          initialData.gain_pips !== null ? initialData.gain_pips : "",
        riskUSD:
          initialData.risk_usd !== null ? initialData.risk_usd : "",
        gainUSD:
          initialData.gain_usd !== null ? initialData.gain_usd : "",
      });
    }
  }, [initialData]);

  // Helper to safely convert to number
  const safeNumber = (val) => {
    const num = parseFloat(val);
    return isNaN(num) ? 0 : num;
  };

  // Calculated fields
  const riskPercent = (safeNumber(form.riskUSD) / accountBalanceUSD) * 100;
  const riskTZS = convertUSDToTSH(safeNumber(form.riskUSD));
  const gainTZS = convertUSDToTSH(safeNumber(form.gainUSD));

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation
    if (
      !form.date ||
      !form.pair ||
      !form.riskPips ||
      !form.gainPips ||
      !form.riskUSD ||
      !form.gainUSD
    ) {
      alert("Please fill in all required fields");
      return;
    }

    onSave({
      ...form,
      riskPips: safeNumber(form.riskPips),
      gainPips: safeNumber(form.gainPips),
      riskUSD: safeNumber(form.riskUSD),
      gainUSD: safeNumber(form.gainUSD),
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg max-h-[90vh] overflow-auto">
        <h2 className="text-xl font-semibold mb-6">
          {initialData ? "Edit Risk Trade" : "Add New Risk Trade"}
        </h2>
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4"
        >
          {/* Date */}
          <div className="flex flex-col">
            <label className="block font-medium mb-1">Date of Trade</label>
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              className="border border-gray-300 rounded px-3 py-2"
              required
            />
          </div>

          {/* Currency Pair */}
          <div className="flex flex-col">
            <label className="block font-medium mb-1">Currency Pair</label>
            <input
              type="text"
              name="pair"
              value={form.pair}
              onChange={handleChange}
              placeholder="e.g. EUR/USD"
              className="border border-gray-300 rounded px-3 py-2"
              required
            />
          </div>

          {/* Signal */}
          <div className="flex flex-col">
            <label className="block font-medium mb-1">Signal</label>
            <select
              name="signal"
              value={form.signal}
              onChange={handleChange}
              className="border border-gray-300 rounded px-3 py-2"
            >
              <option value="BUY">BUY</option>
              <option value="SELL">SELL</option>
            </select>
          </div>

          {/* Risk (Pips) */}
          <div className="flex flex-col">
            <label className="block font-medium mb-1">Risk (Pips)</label>
            <input
              type="number"
              name="riskPips"
              value={form.riskPips}
              onChange={handleChange}
              min="0"
              step="0.1"
              className="border border-gray-300 rounded px-3 py-2"
              required
            />
          </div>

          {/* Gain (Pips) */}
          <div className="flex flex-col">
            <label className="block font-medium mb-1">Gain (Pips)</label>
            <input
              type="number"
              name="gainPips"
              value={form.gainPips}
              onChange={handleChange}
              min="0"
              step="0.1"
              className="border border-gray-300 rounded px-3 py-2"
              required
            />
          </div>

          {/* Risk (USD) */}
          <div className="flex flex-col">
            <label className="block font-medium mb-1">Risk (USD)</label>
            <input
              type="number"
              name="riskUSD"
              value={form.riskUSD}
              onChange={handleChange}
              min="0"
              step="0.01"
              placeholder="e.g. 20"
              className="border border-gray-300 rounded px-3 py-2"
              required
            />
            <p className="text-sm text-gray-600 mt-1">
              Risk % of Account: {riskPercent.toFixed(2)}%
            </p>
            <p className="text-sm text-gray-600 mt-1">
              Risk (TZS): {riskTZS.toFixed(0)} TZS
            </p>
          </div>

          {/* Gain (USD) */}
          <div className="flex flex-col">
            <label className="block font-medium mb-1">Gain (USD)</label>
            <input
              type="number"
              name="gainUSD"
              value={form.gainUSD}
              onChange={handleChange}
              min="0"
              step="0.01"
              placeholder="e.g. 50"
              className="border border-gray-300 rounded px-3 py-2"
              required
            />
            <p className="text-sm text-gray-600 mt-1">
              Gain (TZS): {gainTZS.toFixed(0)} TZS
            </p>
          </div>

          {/* Buttons */}
          <div className="sm:col-span-2 flex justify-end space-x-3 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              {initialData ? "Save Changes" : "Add Trade"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RiskTradeModal;
