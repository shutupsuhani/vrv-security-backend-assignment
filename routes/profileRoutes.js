// Import dependencies
const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middlewares/authMiddleware'); // Middleware to verify JWT token
const { authorize } = require('../middlewares/roleMiddleware'); // Middleware for role-based access control
const { viewProfile, updateProfile, deleteUser, viewAllUsers } = require('../controllers/profileController');

// View profile route
router.get('/view/:userId', verifyToken, viewProfile);

// Update profile route
router.put('/update/:userId', verifyToken,  updateProfile);

// Delete profile route
router.delete('/delete/:userId', verifyToken, authorize('Admin'), deleteUser);

// view all users route
router.get('/get-all',verifyToken,authorize('Admin'),viewAllUsers);
// Export routes
module.exports = router;
