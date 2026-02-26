/* eslint-disable @typescript-eslint/no-require-imports */
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// 📱 Send OTP
router.post('/send-otp', async (req, res) => {
  try {
    const { phone } = req.body;
    
    if (!phone || phone.length < 10) {
      return res.status(400).json({
        success: false,
        message: 'Valid phone number required'
      });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Find or create user
    let user = await User.findOne({ phone });
    
    if (!user) {
      user = new User({ phone });
    }

    // Save OTP
    user.otp = {
      code: otp,
      expiresAt: expiresAt
    };
    
    await user.save();

    // 🔥 MOCK: Console मा OTP देखाउने
    console.log('═══════════════════════════════════════');
    console.log(`📱 Phone: ${phone}`);
    console.log(`🔐 OTP: ${otp}`);
    console.log(`⏰ Expires: ${expiresAt.toLocaleTimeString()}`);
    console.log('═══════════════════════════════════════');

    res.json({
      success: true,
      message: 'OTP sent successfully',
      // 🔥 Development मा OTP पठाउने (Production मा हटाउने)
      devOtp: otp
    });

  } catch (error) {
    console.error('Send OTP Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send OTP'
    });
  }
});

// ✅ Verify OTP
router.post('/verify-otp', async (req, res) => {
  try {
    const { phone, otp } = req.body;

    const user = await User.findOne({ phone });

    if (!user || !user.otp || !user.otp.code) {
      return res.status(400).json({
        success: false,
        message: 'OTP not found. Please request new OTP.'
      });
    }

    // Check expiry
    if (new Date() > user.otp.expiresAt) {
      return res.status(400).json({
        success: false,
        message: 'OTP expired. Please request new OTP.'
      });
    }

    // Verify code
    if (user.otp.code !== otp) {
      return res.status(400).json({
        success: false,
        message: 'Invalid OTP'
      });
    }

    // Clear OTP
    user.otp = undefined;
    user.isVerified = true;
    await user.save();

    // Generate JWT
    const token = jwt.sign(
      { 
        userId: user._id, 
        phone: user.phone,
        role: user.role 
      },
      process.env.JWT_SECRET || 'stn-secret-key',
      { expiresIn: '30d' }
    );

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        phone: user.phone,
        name: user.name,
        email: user.email,
        role: user.role,
        isNewUser: !user.name // नयाँ user भए name हुँदैन
      }
    });

  } catch (error) {
    console.error('Verify OTP Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to verify OTP'
    });
  }
});

// 👤 Update Profile (First time)
router.put('/profile', async (req, res) => {
  try {
    const { userId, name, email, location } = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      {
        name,
        email,
        location: location ? {
          type: 'Point',
          coordinates: [location.lng, location.lat],
          address: location.address
        } : undefined
      },
      { new: true }
    );

    res.json({
      success: true,
      user: {
        id: user._id,
        phone: user.phone,
        name: user.name,
        email: user.email,
        location: user.location
      }
    });

  } catch (error) {
    console.error('Update Profile Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update profile'
    });
  }
});

// 🔍 Get Current User
router.get('/me', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'stn-secret-key');
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        phone: user.phone,
        name: user.name,
        email: user.email,
        role: user.role,
        location: user.location
      }
    });

  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
  }
});

module.exports = router;