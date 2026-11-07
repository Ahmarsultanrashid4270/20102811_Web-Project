// ==============================================================================
// DONATION MODAL (frontend/src/components/DonationModal.jsx)
// Paise Donate Karne Ka Popup: Amount Selection, Anonymous Toggle Aur Card Simulator
// Roman Urdu Comments: Har line aur input field ki asaan wazahat
// ==============================================================================

// 1. React hooks aur Contexts import karna
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';       // Login user ki email/naam uthane ke liye
import { useCurrency } from '../context/CurrencyContext'; // Currency symbol dikhane ke liye

const DonationModal = ({ campaign, isOpen, onClose, onDonationSuccess }) => {
  // Agar popup band ho toh kuch bhi render na karo
  if (!isOpen || !campaign) return null;

  const { user } = useAuth();
  const { symbol, currency } = useCurrency();

  // 2. Form States
  const [amount, setAmount] = useState('25');                                  // Selected donation amount
  const [donorName, setDonorName] = useState(user ? user.name : '');          // Login user ka naam khud bhar do
  const [donorEmail, setDonorEmail] = useState(user ? user.email : '');        // Login user ka email khud bhar do
  const [message, setMessage] = useState('');                                 // Dua ya hosla afzai ka paigham
  const [isAnonymous, setIsAnonymous] = useState(false);                      // Naam chupana hai ya nahi
  const [paymentMethod, setPaymentMethod] = useState('Credit Card');          // Payment ka zariya
  const [loading, setLoading] = useState(false);                              // Processing status
  const [error, setError] = useState('');                                     // Error message

  // Char quick preset amounts ke buttons: 10, 25, 50, 100
  const presets = ['10', '25', '50', '100'];

  /**
   * 3. handleSubmit: Form submit hone par backend API ko donation data bhejna
   */
  const handleSubmit = async (e) => {
    e.preventDefault(); // Browser ko page reload karne se rokna
    setError('');

    // Validation checks
    if (!amount || Number(amount) < 1) {
      setError('Please select a donation amount of at least 1.');
      return;
    }

    if (!donorEmail) {
      setError('Email is required to issue your digital receipt.');
      return;
    }

    setLoading(true);

    try {
      // Backend ko POST request bhejna: /api/donations
      const response = await fetch('/api/donations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Agar user login hai toh authorization token bhi bhej do
          ...(user && user.token ? { Authorization: `Bearer ${user.token}` } : {})
        },
        body: JSON.stringify({
          campaignId: campaign._id,
          amount: Number(amount),
          donorName: isAnonymous ? 'Anonymous Supporter' : (donorName || 'Generous Supporter'),
          donorEmail,
          message,
          paymentMethod,
          isAnonymous
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Could not process donation');
      }

      // Kamyabi par: Form modal band karo aur parent ko receipt details bhej do
      onClose();
      onDonationSuccess(data.donation, campaign);
    } catch (err) {
      setError(err.message || 'Server error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    // Fixed modal backdrop (Screen ko blur aur dark karta hai)
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 relative">
        
        {/* Cross (Close) Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-sm font-bold transition-colors"
        >
          ✕
        </button>

        {/* Modal Header */}
        <div className="mb-6">
          <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full uppercase tracking-wider">
            Make a Donation
          </span>
          <h2 className="text-xl font-extrabold text-slate-900 mt-2 line-clamp-1">
            {campaign.title}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Organized by <strong className="text-slate-700">{campaign.organizerName || 'Community Team'}</strong>
          </p>
        </div>

        {/* Error Alert Box */}
        {error && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl font-medium">
            {error}
          </div>
        )}

        {/* Donation Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Amount Presets & Custom Input */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">
              Select Donation Amount ({symbol})
            </label>
            <div className="grid grid-cols-4 gap-2 mb-2">
              {presets.map((preset) => (
                <button
                  type="button"
                  key={preset}
                  onClick={() => setAmount(preset)} // Click karne par amount set ho jati hai
                  className={`py-2 text-xs font-bold rounded-xl border transition-all ${
                    amount === preset
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                  }`}
                >
                  {symbol}{preset}
                </button>
              ))}
            </div>
            
            {/* Custom Amount Box */}
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-slate-400 text-xs font-bold">{symbol}</span>
              <input
                type="number"
                min="1"
                placeholder="Or custom amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full pl-8 pr-3 py-2 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-slate-50"
              />
            </div>
          </div>

          {/* Donor Name & Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Your Name</label>
              <input
                type="text"
                placeholder="e.g. David O'Connor"
                value={donorName}
                disabled={isAnonymous} // Agar anonymous check kiya toh name disable ho jaye
                onChange={(e) => setDonorName(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-slate-50 disabled:bg-slate-100 disabled:text-slate-400"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Email (for Receipt)</label>
              <input
                type="email"
                required
                placeholder="your.email@example.com"
                value={donorEmail}
                onChange={(e) => setDonorEmail(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-slate-50"
              />
            </div>
          </div>

          {/* Anonymous Checkbox */}
          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="anonCheckbox"
              checked={isAnonymous}
              onChange={(e) => setIsAnonymous(e.target.checked)}
              className="rounded text-emerald-600 focus:ring-emerald-500 h-4 w-4"
            />
            <label htmlFor="anonCheckbox" className="text-xs text-slate-600 font-medium cursor-pointer">
              Do not display my name publicly (Donate Anonymously)
            </label>
          </div>

          {/* Words of Encouragement Message */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Words of Encouragement (Optional)</label>
            <textarea
              rows="2"
              placeholder="e.g. Wishing you all the best with this great cause!"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-slate-50"
            ></textarea>
          </div>

          {/* Payment Method Simulator */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Payment Method</label>
            <div className="grid grid-cols-2 gap-2">
              <label className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-semibold cursor-pointer ${paymentMethod === 'Credit Card' ? 'border-emerald-600 bg-emerald-50 text-emerald-900' : 'border-slate-200 bg-slate-50 text-slate-600'}`}>
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'Credit Card'}
                  onChange={() => setPaymentMethod('Credit Card')}
                  className="text-emerald-600"
                />
                <svg className="w-4 h-4 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="20" height="14" x="2" y="5" rx="2" /><line x1="2" x2="22" y1="10" y2="10" />
                </svg>
                <span>Credit / Debit Card</span>
              </label>
              <label className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-semibold cursor-pointer ${paymentMethod === 'Mock Stripe' ? 'border-emerald-600 bg-emerald-50 text-emerald-900' : 'border-slate-200 bg-slate-50 text-slate-600'}`}>
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'Mock Stripe'}
                  onChange={() => setPaymentMethod('Mock Stripe')}
                  className="text-emerald-600"
                />
                <svg className="w-4 h-4 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                </svg>
                <span>Instant Stripe Sandbox</span>
              </label>
            </div>
          </div>

          {/* Submit Action Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-md shadow-emerald-600/30 transition-all hover:shadow-lg disabled:opacity-50 flex items-center justify-center gap-2 mt-4"
          >
            {loading ? 'Processing Secure Donation...' : `Confirm & Donate ${symbol}${amount}`}
          </button>

          {/* Security Guarantee Note */}
          <p className="text-[11px] text-center text-slate-400 flex items-center justify-center gap-1.5">
            <svg className="w-3.5 h-3.5 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            <span>256-Bit SSL Encrypted & Secure Sandbox Donation</span>
          </p>

        </form>

      </div>
    </div>
  );
};

export default DonationModal;
