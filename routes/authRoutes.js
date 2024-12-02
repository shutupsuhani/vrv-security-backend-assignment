const express = require('express');
const router = express.Router();
const registerValidator = require('../helpers/validation'); // Import validation helper
const EndUser = require('../models/userModel'); // Import Mongoose model
const bcrypt = require('bcrypt'); // Import bcrypt for password hashing
const jwt = require('jsonwebtoken'); // Import JWT for token generation

/**
 * @route   POST /register
 * @desc    Register a new user
 * @access  Public
 */
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body; // Extract input fields from request body

    // Validate the input data
    const validationError = registerValidator({ name, email, password, role });
    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    // Check if the user already exists in the database
    const existingUser = await EndUser.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password for secure storage
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user instance
    const newUser = new EndUser({
      name,
      email,
      password: hashedPassword,
      role,
    });

    // Save the new user to the database
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' }); // Respond with success message
  } catch (error) {
    console.error('Error in /register route:', error.message); // Log server error
    res.status(500).json({ message: 'Internal server error' }); // Respond with error message
  }
});

/**
 * @route   POST /login
 * @desc    Authenticate user and return a JWT token
 * @access  Public
 */
router.post('/login', async (req, res) => {
  const { email, password } = req.body; // Extract input fields from request body

  try {
    // Find the user by email in the database
    const user = await EndUser.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' }); // Respond with error if user not found
    }

    // Compare the provided password with the stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' }); // Respond with error if passwords don't match
    }

    // Generate a JWT token with user ID and role as payload
    const token = jwt.sign(
      { userId: user._id, role: user.role }, 
      process.env.JWT_SECRET, 
      { expiresIn: '1h' } // Token expires in 1 hour
    );

    // Respond with success message and the generated token
    res.status(200).json({ message: 'Login successful', token });
  } catch (err) {
    console.error('Error in /login route:', err.message); // Log server error
    res.status(500).json({ message: 'Server error' }); // Respond with error message
  }
});

module.exports = router;
