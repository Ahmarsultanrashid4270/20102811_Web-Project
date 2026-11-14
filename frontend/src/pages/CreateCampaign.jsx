// ==============================================================================
// CREATE CAMPAIGN PAGE (frontend/src/pages/CreateCampaign.jsx)
// Organizer Portal: Naya Fundraiser Shuru Karne Ka Form
// Roman Urdu Comments: Har line, validation aur state ki asaan wazahat
// ==============================================================================

// 1. React hooks, Router aur Auth Context import karna
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Fast demo images for organizers
const sampleImages = [
  { label: 'Healthcare', url: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80' },
  { label: 'Education', url: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=80' },
  { label: 'Disaster Relief', url: 'https://images.unsplash.com/photo-1547496502-affa22d38842?auto=format&fit=crop&w=800&q=80' },
  { label: 'Animals', url: 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=800&q=80' }
];

const CreateCampaign = () => {
  // 2. Form States
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Healthcare');
  const [targetAmount, setTargetAmount] = useState('');
  const [beneficiaryName, setBeneficiaryName] = useState('');
  const [location, setLocation] = useState('Dublin, Ireland');
  const [imageUrl, setImageUrl] = useState(sampleImages[0].url);
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { user } = useAuth();
  const navigate = useNavigate();

  /**
   * 3. handleSubmit: Form validation aur backend API ko campaign data bhejna
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Check karna ke zaroori boxes khali na hon
    if (!title || !description || !targetAmount || !beneficiaryName) {
      setError('Please fill in all required fields.');
      return;
    }

    setLoading(true);

    try {
      // Backend ko POST request bhejna Authorization token ke sath
      const response = await fetch('/api/campaigns', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`
        },
        body: JSON.stringify({
          title,
          category,
          targetAmount: Number(targetAmount),
          beneficiaryName,
          location,
          imageUrl,
          description
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error creating campaign');
      }

      // Kamyabi par naye bane huay cause ke live page par redirect kar do
      navigate(`/campaigns/${data.data._id}`);
    } catch (err) {
      setError(err.message || 'Error publishing campaign');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xl space-y-6">
        
        {/* Header */}
        <div>
          <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full uppercase tracking-wider">
            Organizer Portal
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
            Start a Fundraising Campaign
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Provide transparent details about your cause to inspire donor trust.
          </p>
        </div>

        {/* Error Alert Box */}
        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl font-medium">
            {error}
          </div>
        )}

        {/* Form Container */}
        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Title Box */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Campaign Title *</label>
            <input
              type="text"
              required
              placeholder="e.g. Winter Warmth & Food Aid for Elderly Shelters"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-slate-50"
            />
          </div>

          {/* Category & Target Amount Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Category *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-slate-50 font-medium"
              >
                <option value="Healthcare">Healthcare</option>
                <option value="Education">Education</option>
                <option value="Disaster Relief">Disaster Relief</option>
                <option value="Poverty">Poverty Alleviation</option>
                <option value="Environment">Environment & Clean Water</option>
                <option value="Animal Welfare">Animal Welfare</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Target Funding Goal (EUR €) *</label>
              <input
                type="number"
                min="10"
                required
                placeholder="e.g. 5000"
                value={targetAmount}
                onChange={(e) => setTargetAmount(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-slate-50"
              />
            </div>
          </div>

          {/* Beneficiary Name & Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Beneficiary Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Dublin Care Centre"
                value={beneficiaryName}
                onChange={(e) => setBeneficiaryName(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-slate-50"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Location</label>
              <input
                type="text"
                placeholder="e.g. Dublin, Ireland"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-slate-50"
              />
            </div>
          </div>

          {/* Cover Image URL & Quick Sample Buttons */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Cover Image URL</label>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-slate-50 mb-2"
            />
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-slate-400 font-bold uppercase">Quick Samples:</span>
              {sampleImages.map((img) => (
                <button
                  type="button"
                  key={img.label}
                  onClick={() => setImageUrl(img.url)}
                  className="text-[10px] text-slate-600 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 px-2 py-0.5 rounded border border-slate-200 transition-colors"
                >
                  {img.label}
                </button>
              ))}
            </div>
          </div>

          {/* Detailed Story */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Detailed Story / Purpose *</label>
            <textarea
              rows="5"
              required
              placeholder="Explain why this fundraiser is necessary, who benefits, and how funds will be spent..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-slate-50"
            ></textarea>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl shadow-md shadow-emerald-600/30 transition-all disabled:opacity-50"
          >
            {loading ? 'Publishing...' : 'Publish Campaign'}
          </button>

        </form>

      </div>
    </div>
  );
};

export default CreateCampaign;
