// ==============================================================================
// AUTH CONTROLLER (backend/src/controllers/authController.js)
// User Registration, Login Aur Token Generation Ka Controller
// Roman Urdu Comments: Har line ki asaan wazahat
// ==============================================================================

// 1. User model aur JWT library ko import karna
const User = require('../models/User');
const jwt = require('jsonwebtoken');

/**
 * 2. Helper function: Naya JWT Token banana
 * Token ke andar User ID hoti hai aur yeh 7 din tak valid rehta hai
 */
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'secretkey123', {
    expiresIn: '7d' // 7 din baad expire hoga
  });
};

/**
 * 3. registerUser: Naya account banane ka function (Sign Up)
 * Route: POST /api/auth/register
 */
const registerUser = async (req, res) => {
  try {
    // Frontend ke form se data nikalna
    const { name, email, password, role } = req.body;

    // Step 1: Check karna ke koi box khali toh nahi chhor diya
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide name, email, and password' });
    }

    // Step 2: Check karna ke is email se pehle hi koi account toh nahi bana hua
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'An account with this email already exists' });
    }

    // Step 3: Database mein naya User save karna
    // (Password pre-save hook mein khud hi hash/encrypt ho jayega)
    const user = await User.create({
      name,
      email,
      password,
      role: role || 'donor' // Agar role nahi bheja toh default 'donor' banega
    });

    // Step 4: Kamyabi ka response aur naya JWT token wapis bhejna
    res.status(201).json({
      success: true,
      message: 'Account created successfully',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      token: generateToken(user._id) // Login token
    });
  } catch (error) {
    console.error('Registration Error:', error);
    res.status(500).json({ success: false, message: 'Server error during registration', error: error.message });
  }
};

/**
 * 4. loginUser: Purane user ko login karne ka function (Sign In)
 * Route: POST /api/auth/login
 */
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Step 1: Validation
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide both email and password' });
    }

    // Step 2: Database mein is email ka user dhoondna
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    // Step 3: Password match karna (User model ke matchPassword method se)
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    // Step 4: Agar password sahi ho toh user data aur token bhej do
    res.status(200).json({
      success: true,
      message: 'Login successful',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      token: generateToken(user._id)
    });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ success: false, message: 'Server error during login', error: error.message });
  }
};

/**
 * 5. getUserProfile: Current login user ki details hasil karna
 * Route: GET /api/auth/profile (Private)
 */
const getUserProfile = async (req, res) => {
  try {
    // req.user authMiddleware ne pehle hi token se nikal kar attach kar diya hai
    res.status(200).json({
      success: true,
      user: req.user
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching user profile' });
  }
};

// Exporting functions
module.exports = { registerUser, loginUser, getUserProfile };
