// ==============================================================================
// AUTHENTICATION & AUTHORIZATION MIDDLEWARE (backend/src/middleware/authMiddleware.js)
// Security Guard: JWT Token Check Aur Role Permission Control
// Roman Urdu Comments: Har line ki asaan wazahat
// ==============================================================================

// 1. JWT (JSON Web Token) aur User model import karna
const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * 2. protect: Yeh function check karta hai ke user login hai ya nahi
 */
const protect = async (req, res, next) => {
  let token;

  // Request ke headers mein Authorization header check karna (jaise "Bearer eyJhbGciOi...")
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Space se split kar ke sirf Token ka hissa nikalna
      token = req.headers.authorization.split(' ')[1];

      // Token ko verify karna secret key ke sath
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secretkey123');

      // Database se user ka data lana, lekin password ko chhor kar (-password)
      req.user = await User.findById(decoded.id).select('-password');

      // Agar user database mein na milay
      if (!req.user) {
        return res.status(401).json({ success: false, message: 'User for this token no longer exists' });
      }

      // Agar sab theek hai toh aglay controller ko rasta de do (next)
      next();
    } catch (error) {
      console.error('JWT Verification Error:', error.message);
      return res.status(401).json({ success: false, message: 'Not authorized: Token is invalid or expired' });
    }
  }

  // Agar user ne token bheja hi nahi
  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized: No authentication token provided' });
  }
};

/**
 * 3. authorize: Yeh function user ka Role check karta hai (e.g. Sirf Organizer ya Admin)
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    // Agar user ka role allowed roles ki list mein nahi hai
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: Insufficient role permissions'
      });
    }
    // Agar role match ho jaye toh agay janay do
    next();
  };
};

// Export karna taake routes mein use ho sakay
module.exports = { protect, authorize };
