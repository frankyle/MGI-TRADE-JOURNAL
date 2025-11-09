// TradePage.jsx
import React, { useState } from "react";
import TradeForm from "./TradeForm";
import JournalEntryList from "./journal/JournalEntryList";

const TradePage = () => {
  const initialForm = {
    id: null,
    pair: "",
    type: "Buy",
    date: "",
    time: "",
    session: "",
    setupImage: "",
    entryImage: "",
    profitImage: "",
    traderIdeaMorning: "",
    traderIdeaNoon: "",
    traderIdeaEvening: "",
    notes: "",
  };

  const [form, setForm] = useState(initialForm);
  const [editIndex, setEditIndex] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0); // increment to trigger JournalEntryList refetch

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleImageChange = (e, field) => {
    const file = e.target.files ? e.target.files[0] : null;
    setForm((prev) => ({ ...prev, [field]: file }));
  };

  const handleSaveComplete = () => {
    // reset form and trigger journal refresh
    setEditIndex(null);
    setForm(initialForm);
    setRefreshKey((k) => k + 1);
  };

  const handleEdit = (entry) => {
    setForm({
      id: entry.id,
      pair: entry.pair,
      type: entry.type,
      date: entry.date,
      time: entry.time,
      session: entry.session,
      setupImage: entry.setup_image,
      entryImage: entry.entry_image,
      profitImage: entry.profit_image,
      traderIdeaMorning: entry.trader_idea_morning,
      traderIdeaNoon: entry.trader_idea_noon,
      traderIdeaEvening: entry.trader_idea_evening,
      notes: entry.notes || "",
    });
    setEditIndex(entry.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="space-y-12 py-8 px-4 sm:px-8 max-w-6xl mx-auto">
      <TradeForm form={form} onChange={handleChange} onImageChange={handleImageChange} onSaveComplete={handleSaveComplete} editIndex={editIndex} />
      <JournalEntryList key={refreshKey} onEdit={handleEdit} />
    </div>
  );
};

export default TradePage;
