import React, { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient";

export default function TradeForm() {
  const [title, setTitle] = useState("");
  const [signal, setSignal] = useState("BUY");
  const [tradeDate, setTradeDate] = useState("");
  const [dlDhTime, setDlDhTime] = useState("");
  const [images, setImages] = useState([null, null, null]); // new files
  const [existingImages, setExistingImages] = useState([null, null, null]); // existing URLs
  const [trades, setTrades] = useState([]);
  const [editingId, setEditingId] = useState(null);

  // Fetch user trades
  const fetchTrades = async () => {
    const session = (await supabase.auth.getSession())?.data?.session;
    if (!session) return;

    const userId = session.user.id;
    const { data, error } = await supabase
      .from("trades")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) console.error(error);
    else setTrades(data);
  };

  useEffect(() => {
    fetchTrades();
  }, []);

  const handleFileChange = (index, file) => {
    const newImages = [...images];
    newImages[index] = file;
    setImages(newImages);
  };

  // Save or update trade
  const handleSubmit = async (e) => {
    e.preventDefault();

    const session = (await supabase.auth.getSession())?.data?.session;
    if (!session) {
      alert("Please login first!");
      return;
    }

    const userId = session.user.id;
    let finalImageUrls = [...existingImages]; // Start with old images

    try {
      // Upload only the new images
      for (let i = 0; i < images.length; i++) {
        if (images[i]) {
          const filePath = `${userId}/${Date.now()}_${i}.jpg`;

          const { error: uploadError } = await supabase.storage
            .from("trades")
            .upload(filePath, images[i], { upsert: true });

          if (uploadError) {
            alert(`Image upload failed: ${uploadError.message}`);
            return;
          }

          const { data: urlData } = supabase.storage
            .from("trades")
            .getPublicUrl(filePath);

          finalImageUrls[i] = urlData.publicUrl; // Replace with new one
        }
      }

      if (editingId) {
        // Update trade
        const { error: updateError } = await supabase
          .from("trades")
          .update({
            title,
            signal,
            trade_date: tradeDate,
            dl_dh_time: dlDhTime,
            image1: finalImageUrls[0],
            image2: finalImageUrls[1],
            image3: finalImageUrls[2],
          })
          .eq("id", editingId);

        if (updateError) {
          alert(`Update failed: ${updateError.message}`);
          return;
        }

        alert("Trade updated successfully!");
      } else {
        // Insert new trade
        const { error: insertError } = await supabase.from("trades").insert([
          {
            user_id: userId,
            title,
            signal,
            trade_date: tradeDate,
            dl_dh_time: dlDhTime,
            image1: finalImageUrls[0],
            image2: finalImageUrls[1],
            image3: finalImageUrls[2],
          },
        ]);

        if (insertError) {
          alert(`Insert failed: ${insertError.message}`);
          return;
        }

        alert("Trade saved successfully!");
      }

      // Reset form
      resetForm();
      fetchTrades();
    } catch (err) {
      console.error("Unexpected error:", err);
      alert(`Unexpected error: ${err.message}`);
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setTitle("");
    setSignal("BUY");
    setTradeDate("");
    setDlDhTime("");
    setImages([null, null, null]);
    setExistingImages([null, null, null]);
  };

  // Delete trade
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this trade?")) return;

    const { error } = await supabase.from("trades").delete().eq("id", id);
    if (error) {
      alert(`Delete failed: ${error.message}`);
    } else {
      alert("Trade deleted successfully!");
      fetchTrades();
    }
  };

  // Load trade data into form for editing
  const handleEdit = (trade) => {
    setEditingId(trade.id);
    setTitle(trade.title);
    setSignal(trade.signal);
    setTradeDate(trade.trade_date);
    setDlDhTime(trade.dl_dh_time);
    setExistingImages([trade.image1, trade.image2, trade.image3]);
    setImages([null, null, null]);
  };

  return (
    <div className="max-w-2xl mx-auto bg-white shadow-md rounded-lg p-6 mt-8">
      {/* Trade Form */}
      <h2 className="text-xl font-bold mb-4 text-center">
        {editingId ? "Edit Trade" : "Add Trade"}
      </h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3 mb-6">
        <input
          type="text"
          placeholder="Currency"
          className="border p-2 rounded"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <select
          className="border p-2 rounded"
          value={signal}
          onChange={(e) => setSignal(e.target.value)}
          required
        >
          <option value="BUY">BUY</option>
          <option value="SELL">SELL</option>
        </select>

        <input
          type="date"
          className="border p-2 rounded"
          value={tradeDate}
          onChange={(e) => setTradeDate(e.target.value)}
          required
        />

        <input
          type="time"
          className="border p-2 rounded"
          value={dlDhTime}
          onChange={(e) => setDlDhTime(e.target.value)}
          required
        />

        {/* File inputs and existing image previews */}
        {[0, 1, 2].map((i) => (
          <div key={i} className="flex flex-col gap-1">
            {existingImages[i] && (
              <img
                src={existingImages[i]}
                alt={`Existing Trade ${i}`}
                className="w-24 h-24 object-cover rounded"
              />
            )}
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleFileChange(i, e.target.files[0])}
            />
          </div>
        ))}

        <button
          type="submit"
          className="bg-green-500 text-white py-2 rounded hover:bg-green-600"
        >
          {editingId ? "Update Trade" : "Save Trade"}
        </button>

        {editingId && (
          <button
            type="button"
            onClick={resetForm}
            className="bg-gray-500 text-white py-2 rounded hover:bg-gray-600"
          >
            Cancel Edit
          </button>
        )}
      </form>

      {/* Trade List */}
      <h2 className="text-xl font-bold mb-4 text-center">Your Trades</h2>
      {trades.length === 0 ? (
        <p className="text-center text-gray-500">No trades yet.</p>
      ) : (
        <div className="flex flex-col gap-4">
          {trades.map((trade) => (
            <div key={trade.id} className="border p-3 rounded shadow-sm">
              <h3 className="font-bold text-lg mb-1">{trade.title}</h3>
              <p>
                <strong>Signal:</strong> {trade.signal}
              </p>
              <p>
                <strong>Date of Trade:</strong> {trade.trade_date}
              </p>
              <p>
                <strong>DL/DH Time:</strong> {trade.dl_dh_time}
              </p>

              <div className="flex gap-2 mt-2">
                {[trade.image1, trade.image2, trade.image3].map(
                  (img, idx) =>
                    img && (
                      <img
                        key={idx}
                        src={img}
                        alt={`Trade ${idx}`}
                        className="w-24 h-24 object-cover rounded"
                      />
                    )
                )}
              </div>

              <p className="text-gray-400 text-sm mt-1">
                {new Date(trade.created_at).toLocaleString()}
              </p>

              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => handleEdit(trade)}
                  className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(trade.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
