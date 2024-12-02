// Import dependencies
const EndUser = require('../models/userModel');
const bcrypt = require('bcrypt');

// **Profile Controller** - Handles profile view, update, and delete operations

// View Profile
// Admin can view any user's profile, Manager can view all profiles except Admin's, and regular users can view their own profile
const viewProfile = async (req, res) => {
  try {
    const { role, userId: loggedInUserId } = req.user; // Extract logged-in user's role and ID
    const requestedUserId = req.params.userId; // Extract the requested user ID from the URL params

    // Fetch the user's profile from the database
    const user = await EndUser.findById(requestedUserId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Admin can view any user's profile
    if (role === 'Admin') {
      return res.status(200).json(user);
    }

    // Manager can view all profiles except Admin's
    if (role === 'Manager' && user.role !== 'Admin') {
      return res.status(200).json(user);
    }

    // Regular users can only view their own profile
    if (loggedInUserId === requestedUserId) {
      return res.status(200).json(user);
    }

    // Deny access if the user is not authorized to view the requested profile
    return res.status(403).json({ message: 'You are not authorized to view this profile' });

  } catch (error) {
    console.error('Error in viewProfile:', error.message);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update Profile
// Admin can update any user's profile, Manager can update their own or non-Admin users' profiles, regular users can only update their own profile
const updateProfile = async (req, res) => {
  try {
    const { role, userId: loggedInUserId } = req.user; // Extract logged-in user's role and ID
    const requestedUserId = req.params.userId; // Extract the user ID to update from the URL params
    const { name, email, password } = req.body; // Extract fields to update from request body

    // Ensure there's at least one field (name, email, password) to update
    if (!name && !email && !password) {
      return res.status(400).json({ message: 'At least one field (name, email, or password) must be provided' });
    }

    // Fetch the user's profile to be updated
    const userToUpdate = await EndUser.findById(requestedUserId);

    if (!userToUpdate) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Handle Manager role: can update their own profile or any non-Admin profile
    if (role === 'Manager') {
      if (requestedUserId === loggedInUserId || userToUpdate.role !== 'Admin') {
        // Proceed to update if the manager is updating their own or a non-Admin user's profile
      } else {
        return res.status(403).json({ message: 'Managers cannot update Admin profiles' });
      }
    }

    // Handle User role: can only update their own profile
    if (role === 'User' && loggedInUserId !== requestedUserId) {
      return res.status(403).json({ message: 'You are not authorized to update this profile' });
    }

    // Handle Admin role: can update any user's profile (no restrictions)

    // If password is provided, hash it before updating
    let updateData = { name, email };
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateData.password = hashedPassword;
    }

    // Update the user's profile in the database
    const updatedUser = await EndUser.findByIdAndUpdate(requestedUserId, updateData, {
      new: true, // Return the updated document
      runValidators: true, // Ensure validation rules are applied
    });

    // Return success message with updated user data
    return res.status(200).json({ message: 'User profile updated successfully', updatedUser });

  } catch (error) {
    console.error('Error in updateProfile:', error.message);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete User
// Only Admin can delete a user by ID
const deleteUser = async (req, res) => {
  const userId = req.params.userId; // Extract user ID to delete from request parameters

  try {
    // Ensure only Admins can delete users
    if (req.user.role !== 'Admin') {
      return res.status(403).json({ message: 'You are not authorized to delete this profile' });
    }

    // Delete the user from the database
    const deletedUser = await EndUser.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Return success message upon successful deletion
    res.status(200).json({ message: 'User deleted successfully' });

  } catch (error) {
    console.error('Error in deleteUser:', error.message);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

//view all users

const viewAllUsers = async (req, res) => {
  try {
    const { role } = req.user; // Extract the role from the JWT token

    // Ensure only Admin can access this route
    if (role !== 'Admin') {
      return res.status(403).json({ message: 'You are not authorized to view all users' });
    }

    // Fetch all users from the database
    const users = await EndUser.find({},'-password'); // Modify query as needed (e.g., exclude passwords)
    
    if (!users) {
      return res.status(404).json({ message: 'No users found' });
    }

    return res.status(200).json(users); // Send the list of users as the response
  } catch (error) {
    console.error('Error in viewAllUsers:', error.message);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};


// Export controller methods
module.exports = { viewProfile, updateProfile, deleteUser,viewAllUsers };
