// ==============================================================================
// CAMPAIGN CARD COMPONENT (frontend/src/components/CampaignCard.jsx)
// Reusable Charity Card: Cover Image, Progress Bar Aur Quick Action Buttons
// Roman Urdu Comments: Har line aur calculation ki asaan wazahat
// ==============================================================================

// 1. React aur hooks import karna
import React from 'react';
import { Link } from 'react-router-dom';
import { useCurrency } from '../context/CurrencyContext'; // Euro ko user ki currency mein format karne ke liye

const CampaignCard = ({ campaign, onDonateClick }) => {
  const { formatAmount } = useCurrency();

  // 2. Percentage Formula: (Raised Amount / Target Goal) * 100
  // Math.min(100, ...) se yeh ensure hota hai ke progress bar 100% se bahar na nikle
  const percent = Math.min(100, Math.round((campaign.raisedAmount / campaign.targetAmount) * 100));

  // 3. Category ke mutabiq khubsurat rang (Colors) tay karna
  const categoryColors = {
    'Healthcare': 'bg-rose-50 text-rose-700 border-rose-200',
    'Education': 'bg-blue-50 text-blue-700 border-blue-200',
    'Disaster Relief': 'bg-amber-50 text-amber-700 border-amber-200',
    'Poverty': 'bg-emerald-50 text-emerald-700 border-emerald-200',
    'Clean Water & Climate': 'bg-cyan-50 text-cyan-700 border-cyan-200',
    'Animal Welfare': 'bg-purple-50 text-purple-700 border-purple-200'
  };

  const badgeClass = categoryColors[campaign.category] || 'bg-slate-100 text-slate-700 border-slate-200';

  return (
    // Card Container: Hover par shadow aur scale effect deta hai
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col h-full group">
      
      {/* Cover Image Aur Category Badge */}
      <div className="relative h-48 w-full overflow-hidden bg-slate-100">
        <img
          src={campaign.imageUrl}
          alt={campaign.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          // Agar image ka link toot jaye toh default photo lagao
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?auto=format&fit=crop&w=800&q=80';
          }}
        />
        <span className={`absolute top-3 left-3 text-[11px] font-bold px-2.5 py-1 rounded-full border shadow-sm ${badgeClass}`}>
          {campaign.category}
        </span>
      </div>

      {/* Card Content Area */}
      <div className="p-5 flex-1 flex flex-col">
        {/* Cause Ka Title */}
        <h3 className="font-bold text-slate-900 text-base line-clamp-1 mb-1.5 hover:text-emerald-600 transition-colors">
          <Link to={`/campaigns/${campaign._id}`}>{campaign.title}</Link>
        </h3>
        
        {/* Chhoti Summary (2 lines clamp) */}
        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-4">
          {campaign.description}
        </p>

        {/* Progress Bar & Amounts (Card ke bottom par chipka hua) */}
        <div className="mt-auto pt-3 border-t border-slate-100">
          <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
            {/* Raised Amount (Formatted currency) */}
            <span className="text-emerald-700 font-bold">{formatAmount(campaign.raisedAmount)} raised</span>
            {/* Target Goal */}
            <span className="text-slate-400">Goal: {formatAmount(campaign.targetAmount)}</span>
          </div>

          {/* Dynamic Green Progress Bar */}
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden mb-3">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all duration-500"
              style={{ width: `${percent}%` }} // CSS width dynamically set hoti hai (e.g. 63%)
            ></div>
          </div>

          {/* Donors Count Aur Percentage Text */}
          <div className="flex items-center justify-between text-[11px] text-slate-500 mb-4">
            <span className="flex items-center gap-1.5 font-medium">
              {/* Users Vector Icon */}
              <svg className="w-3.5 h-3.5 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
              {campaign.donorCount} Donors
            </span>
            <span className="font-semibold text-slate-700">{percent}% Funded</span>
          </div>

          {/* Action Buttons: Details Aur Donate Now */}
          <div className="grid grid-cols-2 gap-2">
            <Link
              to={`/campaigns/${campaign._id}`}
              className="text-center text-xs font-semibold py-2 px-3 border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-700 transition-colors"
            >
              Details
            </Link>
            <button
              onClick={() => onDonateClick(campaign)} // Click karne par donation popup khulega
              className="text-center text-xs font-bold py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-sm shadow-emerald-600/20 transition-all hover:shadow"
            >
              Donate Now
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};

export default CampaignCard;
