import React, { useState, useEffect } from "react";

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
    checks: ["Breaker Block (Green for Buys / Red for Sells in 15min/5min)"],
    mandatory: true,
  },
  {
    step: "Step 7: NewYork Continuation / Distribution (Mandatory)",
    checks: ["NY Continuation / Distribution"],
    mandatory: false,
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

const JournalChecklist = ({ entryId }) => {
  const [checked, setChecked] = useState({});
  const [finalDecision, setFinalDecision] = useState(null);
  const [emotionalScore, setEmotionalScore] = useState(null);
  const [showChecklist, setShowChecklist] = useState(false);

  // Load saved checklist
  useEffect(() => {
    const savedData = localStorage.getItem(`checklist_entry_${entryId}`);
    if (savedData) {
      const parsed = JSON.parse(savedData);
      setChecked(parsed.checked || {});
      setFinalDecision(parsed.finalDecision || null);
      setEmotionalScore(parsed.emotionalScore || null);
    }
  }, [entryId]);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem(
      `checklist_entry_${entryId}`,
      JSON.stringify({ checked, finalDecision, emotionalScore })
    );
  }, [checked, finalDecision, emotionalScore, entryId]);

  const handleCheck = (item) => {
    setChecked((prev) => ({
      ...prev,
      [item]: !prev[item],
    }));
  };

  // ✅ Evaluate trade logic
  const evaluateDecision = () => {
    // 1. Ensure Steps 1–7 are all completed
    const mandatorySteps = nySessionChecklist.filter((s) => s.mandatory && parseInt(s.step.split(" ")[1]) <= 7);

    const allMandatoryCompleted = mandatorySteps.every((step) =>
      step.checks.some((c) => checked[c])
    );

    if (!allMandatoryCompleted) {
      setFinalDecision("❌ Not all mandatory steps completed (1–6 required).");
      return;
    }

    // 2. Determine direction from Step 1
    const buySelected = checked["Previous Day NewYork low inside Fib Discount Zone (50% – 100%) → Buy setup"];
    const sellSelected = checked["Previous Day NewYork high inside Fib Premium Zone (50% – 100%) → Sell setup"];

    if (buySelected && !sellSelected) {
      // 3. Risk logic
      let risk = 1;
      if (checked["Daily Open"]) risk = 2;
      if (checked["Weekly Open"] || checked["Monthly Open"]) risk = 3;

      setFinalDecision(`✅ Enter BUY with ${risk}% risk`);
    } else if (sellSelected && !buySelected) {
      let risk = 1;
      if (checked["Daily Open"]) risk = 2;
      if (checked["Weekly Open"] || checked["Monthly Open"]) risk = 3;

      setFinalDecision(`✅ Enter SELL with ${risk}% risk`);
    } else {
      setFinalDecision("⚖️ No clear direction from Step 1");
    }
  };

  const evaluateEmotions = () => {
    let good = 0,
      bad = 0;
    Object.values(emotionalChecklist).forEach((phase) => {
      phase.good.forEach((g) => {
        if (checked[g]) good++;
      });
      phase.bad.forEach((b) => {
        if (checked[b]) bad++;
      });
    });
    const score = good - bad;
    setEmotionalScore(score);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto bg-white text-gray-900 rounded-2xl shadow-lg border border-gray-200">
      <button
        onClick={() => setShowChecklist(!showChecklist)}
        className="mb-6 px-6 py-2 bg-green-600 text-white rounded-xl font-semibold hover:bg-blue-500 transition"
      >
        {showChecklist ? "🙈 Hide Checklist" : "📋 View Checklist"}
      </button>

      {showChecklist && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Journal Section */}
          <div>
            <h1 className="text-2xl font-bold mb-4">📋 NY Session Checklist</h1>
            {nySessionChecklist.map((section, idx) => (
              <div key={idx} className="mb-4">
                <h2 className="font-semibold text-lg mb-2">{section.step}</h2>
                {section.checks.map((check, i) => (
                  <label key={i} className="flex items-center gap-2 mb-1">
                    <input
                      type="checkbox"
                      className="accent-gray-800"
                      checked={checked[check] || false}
                      onChange={() => handleCheck(check)}
                    />
                    {check}
                  </label>
                ))}
              </div>
            ))}

            <button
              onClick={evaluateDecision}
              className="mt-6 px-6 py-2 rounded-xl font-semibold transition bg-gray-900 text-white hover:bg-gray-800"
            >
              ✅ Evaluate Trade Decision
            </button>

            {finalDecision && (
              <div
                className={`mt-4 p-4 rounded-xl border text-xl font-bold flex items-center gap-3 ${
                  finalDecision.includes("BUY")
                    ? "bg-green-50 border-green-300 text-blue-900"
                    : finalDecision.includes("SELL")
                    ? "bg-red-50 border-red-300 text-red-900"
                    : finalDecision.includes("Not all")
                    ? "bg-yellow-50 border-yellow-300 text-yellow-800"
                    : "bg-blue-50 border-blue-300 text-blue-800"
                }`}
              >
                {finalDecision}
              </div>
            )}
          </div>

          {/* Emotional Section */}
          <div>
            <h1 className="text-2xl font-bold mb-6">🧠 Emotional Checklist</h1>
            {Object.entries(emotionalChecklist).map(([phase, lists]) => (
              <div key={phase} className="mb-8">
                <h2 className="font-semibold text-lg capitalize mb-3">
                  {phase} Trade
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-green-700 font-semibold mb-2">✅ Good</h3>
                    {lists.good.map((item, i) => (
                      <label
                        key={i}
                        className="flex items-center gap-2 mb-1 text-green-700"
                      >
                        <input
                          type="checkbox"
                          className="accent-green-600"
                          checked={checked[item] || false}
                          onChange={() => handleCheck(item)}
                        />
                        {item}
                      </label>
                    ))}
                  </div>
                  <div>
                    <h3 className="text-red-700 font-semibold mb-2">❌ Bad</h3>
                    {lists.bad.map((item, i) => (
                      <label
                        key={i}
                        className="flex items-center gap-2 mb-1 text-red-700"
                      >
                        <input
                          type="checkbox"
                          className="accent-red-600"
                          checked={checked[item] || false}
                          onChange={() => handleCheck(item)}
                        />
                        {item}
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            ))}

            <button
              onClick={evaluateEmotions}
              className="mt-4 px-6 py-2 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition"
            >
              🧾 Evaluate Emotional Score
            </button>

            {emotionalScore !== null && (
              <div
                className={`mt-4 p-4 rounded-xl border text-xl font-bold flex items-center gap-3 ${
                  emotionalScore > 0
                    ? "bg-green-50 border-green-300 text-green-800"
                    : emotionalScore < 0
                    ? "bg-red-50 border-red-300 text-red-800"
                    : "bg-yellow-50 border-yellow-300 text-yellow-800"
                }`}
              >
                {emotionalScore > 0 && <span>🟢 Emotionally Stable</span>}
                {emotionalScore === 0 && <span>⚖️ Neutral</span>}
                {emotionalScore < 0 && <span>🔴 Emotionally Unstable</span>}
                <span>(Score: {emotionalScore})</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default JournalChecklist;
