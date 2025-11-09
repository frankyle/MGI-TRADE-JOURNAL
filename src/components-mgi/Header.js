import React, { useState, useEffect } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import logo from "../images/MGI logo.png";
import { supabase } from "../supabaseClient"; // Import Supabase Client

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [fullName, setFullName] = useState(""); // Hali mpya kwa ajili ya jina la mtumiaji
  const [progressOpen, setProgressOpen] = useState(false);

  // Tumia useEffect kuangalia hali ya mtumiaji
  useEffect(() => {
    // Kazi ya kuangalia mtumiaji aliyepo na kusasisha hali
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setIsLoggedIn(true);
        // Pata metadata ya mtumiaji, au tumia email kama jina halipo
        setFullName(session.user.user_metadata?.full_name || session.user.email);
      } else {
        setIsLoggedIn(false);
        setFullName("");
      }
    };

    checkUser();

    // Tumia onAuthStateChange kusikiliza mabadiliko
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session) {
          setIsLoggedIn(true);
          setFullName(session.user.user_metadata?.full_name || session.user.email);
        } else {
          setIsLoggedIn(false);
          setFullName("");
        }
      }
    );

    // Kazi ya kusafisha wakati component inapofungwa
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // Kazi mpya ya kumtoa mtumiaji nje
  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      // Hali itasasishwa kiotomatiki na `onAuthStateChange`
    } catch (error) {
      console.error("Error signing out:", error.message);
      alert("Error signing out: " + error.message);
    }
  };

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);
  const toggleProgress = () => setProgressOpen(!progressOpen);

  return (
    <header className="fixed top-0 left-0 w-full z-50">
      <div className="backdrop-blur-md bg-white/60 border-b border-green-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          {/* Logo & Title */}
          <div className="flex items-center space-x-3">
            <img src={logo} alt="MGI" className="h-10 w-10 object-contain" />
            <div>
              <h1 className="text-lg font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-emerald-600">
                MGI Candles
              </h1>
              <p className="text-xs text-gray-600">
                Trading psychology · Signals · Journals
              </p>
            </div>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex space-x-6 items-center ml-12 relative">
            <NavLink to="/" label="Home" />
            <NavLink to="/trades" label="My Trades" />
            {/* <NavLink to="/trades_idea" label="Admin Trades" /> */}

            {/* Progress Dropdown */}
            {/* <div className="relative">
              <button
                onClick={toggleProgress}
                className="flex items-center text-gray-800 hover:text-green-600 font-medium transition-colors focus:outline-none"
              >
                Progress <ChevronDown size={16} className="ml-1" />
              </button>
              <AnimatePresence>
                {progressOpen && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute mt-2 w-56 bg-white shadow-xl rounded-lg py-2 border border-green-100 z-50"
                  >
                    <DropdownLink
                      to="/riskmanagement"
                      label="📊 Risk Management (Personal)"
                      close={() => setProgressOpen(false)}
                    />
                    <DropdownLink
                      to="/riskmanagementfunded"
                      label="💼 Risk Management (Funded)"
                      close={() => setProgressOpen(false)}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div> */}

            <NavLink to="/journal" label="Journal" />
            <NavLink to="/contactus" label="Contacts" />

            {/* Onyesha jina au vifungo kulingana na hali ya mtumiaji */}
            {!isLoggedIn ? (
              <>
                <Link
                  to="/signin"
                  className="bg-white px-4 py-2 rounded-full font-medium border border-green-400 text-green-700 hover:bg-green-50 shadow-sm transition"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-full font-medium shadow-md hover:opacity-95 transition"
                >
                  Sign Up
                </Link>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <span className="text-gray-800 font-medium whitespace-nowrap">
                  Hi, {fullName}!
                </span>
                <button
                  onClick={handleSignOut}
                  className="bg-red-600 text-white px-5 py-2 rounded-full font-medium hover:bg-red-700 transition"
                >
                  Sign Out
                </button>
              </div>
            )}
          </nav>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden text-gray-800 ml-4"
            onClick={toggleMobileMenu}
          >
            {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Nav with Animation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="md:hidden backdrop-blur-lg bg-white/95 shadow-lg px-6 pb-5 space-y-3"
          >
            <NavLink to="/" label="Home" close={() => setMobileMenuOpen(false)} />
            <NavLink
              to="/trades"
              label="My Trades"
              close={() => setMobileMenuOpen(false)}
            />

           {/* <NavLink
              to="/trades_idea"
              label="Admin Trades"
              close={() => setMobileMenuOpen(false)}
            /> */}


            {/* Mobile Progress Dropdown */}
            {/* <div className="space-y-1">
              <button
                onClick={toggleProgress}
                className="flex items-center justify-between w-full text-gray-800 font-medium hover:text-green-600"
              >
                Progress <ChevronDown size={16} />
              </button>

              <AnimatePresence>
                {progressOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="pl-4 space-y-1"
                  >
                    <DropdownLink
                      to="/riskmanagement"
                      label="📊 Risk (Personal)"
                      close={() => {
                                setMobileMenuOpen(false);
                                setProgressOpen(false);
                              }}
                    />
                    <DropdownLink
                      to="/riskmanagementfunded"
                      label="💼 Risk (Funded)"
                      close={() => {
                                setMobileMenuOpen(false);
                                setProgressOpen(false);
                              }}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div> */}

            <NavLink
              to="/journal"
              label="Journal"
              close={() => setMobileMenuOpen(false)}
            />
            <NavLink
              to="/contactus"
              label="Contacts"
              close={() => setMobileMenuOpen(false)}
            />

            {/* Onyesha jina au vifungo kwenye simu */}
            {!isLoggedIn ? (
              <>
                <Link
                  to="/signin"
                  className="w-full text-center block bg-white px-4 py-2 rounded-full font-medium border border-green-400 text-green-700 hover:bg-green-50 shadow-sm transition"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="w-full text-center block bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-full font-medium shadow-md hover:opacity-95 transition"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </>
            ) : (
              <div className="pt-3 border-t border-gray-200">
                <span className="block text-center text-lg font-bold text-green-700 mb-3">
                  Hi, {fullName}!
                </span>
                <button
                  onClick={() => {
                    handleSignOut();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full bg-red-600 text-white px-4 py-2 rounded-full font-medium hover:bg-red-700"
                >
                  Sign Out
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

/* --- Reusable Subcomponents --- */
function NavLink({ to, label, close }) {
  return (
    <Link
      to={to}
      onClick={close}
      className="block py-2 text-gray-800 hover:text-green-600 font-medium transition-colors"
    >
      {label}
    </Link>
  );
}

function DropdownLink({ to, label, close }) {
  return (
    <Link
      to={to}
      onClick={close}
      className="block px-4 py-2 text-gray-800 hover:bg-green-50 hover:text-green-700 rounded-md transition"
    >
      {label}
    </Link>
  );
}

export default Header;