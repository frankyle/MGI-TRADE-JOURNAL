// Archive.js
import React, { useEffect, useRef, useState } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

/* -----------------------
   Checklist data
   ----------------------- */
const nySessionChecklist = [
  {
    step: "Step 1: Previous Day NewYork inside Fib Discount Zone (Mandatory)",
    checks: [
      "Previous Day NewYork low inside Fib Discount Zone (50% – 100%) → Buy setup",
      "Previous Day NewYork high inside Fib Premium Zone (50% – 100%) → Sell setup",
    ],
    mandatory: true,
  },
  {
    step: "Step 2: Asian Accumulation (Mandatory)",
    checks: ["Asian Session created liquidity"],
    mandatory: true,
  },
  {
    step: "Step 3: Liquidity Reference (PDL / PDH / PWL / PWH) (Mandatory - pick 1 or 2)",
    checks: [
      "Previous Day Low (PDL)",
      "Previous Day High (PDH)",
      "Previous Week Low (PWL)",
      "Previous Week High (PWH)",
    ],
    mandatory: true,
  },
  {
    step: "Step 4: Manipulation (Mandatory)",
    checks: [
      "Liquidity grab by LONDON",
      "Liquidity grab by LONDON & NEWYORK (possible swing point)",
    ],
    mandatory: true,
  },
  {
    step: "Step 5: Order Block / FVG (Optional - 1 or both)",
    checks: ["OB Formed in 15min", "FVG Formed (5min)"],
    mandatory: false,
  },
  {
    step: "Step 6: Breaker Block (Mandatory)",
    checks: ["Breaker Block (Green for Buys / Red for Sells in 15min)"],
    mandatory: true,
  },
  {
    step: "Step 7: NewYork Continuation / Distribution (Mandatory)",
    checks: ["NY Continuation / Distribution"],
    mandatory: true,
  },
  {
    step: "Step 8: Daily Open (Optional)",
    checks: ["Daily Open"],
    mandatory: false,
  },
  {
    step: "Step 9: Weekly Open (Optional)",
    checks: ["Weekly Open"],
    mandatory: false,
  },
  {
    step: "Step 10: Monthly Open (Optional)",
    checks: ["Monthly Open"],
    mandatory: false,
  },
];

const emotionalChecklist = {
  before: {
    good: [
      "I followed my trading plan",
      "I defined entry, stop loss, and take profit before entry",
      "I’m calm and patient waiting for setup",
      "I accepted possible loss before placing trade",
    ],
    bad: [
      "I’m entering because of FOMO",
      "I’m increasing my lot size without reason",
      "I’m revenge trading after a loss",
      "I don’t have a clear setup",
    ],
  },
  during: {
    good: [
      "I’m sticking to my stop loss and take profit",
      "I’m not staring at charts anxiously",
      "I’m calm whether trade is in profit or loss",
      "I’m following my plan without emotions",
    ],
    bad: [
      "I’m moving stop loss further away",
      "I’m closing trade early due to fear/greed",
      "I’m adding positions impulsively",
      "I feel panic or over-excitement",
    ],
  },
  after: {
    good: [
      "I accepted the outcome without emotions",
      "I reviewed if I followed my rules",
      "I’m learning from the result (win or loss)",
      "I’m not rushing to open another trade immediately",
    ],
    bad: [
      "I’m blaming the market or broker",
      "I’m revenge trading right after",
      "I’m over-celebrating a win or over-mourning a loss",
      "I ignore reviewing my execution",
    ],
  },
};

/* -----------------------
   Utility: format date
   ----------------------- */
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

/* -----------------------
   Archive component
   ----------------------- */
