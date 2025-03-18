const mongoose = require('mongoose');
const { Schema } = mongoose;

const friendRequestSchema = new Schema({
  sender: { type: Schema.Types.ObjectId, ref: 'User', required: true }, // User who sends request
  receiver: { type: Schema.Types.ObjectId, ref: 'User', required: true }, // User who receives request
  status: { type: Number, enum: [0, 1, 2, null], default: null }, // 0: Rejected, 1: Accepted, 2: Ignored, null: Pending
  createdAt: { type: Date, default: Date.now }
});

// Create and export the FriendRequest model
const FriendRequest = mongoose.model('FriendRequest', friendRequestSchema);
module.exports = FriendRequest;
