// ==============================================================================
// DONATION MODEL (backend/src/models/Donation.js)
// Paise Donate Karne Aur Digital Receipt Ka Schema
// Roman Urdu Comments: Har line ki asaan wazahat
// ==============================================================================

// 1. Mongoose library ko import karna
const mongoose = require('mongoose');

// 2. Donation Schema define karna
const donationSchema = new mongoose.Schema(
  {
    // Yeh paise kis Campaign ko diye gaye hain (Foreign Key / ObjectId)
    campaign: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Campaign', // Campaign collection se rishta
      required: true
    },
    // Receipt par dikhane ke liye Campaign ka title
    campaignTitle: {
      type: String,
      required: true
    },
    // Agar user login tha toh uski User ID, warna guest ke liye null
    donor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    // Donor ka naam (Agar naam na likhe toh 'Anonymous Supporter' aayega)
    donorName: {
      type: String,
      required: true,
      default: 'Anonymous Supporter'
    },
    // Donor ka email address (Receipt bhejne ke liye laazmi hai)
    donorEmail: {
      type: String,
      required: true
    },
    // Kitne Euro donate kiye (Kam az kam €1)
    amount: {
      type: Number,
      required: [true, 'Donation amount is required'],
      min: [1, 'Donation amount must be at least 1']
    },
    // Payment ka tareeqa: Credit Card, PayPal, waghaira
    paymentMethod: {
      type: String,
      enum: ['Credit Card', 'Debit Card', 'PayPal', 'Mock Stripe'],
      default: 'Credit Card'
    },
    // Unique Transaction ID (e.g. TXN-1731029384) jo har receipt ka alag number hota hai
    transactionId: {
      type: String,
      required: true,
      unique: true // Kabhi duplicate nahi ho sakti
    },
    // Donor ka nek paigham ya dua (Message)
    message: {
      type: String,
      default: ''
    },
    // Kya donor apna naam chupana chahta hai
    isAnonymous: {
      type: Boolean,
      default: false
    }
  },
  {
    // Har transaction ka time khud record karega (Receipt par dikhane ke liye)
    timestamps: true
  }
);

// 3. Donation Model export karna
module.exports = mongoose.model('Donation', donationSchema);
