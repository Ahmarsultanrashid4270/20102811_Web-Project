// ==============================================================================
// USER DASHBOARD (frontend/src/pages/Dashboard.jsx)
// Donors Ke Liye Donation History Ledger Aur Organizers Ke Liye Campaign Manager
// Roman Urdu Comments: Har line, lifecycle aur role-based rendering ki asaan wazahat
// ==============================================================================

// 1. React hooks, Router aur Contexts import karna
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCurrency } from '../context/CurrencyContext';
import ReceiptModal from '../components/ReceiptModal';

const Dashboard = () => {
  const { user } = useAuth();
  const { formatAmount } = useCurrency();
  const navigate = useNavigate();

  // 2. States
  const [myDonations, setMyDonations] = useState([]);
  const [myCampaigns, setMyCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeReceipt, setActiveReceipt] = useState(null); // Receipt popup dekhne ke liye

  /**
   * 3. fetchData: User ke role ke mutabiq records lana
   */
  useEffect(() => {
    // Agar user login nahi hai toh login page par redirect kar do
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchData = async () => {
      try {
        // Step A: Agar Donor hai toh iski purani donations fetch karo
        const donRes = await fetch('/api/donations/my-history', {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        const donData = await donRes.json();
        if (donData.success) {
          setMyDonations(donData.data || []);
        }

        // Step B: Agar Organizer ya Admin hai toh iski banayi huwi campaigns fetch karo
        if (user.role === 'organizer' || user.role === 'admin') {
          const campRes = await fetch('/api/campaigns/organizer/my-campaigns', {
            headers: { Authorization: `Bearer ${user.token}` }
          });
          const campData = await campRes.json();
          if (campData.success) {
            setMyCampaigns(campData.data || []);
          }
        }
      } catch (err) {
        console.warn('Dashboard data fetch error');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, navigate]);

  /**
   * 4. handleDeleteCampaign: Organizer apni campaign ko delete kar sakta hai
   */
  const handleDeleteCampaign = async (campaignId) => {
    if (!window.confirm('Are you sure you want to delete this campaign?')) return;

    try {
      const res = await fetch(`/api/campaigns/${campaignId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${user.token}` }
      });
      const data = await res.json();
      if (data.success) {
        // State se foran hata do bina page reload kiye
        setMyCampaigns((prev) => prev.filter((c) => c._id !== campaignId));
      } else {
        alert(data.message || 'Could not delete campaign');
      }
    } catch (e) {
      alert('Error deleting campaign');
    }
  };

  if (!user) return null;

  // Donor ki total di gayi raqam calculate karna
  const totalContributed = myDonations.reduce((acc, curr) => acc + (curr.amount || 0), 0);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* 1. Profile Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            {/* User Avatar Initial */}
            <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white font-extrabold text-xl flex items-center justify-center">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900">{user.name}</h1>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xs text-slate-500">{user.email}</span>
                {/* Role Badge */}
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  {user.role}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Start New Campaign Button (Sirf Organizer aur Admin ke liye) */}
        {(user.role === 'organizer' || user.role === 'admin') && (
          <Link
            to="/create-campaign"
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-600/30 transition-all self-start sm:self-auto"
          >
            + Start New Campaign
          </Link>
        )}
      </div>

      {/* 2. Organizer Section: My Created Campaigns */}
      {(user.role === 'organizer' || user.role === 'admin') && (
        <section className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-extrabold text-slate-900">
              My Created Campaigns ({myCampaigns.length})
            </h2>
          </div>

          {loading ? (
            <div className="text-xs text-slate-400">Loading your campaigns...</div>
          ) : myCampaigns.length === 0 ? (
            <div className="bg-white rounded-2xl p-6 border border-slate-200 text-center">
              <p className="text-xs font-semibold text-slate-700">You have not launched any campaigns yet.</p>
              <Link to="/create-campaign" className="text-xs font-bold text-emerald-600 hover:underline mt-1 inline-block">
                Start your first cause →
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {myCampaigns.map((camp) => (
                <div key={camp._id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                        {camp.category}
                      </span>
                      <span className="text-xs font-bold text-emerald-600">
                        {Math.min(100, Math.round((camp.raisedAmount / camp.targetAmount) * 100))}% Funded
                      </span>
                    </div>

                    <h3 className="font-bold text-slate-900 text-sm mb-1">{camp.title}</h3>
                    <p className="text-xs text-slate-500 line-clamp-2 mb-3">{camp.description}</p>
                    
                    <div className="text-xs text-slate-600 font-medium">
                      <strong>{formatAmount(camp.raisedAmount)}</strong> raised of {formatAmount(camp.targetAmount)} goal ({camp.donorCount} donors)
                    </div>
                  </div>

                  {/* Actions: View Live Page & Delete */}
                  <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-100">
                    <Link
                      to={`/campaigns/${camp._id}`}
                      className="text-xs font-bold text-slate-600 hover:text-emerald-600"
                    >
                      View Live Page →
                    </Link>
                    <button
                      onClick={() => handleDeleteCampaign(camp._id)}
                      className="text-xs font-bold text-rose-600 hover:text-rose-700 hover:bg-rose-50 px-2.5 py-1 rounded-lg transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* 3. Donor Section: Donation History Ledger Table */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-extrabold text-slate-900">My Donation History</h2>
            <p className="text-xs text-slate-500">Total Contributed: <strong className="text-emerald-600 font-bold">{formatAmount(totalContributed)}</strong></p>
          </div>
        </div>

        {loading ? (
          <div className="text-xs text-slate-400">Loading donation history...</div>
        ) : myDonations.length === 0 ? (
          <div className="bg-white rounded-2xl p-6 border border-slate-200 text-center">
            <p className="text-xs font-semibold text-slate-700">You have not made any donations yet.</p>
            <Link to="/campaigns" className="text-xs font-bold text-emerald-600 hover:underline mt-1 inline-block">
              Explore active causes →
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Receipt / Date</th>
                    <th className="py-3 px-4">Campaign Title</th>
                    <th className="py-3 px-4">Amount</th>
                    <th className="py-3 px-4">Method</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {myDonations.map((d) => (
                    <tr key={d._id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-3 px-4">
                        <span className="font-mono font-bold text-slate-800 block">{d.transactionId}</span>
                        <span className="text-[10px] text-slate-400">{new Date(d.createdAt).toLocaleDateString()}</span>
                      </td>
                      <td className="py-3 px-4 font-semibold text-slate-800">
                        {d.campaignTitle}
                      </td>
                      <td className="py-3 px-4 font-black text-emerald-600 text-sm">
                        {formatAmount(d.amount)}
                      </td>
                      <td className="py-3 px-4 text-slate-500">
                        {d.paymentMethod}
                      </td>
                      <td className="py-3 px-4 text-right">
                        {/* View Receipt Button */}
                        <button
                          onClick={() => setActiveReceipt(d)}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[11px] rounded-lg transition-colors"
                        >
                          View Receipt
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>

      {/* 4. Receipt Modal */}
      <ReceiptModal
        donation={activeReceipt}
        isOpen={!!activeReceipt}
        onClose={() => setActiveReceipt(null)}
      />

    </div>
  );
};

export default Dashboard;
