const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
  name: { type: String, required: true },
  profilePicture: { type: String },
  email: { type: String, required: true, unique: true }, // ✅ Unique Email
  password: { type: String, required: true },
  dob: { type: Date, required: true }
});

// Create and export the User model
const User = mongoose.model('User', userSchema);
module.exports = User;
