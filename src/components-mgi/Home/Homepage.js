import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function HomePage() {
  const pricingPlans = [
    {
      id: "basic",
      title: "Starter",
      price: "$15",
      freq: "/mo",
      bullets: [
        "Daily free-lite signals",
        "Access to short lessons",
        "Trading psychology checklist",
      ],
      accent: "from-green-400 to-green-500",
    },
    {
      id: "pro",
      title: "Pro",
      price: "$49",
      freq: "/mo",
      bullets: [
        "Full signals (NYC session)",
        "Weekly live review & journal access",
        "Risk management templates",
      ],
      accent: "from-green-500 to-green-600",
    },
    {
      id: "elite",
      title: "Elite",
      price: "$99",
      freq: "/mo",
      bullets: [
        "1:1 coaching (monthly)",
        "Priority signals + alerts",
        "Full course access",
      ],
      accent: "from-green-600 to-emerald-600",
    },
  ];

  const testimonials = [
    {
      name: "Amina",
      quote:
        "MGI changed my trading — psychology training stopped me from revenge trading. Signals are clear and on-time.",
    },
    {
      name: "John",
      quote:
        "Consistent pips after 2 months. The journal and checklist keep me disciplined.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100 text-gray-800">
      <main>
        {/* HERO */}
        <section className="relative">
          <motion.div
            className="max-w-6xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-2 gap-10 items-center"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div>
              <h2 className="text-4xl md:text-5xl font-extrabold leading-tight text-green-700">
                Master the NY Session · Trade with Confidence
              </h2>
              <p className="mt-4 text-lg text-gray-600 max-w-xl">
                Signals powered by psychology-first trading. Learn discipline,
                manage risk, and get NYC-session setups you can act on — daily.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <motion.div whileHover={{ scale: 1.05 }}>
                  <Link
                    to="/free-signals"
                    className="inline-block bg-white px-5 py-3 rounded-full font-semibold border border-green-300 text-green-700 hover:bg-green-50 shadow-sm transition"
                  >
                    Get Free Signals
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }}>
                  <Link
                    to="/membership"
                    className="inline-block bg-gradient-to-r from-green-500 to-emerald-500 text-white px-5 py-3 rounded-full font-semibold shadow-md hover:opacity-95 transition"
                  >
                    Join Premium — $15/mo
                  </Link>
                </motion.div>
              </div>

              <div className="mt-8 grid grid-cols-3 gap-4 max-w-md">
                <StatCard title="Avg Weekly Pips" value="+120" />
                <StatCard title="Win Rate" value="71%" />
                <StatCard title="Members" value="1.2k+" />
              </div>
            </div>

            <motion.div
              className="bg-white rounded-3xl p-6 border border-green-100 shadow-md"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              whileHover={{ scale: 1.02, boxShadow: "0px 10px 20px rgba(0,0,0,0.1)" }}
            >
              <h3 className="font-semibold text-green-700">Today's Free Peek</h3>
              <SignalPreview />
              <p className="mt-4 text-sm text-gray-600">
                Want full signals + entry/exit & journal? Upgrade to Pro.
              </p>
            </motion.div>
          </motion.div>
        </section>

        {/* Why MGI */}
        <section className="max-w-6xl mx-auto px-4 py-12">
          <h3 className="text-2xl font-bold text-green-700">Why traders pick MGI</h3>
          <p className="mt-2 text-gray-600 max-w-2xl">
            We place psychology first — because mindset + rules = consistency.
          </p>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: "Trading Psychology",
                desc: "Checklists, routines, and coaching to keep your emotions out of the trade.",
                icon: "🧠",
              },
              {
                title: "Signals (NYC)",
                desc: "Clear, time-based entries tested on NYC session price action.",
                icon: "📈",
              },
              {
                title: "Risk Management",
                desc: "Position sizing, stop placement, and funded account ready strategies.",
                icon: "🔒",
              },
            ].map((p, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.2 }}
                whileHover={{ scale: 1.05, boxShadow: "0px 10px 20px rgba(0,0,0,0.1)" }}
              >
                <PillarCard {...p} />
              </motion.div>
            ))}
          </div>
        </section>

        {/* Testimonials */}
        <section className="bg-green-50 py-12">
          <div className="max-w-6xl mx-auto px-4">
            <h3 className="text-2xl font-bold text-green-700">What traders say</h3>
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              {testimonials.map((t, i) => (
                <motion.blockquote
                  key={i}
                  className="p-6 rounded-2xl bg-white border border-green-100 shadow-md"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.2 }}
                  whileHover={{ scale: 1.03 }}
                >
                  <p className="text-gray-700">“{t.quote}”</p>
                  <footer className="mt-4 text-sm text-gray-500">— {t.name}</footer>
                </motion.blockquote>
              ))}
            </div>
          </div>
        </section>

        {/* Plans */}
        <section className="py-12">
          <div className="max-w-6xl mx-auto px-4">
            <h3 className="text-2xl font-bold text-green-700">Membership plans</h3>
            <p className="mt-2 text-gray-600">
              Simple plans built around signals, psychology and mentorship.
            </p>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
              {pricingPlans.map((p, i) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.2 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <PricingCard plan={p} />
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="max-w-6xl mx-auto px-4 py-12">
          <motion.div
            className="rounded-3xl p-8 bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg flex flex-col md:flex-row items-center justify-between"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div>
              <h4 className="text-xl font-bold">Your mindset is your trading edge.</h4>
              <p className="mt-1 text-sm opacity-90">
                Start mastering psychology + signals today and trade with
                discipline.
              </p>
            </div>
            <motion.div whileHover={{ scale: 1.08 }} className="mt-4 md:mt-0">
              <Link
                to="/signup"
                className="inline-block bg-white text-green-700 px-6 py-3 rounded-full font-semibold"
              >
                Get Started
              </Link>
            </motion.div>
          </motion.div>
        </section>
      </main>
    </div>
  );
}

