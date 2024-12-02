const EndUser = require('../models/userModel');

// Grant additional permissions to a user
const grantPermissions = async (req, res) => {
    try {
        const { userId, permissions } = req.body;
    
        // Validate inputs
        if (!userId || !permissions) {
          return res.status(400).json({ message: 'User ID and permissions are required' });
        }
    
        // Find the user
        const user = await EndUser.findById(userId);
        if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }
    
        // Check if the requester is an admin
        if (req.user.role !== 'Admin') {
          return res.status(403).json({ message: 'Only admin can grant permissions' });
        }
    
        // Merge permissions explicitly
        const updatedPermissions = { ...user.permissions.toObject(), ...permissions };
        user.permissions = updatedPermissions;
    
        // Save updated user
        await user.save();
    
        res.status(200).json({
          message: 'Permissions granted successfully',
          permissions: user.permissions,
        });
      } catch (error) {
        console.error('Grant Permissions Error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
      }
};

const checkPermission = (permission) => {
    return (req, res, next) => {
      const { permissions } = req.user;
  
      if (!permissions || !permissions[permission]) {
        return res.status(403).json({ message: `You do not have ${permission} permission` });
      }
  
      next();
    };
  };
  

module.exports = { grantPermissions,checkPermission };
