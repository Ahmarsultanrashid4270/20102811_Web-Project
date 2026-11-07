// ==============================================================================
// RECEIPT MODAL COMPONENT (frontend/src/components/ReceiptModal.jsx)
// Digital Tax Donation Receipt Slip Aur Print Dialog
// Roman Urdu Comments: Har line aur feature ki asaan wazahat
// ==============================================================================

// 1. React aur Currency context import karna
import React from 'react';
import { useCurrency } from '../context/CurrencyContext';

const ReceiptModal = ({ donation, campaign, isOpen, onClose }) => {
  const { symbol } = useCurrency();

  // Agar modal open na ho ya donation data na ho toh kuch mat dikhao
  if (!isOpen || !donation) return null;

  // 2. handlePrint: Browser ka official printer dialogue box kholna
  const handlePrint = () => {
    window.print(); // Native browser print command
  };

  // 3. Tareekh aur time ko khubsurat format mein badalna (e.g. 7 Nov 2026, 19:45)
  const formattedDate = new Date(donation.createdAt || Date.now()).toLocaleDateString('en-IE', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    // Backdrop overlay
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-100 relative print:shadow-none print:border-none">
        
        {/* Success Tick Vector Icon */}
        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>

        {/* Modal Title */}
        <h2 className="text-xl font-extrabold text-slate-900 text-center">
          Thank You for Your Generous Support!
        </h2>
        <p className="text-xs text-slate-500 text-center mt-1 mb-6">
          Your donation has been recorded. Here is your official verifiable tax receipt.
        </p>

        {/* Digital Receipt Slip (Dashed border jaise asal parchi hoti hai) */}
        <div className="bg-slate-50 border border-dashed border-slate-300 rounded-2xl p-5 space-y-3 text-xs mb-6">
          
          {/* Receipt Transaction ID */}
          <div className="flex justify-between items-center pb-2 border-b border-slate-200">
            <span className="text-slate-400 font-semibold uppercase text-[10px] tracking-wider">Receipt No.</span>
            <span className="font-mono font-bold text-slate-800">{donation.transactionId}</span>
          </div>

          {/* Date & Time */}
          <div className="flex justify-between items-center">
            <span className="text-slate-500">Date & Time:</span>
            <span className="font-semibold text-slate-800">{formattedDate}</span>
          </div>

          {/* Donor Name */}
          <div className="flex justify-between items-center">
            <span className="text-slate-500">Donor:</span>
            <span className="font-semibold text-slate-800">{donation.donorName}</span>
          </div>

          {/* Cause Name */}
          <div className="flex justify-between items-center">
            <span className="text-slate-500">Cause:</span>
            <span className="font-semibold text-slate-800 text-right line-clamp-1 max-w-[200px]">
              {campaign ? campaign.title : donation.campaignTitle}
            </span>
          </div>

          {/* Payment Method */}
          <div className="flex justify-between items-center">
            <span className="text-slate-500">Payment:</span>
            <span className="font-semibold text-slate-800">{donation.paymentMethod}</span>
          </div>

          {/* Total Donated Amount (Prominent Green) */}
          <div className="flex justify-between items-center pt-3 border-t border-slate-200 text-sm">
            <span className="font-bold text-slate-900">Total Donated:</span>
            <span className="font-black text-emerald-600 text-lg">
              {symbol}{donation.amount}
            </span>
          </div>

        </div>

        {/* Action Buttons: Print Aur Done (Print ke waqt yeh buttons print nahi honge: print:hidden) */}
        <div className="grid grid-cols-2 gap-3 print:hidden">
          <button
            onClick={handlePrint}
            className="w-full py-2.5 px-4 border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5"
          >
            <svg className="w-3.5 h-3.5 text-slate-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 6 2 18 2 18 9" /><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" /><rect width="12" height="8" x="6" y="14" />
            </svg>
            <span>Print Receipt</span>
          </button>
          <button
            onClick={onClose}
            className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-sm transition-colors"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};

export default ReceiptModal;
