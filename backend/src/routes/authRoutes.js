// ==============================================================================
// AUTH ROUTES (backend/src/routes/authRoutes.js)
// Login Aur Registration Ke URL Endpoints
// Roman Urdu Comments: Har line ki asaan wazahat
// ==============================================================================

// 1. Express Router create karna
const express = require('express');
const router = express.Router();

// 2. Auth Controller se functions import karna
const { registerUser, loginUser, getUserProfile } = require('../controllers/authController');

// 3. Security Middleware import karna (Token check karne ke liye)
const { protect } = require('../middleware/authMiddleware');

// 4. Public Routes (In ke liye login hone ki zaroorat nahi hai)
// Naya account banana: POST /api/auth/register
router.post('/register', registerUser);

// Login karna: POST /api/auth/login
router.post('/login', loginUser);

// 5. Protected Route (Is raste par janay ke liye JWT Token laazmi hai)
// Apni profile dekhna: GET /api/auth/profile
router.get('/profile', protect, getUserProfile);

// Router export karna taake server.js mein use ho sakay
module.exports = router;
