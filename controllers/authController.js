const speakeasy = require('speakeasy');
const qrcode = require('qrcode');
const EndUser = require('../models/userModel');

// Enable 2FA for Admin user
const enableTwoFactor = async (req, res) => {
  const { userId } = req.user;  // Get logged-in user ID (should be Admin)

  try {
    // Find the user in the database
    const user = await EndUser.findById(userId);

    if (!user || user.role !== 'Admin') {
      return res.status(403).json({ message: 'Only admins can enable 2FA' });
    }

    // Generate a 2FA secret key
    const secret = speakeasy.generateSecret({ length: 20 });

    // Save the secret to the Admin's profile
    user.twoFactorSecret = secret.base32;
    user.isTwoFactorEnabled = true;
    await user.save();

    // Generate a QR code for the Admin to scan
    const qrCodeUrl = await qrcode.toDataURL(secret.otpauth_url);

    res.status(200).json({
      message: '2FA enabled successfully. Scan the QR code with Google Authenticator.',
      qrCodeUrl,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Verify 2FA code entered by Admin
const verifyTwoFactor = async (req, res) => {
  const { userId, code } = req.body;  // Code entered by the Admin

  try {
    const user = await EndUser.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if 2FA is enabled for the user
    if (!user.isTwoFactorEnabled) {
      return res.status(400).json({ message: '2FA is not enabled for this user' });
    }

    // Verify the code using the stored secret
    const verified = speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: 'base32',
      token: code,
    });

    if (verified) {
      res.status(200).json({ message: '2FA verification successful' });
    } else {
      res.status(400).json({ message: 'Invalid 2FA code' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { enableTwoFactor, verifyTwoFactor };
