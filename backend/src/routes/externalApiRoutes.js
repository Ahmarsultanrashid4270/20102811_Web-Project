// ==============================================================================
// EXTERNAL API ROUTES (backend/src/routes/externalApiRoutes.js)
// Third-Party Currency Rates Ka Endpoint
// Roman Urdu Comments: Har line ki asaan wazahat
// ==============================================================================

// 1. Express Router create karna
const express = require('express');
const router = express.Router();

// 2. Controller se exchange rates ka function import karna
const { getExchangeRates } = require('../controllers/externalApiController');

// 3. Live currency rates ka public endpoint: GET /api/external/rates
// Frontend par EUR, USD, GBP live convert karne ke liye
router.get('/rates', getExchangeRates);

// Router export karna
module.exports = router;
