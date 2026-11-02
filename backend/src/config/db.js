// ==============================================================================
// DATABASE CONFIGURATION (backend/src/config/db.js)
// MongoDB Database Connection Setup
// Roman Urdu Comments: Har line ki asaan wazahat
// ==============================================================================

// 1. Mongoose library ko import karna (Node.js aur MongoDB ke darmiyan ka translator)
const mongoose = require('mongoose');

/**
 * MongoDB se connect karne ka asynchronous function
 */
const connectDB = async () => {
  // 2. Connection URI (URL):
  // Agar .env mein MONGODB_URI di ho toh woh uthao, warna local computer ka default URL use karo
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/donation_management';
  
  try {
    // 3. Mongoose ke connect method se MongoDB ko call milana
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000, // Agar 5 second mein database na milay toh ruk jao
      autoIndex: true                 // Unique email index khud ba khud bana lo
    });

    // 4. Kamyabi par message print karna (Host aur Database ka naam)
    console.log(`[MongoDB] Database se kamyabi se connection ban gaya: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (error) {
    // 5. Agar MongoDB band ho ya connection fail ho jaye:
    console.error(`[MongoDB Connection Error] Raabta nahi ho saka: ${error.message}`);
    console.warn(`[MongoDB Warning] Database ke baghair chal raha hai. MONGODB_URI check karein.`);
    
    // 6. Production mein crash karo, lekin development/academic evaluation mein
    // process ko band nahi karte taake student ki app band na ho
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
  }
};

// Function ko export karna taake server.js mein call ho sakay
module.exports = connectDB;
