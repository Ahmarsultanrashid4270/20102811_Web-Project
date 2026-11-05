// ==============================================================================
// DONATION ROUTES (backend/src/routes/donationRoutes.js)
// Paise Bhejne Aur Receipts Ke URL Endpoints
// Roman Urdu Comments: Har line ki asaan wazahat
// ==============================================================================

// 1. Express Router create karna
const express = require('express');
const router = express.Router();

// 2. Donation Controller se functions import karna
const {
  createDonation,
  getCampaignDonations,
  getMyDonations,
  getAllDonations
} = require('../controllers/donationController');

// 3. Security guards import karna
const { protect, authorize } = require('../middleware/authMiddleware');

// 4. Public Routes
// Paise donate karna: POST /api/donations (Guest aur Registered dono kar sakte hain)
router.post('/', createDonation);

// Kisi campaign ke donors aur messages dekhna: GET /api/donations/campaign/:campaignId
router.get('/campaign/:campaignId', getCampaignDonations);

// 5. Protected Routes
// Login donor ki apni donation history dekhna: GET /api/donations/my-history
router.get('/my-history', protect, getMyDonations);

// Poori website ki saari donations dekhna: GET /api/donations/admin/all (Sirf Admin)
router.get('/admin/all', protect, authorize('admin'), getAllDonations);

// Router export karna
module.exports = router;
