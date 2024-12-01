const express = require('express');
const router = express.Router();
const registerValidator = require('../helpers/validation'); 
const EndUser = require('../models/userModel'); 
const bcrypt = require('bcrypt');
const jwt=require('jsonwebtoken')

//Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const validationError = registerValidator({ name, email, password, role });
    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    // Check if the user already exists
    const existingUser = await EndUser.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new EndUser({
      name,
      email,
      password: hashedPassword,
      role,
    });

    // Save the user in the database
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error in /register route:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
});

//Login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
  
    try {
      // Find the user by email
      const user = await EndUser.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: 'Invalid email or password' });
      }
  
      // Compare the password with the hashed password stored in the DB
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid email or password' });
      }
  
      // Generate JWT token
      const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
  
      // Send the response with the JWT token
      res.status(200).json({ message: 'Login successful', token });
      
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  });

module.exports = router;
