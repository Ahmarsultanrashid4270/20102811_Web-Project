// ==============================================================================
// DONATION CONTROLLER (backend/src/controllers/donationController.js)
// Donation Transaction, Atomic Math, Receipt Generation Aur History
// Roman Urdu Comments: Har line aur step ki asaan wazahat
// ==============================================================================

// 1. Models import karna
const Donation = require('../models/Donation');
const Campaign = require('../models/Campaign');

/**
 * 2. createDonation: Nayi donation process karna
 * Route: POST /api/donations
 * Access: Public (Guest ya Login User dono kar sakte hain)
 */
const createDonation = async (req, res) => {
  try {
    // Form se aane wala data nikalna
    const { campaignId, amount, donorName, donorEmail, message, paymentMethod, isAnonymous } = req.body;

    // Step 1: Validation - Check karna ke ID aur Amount sahi hain
    if (!campaignId || !amount || Number(amount) <= 0) {
      return res.status(400).json({ success: false, message: 'Please provide a valid campaign ID and donation amount' });
    }

    // Step 2: Email check karna (Receipt bhejne ke liye laazmi hai)
    if (!donorEmail) {
      return res.status(400).json({ success: false, message: 'Please provide a valid email address' });
    }

    // Step 3: Check karna ke kya yeh campaign database mein mojood hai?
    const campaign = await Campaign.findById(campaignId);
    if (!campaign) {
      return res.status(404).json({ success: false, message: 'Campaign not found' });
    }

    // Check karna ke campaign abhi active hai ya band ho chuki hai
    if (campaign.status !== 'active') {
      return res.status(400).json({ success: false, message: 'This campaign is no longer accepting donations' });
    }

    // Step 4: Unique Transaction ID generate karna (e.g. TXN-1731029384-512)
    const transactionId = 'TXN-' + Date.now() + '-' + Math.floor(Math.random() * 1000);

    // Step 5: Database mein Donation record save karna
    const donation = await Donation.create({
      campaign: campaign._id,
      campaignTitle: campaign.title,
      donor: req.user ? req.user._id : null, // Agar user login hai toh ID save karo
      donorName: donorName || (req.user ? req.user.name : 'Anonymous Supporter'),
      donorEmail,
      amount: Number(amount),
      paymentMethod: paymentMethod || 'Credit Card',
      transactionId,
      message: message || '',
      isAnonymous: Boolean(isAnonymous)
    });

    // Step 6: Atomic Math - Campaign ke total raised aur donor count ko barhana
    campaign.raisedAmount += Number(amount); // Naye paise purani amount mein jama karo
    campaign.donorCount += 1;               // Donors ki ginti mein 1 ka izafa karo

    // Agar target pura ho gaya ho toh status 'completed' kar do
    if (campaign.raisedAmount >= campaign.targetAmount) {
      campaign.status = 'completed';
    }

    // Campaign ko database mein wapis save karna
    await campaign.save();

    // Step 7: Kamyabi ka response aur receipt details wapis bhejna
    res.status(201).json({
      success: true,
      message: 'Donation processed successfully. Thank you for your support.',
      donation,
      campaignProgress: {
        raisedAmount: campaign.raisedAmount,
        targetAmount: campaign.targetAmount,
        percentRaised: Math.round((campaign.raisedAmount / campaign.targetAmount) * 100)
      }
    });
  } catch (error) {
    console.error('Donation Error:', error);
    res.status(500).json({ success: false, message: 'Failed to process donation', error: error.message });
  }
};

/**
 * 3. getCampaignDonations: Kisi ek campaign ko milne wali recent donations (Supporters list)
 * Route: GET /api/donations/campaign/:campaignId
 */
const getCampaignDonations = async (req, res) => {
  try {
    // Aakhri 20 donations nikalna (sab se nayi pehle)
    const donations = await Donation.find({ campaign: req.params.campaignId })
      .sort({ createdAt: -1 })
      .limit(20);

    // Agar donor ne Anonymous choose kiya tha toh uska asal naam chupana
    const sanitized = donations.map((d) => ({
      _id: d._id,
      amount: d.amount,
      donorName: d.isAnonymous ? 'Kind Supporter (Anonymous)' : d.donorName,
      message: d.message,
      createdAt: d.createdAt
    }));

    res.status(200).json({
      success: true,
      count: sanitized.length,
      data: sanitized
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch campaign donations' });
  }
};

/**
 * 4. getMyDonations: Login user ne ab tak kahan kahan kitne paise diye
 * Route: GET /api/donations/my-donations
 * Access: Private (Login Donor)
 */
const getMyDonations = async (req, res) => {
  try {
    // Login user ki ID ya email se donations dhoondna
    const donations = await Donation.find({
      $or: [{ donor: req.user._id }, { donorEmail: req.user.email }]
    }).sort({ createdAt: -1 });

    // Total paise calculate karna jo is user ne donate kiye
    const totalContributed = donations.reduce((sum, d) => sum + d.amount, 0);

    res.status(200).json({
      success: true,
      count: donations.length,
      totalContributed,
      data: donations
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch donation history' });
  }
};

/**
 * 5. getAllDonations: Poore platform ki saari donations (Admin ke liye)
 * Route: GET /api/donations/all
 * Access: Private (Sirf Admin)
 */
const getAllDonations = async (req, res) => {
  try {
    const donations = await Donation.find().sort({ createdAt: -1 });
    const totalRaisedPlatform = donations.reduce((sum, d) => sum + d.amount, 0);

    res.status(200).json({
      success: true,
      count: donations.length,
      totalRaisedPlatform,
      data: donations
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch all donations' });
  }
};

// Functions export karna
module.exports = {
  createDonation,
  getCampaignDonations,
  getMyDonations,
  getAllDonations
};
