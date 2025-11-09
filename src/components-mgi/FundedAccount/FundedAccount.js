import React, { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient"; // adjust path
import FundedTradeModal from "./FundedTradeModal";
import FundedTradeCharts from "./FundedTradeCharts";

const usdToTshRate = 2500;
const convertUSDToTSH = (usd) => usd * usdToTshRate;

// Format date (mm/dd/yyyy + weekday)
const formatDateAndDay = (dateStr) => {
  if (!dateStr) return { date: "", day: "" };
  const d = new Date(dateStr);
  const date = `${(d.getMonth() + 1).toString().padStart(2, "0")}/${d
    .getDate()
    .toString()
    .padStart(2, "0")}/${d.getFullYear()}`;
  const day = d.toLocaleDateString("en-US", { weekday: "long" });
  return { date, day };
};

// Safe number formatter
const formatNumber = (value, decimals = 2) => {
  if (value === null || value === undefined || isNaN(value)) {
    return "-";
  }
  return Number(value).toFixed(decimals);
};

function FundedAccount() {
  const [trades, setTrades] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editTrade, setEditTrade] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  // ✅ Fetch current user
  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();
      if (error) {
        console.error("Error fetching user:", error.message);
        alert("Error fetching user: " + error.message);
      }
      setUser(user);
    };
    getUser();
  }, []);

  // ✅ Fetch trades whenever user changes
  useEffect(() => {
    if (!user) {
      setTrades([]);
      setLoading(false);
      return;
    }

    const fetchTrades = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("funded_trades")
        .select("*")
        .eq("user_id", user.id)
        .order("date", { ascending: false });

      if (error) {
        console.error("Error fetching funded trades:", error.message);
        alert("Error fetching funded trades: " + error.message);
        setTrades([]);
      } else {
        setTrades(data);
      }
      setLoading(false);
    };

    fetchTrades();
  }, [user]);

  // ✅ Add new trade
  const addTrade = async (trade) => {
    if (!user) return;
    const { error } = await supabase.from("funded_trades").insert([
      {
        user_id: user.id,
        date: trade.date,
        pair: trade.pair,
        signal: trade.signal,
        risk_pips: trade.riskPips ? Number(trade.riskPips) : 0,
        risk_usd: trade.riskUSD ? Number(trade.riskUSD) : 0,
        gain_pips: trade.gainPips ? Number(trade.gainPips) : 0,
        gain_usd: trade.gainUSD ? Number(trade.gainUSD) : 0,
      },
    ]);

    if (error) {
      console.error("Error adding funded trade:", error.message);
      alert("Error adding funded trade: " + error.message);
    } else {
      alert("Funded trade added successfully!");
    }

    refreshTrades();
  };

  // ✅ Update trade
  const updateTrade = async (updatedTrade) => {
    if (!editTrade) return;
    const { error } = await supabase
      .from("funded_trades")
      .update({
        date: updatedTrade.date,
        pair: updatedTrade.pair,
        signal: updatedTrade.signal,
        risk_pips: updatedTrade.riskPips ? Number(updatedTrade.riskPips) : 0,
        risk_usd: updatedTrade.riskUSD ? Number(updatedTrade.riskUSD) : 0,
        gain_pips: updatedTrade.gainPips ? Number(updatedTrade.gainPips) : 0,
        gain_usd: updatedTrade.gainUSD ? Number(updatedTrade.gainUSD) : 0,
      })
      .eq("id", editTrade.id)
      .eq("user_id", user.id);

    if (error) {
      console.error("Error updating funded trade:", error.message);
      alert("Error updating funded trade: " + error.message);
    } else {
      alert("Funded trade updated successfully!");
    }

    setEditTrade(null);
    refreshTrades();
  };

  // ✅ Delete trade
  const deleteTrade = async (id) => {
    if (window.confirm("Are you sure you want to delete this funded trade?")) {
      const { error } = await supabase
        .from("funded_trades")
        .delete()
        .eq("id", id)
        .eq("user_id", user.id);

      if (error) {
        console.error("Error deleting funded trade:", error.message);
        alert("Error deleting funded trade: " + error.message);
      } else {
        alert("Funded trade deleted successfully!");
      }

      refreshTrades();
    }
  };

  // ✅ Helper refresh
  const refreshTrades = async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from("funded_trades")
      .select("*")
      .eq("user_id", user.id)
      .order("date", { ascending: false });
    if (!error) setTrades(data || []);
  };

  const handleEdit = (trade) => {
    setEditTrade(trade);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditTrade(null);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <button
        onClick={() => setModalOpen(true)}
        className="mb-6 px-5 py-3 bg-green-600 text-white rounded hover:bg-green-700 transition"
      >
        Add Funded Trade
      </button>

      {loading ? (
        <p className="text-center text-gray-500">Loading funded trades...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300 border-collapse text-sm">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="border px-3 py-2">Date</th>
                <th className="border px-3 py-2">Day</th>
                <th className="border px-3 py-2">Pair</th>
                <th className="border px-3 py-2">Signal</th>
                <th className="border px-3 py-2">Risk (Pips)</th>
                <th className="border px-3 py-2">Risk (USD)</th>
                <th className="border px-3 py-2">Risk (TZS)</th>
                <th className="border px-3 py-2">Gain (Pips)</th>
                <th className="border px-3 py-2">Gain (USD)</th>
                <th className="border px-3 py-2">Gain (TZS)</th>
                <th className="border px-3 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {trades.length === 0 ? (
                <tr>
                  <td colSpan={11} className="text-center p-4 text-gray-500">
                    No funded trades available.
                  </td>
                </tr>
              ) : (
                trades.map((trade) => {
                  const { date, day } = formatDateAndDay(trade.date);
                  const riskTZS = trade.risk_usd
                    ? convertUSDToTSH(trade.risk_usd)
                    : 0;
                  const gainTZS = trade.gain_usd
                    ? convertUSDToTSH(trade.gain_usd)
                    : 0;

                  return (
                    <tr
                      key={trade.id}
                      className="hover:bg-gray-50 transition-colors duration-150"
                    >
                      <td className="border px-3 py-2">{date}</td>
                      <td className="border px-3 py-2">{day}</td>
                      <td className="border px-3 py-2">{trade.pair}</td>
                      <td className="border px-3 py-2">{trade.signal}</td>
                      <td className="border px-3 py-2">
                        {formatNumber(trade.risk_pips, 0)}
                      </td>
                      <td className="border px-3 py-2">
                        ${formatNumber(trade.risk_usd)}
                      </td>
                      <td className="border px-3 py-2">
                        {riskTZS ? `${riskTZS.toFixed(0)} TZS` : "-"}
                      </td>
                      <td className="border px-3 py-2">
                        {formatNumber(trade.gain_pips, 0)}
                      </td>
                      <td className="border px-3 py-2">
                        ${formatNumber(trade.gain_usd)}
                      </td>
                      <td className="border px-3 py-2">
                        {gainTZS ? `${gainTZS.toFixed(0)} TZS` : "-"}
                      </td>
                      <td className="border px-3 py-2 space-x-2">
                        <button
                          onClick={() => handleEdit(trade)}
                          className="px-2 py-1 bg-yellow-400 text-white rounded hover:bg-yellow-500 transition"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteTrade(trade.id)}
                          className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* ✅ Charts */}
      <FundedTradeCharts trades={trades} />

      {modalOpen && (
        <FundedTradeModal
          onClose={handleCloseModal}
          onSave={editTrade ? updateTrade : addTrade}
          initialData={editTrade}
        />
      )}
    </div>
  );
}

export default FundedAccount;
