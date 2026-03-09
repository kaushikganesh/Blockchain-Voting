const express = require('express');
const router = express.Router();
const BlockchainValidator = require('../services/blockchain');
const VoteBlock = require('../models/VoteBlock');

// @desc    Get all blocks (Blockchain Explorer)
// @route   GET /api/blockchain
// @access  Public
router.get('/', async (req, res) => {
  try {
    const chain = await VoteBlock.find({}).sort({ index: -1 }).select('-__v');
    res.json(chain);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Validate Blockchain Integrity
// @route   GET /api/blockchain/validate
// @access  Public
router.get('/validate', async (req, res) => {
  try {
    const isValid = await BlockchainValidator.isChainValid();
    res.json({ isValid, message: isValid ? 'Blockchain is valid and immutable' : 'Blockchain integrity compromised!' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
