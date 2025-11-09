import React, { useState } from "react";
import JournalChecklist from "./JournalChecklist";
import TradeLightbox from "./TradeLightbox";

// ✅ Format date helper
const formatDate = (dateStr) => {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const JournalEntryCard = ({ entry, index, onEdit, onDelete, onArchive }) => {
  const checklistKey = `checklist-${entry.id || index}`;
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const allImages = [
    entry.trader_idea_morning && {
      src: entry.trader_idea_morning,
      label: "(1) External Trader Idea",
      description: "Optional external influence / bias validation.",
    },
    entry.trader_idea_evening && {
      src: entry.trader_idea_evening,
      label: "(2) Daily Candle Narrative",
      description: "Higher timeframe narrative context.",
    },
    entry.trader_idea_noon && {
      src: entry.trader_idea_noon,
      label: "(3) MGI Strategy - NYC Thesis",
      description: "NY session directional expectation.",
    },
    entry.setup_image && {
      src: entry.setup_image,
      label: "(4) Setup (DHDL + Killzone)",
      description: "HTF structure aligned with session killzone.",
    },
    entry.entry_image && {
      src: entry.entry_image,
      label: "(5) Execution",
      description: "Displacement → refined entry trigger.",
    },
    entry.profit_image && {
      src: entry.profit_image,
      label: "(6) Draw Objective Result",
      description: "Price delivery to target objective.",
    },
  ].filter(Boolean);

  return (
    <div className="border p-5 rounded-xl mb-6 bg-white dark:bg-gray-900 shadow-md">
      {/* Trade Info */}
      <div className="grid sm:grid-cols-2 gap-4 mb-4">
        <p><strong>Pair:</strong> {entry.pair}</p>
        <p><strong>Type:</strong> {entry.type}</p>
        <p><strong>Date:</strong> {formatDate(entry.date)}</p>
        <p><strong>Time:</strong> {entry.time}</p>
        <p>
          <strong>Session:</strong>{" "}
          <span className="text-indigo-700 font-medium">{entry.session}</span>
        </p>
      </div>

      {/* ✅ Image Gallery */}
      {allImages.length > 0 && (
        <>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
            Trade Documentation
          </h3>
          <div className="flex overflow-x-auto space-x-4 pb-2">
            {allImages.map((img, i) => (
              <ImageCard
                key={i}
                label={img.label}
                description={img.description}
                src={img.src}
                onClick={() => {
                  setLightboxIndex(i);
                  setLightboxOpen(true);
                }}
              />
            ))}
          </div>
        </>
      )}

      {/* ✅ Psychology Checklist */}
      <JournalChecklist checklistKey={checklistKey} />

      {/* ✅ Buttons */}
      <div className="mt-6 flex flex-wrap gap-3">
        {/* <button
          onClick={() => onEdit(entry, index)}
          className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600"
        >
          Edit
        </button> */}
        <button
          onClick={() => onDelete(index)}
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
        >
          Delete
        </button>
        {/* <button
          onClick={() => onArchive(index)}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Archive
        </button> */}
      </div>

      {/* ✅ Lightbox */}
      <TradeLightbox
        isOpen={lightboxOpen}
        slides={allImages}
        index={lightboxIndex}
        onClose={() => setLightboxOpen(false)}
      />
    </div>
  );
};

// Small Image Card
const ImageCard = ({ label, description, src, onClick }) => (
  <div className="min-w-[200px] max-w-xs flex-shrink-0 cursor-pointer" onClick={onClick}>
    <p className="text-sm font-semibold text-gray-800 dark:text-white mb-1">{label}</p>
    <img src={src} alt={label} className="w-full h-40 object-cover rounded-md border" />
    {description && <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{description}</p>}
  </div>
);

export default JournalEntryCard;
