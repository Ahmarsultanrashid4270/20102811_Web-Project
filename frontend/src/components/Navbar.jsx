// ==============================================================================
// NAVBAR COMPONENT (frontend/src/components/Navbar.jsx)
// Top Header: Logo, Menu Links, Live Currency Switcher Aur User Controls
// Roman Urdu Comments: Har line aur feature ki asaan wazahat
// ==============================================================================

// 1. React aur navigation hooks import karna
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';       // Login status hasil karne ke liye
import { useCurrency } from '../context/CurrencyContext'; // Currency (€, $, £) hasil karne ke liye

const Navbar = () => {
  // Contexts se functions aur data lena
  const { user, logout } = useAuth();
  const { currency, setCurrency } = useCurrency();
  const navigate = useNavigate();

  // Logout handler: Logout kar ke homepage par redirect karna
  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    // Header container: Sticky top (Page scroll karne par bhi upar rehta hai)
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Platform Name */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-bold text-xl shadow-md shadow-emerald-600/20 group-hover:scale-105 transition-transform">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
            </div>
            <div>
              <span className="font-extrabold text-xl text-slate-900 tracking-tight">Kindred<span className="text-emerald-600">Heart</span></span>
              <span className="block text-[10px] text-slate-500 font-medium tracking-wide uppercase">Transparent Giving</span>
            </div>
          </Link>

          {/* Center Navigation Links (Home, Causes, + Start Campaign) */}
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-sm font-semibold text-slate-600 hover:text-emerald-600 transition-colors">Home</Link>
            <Link to="/campaigns" className="text-sm font-semibold text-slate-600 hover:text-emerald-600 transition-colors">Explore Causes</Link>
            
            {/* Start Campaign Link: Sirf Organizer ya Admin ko dikhai deta hai */}
            {user && (user.role === 'organizer' || user.role === 'admin') && (
              <Link to="/create-campaign" className="text-sm font-semibold text-emerald-600 hover:text-emerald-700 transition-colors flex items-center gap-1">
                + Start Campaign
              </Link>
            )}
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-3">
            
            {/* Currency Selector (Third-Party Web Service feature) */}
            <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-slate-50 px-2 py-1 text-xs font-semibold text-slate-700">
              <span className="text-slate-400 mr-1.5">Currency:</span>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)} // User ke badalne par global state update hoti hai
                className="bg-transparent focus:outline-none font-bold text-emerald-700 cursor-pointer"
                aria-label="Select Currency"
              >
                <option value="EUR">€ EUR</option>
                <option value="USD">$ USD</option>
                <option value="GBP">£ GBP</option>
              </select>
            </div>

            {/* User Auth Buttons: Agar user login hai vs agar login nahi hai */}
            {user ? (
              // Case A: User login hai (Naam ka badge aur Logout button dikhao)
              <div className="flex items-center gap-3">
                <Link
                  to="/dashboard"
                  className="text-xs font-semibold px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg transition-colors flex items-center gap-1.5"
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  {user.name.split(' ')[0]} ({user.role})
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-xs font-semibold px-3 py-2 border border-slate-300 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 text-slate-600 rounded-lg transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              // Case B: User login nahi hai (Sign In aur Get Started ke buttons dikhao)
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="text-xs font-semibold px-3 py-2 text-slate-700 hover:text-emerald-600 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="text-xs font-bold px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg shadow-sm shadow-emerald-600/30 transition-all hover:shadow-md"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

        </div>
      </div>
    </header>
  );
};

export default Navbar;
