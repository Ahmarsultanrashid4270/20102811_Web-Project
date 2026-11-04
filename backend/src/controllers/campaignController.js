// ==============================================================================
// CAMPAIGN CONTROLLER (backend/src/controllers/campaignController.js)
// Charity Campaigns Dekhne, Dhoondne, Banane Aur Delete Karne Ka Controller
// Roman Urdu Comments: Har line ki asaan wazahat
// ==============================================================================

// 1. Campaign model ko import karna
const Campaign = require('../models/Campaign');

/**
 * 2. getCampaigns: Tamam charity causes hasil karna (Filter aur Search ke sath)
 * Route: GET /api/campaigns
 * Access: Public
 */
const getCampaigns = async (req, res) => {
  try {
    const { category, search } = req.query;
    let query = {};

    // Agar user ne kisi specific category par click kiya ho
    if (category && category !== 'All') {
      query.category = category;
    }

    // Agar user ne search bar mein kuch type kiya ho (Case-insensitive search)
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },          // Ya title mein dhoondo
        { description: { $regex: search, $options: 'i' } },    // Ya tafseel mein dhoondo
        { beneficiaryName: { $regex: search, $options: 'i' } } // Ya beneficiary ke naam mein dhoondo
      ];
    }

    // Database se data dhoondna aur sab se nayi campaign sab se upar lana (createdAt: -1)
    const campaigns = await Campaign.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: campaigns.length,
      data: campaigns
    });
  } catch (error) {
    console.error('Error fetching campaigns:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch campaigns', error: error.message });
  }
};

/**
 * 3. getCampaignById: Kisi ek single campaign ki poori tafseel hasil karna
 * Route: GET /api/campaigns/:id
 * Access: Public
 */
const getCampaignById = async (req, res) => {
  try {
    // URL se ID utha kar database mein dhoondna
    const campaign = await Campaign.findById(req.params.id);

    // Agar is ID ki koi campaign na milay
    if (!campaign) {
      return res.status(404).json({ success: false, message: 'Campaign not found' });
    }

    res.status(200).json({
      success: true,
      data: campaign
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Invalid campaign ID format', error: error.message });
  }
};

/**
 * 4. createCampaign: Nayi charity cause create karna
 * Route: POST /api/campaigns
 * Access: Private (Sirf Organizer aur Admin)
 */
const createCampaign = async (req, res) => {
  try {
    // Form se aane wala data nikalna
    const { title, description, category, targetAmount, beneficiaryName, location, imageUrl } = req.body;

    // Check karna ke zaroori fields khali na hon
    if (!title || !description || !category || !targetAmount || !beneficiaryName) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields (title, description, category, targetAmount, beneficiaryName)'
      });
    }

    // Database mein nayi campaign create karna
    const campaign = await Campaign.create({
      title,
      description,
      category,
      targetAmount: Number(targetAmount),
      beneficiaryName,
      location: location || 'Dublin, Ireland',
      imageUrl: imageUrl || 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?auto=format&fit=crop&w=800&q=80',
      organizer: req.user._id,   // Login user ki ID attach karo
      organizerName: req.user.name // Login user ka naam attach karo
    });

    res.status(201).json({
      success: true,
      message: 'Campaign created successfully',
      data: campaign
    });
  } catch (error) {
    console.error('Error creating campaign:', error);
    res.status(500).json({ success: false, message: 'Failed to create campaign', error: error.message });
  }
};

/**
 * 5. updateCampaign: Campaign ki tafseel badalna
 * Route: PUT /api/campaigns/:id
 * Access: Private (Sirf wahi Organizer jiski yeh campaign hai, ya Admin)
 */
const updateCampaign = async (req, res) => {
  try {
    let campaign = await Campaign.findById(req.params.id);

    if (!campaign) {
      return res.status(404).json({ success: false, message: 'Campaign not found' });
    }

    // Ownership Check: Kya yeh wahi banda hai jisne banayi thi ya Admin hai?
    if (campaign.organizer.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to update this campaign' });
    }

    // Database mein record ko update karna
    campaign = await Campaign.findByIdAndUpdate(req.params.id, req.body, {
      new: true, // Naya updated data wapis karo
      runValidators: true // Schema rules check karo
    });

    res.status(200).json({
      success: true,
      message: 'Campaign updated successfully',
      data: campaign
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update campaign', error: error.message });
  }
};

/**
 * 6. deleteCampaign: Kisi campaign ko khatam karna
 * Route: DELETE /api/campaigns/:id
 * Access: Private (Sirf Creator ya Admin)
 */
const deleteCampaign = async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);

    if (!campaign) {
      return res.status(404).json({ success: false, message: 'Campaign not found' });
    }

    // Ownership check
    if (campaign.organizer.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this campaign' });
    }

    // Database se delete karna
    await campaign.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Campaign deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete campaign', error: error.message });
  }
};

/**
 * 7. getMyCampaigns: Current login organizer ki banayi hui apni campaigns nikalna
 * Route: GET /api/campaigns/my-campaigns
 * Access: Private
 */
const getMyCampaigns = async (req, res) => {
  try {
    // Database mein sirf woh campaigns dhoondo jahan organizer ID current user ke barabar ho
    const campaigns = await Campaign.find({ organizer: req.user._id }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: campaigns.length,
      data: campaigns
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch organizer campaigns', error: error.message });
  }
};

// Exporting all functions
module.exports = {
  getCampaigns,
  getCampaignById,
  createCampaign,
  updateCampaign,
  deleteCampaign,
  getMyCampaigns
};
