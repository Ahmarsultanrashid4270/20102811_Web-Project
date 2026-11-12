// ==============================================================================
// CAMPAIGN DETAILS PAGE (frontend/src/pages/CampaignDetails.jsx)
// Cause Ki Kahani, 85/10/5 Transparency Allocation, Recent Donors Wall Aur Donate Button
// Roman Urdu Comments: Har line aur calculation ki asaan wazahat
// ==============================================================================

// 1. React hooks, URL parameters aur Components import karna
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import DonationModal from '../components/DonationModal';
import ReceiptModal from '../components/ReceiptModal';
import { useCurrency } from '../context/CurrencyContext';

const CampaignDetails = () => {
  const { id } = useParams(); // URL se campaign ki MongoDB ID lena (e.g. /campaigns/666...)
  const { formatAmount } = useCurrency();

  // 2. States
  const [campaign, setCampaign] = useState(null);
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDonateOpen, setIsDonateOpen] = useState(false);
  const [receiptDonation, setReceiptDonation] = useState(null);

  /**
   * 3. fetchDetails: Backend se campaign aur iske donors ka record lana
   */
  const fetchDetails = async () => {
    try {
      // Step A: Campaign data fetch karna
      const campRes = await fetch(`/api/campaigns/${id}`);
      const campData = await campRes.json();
      if (campData.success) {
        setCampaign(campData.data);
      }

      // Step B: Is campaign ke recent supporters/donations fetch karna
      const donRes = await fetch(`/api/donations/campaign/${id}`);
      const donData = await donRes.json();
      if (donData.success) {
        setDonations(donData.data);
      }
    } catch (err) {
      console.warn('Backend connection error');
    } finally {
      setLoading(false);
    }
  };

  // Jab bhi ID badle toh details fetch karo
  useEffect(() => {
    fetchDetails();
  }, [id]);

  // Donation kamyab hone par total amount aur supporters list refresh karo
  const handleDonationSuccess = (donation, c) => {
    setReceiptDonation(donation);
    fetchDetails();
  };

  // Agar data load ho raha ho
  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center text-slate-400 text-sm">
        Loading campaign story...
      </div>
    );
  }

  // Agar ID database mein na milay
  if (!campaign) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <h2 className="text-xl font-bold text-slate-900">Campaign Not Found</h2>
        <p className="text-xs text-slate-500 mt-2 mb-4">The fundraiser you are looking for does not exist or has been removed.</p>
        <Link to="/campaigns" className="text-xs font-bold text-emerald-600 hover:underline">← Back to all campaigns</Link>
      </div>
    );
  }

  // Progress Percentage calculate karna (Raised / Target * 100)
  const percent = Math.min(100, Math.round((campaign.raisedAmount / campaign.targetAmount) * 100));

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Back to causes button */}
      <Link to="/campaigns" className="inline-flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-emerald-600 transition-colors mb-6">
        ← Back to causes
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column (2 spans): Picture, Story, Transparency Model, Supporters Wall */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Cover Image */}
          <div className="rounded-3xl overflow-hidden border border-slate-200 bg-slate-100 shadow-sm">
            <img
              src={campaign.imageUrl}
              alt={campaign.title}
              className="w-full h-80 object-cover"
              onError={(e) => {
                e.target.src = 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?auto=format&fit=crop&w=800&q=80';
              }}
            />
          </div>

          {/* Title & Beneficiary Location */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                {campaign.category}
              </span>
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <svg className="w-3.5 h-3.5 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" />
                </svg>
                <span>{campaign.location}</span>
              </span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {campaign.title}
            </h1>

            <p className="text-xs text-slate-500 mt-2">
              Organized by <strong className="text-slate-800">{campaign.organizerName || 'Community Partner'}</strong> on behalf of <strong className="text-slate-800">{campaign.beneficiaryName}</strong>
            </p>
          </div>

          {/* Detailed Story */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">About this Fundraiser</h3>
            <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
              {campaign.description}
            </p>
          </div>

          {/* 85% / 10% / 5% Fund Allocation Transparency Model */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">Fund Allocation Transparency</h3>
            <p className="text-xs text-slate-500">Every euro contributed is strictly accounted for:</p>
            <div className="space-y-2 pt-2">
              {/* 85% Direct Aid */}
              <div className="flex justify-between text-xs font-medium">
                <span className="text-slate-700">Direct Aid & Necessary Supplies</span>
                <span className="font-bold text-emerald-600">85%</span>
              </div>
              <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full w-[85%]"></div>
              </div>

              {/* 10% Logistics */}
              <div className="flex justify-between text-xs font-medium pt-1">
                <span className="text-slate-700">Logistics & Transportation</span>
                <span className="font-bold text-blue-600">10%</span>
              </div>
              <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="bg-blue-500 h-full w-[10%]"></div>
              </div>

              {/* 5% Monitoring */}
              <div className="flex justify-between text-xs font-medium pt-1">
                <span className="text-slate-700">Monitoring & Operational Compliance</span>
                <span className="font-bold text-slate-600">5%</span>
              </div>
              <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="bg-slate-500 h-full w-[5%]"></div>
              </div>
            </div>
          </div>

          {/* Recent Supporters (Donor Wall) */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4">
              Recent Supporters ({donations.length})
            </h3>

            {donations.length === 0 ? (
              <p className="text-xs text-slate-400 italic">No contributions yet. Be the first to support this cause!</p>
            ) : (
              <div className="space-y-3">
                {donations.map((d) => (
                  <div key={d._id} className="p-3 bg-slate-50 rounded-2xl flex items-start justify-between border border-slate-100 text-xs">
                    <div>
                      <p className="font-bold text-slate-800">{d.donorName}</p>
                      {d.message && <p className="text-slate-600 italic mt-0.5">"{d.message}"</p>}
                      <span className="text-[10px] text-slate-400 mt-1 block">
                        {new Date(d.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <span className="font-extrabold text-emerald-600 text-sm whitespace-nowrap ml-3">
                      {formatAmount(d.amount)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Right Column (1 span): Sticky Goal & Donate Action Card */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-md space-y-6">
            
            {/* Total Raised & Goal */}
            <div>
              <span className="text-xs text-slate-400 font-semibold uppercase">Total Raised</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl font-extrabold text-slate-900">{formatAmount(campaign.raisedAmount)}</span>
                <span className="text-xs text-slate-500 font-medium">of {formatAmount(campaign.targetAmount)} goal</span>
              </div>
            </div>

            {/* Progress Bar */}
            <div>
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden mb-2">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                  style={{ width: `${percent}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-xs font-semibold text-slate-600">
                <span>{percent}% funded</span>
                <span>{campaign.donorCount} supporters</span>
              </div>
            </div>

            {/* Big Donate Action Button */}
            <button
              onClick={() => setIsDonateOpen(true)}
              className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm rounded-2xl shadow-lg shadow-emerald-600/30 transition-all hover:scale-105"
            >
              Donate Now
            </button>

            {/* Trust Bullet Points */}
            <div className="text-[11px] text-slate-400 space-y-1.5 pt-2 border-t border-slate-100">
              <p className="flex items-center gap-1.5">✓ Instant digital receipt generated</p>
              <p className="flex items-center gap-1.5">✓ Live multi-currency conversion</p>
              <p className="flex items-center gap-1.5">✓ Anonymous donation supported</p>
            </div>

          </div>
        </div>

      </div>

      {/* Modals */}
      <DonationModal
        campaign={campaign}
        isOpen={isDonateOpen}
        onClose={() => setIsDonateOpen(false)}
        onDonationSuccess={handleDonationSuccess}
      />

      <ReceiptModal
        donation={receiptDonation}
        campaign={campaign}
        isOpen={!!receiptDonation}
        onClose={() => setReceiptDonation(null)}
      />

    </div>
  );
};

export default CampaignDetails;
