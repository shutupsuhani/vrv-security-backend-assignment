const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    role:{type: String, required: true, enum: ['Admin', 'Sub Admin', 'User', 'Editor']}
  });
  
  const EndUser = mongoose.model("EndUser", UserSchema);
  
  module.exports = EndUser;