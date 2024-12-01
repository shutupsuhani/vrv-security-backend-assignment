const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/authMiddleware');
const { verifyRole } = require('../middleware/roleMiddleware');  // Admin role check
const { adminDashboard } = require('../controllers/adminController');

router.get('/admin-dashboard', verifyToken, verifyRole('Admin'), adminDashboard);

module.exports = router;
