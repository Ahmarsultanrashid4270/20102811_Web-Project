// ==============================================================================
// CAMPAIGNS DIRECTORY PAGE (frontend/src/pages/Campaigns.jsx)
// Tamam Causes Ki List, Search Bar Aur Category Filters
// Roman Urdu Comments: Har line aur filtering function ki asaan wazahat
// ==============================================================================

// 1. React hooks aur Components import karna
import React, { useState, useEffect } from 'react';
import CampaignCard from '../components/CampaignCard';
import DonationModal from '../components/DonationModal';
import ReceiptModal from '../components/ReceiptModal';

// Category filter ke buttons ki list
const categories = ['All', 'Healthcare', 'Education', 'Disaster Relief', 'Poverty', 'Environment', 'Animal Welfare'];

const Campaigns = () => {
  // 2. States
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('All');     // Selected category
  const [search, setSearch] = useState('');           // Search input text
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [isDonateOpen, setIsDonateOpen] = useState(false);
  const [receiptDonation, setReceiptDonation] = useState(null);
  const [receiptCampaign, setReceiptCampaign] = useState(null);

  /**
   * 3. fetchCampaigns: Search aur Category ke parameters ke sath API call karna
   */
  const fetchCampaigns = async () => {
    setLoading(true);
    try {
      let url = '/api/campaigns?';
      if (category !== 'All') url += `category=${encodeURIComponent(category)}&`;
      if (search.trim()) url += `search=${encodeURIComponent(search.trim())}&`;

      const res = await fetch(url);
      const data = await res.json();
      if (data.success && data.data) {
        setCampaigns(data.data);
      }
    } catch (err) {
      console.warn('Backend connection error');
    } finally {
      setLoading(false);
    }
  };

  // Jab bhi user category badlay toh foran nayi campaigns fetch karo
  useEffect(() => {
    fetchCampaigns();
  }, [category]);

  // Search form submit hone par fetch karo
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchCampaigns();
  };

  // Donation open karne ka handler
  const handleOpenDonate = (campaign) => {
    setSelectedCampaign(campaign);
    setIsDonateOpen(true);
  };

  // Donation success hone par receipt dikhana aur data refresh karna
  const handleDonationSuccess = (donation, campaign) => {
    setReceiptDonation(donation);
    setReceiptCampaign(campaign);
    fetchCampaigns();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Page Title & Subtitle */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Explore Causes</h1>
        <p className="text-sm text-slate-500 mt-1">
          Browse verified community initiatives and support causes that matter to you.
        </p>
      </div>

      {/* Filter & Search Bar Container */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm mb-8 space-y-4">
        
        {/* Search Input Box */}
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <input
            type="text"
            placeholder="Search campaigns by keyword, beneficiary, or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 px-4 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-slate-50"
          />
          <button
            type="submit"
            className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm transition-colors"
          >
            Search
          </button>
        </form>

        {/* Category Pill Buttons */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)} // Click karne par category filter active ho jata hai
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                category === cat
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

      </div>

      {/* Results Grid */}
      {loading ? (
        <div className="text-center py-16 text-slate-400 text-sm">
          Loading fundraising campaigns...
        </div>
      ) : campaigns.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8">
          <p className="text-sm font-bold text-slate-700">No campaigns matched your search criteria.</p>
          <p className="text-xs text-slate-400 mt-1">Try searching with different keywords or clear the category filter.</p>
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

      {/* Modals */}
      <DonationModal
        campaign={selectedCampaign}
        isOpen={isDonateOpen}
        onClose={() => setIsDonateOpen(false)}
        onDonationSuccess={handleDonationSuccess}
      />

      <ReceiptModal
        donation={receiptDonation}
        campaign={receiptCampaign}
        isOpen={!!receiptDonation}
        onClose={() => setReceiptDonation(null)}
      />

    </div>
  );
};

export default Campaigns;
