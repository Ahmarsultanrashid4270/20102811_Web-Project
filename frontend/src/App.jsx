// ==============================================================================
// MAIN APP COMPONENT (frontend/src/App.jsx)
// Global State Providers, Routing Aur Layout Architecture
// Roman Urdu Comments: Har line ki asaan wazahat
// ==============================================================================

// 1. React aur React Router ke tools import karna
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// 2. Global Contexts import karna (Login State aur Currency Switcher)
import { AuthProvider } from './context/AuthContext';
import { CurrencyProvider } from './context/CurrencyContext';

// 3. Reusable Layout Components
import Navbar from './components/Navbar'; // Har page par upar dikhne wala header
import Footer from './components/Footer'; // Har page par neeche dikhne wala footer

// 4. Website ke Mukhtalif Pages
import Home from './pages/Home';                       // Homepage (Main Screen)
import Campaigns from './pages/Campaigns';             // Saare causes dekhne ka page
import CampaignDetails from './pages/CampaignDetails'; // Kisi ek cause ki story aur donate page
import Login from './pages/Login';                     // Sign In page
import Register from './pages/Register';               // Naya account banane ka page
import Dashboard from './pages/Dashboard';             // Personal portal (Donations history ya organizer causes)
import CreateCampaign from './pages/CreateCampaign';   // Naya cause start karne ka form

/**
 * 5. App Component: Poori website ka master container
 */
function App() {
  return (
    // AuthProvider: Poori app ko user login status ki khabar deta hai
    <AuthProvider>
      {/* CurrencyProvider: Poori app ko live currency rates (€, $, £) provide karta hai */}
      <CurrencyProvider>
        {/* Router: Browser ke URL ke mutabiq screen badalne ka intezam */}
        <Router>
          <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
            {/* Top Navigation Bar: Har waqt upar rehta hai */}
            <Navbar />
            
            {/* Main Content Area: Yahan url ke mutabiq page load hota hai */}
            <main className="flex-1">
              <Routes>
                {/* Route 1: Homepage */}
                <Route path="/" element={<Home />} />
                
                {/* Route 2: Causes Explorer with Category Filters */}
                <Route path="/campaigns" element={<Campaigns />} />
                
                {/* Route 3: Single Cause Details (URL mein ID hoti hai :id) */}
                <Route path="/campaigns/:id" element={<CampaignDetails />} />
                
                {/* Route 4: Sign In Page */}
                <Route path="/login" element={<Login />} />
                
                {/* Route 5: Sign Up Page */}
                <Route path="/register" element={<Register />} />
                
                {/* Route 6: Personal Dashboard */}
                <Route path="/dashboard" element={<Dashboard />} />
                
                {/* Route 7: Start New Campaign */}
                <Route path="/create-campaign" element={<CreateCampaign />} />
              </Routes>
            </main>
            
            {/* Bottom Footer: Har page ke aakhir mein rehta hai */}
            <Footer />
          </div>
        </Router>
      </CurrencyProvider>
    </AuthProvider>
  );
}

// App ko export karna
export default App;
