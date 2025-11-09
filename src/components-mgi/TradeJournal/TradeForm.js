// TradeForm.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import ImageUploadField from "./ImageUploadField";
import { supabase } from "../../supabaseClient";

const TradeForm = ({
  form,
  onChange,
  onSaveComplete, // callback to parent to refresh list/reset form
  onImageChange,
  editIndex,
}) => {
  const [uploading, setUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  if (!form) {
    return (
      <motion.div className="flex flex-col items-center justify-center py-24" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <div className="relative w-16 h-16 mb-6">
          <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }} className="absolute inset-0 border-4 border-emerald-400 border-t-transparent rounded-full"></motion.div>
          <motion.div animate={{ scale: [1, 1.4, 1] }} transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }} className="absolute inset-4 bg-emerald-500 rounded-full blur-sm"></motion.div>
        </div>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="text-gray-600 dark:text-gray-300 text-lg font-medium">Loading trade data...</motion.p>
      </motion.div>
    );
  }

  // Upload a single image to Supabase Storage and return public URL (or null)
  const uploadImage = async (fileOrUrl) => {
    // if already a URL (string), just return it
    if (!fileOrUrl) return null;
    if (typeof fileOrUrl === "string") return fileOrUrl;

    // expect a File / Blob
    const file = fileOrUrl;
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`;
    const bucket = "trade-images";

    // upload
    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(fileName, file, {
        cacheControl: "3600",
        upsert: false,
        contentType: file.type || "application/octet-stream",
      });

    if (uploadError) {
      throw new Error(`Image upload failed: ${uploadError.message}`);
    }

    // get public URL
    const { data: publicUrlData, error: publicUrlError } = supabase.storage
      .from(bucket)
      .getPublicUrl(fileName);

    if (publicUrlError) {
      // In most setups getPublicUrl does not return an error; still handle just in case.
      throw new Error(`Failed to get public URL: ${publicUrlError.message}`);
    }

    // publicUrlData has shape { publicUrl: "https://..." } in supabase-js v2
    return publicUrlData?.publicUrl || null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    setErrorMessage("");

    try {
      // fields to check for images (keep in sync with form fields)
      const imageFields = [
        "traderIdeaMorning",
        "traderIdeaEvening",
        "traderIdeaNoon",
        "setupImage",
        "entryImage",
        "profitImage",
      ];

      // upload all images in parallel where needed
      const uploadPromises = imageFields.map(async (field) => {
        const value = form[field];
        // only upload if value is a File/Blob; if it's a string assume it's already URL
        if (value && typeof value !== "string") {
          const url = await uploadImage(value);
          return { field, url };
        }
        return { field, url: value || null };
      });

      const uploadResults = await Promise.all(uploadPromises);
      const uploadedImages = uploadResults.reduce((acc, cur) => ({ ...acc, [cur.field]: cur.url }), {});

      // build trade data using your DB column names
      const tradeData = {
        pair: form.pair,
        type: form.type,
        date: form.date,
        time: form.time,
        session: form.session || null,
        trader_idea_morning: uploadedImages.traderIdeaMorning,
        trader_idea_evening: uploadedImages.traderIdeaEvening,
        trader_idea_noon: uploadedImages.traderIdeaNoon,
        setup_image: uploadedImages.setupImage,
        entry_image: uploadedImages.entryImage,
        profit_image: uploadedImages.profitImage,
        notes: form.notes || null,
        updated_at: new Date().toISOString(),
      };

      if (editIndex !== null && form.id) {
        const { error: updateError } = await supabase
          .from("trades")
          .update(tradeData)
          .eq("id", form.id);

        if (updateError) throw new Error(`Failed to update trade: ${updateError.message}`);
        // success
        alert("✅ Trade updated successfully!");
      } else {
        // for new rows include created_at
        const { error: insertError } = await supabase
          .from("trades")
          .insert([{ ...tradeData, created_at: new Date().toISOString() }]);

        if (insertError) throw new Error(`Failed to save trade: ${insertError.message}`);
        alert("✅ Trade saved successfully!");
      }

      if (onSaveComplete) onSaveComplete(); // tells parent to refresh & reset form
    } catch (err) {
      console.error("Error saving trade:", err);
      setErrorMessage(err?.message || "Something went wrong while saving the trade.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6 bg-white dark:bg-gray-900 shadow-xl rounded-2xl p-8 max-w-3xl mx-auto border border-gray-100 dark:border-gray-700"
    >
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white text-center">
        {editIndex !== null ? "Edit Trade" : "New Trade Entry"}
      </h2>

      <div>
        <label className="block text-gray-700 dark:text-gray-300 mb-2 font-medium">Currency Pair</label>
        <input
          name="pair"
          placeholder="e.g. EUR/USD"
          value={form.pair}
          onChange={onChange}
          required
          className="w-full p-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
        />
      </div>

      <div className="grid sm:grid-cols-2 gap-6">
        <div>
          <label className="block text-gray-700 dark:text-gray-300 mb-2 font-medium">Buy or Sell</label>
          <select name="type" value={form.type} onChange={onChange} className="w-full p-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition">
            <option value="Buy">Buy</option>
            <option value="Sell">Sell</option>
          </select>
        </div>

        <div>
          <label className="block text-gray-700 dark:text-gray-300 mb-2 font-medium">Date of Trade</label>
          <input type="date" name="date" value={form.date} onChange={onChange} required className="w-full p-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition" />
        </div>
      </div>

      <div>
        <label className="block text-gray-700 dark:text-gray-300 mb-2 font-medium">Time of Trade</label>
        <input type="time" name="time" value={form.time} onChange={onChange} className="w-full p-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition" />
        {form.session && <p className="text-sm text-emerald-600 dark:text-emerald-400 mt-1">Session: <strong>{form.session}</strong></p>}
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">Upload Trade Documentation</h3>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          <ImageUploadField label="(1) External Trader Idea (Optional)" tooltip="Another trader’s idea used for influence or bias validation" value={form.traderIdeaMorning} onChange={(e) => onImageChange(e, "traderIdeaMorning")} description="Optional external idea" />
          <ImageUploadField label="(2) Daily Chart - Daily Candle Price Action" tooltip="Daily narrative context using macro ICT model" value={form.traderIdeaEvening} onChange={(e) => onImageChange(e, "traderIdeaEvening")} description="Higher timeframe narrative" />
          <ImageUploadField label="(3) MGI Strategy (1H Chart - Unbroken NYC Levels + ICT Concept)" tooltip="NY Session expectation based on unbroken liquidity levels & ICT Kill Zone" value={form.traderIdeaNoon} onChange={(e) => onImageChange(e, "traderIdeaNoon")} description="NY Session directional thesis" />
          <ImageUploadField label="(4) Trading Setup (2H Chart - DHDL Movement + ICT Killzone)" tooltip="Show Higher Timeframe Bias • DHDL Structure • ICT Kill Zone" value={form.setupImage} onChange={(e) => onImageChange(e, "setupImage")} description="2H Bias + DHDL movement + Kill Zone" />
          <ImageUploadField label="(5) Entry Execution (15m Chart Entry - ICT concept + ICT killzone)" tooltip="Liquidity Grab → Displacement → Entry inside Kill Zone using FVG/OB" value={form.entryImage} onChange={(e) => onImageChange(e, "entryImage")} description="15m entry using FVG, OB or BB" />
          <ImageUploadField label="(6) Profit Result (1H Chart - DHDL Movement + ICT Killzone)" tooltip="Show how price reached target objective using DHDL draw & Kill Zone timing" value={form.profitImage} onChange={(e) => onImageChange(e, "profitImage")} description="1H draw objective achieved" />
        </div>
      </div>

      {errorMessage && <p className="text-red-500 text-sm font-medium text-center mt-2">⚠️ {errorMessage}</p>}

      <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} type="submit" disabled={uploading} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl font-semibold shadow-lg transition">
        {uploading ? "Saving..." : editIndex !== null ? "Update Trade" : "Save Trade"}
      </motion.button>
    </motion.form>
  );
};

export default TradeForm;
