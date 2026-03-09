const express = require('express');
const router = express.Router();
const Election = require('../models/Election');
const Candidate = require('../models/Candidate');
const User = require('../models/User');
const { protect, adminOnly } = require('../middleware/auth');
const FraudDetectionAI = require('../services/fraudAI');

// Protect all admin routes
router.use(protect);
router.use(adminOnly);

// @desc    Create an Election
// @route   POST /api/admin/elections
router.post('/elections', async (req, res) => {
  const { title, description, startDate, endDate } = req.body;
  try {
    const election = await Election.create({
      title,
      description,
      startDate,
      endDate,
      createdBy: req.user._id,
      status: 'active' // Auto active for prototype convenience
    });
    res.status(201).json(election);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc    Add a Candidate
// @route   POST /api/admin/elections/:id/candidates
router.post('/elections/:id/candidates', async (req, res) => {
  const { name, party, manifesto, imageUrl } = req.body;
  try {
    const candidate = await Candidate.create({
      name,
      party,
      manifesto,
      imageUrl,
      electionId: req.params.id
    });
    res.status(201).json(candidate);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc    Run AI Fraud Check on an Election
// @route   GET /api/admin/elections/:id/fraud-check
router.get('/elections/:id/fraud-check', async (req, res) => {
  try {
    const report = await FraudDetectionAI.evaluateElectionIntegrity(req.params.id);
    res.json(report);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Seed Initial Admin Data
// @route   POST /api/admin/seed
// Note: Usually seeds are CLI scripts, but placing here for easy prototype setup
router.post('/seed', async (req, res) => {
  try {
    const adminExists = await User.findOne({ role: 'admin' });
    if (!adminExists) {
      await User.create({
        voterId: 'ADMIN_001',
        email: 'admin@blockchainvoting.com',
        password: 'adminpassword',
        role: 'admin',
        isRegistered: true
      });
      res.json({ message: 'Admin user seeded successfully. Login with ADMIN_001 / adminpassword' });
    } else {
      res.status(400).json({ message: 'Admin already exists' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
