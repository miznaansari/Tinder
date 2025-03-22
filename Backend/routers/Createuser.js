const express = require('express');
const router = express.Router();
const Users = require('../models/User');
const multer = require('multer');

// Configure Multer for image upload
const storage = multer.diskStorage({
  destination: './uploads/', // Save images to the 'uploads' folder
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});
const upload = multer({ storage });




// API to update profile picture
router.put('/updateProfilePicture', upload.single('profilePicture'), async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    const user = await Users.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update profile picture
    if (req.file) {
      user.profilePicture = `/uploads/${req.file.filename}`;
      await user.save();
      return res.status(200).json({ success: 'Profile picture updated successfully', user });
    } else {
      return res.status(400).json({ error: 'No file uploaded' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



// Register Route
router.post('/create', upload.single('profilePicture'), async (req, res) => {
  try {
    const { name, email, password, dob } = req.body;

    // Check if user already exists
    const existUser = await Users.findOne({ email });
    if (existUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Store image path if uploaded
    const profilePicture = req.file ? `/uploads/${req.file.filename}` : null;

    // Create and save new user
    const newUser = new Users({ name, email, password, dob, profilePicture });
    await newUser.save();

    res.status(201).json({ success: 'Account created successfully', user: newUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Login Route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await Users.findOne({ email });
    if (!user || user.password !== password) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    res.status(200).json({ success: 'Login successful', user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Get All Users
router.get('/users', async (req, res) => {
  try {
    const users = await Users.find({});
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
