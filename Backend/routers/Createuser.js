const express = require('express');
const router = express.Router();
const Users = require('../models/User');




// Register Route
router.post('/create', async (req, res) => {
    const { name, email, password, dob } = req.body;

    let existuser = await Users.findOne({ email });

    if (existuser) {
        return res.status(400).json({ error: "User Already Exists" });
    }

    const newUser = new Users({ name, email, password, dob });
    await newUser.save();
    
    res.status(200).json({ success: "Account Created Successfully" });
});

// Login Route
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    let user = await Users.findOne({ email });

    if (!user) {
        return res.status(400).json({ error: "Invalid Email or Password" });
    }

    // Check if password matches
    if (user.password !== password) {
        return res.status(400).json({ error: "Invalid Email or Password" });
    }


    res.status(200).json({ success: "Login Successful",user:user});
});

// Get All Users
router.get('/users', async (req, res) => {
 
      const users = await Users.find({});
      res.json(users);
   
  });

module.exports = router;
