const express = require('express');
const router = express.Router();
const { grantPermissions } = require('../controllers/grantPermission');
const { verifyToken } = require('../middlewares/authMiddleware');

// Grant additional permissions to a user
router.post('/grant-permissions',verifyToken , grantPermissions);

module.exports = router;
