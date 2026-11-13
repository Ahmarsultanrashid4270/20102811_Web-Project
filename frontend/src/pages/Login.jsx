// ==============================================================================
// LOGIN PAGE (frontend/src/pages/Login.jsx)
// User Authentication Aur 1-Click Fast Academic Demo Access
// Roman Urdu Comments: Har line aur feature ki asaan wazahat
// ==============================================================================

// 1. React hooks aur Auth Context import karna
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Login function lene ke liye

const Login = () => {
  // 2. Form states
  const [email, setEmail] = useState('');       // User ka email
  const [password, setPassword] = useState(''); // User ka password
  const [error, setError] = useState('');       // Ghalat password ka error
  const [loading, setLoading] = useState(false);// Submitting state

  const { login } = useAuth();
  const navigate = useNavigate();

  /**
   * 3. handleSubmit: Form submit hone par login API ko call karna
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // AuthContext ka login function chalana
    const result = await login(email, password);
    setLoading(false);

    if (result.success) {
      // Kamyabi par dashboard par bhej do
      navigate('/dashboard');
    } else {
      // Nakami par error message dikhao
      setError(result.message || 'Invalid email or password');
    }
  };

  /**
   * 4. fillDemo: Presentation aur Examiner ke liye 1-Click button
   * Ek click par Admin, Organizer ya Donor ke credentials khud box mein fill ho jate hain
   */
  const fillDemo = (demoEmail, demoPass) => {
    setEmail(demoEmail);
    setPassword(demoPass);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-slate-200 shadow-xl space-y-6">
        
        {/* Header Logo & Title */}
        <div className="text-center">
          <div className="w-12 h-12 bg-emerald-600 rounded-2xl flex items-center justify-center text-white font-black text-2xl mx-auto mb-3 shadow-md shadow-emerald-600/30">
            <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Sign In to KindredHeart</h2>
          <p className="text-xs text-slate-500 mt-1">Manage your donations and charity campaigns</p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl font-medium">
            {error}
          </div>
        )}

        {/* Quick Demo Access (3 Ready-made Buttons) */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 space-y-2">
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider text-center">
            Quick Demo Access (1-Click Fill)
          </p>
          <div className="grid grid-cols-3 gap-1.5">
            {/* Button 1: Admin */}
            <button
              type="button"
              onClick={() => fillDemo('admin@kindred.org', 'password123')}
              className="px-2 py-2 text-[11px] font-bold bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 border border-slate-200 rounded-lg transition-colors flex items-center justify-center gap-1.5"
            >
              <svg className="w-3.5 h-3.5 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
              <span>Admin</span>
            </button>
            {/* Button 2: Organizer */}
            <button
              type="button"
              onClick={() => fillDemo('organizer@redcross.org', 'password123')}
              className="px-2 py-2 text-[11px] font-bold bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 border border-slate-200 rounded-lg transition-colors flex items-center justify-center gap-1.5"
            >
              <svg className="w-3.5 h-3.5 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 11 18-5v12L3 14v-3z" /><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6" /></svg>
              <span>Organizer</span>
            </button>
            {/* Button 3: Donor */}
            <button
              type="button"
              onClick={() => fillDemo('donor@student.dbs.ie', 'password123')}
              className="px-2 py-2 text-[11px] font-bold bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 border border-slate-200 rounded-lg transition-colors flex items-center justify-center gap-1.5"
            >
              <svg className="w-3.5 h-3.5 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
              <span>Donor</span>
            </button>
          </div>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. name@example.com"
              className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-slate-50"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-slate-50"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-600/30 transition-all disabled:opacity-50"
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        {/* Link to Register */}
        <p className="text-center text-xs text-slate-500">
          Don't have an account?{' '}
          <Link to="/register" className="font-bold text-emerald-600 hover:underline">
            Register here
          </Link>
        </p>

      </div>
    </div>
  );
};

export default Login;
