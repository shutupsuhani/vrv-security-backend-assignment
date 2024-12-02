const mongoose=require('mongoose')

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  role: { 
    type: String, 
    required: true, 
    enum: ['Admin', 'Manager', 'User'], 
  },
  permissions: { 
    type: Map, 
    of: Boolean, 
    default: { read: false, update: false, delete: false }, 
  }, // Permissions as a flexible map
});

const EndUser = mongoose.model('EndUser', UserSchema);
module.exports = EndUser;
