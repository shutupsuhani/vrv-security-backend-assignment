const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middlewares/authMiddleware');
const { viewProfile, updateProfile ,deleteUser } = require('../controllers/profileController');
const {authorize} = require('../middlewares/roleMiddleware')

// View profile
router.get('/view/:userId', verifyToken, viewProfile);

//update profile
router.put('/update/:userId', verifyToken, updateProfile);

//delete profile
router.delete('/delete/:userId', verifyToken, authorize('Admin'), deleteUser);

module.exports = router;
