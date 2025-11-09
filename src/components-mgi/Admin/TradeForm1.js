
import React, { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient";

export default function TradeForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState([null, null, null]);
  const [trades, setTrades] = useState([]);
  const [editingId, setEditingId] = useState(null); // track editing trade

  // Fetch trades for the current user
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

  // Submit new trade or update existing one
  const handleSubmit = async (e) => {
    e.preventDefault();

    const session = (await supabase.auth.getSession())?.data?.session;
    if (!session) {
      alert("Please login first!");
      return;
    }

    const userId = session.user.id;
    let uploadedUrls = [];

    try {
      // Upload images
      for (let i = 0; i < images.length; i++) {
        if (images[i]) {
          const filePath = `${userId}/${Date.now()}_${i}.jpg`;

          const { error: uploadError } = await supabase.storage
            .from("trades")
            .upload(filePath, images[i]);

          if (uploadError) {
            console.error("Upload error:", uploadError);
            alert(`Image upload failed: ${uploadError.message}`);
            return;
          }

          const { data: urlData, error: urlError } = supabase.storage
            .from("trades")
            .getPublicUrl(filePath);

          if (urlError) {
            console.error("Get URL error:", urlError);
            alert(`Could not get public URL: ${urlError.message}`);
            return;
          }

          uploadedUrls.push(urlData.publicUrl);
        } else {
          uploadedUrls.push(null);
        }
      }

      if (editingId) {
        // 🔹 Update existing trade
        const { error: updateError } = await supabase
          .from("trades")
          .update({
            title,
            description,
            image1: uploadedUrls[0],
            image2: uploadedUrls[1],
            image3: uploadedUrls[2],
          })
          .eq("id", editingId);

        if (updateError) {
          console.error("Update error:", updateError);
          alert(`Update failed: ${updateError.message}`);
          return;
        }

        alert("Trade updated successfully!");
        setEditingId(null);
      } else {
        // 🔹 Insert new trade
        const { error: insertError } = await supabase.from("trades").insert([
          {
            user_id: userId,
            title,
            description,
            image1: uploadedUrls[0],
            image2: uploadedUrls[1],
            image3: uploadedUrls[2],
          },
        ]);

        if (insertError) {
          console.error("Insert error:", insertError);
          alert(`Insert failed: ${insertError.message}`);
          return;
        }

        alert("Trade saved successfully!");
      }

      // Reset form
      setTitle("");
      setDescription("");
      setImages([null, null, null]);
      fetchTrades();
    } catch (err) {
      console.error("Unexpected error:", err);
      alert(`Unexpected error: ${err.message}`);
    }
  };

  // Delete trade
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this trade?")) return;

    const { error } = await supabase.from("trades").delete().eq("id", id);
    if (error) {
      console.error("Delete error:", error);
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
    setDescription(trade.description);
    setImages([null, null, null]); // keep images empty unless re-uploaded
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
          placeholder="Title"
          className="border p-2 rounded"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="Description"
          className="border p-2 rounded"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        {[0, 1, 2].map((i) => (
          <input
            key={i}
            type="file"
            accept="image/*"
            onChange={(e) => handleFileChange(i, e.target.files[0])}
          />
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
            onClick={() => {
              setEditingId(null);
              setTitle("");
              setDescription("");
              setImages([null, null, null]);
            }}
            className="bg-gray-500 text-white py-2 rounded hover:bg-gray-600"
          >
            Cancel Edit
          </button>
        )}
      </form>

      {/* List of Trades */}
      <h2 className="text-xl font-bold mb-4 text-center">Your Trades</h2>
      {trades.length === 0 ? (
        <p className="text-center text-gray-500">No trades yet.</p>
      ) : (
        <div className="flex flex-col gap-4">
          {trades.map((trade) => (
            <div key={trade.id} className="border p-3 rounded shadow-sm">
              <h3 className="font-bold text-lg mb-1">{trade.title}</h3>
              <p className="mb-2">{trade.description}</p>
              <div className="flex gap-2">
                {[trade.image1, trade.image2, trade.image3].map(
                  (img, idx) =>
                    img && (
                      <img
                        key={idx}
                        src={img}
                        alt={`Trade ${trade.title} ${idx}`}
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
