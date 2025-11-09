import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { ArrowUpDown } from "lucide-react";
import { supabase } from "../../supabaseClient";

const Journal = () => {
  const [journal, setJournal] = useState([]);
  const [sortOption, setSortOption] = useState("date-desc");

  // ✅ Fetch trades from Supabase
  useEffect(() => {
    const fetchTrades = async () => {
      const { data, error } = await supabase
        .from("trades")
        .select("*")
        .order("date", { ascending: false });

      if (error) {
        console.error("❌ Error loading trades:", error.message);
      } else {
        setJournal(data || []);
      }
    };
    fetchTrades();
  }, []);

  // ✅ Sorting logic
  const sortedJournal = useMemo(() => {
    const entries = [...journal];
    if (sortOption === "pair-asc") return entries.sort((a, b) => a.pair.localeCompare(b.pair));
    if (sortOption === "pair-desc") return entries.sort((a, b) => b.pair.localeCompare(a.pair));
    if (sortOption === "date-asc") return entries.sort((a, b) => new Date(a.date) - new Date(b.date));
    if (sortOption === "date-desc") return entries.sort((a, b) => new Date(b.date) - new Date(a.date));
    return entries;
  }, [journal, sortOption]);

  return (
    <div className="mt-12 max-w-6xl mx-auto px-4 sm:px-8">
      {/* Header with Sort */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 bg-white dark:bg-gray-900 shadow-md rounded-2xl px-6 py-4 border border-gray-100 dark:border-gray-700">
        <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-3 sm:mb-0">
          Trading Journal
        </h3>

        <div className="flex items-center space-x-2">
          <ArrowUpDown className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
          >
            <option value="date-desc">Date (Newest)</option>
            <option value="date-asc">Date (Oldest)</option>
            <option value="pair-asc">Pair (A–Z)</option>
            <option value="pair-desc">Pair (Z–A)</option>
          </select>
        </div>
      </div>

      {/* Journal Entries */}
      {sortedJournal.length === 0 ? (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-gray-500 dark:text-gray-400 text-center py-10"
        >
          No trades recorded yet.
        </motion.p>
      ) : (
        <div className="space-y-8">
          {sortedJournal.map((entry, index) => (
            <motion.div
              key={entry.id || index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-lg overflow-hidden"
            >
              {/* Header */}
              <div className="bg-emerald-600 text-white px-6 py-4 flex justify-between items-center">
                <h4 className="text-xl font-bold">{entry.pair}</h4>
                <span className="text-sm font-medium">
                  {entry.type} • {entry.date}
                </span>
              </div>

              {/* Content */}
              <div className="p-6 grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <p className="text-gray-700 dark:text-gray-300">
                    <strong>Session:</strong> {entry.session || "—"}
                  </p>
                  <p className="text-gray-700 dark:text-gray-300">
                    <strong>Time:</strong> {entry.time || "—"}
                  </p>
                  <p className="text-gray-700 dark:text-gray-300">
                    <strong>Notes:</strong>{" "}
                    {entry.notes ? entry.notes : "No notes added."}
                  </p>
                </div>

                {/* Image Section */}
                <div className="grid sm:grid-cols-2 gap-3">
                  {[
                    ["Trader Idea (Morning)", entry.trader_idea_morning],
                    ["Trader Idea (Noon)", entry.trader_idea_noon],
                    ["Trader Idea (Evening)", entry.trader_idea_evening],
                    ["Setup", entry.setup_image],
                    ["Entry", entry.entry_image],
                    ["Profit", entry.profit_image],
                  ]
                    .filter(([, url]) => !!url)
                    .map(([label, url], i) => (
                      <div key={i} className="flex flex-col items-center">
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                          {label}
                        </p>
                        <img
                          src={url}
                          alt={label}
                          className="rounded-lg border border-gray-300 dark:border-gray-700 w-full h-40 object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Journal;
