// Import dependencies
const EndUser = require('../models/userModel');
const bcrypt = require('bcrypt');

// View Profile
// Allows an admin to view any user's profile or a regular user to view their own profile
const viewProfile = async (req, res) => {
  try {
    const { role, userId: loggedInUserId } = req.user; // Extract role and logged-in user ID from the token
    const requestedUserId = req.params.userId; // Extract user ID from request parameters

    // Fetch the requested user's profile
    const user = await EndUser.findById(requestedUserId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Allow Admins to view any user's profile
    if (role === 'Admin') {
      return res.status(200).json(user);
    }

    // Managers can view all profiles except Admins
    if (role === 'Manager' && user.role !== 'Admin') {
      return res.status(200).json(user);
    }

    // Regular users can only view their own profile
    if (loggedInUserId === requestedUserId) {
      return res.status(200).json(user);
    }

    // Deny access if no conditions are met
    return res.status(403).json({ message: 'You are not authorized to view this profile' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update Profile
// Allows an admin to update a user's profile, including password hashing
const updateProfile = async (req, res) => {
   
  try {
    const { role, userId: loggedInUserId } = req.user; // Extract role and user ID from the token
    const requestedUserId = req.params.userId; // Extract requested user ID from the params
    const { name, email, password } = req.body; // Extract fields to update

    // Validate if there's at least one field to update
    if (!name && !email && !password) {
      return res.status(400).json({ message: 'At least one field (name, email, or password) must be provided' });
    }

    // Fetch the user's profile to verify their role
    const userToUpdate = await EndUser.findById(requestedUserId);

    if (!userToUpdate) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Manager: can update their own profile or any user except admins
    if (role === 'Manager') {
      if (requestedUserId === loggedInUserId || userToUpdate.role !== 'Admin') {
        // Update allowed
      } else {
        return res.status(403).json({ message: 'Managers cannot update Admin profiles' });
      }
    }

    // Regular users: can only update their own profiles
    if (role === 'User' && loggedInUserId !== requestedUserId) {
      return res.status(403).json({ message: 'You are not authorized to update this profile' });
    }

    // Admin: can update any profile
    // (No special conditions for Admin as they have all privileges)

    // If password is provided, hash it before updating
    let updateData = { name, email };
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateData.password = hashedPassword;
    }

    // Update the user profile
    const updatedUser = await EndUser.findByIdAndUpdate(requestedUserId, updateData, {
      new: true, // Return the updated document
      runValidators: true, // Ensure validation rules are applied
    });

    return res.status(200).json({ message: 'User profile updated successfully', updatedUser });
  } catch (error) {
    console.error('Error in updateProfile:', error.message);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }

};

// Delete User
// Allows an admin to delete a user by ID
const deleteUser = async (req, res) => {
  const userId = req.params.userId; // Extract user ID from request parameters

  try {
    // Ensure only Admins can delete users
    if (req.user.role !== 'Admin') {
      return res.status(403).json({ message: 'You are not authorized to delete this profile' });
    }

    const deletedUser = await EndUser.findByIdAndDelete(userId); // Delete the user

    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error(error); // Log error for debugging
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Export controller methods
module.exports = { viewProfile, updateProfile, deleteUser };
