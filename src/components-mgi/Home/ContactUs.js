import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  Youtube,
  Github,
} from "lucide-react";

export default function ContactUs() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Message Sent:", form);
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-6xl w-full grid md:grid-cols-2 gap-8 bg-white shadow-2xl rounded-2xl overflow-hidden"
      >
        {/* Left Section - Info */}
        <div className="bg-gradient-to-br from-green-600 to-emerald-600 text-white p-10 flex flex-col justify-between">
          <div>
            <h2 className="text-3xl font-bold mb-4">Get in Touch</h2>
            <p className="text-green-100 mb-8">
              Have a project in mind, a question, or just want to connect? Drop
              me a line anytime – I’d love to hear from you!
            </p>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Mail size={20} />
                <span>yourmail@example.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone size={20} />
                <span>+255 700 000 000</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin size={20} />
                <span>Dar es Salaam, Tanzania</span>
              </div>
            </div>
          </div>

          {/* Social Media Links */}
          <div className="flex space-x-4 mt-10">
            <a href="https://facebook.com" target="_blank" rel="noreferrer">
              <Facebook className="w-6 h-6 hover:text-green-200 transition" />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer">
              <Instagram className="w-6 h-6 hover:text-green-200 transition" />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer">
              <Twitter className="w-6 h-6 hover:text-green-200 transition" />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer">
              <Linkedin className="w-6 h-6 hover:text-green-200 transition" />
            </a>
            <a href="https://youtube.com" target="_blank" rel="noreferrer">
              <Youtube className="w-6 h-6 hover:text-green-200 transition" />
            </a>
            <a href="https://github.com" target="_blank" rel="noreferrer">
              <Github className="w-6 h-6 hover:text-green-200 transition" />
            </a>
          </div>
        </div>

        {/* Right Section - Form */}
        <div className="p-10">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Send Me a Message
          </h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={form.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-400 outline-none"
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Your Email"
              value={form.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-400 outline-none"
              required
            />
            <textarea
              name="message"
              rows="5"
              placeholder="Your Message"
              value={form.message}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-400 outline-none"
              required
            ></textarea>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-3 rounded-lg font-semibold shadow-md hover:opacity-95 transition"
            >
              Send Message
            </motion.button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
