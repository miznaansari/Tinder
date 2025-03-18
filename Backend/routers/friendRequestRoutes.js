const express = require('express');
const router = express.Router();
const FriendRequest = require('../models/FriendRequest');
const User = require('../models/User');
const { activeUsers } = require('../utils/socketManager');
const { io } = require('../server');

// Accept Friend Request
router.post('/accept', async (req, res) => {
  const { senderId, receiverId } = req.body;

  if (!senderId || !receiverId) {
    return res.status(400).json({ error: 'Sender and Receiver IDs are required' });
  }

  try {
    const request = await FriendRequest.findOne({ sender: senderId, receiver: receiverId });

    if (!request) {
      return res.status(404).json({ error: 'Friend request not found' });
    }

    // Update the status to Accepted
    request.status = 1; // 1: Accepted
    await request.save();

    // Send a notification to the sender
    if (activeUsers.has(senderId.toString())) {
      const senderSocket = activeUsers.get(senderId.toString());
      senderSocket.emit('friendRequestNotification', {
        message: `Your friend request to User ${receiverId} was accepted!`,
        receiverId,
      });
      console.log(`Notification sent to User ${senderId}`);
    }

    res.status(200).json({ message: 'Friend request accepted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// Status Mapping
const statusLabels = {
  0: 'Rejected',
  1: 'Accepted',
  2: 'Ignored',
  null: 'Pending',
};


// Get Friend Request Status
router.get('/status/:userId', async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  try {
    // Find all sent and received friend requests
    const sentRequests = await FriendRequest.find({ sender: userId })
      .populate('receiver', 'name')
      .select('receiver status');

    const receivedRequests = await FriendRequest.find({ receiver: userId })
      .populate('sender', 'name')
      .select('sender status');

    // Format response with readable status
    const formatRequests = (requests, isSent = true) => {
      return requests.map((request) => ({
        userName: isSent ? request.receiver.name : request.sender.name,
        status: statusLabels[request.status],
      }));
    };

    res.status(200).json({
      sentRequests: formatRequests(sentRequests),
      receivedRequests: formatRequests(receivedRequests, false),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Send Friend Request
router.post('/send', async (req, res) => {
  const { senderId, receiverId } = req.body;

  if (!senderId || !receiverId) {
    return res.status(400).json({ error: 'Sender and Receiver IDs are required' });
  }

  const sender = await User.findById(senderId);
  const receiver = await User.findById(receiverId);

  if (!sender || !receiver) {
    return res.status(404).json({ error: 'User not found' });
  }

  // Check for existing request
  const existingRequest = await FriendRequest.findOne({ sender, receiver });
  if (existingRequest) {
    return res.status(400).json({ error: 'Friend request already sent' });
  }

  const newRequest = new FriendRequest({ sender, receiver });
  await newRequest.save();

  // Real-Time Notification
  if (activeUsers.has(receiverId.toString())) {
    const socket = activeUsers.get(receiverId.toString());
    socket.emit('friendRequestNotification', {
      message: `${sender.name} sent you a friend request!`,
      senderId: senderId,
      senderName: sender.name
    });
    console.log(`Notification sent to User ${receiverId}`);
  } else {
    console.log(`User ${receiverId} is not online.`);
  }

  res.status(201).json({ message: 'Friend request sent successfully' });
});

module.exports = router;
