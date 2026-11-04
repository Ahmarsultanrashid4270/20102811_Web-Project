// ==============================================================================
// CAMPAIGN MODEL (backend/src/models/Campaign.js)
// Charity Causes Ka Schema (Target Goal, Raised Amount, Category Aur Organizer)
// Roman Urdu Comments: Har field aur rule ki asaan wazahat
// ==============================================================================

// 1. Mongoose library ko import karna
const mongoose = require('mongoose');

// 2. Campaign Schema define karna
const campaignSchema = new mongoose.Schema(
  {
    // Cause ka unwan (Title)
    title: {
      type: String,
      required: [true, 'Campaign title is required'],
      trim: true
    },
    // Tafseeli kahani ya waja (Description)
    description: {
      type: String,
      required: [true, 'Campaign description is required']
    },
    // Category (Shoba): Healthcare, Education, waghaira
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: ['Healthcare', 'Education', 'Disaster Relief', 'Poverty', 'Environment', 'Animal Welfare']
    },
    // Target Goal: Kitne Euro jama karne ka irada hai
    targetAmount: {
      type: Number,
      required: [true, 'Target funding amount is required'],
      min: [10, 'Target amount must be at least 10 EUR']
    },
    // Ab tak jama shuda raqam (Shuru mein 0 hogi)
    raisedAmount: {
      type: Number,
      default: 0
    },
    // Kitne logon ne donate kiya (Shuru mein 0)
    donorCount: {
      type: Number,
      default: 0
    },
    // Cover Photo ka URL (Agar user na de toh default Unsplash picture use hogi)
    imageUrl: {
      type: String,
      default: 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?auto=format&fit=crop&w=800&q=80'
    },
    // Yeh paise kis community ya shakhs ko milenge
    beneficiaryName: {
      type: String,
      required: [true, 'Beneficiary name is required']
    },
    // Kahan ki campaign hai (Shehar / Mulk)
    location: {
      type: String,
      default: 'Dublin, Ireland'
    },
    // Status: active, completed, ya cancelled
    status: {
      type: String,
      enum: ['active', 'completed', 'cancelled'],
      default: 'active'
    },
    // User Relationship: Kis User (Organizer) ne yeh campaign banayi hai?
    // Yeh ObjectId doosri collection 'User' se link hoti hai
    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    // Display ke liye Organizer ka naam
    organizerName: {
      type: String,
      default: 'Community Organizer'
    }
  },
  {
    // Har campaign ke banne ka time (createdAt) khud record karega
    timestamps: true
  }
);

// 3. Campaign model export karna
module.exports = mongoose.model('Campaign', campaignSchema);