/* --- Subcomponents --- */
function StatCard({ title, value }) {
  return (
    <motion.div
      className="bg-white rounded-2xl p-4 shadow-sm border border-green-100"
      whileHover={{ scale: 1.05 }}
    >
      <div className="text-sm text-gray-500">{title}</div>
      <div className="mt-1 font-bold text-lg text-green-700">{value}</div>
    </motion.div>
  );
}

function SignalPreview() {
  return (
    <div className="mt-4 rounded-2xl border border-green-100 bg-green-50 p-4">
      <div className="font-medium text-green-700">EUR/USD — 1H</div>
      <div className="mt-2 text-sm text-gray-600">
        Setup: Break & retest / NYC time entry
      </div>
      <div className="mt-3 h-36 bg-green-100 rounded-xl flex items-center justify-center text-green-400">
        Chart placeholder
      </div>
      <div className="mt-3 flex items-center justify-between text-sm text-gray-700">
        <div>Entry: 1.0870</div>
        <div>TP: 1.0900</div>
        <div>SL: 1.0840</div>
      </div>
    </div>
  );
}

function PillarCard({ icon, title, desc }) {
  return (
    <div className="p-6 rounded-3xl bg-white border border-green-100 shadow-sm">
      <div className="text-3xl">{icon}</div>
      <h4 className="mt-3 font-semibold text-green-700">{title}</h4>
      <p className="mt-2 text-gray-600 text-sm">{desc}</p>
    </div>
  );
}

function PricingCard({ plan }) {
  return (
    <div className="rounded-3xl p-6 border border-green-100 bg-white shadow-md flex flex-col justify-between">
      <div>
        <h4 className="font-bold text-lg text-green-700">{plan.title}</h4>
        <div className="mt-4">
          <div className="text-3xl font-extrabold text-green-600">
            {plan.price}
            <span className="text-base font-medium">{plan.freq}</span>
          </div>
          <ul className="mt-4 text-sm text-gray-700 space-y-2">
            {plan.bullets.map((b, i) => (
              <li key={i}>• {b}</li>
            ))}
          </ul>
        </div>
      </div>

      <motion.div whileHover={{ scale: 1.05 }} className="mt-6">
        <Link
          to={`/checkout/${plan.id}`}
          className={`inline-block w-full text-center px-4 py-2 rounded-full font-semibold bg-gradient-to-r ${plan.accent} text-white shadow-md`}
        >
          Choose {plan.title}
        </Link>
      </motion.div>
    </div>
  );
}
