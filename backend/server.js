// ==============================================================================
// MAIN SERVER ENTRY POINT (backend/server.js)
// KindredHeart - Donation Management System
// Roman Urdu Comments: Har line ki asaan wazahat
// ==============================================================================

// 1. .env file se secret keys aur configuration variables load karna
require('dotenv').config();

// 2. Express library ko import karna (jo hamara web server banati hai)
const express = require('express');

// 3. CORS library (Cross-Origin Resource Sharing) import karna
// Iska faida: Frontend (React) ko Backend (Express) se data mangne ki ijazat milti hai
const cors = require('cors');

// 4. Database connection function ko import karna
const connectDB = require('./src/config/db');

// 5. Saare raste (Route Handlers) import karna
const authRoutes = require('./src/routes/authRoutes');         // Login aur Register ke raste
const campaignRoutes = require('./src/routes/campaignRoutes'); // Charity campaigns dekhne/banane ke raste
const donationRoutes = require('./src/routes/donationRoutes'); // Paise donate karne aur receipt ke raste
const externalApiRoutes = require('./src/routes/externalApiRoutes'); // Live currency exchange rates ka rasta

// 6. Express application ka main instance create karna
const app = express();

// 7. Initial MongoDB Database connection call
connectDB();

// 8. CORS Middleware configure karna
// Yeh frontend browser ko bataata hai ke requests allow hain
app.use(cors({
  origin: '*', // Har address se request qabool karo
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP actions
  allowedHeaders: ['Content-Type', 'Authorization'] // Headers jo client bhej sakta hai
}));

// 9. Body-parser middleware
// Jab user form submit karta hai toh JSON data ko JavaScript object mein convert karta hai
app.use(express.json());

// URL-encoded form data ko parse karne ke liye
app.use(express.urlencoded({ extended: true }));

// Serverless DB connection middleware: API calls chalne se pehle DB connection ensure karta hai
app.use(async (req, res, next) => {
  if (req.path.startsWith('/api') && req.path !== '/api/health') {
    try {
      await connectDB();
    } catch (e) {
      console.error('[DB Middleware Error]', e.message);
    }
  }
  next();
});

// 10. Health Check Route (Server ki sehat check karne ka rasta)
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    message: 'Donation Management System API is healthy',
    timestamp: new Date().toISOString()
  });
});

// 11. Saare API Routes ko URL ke sath jodna (Mounting)
app.use('/api/auth', authRoutes);         // /api/auth/register aur /api/auth/login
app.use('/api/campaigns', campaignRoutes); // /api/campaigns
app.use('/api/donations', donationRoutes); // /api/donations
app.use('/api/external', externalApiRoutes); // /api/external/currency-rates

// 12. 404 Route Not Found Middleware
// Agar koi aisa URL khole jo exist nahi karta toh yeh message jayega
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `API Route not found: ${req.method} ${req.originalUrl}`
  });
});

// 13. Centralized Error Handling Middleware (Ghalti sambhalne wala code)
// Agar poore server mein kahin bhi koi error aaye toh yeh usay catch karta hai
app.use((err, req, res, next) => {
  console.error('[Unhandled Error]', err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error occurred',
    // Agar development mode hai toh error detail dikhao
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// 14. Server ko port par start (listen) karna
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Donation Management Server running on port ${PORT}`);
  console.log(`Base URL: http://localhost:${PORT}/api/health`);
});

// Test suite ya serverless lambda ke liye app ko export karna
module.exports = app;
