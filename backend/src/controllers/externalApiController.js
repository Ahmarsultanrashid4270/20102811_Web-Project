// ==============================================================================
// EXTERNAL API CONTROLLER (backend/src/controllers/externalApiController.js)
// Third-Party Web Service Integration: Live Currency Rates (EUR, USD, GBP, etc.)
// Roman Urdu Comments: Har line ki asaan wazahat
// ==============================================================================

// 1. Node.js ka built-in https module import karna
const https = require('https');

// 2. In-Memory Cache (Computer ki temporary memory):
// Taake har request par baar baar internet API ko tang na karna paray
let cachedRates = {
  EUR: 1.0,
  USD: 1.08,
  GBP: 0.86,
  CAD: 1.47,
  AUD: 1.65
};
let lastFetchTime = 0; // Aakhri dafa kab rates mangwaye thay

/**
 * 3. getExchangeRates: Live currency rates hasil karna
 * Route: GET /api/external/rates
 * Access: Public
 */
const getExchangeRates = async (req, res) => {
  const ONE_HOUR = 60 * 60 * 1000; // 1 ghante ka waqt (milliseconds mein)
  const now = Date.now();

  // Agar aakhri fetch ko abhi 1 ghanta nahi hua, toh seedha cache se purana rate de do
  if (now - lastFetchTime < ONE_HOUR) {
    return res.status(200).json({
      success: true,
      source: 'Cache (Fast Local Response)',
      base: 'EUR',
      rates: cachedRates
    });
  }

  // Agar 1 ghanta guzar chuka hai toh Open Exchange Rates API ko call karo
  const apiUrl = 'https://open.er-api.com/v6/latest/EUR';

  https.get(apiUrl, (apiRes) => {
    let data = '';

    // Chunk by chunk data jama karna
    apiRes.on('data', (chunk) => {
      data += chunk;
    });

    // Jab poora data receive ho jaye
    apiRes.on('end', () => {
      try {
        const parsed = JSON.parse(data); // JSON string ko JavaScript object banana
        if (parsed && parsed.rates) {
          // Naye live rates cache mein update karna
          cachedRates = {
            EUR: 1.0,
            USD: Number(parsed.rates.USD || 1.08).toFixed(2),
            GBP: Number(parsed.rates.GBP || 0.86).toFixed(2),
            CAD: Number(parsed.rates.CAD || 1.47).toFixed(2),
            AUD: Number(parsed.rates.AUD || 1.65).toFixed(2)
          };
          lastFetchTime = Date.now(); // Time update karo
        }

        res.status(200).json({
          success: true,
          source: 'Live External Web Service (open.er-api.com)',
          base: 'EUR',
          rates: cachedRates
        });
      } catch (e) {
        // Agar parsing mein masla aaye toh default rates bhej do
        res.status(200).json({
          success: true,
          source: 'Fallback Rates',
          base: 'EUR',
          rates: cachedRates
        });
      }
    });
  }).on('error', (err) => {
    // Agar internet band ho ya API fail ho jaye toh system crash nahi hoga, fallback rates jayenge
    console.warn('[External API Warning] Default rates par shift ho gaye:', err.message);
    res.status(200).json({
      success: true,
      source: 'Default Fallback (Internet Offline)',
      base: 'EUR',
      rates: cachedRates
    });
  });
};

// Function export karna
module.exports = { getExchangeRates };
