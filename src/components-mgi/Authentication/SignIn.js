// src/components/SignIn.js (au popote lilipo)

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Lock, Mail } from "lucide-react";
import { Link, useNavigate } from "react-router-dom"; // Ongeza useNavigate
import { supabase } from "../../supabaseClient"; // Agiza supabase hapa

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate(); // Andaa navigate kwa uelekezaji

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (error) throw error;

      // Ikiwa imefanikiwa, mpeleke kwenye ukurasa mkuu (mf. journal)
      // alert("Signed in successfully!");
      navigate("/journal"); // Badilisha "/journal" na ukurasa wako mkuu

    } catch (error) {
      alert(error.message);
      console.error("Error signing in:", error);
    }
  };

  // Nambari zako zingine zote za JSX zinabaki kama zilivyo...
  // ...
  // Hapa nitaweka sehemu ya form tu kwa ufupi
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-100 via-white to-emerald-100">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8"
      >
        <h2 className="text-3xl font-bold text-center text-green-700 mb-6">
          Welcome Back
        </h2>
        <form onSubmit={handleSubmit} className="space-y-5">
            {/* Input ya Email */}
            <div className="relative">
                <Mail className="absolute left-3 top-3 text-green-500" size={20} />
                <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-400 outline-none" required />
            </div>
            {/* Input ya Password */}
            <div className="relative">
                <Lock className="absolute left-3 top-3 text-green-500" size={20} />
                <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-400 outline-none" required />
            </div>

            <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} type="submit" className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-2 rounded-lg font-medium shadow-md">
                Sign In
            </motion.button>
        </form>
        <p className="text-center mt-5 text-sm text-gray-600">
          Don’t have an account?{" "}
          <Link to="/signup" className="text-green-600 font-semibold">
            Sign Up
          </Link>
        </p>
      </motion.div>
    </div>
  );
}