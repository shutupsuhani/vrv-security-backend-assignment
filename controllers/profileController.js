// profileController.js
const EndUser = require('../models/userModel');
const bcrypt=require('bcrypt');

// View Profile
const viewProfile = async (req, res) => {
    
  try {
    const { role, userId: loggedInUserId } = req.user; // Extract role and logged-in user ID from the token
    const requestedUserId = req.params.userId; // Extract user ID from request parameters

    // If Admin, allow viewing any user's profile
    if (role === 'Admin' || role === 'SubAdmin') {
      const user = await EndUser.findById(requestedUserId); // Admin can query any user

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      return res.status(200).json(user); // Send the requested user's profile
    }

    // Regular users can only view their own profile
    if (loggedInUserId === requestedUserId) {
      const user = await EndUser.findById(loggedInUserId); // Query logged-in user's profile

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      return res.status(200).json(user); // Send their own profile
    }

    // If neither condition matches, deny access
    return res.status(403).json({ message: 'You are not authorized to view this profile' });
  } catch (error) {
    console.error(error); // Log server errors for debugging
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
  
 
};

// Update Profile
const updateProfile = async (req, res) => {
  const { name, email, password } = req.body;  // Fields to update
  const { role } = req.user; // Extract role from the logged-in user
  const requestedUserId = req.params.userId; // User ID from params

  try {
    // Validate required fields
    if (!name && !email && !password) {
      return res.status(400).json({ message: 'At least one field (name, email, or password) must be provided' });
    }

    // Only Admins can update profiles
    if (role !== 'Admin') {
      return res.status(403).json({ message: 'You are not authorized to update any profile' });
    }

    // If password is provided, hash it before updating
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10); // Hash the password
      const updatedUser = await EndUser.findByIdAndUpdate(
        requestedUserId,
        { name, email, password: hashedPassword },  // Update with hashed password if provided
        { new: true, runValidators: true }  // Return the updated document and run validation
      );
      if (!updatedUser) {
        return res.status(404).json({ message: 'User not found' });
      }
      return res.status(200).json({ message: 'User profile updated successfully', updatedUser });
    }

    // No password provided, just update name and email
    const updatedUser = await EndUser.findByIdAndUpdate(
      requestedUserId,
      { name, email },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json({ message: 'User profile updated successfully', updatedUser });
  } catch (error) {
    console.error(error); // Log the error for debugging
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

//Delete User

const deleteUser = async (req, res) => {
  const userId = req.params.userId;

  try {
    if (req.user.role !== 'Admin') {
      return res.status(403).json({ message: 'You are not authorized to delete this profile' });
    }

    const deletedUser = await EndUser.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { viewProfile, updateProfile,deleteUser };
