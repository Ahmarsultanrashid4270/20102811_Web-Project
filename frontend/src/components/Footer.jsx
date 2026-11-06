// ==============================================================================
// FOOTER COMPONENT (frontend/src/components/Footer.jsx)
// Website Ka Sab Se Nichla Hissa: About, Links, Trust Badges Aur Legal Info
// Roman Urdu Comments: Har section ki asaan wazahat
// ==============================================================================

// 1. React aur Router Link import karna
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    // Dark background footer container
    <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top 4-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-slate-800">
          
          {/* Column 1 & 2: Platform Mission & Logo */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
              </span>
              <span className="font-bold text-white text-lg">KindredHeart</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              KindredHeart is a transparent community donation platform connecting verified charities with compassionate supporters worldwide. Every contribution is tracked directly to its cause.
            </p>
          </div>

          {/* Column 3: Category Quick Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">Explore Causes</h4>
            <ul className="text-xs space-y-2 text-slate-400">
              <li><Link to="/campaigns" className="hover:text-emerald-400 transition-colors">Healthcare & Medical</Link></li>
              <li><Link to="/campaigns" className="hover:text-emerald-400 transition-colors">Disaster & Flood Relief</Link></li>
              <li><Link to="/campaigns" className="hover:text-emerald-400 transition-colors">Clean Water & Climate</Link></li>
              <li><Link to="/campaigns" className="hover:text-emerald-400 transition-colors">Children & Education</Link></li>
              <li><Link to="/campaigns" className="hover:text-emerald-400 transition-colors">Animal Welfare</Link></li>
            </ul>
          </div>

          {/* Column 4: Trust & Security Badges (SVG Icons) */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">Trust & Security</h4>
            <ul className="text-xs space-y-2 text-slate-400">
              <li className="flex items-center gap-1.5"><svg className="w-3.5 h-3.5 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg> <span>Verified Organizers</span></li>
              <li className="flex items-center gap-1.5"><svg className="w-3.5 h-3.5 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg> <span>Instant Tax Receipts</span></li>
              <li className="flex items-center gap-1.5"><svg className="w-3.5 h-3.5 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg> <span>Transparent Fund Tracking</span></li>
              <li className="flex items-center gap-1.5"><svg className="w-3.5 h-3.5 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg> <span>Encrypted Transactions</span></li>
            </ul>
          </div>

        </div>

        {/* Bottom Copyright & Legal Links */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <p>© 2026 KindredHeart Foundation. All rights reserved.</p>
          <div className="flex gap-4 mt-2 sm:mt-0">
            <span className="hover:text-slate-400 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-400 cursor-pointer">Terms of Service</span>
            <span className="hover:text-slate-400 cursor-pointer">Audit Reports</span>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
