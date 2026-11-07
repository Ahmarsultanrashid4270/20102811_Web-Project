// ==============================================================================
// HOME PAGE (frontend/src/pages/Home.jsx)
// Website Ka Homepage: Hero Banner, Platform Counters, Featured Causes Aur Steps
// Roman Urdu Comments: Har line aur section ki asaan wazahat
// ==============================================================================

// 1. React hooks aur Components import karna
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import CampaignCard from '../components/CampaignCard';   // Reusable Cause Card
import DonationModal from '../components/DonationModal'; // Donation Popup
import ReceiptModal from '../components/ReceiptModal';   // Success Receipt Popup
import { useCurrency } from '../context/CurrencyContext';// Currency converter hook

const Home = () => {
  // 2. Local States
  const [campaigns, setCampaigns] = useState([]);               // Causes ki list
  const [loading, setLoading] = useState(true);                  // Data load hone ka spinner status
  const [selectedCampaign, setSelectedCampaign] = useState(null);// Jis cause par donate ka button dabaya
  const [isDonateOpen, setIsDonateOpen] = useState(false);       // Donation modal open/close status
  const [receiptDonation, setReceiptDonation] = useState(null);  // Successful donation ka data
  const [receiptCampaign, setReceiptCampaign] = useState(null);  // Donated campaign ka data
  const { formatAmount } = useCurrency();

  /**
   * 3. fetchCampaigns: Backend API se campaigns mangwana
   */
  const fetchCampaigns = async () => {
    try {
      const res = await fetch('/api/campaigns');
      const data = await res.json();
      if (data.success && data.data) {
        setCampaigns(data.data.slice(0, 6)); // Homepage par sirf top 6 causes dikhao
      }
    } catch (err) {
      console.warn('Backend connection error, falling back to local state');
    } finally {
      setLoading(false);
    }
  };

  // Page khulte hi campaigns fetch karo
  useEffect(() => {
    fetchCampaigns();
  }, []);

  // 4. Modal Handlers
  const handleOpenDonate = (campaign) => {
    setSelectedCampaign(campaign);
    setIsDonateOpen(true); // Popup open karo
  };

  const handleDonationSuccess = (donation, campaign) => {
    setReceiptDonation(donation);
    setReceiptCampaign(campaign);
    fetchCampaigns(); // Progress bar ko update karne ke liye naya data fetch karo
  };

  return (
    <div>
      
      {/* 1. Hero Section (Main Welcoming Banner) */}
      <section className="relative overflow-hidden bg-gradient-to-b from-emerald-50/80 via-white to-slate-50 py-16 sm:py-24 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          
          {/* Trust Badge */}
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 mb-6">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            100% Transparent Community Giving
          </span>

          {/* Main Catchy Headline */}
          <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-900 tracking-tight max-w-4xl mx-auto leading-tight sm:leading-tight">
            Small acts of kindness make a <span className="text-emerald-600 underline decoration-emerald-300 decoration-wavy decoration-2">lasting impact</span>.
          </h1>

          <p className="mt-5 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Support verified community and international charity causes with real-time multi-currency conversion and instant digital receipts.
          </p>

          {/* Call-to-Action Buttons */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/campaigns"
              className="px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-emerald-600/30 transition-all hover:scale-105"
            >
              Explore Active Causes
            </Link>
            <Link
              to="/register"
              className="px-6 py-3.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-bold text-sm rounded-xl shadow-sm transition-all"
            >
              Start a Fundraiser
            </Link>
          </div>

          {/* Quick Metrics Bar (Platform Statistics) */}
          <div className="mt-14 max-w-3xl mx-auto grid grid-cols-3 gap-4 p-5 bg-white rounded-2xl border border-slate-200 shadow-sm text-center">
            <div>
              <p className="text-2xl sm:text-3xl font-extrabold text-slate-900">{formatAmount(35000)}+</p>
              <p className="text-xs text-slate-500 font-medium mt-0.5">Raised for Causes</p>
            </div>
            <div className="border-x border-slate-100">
              <p className="text-2xl sm:text-3xl font-extrabold text-emerald-600">100%</p>
              <p className="text-xs text-slate-500 font-medium mt-0.5">Fund Transparency</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-extrabold text-slate-900">1,250+</p>
              <p className="text-xs text-slate-500 font-medium mt-0.5">Generous Donors</p>
            </div>
          </div>

        </div>
      </section>

      {/* 2. Featured Causes Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10">
          <div>
            <span className="text-xs font-bold text-emerald-600 tracking-wider uppercase">Urgent & Verified</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">Featured Fundraising Campaigns</h2>
          </div>
          <Link to="/campaigns" className="mt-2 sm:mt-0 text-xs font-bold text-emerald-600 hover:text-emerald-700">
            View all causes ({campaigns.length})
          </Link>
        </div>

        {/* Loading Spinner ya Empty State ya Cards Grid */}
        {loading ? (
          <div className="text-center py-12 text-slate-400 text-sm">
            Loading active campaigns...
          </div>
        ) : campaigns.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 p-8">
            <p className="text-sm font-semibold text-slate-600">No campaigns found.</p>
            <p className="text-xs text-slate-400 mt-1">Start a new fundraiser as a registered organizer.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {campaigns.map((c) => (
              <CampaignCard
                key={c._id}
                campaign={c}
                onDonateClick={handleOpenDonate}
              />
            ))}
          </div>
        )}

      </section>

      {/* 3. How It Works (3 Steps) */}
      <section className="bg-white border-y border-slate-200 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Simple & Transparent</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">How KindredHeart Works</h2>
            <p className="text-xs text-slate-500 mt-2">Giving made simple, transparent, and trustworthy.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            
            {/* Step 1 */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-700 font-extrabold text-lg rounded-2xl flex items-center justify-center mx-auto mb-4">
                1
              </div>
              <h3 className="font-bold text-slate-900 text-base mb-1">Discover Causes</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Explore vetted community campaigns across healthcare, disaster relief, education, and animal welfare.
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-700 font-extrabold text-lg rounded-2xl flex items-center justify-center mx-auto mb-4">
                2
              </div>
              <h3 className="font-bold text-slate-900 text-base mb-1">Donate Instantly</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Contribute securely in your preferred currency (EUR, USD, GBP) with live exchange rate calculations.
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-700 font-extrabold text-lg rounded-2xl flex items-center justify-center mx-auto mb-4">
                3
              </div>
              <h3 className="font-bold text-slate-900 text-base mb-1">Get Digital Receipt</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Receive an instant digital receipt complete with a verifiable transaction ID and printable summary.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* 4. Donation Flow Modal */}
      <DonationModal
        campaign={selectedCampaign}
        isOpen={isDonateOpen}
        onClose={() => setIsDonateOpen(false)}
        onDonationSuccess={handleDonationSuccess}
      />

      {/* 5. Digital Receipt Modal */}
      <ReceiptModal
        donation={receiptDonation}
        campaign={receiptCampaign}
        isOpen={!!receiptDonation}
        onClose={() => setReceiptDonation(null)}
      />

    </div>
  );
};

export default Home;
