// ==============================================================================
// CAMPAIGN ROUTES (backend/src/routes/campaignRoutes.js)
// Charity Campaigns Ke Saare URL Endpoints
// Roman Urdu Comments: Har line ki asaan wazahat
// ==============================================================================

// 1. Express Router create karna
const express = require('express');
const router = express.Router();

// 2. Campaign Controller se functions import karna
const {
  getCampaigns,
  getCampaignById,
  createCampaign,
  updateCampaign,
  deleteCampaign,
  getMyCampaigns
} = require('../controllers/campaignController');

// 3. Security guards import karna
const { protect, authorize } = require('../middleware/authMiddleware');

// 4. Public Routes (Koi bhi user ya guest dekh sakta hai)
// Saari campaigns ki list hasil karna: GET /api/campaigns
router.get('/', getCampaigns);

// Kisi ek specific campaign ki details hasil karna: GET /api/campaigns/:id
router.get('/:id', getCampaignById);

// 5. Protected Routes (Login aur sahi Role hona zaroori hai)
// Organizer ki apni banayi hui campaigns ki list: GET /api/campaigns/organizer/my-campaigns
router.get('/organizer/my-campaigns', protect, getMyCampaigns);

// Nayi campaign banana: POST /api/campaigns (Sirf 'organizer' ya 'admin')
router.post('/', protect, authorize('organizer', 'admin'), createCampaign);

// Purani campaign edit karna: PUT /api/campaigns/:id (Sirf 'organizer' ya 'admin')
router.put('/:id', protect, authorize('organizer', 'admin'), updateCampaign);

// Campaign ko delete karna: DELETE /api/campaigns/:id (Sirf 'organizer' ya 'admin')
router.delete('/:id', protect, authorize('organizer', 'admin'), deleteCampaign);

// Router export karna
module.exports = router;
