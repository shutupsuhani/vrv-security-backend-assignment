// Import dependencies
const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middlewares/authMiddleware'); // Middleware to verify JWT token
const { authorize } = require('../middlewares/roleMiddleware'); // Middleware for role-based access control
const { viewProfile, updateProfile, deleteUser } = require('../controllers/profileController');

// View profile route
router.get('/view/:userId', verifyToken, viewProfile);

// Update profile route
router.put('/update/:userId', verifyToken, authorize(['Admin','Manager']), updateProfile);

// Delete profile route
router.delete('/delete/:userId', verifyToken, authorize('Admin'), deleteUser);

// Export routes
module.exports = router;