export default function Archive() {
  const [entries, setEntries] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [exporting, setExporting] = useState(false);
  const archiveRef = useRef(null);

  useEffect(() => {
    loadAllEntries();
    // eslint-disable-next-line
  }, []);

  const loadAllEntries = () => {
    const raw = JSON.parse(localStorage.getItem("archivedJournalEntries")) || [];
    const enriched = raw.map((entry) => {
      const checklist = JSON.parse(
        localStorage.getItem(`checklist_entry_${entry.id}`)
      );
      const emotional = JSON.parse(
        localStorage.getItem(`emotionalJournal_${entry.pair}`)
      );
      return { ...entry, checklist: checklist || null, emotional: emotional || [] };
    });
    setEntries(enriched);
  };

  const handleClearAll = () => {
    if (!window.confirm("Are you sure? This will delete ALL archived entries and checklist data.")) return;
    localStorage.removeItem("archivedJournalEntries");
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (key.startsWith("checklist_entry_") || key.startsWith("emotionalJournal_"))) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach((k) => localStorage.removeItem(k));
    setEntries([]);
  };

  const handleDeleteEntry = (index) => {
    const copy = [...entries];
    const removed = copy.splice(index, 1)[0];
    setEntries(copy);
    const originalRaw = JSON.parse(localStorage.getItem("archivedJournalEntries")) || [];
    const updatedRaw = originalRaw.filter((e) => e.id !== removed.id);
    localStorage.setItem("archivedJournalEntries", JSON.stringify(updatedRaw));
    localStorage.removeItem(`checklist_entry_${removed.id}`);
    localStorage.removeItem(`emotionalJournal_${removed.pair}`);
  };

  const exportElementToPdf = async (element, filename = "export.pdf") => {
    if (!element) return;
    setExporting(true);
    try {
      const canvas = await html2canvas(element, { scale: 2 });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const imgProps = pdf.getImageProperties(imgData);
      const imgHeight = (imgProps.height * pageWidth) / imgProps.width;
      let heightLeft = imgHeight;
      let position = 0;
      pdf.addImage(imgData, "PNG", 0, position, pageWidth, imgHeight);
      heightLeft -= pageHeight;
      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, pageWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      pdf.save(filename);
    } catch (err) {
      console.error("Export error:", err);
      alert("Failed to export PDF. See console for details.");
    } finally {
      setExporting(false);
    }
  };

  const handleDownloadAllPDF = () => {
    if (!archiveRef.current) return;
    exportElementToPdf(archiveRef.current, "Archived_Journal_All.pdf");
  };

  const handleDownloadEntryPDF = (entryIndex) => {
    const node = document.getElementById(`archive-entry-${entryIndex}`);
    if (!node) return;
    exportElementToPdf(node, `Archived_Journal_${entryIndex + 1}.pdf`);
  };

  const isCheckedIn = (checkKey, checklistObj) => {
    if (!checklistObj || !checklistObj.checked) return false;
    return !!checklistObj.checked[checkKey];
  };

  const renderDecisionBadge = (finalDecision) => {
    if (!finalDecision) return <span className="text-sm text-gray-600">No evaluation</span>;
    if (finalDecision.includes("BUY"))
      return <span className="inline-block px-3 py-1 rounded-full bg-green-100 text-green-800 font-semibold">{finalDecision}</span>;
    if (finalDecision.includes("SELL"))
      return <span className="inline-block px-3 py-1 rounded-full bg-red-100 text-red-800 font-semibold">{finalDecision}</span>;
    if (finalDecision.includes("Not all"))
      return <span className="inline-block px-3 py-1 rounded-full bg-yellow-100 text-yellow-800 font-semibold">{finalDecision}</span>;
    return <span className="inline-block px-3 py-1 rounded-full bg-blue-50 text-blue-800 font-semibold">{finalDecision}</span>;
  };

  const renderEmotionalScore = (score) => {
    if (score === null || score === undefined) return <span className="text-sm text-gray-600">No score</span>;
    if (score > 0)
      return <span className="inline-block px-3 py-1 rounded-full bg-green-100 text-green-800 font-semibold">🟢 Emotionally Stable (Score: {score})</span>;
    if (score < 0)
      return <span className="inline-block px-3 py-1 rounded-full bg-red-100 text-red-800 font-semibold">🔴 Emotionally Unstable (Score: {score})</span>;
    return <span className="inline-block px-3 py-1 rounded-full bg-yellow-100 text-yellow-800 font-semibold">⚖️ Neutral (Score: {score})</span>;
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-800">📦 Archived Journal Entries</h1>
        <div className="flex items-center gap-3">
          {entries.length > 0 && (
            <>
              <button
                onClick={handleDownloadAllPDF}
                disabled={exporting}
                className="px-4 py-2 bg-blue-700 text-white rounded-xl shadow hover:bg-blue-800 disabled:opacity-60"
              >
                {exporting ? "Exporting..." : "Download All (PDF)"}
              </button>
              <button
                onClick={handleClearAll}
                className="px-4 py-2 bg-red-700 text-white rounded-xl shadow hover:bg-red-800"
              >
                Clear All Archives
              </button>
            </>
          )}
        </div>
      </div>

      {/* Archive list */}
      <div ref={archiveRef} className="space-y-8">
        {entries.length === 0 ? (
          <p className="text-gray-600 text-center italic">
            No archived entries yet. Do trades and save checklists to populate this view.
          </p>
        ) : (
          entries.map((entry, idx) => (
            <article
              id={`archive-entry-${idx}`}
              key={entry.id || idx}
              className="p-6 rounded-2xl shadow-lg bg-white border border-gray-200"
            >
              {/* header */}
              <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {entry.pair} — {entry.type || "Trade"}
                  </h2>
                  <p className="text-sm text-gray-500">
                    {formatDate(entry.date)} • {entry.time} • {entry.session}
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                  <div>{renderDecisionBadge(entry.checklist?.finalDecision)}</div>
                  <div>{renderEmotionalScore(entry.checklist?.emotionalScore)}</div>
                </div>
              </header>

              {/* images */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                {["setupImage", "entryImage", "profitImage"].map((imgKey, i) =>
                  entry[imgKey] ? (
                    <img
                      key={i}
                      src={entry[imgKey]}
                      alt={imgKey}
                      onClick={() => setSelectedImage(entry[imgKey])}
                      className="w-full h-48 object-cover rounded-lg shadow cursor-pointer hover:opacity-95"
                    />
                  ) : (
                    <div
                      key={i}
                      className="w-full h-48 rounded-lg shadow bg-gray-50 flex items-center justify-center text-gray-400"
                    >
                      No {imgKey.replace("Image", "")} Image
                    </div>
                  )
                )}
              </div>

              {/* side-by-side checklists */}
              <div className="grid md:grid-cols-2 gap-8 mb-8">
                {/* Trading Plan Checklist */}
                <section>
                  <h3 className="text-2xl font-semibold text-blue-700 mb-4 text-center">📋 Trading Plan Checklist</h3>
                  <div className="space-y-4">
                    {nySessionChecklist.map((step, sidx) => {
                      const isMandatory = step.mandatory;
                      return (
                        <div
                          key={sidx}
                          className={`p-4 rounded-lg border ${
                            isMandatory ? "border-blue-300 bg-blue-50" : "border-gray-200 bg-gray-50"
                          }`}
                        >
                          <h4 className="font-semibold text-gray-800 mb-2 flex justify-between items-center">
                            <span>{step.step}</span>
                            <span className="text-sm text-gray-600">{isMandatory ? "Mandatory" : "Optional"}</span>
                          </h4>
                          <ul className="list-disc ml-6 text-sm text-gray-700 space-y-1">
                            {step.checks
                              .filter((chk) => isCheckedIn(chk, entry.checklist))
                              .map((chk, cidx) => (
                                <li key={cidx} className="flex items-center gap-3">
                                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold bg-green-600 text-white">
                                    ✓
                                  </span>
                                  <span className="font-medium">{chk}</span>
                                </li>
                              ))}
                          </ul>
                        </div>
                      );
                    })}
                  </div>
                </section>

                {/* Emotional Intelligence Checklist */}
                <section>
                  <h3 className="text-2xl font-semibold text-blue-700 mb-4 text-center">🧠 Emotional Intelligence Checklist</h3>
                  <div className="grid gap-6">
                    {Object.entries(emotionalChecklist).map(([phase, lists]) => {
                      const goodChecked = lists.good.filter((g) => isCheckedIn(g, entry.checklist));
                      const badChecked = lists.bad.filter((b) => isCheckedIn(b, entry.checklist));
                      if (goodChecked.length === 0 && badChecked.length === 0) return null;
                      return (
                        <div key={phase} className="bg-gray-50 border border-gray-200 rounded-xl p-6 shadow-sm">
                          <h4 className="text-lg font-bold text-gray-800 mb-3 capitalize">{phase}</h4>
                          {goodChecked.length > 0 && (
                            <div className="mb-3">
                              <p className="font-semibold text-green-700 mb-2">✅ Good</p>
                              <ul className="list-disc ml-6 text-sm text-gray-700 space-y-1">
                                {goodChecked.map((g, gi) => (
                                  <li key={gi} className="font-medium">✅ {g}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                          {badChecked.length > 0 && (
                            <div>
                              <p className="font-semibold text-red-600 mb-2">❌ Bad</p>
                              <ul className="list-disc ml-6 text-sm text-gray-700 space-y-1">
                                {badChecked.map((b, bi) => (
                                  <li key={bi} className="font-medium">✅ {b}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </section>
              </div>

              {/* Emotional journal items if stored separately */}
              {entry.emotional && entry.emotional.length > 0 && (
                <section className="mt-6">
                  <h4 className="text-lg font-semibold mb-3">📝 Emotional Journal (saved)</h4>
                  <div className="space-y-3">
                    {entry.emotional.map((emo, ei) => (
                      <div key={ei} className="p-3 bg-white border rounded-lg">
                        <p className="text-sm"><strong>Before:</strong> {emo.before?.join(", ")}</p>
                        <p className="text-sm"><strong>During:</strong> {emo.during?.join(", ")}</p>
                        <p className="text-sm"><strong>After:</strong> {emo.after?.join(", ")}</p>
                        <p className="text-sm"><strong>Outcome:</strong> {emo.outcome}</p>
                        <p className="text-sm font-semibold"><strong>EI Score:</strong> {emo.score}%</p>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* footer controls */}
              <footer className="flex flex-col sm:flex-row justify-end gap-3 mt-6">
                <button
                  onClick={() => handleDownloadEntryPDF(idx)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700"
                >
                  Export Entry to PDF
                </button>
                <button
                  onClick={() => handleDeleteEntry(idx)}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg shadow hover:bg-red-700"
                >
                  Delete Entry
                </button>
              </footer>
            </article>
          ))
        )}
      </div>

      {/* Modal for enlarged image */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
          onClick={() => setSelectedImage(null)}
        >
          <img src={selectedImage} alt="enlarged" className="max-h-[90vh] max-w-[90vw] rounded-lg shadow-lg" />
        </div>
      )}
    </div>
  );
}
