// ==============================================================================
// DATABASE CONFIGURATION (backend/src/config/db.js)
// MongoDB Database Connection Setup with Serverless Connection Caching
// Roman Urdu Comments: Har line ki asaan wazahat
// ==============================================================================

// 1. Mongoose library ko import karna (Node.js aur MongoDB ke darmiyan translator)
const mongoose = require('mongoose');

// Default Atlas connection string (fallback agar cloud environment variable missing ho)
const DEFAULT_MONGO_URI = 'mongodb+srv://chahmar42705_db_user:BNNrcLODgDpAT8Ep@cluster0.qtigs1o.mongodb.net/donation_management?retryWrites=true&w=majority';

// 2. Serverless environment ke liye connection caching
// Vercel serverless functions mein har request par naya connection banne se bachata hai
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

/**
 * MongoDB se connect karne ka asynchronous function (Cached for Serverless)
 */
const connectDB = async () => {
  // Agar pehle se connected hai toh wohi connection return kar do
  if (cached.conn && mongoose.connection.readyState === 1) {
    return cached.conn;
  }

  // Environment variable se URI lo warna default Atlas cluster ka URI use karo
  const uri = process.env.MONGODB_URI || DEFAULT_MONGO_URI;

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 10000,
      autoIndex: true
    };

    cached.promise = mongoose.connect(uri, opts).then((m) => {
      console.log(`[MongoDB] Database se kamyabi se connection ban gaya: ${m.connection.host}/${m.connection.name}`);
      return m;
    });
  }

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (error) {
    cached.promise = null;
    console.error(`[MongoDB Connection Error] Raabta nahi ho saka: ${error.message}`);
    return null;
  }
};

// Function ko export karna taake server.js mein call ho sakay
module.exports = connectDB;
