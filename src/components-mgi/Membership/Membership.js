import React from "react";
import { CheckCircle } from "lucide-react";

const plans = [
  {
    name: "Basic",
    price: "$15/mo",
    features: [
      "Daily trading signals (1–2 pairs)",
      "Trading journal access",
      "WhatsApp group access",
      "Risk management basics (mini training)",
    ],
  },
  {
    name: "Standard",
    price: "$45/mo",
    features: [
      "All Basic features",
      "More pairs (majors + gold + 1 crypto/indices)",
      "ICT idea training",
      "Full risk management training",
      "Weekly market review video",
    ],
  },
  {
    name: "Premium",
    price: "$120/mo",
    features: [
      "All Standard features",
      "All signals (forex, gold, crypto, indices)",
      "Exclusive ICT deep dives",
      "Personalized trading plan template",
      "Weekly mentorship group call",
      "Priority WhatsApp signals",
    ],
  },
  {
    name: "VIP Mentorship",
    price: "$400/mo or $1000/3mo",
    features: [
      "All Premium features",
      "Private 1-on-1 mentorship sessions",
      "Direct WhatsApp mentorship chat",
      "Journal review & feedback",
      "Custom risk management plan",
    ],
  },
  {
    name: "Lifetime Masterclass",
    price: "$1200 one-time",
    features: [
      "Lifetime access to signals",
      "Lifetime journal access",
      "Lifetime ICT training content",
      "Monthly group mentorship (12 months)",
      "Certificate of completion",
    ],
  },
];

export default function Membership() {
  return (
    <div className="bg-gray-50 py-16 px-6 lg:px-20">
      <h2 className="text-3xl font-bold text-center mb-12">
        Choose Your Plan
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {plans.map((plan, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl shadow-lg p-6 flex flex-col hover:scale-105 transition-transform"
          >
            <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>
            <p className="text-2xl font-bold text-indigo-600 mb-4">
              {plan.price}
            </p>
            <ul className="space-y-2 mb-6">
              {plan.features.map((feature, i) => (
                <li key={i} className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-1" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <button className="mt-auto bg-indigo-600 text-white py-2 px-4 rounded-xl hover:bg-indigo-700 transition-colors">
              Get Started
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}