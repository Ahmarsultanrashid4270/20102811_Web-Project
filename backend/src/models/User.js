// ==============================================================================
// USER MODEL (backend/src/models/User.js)
// User Schema Aur Password Hashing Logic
// Roman Urdu Comments: Har line aur validation ki asaan wazahat
// ==============================================================================

// 1. Mongoose aur Bcryptjs libraries ko import karna
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// 2. User ka Schema (Structure) define karna
const userSchema = new mongoose.Schema(
  {
    // User ka pura naam (Full Name)
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true // Shuru aur aakhir ki faltu spaces khatam karo
    },
    // User ka email address (Unique hona chahiye)
    email: {
      type: String,
      required: [true, 'Email address is required'],
      unique: true, // Ek email se doosra account nahi ban sakta
      lowercase: true, // Saare letters chhote (lowercase) mein save honge
      trim: true
    },
    // Secret Password (yeh database mein encrypted save hoga)
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters long']
    },
    // User ka kirdar (Role): donor, organizer, ya admin
    role: {
      type: String,
      enum: ['donor', 'organizer', 'admin'], // Sirf in teenon mein se ek ho sakta hai
      default: 'donor' // Naye banne wale ka default role 'donor' hoga
    }
  },
  {
    // Yeh khud ba khud 'createdAt' aur 'updatedAt' ki date save karta hai
    timestamps: true
  }
);

// 3. Pre-Save Hook (Database mein save hone se theek pehle chalne wala security function)
userSchema.pre('save', async function (next) {
  // Agar password modify nahi hua (sirf naam ya email badli hai) toh dobara hash mat karo
  if (!this.isModified('password')) {
    return next();
  }
  // Salt generate karna (Security layer)
  const salt = await bcrypt.genSalt(10);
  // Password ko encrypt (hash) kar ke save karna
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// 4. Custom Method: Login ke waqt password match karne ka function
userSchema.methods.matchPassword = async function (enteredPassword) {
  // enteredPassword aur hashed password ko aapas mein milana
  return await bcrypt.compare(enteredPassword, this.password);
};

// 5. User Model ko export karna taake doosri files mein use ho sake
module.exports = mongoose.model('User', userSchema);
