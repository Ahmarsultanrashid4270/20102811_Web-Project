// ==============================================================================
// DATABASE SEED SCRIPT (backend/src/utils/seedData.js)
// Demo Data Seeder: Initial Users, Campaigns Aur Donations Load Karna
// Command to run: npm run seed
// Roman Urdu Comments: Har step aur data ki asaan wazahat
// ==============================================================================

// 1. Configuration aur Models import karna
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Campaign = require('../models/Campaign');
const Donation = require('../models/Donation');

/**
 * 2. seedDatabase function: Purana data saaf kar ke naya demo data daalta hai
 */
const seedDatabase = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/donation_management';

  try {
    console.log('[Seed] MongoDB se connect ho raha hai...');
    await mongoose.connect(uri);
    console.log('[Seed] Kamyabi se connect ho gaya.');

    // Step 1: Purana saara data delete karna (Taake duplicate entries na banen)
    await User.deleteMany();
    await Campaign.deleteMany();
    await Donation.deleteMany();
    console.log('[Seed] Purana record saaf kar diya gaya.');

    // Step 2: 3 Sample Users banana (Admin, Organizer, Donor)
    const users = await User.create([
      {
        name: 'Sarah Admin',
        email: 'admin@kindred.org',
        password: 'password123', // Model ka hook isay encrypt kar dega
        role: 'admin'
      },
      {
        name: 'Elena Rostova (Irish Red Cross)',
        email: 'organizer@redcross.org',
        password: 'password123',
        role: 'organizer'
      },
      {
        name: 'David O’Connor',
        email: 'donor@student.dbs.ie',
        password: 'password123',
        role: 'donor'
      }
    ]);
    console.log(`[Seed] ${users.length} Users kamyabi se ban gaye.`);

    const organizerId = users[1]._id; // Elena ki ID
    const donorId = users[2]._id;     // David ki ID

    // Step 3: 4 Shandar Charity Causes (Campaigns) create karna
    const campaigns = await Campaign.create([
      {
        title: 'Emergency Medical Kits for Flood Relief',
        description: 'Providing immediate medical supplies, water purification tablets, and emergency first aid to families affected by severe coastal flooding.',
        category: 'Disaster Relief',
        targetAmount: 15000,
        raisedAmount: 9450,
        donorCount: 68,
        imageUrl: 'https://images.unsplash.com/photo-1547496502-affa22d38842?auto=format&fit=crop&w=800&q=80',
        beneficiaryName: 'Coastal Community Disaster Fund',
        location: 'Galway, Ireland',
        status: 'active',
        organizer: organizerId,
        organizerName: 'Irish Red Cross Partner'
      },
      {
        title: 'Solar Powered Wells for Rural Schools',
        description: 'Installing solar-powered clean water pumps across five rural community schools to eradicate water-borne diseases and keep children in classrooms.',
        category: 'Environment',
        targetAmount: 8500,
        raisedAmount: 5200,
        donorCount: 42,
        imageUrl: 'https://images.unsplash.com/photo-1541544741938-0af808871cc0?auto=format&fit=crop&w=800&q=80',
        beneficiaryName: 'Rural Water Initiative',
        location: 'Turkana District',
        status: 'active',
        organizer: organizerId,
        organizerName: 'Elena Rostova'
      },
      {
        title: 'STEM Tech Lab Laptops for Underprivileged Youth',
        description: 'Equipping underprivileged students with modern refurbished laptops, educational coding software, and certified digital literacy mentors.',
        category: 'Education',
        targetAmount: 12000,
        raisedAmount: 4800,
        donorCount: 31,
        imageUrl: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=80',
        beneficiaryName: 'Dublin Youth Tech Alliance',
        location: 'Dublin 8, Ireland',
        status: 'active',
        organizer: organizerId,
        organizerName: 'Dublin Youth Foundation'
      },
      {
        title: 'Rescue & Rehabilitation for Abandoned Animals',
        description: 'Providing urgent medical care, warm shelter bedding, and nutritious food supplies for injured and abandoned rescue animals during the winter season.',
        category: 'Animal Welfare',
        targetAmount: 6000,
        raisedAmount: 4100,
        donorCount: 54,
        imageUrl: 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=800&q=80',
        beneficiaryName: 'Paws & Claws Rescue Shelter',
        location: 'Wicklow, Ireland',
        status: 'active',
        organizer: organizerId,
        organizerName: 'Elena Rostova'
      }
    ]);
    console.log(`[Seed] ${campaigns.length} Campaigns create ho gayeen.`);

    // Step 4: Initial Sample Donations add karna (Taake progress bar mein paise dikhai dein)
    await Donation.create([
      {
        campaign: campaigns[0]._id,
        campaignTitle: campaigns[0].title,
        donor: donorId,
        donorName: 'David O’Connor',
        donorEmail: 'donor@student.dbs.ie',
        amount: 150,
        paymentMethod: 'Credit Card',
        transactionId: 'TXN-SEED-001',
        message: 'Stay strong everyone, hoping for a speedy recovery.',
        isAnonymous: false
      },
      {
        campaign: campaigns[0]._id,
        campaignTitle: campaigns[0].title,
        donor: null,
        donorName: 'Anonymous Supporter',
        donorEmail: 'kindness@gmail.com',
        amount: 50,
        paymentMethod: 'Mock Stripe',
        transactionId: 'TXN-SEED-002',
        message: 'Happy to support this vital humanitarian initiative.',
        isAnonymous: true
      },
      {
        campaign: campaigns[1]._id,
        campaignTitle: campaigns[1].title,
        donor: donorId,
        donorName: 'David O’Connor',
        donorEmail: 'donor@student.dbs.ie',
        amount: 100,
        paymentMethod: 'Credit Card',
        transactionId: 'TXN-SEED-003',
        message: 'Clean water is a fundamental human right for every child.',
        isAnonymous: false
      }
    ]);
    console.log('[Seed] Shuruati donation records bhi create ho gaye.');

    console.log('\n===============================================');
    console.log(' SEEDING COMPLETED SUCCESSFULLY! ');
    console.log(' Ready-made Demo Accounts:');
    console.log(' 1. Admin:     admin@kindred.org      / password123');
    console.log(' 2. Organizer: organizer@redcross.org / password123');
    console.log(' 3. Donor:     donor@student.dbs.ie   / password123');
    console.log('===============================================\n');

    process.exit(0);
  } catch (error) {
    console.error('[Seed Error]', error);
    process.exit(1);
  }
};

// Seeder ko run karna
seedDatabase();
