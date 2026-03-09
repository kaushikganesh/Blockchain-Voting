const express = require('express');
const router = express.Router();
const Election = require('../models/Election');
const Candidate = require('../models/Candidate');
const SmartContract = require('../services/smartContract');
const BlockchainValidator = require('../services/blockchain');
const FraudDetectionAI = require('../services/fraudAI');
const { protect } = require('../middleware/auth');

// @desc    Get all active elections
// @route   GET /api/elections
// @access  Public or Protected
router.get('/', protect, async (req, res) => {
  try {
    const elections = await Election.find({});
    res.json(elections);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get single election details with candidates
// @route   GET /api/elections/:id
// @access  Protected
router.get('/:id', protect, async (req, res) => {
  try {
    const election = await Election.findById(req.params.id);
    if (!election) {
      return res.status(404).json({ message: 'Election not found' });
    }

    const candidates = await Candidate.find({ electionId: req.params.id });
    
    // Check if user already voted?
    // Let's rely on smart contract for enforcement, but UI might want to know.
    
    res.json({ election, candidates });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Cast a vote
// @route   POST /api/elections/:id/vote
// @access  Protected
router.post('/:id/vote', protect, async (req, res) => {
  try {
    const { candidateId } = req.body;
    const voterId = req.user._id;
    const electionId = req.params.id;

    // Simulate pre-vote AI Fraud Check (Inline)
    // We pass the actual voter context
    const voterHash = require('../services/crypto').sha256(`${voterId}_${electionId}`);
    const existingVotes = await require('../models/VoteBlock').countDocuments({ voterHash, electionId });

    const fraudCheck = FraudDetectionAI.analyzeVoterBehavior(
      { recentAttempts: existingVotes, abnormalLocation: false }, 
      new Date(),
      voterId
    );
    
    if (existingVotes > 0) {
       // Log this to fraud AI (for prototype, handled by the analyze logic above returning suspicious)
       console.warn(`[FRAUD ALERT] Multiple voting attempt detected for voter ${voterId}`);
       // We can either return a 400 immediately here or let the smart contract reject it
       // Let's reject it here with an AI warning
       return res.status(403).json({ 
         message: 'Fraud Detection Triggered: Multiple voting attempts by the same user are strictly prohibited.',
         aiReport: fraudCheck
       });
    }

    const contractResult = await SmartContract.castVote(voterId, electionId, candidateId);
    
    res.status(201).json(contractResult);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc    Get election results
// @route   GET /api/elections/:id/results
// @access  Public
router.get('/:id/results', async (req, res) => {
  try {
    // Rely on smart contract to tally from blocks
    const tally = await SmartContract.tallyVotes(req.params.id);
    const isValid = await BlockchainValidator.isChainValid(); // Integrity check

    res.json({
      tally,
      chainIntegrityStatus: isValid ? 'Valid' : 'Compromised'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
