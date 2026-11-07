// ==============================================================================
// REGISTER PAGE (frontend/src/pages/Register.jsx)
// Naya Account Banane Ka Form (Donor Aur Organizer Role Selector)
// Roman Urdu Comments: Har line aur validation ki asaan wazahat
// ==============================================================================

// 1. React hooks aur Auth Context import karna
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Register function hasil karne ke liye

const Register = () => {
  // 2. Form States
  const [name, setName] = useState('');         // User ka naam
  const [email, setEmail] = useState('');       // Email
  const [password, setPassword] = useState(''); // Password (min 6 characters)
  const [role, setRole] = useState('donor');    // Role: 'donor' ya 'organizer'
  const [error, setError] = useState('');       // Error message
  const [loading, setLoading] = useState(false);// Submitting state

  const { register } = useAuth();
  const navigate = useNavigate();

  /**
   * 3. handleSubmit: Form validation aur registration API call
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Password length validation
    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);
    // Backend API ko call karna AuthContext ke zariye
    const result = await register(name, email, password, role);
    setLoading(false);

    if (result.success) {
      // Account bante hi user dashboard par chala jaye
      navigate('/dashboard');
    } else {
      setError(result.message || 'Could not complete registration');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-slate-200 shadow-xl space-y-6">
        
        {/* Header */}
        <div className="text-center">
          <div className="w-12 h-12 bg-emerald-600 rounded-2xl flex items-center justify-center text-white font-black text-2xl mx-auto mb-3 shadow-md shadow-emerald-600/30">
            <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Create an Account</h2>
          <p className="text-xs text-slate-500 mt-1">Join KindredHeart to donate or start a fundraising campaign</p>
        </div>

        {/* Error Alert Box */}
        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl font-medium">
            {error}
          </div>
        )}

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Full Name */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Elena Rostova"
              className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-slate-50"
            />
          </div>

          {/* Email Address */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. elena@example.org"
              className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-slate-50"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Password (min 6 chars)</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-slate-50"
            />
          </div>

          {/* Role Selection (Radio Cards: Supporter vs Organizer) */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">I want to join as:</label>
            <div className="grid grid-cols-2 gap-2">
              {/* Option 1: Donor */}
              <label className={`p-3 border rounded-xl flex flex-col cursor-pointer transition-all ${role === 'donor' ? 'border-emerald-600 bg-emerald-50' : 'border-slate-200 bg-slate-50'}`}>
                <div className="flex items-center gap-2 font-bold text-xs text-slate-800">
                  <input
                    type="radio"
                    name="userRole"
                    checked={role === 'donor'}
                    onChange={() => setRole('donor')}
                    className="text-emerald-600"
                  />
                  <svg className="w-3.5 h-3.5 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                  <span>Supporter / Donor</span>
                </div>
                <span className="text-[10px] text-slate-500 mt-1 pl-5">Browse causes and donate</span>
              </label>

              {/* Option 2: Organizer */}
              <label className={`p-3 border rounded-xl flex flex-col cursor-pointer transition-all ${role === 'organizer' ? 'border-emerald-600 bg-emerald-50' : 'border-slate-200 bg-slate-50'}`}>
                <div className="flex items-center gap-2 font-bold text-xs text-slate-800">
                  <input
                    type="radio"
                    name="userRole"
                    checked={role === 'organizer'}
                    onChange={() => setRole('organizer')}
                    className="text-emerald-600"
                  />
                  <svg className="w-3.5 h-3.5 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 11 18-5v12L3 14v-3z" /><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6" /></svg>
                  <span>Organizer / Charity</span>
                </div>
                <span className="text-[10px] text-slate-500 mt-1 pl-5">Create and manage fundraisers</span>
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-600/30 transition-all disabled:opacity-50"
          >
            {loading ? 'Creating Account...' : 'Complete Registration'}
          </button>
        </form>

        {/* Link to Login */}
        <p className="text-center text-xs text-slate-500">
          Already have an account?{' '}
          <Link to="/login" className="font-bold text-emerald-600 hover:underline">
            Sign In here
          </Link>
        </p>

      </div>
    </div>
  );
};

export default Register;
