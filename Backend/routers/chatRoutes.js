const express = require('express');
const Chat = require('../models/chat');
const router = express.Router();

// Send a message
router.post('/send', async (req, res) => {
  const { senderId, receiverId, message } = req.body;
  try {
    const chat = new Chat({ senderId, receiverId, message });
    await chat.save();
    res.status(201).json({ success: true, message: 'Message sent' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get all messages
router.post('/messages', async (req, res) => {
  const { senderId, receiverId } = req.body;
  try {
    const messages = await Chat.find({
      $or: [
        { senderId, receiverId },
        { senderId: receiverId, receiverId: senderId }
      ]
    }).sort({ createdAt: 1 });

    res.status(200).json({ success: true, messages });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
