// Import mongoose for schema definition
const mongoose = require('mongoose');

// Define the schema for user data
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true }, // User's name, required field
  password: { type: String, required: true }, // User's password, required field
  email: { type: String, required: true, unique: true }, // User's unique email, required field
  role: { 
    type: String, 
    required: true, 
    enum: ['Admin', 'Manager', 'User'], // Allowed roles
  },
  is2FAEnabled: { type: Boolean, default: false }, // Indicates if 2FA is enabled
  twoFactorSecret: String, // Stores the secret for 2FA (if enabled)
});

// Create the model from the schema
const EndUser = mongoose.model('EndUser', UserSchema);

// Export the model for use in other files
module.exports = EndUser;
