const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'super_secret_jwt_key_prototype_only', {
    expiresIn: process.env.JWT_EXPIRES_IN || '1d',
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
router.post('/register', async (req, res) => {
  const { voterId, email, password } = req.body;

  try {
    const userExists = await User.findOne({ $or: [{ email }, { voterId }] });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({
      voterId,
      email,
      password,
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        voterId: user.voterId,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Auth user & get token (Login)
// @route   POST /api/auth/login
// @access  Public
router.post('/login', async (req, res) => {
  const { voterId, password } = req.body;

  try {
    const user = await User.findOne({ voterId });

    if (user && (await user.matchPassword(password))) {
      // Simulate MFA Challenge by returning an MFA required flag
      res.json({
        _id: user._id,
        voterId: user.voterId,
        mfaRequired: true,
        message: 'MFA Required for login. Please provide OTP / Biometric verification.',
      });
    } else {
      res.status(401).json({ message: 'Invalid voter ID or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Verify MFA & Complete Login
// @route   POST /api/auth/verify-mfa
// @access  Public
router.post('/verify-mfa', async (req, res) => {
  const { voterId, otpCode, biometricHash } = req.body;

  try {
    const user = await User.findOne({ voterId });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // In a prototype scenario, we will conditionally accept standard test codes or simulated hashes
    // E.g., OTP "123456" or a valid-looking biometricHash string.
    
    if (otpCode === '123456' || biometricHash) {
      // Successful simulation
      res.json({
        _id: user._id,
        voterId: user.voterId,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid MFA credentials' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
